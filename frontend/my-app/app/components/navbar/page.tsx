import Link from "next/link"; // Import Link from Next.js

const Navbar = () => {
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
            <Link href="/pages/client/homepage" className="text-[#FBFFFE] hover:bg-[#6B0504] px-4 py-2 rounded-md">
              Home
            </Link>
          </h3>
          <h3 className="text-xl font-medium">
            <Link href="/pages/client/products" className="text-[#FBFFFE] hover:bg-[#6B0504] px-4 py-2 rounded-md">
              Menu Items
            </Link>
          </h3>
          <h3 className="text-xl font-medium">
            <Link href="/pages/client/booking" className="text-[#FBFFFE] hover:bg-[#6B0504] px-4 py-2 rounded-md">
              Book
            </Link>
          </h3>
          <h3 className="text-xl font-medium">
            <Link href="/pages/client/cart" className="text-[#FBFFFE] hover:bg-[#6B0504] px-4 py-2 rounded-md">
              Cart
            </Link>
          </h3>
          <h3 className="text-xl font-medium">
            <Link href="/pages/client/orders" className="text-[#FBFFFE] hover:bg-[#6B0504] px-4 py-2 rounded-md">
              My Orders
            </Link>
          </h3>
          <h3 className="text-xl font-medium">
            <Link href="/signout" className="text-[#FBFFFE] hover:bg-[#6B0504] px-4 py-2 rounded-md">
              Sign Out
            </Link>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
