import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  BarChart3, 
  Users, 
  Calendar,
  Wrench,
  Menu,
  X,
  LogOut,
  UserCheck,
  MapPin,
  ShoppingCart,
  Clock
} from 'lucide-react';

const MarketingSalespersonSidebar = ({ activeView, setActiveView }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [followUpOpen, setFollowUpOpen] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleFollowUp = () => {
    setFollowUpOpen(!followUpOpen);
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
      id: 'visits',
      label: 'Visits',
      icon: <MapPin className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <ShoppingCart className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'follow-up',
      label: 'Follow Up',
      icon: <Clock className="w-5 h-5" />,
      hasDropdown: true
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
      toggleFollowUp();
    } else {
      setActiveView(item.id);
    }
  };

  const handleFollowUpClick = (status) => {
    setActiveView(`follow-up-${status}`);
  };

  const followUpStatuses = [
    { id: 'connected', label: 'Connected', color: 'text-green-500' },
    { id: 'not-connected', label: 'Not Connected', color: 'text-red-500' },
    { id: 'next-meeting', label: 'Next Meeting', color: 'text-blue-500' },
    { id: 'closed', label: 'Closed', color: 'text-gray-500' },
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
                activeView === item.id || (item.hasDropdown && activeView.startsWith('follow-up-'))
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
                    <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${followUpOpen ? 'rotate-180' : ''}`} />
                  )}
                </>
              )}
            </button>
            
            {/* Follow Up Dropdown */}
            {item.hasDropdown && followUpOpen && isExpanded && (
              <div className="ml-6 mt-2 space-y-1">
                {followUpStatuses.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => handleFollowUpClick(status.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      activeView === `follow-up-${status.id}`
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
