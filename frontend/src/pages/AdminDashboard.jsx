import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("today"); // today | all
  const [incomeFilter, setIncomeFilter] = useState("today");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await API.get("/orders/all");
    setOrders(res.data);
  };

  /* ================= DATE HELPERS ================= */
  const isToday = (date) => {
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  };

  const withinDays = (date, days) => {
    const d = new Date(date);
    const now = new Date();
    const diff = (now - d) / (1000 * 60 * 60 * 24);
    return diff <= days;
  };

  const isThisMonth = (date) => {
    const d = new Date(date);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  /* ================= FILTERED ORDERS ================= */
  const filteredOrders =
    filter === "today"
      ? orders.filter((o) => isToday(o.createdAt))
      : orders;

  /* ================= INCOME CALCULATION ================= */
  const incomeOrders = orders.filter((o) => {
    if (incomeFilter === "today") return isToday(o.createdAt);
    if (incomeFilter === "7") return withinDays(o.createdAt, 7);
    if (incomeFilter === "10") return withinDays(o.createdAt, 10);
    if (incomeFilter === "month") return isThisMonth(o.createdAt);
    return true;
  });

  const totalIncome = incomeOrders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {/* ================= INCOME SECTION ================= */}
      <div className="border p-4 rounded mb-6">
        <h3 className="font-semibold mb-3">Income</h3>

        <div className="flex gap-3 mb-4">
          {[
            { label: "Today", value: "today" },
            { label: "Last 7 Days", value: "7" },
            { label: "Last 10 Days", value: "10" },
            { label: "This Month", value: "month" },
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setIncomeFilter(btn.value)}
              className={`px-3 py-1 rounded ${
                incomeFilter === btn.value
                  ? "bg-green-500 text-white"
                  : "border"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <p className="text-xl font-bold">₹ {totalIncome}</p>
      </div>

      {/* ================= ORDER FILTER ================= */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setFilter("today")}
          className={`px-4 py-2 rounded ${
            filter === "today"
              ? "bg-blue-500 text-white"
              : "border"
          }`}
        >
          Today’s Orders
        </button>

        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "border"
          }`}
        >
          Past Orders
        </button>
      </div>

      {/* ================= ORDERS LIST ================= */}
      {filteredOrders.length === 0 ? (
        <p className="text-gray-500">No orders found</p>
      ) : (
        filteredOrders.map((order) => (
          <div key={order._id} className="border p-4 rounded mb-4">
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

            <div className="mt-2">
              {order.products.map((p, i) => (
                <p key={i} className="text-sm">
                  {p.name} × {p.quantity}
                </p>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
