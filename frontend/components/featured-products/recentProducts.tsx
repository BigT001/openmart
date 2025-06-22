"use client";

import React, { useEffect, useState } from "react";

const RecentProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        // Sort by created_at descending if available
        const sorted = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          : [];
        setProducts(sorted);
      })
      .catch(err => setError(err.message || 'Error loading products'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg bg-white dark:bg-gray-900 mt-6">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead>
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
          )}
          {error && (
            <tr><td colSpan={5} className="text-center py-8 text-red-500">{error}</td></tr>
          )}
          {!loading && !error && products.length === 0 && (
            <tr><td colSpan={5} className="text-center py-8 text-gray-400">No products found.</td></tr>
          )}
          {!loading && !error && products.map((product, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900"}>
              <td className="px-6 py-4">{product.name || product.title}</td>
              <td className="px-6 py-4">₦{(product.price || 0).toLocaleString()}</td>
              <td className="px-6 py-4">{product.seller || product.vendor_id || '-'}</td>
              <td className="px-6 py-4">{product.source || 'OpenMart'}</td>
              <td className="px-6 py-4">
                {product.id || product.link ? (
                  <a href={product.link || `#`} className="text-indigo-500 hover:underline">View</a>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentProducts;
