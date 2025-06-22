import Link from "next/link";

const sidebarItems = [
  { label: "Overview", href: "/dashboard/vendor" },
  { label: "Products", href: "/dashboard/vendor/products" },
  { label: "Orders", href: "/dashboard/vendor/orders" },
  { label: "Reviews", href: "/dashboard/vendor/reviews" },
  { label: "Settings", href: "/dashboard/vendor/settings" },
];

export default function Sidebar({ active }: { active?: string }) {
  return (
    <aside className="w-64 h-full bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 p-6 flex flex-col">
      <div className="mb-8 text-2xl font-bold text-indigo-600">Vendor Panel</div>
      <nav className="flex-1 space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${active === item.href ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-white" : "text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-800"}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
