import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // user | admin
  const name = localStorage.getItem("name");

  const navigate = useNavigate();
  const { cart, toastMsg } = useContext(CartContext);
const { wishlist } = useContext(WishlistContext);


  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const firstLetter = name ? name.trim().charAt(0).toUpperCase() : "?";

  const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};


  /* CLOSE DROPDOWN WHEN CLICKING OUTSIDE */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* 🔔 TOAST MESSAGE */}
      {toastMsg && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {toastMsg}
        </div>
      )}

      <nav className="bg-red-500 text-white px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <button onClick={() => navigate("/")} className="text-xl font-bold">
          Foodiee 🍔
        </button>

        {/* RIGHT SIDE */}
        {!token ? (
          <div className="flex items-center gap-4">
            <Link to="/" className="font-semibold">Home</Link>
            <Link to="/login" className="bg-white text-red-500 px-4 py-1 rounded">
              Login
            </Link>
            <Link to="/signup" className="bg-white text-red-500 px-4 py-1 rounded">
              Signup
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/" className="font-semibold">Home</Link>

            {/* ================= ADMIN NAV ================= */}
            {role === "admin" && (
              <>
                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/orders">Orders</Link>

                {/* ✅ NEW INCOME PAGE */}
                <Link to="/admin/income">Income</Link>

                <Link to="/admin/manage-food">Manage Food</Link>
                <Link
                  to="/admin/add-food"
                  className="bg-white text-red-500 px-3 py-1 rounded"
                >
                  + Add Food
                </Link>
              </>
            )}

            {/* ================= USER NAV ================= */}
            {role === "user" && (
              <>
                <Link to="/wishlist" className="relative text-xl">
  ❤️
  {wishlist.length > 0 && (
    <span className="absolute -top-2 -right-2 bg-white text-red-500 text-xs px-1 rounded-full">
      {wishlist.length}
    </span>
  )}
</Link>


                <Link to="/cart" className="relative text-xl">
                  🛒
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-red-500 text-xs font-bold px-1.5 rounded-full">
                      {cart.length}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* ================= AVATAR ================= */}
            <div className="relative" ref={menuRef}>
              <div
                onClick={() => setShowMenu(!showMenu)}
                className="w-9 h-9 rounded-full bg-white text-red-500 flex items-center justify-center font-bold cursor-pointer"
                title={name}
              >
                {firstLetter}
              </div>

              {showMenu && (
                <div className="absolute right-0 mt-2 bg-white text-red-500 rounded shadow w-36 z-50">
                  {role === "user" && (
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 hover:bg-red-100 text-left"
                    >
                      My Profile
                    </button>
                  )}

                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 hover:bg-red-100 text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
