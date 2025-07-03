import React from "react";

const ElectronicHeader3 = () => (
  <header className="bg-gradient-to-br from-gray-900 via-blue-800 to-blue-400 text-white py-10 px-6 flex flex-col md:flex-row items-center justify-between shadow-xl">
    <div>
      <h1 className="text-4xl font-extrabold mb-1 tracking-wide">TechnoZone</h1>
      <p className="text-lg font-light">Innovate. Upgrade. Experience.</p>
    </div>
    <nav className="mt-6 md:mt-0 flex gap-8 text-lg font-medium">
      <a href="#" className="hover:underline">Categories</a>
      <a href="#" className="hover:underline">New Arrivals</a>
      <a href="#" className="hover:underline">Best Sellers</a>
      <a href="#" className="hover:underline">Help</a>
    </nav>
  </header>
);

export default ElectronicHeader3;
