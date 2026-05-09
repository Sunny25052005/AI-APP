import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import API from "../../utils/api";
import { showToast } from "../../utils/toast";

export default function AppDetailPage() {
  const router = useRouter();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    
    if (router.query.id) {
      fetchApp(router.query.id);
    }
  }, [router.query.id]);

  const fetchApp = async (appId) => {
    try {
      // Get all apps and find the specific one
      const response = await API.get("/apps");
      const userApp = response.data.find(a => a.id === parseInt(appId));
      
      if (userApp) {
        setApp(userApp);
      } else {
        showToast("App not found");
        router.push("/dashboard");
      }
    } catch (error) {
      showToast(error.response?.data?.error || "Failed to fetch app");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApp = async () => {
    if (!confirm("Are you sure you want to delete this app?")) return;
    
    try {
      await API.delete(`/apps/${app.id}`);
      showToast("App deleted successfully");
      router.push("/dashboard");
    } catch (error) {
      showToast(error.response?.data?.error || "Failed to delete app");
    }
  };

  const handleDeploy = () => {
    showToast("Deployment started!");
    // Simulate deployment
    setTimeout(() => {
      showToast("App deployed successfully!");
    }, 2000);
  };

  const handleDownload = () => {
    // Simulate code download
    showToast("Downloading app code...");
    setTimeout(() => {
      showToast("Code downloaded successfully!");
    }, 1000);
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
          <p className="mt-4 text-gray-600">Loading app details...</p>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">App Not Found</h2>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
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
              <button onClick={() => router.push("/dashboard")} className="text-indigo-600 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-indigo-600">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{getCategoryIcon(app.category)}</div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{app.name}</h1>
                <p className="text-indigo-100">{app.category} Application</p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
              {app.status}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* App Description */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">App Details</h2>
              <p className="text-gray-600 mb-6">{app.description}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Category</h3>
                  <p className="text-gray-600 capitalize">{app.category}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Created</h3>
                  <p className="text-gray-600">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {app.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Stack */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack</h2>
              <div className="flex flex-wrap gap-2">
                {app.techStack.map((tech, index) => (
                  <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg text-sm font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleDeploy}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Deploy App
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full bg-white text-indigo-600 py-2 px-4 rounded-lg font-medium border border-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  Download Code
                </button>
                <button
                  onClick={() => router.push(`/edit/${app.id}`)}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Edit App
                </button>
                <button
                  onClick={handleDeleteApp}
                  className="w-full bg-red-100 text-red-600 py-2 px-4 rounded-lg font-medium hover:bg-red-200 transition-colors"
                >
                  Delete App
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Features</span>
                  <span className="font-medium">{app.features.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Technologies</span>
                  <span className="font-medium">{app.techStack.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
