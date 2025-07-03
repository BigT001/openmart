import DashboardLayout from "@/components/vendors-dashboard/DashboardLayout";

interface VendorLayoutProps {
  children: React.ReactNode;
}

export default function VendorLayout({ children }: VendorLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
