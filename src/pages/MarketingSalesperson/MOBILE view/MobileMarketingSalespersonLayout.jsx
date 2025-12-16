import React, { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, Users, Wrench, LogOut, Bell, User, Calendar, Camera, ShoppingCart, IndianRupee, ChevronDown, ChevronRight } from 'lucide-react';
import MobileDashboard from './MobileDashboard';
import MobileLeads from './MobileLeads';
import MobileToolbox from './MobileToolbox';
import MobileAssignedMeetings from './MobileAssignedMeetings';
import MobileCheckInHistory from './MobileCheckInHistory';
import MobileOrders from './MobileOrders';
import PaymentStatusView from '../PaymentStatusView';
import MarketingSalespersonCalendar from '../MarketingSalespersonCalendar';
import { useAuth } from '../../../hooks/useAuth';
import AshvayChat from '../../../components/AshvayChat';

const MobileMarketingSalespersonLayout = ({ onLogout, onToggleDesktopView }) => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paymentsOpen, setPaymentsOpen] = useState(false);

  // Listen for navigation events from child components
  useEffect(() => {
    const handleNavigateToDashboard = () => {
      setCurrentPage('dashboard');
    };
    
    window.addEventListener('navigateToDashboard', handleNavigateToDashboard);
    
    return () => {
      window.removeEventListener('navigateToDashboard', handleNavigateToDashboard);
    };
  }, []);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
    { id: 'all-leads', label: 'All Leads', icon: Users, color: 'text-green-600' },
    { id: 'assigned-meetings', label: 'Assigned Meetings', icon: Calendar, color: 'text-indigo-600' },
    { id: 'checkin-history', label: 'Check-In History', icon: Camera, color: 'text-pink-600' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, color: 'text-orange-600' },
    { id: 'payments', label: 'Payments', icon: IndianRupee, color: 'text-purple-600', hasDropdown: true },
    { id: 'calendar', label: 'Calendar', icon: Calendar, color: 'text-blue-600' },
    { id: 'toolbox', label: 'Toolbox', icon: Wrench, color: 'text-red-600' },
  ];

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
    setPaymentsOpen(false);
  };

  const handlePaymentStatusClick = (status) => {
    setCurrentPage(`payment-status-${status}`);
    setSidebarOpen(false);
    setPaymentsOpen(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <MobileDashboard />;
      case 'all-leads':
        return <MobileLeads />;
      case 'assigned-meetings':
        return <MobileAssignedMeetings />;
      case 'checkin-history':
        return <MobileCheckInHistory />;
      case 'orders':
        return <MobileOrders />;
      case 'payment-status-due':
        return (
          <div className="p-4">
            <PaymentStatusView type="due" />
          </div>
        );
      case 'payment-status-advance':
        return (
          <div className="p-4">
            <PaymentStatusView type="advance" />
          </div>
        );
      case 'payment-status-completed':
        return (
          <div className="p-4">
            <PaymentStatusView type="completed" />
          </div>
        );
      case 'calendar':
        return (
          <div className="p-4">
            <MarketingSalespersonCalendar />
          </div>
        );
      case 'toolbox':
        return <MobileToolbox />;
      default:
        return <MobileDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">ANOCAB</h1>
              <p className="text-xs text-gray-500">Marketing Salesperson - Mobile</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <Bell className="h-5 w-5 text-gray-700" />
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            <nav className="p-4">
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  if (item.hasDropdown) {
                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => setPaymentsOpen(!paymentsOpen)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                            currentPage.startsWith('payment-status-') ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className="flex items-center space-x-3">
                            <Icon className={`h-5 w-5 ${currentPage.startsWith('payment-status-') ? 'text-blue-600' : 'text-gray-500'}`} />
                            <span className="text-sm font-medium">{item.label}</span>
                          </span>
                          {paymentsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                        {paymentsOpen && (
                          <div className="pl-10 space-y-1 mt-1">
                            <button
                              onClick={() => handlePaymentStatusClick('due')}
                              className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                                currentPage === 'payment-status-due' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              Due Payments
                            </button>
                            <button
                              onClick={() => handlePaymentStatusClick('advance')}
                              className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                                currentPage === 'payment-status-advance' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              Advance Payments
                            </button>
                            <button
                              onClick={() => handlePaymentStatusClick('completed')}
                              className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                                currentPage === 'payment-status-completed' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              Completed Payments
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        currentPage === item.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${currentPage === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-start gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      <div className="pb-20">
        {renderCurrentPage()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'all-leads', label: 'Leads', icon: Users },
            { id: 'assigned-meetings', label: 'Meetings', icon: Calendar },
            { id: 'checkin-history', label: 'Check-Ins', icon: Camera },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'calendar', label: 'Calendar', icon: Calendar },
            { id: 'toolbox', label: 'Toolbox', icon: Wrench },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex-1 min-w-[80px] flex flex-col items-center py-2 ${
                  currentPage === item.id ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <AshvayChat />
    </div>
  );
};

export default MobileMarketingSalespersonLayout;


