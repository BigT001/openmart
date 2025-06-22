import React, { useRef, useState, useEffect } from "react";
import { compressAndUploadImage } from "@/lib/imageUpload";

const categoryOptions = [
  "Food & Groceries",
  "Fashion",
  "Electronics",
  "Home & Living",
  "Beauty",
  "Books",
  "Toys",
  "Other",
];

const colorOptions = [
  "Red", "Blue", "Green", "Black", "White", "Yellow", "Purple", "Brown", "Gray", "Other"
];

interface AddProductFormProps {
  onClose: () => void;
  onAdd: (product: any) => void;
  vendor_id?: string; // NEW: vendor_id prop
}

export default function AddProductForm({ onClose, onAdd, vendor_id }: AddProductFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [catOpen, setCatOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Fix: useRef<HTMLButtonElement>(null!) to avoid type error
  const catBtnRef = useRef<HTMLButtonElement>(null!);
  const colorBtnRef = useRef<HTMLButtonElement>(null!);
  const [catDropUp, setCatDropUp] = useState(false);
  const [colorDropUp, setColorDropUp] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (images.length + files.length > 6) {
      alert("You can upload a maximum of 6 images.");
      return;
    }
    setImages((prev) => [...prev, ...files].slice(0, 6));
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setCatOpen(false);
  };

  const handleColorToggle = (color: string) => {
    setColors((prev) => prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]);
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !price || !category || !stock) return;
    setLoading(true);
    try {
      // Compress and upload images in parallel
      const imageUrls = await Promise.all(
        images.map((img) => compressAndUploadImage(img))
      );
      // Prepare product data
      const productData = {
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        description,
        category,
        colors,
        images: imageUrls,
        vendor_id, // NEW: include vendor_id in payload
      };
      // Send product data to backend
      const res = await fetch(`${API_URL}/api/products/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error("Product creation failed");
      const saved = await res.json();
      onAdd(saved);
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Utility to check if dropdown should open up
  const checkDropDirection = (btnRef: React.RefObject<HTMLButtonElement>, setDropUp: (v: boolean) => void) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    // If not enough space below (less than 220px), open up
    setDropUp(spaceBelow < 220 && spaceAbove > spaceBelow);
  };

  useEffect(() => {
    if (catOpen) checkDropDirection(catBtnRef, setCatDropUp);
  }, [catOpen]);
  useEffect(() => {
    if (colorOpen) checkDropDirection(colorBtnRef, setColorDropUp);
  }, [colorOpen]);

  // Modal animation: slide-in from bottom, faint white/ash/gray background, minimal purple
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#7c4dff]/20 p-6 animate-slideIn pointer-events-auto flex flex-col items-center" style={{margin: 'auto'}}>
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50 rounded-2xl">
            <svg className="animate-spin h-8 w-8 text-[#7c4dff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {/* Image Upload at Top */}
          <div>
            <label className="block font-semibold mb-1 text-[#181024]">Product Images <span className="text-xs text-gray-400">(max 6)</span></label>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              disabled={loading}
            />
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-12 h-12 min-w-12 min-h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                  <img
                    src={URL.createObjectURL(img)}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-white text-[#7c4dff] rounded-full p-1 text-xs hover:bg-gray-200"
                    title="Remove"
                    disabled={loading}
                  >
                    ×
                  </button>
                </div>
              ))}
              {images.length < 6 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-12 h-12 min-w-12 min-h-12 flex items-center justify-center border border-dashed border-[#7c4dff]/30 rounded-lg text-[#7c4dff] bg-white hover:bg-gray-100 text-xl"
                  title="Add Image"
                  disabled={loading}
                >
                  +
                </button>
              )}
            </div>
          </div>
          {/* Product Name */}
          <div>
            <label className="block font-semibold mb-1 text-[#181024]">Product Name</label>
            <input
              className="w-full px-3 py-2 border border-gray-200 focus:border-[#7c4dff]/40 rounded-lg bg-white text-[#181024] placeholder-gray-400 text-sm"
              placeholder="e.g. Arewa Rice"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {/* Price and Stock */}
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block font-semibold mb-1 text-[#181024]">Price (₦)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-200 focus:border-[#7c4dff]/40 rounded-lg bg-white text-[#181024] placeholder-gray-400 text-sm"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min={0}
                disabled={loading}
              />
            </div>
            <div className="w-1/2">
              <label className="block font-semibold mb-1 text-[#181024]">Stock</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-200 focus:border-[#7c4dff]/40 rounded-lg bg-white text-[#181024] placeholder-gray-400 text-sm"
                placeholder="e.g. 10"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                min={0}
                disabled={loading}
              />
            </div>
          </div>
          {/* Description */}
          <div>
            <label className="block font-semibold mb-1 text-[#181024]">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-200 focus:border-[#7c4dff]/40 rounded-lg bg-white text-[#181024] placeholder-gray-400 text-sm"
              placeholder="Describe your product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              disabled={loading}
            />
          </div>
          {/* Category Dropdown */}
          <div>
            <label className="block font-semibold mb-1 text-[#181024]">Category <span className="text-xs text-gray-400">(Select one)</span></label>
            <div className="relative mt-1">
              <button
                type="button"
                ref={catBtnRef}
                onClick={() => setCatOpen((v) => !v)}
                className="w-full flex justify-between items-center px-3 py-2 border border-gray-200 rounded-lg bg-white text-[#181024] font-semibold focus:outline-none transition-all text-sm"
                disabled={loading}
              >
                {category ? category : "Select category"}
                <span className={`ml-2 transition-transform ${catOpen ? "rotate-180" : "rotate-0"}`}>▼</span>
              </button>
              <div
                className={`absolute left-0 right-0 ${catDropUp ? 'bottom-12 mb-2' : 'mt-2'} bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden transition-all duration-300 origin-top ${catOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}`}
                style={{ transformOrigin: catDropUp ? "bottom" : "top" }}
              >
                {categoryOptions.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors flex items-center ${category === cat ? "bg-[#7c4dff]/10 text-[#7c4dff] font-bold" : "text-[#181024]"}`}
                  >
                    <input
                      type="radio"
                      checked={category === cat}
                      readOnly
                      className="mr-2 accent-[#7c4dff]"
                    />
                    {cat}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Colors Dropdown */}
          <div>
            <label className="block font-semibold mb-1 text-[#181024]">Colors <span className="text-xs text-gray-400">(If applicable)</span></label>
            <div className="relative mt-1">
              <button
                type="button"
                ref={colorBtnRef}
                onClick={() => setColorOpen((v) => !v)}
                className="w-full flex justify-between items-center px-3 py-2 border border-gray-200 rounded-lg bg-white text-[#181024] font-semibold focus:outline-none transition-all text-sm"
                disabled={loading}
              >
                {colors.length > 0 ? colors.join(", ") : "Select colors"}
                <span className={`ml-2 transition-transform ${colorOpen ? "rotate-180" : "rotate-0"}`}>▼</span>
              </button>
              <div
                className={`absolute left-0 right-0 ${colorDropUp ? 'bottom-12 mb-2' : 'mt-2'} bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden transition-all duration-300 origin-top ${colorOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}`}
                style={{ transformOrigin: colorDropUp ? "bottom" : "top" }}
              >
                {colorOptions.map((color) => (
                  <div
                    key={color}
                    onClick={() => handleColorToggle(color)}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors flex items-center ${colors.includes(color) ? "bg-[#7c4dff]/10 text-[#7c4dff] font-bold" : "text-[#181024]"}`}
                  >
                    <input
                      type="checkbox"
                      checked={colors.includes(color)}
                      readOnly
                      className="mr-2 accent-[#7c4dff]"
                    />
                    {color}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-2 mt-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-100 text-[#181024] font-bold rounded-lg border border-gray-200 hover:bg-gray-200 transition text-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#7c4dff] text-white font-bold rounded-lg shadow hover:bg-[#5f32b3] border border-[#7c4dff]/40 focus:outline-none focus:ring-2 focus:ring-[#7c4dff]/30 transition disabled:opacity-60 text-sm"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
        <style jsx global>{`
          @keyframes slideIn {
            0% { transform: translateY(100%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-slideIn {
            animation: slideIn 0.5s cubic-bezier(0.4,0,0.2,1);
          }
        `}</style>
      </div>
    </div>
  );
}
