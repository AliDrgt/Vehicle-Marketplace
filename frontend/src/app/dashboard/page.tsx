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
            return []; // Fallback to an empty array on error
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
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-center text-red-600" role="alert">{error}</p>
      </div>
    );
  }

  return (
  <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
    <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">User Dashboard</h1>
    <div className="flex justify-center mb-6 border-b">
      {["listings", "favorites"].map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={activeTab === tab}
          onClick={() => setActiveTab(tab)}
          className={`px-6 py-2 text-lg font-medium transition-all duration-200 rounded-t-md ${
            activeTab === tab ? "border-b-4 border-blue-500 text-gray-900" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>

    {activeTab === "listings" && <ListingsSection listings={listings} />}
    {activeTab === "favorites" && <FavoritesSection favorites={favorites} />}
  </div>
);

}

function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse flex space-x-4 p-4 bg-white shadow rounded-lg">
          <div className="rounded bg-gray-300 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}


interface Listing {
  id: string;
  title: string;
  price: number;
}

function ListingsSection({ listings }: { listings: Listing[] }) {
  return (
    <section className="mt-8" aria-label="My Listings">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Listings</h2>
      {listings.length ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h3.6a1 1 0 01.8.4l1.6 2h5a1 1 0 01.8.4l1.6 2H19a2 2 0 012 2v8a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-400">You have no active listings.</p>
        </div>
      )}
    </section>
  );
}


function ListingCard({ listing }: { listing: Listing }) {
  return (
    <li className="bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex flex-col">
      <Link href={`/listing/manage/${listing.id}`}>
        <span className="text-blue-600 font-semibold text-xl hover:underline transition-colors">{listing.title}</span>
      </Link>
      <p className="text-gray-600 mt-2">${listing.price.toLocaleString()}</p>
      <div className="mt-auto flex space-x-4 pt-4">
        <Link href={`/create-listing/?id=${listing.id}`}>
          <span className="text-sm text-green-600 hover:underline">Edit</span>
        </Link>
        <button className="text-sm text-red-600 hover:underline" onClick={() => console.log("Delete", listing.id)}>
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
    <section className="mt-8" aria-label="Favorite Listings">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Favorite Listings</h2>
      {favorites.length ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <li key={fav.id} className="bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex flex-col">
              <Link href={`/listing/${fav.id}`}>
                <span className="text-blue-600 font-semibold text-xl hover:underline transition-colors">
                  {fav.title || "Untitled"}
                </span>
              </Link>
              <p className="text-gray-600 mt-2">${fav.price?.toLocaleString() || "N/A"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h3.6a1 1 0 01.8.4l1.6 2h5a1 1 0 01.8.4l1.6 2H19a2 2 0 012 2v8a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-400">You have no favorite listings.</p>
        </div>
      )}
    </section>
  );
}
