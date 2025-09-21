import React, { useState, useEffect } from 'react'
import Sidebar from './salespersonsidebar.jsx'
import DashboardContent from './salespersondashboard.jsx'
import CustomerListContent from './salespersonleads.jsx'
import StockManagement from './salespersonstock.jsx'
import ProductsPage from './salespersonproducts.jsx'
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
  
  // Set default follow-up page if a follow-up page is loaded directly
  useEffect(() => {
    const path = window.location.pathname.split('/').pop();
    if (path.startsWith('followup-') && followUpPages[path]) {
      setCurrentPage(path);
    } else if (path === 'followup') {
      setCurrentPage('followup-connected');
    }
  }, []);
  
  const handleNavigation = (page) => {
    setCurrentPage(page);
    // Update the URL without a page reload
    window.history.pushState({}, '', `/${page}`);
  };

  return (
    <SharedDataProvider>
      <div className="min-h-screen bg-gray-50 relative">
        <Sidebar 
          currentPage={currentPage} 
          onNavigate={handleNavigation} 
          onLogout={onLogout} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
        <div className={sidebarOpen ? "flex-1 ml-64 transition-all duration-300" : "flex-1 ml-16 transition-all duration-300"}>
          <FixedHeader userType="salesperson" currentPage={currentPage} />
          <div className="flex-1">
            {currentPage === 'dashboard' && <DashboardContent />}
            {currentPage === 'customers' && <CustomerListContent />}
            {currentPage === 'stock' && <StockManagement />}
            {currentPage === 'products' && <ProductsPage />}
            
            {/* Render the appropriate follow-up component */}
            {Object.entries(followUpPages).map(([key, Component]) => (
              currentPage === key && (
                <FollowUpDataProvider key={key}>
                  <Component />
                </FollowUpDataProvider>
              )
            ))}
          </div>
        </div>
      </div>
    </SharedDataProvider>
  )
}


