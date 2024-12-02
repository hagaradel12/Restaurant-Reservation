"use client"

import { Line } from 'react-chartjs-2';
import Link from 'next/link';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from "@/app/components/admin/sidebar/page"; 

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  // Trend Chart Data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Total Orders',
        data: [150, 200, 250, 300, 350, 400, 450],
        fill: false,
        borderColor: '#C9A47F',
        tension: 0.1,
      },
    ],
  };

  // Trend Chart Options
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Orders',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-3xl font-bold text-[#C9A47F]">Dashboard</div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="text-white">
                <img
                  src="/profile-pic.jpg"
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-700 p-6 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Total Bookings</div>
              <div className="text-3xl">1,258</div>
            </div>
            <div className="text-[#C9A47F] text-4xl">📅</div>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Total Orders</div>
              <div className="text-3xl">4,512</div>
            </div>
            <div className="text-[#C9A47F] text-4xl">🍔</div>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Avg Order Price</div>
              <div className="text-3xl">$29.99</div>
            </div>
            <div className="text-[#C9A47F] text-4xl">💸</div>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Pending Bookings</div>
              <div className="text-3xl">32</div>
            </div>
            <div className="text-[#C9A47F] text-4xl">🔔</div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-gray-700 p-6 rounded-lg mt-8">
          <h3 className="text-2xl font-semibold mb-6">Orders Trend</h3>
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Main Content (Menu & Bookings) */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Recent Activity</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Menu Section */}
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Menu Items</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>Cheeseburger</div>
                  <div>$8.99</div>
                </div>
                <div className="flex justify-between">
                  <div>Veggie Pizza</div>
                  <div>$12.99</div>
                </div>
                <div className="flex justify-between">
                  <div>Pasta Alfredo</div>
                  <div>$11.49</div>
                </div>
              </div>
            </div>

            {/* Bookings Section */}
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>John Doe</div>
                  <div>12:30 PM</div>
                </div>
                <div className="flex justify-between">
                  <div>Jane Smith</div>
                  <div>1:00 PM</div>
                </div>
                <div className="flex justify-between">
                  <div>Mike Johnson</div>
                  <div>2:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;