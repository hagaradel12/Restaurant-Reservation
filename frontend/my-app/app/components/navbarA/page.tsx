'use client'
import Link from "next/link"; // Import Link from Next.js

const NavbarA = () => {
  return (
    <div>
      {/* Navbar */}
      <div
        className="fixed top-0 left-0 w-full bg-[#001514] text-[#FBFFFE] h-16 flex items-center justify-between px-6 z-50"
      >
        {/* Logo or Restaurant Name */}
        <h2 className="text-2xl font-semibold">Below The Hat</h2>

        {/* Menu Links */}
        <div className="flex space-x-6">
          <h3 className="text-xl font-medium">
            <Link href="/pages/admin/admin-dashboard" className="text-[#FBFFFE] hover:bg-[#6B0504] px-4 py-2 rounded-md">
              Home
            </Link>
          </h3>
          <h3 className="text-xl font-medium">
            <Link href="/pages/admin/products" className="text-[#FBFFFE] hover:bg-[#6B0504] px-4 py-2 rounded-md">
              Menu Items
            </Link>
          </h3>
          <h3 className="text-xl font-medium">
            <Link href="/pages/admin/booking" className="text-[#FBFFFE] hover:bg-[#6B0504] px-4 py-2 rounded-md">
              Book
            </Link>
          </h3>
          <h3 className="text-xl font-medium">
            <Link href="/pages/admin/orders" className="text-[#FBFFFE] hover:bg-[#6B0504] px-4 py-2 rounded-md">
               Orders
            </Link>
          </h3>
          <h3 className="text-xl font-medium">
            <Link href="/pages/profile" className="text-[#FBFFFE] hover:bg-[#6B0504] px-4 py-2 rounded-md flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm0 0c-4.97 0-9 4.03-9 9 0 .552.448 1 1 1h16c.552 0 1-.448 1-1 0-4.97-4.03-9-9-9z"
                />
              </svg>
            </Link>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default NavbarA;
