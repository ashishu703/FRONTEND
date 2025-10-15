import React from 'react';
import MarketingFollowUpBase from '../FollowUp/MarketingFollowUpBase.jsx';
import { MarketingFollowUpDataProvider, useMarketingFollowUpData } from '../FollowUp/MarketingFollowUpDataContext.jsx';

function Inner({ status }) {
  const { getLeadsByStatus } = useMarketingFollowUpData();
  const mapped = (id) => {
    switch (id) {
      case 'followup-connected': return 'connected';
      case 'followup-not-connected': return 'not-connected';
      case "followup-next-meeting": return 'next-meeting';
      case 'followup-converted': return 'converted';
      case 'followup-closed': return 'closed';
      default: return 'all';
    }
  };
  const s = mapped(status);
  return <MarketingFollowUpBase status={s} customData={getLeadsByStatus(s)} />;
}

export default function MobileFollowUps({ status = 'followup-connected' }) {
  return (
    <div className="p-4">
      <MarketingFollowUpDataProvider>
        <Inner status={status} />
      </MarketingFollowUpDataProvider>
    </div>
  );
}


