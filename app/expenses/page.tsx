"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import AddExpenseForm from "../components/AddExpenseForm";
import ExpenseItem from "../components/ExpenseItem";
import Link from "next/link";

interface Expense {
  id: number;
  amount: string;
  category: string;
  description: string;
  date: string;
}

interface User {
  username: string;
  email: string;
  profile_picture?: string;
}

export default function ExpensesPage() {
  const url = process.env.NEXT_PUBLIC_URL
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentSort, setCurrentSort] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  // Add this useEffect to fetch user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`${url}/auth/user/`);
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    if (localStorage.getItem("accessToken")) {
      fetchUserProfile();
    }
  }, []);

  const fetchExpenses = async (
    page = 1,
    category = currentCategory,
    sort = currentSort,
    start = startDate,
    end = endDate
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
      });

      if (category) params.append("category", category);
      if (sort) params.append("ordering", sort);
      if (start) params.append("date__gte", start); // Changed parameter name
      if (end) params.append("date__lte", end); // Changed parameter name

      const response = await api.get(`/expenses/?${params.toString()}`);

      setExpenses(response.data.results);
      setTotalPages(response.data.total_pages);
      setCurrentPage(page);
      // Update all filter states
      setCurrentCategory(category);
      setCurrentSort(sort);
      setStartDate(start);
      setEndDate(end);
    } catch (err) {
      setError("Failed to fetch expenses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.push("/login");
      return;
    }
    fetchExpenses();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCurrentCategory(newCategory);
    fetchExpenses(1, newCategory, currentSort, startDate, endDate);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;
    let newSort = "";

    switch (sortValue) {
      case "date_asc":
        newSort = "date";
        break;
      case "date_desc":
        newSort = "-date";
        break;
      case "amount_asc":
        newSort = "amount";
        break;
      case "amount_desc":
        newSort = "-amount";
        break;
      default:
        newSort = "";
    }

    setCurrentSort(newSort);
    fetchExpenses(1, currentCategory, newSort, startDate, endDate);
  };

  const handleDateFilter = () => {
    fetchExpenses(1, currentCategory, currentSort, startDate, endDate);
  };

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    fetchExpenses(1, currentCategory, currentSort, "", "");
  };

  // Pagination button disabled logic
  const isPreviousDisabled = currentPage === 1 || totalPages <= 1;
  const isNextDisabled = currentPage === totalPages || totalPages <= 1;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <div className="cursor-pointer">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </div>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              router.push("/login");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <AddExpenseForm onExpenseAdded={() => fetchExpenses(currentPage)} />

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Filter/Sort Controls - Always Visible */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              onChange={handleCategoryChange}
              value={currentCategory}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">All Categories</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Housing">Housing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              onChange={handleSortChange}
              value={currentSort}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Default</option>
              <option value="date_asc">Date (Oldest First)</option>
              <option value="date_desc">Date (Newest First)</option>
              <option value="amount_asc">Amount (Low to High)</option>
              <option value="amount_desc">Amount (High to Low)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDateFilter}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Apply Date Filter
          </button>
          <button
            onClick={clearDateFilter}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Clear Dates
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading expenses...</div>
      ) : expenses.length === 0 ? (
        <p className="text-gray-500">No expenses found for these filters</p>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onUpdate={() => fetchExpenses(currentPage)}
            />
          ))}
        </div>
      )}

      {/* Updated Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => fetchExpenses(currentPage - 1)}
          disabled={isPreviousDisabled}
          className={`px-4 py-2 rounded ${
            isPreviousDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>

        <span className="px-4 py-2 border border-gray-300 rounded">
          Page {currentPage} of {Math.max(totalPages, 1)}
        </span>

        <button
          onClick={() => fetchExpenses(currentPage + 1)}
          disabled={isNextDisabled}
          className={`px-4 py-2 rounded ${
            isNextDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
