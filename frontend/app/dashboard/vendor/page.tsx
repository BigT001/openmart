"use client";

import React from "react";

export default function VendorDashboard() {
  // Placeholder data for demonstration
  const metrics = [
    { label: "Total Sales", value: "₦1,250,000", trend: "+12%", icon: "💰" },
    { label: "Orders", value: "350", trend: "+8%", icon: "📦" },
    { label: "Products", value: "120", trend: "+3", icon: "🛒" },
    { label: "Buyers", value: "210", trend: "+15", icon: "👥" },
    { label: "Reviews", value: "4.7/5", trend: "↑", icon: "⭐" },
    { label: "Stock Alerts", value: "5", trend: "!", icon: "⚠️" },
    { label: "Payouts", value: "₦500,000", trend: "+5%", icon: "🏦" },
    { label: "Refunds", value: "₦12,000", trend: "-2%", icon: "🔄" },
    { label: "Commission Earned", value: "₦35,000", trend: "+10%", icon: "🎯" },
    { label: "Active Vendors", value: "32", trend: "+2", icon: "🧑‍💼" },
    { label: "Pending Orders", value: "7", trend: "!", icon: "⏳" },
    { label: "Messages", value: "18", trend: "+4", icon: "💬" },
    { label: "New Signups", value: "5", trend: "+1", icon: "📝" },
    { label: "Featured Products", value: "3", trend: "*", icon: "🌟" },
    { label: "Out of Stock", value: "2", trend: "-", icon: "🚫" },
  ];
  const recentOrders = [
    { id: "#12345", buyer: "John Doe", product: "Rice 50kg", amount: "₦32,000", status: "Delivered" },
    { id: "#12346", buyer: "Jane Smith", product: "Beans 25kg", amount: "₦18,000", status: "Pending" },
    { id: "#12347", buyer: "Mike Lee", product: "Palm Oil 10L", amount: "₦9,500", status: "Shipped" },
  ];
  const lowStock = [
    { product: "Palm Oil 10L", stock: 5 },
    { product: "Rice 50kg", stock: 2 },
  ];
  return (
    <main className="min-h-screen py-8 px-2 md:px-8 bg-gradient-to-br from-[#f8f6ff] to-[#e9e3f7]">
      <div className="max-w-7xl mx-auto">
        {/* Header & Special Highlight */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-[#23182b] mb-2 tracking-tight">Store Analytics Overview</h1>
            <p className="text-gray-500 text-lg">Monitor your business performance, orders, products, and buyers in one place.</p>
            <div className="mt-4 bg-gradient-to-r from-[#b39ddb] to-[#ede7f6] rounded-xl p-4 shadow flex items-center gap-4">
              <span className="text-2xl font-bold text-[#23182b]">🏆</span>
              <span className="text-lg text-[#23182b] font-semibold">Congratulations! Your store achieved top 5% sales growth this month.</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="bg-[#b39ddb] text-[#23182b] font-bold px-6 py-3 rounded-lg shadow hover:bg-[#a18bd1] transition">Add Product</button>
            <button className="bg-white border border-[#b39ddb] text-[#b39ddb] font-bold px-6 py-3 rounded-lg shadow hover:bg-[#ede7f6] transition">Settings</button>
          </div>
        </header>

        {/* Metrics Grid - now more than 9 cards, reserve-friendly layout */}
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mb-10">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-2xl bg-white border border-gray-200 shadow p-5 flex flex-col items-center justify-center hover:scale-[1.03] transition-transform duration-200">
              <span className="text-3xl mb-2">{m.icon}</span>
              <span className="text-xl font-bold text-[#23182b]">{m.value}</span>
              <span className="text-gray-500 text-xs">{m.label}</span>
              <span className="text-green-500 text-xs mt-1">{m.trend}</span>
            </div>
          ))}
        </section>

        {/* Actionable Cards Row */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="rounded-xl bg-[#b39ddb] text-[#23182b] p-6 flex flex-col items-center justify-center shadow hover:bg-[#a18bd1] transition cursor-pointer">
            <span className="text-2xl mb-2">➕</span>
            <span className="font-bold">Add New Product</span>
            <span className="text-xs text-[#23182b] mt-1">Expand your catalog</span>
          </div>
          <div className="rounded-xl bg-[#ede7f6] text-[#23182b] p-6 flex flex-col items-center justify-center shadow hover:bg-[#d1c4e9] transition cursor-pointer">
            <span className="text-2xl mb-2">📈</span>
            <span className="font-bold">View Sales Trends</span>
            <span className="text-xs text-[#23182b] mt-1">Analyze performance</span>
          </div>
          <div className="rounded-xl bg-[#fff] text-[#23182b] p-6 flex flex-col items-center justify-center shadow hover:bg-[#f3e5f5] transition cursor-pointer border border-[#b39ddb]">
            <span className="text-2xl mb-2">👥</span>
            <span className="font-bold">Manage Buyers</span>
            <span className="text-xs text-[#23182b] mt-1">Engage your audience</span>
          </div>
          <div className="rounded-xl bg-[#fff] text-[#23182b] p-6 flex flex-col items-center justify-center shadow hover:bg-[#f3e5f5] transition cursor-pointer border border-[#b39ddb]">
            <span className="text-2xl mb-2">⚙️</span>
            <span className="font-bold">Business Settings</span>
            <span className="text-xs text-[#23182b] mt-1">Configure your store</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders Table */}
          <section className="col-span-2 rounded-2xl bg-white border border-gray-200 shadow p-8">
            <h2 className="text-xl font-bold text-[#23182b] mb-4">Recent Orders</h2>
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-gray-400">Order ID</th>
                  <th className="py-2 px-4 text-gray-400">Buyer</th>
                  <th className="py-2 px-4 text-gray-400">Product</th>
                  <th className="py-2 px-4 text-gray-400">Amount</th>
                  <th className="py-2 px-4 text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-gray-100">
                    <td className="py-2 px-4 font-mono text-[#23182b]">{o.id}</td>
                    <td className="py-2 px-4 text-gray-700">{o.buyer}</td>
                    <td className="py-2 px-4 text-gray-700">{o.product}</td>
                    <td className="py-2 px-4 text-[#b39ddb] font-bold">{o.amount}</td>
                    <td className="py-2 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${o.status === "Delivered" ? "bg-green-100 text-green-700" : o.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Stock Alerts & Insights */}
          <aside className="rounded-2xl bg-white border border-gray-200 shadow p-8 flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold text-[#23182b] mb-2">Stock Alerts</h2>
              {lowStock.length === 0 ? (
                <p className="text-gray-500">All products in stock.</p>
              ) : (
                <ul className="text-sm text-red-600 font-semibold space-y-2">
                  {lowStock.map((item) => (
                    <li key={item.product}>{item.product}: Only {item.stock} left!</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#23182b] mb-2">Business Insights</h2>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>Sales up 12% this month</li>
                <li>15 new buyers joined</li>
                <li>3 new product reviews</li>
                <li>2 products out of stock</li>
                <li>Store featured in weekly newsletter</li>
                <li>Commission payout increased</li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#23182b] mb-2">Help & Support</h2>
              <p className="text-gray-500">Need help? <a href="mailto:support@openmart.com" className="text-[#b39ddb] underline">Contact support</a> or check the <a href="/docs" className="text-[#b39ddb] underline">documentation</a>.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
