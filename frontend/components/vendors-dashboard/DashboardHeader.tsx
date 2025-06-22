import { useSession } from "next-auth/react";

export default function DashboardHeader() {
  const { data: session } = useSession();
  return (
    <header className="w-full flex items-center justify-between py-4 px-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="text-xl font-bold">Welcome, {session?.user?.name || session?.user?.email || "Vendor"}!</div>
      <div className="text-gray-500">Vendor Dashboard</div>
    </header>
  );
}
