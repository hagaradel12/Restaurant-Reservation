"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import Navbar from "@/app/components/navbar/page";
import Remi from '@/app/components/remi/page';
import { Product } from "@/app/_lib/page";

export default function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productImage, setProductImage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
  }, []);

  const handleAddProduct = async () => {
    try {
      const newProduct = {
        name: productName,
        price: productPrice,
        description: productDescription,
        image: productImage,
      };
      const response = await axiosInstance.post("/products", newProduct);
      setProducts([...products, response.data]);
      setProductName("");
      setProductDescription("");
      setProductPrice(0);
      setProductImage("");
    } catch (error: any) {
      setError(error.response?.data?.message || "An error occurred while adding the product.");
    }
  };

  const handleDeleteProduct = async (productName: string) => {
    try {
      await axiosInstance.delete(`/products/${productName}`);
      setProducts(products.filter((product) => product.name !== productName));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductDescription(product.description);
    setProductPrice(product.price);
    setProductImage(product.image || "");
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      const updatedProduct = {
        ...editingProduct,
        name: productName,
        description: productDescription,
        price: productPrice,
        image: productImage,
      };
      const response = await axiosInstance.put(`/products/${editingProduct.name}`, updatedProduct);
      setProducts(products.map((p) => (p.name === editingProduct.name ? response.data : p)));
      setEditingProduct(null);
      setProductName("");
      setProductDescription("");
      setProductPrice(0);
      setProductImage("");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f5e4c9] text-[#400000] p-6">
      {/* Navbar */}
      <Navbar />

      {/* Logo */}
      <div className="my-6">
        <Remi />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-[#400000] mb-8 drop-shadow-lg text-center">
        Welcome to Ratatouille's Menu
      </h1>

      {/* Product Form */}
      <div className="mb-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-[#400000] mb-4">
          {editingProduct ? "Edit Product" : "Add a New Product"}
        </h2>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-400 rounded"
        />
        <textarea
          placeholder="Product Description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-400 rounded"
        />
        <textarea
          placeholder="Product Image URL"
          value={productImage}
          onChange={(e) => setProductImage(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-400 rounded"
        />
        <input
          type="number"
          placeholder="Product Price"
          value={productPrice}
          onChange={(e) => setProductPrice(parseFloat(e.target.value))}
          className="w-full p-2 mb-4 border border-gray-400 rounded"
        />
        <button
          onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
          className="px-6 py-2 bg-[#400000] text-[#f2d4a5] font-semibold rounded-lg shadow-md hover:bg-[#551010] transition duration-300"
        >
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {/* Menu List */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {products.map((product: Product) => (
          <li
            key={product._id.toString()}
            className="rounded-xl shadow-lg p-6 text-center transition-transform transform hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={product.image || "https://i.pinimg.com/736x/5c/03/8e/5c038ef5a0d0dc34c86583823c20dc6c.jpg"}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-2xl font-semibold text-[#400000]">{product.name}</h2>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <p className="text-lg font-bold text-[#D47043] mt-2">${product.price}</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => handleEditProduct(product)}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(product.name)}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
