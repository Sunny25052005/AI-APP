import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import API from "../utils/api";
import { showToast } from "../utils/toast";

export default function DashboardPage() {
  const router = useRouter();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const response = await API.get("/apps");
      setApps(response.data);
    } catch (error) {
      showToast(error.response?.data?.error || "Failed to fetch apps");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    router.push("/templates");
  };

  const handleViewApp = (appId) => {
    router.push(`/app/${appId}`);
  };

  const handleDeleteApp = async (appId) => {
    if (!confirm("Are you sure you want to delete this app?")) return;
    
    try {
      await API.delete(`/apps/${appId}`);
      setApps(apps.filter(app => app.id !== appId));
      showToast("App deleted successfully");
    } catch (error) {
      showToast(error.response?.data?.error || "Failed to delete app");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "generating": return "bg-yellow-100 text-yellow-800";
      case "ready": return "bg-green-100 text-green-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      business: "💼",
      social: "👥",
      productivity: "📋",
      content: "📝",
      education: "🎓"
    };
    return icons[category] || "🚀";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your apps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => router.push("/")}
                className="text-2xl font-bold text-indigo-600 hover:text-indigo-700"
              >
                AI App Generator
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => router.push("/")} className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </button>
              <button onClick={() => router.push("/features")} className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Features
              </button>
              <button onClick={() => router.push("/templates")} className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Templates
              </button>
              <button onClick={() => router.push("/pricing")} className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Pricing
              </button>
              <button className="text-indigo-600 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-indigo-600">
                Dashboard
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/");
                }}
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Your AI Apps</h1>
              <p className="text-indigo-100">Manage and monitor your generated applications</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Create New App
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Apps</p>
                <p className="text-2xl font-bold text-gray-900">{apps.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Ready</p>
                <p className="text-2xl font-bold text-gray-900">{apps.filter(app => app.status === "ready").length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Generating</p>
                <p className="text-2xl font-bold text-gray-900">{apps.filter(app => app.status === "generating").length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {apps.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">You haven't created any apps yet</div>
            <button
              onClick={handleCreateNew}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Create Your First App
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map(app => (
              <div key={app.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{getCategoryIcon(app.category)}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{app.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{app.description}</p>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-1">Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {app.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                      {app.features.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          +{app.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewApp(app.id)}
                      className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteApp(app.id)}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
