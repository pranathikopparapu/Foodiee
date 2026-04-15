import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const product = location.state?.product;

  const submit = async () => {
    try {
      const res = await API.post("/users/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", res.data.role);

      // ✅ ALWAYS redirect to home (or admin)
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch {
      alert("Invalid credentials");
    }
  };

  // ✅ ENTER KEY LOGIN
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  return (
    <div className="flex justify-center mt-16">
      <div className="w-96 border p-6 rounded shadow bg-white">

        {/* ===== PRODUCT PREVIEW (MYNTRA STYLE) ===== */}
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

        <h2 className="text-xl font-bold mb-5 text-center">Login</h2>

        {/* ===== EMAIL ===== */}
        <label className="block text-sm font-semibold mb-1">
          Email ID
        </label>
        <input
          className="border w-full p-2 mb-4 rounded"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* ===== PASSWORD ===== */}
        <label className="block text-sm font-semibold mb-1">
          Password
        </label>

        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            className="border w-full p-2 pr-10 rounded"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* 👁 Eye Icon */}
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        <Link
          to="/forgot-password"
          className="text-sm text-red-500 hover:underline block text-right mb-4"
        >
          Forgot Password?
        </Link>

        <button
          onClick={submit}
          className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600"
        >
          Login
        </button>

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
