import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative bg-cover bg-center h-96" style={{ backgroundColor: "#FBFFFE" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center text-white flex flex-col justify-center items-center h-full">
        <h1 className="text-5xl font-bold" style={{ color: '#001514' }}>Welcome to Our Restaurant!</h1> {/* Rich Black for Title */}
        <p className="mt-4 text-xl" style={{ color: '#001514' }}>Delicious food delivered to your door or dine with us.</p> {/* Rich Black for Text */}
        <div className="mt-6">
          <Link href="/pages/client/products" className="px-6 py-2 rounded-md text-lg mr-4" style={{ backgroundColor: '#6B0504' }}>
            Order Now
          </Link>
          <Link href="/pages/client/bookings" className="px-6 py-2 rounded-md text-lg" style={{ backgroundColor: '#E6AF2E' }}>
            Book a Table
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
