import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  BarChart3, 
  Users, 
  Building2, 
  UserCheck, 
  Settings, 
  TrendingUp,
  Menu,
  X,
  LogOut,
  Calendar,
  HelpCircle,
  PlusCircle,
  FileText
} from 'lucide-react';

const Sidebar = ({ onLogout, activeView, setActiveView }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState({
    department: false,
    salesDepartment: false,
    marketingSalesperson: false
  });
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
        setOpenDropdowns({ department: false, salesDepartment: false, marketingSalesperson: false });
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
    if (!isExpanded) {
      setOpenDropdowns({ department: false, salesDepartment: false, marketingSalesperson: false });
    } else {
      setOpenDropdowns({ department: false, salesDepartment: false, marketingSalesperson: false });
    }
    // Clear any pending auto-collapse
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'department',
      label: 'Department',
      icon: <Building2 className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'leads',
      label: 'Leads',
      icon: <UserCheck className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'configuration',
      label: 'Configuration',
      icon: <Settings className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'performance',
      label: 'Payment Info',
      icon: <TrendingUp className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileText className="w-5 h-5" />,
      hasDropdown: false
    }
  ];

  // Debug: Log the sidebar items structure
  // console.log('Sidebar items structure:', JSON.stringify(sidebarItems, null, 2));

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
              </div>
            </div>
          )}
          {!isExpanded && (
            <div className="flex justify-center w-full">
              <img 
                src="https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png" 
                alt="ANOCAB Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            {isExpanded ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

    

      {/* Navigation Items */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <div
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  activeView === item.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
                }`}
                onClick={() => {
                  if (item.hasDropdown) {
                    toggleDropdown(item.id);
                  } else {
                    setActiveView(item.id);
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className={activeView === item.id ? 'text-blue-600' : 'text-gray-500'}>
                    {item.icon}
                  </div>
                  {isExpanded && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </div>
                {isExpanded && item.hasDropdown && (
                  <div className={item.id === 'dashboard' ? 'text-blue-600' : 'text-gray-400'}>
                    {openDropdowns[item.id] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                )}
              </div>
              
              {/* Dropdown Items */}
              {isExpanded && item.hasDropdown && openDropdowns[item.id] && (
                <ul className="ml-8 mt-1 space-y-1">
                  {item.dropdownItems.map((subItem, index) => (
                    <li key={index}>
                      <div className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 text-gray-600`}
                      onClick={() => {
                        if (subItem.hasSubDropdown) {
                          if (subItem.label === 'Marketing Salesperson') {
                            toggleDropdown('marketingSalesperson');
                          } else {
                            toggleDropdown('salesDepartment');
                          }
                        } else {
                          setActiveView(subItem.label.toLowerCase().replace(/\s+/g, '-'));
                        }
                      }}>
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                          <span className="text-sm">{subItem.label}</span>
                        </div>
                        {subItem.hasSubDropdown && (
                          <div className="text-gray-400">
                            {(subItem.label === 'Marketing Salesperson' ? openDropdowns.marketingSalesperson : openDropdowns.salesDepartment) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Sub-dropdown Items */}
                      {subItem.hasSubDropdown && (
                        subItem.label === 'Marketing Salesperson' ? openDropdowns.marketingSalesperson : openDropdowns.salesDepartment
                      ) && (
                        <ul className="ml-6 mt-1 space-y-1">
                          {subItem.subDropdownItems.map((subSubItem, subIndex) => {
                            const IconComponent = subSubItem.icon === 'UserCheck' ? UserCheck : 
                                                 subSubItem.icon === 'Calendar' ? Calendar : 
                                                 UserCheck;
                            return (
                              <li key={subIndex}>
                                <div className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                                  subSubItem.active ? 'bg-blue-600 text-white' : 'hover:bg-gray-50 text-gray-600'
                                }`}
                                onClick={() => {
                                  const viewName = subSubItem.route || subSubItem.label.toLowerCase().replace(/\s+/g, '-');
                                  setActiveView(viewName);
                                }}>
                                  <div className="flex items-center space-x-2">
                                    <IconComponent className={`w-4 h-4 ${
                                      subSubItem.active ? 'text-white' : 'text-gray-500'
                                    }`} />
                                    <span className="text-sm">{subSubItem.label}</span>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Create Organisation Button */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <button 
          onClick={() => setActiveView('create-organisation')}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
            activeView === 'create-organisation' 
              ? 'bg-blue-50 text-blue-700' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          {isExpanded && <span className="text-sm font-medium">Create Organisation</span>}
        </button>
      </div>

      {/* Support Button */}
      <div className="p-4 border-t border-gray-200">
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

export default Sidebar;
