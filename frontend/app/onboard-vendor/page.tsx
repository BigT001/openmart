"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
	"Fashion",
	"Electronics",
	"Food",
	"Beauty",
	"Home & Living",
	"Books",
	"Toys",
	"Other",
];

export default function VendorOnboardingPage() {
	const { data: session } = useSession();
	const router = useRouter();
	const [form, setForm] = useState({
		business_name: "",
		business_description: "",
		business_phone: "",
		business_address: "",
		categories: [] as string[],
		showCategories: false,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (
		event:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setForm({ ...form, [event.target.name]: event.target.value });
	};

	const handleCategoryToggle = (cat: string) => {
		setForm((prev) => {
			if (prev.categories.includes(cat)) {
				return { ...prev, categories: prev.categories.filter((c) => c !== cat) };
			} else {
				return { ...prev, categories: [...prev.categories, cat] };
			}
		});
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		setError("");
		try {
			const payload = { ...form, email: session?.user?.email, category: form.categories.join(", ") };
			const response = await fetch("http://localhost:8000/api/vendors/onboard", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!response.ok) throw new Error("Failed to onboard vendor");
			await response.json();
			router.push("/dashboard/vendor");
		} catch (err: any) {
			setError(err.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	// Toggle dropdown for categories
	const toggleCategoryDropdown = () => {
		setForm((prev) => ({ ...prev, showCategories: !prev.showCategories }));
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-black via-[#23182b] to-black flex flex-col justify-center items-center py-10 px-2">
			<div className="w-full max-w-5xl relative rounded-2xl shadow-xl overflow-hidden border-2 border-[#2d0036] bg-[#181024]/95">
				{/* Top bar with logo and back button */}
				<div className="flex items-center justify-between px-12 py-6 bg-[#23182b] border-b border-[#2d0036]">
					<button
						type="button"
						onClick={() => router.back()}
						className="flex items-center gap-2 text-white hover:text-[#b39ddb] font-semibold px-3 py-1 rounded transition bg-[#23182b] hover:bg-[#2d0036] border border-[#2d0036] shadow-sm"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="w-5 h-5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15.75 19.5L8.25 12l7.5-7.5"
							/>
						</svg>
						Back
					</button>
					<span className="text-2xl font-extrabold tracking-tight text-white select-none">
						OpenMart
					</span>
					<div className="w-16" /> {/* Spacer for symmetry */}
				</div>
				{/* Hero section */}
				<div className="flex flex-col md:flex-row items-center gap-10 px-12 py-10 bg-gradient-to-br from-[#23182b]/80 to-black/80">
					<div className="flex-1 flex flex-col items-center md:items-start">
						<h1 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">
							Start Selling on OpenMart
						</h1>
						<p className="text-lg text-[#b39ddb] mb-6 max-w-md">
							Showcase your business to thousands of buyers. Complete your vendor
							profile to join our trusted marketplace community.
						</p>
						<ul className="text-[#b39ddb] space-y-2 mb-6 text-base">
							<li className="flex items-center gap-2">
								<span className="inline-block w-2 h-2 bg-[#b39ddb] rounded-full" />
								Fast onboarding
							</li>
							<li className="flex items-center gap-2">
								<span className="inline-block w-2 h-2 bg-[#b39ddb] rounded-full" />
								Secure payments
							</li>
							<li className="flex items-center gap-2">
								<span className="inline-block w-2 h-2 bg-[#b39ddb] rounded-full" />
								Grow your brand
							</li>
						</ul>
					</div>
					<form
						onSubmit={handleSubmit}
						className="flex-1 w-full max-w-2xl bg-[#1a1120] rounded-xl shadow-lg p-12 border-2 border-[#2d0036]"
					>
						<AnimatePresence>
							<motion.div
								key="fields"
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 30 }}
								transition={{ duration: 0.5, type: "spring" }}
								className="grid grid-cols-1 md:grid-cols-2 gap-8"
							>
								<div className="col-span-1">
									<label className="block font-semibold mb-1 text-[#b39ddb]">
										Business Name
									</label>
									<input
										name="business_name"
										value={form.business_name}
										onChange={handleChange}
										required
										className="w-full px-6 py-3 border-2 border-[#2d0036] focus:border-[#b39ddb] rounded-lg focus:outline-none bg-[#181024] text-white placeholder-[#b39ddb]/60"
										placeholder="e.g. Arewa Foods"
									/>
								</div>
								<div className="col-span-1">
									<label className="block font-semibold mb-1 text-[#b39ddb]">
										Business Phone
									</label>
									<input
										name="business_phone"
										value={form.business_phone}
										onChange={handleChange}
										required
										className="w-full px-6 py-3 border-2 border-[#2d0036] focus:border-[#b39ddb] rounded-lg focus:outline-none bg-[#181024] text-white placeholder-[#b39ddb]/60"
										placeholder="e.g. 08012345678"
									/>
								</div>
								<div className="col-span-1 md:col-span-2">
									<label className="block font-semibold mb-1 text-[#b39ddb]">
										Business Description
									</label>
									<textarea
										name="business_description"
										value={form.business_description}
										onChange={handleChange}
										required
										className="w-full px-6 py-3 border-2 border-[#2d0036] focus:border-[#b39ddb] rounded-lg focus:outline-none bg-[#181024] text-white placeholder-[#b39ddb]/60"
										rows={3}
										placeholder="Tell us about your business..."
									/>
								</div>
								<div className="col-span-1 md:col-span-2">
									<label className="block font-semibold mb-1 text-[#b39ddb]">
										Business Address
									</label>
									<input
										name="business_address"
										value={form.business_address}
										onChange={handleChange}
										required
										className="w-full px-6 py-3 border-2 border-[#2d0036] focus:border-[#b39ddb] rounded-lg focus:outline-none bg-[#181024] text-white placeholder-[#b39ddb]/60"
										placeholder="e.g. Kano, Nigeria"
									/>
								</div>
								<div className="col-span-1 md:col-span-2 relative">
									<label className="block font-semibold mb-1 text-[#b39ddb]">
										Business Categories{" "}
										<span className="text-xs text-[#b39ddb]/70">
											(Select all that apply)
										</span>
									</label>
									<div className="relative mt-2">
										<button
											type="button"
											onClick={toggleCategoryDropdown}
											className="w-full flex justify-between items-center px-6 py-3 border-2 border-[#2d0036] rounded-lg bg-[#181024] text-[#b39ddb] font-semibold focus:outline-none focus:border-[#b39ddb] transition"
										>
											{form.categories.length > 0
												? form.categories.join(", ")
												: "Select categories"}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={2}
												stroke="currentColor"
												className={`w-5 h-5 ml-2 transition-transform ${
													form.showCategories ? "rotate-180" : "rotate-0"
												}`}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M19.5 8.25L12 15.75 4.5 8.25"
												/>
											</svg>
										</button>
										<AnimatePresence>
											{form.showCategories && (
												<motion.div
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: 10 }}
													transition={{ duration: 0.2 }}
													className="absolute left-0 right-0 z-20 mt-2 bg-[#181024] border-2 border-[#2d0036] rounded-lg shadow-lg p-4 flex flex-wrap gap-3"
												>
													{categories.map((cat) => (
														<motion.button
															type="button"
															key={cat}
															onClick={() => handleCategoryToggle(cat)}
															className={`px-4 py-2 rounded-full border-2 transition-all duration-200 text-sm font-semibold focus:outline-none ${
																form.categories.includes(cat)
																	? "bg-[#b39ddb] text-[#23182b] border-[#b39ddb] shadow"
																	: "bg-[#181024] text-[#b39ddb] border-[#2d0036] hover:bg-[#23182b] hover:border-[#b39ddb]"
															}`}
															whileTap={{ scale: 0.95 }}
															animate={{
																scale: form.categories.includes(cat) ? 1.08 : 1,
															}}
														>
															{cat}
														</motion.button>
													))}
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								</div>
							</motion.div>
						</AnimatePresence>
						{error && (
							<div className="text-red-400 font-semibold text-center mt-4">
								{error}
							</div>
						)}
						<motion.button
							type="submit"
							disabled={loading}
							className="w-full py-3 px-4 mt-8 bg-gradient-to-r from-[#23182b] to-black text-white font-bold rounded-lg shadow-md hover:from-[#2d0036] hover:to-[#181024] transition text-lg border border-[#2d0036]"
							whileTap={{ scale: 0.97 }}
							whileHover={{ scale: 1.03 }}
						>
							{loading ? "Submitting..." : "Submit & Continue"}
						</motion.button>
					</form>
				</div>
			</div>
		</div>
	);
}
