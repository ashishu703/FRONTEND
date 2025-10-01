import React, { useState } from 'react';
import SuperAdminSalesDashboard from './SuperAdmin/SuperAdminSalesDashboard';
import AllcustomerList from './SuperAdmin/AllcustomerList';
import SuperAdminDepartmentList from './SuperAdmin/SuperAdminDepartmentList';
import AllLeads from './SuperAdmin/AllLeads';
import Configuration from './SuperAdmin/Configuration';
import Performance from './SuperAdmin/Performance';
import MarketingLeads from './SalesDepartmentHead/MarketingLeads';
import TodayVisit from './SalesDepartmentHead/TodayVisit';
import MarketingSalespersonDashboard from './SuperAdmin/MarketingSalespersonDashboard';
import TeleSalesDashboard from './SuperAdmin/TeleSalesDashboard';
import OfficeSalesPersonDashboard from './SuperAdmin/OfficeSalesPersonDashboard';

const MainDashboard = ({ activeView, setActiveView }) => {
  const renderContent = () => {
    console.log('MainDashboard - activeView:', activeView);
    switch (activeView) {
      case 'dashboard':
        return <SuperAdminSalesDashboard setActiveView={setActiveView} />;
      case 'leads':
        return <MarketingLeads />;
      case 'marketing-leads':
        console.log('MainDashboard: Rendering MarketingLeads component');
        return <MarketingLeads />;
      case 'today-visit':
        console.log('MainDashboard: Rendering TodayVisit component');
        try {
          return <TodayVisit />;
        } catch (error) {
          console.error('Error rendering TodayVisit:', error);
          return <div className="p-6 bg-red-100 text-red-800">Error loading Today Visit component: {error.message}</div>;
        }
      case 'customer-list':
        return <AllcustomerList />;
      case 'department':
        return <SuperAdminDepartmentList />;
      case 'all-leads':
        return <AllLeads />;
      case 'configuration':
        return <Configuration />;
      case 'performance':
        return <Performance />;
      case 'marketing-salesperson':
        return <MarketingSalespersonDashboard />;
      case 'tele-sales':
        return <TeleSalesDashboard />;
      case 'office-sales-person':
        return <OfficeSalesPersonDashboard />;
      default:
        return <SuperAdminSalesDashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="h-full">
      {renderContent()}
    </div>
  );
};

export default MainDashboard;
