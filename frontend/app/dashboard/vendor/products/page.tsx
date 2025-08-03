
"use client";
import StoreHeader from "@/components/vendor/vendors-dashboard/StoreHeader";
import ProductCard from "@/components/vendor/vendors-dashboard/products/ProductCard";
import AddProductForm from "@/components/vendor/vendors-dashboard/products/AddProductForm";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";


export default function VendorProductsPage() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<any[]>([]); // Start with no products
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendorId, setVendorId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendorProducts = async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      setLoading(true);
      try {
        if (!session?.user?.email) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }
        // Get vendor_id for this user
        const vendorRes = await fetch(
          `${API_URL}/api/vendors/by-user?email=${encodeURIComponent(
            session.user.email
          )}`
        );
        const vendorData = await vendorRes.json();
        if (!vendorData.vendor) {
          setError("Vendor not found");
          setLoading(false);
          return;
        }
        setVendorId(vendorData.vendor); // NEW: store vendorId
        // Fetch only this vendor's products
        const res = await fetch(
          `${API_URL}/api/products/?vendor_id=${vendorData.vendor}`
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Error loading products");
      } finally {
        setLoading(false);
      }
    };
    if (status === "authenticated") {
      fetchVendorProducts();
    }
  }, [session, status]);

  const handleAddProduct = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleProductSubmit = (product: any) => {
    setProducts((prev) => [...prev, product]);
    setShowForm(false);
  };

  // Tab state: 0 = Products, 1 = Favorites, 2 = Liked
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* Store Header at the top */}
      <div className="mb-8">
        <div className="bg-[#181818] rounded-2xl shadow-none border-none">
          <StoreHeader />
        </div>
      </div>
      {/* Tab bar like the provided design */}
      <div className="flex items-center justify-between border-b border-[#232136] px-4 md:px-8 mb-8">
      <div className="flex items-center gap-8">
        <button
          className={`flex items-center gap-2 py-4 font-semibold focus:outline-none 
            border-b-2 ${activeTab === 0 ? 'border-white text-white' : 'border-transparent text-[#888] hover:text-white'}`}
          onClick={() => setActiveTab(0)}
        >
          <span className="text-xl">▦</span> Products
        </button>
        <button
          className={`flex items-center gap-2 py-4 font-semibold focus:outline-none border-b-2 ${activeTab === 1 ? 'border-white text-white' : 'border-transparent text-[#888] hover:text-white'}`}
          onClick={() => setActiveTab(1)}
        >
          <span className="text-xl">☆</span> Favorites
        </button>
        <button
          className={`flex items-center gap-2 py-4 font-semibold focus:outline-none border-b-2 ${activeTab === 2 ? 'border-white text-white' : 'border-transparent text-[#888] hover:text-white'}`}
          onClick={() => setActiveTab(2)}
        >
          <span className="text-xl">♡</span> Liked
        </button>
      </div>
        <div className="flex items-center gap-2">
          <button
            className={`px-4 py-1 border-b font-semibold focus:outline-none transition-colors 
              duration-150 ${activeTab === 3 ? 'text-[#181818]' : 'text-white hover:bg-[#2a273f]'}`}
            onClick={() => setActiveTab(3)}
          >
            Reviews
          </button>
        </div>
      </div>
    
      {/* Add Product Modal */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="bg-[#181818] text-white rounded-2xl shadow-2xl border border-[#232136] w-full max-w-2xl p-0 relative animate-fadeIn flex flex-col items-center justify-center">
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#b39ddb] text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              ×
            </button>
            <div className="w-full flex justify-center items-center p-0">
              <AddProductForm
                onClose={handleCloseForm}
                onAdd={handleProductSubmit}
                vendor_id={vendorId || undefined}
              />
            </div>
          </div>
        </div>
      )}
      {/* Tab Content */}
      <div className="px-4 md:px-8 mt-4">
        {loading ? (
          <div className="text-[#b39ddb] text-center mt-16">Loading products...</div>
        ) : error ? (
          <div className="text-red-400 text-center mt-16">{error}</div>
        ) : (
          <>
            {activeTab === 0 && (
              products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-16">
                  {products.map((product, idx) => (
                    <ProductCard key={product.id || product.name + idx} {...product} />
                  ))}
                </div>
              ) : (
                <div className="text-[#b39ddb] text-center mt-16">No products yet. Click \"Add Product\" to get started.</div>
              )
            )}
            {activeTab === 1 && (
              <div className="text-[#b39ddb] text-center mt-16">No favorites yet.</div>
            )}
            {activeTab === 2 && (
              <div className="text-[#b39ddb] text-center mt-16">No liked products yet.</div>
            )}
            {activeTab === 3 && (
              <div className="text-[#b39ddb] text-center mt-16">No reviews yet.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
