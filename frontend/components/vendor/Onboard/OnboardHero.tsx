import React from "react";
import { FaRocket, FaLock, FaChartLine } from "react-icons/fa";

export default function OnboardHero() {
  return (
    <div className="flex flex-col items-start justify-start min-w-[220px] max-w-[320px] px-4 py-6 bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-xl shadow">
      <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-3 leading-tight tracking-tight">
        Start Selling on <span className="text-black/80">OpenMart</span>
      </h1>
      <p className="text-lg text-gray-700 mb-5">
        Showcase your business to thousands of buyers.
        <br className="hidden md:block" />
        Complete your vendor profile to join our trusted marketplace community.
      </p>
      <ul className="space-y-3 mb-2 w-full">
        <li className="flex items-center gap-3">
          <FaRocket className="text-black/80 w-5 h-5" />
          <span className="text-gray-900 font-semibold text-base">
            Fast onboarding
          </span>
        </li>
        <li className="flex items-center gap-3">
          <FaLock className="text-black/80 w-5 h-5" />
          <span className="text-gray-900 font-semibold text-base">
            Secure payments
          </span>
        </li>
        <li className="flex items-center gap-3">
          <FaChartLine className="text-black/80 w-5 h-5" />
          <span className="text-gray-900 font-semibold text-base">
            Grow your brand
          </span>
        </li>
      </ul>
    </div>
  );
}
