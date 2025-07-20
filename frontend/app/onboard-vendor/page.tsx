"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import OnboardHero from "../../components/vendor/Onboard/OnboardHero";
import PersonalDetailsForm from "../../components/vendor/Onboard/PersonalDetailsForm";
import BusinessDetailsForm from "../../components/vendor/Onboard/BusinessDetailsForm";

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

// Only keep bottom button color
const bottomButtonGradient = "bg-gradient-to-r from-[#23182b] to-black";

export default function VendorOnboardingPage() {
	const { data: session } = useSession();
	const router = useRouter();
  const [step, setStep] = useState(1);
const [form, setForm] = useState({
  // Personal details
  first_name: "",
  last_name: "",
  phone: "",
  gender: "",
  birth_date: "",
  // Business details
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
	event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
	const { name, value, type } = event.target;
	let fieldValue: any = value;
	if (type === "checkbox" && "checked" in event.target) {
	  fieldValue = (event.target as HTMLInputElement).checked;
	}
	setForm((prev) => ({
	  ...prev,
	  [name]: fieldValue,
	}));
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

	const handlePersonalSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setError("");
  // Basic validation
  if (!form.first_name || !form.last_name || !form.phone || !form.gender || !form.birth_date) {
	setError("Please fill in all personal details.");
	return;
  }
  setStep(2);
	};

	const handleBusinessSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		setError("");
		try {
			const payload = {
				...form,
				email: session?.user?.email,
				category: form.categories.join(", "),
			};
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
  <div className="fixed inset-0 bg-white flex flex-col justify-center items-center">
	<div className="w-full max-w-5xl relative rounded-2xl shadow-xl overflow-hidden border-2 border-black bg-white flex flex-col" style={{height: 'calc(100vh - 32px)'}}>
	  {/* Top bar with logo and back button */}
	  <div className="flex items-center justify-between px-12 py-6 bg-black border-b border-black">
		<button
		  type="button"
		  onClick={() => {
			if (step > 1) {
			  setStep((prev) => prev - 1);
			} else {
			  router.back();
			}
		  }}
		  className="flex items-center gap-2 text-white font-semibold px-3 py-1 rounded transition bg-black border border-black"
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
	  {/* Hero section and forms */}
	<div className="flex flex-col md:flex-row items-center gap-10 px-12 py-10 bg-white flex-1">
	  <OnboardHero />
	  {step === 1 && (
		<PersonalDetailsForm
		  form={form}
		  handleChange={handleChange}
		  handleSubmit={(e) => {
			e.preventDefault();
			setError("");
			if (!form.first_name || !form.last_name || !form.phone || !form.gender || !form.birth_date) {
			  setError("Please fill in all personal details.");
			  return;
			}
			setStep(2);
		  }}
		  loading={loading}
		  error={error}
		/>
	  )}
	  {step === 2 && (
		<BusinessDetailsForm
		  form={form}
		  handleChange={handleChange}
		  handleCategoryToggle={handleCategoryToggle}
		  handleSubmit={(e) => {
			e.preventDefault();
			setStep(3);
		  }}
		  loading={loading}
		  error={error}
		  categories={categories}
		  toggleCategoryDropdown={toggleCategoryDropdown}
		/>
	  )}
	  {step === 3 && (
		<BusinessDetailsForm
		  form={form}
		  handleChange={handleChange}
		  handleCategoryToggle={handleCategoryToggle}
		  handleSubmit={handleBusinessSubmit}
		  loading={loading}
		  error={error}
		  categories={categories}
		  toggleCategoryDropdown={toggleCategoryDropdown}
		/>
	  )}
	</div>
	</div>
  </div>
  );
}
