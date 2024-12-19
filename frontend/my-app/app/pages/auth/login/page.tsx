'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/utils/axiosInstance";
import {jwtDecode} from "jwt-decode";
import Link from "next/link";

let backend_url = "http://localhost:3001";

interface LoginResponse {
  access_token: string; // JWT token
  user: { // Add the user object here to match the structure in the response
    username: string;
    isAdmin: boolean;
  };
}


const LoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  // Define the correct interface for the decoded token
interface DecodedToken {
  username: string;  // Username field directly at the root
  isAdmin: boolean;     // Role field directly at the root
  exp: number;       // Expiration time
}


const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    console.log("Attempting login with:", { username, password });

    const response = await axiosInstance.post<LoginResponse>(`${backend_url}/auth/login`, {
      username,
      password,
    });

    if (response.status === 200 || response.status === 201) {
      const { access_token } = response.data;

      if (access_token) {
        try {
          // Decoding the JWT
          const decodedToken: DecodedToken = jwtDecode<DecodedToken>(access_token);

          console.log("Decoded token:", decodedToken);

          if (decodedToken.username && decodedToken.isAdmin !== undefined) {
            localStorage.setItem("username", decodedToken.username);
            localStorage.setItem("isAdmin", decodedToken.isAdmin.toString());

            if (decodedToken.isAdmin) {
              router.push("/pages/admin/admin-dashboard");
            } else {
              router.push("/pages/client/homepage");
            }
          } else {
            console.error("Invalid token structure:", decodedToken);
            alert("Login failed. Invalid token structure.");
          }
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
          alert("Login failed. Unable to decode token.");
        }
      } else {
        console.error("No access token received.");
        alert("Login failed. Please check your credentials.");
      }
    } else {
      console.error("Login failed with response:", response);
      alert("Login failed. Please check your credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed. Please check your credentials.");
  }
};

  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Overlay */}
      <div className="bg-black bg-opacity-50 min-h-screen w-full flex items-center justify-center px-4">
        <div className="bg-white bg-opacity-90 shadow-xl rounded-lg p-8 w-full max-w-md">
          {/* Title */}
          <h1 className="text-3xl font-bold text-black text-center mb-6">Welcome Back</h1>
          <p className="text-black text-center mb-8">
            Log in to access your account and enjoy our exclusive dining experience.
          </p>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-black">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-gray-700 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#C9A47F] focus:border-[#C9A47F]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-gray-700 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#C9A47F] focus:border-[#C9A47F]"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#C9A47F] text-white font-semibold rounded-lg hover:bg-[#b1906b] shadow-md transition duration-300"
            >
              Login
            </button>
          </form>

          {/* Signup Link */}
          <p className="mt-6 text-center text-black">
            Don't have an account?{" "}
            <Link href="/pages/auth/signup" className="text-[#C9A47F] font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
