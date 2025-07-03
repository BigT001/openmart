import React from "react";

const FurnitureHeader2 = () => (
  <header className="bg-white border-b-4 border-yellow-600 py-8 px-4 flex flex-col md:flex-row items-center justify-between shadow-sm">
    <div className="flex items-center gap-3">
      <span className="bg-yellow-600 text-white rounded-full px-4 py-2 text-2xl font-bold">F2</span>
      <h1 className="text-3xl font-bold text-yellow-700">Cozy Living</h1>
    </div>
    <nav className="mt-4 md:mt-0 flex gap-8 text-yellow-700 font-semibold">
      <a href="#" className="hover:text-yellow-900">Sofas</a>
      <a href="#" className="hover:text-yellow-900">Beds</a>
      <a href="#" className="hover:text-yellow-900">Tables</a>
      <a href="#" className="hover:text-yellow-900">Sale</a>
    </nav>
  </header>
);

export default FurnitureHeader2;
