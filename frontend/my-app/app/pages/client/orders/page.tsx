"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { Order } from "@/app/_lib/page";
import Navbar from "@/app/components/navbar/page";

const backend_url = "http://localhost:3001";

const Orders = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  async function fetchOrders() {
    setLoading(true);
    try {
      const response = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await response.json();

      if (!userData?.payload?.username) {
        throw new Error("No cookie data found. Please log in.");
      }

      const fetchedUsername = userData.payload.username;
      setUsername(fetchedUsername);

      const [currentResponse, pastResponse] = await Promise.all([
        axiosInstance.get<Order[]>(`${backend_url}/orders/user-orders?username=${fetchedUsername}&type=current`),
        axiosInstance.get<Order[]>(`${backend_url}/orders/user-orders?username=${fetchedUsername}&type=past`),
      ]);

      setCurrentOrders(currentResponse.data);
      setPastOrders(pastResponse.data);
    } catch (error) {
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderOrders = (orders: Order[]) =>
    orders.length > 0 ? (
      orders.map((order, index) => (
        <div key={index} className="p-4 bg-white rounded-md shadow-md">
          <h2 className="text-xl font-semibold text-[#3C312C]">Order #{order.orderNo}</h2>
          <p className="text-sm text-[#525757]">Status: {order.status}</p>
          <p className="text-sm text-[#525757]">Address: {order.address}</p>
          <ul className="list-disc pl-6">
            {order.products.map((item, i) => (
              <li key={i}>
                Product ID: {item._id}, Quantity: {item.price}
              </li>
            ))}
          </ul>
        </div>
      ))
    ) : (
      <p className="text-lg text-[#3C312C]">No orders found in this category.</p>
    );

  return (
    <div className="min-h-screen bg-[#B1B7B9]">
      <div className="px-6 py-8 mt-4">
        <Navbar />
        <h1 className="text-3xl font-bold text-[#3C312C] mb-6">My Orders</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          {["current", "past"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md text-xl font-medium transition-colors duration-300 ${
                activeTab === tab
                  ? "bg-[#D47043] text-white hover:bg-[#C0735B]"
                  : "bg-[#C6A570] text-[#3C312C] hover:bg-[#D47043] hover:text-white"
              }`}
              onClick={() => setActiveTab(tab as 'current' | 'past')}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Orders
            </button>
          ))}
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-lg text-[#3C312C]">Loading orders...</p>
          ) : error ? (
            <p className="text-lg text-red-500">{error}</p>
          ) : activeTab === "current" ? (
            renderOrders(currentOrders)
          ) : (
            renderOrders(pastOrders)
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;

// export interface Order {
//   _id: object;
//   orderNo: number;
//   products: { productId: string; quantity: number }[];
//   address: string;
//   status: string;
//   username: string;
//   createdAt: Date;
// }
