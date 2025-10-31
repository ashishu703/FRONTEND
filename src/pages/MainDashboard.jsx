import React, { useState, useEffect } from 'react';
import { useCompany } from '../context/CompanyContext';
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
import HRDepartmentDashboard from './SuperAdmin/HRDepartmentDashboard';
import ProductionDepartmentDashboard from './SuperAdmin/ProductionDepartmentDashboard';

const MainDashboard = ({ activeView, setActiveView }) => {
  const { selectedCompany } = useCompany();

  // If any child widgets need to re-fetch on company change, key the tree by company
  useEffect(() => {
    // placeholder to trigger effects/data refetch in children via props/context if needed
  }, [selectedCompany]);
  const renderContent = () => {
    console.log('MainDashboard - activeView:', activeView);
    switch (activeView) {
      case 'dashboard':
        return <SuperAdminSalesDashboard setActiveView={setActiveView} />;
      case 'leads':
        return <AllLeads />;
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
      case 'hr-department':
        return <HRDepartmentDashboard />;
      case 'production-department':
        return <ProductionDepartmentDashboard />;
      default:
        return <SuperAdminSalesDashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="h-full">
      <div key={`${activeView}-${selectedCompany}`} className="animate-fade-up">
        {renderContent()}
      </div>
    </div>
  );
};

export default MainDashboard;
