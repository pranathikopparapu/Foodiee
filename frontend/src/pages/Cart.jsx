import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
  } = useContext(CartContext);

  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-24 text-gray-600">
        <p className="text-4xl">🛒</p>
        <p className="text-lg mt-2">Oops! Your cart is empty</p>
      </div>
    );
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      {cart.map(item => (
        <div
          key={item.foodId}
          className="flex gap-6 border p-4 rounded mb-4"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-28 h-28 object-cover rounded"
          />

          <div className="flex-1">
            <h3 className="font-bold text-lg">{item.name}</h3>

            <p className="font-semibold mt-1">₹{item.price}</p>

            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={() => decreaseQty(item.foodId)}
                className="border px-3 py-1 rounded"
              >
                −
              </button>

              <span className="font-semibold">{item.quantity}</span>

              <button
                onClick={() => increaseQty(item.foodId)}
                className="border px-3 py-1 rounded"
              >
                +
              </button>
            </div>

            <p className="mt-2 text-sm text-gray-600">
              Item Total: ₹{item.price * item.quantity}
            </p>

            <button
              onClick={() => removeFromCart(item.foodId)}
              className="mt-2 text-red-500 text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="border-t pt-4 mt-6 flex justify-between items-center">
        <p className="text-xl font-bold">Total: ₹{totalAmount}</p>

        <button
          onClick={() => navigate("/buy-now")}
          className="bg-green-500 text-white px-6 py-3 rounded text-lg"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
