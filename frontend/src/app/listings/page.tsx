"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Listing = {
  id: string;
  title: string;
  brand: { name: string };
  model: { name: string };
  year: number;
  mileage: number;
  price: number;
  photos: { photoUrl: string }[];
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
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-center text-blue-900 tracking-tight">
        Find Your <span className="text-blue-600">Perfect</span> Car
      </h1>
  
      {/* Filters Section */}
      <div className="bg-white rounded-xl mb-8 shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Results
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-x-6 gap-y-5">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1.5 text-sm">Min Price</label>
              <input
                type="number"
                placeholder="Min"
                className="border border-gray-300 p-2.5 rounded-lg w-full bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1.5 text-sm">Max Price</label>
              <input
                type="number"
                placeholder="Max"
                className="border border-gray-300 p-2.5 rounded-lg w-full bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1.5 text-sm">Fuel Type</label>
              <select
                className="border border-gray-300 p-2.5 rounded-lg w-full bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
              <label className="text-gray-700 font-medium mb-1.5 text-sm">Transmission</label>
              <select
                className="border border-gray-300 p-2.5 rounded-lg w-full bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
              <label className="text-gray-700 font-medium mb-1.5 text-sm">Min Year</label>
              <input
                type="number"
                placeholder="Min Year"
                className="border border-gray-300 p-2.5 rounded-lg w-full bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={filters.minYear}
                onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1.5 text-sm">Max Year</label>
              <input
                type="number"
                placeholder="Max Year"
                className="border border-gray-300 p-2.5 rounded-lg w-full bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={filters.maxYear}
                onChange={(e) => setFilters({ ...filters, maxYear: e.target.value })}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-6 justify-end">
            <button 
              onClick={resetFilters} 
              className="px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reset
            </button>
            <button 
              onClick={applyFilters} 
              className="px-5 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 font-medium flex items-center shadow-md hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
  
      {/* Sorting Dropdown */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <p className="text-gray-600 mb-4 sm:mb-0">{listings.length ? `Showing ${listings.length} vehicles` : 'No vehicles found'}</p>
        <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 pl-4">
          <label className="text-gray-700 font-medium whitespace-nowrap">Sort by:</label>
          <select
            className="border-0 p-3 rounded-lg w-56 bg-white text-gray-800 focus:ring-0 focus:outline-none"
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
      </div>
  
      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r shadow-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Error: {error}</p>
            </div>
          </div>
        </div>
      )}
  
      {/* Listings Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {listings.length ? (
            listings.map((listing) => (
              <Link 
                key={listing.id} 
                href={`/listing/${listing.id}`}
                className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                  <Image
                    src={listing.photos?.length > 0 ? listing.photos[0].photoUrl : "/placeholder.jpg"}
                    alt={listing.title || "No Image Available"}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-in-out"
                    unoptimized={listing.photos?.length === 0}
                  />
                  <div className="absolute bottom-3 right-3 bg-blue-600 text-white px-3 py-1 text-sm font-semibold rounded-lg shadow-md z-20">
                    ${listing.price.toLocaleString()}
                  </div>
                </div>
                
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {listing.brand.name} {listing.model.name}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {listing.year}
                      </span>
                      <span className="inline-flex items-center bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {listing.mileage.toLocaleString()} km
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-200">
                      View Details
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full bg-gray-50 rounded-xl p-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No listings found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your filter criteria or check back later for new listings.
              </p>
              <button 
                onClick={resetFilters}
                className="mt-6 px-5 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 font-medium inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}
  
      {/* Pagination */}
      {!loading && !error && listings.length > 0 && (
        <div className="flex justify-center items-center mt-12">
          <div className="inline-flex shadow-sm rounded-md">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center px-6 py-3 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <div className="relative inline-flex items-center px-6 py-3 border-t border-b border-gray-300 bg-white text-sm text-gray-700">
              Page <span className="font-semibold mx-1">{page}</span> of <span className="font-semibold mx-1">{totalPages}</span>
            </div>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="relative inline-flex items-center px-6 py-3 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
