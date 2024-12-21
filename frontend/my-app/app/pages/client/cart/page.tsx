"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Button, Typography, IconButton, MenuItem, Select } from "@mui/material";
import { Delete, Add, Remove } from "@mui/icons-material";
import { useRouter } from "next/navigation";  // Import useRouter
import axiosInstance from "@/app/utils/axiosInstance";
import Navbar from "@/app/components/navbar/page";


interface Product {
  productId: string;
  quantity: number;
  product: {
    name: string;
    description: string;
    price: number;
    image: string;
  };
}

interface CartData {
  username: string;
  products: Product[];
}


const CartPage = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter

  async function fetchCookieData() {
    try {
      const response = await fetch("http://localhost:3001/auth/get-cookie-data", {
        credentials: "include",
      });
      const { userData } = await response.json();
      
      if (!userData.payload.username) {
        console.error("No cookie data found");
        setError("No cookie data found");
        setLoading(false);
        return;
      }

      const username = userData.payload.username;
      console.log(username);

      axiosInstance
        .get<CartData>(`http://localhost:3001/cart/${username}`, { withCredentials: true })
        .then(async (response) => {
          const cartData = response.data;
          const updatedCart = await Promise.all(
            cartData.products.map(async (item: any) => {
              try {
                const productResponse = await axiosInstance.get(
                  `http://localhost:3001/products/productId/${item.productId}`
                );
                return { ...item, product: productResponse.data };
              } catch (error) {
                console.error(`Failed to fetch product with ID ${item.productId}`, error);
                return item;
              }
            })
          );
          setCart({ ...cartData, products: updatedCart });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch cart data", error);
          setError("Failed to fetch cart data");
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching cookie data", error);
      setError("Error fetching cookie data");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCookieData();
  }, []);

  const handleQuantityChange = async (productId: string, quantity: number) => {
    try {
      await axiosInstance.patch(
        `http://localhost:3001/cart/${cart.username}/product/${productId}`,
        { quantity },
        { withCredentials: true }
      );

      setCart((prevCart: any) => {
        const updatedProducts = prevCart.products.map((item: any) =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        );
        return { ...prevCart, products: updatedProducts };
      });
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await axiosInstance.delete(
       ` http://localhost:3001/cart/${cart.username}/product/${productId}`,
        { withCredentials: true }
      );

      setCart((prevCart: any) => {
        const updatedProducts = prevCart.products.filter(
          (item: any) => item.productId !== productId
        );
        return { ...prevCart, products: updatedProducts };
      });
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await axiosInstance.delete(`http://localhost:3001/cart/${cart.username}`, {
        withCredentials: true,
      });
      setCart({ username: cart.username, products: [] });
    } catch (error) {
      console.error("Failed to clear cart", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#FBFFFE] to-[#6B0504] p-4">
      {/* Navbar */}
      <Navbar />

      <div className="w-full max-w-5xl px-6 py-10 bg-white shadow-2xl rounded-lg text-gray-800">
        <Typography
          variant="h4"
          className="text-center font-bold mb-8 text-[#001514]"
        >
          Your Cart
        </Typography>

        {cart && cart.products.length > 0 ? (
          <div className="space-y-6">
            {cart.products.map((item: any) => (
              <div
                key={item.productId}
                className="cart-item flex flex-col sm:flex-row items-center justify-between bg-[#FBFFFE] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-6">
                  <img
                    src={item.product?.image || "/default-image.jpg"}
                    alt={item.product?.name || "Product"}
                    className="w-20 h-20 object-cover rounded-lg border border-[#6B0504]"
                  />
                  <div>
                    <Typography
                      variant="h6"
                      className="font-semibold text-[#001514] product-name"
                    >
                      {item.product?.name}
                    </Typography>
                    <Typography variant="body2" className="text-[#6B0504]">
                      {item.product?.description || "No description available"}
                    </Typography>
                    <Typography
                      variant="h6"
                      className="font-bold text-[#6B0504] mt-2"
                    >
                      ${item.product?.price?.toFixed(2) || "0.00"}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <IconButton
                    onClick={() =>
                      handleQuantityChange(
                        item.productId,
                        Math.max(item.quantity - 1, 1)
                      )
                    }
                    className="bg-[#FBFFFE] hover:bg-[#6B0504] rounded-full p-1"
                  >
                    <Remove />
                  </IconButton>
                  <Select
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.productId, Number(e.target.value))
                    }
                    className="border border-[#6B0504] rounded-lg"
                  >
                    {[...Array(10).keys()].map((x) => (
                      <MenuItem key={x + 1} value={x + 1}>
                        {x + 1}
                      </MenuItem>
                    ))}
                  </Select>
                  <IconButton
                    onClick={() =>
                      handleQuantityChange(
                        item.productId,
                        Math.min(item.quantity + 1, 10)
                      )
                    }
                    className="bg-[#FBFFFE] hover:bg-[#6B0504] rounded-full p-1"
                  >
                    <Add />
                  </IconButton>
                  <IconButton
                    onClick={() => handleRemoveItem(item.productId)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Delete />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Typography
            variant="h6"
            className="text-center text-[#001514] mt-8"
          >
            Your cart is empty.
          </Typography>
        )}

        {cart && cart.products.length > 0 && (
          <div className=" mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClearCart}
              className="w-full sm:w-auto border border-[#6B0504] hover:bg-[#FBFFFE]"
            >
              Clear Cart
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                const cartItems = JSON.stringify(cart.products); // Serialize cart items to pass in query
                router.push(
                  `/pages/client/cart/checkout`
                );
              }}
              className="w-full sm:w-auto bg-[#6B0504] hover:bg-[#3C312C]"
            >
              Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;