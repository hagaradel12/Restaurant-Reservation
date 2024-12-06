"use client"

import React, { useState } from 'react';
import axios from 'axios';

interface Item {
  productId: string;
  quantity: number;
}

const CheckoutPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [items, setItems] = useState<Item[]>([]); // You will need to get the items from your cart state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to handle order submission
  const handleOrder = async () => {
    if (!username || !address || !paymentMethod) {
      setError('Please fill in all fields');
      return;
    }

    // Prepare the order data
    const orderData = {
      username,
      items,
      address,
      paymentMethod,
    };

    try {
      // Send the order data to the backend API
      const response = await axios.post('http://localhost:3001/orders', orderData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setSuccess('Order placed successfully!');
        setError('');
      }
    } catch (error) {
      setError('Failed to place order. Please try again.');
      setSuccess('');
      console.error(error);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      {/* Display any error or success message */}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={(e) => e.preventDefault()}>
        {/* Username Field */}
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Address Field */}
        <div>
          <label>Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        {/* Payment Method Field */}
        <div>
          <label>Payment Method</label>
          <input
            type="text"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          />
        </div>

        {/* Order Summary */}
        <div>
          <h3>Order Summary</h3>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item.productId} - Quantity: {item.quantity}
              </li>
            ))}
          </ul>
        </div>

        {/* Submit Button */}
        <div>
          <button type="button" onClick={handleOrder}>
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
