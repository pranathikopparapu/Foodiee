import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ❌ Not logged in or not admin
  if (!token || role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin allowed
  return children;
}
