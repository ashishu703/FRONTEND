import React from 'react';
import MarketingHeadDashboard from './marketingHeadDashboard';
import MarketingLeads from './MarketingLeads';
import MarketingUserPerformance from './UserPerformance';
import PaymentInfo from './PaymentInfo';
import MarketingDepartmentUser from './MarketingDepartmentUser';
import TodayVisit from './TodayVisit';
import StockUpdate from './StockUpdate';
import MeetingAssignment from './MeetingAssignment';
import CheckInDashboard from './CheckInDashboard';
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
    console.log('MarketingDepartmentHeadDashboard - activeView:', activeView);
    switch (activeView) {
      case 'marketing-dashboard':
        return <MarketingHeadDashboard setActiveView={setActiveView} />;
      case 'today-visit':
        return <TodayVisit />;
      case 'marketing-leads':
        return <MarketingLeads />;
      case 'user-performance':
        console.log('MarketingDepartmentHeadDashboard: Rendering MarketingUserPerformance component');
        return <MarketingUserPerformance />;
      case 'payment-info':
        return <PaymentInfo />;
      case 'marketing-department-users':
        return <MarketingDepartmentUser />;
      case 'stock-update':
        return <StockUpdate />;
      case 'meeting-assignment':
        return <MeetingAssignment />;
      case 'checkin-dashboard':
        return <CheckInDashboard />;
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
      {renderContent()}
    </div>
  );
};

export default MarketingDepartmentHeadDashboard;
