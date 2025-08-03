"use client";

import { useSession, signOut } from "next-auth/react";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function DashboardHeader({ onAddProduct }: { onAddProduct?: () => void }) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="w-full flex items-center justify-between border-b border-transparent px-4">
      <div className="flex items-center gap-3">
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
      </div>
    </header>
  );
}
