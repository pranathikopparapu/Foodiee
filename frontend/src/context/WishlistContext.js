import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  /* ================= LOAD WISHLIST ON LOGIN ================= */
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setWishlist([]);
          return;
        }

        const res = await API.get("/users/wishlist");
        setWishlist(res.data);
      } catch {
        setWishlist([]);
      }
    };

    loadWishlist();

    // 🔥 sync across tabs / login logout
    window.addEventListener("storage", loadWishlist);
    return () => window.removeEventListener("storage", loadWishlist);
  }, []);

  /* ================= ADD TO WISHLIST ================= */
  const addToWishlist = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("NOT_LOGGED_IN");
    }

   const res = await API.post("/users/wishlist", {
  foodId: product.foodId,
  name: product.name,
  price: product.finalPrice || product.price,
  image: product.image,
  category: product.category,
});


    setWishlist(res.data);
  };

  /* ================= REMOVE FROM WISHLIST ================= */
  const removeFromWishlist = async (foodId) => {
    const res = await API.delete(`/users/wishlist/${foodId}`);
    setWishlist(res.data);
  };

  /* ================= CLEAR WISHLIST ================= */
  const clearWishlist = () => {
    setWishlist([]);
  };

  /* ================= CHECK ================= */
  const isWishlisted = (foodId) => {
  return wishlist.some(
    item => item.foodId?.toString() === foodId?.toString()
  );
};


  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
