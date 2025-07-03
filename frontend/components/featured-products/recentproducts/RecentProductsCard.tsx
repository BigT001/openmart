"use client";

import React, { useEffect, useState } from "react";
import ViewProduct from "../../vendors-dashboard/products/view-product"; // Adjust the import based on your file structure

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const RecentProductsCard: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [mainIdxMap, setMainIdxMap] = useState<{ [id: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/api/products/`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        // Sort by created_at descending if available, without mutating original array
        const sorted = Array.isArray(data)
          ? data.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          : [];
        setProducts(sorted);
        // Only update mainIdxMap if product IDs have changed
        setMainIdxMap(prev => {
          const newMap: { [id: string]: number } = {};
          sorted.forEach((p: any, i: number) => {
            const key = p.id || i;
            newMap[key] = prev[key] ?? 0;
          });
          return newMap;
        });
      })
      .catch(err => setError(err.message || 'Error loading products'))
      .finally(() => setLoading(false));
  }, []);

  const handleThumbClick = (key: string, idx: number) => {
    setMainIdxMap(prev => ({ ...prev, [key]: idx }));
  };

  return (
    <div className="py-8">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Product Images</h3>
      {loading && <div className="text-center text-gray-400 py-8">Loading...</div>}
      {error && <div className="text-center text-red-500 py-8">{error}</div>}
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 gap-4 space-y-4 [column-fill:_balance]">
        {!loading && !error && products.map((product, idx) => {
          const images = Array.isArray(product.images) ? product.images : [];
          const key = product.id || idx;
          const showImages = images.map((img: string) => img.startsWith('/static/') ? `${API_URL}${img}` : img);
          const mainIdx = mainIdxMap[key] || 0;
          return (
            <div key={key} className="break-inside-avoid bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col p-0 relative group">
              {/* Main Image with overlaid thumbnails at the bottom */}
              <div className="relative w-full">
                {/* Price badge at top left of main image */}
                {typeof product.price !== 'undefined' && (
                  <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-3 py-1 rounded-full shadow z-20">
                    ₦{parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                )}
                {showImages.length > 0 ? (
                  <img
                    src={showImages[mainIdx]}
                    alt={product.name || 'Product'}
                    className="w-full h-auto max-h-[340px] object-cover rounded-t-2xl rounded-b-none border-b border-gray-100 dark:border-gray-800"
                    style={{ display: 'block', margin: 0, padding: 0 }}
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-300 rounded-t-2xl text-3xl">🛒</div>
                )}
                {/* Thumbnails overlayed at the bottom of the main image */}
                {showImages.length > 1 && (
                  <div className="absolute left-0 right-0 bottom-2 flex gap-1 justify-center w-full px-2 z-10">
                    {showImages.map((img: string, i: number) => (
                      <button
                        key={img + i}
                        onClick={() => handleThumbClick(key, i)}
                        className={`w-7 h-7 rounded border ${mainIdx === i ? "" : "border-gray-200"} overflow-hidden focus:outline-none transition-transform duration-200 hover:scale-110 bg-white shadow`}
                        tabIndex={0}
                        aria-label={`Show image ${i + 1}`}
                        style={{ marginBottom: 0 }}
                      >
                        <img src={img} alt={product.name + " thumbnail " + (i + 1)} className="object-cover w-full h-full" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Name and View button on same row, name is always truncated */}
              <div className="flex items-center justify-between w-full px-3 py-2 mt-1">
                <div
                  className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[70%]"
                  title={product.name}
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {product.name}
                </div>
                <button
                  className="px-3 py-1 rounded bg-black text-white text-xs font-bold 
                  shadow hover:bg-gray-700 transition-colors duration-200 focus:outline-none 
                  focus:ring-2 focus:ring-gray-600"
                  tabIndex={0}
                  onClick={() => setSelectedProductId(product.id)}
                >
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Modal for viewing product details */}
      {selectedProductId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-lg p-4 overflow-y-auto"
          style={{ WebkitBackdropFilter: 'blur(16px)', backdropFilter: 'blur(16px)' }}
          onClick={() => setSelectedProductId(null)}
        >
          <div
            className="relative max-w-4xl w-full mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 flex flex-col md:flex-row overflow-hidden"
            style={{ maxHeight: '95vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* X close button, always clickable */}
            <button
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow border border-gray-200 focus:outline-none cursor-pointer flex items-center justify-center"
              onClick={() => setSelectedProductId(null)}
              aria-label="Close"
              type="button"
              tabIndex={0}
            >
              <svg className="w-6 h-6 text-gray-700" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm2.47-10.53a.75.75 0 10-1.06-1.06L10 8.94 8.59 7.41a.75.75 0 10-1.06 1.06L8.94 10l-1.41 1.41a.75.75 0 101.06 1.06L10 11.06l1.41 1.41a.75.75 0 101.06-1.06L11.06 10l1.41-1.41z" clipRule="evenodd" /></svg>
            </button>
            <div className="p-0 w-full">
              <ViewProduct productId={selectedProductId} onClose={() => setSelectedProductId(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentProductsCard;
