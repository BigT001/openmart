import React from "react";

const FashionHeader5 = () => (
  <header className="bg-gradient-to-l from-pink-700 via-pink-400 to-pink-200 text-white py-10 px-6 flex flex-col md:flex-row items-center justify-between shadow-md">
    <div className="flex items-center gap-3">
      <span className="text-3xl font-extrabold tracking-tight">Fifth Avenue</span>
      <span className="bg-white text-pink-700 rounded px-3 py-1 ml-2 font-bold text-lg">Premium</span>
    </div>
    <nav className="mt-6 md:mt-0 flex gap-8 text-lg font-semibold">
      <a href="#" className="hover:underline">Home</a>
      <a href="#" className="hover:underline">Women</a>
      <a href="#" className="hover:underline">Men</a>
      <a href="#" className="hover:underline">Sale</a>
    </nav>
  </header>
);

export default FashionHeader5;
