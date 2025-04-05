"use client";
import { useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import DeleteModal from "./DeleteModal";

export default function ExpenseItem({ expense, onUpdate }) {
  // component logic goes here

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await api.delete(`/expenses/${expense.id}/`);
      onUpdate();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">{expense.description}</h3>
          <p className="text-sm text-gray-500">{expense.category}</p>
          <p className="text-sm text-gray-500">
            {new Date(expense.date).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium">${expense.amount}</p>
          <div className="mt-2 space-x-2">
            <Link
              href={`/expenses/${expense.id}`}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              Edit
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-red-500 hover:text-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
