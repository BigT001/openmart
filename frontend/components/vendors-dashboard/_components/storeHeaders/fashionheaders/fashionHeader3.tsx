import React from "react";

const FashionHeader3 = () => (
  <header className="bg-gradient-to-br from-purple-700 via-pink-400 to-pink-200 text-white py-10 px-6 flex flex-col md:flex-row items-center justify-between shadow-xl">
    <div>
      <h1 className="text-4xl font-extrabold mb-1 tracking-wide">Chic Boutique</h1>
      <p className="text-lg font-light">Where Dreams Meet Couture</p>
    </div>
    <nav className="mt-6 md:mt-0 flex gap-8 text-lg font-medium">
      <a href="#" className="hover:underline">New Arrivals</a>
      <a href="#" className="hover:underline">Collections</a>
      <a href="#" className="hover:underline">Lookbook</a>
      <a href="#" className="hover:underline">Contact</a>
    </nav>
  </header>
);

export default FashionHeader3;
