import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [toastMsg, setToastMsg] = useState("");

  /* ================= LOAD CART ================= */
  const loadCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCart([]);
        return;
      }
      const res = await API.get("/users/cart");
      setCart(res.data || []);
    } catch {
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();
    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, []);

  /* ================= ADD TO CART ================= */
  const addToCart = async (food) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("NOT_LOGGED_IN");

    const res = await API.post("/users/cart", {
      foodId: food.foodId.toString(),
      name: food.name,
      price: food.price,
      image: food.image,
    });

    setCart(res.data);
    setToastMsg("Added to cart 🛒");
    setTimeout(() => setToastMsg(""), 1500);
  };

  /* ================= QTY ================= */
  const increaseQty = async (foodId) => {
    const res = await API.put(`/users/cart/increase/${foodId}`);
    setCart(res.data);
  };

  const decreaseQty = async (foodId) => {
    const res = await API.put(`/users/cart/decrease/${foodId}`);
    setCart(res.data);
  };

  const removeFromCart = async (foodId) => {
    const res = await API.delete(`/users/cart/${foodId}`);
    setCart(res.data);
  };

  const clearCart = async () => {
    await API.delete("/users/cart");
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        toastMsg,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
