"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function UserDashboard() {
  const { token, user } = useAuth();
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("listings");

  useEffect(() => {
    if (!token || !user?.id) return;
    setLoading(true);
    setError(null);

    async function fetchData() {
      try {
        const [listingsRes] = await Promise.all([
          fetch(`${API_BASE}/listing/user/${user?.id}`).then((res) => res.json()),
        ]);
    
        // Fetch favorites separately
        const favoritesRes = await fetch(`${API_BASE}/favorites`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        })
          .then((res) => res.json())
          .catch((err) => {
            console.error("Error fetching favorites:", err);
            return []; 
          });
    
        // Extract `listing` object from each favorite
        const formattedFavorites = Array.isArray(favoritesRes)
          ? favoritesRes.map((fav) => fav.listing)
          : [];
    
        setListings(listingsRes || []);
        setFavorites(formattedFavorites);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token, user?.id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden">
            <div className="flex border-b border-gray-100 pb-4 mb-4">
              <div className="w-1/2 pr-2">
                <div className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="w-1/2 pl-2">
                <div className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-48">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                  <div className="mt-auto pt-6 flex space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-red-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-xl font-medium text-red-600 mb-2" role="alert">Unable to load dashboard</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

// Main Dashboard Layout
return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Dashboard Header with Gradient Accent */}
      <header className="relative mb-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10 rounded-3xl"></div>
        <div className="relative z-10 px-8 py-10">
          <h1 className="text-4xl font-bold text-gray-900 font-display tracking-tight">
            My Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-xl">
            Manage your vehicle listings and saved favorites in one place
          </p>
        </div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-20 rounded-full blur-2xl"></div>
      </header>
      
      {/* Main Content Container */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 border border-gray-100">
        {/* Tab Navigation - Refined */}
        <div className="flex border-b border-gray-200">
          {["listings", "favorites"].map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 text-center py-6 px-4 text-base font-medium transition-all duration-300 overflow-hidden
                ${activeTab === tab 
                  ? "text-blue-700 bg-gradient-to-b from-blue-50 to-transparent" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <span className={`h-6 w-6 transition-all duration-300 ${activeTab === tab ? "text-blue-600" : "text-gray-400"}`}>
                  {tab === "listings" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.5 3.75a1.5 1.5 0 0 0-1.5 1.5v1.5h13.5V5.25a1.5 1.5 0 0 0-1.5-1.5h-10ZM6 6.75v10.5a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5V6.75H6ZM1.5 5.25a3 3 0 0 1 3-3h15a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3v-12Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                  )}
                </span>
                <span className="font-medium text-lg tracking-wide">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              </div>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform animate-fadeIn"></div>
              )}
            </button>
          ))}
        </div>
        
        {/* Content Area */}
        <div className="p-8 lg:p-10">
          {activeTab === "listings" && <ListingsSection listings={listings} />}
          {activeTab === "favorites" && <FavoritesSection favorites={favorites} />}
        </div>
      </div>
    </div>
  </div>
);

}

// function SkeletonLoader() {
//   return (
//     <div className="space-y-4">
//       {[1, 2, 3].map((i) => (
//         <div key={i} className="animate-pulse flex space-x-4 p-4 bg-white shadow rounded-lg">
//           <div className="rounded bg-gray-300 h-12 w-12"></div>
//           <div className="flex-1 space-y-4 py-1">
//             <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//             <div className="h-4 bg-gray-300 rounded"></div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


interface Listing {
  id: string;
  title: string;
  price: number;
}

function ListingsSection({ listings }: { listings: Listing[] }) {
  const { token } = useAuth();

  const handleDelete = async (listingId: string) => {
    console.log("🔹 Deleting listing:", listingId);
    console.log("🔹 Token being sent:", token); // Debugging

    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        console.log("Headers being sent:", headers); // Debugging

        const res = await fetch(`${API_BASE}/listing/${listingId}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({ isDeleted: true }), //Soft delete
        });

        console.log("🔹 Response status:", res.status);

        if (!res.ok) {
            throw new Error("Failed to delete listing");
        }

        alert("Listing deleted successfully.");
        window.location.reload();
    } catch (error) {
        console.error("❌ Error deleting listing:", error);
        alert("Error deleting listing. Please try again.");
    }
};

return (
  <section className="mt-2" aria-label="My Listings">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
        <span className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M7.5 3.75a1.5 1.5 0 0 0-1.5 1.5v1.5h13.5V5.25a1.5 1.5 0 0 0-1.5-1.5h-10ZM6 6.75v10.5a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5V6.75H6ZM1.5 5.25a3 3 0 0 1 3-3h15a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3v-12Z" />
          </svg>
        </span>
        My Listings
        <span className="ml-3 text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full">{listings.length}</span>
      </h2>
      <Link href="/listing/create-listing">
        <span className="group inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all duration-300 hover:shadow-lg focus:ring-4 focus:ring-blue-300 transform hover:-translate-y-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Listing
        </span>
      </Link>
    </div>
    {listings.length ? (
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} onDelete={handleDelete} />
        ))}
      </ul>
    ) : (
      <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="rounded-full bg-blue-100 p-5 mb-6 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">No Active Listings</h3>
        <p className="text-gray-600 mb-8 text-center max-w-md text-lg">Create your first listing to start selling your vehicle</p>
        <Link href="/listing/create-listing">
          <span className="group inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all duration-300 hover:shadow-lg focus:ring-4 focus:ring-blue-300 transform hover:-translate-y-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Your First Listing
          </span>
        </Link>
      </div>
    )}
  </section>
);
}



function ListingCard({ listing, onDelete }: { listing: Listing; onDelete: (id: string) => void }) {
  return (
    <li className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden transform hover:-translate-y-1">
      {/* Mock image placeholder - would use actual image in production */}
      <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
          <div className="flex space-x-2">
            <Link href={`/listing/create-listing/?id=${listing.id}`} className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button 
              className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50"
              onClick={() => onDelete(listing.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-6">
        <Link href={`/listing/${listing.id}`}>
          <span className="block text-blue-700 font-bold text-xl hover:text-blue-800 transition-colors line-clamp-2 mb-2">
            {listing.title}
          </span>
        </Link>
        <div className="flex items-center mt-4">
          <span className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg px-4 py-1.5">
            <span className="text-white font-bold text-lg">
              ${listing.price.toLocaleString()}
            </span>
          </span>
        </div>
      </div>
      
      <div className="border-t border-gray-100 bg-gray-50 p-4 flex justify-between items-center">
        <Link href={`/listing/${listing.id}`} className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Details
        </Link>
        <div className="text-xs text-gray-500">Added March 5, 2025</div>
      </div>
    </li>
  );
}


interface Favorite {
  id: string;
  title: string;
  price: number;
}

function FavoritesSection({ favorites }: { favorites: Favorite[] }) {
  return (
    <section className="mt-2" aria-label="Favorite Listings">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="bg-pink-100 text-pink-700 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
          </span>
          Saved Vehicles
          <span className="ml-3 text-sm bg-pink-100 text-pink-800 py-1 px-3 rounded-full">{favorites.length}</span>
        </h2>
        <Link href="/listings">
          <span className="group inline-flex items-center text-base font-medium text-blue-700 hover:text-blue-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse More Vehicles
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </Link>
      </div>
      {favorites.length ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((fav) => (
            <li key={fav.id} className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden transform hover:-translate-y-1">
              {/* Mock image placeholder - would use actual image in production */}
              <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center justify-center p-2 bg-pink-100 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
              
              <div className="flex-1 p-6">
                <Link href={`/listing/${fav.id}`}>
                  <span className="block text-blue-700 font-bold text-xl hover:text-blue-800 transition-colors mb-2 line-clamp-2">
                    {fav.title || "Untitled Vehicle"}
                  </span>
                </Link>
                <div className="flex items-center mt-4">
                  <span className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg px-4 py-1.5">
                    <span className="text-white font-bold text-lg">
                      ${fav.price?.toLocaleString() || "N/A"}
                    </span>
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 bg-gray-50 p-4 flex justify-end">
                <Link href={`/listing/${fav.id}`}>
                  <span className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all duration-200 hover:shadow focus:outline-none group">
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-gray-100 bg-gradient-to-b from-gray-50 to-white">
          <div className="rounded-full bg-pink-100 p-5 mb-6 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No Favorite Vehicles Yet</h3>
          <p className="text-gray-600 mb-8 text-center max-w-md text-lg">Save vehicles you're interested in to compare them later</p>
          <Link href="/listings">
            <span className="group inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all duration-300 hover:shadow-lg focus:ring-4 focus:ring-blue-300 transform hover:-translate-y-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Vehicles Now
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}
