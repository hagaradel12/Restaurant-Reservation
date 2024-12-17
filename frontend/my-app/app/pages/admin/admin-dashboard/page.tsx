'use client';

import { Line } from 'react-chartjs-2';
import Link from 'next/link';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import NavbarA from '@/app/components/navbarA/page';

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
        borderColor: '#E6AF2E', // Xanthous for the chart line
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
          color: '#E6AF2E', // Xanthous for axis titles
        },
      },
      y: {
        title: {
          display: true,
          text: 'Orders',
          color: '#E6AF2E', // Xanthous for axis titles
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#001514] text-white flex"> {/* Rich Black background */}
      {/* Sidebar */}
      <NavbarA />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-3xl font-bold text-[#E6AF2E]">Dashboard</div> {/* Xanthous for title */}
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
          <div className="bg-[#2D3748] p-6 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-[#AA3320]">Total Bookings</div> {/* Brown for key text */}
              <div className="text-3xl text-[#E6AF2E]">1,258</div> {/* Xanthous for the value */}
            </div>
            <div className="text-[#E6AF2E] text-4xl">📅</div> {/* Xanthous for icon */}
          </div>
          <div className="bg-[#2D3748] p-6 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-[#AA3320]">Total Orders</div> {/* Brown for key text */}
              <div className="text-3xl text-[#E6AF2E]">4,512</div> {/* Xanthous for the value */}
            </div>
            <div className="text-[#E6AF2E] text-4xl">🍔</div> {/* Xanthous for icon */}
          </div>
          <div className="bg-[#2D3748] p-6 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-[#AA3320]">Avg Order Price</div> {/* Brown for key text */}
              <div className="text-3xl text-[#E6AF2E]">$29.99</div> {/* Xanthous for the value */}
            </div>
            <div className="text-[#E6AF2E] text-4xl">💸</div> {/* Xanthous for icon */}
          </div>
          <div className="bg-[#2D3748] p-6 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-[#AA3320]">Pending Bookings</div> {/* Brown for key text */}
              <div className="text-3xl text-[#E6AF2E]">32</div> {/* Xanthous for the value */}
            </div>
            <div className="text-[#E6AF2E] text-4xl">🔔</div> {/* Xanthous for icon */}
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-[#2D3748] p-6 rounded-lg mt-8">
          <h3 className="text-2xl font-semibold text-[#E6AF2E] mb-6">Orders Trend</h3> {/* Xanthous for the title */}
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Main Content (Menu & Bookings) */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-[#E6AF2E] mb-6">Recent Activity</h2> {/* Xanthous for title */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Menu Section */}
            <div className="bg-[#2D3748] p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[#E6AF2E] mb-4">Menu Items</h3> {/* Xanthous for section title */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="text-[#AA3320]">Cheeseburger</div> {/* Brown for text */}
                  <div className="text-[#E6AF2E]">$8.99</div> {/* Xanthous for price */}
                </div>
                <div className="flex justify-between">
                  <div className="text-[#AA3320]">Veggie Pizza</div> {/* Brown for text */}
                  <div className="text-[#E6AF2E]">$12.99</div> {/* Xanthous for price */}
                </div>
                <div className="flex justify-between">
                  <div className="text-[#AA3320]">Pasta Alfredo</div> {/* Brown for text */}
                  <div className="text-[#E6AF2E]">$11.49</div> {/* Xanthous for price */}
                </div>
              </div>
            </div>

            {/* Bookings Section */}
            <div className="bg-[#2D3748] p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[#E6AF2E] mb-4">Recent Bookings</h3> {/* Xanthous for section title */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="text-[#AA3320]">John Doe</div> {/* Brown for text */}
                  <div className="text-[#E6AF2E]">12:30 PM</div> {/* Xanthous for time */}
                </div>
                <div className="flex justify-between">
                  <div className="text-[#AA3320]">Jane Smith</div> {/* Brown for text */}
                  <div className="text-[#E6AF2E]">1:00 PM</div> {/* Xanthous for time */}
                </div>
                <div className="flex justify-between">
                  <div className="text-[#AA3320]">Mike Johnson</div> {/* Brown for text */}
                  <div className="text-[#E6AF2E]">2:00 PM</div> {/* Xanthous for time */}
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
