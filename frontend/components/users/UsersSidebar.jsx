"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiGrid, FiCompass, FiUsers, FiShoppingBag, FiInbox } from "react-icons/fi";

const sidebarItems = [
  { label: "For You", href: "/featured-products", icon: <FiGrid /> },
  { label: "Explore", href: "/dashboard/users/explore", icon: <FiCompass /> },
  { label: "Following", href: "/dashboard/users/following", icon: <FiUsers /> },
  { label: "Orders", href: "/dashboard/users/orders", icon: <FiShoppingBag /> },
  { label: "Inbox", href: "/dashboard/users/inbox", icon: <FiInbox /> },
];

export default function UsersSidebar({ active }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative h-screen bg-white border-r-4 border-[#009688] flex flex-col transition-all duration-300 ${collapsed ? "w-20 p-2" : "w-64 p-6"}`}
      style={{ minHeight: "100vh" }}
    >
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="focus:outline-none">
          <span className={`text-2xl font-extrabold tracking-tight select-none transition-all duration-300 ${collapsed ? "text-center w-full text-[#004d40]" : "text-[#004d40]"}`}>
            {collapsed ? "OM" : "OpenMart"}
          </span>
        </Link>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="ml-2 p-2 rounded hover:bg-[#009688]/20 text-[#004d40] focus:outline-none transition"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FiChevronRight size={22} /> : <FiChevronLeft size={22} />}
        </button>
      </div>
      <nav className="flex-1 space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors duration-150 group ${active === item.href
              ? "bg-[#009688]/10 text-[#009688]"
              : "text-[#004d40] hover:bg-[#009688]/10 hover:text-[#009688]"}
              ${collapsed ? "justify-center px-2" : ""}`}
            title={item.label}
          >
            <span className="text-xl text-[#009688]">{item.icon}</span>
            {!collapsed && <span className="transition-all duration-200 text-[#004d40] group-hover:text-[#009688]">{item.label}</span>}
          </Link>
        ))}
      </nav>
      
      <button
        onClick={() => signOut()}
        className={`w-full mt-4 mb-2 px-4 py-2 rounded-lg font-semibold text-sm bg-[#009688]/10 text-[#004d40] hover:bg-[#009688] hover:text-white transition-colors duration-150 ${collapsed ? "px-2" : ""}`}
      >
        Log out
      </button>
    </aside>
  );
}
