import React from 'react';
import SalesHeadDashboard from './salesHeadDashboard';
import Leads from './Leads';
import UserPerformance from './UserPerformance';
import PaymentInfo from './PaymentInfo';
import SalesDepartmentUser from './SalesDepartmentUser';
import MarketingLeads from './MarketingLeads';
import TodayVisit from './TodayVisit';
import StockUpdate from './StockUpdate';
import SalespersonDashboard from '../salesperson/salespersondashboard';
import MarketingSalespersonDashboard from '../SuperAdmin/MarketingSalespersonDashboard';
import TeleSalesDashboard from '../SuperAdmin/TeleSalesDashboard';
import OfficeSalesPersonDashboard from '../SuperAdmin/OfficeSalesPersonDashboard';

const SalesDepartmentHeadDashboard = ({ activeView, setActiveView }) => {

  const renderContent = () => {
    switch (activeView) {
      case 'sales-dashboard':
        return <SalesHeadDashboard setActiveView={setActiveView} />;
      case 'marketing-leads':
        return <MarketingLeads />;
      case 'today-visit':
        return <TodayVisit />;
      case 'leads':
        return <Leads />;
      case 'user-performance':
        return <UserPerformance />;
      case 'payment-info':
        return <PaymentInfo />;
      case 'sales-department-users':
        return <SalesDepartmentUser setActiveView={setActiveView} />;
      case 'stock-update':
        return <StockUpdate />;
      case 'salesperson-dashboard':
        return <SalespersonDashboard />;
      case 'marketing-salesperson':
        return <MarketingSalespersonDashboard />;
      case 'tele-sales-dashboard':
        return <TeleSalesDashboard />;
      case 'office-sales-person-dashboard':
        return <OfficeSalesPersonDashboard />;
      default:
        return <SalesHeadDashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="h-full">
      
      {renderContent() || <div className="p-4">No content to display</div>}
    </div>
  );
};

export default SalesDepartmentHeadDashboard;
