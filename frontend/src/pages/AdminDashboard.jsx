import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminDashboard() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    const res = await API.get("/foods");
    setFoods(res.data);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {foods.length === 0 ? (
        <p className="text-gray-500">No food items found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {foods.map((food) => (
            <div key={food._id} className="border p-4 rounded">
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="font-bold">{food.name}</h3>
              <p className="text-sm text-gray-500">{food.category}</p>
              <p className="font-semibold">₹{food.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
