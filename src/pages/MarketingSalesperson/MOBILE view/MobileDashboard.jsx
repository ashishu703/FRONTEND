import React from 'react';
import MarketingSalespersonDashboard from '../MarketingSalespersonDashboard.jsx';

export default function MobileDashboard() {
  return (
    <div className="p-4">
      <MarketingSalespersonDashboard activeView="dashboard" setActiveView={() => {}} />
    </div>
  );
}


