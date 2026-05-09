import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import API from "../utils/api";
import { showToast } from "../utils/toast";

export default function CreatePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState(null);
  
  const [appData, setAppData] = useState({
    name: "",
    description: "",
    category: "",
    features: [],
    techStack: ["React", "Node.js", "Database"],
    deployment: "cloud"
  });

  const templates = {
    1: { name: "E-commerce Platform", category: "business" },
    2: { name: "Social Network", category: "social" },
    3: { name: "Task Management", category: "productivity" },
    4: { name: "Content Management", category: "content" },
    5: { name: "Booking System", category: "business" },
    6: { name: "Learning Platform", category: "education" }
  };

  const featureOptions = [
    "User Authentication", "Real-time Chat", "File Upload", "Payment Processing",
    "Email Notifications", "Analytics Dashboard", "API Integration", "Mobile Responsive",
    "Search Functionality", "Social Sharing", "Comments System", "Admin Panel"
  ];

  const techOptions = [
    "React", "Vue.js", "Angular", "Next.js", "Node.js", "Python", "MongoDB", 
    "PostgreSQL", "MySQL", "Redis", "Docker", "AWS", "Vercel", "Netlify"
  ];

  useEffect(() => {
    if (router.query.template) {
      const templateId = parseInt(router.query.template);
      const selectedTemplate = templates[templateId];
      if (selectedTemplate) {
        setTemplate(selectedTemplate);
        setAppData(prev => ({
          ...prev,
          name: selectedTemplate.name,
          category: selectedTemplate.category
        }));
      }
    }
  }, [router.query]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFeatureToggle = (feature) => {
    setAppData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleTechToggle = (tech) => {
    setAppData(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }));
  };

  const handleGenerate = async () => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login to generate apps");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      console.log("Generating app with data:", appData);
      const response = await API.post("/apps/generate", appData);
      console.log("App generation response:", response.data);
      showToast("App generation started! Check your dashboard.");
      router.push("/dashboard");
    } catch (error) {
      console.error("App generation error:", error);
      if (error.response?.status === 401) {
        showToast("Please login to generate apps");
        router.push("/login");
      } else {
        showToast(error.response?.data?.error || "Failed to generate app");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Basic Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">App Name</label>
              <input
                type="text"
                value={appData.name}
                onChange={(e) => setAppData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your app name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={appData.description}
                onChange={(e) => setAppData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
                placeholder="Describe your app"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={appData.category}
                onChange={(e) => setAppData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a category</option>
                <option value="business">Business</option>
                <option value="social">Social</option>
                <option value="productivity">Productivity</option>
                <option value="content">Content</option>
                <option value="education">Education</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Choose Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {featureOptions.map(feature => (
                <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={appData.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Technology Stack</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {techOptions.map(tech => (
                <label key={tech} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={appData.techStack.includes(tech)}
                    onChange={() => handleTechToggle(tech)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{tech}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Review & Generate</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-lg mb-4">App Summary</h4>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Name:</span> {appData.name}
                </div>
                <div>
                  <span className="font-medium">Description:</span> {appData.description}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {appData.category}
                </div>
                <div>
                  <span className="font-medium">Features:</span> {appData.features.join(", ")}
                </div>
                <div>
                  <span className="font-medium">Tech Stack:</span> {appData.techStack.join(", ")}
                </div>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Generating App..." : "Generate My AI App"}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

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
              <button onClick={() => router.push("/login")} className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? "bg-indigo-600" : "bg-gray-300"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-600">Basic Info</span>
            <span className="text-xs text-gray-600">Features</span>
            <span className="text-xs text-gray-600">Tech Stack</span>
            <span className="text-xs text-gray-600">Generate</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderStep()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === 4}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
