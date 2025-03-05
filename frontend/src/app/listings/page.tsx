"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Listing = {
  id: string;
  imageUrl?: string;
  title: string;
  brand: { name: string };
  model: { name: string };
  year: number;
  mileage: number;
  price: number;
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    fuelType: "",
    transmission: "",
    minYear: "",
    maxYear: "",
  });
  const debouncedFilters = useDebounce(filters, 500);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (debouncedFilters.minPrice) params.append("minPrice", debouncedFilters.minPrice);
        if (debouncedFilters.maxPrice) params.append("maxPrice", debouncedFilters.maxPrice);
        if (debouncedFilters.fuelType) params.append("fuelType", debouncedFilters.fuelType);
        if (debouncedFilters.transmission) params.append("transmission", debouncedFilters.transmission);
        if (debouncedFilters.minYear) params.append("minYear", debouncedFilters.minYear);
        if (debouncedFilters.maxYear) params.append("maxYear", debouncedFilters.maxYear);
        params.append("sort", sortBy);

        const res = await fetch(`${API_BASE}/listing?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();
        setListings(data.listings || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [sortBy, debouncedFilters, page]);

  const applyFilters = () => {
    setPage(1);
    router.push("/listings", { scroll: false });
  };

  const resetFilters = () => {
    setFilters({ minPrice: "", maxPrice: "", fuelType: "", transmission: "", minYear: "", maxYear: "" });
    setPage(1);
  };

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
        <div className="flex flex-col">
          <label className="text-gray-800 font-medium mb-1">Min Price</label>
          <input
            type="number"
            placeholder="Min"
            className="border p-2 rounded-md w-36 bg-white text-gray-900"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-800 font-medium mb-1">Max Price</label>
          <input
            type="number"
            placeholder="Max"
            className="border p-2 rounded-md w-36 bg-white text-gray-900"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-800 font-medium mb-1">Fuel Type</label>
          <select
            className="border p-2 rounded-md w-36 bg-white text-gray-900"
            value={filters.fuelType}
            onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
          >
            <option value="">Any</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-800 font-medium mb-1">Transmission</label>
          <select
            className="border p-2 rounded-md w-36 bg-white text-gray-900"
            value={filters.transmission}
            onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
          >
            <option value="">Any</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
            <option value="CVT">CVT</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-800 font-medium mb-1">Min Year</label>
          <input
            type="number"
            placeholder="Min Year"
            className="border p-2 rounded-md w-36 bg-white text-gray-900"
            value={filters.minYear}
            onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-800 font-medium mb-1">Max Year</label>
          <input
            type="number"
            placeholder="Max Year"
            className="border p-2 rounded-md w-36 bg-white text-gray-900"
            value={filters.maxYear}
            onChange={(e) => setFilters({ ...filters, maxYear: e.target.value })}
          />
        </div>
        <div className="flex items-end gap-4">
          <button onClick={applyFilters} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Apply Filters
          </button>
          <button onClick={resetFilters} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Reset Filters
          </button>
        </div>
      </div>

      {/* Sorting Dropdown */}
      <div className="flex justify-end mb-6">
        <label className="mr-2 text-gray-800 font-medium">Sort by:</label>
        <select
          className="border p-2 rounded-md w-44 bg-white text-gray-900"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
        >
          <option value="newest">Newest Listings</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="year_desc">Newest Cars First</option>
          <option value="year_asc">Oldest Cars First</option>
          <option value="mileage_asc">Mileage: Low to High</option>
          <option value="mileage_desc">Mileage: High to Low</option>
        </select>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.length ? (
          listings.map((listing) => (
            <Link key={listing.id} href={`/listing/${listing.id}`} className="block border rounded-lg overflow-hidden shadow hover:shadow-lg bg-white">
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

      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 gap-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
