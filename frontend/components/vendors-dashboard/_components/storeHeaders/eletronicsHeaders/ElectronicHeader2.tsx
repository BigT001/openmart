import React from "react";

const ElectronicHeader2 = () => (
  <header className="bg-white border-b-4 border-blue-600 py-6 px-4 flex flex-col md:flex-row items-center justify-between shadow-sm">
    <div className="flex items-center gap-3">
      <span className="bg-blue-600 text-white rounded-full px-4 py-2 text-2xl font-bold">E2</span>
      <h1 className="text-3xl font-bold text-blue-800">Gadget Galaxy</h1>
    </div>
    <nav className="mt-4 md:mt-0 flex gap-8 text-blue-700 font-semibold">
      <a href="#" className="hover:text-blue-900">Shop</a>
      <a href="#" className="hover:text-blue-900">Brands</a>
      <a href="#" className="hover:text-blue-900">Offers</a>
      <a href="#" className="hover:text-blue-900">Contact</a>
    </nav>
  </header>
);

export default ElectronicHeader2;
