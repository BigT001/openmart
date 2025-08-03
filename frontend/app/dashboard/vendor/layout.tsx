import DashboardLayout from "@/components/vendor/vendors-dashboard/DashboardLayout";

interface VendorLayoutProps {
  children: React.ReactNode;
}

export default function VendorLayout({ children }: VendorLayoutProps) {
  return (
    <div className="bg-[#181818] min-h-screen w-full">
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}
