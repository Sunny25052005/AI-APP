import { useEffect, useState } from "react";
import API from "../utils/api";
import DynamicForm from "./DynamicForm";
import DynamicTable from "./DynamicTable";
import CSVUpload from "./CSVUpload";

export default function Home() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    API.get("/config").then((res) => setConfig(res.data));
  }, []);

  if (!config) return <p>Loading app...</p>;

  if (!config.entities || Object.keys(config.entities).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No entities configured</h2>
          <p className="text-gray-600">Please configure entities in the backend to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI App Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your data entities</p>
        </div>
        
        {config.entities.map((entity) => (
          <div key={entity} className="mb-8">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 capitalize">{entity}</h2>
              <CSVUpload entity={entity} />
            </div>
            <DynamicForm entity={entity} fields={["name", "description", "value"]} />
            <DynamicTable entity={entity} fields={["name", "description", "value"]} />
          </div>
        ))}
      </div>
    </div>
  );
}
