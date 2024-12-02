
"use client"; 
"use client"; 
import React, { useState } from 'react';

import Navbar from "@/app/components/navbar/page";

const Orders = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');

  const orders = {
    current: [
      { id: 1, name: 'Pizza Margherita', status: 'Preparing' },
      { id: 2, name: 'Tiramisu', status: 'Out for Delivery' },
    ],
    past: [
      { id: 3, name: 'Pasta Carbonara', status: 'Delivered' },
      { id: 4, name: 'Gelato', status: 'Delivered' },
    ],
  };

  return (
    <div className="min-h-screen bg-[#B1B7B9]"> {/* Light Gray Background */}
      {/* Navbar */}
      <div className="sticky top-0 z-50"> 
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 mt-4"> {/* Padding for content */}
        <h1 className="text-3xl font-bold text-[#3C312C] mb-6"> {/* Dark Brown Text */}
          My Orders
        </h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md text-xl font-medium transition-colors duration-300 ${
              activeTab === 'current'
                ? 'bg-[#D47043] text-white hover:bg-[#C0735B]' /* Rusty Orange Active, Reddish Brown Hover */
                : 'bg-[#C6A570] text-[#3C312C] hover:bg-[#D47043] hover:text-white' /* Light Tan Inactive, Rusty Orange Hover */
            }`}
            onClick={() => setActiveTab('current')}
          >
            Current Orders
          </button>
          <button
            className={`px-4 py-2 rounded-md text-xl font-medium transition-colors duration-300 ${
              activeTab === 'past'
                ? 'bg-[#D47043] text-white hover:bg-[#C0735B]' /* Rusty Orange Active, Reddish Brown Hover */
                : 'bg-[#C6A570] text-[#3C312C] hover:bg-[#D47043] hover:text-white' /* Light Tan Inactive, Rusty Orange Hover */
            }`}
            onClick={() => setActiveTab('past')}
          >
            Past Orders
          </button>
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {orders[activeTab].map((order) => (
            <div
              key={order.id}
              className="p-4 bg-white rounded-md shadow-md"
            >
              <h2 className="text-xl font-semibold text-[#3C312C]"> {/* Dark Brown Text */}
                {order.name}
              </h2>
              <p className="text-sm text-[#525757]"> {/* Dark Gray Text */}
                Status: {order.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
