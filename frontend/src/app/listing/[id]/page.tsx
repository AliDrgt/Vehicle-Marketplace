"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider"; // Adjust import as needed
import { CldImage } from "next-cloudinary";

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
  photos:{photoUrl: string }[];
};

export default function ListingDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Report states
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSuccess, setReportSuccess] = useState("");
  const [reportError, setReportError] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE}/listing/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched listing data:", data);
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
        router.push("/auth/login");
        return;
    }

    try {
        if (isFavorite) {
            // Remove favorite (Correct DELETE request with body)
            const deleteRes = await fetch(`${API_BASE}/favorites`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ listing_id: id }), //Send listing_id in body
            });

            if (!deleteRes.ok) throw new Error("Failed to remove favorite");

            setIsFavorite(false);
        } else {
            // Add favorite
            const res = await fetch(`${API_BASE}/favorites`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
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


  const handleReportSubmit = async () => {
    setReportError("");
    setReportSuccess("");

    if (!token) {
      router.push("/auth/login");
      return;
    }
    if (!reportReason.trim()) {
      setReportError("Please enter a reason for reporting.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId: id, reason: reportReason }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit report.");
      }
      setReportSuccess("Report submitted successfully.");
      setReportSubmitted(true);
      setReportOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        setReportError(err.message);
      } else {
        setReportError("An unknown error occurred.");
      }
    }
  };

  if (!listing) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4 text-black">{listing.title}</h1>
        <button
          onClick={handleFavoriteToggle}
          className="text-2xl text-yellow-500 hover:text-yellow-400 transition group"
        >
          {isFavorite ? "⭐" : <span className="group-hover:text-yellow-400">☆</span>}
        </button>
      </div>
      <p className="text-xl font-semibold text-blue-600 mb-2">${listing.price.toLocaleString()}</p>
      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <p>
          <strong>Brand:</strong> {listing.brand.name}
        </p>
        <p>
          <strong>Model:</strong> {listing.model.name}
        </p>
        <p>
          <strong>Year:</strong> {listing.year}
        </p>
        <p>
          <strong>Mileage:</strong> {listing.mileage.toLocaleString()} km
        </p>
        <p>
          <strong>Fuel Type:</strong>{" "}
          <span className="bg-green-200 text-green-800 px-2 py-1 rounded">{listing.fuelType}</span>
        </p>
        <p>
          <strong>Transmission:</strong>{" "}
          <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded">{listing.transmission}</span>
        </p>
        <p>
          <strong>Drivetrain:</strong> {listing.drivetrain || "N/A"}
        </p>
        <p>
          <strong>Color:</strong> {listing.color}
        </p>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold text-black">Vehicle Photos:</h2>
        {listing.photos && listing.photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {listing.photos?.map((photo, index) => (
                <CldImage
                    key={index}
                    src={photo.photoUrl} //Ensure we're accessing `photo.photoUrl`
                    width="300"
                    height="200"
                    alt={`Listing photo ${index + 1}`}
                    className="rounded-lg shadow-md"
                    onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")} // ✅ Use fallback image if loading fails
                />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No photos available.</p>
        )}
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold text-black">Description:</h2>
        <p className="text-gray-600 bg-gray-100 p-3 rounded-lg">{listing.description}</p>
      </div>
      {/* Report Section */}
    {token && (
        <div className="mt-6">
    {!reportOpen && !reportSubmitted && (
      <button
        onClick={() => setReportOpen(true)}
        className="text-red-600 hover:underline text-lg font-medium"
      >
        Report Listing
      </button>
    )}
    {reportOpen && !reportSubmitted && (
      <div className="mt-2 p-4 border border-gray-300 rounded-lg bg-white shadow">
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter reason for reporting this listing"
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={handleReportSubmit}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Submit Report
          </button>
          <button
            onClick={() => {
              setReportOpen(false);
              setReportError("");
            }}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
        {reportError && <p className="text-red-500 mt-2">{reportError}</p>}
        {reportSuccess && <p className="text-green-500 mt-2">{reportSuccess}</p>}
      </div>
    )}
    {reportSubmitted && (
      <p className="text-green-600 mt-2 font-medium">Report submitted successfully.</p>
    )}
  </div>
)}
    </div>
  );
}
