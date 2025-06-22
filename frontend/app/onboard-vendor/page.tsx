"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  "Fashion",
  "Electronics",
  "Food",
  "Beauty",
  "Home & Living",
  "Books",
  "Toys",
  "Other"
];

export default function VendorOnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    business_name: "",
    business_description: "",
    business_phone: "",
    business_address: "",
    category: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = { ...form, email: session?.user?.email };
      const res = await fetch("http://localhost:8000/api/vendors/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to onboard vendor");
      const data = await res.json();
      router.push("/dashboard/vendor");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-center">Become a Seller</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-semibold mb-1">Business Name</label>
          <input name="business_name" value={form.business_name} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Business Description</label>
          <textarea name="business_description" value={form.business_description} onChange={handleChange} required className="w-full px-3 py-2 border rounded" rows={3} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Business Phone</label>
          <input name="business_phone" value={form.business_phone} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Business Address</label>
          <input name="business_address" value={form.business_address} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Business Category</label>
          <select name="category" value={form.category} onChange={handleChange} required className="w-full px-3 py-2 border rounded">
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700 transition">
          {loading ? "Submitting..." : "Submit & Continue"}
        </button>
      </form>
    </div>
  );
}
