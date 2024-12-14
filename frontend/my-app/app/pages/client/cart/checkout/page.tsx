'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Define the structure for a single cart item
interface CartItem {
  productId: string;
  quantity: number;
}

// Define the structure of the cart response
interface CartResponse {
  items: CartItem[];  // The cart contains an array of CartItems
}

const CheckoutPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [items, setItems] = useState<CartItem[]>([]); // Initialize items as an empty array
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
      const response = await axios.get<CartResponse>(`http://localhost:3001/cart/${username}`, {
        withCredentials: true,
      });
      setItems(response.data.items); // Update the items state with the fetched data
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Failed to fetch cart items. Please try again.');
      setLoading(false);
    }
  };

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

      if (response.status === 200) {
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
    <div className="bg-[#B1B7B9] min-h-screen flex justify-center items-center">
      <div className="w-full max-w-lg bg-[#C6A570] p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-[#3C312C] mb-4">Checkout</h1>

        {/* Display any error or success message */}
        {error && <div className="text-[#C0735B] text-sm font-medium mb-2">{error}</div>}
        {success && <div className="text-[#525757] text-sm font-medium mb-2">{success}</div>}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-[#3C312C]">Username</label>
            <input
              type="text"
              value={username}
              readOnly
              required
              className="w-full mt-1 px-4 py-2 border border-[#B1B7B9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D47043]"
            />
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-sm font-medium text-[#3C312C]">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border border-[#B1B7B9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D47043]"
            />
          </div>

          {/* Payment Method Field */}
          <div>
            <label className="block text-sm font-medium text-[#3C312C]">Payment Method</label>
            <input
              type="text"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border border-[#B1B7B9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D47043]"
            />
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold text-[#3C312C]">Order Summary</h3>
            <ul className="list-disc list-inside text-sm text-[#525757] mt-2">
              {Array.isArray(items) && items.length > 0 ? (
                items.map((item, index) => (
                  <li key={index}>
                    {item.productId} - Quantity: {item.quantity}
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
              className="w-full bg-[#D47043] text-white text-sm font-medium py-2 rounded-md hover:bg-[#C0735B] focus:outline-none focus:ring-2 focus:ring-[#D47043]"
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
