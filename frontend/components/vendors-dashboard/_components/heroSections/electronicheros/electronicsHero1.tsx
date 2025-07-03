import React from "react";

const ElectronicsHero1 = () => (
  <section className="relative bg-gradient-to-br from-blue-900 to-blue-400 min-h-[350px] flex items-center justify-center overflow-hidden">
    <img src="/electronics-hero1.jpg" alt="Electronics Hero 1" className="absolute inset-0 w-full h-full object-cover object-top opacity-70" />
    <div className="relative z-10 flex flex-col items-center justify-center py-16 w-full">
      <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">ElectroMart</h1>
      <p className="text-2xl md:text-3xl font-semibold text-white mb-8 drop-shadow">Latest Tech, Best Prices</p>
      <button className="bg-white text-blue-700 font-bold px-6 py-2 rounded shadow hover:bg-blue-50 transition">Shop Now</button>
    </div>
  </section>
);

export default ElectronicsHero1;
