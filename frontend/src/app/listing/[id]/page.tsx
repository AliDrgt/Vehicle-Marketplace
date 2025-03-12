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
  // const [reportSuccess, setReportSuccess] = useState("");
  const [reportError, setReportError] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(
    listing?.photos?.length ? listing.photos[0].photoUrl : null
  );

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
    // setReportSuccess("");

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
      // setReportSuccess("Report submitted successfully.");
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
    <div className="min-h-screen bg-gray-50">
      {!listing ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Hero Section with Image Gallery */}
          <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            {/* Main Image */}
            <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
              {listing.photos && listing.photos.length > 0 ? (
                <div className="absolute inset-0">
                  <CldImage
                    src={selectedImage || listing.photos[0].photoUrl}
                    fill
                    alt={listing.title}
                    className="object-cover w-full h-full opacity-80"
                    onError={(e) => (e.currentTarget.src = '/fallback-image.jpg')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-gray-800"></div>
              )}
  
              {/* Floating Header Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">
                        {listing.brand.name} {listing.model.name}
                      </h1>
                      <p className="text-xl font-light text-gray-200 mb-2">{listing.title}</p>
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center bg-blue-600/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold">
                          {listing.year}
                        </span>
                        <span className="inline-flex items-center bg-blue-600/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold">
                          {listing.mileage.toLocaleString()} km
                        </span>
                        <span className="inline-flex items-center bg-blue-600/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold">
                          {listing.fuelType}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-3xl md:text-4xl font-bold text-white">
                        ${listing.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Thumbnail Gallery */}
            {listing.photos && listing.photos.length > 1 && (
              <div className="bg-gray-900/90 backdrop-blur-md py-4 border-t border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="flex overflow-x-auto pb-2 space-x-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {listing.photos.map((photo, index) => (
                      <div key={index} className="flex-shrink-0 h-20 w-32 rounded-md overflow-hidden">
                        <CldImage
                          src={photo.photoUrl}
                          width={150}
                          height={100}
                          alt={`${listing.title} - photo ${index + 1}`}
                          className={`h-full w-full object-cover cursor-pointer transform hover:scale-110 transition duration-300 
                            ${selectedImage === photo.photoUrl ? 'border-2 border-blue-500' : 'border border-gray-300'}`}
                          onClick={() => setSelectedImage(photo.photoUrl)} //Update selected image
                          onError={(e) => (e.currentTarget.src = '/fallback-image.jpg')}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
  
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Vehicle Details */}
              <div className="lg:col-span-2">
                {/* Quick Info Section */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                  <div className="flex justify-between items-center border-b border-gray-100 p-4">
                    <h2 className="text-xl font-bold text-gray-800">Vehicle Overview</h2>
                    <button
                      onClick={handleFavoriteToggle}
                      className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors"
                    >
                      <span className={`text-xl ${isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}>
                        {isFavorite ? "★" : "☆"}
                      </span>
                      <span className="font-medium text-gray-700">
                        {isFavorite ? "Saved" : "Save"}
                      </span>
                    </button>
                  </div>
  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                    <div className="p-5 border-b md:border-b-0 md:border-r border-gray-100">
                      <p className="text-xs uppercase text-gray-500 font-medium mb-1">Make & Model</p>
                      <p className="font-semibold text-gray-800">
                        {listing.brand.name} {listing.model.name}
                      </p>
                    </div>
                    <div className="p-5 border-b md:border-b-0 md:border-r border-gray-100">
                      <p className="text-xs uppercase text-gray-500 font-medium mb-1">Year</p>
                      <p className="font-semibold text-gray-800">{listing.year}</p>
                    </div>
                    <div className="p-5 border-b md:border-b-0 md:border-r border-gray-100">
                      <p className="text-xs uppercase text-gray-500 font-medium mb-1">Mileage</p>
                      <p className="font-semibold text-gray-800">{listing.mileage.toLocaleString()} km</p>
                    </div>
                    <div className="p-5">
                      <p className="text-xs uppercase text-gray-500 font-medium mb-1">Color</p>
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded-full mr-2 bg-${listing.color.toLowerCase().replace(' ', '-')}-500`}></div>
                        <p className="font-semibold text-gray-800">{listing.color}</p>
                      </div>
                    </div>
                  </div>
                </div>
  
                {/* Detailed Specs Section */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                  <div className="border-b border-gray-100 p-4">
                    <h2 className="text-xl font-bold text-gray-800">Detailed Specifications</h2>
                  </div>
  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex space-x-4 items-center">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Fuel Type</p>
                          <p className="font-semibold text-gray-800">{listing.fuelType}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-4 items-center">
                        <div className="bg-purple-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Transmission</p>
                          <p className="font-semibold text-gray-800">{listing.transmission}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-4 items-center">
                        <div className="bg-green-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Drivetrain</p>
                          <p className="font-semibold text-gray-800">{listing.drivetrain || "N/A"}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-4 items-center">
                        <div className="bg-yellow-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Color</p>
                          <p className="font-semibold text-gray-800">{listing.color}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  
                {/* Description Section */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                  <div className="border-b border-gray-100 p-4">
                    <h2 className="text-xl font-bold text-gray-800">Description</h2>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {listing.description}
                    </p>
                  </div>
                </div>
  
                {/* Photo Gallery (Large View) */}
                {listing.photos && listing.photos.length > 0 && (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="border-b border-gray-100 p-4">
                      <h2 className="text-xl font-bold text-gray-800">Photo Gallery</h2>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {listing.photos.map((photo, index) => (
                          <div key={index} className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CldImage
                              src={photo.photoUrl}
                              width={600}
                              height={400}
                              alt={`${listing.title} - photo ${index + 1}`}
                              className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-500"
                              onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
  
              {/* Right Column - CTA and Contact */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  {/* CTA Card */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-gray-200">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                      <h3 className="text-white text-xl font-bold">Interested in this vehicle?</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-6">Contact the seller directly to inquire about this vehicle or arrange a viewing.</p>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        Contact Seller
                      </button>
                      <button className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Request More Info
                      </button>
                    </div>
                  </div>
  
                  {/* Safety Tips Card */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="border-b border-gray-100 p-4">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Safety Tips
                      </h3>
                    </div>
                    <div className="p-4">
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Inspect the vehicle in person or via video call before purchasing
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Meet in a public place for viewings
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verify all vehicle documentation
                        </li>
                      </ul>
                    </div>
                  </div>
  
                  {/* Report Section */}
                  {token && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="p-4">
                        {!reportOpen && !reportSubmitted ? (
                          <button
                            onClick={() => setReportOpen(true)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Report This Listing
                          </button>
                        ) : reportSubmitted ? (
                          <p className="text-green-600 text-sm font-medium flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Report submitted successfully
                          </p>
                        ) : (
                          <div className="mt-2 p-4 border border-gray-200 rounded-lg bg-white">
                            <h4 className="font-medium text-gray-800 mb-2">Report this listing</h4>
                            <textarea
                              className="w-full p-3 border border-gray-300 rounded mb-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              placeholder="Please explain why you're reporting this listing"
                              rows={4}
                              value={reportReason}
                              onChange={(e) => setReportReason(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleReportSubmit}
                                className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                              >
                                Submit
                              </button>
                              <button
                                onClick={() => {
                                  setReportOpen(false);
                                  setReportError("");
                                }}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                            {reportError && <p className="text-red-500 mt-2 text-sm">{reportError}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
  
          {/* Mobile Sticky CTA */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800 font-bold text-lg">${listing.price.toLocaleString()}</p>
                <p className="text-gray-500 text-sm">{listing.year} {listing.brand.name}</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors text-sm">
                Contact Seller
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
