import React from 'react';
import FollowUpBase from './FollowUpBase';
import { useFollowUpData } from './FollowUpDataContext';

const PendingFollowUps = () => {
  const { getLeadsByStatus, loading } = useFollowUpData();
  
  // Get pending leads from the shared data context
  const pendingData = getLeadsByStatus('pending');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pending leads...</p>
        </div>
      </div>
    );
  }

  return <FollowUpBase status="pending" customData={pendingData} />;
};

export default PendingFollowUps;
