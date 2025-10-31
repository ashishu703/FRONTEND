import React, { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, Users, Package, Box, Wrench, LogOut, Monitor, Bell, User, ChevronDown, ChevronRight, Clock } from 'lucide-react';
import MobileDashboard from './MobileDashboard';
import MobileLeads from './MobileLeads';
import MobileStock from './MobileStock';
import MobileProducts from './MobileProducts';
import MobileToolbox from './MobileToolbox';
import MobileQuotations from './MobileQuotations';
import MobileFollowUps from './MobileFollowUps';
import { useAuth } from '../../../context/AuthContext';

const MobileLayout = ({ onLogout, onToggleDesktopView }) => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [followUpOpen, setFollowUpOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
    { id: 'customers', label: 'Leads', icon: Users, color: 'text-green-600' },
    { id: 'stock', label: 'Available Stock', icon: Package, color: 'text-purple-600' },
    { id: 'products', label: 'Toolbar', icon: Box, color: 'text-orange-600' },
    { id: 'toolbox', label: 'Toolbox Interface', icon: Wrench, color: 'text-red-600' },
  ];

  const followUpStatuses = [
    { id: 'followup-connected', label: 'Connected', color: 'text-green-500' },
    { id: 'followup-not-connected', label: 'Not Connected', color: 'text-red-500' },
    { id: 'followup-next-meeting', label: "Today's Meeting", color: 'text-blue-500' },
    { id: 'followup-converted', label: 'Converted', color: 'text-purple-500' },
    { id: 'followup-closed', label: 'Closed', color: 'text-gray-500' },
  ];

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <MobileDashboard />;
      case 'customers':
        return <MobileLeads />;
      case 'stock':
        return <MobileStock />;
      case 'products':
        return <MobileProducts />;
      case 'toolbox':
        return <MobileToolbox />;
      case 'followup-connected':
      case 'followup-not-connected':
      case 'followup-next-meeting':
      case 'followup-converted':
      case 'followup-closed':
        return <MobileFollowUps />;
      default:
        return <MobileDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
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
              <p className="text-xs text-gray-500">Salesperson - Mobile</p>
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

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl">
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
                {/* Main Navigation Items */}
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        currentPage === item.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${currentPage === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </span>
                    </button>
                  );
                })}

                {/* Follow Up Dropdown */}
                <div className="space-y-1">
                  <button
                    onClick={() => setFollowUpOpen(!followUpOpen)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      currentPage.startsWith('followup-')
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="flex items-center space-x-3">
                      <Clock className={`h-5 w-5 ${currentPage.startsWith('followup-') ? 'text-blue-600' : 'text-gray-500'}`} />
                      <span className="text-sm font-medium">Follow Up</span>
                    </span>
                    {followUpOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  
                  {followUpOpen && (
                    <div className="pl-10 space-y-1">
                      {followUpStatuses.map((status) => (
                        <button
                          key={status.id}
                          onClick={() => handleNavigation(status.id)}
                          className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                            currentPage === status.id
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

      {/* Main Content */}
      <div className="pb-20">
        {renderCurrentPage()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex">
          {navigationItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex-1 flex flex-col items-center py-2 ${
                  currentPage === item.id ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
          {/* Follow Up Button */}
          <button
            onClick={() => handleNavigation('followup-connected')}
            className={`flex-1 flex flex-col items-center py-2 ${
              currentPage.startsWith('followup-') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Clock className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Follow Up</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
