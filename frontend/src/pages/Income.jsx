import { useEffect, useState } from "react";
import API from "../services/api";

export default function Income() {
  const [income, setIncome] = useState({
    today: { orders: 0, income: 0 },
    week: { orders: 0, income: 0 },
    month: { orders: 0, income: 0 },
    year: { orders: 0, income: 0 },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    try {
      const res = await API.get("/orders/income");
      setIncome(res.data);
    } catch (err) {
      console.error("Failed to fetch income", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading income data...</p>;
  }

  const Card = ({ title, data }) => (
    <div className="border p-4 rounded shadow">
      <p className="text-gray-500">{title}</p>
      <p className="font-semibold">Orders: {data.orders}</p>
      <p className="text-2xl font-bold">₹{data.income}</p>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Income Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Today" data={income.today} />
        <Card title="Last 7 Days" data={income.week} />
        <Card title="This Month" data={income.month} />
        <Card title="This Year" data={income.year} />
      </div>
    </div>
  );
}
