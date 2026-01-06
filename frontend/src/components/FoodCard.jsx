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

  const [showAllReviews, setShowAllReviews] = useState(false);

  const foodId = food._id;
  const wishlisted = isWishlisted(foodId);

  const handleAddToCart = async () => {
    try {
      await addToCart({
        foodId,
        name: food.name,
        price: food.finalPrice || food.price,
        image: food.image,
      });
    } catch {
      navigate("/login");
    }
  };

  const handleWishlist = async () => {
    try {
      if (wishlisted) {
        await removeFromWishlist(foodId);
      } else {
        await addToWishlist({
          foodId,
          name: food.name,
          price: food.finalPrice || food.price,
          image: food.image,
          category: food.category,
        });
      }
    } catch {
      navigate("/login");
    }
  };

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <img src={food.image} alt={food.name} className="w-full h-40 rounded mb-3" />

      <h3 className="font-bold">{food.name}</h3>
      <p className="text-gray-500">{food.category}</p>

      <p className="font-bold mt-2">₹{food.finalPrice || food.price}</p>

      {/* ⭐ RATING */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-yellow-500 font-bold">
          ⭐ {food.avgRating || 0}
        </span>
        <span className="text-sm text-gray-500">
          ({food.reviews?.length || 0} reviews)
        </span>
      </div>

      {/* 📝 REVIEWS */}
      {food.reviews?.length > 0 && (
        <div className="mt-2 text-sm text-gray-700">
          {!showAllReviews ? (
            <p className="italic">
              “{food.reviews[0].comment || "No comment"}”
            </p>
          ) : (
            food.reviews.map((r, i) => (
              <p key={i}>⭐ {r.rating} – {r.comment || "No comment"}</p>
            ))
          )}

          {food.reviews.length > 1 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="text-blue-500 text-xs mt-1"
            >
              {showAllReviews ? "Hide reviews" : "View all reviews"}
            </button>
          )}
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex gap-2 mt-3">
        {token && role === "user" && (
          <>
            <button
              onClick={handleAddToCart}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              className="border px-3 py-1 rounded"
            >
              {wishlisted ? "❤️" : "🤍"}
            </button>
          </>
        )}

        {role === "admin" && onEdit && (
          <button
            onClick={() => onEdit(food)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
