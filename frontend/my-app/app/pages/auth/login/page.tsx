'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/utils/axiosInstance";
import Link from "next/link";

let backend_url = "http://localhost:3001";

interface LoginResponse {
  user: {
    username: string;
    isAdmin: boolean;
  };
  access_token: string; // If your API returns a token as well
}

const LoginPage = () => {
  const [username, setUsername] = useState<string>(""); // Updated to use username
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      alert(`Enteredddd`);  // Checkpoint alert
      console.log("Attempting login with:", { username, password });
      const c={username,password};
      const response = await axiosInstance.post<LoginResponse>(`${backend_url}/auth/login`, {c});
      console.log("Attempting login with:2", { username, password });
      alert(`Enteredddd2`);  // Checkpoint alert
      const { status, data } = response;
      console.log("status", response.data);

      if (status === 200) { // Update status code to match typical success
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("isAdmin", data.user.isAdmin.toString()); // Ensure it's a string
      
        // Redirect based on admin status
        if (data.user.isAdmin) {
          router.push("/admin/dashboard"); // Redirect to admin dashboard
        } else {
          router.push("/client/homepage"); // Redirect to client homepage
        }
      } else {
        console.log("Login failed, status not 200");
        // Optionally set an error message here
      }
    } catch (err) {
      alert(`Login failed. Please check your credentials.`);
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Overlay */}
      <div className="bg-black bg-opacity-50 min-h-screen w-full flex items-center justify-center px-4">
        <div className="bg-white bg-opacity-90 shadow-xl rounded-lg p-8 w-full max-w-md">
          {/* Title */}
          <h1 className="text-3xl font-bold text-[#C9A47F] text-center mb-6">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Log in to access your account and enjoy our exclusive dining experience.
          </p>
  
          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text" // Keep it as text for username
                id="username" // Updated to username
                value={username} // Updated to use username state
                onChange={(e) => setUsername(e.target.value)} // Update username on change
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#C9A47F] focus:border-[#C9A47F]"
              />
            </div>
  
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#C9A47F] focus:border-[#C9A47F]"
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
          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#C9A47F] font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;