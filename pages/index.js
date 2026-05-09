import { useState } from "react";
import { useRouter } from "next/router";

export default function IndexPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/signup");
  };

  const handleViewDemo = () => {
    router.push("/demo");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="text-2xl font-bold text-indigo-600">AI App Generator</div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
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
                onClick={handleGetStarted}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Get Started
              </button>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button onClick={() => router.push("/features")} className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
                Features
              </button>
              <button onClick={() => router.push("/templates")} className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
                Templates
              </button>
              <button onClick={() => router.push("/pricing")} className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
                Pricing
              </button>
              <button onClick={() => router.push("/login")} className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
                Login
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-indigo-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Build AI Apps in Minutes,
            <span className="text-indigo-600"> Not Months</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your ideas into powerful AI applications with our intelligent code generator. 
            No coding experience required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Start Building Free
            </button>
            <button
              onClick={handleViewDemo}
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-medium border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Build Amazing AI Apps
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From idea to deployment in minutes, not months
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Generation</h3>
            <p className="text-gray-600">
              Smart code generation that understands your requirements and creates production-ready applications.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Templates</h3>
            <p className="text-gray-600">
              Choose from dozens of industry-tested templates and customize them to match your needs.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Deployment</h3>
            <p className="text-gray-600">
              Deploy your applications with one click to our cloud infrastructure or export to your preferred platform.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Build Your First AI App?
          </h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are building faster and smarter with AI.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Start Building Free
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">AI App Generator</h3>
              <p className="text-gray-400">
                Transform ideas into powerful AI applications with intelligent code generation.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => router.push("/features")} className="hover:text-white">Features</button></li>
                <li><button onClick={() => router.push("/templates")} className="hover:text-white">Templates</button></li>
                <li><button onClick={() => router.push("/pricing")} className="hover:text-white">Pricing</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => router.push("/docs")} className="hover:text-white">Documentation</button></li>
                <li><button onClick={() => router.push("/tutorials")} className="hover:text-white">Tutorials</button></li>
                <li><button onClick={() => router.push("/blog")} className="hover:text-white">Blog</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => router.push("/about")} className="hover:text-white">About</button></li>
                <li><button onClick={() => router.push("/contact")} className="hover:text-white">Contact</button></li>
                <li><button onClick={() => router.push("/careers")} className="hover:text-white">Careers</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI App Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
