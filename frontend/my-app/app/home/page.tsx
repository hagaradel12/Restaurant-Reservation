// home/HomePage.tsx

import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[url('/background-image.jpg')] bg-cover bg-center flex flex-col items-center justify-center">
      {/* Overlay */}
      <div className="bg-[#001514] bg-opacity-80 min-h-screen w-full flex flex-col items-center justify-center px-4">
        {/* Branding Section */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-[#FBFFFE] tracking-wide mb-4">
            Code Builders
          </h1>
          <p className="text-lg text-[#FBFFFE] opacity-75 max-w-md mx-auto">
            Where luxury dining meets timeless elegance. Experience a culinary journey like no other.
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-8 space-x-4">
          <Link href="/auth/login">
            <button className="px-8 py-3 text-lg font-semibold text-[#FBFFFE] bg-[#6B0504] rounded-lg hover:bg-[#A3320B] shadow-md transition duration-300">
              Login
            </button>
          </Link>
          <Link href="/auth/signup">
            <button className="px-8 py-3 text-lg font-semibold text-[#6B0504] bg-transparent border border-[#6B0504] rounded-lg hover:bg-[#6B0504] hover:text-[#FBFFFE] shadow-md transition duration-300">
              Sign Up
            </button>
          </Link>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-4 text-center text-[#E6AF2E] text-sm">
          <p>© {new Date().getFullYear()} Code Builders. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
