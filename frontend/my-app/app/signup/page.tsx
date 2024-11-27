"use client"
import { useState } from "react";
import Link from "next/link";

const SignupPage = () => {
  // State management for form inputs
  const [fullName, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [isAdmin, setIsAdmin] = useState(false); // Handle the isAdmin checkbox state
  const [error, setError] = useState(""); // To manage error messages
  const [isLoading, setIsLoading] = useState(false); // For loading state

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Prepare the user data
    const userData = {
      fullName,
      phoneNo,
      username,
      password,
      isAdmin,
    };

    setIsLoading(true);

    try {
      // Send data to the backend
      const response = await fetch('http://localhost:3000/register', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        // Handle success (you can redirect to login or display a success message)
        alert('Registration successful!');
      } else {
        // Handle error
        setError(result.message || 'An error occurred');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle checkbox toggle
  const handleCheckboxChange = () => {
    setIsAdmin((prevState) => !prevState);
  };

  return (
    <div className="min-h-screen bg-[url('/signup-bg.jpg')] bg-cover bg-center flex items-center justify-center">
      {/* Overlay */}
      <div className="bg-black bg-opacity-50 min-h-screen w-full flex items-center justify-center px-4">
        <div className="bg-white bg-opacity-90 shadow-xl rounded-lg p-8 w-full max-w-md">
          {/* Title */}
          <h1 className="text-3xl font-bold text-[#C9A47F] text-center mb-6">Sign Up</h1>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Fields */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-black">Full Name</label>
              <input
                type="text"
                id="fullName"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#C9A47F] focus:border-[#C9A47F] text-black"
              />
            </div>

            <div>
              <label htmlFor="phoneNo" className="block text-sm font-medium text-black">Phone Number</label>
              <input
                type="text"
                id="phoneNo"
                placeholder="123-456-7890"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#C9A47F] focus:border-[#C9A47F] text-black"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-black">Username</label>
              <input
                type="text"
                id="username"
                placeholder="username123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#C9A47F] focus:border-[#C9A47F] text-black"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#C9A47F] focus:border-[#C9A47F] text-black"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#C9A47F] focus:border-[#C9A47F] text-black"
              />
            </div>

            {/* Admin Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-[#C9A47F] border-gray-300 rounded focus:ring-[#C9A47F]"
              />
              <label htmlFor="isAdmin" className="ml-2 text-sm font-medium text-black">
                Register as an Admin
              </label>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#C9A47F] text-white font-semibold rounded-lg hover:bg-[#b1906b] shadow-md transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Sign Up'}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-[#C9A47F] font-semibold hover:underline">
                Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
