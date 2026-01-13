import React, { useState } from 'react';
import FixedHeader from '../../Header';
import SalesDepartmentHeadSidebar from './SalesDepartmentHeadSidebar';
import AshvayChat from '../../components/AshvayChat';

const SalesDepartmentHeadLayout = ({ children, onLogout, activeView, setActiveView }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="min-h-screen relative transition-colors bg-gray-50">
      {/* Sidebar */}
      <SalesDepartmentHeadSidebar 
        onLogout={onLogout} 
        activeView={activeView} 
        setActiveView={setActiveView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      {/* Main Content Area */}
      <div className={sidebarOpen ? "flex-1 ml-64 transition-all duration-300" : "flex-1 ml-16 transition-all duration-300"}>
        {/* Header */}
        <FixedHeader userType="salesdepartmenthead" currentPage={activeView} />
        
        {/* Main Content */}
        <div className="flex-1 transition-colors bg-gray-50">
          {children}
        </div>
      </div>
      <AshvayChat showFloatingButton={false} />
    </div>
  );
};

export default SalesDepartmentHeadLayout;
