import React from 'react';
import MarketingFollowUpBase from './MarketingFollowUpBase';
import { useMarketingFollowUpData } from './MarketingFollowUpDataContext';

const MarketingClosedFollowUps = () => {
  const { getLeadsByStatus, loading } = useMarketingFollowUpData();
  
  // Get closed leads from the shared data context
  const closedData = getLeadsByStatus('closed');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading marketing closed leads...</p>
        </div>
      </div>
    );
  }

  return <MarketingFollowUpBase status="closed" customData={closedData} />;
};

export default MarketingClosedFollowUps;
