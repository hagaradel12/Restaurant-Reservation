'use client'; // Marks this file as a client-side component

import { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { useRouter } from "next/navigation"; // Import from next/navigation
import NavbarA from "@/app/components/navbarA/page";

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
  const [orders, setOrders] = useState<Order[]>([]); // Orders from backend
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]); // Orders after filtering
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term

  // Fetch orders on page load
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get<Order[]>(`${backend_url}/orders/admin/all`);
        console.log('Fetched orders:', response.data); // Debugging line

        if (Array.isArray(response.data)) {
          const filteredOrders = response.data.filter(
            (order) => order.status === 'pending' || order.status === 'shipped'
          );
          setOrders(filteredOrders);
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

  // Filter orders based on search term (order number or username)
  useEffect(() => {
    const filtered = orders.filter((order) => {
      return (
        order.orderNo.toString().includes(searchTerm) || // Filter by order number
        order.username.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by username (case insensitive)
      );
    });
    setFilteredOrders(filtered); // Update the filtered orders state
    setLoading(false);
  }, [searchTerm, orders]); // Rerun when either searchTerm or orders changes

  const handleDelete = async (orderNo: number) => {
    try {
      await axiosInstance.delete(`${backend_url}/orders/admin/${orderNo}`);
      console.log(`Order with ID ${orderNo} deleted successfully.`);

      // After deletion, fetch the updated orders and filter them
      const response = await axiosInstance.get<Order[]>(`${backend_url}/orders/admin/all`);
      if (Array.isArray(response.data)) {
        const filteredOrders = response.data.filter(
          (order) => order.status === 'pending' || order.status === 'shipped'
        );
        setOrders(filteredOrders); // Update the orders state with the filtered orders
        // Apply the current search term filter to the updated orders
        const filtered = filteredOrders.filter((order) => {
          return (
            order.orderNo.toString().includes(searchTerm) ||
            order.username.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
        setFilteredOrders(filtered); // Update the filtered orders state
      } else {
        setOrders([]); // Handle unexpected response structure
        setFilteredOrders([]); // Clear filtered orders if no valid response
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
          ? prevOrders.filter((order) => order.orderNo !== orderNo)
          : prevOrders.map((order) =>
              order.orderNo === orderNo ? { ...order, status: newStatus } : order
            )
      );
    } catch (error) {
      console.error(`Error updating status for order ${orderNo}:`, error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FBFFFE] text-[#001514]">
      <NavbarA />

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

        <div className="mb-6 flex items-center">
          <input
            type="text"
            placeholder="Search by order number or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/3 p-2 border border-[#E6AF2E] rounded-lg focus:ring-2 focus:ring-[#6B0504]"
          />
        </div>

        <div className="overflow-x-auto bg-[#FBFFFE] shadow-md rounded-lg">
          {loading ? (
            <p className="text-center py-6">Loading orders...</p>
          ) : Array.isArray(filteredOrders) && filteredOrders.length === 0 ? (
            <p className="text-center py-6 text-[#6B0504]">No orders found!</p>
          ) : (
            <table className="w-full">
              <thead className="bg-[#6B0504] text-[#FBFFFE]">
                <tr>
                  <th className="text-left px-4 py-2">Order No</th>
                  <th className="text-left px-4 py-2">Username</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Address</th>
                  <th className="text-center px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filteredOrders) &&
                  filteredOrders.map((order) => (
                    <tr key={order.orderNo} className="border-t border-[#A3320B]">
                      <td className="px-4 py-2 text-[#001514]">{order.orderNo}</td>
                      <td className="px-4 py-2 text-[#001514]">{order.username}</td>
                      <td className="px-4 py-2 text-[#001514]">
                        <select
                          defaultValue={order.status}
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
                      <td className="px-4 py-2 text-[#001514]">{order.address}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete(order.orderNo)}
                          className="px-4 py-2 bg-[#A3320B] text-[#FBFFFE] rounded-lg hover:bg-[#6B0504] transition"
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
