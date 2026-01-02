import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ManageFood() {
  const [foods, setFoods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    const res = await API.get("/foods");
    setFoods(res.data);
  };

  const deleteFood = async (id) => {
    await API.delete(`/foods/${id}`);
    fetchFoods();
  };

  /* 🔹 GROUP BY CATEGORY */
  const groupedFoods = foods.reduce((acc, food) => {
    acc[food.category] = acc[food.category] || [];
    acc[food.category].push(food);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Manage Food</h2>

      {Object.keys(groupedFoods).map((category) => (
        <div key={category}>
          <h3 className="text-xl font-semibold mb-3">{category}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedFoods[category].map((food) => (
              <div key={food._id} className="border p-4 rounded">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-32 object-cover mb-2"
                />

                <h4 className="font-bold">{food.name}</h4>
                <p>₹{food.price}</p>

                <div className="flex gap-3 mt-3">
                  {/* ✅ USE FULL EDIT PAGE */}
                  <button
                    onClick={() => navigate(`/admin/edit-food/${food._id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteFood(food._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
