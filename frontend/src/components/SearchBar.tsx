"use client";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search for a vehicle..."
        className="w-full border rounded-md py-2 px-4 pl-10 focus:ring focus:ring-blue-300"
      />
      <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
    </div>
  );
}
