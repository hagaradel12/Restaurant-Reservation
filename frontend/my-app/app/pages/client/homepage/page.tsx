'use client'
import Navbar from "@/app/components/navbar/page";
import HeroSection from "./HeroSection";
import MenuPreview from "./MenuPreview";
import OrderOnlineSection from "./OrderOnline";

const Home = () => {
  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <HeroSection />

      {/* Menu Preview */}
      <MenuPreview />

      {/* Order Online Section */}
      <OrderOnlineSection />

      {/* Book a Table Section */}
      {/* <BookTableSection /> */}
    </div>
  );
};

export default Home;
