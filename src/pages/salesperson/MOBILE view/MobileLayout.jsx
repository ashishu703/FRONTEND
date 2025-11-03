import React, { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, Users, Package, Box, Wrench, LogOut, Monitor, Bell, User, ChevronDown, ChevronRight, Clock, Calendar, CheckCircle, AlertTriangle, BarChart3, CreditCard, DollarSign } from 'lucide-react';
import MobileDashboard from './MobileDashboard';
import MobileLeads from './MobileLeads';
import MobileStock from './MobileStock';
import MobileProducts from './MobileProducts';
import MobileToolbox from './MobileToolbox';
import MobileQuotations from './MobileQuotations';
import LeadStatusPage from '../LeadStatus.jsx';
import ScheduledCallPage from '../ScheduledCall.jsx';
import LastCallPage from '../LastCall.jsx';
import ProductsPage from '../salespersonproducts.jsx';
import DuePaymentPage from '../DuePayment.jsx';
import AdvancePaymentPage from '../AdvancePayment.jsx';
import { useAuth } from '../../../context/AuthContext';

const MobileLayout = ({ onLogout, onToggleDesktopView }) => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leadStatusOpen, setLeadStatusOpen] = useState(false);
  const [paymentTrackingOpen, setPaymentTrackingOpen] = useState(false);
  
  // Notification state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState(null);

  // Notification type icons
  const typeIcon = (type) => {
    switch(type) {
      case 'lead': return <Users className="w-4 h-4 text-blue-500" />;
      case 'reminder': return <Calendar className="w-4 h-4 text-orange-500" />;
      case 'payment': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  // Load notifications
  const loadNotifications = async () => {
    try {
      setNotificationsLoading(true);
      setNotificationsError(null);
      const res = await fetch('/api/notifications', { 
        headers: { 
          'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined 
        } 
      });
      const json = await res.json();
      if (!json?.success) throw new Error(json?.message || 'Failed to load notifications');
      setNotifications(json.data || []);
    } catch (e) {
      setNotificationsError(e.message);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Load notifications when panel opens
  useEffect(() => {
    if (notificationsOpen) {
      loadNotifications();
    }
  }, [notificationsOpen]);

  // Auto-refresh notifications every 30 seconds when panel is open
  useEffect(() => {
    if (!notificationsOpen) return;
    
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [notificationsOpen]);

  // Count unread notifications (you can add isRead field to notifications later)
  const unreadCount = notifications.length; // For now, showing total count

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
    { id: 'customers', label: 'Leads', icon: Users, color: 'text-green-600' },
  ];
  
  // Toolbox Interface - moved to after Payment Tracking
  const toolboxInterfaceItem = { id: 'products', label: 'Toolbox Interface', icon: Box, color: 'text-orange-600' };

  const leadStatusOptions = [
    { id: 'lead-status', label: 'All Leads', icon: BarChart3, color: 'text-indigo-500' },
    { id: 'scheduled-call', label: 'Scheduled Call', icon: Calendar, color: 'text-blue-500' },
    { id: 'last-call', label: 'Last Call', icon: Clock, color: 'text-purple-500' },
  ];

  const paymentTrackingOptions = [
    { id: 'payment-tracking-all', label: 'All Payments', icon: CreditCard, color: 'text-green-500' },
    { id: 'due-payment', label: 'Due Payments', icon: Clock, color: 'text-red-500' },
    { id: 'advance-payment', label: 'Advance Payments', icon: DollarSign, color: 'text-blue-500' },
  ];
  
  // Available Stock moved to bottom
  const availableStockItem = { id: 'stock', label: 'Available Stock', icon: Package, color: 'text-purple-600' };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  // Handle Lead Status dropdown toggle - do NOT navigate
  const handleLeadStatusToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLeadStatusOpen(!leadStatusOpen);
    // Explicitly do NOT change currentPage here
  };

  // Handle Payment Tracking dropdown toggle - do NOT navigate
  const handlePaymentTrackingToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPaymentTrackingOpen(!paymentTrackingOpen);
    // Explicitly do NOT change currentPage here
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <MobileDashboard />;
      case 'customers':
        return <MobileLeads />;
      case 'lead-status':
        return <LeadStatusPage isDarkMode={false} />;
      case 'scheduled-call':
        return <ScheduledCallPage isDarkMode={false} />;
      case 'last-call':
        return <LastCallPage isDarkMode={false} />;
      case 'payment-tracking-all':
        return <ProductsPage isDarkMode={false} />;
      case 'due-payment':
        return <DuePaymentPage isDarkMode={false} />;
      case 'advance-payment':
        return <AdvancePaymentPage isDarkMode={false} />;
      case 'stock':
        return <MobileStock />;
      case 'products':
        return <MobileProducts />;
      case 'toolbox':
        return <MobileToolbox />;
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
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Bell className="h-5 w-5 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      {notificationsOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setNotificationsOpen(false)}
          />
          {/* Notifications Panel */}
          <div className="fixed right-0 top-[64px] h-[calc(100vh-64px)] w-[90vw] max-w-md bg-white shadow-xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Bell className="text-blue-600 w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                  <p className="text-xs text-gray-500">Real-time updates</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadNotifications}
                  disabled={notificationsLoading}
                  className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {notificationsLoading ? 'Loading...' : 'Refresh'}
                </button>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {notificationsLoading && !notifications.length && (
                <div className="p-6 text-center text-gray-600">Loading notifications...</div>
              )}
              
              {notificationsError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{notificationsError}</p>
                  <button
                    onClick={loadNotifications}
                    className="mt-2 text-xs text-red-600 underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!notificationsLoading && !notificationsError && notifications.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              )}

              {!notificationsLoading && !notificationsError && notifications.length > 0 && (
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0">
                          {typeIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="text-sm font-medium text-gray-900">{n.title}</div>
                            <div className="text-xs text-gray-500 whitespace-nowrap">
                              {new Date(n.time).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">{n.message}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4">
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

                {/* Lead Status Dropdown */}
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={handleLeadStatusToggle}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      currentPage === 'lead-status' || currentPage === 'scheduled-call' || currentPage === 'last-call'
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="flex items-center space-x-3">
                      <BarChart3 className={`h-5 w-5 ${currentPage === 'lead-status' || currentPage === 'scheduled-call' || currentPage === 'last-call' ? 'text-blue-600' : 'text-gray-500'}`} />
                      <span className="text-sm font-medium">Lead Status</span>
                    </span>
                    {leadStatusOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  
                  {leadStatusOpen && (
                    <div className="pl-10 space-y-1">
                      {leadStatusOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.id}
                            onClick={() => {
                              handleNavigation(option.id);
                              setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                              currentPage === option.id
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className={`h-4 w-4 mr-2 ${option.color}`} />
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Payment Tracking Dropdown */}
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={handlePaymentTrackingToggle}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      currentPage === 'payment-tracking-all' || currentPage === 'due-payment' || currentPage === 'advance-payment'
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="flex items-center space-x-3">
                      <CreditCard className={`h-5 w-5 ${currentPage === 'payment-tracking-all' || currentPage === 'due-payment' || currentPage === 'advance-payment' ? 'text-blue-600' : 'text-gray-500'}`} />
                      <span className="text-sm font-medium">Payment Tracking</span>
                    </span>
                    {paymentTrackingOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  
                  {paymentTrackingOpen && (
                    <div className="pl-10 space-y-1">
                      {paymentTrackingOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.id}
                            onClick={() => {
                              handleNavigation(option.id);
                              setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                              currentPage === option.id
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className={`h-4 w-4 mr-2 ${option.color}`} />
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Toolbox Interface - moved between Payment Tracking and Available Stock */}
                {(() => {
                  const Icon = toolboxInterfaceItem.icon;
                  return (
                    <button
                      onClick={() => handleNavigation(toolboxInterfaceItem.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        currentPage === toolboxInterfaceItem.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${currentPage === toolboxInterfaceItem.id ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span className="text-sm font-medium">{toolboxInterfaceItem.label}</span>
                      </span>
                    </button>
                  );
                })()}

                {/* Available Stock */}
                {(() => {
                  const Icon = availableStockItem.icon;
                  return (
                    <button
                      onClick={() => handleNavigation(availableStockItem.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        currentPage === availableStockItem.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${currentPage === availableStockItem.id ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span className="text-sm font-medium">{availableStockItem.label}</span>
                      </span>
                    </button>
                  );
                })()}
              </div>
            </nav>
              
            {/* Logout Button - Fixed at Bottom */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-start gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
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
          {/* Dashboard */}
          <button
            onClick={() => handleNavigation('dashboard')}
            className={`flex-1 flex flex-col items-center py-2 ${
              currentPage === 'dashboard' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <LayoutDashboard className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          
          {/* Leads */}
          <button
            onClick={() => handleNavigation('customers')}
            className={`flex-1 flex flex-col items-center py-2 ${
              currentPage === 'customers' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Users className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Leads</span>
          </button>
          
          {/* Toolbox Interface */}
          <button
            onClick={() => handleNavigation('products')}
            className={`flex-1 flex flex-col items-center py-2 ${
              currentPage === 'products' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Box className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Toolbox</span>
          </button>
          
          {/* Available Stock */}
          <button
            onClick={() => handleNavigation('stock')}
            className={`flex-1 flex flex-col items-center py-2 ${
              currentPage === 'stock' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Package className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Stock</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
