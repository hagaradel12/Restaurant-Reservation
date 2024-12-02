'use client';

import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 bg-[#3C312C] p-6">
      <div className="text-2xl font-bold text-[#C6A570] mb-6">
        Restaurant Admin
      </div>
      <nav>
        <ul>
          <li>
            <Link
              href="/pages/admin/admin-dashboard"
              className="block py-3 hover:bg-[#D47043] text-[#B1B7B9] rounded transition"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/pages/admin/menu"
              className="block py-3 hover:bg-[#D47043] text-[#B1B7B9] rounded transition"
            >
              Menu
            </Link>
          </li>
          <li>
            <Link
              href="/pages/admin/booking"
              className="block py-3 hover:bg-[#D47043] text-[#B1B7B9] rounded transition"
            >
              Bookings
            </Link>
          </li>
          <li>
            <Link
              href="/pages/admin/profile"
              className="block py-3 hover:bg-[#D47043] text-[#B1B7B9] rounded transition"
            >
              Profile
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
