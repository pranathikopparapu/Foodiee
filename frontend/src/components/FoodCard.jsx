import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";

export default function FoodCard({ food, onEdit }) {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isWishlisted } =
    useContext(WishlistContext);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🔽 REVIEW TOGGLE
  const [showAllReviews, setShowAllReviews] = useState(false);

  const handleAddToCart = () =>
    addToCart({
      foodId: food._id,
      name: food.name,
      price: food.finalPrice || food.price,
      image: food.image,
    });

  const wishlisted = isWishlisted(food._id);

  const handleWishlist = () => {
    wishlisted
      ? removeFromWishlist(food._id)
      : addToWishlist(food);
  };

  const renderStars = (rating = 0) => {
    return [...Array(5)].map((_, i) => (
      <span key={i}>
        {i + 1 <= Math.round(rating) ? "⭐" : "☆"}
      </span>
    ));
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

      {/* ⭐ RATING */}
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

      {/* 💬 REVIEWS SECTION */}
      {food.reviews && food.reviews.length > 0 && (
        <div className="mt-2 text-sm text-gray-700">
          {/* SHOW ONLY ONE REVIEW */}
          <p>
            <strong>{food.reviews[0].userName}:</strong>{" "}
            {food.reviews[0].comment}
          </p>

          {/* VIEW ALL BUTTON */}
          {food.reviews.length > 1 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="text-blue-500 text-xs mt-1"
            >
              {showAllReviews ? "Hide reviews" : "View all reviews"}
            </button>
          )}

          {/* DROPDOWN ALL REVIEWS */}
          {showAllReviews && (
            <div className="mt-2 space-y-1">
              {food.reviews.slice(1).map((r, i) => (
                <p key={i}>
                  <strong>{r.userName}:</strong> {r.comment}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="font-bold text-lg mt-2">
        ₹{food.finalPrice || food.price}
      </p>

      {/* ===== BUTTONS ===== */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {token && role === "user" && (
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
              {wishlisted ? "❤️" : "🤍"}
            </button>
          </>
        )}

        {!token && (
          <button
            onClick={() => navigate("/login")}
            className="bg-red-500 text-white text-sm px-3 py-1 rounded"
          >
            Buy Now
          </button>
        )}

        {role === "admin" && onEdit && (
          <button
            onClick={() => onEdit(food)}
            className="bg-blue-500 text-white text-sm px-3 py-1 rounded"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
