"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Button, Typography, IconButton, MenuItem, Select } from "@mui/material";
import { Delete, Add, Remove } from "@mui/icons-material";
import { useRouter } from "next/navigation";  // Import useRouter

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
      console.log(userData.payload.username)
      
      if (!userData.payload.username) {
        
        console.error("No cookie data found");
        setError("No cookie data found");
        setLoading(false);
        return;
      }
      
      const username =userData.payload.username;

      console.log(username)
     
      axios
        .get(`http://localhost:3001/cart/${username}`, { withCredentials: true })
        .then(async (response) => {
          const cartData = response.data;
          const updatedCart = await Promise.all(
            cartData.products.map(async (item: any) => {
              try {
                const productResponse = await axios.get(
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
          setError(error.message);
          setLoading(false);
        });
    } catch (error) {
      setError("Error fetching cookie data");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCookieData();
  }, []);

  const handleQuantityChange = async (productId: string, quantity: number) => {
    try {
      await axios.patch(
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
      await axios.delete(
        `http://localhost:3001/cart/${cart.username}/product/${productId}`,
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
      await axios.delete(`http://localhost:3001/cart/${cart.username}`, {
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
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-4xl px-4 py-8 bg-white shadow-lg rounded-lg text-black">
        <Typography
          variant="h4"
          className="text-center text-black font-semibold mb-6"
        >
          Your Cart
        </Typography>

        {cart && cart.products.length > 0 ? (
          <div className="space-y-8">
            {cart.products.map((item: any) => (
              <div
                key={item.productId}
                className="flex items-center justify-between bg-black-100 p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center space-x-6">
                  <img
                    src={item.product?.image || "/default-image.jpg"}
                    alt={item.product?.name || "Product"}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <Typography variant="h6">{item.product?.name}</Typography>
                    <Typography variant="body2">
                      {item.product?.description || "No description available"}
                    </Typography>
                    <Typography variant="h6">
                      ${item.product?.price?.toFixed(2) || "0.00"}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <IconButton
                    onClick={() =>
                      handleQuantityChange(
                        item.productId,
                        Math.max(item.quantity - 1, 1)
                      )
                    }
                  >
                    <Remove />
                  </IconButton>
                  <Select
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.productId, Number(e.target.value))
                    }
                    className="border rounded-lg"
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
                  >
                    <Add />
                  </IconButton>
                  <IconButton
                    onClick={() => handleRemoveItem(item.productId)}
                    className="text-red-500"
                  >
                    <Delete />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Typography variant="h6" className="text-center">
            Your cart is empty.
          </Typography>
        )}

        {cart && cart.products.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>
            <Button
  variant="contained"
  color="primary"
  onClick={() => {
    const cartItems = JSON.stringify(cart.products);  // Serialize cart items to pass in query
    router.push(`/pages/client/cart/checkout?username=${cart.username}&items=${encodeURIComponent(cartItems)}`);
  }}
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
