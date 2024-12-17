'use client'; // Marks this file as a client-side component

import React, { useState } from 'react';
import axiosInstance from "@/app/utils/axiosInstance";
import { useRouter } from 'next/navigation'; 
import Sidebar from '@/app/components/admin/sidebar/page';
import DatePicker from 'react-datepicker';  // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Styles for the date picker
import Navbar from '@/app/components/navbar/page';

let backend_url = "http://localhost:3001";
interface Booking {
  _id: string;
  no_of_people: number;
  date: string; // ISO Date format
  time: string;
  username: string;
  bookingId: number;
}

export default function CreateBookingPage() {
  const [username, setUsername] = useState<string>(''); // for booking ID
  const [noOfPeople, setNoOfPeople] = useState<number | string>(''); // for number of people
  const [Date, setDate] = useState<Date | null>(null); // for date
  const [Time, setTime] = useState<string>(''); // for time
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter(); // Hook to navigate

  const fetchCookieData = async (noOfPeople: number, dateString: string, Time: string) => {
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

      const Username = userData.payload.username;

      // Convert the date to DD/MM/YYYY format for backend
      const formattedDate = formatDateToDDMMYYYY(Date);

      console.log("Formatted Date for Backend:", formattedDate);  // Log the formatted date to verify

      const createdto = {
        no_of_people: noOfPeople,
        date: formattedDate, // Send the date in DD/MM/YYYY format
        time: Time,
        username: Username,
      };

      console.log('Sending update request with data:', createdto);

      // Sending POST request to create the booking
      try {
        const bookingResponse = await fetch(`${backend_url}/booking/createBooking`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(createdto),
          credentials: 'include',
        });

        if (!bookingResponse.ok) {
          const errorData = await bookingResponse.json();
          console.error('Error creating booking:', errorData.message || 'Unknown error');
          setError(errorData.message || 'Error creating booking');
          return;
        }

        console.log(`Booking created successfully.`);
        router.push('/pages/client/booking');
      } catch (error) {
        console.error('An unexpected error occurred:', error);
        setError('An unexpected error occurred');
      }
    } catch (error) {
      console.error("Error fetching cookie data:", error);
      setError("Error fetching cookie data");
    } finally {
      setLoading(false);
    }
  };

  // Format date to DD/MM/YYYY format
  const formatDateToDDMMYYYY = (date: Date | null): string => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const handleDateChange = (date: Date | null) => {
    setDate(date);
  };
  
  const handleCancel = () => {
    router.push('/pages/client/booking'); // Redirect to the bookings page
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Navbar />
  
      {/* Main Content */}
      <div className="flex-1 p-6 bg-[#FBFFFE]">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6 text-[#AA3320]">Create Booking</h1>
  
        {/* Form for Creating Booking */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* No. of People Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#AA3320]" htmlFor="noOfPeople">
              No. of People
            </label>
            <input
              type="number"
              id="noOfPeople"
              value={noOfPeople}
              onChange={(e) => setNoOfPeople(e.target.value)}
              className="w-full p-2 border border-[#B1B7B9] rounded-lg focus:ring-2 focus:ring-[#E6AF2E]"
            />
          </div>
  
          {/* Date Field (using react-datepicker) */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#AA3320]" htmlFor="date">
              Date
            </label>
            <DatePicker
              selected={Date}  // Ensure the variable name is consistent
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              className="w-full p-2 border border-[#B1B7B9] rounded-lg focus:ring-2 focus:ring-[#E6AF2E]"
            />
          </div>
  
          {/* Time Field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#AA3320]" htmlFor="time">
              Time
            </label>
            <input
              type="time"
              id="time"
              value={Time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border border-[#B1B7B9] rounded-lg focus:ring-2 focus:ring-[#E6AF2E]"
            />
          </div>
  
          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-[#6B0504] text-white rounded-lg hover:bg-[#3C312C] transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!noOfPeople || !Date || !Time) {
                  alert("All fields are required to create a booking.");
                  return;
                }
                fetchCookieData(Number(noOfPeople), formatDateToDDMMYYYY(Date), Time); // Add username from cookie
              }}
              className="px-6 py-2 bg-[#E6AF2E] text-white rounded-lg hover:bg-[#C6A570] transition"
            >
              Create Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
