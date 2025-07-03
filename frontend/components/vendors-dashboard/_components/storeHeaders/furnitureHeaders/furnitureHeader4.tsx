import React from "react";

const FurnitureHeader4 = () => (
  <header className="bg-yellow-50 py-8 px-4 flex flex-col md:flex-row items-center justify-between border-b-2 border-yellow-300">
    <div className="flex items-center gap-2">
      <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="text-yellow-700"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><rect x="8" y="8" width="8" height="8" rx="2" fill="currentColor" /></svg>
      <h1 className="text-2xl font-bold text-yellow-700">Golden Home</h1>
    </div>
    <nav className="mt-4 md:mt-0 flex gap-6 text-yellow-600 font-semibold">
      <a href="#" className="hover:underline">Shop</a>
      <a href="#" className="hover:underline">Trends</a>
      <a href="#" className="hover:underline">Designers</a>
      <a href="#" className="hover:underline">Account</a>
    </nav>
  </header>
);

export default FurnitureHeader4;
