import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const product = location.state?.product;
  const message = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ VERY IMPORTANT
    setError("");

    try {
      const res = await API.post("/users/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", res.data.role);

      // ✅ redirect after login
      navigate(res.data.role === "admin" ? "/admin" : "/");
    } catch {
      setError("❌ Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center mt-16">
      <div className="w-96 border p-6 rounded shadow bg-white">

        {/* LOGIN MESSAGE */}
        {message && (
          <div className="mb-3 text-sm text-red-500 text-center font-semibold">
            {message}
          </div>
        )}

        {/* PRODUCT PREVIEW */}
        {product && (
          <div className="flex gap-4 items-center mb-4 border-b pb-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-gray-500 text-sm">₹{product.price}</p>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        {error && (
          <div className="mb-3 bg-red-100 text-red-600 text-sm p-2 rounded text-center">
            {error}
          </div>
        )}

        {/* ✅ FORM START */}
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold mb-1">Email ID</label>
          <input
            className="border w-full p-2 mb-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block text-sm font-semibold mb-1">Password</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              className="border w-full p-2 pr-10 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          <button
            type="submit" // ✅ submit works with Enter
            className="bg-red-500 text-white w-full py-2 rounded"
          >
            Login
          </button>
        </form>
        {/* ✅ FORM END */}

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-red-500 font-semibold">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
