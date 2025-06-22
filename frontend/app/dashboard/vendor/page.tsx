"use client";
import DashboardLayout from "@/components/vendors-dashboard/DashboardLayout";

export default function VendorDashboard() {
  return (
    <DashboardLayout active="/dashboard/vendor">
      <div className="text-2xl font-bold mb-4">Overview</div>
      <div className="text-gray-600 dark:text-gray-300">Your vendor tools and analytics will appear here.</div>
    </DashboardLayout>
  );
}
