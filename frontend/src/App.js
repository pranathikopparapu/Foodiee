import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import BuyNow from "./pages/BuyNow";
import OrderSuccess from "./pages/OrderSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import AddFood from "./pages/AddFood";
import ManageFood from "./pages/ManageFood";
import EditFood from "./pages/EditFood";
import AdminOrders from "./pages/AdminOrders"; // ✅ NEW PAGE

import AdminRoute from "./components/AdminRoute";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Income from "./pages/Income";



export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <Navbar />

          <Routes>
            {/* ===== USER ROUTES ===== */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/buy-now" element={<BuyNow />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />

            {/* ===== ADMIN ROUTES ===== */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/foods"
              element={
                <AdminRoute>
                  <ManageFood />
                </AdminRoute>
              }
            />
            <Route
  path="/admin/orders"
  element={
    <AdminRoute>
      <AdminOrders />
    </AdminRoute>
  }
/>
{/* ========== ADMIN ROUTES ========== */}
<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
<Route
  path="/admin/income"
  element={
    <AdminRoute>
      <Income />
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
  path="/admin/manage-food"
  element={
    <AdminRoute>
      <ManageFood />
    </AdminRoute>
  }
/>

<Route
  path="/admin/edit-food/:id"
  element={
    <AdminRoute>
      <EditFood />
    </AdminRoute>
  }
/>




            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}
