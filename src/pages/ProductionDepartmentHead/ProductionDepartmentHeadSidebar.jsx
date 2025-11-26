import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  BarChart3, 
  Users, 
  Factory, 
  DollarSign,
  Target,
  Menu,
  X,
  LogOut,
  Calendar,
  TrendingUp,
  Package,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  Wrench,
  FileText,
  Activity,
  HelpCircle
} from 'lucide-react';

const ProductionDepartmentHeadSidebar = ({ onLogout, activeView, setActiveView }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedDropdowns, setExpandedDropdowns] = useState({});

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDropdown = (dropdownId) => {
    setExpandedDropdowns(prev => ({
      ...prev,
      [dropdownId]: !prev[dropdownId]
    }));
  };

  const sidebarItems = [
    {
      id: 'production-dashboard',
      label: 'Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      hasDropdown: false
    },
    {
      id: 'production-planning',
      label: 'Production Planning',
      icon: <Calendar className="w-5 h-5" />,
      hasDropdown: true,
      dropdownItems: [
        { id: 'production-schedule', label: 'Sales Orders', icon: <Clock className="w-4 h-4" /> },
        { id: 'design-cost', label: 'Design & Cost', icon: <DollarSign className="w-4 h-4" /> },
        { id: 'work-orders', label: 'Work Orders', icon: <FileText className="w-4 h-4" /> },
        { id: 'capacity-planning', label: 'Shop Floor', icon: <Target className="w-4 h-4" /> },
        { id: 'backload-planning', label: 'Backload Planning', icon: <Clock className="w-4 h-4" /> }
      ]
    },
    {
      id: 'production-execution',
      label: 'Production Execution',
      icon: <Factory className="w-5 h-5" />,
      hasDropdown: true,
      dropdownItems: [
        { id: 'execution-console', label: 'Daily Machine Report', icon: <Activity className="w-4 h-4" /> },
        { id: 'machine-status', label: 'Machine Status', icon: <Settings className="w-4 h-4" /> }
      ]
    },
    {
      id: 'quality-control',
      label: 'Quality Control',
      icon: <CheckCircle className="w-5 h-5" />,
      hasDropdown: true,
      dropdownItems: [
        { id: 'inspection-lots', label: 'Inspection Lots', icon: <Package className="w-4 h-4" /> },
        { id: 'quality-metrics', label: 'Quality Metrics', icon: <TrendingUp className="w-4 h-4" /> },
        { id: 'non-conformance', label: 'Non-Conformance', icon: <AlertTriangle className="w-4 h-4" /> }
      ]
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: <Wrench className="w-5 h-5" />,
      hasDropdown: true,
      dropdownItems: [
        { id: 'maintenance-orders', label: 'Maintenance Orders', icon: <FileText className="w-4 h-4" /> },
        { id: 'preventive-maintenance', label: 'Preventive Maintenance', icon: <Clock className="w-4 h-4" /> },
        { id: 'equipment-status', label: 'Equipment Status', icon: <Settings className="w-4 h-4" /> }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <Package className="w-5 h-5" />,
      hasDropdown: true,
      dropdownItems: [
        { id: 'raw-materials', label: 'Raw Materials', icon: <Package className="w-4 h-4" /> },
        { id: 'finished-goods', label: 'Finished Goods', icon: <CheckCircle className="w-4 h-4" /> },
        { id: 'stock-alerts', label: 'Stock Alerts', icon: <AlertTriangle className="w-4 h-4" /> }
      ]
    },
    {
      id: 'production-users',
      label: 'Production Staff',
      icon: <Users className="w-5 h-5" />,
      hasDropdown: true,
      dropdownItems: [
        { id: 'production-users', label: 'Staff Members', icon: <Users className="w-4 h-4" /> },
        { id: 'operator-performance', label: 'Operator Performance', icon: <Users className="w-4 h-4" /> }
      ]
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      hasDropdown: true,
      dropdownItems: [
        { id: 'production-reports', label: 'Production Reports', icon: <FileText className="w-4 h-4" /> },
        { id: 'efficiency-metrics', label: 'Efficiency Metrics', icon: <TrendingUp className="w-4 h-4" /> },
        { id: 'cost-analysis', label: 'Cost Analysis', icon: <DollarSign className="w-4 h-4" /> }
      ]
    }
  ];

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'} h-screen flex flex-col border-r border-gray-200 shrink-0`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 shrink-0">
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
                <p className="text-xs text-gray-500">Production Department Head</p>
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
      <nav className="flex-1 p-2 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              {item.hasDropdown ? (
                <div>
                  <div
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      activeView.startsWith(item.id) ? 'bg-orange-50 text-orange-700' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    onClick={() => toggleDropdown(item.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={activeView.startsWith(item.id) ? 'text-orange-600' : 'text-gray-500'}>
                        {item.icon}
                      </div>
                      {isExpanded && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                    </div>
                    {isExpanded && (
                      <div className={activeView.startsWith(item.id) ? 'text-orange-600' : 'text-gray-500'}>
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
                              activeView === subItem.id ? 'bg-orange-50 text-orange-700' : 'hover:bg-gray-50 text-gray-700'
                            }`}
                            onClick={() => setActiveView(subItem.id)}
                          >
                            <div className={activeView === subItem.id ? 'text-orange-600' : 'text-gray-500'}>
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
                    activeView === item.id ? 'bg-orange-50 text-orange-700' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => setActiveView(item.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={activeView === item.id ? 'text-orange-600' : 'text-gray-500'}>
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

export default ProductionDepartmentHeadSidebar;