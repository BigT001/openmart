"use client";

import React, { useEffect, useState, useCallback } from "react";
import ViewProduct from "../../vendor/vendors-dashboard/products/view-product";
import LikeButton from "../../ui/LikeButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';


function RecentProductsCard() {
  const [products, setProducts] = useState<any[]>([]);
  const [mainIdxMap, setMainIdxMap] = useState<{ [id: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [likeLoadingMap, setLikeLoadingMap] = useState<{ [id: string]: boolean }>({});
  const [likesMap, setLikesMap] = useState<{ [id: string]: number }>({});
  const [likedMap, setLikedMap] = useState<{ [id: string]: boolean }>({});

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
        // Set likes and liked state
        const likes: { [id: string]: number } = {};
        const liked: { [id: string]: boolean } = {};
        sorted.forEach((p: any, i: number) => {
          const key = p.id || i;
          likes[key] = p.likes ?? 0;
          liked[key] = !!p.likedByUser;
        });
        setLikesMap(likes);
        setLikedMap(liked);
      })
      .catch(err => setError(err.message || 'Error loading products'))
      .finally(() => setLoading(false));
  }, []);
  const handleLike = useCallback(async (productId: string) => {
    if (!productId || likeLoadingMap[productId]) return;
    setLikeLoadingMap(prev => ({ ...prev, [productId]: true }));
    const liked = likedMap[productId];
    try {
      const res = await fetch(`${API_URL}/api/products/${productId}/${liked ? 'unlike' : 'like'}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        setLikedMap(prev => ({ ...prev, [productId]: !liked }));
        setLikesMap(prev => ({
          ...prev,
          [productId]: liked ? Math.max(0, prev[productId] - 1) : prev[productId] + 1,
        }));
      }
    } finally {
      setLikeLoadingMap(prev => ({ ...prev, [productId]: false }));
    }
  }, [likeLoadingMap, likedMap]);

  // Fix misplaced .catch and .finally
  // The following should be inside the useEffect fetch chain, not after the handleLike function


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
                {/* Like button at top right */}
                <div className="absolute top-2 right-2 z-20">
                  <LikeButton
                    liked={!!likedMap[product.id]}
                    count={likesMap[product.id] ?? 0}
                    loading={!!likeLoadingMap[product.id]}
                    onClick={() => handleLike(product.id)}
                    buttonAriaLabel={likedMap[product.id] ? "Unlike" : "Like"}
                  />
                </div>
                {/* Price badge removed as requested */}
                {showImages.length > 0 ? (
                  <img
                    src={showImages[mainIdx]}
                    alt={product.name || 'Product'}
                    className="w-full h-auto max-h-[340px] object-cover rounded-t-2xl rounded-b-none border-b border-gray-100 dark:border-gray-800 cursor-pointer"
                    style={{ display: 'block', margin: 0, padding: 0 }}
                    onClick={() => setSelectedProductId(product.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${product.name}`}
                  />
                ) : (
                  <div
                    className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-300 rounded-t-2xl text-3xl cursor-pointer"
                    onClick={() => setSelectedProductId(product.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${product.name}`}
                  >🛒</div>
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
              <div
                className="flex items-center justify-between w-full px-3 py-2 mt-1 cursor-pointer group/card bg-[#232323]"
                onClick={() => setSelectedProductId(product.id)}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${product.name}`}
                style={{ userSelect: 'none', borderBottomLeftRadius: '1rem', borderBottomRightRadius: '1rem' }}
              >
                <div
                  className="text-xs font-semibold text-[#b39ddb] truncate max-w-[70%] group-hover/card:underline"
                  title={product.name}
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {product.name}
                </div>
                <div className="text-xs font-bold text-[#b39ddb] px-3 py-1 rounded bg-transparent">
                  ₦{typeof product.price !== 'undefined' ? parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--'}
                </div>
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
}

export default RecentProductsCard;
