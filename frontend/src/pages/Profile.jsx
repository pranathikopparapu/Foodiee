import { useEffect, useState } from "react";
import API from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  // ⭐ REVIEW STATES
  const [reviewFood, setReviewFood] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // 🎉 TOAST STATES
  const [successToast, setSuccessToast] = useState(false);
  const [errorToast, setErrorToast] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchOrders();

    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchProfile = async () => {
    const res = await API.get("/users/me");
    setUser(res.data);
  };

  const fetchOrders = async () => {
    const res = await API.get("/orders/my-orders");
    setOrders(res.data);
  };

  const submitReview = async () => {
    if (!rating) {
      setErrorToast("Please select a rating ⭐");
      setTimeout(() => setErrorToast(""), 2500);
      return;
    }

    try {
      await API.post(`/foods/${reviewFood.foodId}/review`, {
        rating,
        comment,
      });

      // ✅ SUCCESS
      setReviewFood(null);
      setRating(0);
      setComment("");
      fetchOrders();

      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 2500);
    } catch (err) {
      setErrorToast(err.response?.data || "Review failed");
      setTimeout(() => setErrorToast(""), 2500);
    }
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className="border p-4 rounded mb-4">
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>
          <p className="text-sm">Status: {order.status}</p>

          {order.products.map((p, i) => (
            <div key={i} className="flex gap-4 mt-3">
              <img src={p.image} alt={p.name} className="w-16 h-16 rounded" />
              <div>
                <p className="font-semibold">{p.name}</p>
                <p>Qty: {p.quantity}</p>

                {order.status === "Delivered" && (
                  <button
                    onClick={() =>
                      setReviewFood({
                        foodId: p.foodId,
                        foodName: p.name,
                      })
                    }
                    className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    ⭐ Rate & Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* ⭐ REVIEW MODAL */}
      {reviewFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96 space-y-3">
            <h3 className="font-bold text-lg">
              Rate {reviewFood.foodName}
            </h3>

            <div className="flex gap-2 text-2xl">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  onClick={() => setRating(n)}
                  className={`cursor-pointer ${
                    n <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              className="border w-full p-2"
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              onClick={submitReview}
              className="bg-green-500 text-white w-full py-2 rounded"
            >
              Submit Review
            </button>

            <button
              onClick={() => setReviewFood(null)}
              className="w-full text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ✅ SUCCESS TOAST */}
      {successToast && (
        <div className="fixed top-6 right-6 z-[9999] bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
          🎉 Thanks for reviewing! 💛
        </div>
      )}

      {/* ❌ ERROR TOAST */}
      {errorToast && (
        <div className="fixed top-6 right-6 z-[9999] bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
          ❌ {errorToast}
        </div>
      )}

      {/* 🔹 INLINE ANIMATION */}
      <style>
        {`
          .animate-slide-in {
            animation: slideIn 0.4s ease-out;
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}
