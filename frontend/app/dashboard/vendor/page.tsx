"use client";
import DashboardLayout from "@/components/vendors-dashboard/DashboardLayout";

export default function VendorDashboard() {
	return (
		<DashboardLayout active="/dashboard/vendor">
			<div className="flex flex-col md:flex-row gap-8 w-full">
				{/* Main content area */}
				<section className="flex-1 min-w-0">
					<div className="mb-8">
						<h1 className="text-3xl font-extrabold text-[#b39ddb] mb-2">
							Vendor Overview
						</h1>
						<p className="text-gray-400 text-base mb-6">
							Welcome to your vendor dashboard. Here you can manage your products,
							orders, reviews, and business settings. Use the sidebar to navigate
							between sections.
						</p>
						<div className="rounded-xl border border-[#2d0036] bg-[#181024] p-8 flex flex-col items-center justify-center min-h-[200px]">
							<span className="text-gray-500 text-lg">
								Your analytics and tools will appear here soon.
							</span>
						</div>
					</div>
				</section>
				{/* Optional: Add a right-side panel for future widgets or info */}
				<aside className="hidden lg:block w-80 min-w-[18rem]">
					<div className="rounded-xl border border-[#2d0036] bg-[#23182b] p-6 h-full flex flex-col items-center justify-center">
						<span className="text-[#b39ddb] font-semibold text-lg mb-2">
							Need Help?
						</span>
						<p className="text-gray-400 text-sm text-center">
							Check the documentation or contact support for assistance with your
							vendor account.
						</p>
					</div>
				</aside>
			</div>
		</DashboardLayout>
	);
}
