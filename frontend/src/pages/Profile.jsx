import { useEffect, useState } from "react";
import API from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");

  // ⭐ Review states
  const [reviewFood, setReviewFood] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // 🎉 Toast
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

  const fetchProfile = async () => {
    const res = await API.get("/users/profile");
    setUser(res.data);
    setAddresses(res.data.savedAddresses || []);
  };

  const fetchOrders = async () => {
    const res = await API.get("/orders/my-orders");
    setOrders(res.data);
  };

  const submitReview = async () => {
    if (!rating) return;

     try {
    await API.post(`/foods/${String(reviewFood.foodId)}/review`, {
      rating,
      comment,
    });

    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 2500);
  } catch (err) {
    if (err.response?.status === 400) {
      alert(err.response.data.message); // 👈 SHOW BACKEND MESSAGE
    } else {
      alert("Something went wrong. Try again.");
    }
  
  setReviewFood(null);
  setRating(0);
  setComment("");
  fetchOrders();
};

    setReviewFood(null);
    setRating(0);
    setComment("");
    fetchOrders();

    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 2500);
  };

  if (!user) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-8 flex gap-6">
      {/* ===== LEFT PANEL ===== */}
      <div className="w-1/4 border rounded-lg p-4 h-fit">
        <h3 className="font-bold text-lg mb-2">My Account</h3>

        <p className="text-sm">
          <strong>Name:</strong> {user.name}
        </p>
        <p className="text-sm mb-4">
          <strong>Email:</strong> {user.email}
        </p>

        <button
          onClick={() => setActiveTab("orders")}
          className={`w-full text-left px-3 py-2 rounded mb-2 ${
            activeTab === "orders"
              ? "bg-red-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          🛒 My Orders
        </button>

        <button
          onClick={() => setActiveTab("address")}
          className={`w-full text-left px-3 py-2 rounded ${
            activeTab === "address"
              ? "bg-red-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          📍 Saved Addresses
        </button>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="w-3/4">
        {/* ===== ORDERS ===== */}
        {activeTab === "orders" && (
          <>
            <h2 className="text-xl font-bold mb-4">My Orders</h2>

            {orders.length === 0 ? (
              <div className="text-center mt-20 animate-bounce">
                😴 <p className="text-gray-500 mt-2">No orders yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="border p-4 rounded mb-4">
                  <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                  <p className="text-sm text-gray-600">
                    Status: {order.status}
                  </p>

                  {order.products.map((p, i) => (
                    <div key={i} className="flex gap-4 mt-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-16 rounded"
                      />
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p>Qty: {p.quantity}</p>

                        {order.status === "Delivered" && !p.reviewed && (

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
              ))
            )}
          </>
        )}

        {/* ===== ADDRESSES ===== */}
        {activeTab === "address" && (
          <>
            <h2 className="text-xl font-bold mb-4">Saved Addresses</h2>

            {addresses.length === 0 ? (
              <div className="text-center mt-20 animate-pulse">
                📭
                <p className="text-gray-500 mt-2">
                  No saved addresses yet
                </p>
              </div>
            ) : (
              addresses.map((a, i) => (
                <div key={i} className="border p-4 rounded mb-3">
                  <p><strong>{a.name}</strong> ({a.mobile})</p>
                  <p>{a.flat}, {a.street}</p>
                  <p>{a.pincode}</p>
                </div>
              ))
            )}
          </>
        )}
      </div>

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

      {/* 🎉 SUCCESS TOAST */}
      {successToast && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded shadow animate-bounce">
          🎉 Thanks for reviewing!
        </div>
      )}
    </div>
  );
}
