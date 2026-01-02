import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("today");

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
    const t = new Date();
    return d.toDateString() === t.toDateString();
  };

  const isThisMonth = (date) => {
    const d = new Date(date);
    const t = new Date();
    return d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
  };

  const isThisYear = (date) => {
    const d = new Date(date);
    const t = new Date();
    return d.getFullYear() === t.getFullYear();
  };

  const withinDays = (date, days) => {
    const d = new Date(date);
    return (new Date() - d) / (1000 * 60 * 60 * 24) <= days;
  };

  /* ================= FILTERED ORDERS ================= */
  const filteredOrders = orders.filter((o) => {
    if (filter === "today") return isToday(o.createdAt);
    if (filter === "7") return withinDays(o.createdAt, 7);
    if (filter === "month") return isThisMonth(o.createdAt);
    if (filter === "year") return isThisYear(o.createdAt);
    return true;
  });

  const totalIncome = filteredOrders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );

  const generateBill = (order) => {
    alert(`
Foodiee 🍔

Order ID: ${order._id}
Customer: ${order.userName}
Total: ₹${order.totalAmount}
Payment: ${order.paymentMethod}

Thank you for ordering!
`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Orders & Income</h2>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 mb-4">
        <button onClick={() => setFilter("today")} className="border px-3 py-1">Today</button>
        <button onClick={() => setFilter("7")} className="border px-3 py-1">Last 7 Days</button>
        <button onClick={() => setFilter("month")} className="border px-3 py-1">This Month</button>
        <button onClick={() => setFilter("year")} className="border px-3 py-1">This Year</button>
      </div>

      <p className="text-xl font-bold mb-6">Total Income: ₹{totalIncome}</p>

      {/* ORDERS LIST */}
      {filteredOrders.map((order) => (
        <div key={order._id} className="border p-4 mb-4 rounded">
          <p className="font-semibold">
            {order.userName} — ₹{order.totalAmount}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>

          {order.products.map((p, i) => (
            <p key={i} className="text-sm">
              {p.name} × {p.quantity}
            </p>
          ))}

          <button
            onClick={() => generateBill(order)}
            className="mt-3 bg-green-500 text-white px-4 py-1 rounded"
          >
            Generate Bill
          </button>
        </div>
      ))}
    </div>
  );
}
