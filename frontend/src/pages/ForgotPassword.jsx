import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  const sendOTP = async () => {
    try {
      await API.post("/users/forgot-password", { email });
      setMessage("OTP sent to your email 📩");
      setType("success");

      setTimeout(() => {
        navigate("/reset-password", { state: email });
      }, 2000);
    } catch {
      setMessage("Email not found ❌");
      setType("error");
    }
  };

  return (
    <div className="flex justify-center mt-20 relative">
      {/* POPUP */}
      {message && (
        <div
          className={`fixed top-6 right-6 px-4 py-2 rounded shadow text-white ${
            type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message}
        </div>
      )}

      <div className="w-80 border p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-center">
          Forgot Password
        </h2>

        <input
          className="border w-full p-2 mb-4"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={sendOTP}
          className="bg-red-500 text-white w-full py-2 rounded"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}
