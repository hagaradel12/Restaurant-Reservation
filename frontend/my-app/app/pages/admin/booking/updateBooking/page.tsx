'use client'; // Marks this file as a client-side component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importing useRouter from next/navigation
import Sidebar from '@/app/components/admin/sidebar/page';

export default function UpdateBookingPage() {
  const [bookingId, setBookingId] = useState<string>(''); // for booking ID
  const [noOfPeople, setNoOfPeople] = useState<number | string>(''); // for number of people
  const [date, setDate] = useState<string>(''); // for date
  const [time, setTime] = useState<string>(''); // for time

  const router = useRouter(); // Hook to navigate

  const handleUpdate = () => {
    // Implement the logic for updating the booking here
    console.log("Booking updated:", { bookingId, noOfPeople, date, time });
    // After updating, redirect back to the bookings page or another page
    router.push('/pages/admin/booking'); // Redirect back to the bookings page
  };

  const handleCancel = () => {
    router.push('/pages/admin/booking'); 
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-[#F7F4F2]">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6 text-[#3C312C]">Update Booking</h1>

        {/* Form for Updating Booking */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* Booking ID Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#3C312C]" htmlFor="Booking ID">
              Booking ID
            </label>
            <input
              type="text"
              id="Booking ID"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              className="w-full sm:w-1/3 p-2 border border-[#B1B7B9] rounded-lg focus:ring-2 focus:ring-[#D47043]"
            />
          </div>

          {/* No. of People Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#3C312C]" htmlFor="noOfPeople">
              No. of People
            </label>
            <input
              type="number"
              id="noOfPeople"
              value={noOfPeople}
              onChange={(e) => setNoOfPeople(e.target.value)}
              className="w-full sm:w-1/3 p-2 border border-[#B1B7B9] rounded-lg focus:ring-2 focus:ring-[#D47043]"
            />
          </div>

          {/* Date Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#3C312C]" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full sm:w-1/3 p-2 border border-[#B1B7B9] rounded-lg focus:ring-2 focus:ring-[#D47043]"
            />
          </div>

          {/* Time Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#3C312C]" htmlFor="time">
              Time
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full sm:w-1/3 p-2 border border-[#B1B7B9] rounded-lg focus:ring-2 focus:ring-[#D47043]"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-[#C0735B] text-white rounded-lg hover:bg-[#3C312C] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-6 py-2 bg-[#D47043] text-white rounded-lg hover:bg-[#C6A570] transition"
            >
              Update Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
