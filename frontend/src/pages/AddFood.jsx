import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AddFood() {
  const navigate = useNavigate();

  const [food, setFood] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discount: "",
    image: "",
    available: true,
  });

  const submit = async () => {
    try {
      await API.post("/foods/add", {
  ...food,
  price: Number(food.price),
  discount: Number(food.discount),
});

// ✅ navigate to home with success message
navigate("/", {
  state: { message: "Food added successfully ✅" },
});


      // reset form
      setFood({
        name: "",
        description: "",
        category: "",
        price: "",
        discount: "",
        image: "",
        available: true,
      });

      // ✅ REDIRECT TO ADMIN DASHBOARD
      navigate("/admin");

    } catch (err) {
      alert("Failed to add food");
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center">Add Food Item</h2>

      <input
        placeholder="Food Name"
        className="border w-full p-2"
        value={food.name}
        onChange={(e) => setFood({ ...food, name: e.target.value })}
      />

      <input
        placeholder="Description"
        className="border w-full p-2"
        value={food.description}
        onChange={(e) =>
          setFood({ ...food, description: e.target.value })
        }
      />

      <input
        placeholder="Category"
        className="border w-full p-2"
        value={food.category}
        onChange={(e) =>
          setFood({ ...food, category: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Price"
        className="border w-full p-2"
        value={food.price}
        onChange={(e) =>
          setFood({ ...food, price: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Discount %"
        className="border w-full p-2"
        value={food.discount}
        onChange={(e) =>
          setFood({ ...food, discount: e.target.value })
        }
      />

      <input
        placeholder="Image URL"
        className="border w-full p-2"
        value={food.image}
        onChange={(e) =>
          setFood({ ...food, image: e.target.value })
        }
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={food.available}
          onChange={(e) =>
            setFood({ ...food, available: e.target.checked })
          }
        />
        <label>Available</label>
      </div>

      <button
        onClick={submit}
        className="bg-green-500 text-white w-full py-2 rounded"
      >
        Save
      </button>
    </div>
  );
}
