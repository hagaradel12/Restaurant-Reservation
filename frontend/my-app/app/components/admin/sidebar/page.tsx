'use client';

import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 bg-[#001514] p-6"> {/* Rich Black background */}
      <div className="text-2xl font-bold text-[#FBFFFE] mb-6"> {/* Xanthous for the title */}
        Restaurant Admin
      </div>
      <nav>
        <ul>
          <li>
            <Link
              href="/pages/admin/admin-dashboard"
              className="block py-3 hover:bg-[#6B0504] text-[#FBFFFE] rounded transition" 
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/pages/admin/products"
              className="block py-3 hover:bg-[#6B0504] text-[#FBFFFE] rounded transition"
            >
              Menu
            </Link>
          </li>
          <li>
            <Link
              href="/pages/admin/booking"
              className="block py-3 hover:bg-[#6B0504] text-[#FBFFFE] rounded transition"
            >
              Bookings
            </Link>
          </li>
          <li>
            <Link
              href="/pages/admin/profile"
              className="block py-3 hover:bg-[#6B0504] text-[#FBFFFE] rounded transition"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              href="/pages/admin/orders"
              className="block py-3 hover:bg-[#6B0504] text-[#FBFFFE] rounded transition"
            >
              Orders
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
