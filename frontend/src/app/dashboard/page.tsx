"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function UserDashboard() {
  const { token, user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]); 
  //const [listing, setListing] = useState<Listing | null>(null);
  const [favorites, setFavorites] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings");

  console.log(favorites, reports); 
  type Listing = {
    id: string;
    title: string;
    price: number;
    sellerId: string;
    brand: { name: string };
    model: { name: string };
  };

  useEffect(() => {
    if (!token || !user?.id) return;

    async function fetchData() {
      setLoading(true);
      try {
        const [listingsRes, favoritesRes, reportsRes] = await Promise.all([
          fetch(`${API_BASE}/listing/user/${user?.id}`).then((res) => res.json()),
          fetch(`${API_BASE}/favorites`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
          fetch(`${API_BASE}/reports`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
        ]);

        setListings(listingsRes || []);
        setFavorites(favoritesRes || []);
        setReports(reportsRes || []);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token, user?.id]);

  if (loading) return <p className="text-center text-gray-600">Loading dashboard...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-3xl font-bold text-center text-blue-900">User Dashboard</h1>

      <div className="flex justify-center mt-6 space-x-4 border-b pb-2">
        {["listings", "favorites", "reports"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 ${activeTab === tab ? "border-b-2 border-blue-600 font-semibold" : "text-gray-500"}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "listings" && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-black">My Listings</h2>
          {listings.length ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {listings.map((listing) => (
                <li key={listing.id} className="border p-4 rounded-lg shadow">
                  <Link href={`/listing/manage/${listing.id}`} className="text-blue-600 font-medium">
                    {listing.title}
                  </Link>
                  <p className="text-gray-600">${listing.price.toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You have no active listings.</p>
          )}
        </section>
      )}
    </div>
  );
}
