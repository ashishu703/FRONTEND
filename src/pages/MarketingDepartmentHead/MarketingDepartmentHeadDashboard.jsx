import React from 'react';
import MarketingHeadDashboard from './marketingHeadDashboard';
import MarketingLeads from './MarketingLeads';
import UserPerformance from './UserPerformance';
import PaymentInfo from './PaymentInfo';
import MarketingDepartmentUser from './MarketingDepartmentUser';
import TodayVisit from './TodayVisit';
import StockUpdate from './StockUpdate';
import MarketingSalespersonDashboard from '../SuperAdmin/MarketingSalespersonDashboard';
import TeleSalesDashboard from '../SuperAdmin/TeleSalesDashboard';
import OfficeSalesPersonDashboard from '../SuperAdmin/OfficeSalesPersonDashboard';

const MarketingDepartmentHeadDashboard = ({ activeView, setActiveView }) => {
  // Set default view to marketing-dashboard if not set
  React.useEffect(() => {
    if (!activeView || activeView === 'dashboard') {
      setActiveView('marketing-dashboard');
    }
  }, [activeView, setActiveView]);

  const renderContent = () => {
    switch (activeView) {
      case 'marketing-dashboard':
        return <MarketingHeadDashboard setActiveView={setActiveView} />;
      case 'today-visit':
        return <TodayVisit />;
      case 'marketing-leads':
        return <MarketingLeads />;
      case 'user-performance':
        return <UserPerformance />;
      case 'payment-info':
        return <PaymentInfo />;
      case 'marketing-department-users':
        return <MarketingDepartmentUser />;
      case 'stock-update':
        return <StockUpdate />;
      case 'marketing-salesperson':
        return <MarketingSalespersonDashboard />;
      case 'tele-sales-dashboard':
        return <TeleSalesDashboard />;
      case 'office-sales-person-dashboard':
        return <OfficeSalesPersonDashboard />;
      default:
        return <MarketingHeadDashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="h-full">
      
      {renderContent() || <div className="p-4">No content to display</div>}
    </div>
  );
};

export default MarketingDepartmentHeadDashboard;
