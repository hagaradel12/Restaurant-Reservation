"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { Order } from "@/app/_lib/page";
import Navbar from "@/app/components/navbar/page";

const backend_url = "http://localhost:3001";

export default function Orders() {
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Async function to fetch cookie data and current orders
  const fetchCookieData = async () => {
    try {
      const response = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await response.json();

      if (!userData.payload?.username) {
        throw new Error("No cookie data found");
      }

      const username = userData.payload.username;

      const currentResponse = await axiosInstance.get<Order[]>(
        `${backend_url}/orders/${username}`
      );
      console.log(currentResponse.data);  // Log the response to verify the structure

      setCurrentOrders(currentResponse.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on page load
  useEffect(() => {
    fetchCookieData();
  }, []);

  const renderOrders = (orders: Order[]) => {
    if (!Array.isArray(orders)) {
      return <p className="text-lg text-red-500">Invalid orders data.</p>;
    }

    if (orders.length === 0) {
      return <p className="text-lg text-gray-800">No current orders found.</p>;
    }
    
    return (
      <ul className="list-disc space-y-4">
        {orders.map((order, index) => (
          <li key={index} className="p-4 bg-white rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">
              Order #{order.orderNo}
            </h2>
            <p className="text-sm text-gray-600">Status: {order.status}</p>
            <p className="text-sm text-gray-600">Address: {order.address}</p>
            <ul className="list-disc pl-6">
              {Array.isArray(order.products) && order.products.length > 0 ? (
                order.products.map((item, i) => (
                  <li key={i}>
                    Product ID: {item._id}, Quantity: {item.price}
                  </li>
                ))
              ) : (
                <li>No products available</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Orders</h1>
        {loading ? (
          <p className="text-lg text-gray-800">Loading orders...</p>
        ) : error ? (
          <p className="text-lg text-red-500">{error}</p>
        ) : (
          renderOrders(currentOrders)
        )}
      </div>
    </div>
  );
}

