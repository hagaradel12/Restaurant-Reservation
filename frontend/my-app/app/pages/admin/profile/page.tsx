"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the type for user details
type UserDetails = {
  username: string;
  name: string;
  phoneNumber: string;
  email: string;
};

const ProfilePage: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null); // State to store user data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user data from cookies
        const cookieResponse = await fetch(
          "http://localhost:3001/auth/get-cookie-data",
          { credentials: "include" }
        );
        const { userData } = await cookieResponse.json();
        const username = userData?.payload?.username;

        if (!username) {
          throw new Error("User not logged in.");
        }

        // Fetch user details from the API
        const response = await axios.get<UserDetails>(
          `http://localhost:3001/users/${username}`
        );

        setUserDetails(response.data); // Set the fetched data
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User Profile</h1>
      {userDetails ? (
        <div>
          <p>
            <strong>Username:</strong> {userDetails.username}
          </p>
          <p>
            <strong>Name:</strong> {userDetails.name}
          </p>
          <p>
            <strong>Phone Number:</strong> {userDetails.phoneNumber}
          </p>
          <p>
            <strong>Email:</strong> {userDetails.email}
          </p>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default ProfilePage;
