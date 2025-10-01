import React, { useState } from 'react';
import TeleSalesSidebar from './TeleSalesSidebar';
import TeleSalesDashboard from './TeleSalesDashboard';
import FixedHeader from '../../Header';

const TeleSalesLayout = () => {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-100">
      <TeleSalesSidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
      />
      <div className="flex-1 overflow-hidden">
        <FixedHeader userType="tele-sales" currentPage={activeView} />
        <TeleSalesDashboard activeView={activeView} />
      </div>
    </div>
  );
};

export default TeleSalesLayout;
