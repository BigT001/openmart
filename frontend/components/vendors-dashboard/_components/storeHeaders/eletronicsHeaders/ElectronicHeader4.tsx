import React from "react";

const ElectronicHeader4 = () => (
  <header className="bg-blue-50 py-8 px-4 flex flex-col md:flex-row items-center justify-between border-b-2 border-blue-300">
    <div className="flex items-center gap-2">
      <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="text-blue-700"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><rect x="8" y="8" width="8" height="8" rx="2" fill="currentColor" /></svg>
      <h1 className="text-2xl font-bold text-blue-700">BlueBox Electronics</h1>
    </div>
    <nav className="mt-4 md:mt-0 flex gap-6 text-blue-600 font-semibold">
      <a href="#" className="hover:underline">Explore</a>
      <a href="#" className="hover:underline">Deals</a>
      <a href="#" className="hover:underline">Stores</a>
      <a href="#" className="hover:underline">Account</a>
    </nav>
  </header>
);

export default ElectronicHeader4;
