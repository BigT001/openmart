import React from "react";

const FashionHeader1 = () => (
  <header className="bg-gradient-to-r from-pink-200 via-pink-400 to-purple-300 text-white py-10 px-6 flex flex-col items-center shadow-lg">
    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Mixtas</h1>
    <p className="text-lg font-medium mb-4">Jackets for the Modern Man</p>
    <nav className="flex gap-6 text-base font-semibold">
      <a href="#" className="hover:underline">Home</a>
      <a href="#" className="hover:underline">Shop</a>
      <a href="#" className="hover:underline">Pages</a>
      <a href="#" className="hover:underline">Blog</a>
      <a href="#" className="hover:underline">Contact Us</a>
    </nav>
  </header>
);

export default FashionHeader1;
