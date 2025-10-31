import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  UserCheck, 
  Calendar, 
  CheckCircle, 
  XCircle,
  IndianRupee,
  TrendingDown,
  TrendingUp,
  CalendarCheck,
  AlertCircle,
  Percent,
  RefreshCw,
  BarChart3,
  Activity,
  Target,
  Phone,
  Mail,
  MapPin,
  UserPlus,
  CalendarDays,
  DollarSign,
  TrendingUp as TrendingUpIcon,
  ShoppingCart,
  Hash,
  User,
  FileText,
  Package,
  Map,
  Globe,
  MessageCircle
} from 'lucide-react';
import MarketingQuotation from './MarketingQuotation';
import AllLeads from './MarketingSalespersonLeads';
import Visits from './MarketingSalespersonVisits';
import TestVisits from './TestVisits';
import Orders from './MarketingSalespersonOrders';
import MarketingSalespersonExpenses from './MarketingSalespersonExpenses';
import MarketingFollowUpBase from './FollowUp/MarketingFollowUpBase';
import MarketingSalespersonProfile from './MarketingSalespersonProfile';
import MarketingSalespersonCalendar from './MarketingSalespersonCalendar';
import { useMarketingFollowUpData } from './FollowUp/MarketingFollowUpDataContext';

const MarketingSalespersonDashboard = ({ activeView, setActiveView }) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const { getLeadsByStatus, loading, leadsData, getStatusCounts } = useMarketingFollowUpData();
  
  // Add error handling
  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }
  
  // Fallback if data is not available
  if (!leadsData || !getStatusCounts) {
    return <div className="p-6 text-center">No data available - leadsData: {JSON.stringify(leadsData)}, getStatusCounts: {typeof getStatusCounts}</div>;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <MarketingDashboardContent selectedTab={selectedTab} setSelectedTab={setSelectedTab} customers={leadsData} getStatusCounts={getStatusCounts} />;
      case 'all-leads':
        return <AllLeads />;
      case 'follow-up':
        return <MarketingFollowUpBase status="all" customData={getLeadsByStatus('all')} />;
      case 'follow-up-connected':
        return <MarketingFollowUpBase status="connected" customData={getLeadsByStatus('connected')} />;
      case 'follow-up-not-connected':
        return <MarketingFollowUpBase status="not-connected" customData={getLeadsByStatus('not-connected')} />;
      case 'follow-up-next-meeting':
        return <MarketingFollowUpBase status="next-meeting" customData={getLeadsByStatus('next-meeting')} />;
      case 'follow-up-closed':
        return <MarketingFollowUpBase status="closed" customData={getLeadsByStatus('closed')} />;
      case 'visits':
        console.log('Rendering Visits component - DEBUGGING');
        console.log('Active view is:', activeView);
        return <Visits />;
      case 'orders':
        return <Orders />;
      // Expenses moved under Profile tab
      case 'calendar':
        return <MarketingSalespersonCalendar />;
      case 'profile':
        return <MarketingSalespersonProfile />;
      case 'toolbox':
        return <ToolboxContent />;
      case 'doc-style':
        return <DocStyleDashboard />;
      default:
        return <MarketingDashboardContent selectedTab={selectedTab} setSelectedTab={setSelectedTab} />;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {renderContent()}
    </div>
  );
};

// Marketing Dashboard Content
const MarketingDashboardContent = ({ selectedTab, setSelectedTab, customers, getStatusCounts }) => {
  return (
    <div className="p-6 bg-gray-50 min-h-full scroll-smooth">
        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`flex items-center space-x-2 pb-2 font-medium text-sm transition-colors ${
                selectedTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setSelectedTab('performance')}
              className={`flex items-center space-x-2 pb-2 font-medium text-sm transition-colors ${
                selectedTab === 'performance'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Performance</span>
            </button>
            
          </nav>
        </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && <OverviewContent customers={customers} getStatusCounts={getStatusCounts} />}
      {selectedTab === 'performance' && <PerformanceContent customers={customers} getStatusCounts={getStatusCounts} />}
    </div>
  );
};

// Overview Content
const OverviewContent = ({ customers, getStatusCounts }) => {
  // Add error handling
  if (!customers || !getStatusCounts) {
    return <div className="p-6 text-center">Loading...</div>;
  }
  
  // Calculate real metrics from data
  const statusCounts = getStatusCounts();
  const totalLeads = statusCounts.total;
  const closedLeads = statusCounts.closed;
  
  // Calculate target data dynamically
  const currentDate = new Date();
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysLeft = lastDayOfMonth.getDate() - currentDate.getDate();
  
  // Dynamic target data
  const targetData = {
    monthlyTarget: 100, // This could be loaded from user settings or API
    targetAchieved: closedLeads,
    daysLeft: daysLeft,
    achievementPercentage: totalLeads > 0 ? Math.round((closedLeads / 100) * 100) : 0
  };
  
  // Overview Data - same structure as salesperson dashboard
  const overviewData = {
    metrics: [
      {
        title: "Total Leads",
        value: "0",
        subtitle: "No leads assigned yet",
        icon: UserPlus,
        color: "bg-blue-50 text-blue-600 border-blue-200",
        trend: "0%",
        trendUp: true
      },
      {
        title: "Conversion Rate",
        value: "0%",
        subtitle: "No conversions yet",
        icon: CheckCircle,
        color: "bg-green-50 text-green-600 border-green-200",
        trend: "0%",
        trendUp: true
      },
      {
        title: "Pending Rate",
        value: "0%",
        subtitle: "No pending leads",
        icon: Clock,
        color: "bg-orange-50 text-orange-600 border-orange-200",
        trend: "0%",
        trendUp: false
      },
      {
        title: "Total Revenue",
        value: "₹0",
        subtitle: "No revenue generated yet",
        icon: IndianRupee,
        color: "bg-purple-50 text-purple-600 border-purple-200",
        trend: "0%",
        trendUp: true
      },
    ],
    leadStatuses: [
      {
        title: "Pending",
        count: "7",
        subtitle: "Leads awaiting response",
        icon: Clock,
        color: "border-l-orange-500 bg-orange-50 border-orange-200"
      },
      {
        title: "Meeting scheduled",
        count: "0",
        subtitle: "Upcoming meetings",
        icon: Calendar,
        color: "border-l-purple-500 bg-purple-50 border-purple-200"
      },
      {
        title: "Follow Up",
        count: "0",
        subtitle: "Requires follow-up",
        icon: TrendingUp,
        color: "border-l-blue-500 bg-blue-50 border-blue-200"
      },
      {
        title: "Win Leads",
        count: "0",
        subtitle: "Successful conversions",
        icon: CheckCircle,
        color: "border-l-green-500 bg-green-50 border-green-200"
      },
      {
        title: "Not Interested",
        count: "0",
        subtitle: "Declined leads",
        icon: XCircle,
        color: "border-l-red-500 bg-red-50 border-red-200"
      },
      {
        title: "Loose Leads",
        count: "0",
        subtitle: "Unreachable leads",
        icon: AlertCircle,
        color: "border-l-gray-500 bg-gray-50 border-gray-200"
      },
    ]
  }

  return (
    <div className="space-y-6 pb-16">

      {/* Lead Status Summary */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <Clock className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Lead Status Summary</h3>
        </div>
        <p className="text-sm text-gray-500">Overview of your leads by status</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {overviewData.leadStatuses.map((status, index) => (
          <div key={index} className={`bg-white rounded-lg border-l-4 border h-24 w-full px-3 pt-2 pb-0 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1 ${status.color}`}>
            <div className="flex items-start justify-between h-full">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-0">{status.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-0">{status.count}</p>
                <p className="text-xs text-gray-500">{status.subtitle}</p>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center ml-2 flex-shrink-0">
                <status.icon className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Target & Timeline */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <Target className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Target & Timeline</h3>
        </div>
        <p className="text-sm text-gray-500">Track your monthly targets and progress</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Monthly Target Card */}
        <div className="bg-white rounded-lg border border-purple-200 p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Monthly Target</p>
              <p className="text-2xl font-bold text-blue-600 mb-1">{targetData.monthlyTarget}</p>
              <p className="text-xs text-gray-500">Leads target this month</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
              <Target className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="w-full h-2 bg-gradient-to-r from-purple-200 to-white rounded-full"></div>
        </div>

        {/* Target Achieved Card */}
        <div className="bg-white rounded-lg border border-green-200 p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Target Achieved</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{targetData.targetAchieved}</p>
              <p className="text-xs text-gray-500">Leads achieved this month</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="w-full h-2 bg-gradient-to-r from-green-200 to-white rounded-full"></div>
        </div>

        {/* Days Left Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Days Left</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{targetData.daysLeft}</p>
              <p className="text-xs text-gray-500">Remaining days in current month</p>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
              <Calendar className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Key Performance Metrics</h3>
        </div>
        <p className="text-sm text-gray-500">Critical business indicators and trends</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Leads Card */}
        <div className="bg-white rounded-lg border-l-4 border border-blue-200 p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{totalLeads}</p>
              <p className="text-xs text-gray-500">Active leads this month</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
              <UserPlus className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="w-full h-2 bg-blue-200 rounded-full"></div>
            <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12%
            </span>
          </div>
        </div>

        {/* Conversion Rate Card */}
        <div className="bg-white rounded-lg border-l-4 border border-green-200 p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0}%</p>
              <p className="text-xs text-gray-500">Above target of 20%</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="w-full h-2 bg-green-200 rounded-full"></div>
            <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +3.2%
            </span>
          </div>
        </div>

        {/* Pending Rate Card */}
        <div className="bg-white rounded-lg border-l-4 border border-orange-200 p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Pending Rate</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{totalLeads > 0 ? Math.round(((statusCounts['not-connected'] + statusCounts['next-meeting']) / totalLeads) * 100) : 0}%</p>
              <p className="text-xs text-gray-500">Leads requiring follow-up</p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="w-full h-2 bg-orange-200 rounded-full"></div>
            <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full flex items-center">
              <TrendingDown className="w-3 h-3 mr-1" />
              -2.1%
            </span>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-white rounded-lg border-l-4 border border-purple-200 p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">₹{customers.filter(c => c.connectedStatus === 'closed').reduce((sum, c) => sum + (Number(c.expectedValue) || 0), 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500">Revenue generated this month</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
              <IndianRupee className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="w-full h-2 bg-purple-200 rounded-full"></div>
            <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full flex items-center">
              <TrendingDown className="w-3 h-3 mr-1" />
              0%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Leads Activity Card - Expanded */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Weekly Leads Activity</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end h-24">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mb-2">
                    <span className="text-xs text-blue-600 font-medium">0</span>
                  </div>
                  <div className="w-6 h-6 bg-blue-200 rounded"></div>
                  <span className="text-xs text-gray-600 mt-1">{day}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 text-center">Leads Generated This Week</p>
          </div>
        </div>

        {/* Lead Sources Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Lead Sources</h3>
          </div>
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-gray-900 mb-1">0</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Website', color: 'bg-blue-500', count: 0 },
              { label: 'Social Media', color: 'bg-orange-500', count: 0 },
              { label: 'Email Campaign', color: 'bg-purple-500', count: 0 },
              { label: 'Referrals', color: 'bg-green-500', count: 0 },
              { label: 'Cold Calls', color: 'bg-red-500', count: 0 },
              { label: 'Other', color: 'bg-gray-500', count: 0 }
            ].map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${source.color} mr-2`}></div>
                  <span className="text-sm text-gray-600">{source.label}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{source.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Monthly Revenue Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-800">Monthly Revenue Trend</h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-end h-24">
            {[
              { month: 'Jan', value: 0 },
              { month: 'Feb', value: 0 },
              { month: 'Mar', value: 0 },
              { month: 'Apr', value: 0 },
              { month: 'May', value: 0 },
              { month: 'Jun', value: 0 }
            ].map((data, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center mb-2">
                  <span className="text-xs text-green-600 font-medium">{data.value}</span>
                </div>
                <div className="w-8 h-1 bg-blue-200 rounded"></div>
                <span className="text-xs text-gray-600 mt-1">{data.month}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 text-center">Revenue in Thousands (₹)</p>
        </div>
      </div>
    </div>
  );
};
// Quotation-style Dashboard View
const DocStyleDashboard = () => {
  // Use the existing MarketingQuotation component as the centerpiece inside a clean container,
  // with the same margins/fonts/borders as the print template so the dashboard view matches.
  const sampleQuotation = {
    quotationDate: new Date().toISOString().split('T')[0],
    quotationNumber: `ANQ${Date.now().toString().slice(-6)}`,
    validUpto: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
    billTo: { business: '—', address: '—', phone: '—', gstNo: '', state: '—' },
    items: [],
    subtotal: 0,
    taxAmount: 0,
    total: 0
  };

  return (
    <div className="bg-white min-h-[85vh] px-6 py-6">
      <div className="max-w-4xl mx-auto">
        <MarketingQuotation quotationData={sampleQuotation} selectedBranch="ANODE" />
      </div>
    </div>
  );
};

// Performance Content
const PerformanceContent = ({ customers, getStatusCounts }) => {
  const leadsData = customers || [];

  // Status counts derived from shared context
  const statusCounts = getStatusCounts ? getStatusCounts() : { connected: 0, 'not-connected': 0, 'next-meeting': 0, closed: 0, total: 0 };

  const totalLeads = statusCounts.total || 0;
  const closedLeads = statusCounts.closed || 0;
  const conversionRateCurrent = totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;

  // Revenue derived from closed leads expectedValue sum
  const revenueCurrent = (leadsData || [])
    .filter(l => (l.finalStatus || '').toLowerCase() === 'closed')
    .reduce((sum, l) => sum + (Number(l.expectedValue) || 0), 0);

  // Use interaction counts as proxy for calls (connected + not-connected)
  const callsCurrent = (statusCounts.connected || 0) + (statusCounts['not-connected'] || 0);

  // Load configurable targets from localStorage; fall back to current values (no hardcoding)
  const targetsFromStorage = (() => {
    try { return JSON.parse(localStorage.getItem('marketingPerformanceTargets') || '{}'); } catch { return {}; }
  })();

  const resolvedTargets = {
    monthlyLeads: Number(targetsFromStorage.monthlyLeads) || totalLeads,
    conversionRate: Number(targetsFromStorage.conversionRate) || conversionRateCurrent,
    revenue: Number(targetsFromStorage.revenue) || revenueCurrent,
    calls: Number(targetsFromStorage.calls) || callsCurrent
  };

  // Build performance data dynamically
  const performanceData = {
    targets: {
      monthlyLeads: { current: totalLeads, target: resolvedTargets.monthlyLeads, label: "Monthly Leads" },
      conversionRate: { current: conversionRateCurrent, target: resolvedTargets.conversionRate, label: "Conversion Rate (%)" },
      revenue: { current: revenueCurrent, target: resolvedTargets.revenue, label: "Quarterly Revenue (₹)" },
      calls: { current: callsCurrent, target: resolvedTargets.calls, label: "Daily Calls" }
    },
    leadStatusData: [
      { label: "Connected", value: statusCounts.connected || 0, color: "#3b82f6" },
      { label: "Not Connected", value: statusCounts['not-connected'] || 0, color: "#ef4444" },
      { label: "Next Meeting", value: statusCounts['next-meeting'] || 0, color: "#8b5cf6" },
      { label: "Closed", value: statusCounts.closed || 0, color: "#10b981" }
    ],
    monthlyPerformance: (() => {
      // Simple last-6-months leads-per-month metric from connectedStatusDate
      const now = new Date();
      const months = Array.from({ length: 6 }).map((_, idx) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
        const label = d.toLocaleString('en-US', { month: 'short' });
        const value = (leadsData || []).filter(l => {
          const dateStr = l.connectedStatusDate || l.finalStatusDate;
          if (!dateStr) return false;
          const dt = new Date(dateStr);
          return dt.getFullYear() === d.getFullYear() && dt.getMonth() === d.getMonth();
        }).length;
        return { label, value, color: '#3b82f6' };
      });
      // Highlight latest month if it's the max
      const max = Math.max(0, ...months.map(m => m.value));
      return months.map((m, i) => ({ ...m, color: i === months.length - 1 && m.value === max ? '#10b981' : '#3b82f6' }));
    })(),
    kpis: [
      {
        title: "Lead Response Time",
        value: "0 hrs",
        target: "< 1 hr",
        status: "warning",
        icon: Clock,
        color: "bg-orange-50 text-orange-600 border-orange-200"
      },
      {
        title: "Follow-up Rate",
        value: `${totalLeads > 0 ? Math.round(((statusCounts.connected || 0) / totalLeads) * 100) : 0}%`,
        target: "> 85%",
        status: "warning",
        icon: TrendingUp,
        color: "bg-orange-50 text-orange-600 border-orange-200"
      },
      {
        title: "Customer Satisfaction",
        value: "0/5",
        target: "> 4.5",
        status: "warning",
        icon: CheckCircle,
        color: "bg-orange-50 text-orange-600 border-orange-200"
      },
      {
        title: "Quotation Success",
        value: `${totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0}%`,
        target: "> 70%",
        status: "warning",
        icon: CheckCircle,
        color: "bg-orange-50 text-orange-600 border-orange-200"
      },
    ]
  }

  return (
    <div className="space-y-6 pb-16 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Performance Dashboard</h1>
          <p className="text-sm text-gray-500">Track your targets and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input type="text" placeholder="dd-mm-yyyy" className="px-3 py-2 border rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      {/* Target Cards (top row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(performanceData.targets).map(([key, target]) => {
          const progress = (target.current / target.target) * 100;
          const remaining = target.target - target.current;
          const remainingPct = Math.max(0, Math.ceil(100 - progress));
          return (
            <div key={key} className="relative bg-white border rounded-lg p-4 shadow-sm">
              {remaining > 0 && (
                <div className="absolute top-0 right-0 text-xs font-semibold px-2 py-1 rounded-bl-lg bg-red-100 text-red-700">{remaining.toLocaleString()} to go</div>
              )}
              <div className="text-sm font-medium text-gray-700 mb-2">{target.label}</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold text-gray-900">{key === 'conversionRate' ? `${target.current}` : `${target.current}`}</span>
                <span className="text-sm text-gray-500">{key === 'conversionRate' ? '/ ' + target.target : '/ ' + target.target}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${Math.min(progress, 100)}%` }}></div>
              </div>
              <div className="mt-1 text-xs text-red-600 font-medium">{remainingPct}% remaining</div>
              <div className="text-xs text-red-600">{key === 'revenue' ? `${(remaining).toLocaleString()} more needed to hit target` : `${remaining} more needed to hit target`}</div>
            </div>
          );
        })}
      </div>

      {/* KPI Cards */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
          <h2 className="text-lg font-semibold text-gray-900">Key Performance Indicators</h2>
        </div>
        <p className="text-sm mb-2 text-gray-500">Track important metrics that impact your success</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {performanceData.kpis.map((kpi, index) => (
          <div key={index} className={`bg-white rounded-lg shadow-sm border p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1 ${kpi.color}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center">
                <kpi.icon className="w-5 h-5" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-sm text-gray-600">Target: {kpi.target}</p>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-700">{kpi.title}</h3>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Lead Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-4 h-4 inline-block rounded-full bg-purple-500"></span>
            <h3 className="text-lg font-semibold text-gray-800">Lead Status Distribution</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Center total as donut substitute */}
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center shadow-inner">
                <span className="text-3xl font-bold text-gray-800">{performanceData.leadStatusData.reduce((a,b)=>a + (b.value||0),0)}</span>
                <span className="absolute bottom-4 text-xs text-gray-500">Total</span>
              </div>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-1 gap-3">
              {performanceData.leadStatusData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-sm text-gray-700 flex-1">{item.label}:</span>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-4 h-4 inline-block rounded-sm bg-green-500"></span>
            <h3 className="text-lg font-semibold text-gray-800">Monthly Performance</h3>
          </div>
          <div className="flex items-end justify-between min-h-48 space-x-2">
            {performanceData.monthlyPerformance.map((month, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <span className="text-xs text-gray-600 mb-1">{month.value}</span>
                <div 
                  className="w-full rounded-t"
                  style={{ 
                    height: `${Math.max((month.value / 110) * 100, 8)}%`,
                    backgroundColor: month.color
                  }}
                  title={`${month.label}: ${month.value}`}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{month.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-500">Performance Score (0-100)</span>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-4 h-4 inline-block rounded-full bg-yellow-500"></span>
          <h3 className="text-lg font-semibold text-gray-800">Performance Summary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">87%</div>
            <div className="text-sm text-gray-600">Overall Target Achievement</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">2</div>
            <div className="text-sm text-gray-600">Areas Need Improvement</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">3</div>
            <div className="text-sm text-gray-600">Area Exceeding Target</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toolbox Content
const ToolboxContent = () => {
  const tools = [
    { 
      name: 'Lead Generator', 
      description: 'Generate new leads automatically', 
      icon: <Users className="w-6 h-6" />,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    { 
      name: 'Email Templates', 
      description: 'Pre-built email templates', 
      icon: <Mail className="w-6 h-6" />,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    { 
      name: 'Call Scripts', 
      description: 'Sales call scripts and guidelines', 
      icon: <Phone className="w-6 h-6" />,
      gradient: 'from-purple-500 to-indigo-500',
      bgGradient: 'from-purple-50 to-indigo-50'
    },
    { 
      name: 'Presentation Tools', 
      description: 'Marketing presentation templates', 
      icon: <BarChart3 className="w-6 h-6" />,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                {tool.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{tool.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Use Tool
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


export default MarketingSalespersonDashboard;
