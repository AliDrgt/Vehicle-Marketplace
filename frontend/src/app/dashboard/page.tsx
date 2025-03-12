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
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl font-display">
          My Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your listings and saved vehicles
        </p>
      </header>
      
      <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 border border-gray-100">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          {["listings", "favorites"].map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 text-center py-5 px-4 text-sm font-medium transition-all duration-200 
                ${activeTab === tab 
                  ? "text-blue-600 bg-blue-50/30" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className={`h-5 w-5 ${activeTab === tab ? "text-blue-500" : "text-gray-400"}`}>
                  {tab === "listings" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="transition-all duration-200">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="transition-all duration-200">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                <span className="font-medium">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              </div>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 animate-fadeIn"></div>
              )}
            </button>
          ))}
        </div>
        
        {/* Content Area */}
        <div className="p-6 lg:p-8 min-h-[60vh]">
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
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold text-gray-800">My Listings</h2>
      <Link href="/listing/create-listing">
        <span className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all duration-150 hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Listing
        </span>
      </Link>
    </div>
    {listings.length ? (
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} onDelete={handleDelete} />
        ))}
      </ul>
    ) : (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">No active listings</h3>
        <p className="text-gray-500 mb-6 text-center max-w-sm">Create your first listing to start selling your vehicle</p>
        <Link href="/listing/create-listing">
          <span className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all duration-150 hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create a Listing
          </span>
        </Link>
      </div>
    )}
  </section>
);
}



function ListingCard({ listing, onDelete }: { listing: Listing; onDelete: (id: string) => void }) {
  return (
    <li className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col relative overflow-hidden">
      <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-gray-800 bg-opacity-70 rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      <div className="flex-1 p-6">
        <Link href={`/listing/${listing.id}`}>
          <span className="block text-blue-600 font-semibold text-xl hover:text-blue-700 transition-colors line-clamp-2 mb-1">
            {listing.title}
          </span>
        </Link>
        <div className="flex items-center mt-2 mb-4">
          <span className="inline-flex items-center justify-center bg-green-100 rounded-full px-3 py-0.5">
            <span className="text-green-800 text-sm font-medium">
              ${listing.price.toLocaleString()}
            </span>
          </span>
        </div>
      </div>
      
      <div className="border-t border-gray-100 bg-gray-50 flex justify-between p-4">
        <Link href={`/listing/create-listing/?id=${listing.id}`}>
          <span className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </span>
        </Link>
        <button 
          className="inline-flex items-center text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
          onClick={() => onDelete(listing.id)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Favorite Listings</h2>
        <Link href="/listings">
          <span className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse More Vehicles
          </span>
        </Link>
      </div>
      {favorites.length ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <li key={fav.id} className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
              <div className="absolute right-4 top-4">
                <div className="bg-pink-100 rounded-full p-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="p-6">
                <Link href={`/listing/${fav.id}`}>
                  <span className="block text-blue-600 font-semibold text-xl hover:text-blue-700 transition-colors mb-1 line-clamp-2">
                    {fav.title || "Untitled"}
                  </span>
                </Link>
                <div className="flex items-center mt-3">
                  <span className="inline-flex items-center justify-center bg-blue-100 rounded-full px-3 py-0.5">
                    <span className="text-blue-800 text-sm font-medium">
                      ${fav.price?.toLocaleString() || "N/A"}
                    </span>
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 bg-gray-50 p-4 flex justify-end">
                <Link href={`/listing/${fav.id}`}>
                  <span className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="rounded-full bg-gray-100 p-4 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No favorite listings yet</h3>
          <p className="text-gray-500 mb-6 text-center max-w-sm">Save listings you&aposre interested in to compare them later</p>
          <Link href="/listing/search">
            <span className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all duration-150 hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Vehicles
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}
