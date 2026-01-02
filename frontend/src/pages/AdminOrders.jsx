import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await API.get("/orders/all");
    setOrders(res.data);
  };

  const printBill = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin Orders</h2>

      {/* ================= ORDERS LIST ================= */}
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border p-4 rounded mb-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {order.userName} — ₹{order.totalAmount}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-sm">
                {order.address.flat}, {order.address.street},{" "}
                {order.address.pincode}
              </p>
            </div>

            <button
              onClick={() => setSelectedOrder(order)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Generate Bill
            </button>
          </div>
        ))
      )}

      {/* ================= BILL MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-[500px] p-6 rounded shadow-lg">
            {/* ===== BILL CONTENT ===== */}
            <div id="bill">
              <h2 className="text-2xl font-bold text-center mb-2">
                Foodiee 🍔
              </h2>
              <p className="text-center text-sm mb-4">
                Delicious Food, Delivered Fast
              </p>

              <hr className="mb-3" />

              <p><b>Customer:</b> {selectedOrder.userName}</p>
              <p><b>Email:</b> {selectedOrder.userEmail}</p>
              <p><b>Date:</b> {new Date(selectedOrder.createdAt).toLocaleString()}</p>

              <p className="mt-2">
                <b>Address:</b><br />
                {selectedOrder.address.flat},<br />
                {selectedOrder.address.street},<br />
                {selectedOrder.address.pincode}
              </p>

              <hr className="my-3" />

              <h3 className="font-semibold mb-2">Items</h3>

              {selectedOrder.products.map((p, i) => (
                <div key={i} className="flex justify-between text-sm mb-1">
                  <span>
                    {p.name} × {p.quantity}
                  </span>
                  <span>₹{p.price * p.quantity}</span>
                </div>
              ))}

              <hr className="my-3" />

              <p className="text-lg font-bold">
                Total: ₹{selectedOrder.totalAmount}
              </p>

              <p className="text-center text-sm mt-4">
                Thank you for ordering with Foodiee 💛
              </p>
            </div>

            {/* ===== ACTION BUTTONS ===== */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={printBill}
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
              >
                Print / Save Bill
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="border px-4 py-2 rounded w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
