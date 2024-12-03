import Link from "next/link";  // Import Link from Next.js

const Navbar = () => {
  return ( 
    <div>
      {/* Navbar */}
      <div className="bg-[#6D9773] text-white h-16 flex items-center justify-between px-6"> {/* Coral Pink Background */}
        <h2 className="text-2xl font-semibold">DineOnline!</h2>

        {/* Menu Links */}
        <div className="flex space-x-6">
          <h3 className="text-xl font-medium">
            <Link href="/profile" className="text-[#F7F3E3] hover:bg-[#A3D8B2] px-4 py-2 rounded-md">Profile</Link> {/* Soft Ivory Text and Mint Green Hover */}
          </h3>
          <h3 className="text-xl font-medium">
            <Link href="/menu" className="text-[#F7F3E3] hover:bg-[#A3D8B2] px-4 py-2 rounded-md">Menu Items</Link> {/* Soft Ivory Text and Mint Green Hover */}
          </h3>
          <h3 className="text-xl font-medium">
            <Link href="/book" className="text-[#F7F3E3] hover:bg-[#A3D8B2] px-4 py-2 rounded-md">Book</Link> {/* Soft Ivory Text and Mint Green Hover */}
          </h3>
          <h3 className="text-xl font-medium">
            <Link href="/orders" className="text-[#F7F3E3] hover:bg-[#A3D8B2] px-4 py-2 rounded-md">My Orders</Link> {/* Soft Ivory Text and Mint Green Hover */}
          </h3>
          <h3 className="text-xl font-medium">
            <Link href="/signout" className="text-[#F7F3E3] hover:bg-[#A3D8B2] px-4 py-2 rounded-md">Sign Out</Link> {/* Soft Ivory Text and Mint Green Hover */}
          </h3>
        </div>
      </div>

      {/* Main Content */}
     
    </div>
  );
}

export default Navbar;
