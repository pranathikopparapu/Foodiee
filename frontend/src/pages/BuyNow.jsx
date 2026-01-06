import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import API from "../services/api";

export default function BuyNow() {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const { clearWishlist } = useContext(WishlistContext);

  const [payment, setPayment] = useState("cod"); // ✅ DEFAULT COD
  const [mobileError, setMobileError] = useState("");

  const [addresses, setAddresses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [newAddress, setNewAddress] = useState({
    name: "",
    mobile: "",
    flat: "",
    street: "",
    pincode: "",
  });

  /* ================= FETCH SAVED ADDRESSES ================= */
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const res = await API.get("/users/addresses");
    setAddresses(res.data);
  };

  /* ================= EMPTY CART ================= */
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-24 text-gray-600">
        <p className="text-4xl">🛒</p>
        <p className="text-lg mt-2">No items in cart</p>
      </div>
    );
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const isValidIndianMobile = (number) => /^[6-9]\d{9}$/.test(number);

  /* ================= PLACE ORDER ================= */
  const placeOrder = async () => {
    const address =
      selectedIndex !== null ? addresses[selectedIndex] : newAddress;

    if (
      !address.name ||
      !address.mobile ||
      !address.flat ||
      !address.street ||
      !address.pincode
    ) {
      alert("Please fill all address details");
      return;
    }

    if (!isValidIndianMobile(address.mobile)) {
      setMobileError("Enter valid 10-digit mobile number");
      return;
    }

    try {
      await API.post("/orders/create", {
        products: cart.map(item => ({
          foodId: item.foodId,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image,
        })),
        address,
        paymentMethod: "cod", // ✅ ONLY COD
        totalAmount,
      });

      clearCart();
      clearWishlist();
      navigate("/order-success");

    } catch (err) {
      console.error("ORDER ERROR:", err.response?.data || err.message);
      alert("Order failed. Try again");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ================= LEFT: CART ================= */}
        <div className="border p-4 rounded">
          {cart.map(item => (
            <div key={item.foodId} className="flex gap-4 mb-4 border-b pb-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p>Qty: {item.quantity}</p>
                <p className="font-semibold">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
          <p className="text-xl font-bold mt-4">Total: ₹{totalAmount}</p>
        </div>

        {/* ================= RIGHT: ADDRESS ================= */}
        <div>
          <h3 className="font-semibold mb-3">Select Delivery Address</h3>

          {addresses.map((addr, index) => (
            <div
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`border p-3 rounded mb-3 cursor-pointer ${
                selectedIndex === index
                  ? "border-green-500 bg-green-50"
                  : ""
              }`}
            >
              <p className="font-semibold">{addr.name}</p>
              <p className="text-sm">
                {addr.mobile}<br />
                {addr.flat}, {addr.street}<br />
                {addr.pincode}
              </p>
            </div>
          ))}

          <h3 className="font-semibold mt-6 mb-2">Add New Address</h3>

          {["name", "mobile", "flat", "street", "pincode"].map(field => (
            <input
              key={field}
              className="border w-full p-2 mb-2"
              placeholder={field.toUpperCase()}
              value={newAddress[field]}
              onChange={(e) =>
                setNewAddress({ ...newAddress, [field]: e.target.value })
              }
            />
          ))}

          {mobileError && (
            <p className="text-red-500 text-sm">{mobileError}</p>
          )}

          {/* ✅ COD ONLY */}
          <p className="font-semibold mt-4 mb-2">
            Payment Method: <span className="text-green-600">Cash on Delivery</span>
          </p>

          <button
            onClick={placeOrder}
            className="bg-green-500 text-white w-full py-3 rounded"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
