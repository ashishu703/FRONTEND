"use client"

import React, { useState } from 'react'
import { BarChart3, ChevronDown, ChevronRight, Calendar, Clock } from 'lucide-react'

function cx(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function LeadStatusDropdown({ currentPage, onNavigate, sidebarOpen, isDarkMode = false }) {
  const [isOpen, setIsOpen] = useState(false)

  const isLeadStatusActive = currentPage === 'lead-status' || currentPage === 'scheduled-call' || currentPage === 'last-call'

  return (
    <li>
      <div>
        {/* Main Lead Status Button */}
        <button
          className={cx(
            "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
            isLeadStatusActive 
              ? (isDarkMode ? "bg-blue-900 text-blue-300" : "bg-blue-50 text-blue-700")
              : (isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-50 text-gray-700"),
          )}
          onClick={() => {
            if (isOpen) {
              setIsOpen(false)
            } else {
              setIsOpen(true)
              onNavigate("lead-status")
            }
          }}
        >
          <span className="flex items-center space-x-3">
            <BarChart3 className={cx("h-5 w-5", isLeadStatusActive ? (isDarkMode ? "text-blue-400" : "text-blue-600") : (isDarkMode ? "text-gray-400" : "text-gray-500"))} />
            {sidebarOpen && <span className="text-sm font-medium">Lead Status</span>}
          </span>
          {sidebarOpen && (
            <span className="flex items-center">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </span>
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && sidebarOpen && (
          <ul className="ml-6 mt-1 space-y-1">
            <li>
              <button
                className={cx(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm",
                  currentPage === "lead-status" 
                    ? (isDarkMode ? "bg-blue-800 text-blue-200" : "bg-blue-100 text-blue-800")
                    : (isDarkMode ? "hover:bg-gray-600 text-gray-300" : "hover:bg-gray-100 text-gray-700"),
                )}
                onClick={() => onNavigate("lead-status")}
              >
                <BarChart3 className="h-4 w-4" />
                <span>All Leads</span>
              </button>
            </li>
            <li>
              <button
                className={cx(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm",
                  currentPage === "scheduled-call" 
                    ? (isDarkMode ? "bg-blue-800 text-blue-200" : "bg-blue-100 text-blue-800")
                    : (isDarkMode ? "hover:bg-gray-600 text-gray-300" : "hover:bg-gray-100 text-gray-700"),
                )}
                onClick={() => onNavigate("scheduled-call")}
              >
                <Calendar className="h-4 w-4" />
                <span>Scheduled Call</span>
              </button>
            </li>
            <li>
              <button
                className={cx(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm",
                  currentPage === "last-call" 
                    ? (isDarkMode ? "bg-blue-800 text-blue-200" : "bg-blue-100 text-blue-800")
                    : (isDarkMode ? "hover:bg-gray-600 text-gray-300" : "hover:bg-gray-100 text-gray-700"),
                )}
                onClick={() => onNavigate("last-call")}
              >
                <Clock className="h-4 w-4" />
                <span>Last Call</span>
              </button>
            </li>
          </ul>
        )}
      </div>
    </li>
  )
}
