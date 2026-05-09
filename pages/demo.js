import { useRouter } from "next/router";

export default function DemoPage() {
  const router = useRouter();

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

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            See AI App Generator in Action
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Watch how easy it is to create professional applications with our AI-powered platform
          </p>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Demo Steps */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-medium">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Choose a Template</h3>
                  <p className="text-gray-600">Select from our library of professional templates or start from scratch</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-medium">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Customize Features</h3>
                  <p className="text-gray-600">Add the features you need using our intuitive interface</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-medium">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">AI Generates Code</h3>
                  <p className="text-gray-600">Our AI creates production-ready code based on your requirements</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-medium">
                  4
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Deploy Instantly</h3>
                  <p className="text-gray-600">Launch your app with one click to our cloud infrastructure</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Demo */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Try It Now</h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">App Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option>E-commerce Platform</option>
                    <option>Social Network</option>
                    <option>Task Management</option>
                    <option>Content Management</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">App Name</label>
                  <input 
                    type="text" 
                    placeholder="My Awesome App"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>User Authentication</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>Real-time Chat</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Payment Processing</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Analytics Dashboard</span>
                    </label>
                  </div>
                </div>
                
                <button
                  onClick={() => router.push("/signup")}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Start Building This App
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Apps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Apps Built With AI App Generator</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">ShopSmart</h3>
              <p className="text-gray-600 mb-4">E-commerce platform with inventory management and payment processing</p>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Generated in 2 minutes
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-green-400 to-green-600"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">TaskFlow</h3>
              <p className="text-gray-600 mb-4">Project management tool with team collaboration features</p>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Generated in 3 minutes
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">ConnectHub</h3>
              <p className="text-gray-600 mb-4">Social network with real-time messaging and content sharing</p>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Generated in 4 minutes
              </div>
            </div>
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
            onClick={() => router.push("/signup")}
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Start Building Free
          </button>
        </div>
      </div>
    </div>
  );
}
