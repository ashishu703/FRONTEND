import { useState } from "react"

const initialTickets = [
  {
    id: "TKT-001234",
    status: "in-progress",
    subject: "Login issues on mobile app",
    department: "Technical Support",
    date: "2024-01-15",
    priority: "High",
  },
  {
    id: "TKT-001235",
    status: "resolved",
    subject: "Billing inquiry",
    department: "Billing",
    date: "2024-01-10",
    priority: "Medium",
  },
]

export default function SupportPage() {
  const ANOCAB_LOGO =
    "https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png"
  const [activeTab, setActiveTab] = useState("report")
  const [tickets, setTickets] = useState(initialTickets)

  const handleNavigation = (path) => {
    window.location.href = path
  }

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    priority: "",
    subject: "",
    description: "",
    screenshot: null,
  })

  const [ticketNumber, setTicketNumber] = useState("")

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
  }

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFormData((prev) => ({ ...prev, screenshot: event.target.files[0] }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const newTicketId = `TKT-${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`
    setTicketNumber(newTicketId)

    const newTicket = {
      id: newTicketId,
      status: "open",
      subject: formData.subject,
      department: formData.department,
      date: new Date().toISOString().split("T")[0],
      priority: formData.priority,
    }

    setTickets((prev) => [newTicket, ...prev])

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      priority: "",
      subject: "",
      description: "",
      screenshot: null,
    })

    // Show success message
    setTimeout(() => setTicketNumber(""), 5000)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNavigation('/')}
        >
          <img
            src={ANOCAB_LOGO}
            alt="Anocab Logo"
            width={120}
            height={48}
            className="object-contain"
          />
          <span className="text-2xl font-bold text-gray-900">Anocab</span>
        </div>
        <button 
          className="rounded-full bg-transparent border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors"
          onClick={() => handleNavigation('/')}
        >
          Back to Home
        </button>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">Support & Ticket System</h1>
          <p className="text-blue-100 text-lg">Report issues, track tickets, and get help from our support team</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("report")}
              className={`px-6 py-3 font-semibold border-b-2 transition-all ${
                activeTab === "report"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              Report Issue
            </button>
            <button
              onClick={() => setActiveTab("status")}
              className={`px-6 py-3 font-semibold border-b-2 transition-all ${
                activeTab === "status"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              Track Tickets
            </button>
          </div>

          {/* Report Issue Tab */}
          {activeTab === "report" && (
            <div className="grid grid-cols-3 gap-8">
              {/* Form */}
              <div className="col-span-2">
                <div className="p-8 shadow-lg bg-white rounded-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Report a New Issue</h2>

                  {ticketNumber && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-semibold">
                        Ticket created successfully! Your ticket number: <span className="text-lg">{ticketNumber}</span>
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@company.com"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Department and Priority */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Department</label>
                        <select
                          value={formData.department}
                          onChange={(e) => handleSelectChange("department", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Department</option>
                          <option value="technical">Technical Support</option>
                          <option value="billing">Billing & Payments</option>
                          <option value="sales">Sales Inquiry</option>
                          <option value="feature">Feature Request</option>
                          <option value="account">Account & Access</option>
                          <option value="integration">Integration Help</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Priority</label>
                        <select
                          value={formData.priority}
                          onChange={(e) => handleSelectChange("priority", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Priority</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief description of the issue"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Detailed Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Please provide detailed information about the issue you're experiencing..."
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Attach Screenshot or File
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-all">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*,.pdf,.doc,.docx"
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <p className="text-gray-600">
                            {formData.screenshot ? (
                              <>
                                <span className="text-green-600 font-semibold">{formData.screenshot.name}</span>
                                <br />
                                (Click to change)
                              </>
                            ) : (
                              <>
                                Drag and drop your files or{" "}
                                <span className="text-blue-600 font-semibold">click to upload</span>
                              </>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF, DOC up to 5MB</p>
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
                    >
                      Submit Support Ticket
                    </button>
                  </form>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="col-span-1 space-y-6">
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Help</h3>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Provide as much detail as possible to help us resolve faster</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Screenshots help us understand the issue better</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Critical issues get priority response within 1 hour</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>You'll receive updates via email</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Support Hours</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Technical:</span> 24/7
                    </p>
                    <p>
                      <span className="font-semibold">Sales:</span> 9am - 6pm EST
                    </p>
                    <p>
                      <span className="font-semibold">Billing:</span> 9am - 5pm EST
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Track Tickets Tab */}
          {activeTab === "status" && (
            <div>
              <div className="p-8 shadow-lg bg-white rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Support Tickets</h2>

                {tickets.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No support tickets found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr className="border-b border-gray-300">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Ticket ID</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Subject</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Department</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Priority</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.map((ticket) => (
                          <tr key={ticket.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
                                {ticket.id}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-900">{ticket.subject}</td>
                            <td className="py-4 px-4 text-gray-600">{ticket.department}</td>
                            <td className="py-4 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}
                              >
                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  ticket.priority === "Critical"
                                    ? "bg-red-100 text-red-800"
                                    : ticket.priority === "High"
                                      ? "bg-orange-100 text-orange-800"
                                      : ticket.priority === "Medium"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-green-100 text-green-800"
                                }`}
                              >
                                {ticket.priority}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-600">{ticket.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
