'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/navbar/page';
import axiosInstance from '@/app/utils/axiosInstance';

// Define the structure for a single cart item
interface CartItem {
  productId: string;
  quantity: number;
}

interface products {
  name: string;
  quantity: number;
}

interface Product {
 // _id:string;
  name: string;
//  quantity:number
}

// Define the structure of the cart response
interface CartResponse {
  products: CartItem[];  // The cart contains an array of CartItems

}

const CheckoutPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [items, setItems] = useState<products[]>([]); // Initialize items as an empty array
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  const router = useRouter(); // Initialize the router

  // Function to fetch user data from the cookie
  const fetchCookieData = async () => {
    try {
      const response = await fetch('http://localhost:3001/auth/get-cookie-data', {
        credentials: 'include',
      });

      const { userData } = await response.json();
      const username = userData.payload.username;

      if (!username) {
        console.error('No cookie data found');
        setError('No cookie data found');
        setLoading(false);
        return;
      }

      setUsername(username);
      console.log('Fetched username:', username);
      
      // Fetch cart items for the user
      await fetchCart(username);
    } catch (error) {
      console.error('Error fetching cookie data:', error);
      setError('Error fetching cookie data');
      setLoading(false);
    }
  };

// Fetch cart data based on username
const fetchCart = async (username: string) => {
  try {
    const response = await axiosInstance.get<CartResponse>(`http://localhost:3001/cart/${username}`, {
      withCredentials: true,
    });

    const products: { name: string, quantity: number }[] = [];

    for (const product of response.data.products) {
      const productResponse = await axiosInstance.get<Product>(`http://localhost:3001/products/productId/${product.productId}`);
      products.push({
        name: productResponse.data.name,
        quantity: product.quantity,
      });
      console.log(product)
    }

    setItems(products); // Update the items state with the fetched data
    setLoading(false); // Set loading to false once data is fetched
  } catch (error) {
    console.error('Error fetching cart items')
    }};


  // Fetch data on component mount
  useEffect(() => {
    fetchCookieData();
  }, []);

  // Function to handle order submission
  const handleOrder = async () => {
    if (!username || !address || !paymentMethod) {
      setError('Please fill in all fields');
      return;
    }

    // Prepare the order data with items from the cart
    const orderData = {
      username,
      items, // Cart items
      address,
      paymentMethod,
      status: 'pending', // Default order status
    };

    try {
      // Send the order data to the backend API
      const response = await axios.post('http://localhost:3001/orders', orderData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        setSuccess('Order placed successfully!');
        setError('');
        // Redirect to the home page after a successful order
        setTimeout(() => {
          router.push('/pages/client/homepage'); // Redirect to the home page
        }, 2000); // Delay the redirect by 2 seconds to let the user see the success message
      }
    } catch (error) {
      setError('Failed to place order. Please try again.');
      setSuccess('');
      console.error(error);
    }
  };

 
  return (
    <div className="bg-[#FBFFFE] min-h-screen flex justify-center items-center">
      {/* Navbar */}
      <Navbar />

      <div className="w-full max-w-lg bg-[#6B0504] p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-[#FBFFFE] mb-4">Checkout</h1>

        {/* Display any error or success message */}
        {error && <div className="text-[#6B0504] text-sm font-medium mb-2">{error}</div>}
        {success && <div className="text-[#001514] text-sm font-medium mb-2">{success}</div>}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-[#FBFFFE]">Username</label>
            <input
              type="text"
              value={username}
              readOnly
              required
              className="text-black w-full mt-1 px-4 py-2 border border-[#FBFFFE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6AF2E]"
            />
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-sm font-medium text-[#FBFFFE]">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="text-black w-full mt-1 px-4 py-2 border border-[#FBFFFE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6AF2E]"
            />
          </div>

          {/* Payment Method Field */}
          <div>
            <label className="block text-sm font-medium text-[#FBFFFE]">Payment Method</label>
            <input
              type="text"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              className="text-black w-full mt-1 px-4 py-2 border border-[#FBFFFE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6AF2E]"
            />
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold text-[#FBFFFE]">Order Summary</h3>
            <ul className="list-disc list-inside text-sm text-[#6B0504] mt-2 text-black">
              {Array.isArray(items) && items.length > 0 ? (
                items.map((item, index) => (
                  <li key={index}>
                    {item.name} - Quantity: {item.quantity}
                  </li>
                ))
              ) : (
                <li>No items in your cart</li>
              )}
            </ul>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="button"
              onClick={handleOrder}
              className="w-full bg-[#001514] text-[#AA33203] text-sm font-medium py-2 rounded-md hover:bg-[#FBFFFE] focus:outline-none focus:ring-2 focus:ring-[#FBFFFE]"
            >
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;