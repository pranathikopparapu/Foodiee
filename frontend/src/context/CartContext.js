import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [toastMsg, setToastMsg] = useState("");

  /* ================= ADD TO CART ================= */
  const addToCart = (food) => {
  setCart(prev => {
    const exists = prev.find(item => item.foodId === food.foodId);

    if (exists) {
      return prev.map(item =>
        item.foodId === food.foodId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...prev, { ...food, quantity: 1 }];
  });

  setToastMsg("Added to cart");
  setTimeout(() => setToastMsg(""), 1500);
};



  /* ================= REMOVE FROM CART ================= */
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
    setToastMsg("Item removed from cart");

    setTimeout(() => setToastMsg(""), 2000);
  };

  /* ================= CLEAR CART ================= */
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        toastMsg
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
