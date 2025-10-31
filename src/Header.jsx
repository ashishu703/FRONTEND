import React, { useState, useRef, useEffect } from 'react';
import { Bell, Users, X, TrendingUp, Calendar, CheckCircle, MapPin, Award, Package, DollarSign, Smartphone, Moon, Sun, BarChart3, Clock, User, Factory, Wrench } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useCompany } from './context/CompanyContext';

const FixedHeader = ({ userType = "superadmin", currentPage = "dashboard", onToggleMobileView, isMobileView = false, isDarkMode = false, onToggleDarkMode, onProfileClick }) => {
  const { user, logout } = useAuth();
  const { selectedCompany, setSelectedCompany } = useCompany();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNotificationHistory, setShowNotificationHistory] = useState(false);
  const notificationRef = useRef(null);
  const notificationHistoryRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationsError, setNotificationsError] = useState(null);

  const [notificationHistory, setNotificationHistory] = useState([]);

  // Fetch notifications periodically
  useEffect(() => {
    let isMounted = true;
    let intervalId = null;

    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Skip polling when not authenticated to avoid 401 spam in dev
        return;
      }
      try {
        setLoadingNotifications(true);
        setNotificationsError(null);
        const res = await fetch('/api/notifications', { headers: { 'Authorization': `Bearer ${token}` } });
        const json = await res.json();
        if (!json?.success) throw new Error(json?.message || 'Failed');
        if (!isMounted) return;
        setNotifications(json.data.slice(0, 6));
        setNotificationHistory(json.data);
      } catch (e) {
        if (!isMounted) return;
        setNotificationsError(e.message);
      } finally {
        if (isMounted) setLoadingNotifications(false);
      }
    };

    fetchNotifications();
    intervalId = setInterval(fetchNotifications, 30000); // 30s polling

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);


  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (notificationHistoryRef.current && !notificationHistoryRef.current.contains(event.target)) {
        setShowNotificationHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const getNotificationIcon = (type) => {
    switch (type) {
      case 'lead': return <Users className="w-4 h-4 text-blue-500" />;
      case 'reminder': return <Calendar className="w-4 h-4 text-orange-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'info': return <TrendingUp className="w-4 h-4 text-purple-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  // Page-specific header content
  const getPageHeaderContent = () => {
    switch (currentPage) {
      // Salesperson pages
      case 'customers':
        return {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "Leads",
          subtitle: "Manage and track your sales leads"
        };
      case 'dashboard':
        return {
          icon: <TrendingUp className="w-6 h-6 text-white" />,
          title: "Sales Overview",
          subtitle: "Monitor sales performance and metrics"
        };
      case 'profile':
        return {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "Profile & Attendance",
          subtitle: "Manage your profile information and track attendance"
        };
      case 'stock':
        return {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "Available Stock",
          subtitle: "Manage inventory and stock levels"
        };
      case 'products':
        return {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "Payment Tracking",
          subtitle: "Browse and manage all payment tracking"
        };
      case 'due-payment':
        return {
          icon: <Clock className="w-6 h-6 text-white" />,
          title: "Due Payment",
          subtitle: "Track and manage due payments"
        };
      case 'advance-payment':
        return {
          icon: <DollarSign className="w-6 h-6 text-white" />,
          title: "Advance Payment",
          subtitle: "Track and manage advance payments"
        };
        case 'lead-status':
          return {
            icon: <BarChart3 className="w-6 h-6 text-white" />,
            title: "Lead Status",
            subtitle: "Manage and track lead status updates"
          };
        case 'scheduled-call':
          return {
            icon: <Calendar className="w-6 h-6 text-white" />,
            title: "Scheduled Calls",
            subtitle: "Manage and track scheduled call appointments"
          };
        case 'last-call':
          return {
            icon: <Clock className="w-6 h-6 text-white" />,
            title: "Last Call Activity",
            subtitle: "Track recent call activities and follow-ups"
          };
      
      // Follow-up pages with specific titles
      case 'followup-connected':
        return {
          icon: <CheckCircle className="w-6 h-6 text-white" />,
          title: "Connected Follow-ups",
          subtitle: "Manage successfully connected customer follow-ups"
        };
      case 'followup-not-connected':
        return {
          icon: <X className="w-6 h-6 text-white" />,
          title: "Not Connected Follow-ups",
          subtitle: "Follow-ups that could not be connected"
        };
      case 'followup-pending':
        return {
          icon: <Calendar className="w-6 h-6 text-white" />,
          title: "Pending Follow-ups",
          subtitle: "Follow-ups awaiting response"
        };
      case 'followup-next-meeting':
        return {
          icon: <Calendar className="w-6 h-6 text-white" />,
          title: "Today's Meeting Follow-ups",
          subtitle: "Schedule and manage upcoming meetings"
        };
      case 'followup-converted':
        return {
          icon: <CheckCircle className="w-6 h-6 text-white" />,
          title: "Converted Follow-ups",
          subtitle: "View and manage converted leads"
        };
      case 'followup-closed':
        return {
          icon: <CheckCircle className="w-6 h-6 text-white" />,
          title: "Closed Follow-ups",
          subtitle: "Completed and closed follow-up activities"
        };
      
      // SuperAdmin pages
      case 'customer-list':
        return {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "Customer List",
          subtitle: "View and manage all customers"
        };
      case 'department':
        return {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "Department Management",
          subtitle: "Manage departments and organizational structure"
        };
      case 'leads':
        return {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "Leads Management",
          subtitle: "View and manage all leads"
        };
      case 'all-leads':
        return {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "All Leads",
          subtitle: "Comprehensive view of all leads across departments"
        };
      case 'configuration':
        return {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "Configuration",
          subtitle: "System settings and configuration options"
        };
      case 'performance':
        return {
          icon: <Award className="w-6 h-6 text-white" />,
          title: "Performance Analytics",
          subtitle: "View performance metrics and analytics"
        };
      case 'marketing-leads':
        return {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "Marketing Leads",
          subtitle: "Manage marketing department leads"
        };
      case 'today-visit':
        return {
          icon: <Calendar className="w-6 h-6 text-white" />,
          title: "Today's Visits",
          subtitle: "Schedule and track today's customer visits"
        };
      
      // Marketing Salesperson pages
      case 'visits':
        return {
          icon: <MapPin className="w-6 h-6 text-white" />,
          title: "Customer Visits",
          subtitle: "Plan and track customer visits"
        };
      case 'calendar':
        return {
          icon: <Calendar className="w-6 h-6 text-white" />,
          title: "Lead Calendar",
          subtitle: "View your assigned leads day-wise"
        };
      case 'expenses':
        return {
          icon: <DollarSign className="w-6 h-6 text-white" />,
          title: "Expenses",
          subtitle: "Track your marketing expenses"
        };
      case 'orders':
        return {
          icon: <TrendingUp className="w-6 h-6 text-white" />,
          title: "Orders",
          subtitle: "Monitor performance and metrics"
        };
      case 'toolbox':
        return {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "Toolbox",
          subtitle: "Access tools and resources"
        };
      
      // TeleSales pages
      case 'tele-sales':
        return {
          icon: <Phone className="w-6 h-6 text-white" />,
          title: "Tele Sales Dashboard",
          subtitle: "Manage tele sales activities and leads"
        };
      
      // Office Sales Person pages
      case 'office-sales-person':
        return {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "Office Sales Dashboard",
          subtitle: "Manage office sales activities"
        };
      
      // Marketing Salesperson dashboard
      case 'marketing-salesperson':
        return {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "Marketing Sales Dashboard",
          subtitle: "Manage marketing sales activities"
        };
      
      // Sales Department Head pages
      case 'sales-dashboard':
        return {
          icon: <TrendingUp className="w-6 h-6 text-white" />,
          title: "Sales Dashboard",
          subtitle: "Sales department performance overview"
        };
      case 'user-performance':
        return {
          icon: <Award className="w-6 h-6 text-white" />,
          title: "User Performance",
          subtitle: "Monitor and analyze user performance metrics"
        };
      case 'payment-info':
        return {
          icon: <DollarSign className="w-6 h-6 text-white" />,
          title: "Payment Info",
          subtitle: "Manage payment information and transactions"
        };
      case 'sales-department-users':
        return {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "Department Users",
          subtitle: "Manage sales department users and permissions"
        };
      case 'stock-update':
        return {
          icon: <Package className="w-6 h-6 text-white" />,
          title: "Stock Update",
          subtitle: "Update and manage inventory stock levels"
        };
      
      // Production Department Head pages
      case 'production-dashboard':
        return {
          icon: <Factory className="w-6 h-6 text-white" />,
          title: "Production Dashboard",
          subtitle: "Production department performance overview"
        };
      case 'production-planning':
      case 'production-schedule':
      case 'design-cost':
      case 'work-orders':
      case 'capacity-planning':
      case 'backload-planning':
        return {
          icon: <Calendar className="w-6 h-6 text-white" />,
          title: "Production Planning",
          subtitle: "Manage schedules, work orders, and capacity"
        };
      case 'quality-control':
      case 'inspection-lots':
      case 'quality-metrics':
      case 'non-conformance':
        return {
          icon: <CheckCircle className="w-6 h-6 text-white" />,
          title: "Quality Control",
          subtitle: "Inspections, metrics, and non-conformance"
        };
      case 'production-execution':
      case 'execution-console':
      case 'machine-status':
      case 'operator-performance':
        return {
          icon: <Factory className="w-6 h-6 text-white" />,
          title: "Production Execution",
          subtitle: "Shop-floor execution and machine status"
        };
      case 'maintenance':
      case 'maintenance-orders':
      case 'preventive-maintenance':
      case 'equipment-status':
        return {
          icon: <Wrench className="w-6 h-6 text-white" />,
          title: "Maintenance",
          subtitle: "Orders, preventive plans, equipment status"
        };
      case 'inventory':
      case 'raw-materials':
      case 'finished-goods':
      case 'stock-alerts':
        return {
          icon: <Package className="w-6 h-6 text-white" />,
          title: "Inventory",
          subtitle: "Materials, finished goods, and alerts"
        };
      case 'production-users':
      case 'operator-performance':
        return {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "Production Staff",
          subtitle: "Manage production users and roles"
        };
      case 'reports':
      case 'production-reports':
      case 'efficiency-metrics':
      case 'cost-analysis':
        return {
          icon: <BarChart3 className="w-6 h-6 text-white" />,
          title: "Reports & Analytics",
          subtitle: "Production KPIs and cost analysis"
        };

      // Marketing Department Head pages
      case 'marketing-dashboard':
        return {
          icon: <TrendingUp className="w-6 h-6 text-white" />,
          title: "Marketing Dashboard",
          subtitle: "Marketing department performance overview"
        };
      case 'campaign-leads':
        return {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "Campaign Leads",
          subtitle: "Manage and track campaign leads"
        };
      case 'marketing-department-users':
        return {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "Marketing Department Users",
          subtitle: "Manage marketing department users and permissions"
        };
      
      default:
        return {
          icon: <TrendingUp className="w-6 h-6 text-white" />,
          title: "Dashboard",
          subtitle: "Monitor performance and metrics"
        };
    }
  };

  const pageContent = getPageHeaderContent();

  return (
    <header className={`sticky top-0 z-50 border-b shadow-sm transition-colors ${
      isDarkMode 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Dynamic Page Header */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center">
            {pageContent.icon}
          </div>
          <div>
            <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{pageContent.title}</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{pageContent.subtitle}</p>
          </div>
        </div>

        {/* Right Section - Company switcher (SuperAdmin), Notifications and User */}
        <div className="flex items-center space-x-4">
          {userType === 'superadmin' && (
            <div className="">
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Select Company"
              >
                <option value="Anode Electric Pvt.">Anode Electric Pvt.</option>
                <option value="Samriddhi Industries Pvt.">Samriddhi Industries Pvt.</option>
                <option value="Samriddhi Cables Pvt.">Samriddhi Cables Pvt.</option>
              </select>
            </div>
          )}
          {/* Mobile Toggle Button - Only for salesperson */}
          {userType === "salesperson" && onToggleMobileView && (
            <button
              onClick={onToggleMobileView}
              className={`p-2 rounded-lg transition-colors ${
                isMobileView 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={isMobileView ? 'Switch to Desktop View' : 'Switch to Mobile View'}
            >
              <Smartphone className="w-5 h-5" />
            </button>
          )}
          
          {/* Dark Mode Toggle Button - Only for salesperson */}
          {userType === "salesperson" && onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
          {/* Profile Icon - Only for marketing salesperson */}
          {userType === "marketing-salesperson" && onProfileClick && (
            <button
              onClick={onProfileClick}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 'profile' 
                  ? (isDarkMode ? 'bg-blue-700 text-blue-200' : 'bg-blue-100 text-blue-700')
                  : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
              }`}
              title="Profile & Attendance"
            >
              <User className={`w-5 h-5 ${currentPage === 'profile' ? (isDarkMode ? 'text-blue-200' : 'text-blue-700') : (isDarkMode ? 'text-gray-300' : 'text-gray-600')}`} />
            </button>
          )}
          
          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <Bell className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              {notifications?.length > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] leading-[18px] rounded-full text-center">
                  {Math.min(99, notifications.length)}
                </div>
              )}
            </button>

            {/* Notification Panel */}
            {showNotifications && (
              <div className={`absolute right-0 top-full mt-2 w-80 rounded-lg shadow-lg border z-50 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <X className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        notification.unread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${
                              notification.unread ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </p>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200">
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      setShowNotificationHistory(true);
                    }}
                    className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Button (without profile panel) */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.username ? user.username.split(' ').map(n => n[0]).join('').toUpperCase() : 'T'}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.email ? 
                  `${user.email.split('@')[0]}@${user.email.split('@')[1].substring(0, 3)}...` : 
                  'testuser@gma...'
                }
              </p>
              <p className="text-xs text-gray-500">
                {user?.role ? user.role.toUpperCase().replace('_', ' ') : userType.toUpperCase()}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Notification History Modal */}
      {showNotificationHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            ref={notificationHistoryRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Notification History</h2>
                  <p className="text-sm text-gray-600">All your notifications in one place</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNotificationHistory(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600 font-medium">Total</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700 mt-1">{notificationHistory.length}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-600 font-medium">Unread</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-700 mt-1">
                    {notificationHistory.filter(n => n.unread).length}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Success</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700 mt-1">
                    {notificationHistory.filter(n => n.type === 'success').length}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-600 font-medium">Reminders</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-700 mt-1">
                    {notificationHistory.filter(n => n.type === 'reminder').length}
                  </p>
                </div>
              </div>

              {/* Notification List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notificationHistory.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors hover:bg-gray-50 ${
                      notification.unread ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium ${
                            notification.unread ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
                <div className="text-sm text-gray-500">
                  Showing {notificationHistory.length} notifications
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowNotificationHistory(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    Mark All as Read
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default FixedHeader;