import { useSession } from "next-auth/react";
import React from "react";

export default function DashboardHeader({ onAddProduct }: { onAddProduct?: () => void }) {
  const { data: session } = useSession();
  return (
    <header className="w-full flex items-center justify-between py-4 px-8 border-b border-transparent bg-white">
      <span className="text-xl font-bold text-black">
        Welcome, {session?.user?.name || session?.user?.email || "Vendor"}!
      </span>
      {onAddProduct && (
        <button
          onClick={onAddProduct}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-transparent text-[#7c4dff] font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-[#7c4dff]/30 text-sm transition-all duration-200 group"
          style={{ minWidth: 0, boxShadow: 'none', border: 'none' }}
        >
          <span className="text-lg leading-none font-bold transition-transform duration-300 group-hover:rotate-90 group-active:scale-125 group-hover:scale-110">
            +
          </span>
          <span className="transition-colors duration-200 group-hover:text-[#5f32b3]">Add Product</span>
        </button>
      )}
    </header>
  );
}
