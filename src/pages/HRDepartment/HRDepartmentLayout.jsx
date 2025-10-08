import React, { useState } from 'react';
import HRDepartmentSidebar from './HRDepartmentSidebar';
import HRDepartmentDashboard from './HRDepartmentDashboard';
import FixedHeader from '../../Header';

const HRDepartmentLayout = ({ onLogout, activeView, setActiveView }) => {
  console.log('HRDepartmentLayout - activeView:', activeView);

  return (
    <div className="flex h-screen bg-gray-100">
      <HRDepartmentSidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
      />
      <div className="flex-1 overflow-hidden">
        <FixedHeader userType="hrdepartmenthead" currentPage={activeView} />
        <HRDepartmentDashboard activeView={activeView} setActiveView={setActiveView} />
      </div>
    </div>
  );
};

export default HRDepartmentLayout;
