import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const submit = async () => {
    try {
      await API.post("/users/register", { name, email, password });
      navigate("/login");
    } catch {
      alert("Signup failed");
    }
  };

  // ✅ ENTER KEY SUPPORT
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <div className="w-96 border p-6 rounded shadow bg-white">
        <h2 className="text-xl font-bold mb-5 text-center">Signup</h2>

        {/* ===== NAME ===== */}
        <label className="block text-sm font-semibold mb-1">
          Full Name
        </label>
        <input
          className="border w-full p-2 mb-4 rounded"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />

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

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            className="border w-full p-2 pr-10 rounded"
            placeholder="Create a password"
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

        <button
          onClick={submit}
          className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600"
        >
          Signup
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-red-500 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
