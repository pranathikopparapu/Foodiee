import { useEffect, useState } from "react";
import API from "../services/api";
import FoodCard from "../components/FoodCard";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [foods, setFoods] = useState([]);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  /* ================= FETCH FOODS ================= */
  const fetchFoods = async () => {
    try {
      const res = await API.get("/foods");
      setFoods(res.data);
    } catch (err) {
      console.error("Failed to load foods");
    }
  };

  /* ================= LOAD ONCE ================= */
  useEffect(() => {
    fetchFoods();

    // ✅ redirect admin ONLY once
    if (role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, []); // eslint-disable-line

  /* ================= GROUP BY CATEGORY ================= */
  const groupedFoods = foods.reduce((acc, food) => {
    acc[food.category] = acc[food.category] || [];
    acc[food.category].push(food);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-10">
      {Object.keys(groupedFoods).length === 0 && (
        <p className="text-center text-gray-500 mt-20">
          No products available
        </p>
      )}

      {Object.keys(groupedFoods).map((category) => (
        <div key={category}>
          <h2 className="text-2xl font-bold mb-4">{category}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {groupedFoods[category].map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                refreshFoods={fetchFoods} // ⭐ refresh after review
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
