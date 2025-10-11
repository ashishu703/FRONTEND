import React, { useState } from 'react';
import MobileMarketingSalespersonSidebar from './MobileMarketingSalespersonSidebar';
import MobileMarketingSalespersonDashboard from './MobileMarketingSalespersonDashboard';
import FixedHeader from '../../Header';
import { MarketingSharedDataProvider } from '../MarketingSalesperson/MarketingSharedDataContext';
import { MarketingFollowUpDataProvider } from '../MarketingSalesperson/FollowUp/MarketingFollowUpDataContext';

const MobileMarketingSalespersonLayout = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  console.log('MobileMarketingSalespersonLayout - activeView:', activeView);

  const handleBackToDesktop = () => {
    // This will be handled by the parent component
    window.location.reload(); // Simple way to reset to desktop view
  };

  return (
    <MarketingSharedDataProvider>
      <MarketingFollowUpDataProvider>
        <div className="flex h-screen bg-gray-100">
          {/* Mobile Sidebar - Hidden by default, slides in when open */}
          <div className={`fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative flex h-full">
              <MobileMarketingSalespersonSidebar 
                activeView={activeView} 
                setActiveView={setActiveView}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
            <FixedHeader 
              userType="marketing-salesperson" 
              currentPage={activeView}
              onMobileMenuClick={() => setSidebarOpen(true)}
              isMobile={true}
            />
            <MobileMarketingSalespersonDashboard 
              activeView={activeView} 
              setActiveView={setActiveView} 
            />
            
            {/* Back to Desktop Button */}
            <button
              onClick={handleBackToDesktop}
              className="fixed bottom-4 right-4 z-50 p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors"
              title="Back to Desktop View"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </MarketingFollowUpDataProvider>
    </MarketingSharedDataProvider>
  );
};

export default MobileMarketingSalespersonLayout;