import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";

export default function FoodCard({ food }) {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  /* ===== HELPERS ===== */
  const redirectToLogin = () => navigate("/login");

  const handleAddToCart = () =>
  addToCart({
    foodId: food._id,              // ✅ ONLY THIS ID
    name: food.name,
    price: food.finalPrice || food.price,
    image: food.image,
  });


  const handleWishlist = () => addToWishlist(food);

  /* ===== STAR RENDER ===== */
  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i}>
          {i <= Math.round(rating) ? "⭐" : "☆"}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <img
        src={food.image}
        alt={food.name}
        className="w-full h-40 object-cover rounded mb-3"
      />

      <h3 className="font-bold text-lg">{food.name}</h3>
      <p className="text-gray-500 text-sm">{food.category}</p>

      {/* ⭐ RATING SECTION */}
      <div className="flex items-center gap-2 mt-1 text-sm">
        <div className="text-yellow-500">
          {food.avgRating > 0 ? renderStars(food.avgRating) : "No ratings"}
        </div>
        {food.avgRating > 0 && (
          <span className="text-gray-600">
            {food.avgRating.toFixed(1)} ({food.reviews?.length || 0})
          </span>
        )}
      </div>

      <p className="font-bold text-lg mt-2">
        ₹{food.finalPrice || food.price}
      </p>

      {/* ===== BUTTONS ===== */}
      <div className="flex gap-2 mt-3">
        {token && role === "user" ? (
          <>
            <button
              onClick={handleAddToCart}
              className="bg-green-500 text-white text-sm px-3 py-1 rounded"
            >
              Add to Cart
            </button>

            <button
              onClick={handleWishlist}
              className="border text-sm px-3 py-1 rounded"
            >
              🤍
            </button>
          </>
        ) : (
          <>
            <button
              onClick={redirectToLogin}
              className="bg-red-500 text-white text-sm px-3 py-1 rounded"
            >
              Buy Now
            </button>

            <button
              onClick={redirectToLogin}
              className="border text-sm px-3 py-1 rounded"
            >
              🤍
            </button>
          </>
        )}
      </div>
    </div>
  );
}
