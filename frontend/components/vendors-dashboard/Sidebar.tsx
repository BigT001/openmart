import Link from "next/link";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiGrid, FiBox, FiShoppingBag, FiStar, FiSettings } from "react-icons/fi";

const sidebarItems = [
  { label: "Overview", href: "/dashboard/vendor", icon: <FiGrid /> },
  { label: "Products", href: "/dashboard/vendor/products", icon: <FiBox /> },
  { label: "Orders", href: "/dashboard/vendor/orders", icon: <FiShoppingBag /> },
  { label: "Reviews", href: "/dashboard/vendor/reviews", icon: <FiStar /> },
  { label: "Settings", href: "/dashboard/vendor/settings", icon: <FiSettings /> },
];

export default function Sidebar({ active }: { active?: string }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative h-screen bg-[#181024] border-r-2 border-[#2d0036] flex flex-col transition-all duration-300 ${collapsed ? "w-20 p-2" : "w-64 p-6"}`}
      style={{ minHeight: "100vh" }}
    >
      <div className="flex items-center justify-between mb-8">
        <span className={`text-2xl font-extrabold tracking-tight select-none transition-all duration-300 ${collapsed ? "text-center w-full text-[#b39ddb]" : "text-[#b39ddb]"}`}>
          {collapsed ? "OM" : "OpenMart"}
        </span>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="ml-2 p-2 rounded hover:bg-[#23182b] text-[#b39ddb] focus:outline-none transition"
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
              ? "bg-[#b39ddb]/20 text-[#b39ddb] dark:bg-[#2d0036] dark:text-[#b39ddb]"
              : "text-gray-200 hover:bg-[#b39ddb]/10 dark:hover:bg-[#2d0036]"}
              ${collapsed ? "justify-center px-2" : ""}`}
            title={item.label}
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span className="transition-all duration-200">{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div className={`mt-auto pt-8 text-xs text-[#b39ddb] transition-all duration-300 ${collapsed ? "text-center" : ""}`}>
        {collapsed ? "Vendor" : "Vendor Panel"}
      </div>
    </aside>
  );
}
