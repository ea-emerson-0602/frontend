// app/categories/page.tsx
"use client";
import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Category {
  id: number;
  name: string;
  color: string;
  budget?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  // const router = useRouter();

  const fetchCategories = async () => {
    const response = await api.get('/categories/');
    setCategories(response.data);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSave = async (category: Category | Partial<Category>) => {
    try {
      if (editingId) {
        await api.patch(`/categories/${editingId}/`, category);
      } else {
        await api.post('/categories/', { ...category, budget: category.budget || null });
      }
      fetchCategories();
      setEditingId(null);
      setNewCategory({});
    } catch (err) {
      console.error('Category operation failed:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>
      
      {/* Add/Edit Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit Category' : 'New Category'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory.name || ''}
            onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
            className="p-2 border rounded"
          />
          <input
            type="color"
            value={newCategory.color || '#64748b'}
            onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
            className="p-1 border rounded"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Budget (optional)"
            value={newCategory.budget || ''}
            onChange={(e) => setNewCategory({...newCategory, budget: parseFloat(e.target.value)})}
            className="p-2 border rounded"
          />
          <button
            onClick={() => handleSave(newCategory)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingId ? 'Update' : 'Add'}
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center bg-white p-4 rounded shadow">
            <div 
              className="w-4 h-8 rounded mr-4"
              style={{ backgroundColor: category.color }}
            ></div>
            <div className="flex-1">
              <h3 className="font-medium">{category.name}</h3>
              {category.budget && (
                <p className="text-sm text-gray-500">
                  Budget: ${category.budget.toFixed(2)}
                </p>
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEditingId(category.id);
                  setNewCategory(category);
                }}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  await api.delete(`/categories/${category.id}/`);
                  fetchCategories();
                }}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}