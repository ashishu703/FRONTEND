import React, { useState } from 'react';
import MarketingSalespersonSidebar from './MarketingSalespersonSidebar';
import MarketingSalespersonDashboard from './MarketingSalespersonDashboard';
import FixedHeader from '../../Header';
import { MarketingSharedDataProvider } from './MarketingSharedDataContext';
import { MarketingFollowUpDataProvider } from './FollowUp/MarketingFollowUpDataContext';

const MarketingSalespersonLayout = () => {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <MarketingSharedDataProvider>
      <MarketingFollowUpDataProvider>
        <div className="flex h-screen bg-gray-100">
          <MarketingSalespersonSidebar 
            activeView={activeView} 
            setActiveView={setActiveView}
          />
          <div className="flex-1 overflow-hidden">
            <FixedHeader userType="marketing-salesperson" currentPage={activeView} />
            <MarketingSalespersonDashboard activeView={activeView} />
          </div>
        </div>
      </MarketingFollowUpDataProvider>
    </MarketingSharedDataProvider>
  );
};

export default MarketingSalespersonLayout;
