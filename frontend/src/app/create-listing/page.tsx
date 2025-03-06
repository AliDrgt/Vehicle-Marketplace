"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";


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
    });

    // Fetch Brands
    useEffect(() => {

      if (listingId) {
        fetch(`${API_BASE}/listing/${listingId}`)
            .then((res) => res.json())
            .then((data) => {
                setFormData({
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
        const url = listingId ? `${API_BASE}/listing/${listingId}` : `${API_BASE}/listing`;
        

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
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-lg mt-6">
          <h1 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">
            {listingId ? "Edit Listing" : "Create a Listing"}
          </h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {/* Brand */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium">Brand:</label>
              <select
                className="border p-2 w-full text-gray-800 bg-white rounded-md focus:ring-2 focus:ring-blue-400"
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
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium">Model:</label>
              <select
                className="border p-2 w-full text-gray-800 bg-white rounded-md focus:ring-2 focus:ring-blue-400"
                value={formData.modelId}
                onChange={(e) =>
                  setFormData({ ...formData, modelId: e.target.value })
                }
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
            </div>
      
            {/* Title */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium">Title:</label>
              <input
                type="text"
                className="border p-2 w-full text-gray-800 bg-white rounded-md focus:ring-2 focus:ring-blue-400"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
      
            {/* Price */}
            <div>
              <label className="block text-gray-700 font-medium">Price ($):</label>
              <input
                type="number"
                className="border p-2 w-full text-gray-800 bg-white rounded-md focus:ring-2 focus:ring-blue-400"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>
      
            {/* Mileage */}
            <div>
              <label className="block text-gray-700 font-medium">Mileage (km):</label>
              <input
                type="number"
                className="border p-2 w-full text-gray-800 bg-white rounded-md focus:ring-2 focus:ring-blue-400"
                value={formData.mileage}
                onChange={(e) =>
                  setFormData({ ...formData, mileage: e.target.value })
                }
                required
              />
            </div>
      
            {/* Year (Descending Order) */}
            <div>
                <label className="block text-gray-700 font-medium">Year:</label>
                <select
                    className="border p-2 w-full text-gray-800 bg-white rounded-md focus:ring-2 focus:ring-blue-400"
                    value={formData.year || ""}
                    onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                    }
                >
                    <option value="">-</option> {/* Allows the user to leave it empty */}
                    {[...Array(new Date().getFullYear() - 1949)]
                    .map((_, index) => new Date().getFullYear() - index)
                    .map((year) => (
                        <option key={year} value={year}>
                        {year}
                        </option>
                    ))}
                </select>
            </div>

      
            {/* Fuel Type */}
            <div>
                <label className="block text-gray-700 font-medium">Fuel Type:</label>
                <select
                    className="border p-2 w-full text-gray-800 bg-white rounded-md focus:ring-2 focus:ring-blue-400"
                    value={formData.fuelType || ""}
                    onChange={(e) =>
                    setFormData({ ...formData, fuelType: e.target.value })
                    }
                >
                    <option value="">-</option> {/* Allows user to leave it empty */}
                    {["Petrol", "Diesel", "Electric", "Hybrid", "CNG", "LPG"].map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                    ))}
                </select>
            </div>
      
            {/* Transmission */}
            <div>
                <label className="block text-gray-700 font-medium">Transmission:</label>
                <select
                    className="border p-2 w-full text-gray-800 bg-white rounded-md focus:ring-2 focus:ring-blue-400"
                    value={formData.transmission || ""}
                    onChange={(e) =>
                    setFormData({ ...formData, transmission: e.target.value })
                    }
                >
                    <option value="">-</option> {/* Default empty option */}
                    {["Manual", "Automatic", "CVT", "Semi-Automatic"].map((trans) => (
                    <option key={trans} value={trans}>
                        {trans}
                    </option>
                    ))}
                </select>
            </div>
      
            {/* Drivetrain */}
            <div>
                <label className="block text-gray-700 font-medium">Drivetrain:</label>
                <select
                    className="border p-2 w-full text-gray-800 bg-white rounded-md focus:ring-2 focus:ring-blue-400"
                    value={formData.drivetrain || ""}
                    onChange={(e) =>
                    setFormData({ ...formData, drivetrain: e.target.value })
                    }
                >
                    <option value="">-</option> {/* Default empty option */}
                    {["FWD", "RWD", "AWD", "4WD"].map((drive) => (
                    <option key={drive} value={drive}>
                        {drive}
                    </option>
                    ))}
                </select>
            </div>
      
            {/* Color Selection */}
            <div>
            <label className="block text-gray-700 font-medium">Color:</label>
            <select
                className="border p-2 w-full text-gray-800 bg-white rounded-md focus:ring-2 focus:ring-blue-400"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                required
            >
                <option value="">Select a Color</option>
                {["Black", "White", "Gray", "Silver", "Red", "Blue", "Green", "Yellow", "Brown", "Beige", "Orange", "Purple", "Pink"]
                .map((color) => (
                    <option key={color} value={color}>
                    {color}
                    </option>
                ))}
            </select>
            </div>
      
            {/* Engine Power */}
            <div>
              <label className="block text-gray-700 font-medium">
                Engine Power (HP):
              </label>
              <input
                type="number"
                className="border p-2 w-full text-gray-800 bg-white rounded-md focus:ring-2 focus:ring-blue-400"
                value={formData.enginePower}
                onChange={(e) =>
                  setFormData({ ...formData, enginePower: e.target.value })
                }
                required
              />
            </div>
      
            {/* Description */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium">Description:</label>
              <textarea
                className="border p-2 w-full text-gray-800 bg-white rounded-md focus:ring-2 focus:ring-blue-400 h-24"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
      
            {/* Second-Hand Status */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium">
                Second-Hand Status:
              </label>
              <select
                className="border p-2 w-full text-gray-800 bg-white rounded-md focus:ring-2 focus:ring-blue-400"
                value={String(formData.isSecondHand)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isSecondHand: e.target.value === "true",
                  })
                }
                required
              >
                <option value="true">Used</option>
                <option value="false">New</option>
              </select>
            </div>
      
            {/* Submit Button */}
            <div className="col-span-2 text-center">
            <button type="submit" className="bg-blue-600 text-white p-3 w-full text-lg font-semibold rounded-md hover:bg-blue-700 transition-all">
              {listingId ? "Update Listing" : "Create Listing"}
            </button>
            </div>
          </form>
        </div>
      );
      
      
  
}
