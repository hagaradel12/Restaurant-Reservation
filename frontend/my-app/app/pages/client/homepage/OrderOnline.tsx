import Link from "next/link";

const OrderOnlineSection = () => {
  return (
    <section className="py-12 flex justify-center items-center" style={{ backgroundColor: '#FBFFFE' }}>
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6" style={{ color: '#001514' }}>Order Online</h2> {/* Rich Black for Title */}
        <div className="flex justify-center gap-8">
          <Link href="/pages/client/products" className="text-white px-6 py-2 rounded-md text-lg" style={{ backgroundColor: '#6B0504' }}>
            Order for Delivery
          </Link>
          <Link href="/pages/client/products" className="text-white px-6 py-2 rounded-md text-lg" style={{ backgroundColor: '#E6AF2E' }}>
            Order for Pickup
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderOnlineSection;
