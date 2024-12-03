"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from "../../../utils/axiosInstance";
import Navbar from "@/app/components/navbar/page";
import { Product } from "@/app/_lib/page"; // assuming Product interface exists in _lib/page.ts

export default function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  // Function to handle adding products to cart (assuming cart API is in place)
  const handleAddToCart = async (productId: string) => {
    try {
        const token = localStorage.getItem("token"); // Retrieve the JWT token
        if (!token) {
          alert("You need to log in to add items to the cart.");
          return;
        }
      await axiosInstance.post('/cart', { productId, quantity: 1 },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  // Fetch products (dishes) from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products/getAll");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []); // Fetch products only once on component mount

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f9f9f9] p-6">
      {/* Navbar */}
      <Navbar />

      <h1 className="text-3xl font-bold text-[#3C312C] mb-8">Restaurant Menu</h1>

      {/* Menu List */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
        {products.map((product: Product) => (
          <li
            key={product._id.toString()}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-[#3C312C]">{product.name}</h2>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <p className="text-lg font-bold text-[#D47043] mt-2">${product.price}</p>

            <button
              type="button"
              onClick={() => handleAddToCart(product._id)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition duration-300"
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
