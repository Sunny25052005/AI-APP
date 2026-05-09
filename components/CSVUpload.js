import { useState } from "react";
import API from "../utils/api";
import { showToast } from "../utils/toast";

export default function CSVUpload({ entity }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      showToast("Please select a file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post(`/upload/${entity}`, formData);
      showToast("CSV uploaded successfully!");
      setFile(null);
    } catch (error) {
      showToast(error.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 flex items-center space-x-2">
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0])}
        className="text-sm text-gray-500 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="bg-green-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>
    </div>
  );
}
