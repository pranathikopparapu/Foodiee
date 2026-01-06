import { createContext, useState } from "react";
import API from "../services/api";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = async (product) => {
  const res = await API.post("/users/wishlist", product);
  setWishlist(res.data);
};


  const removeFromWishlist = async (foodId) => {
  const res = await API.delete(`/users/wishlist/${foodId}`);
  setWishlist(res.data);
};

  const isWishlisted = (foodId) => {
    return wishlist.some(item => item.foodId === foodId);
  };

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
