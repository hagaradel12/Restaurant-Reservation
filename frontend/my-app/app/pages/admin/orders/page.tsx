'use client'; // Marks this file as a client-side component

import { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import Sidebar from "@/app/components/admin/sidebar/page"; // Ensure Sidebar is correctly imported
import { useRouter } from "next/navigation"; // Import from next/navigation

const backend_url = "http://localhost:3001"; // Base URL for backend API

export interface Product {
  _id: object;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: object;
  orderNo: number;
  products: Product[];
  address: string;
  status: string;
  username: string;
  createdAt: Date;
}

const ORDER_STATUSES = ['pending', 'shipped', 'delivered'];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term

  // Fetch orders on page load
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get<Order[]>(`${backend_url}/orders/admin/all`);
        console.log('Fetched orders:', response.data); // Debugging line
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setOrders([]); // Handle unexpected response structure
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle search by order number or username
  const handleSearch = async () => {
    setLoading(true); // Show loading state during search
    if (searchTerm.trim() === "") {
      const response = await axiosInstance.get<Order[]>(`${backend_url}/orders/admin/all`);
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]); // Handle unexpected response structure
      }
    } else {
      try {
        if (/^\d+$/.test(searchTerm)) {
          // Search by order number
          const response = await axiosInstance.get<Order>(`${backend_url}/orders/search?orderNo=${searchTerm}`);
          setOrders([response.data]); // Wrap single order in an array
        } else {
          // Search by username
          const response = await axiosInstance.get<Order[]>(`${backend_url}/orders/search?username=${searchTerm}`);
          if (Array.isArray(response.data)) {
            setOrders(response.data);
          } else {
            setOrders([]); // Handle unexpected response structure
          }
        }
      } catch (error) {
        console.error("Error searching orders:", error);
        setOrders([]); // Clear orders on failure
      } finally {
        setLoading(false); // Hide loading state
      }
    }
  };

  // Handle deleting an order
  const handleDelete = async (orderNo: number) => {
    try {
      await axiosInstance.delete(`${backend_url}/orders/admin/${orderNo}`);
      console.log(`Order with ID ${orderNo} deleted successfully.`);

      // Refresh orders list
      const response = await axiosInstance.get<Order[]>(`${backend_url}/orders/admin/all`);
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]); // Handle unexpected response structure
      }
    } catch (error) {
      console.error(`Error deleting order with ID ${orderNo}:`, error);
    }
  };

  const handleStatusUpdate = async (orderNo: number, newStatus: string) => {
    try {
      await axiosInstance.put(`${backend_url}/orders/admin/status/${orderNo}`, {
        status: newStatus,
      });
  
      console.log(`Order status updated to ${newStatus} for order ${orderNo}.`);
  
      setOrders((prevOrders) =>
        newStatus === 'delivered'
          ? prevOrders.filter((order) => order.orderNo !== orderNo) // Remove delivered orders
          : prevOrders.map((order) =>
              order.orderNo === orderNo ? { ...order, status: newStatus } : order
            )
      );
    } catch (error) {
      console.error(`Error updating status for order ${orderNo}:`, error);
    }
  };
  

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-[#F7F4F2]">
        <h1 className="text-3xl font-bold mb-6 text-[#3C312C]">Manage Orders</h1>

        {/* Search Bar and Buttons */}
        <div className="mb-6 flex items-center">
          <input
            type="text"
            placeholder="Search by order number or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/3 p-2 border border-[#B1B7B9] rounded-lg focus:ring-2 focus:ring-[#D47043]"
          />
          <button
            className="ml-4 px-6 py-2 bg-[#D47043] text-white rounded-lg hover:bg-[#C6A570] transition"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          {loading ? (
            <p className="text-center py-6">Loading orders...</p>
          ) : Array.isArray(orders) && orders.length === 0 ? (
            <p className="text-center py-6 text-[#3C312C]">No orders found!</p>
          ) : (
            <table className="w-full">
              <thead className="bg-[#C6A570] text-white">
                <tr>
                  <th className="text-left px-4 py-2">Order No</th>
                  <th className="text-left px-4 py-2">Username</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Address</th>
                  <th className="text-center px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(orders) && orders.map((order) => (
                  <tr key={order.orderNo} className="border-t border-[#B1B7B9]">
                    <td className="px-4 py-2 text-[#3C312C]">{order.orderNo}</td>
                    <td className="px-4 py-2 text-[#3C312C]">{order.username}</td>
                    <td className="px-4 py-2 text-[#3C312C]">
                      <select
                        defaultValue={order.status} // Use defaultValue for consistent SSR/CSR
                        onChange={(e) => handleStatusUpdate(order.orderNo, e.target.value)}
                        className="p-2 border rounded-lg"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 text-[#3C312C]">{order.address}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDelete(order.orderNo)}
                        className="px-4 py-2 bg-[#C0735B] text-white rounded-lg hover:bg-[#3C312C] transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
