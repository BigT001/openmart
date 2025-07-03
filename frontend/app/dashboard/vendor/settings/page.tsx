"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import VendorsProfile from "@/components/vendors-dashboard/settings/Vendorsprofile";
import VendorSocialMedia from "@/components/vendors-dashboard/settings/VendorSocialMedia";
import VendorBanks from "@/components/vendors-dashboard/settings/VendorBanks";
import PersonalInfo from "@/components/vendors-dashboard/settings/PersonalInfo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;
    fetch(
      `${API_URL}/api/vendors/by-user?email=${encodeURIComponent(
        session.user.email
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        setVendorId(data.vendor);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session?.user?.email]);

  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center  ">
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#b39ddb] mb-10 
        tracking-tight text-center drop-shadow-lg">
        Vendor Settings
      </h1>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 md:px-0">
        {/* Profile Card - left side */}
        <div className="flex flex-col w-full gap-2">
          {loading ? (
            <div className="flex items-center justify-center h-full min-h-[200px] text-lg text-gray-400">
              Loading vendor profile...
            </div>
          ) : vendorId ? (
            <>
              <VendorsProfile vendorId={vendorId} />
              {session?.user?.email && (
                <PersonalInfo email={session.user.email} />
              )}
            </>
          ) : (
            <div className="text-red-500 flex items-center justify-center h-full min-h-[200px]">
              Vendor not found for this user.
            </div>
          )}
        </div>
        {/* Social Media + Bank stacked on right */}
        <div className="flex flex-col w-full gap-2 ">
          <VendorSocialMedia />
          <VendorBanks />
        </div>
      </div>
    </div>
  );
}
