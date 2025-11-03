"use client"

import React from "react"
import { Package, Clock, Bell } from "lucide-react"

export default function StockManagement({ isDarkMode = false }) {
  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}>
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
            <Package className={`w-10 h-10 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
        </div>

        {/* Title */}
        <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Available Stock
        </h1>

        {/* Coming Soon Message */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-3">
            <Clock className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <span className={`text-lg font-semibold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
              Coming Soon
            </span>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            This feature is coming soon. Stay tuned for updates!
          </p>
        </div>

        {/* Notification */}
        <div className={`flex items-center justify-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <Bell className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            We'll notify you when this feature is available
          </span>
        </div>
      </div>
    </div>
  )
}