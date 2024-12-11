"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  image?: string;
  description: string;
  price: number;
}

interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

interface CartResponse {
  products: CartItem[];
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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

        const productResponse = await axios.get<Product[]>(
          "http://localhost:3001/products/getAll",
          { withCredentials: true }
        );
        setProducts(productResponse.data);

        const cartResponse = await axios.get<CartResponse>(
          `http://localhost:3001/cart/${username}`,
          { withCredentials: true }
        );
        setCart(cartResponse.data.products);

        setLoading(false);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (productId: string) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/cart/${username}/product`,
        { productId, quantity: 1 },
        { withCredentials: true }
      );
      setCart(response.data.products);
    } catch (err: any) {
      setError(err.message || "An error occurred while adding to cart.");
    }
  };

  const handleIncrement = async (productId: string) => {
    try {
      const response = await axios.patch(
       ` http://localhost:3001/cart/${username}/product/${productId}/increment`,
        {},
        { withCredentials: true }
      );
      setCart(response.data.products);
    } catch (err: any) {
      setError(err.message || "An error occurred while incrementing quantity.");
    }
  };

  const handleDecrement = async (productId: string) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/cart/${username}/product/${productId}/decrement`,
        {},
        { withCredentials: true }
      );
      setCart(response.data.products);
    } catch (err: any) {
      setError(err.message || "An error occurred while decrementing quantity.");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f9f9f9] p-6">
      {/* Navbar */}
      <div className="w-full text-center mb-8">
        <img
          src="https://i.pinimg.com/736x/0f/e7/38/0fe738f4f2ee955eaa85230fb0337c67.jpg"
          alt="Ratatouille Logo"
          className="w-32 mx-auto"
        />
      </div>

      <h1 className="text-3xl font-bold text-[#3C312C] mb-8">Ratatouille's Menu</h1>

      {/* Menu List */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
        {products.map((product: Product) => {
          const cartItem = cart.find((item) => item.productId === product._id);
          const isInCart = !!cartItem;

          return (
            <li
              key={product._id.toString()}
              className="bg-white rounded-lg shadow-md p-6 text-center border-2 border-[#D47043]"
            >
              <img
                src={product.image || "https://i.pinimg.com/736x/5c/03/8e/5c038ef5a0d0dc34c86583823c20dc6c.jpg"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold text-[#3C312C]">{product.name}</h2>
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
};

export default ProductPage;