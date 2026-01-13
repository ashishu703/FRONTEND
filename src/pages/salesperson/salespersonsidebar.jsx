"use client"

import { useState, useRef, useEffect } from "react"
import { LayoutDashboard, Users, LogOut, Menu, X, Package, Box, Wrench, BarChart3, CreditCard, Bell, HelpCircle } from "lucide-react"
import LeadStatusDropdown from './LeadStatusDropdown'
import PaymentTrackingDropdown from './PaymentTrackingDropdown'

function cx(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function Sidebar({ currentPage, onNavigate, onLogout, sidebarOpen, setSidebarOpen, isDarkMode = false }) {
  const collapseTimerRef = useRef(null);
  const isManuallyToggledRef = useRef(false);

  // Auto-collapse on mouse leave
  const handleMouseEnter = () => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
    if (!isManuallyToggledRef.current) {
      setSidebarOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isManuallyToggledRef.current) {
      collapseTimerRef.current = setTimeout(() => {
        setSidebarOpen(false);
      }, 2000); // Collapse after 2 seconds
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
      }
    };
  }, []);

  // Handle manual toggle
  const handleToggle = () => {
    isManuallyToggledRef.current = !sidebarOpen; // If expanding manually, set flag; if collapsing, clear flag
    setSidebarOpen(!sidebarOpen);
    // Clear any pending auto-collapse
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={cx(
          "fixed top-0 left-0 h-screen z-40 shadow-2xl border-r transition-all duration-300 flex flex-col",
          "bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-slate-700/50",
          sidebarOpen ? "w-64" : "w-16",
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 shadow-lg">
                  <img
                    src="https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png"
                    alt="ANOCAB Logo"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <div>
                  <h1 className="font-bold text-white text-lg tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>ANOCAB</h1>
                  <p className="text-xs text-slate-400">Salesperson</p>
                </div>
              </div>
            ) : null}
            <button
              onClick={handleToggle}
              className={`p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200 text-slate-300 hover:text-white ${!sidebarOpen ? 'mx-auto' : ''}`}
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-1.5">
            <li>
              <div
                className={cx(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200",
                  currentPage === "dashboard"
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
                )}
                onClick={() => onNavigate("dashboard")}
                style={{
                  transform: currentPage === "dashboard" ? 'translateX(4px)' : 'none',
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className={currentPage === "dashboard" ? 'text-white' : 'text-slate-400'}>
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                  {sidebarOpen && (
                    <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Dashboard</span>
                  )}
                </div>
              </div>
            </li>
            {/* Leads moved into LeadStatusDropdown - standalone entry removed intentionally */}
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
              <div
                className={cx(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200",
                  currentPage === "toolbox"
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
                )}
                onClick={() => onNavigate("toolbox")}
                style={{
                  transform: currentPage === "toolbox" ? 'translateX(4px)' : 'none',
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className={currentPage === "toolbox" ? 'text-white' : 'text-slate-400'}>
                    <Wrench className="w-5 h-5" />
                  </div>
                  {sidebarOpen && (
                    <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Toolbox Interface</span>
                  )}
                </div>
              </div>
            </li>
            <li>
              <div
                className={cx(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200",
                  currentPage === "stock"
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
                )}
                onClick={() => onNavigate("stock")}
                style={{
                  transform: currentPage === "stock" ? 'translateX(4px)' : 'none',
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className={currentPage === "stock" ? 'text-white' : 'text-slate-400'}>
                    <Package className="w-5 h-5" />
                  </div>
                  {sidebarOpen && (
                    <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Available Stock</span>
                  )}
                </div>
              </div>
            </li>
          </ul>
        </nav>
        
        {/* Support */}
        <div className="p-3 border-t border-slate-700/50 bg-slate-800/30">
          <button 
            onClick={() => window.location.href = '/support'}
            className="w-full flex items-center space-x-3 px-3 py-2.5 text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-xl transition-all duration-200"
          >
            <HelpCircle className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Support</span>}
          </button>
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-slate-700/50 bg-slate-800/30">
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Logout</span>}
          </button>
        </div>
      </div>
    </>
  )
}
