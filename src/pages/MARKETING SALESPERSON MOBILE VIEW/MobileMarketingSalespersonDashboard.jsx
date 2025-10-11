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

const MobileMarketingSalespersonDashboard = ({ activeView, setActiveView }) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <MobileMarketingDashboardContent selectedTab={selectedTab} setSelectedTab={setSelectedTab} />;
      case 'all-leads':
        return <MobileAllLeads />;
      case 'visits':
        return <MobileVisits />;
      case 'orders':
        return <MobileOrders />;
      case 'toolbox':
        return <MobileToolboxContent />;
      case 'doc-style':
        return <MobileDocStyleDashboard />;
      default:
        return <MobileMarketingDashboardContent selectedTab={selectedTab} setSelectedTab={setSelectedTab} />;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {renderContent()}
    </div>
  );
};

// Mobile Marketing Dashboard Content
const MobileMarketingDashboardContent = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Mobile Tab Navigation */}
      <div className="mb-4">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md font-medium text-sm transition-colors ${
              selectedTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </button>
          <button
            onClick={() => setSelectedTab('performance')}
            className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md font-medium text-sm transition-colors ${
              selectedTab === 'performance'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Performance</span>
          </button>
          <button
            onClick={() => setSelectedTab('doc-style')}
            className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md font-medium text-sm transition-colors ${
              selectedTab === 'doc-style'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Quotes</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && <MobileOverviewContent />}
      {selectedTab === 'performance' && <MobilePerformanceContent />}
      {selectedTab === 'doc-style' && <MobileDocStyleDashboard />}
    </div>
  );
};

// Mobile Overview Content
const MobileOverviewContent = () => {
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
        count: "0",
        subtitle: "No pending leads",
        icon: Clock,
        color: "bg-orange-50 text-orange-600 border-orange-200"
      },
      {
        title: "Meeting scheduled",
        count: "0",
        subtitle: "No meetings scheduled",
        icon: Calendar,
        color: "bg-purple-50 text-purple-600 border-purple-200"
      },
      {
        title: "Follow Up",
        count: "0",
        subtitle: "No follow-ups required",
        icon: TrendingUp,
        color: "bg-blue-50 text-blue-600 border-blue-200"
      },
      {
        title: "Win Leads",
        count: "0",
        subtitle: "No successful conversions",
        icon: CheckCircle,
        color: "bg-green-50 text-green-600 border-green-200"
      },
      {
        title: "Not Interested",
        count: "0",
        subtitle: "No declined leads",
        icon: XCircle,
        color: "bg-red-50 text-red-600 border-red-200"
      },
      {
        title: "Loose Leads",
        count: "0",
        subtitle: "No unreachable leads",
        icon: AlertCircle,
        color: "bg-gray-50 text-gray-600 border-gray-200"
      }
    ]
  }

  return (
    <div className="space-y-4 pb-16">
      {/* Mobile Key Metrics Cards */}
      <div className="grid grid-cols-2 gap-3">
        {overviewData.metrics.map((metric, index) => (
          <div key={index} className={`bg-white rounded-lg shadow-sm border p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg ${metric.color}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-white/50 rounded-lg flex items-center justify-center">
                <metric.icon className="w-4 h-4" />
              </div>
              {metric.trendUp ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">{metric.title}</p>
            <p className="text-lg font-bold text-gray-900">{metric.value}</p>
            <p className="text-xs text-gray-500">{metric.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Mobile Lead Status Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="mb-3">
          <div className="flex items-center mb-2">
            <Clock className="w-4 h-4 text-gray-600 mr-2" />
            <h3 className="text-base font-semibold text-gray-800">Lead Status Summary</h3>
          </div>
          <p className="text-xs text-gray-500">Overview of your leads by status</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {overviewData.leadStatuses.map((status, index) => (
            <div key={index} className={`flex items-center p-3 rounded-lg border transition-all duration-300 hover:scale-105 ${status.color}`}>
              <div className="w-8 h-8 bg-white/50 rounded-lg flex items-center justify-center mr-2">
                <status.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600">{status.title}</p>
                <p className="text-lg font-bold text-gray-900">{status.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Recent Orders Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
              <ShoppingCart className="w-3 h-3 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-blue-800">Recent Orders</h3>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {[
            { leadNumber: 'LD-2025-001', customer: 'Rajesh Kumar', product: 'Industrial Motor 5HP', amount: '₹50,000', status: 'Confirmed' },
            { leadNumber: 'LD-2025-002', customer: 'Priya Sharma', product: 'LED Street Light 100W', amount: '₹1,75,000', status: 'Delivered' },
            { leadNumber: 'LD-2025-003', customer: 'Amit Patel', product: 'Power Distribution Panel', amount: '₹85,000', status: 'Processing' }
          ].map((order, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Hash className="w-3 h-3 text-blue-600" />
                  <p className="text-sm font-medium text-gray-900">{order.leadNumber}</p>
                </div>
                <p className="text-xs text-gray-600">{order.customer}</p>
                <p className="text-xs text-gray-500">{order.product}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{order.amount}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Mobile Performance Content
const MobilePerformanceContent = () => {
  const performanceData = {
    targets: {
      monthlyLeads: { current: 0, target: 100, label: "Monthly Leads" },
      conversionRate: { current: 0, target: 25, label: "Conversion Rate (%)" },
      revenue: { current: 0, target: 300000, label: "Monthly Revenue (₹)" },
      calls: { current: 0, target: 300, label: "Daily Calls" }
    },
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
        value: "0%",
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
        value: "0%",
        target: "> 70%",
        status: "warning",
        icon: CheckCircle,
        color: "bg-orange-50 text-orange-600 border-orange-200"
      }
    ]
  }

  return (
    <div className="space-y-4 pb-8">
      {/* Mobile KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        {performanceData.kpis.map((kpi, index) => (
          <div key={index} className={`bg-white rounded-lg shadow-sm border p-4 transition-all duration-300 hover:scale-105 ${kpi.color}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-white/50 rounded-lg flex items-center justify-center">
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-xs font-medium text-gray-700 mb-1">{kpi.title}</h3>
            <p className="text-lg font-bold">{kpi.value}</p>
            <p className="text-xs text-gray-600">Target: {kpi.target}</p>
          </div>
        ))}
      </div>

      {/* Mobile Performance Targets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Performance Targets</h3>
        <div className="space-y-3">
          {Object.entries(performanceData.targets).map(([key, target]) => (
            <div key={key} className="p-3 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-600">{target.label}</span>
                <span className="text-xs text-gray-900">{target.current}/{target.target}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((target.current / target.target) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {((target.current / target.target) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Mobile Quotation-style Dashboard View
const MobileDocStyleDashboard = () => {
  return (
    <div className="bg-white min-h-[85vh] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-8">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quotation Style</h3>
          <p className="text-gray-600">Mobile quotation view will be implemented here</p>
        </div>
      </div>
    </div>
  );
};

// Mobile Toolbox Content
const MobileToolboxContent = () => {
  const tools = [
    { 
      name: 'Lead Generator', 
      description: 'Generate new leads automatically', 
      icon: <Users className="w-5 h-5" />,
    },
    { 
      name: 'Email Templates', 
      description: 'Pre-built email templates', 
      icon: <Mail className="w-5 h-5" />,
    },
    { 
      name: 'Call Scripts', 
      description: 'Sales call scripts and guidelines', 
      icon: <Phone className="w-5 h-5" />,
    },
    { 
      name: 'Presentation Tools', 
      description: 'Marketing presentation templates', 
      icon: <BarChart3 className="w-5 h-5" />,
    }
  ];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 gap-4">
        {tools.map((tool, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                {tool.icon}
              </div>
              <h3 className="text-base font-semibold text-gray-800">{tool.name}</h3>
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

// Simple mobile components for other views
const MobileAllLeads = () => (
  <div className="p-4 bg-gray-50 min-h-screen">
    <h1 className="text-xl font-bold text-gray-900 mb-4">All Leads</h1>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <p className="text-gray-600 text-center py-8">Mobile leads view will be implemented here</p>
    </div>
  </div>
);

const MobileVisits = () => (
  <div className="p-4 bg-gray-50 min-h-screen">
    <h1 className="text-xl font-bold text-gray-900 mb-4">Visits</h1>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <p className="text-gray-600 text-center py-8">Mobile visits view will be implemented here</p>
    </div>
  </div>
);

const MobileOrders = () => (
  <div className="p-4 bg-gray-50 min-h-screen">
    <h1 className="text-xl font-bold text-gray-900 mb-4">Orders</h1>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <p className="text-gray-600 text-center py-8">Mobile orders view will be implemented here</p>
    </div>
  </div>
);

export default MobileMarketingSalespersonDashboard;