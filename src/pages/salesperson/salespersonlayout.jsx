import React, { useState, useEffect } from 'react'
import Sidebar from './salespersonsidebar.jsx'
import DashboardContent from './salespersondashboard.jsx'
import CustomerListContent from './salespersonleads.jsx'
import StockManagement from './salespersonstock.jsx'
import ProductsPage from './salespersonproducts.jsx'
import ToolboxInterface from './ToolboxInterface.jsx'
import MobileLayout from './MOBILE view/MobileLayout.jsx'
import FixedHeader from '../../Header.jsx'

// Follow Up Components
import ConnectedFollowUps from './FollowUp/ConnectedFollowUps';
import NotConnectedFollowUps from './FollowUp/NotConnectedFollowUps';
import NextMeetingFollowUps from './FollowUp/NextMeetingFollowUps';
import ConvertedFollowUps from './FollowUp/ConvertedFollowUps';
import ClosedFollowUps from './FollowUp/ClosedFollowUps';
import { SharedDataProvider } from './SharedDataContext';
import { FollowUpDataProvider } from './FollowUp/FollowUpDataContext';

const followUpPages = {
  'followup-connected': ConnectedFollowUps,
  'followup-not-connected': NotConnectedFollowUps,
  'followup-next-meeting': NextMeetingFollowUps,
  'followup-converted': ConvertedFollowUps,
  'followup-closed': ClosedFollowUps,
};

export default function SalespersonLayout({ onLogout }) {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobileView, setIsMobileView] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  // Set default follow-up page if a follow-up page is loaded directly
  useEffect(() => {
    const path = window.location.pathname.split('/').pop();
    if (path.startsWith('followup-') && followUpPages[path]) {
      setCurrentPage(path);
    } else if (path === 'followup') {
      setCurrentPage('followup-connected');
    }
  }, []);

  // Auto-detect mobile view based on viewport width (no manual toggle)
  useEffect(() => {
    const updateIsMobile = () => setIsMobileView(window.innerWidth <= 768);
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);
  
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
            {currentPage === 'toolbox' && <ToolboxInterface isDarkMode={isDarkMode} />}
            
            {/* Render the appropriate follow-up component */}
            {Object.entries(followUpPages).map(([key, Component]) => (
              currentPage === key && (
                <FollowUpDataProvider key={key}>
                  <Component isDarkMode={isDarkMode} />
                </FollowUpDataProvider>
              )
            ))}
          </div>
        </div>
      </div>
    </SharedDataProvider>
  )
}


