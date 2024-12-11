'use client'; // Marks this file as a client-side component

import React, { useState } from 'react';
import axiosInstance from "@/app/utils/axiosInstance";
import { useRouter } from 'next/navigation'; 
import Sidebar from '@/app/components/admin/sidebar/page';

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
  const [Date, setDate] = useState<string>(''); // for date
  const [Time, setTime] = useState<string>(''); // for time
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter(); // Hook to navigate

  const  fetchCookieData = async (noOfPeople: number, Date: string, Time: string) => {
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
      
      try {
        const createdto = {
          no_of_people: noOfPeople ,
          date: Date ,
          time: Time ,
          username: Username,
        };
    
        console.log('Sending update request with data:', createdto);
    
        // Sending PUT request to update the booking
        await axiosInstance.post(`${backend_url}/booking/createBooking`, createdto);
    
        console.log(`Booking cretaed successfully.`);
        
        // Redirect back to the bookings page or another page
        router.push('/pages/client/booking');
      } catch (error) {
        console.error(`Error creating booking:`, error);
      }
    } catch (error) {
      console.error("Error fetching cookie data:", error);
      setError("Error fetching cookie data");
      setLoading(false);
    } finally {
      // Optional: Code to execute regardless of success or failure
      setLoading(false);
    }
    return username;
  }
  
  
  const handleCancel = () => {
    router.push('/pages/client/booking'); // Redirect to the bookings page
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-[#F7F4F2]">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6 text-[#3C312C]">Create Booking</h1>

        {/* Form for Creating Booking */}
        <div className="bg-white shadow-md rounded-lg p-6">
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
              type="date"
              id="Date"
              value={Date}
              onChange={(e) => setDate(e.target.value)}
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
    onChange={(e) => setTime(String(e.target.value))} // Ensure the value is explicitly treated as a string
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
            onClick={() => {
              if (!noOfPeople || !Date || !Time) {
                alert("All fields are required to create a booking."); // Simple alert popup
                return;
              }
              fetchCookieData(Number(noOfPeople), Date, Time); // Add username from cookie
            }}
            className="px-6 py-2 bg-[#D47043] text-white rounded-lg hover:bg-[#C6A570] transition"
          >
            Create Booking
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
