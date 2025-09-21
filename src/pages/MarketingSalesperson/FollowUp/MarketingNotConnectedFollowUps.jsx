import React from 'react';
import MarketingFollowUpBase from './MarketingFollowUpBase';
import { useMarketingFollowUpData } from './MarketingFollowUpDataContext';

const MarketingNotConnectedFollowUps = () => {
  const { getLeadsByStatus, loading } = useMarketingFollowUpData();
  
  // Get not-connected leads from the shared data context
  const notConnectedData = getLeadsByStatus('not-connected');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading marketing not connected leads...</p>
        </div>
      </div>
    );
  }

  return <MarketingFollowUpBase status="not-connected" customData={notConnectedData} />;
};

export default MarketingNotConnectedFollowUps;
