"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider"; // Adjust the import based on your folder structure

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
};

export default function ListingDetails() {
    const { id } = useParams();
    const { token } = useAuth(); // Get token from AuthProvider
    const router = useRouter();
    const [listing, setListing] = useState<Listing | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (!id) return;

        fetch(`${API_BASE}/listing/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data && data.id) {
                    setListing(data);
                } else {
                    console.error("Invalid listing data:", data);
                }
            })
            .catch((err) => console.error("Error fetching listing details:", err));

        if (token) {
            fetch(`${API_BASE}/favorites`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data: { listingId: string }[]) => {
                    if (data.some((fav) => fav.listingId === id)) {
                        setIsFavorite(true);
                    }
                })
                .catch((err) => console.error("Error fetching favorites:", err));
        }
    }, [id, token]);

    const handleFavoriteToggle = async () => {
        if (!token) {
            router.push("/auth/login"); // Redirect to login if not logged in
            return;
        }
    
        try {
            if (isFavorite) {
                // Step 1: Fetch the favorite ID before deleting
                const favoriteRes = await fetch(`${API_BASE}/favorites`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                
                if (!favoriteRes.ok) throw new Error("Failed to get favorite ID");
                const favorites = await favoriteRes.json();
                const favorite = favorites.find((fav: { id: string; listingId: string }) => fav.listingId === id);
                

    
                if (!favorite) throw new Error("Favorite not found");
    
                // Step 2: Delete favorite using favorite_id in URL
                const deleteRes = await fetch(`${API_BASE}/favorites/${favorite.id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
    
                if (!deleteRes.ok) throw new Error("Failed to remove favorite");
    
                setIsFavorite(false);
            } else {
                // Step 3: Add favorite normally
                const res = await fetch(`${API_BASE}/favorites`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ listing_id: id }),
                });
    
                if (!res.ok) throw new Error("Failed to add favorite");
    
                setIsFavorite(true);
            }
        } catch (error) {
            console.error("Error updating favorite:", error);
        }
    };
    
    

    if (!listing) {
        return <p className="text-center text-gray-600">Loading...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold mb-4 text-black">{listing.title}</h1>
                {/* Favorite Button with Hover Effect */}
                <button 
                    onClick={handleFavoriteToggle} 
                    className="text-2xl text-yellow-500 hover:text-yellow-400 transition group"
                >
                    {isFavorite ? "⭐" : <span className="group-hover:text-yellow-400">☆</span>}
                </button>
            </div>
            <p className="text-xl font-semibold text-blue-600 mb-2">${listing.price.toLocaleString()}</p>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
                <p><strong>Brand:</strong> {listing.brand.name}</p>
                <p><strong>Model:</strong> {listing.model.name}</p>
                <p><strong>Year:</strong> {listing.year}</p>
                <p><strong>Mileage:</strong> {listing.mileage.toLocaleString()} km</p>
                <p><strong>Fuel Type:</strong> <span className="bg-green-200 text-green-800 px-2 py-1 rounded">{listing.fuelType}</span></p>
                <p><strong>Transmission:</strong> <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded">{listing.transmission}</span></p>
                <p><strong>Drivetrain:</strong> {listing.drivetrain || "N/A"}</p>
                <p><strong>Color:</strong> {listing.color}</p>
            </div>
            <div className="mt-4">
                <h2 className="text-lg font-semibold text-black">Description:</h2>
                <p className="text-gray-600 bg-gray-100 p-3 rounded-lg">{listing.description}</p>
            </div>
        </div>
    );    
}
