"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider"; 

export default function Navbar() {
  console.log("Navbar is rendering...");
  const { token, logout, user } = useAuth(); 
  console.log("Navbar Token:", token);
  const router = useRouter();

  const handleLogout = () => {
    logout(); // 
    router.push("/"); 
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Vehicle Marketplace
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/listings" className="text-gray-700 hover:text-blue-600 cursor-pointer">Listings</Link>
            <Link 
              href={user?.role === "ADMIN" ? "/admin" : "/dashboard"} 
              className="text-gray-700 hover:text-blue-600 cursor-pointer"
            >
              {user?.role === "admin" ? "Admin Panel" : "Dashboard"}
            </Link>
            <Link href="/listing/create-listing" className="text-gray-700 hover:text-blue-600 cursor-pointer">+ Create Listing</Link>
            

            {token ? (
              <button onClick={handleLogout} className="text-red-600 hover:text-red-800 cursor-pointer transition">
                Logout
              </button>
            ) : (
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 cursor-pointer transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
