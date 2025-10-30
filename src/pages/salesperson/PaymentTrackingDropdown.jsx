"use client"

import React, { useState } from 'react'
import { CreditCard, ChevronDown, ChevronRight, DollarSign, Clock } from 'lucide-react'

function cx(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function PaymentTrackingDropdown({ currentPage, onNavigate, sidebarOpen, isDarkMode = false }) {
  const [isOpen, setIsOpen] = useState(false)

  const isPaymentTrackingActive = currentPage === 'products' || currentPage === 'due-payment' || currentPage === 'advance-payment'

  return (
    <li>
      <div>
        {/* Main Payment Tracking Button */}
        <button
          className={cx(
            "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
            isPaymentTrackingActive 
              ? (isDarkMode ? "bg-blue-900 text-blue-300" : "bg-blue-50 text-blue-700")
              : (isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-50 text-gray-700"),
          )}
          onClick={() => {
            if (isOpen) {
              setIsOpen(false)
            } else {
              setIsOpen(true)
              onNavigate("products")
            }
          }}
        >
          <span className="flex items-center space-x-3">
            <CreditCard className={cx("h-5 w-5", isPaymentTrackingActive ? (isDarkMode ? "text-blue-400" : "text-blue-600") : (isDarkMode ? "text-gray-400" : "text-gray-500"))} />
            {sidebarOpen && <span className="text-sm font-medium">Payment Tracking</span>}
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
                  currentPage === "products" 
                    ? (isDarkMode ? "bg-blue-800 text-blue-200" : "bg-blue-100 text-blue-800")
                    : (isDarkMode ? "hover:bg-gray-600 text-gray-300" : "hover:bg-gray-100 text-gray-700"),
                )}
                onClick={() => onNavigate("products")}
              >
                <CreditCard className="h-4 w-4" />
                <span>All Payments</span>
              </button>
            </li>
            <li>
              <button
                className={cx(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm",
                  currentPage === "due-payment" 
                    ? (isDarkMode ? "bg-blue-800 text-blue-200" : "bg-blue-100 text-blue-800")
                    : (isDarkMode ? "hover:bg-gray-600 text-gray-300" : "hover:bg-gray-100 text-gray-700"),
                )}
                onClick={() => onNavigate("due-payment")}
              >
                <Clock className="h-4 w-4" />
                <span>Due Payment</span>
              </button>
            </li>
            <li>
              <button
                className={cx(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm",
                  currentPage === "advance-payment" 
                    ? (isDarkMode ? "bg-blue-800 text-blue-200" : "bg-blue-100 text-blue-800")
                    : (isDarkMode ? "hover:bg-gray-600 text-gray-300" : "hover:bg-gray-100 text-gray-700"),
                )}
                onClick={() => onNavigate("advance-payment")}
              >
                <DollarSign className="h-4 w-4" />
                <span>Advance Payment</span>
              </button>
            </li>
          </ul>
        )}
      </div>
    </li>
  )
}
