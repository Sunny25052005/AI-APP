import { useState, useEffect } from "react";
import API from "../utils/api";
import { showToast } from "../utils/toast";

export default function DynamicTable({ entity, fields }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [entity]);

  const fetchData = async () => {
    try {
      const response = await API.get(`/entity/${entity}`);
      setData(response.data);
    } catch (error) {
      showToast(error.response?.data?.error || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="shadow p-4 rounded bg-white">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="shadow p-4 rounded bg-white">
      <h3 className="text-lg font-semibold mb-4 capitalize">{entity} List</h3>
      
      {data.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No {entity} data found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {fields?.map((field) => (
                  <th
                    key={field}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider capitalize"
                  >
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index}>
                  {fields?.map((field) => (
                    <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item[field] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
