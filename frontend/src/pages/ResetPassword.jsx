import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ResetPassword() {
  const { state: email } = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [type, setType] = useState(""); // success | error

  const resetPassword = async () => {
    if (!otp || !password) {
      setMessage("Please fill all fields");
      setType("error");
      return;
    }

    try {
      await API.post("/users/reset-password", {
        email,
        otp: otp.toString(),
        newPassword: password,
      });

      setMessage("Password reset successful 🎉");
      setType("success");

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch {
      setMessage("Invalid or expired OTP ❌");
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
          Reset Password
        </h2>

        <input
          className="border w-full p-2 mb-3"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, ""))
          }
        />

        <input
          type="password"
          className="border w-full p-2 mb-4"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={resetPassword}
          className="bg-red-500 text-white w-full py-2 rounded"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
