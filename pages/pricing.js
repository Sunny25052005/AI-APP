import { useRouter } from "next/router";

export default function PricingPage() {
  const router = useRouter();

  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for trying out AI App Generator",
      features: [
        "3 Apps per month",
        "Basic templates",
        "Community support",
        "Basic customization"
      ],
      highlighted: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "Most popular for serious developers",
      features: [
        "Unlimited apps",
        "All templates",
        "Priority support",
        "Advanced customization",
        "Code export",
        "Custom domains"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For teams and large organizations",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Custom templates",
        "Dedicated support",
        "White label options",
        "SLA guarantee"
      ],
      highlighted: false
    }
  ];

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
              <button className="text-indigo-600 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-indigo-600">
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
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Start free, upgrade anytime.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className={`bg-white rounded-lg shadow-lg overflow-hidden ${plan.highlighted ? 'ring-2 ring-indigo-600' : ''}`}>
              {plan.highlighted && (
                <div className="bg-indigo-600 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-600">{plan.period}</span>}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => router.push("/signup")}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    plan.highlighted
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.name === 'Starter' ? 'Start Free' : 'Get Started'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">Got questions? We've got answers.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I change plans anytime?</h3>
            <p className="text-gray-600">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What happens if I exceed my limits?</h3>
            <p className="text-gray-600">We'll notify you and give you the option to upgrade. Your existing apps won't be affected.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you offer refunds?</h3>
            <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee for all paid plans.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my data secure?</h3>
            <p className="text-gray-600">Absolutely! We use enterprise-grade security and encrypt all data both in transit and at rest.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
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
