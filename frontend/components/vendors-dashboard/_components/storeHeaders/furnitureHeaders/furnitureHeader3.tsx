import React from "react";

const FurnitureHeader3 = () => (
  <header className="bg-gradient-to-br from-yellow-900 via-yellow-500 to-yellow-200 text-white py-10 px-6 flex flex-col md:flex-row items-center justify-between shadow-xl">
    <div>
      <h1 className="text-4xl font-extrabold mb-1 tracking-wide">FurniStyle</h1>
      <p className="text-lg font-light">Elegant Designs for Modern Homes</p>
    </div>
    <nav className="mt-6 md:mt-0 flex gap-8 text-lg font-medium">
      <a href="#" className="hover:underline">Collections</a>
      <a href="#" className="hover:underline">New Arrivals</a>
      <a href="#" className="hover:underline">Best Sellers</a>
      <a href="#" className="hover:underline">Contact</a>
    </nav>
  </header>
);

export default FurnitureHeader3;
