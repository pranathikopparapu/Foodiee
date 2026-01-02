import { useEffect, useState } from "react";
import API from "../services/api";
import FoodCard from "../components/FoodCard";

export default function EditFood() {
  const [foods, setFoods] = useState([]);
  const [editingFood, setEditingFood] = useState(null);

  const fetchFoods = async () => {
    const res = await API.get("/foods");
    setFoods(res.data);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const updateFood = async () => {
    await API.put(`/foods/${editingFood._id}`, {
      ...editingFood,
      price: Number(editingFood.price),
      discount: Number(editingFood.discount),
      rating: Number(editingFood.rating),
    });

    setEditingFood(null);
    fetchFoods();
  };
const normalizeFood = (food) => ({
  _id: food._id,
  name: food.name || "",
  description: food.description || "",
  category: food.category || "",
  price: food.price || "",
  discount: food.discount || "",
  image: food.image || "",
  rating: food.rating || 0,
  available: food.available ?? true,
});

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Food</h2>

      {/* FOOD LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {foods.map(food => (
          <FoodCard
            key={food._id}
            food={food}
            refreshFoods={fetchFoods}
            onEdit={setEditingFood}   // 🔥 IMPORTANT
          />
        ))}
      </div>

      {/* ===== EDIT MODAL (FULL ADD FOOD FORM) ===== */}
      {editingFood && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-[400px] space-y-3">
            <h3 className="text-lg font-bold text-center">Edit Food</h3>

            <input
              className="border p-2 w-full"
              placeholder="Food Name"
              value={editingFood.name}
              onChange={e =>
                setEditingFood({ ...editingFood, name: e.target.value })
              }
            />

            <input
              className="border p-2 w-full"
              placeholder="Description"
              value={editingFood.description}
              onChange={e =>
                setEditingFood({ ...editingFood, description: e.target.value })
              }
            />

            <input
              className="border p-2 w-full"
              placeholder="Category (Burger / Pizza / etc)"
              value={editingFood.category}
              onChange={e =>
                setEditingFood({ ...editingFood, category: e.target.value })
              }
            />

            <input
              type="number"
              className="border p-2 w-full"
              placeholder="Price"
              value={editingFood.price}
              onChange={e =>
                setEditingFood({ ...editingFood, price: e.target.value })
              }
            />

            <input
              type="number"
              className="border p-2 w-full"
              placeholder="Discount %"
              value={editingFood.discount}
              onChange={e =>
                setEditingFood({ ...editingFood, discount: e.target.value })
              }
            />

            <input
              className="border p-2 w-full"
              placeholder="Image URL"
              value={editingFood.image}
              onChange={e =>
                setEditingFood({ ...editingFood, image: e.target.value })
              }
            />

            <input
              type="number"
              className="border p-2 w-full"
              placeholder="Rating"
              value={editingFood.rating}
              onChange={e =>
                setEditingFood({ ...editingFood, rating: e.target.value })
              }
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingFood.available}
                onChange={e =>
                  setEditingFood({
                    ...editingFood,
                    available: e.target.checked,
                  })
                }
              />
              Available
            </label>

            <button
              onClick={updateFood}
              className="bg-green-500 text-white px-4 py-2 rounded w-full"
            >
              Update Food
            </button>

            <button
              onClick={() => setEditingFood(null)}
              className="w-full text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
