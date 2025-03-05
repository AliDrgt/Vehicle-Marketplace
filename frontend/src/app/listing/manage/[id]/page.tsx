"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Listing = {
  id: string;
  title: string;
  price: number;
  brand: { id: number; name: string };
  model: { id: number; name: string };
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  drivetrain: string;
  color: string;
  description: string;
  sellerId: string;
};

export default function ManageListing() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    if (!id || !token || !user?.id) return;
  
    // Fetch listing details (Requires auth)
    fetch(`${API_BASE}/listing/${id}`, {
      headers: { Authorization: `Bearer ${token}` }, 
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.sellerId !== user.id) {
          router.push(`/listing/${id}`); // Redirect if not the seller
        } else {
          setListing(data);
        }
      })
      .catch((err) => console.error("Error fetching listing details:", err));
  
    // Fetch favorite count (No auth needed)
    fetch(`${API_BASE}/favorites/count/${id}`)
      .then((res) => res.json())
      .then((data) => setFavoriteCount(data.count || 0))
      .catch((err) => console.error("Error fetching favorite count:", err));
  }, [id, token, user, router]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    await fetch(`${API_BASE}/listing/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    router.push("/dashboard");
  };

  if (!listing) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-3xl font-bold mb-4 text-black">{listing.title}</h1>
      <p className="text-xl font-semibold text-blue-600 mb-2">${listing.price.toLocaleString()}</p>
      <p className="text-gray-600">Favorited by {favoriteCount} users</p>

      <div className="grid grid-cols-2 gap-4 text-gray-700 mt-4">
        <p><strong>Brand:</strong> {listing.brand.name}</p>
        <p><strong>Model:</strong> {listing.model.name}</p>
        <p><strong>Year:</strong> {listing.year}</p>
        <p><strong>Mileage:</strong> {listing.mileage.toLocaleString()} km</p>
        <p><strong>Fuel Type:</strong> {listing.fuelType}</p>
        <p><strong>Transmission:</strong> {listing.transmission}</p>
        <p><strong>Drivetrain:</strong> {listing.drivetrain || "N/A"}</p>
        <p><strong>Color:</strong> {listing.color}</p>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold text-black">Description:</h2>
        <p className="text-gray-600 bg-gray-100 p-3 rounded-lg">{listing.description}</p>
      </div>

      <div className="mt-6 flex space-x-4">
      <button
        onClick={() => router.push(`/create-listing?id=${listing.id}`)} //Pass ID for editing
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
        Edit Listing
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Listing
        </button>
      </div>
    </div>
  );
}
