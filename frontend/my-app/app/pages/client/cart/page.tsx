"use client";

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Button, Grid, Typography, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Delete } from '@mui/icons-material';

const CartPage = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchCookieData() {
    try {
      const response = await fetch('http://localhost:3001/auth/get-cookie-data', { credentials: 'include' });
      const { userData } = await response.json();

      if (!userData) {
        console.error('No cookie data found');
        setError('No cookie data found');
        setLoading(false);
        return;
      }

      const username = JSON.parse(userData).username;

      axios
        .get(`http://localhost:3001/cart/${username}`, { withCredentials: true })
        .then(async (response) => {
          const cartData = response.data;
          const updatedCart = await Promise.all(
            cartData.products.map(async (item: any) => {
              try {
                const productResponse = await axios.get(`http://localhost:3001/products/productId/${item.productId}`);
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
      setError('Error fetching cookie data');
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCookieData();
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setCart((prevCart: any) => {
      const updatedProducts = prevCart.products.map((product: any) =>
        product.productId === productId
          ? { ...product, quantity: newQuantity }
          : product
      );
      return { ...prevCart, products: updatedProducts };
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart: any) => {
      const updatedProducts = prevCart.products.filter((product: any) => product.productId !== productId);
      return { ...prevCart, products: updatedProducts };
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white shadow-lg rounded-xl">
      <Typography variant="h4" className="text-center text-gray-800 font-semibold mb-6">Your Cart</Typography>
      
      {cart && cart.products.length > 0 ? (
        <div className="space-y-8">
          {cart.products.map((item: any) => (
            <div
              key={item.productId}
              className="flex items-center justify-between bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
            >
              <div className="flex flex-col items-center md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                <img
                  src={item.product?.image}
                  alt={item.product?.name}
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
                <div className="text-center md:text-left">
                  <Typography variant="h6" className="text-gray-900 font-semibold mb-2">{item.product?.name}</Typography>
                  <Typography variant="body2" className="text-gray-500 mb-2">{item.product?.description}</Typography>
                  <Typography variant="h6" className="text-gray-800 font-bold">${item.product?.price.toFixed(2)}</Typography>
                </div>
              </div>

              <div className="flex flex-col items-center md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                <FormControl variant="filled" fullWidth>
                  <InputLabel>Quantity</InputLabel>
                  <Select
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                    label="Quantity"
                    className="w-24"
                  >
                    {[...Array(10).keys()].map((i) => (
                      <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <IconButton
                  onClick={() => handleRemoveItem(item.productId)}
                  color="secondary"
                  className="text-red-500 hover:text-red-700"
                >
                  <Delete />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Typography variant="body1" className="text-center text-gray-500">No items in your cart.</Typography>
      )}

      {cart && cart.products.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          className="w-full py-3 mt-8 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
        >
          Proceed to Checkout
        </Button>
      )}
    </div>
  );
};

export default CartPage;
