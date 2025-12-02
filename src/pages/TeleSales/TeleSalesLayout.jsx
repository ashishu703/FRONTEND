import React, { useState } from 'react';
import TeleSalesSidebar from './TeleSalesSidebar';
import TeleSalesDashboard from './TeleSalesDashboard';
import FixedHeader from '../../Header';
import AshvayChat from '../../components/AshvayChat';

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
      <AshvayChat />
    </div>
  );
};

export default TeleSalesLayout;
