import { useState } from "react";
import { useRouter } from "next/router";

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const templates = [
    {
      id: 1,
      name: "E-commerce Platform",
      category: "business",
      description: "Complete online store with inventory, orders, and payment processing",
      features: ["Product catalog", "Shopping cart", "Payment integration", "Order tracking"],
      icon: "🛒",
      difficulty: "Intermediate"
    },
    {
      id: 2,
      name: "Social Network",
      category: "social",
      description: "Connect users with profiles, posts, comments, and real-time messaging",
      features: ["User profiles", "News feed", "Comments", "Direct messaging"],
      icon: "👥",
      difficulty: "Advanced"
    },
    {
      id: 3,
      name: "Task Management",
      category: "productivity",
      description: "Organize projects, tasks, and team collaboration tools",
      features: ["Task boards", "Team collaboration", "Progress tracking", "Notifications"],
      icon: "📋",
      difficulty: "Beginner"
    },
    {
      id: 4,
      name: "Content Management",
      category: "content",
      description: "Manage and publish digital content with rich editing features",
      features: ["Rich text editor", "Media management", "SEO optimization", "Analytics"],
      icon: "📝",
      difficulty: "Intermediate"
    },
    {
      id: 5,
      name: "Booking System",
      category: "business",
      description: "Schedule appointments, manage calendars, and process bookings",
      features: ["Calendar integration", "Booking management", "Payment processing", "Reminders"],
      icon: "📅",
      difficulty: "Intermediate"
    },
    {
      id: 6,
      name: "Learning Platform",
      category: "education",
      description: "Create and deliver online courses with progress tracking",
      features: ["Course creation", "Video lessons", "Progress tracking", "Certificates"],
      icon: "🎓",
      difficulty: "Advanced"
    }
  ];

  const categories = [
    { id: "all", name: "All Templates" },
    { id: "business", name: "Business" },
    { id: "social", name: "Social" },
    { id: "productivity", name: "Productivity" },
    { id: "content", name: "Content" },
    { id: "education", name: "Education" }
  ];

  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleUseTemplate = (templateId) => {
    router.push(`/create?template=${templateId}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <button 
                  onClick={() => router.push("/")}
                  className="text-2xl font-bold text-indigo-600 hover:text-indigo-700"
                >
                  AI App Generator
                </button>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => router.push("/")} className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </button>
              <button onClick={() => router.push("/features")} className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Features
              </button>
              <button className="text-indigo-600 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-indigo-600">
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

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Perfect Template
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Start with a professionally designed template and customize it to match your needs
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map(template => (
            <div key={template.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{template.icon}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-gray-600 mb-4">{template.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {template.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Use This Template
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No templates found in this category.</div>
            <button
              onClick={() => setSelectedCategory("all")}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all templates
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
