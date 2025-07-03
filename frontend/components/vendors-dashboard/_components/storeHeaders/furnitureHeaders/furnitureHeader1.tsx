import React from "react";

const FurnitureHeader1 = () => (
  <header className="bg-gradient-to-r from-amber-700 via-yellow-400 to-yellow-200 text-white py-10 px-6 flex flex-col items-center shadow-lg">
    <h1 className="text-4xl font-extrabold tracking-tight mb-2">HomeNest</h1>
    <p className="text-lg font-medium mb-4">Modern Comforts for Every Room</p>
    <nav className="flex gap-6 text-base font-semibold">
      <a href="#" className="hover:underline">Home</a>
      <a href="#" className="hover:underline">Living Room</a>
      <a href="#" className="hover:underline">Bedroom</a>
      <a href="#" className="hover:underline">Dining</a>
      <a href="#" className="hover:underline">Contact</a>
    </nav>
  </header>
);

export default FurnitureHeader1;
