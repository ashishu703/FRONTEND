import React from 'react';
import FixedHeader from '../../Header';
import MarketingDepartmentHeadSidebar from './MarketingDepartmentHeadSidebar';

const MarketingDepartmentHeadLayout = ({ children, onLogout, activeView, setActiveView }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <MarketingDepartmentHeadSidebar onLogout={onLogout} activeView={activeView} setActiveView={setActiveView} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <FixedHeader userType="marketingdepartmenthead" currentPage={activeView} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MarketingDepartmentHeadLayout;
