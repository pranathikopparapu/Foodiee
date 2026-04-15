import { useEffect, useState } from "react";
import API from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");

  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    flat: "",
    street: "",
    pincode: "",
  });

  useEffect(() => {
    fetchProfile();
    fetchOrders();
    fetchAddresses();
  }, []);

  /* ================= FETCH DATA ================= */

  const fetchProfile = async () => {
    const res = await API.get("/users/me");
    setUser(res.data);
  };

  const fetchOrders = async () => {
    const res = await API.get("/orders/my-orders");
    setOrders(res.data);
  };

  const fetchAddresses = async () => {
    const res = await API.get("/users/addresses");
    setAddresses(res.data);
  };

  /* ================= ADDRESS CRUD ================= */

  const handleSaveAddress = async () => {
    if (
      !form.name ||
      !form.mobile ||
      !form.flat ||
      !form.street ||
      !form.pincode
    ) {
      alert("Please fill all address fields");
      return;
    }

    if (editingIndex !== null) {
      await API.put(`/users/addresses/${editingIndex}`, form);
    } else {
      await API.post("/users/addresses", form);
    }

    setForm({
      name: "",
      mobile: "",
      flat: "",
      street: "",
      pincode: "",
    });
    setEditingIndex(null);
    fetchAddresses();
  };

  const handleEdit = (addr, index) => {
    setForm(addr);
    setEditingIndex(index);
    setActiveTab("address");
  };

  const handleDelete = async (index) => {
    await API.delete(`/users/addresses/${index}`);
    fetchAddresses();
  };

  if (!user) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="flex max-w-6xl mx-auto mt-6 gap-6">
      {/* ================= LEFT SIDEBAR ================= */}
      <div className="w-1/4 border rounded p-4 h-fit">
        <h3 className="font-bold mb-4">My Account</h3>

        <button
          onClick={() => setActiveTab("orders")}
          className={`block w-full text-left px-3 py-2 rounded mb-2 ${
            activeTab === "orders"
              ? "bg-red-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          My Orders
        </button>

        <button
          onClick={() => setActiveTab("address")}
          className={`block w-full text-left px-3 py-2 rounded ${
            activeTab === "address"
              ? "bg-red-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          Saved Addresses
        </button>
      </div>

      {/* ================= RIGHT CONTENT ================= */}
      <div className="w-3/4">
        {/* USER INFO */}
        <div className="border p-4 rounded mb-6">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        {/* ================= ORDERS ================= */}
        {activeTab === "orders" && (
          <>
            <h2 className="text-xl font-bold mb-4">My Orders</h2>

            {orders.length === 0 ? (
              <p className="text-gray-500">No orders yet</p>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="border p-4 rounded mb-4">
                  <p className="font-semibold">
                    Total: ₹{order.totalAmount}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {order.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    Payment: {order.paymentMethod}
                  </p>

                  {/* PRODUCTS */}
                  {order.products.map((p, i) => (
                    <div key={i} className="flex gap-4 mt-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-sm">Qty: {p.quantity}</p>
                        <p className="text-sm">₹{p.price}</p>
                      </div>
                    </div>
                  ))}

                  {/* ADDRESS */}
                  <div className="mt-3 text-sm text-gray-600">
                    <strong>Delivered To:</strong><br />
                    {order.address.name}, {order.address.mobile}<br />
                    {order.address.flat}, {order.address.street}<br />
                    {order.address.pincode}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* ================= SAVED ADDRESSES ================= */}
        {activeTab === "address" && (
          <>
            <h2 className="text-xl font-bold mb-4">Saved Addresses</h2>

            {addresses.length === 0 ? (
              <p className="text-gray-500">
                Addresses will appear once you place an order
              </p>
            ) : (
              addresses.map((addr, index) => (
                <div
                  key={index}
                  className="border p-4 rounded mb-3 flex justify-between"
                >
                  <div>
                    <p className="font-semibold">{addr.name}</p>
                    <p className="text-sm text-gray-600">
                      {addr.mobile}<br />
                      {addr.flat}, {addr.street}<br />
                      {addr.pincode}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(addr, index)}
                      className="text-blue-500"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-500"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* ADD / EDIT FORM */}
            <div className="border p-4 rounded mt-6">
              <h3 className="font-semibold mb-3">
                {editingIndex !== null ? "Edit Address" : "Add New Address"}
              </h3>

              {["name", "mobile", "flat", "street", "pincode"].map((field) => (
                <input
                  key={field}
                  className="border w-full p-2 mb-2"
                  placeholder={field.toUpperCase()}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                />
              ))}

              <button
                onClick={handleSaveAddress}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                {editingIndex !== null ? "Update Address" : "Save Address"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
