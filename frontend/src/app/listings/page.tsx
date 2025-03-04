"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ListingsPage() {
  // State management
  const [listings, setListings] = useState<
  { id: string; imageUrl?: string; title: string; brand: { name: string }; model: { name: string }; year: number; mileage: number; price: number }[]
>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy] = useState("newest");
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    fuelType: "",
    transmission: "",
    minYear: "",
    maxYear: "",
  });

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12; // Number of listings per page

  const router = useRouter();

  // Fetch listings with sorting, filtering, and pagination
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        queryParams.append("limit", limit.toString());
        if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
        if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
        if (filters.fuelType) queryParams.append("fuelType", filters.fuelType);
        if (filters.transmission) queryParams.append("transmission", filters.transmission);
        if (filters.minYear) queryParams.append("minYear", filters.minYear);
        if (filters.maxYear) queryParams.append("maxYear", filters.maxYear);
        queryParams.append("sort", sortBy);

        const response = await fetch(`${API_BASE}/listing?${queryParams.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch listings");
        const data = await response.json();

        setListings(data.listings || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [sortBy, filters, page]);

  // Apply filters and reset to page 1
  const applyFilters = () => {
    setPage(1);
    router.push("/listings", { scroll: false });
  };

  // Handle pagination navigation
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    router.push(`/listings?page=${newPage}`, { scroll: false });
  };

  if (loading) return <p className="text-center text-lg">Loading listings...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-900">Find Your Perfect Car</h1>

      {/* Filters Section */}
      <div className="bg-gray-100 p-6 rounded-lg mb-6 shadow-md flex flex-wrap gap-4 justify-center border border-gray-300">
        {/* Price Range */}
        <div className="flex flex-col">
          <label className="text-gray-800 font-medium mb-1">Min Price</label>
          <input
            type="number"
            placeholder="Min"
            className="border p-2 rounded-md w-36 bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-800 font-medium mb-1">Max Price</label>
          <input
            type="number"
            placeholder="Max"
            className="border p-2 rounded-md w-36 bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>

        {/* Apply & Reset Buttons */}
        <div className="flex items-end gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition shadow-md"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition shadow-md"
            onClick={() => setFilters({ minPrice: "", maxPrice: "", fuelType: "", transmission: "", minYear: "", maxYear: "" })}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/listing/${listing.id}`}
              className="block border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition bg-white"
            >
              <Image
                src={listing.imageUrl && listing.imageUrl.startsWith("http") ? listing.imageUrl : "/placeholder.jpg"}
                alt={listing.title || "No Image Available"}
                width={500}
                height={200}
                className="w-full h-48 object-cover bg-gray-200"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">{listing.brand.name} {listing.model.name}</h2>
                <p className="text-gray-600">{listing.year} • {listing.mileage.toLocaleString()} km</p>
                <p className="text-xl font-bold text-blue-600">${listing.price.toLocaleString()}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No listings found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          className={`px-4 py-2 border rounded-md ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          ← Previous
        </button>

        <span className="px-4 py-2 border rounded-md bg-gray-100">
          Page {page} of {totalPages}
        </span>

        <button
          className={`px-4 py-2 border rounded-md ${page === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
