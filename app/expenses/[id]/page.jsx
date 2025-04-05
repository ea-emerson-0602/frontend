// app/expenses/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";

const CATEGORY_OPTIONS = [
  "Food",
  "Transport",
  "Housing",
  "Entertainment",
  "Other",
];

export default function EditExpensePage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await api.get(`/expenses/${params.id}/`);
        const { amount, category, description, date } = response.data;

        setFormData({
          amount: amount.toString(),
          category,
          description: description || "",
          date: new Date(date).toISOString().split("T")[0],
        });
      } catch (err) {
        console.error("Failed to fetch expense:", err);
        router.push("/login");
      }
    };

    if (params.id) fetchExpense();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // In your submit handler
    // console.log('Submitting:', payload); // Check this in browser console
    try {
      // Validate amount
      const amountValue = parseFloat(formData.amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Please enter a valid positive amount");
      }
      if (
        !CATEGORY_OPTIONS.includes(
          formData.category[number]
        )
      ) {
        throw new Error("Please select a valid category");
      }
      // Prepare payload
      const payload = {
        amount: amountValue,
        category: formData.category,
        description: formData.description,
        date: formData.date,
      };
      console.log(payload);
      const response = await api.patch(`/expenses/${params.id}/`, payload);

      if (response.status === 200) {
        router.push("/expenses");
        router.refresh(); // Force cache refresh
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to update expense";
      setError(errorMessage);
      console.error("Update error:", err.response?.data);

      console.error("Full error object:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Expense</h1>
      {error && (
        <div className="mb-4 p-3 text-red-500 text-sm text-center border border-red-200 rounded-md bg-red-50">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Amount ($)</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            disabled
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push("/expenses")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
