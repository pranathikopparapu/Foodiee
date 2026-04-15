import { useEffect, useState } from "react";
import API from "../services/api";

export default function ManageFood() {
  const [foods, setFoods] = useState([]);
  const [editingFood, setEditingFood] = useState(null);

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

  const updateFood = async () => {
    await API.put(`/foods/${editingFood._id}`, editingFood);
    setEditingFood(null);
    fetchFoods();
  };

  // 🔹 Group foods by category
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
                <p>₹{food.finalPrice}</p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => setEditingFood(food)}
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

      {/* 🔹 EDIT MODAL */}
      {editingFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96 space-y-3">
            <h3 className="font-bold text-lg">Edit Food</h3>

            <input
              className="border w-full p-2"
              value={editingFood.name}
              onChange={(e) =>
                setEditingFood({ ...editingFood, name: e.target.value })
              }
            />

            <input
              className="border w-full p-2"
              value={editingFood.price}
              type="number"
              onChange={(e) =>
                setEditingFood({ ...editingFood, price: e.target.value })
              }
            />

            <input
              className="border w-full p-2"
              value={editingFood.discount}
              type="number"
              onChange={(e) =>
                setEditingFood({ ...editingFood, discount: e.target.value })
              }
            />

            <div className="flex justify-between">
              <button
                onClick={updateFood}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditingFood(null)}
                className="bg-gray-400 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
