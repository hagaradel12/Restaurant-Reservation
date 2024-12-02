import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[url('/background-image.jpg')] bg-cover bg-center flex flex-col items-center justify-center">
      {/* Overlay */}
      <div className="bg-black bg-opacity-50 min-h-screen w-full flex flex-col items-center justify-center px-4">
        {/* Branding Section */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-white tracking-wide mb-4">
            Code Builders
          </h1>
          <p className="text-lg text-gray-300 max-w-md mx-auto">
            Where luxury dining meets timeless elegance. Experience a culinary journey like no other.
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-8 space-x-4">
          <Link href="/pages/auth/login">
            <button className="px-8 py-3 text-lg font-semibold text-white bg-[#C9A47F] rounded-lg hover:bg-[#b1906b] shadow-md transition duration-300">
              Login
            </button>
          </Link>
          <Link href="/pages/auth/signup">
            <button className="px-8 py-3 text-lg font-semibold text-[#C9A47F] bg-transparent border border-[#C9A47F] rounded-lg hover:bg-[#C9A47F] hover:text-white shadow-md transition duration-300">
              Sign Up
            </button>
          </Link>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Code Builders. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
