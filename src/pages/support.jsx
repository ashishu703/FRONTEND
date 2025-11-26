import { useState } from "react"
import { Clock, CheckCircle, Circle } from "lucide-react"
import AshvayChat from "../components/AshvayChat"

const ANOCAB_LOGO = "https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png"
const DEPARTMENTS = ["IT Department", "Accounts Department", "Sales", "Marketing Sales", "Production", "Gate Entry", "Transportation Department"]
const PRIORITIES = ["low", "medium", "high", "critical"]
const INITIAL_FORM_DATA = { name: "", email: "", phone: "", department: "", priority: "", subject: "", description: "", screenshot: null }

const STATUS_CONFIG = {
  pending: { color: "bg-orange-100 text-orange-800", icon: Circle, iconColor: "text-orange-600" },
  inprogress: { color: "bg-blue-100 text-blue-800", icon: Clock, iconColor: "text-blue-600" },
  resolved: { color: "bg-green-100 text-green-800", icon: CheckCircle, iconColor: "text-green-600" }
}

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("report")
  const [tickets, setTickets] = useState([])
  const [trackTicketId, setTrackTicketId] = useState("")
  const [trackedTicket, setTrackedTicket] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [ticketNumber, setTicketNumber] = useState("")

  const handleNavigation = (path) => window.location.href = path

  const updateFormData = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))
  
  const handleInputChange = (e) => updateFormData(e.target.name, e.target.value)
  
  const handleSelectChange = (field, value) => updateFormData(field, value)
  
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) updateFormData("screenshot", e.target.files[0])
  }

  const generateTicketId = () => `TKT-${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`

  const handleSubmit = (e) => {
    e.preventDefault()
    const newTicketId = generateTicketId()
    setTicketNumber(newTicketId)

    const newTicket = {
      id: newTicketId,
      status: "pending",
      ...formData,
      date: new Date().toISOString().split("T")[0],
      statusHistory: [{
        status: "pending",
        timestamp: new Date().toISOString(),
        message: "Ticket created and submitted"
      }]
    }

    setTickets(prev => [newTicket, ...prev])
    setFormData(INITIAL_FORM_DATA)
    setTimeout(() => setTicketNumber(""), 5000)
  }

  const handleTrackTicket = () => {
    if (!trackTicketId.trim()) return
    const ticket = tickets.find(t => t.id.toUpperCase() === trackTicketId.toUpperCase().trim())
    setTrackedTicket(ticket || null)
  }

  const getStatusConfig = (status) => STATUS_CONFIG[status] || { color: "bg-gray-100 text-gray-800", icon: Circle, iconColor: "text-gray-600" }
  
  const getStatusColor = (status) => getStatusConfig(status).color
  
  const getStatusIcon = (status) => {
    const { icon: Icon, iconColor } = getStatusConfig(status)
    return <Icon className={`w-5 h-5 ${iconColor}`} />
  }


  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
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
        </div>
        <button 
          className="rounded-full bg-transparent border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors"
          onClick={() => handleNavigation('/')}
        >
          Back to Home
        </button>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-100 to-cyan-100 px-8 py-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Support & Ticket System</h1>
          <p className="text-gray-600">Report issues, track tickets, and get help from our support team</p>
        </div>
      </section>

      {/* Ashvay Chat Component */}
      <AshvayChat />

      {/* Main Content */}
      <section className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b-2 border-purple-200">
            <button
              onClick={() => setActiveTab("report")}
              className={`px-6 py-3 font-semibold border-b-2 transition-all ${
                activeTab === "report"
                  ? "text-purple-600 border-purple-600"
                  : "text-gray-600 border-transparent hover:text-purple-500"
              }`}
            >
              Report Issue
            </button>
            <button
              onClick={() => setActiveTab("status")}
              className={`px-6 py-3 font-semibold border-b-2 transition-all ${
                activeTab === "status"
                  ? "text-purple-600 border-purple-600"
                  : "text-gray-600 border-transparent hover:text-purple-500"
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
                <div className="p-8 shadow-xl bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-blue-200">
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select Department</option>
                          {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
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
                          {PRIORITIES.map(priority => <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>)}
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
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg"
                    >
                      Submit Support Ticket
                    </button>
                  </form>
                </div>
              </div>

              {/* Sidebar Info - Merged */}
              <div className="col-span-1">
                <div className="p-6 bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-300 rounded-xl shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Help & Support</h3>
                  
                  {/* Quick Help Section */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Tips:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
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

                  {/* Support Hours Section */}
                  <div className="border-t-2 border-blue-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Support Hours:</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <span className="font-semibold">AI Support (Ashvay):</span> 24/7
                      </p>
                      <p>
                        <span className="font-semibold">Human Support:</span> Mon-Sat (6 days)
                      </p>
                      <p>
                        <span className="font-semibold">All Departments:</span> Mon-Sat (6 days)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Track Tickets Tab */}
          {activeTab === "status" && (
            <div className="space-y-6">
              {/* Ticket Search */}
              <div className="p-6 bg-white rounded-2xl shadow-lg border border-purple-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Track Your Ticket</h2>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Enter Ticket ID (e.g., TKT-123456)"
                    value={trackTicketId}
                    onChange={(e) => setTrackTicketId(e.target.value)}
                    className="flex-1 px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleTrackTicket}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-lg transition-all"
                  >
                    Track
                  </button>
                </div>
              </div>

              {/* Timeline View */}
              {trackedTicket ? (
                <div className="p-8 bg-white rounded-2xl shadow-lg border border-blue-200">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Ticket Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Ticket ID:</span>
                        <span className="ml-2 text-purple-600 font-bold">{trackedTicket.id}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Subject:</span>
                        <span className="ml-2">{trackedTicket.subject}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Department:</span>
                        <span className="ml-2">{trackedTicket.department}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Priority:</span>
                        <span className="ml-2">{trackedTicket.priority}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t-2 border-purple-200 pt-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-6">Status Timeline</h4>
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-400 via-blue-400 to-green-400"></div>
                      
                      {/* Timeline Items */}
                      <div className="space-y-8">
                        {trackedTicket.statusHistory && trackedTicket.statusHistory.length > 0 ? (
                          trackedTicket.statusHistory.map((historyItem, index) => (
                            <div key={index} className="relative flex items-start gap-4">
                              <div className="relative z-10 flex-shrink-0">
                                {getStatusIcon(historyItem.status)}
                              </div>
                              <div className="flex-1 bg-white rounded-lg p-4 shadow-md border-2 border-purple-100">
                                <div className="flex items-center justify-between mb-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(historyItem.status)}`}>
                                    {historyItem.status.charAt(0).toUpperCase() + historyItem.status.slice(1)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(historyItem.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-gray-700">{historyItem.message}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="relative flex items-start gap-4">
                            <div className="relative z-10 flex-shrink-0">
                              {getStatusIcon(trackedTicket.status)}
                            </div>
                            <div className="flex-1 bg-white rounded-lg p-4 shadow-md border-2 border-purple-100">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(trackedTicket.status)}`}>
                                  {trackedTicket.status.charAt(0).toUpperCase() + trackedTicket.status.slice(1)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {trackedTicket.date}
                                </span>
                              </div>
                              <p className="text-gray-700">Ticket created and submitted</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : trackTicketId ? (
                <div className="p-8 bg-white rounded-2xl shadow-lg border border-red-200 text-center">
                  <p className="text-red-600 font-semibold text-lg">Ticket not found. Please check your Ticket ID.</p>
                </div>
              ) : (
                <div className="p-8 bg-white rounded-2xl shadow-lg border border-blue-200 text-center">
                  <p className="text-gray-600 font-semibold text-lg">Enter a Ticket ID to track its status</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
