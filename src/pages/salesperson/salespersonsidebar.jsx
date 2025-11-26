"use client"

import { LayoutDashboard, Users, LogOut, Menu, X, Package, Box, Wrench, BarChart3, CreditCard, Bell, HelpCircle } from "lucide-react"
import LeadStatusDropdown from './LeadStatusDropdown'
import PaymentTrackingDropdown from './PaymentTrackingDropdown'

function cx(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function Sidebar({ currentPage, onNavigate, onLogout, sidebarOpen, setSidebarOpen, isDarkMode = false }) {

  return (
    <>
      {/* Sidebar */}
      <div
        className={cx(
          "fixed top-0 left-0 h-screen z-40 shadow-lg border-r transition-all duration-300 flex flex-col",
          isDarkMode 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200",
          sidebarOpen ? "w-64" : "w-16",
        )}
      >
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center space-x-3">
                <img
                  src="https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png"
                  alt="ANOCAB Logo"
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <h1 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>ANOCAB</h1>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Salesperson</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <img
                  src="https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png"
                  alt="ANOCAB Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-1 rounded transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              {sidebarOpen ? <X className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} /> : <Menu className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {/* Notifications item removed as requested */}
            <li>
              <button
                className={cx(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
                  currentPage === "dashboard" 
                    ? (isDarkMode ? "bg-blue-900 text-blue-300" : "bg-blue-50 text-blue-700")
                    : (isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-50 text-gray-700"),
                )}
                onClick={() => onNavigate("dashboard")}
              >
                <span className="flex items-center space-x-3">
                  <LayoutDashboard className={cx("h-5 w-5", currentPage === "dashboard" ? (isDarkMode ? "text-blue-400" : "text-blue-600") : (isDarkMode ? "text-gray-400" : "text-gray-500"))} />
                  {sidebarOpen && <span className="text-sm font-medium">Dashboard</span>}
                </span>
              </button>
            </li>
            <li>
              <button
                className={cx(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
                  currentPage === "customers" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700",
                )}
                onClick={() => onNavigate("customers")}
              >
                <span className="flex items-center space-x-3">
                  <Users className={cx("h-5 w-5", currentPage === "customers" ? "text-blue-600" : "text-gray-500")} />
                  {sidebarOpen && <span className="text-sm font-medium">Leads</span>}
                </span>
              </button>
            </li>
            <LeadStatusDropdown 
              currentPage={currentPage} 
              onNavigate={onNavigate} 
              sidebarOpen={sidebarOpen} 
              isDarkMode={isDarkMode}
            />
            <PaymentTrackingDropdown 
              currentPage={currentPage} 
              onNavigate={onNavigate} 
              sidebarOpen={sidebarOpen} 
              isDarkMode={isDarkMode}
            />
            <li>
              <button
                className={cx(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
                  currentPage === "toolbox" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700",
                )}
                onClick={() => onNavigate("toolbox")}
              >
                <span className="flex items-center space-x-3">
                  <Wrench className={cx("h-5 w-5", currentPage === "toolbox" ? "text-blue-600" : "text-gray-500")} />
                  {sidebarOpen && <span className="text-sm font-medium">Toolbox Interface</span>}
                </span>
              </button>
            </li>
            <li>
              <button
                className={cx(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
                  currentPage === "stock" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700",
                )}
                onClick={() => onNavigate("stock")}
              >
                <span className="flex items-center space-x-3">
                  <Package className={cx("h-5 w-5", currentPage === "stock" ? "text-blue-600" : "text-gray-500")} />
                  {sidebarOpen && <span className="text-sm font-medium">Available Stock</span>}
                </span>
              </button>
            </li>
          </ul>
        </nav>
        
        {/* Support */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            className={cx("w-full flex items-center justify-start gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50", !sidebarOpen && "px-2", isDarkMode && "hover:bg-gray-700 text-gray-300")}
            onClick={() => window.location.href = '/support'}
          >
            <HelpCircle className="h-5 w-5" />
            {sidebarOpen && <span className="text-sm font-medium">Support</span>}
          </button>
        </div>

        {/* Logout */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mt-auto`}>
          <button
            className={cx("w-full flex items-center justify-start gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50", !sidebarOpen && "px-2")}
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  )
}
