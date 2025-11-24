import { Star, Target, Search, Zap, TrendingUp, Globe, BarChart3, Headphones, Plug, DollarSign } from "lucide-react"

export default function AnocabLanding() {
  const ANOCAB_LOGO =
    "https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png"
  const TRUSTED_BRANDS = [
    { name: "Raintree", logo: "https://logo.clearbit.com/raintreehotels.com" },
    { name: "Abu Dhabi Airlines", logo: "https://logo.clearbit.com/etihad.com" },
    { name: "Suzuki", logo: "https://logo.clearbit.com/suzuki.com" },
    { name: "Hotstar", logo: "https://logo.clearbit.com/hotstar.com" },
    { name: "IIFL", logo: "https://logo.clearbit.com/iifl.com" },
    { name: "Netflix", logo: "https://logo.clearbit.com/netflix.com" },
    { name: "PropertyGuru", logo: "https://logo.clearbit.com/propertyguru.com" },
    { name: "OLA", logo: "https://logo.clearbit.com/olacabs.com" },
  ]

  const handleNavigation = (path) => {
    window.location.href = path
  }

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={ANOCAB_LOGO}
            alt="Anocab Logo"
            width={120}
            height={48}
            className="object-contain cursor-pointer"
            onClick={() => handleNavigation('/')}
          />
        </div>

        <div className="flex gap-4 items-center">
          <button 
            className="rounded-full bg-transparent border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors"
            onClick={() => {
              const pricingSection = document.getElementById('pricing-section')
              if (pricingSection) {
                pricingSection.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            Pricing
          </button>
          <button 
            className="rounded-full bg-transparent border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors"
            onClick={() => handleNavigation('/support')}
          >
            Support
          </button>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 transition-colors"
            onClick={() => handleNavigation('/login')}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-100 to-cyan-100 px-8 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-blue-600 leading-tight">
              BUILD LASTING
              <br />
              CUSTOMER
              <br />
              <span className="text-4xl">
                RELATIONSHIPS
                <br />
                with Anocab
              </span>
            </h1>
            <p className="text-gray-800 text-lg leading-relaxed">
              Anocab helps businesses build meaningful customer relationships. Connect better, manage smarter, and grow
              faster with our intelligent customer relationship management platform.
            </p>
            <div className="flex gap-4 items-center pt-4">
              <button 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold text-lg transition-colors"
                onClick={() => handleNavigation('/login')}
              >
                Get Started
              </button>
              <span className="text-sm text-gray-600">with your free trial</span>
            </div>
          </div>

          {/* Right - Illustration */}
          <div className="flex justify-end">
            <div className="w-64 h-64 bg-gradient-to-br from-blue-200 to-cyan-100 rounded-3xl flex items-center justify-center shadow-lg">
              <img src={ANOCAB_LOGO} alt="Anocab" width={220} height={220} className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="bg-white px-8 py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600 text-center mb-8 font-semibold">Trusted by leading companies worldwide</p>
          <div className="flex justify-between items-center flex-wrap gap-8">
            {TRUSTED_BRANDS.map((brand) => (
              <div key={brand.name} className="h-14 flex items-center justify-center px-4">
                <img
                  src={brand.logo}
                  alt={`${brand.name} Logo`}
                  width={140}
                  height={56}
                  loading="lazy"
                  className="object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition Section */}
      <section className="bg-white px-8 py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center">
              <span className="text-4xl">🏆</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Industry Leading
              <br />
              CRM Platform
            </h3>
            <p className="text-gray-700">
              Anocab has earned recognition as a trusted CRM solution, valued by thousands of businesses for driving
              measurable results and long-term growth.
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-8 rounded-lg">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-gray-900">Highly rated by customers</h4>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-lg font-bold text-gray-900">4.8 out of 5</span>
              </div>
              <p className="text-sm text-gray-700 mt-4">Based on 2000+ customer reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* CRM Benefits Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-16">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-4xl font-bold text-white text-center">How Anocab Empowers Your Business</h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Features */}
            <div className="space-y-6">
              {[
                { icon: "🎯", title: "Get a 360 degree view of your customers." },
                { icon: "🔍", title: "Identify and track high-value opportunities." },
                { icon: "⚡", title: "Automate your sales and marketing workflows." },
                { icon: "📈", title: "Convert leads into loyal customers faster." },
                { icon: "🌍", title: "Manage customer interactions across all channels." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-yellow-300 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <p className="text-white font-semibold text-lg">{item.title}</p>
                </div>
              ))}
            </div>

            {/* Right Column - Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "350%", label: "Increase in lead conversion." },
                { number: "45%", label: "Average revenue growth." },
                { number: "60%", label: "Improvement in customer retention." },
                { number: "50%", label: "Reduction in sales cycles." },
                { number: "35%", label: "Cost savings vs competitors." },
              ].map((stat, i) => (
                <div key={i} className="bg-blue-900 rounded-lg p-6 text-white space-y-3">
                  <p className="text-4xl font-bold text-yellow-300">{stat.number}</p>
                  <p className="text-sm font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white text-center text-sm">
            * Results based on customer implementations and case studies.
          </p>
        </div>
      </section>

      {/* Why Choose Anocab Section */}
      <section className="bg-white px-8 py-16">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-4xl font-bold text-gray-900">Why Choose Anocab</h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Anocab is engineered for modern businesses that demand powerful features, intuitive design, and exceptional
            support. From lead management to customer retention, we provide everything you need to build relationships
            that matter.
          </p>

          <div className="grid grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Smart Lead Management",
                desc: "Capture, nurture, and convert quality leads into customers. Get complete visibility into every customer interaction in one centralized dashboard.",
              },
              {
                icon: Zap,
                title: "Intelligent Automation",
                desc: "Automate repetitive tasks and workflows so your team focuses on closing deals and building relationships instead of administrative work.",
              },
              {
                icon: Globe,
                title: "Omnichannel Engagement",
                desc: "Connect with customers across email, phone, chat, and social media. Deliver consistent, personalized experiences at every touchpoint.",
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                desc: "Get real-time insights and predictive analytics to make data-driven decisions and identify growth opportunities.",
              },
              {
                icon: Headphones,
                title: "24/7 World-Class Support",
                desc: "Our dedicated support team is available round-the-clock to help you succeed. Get expert guidance whenever you need it.",
              },
              {
                icon: Plug,
                title: "Seamless Integration",
                desc: "Connect Anocab with 500+ business tools and applications. Create a unified tech stack that works for your business.",
              },
            ].map((feature, i) => {
              const IconComponent = feature.icon
              return (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">{feature.title}</h4>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section id="pricing-section" className="bg-white px-8 py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold text-gray-900">Anocab vs Competitors</h2>
          <p className="text-gray-700">Choose the best value CRM with powerful features at competitive pricing.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Features</th>
                  <th className="text-center py-3 px-4 font-bold text-blue-600">Anocab</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-400">Salesforce</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-400">HubSpot</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-400">Zoho</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-900">AI-Powered Insights</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-900">Built-in Communication Tools</td>
                  <td className="text-center py-3 px-4">✅ Yes</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-900">Unlimited Data Storage</td>
                  <td className="text-center py-3 px-4">✅ Yes</td>
                  <td className="text-center py-3 px-4">💲 Extra</td>
                  <td className="text-center py-3 px-4">💲 Extra</td>
                  <td className="text-center py-3 px-4">✅ Pro+</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-900">Advanced Customization</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-900">Monthly price per user</td>
                  <td className="text-center py-3 px-4 font-bold text-blue-600">From $12</td>
                  <td className="text-center py-3 px-4">From $25</td>
                  <td className="text-center py-3 px-4">From $65</td>
                  <td className="text-center py-3 px-4">From $14</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Anocab Savings Calculator</h3>
            <div className="grid grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-green-600">$12</p>
                <p className="text-sm text-gray-600">
                  Anocab
                  <br />
                  per user/month
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-500">$25</p>
                <p className="text-sm text-gray-600">Salesforce</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-500">$65</p>
                <p className="text-sm text-gray-600">HubSpot Pro</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-500">$125</p>
                <p className="text-sm text-gray-600">Enterprise</p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-lg font-bold text-gray-900">Save up to</p>
              <p className="text-4xl font-bold text-green-600 mt-2">68% per user annually</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold text-white">Ready to Transform Your Customer Relationships?</h2>
          <p className="text-blue-100 text-lg">
            Join thousands of businesses growing with Anocab. Start your free trial today.
          </p>
          <button 
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-bold text-lg transition-colors"
            onClick={() => handleNavigation('/login')}
          >
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  )
}
