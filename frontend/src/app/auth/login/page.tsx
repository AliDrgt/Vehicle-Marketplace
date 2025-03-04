"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/components/AuthProvider"; 

export default function LoginPage() {
  const { token, login } = useAuth(); //Get global auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  //If user is already logged in, redirect them to dashboard
  useEffect(() => {
    if (token) {
      router.push("/dashboard"); // Redirect if token is already set
    }
  }, [token, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:4000/auth/login", { email, password });

      if (response.status === 201 && response.data.accessToken) {
        login(response.data.accessToken);
        router.push("/dashboard"); //Redirect after login
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-96">
        {registered && (
          <p className="text-green-400 text-center font-semibold mb-4">
            Registration successful! Please log in.
          </p>
        )}
        <h2 className="text-2xl font-bold text-center text-white mb-4">Login</h2>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:ring focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:ring focus:ring-blue-500"
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Don’t have an account? <a href="/auth/register" className="text-blue-400 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}
