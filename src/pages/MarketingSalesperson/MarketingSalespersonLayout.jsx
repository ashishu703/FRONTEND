import React, { useState } from 'react';
import MarketingSalespersonSidebar from './MarketingSalespersonSidebar';
import MarketingSalespersonDashboard from './MarketingSalespersonDashboard';
import FixedHeader from '../../Header';
import { MarketingSharedDataProvider } from './MarketingSharedDataContext';
import { MarketingFollowUpDataProvider } from './FollowUp/MarketingFollowUpDataContext';
import MobileMarketingSalespersonLayout from '../MARKETING SALESPERSON MOBILE VIEW/MobileMarketingSalespersonLayout';

const MarketingSalespersonLayout = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileView, setIsMobileView] = useState(false);
  
  console.log('MarketingSalespersonLayout - activeView:', activeView);

  const handleMobileToggle = () => {
    setIsMobileView(!isMobileView);
  };

  if (isMobileView) {
    return <MobileMarketingSalespersonLayout />;
  }

  return (
    <MarketingSharedDataProvider>
      <MarketingFollowUpDataProvider>
        <div className="flex h-screen bg-gray-100">
          <MarketingSalespersonSidebar 
            activeView={activeView} 
            setActiveView={setActiveView}
          />
          <div className="flex-1 overflow-hidden">
            <FixedHeader 
              userType="marketing-salesperson" 
              currentPage={activeView} 
              onMobileMenuClick={handleMobileToggle}
            />
            <MarketingSalespersonDashboard activeView={activeView} setActiveView={setActiveView} />
            
            {/* Floating Mobile Toggle Button */}
            <button
              onClick={handleMobileToggle}
              className="fixed bottom-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              title="Switch to Mobile View"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
            
            {/* Debug Info */}
            <div className="fixed top-4 left-4 z-50 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
              Mobile View: {isMobileView ? 'ON' : 'OFF'}
            </div>
          </div>
        </div>
      </MarketingFollowUpDataProvider>
    </MarketingSharedDataProvider>
  );
};

export default MarketingSalespersonLayout;
