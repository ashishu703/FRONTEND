import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  BarChart3, 
  Users, 
  UserCheck, 
  DollarSign,
  Target,
  Menu,
  X,
  LogOut,
  Calendar,
  TrendingUp,
  Package,
  HelpCircle,
  FileText
} from 'lucide-react';

const SalesDepartmentHeadSidebar = ({ onLogout, activeView, setActiveView }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedDropdowns, setExpandedDropdowns] = useState({});
  const collapseTimerRef = useRef(null);
  const isManuallyToggledRef = useRef(false);

  // Auto-collapse on mouse leave
  const handleMouseEnter = () => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
    if (!isManuallyToggledRef.current) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isManuallyToggledRef.current) {
      collapseTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
        setExpandedDropdowns({});
      }, 2000); // Collapse after 2 seconds
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
      }
    };
  }, []);

  const toggleSidebar = () => {
    isManuallyToggledRef.current = !isExpanded; // If expanding manually, set flag; if collapsing, clear flag
    setIsExpanded(!isExpanded);
    // Clear any pending auto-collapse
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
  };

  const toggleDropdown = (dropdownId) => {
    setExpandedDropdowns(prev => ({
      ...prev,
      [dropdownId]: !prev[dropdownId]
    }));
  };

  const sidebarItems = [
    {
      id: 'sales-dashboard',
      label: 'Sales Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'leads',
      label: 'Leads',
      icon: <UserCheck className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'user-performance',
      label: 'User Performance',
      icon: <Target className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'payment-info',
      label: 'Payment Info',
      icon: <DollarSign className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'sales-department-users',
      label: 'Department Users',
      icon: <Users className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'stock-update',
      label: 'Stock Update',
      icon: <Package className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileText className="w-5 h-5" />,
      hasDropdown: false
    }
  ];

  return (
    <div 
      className={`bg-white shadow-lg transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'} h-screen flex flex-col border-r border-gray-200`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {isExpanded && (
            <div className="flex items-center space-x-3">
              <img 
                src="https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png" 
                alt="ANOCAB Logo" 
                className="w-8 h-8 object-contain"
              />
              <div>
                <h1 className="font-bold text-gray-800 text-lg">ANOCAB</h1>
                <p className="text-xs text-gray-500">Sales Department Head</p>
              </div>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className={`p-1 hover:bg-gray-100 rounded transition-colors ${!isExpanded ? 'mx-auto' : ''}`}
          >
            {isExpanded ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              {item.hasDropdown ? (
                <div>
                  <div
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      activeView.startsWith(item.id) ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    onClick={() => toggleDropdown(item.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={activeView.startsWith(item.id) ? 'text-blue-600' : 'text-gray-500'}>
                        {item.icon}
                      </div>
                      {isExpanded && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                    </div>
                    {isExpanded && (
                      <div className={activeView.startsWith(item.id) ? 'text-blue-600' : 'text-gray-500'}>
                        {expandedDropdowns[item.id] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </div>
                  {expandedDropdowns[item.id] && isExpanded && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {item.dropdownItems.map((subItem) => (
                        <li key={subItem.id}>
                          <div
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                              activeView === subItem.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
                            }`}
                            onClick={() => setActiveView(subItem.id)}
                          >
                            <div className={activeView === subItem.id ? 'text-blue-600' : 'text-gray-500'}>
                              {subItem.icon}
                            </div>
                            <span className="text-sm font-medium">{subItem.label}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    activeView === item.id || (item.id === 'reports' && activeView?.startsWith('detailed-report-')) 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => {
                    console.log('Sidebar click - setting activeView to:', item.id);
                    setActiveView(item.id);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={activeView === item.id || (item.id === 'reports' && activeView?.startsWith('detailed-report-')) ? 'text-blue-600' : 'text-gray-500'}>
                      {item.icon}
                    </div>
                    {isExpanded && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Support Button */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <button 
          onClick={() => window.location.href = '/support'}
          className={`w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors`}
        >
          <HelpCircle className="w-5 h-5" />
          {isExpanded && <span className="text-sm font-medium">Support</span>}
        </button>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {isExpanded && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default SalesDepartmentHeadSidebar;
