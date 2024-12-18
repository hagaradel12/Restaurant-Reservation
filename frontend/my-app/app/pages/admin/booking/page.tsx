'use client'; // Marks this file as a client-side component 

import { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation
import NavbarA from "@/app/components/navbarA/page";

let backend_url = "http://localhost:3001";

interface Booking {
  _id: string;
  no_of_people: number;
  date: string; // ISO Date format
  time: string;
  username: string;
  bookingId: number;
}

const formatDateToDDMMYYYY = (isoDate: string) => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function BookingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>(''); // New state for search term

  // Fetch bookings on page load
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get<Booking[]>(`${backend_url}/booking/`);
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Function to handle search
  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      const response = await axiosInstance.get<Booking[]>(`${backend_url}/booking/`);
      setBookings(response.data);
    } else {
      try {
        if (/^\d+$/.test(searchTerm)) {
          const idResponse = await axiosInstance.get<Booking>(`${backend_url}/booking/admin/id/${searchTerm}`);
          setBookings([idResponse.data]);
        } else {
          const userResponse = await axiosInstance.get<Booking[]>(`${backend_url}/booking/admin/username/${searchTerm}`);
          setBookings(userResponse.data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
      }
    }
  };

  const handleNavigateToUpdate = () => {
    router.push(`/pages/admin/booking/updateBooking`);
  };

  const handleDelete = async (bookingId: number) => {
    try {
      await axiosInstance.delete(`${backend_url}/booking/delete/${bookingId}`);
      const response = await axiosInstance.get<Booking[]>(`${backend_url}/booking/`);
      setBookings(response.data);
    } catch (error) {
      console.error(`Error deleting booking with ID ${bookingId}:`, error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get<ArrayBuffer>(`${backend_url}/export/export`, {
        responseType: 'arraybuffer', // Ensures binary data is returned
      });
  
      // Create a Blob from the ArrayBuffer
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
  
      // Generate a URL for the Blob and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'bookings-report.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading Booking sheet:", error);
    }
  };
  

  return (
    <div className="flex min-h-screen">
      <NavbarA />

      <div className="flex-1 p-6 bg-[#F7F4F2]">
        <h1 className="text-3xl font-bold mb-6 text-[#AA3320]">Manage Bookings</h1>

        <div className="mb-6 flex items-center">
          <input
            type="text"
            placeholder="Search by username or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/3 p-2 border border-[#AA3320] rounded-lg focus:ring-2 focus:ring-[#E6AF2E]"
          />
          <button
            className="ml-4 px-6 py-2 bg-[#6B0504] text-white rounded-lg hover:bg-[#AA3320] transition"
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            className="ml-4 px-6 py-2 bg-[#AA3320] text-white rounded-lg hover:bg-[#6B0504] transition"
            onClick={handleNavigateToUpdate}
          >
            Update
          </button>
          <button
            className="ml-4 px-6 py-2 bg-[#E6AF2E] text-white rounded-lg hover:bg-[#AA3320] transition"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          {loading ? (
            <p className="text-center py-6 text-[#3C312C]">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-center py-6 text-[#3C312C]">No bookings found!</p>
          ) : (
            <table className="w-full">
              <thead className="bg-[#AA3320] text-white">
                <tr>
                  <th className="text-left px-4 py-2">Booking ID</th>
                  <th className="text-left px-4 py-2">Username</th>
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2">Time</th>
                  <th className="text-left px-4 py-2">No. of People</th>
                  <th className="text-center px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-t border-[#B1B7B9]">
                    <td className="px-4 py-2 text-[#3C312C]">{booking.bookingId}</td>
                    <td className="px-4 py-2 text-[#3C312C]">{booking.username}</td>
                    <td className="px-4 py-2 text-[#3C312C]">{formatDateToDDMMYYYY(booking.date)}</td>
                    <td className="px-4 py-2 text-[#3C312C]">{booking.time}</td>
                    <td className="px-4 py-2 text-[#3C312C]">{booking.no_of_people}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDelete(booking.bookingId)}
                        className="px-4 py-2 bg-[#6B0504] text-white rounded-lg hover:bg-[#E6AF2E] transition"
                      >
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
