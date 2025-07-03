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
    <header className="w-full flex items-center justify-between py-4 px-8 border-b border-transparent bg-white">
      <span className="text-xl font-bold text-black">
        Welcome, {session?.user?.name || session?.user?.email || "Vendor"}!
      </span>
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
        {/* Avatar Dropdown */}
        {session && (
          <div className="relative" ref={menuRef}>
            <button
              className="focus:outline-none"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="User menu"
            >
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-9 h-9 rounded-full border border-gray-300 shadow-sm object-cover hover:ring-2 hover:ring-[#7c4dff] transition"
                  title={session.user.name ?? session.user.email ?? undefined}
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#7c4dff] flex items-center justify-center text-white font-bold text-lg border border-gray-300 hover:ring-2 hover:ring-[#7c4dff] transition" title={session.user?.name ?? session.user?.email ?? undefined}>
                  {session.user?.name ? session.user.name.charAt(0).toUpperCase() : (session.user?.email ? session.user.email.charAt(0).toUpperCase() : '?')}
                </div>
              )}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
                <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-[#f3f0fa] transition-colors rounded-t-lg">
                  Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-[#f3f0fa] transition-colors">
                  Settings
                </Link>
                <div className="border-t border-gray-200 my-1" />
                <button
                  onClick={() => { setMenuOpen(false); signOut(); }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors rounded-b-lg font-semibold"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
