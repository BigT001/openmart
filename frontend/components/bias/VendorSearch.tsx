"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";

interface VendorSearchProps {
  onSearch?: (query: string) => void;
}

export default function VendorSearch({ onSearch }: VendorSearchProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      // Replace with your actual API endpoint
      const res = await fetch(`/api/vendors/search?name=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("No vendors found");
      const data = await res.json();
      setResults(data);
      if (onSearch) onSearch(query);
    } catch (err: any) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search vendor by business name..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <Button type="submit" disabled={loading} className="bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg">
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {results.length > 0 && (
        <ul className="bg-white rounded-lg shadow p-4 divide-y divide-gray-100">
          {results.map((vendor: any) => (
            <li key={vendor.id} className="py-2 flex flex-col">
              <span className="font-bold text-indigo-700">{vendor.business_name}</span>
              <span className="text-gray-500 text-sm">{vendor.location}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
