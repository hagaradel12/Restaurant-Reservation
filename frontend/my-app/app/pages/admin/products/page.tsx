"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { Product } from "@/app/_lib/page";
import NavbarA from "@/app/components/navbarA/page";
import Remi from "@/app/components/remi/page";

interface ProductFormProps {
  onSubmit: (product: Partial<Product>) => void;
  onClose: () => void;
  editingProduct: Product | null;
}

function ProductForm({ onSubmit, onClose, editingProduct }: ProductFormProps) {
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productImage, setProductImage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingProduct) {
      setProductName(editingProduct.name);
      setProductDescription(editingProduct.description);
      setProductPrice(editingProduct.price);
      setProductImage(editingProduct.image || "");
    }
  }, [editingProduct]);

  const handleSubmit = () => {
    if (!productName || productPrice <= 0) {
      setError("Product name and price are required.");
      return;
    }
    onSubmit({
      name: productName,
      description: productDescription,
      price: productPrice,
      image: productImage,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-[#581845] mb-4">
          {editingProduct ? "Edit Product" : "Add a New Product"}
        </h2>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full p-3 mb-3 border border-[#D47043] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D47043] focus:border-transparent"
        />
        <textarea
          placeholder="Product Description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className="w-full p-3 mb-3 border border-[#D47043] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D47043] focus:border-transparent"
        />
        <textarea
          placeholder="Product Image URL"
          value={productImage}
          onChange={(e) => setProductImage(e.target.value)}
          className="w-full p-3 mb-3 border border-[#D47043] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D47043] focus:border-transparent"
        />
        <input
          type="number"
          placeholder="Product Price"
          value={productPrice}
          onChange={(e) => setProductPrice(parseFloat(e.target.value))}
          className="w-full p-3 mb-4 border border-[#D47043] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D47043] focus:border-transparent"
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#581845] text-[#FFFAF0] font-semibold rounded-lg shadow-md hover:bg-[#900C3F] transition-all duration-300"
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
        </div>
        {error && (
          <p className="text-red-500 mt-4 text-center font-medium">{error}</p>
        )}
      </div>
    </div>
  );
}

export default function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get<Product[]>("/products/getAll");
        setProducts(response.data);
      } catch (error: any) {
        console.error("Error fetching products:", error.message);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (newProduct: Partial<Product>) => {
    try {
      const response = await axiosInstance.post<Product>("/products", newProduct);
      setProducts([...products, response.data]);
    } catch (error: any) {
      console.error("Error adding product:", error.message);
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
    setShowForm(true);
  };

  const handleUpdateProduct = async (updatedProduct: Partial<Product>) => {
    if (!editingProduct) return;
    try {
      const response = await axiosInstance.patch<Product>(
        `/products/${editingProduct.name}`,
        updatedProduct
      );
      setProducts(
        products.map((p) =>p.name === editingProduct.name ? response.data : p)
      );
      setEditingProduct(null);
    } catch (error: any) {
      console.error("Error updating product:", error.message);
    }
  };

  const handleFormSubmit = (product: Partial<Product>) => {
    if (editingProduct) {
      handleUpdateProduct(product);
    } else {
      handleAddProduct(product);
    }
    setShowForm(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#FBFFFE] text-[#001514] p-6 mt-16">
    {/* Navbar */}
    <NavbarA />

    {/* Logo */}
    {/* <div className="my-6">
      <Remi />
    </div> */}

    {/* Title */}
    <h1 className="text-4xl font-bold text-[#001514] mb-8 drop-shadow-lg text-center">
      Welcome to Ratatouille's Menu
    </h1>
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-[#581845] text-[#FFFAF0] font-semibold rounded-lg shadow-md hover:bg-[#900C3F] transition-all duration-300"
          >
            Add New Product
          </button>
        </div>
        {showForm && (
          <ProductForm
            onSubmit={handleFormSubmit}
            onClose={() => setShowForm(false)}
            editingProduct={editingProduct}
          />
        )}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <li key={product._id} className="rounded-xl shadow-lg p-6">
              <img
                src={
                  product.image ||
                  "https://i.pinimg.com/736x/5c/03/8e/5c038ef5a0d0dc34c86583823c20dc6c.jpg"
                }
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p>{product.description}</p>
              <p className="text-lg font-bold">${product.price}</p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.name)}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg"
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
