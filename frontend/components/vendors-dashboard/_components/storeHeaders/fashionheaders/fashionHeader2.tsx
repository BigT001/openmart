import React from "react";

const FashionHeader2 = () => (
  <header className="bg-white border-b-4 border-pink-400 py-8 px-4 flex flex-col md:flex-row items-center justify-between shadow-sm">
    <div className="flex items-center gap-3">
      <span className="bg-pink-400 text-white rounded-full px-4 py-2 text-2xl font-bold">F2</span>
      <h1 className="text-3xl font-bold text-pink-700">Urban Vogue</h1>
    </div>
    <nav className="mt-4 md:mt-0 flex gap-8 text-pink-600 font-semibold">
      <a href="#" className="hover:text-pink-800">Women</a>
      <a href="#" className="hover:text-pink-800">Men</a>
      <a href="#" className="hover:text-pink-800">Accessories</a>
      <a href="#" className="hover:text-pink-800">Sale</a>
    </nav>
  </header>
);

export default FashionHeader2;
