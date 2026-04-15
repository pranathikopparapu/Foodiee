import { useEffect, useState } from "react";
import API from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [reviewBox, setReviewBox] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewed, setReviewed] = useState({}); // ⭐ track reviewed items

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await API.get("/orders/my-orders");
    setOrders(res.data);
  };

  const submitReview = async (foodId) => {
    if (!rating) {
      alert("Please select rating");
      return;
    }

    try {
      await API.post(`/foods/${foodId}/review`, {
        rating,
        comment,
      });

      alert("Review submitted successfully ⭐");

      setReviewed((prev) => ({ ...prev, [foodId]: true }));
      setReviewBox(null);
      setRating(0);
      setComment("");
    } catch (err) {
      alert(err.response?.data || "Review failed");
    }
  };

  if (!orders.length) {
    return <div className="text-center mt-20">📦 No orders yet</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className="border p-4 mb-6 rounded">
          <p className="font-semibold">Total: ₹{order.totalAmount}</p>
          <p>Status: {order.status}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>

          {order.products.map((product) => (
            <div key={product.foodId} className="mt-4 border-t pt-4">
              <div className="flex gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 rounded object-cover"
                />

                <div className="flex-1">
                  <p className="font-bold">{product.name}</p>
                  <p>Qty: {product.quantity}</p>
                  <p>₹{product.price}</p>

                  {/* ⭐ REVIEW SECTION */}
                  {order.status === "Delivered" && (
                    <>
                      {reviewed[product.foodId] ? (
                        <p className="text-green-600 text-sm mt-2">
                          ✔ Reviewed
                        </p>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              setReviewBox(
                                reviewBox === product.foodId
                                  ? null
                                  : product.foodId
                              )
                            }
                            className="text-blue-500 text-sm mt-2"
                          >
                            ✍️ Write Review
                          </button>

                          {reviewBox === product.foodId && (
                            <div className="mt-3">
                              {/* ⭐ STARS */}
                              <div className="flex gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`cursor-pointer text-xl ${
                                      star <= rating
                                        ? "text-yellow-500"
                                        : "text-gray-300"
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>

                              <textarea
                                className="border w-full p-2 mb-2"
                                placeholder="Write your review"
                                value={comment}
                                onChange={(e) =>
                                  setComment(e.target.value)
                                }
                              />

                              <button
                                onClick={() =>
                                  submitReview(product.foodId)
                                }
                                className="bg-green-500 text-white px-4 py-1 rounded"
                              >
                                Submit Review
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
