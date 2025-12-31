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
        <div
          className={cx(
            "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200",
            isLeadStatusActive
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
              : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
          )}
          onClick={() => {
            if (isOpen) {
              setIsOpen(false)
            } else {
              setIsOpen(true)
              onNavigate("lead-status")
            }
          }}
          style={{
            transform: isLeadStatusActive ? 'translateX(4px)' : 'none',
          }}
        >
          <div className="flex items-center space-x-3">
            <div className={isLeadStatusActive ? 'text-white' : 'text-slate-400'}>
              <BarChart3 className="w-5 h-5" />
            </div>
            {sidebarOpen && (
              <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Lead Status</span>
            )}
          </div>
          {sidebarOpen && (
            <div className={isLeadStatusActive ? 'text-white' : 'text-slate-400'}>
              {isOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
        </div>

        {/* Dropdown Menu */}
        {isOpen && sidebarOpen && (
          <ul className="ml-8 mt-1 space-y-1">
            <li>
              <div
                className={cx(
                  "flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm",
                  currentPage === "lead-status"
                    ? 'bg-slate-700/70 text-white'
                    : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
                )}
                onClick={() => onNavigate("lead-status")}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>All Leads</span>
                </div>
              </div>
            </li>
            <li>
              <div
                className={cx(
                  "flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm",
                  currentPage === "scheduled-call"
                    ? 'bg-slate-700/70 text-white'
                    : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
                )}
                onClick={() => onNavigate("scheduled-call")}
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Scheduled Call</span>
                </div>
              </div>
            </li>
            <li>
              <div
                className={cx(
                  "flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm",
                  currentPage === "last-call"
                    ? 'bg-slate-700/70 text-white'
                    : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
                )}
                onClick={() => onNavigate("last-call")}
              >
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Last Call</span>
                </div>
              </div>
            </li>
          </ul>
        )}
      </div>
    </li>
  )
}
