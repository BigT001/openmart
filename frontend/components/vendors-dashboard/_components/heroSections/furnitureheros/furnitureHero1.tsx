import React from "react";

const FurnitureHero1 = () => (
  <section className="relative bg-gradient-to-r from-amber-700 via-yellow-400 to-yellow-200 min-h-[350px] flex items-center justify-center overflow-hidden">
    <img src="/furniture-hero1.jpg" alt="Furniture Hero 1" className="absolute inset-0 w-full h-full object-cover object-top opacity-70" />
    <div className="relative z-10 flex flex-col items-center justify-center py-16 w-full">
      <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">HomeNest</h1>
      <p className="text-2xl md:text-3xl font-semibold text-white mb-8 drop-shadow">Modern Comforts for Every Room</p>
      <button className="bg-white text-yellow-700 font-bold px-6 py-2 rounded shadow hover:bg-yellow-50 transition">Shop Furniture</button>
    </div>
  </section>
);

export default FurnitureHero1;
