'use client';

import { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";

let backend_url = "http://localhost:3001";

interface Booking {
  _id: string;
  no_of_people: number;
  date: string; // ISO Date format
  time: string;
  username: string;
}

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>(''); // New state for search term

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
  return (
    <div className="flex min-h-screen bg-[#F7F4F2] p-6">
      {/* Bookings Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg w-full">
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
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-t border-[#B1B7B9]">
                  <td className="px-4 py-2 text-[#3C312C]">{booking.username}</td>
                  <td className="px-4 py-2 text-[#3C312C]">{booking.date}</td>
                  <td className="px-4 py-2 text-[#3C312C]">{booking.time}</td>
                  <td className="px-4 py-2 text-[#3C312C]">{booking.no_of_people}</td>
                  <td className="px-4 py-2 text-center">
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
  );
}
