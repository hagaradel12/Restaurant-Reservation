'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/utils/axiosInstance";

const backend_url = "http://localhost:3001";

interface UserProfile {
  name: string;
  email: string;
  username: string;
  phoneNo: string;
  password: string; // Include this only if the user can edit it
}

const ProfilePage = () => {
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    email: "",
    username: "",
    phoneNo: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Fetch user data on page load
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          alert("No token found. Please log in.");
          router.push("/auth/login");
          return;
        }

        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
        const username = decodedToken.user.username; // Extract username from token

        const response = await axiosInstance.get(`${backend_url}/users/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData(response.data); // Populate form with user data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Failed to load profile. Please try again.");
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("No token found. Please log in.");
        router.push("/auth/login");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
      const username = decodedToken.user.username; // Extract username from token

      await axiosInstance.patch(`${backend_url}/users/${username}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Display a loader until the data is fetched
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
              disabled // Username should not be editable
            />
          </div>
          <div>
            <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNo"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleInputChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter a new password (optional)"
              value={formData.password}
              onChange={handleInputChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-[#C9A47F] text-white font-semibold rounded-lg hover:bg-[#b1906b]"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;