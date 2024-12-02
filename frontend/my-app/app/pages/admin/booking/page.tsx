'use client'; // Marks this file as a client-side component

import React from 'react';
import { useRouter } from 'next/navigation'; // Import from next/navigation
import Sidebar from '@/components/admin/sidebar/Sidebar'; 

export default function BookingPage() {
  const router = useRouter(); // Using the router hook from next/router

  // Mock bookings data
  const bookings = [
    { username: 'John Doe', date: '2024-12-02', time: '18:30', people: 4 },
    { username: 'Jane Smith', date: '2024-12-03', time: '19:00', people: 2 },
    { username: 'Mike Johnson', date: '2024-12-05', time: '20:00', people: 6 },
  ];

  const handleUpdate = (bookingId: string) => {
    router.push(`/pages/admin/booking/updateBooking`); // Redirect to the desired URL
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
                <tr key={index} className="border-t border-[#B1B7B9]">
                  <td className="px-4 py-2 text-[#3C312C]">{booking.username}</td>
                  <td className="px-4 py-2 text-[#3C312C]">{booking.date}</td>
                  <td className="px-4 py-2 text-[#3C312C]">{booking.time}</td>
                  <td className="px-4 py-2 text-[#3C312C]">{booking.people}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="mr-2 px-4 py-2 bg-[#C6A570] text-white rounded-lg hover:bg-[#D47043] transition"
                      onClick={() => handleUpdate(booking.username)} // Pass booking ID here
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
        </div>
      </div>
    </div>
  );
}
