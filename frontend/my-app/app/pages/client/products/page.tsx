"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import axiosInstance from "../../../utils/axiosInstance";
import Navbar from "@/app/components/navbar/page";
import Remi from '@/app/components/remi/page';
import { Product } from "@/app/_lib/page"; // assuming Product interface exists in _lib/page.ts
import { Cart } from "@/app/_lib/page";
import {CartItem}from"@/app/_lib/page";
import { CartResponse } from "@/app/_lib/page";

export default function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

 

  // Fetch products (dishes) from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const cookieResponse = await fetch(
          "http://localhost:3001/auth/get-cookie-data",
          { credentials: "include" }
        );
        const { userData } = await cookieResponse.json();
        const username = userData?.payload?.username;

        if (!username) {
          throw new Error("User not logged in.");
        }
        setUsername(username);

        const cartResponse = await axios.get<CartResponse>(
          `http://localhost:3001/cart/${username}`,
          { withCredentials: true }
        );
        setCart(cartResponse.data.products);

        setLoading(false);
      }catch (err: any) {
        setError(err.message || "An error occurred while fetching data.");
        setLoading(false);
      }
      try {
        const response = await axiosInstance.get<Product[]>("/products/getAll");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []); // Fetch products only once on component mount
  const handleAddToCart = async (productId: string) => {
    try {
      const response = await axios.post(`http://localhost:3001/cart/${username}/product`, 
        { productId, quantity: 1 }, 
        { withCredentials: true }
      );
      const data = response.data as CartResponse; // Cast response.data to CartResponse
      setCart(data.products); // Access the `products` array
    } catch (err: any) {
      setError(err.message || "An error occurred while adding to cart.");
    }
  };

  
  const handleIncrement = async (productId: string) => {
    try {
      const response = await axios.patch(`http://localhost:3001/cart/${username}/product/${productId}/increment`, 
        {}, 
        { withCredentials: true }
      );
      const data = response.data as CartResponse; // Cast response.data to CartResponse
      setCart(data.products); // Access the `products` array
    } catch (err: any) {
      setError(err.message || "An error occurred while incrementing quantity.");
    }
  };

  const handleDecrement = async (productId: string) => {
    try {
      const response = await axios.patch(`http://localhost:3001/cart/${username}/product/${productId}/decrement`, 
        {}, 
        { withCredentials: true }
      );
      const data = response.data as CartResponse; // Cast response.data to CartResponse
      setCart(data.products); // Access the `products` array
    } catch (err: any) {
      setError(err.message || "An error occurred while decrementing quantity.");
    }
  };
  if (loading) return <div className="text-center py-8">Loading...</div>;
 


  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f5e4c9] text-[#400000] p-6">
      {/* Navbar */}
      <Navbar />

      {/* Logo */}
      <div className="my-6">
        <Remi />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-[#400000] mb-8 drop-shadow-lg text-center">Welcome to Ratatouille's Menu</h1>

         {/* Menu List */}
         <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">

        {products.map((product: Product) => {
          const cartItem = cart.find((item) => item.productId === product._id);
          const isInCart = !!cartItem;

          return (
            <li
              key={product._id.toString()}
             className="rounded-xl shadow-lg p-6 text-center transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={product.image || "https://i.pinimg.com/736x/5c/03/8e/5c038ef5a0d0dc34c86583823c20dc6c.jpg"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
             <h2
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#400000",
              }}
            >
              {product.name}
            </h2>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <p className="text-lg font-bold text-[#D47043] mt-2">${product.price}</p>

              {isInCart ? (
                <div className="flex items-center justify-center gap-4 mt-4">
                  <button
                    onClick={() => handleDecrement(product._id)}
                    className="w-10 h-10 bg-[#D47043] rounded-full text-white font-semibold hover:bg-[#C25D33]"
                  >
                    -
                  </button>
                  <span className="font-semibold text-lg text-[#D47043]">{cartItem.quantity}</span>                  <button
                    onClick={() => handleIncrement(product._id)}
                    className="w-10 h-10 bg-[#D47043] rounded-full text-white font-semibold hover:bg-[#C25D33]"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="mt-4 px-6 py-2 bg-[#D47043] text-white font-semibold rounded-lg shadow-md hover:bg-[#C25D33] transition duration-300"
                >
                  Add to Cart
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

