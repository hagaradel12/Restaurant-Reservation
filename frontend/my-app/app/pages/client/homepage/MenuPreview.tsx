import Link from "next/link";

const MenuPreview = () => {
  return (
    <section className="py-12 bg-[#FBFFFE] text-center">
      <h2 className="text-3xl font-bold mb-6" style={{ color: '#001514' }}>Our Menu</h2> {/* Rich Black for Title */}
      <div className="grid grid-cols-3 gap-8">
        {/* Example of 3 featured dishes */}
        <div className="bg-white p-6 rounded-md shadow-lg">
          <img src="https://www.howtocook.recipes/wp-content/uploads/2021/05/Ratatouille-recipe.jpg" alt="Dish 1" className="w-full h-40 object-cover rounded-md" />
          <h3 className="mt-4 text-xl font-semibold" style={{ color: '#001514' }}>Ratatouille</h3> {/* Rich Black for Title */}
          <p className="mt-2" style={{ color: '#AA3320' }}>Savor the essence of Provençal cuisine</p> {/* Brown for Text */}
        </div>
        <div className="bg-white p-6 rounded-md shadow-lg">
          <img src="https://www.johansens.com/wp-content/uploads/2021/02/French-Food-4.jpg" alt="Dish 2" className="w-full h-40 object-cover rounded-md" />
          <h3 className="mt-4 text-xl font-semibold" style={{ color: '#001514' }}>Boeuf Bourguignon</h3> {/* Rich Black for Title */}
          <p className="mt-2" style={{ color: '#AA3320' }}>A stew made from beef braised in red wine</p> {/* Brown for Text */}
        </div>
        <div className="bg-white p-6 rounded-md shadow-lg">
          <img src="https://www.johansens.com/wp-content/uploads/2021/02/French-Food-96.jpg" alt="Dish 3" className="w-full h-40 object-cover rounded-md" />
          <h3 className="mt-4 text-xl font-semibold" style={{ color: '#001514' }}>Croquembouche</h3> {/* Rich Black for Title */}
          <p className="mt-2" style={{ color: '#AA3320' }}>Composed of many small sugary choux pastry rolls filled with cream</p> {/* Brown for Text */}
        </div>
      </div>
      <Link
  href="/pages/client/products"
  className="mt-6 inline-block text-xl font-medium text-blue-600 hover:text-blue-800 hover:underline"
>
  View Full Menu
</Link>
{/* Rich Black for Link */}
    </section>
  );
};

export default MenuPreview;
