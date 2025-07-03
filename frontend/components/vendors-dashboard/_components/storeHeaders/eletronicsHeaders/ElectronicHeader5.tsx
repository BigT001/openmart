import React from "react";

const ElectronicHeader5 = () => (
  <header className="bg-gradient-to-l from-blue-700 via-blue-400 to-blue-200 text-white py-10 px-6 flex flex-col md:flex-row items-center justify-between shadow-md">
    <div className="flex items-center gap-3">
      <span className="text-3xl font-extrabold tracking-tight">E-Shop 5</span>
      <span className="bg-white text-blue-700 rounded px-3 py-1 ml-2 font-bold text-lg">Premium</span>
    </div>
    <nav className="mt-6 md:mt-0 flex gap-8 text-lg font-semibold">
      <a href="#" className="hover:underline">Home</a>
      <a href="#" className="hover:underline">Categories</a>
      <a href="#" className="hover:underline">Flash Sale</a>
      <a href="#" className="hover:underline">Support</a>
    </nav>
  </header>
);

export default ElectronicHeader5;
