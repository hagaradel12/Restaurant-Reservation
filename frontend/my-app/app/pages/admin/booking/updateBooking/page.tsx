'use client'; // Marks this file as a client-side component

import { useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import React from "react";
import { useRouter } from "next/navigation"; // Import from
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

const formatDateToDDMMYYYY = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateInput = (dateString: string) => {
  const parts = dateString.split('/');
  return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert DD/MM/YYYY to YYYY-MM-DD for the API
};

const isValidDate = (dateString: string) => {
  const parts = dateString.split('/');
  if (parts.length !== 3) return false;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-based
  const year = parseInt(parts[2], 10);
  const date = new Date(year, month, day);

  // Check if date is valid and if it is today or a future date
  return (
    date instanceof Date && 
    !isNaN(date.getTime()) && 
    date >= new Date(new Date().setHours(0, 0, 0, 0)) // Compare with today's date
  );
};

export default function UpdateBookingPage() {
  const [BookingId, setBookingId] = useState<number | string>(''); // for booking ID
  const [noOfPeople, setNoOfPeople] = useState<number | string>(''); // for number of people
  const [Date, setDate] = useState<string>(''); // for date
  const [Time, setTime] = useState<string>(''); // for time

  const router = useRouter(); // Hook to navigate

  const handleUpdate = async (BookingId: number, noOfPeople: number, Date: string, Time: string) => {
    // Validate date only if it's not empty
    if (Date && !isValidDate(Date)) {
      alert("Please enter a valid date equal to or greater than today (DD/MM/YYYY).");
      return;
    }

    try {
      // First, fetch the current booking details from the server
      const response = await axiosInstance.get<Booking>(`${backend_url}/booking/admin/id/${BookingId}`);
      const currentBooking = response.data;

      // Create an updated object, keeping existing values for unchanged fields
      const updatedto = {
        no_of_people: noOfPeople || currentBooking.no_of_people,
        date: Date ? formatDateInput(Date) : currentBooking.date, // Format the date for API
        time: Time || currentBooking.time,
      };

      console.log('Sending update request with data:', updatedto);

      // Sending PUT request to update the booking
      await axiosInstance.put(`${backend_url}/booking/update/${BookingId}`, updatedto);

      console.log(`Booking with ID ${BookingId} updated successfully.`);

      // Redirect back to the bookings page or another page
      router.push('/pages/admin/booking');
    } catch (error) {
      console.error(`Error updating booking with ID ${BookingId}:`, error);
    }
  };

  const handleCancel = () => {
    router.push('/pages/admin/booking'); 
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <NavbarA />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-[#F7F4F2]">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6 text-[#3C312C]">Update Booking</h1>

        {/* Form for Updating Booking */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* Booking ID Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#3C312C]" htmlFor="BookingId">
              Booking ID
            </label>
            <input
              type="number"
              id="BookingId"
              value={BookingId}
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
            <label className="block text-sm font-semibold text-[#3C312C]" htmlFor="Date">
              Date
            </label>
            <input
              type="text"
              id="Date"
              value={Date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="DD/MM/YYYY"
              className="w-full sm:w-1/3 p-2 border border-[#B1B7B9] rounded-lg focus:ring-2 focus:ring-[#D47043]"
            />
          </div>

          {/* Time Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#3C312C]" htmlFor="Time">
              Time
            </label>
            <input
              type="time"
              id="Time"
              value={Time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full sm:w-1/3 p-2 border border-[#B1B7B9] rounded-lg focus:ring-2 focus:ring-[#D47043]"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-[#6B0504] text-white rounded-lg hover:bg-[#E6AF2E] transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!BookingId) {
                  alert("Booking ID is required to update the booking.");
                  return;
                }
                handleUpdate(Number(BookingId), Number(noOfPeople), Date, Time);
              }}
              className="px-6 py-2 bg-[#6B0504] text-white rounded-lg hover:bg-[#E6AF2E] transition"
            >
              Update Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

