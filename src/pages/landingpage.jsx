import { Star, Target, Zap, Globe, BarChart3, Headphones, Plug } from "lucide-react"
import AshvayChat from "../components/AshvayChat"

const ANOCAB_LOGO = "https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png"
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

const CRM_FEATURES = [
  { icon: "🎯", title: "Get a 360 degree view of your customers." },
  { icon: "🔍", title: "Identify and track high-value opportunities." },
  { icon: "⚡", title: "Automate your sales and marketing workflows." },
  { icon: "📈", title: "Convert leads into loyal customers faster." },
  { icon: "🌍", title: "Manage customer interactions across all channels." },
]

const STATS = [
  { number: "350%", label: "Increase in lead conversion." },
  { number: "45%", label: "Average revenue growth." },
  { number: "60%", label: "Improvement in customer retention." },
  { number: "50%", label: "Reduction in sales cycles." },
  { number: "35%", label: "Cost savings vs competitors." },
]

const FEATURES = [
  { icon: Target, title: "Smart Lead Management", desc: "Capture, nurture, and convert quality leads into customers. Get complete visibility into every customer interaction in one centralized dashboard." },
  { icon: Zap, title: "Intelligent Automation", desc: "Automate repetitive tasks and workflows so your team focuses on closing deals and building relationships instead of administrative work." },
  { icon: Globe, title: "Omnichannel Engagement", desc: "Connect with customers across email, phone, chat, and social media. Deliver consistent, personalized experiences at every touchpoint." },
  { icon: BarChart3, title: "Advanced Analytics", desc: "Get real-time insights and predictive analytics to make data-driven decisions and identify growth opportunities." },
  { icon: Headphones, title: "24/7 World-Class Support", desc: "Our dedicated support team is available round-the-clock to help you succeed. Get expert guidance whenever you need it." },
  { icon: Plug, title: "Seamless Integration", desc: "Connect Anocab with 500+ business tools and applications. Create a unified tech stack that works for your business." },
]

export default function AnocabLanding() {
  const handleNavigation = (path) => window.location.href = path
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section')
    pricingSection?.scrollIntoView({ behavior: 'smooth' })
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
          <button className="rounded-full bg-transparent border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors" onClick={scrollToPricing}>
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
          <div className="flex justify-center items-center flex-wrap gap-6">
            {TRUSTED_BRANDS.map((brand) => (
              <div key={brand.name} className="flex items-center justify-center">
                <img
                  src={brand.logo}
                  alt={`${brand.name} Logo`}
                  width={80}
                  height={80}
                  loading="lazy"
                  className="object-contain rounded-full w-16 h-16"
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
            <div className="space-y-6">
              {CRM_FEATURES.map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-yellow-300 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <p className="text-white font-semibold text-lg">{item.title}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat, i) => (
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
            {FEATURES.map((feature, i) => {
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

      {/* Pricing Plans */}
      <section id="pricing-section" className="bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 px-8 py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Choose Your Plan</h2>
            <p className="text-gray-700 text-lg">Select the perfect plan for your business needs</p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Standard Plan */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 shadow-lg border-2 border-blue-300 transform hover:scale-105 transition-transform">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Standard</h3>
                  <p className="text-gray-700 text-sm">Perfect for small businesses</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-blue-700">
                    $12
                    <span className="text-lg text-gray-600">/user/month</span>
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Up to 100 contacts</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Basic lead management</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Email support</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Mobile app access</span>
                  </li>
                </ul>
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                  onClick={() => handleNavigation('/login')}
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-200 rounded-2xl p-8 shadow-xl border-2 border-purple-400 transform hover:scale-105 transition-transform relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-1 rounded-full text-sm font-bold">
                Most Popular
              </div>
              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                  <p className="text-gray-700 text-sm">Ideal for growing teams</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-purple-700">
                    $29
                    <span className="text-lg text-gray-600">/user/month</span>
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Unlimited contacts</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Advanced lead management</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Advanced analytics & reports</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Workflow automation</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>API access</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Custom integrations</span>
                  </li>
                </ul>
                <button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all"
                  onClick={() => handleNavigation('/login')}
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Customization Plan */}
            <div className="bg-gradient-to-br from-orange-100 to-yellow-200 rounded-2xl p-8 shadow-lg border-2 border-orange-300 transform hover:scale-105 transition-transform">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Customization</h3>
                  <p className="text-gray-700 text-sm">Tailored for enterprises</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-orange-700">
                    Custom
                    <span className="text-lg text-gray-600 block mt-1">Pricing</span>
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Everything in Premium</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Custom features development</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>White-label options</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>On-premise deployment</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>24/7 dedicated support</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Training & onboarding</span>
                  </li>
                </ul>
                <button 
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 rounded-lg transition-all"
                  onClick={() => handleNavigation('/support')}
                >
                  Contact Sales
                </button>
              </div>
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

      {/* Ashvay Chat Component */}
      <AshvayChat />
    </div>
  )
}
