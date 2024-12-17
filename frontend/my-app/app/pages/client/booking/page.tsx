'use client'; // Marks this file as a client-side component

import { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import React from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation
import Navbar from "@/app/components/navbar/page";

let backend_url = "http://localhost:3001";

interface Booking {
  _id: string;
  no_of_people: number;
  date: Date; // ISO Date format
  time: string;
  username: string;
  bookingId: number;
}

export default function BookingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchCookieData() {
    try {
      const response = await fetch("http://localhost:3001/auth/get-cookie-data", {
        credentials: "include",
      });
      const { userData } = await response.json();
      console.log(userData.payload.username);
  
      if (!userData.payload.username) {
        console.error("No cookie data found");
        setError("No cookie data found");
        setLoading(false);
        return;
      }
  
      const username = userData.payload.username;
  
      console.log(username);
      try {
        const response = await axiosInstance.get<Booking[]>(`${backend_url}/booking/client/${username}`);
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching cookie data:", error);
      setError("Error fetching cookie data");
      setLoading(false);
    }
  }
  
  // Fetch bookings on page load
  useEffect(() => {
    fetchCookieData();
  }, []);

  // Function to handle navigation to create booking page
  const handleNavigateToCreate = () => {
    router.push('/pages/client/booking/createBooking'); 
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-[#F7F4F2]">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6 text-[#3C312C]">View Bookings</h1>

        {/* Button to navigate to Create Booking */}
        <div className="mb-6">
          <button
            className="px-6 py-2 bg-[#D47043] text-white rounded-lg hover:bg-[#C6A570] transition"
            onClick={handleNavigateToCreate}
          >
            Create Booking
          </button>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          {loading ? (
            <p className="text-center py-6">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-center py-6 text-[#3C312C]">No bookings found!</p>
          ) : (
            <table className="w-full">
              <thead className="bg-[#C6A570] text-white">
                <tr>
                  <th className="text-left px-4 py-2">Booking ID</th>
                  <th className="text-left px-4 py-2">Username</th>
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2">Time</th>
                  <th className="text-left px-4 py-2">No. of People</th>
                </tr>
              </thead>
              <tbody>
                {/* Rendering bookings dynamically */}
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-t border-[#B1B7B9]">
                    <td className="px-4 py-2 text-[#3C312C]">{booking.bookingId}</td>
                    <td className="px-4 py-2 text-[#3C312C]">{booking.username}</td>
                    <td className="px-4 py-2 text-[#3C312C]">
                {new Date(booking.date).toLocaleDateString('en-GB')} {/* Formats as DD/MM/YYYY */}
                  </td>
                    <td className="px-4 py-2 text-[#3C312C]">{booking.time}</td>
                    <td className="px-4 py-2 text-[#3C312C]">{booking.no_of_people}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

}

