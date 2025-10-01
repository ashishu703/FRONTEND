import React, { useState } from 'react';
import { 
  BarChart3, 
  Phone, 
  Clock,
  Headphones,
  Menu,
  X,
  LogOut,
  UserCheck,
  Calendar,
  Activity
} from 'lucide-react';

const TeleSalesSidebar = ({ activeView, setActiveView }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'call-center',
      label: 'Call Center',
      icon: <Headphones className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'call-logs',
      label: 'Call Logs',
      icon: <Phone className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'follow-ups',
      label: 'Follow-ups',
      icon: <Clock className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: <Activity className="w-5 h-5" />,
      hasDropdown: false
    }
  ];

  const handleItemClick = (item) => {
    setActiveView(item.id);
  };

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isExpanded && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">ANOCAB</h1>
              <p className="text-xs text-gray-500">Tele Sales</p>
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
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              activeView === item.id
                ? 'bg-green-100 text-green-700 border-r-2 border-green-600'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <div className="flex-shrink-0">
              {item.icon}
            </div>
            {isExpanded && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={() => {
            // Handle logout logic here
            window.close();
          }}
          className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {isExpanded && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default TeleSalesSidebar;
