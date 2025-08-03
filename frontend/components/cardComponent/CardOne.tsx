"use client";

import React from "react";

export default function CardOne() {
  return (
    <div
      className="relative w-[340px] h-[210px] rounded-2xl shadow-2xl flex flex-col justify-between px-4 font-sans overflow-hidden border border-[#009688]"
      style={{
        fontFamily: 'sans-serif',
        letterSpacing: '1px',
        boxShadow: '0 4px 24px 0 #004d40cc',
        background: 'linear-gradient(135deg, #004d40 0%, #009688 100%)',
      }}
    >
      {/* Creative geometric background with brand accent */}
      <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
        <svg width="340" height="210" viewBox="0 0 340 210" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute">
          {/* Dynamic brand waves */}
          <path d="M0,60 Q85,120 170,60 T340,60" stroke="#009688" strokeWidth="6" fill="none" opacity="0.22" />
          <path d="M0,120 Q85,180 170,120 T340,120" stroke="#F0F4F8" strokeWidth="6" fill="none" opacity="0.18" />
          {/* Large soft circles - subtle brand accent */}
          <circle cx="60" cy="40" r="38" fill="#009688" opacity="0.13" />
          <circle cx="280" cy="170" r="32" fill="#F0F4F8" opacity="0.14" />
          {/* Polygon accent - brand color */}
          <polygon points="60,210 170,120 280,210" fill="#004d40" opacity="0.10" />
        </svg>
      </div>
        {/* Card header */}
      <div className="flex justify-between items-center ">
        <span
          className="text-lg font-semibold tracking-wider"
          style={{
            color: '#F0F4F8',
            textShadow: '0 1px 4px #009688, 0 0.5px 0 #fff',
            letterSpacing: '1.5px',
          }}
        >
          OPENMART
        </span>
        <div className="flex items-center">
          <img src="/visa.png" alt="Visa logo" className="w-12 h-12 object-contain" style={{background: 'none', border: 'none', boxShadow: 'none'}} />
        </div>
      </div>
        {/* Chip and wireless */}
      <div className="flex items-center gap-2 mt-2 px-4">
        <img
          src="/chip.png"
          alt="Card chip"
          className="w-12 h-8 object-cover rounded-lg shadow-lg"
          style={{ objectFit: 'cover', background: 'none', borderRadius: '10px', boxShadow: '0 0 6px 1px #00968844', marginLeft: '-6px' }}
        />
        <img
          src="/wifi.png"
          alt="Wi-Fi icon"
          className="w-7 h-7 object-contain ml-1"
          style={{background: 'none', border: 'none', boxShadow: 'none'}}
        />
      </div>
        {/* Card number - stretched across card, top half */}
      <div className="w-full flex justify-center items-center">
        <span
          className="block w-full text-2xl font-mono tracking-widest font-semibold text-center"
          style={{
            color: '#F0F4F8',
            textShadow: '0 2px 12px #009688, 0 0.5px 0 #fff',
            letterSpacing: '2.5px',
            WebkitTextStroke: '1px #009688',
          }}
        >
          4000 1234 5678 9010
        </span>
      </div>
      <div className="flex justify-between items-center text-md ">
        <div className="flex flex-col">
          <span className="block text-[8px] text-[#F0F4F8] font-semibold">CARD HOLDER</span>
          <span
            className="block text-base font-extrabold tracking-wide"
            style={{
              color: '#F0F4F8',
              textShadow: '0 1px 4px #009688, 0 0.5px 0 #F0F4F8',
              letterSpacing: '1px',
              WebkitTextStroke: '0.5px #009688',
            }}
          >
            SAMUEL STANLEY
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="block text-[8px] text-[#F0F4F8] font-semibold">VALID THRU</span>
          <span
            className="block text-base font-bold tracking-wide"
            style={{
              color: '#F0F4F8',
              textShadow: '0 1px 4px #009688',
              letterSpacing: '1px',
              WebkitTextStroke: '0.5px #009688',
            }}
          >
            12/20
          </span>
        </div>
      </div>
    </div>
  );
}
