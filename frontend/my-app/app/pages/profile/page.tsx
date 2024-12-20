"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import '../profile/style.css'; // Import the CSS file
import Navbar from "@/app/components/navbar/page";
import NavbarA from "@/app/components/navbarA/page";

type UserDetails = {
  username: string;
  name: string;
  phoneNo: string;
  email: string;
};

const ProfilePage: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [NavbarComponent, setNavbarComponent] = useState<React.FC | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const cookieResponse = await fetch(
          "http://localhost:3001/auth/get-cookie-data",
          { credentials: "include" }
        );
        const { userData } = await cookieResponse.json();
        const username = userData?.payload?.username;
       
        if(userData?.payload?.isAdmin){
          setNavbarComponent(() => NavbarA);
        }
        else  setNavbarComponent(() => Navbar);
        if (!username) {
          throw new Error("User not logged in.");
        }

        const response = await axios.get<UserDetails>(
          `http://localhost:3001/users/${username}`
        );

        setUserDetails(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="profile-container">
       {NavbarComponent && <NavbarComponent />}
      <h1>User Profile</h1>
      {userDetails ? (
        <table className="profile-table">
          <tbody>
            <tr>
              <th>Username</th>
              <td>{userDetails.username}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{userDetails.name}</td>
            </tr>
            <tr>
              <th>Phone Number</th>
              <td>{userDetails.phoneNo}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{userDetails.email}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default ProfilePage;