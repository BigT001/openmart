"use client";
import ProductCard from "@/components/vendors-dashboard/products/ProductCard";
import AddProductForm from "@/components/vendors-dashboard/products/AddProductForm";
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

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#181024] dark:text-[#b39ddb] mb-2">
            My Products
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base">
            Manage your products here. Add, edit, or remove products as needed.
          </p>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
          <div className="bg-white dark:bg-[#181024] rounded-2xl shadow-2xl border border-[#b39ddb]/30 w-full max-w-2xl p-0 relative animate-fadeIn flex flex-col items-center justify-center">
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
                vendor_id={vendorId || undefined} // NEW: pass vendor_id
              />
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <div className="text-gray-400 text-center mt-16">
          Loading products...
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mt-16">{error}</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-16">
          {products.map((product, idx) => (
            <ProductCard key={product.id || product.name + idx} {...product} />
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-center mt-16">
          No products yet. Click "Add Product" to get started.
        </div>
      )}
    </div>
  );
}
