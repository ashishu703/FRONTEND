import React, { useState, useEffect } from 'react'
import Sidebar from './salespersonsidebar.jsx'
import DashboardContent from './salespersondashboard.jsx'
import CustomerListContent from './salespersonleads.jsx'
import StockManagement from './salespersonstock.jsx'
import ProductsPage from './salespersonproducts.jsx'
import LeadStatusPage from './LeadStatus.jsx'
import ScheduledCallPage from './ScheduledCall.jsx'
import LastCallPage from './LastCall.jsx'
import DuePaymentPage from './DuePayment.jsx'
import AdvancePaymentPage from './AdvancePayment.jsx'
import ToolboxInterface from './ToolboxInterface.jsx'
import NotificationsPage from './Notifications.jsx'
import MobileLayout from './MOBILE view/MobileLayout.jsx'
import FixedHeader from '../../Header.jsx'

import { SharedDataProvider } from './SharedDataContext';

export default function SalespersonLayout({ onLogout }) {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobileView, setIsMobileView] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  const handleNavigation = (page) => {
    setCurrentPage(page);
    // Update the URL without a page reload
    window.history.pushState({}, '', `/${page}`);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // If mobile view is active, render mobile layout
  if (isMobileView) {
    return <MobileLayout onLogout={onLogout} onToggleDesktopView={() => setIsMobileView(false)} />
  }

  return (
    <SharedDataProvider>
      <div className={`min-h-screen relative transition-colors ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <Sidebar 
          currentPage={currentPage} 
          onNavigate={handleNavigation} 
          onLogout={onLogout} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          isDarkMode={isDarkMode}
        />
        <div className={sidebarOpen ? "flex-1 ml-64 transition-all duration-300" : "flex-1 ml-16 transition-all duration-300"}>
          <FixedHeader 
            userType="salesperson" 
            currentPage={currentPage} 
            onToggleMobileView={() => setIsMobileView(!isMobileView)}
            isMobileView={isMobileView}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
          <div className={`flex-1 transition-colors ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            {currentPage === 'dashboard' && <DashboardContent isDarkMode={isDarkMode} />}
            {currentPage === 'customers' && <CustomerListContent isDarkMode={isDarkMode} />}
            {currentPage === 'stock' && <StockManagement isDarkMode={isDarkMode} />}
            {currentPage === 'products' && <ProductsPage isDarkMode={isDarkMode} />}
            {currentPage === 'lead-status' && <LeadStatusPage isDarkMode={isDarkMode} />}
            {currentPage === 'scheduled-call' && <ScheduledCallPage isDarkMode={isDarkMode} />}
            {currentPage === 'last-call' && <LastCallPage isDarkMode={isDarkMode} />}
            {currentPage === 'due-payment' && <DuePaymentPage isDarkMode={isDarkMode} />}
            {currentPage === 'advance-payment' && <AdvancePaymentPage isDarkMode={isDarkMode} />}
            {currentPage === 'toolbox' && <ToolboxInterface isDarkMode={isDarkMode} />}
            {currentPage === 'notifications' && <NotificationsPage isDarkMode={isDarkMode} />}
          </div>
        </div>
      </div>
    </SharedDataProvider>
  )
}


