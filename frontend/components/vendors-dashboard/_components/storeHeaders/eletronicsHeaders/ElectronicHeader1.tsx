import React from "react";

const ElectronicHeader1 = () => (
  <header className="bg-gradient-to-r from-blue-900 to-blue-500 text-white py-8 px-4 flex flex-col items-center shadow-lg">
    <h1 className="text-4xl font-extrabold tracking-tight mb-2">ElectroMart</h1>
    <p className="text-lg font-medium">Your One-Stop Shop for the Latest Electronics</p>
    <nav className="mt-4 flex gap-6 text-base font-semibold">
      <a href="#" className="hover:underline">Home</a>
      <a href="#" className="hover:underline">Products</a>
      <a href="#" className="hover:underline">Deals</a>
      <a href="#" className="hover:underline">Support</a>
    </nav>
  </header>
);

export default ElectronicHeader1;
