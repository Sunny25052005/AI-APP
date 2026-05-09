import { useState } from "react";
import API from "../utils/api";
import { showToast } from "../utils/toast";

export default function DynamicForm({ entity, fields }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post(`/entity/${entity}`, formData);
      showToast(`${entity} created successfully!`);
      setFormData({});
    } catch (error) {
      showToast(error.response?.data?.error || "Failed to create item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow p-4 rounded bg-white mb-6">
      <h3 className="text-lg font-semibold mb-4 capitalize">Add New {entity}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields?.map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {field}
            </label>
            <input
              type="text"
              value={formData[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? "Creating..." : `Create ${entity}`}
        </button>
      </form>
    </div>
  );
}
