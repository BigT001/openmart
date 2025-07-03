import React from "react";

const FashionHero1 = () => (
  <section className="relative bg-gradient-to-br from-pink-200 to-purple-200 min-h-[350px] flex items-center justify-center overflow-hidden">
    <img src="/fashion-hero1.jpg" alt="Fashion Hero 1" className="absolute inset-0 w-full h-full object-cover object-top opacity-70" />
    <div className="relative z-10 flex flex-col items-center justify-center py-16 w-full">
      <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">Mixtas</h1>
      <p className="text-2xl md:text-3xl font-semibold text-white mb-8 drop-shadow">Jackets for the Modern Man</p>
      <button className="bg-white text-pink-700 font-bold px-6 py-2 rounded shadow hover:bg-pink-50 transition">Discover Now</button>
    </div>
  </section>
);

export default FashionHero1;
