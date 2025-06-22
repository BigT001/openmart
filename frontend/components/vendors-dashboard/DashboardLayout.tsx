import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

export default function DashboardLayout({ children, active, onAddProduct }: { children: React.ReactNode; active?: string; onAddProduct?: () => void }) {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar active={active} />
      <div className="flex-1 flex flex-col h-screen">
        <DashboardHeader onAddProduct={onAddProduct} />
        <main className="flex-1 p-8 overflow-auto" style={{ minHeight: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
