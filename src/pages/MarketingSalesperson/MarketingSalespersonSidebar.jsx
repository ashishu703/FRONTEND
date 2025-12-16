import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Calendar,
  Wrench,
  Menu,
  X,
  LogOut,
  UserCheck,
  ShoppingCart,
  IndianRupee,
  User,
  HelpCircle,
  CalendarCheck,
  Camera,
  ChevronDown
} from 'lucide-react';

const MarketingSalespersonSidebar = ({ activeView, setActiveView }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [paymentsOpen, setPaymentsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const togglePayments = () => {
    setPaymentsOpen(!paymentsOpen);
  };

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'all-leads',
      label: 'All Leads',
      icon: <UserCheck className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'assigned-meetings',
      label: 'Assigned Meetings',
      icon: <CalendarCheck className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'checkin-history',
      label: 'Check-In History',
      icon: <Camera className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <ShoppingCart className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: <IndianRupee className="w-5 h-5" />,
      hasDropdown: true
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <Calendar className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'toolbox',
      label: 'Toolbox',
      icon: <Wrench className="w-5 h-5" />,
      hasDropdown: false
    }
  ];

  const handleItemClick = (item) => {
    if (item.hasDropdown) {
      togglePayments();
    } else {
      setActiveView(item.id);
    }
  };

  const handlePaymentStatusClick = (status) => {
    setActiveView(`payment-status-${status}`);
  };

  const paymentStatuses = [
    { id: 'due', label: 'Due Payments', color: 'text-orange-500' },
    { id: 'advance', label: 'Advance Payments', color: 'text-blue-500' },
    { id: 'completed', label: 'Completed Payments', color: 'text-green-500' },
  ];

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isExpanded && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">ANOCAB</h1>
              <p className="text-xs text-gray-500">Marketing Salesperson</p>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isExpanded ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeView === item.id || (item.hasDropdown && activeView.startsWith('payment-status-'))
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              {isExpanded && (
                <>
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${paymentsOpen ? 'rotate-180' : ''}`} />
                  )}
                </>
              )}
            </button>
            
            {/* Payments Dropdown */}
            {item.hasDropdown && item.id === 'payments' && paymentsOpen && isExpanded && (
              <div className="ml-6 mt-2 space-y-1">
                {paymentStatuses.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => handlePaymentStatusClick(status.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      activeView === `payment-status-${status.id}`
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full mr-2 ${status.color}`}></span>
                    {status.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Support Button */}
      <div className="absolute bottom-20 left-4 right-4">
        <button
          onClick={() => window.location.href = '/support'}
          className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
          {isExpanded && <span className="text-sm font-medium">Support</span>}
        </button>
      </div>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={() => {
            // Handle logout logic here
            window.close();
          }}
          className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {isExpanded && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default MarketingSalespersonSidebar;

