// app/homepage/page.tsx

import Navbar from "@/app/components/navbar/page";

const HomePage = () => {
  return (
    <div className="bg-white min-h-screen"> {/* White Background for the Page */}
<Navbar />

      <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-semibold text-[#BB8A52]">Ready to Order?</h1> {/* Coral Pink Text */}
      </div>
    </div>
  );
};

export default HomePage;
