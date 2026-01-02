import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function OrderSuccess() {
  const navigate = useNavigate();

  // auto redirect to home after 6 seconds (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 6000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      {/* Animated emojis */}
      <div className="text-6xl animate-bounce mb-4">🎉🍔🚀</div>

      <h1 className="text-3xl font-bold text-green-600 mb-2">
        Order Placed Successfully!
      </h1>

      <p className="text-gray-600 mb-6">
        Your food is being prepared and will be delivered soon 😋
      </p>

      <button
        onClick={() => navigate("/")}
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
      >
        Go to Home
      </button>

      <p className="text-sm text-gray-400 mt-4">
        Redirecting to home in a few seconds...
      </p>
    </div>
  );
}
