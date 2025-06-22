"use client";

import React, { useState } from "react";
import RecentProductsCard from "./RecentProductsCard";

const trendingProducts = [
  {
    name: "Sample Trending Product",
    price: 25000,
    seller: "Vendor B",
    source: "Instagram",
    link: "#",
  },
  // Add more trending products as needed
];

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<"recent" | "trending">("recent");

  const renderTrendingTable = (products: typeof trendingProducts) => (
    <div className="overflow-x-auto rounded-xl shadow-lg bg-white dark:bg-gray-900 mt-6">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead>
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Seller
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Source
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Link
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => (
            <tr
              key={idx}
              className={
                idx % 2 === 0
                  ? "bg-gray-50 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-900"
              }
            >
              <td className="px-6 py-4">{product.name}</td>
              <td className="px-6 py-4">₦{product.price.toLocaleString()}</td>
              <td className="px-6 py-4">{product.seller}</td>
              <td className="px-6 py-4">{product.source}</td>
              <td className="px-6 py-4">
                <a
                  href={product.link}
                  className="text-indigo-500 hover:underline"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Product Highlights
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore recent and trending products from our marketplace
          </p>
        </div>
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 mb-0 justify-start">
          <button
            className={`px-6 py-2 font-semibold text-sm rounded-t-lg focus:outline-none transition-colors duration-200 ${
              activeTab === "recent"
                ? "bg-white dark:bg-gray-900 text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-indigo-600"
            }`}
            onClick={() => setActiveTab("recent")}
          >
            Recent Products
          </button>
          <button
            className={`px-6 py-2 font-semibold text-sm rounded-t-lg focus:outline-none transition-colors duration-200 ${
              activeTab === "trending"
                ? "bg-white dark:bg-gray-900 text-pink-600 border-b-2 border-pink-600"
                : "text-gray-500 hover:text-pink-600"
            }`}
            onClick={() => setActiveTab("trending")}
          >
            Trending Products
          </button>
        </div>
        {activeTab === "recent" ? (
          <RecentProductsCard />
        ) : (
          renderTrendingTable(trendingProducts)
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;
