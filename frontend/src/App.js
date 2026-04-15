import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import EditFood from "./pages/EditFood";
import BuyNow from "./pages/BuyNow";
import OrderSuccess from "./pages/OrderSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import AdminDashboard from "./pages/AdminDashboard";
import AddFood from "./pages/AddFood";
import ManageFood from "./pages/ManageFood";

import AdminRoute from "./components/AdminRoute";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Profile from "./pages/Profile";




export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <Navbar />

          <Routes>
            {/* ========== USER ROUTES ========== */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
<Route path="/profile" element={<Profile />} />

            
<Route path="/buy-now" element={<BuyNow />} />

            {/* ========== ADMIN ROUTES (PROTECTED) ========== */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/add-food"
              element={
                <AdminRoute>
                  <AddFood />
                </AdminRoute>
              }
            />
            <Route
  path="/admin/edit-food"
  element={
    <AdminRoute>
      <EditFood />
    </AdminRoute>
  }
/>


            <Route
              path="/admin/manage-food"
              element={
                <AdminRoute>
                  <ManageFood />
                </AdminRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}
