"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CldUploadWidget, CldImage } from 'next-cloudinary';
import { CloudinaryUploadWidgetResults } from 'next-cloudinary';


const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
//const CLOUDINARY_PRESET = "ml_default"; 


export default function CreateListing() {
    type Model = { id: number; name: string };
    const [models, setModels] = useState<Model[]>([]);
    type Brand = { id: number; name: string };
    const [brands, setBrands] = useState<Brand[]>([]);
    const searchParams = useSearchParams();
    const listingId = searchParams.get("id"); //Get listing ID from URL
    const router = useRouter();

    const [formData, setFormData] = useState({
        brandId: "",
        modelId: "",
        title: "",
        price: "",
        mileage: "",
        year: "",
        fuelType: "",
        transmission: "",
        drivetrain: "",
        color: "",
        description: "",
        location: { latitude: 40.7128, longitude: -74.0060 }, // Placeholder location
        enginePower: "",
        isSecondHand: false,
        photos: [] as string[],
    });

    // Fetch Brands
    useEffect(() => {

      if (listingId) {
        fetch(`${API_BASE}/listing/${listingId}`)
            .then((res) => res.json())
            .then((data) => {
                setFormData({//Populate form with existing listing data
                    brandId: String(data.brand.id),
                    modelId: String(data.model.id),
                    title: data.title,
                    price: String(data.price),
                    mileage: String(data.mileage),
                    year: String(data.year),
                    fuelType: data.fuelType,
                    transmission: data.transmission,
                    drivetrain: data.drivetrain,
                    color: data.color,
                    description: data.description,
                    location: data.location,
                    enginePower: String(data.enginePower || ""),
                    isSecondHand: Boolean(data.isSecondHand),
                    photos: Array.isArray(data.photos) ? data.photos.map((photo: { photoUrl: string }) => photo.photoUrl) : [],
                });
                //Fetch models for the selected brand
                fetch(`${API_BASE}/listing/brands/${data.brand.id}/models`)
                    .then((res) => res.json())
                    .then((modelsData) => setModels(modelsData || []))
                    .catch(() => setModels([]));
            })
            .catch((err) => console.error("Error fetching listing:", err));
      }


        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No auth token found in localStorage");
            return;
        }

        fetch(`${API_BASE}/listing/brands`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setBrands(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Error fetching brands:", err));
    }, [listingId]);

    const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
      if (!result.info || typeof result.info !== "object" || !("secure_url" in result.info)) {
          console.error("Upload failed or no URL returned.");
          return;
      }
  
      const newPhotoUrl = result.info.secure_url as string;
      setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, newPhotoUrl],
      }));
    };
  

    // Fetch Models when a Brand is selected
    const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const brandId = e.target.value;
        setFormData({ ...formData, brandId, modelId: "" });

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No auth token found in localStorage");
            return;
        }

        fetch(`${API_BASE}/listing/brands/${brandId}/models`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setModels(Array.isArray(data) ? data : []))
            .catch(() => setModels([]));
    };
    
    // Handle Form Submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const method = listingId ? "PUT" : "POST"; //PUT for editing, POST for creating
        const url = listingId ? `${API_BASE}/listing/${listingId}` : `${API_BASE}/listing`; //URL for editing or creating
        

        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to create a listing.");
            return;
        }

        const listingData = {
            ...formData,
            brandId: Number(formData.brandId),
            modelId: Number(formData.modelId),
            price: Number(formData.price),
            mileage: Number(formData.mileage),
            year: Number(formData.year),
            enginePower: formData.enginePower ? Number(formData.enginePower) : null,
            isSecondHand: Boolean(formData.isSecondHand),
        };

        try {
          const response = await fetch(url, {
              method,
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(listingData),
          });
      
          if (!response.ok) {
              const errorData = await response.json();
              alert(`Error: ${errorData.message || "Unknown error"}`);
          } else {
              alert(listingId ? "Listing updated successfully!" : "Listing created successfully!");
              router.push("/dashboard");
          }
      } catch {
          alert("Failed to process the listing.");
      }
    };

    return (
      <div className="max-w-6xl mx-auto p-8 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-xl my-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
          {listingId ? "Update Your Vehicle" : "List Your Vehicle"}
        </h1>
        <p className="text-gray-700 text-center mb-8">
          {listingId ? "Edit the details of your listing" : "Fill in the details to showcase your vehicle to potential buyers"}
        </p>
    
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images Section */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Vehicle Photos
            </h2>
    
            <div className="bg-white p-4 rounded-lg border border-dashed border-gray-300 hover:border-blue-400 transition duration-300 mb-4">
              <CldUploadWidget
                options={{
                  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                }}
                onSuccess={(result: CloudinaryUploadWidgetResults) => handleUploadSuccess(result)}
              >
                {({ open }) => (
                  <div onClick={() => open()} className="cursor-pointer text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-700 mb-1">Drag and drop images or click to browse</p>
                    <p className="text-sm text-gray-700">High-quality photos attract more buyers</p>
                  </div>
                )}
              </CldUploadWidget>
            </div>
    
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {formData.photos.map((url, index) => (
                  <div key={index} className="relative group">
                    <CldImage
                      src={url}
                      width="200"
                      height="150"
                      alt="Vehicle Image"
                      className="rounded-md shadow-sm object-cover w-full h-32 border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        photos: formData.photos.filter((_, i) => i !== index)
                      })}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
    
          {/* Main Info Section */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Vehicle Information
            </h2>
    
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Brand */}
              <div className="col-span-full">
                <label className="block text-gray-900 font-semibold mb-2">Brand</label>
                <select
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={formData.brandId}
                  onChange={handleBrandChange}
                  required
                >
                  <option value="">Select a Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
    
              {/* Model */}
              <div className="col-span-full">
                <label className="block text-gray-900 font-semibold mb-2">Model</label>
                <select
                  className={`w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-700 transition-all duration-200 ${
                    !formData.brandId ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  value={formData.modelId}
                  onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                  required
                  disabled={!formData.brandId}
                >
                  <option value="">Select a Model</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
                {!formData.brandId && <p className="text-sm text-gray-700 mt-1">Please select a brand first</p>}
              </div>
            </div>
          </div>
    
          {/* Listing Details Section */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Listing Details
            </h2>
    
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              {/* Title */}
              <div className="md:col-span-3">
                <label className="block text-gray-900 font-semibold mb-2">Title</label>
                <input
                  type="text"
                  placeholder=""
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
    
              {/* Price */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">Price ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-700">$</span>
                  </div>
                  <input
                    type="number"
                    placeholder="25000"
                    className="w-full p-3 pl-8 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>
    
              {/* Mileage */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">Mileage (km)</label>
                <input
                  type="number"
                  placeholder="15000"
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  required
                />
              </div>
    
              {/* Year */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">Year</label>
                <select
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={formData.year || ""}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                >
                  <option value="">Select Year</option>
                  {[...Array(new Date().getFullYear() - 1949)]
                    .map((_, index) => new Date().getFullYear() - index)
                    .map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                </select>
              </div>
    
              {/* Color */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">Color</label>
                <select
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  required
                >
                  <option value="">Select Color</option>
                  {["Black", "White", "Gray", "Silver", "Red", "Blue", "Green", "Yellow", "Brown", "Beige", "Orange", "Purple", "Pink"].map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
    
              {/* Engine Power */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">Engine Power (HP)</label>
                <input
                  type="number"
                  placeholder="e.g. 250"
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={formData.enginePower}
                  onChange={(e) => setFormData({ ...formData, enginePower: e.target.value })}
                  required
                />
              </div>
    
              {/* Second-Hand Status */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">Condition</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`py-3 px-4 rounded-lg border transition-all duration-200 flex items-center justify-center ${
                      formData.isSecondHand === false
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => setFormData({ ...formData, isSecondHand: false })}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    New
                  </button>
                  <button
                    type="button"
                    className={`py-3 px-4 rounded-lg border transition-all duration-200 flex items-center justify-center ${
                      formData.isSecondHand === true
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => setFormData({ ...formData, isSecondHand: true })}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Used
                  </button>
                </div>
              </div>
            </div>
          </div>
    
          {/* Technical Specifications Section */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Technical Specifications
            </h2>
    
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              {/* Fuel Type */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">Fuel Type</label>
                <select
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={formData.fuelType || ""}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  required
                >
                  <option value="">Select Fuel Type</option>
                  {["Petrol", "Diesel", "Electric", "Hybrid", "CNG", "LPG"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
    
              {/* Transmission */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">Transmission</label>
                <select
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={formData.transmission || ""}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                  required
                >
                  <option value="">Select Transmission</option>
                  {["Manual", "Automatic", "CVT", "Semi-Automatic"].map((trans) => (
                    <option key={trans} value={trans}>
                      {trans}
                    </option>
                  ))}
                </select>
              </div>
    
              {/* Drivetrain */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">Drivetrain</label>
                <select
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={formData.drivetrain || ""}
                  onChange={(e) => setFormData({ ...formData, drivetrain: e.target.value })}
                  required
                >
                  <option value="">Select Drivetrain</option>
                  {["FWD", "RWD", "AWD", "4WD"].map((drive) => (
                    <option key={drive} value={drive}>
                      {drive}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
    
          {/* Description Section */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Vehicle Description
            </h2>
    
            <textarea
              placeholder="Provide a detailed description of your vehicle including condition, features, service history, and any other information that might be valuable to potential buyers..."
              className="w-full p-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-700 h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <p className="text-sm text-gray-700 mt-2">
              Detailed descriptions help buyers make informed decisions and increase the likelihood of a quick sale
            </p>
          </div>
    
          {/* Submit Section */}
          <div className="flex items-center justify-between pt-6">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="py-3 px-6 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Cancel
            </button>
            <button
              type="submit"
              className="py-3 px-8 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 shadow-md flex items-center"
            >
              {listingId ? "Update Listing" : "Publish Listing"}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    );
    
    
      
      
  
}
