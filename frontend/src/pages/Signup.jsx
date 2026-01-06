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
    const res = await API.post("/users/register", {
      name,
      email,
      password,
    });

    alert(res.data.message || "Signup successful");
    navigate("/login");

  } catch (err) {
    console.log("SIGNUP ERROR FULL:", err.response);

    const msg =
      err.response?.data?.message ||
      err.response?.data ||
      "Signup failed";

    alert(msg);
  }
};


  const handleKeyDown = (e) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div className="flex justify-center mt-20">
      <div className="w-96 border p-6 rounded shadow bg-white">
        <h2 className="text-xl font-bold mb-5 text-center">Signup</h2>

        <label className="block text-sm font-semibold mb-1">Full Name</label>
        <input
          className="border w-full p-2 mb-4 rounded"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <label className="block text-sm font-semibold mb-1">Email</label>
        <input
          type="email"
          className="border w-full p-2 mb-4 rounded"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <label className="block text-sm font-semibold mb-1">Password</label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            className="border w-full p-2 pr-10 rounded"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
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
