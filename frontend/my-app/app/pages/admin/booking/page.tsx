'use client';

import { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation
import Sidebar from "@/app/components/admin/sidebar/page";
import axios from "axios";

let backend_url = "http://localhost:3001";

interface Booking {
  _id: string,
  no_of_people: number;
  date: string; // ISO Date format
  time: string;
  username: string;
}


export default function BookingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch bookings on page load
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get(`${backend_url}/booking/`);
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleUpdate = (bookingId: string) => {
    router.push(`/pages/admin/booking/updateBooking`);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-[#F7F4F2]">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6 text-[#3C312C]">Manage Bookings</h1>

        {/* Search Bar and Button */}
        <div className="mb-6 flex items-center">
          <input
            type="text"
            placeholder="Search by username..."
            className="w-full sm:w-1/3 p-2 border border-[#B1B7B9] rounded-lg focus:ring-2 focus:ring-[#D47043]"
          />
          <button
            className="ml-4 px-6 py-2 bg-[#D47043] text-white rounded-lg hover:bg-[#C6A570] transition"
            onClick={() => {
              console.log("Search triggered");
            }}
          >
            Search
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
                  <th className="text-left px-4 py-2">Username</th>
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2">Time</th>
                  <th className="text-left px-4 py-2">No. of People</th>
                  <th className="text-center px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Rendering bookings dynamically */}
                {bookings.map((booking, index) => (
                  <tr key={booking._id} className="border-t border-[#B1B7B9]">
                    <td className="px-4 py-2 text-[#3C312C]">{booking.username}</td>
                    <td className="px-4 py-2 text-[#3C312C]">
      {new Date(booking.date).toLocaleDateString()} {/* Formats date based on locale */}
    </td>                    <td className="px-4 py-2 text-[#3C312C]">{booking.time}</td>
                    <td className="px-4 py-2 text-[#3C312C]">{booking.no_of_people}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        className="mr-2 px-4 py-2 bg-[#C6A570] text-white rounded-lg hover:bg-[#D47043] transition"
                        onClick={() => handleUpdate(booking.username)}
                      >
                        Update
                      </button>
                      <button className="px-4 py-2 bg-[#C0735B] text-white rounded-lg hover:bg-[#3C312C] transition">
                        Delete
                      </button>
                    </td>
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
