'use client';

import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import NavbarA from '@/app/components/navbarA/page';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axiosInstance from '@/app/utils/axiosInstance';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);




interface Bookings{
  _id: string
}

interface Orders{
  username: string;
  _id: string
  status: string;
  createdAt: Date;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<{
    totalBookings: number;
    totalOrders: number;
    pendingOrders: number;
    latestOrders: Orders[];
    orderTrend: number[];
  }>({
    totalBookings: 0,
    totalOrders: 0,
    pendingOrders: 0,
    latestOrders: [],
    orderTrend: [],
  });
  

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch Bookings and Orders
        const [bookingsRes, ordersRes] = await Promise.all([
          axiosInstance.get<Bookings[]>('http://localhost:3001/booking'),
          axiosInstance.get<Orders[]>('http://localhost:3001/orders/admin/all'),
        ]);

        const bookings = bookingsRes.data;
        const orders = ordersRes.data;

        // Calculate Stats
        const totalBookings = bookings.length;
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(order => order.status === 'pending').length;

        // Prepare Order Trend Data
        const orderTrend = Array(12).fill(0); // Monthly order counts
        orders.forEach(order => {
          const month = new Date(order.createdAt).getMonth(); // Get month from createdAt
          orderTrend[month]++;
        });

        // Get 2 Most Recent Orders
        const latestOrders = orders
  .sort((a, b) => {
    const aDate = new Date(a.createdAt); // Convert to Date object
    const bDate = new Date(b.createdAt); // Convert to Date object

    // Ensure valid dates before calling getTime
    if (isNaN(aDate.getTime()) || isNaN(bDate.getTime())) {
      return 0; // Handle invalid dates by keeping the original order
    }

    return bDate.getTime() - aDate.getTime(); // Compare dates
  })
  .slice(0, 2);



        setStats({ totalBookings, totalOrders, pendingOrders, latestOrders, orderTrend });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Total Orders',
        data: stats.orderTrend,
        fill: false,
        borderColor: '#E6AF2E',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
          color: '#E6AF2E',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Orders',
          color: '#E6AF2E',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#001514] text-white flex">
      {/* Sidebar */}
      <NavbarA />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-3xl font-bold text-[#E6AF2E]">Dashboard</div>
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
              <div className="text-lg font-semibold text-[#AA3320]">Total Bookings</div>
              <div className="text-3xl text-[#E6AF2E]">{stats.totalBookings}</div>
            </div>
            <div className="text-[#E6AF2E] text-4xl">📅</div>
          </div>
          <div className="bg-[#2D3748] p-6 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-[#AA3320]">Total Orders</div>
              <div className="text-3xl text-[#E6AF2E]">{stats.totalOrders}</div>
            </div>
            <div className="text-[#E6AF2E] text-4xl">🍔</div>
          </div>
          <div className="bg-[#2D3748] p-6 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-[#AA3320]">Pending Orders</div>
              <div className="text-3xl text-[#E6AF2E]">{stats.pendingOrders}</div>
            </div>
            <div className="text-[#E6AF2E] text-4xl">🔔</div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-[#2D3748] p-6 rounded-lg mt-8">
          <h3 className="text-2xl font-semibold text-[#E6AF2E] mb-6">Orders Trend</h3>
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Recent Orders */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-[#E6AF2E] mb-6">Recent Orders</h2>
          <div className="bg-[#2D3748] p-6 rounded-lg">
            {stats.latestOrders.map((order, index) => (
              <div key={index} className="flex justify-between mb-4">
                <div className="text-[#AA3320]">{order.username}</div>
                <div className="text-[#E6AF2E]">{new Date(order.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
