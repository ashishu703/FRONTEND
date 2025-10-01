"use client"

import { LayoutDashboard, Users, LogOut, Menu, X, Package, Box, Wrench } from "lucide-react"
import FollowUpDropdown from './FollowUp/FollowUpDropdown'

function cx(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function Sidebar({ currentPage, onNavigate, onLogout, sidebarOpen, setSidebarOpen }) {

  return (
    <>
      {/* Sidebar */}
      <div
        className={cx(
          "fixed top-0 left-0 h-screen z-40 bg-white shadow-lg border-r border-gray-200 transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-16",
        )}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center space-x-3">
                <img
                  src="https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png"
                  alt="ANOCAB Logo"
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <h1 className="font-bold text-gray-800 text-lg">ANOCAB</h1>
                  <p className="text-xs text-gray-500">Salesperson</p>
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
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            <li>
              <button
                className={cx(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
                  currentPage === "dashboard" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700",
                )}
                onClick={() => onNavigate("dashboard")}
              >
                <span className="flex items-center space-x-3">
                  <LayoutDashboard className={cx("h-5 w-5", currentPage === "dashboard" ? "text-blue-600" : "text-gray-500")} />
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
            <li>
              <button
                className={cx(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
                  currentPage === "products" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700",
                )}
                onClick={() => onNavigate("products")}
              >
                <span className="flex items-center space-x-3">
                  <Box className={cx("h-5 w-5", currentPage === "products" ? "text-blue-600" : "text-gray-500")} />
                  {sidebarOpen && <span className="text-sm font-medium">Toolbar</span>}
                </span>
              </button>
            </li>
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
            <FollowUpDropdown 
              currentPage={currentPage} 
              onNavigate={onNavigate} 
              sidebarOpen={sidebarOpen} 
            />
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 mt-auto">
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
