import React, { useState, useEffect } from 'react';
import MarketingSalespersonSidebar from './MarketingSalespersonSidebar';
import MarketingSalespersonDashboard from './MarketingSalespersonDashboard';
import MobileMarketingSalespersonLayout from './MOBILE view/MobileMarketingSalespersonLayout';
import FixedHeader from '../../Header';
import { MarketingSharedDataProvider } from './MarketingSharedDataContext';
import { MarketingFollowUpDataProvider } from './FollowUp/MarketingFollowUpDataContext';
import AshvayChat from '../../components/AshvayChat';

const MarketingSalespersonLayout = ({ onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileView, setIsMobileView] = useState(false);
  
  console.log('MarketingSalespersonLayout - activeView:', activeView);

  // Auto-detect mobile view based on viewport width
  useEffect(() => {
    const updateIsMobile = () => setIsMobileView(window.innerWidth <= 768);
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  // Listen for navigation events from child components
  useEffect(() => {
    const handleNavigateToDashboard = () => {
      setActiveView('dashboard');
    };
    
    window.addEventListener('navigateToDashboard', handleNavigateToDashboard);
    // Also expose setActiveView globally for child components
    window.setActiveView = setActiveView;
    
    return () => {
      window.removeEventListener('navigateToDashboard', handleNavigateToDashboard);
      delete window.setActiveView;
    };
  }, []);

  // If mobile view is active, render mobile layout
  if (isMobileView) {
    return (
      <MarketingSharedDataProvider>
        <MarketingFollowUpDataProvider>
          <MobileMarketingSalespersonLayout 
            onLogout={onLogout || (() => {})} 
            onToggleDesktopView={() => setIsMobileView(false)} 
          />
        </MarketingFollowUpDataProvider>
      </MarketingSharedDataProvider>
    );
  }

  return (
    <MarketingSharedDataProvider>
      <MarketingFollowUpDataProvider>
        <div className="flex h-screen bg-gray-100">
          <MarketingSalespersonSidebar 
            activeView={activeView} 
            setActiveView={setActiveView}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <FixedHeader 
              userType="marketing-salesperson" 
              currentPage={activeView}
              onProfileClick={() => setActiveView('profile')}
            />
            <div className="flex-1 overflow-y-auto">
              <MarketingSalespersonDashboard activeView={activeView} setActiveView={setActiveView} />
            </div>
          </div>
        </div>
      <AshvayChat />
      </MarketingFollowUpDataProvider>
    </MarketingSharedDataProvider>
  );
};

export default MarketingSalespersonLayout;
