import React, { useState } from 'react';
import MarketingSalespersonSidebar from './MarketingSalespersonSidebar';
import MarketingSalespersonDashboard from './MarketingSalespersonDashboard';
import FixedHeader from '../../Header';
import { MarketingSharedDataProvider } from './MarketingSharedDataContext';
import { MarketingFollowUpDataProvider } from './FollowUp/MarketingFollowUpDataContext';

const MarketingSalespersonLayout = () => {
  const [activeView, setActiveView] = useState('dashboard');
  
  console.log('MarketingSalespersonLayout - activeView:', activeView);

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
      </MarketingFollowUpDataProvider>
    </MarketingSharedDataProvider>
  );
};

export default MarketingSalespersonLayout;
