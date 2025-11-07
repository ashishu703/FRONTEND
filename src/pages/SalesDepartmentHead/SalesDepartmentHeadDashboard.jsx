import React from 'react';
import SalesHeadDashboard from './salesHeadDashboard';
import Leads from './Leads';
import UserPerformance from './UserPerformance';
import PaymentInfo from './PaymentInfo';
import SalesDepartmentUser from './SalesDepartmentUser';
import StockUpdate from './StockUpdate';

const SalesDepartmentHeadDashboard = ({ activeView, setActiveView }) => {
  // Set default view to sales-dashboard if not set
  React.useEffect(() => {
    if (!activeView || activeView === 'dashboard') {
      setActiveView('sales-dashboard');
    }
  }, [activeView, setActiveView]);

  const renderContent = () => {
    console.log('SalesDepartmentHeadDashboard - activeView:', activeView);
    switch (activeView) {
      case 'sales-dashboard':
        return <SalesHeadDashboard setActiveView={setActiveView} />;
      case 'leads':
        return <Leads />;
      case 'user-performance':
        console.log('SalesDepartmentHeadDashboard: Rendering UserPerformance component');
        return <UserPerformance />;
      case 'payment-info':
        return <PaymentInfo />;
      case 'sales-department-users':
        return <SalesDepartmentUser setActiveView={setActiveView} />;
      case 'stock-update':
        return <StockUpdate />;
      default:
        return <SalesHeadDashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="h-full">
      {renderContent()}
    </div>
  );
};

export default SalesDepartmentHeadDashboard;

