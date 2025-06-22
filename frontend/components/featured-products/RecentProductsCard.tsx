"use client";

import React, { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const RecentProductsCard: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [mainIdxMap, setMainIdxMap] = useState<{ [id: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
              {/* Main Image - flush with card border, no gap, rounded top corners only */}
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
              {/* Thumbnails */}
              {showImages.length > 1 && (
                <div className="flex gap-1 justify-center mb-2 w-full px-2 pt-2">
                  {showImages.map((img: string, i: number) => (
                    <button
                      key={img + i}
                      onClick={() => handleThumbClick(key, i)}
                      className={`w-7 h-7 rounded border ${mainIdx === i ? "border-indigo-600 ring-2 ring-indigo-600" : "border-gray-200"} overflow-hidden focus:outline-none transition-transform duration-200 hover:scale-110 bg-white`}
                      tabIndex={0}
                      aria-label={`Show image ${i + 1}`}
                    >
                      <img src={img} alt={product.name + " thumbnail " + (i + 1)} className="object-cover w-full h-full" />
                    </button>
                  ))}
                </div>
              )}
              {/* Name and View button on same row, name is always truncated */}
              <div className="flex items-center justify-between w-full px-3 py-2 mt-1">
                <div
                  className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[70%]"
                  title={product.name}
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {product.name}
                </div>
                <a
                  href={`/products/${product.id}`}
                  className="px-3 py-1 rounded bg-indigo-600 text-white text-xs font-bold shadow hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  tabIndex={0}
                >
                  View
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentProductsCard;
