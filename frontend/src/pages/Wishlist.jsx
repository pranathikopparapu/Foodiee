import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const { wishlist, clearWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  if (wishlist.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <div className="text-6xl animate-bounce mb-4">😕💔</div>
      <h2 className="text-2xl font-bold mb-2">Oops!</h2>
      <p className="text-gray-600">Nothing is in your wishlist</p>
    </div>
  );
}


  const buyNow = (product) => {
    clearWishlist();
    navigate("/buy", { state: product });
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {wishlist.map(product => (
        <div key={product._id} className="border p-4 rounded shadow">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-cover mb-2"
          />

          <h3 className="font-bold">{product.name}</h3>
          <p className="text-gray-600">{product.category}</p>

          <p className="font-bold mt-2">
            ₹{product.finalPrice || product.price}
          </p>

          <button
            onClick={() => buyNow(product)}
            className="bg-green-500 text-white w-full mt-3 py-1 rounded"
          >
            Buy Now
          </button>
        </div>
      ))}
    </div>
  );
}
