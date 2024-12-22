'use client'
import Navbar from "@/app/components/navbar/page";
import HeroSection from "./HeroSection";
import MenuPreview from "./MenuPreview";
import OrderOnlineSection from "./OrderOnline";
import AboutUs from "./aboutus";

const Home = () => {
  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <HeroSection />

      {/* Menu Preview */}
      <MenuPreview />

      <AboutUs/>

      {/* Order Online Section */}
      <OrderOnlineSection />

      {/* Book a Table Section */}
      {/* <BookTableSection /> */}
    </div>
  );
};

export default Home;
