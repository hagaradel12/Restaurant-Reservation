'use client';

import React, { useState, useEffect } from 'react';
import { FaHatCowboySide, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Corrected import

const backend_url = 'http://localhost:3001'; // Define the backend URL

interface CartItem {
  productId: string; // Keep productId as string
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

// Define the correct interface for the decoded token
interface DecodedToken {
  username: string;  // Username field directly at the root
  role: boolean;     // Role field directly at the root
  exp: number;       // Expiration time
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);

  // Extract username from token on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUsername(decoded.username);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Fetch the cart on page load
  useEffect(() => {
    if (!username) return;
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${backend_url}/cart/:hana1`);
        const fetchedItems = await Promise.all(
          response.data.products.map(async (item: { productId: string; quantity: number }) => {
            try {
              const productResponse = await axios.get(`${backend_url}/product/${item.productId}`);
              return {
                productId: item.productId,
                name: productResponse.data.name,
                description: productResponse.data.description,
                price: productResponse.data.price,
                quantity: item.quantity,
                imageUrl: productResponse.data.imageUrl,
              };
            } catch (error) {
              console.error(`Error fetching product ${item.productId}:`, error);
              return null;
            }
          })
        );
        setCartItems(fetchedItems.filter((item) => item !== null) as CartItem[]);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartItems([]); // Ensure cartItems is an empty array if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [username]);

  const handleIncrement = async (productId: string) => {
    try {
      const response = await axios.patch(
        `${backend_url}/cart/${username}/product/${productId}/increment`
      );
      setCartItems(response.data.products);
    } catch (error) {
      console.error('Error incrementing quantity:', error);
    }
  };

  const handleDecrement = async (productId: string) => {
    try {
      const response = await axios.patch(
        `${backend_url}/cart/${username}/product/${productId}/decrement`
      );
      setCartItems(response.data.products);
    } catch (error) {
      console.error('Error decrementing quantity:', error);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      const response = await axios.delete(
        `${backend_url}/cart/${username}/product/${productId}`
      );
      setCartItems(response.data.products);
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.delete(`${backend_url}/cart/${username}`);
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-gradient-to-r from-[#ffe0b2] to-[#ffcc80] p-8 min-h-screen text-gray-800">
      <h1 className="text-center text-5xl font-extrabold text-indigo-900 mb-12 text-shadow-xl">
        Ratatouille Bistro Cart
      </h1>

      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : (
        <div className="space-y-10 max-w-7xl mx-auto">
          {cartItems.length === 0 ? (
            <div className="text-center text-lg text-gray-500">
              <FaHatCowboySide className="text-6xl text-red-600 mb-4 animate-bounce" />
              <p>Your cart is empty!</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex bg-white rounded-lg p-6 shadow-xl hover:shadow-2xl transition-all duration-300 space-x-6"
              >
                <div className="flex-shrink-0 w-32 h-32">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-grow">
                  <h2 className="text-3xl font-semibold text-indigo-700 hover:text-indigo-900 transition-all">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                  <p className="text-lg text-green-600 mt-4">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center mt-4 space-x-4">
                    <button
                      onClick={() => handleDecrement(item.productId)}
                      className="bg-gray-300 text-gray-800 p-2 rounded-full hover:bg-gray-400 transition-all duration-200"
                    >
                      -
                    </button>
                    <span className="text-xl">{item.quantity}</span>
                    <button
                      onClick={() => handleIncrement(item.productId)}
                      className="bg-gray-300 text-gray-800 p-2 rounded-full hover:bg-gray-400 transition-all duration-200"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="mt-4 flex items-center space-x-2 text-red-600 hover:text-red-800 transition-all"
                  >
                    <FaTrashAlt className="mr-2" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))
          )}
          {cartItems.length > 0 && (
            <div className="flex justify-between items-center mt-10 bg-white p-6 rounded-lg shadow-xl">
              <p className="text-xl font-semibold">
                Total: ${totalAmount.toFixed(2)}
              </p>
              <button
                onClick={handleClearCart}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPage;
