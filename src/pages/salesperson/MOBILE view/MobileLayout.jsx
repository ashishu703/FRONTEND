import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Users, Package, FileText, TrendingUp, Bell, User, LogOut, Monitor } from 'lucide-react';
import MobileDashboard from './MobileDashboard';
import MobileLeads from './MobileLeads';
import MobileToolbox from './MobileToolbox';
import MobileQuotations from './MobileQuotations';
import MobileFollowUps from './MobileFollowUps';
import { useAuth } from '../../../context/AuthContext';

const MobileLayout = ({ onLogout, onToggleDesktopView }) => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-blue-600' },
    { id: 'leads', label: 'Leads', icon: Users, color: 'text-green-600' },
    { id: 'toolbox', label: 'Toolbox', icon: Package, color: 'text-purple-600' },
    { id: 'quotations', label: 'Quotations', icon: FileText, color: 'text-orange-600' },
    { id: 'followups', label: 'Follow-ups', icon: TrendingUp, color: 'text-red-600' },
  ];

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <MobileDashboard />;
      case 'leads':
        return <MobileLeads />;
      case 'toolbox':
        return <MobileToolbox />;
      case 'quotations':
        return <MobileQuotations />;
      case 'followups':
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
              <h1 className="text-lg font-semibold text-gray-900">Sales CRM</h1>
              <p className="text-xs text-gray-500">Mobile View</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Desktop Toggle Button */}
            {onToggleDesktopView && (
              <button
                onClick={onToggleDesktopView}
                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                title="Switch to Desktop View"
              >
                <Monitor className="h-5 w-5" />
              </button>
            )}
            
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
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        currentPage === item.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${item.color}`} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
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
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
