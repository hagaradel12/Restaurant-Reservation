import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#001514] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Restaurant Info Section */}
        <div className="text-center mb-8">
          <h3 className="text-4xl font-semibold mb-3">Below the Hat</h3>
          <p className="text-lg">
            Your go-to destination for fine dining and reservations. Experience an unforgettable meal with us!
          </p>
        </div>

        {/* Links Section */}
        <div className="flex justify-center gap-12 mb-8">
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul>
              <li className="mb-2">
                <Link href="/about" className="text-white hover:text-gray-300">About Us</Link>
              </li>
              <li className="mb-2">
                <Link href="/menu" className="text-white hover:text-gray-300">Menu</Link>
              </li>
              <li className="mb-2">
                <Link href="/reservation" className="text-white hover:text-gray-300">Make a Reservation</Link>
              </li>
              <li className="mb-2">
                <Link href="/contact" className="text-white hover:text-gray-300">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul>
              <li className="mb-2">
                <Link href="/privacy-policy" className="text-white hover:text-gray-300">Privacy Policy</Link>
              </li>
              <li className="mb-2">
                <Link href="/terms-of-service" className="text-white hover:text-gray-300">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media and Contact */}
        <div className="flex justify-center items-center gap-8 mb-8">
          <Link href="https://facebook.com/BelowTheHat" className="text-white hover:text-gray-300">
            <i className="fab fa-facebook-square text-3xl"></i> {/* Example using FontAwesome */}
          </Link>
          <Link href="https://instagram.com/BelowTheHat" className="text-white hover:text-gray-300">
            <i className="fab fa-instagram text-3xl"></i>
          </Link>
          <Link href="https://twitter.com/BelowTheHat" className="text-white hover:text-gray-300">
            <i className="fab fa-twitter text-3xl"></i>
          </Link>
        </div>

        {/* Copyright Section */}
        <div className="text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Below the Hat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
