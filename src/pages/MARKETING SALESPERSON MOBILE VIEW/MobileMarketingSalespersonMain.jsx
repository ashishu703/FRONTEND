import React, { useState } from 'react';
import MarketingSalespersonLayout from '../MarketingSalesperson/MarketingSalespersonLayout';
import MobileMarketingSalespersonLayout from './MobileMarketingSalespersonLayout';

const MobileMarketingSalespersonMain = () => {
  const [isMobileView, setIsMobileView] = useState(false);

  const handleMobileToggle = () => {
    setIsMobileView(!isMobileView);
  };

  if (isMobileView) {
    return <MobileMarketingSalespersonLayout />;
  }

  return (
    <div className="relative">
      <MarketingSalespersonLayout />
      
      {/* Mobile Toggle Button - Desktop Only */}
      <button
        onClick={handleMobileToggle}
        className="fixed bottom-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors lg:hidden"
        title="Switch to Mobile View"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  );
};

export default MobileMarketingSalespersonMain;
