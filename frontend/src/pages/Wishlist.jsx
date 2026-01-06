import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const buyNow = async (product) => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await addToCart({
        foodId: product.foodId.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
      });

      navigate("/buy-now");
    } catch (err) {
      console.error("BUY NOW ERROR:", err);
    }
  };

  if (!wishlist.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="text-6xl animate-bounce">😕💔</div>
        <p className="mt-2 text-gray-500">Your wishlist is empty</p>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {wishlist.map((product) => (
        <div key={product.foodId} className="border p-4 rounded shadow">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 rounded mb-2"
          />
          <h3 className="font-bold">{product.name}</h3>
          <p className="text-gray-600">{product.category}</p>
          <p className="font-bold mt-2">₹{product.price}</p>

          <button
            onClick={() => buyNow(product)}
            className="bg-green-500 text-white w-full mt-3 py-1 rounded"
          >
            Buy Now
          </button>

          <button
            onClick={() => removeFromWishlist(product.foodId.toString())}
            className="w-full mt-2 py-1 border text-red-500 rounded"
          >
            ❌ Remove
          </button>
        </div>
      ))}
    </div>
  );
}
