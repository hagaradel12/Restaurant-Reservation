import Image from 'next/image'; // Import Next.js Image component
import Image1 from './tray.png'; // Import your images
import Image2 from './restaurant.png';
import Image3 from './menu.png';
import Image4 from './restaurant 3.png';

const AboutUs = () => {
  return (
    <section className="text-gray-700 body-font py-16 px-6" style={{ backgroundColor: '#FBFFFE' }}>
      <div className="flex justify-center mt-10 text-4xl font-semibold text-[#001514]">
        Why Below the Hat?
      </div>
      <div className="container px-5 py-12 mx-auto">
        <div className="flex flex-wrap text-center justify-center">
          {/* First Feature: Unique Dining Experience */}
          <div className="p-4 md:w-1/4 sm:w-1/2">
            <div className="px-4 py-6 transform transition duration-500 hover:scale-110">
              <div className="flex justify-center">
                <Image src={Image1} alt="Dining Experience" className="w-32 mb-3" />
              </div>
              <h2 className="title-font font-regular text-2xl text-gray-900">Unique Order Experience</h2>
              <p className="text-gray-600 mt-2">
                Enjoy an exceptional dining experience, whether you're visiting us for a quick bite or a special celebration.
              </p>
            </div>
          </div>

          {/* Second Feature: Easy Reservation System */}
          <div className="p-4 md:w-1/4 sm:w-1/2">
            <div className="px-4 py-6 transform transition duration-500 hover:scale-110">
              <div className="flex justify-center">
                <Image src={Image2} alt="Reservation" className="w-32 mb-3" />
              </div>
              <h2 className="title-font font-regular text-2xl text-gray-900">Easy Reservations</h2>
              <p className="text-gray-600 mt-2">
                With our simple reservation system, booking a table has never been easier. Plan your visit in just a few clicks.
              </p>
            </div>
          </div>

          {/* Third Feature: Delicious Menu */}
          <div className="p-4 md:w-1/4 sm:w-1/2">
            <div className="px-4 py-6 transform transition duration-500 hover:scale-110">
              <div className="flex justify-center">
                <Image src={Image3} alt="Menu" className="w-32 mb-3" />
              </div>
              <h2 className="title-font font-regular text-2xl text-gray-900">Delicious Menu</h2>
              <p className="text-gray-600 mt-2">
                Our menu is designed to offer a wide variety of mouthwatering dishes, made with fresh ingredients.
              </p>
            </div>
          </div>

          {/* Fourth Feature: Exceptional Customer Service */}
          <div className="p-4 md:w-1/4 sm:w-1/2">
            <div className="px-4 py-6 transform transition duration-500 hover:scale-110">
              <div className="flex justify-center">
                <Image src={Image4} alt="Customer Service" className="w-32 mb-3" />
              </div>
              <h2 className="title-font font-regular text-2xl text-gray-900">Exceptional Service</h2>
              <p className="text-gray-600 mt-2">
                Our staff is dedicated to providing you with the best service, ensuring a memorable dining experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
