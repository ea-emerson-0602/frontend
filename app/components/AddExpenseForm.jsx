"use client";
import { useState } from "react";
import api from "@/lib/api";

// Match these categories with your Django model's choices
const CATEGORIES = [
  "Food",
  "Transport",
  "Rent", // Changed from Housing to match backend
  "Entertainment",
  "Other",
] ;

export default function AddExpenseForm({ onExpenseAdded }) {
  // component logic goes here


  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate required fields
      if (!date) throw new Error("Date is required");
      if (!category) throw new Error("Category is required");
      if (!amount) throw new Error("Amount is required");

      // Convert to proper decimal format
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) throw new Error("Invalid amount");

      const response = await api.post("/expenses/", {
        amount: numericAmount.toFixed(2), // Ensure 2 decimal places
        category,
        description: description || "No description", // Handle empty description
        date: new Date(date).toISOString().split("T")[0],
      });

      if (response.status === 201) {
        onExpenseAdded();
        // Reset form
        setAmount("");
        setCategory("");
        setDescription("");
        setDate("");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.category?.[0] || // Handle category errors
        err.message ||
        "Failed to add expense";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Amount ($)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 text-red-500 text-sm text-center border border-red-200 rounded-md bg-red-50">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
}
