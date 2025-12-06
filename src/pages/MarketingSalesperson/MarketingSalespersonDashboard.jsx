import React, { useState, useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  UserCheck, 
  ArrowRight,
  UserPlus,
  Calendar, 
  CheckCircle, 
  Flame,
  Thermometer,
  Snowflake,
  PieChart as PieChartIcon,
  BarChart3,
  Megaphone,
  Target,
  Award,
  TrendingDown,
  Table,
  Mail,
  MailOpen,
  MousePointerClick,
  TrendingUp as TrendingUpIcon,
  LineChart as LineChartIcon,
  ArrowRightCircle,
  DollarSign,
  Share2,
  ClipboardList,
  Clock,
  FileText,
  Phone,
  Send,
  Calendar as CalendarIcon,
  Video,
  AlertCircle,
  Eye,
  MapPin,
  Monitor,
  User,
  Smartphone,
  Laptop,
  Activity
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AllLeads from './MarketingSalespersonLeads';
import Visits from './MarketingSalespersonVisits';
import Orders from './MarketingSalespersonOrders';
import MarketingFollowUpBase from './FollowUp/MarketingFollowUpBase';
import MarketingSalespersonProfile from './MarketingSalespersonProfile';
import MarketingSalespersonCalendar from './MarketingSalespersonCalendar';
import AssignedMeetings from './AssignedMeetings';
import CheckInHistory from './CheckInHistory';
import { useMarketingFollowUpData } from './FollowUp/MarketingFollowUpDataContext';

const MarketingSalespersonDashboard = ({ activeView, setActiveView }) => {
  const { getLeadsByStatus, loading, leadsData, getStatusCounts } = useMarketingFollowUpData();
  
  // Add error handling
  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }
  
  // Fallback if data is not available
  if (!leadsData || !getStatusCounts) {
    return <div className="p-6 text-center">No data available</div>;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <MarketingDashboardContent customers={leadsData} getStatusCounts={getStatusCounts} />;
      case 'all-leads':
        return <AllLeads />;
      case 'follow-up':
        return <MarketingFollowUpBase status="all" customData={getLeadsByStatus('all')} />;
      case 'follow-up-connected':
        return <MarketingFollowUpBase status="connected" customData={getLeadsByStatus('connected')} />;
      case 'follow-up-not-connected':
        return <MarketingFollowUpBase status="not-connected" customData={getLeadsByStatus('not-connected')} />;
      case 'follow-up-todays-meeting':
        return <MarketingFollowUpBase status="todays-meeting" customData={getLeadsByStatus('todays-meeting')} />;
      case 'follow-up-converted':
        return <MarketingFollowUpBase status="converted" customData={getLeadsByStatus('converted')} />;
      case 'follow-up-closed':
        return <MarketingFollowUpBase status="closed" customData={getLeadsByStatus('closed')} />;
      case 'visits':
        return <Visits />;
      case 'orders':
        return <Orders />;
      case 'calendar':
        return <MarketingSalespersonCalendar />;
      case 'profile':
        return <MarketingSalespersonProfile />;
      case 'assigned-meetings':
        return <AssignedMeetings />;
      case 'checkin-history':
        return <CheckInHistory />;
      default:
        return <MarketingDashboardContent customers={leadsData} getStatusCounts={getStatusCounts} />;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {renderContent()}
    </div>
  );
};

// Marketing Dashboard Content - Clean structure ready for new sections
const MarketingDashboardContent = ({ customers, getStatusCounts }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateFilter, setDateFilter] = useState('');
  const leadsData = customers || [];

  // Handle date filter change
  const handleDateFilterChange = (selectedDate) => {
    setDateFilter(selectedDate);
  };

  // Demo data for Section 1 - High-Level Business Overview
  const overviewMetrics = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);

    const newEnquiriesThisWeek = leadsData.filter(lead => {
      const leadDate = new Date(lead.date || lead.createdAt || lead.created_at);
      return leadDate >= weekAgo;
    }).length;

    return {
      totalLeads: leadsData.length || 342,
      newEnquiriesThisWeek: newEnquiriesThisWeek || 28,
      ordersConfirmedThisMonth: 156,
      revenueThisQuarter: 28500000,
      paymentsPending: 4250000,
      ordersInProduction: 23,
      ordersDispatched: 89,
      activeDealers: 45
    };
  }, [leadsData]);

  // Demo data for Section 2 - Sales Performance
  const monthlySalesTrend = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      value: Math.floor(Math.random() * 5000000) + 2000000
    }));
  }, []);

  const regionWiseSales = useMemo(() => [
    { region: 'Bhopal', sales: 1250000 },
    { region: 'Indore', sales: 980000 },
    { region: 'Gwalior', sales: 750000 },
    { region: 'UP West', sales: 1100000 },
    { region: 'Delhi NCR', sales: 1450000 },
    { region: 'Raipur', sales: 680000 },
    { region: 'Jabalpur', sales: 520000 }
  ], []);

  const topDistributors = useMemo(() => [
    { distributor: 'Sharma Cables Pvt Ltd', orders: 45, value: 2850000, pending: 425000, status: 'Active' },
    { distributor: 'Madhya Pradesh Electricals', orders: 38, value: 2250000, pending: 280000, status: 'Active' },
    { distributor: 'Bhopal Wire House', orders: 32, value: 1980000, pending: 195000, status: 'Active' },
    { distributor: 'Indore Power Solutions', orders: 28, value: 1650000, pending: 320000, status: 'Active' },
    { distributor: 'UP Electrical Distributors', orders: 24, value: 1420000, pending: 150000, status: 'Active' }
  ], []);

  // Demo data for Section 3 - Lead & Enquiry Analysis
  const leadSources = useMemo(() => [
    { name: 'Exhibition', value: 68, color: '#3b82f6' },
    { name: 'Dealer referral', value: 95, color: '#10b981' },
    { name: 'Contractor referral', value: 52, color: '#f59e0b' },
    { name: 'Incoming call', value: 78, color: '#8b5cf6' },
    { name: 'Distributor network', value: 89, color: '#ef4444' },
    { name: 'Website', value: 34, color: '#06b6d4' },
    { name: 'Govt Tender', value: 26, color: '#6b7280' }
  ], []);

  const productEnquiries = useMemo(() => [
    { product: '1.5mm House Wire', enquiries: 125, conversion: 68, trend: '↑' },
    { product: '2.5mm FR Cable', enquiries: 98, conversion: 72, trend: '↑' },
    { product: '10mm Copper Cable', enquiries: 76, conversion: 65, trend: '→' },
    { product: 'LT Aluminium Conductor', enquiries: 89, conversion: 58, trend: '↓' },
    { product: 'Aerial Bunched Cable', enquiries: 112, conversion: 74, trend: '↑' },
    { product: '4mm House Wire', enquiries: 67, conversion: 61, trend: '→' },
    { product: 'XLPE Cable', enquiries: 54, conversion: 69, trend: '↑' }
  ], []);

  // Demo data for Section 4 - Production & Dispatch Tracking
  const productionMetrics = useMemo(() => ({
    inProduction: 23,
    readyForDispatch: 12,
    delayed: 4
  }), []);

  const delayedOrders = useMemo(() => [
    { orderId: 'ORD-2024-1245', customer: 'Sharma Industries', expectedDate: '2024-01-15', actualDate: '2024-01-18', delay: 3 },
    { orderId: 'ORD-2024-1289', customer: 'MP Power Corp', expectedDate: '2024-01-12', actualDate: '2024-01-16', delay: 4 },
    { orderId: 'ORD-2024-1321', customer: 'Bhopal Builders', expectedDate: '2024-01-18', actualDate: '2024-01-22', delay: 4 },
    { orderId: 'ORD-2024-1356', customer: 'Indore Electricals', expectedDate: '2024-01-20', actualDate: '2024-01-24', delay: 4 }
  ], []);

  const dispatchSummary = useMemo(() => ({
    pending: 15,
    shipped: 67,
    delivered: 145
  }), []);

  // Demo data for Section 5 - Payments & Finance
  const outstandingPayments = useMemo(() => ({
    '0-30': 1850000,
    '30-60': 1250000,
    '60-90': 750000,
    '90+': 400000
  }), []);

  const creditLimits = useMemo(() => [
    { customer: 'Sharma Cables Pvt Ltd', used: 425000, limit: 500000, percentage: 85 },
    { customer: 'MP Electricals', used: 380000, limit: 450000, percentage: 84 },
    { customer: 'Bhopal Wire House', used: 295000, limit: 400000, percentage: 74 },
    { customer: 'Indore Power Solutions', used: 320000, limit: 350000, percentage: 91 }
  ], []);

  const topCustomersOutstanding = useMemo(() => [
    { customer: 'Sharma Cables Pvt Ltd', outstanding: 425000, creditLimit: 500000, daysOverdue: 25, status: 'Normal' },
    { customer: 'MP Electricals', outstanding: 380000, creditLimit: 450000, daysOverdue: 18, status: 'Normal' },
    { customer: 'Indore Power Solutions', outstanding: 320000, creditLimit: 350000, daysOverdue: 45, status: 'Warning' },
    { customer: 'Bhopal Wire House', outstanding: 295000, creditLimit: 400000, daysOverdue: 12, status: 'Normal' },
    { customer: 'UP Electrical Distributors', outstanding: 280000, creditLimit: 400000, daysOverdue: 62, status: 'Critical' },
    { customer: 'Gwalior Cables', outstanding: 245000, creditLimit: 350000, daysOverdue: 8, status: 'Normal' },
    { customer: 'Raipur Wire House', outstanding: 220000, creditLimit: 300000, daysOverdue: 38, status: 'Warning' },
    { customer: 'Jabalpur Electricals', outstanding: 195000, creditLimit: 300000, daysOverdue: 15, status: 'Normal' }
  ], []);

  // Demo data for Section 6 - Customer & Dealer Relationship Insights
  const recentDealerVisits = useMemo(() => [
    { dealer: 'Sharma Cables Pvt Ltd', date: '2024-01-22', purpose: 'Order Discussion' },
    { dealer: 'MP Electricals', date: '2024-01-20', purpose: 'Product Demo' },
    { dealer: 'Bhopal Wire House', date: '2024-01-18', purpose: 'Contract Renewal' },
    { dealer: 'Indore Power Solutions', date: '2024-01-15', purpose: 'Price Negotiation' }
  ], []);

  const followUpsDue = useMemo(() => [
    { name: 'Sharma Cables Pvt Ltd', type: 'Dealer', priority: 'High' },
    { name: 'MP Power Corp', type: 'Customer', priority: 'Medium' },
    { name: 'Bhopal Builders', type: 'Customer', priority: 'High' }
  ], []);

  const satisfactionRatings = useMemo(() => ({
    averageRating: 4.3,
    excellent: 142,
    good: 98,
    averageCount: 34,
    poor: 12
  }), []);

  const complaintsStatus = useMemo(() => ({
    open: 8,
    inProgress: 5,
    resolved: 23
  }), []);

  // Demo data for Section 7 - Inventory & Product Insights
  const rawMaterials = useMemo(() => [
    { material: 'Copper', stock: 12500, unit: 'kg', status: 'In Stock', percentage: 75 },
    { material: 'Aluminium', stock: 9800, unit: 'kg', status: 'In Stock', percentage: 65 },
    { material: 'PVC', stock: 4500, unit: 'kg', status: 'Low', percentage: 35 },
    { material: 'Rubber', stock: 3200, unit: 'kg', status: 'Low', percentage: 28 }
  ], []);

  const finishedGoods = useMemo(() => [
    { product: '1.5mm House Wire', quantity: 1250, unit: 'meters' },
    { product: '2.5mm FR Cable', quantity: 980, unit: 'meters' },
    { product: '10mm Copper Cable', quantity: 450, unit: 'meters' },
    { product: 'Aerial Bunched Cable', quantity: 680, unit: 'meters' }
  ], []);

  const lowStockAlerts = useMemo(() => [
    { material: 'PVC', currentStock: 4500, minimumRequired: 8000, shortfall: 3500, priority: 'High' },
    { material: 'Rubber', currentStock: 3200, minimumRequired: 6000, shortfall: 2800, priority: 'High' },
    { product: '4mm House Wire', currentStock: 850, minimumRequired: 1500, shortfall: 650, priority: 'Medium' }
  ], []);

  return (
    <div className="p-6 bg-gray-50 min-h-full scroll-smooth">
      {/* Tab Navigation */}
      <div className="flex gap-6 mb-6">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`gap-2 flex items-center pb-2 border-b-2 ${
            activeTab === 'overview' 
              ? 'text-blue-600 border-blue-600' 
              : 'text-gray-500 border-transparent'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('performance')}
          className={`gap-2 flex items-center pb-2 border-b-2 ${
            activeTab === 'performance' 
              ? 'text-blue-600 border-blue-600' 
              : 'text-gray-500 border-transparent'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Performance
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
      {/* SECTION 1 — High-Level Business Overview */}
      <div className="mb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Leads */}
          <div className="bg-white rounded-lg border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">Total Leads</h3>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{overviewMetrics.totalLeads.toLocaleString('en-IN')}</div>
              <p className="text-xs text-gray-500">All leads generated</p>
          </div>
      </div>

          {/* Card 2: New Enquiries This Week */}
          <div className="bg-white rounded-lg border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">New Enquiries This Week</h3>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-green-600" />
        </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{overviewMetrics.newEnquiriesThisWeek}</div>
              <p className="text-xs text-gray-500">Weekly enquiry count</p>
            </div>
      </div>
      
          {/* Card 3: Orders Confirmed This Month */}
          <div className="bg-white rounded-lg border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">Orders Confirmed This Month</h3>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
            </div>
            </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{overviewMetrics.ordersConfirmedThisMonth}</div>
              <p className="text-xs text-gray-500">Monthly confirmed orders</p>
          </div>
        </div>

          {/* Card 4: Revenue Generated This Quarter */}
          <div className="bg-white rounded-lg border-2 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">Revenue Generated This Quarter</h3>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-orange-600" />
            </div>
            </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">₹{overviewMetrics.revenueThisQuarter.toLocaleString('en-IN')}</div>
              <p className="text-xs text-gray-500">Quarterly revenue</p>
          </div>
        </div>

          {/* Card 5: Payments Pending */}
          <div className="bg-white rounded-lg border-2 border-red-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">Payments Pending</h3>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-red-600" />
            </div>
            </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">₹{overviewMetrics.paymentsPending.toLocaleString('en-IN')}</div>
              <p className="text-xs text-gray-500">Outstanding payments</p>
          </div>
        </div>

          {/* Card 6: Orders in Production */}
          <div className="bg-white rounded-lg border-2 border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">Orders in Production</h3>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Target className="h-5 w-5 text-yellow-600" />
            </div>
            </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{overviewMetrics.ordersInProduction}</div>
              <p className="text-xs text-gray-500">Active production orders</p>
        </div>
      </div>

          {/* Card 7: Orders Dispatched */}
          <div className="bg-white rounded-lg border-2 border-indigo-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">Orders Dispatched</h3>
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-indigo-600" />
        </div>
            </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{overviewMetrics.ordersDispatched}</div>
              <p className="text-xs text-gray-500">Dispatched this month</p>
          </div>
      </div>
      
          {/* Card 8: Dealers / Distributors Active */}
          <div className="bg-white rounded-lg border-2 border-teal-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">Dealers / Distributors Active</h3>
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-teal-600" />
            </div>
            </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{overviewMetrics.activeDealers}</div>
              <p className="text-xs text-gray-500">Active dealer network</p>
          </div>
          </div>
          </div>
        </div>

      {/* SECTION 2 — Sales Performance */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Sales Performance</h2>
            </div>
        <p className="text-sm text-gray-500 mb-4">Track sales trends and distributor performance</p>

        <div className="space-y-6">
          {/* 1. Monthly Sales Trend */}
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Monthly Sales Trend</h3>
                <p className="text-sm text-gray-500">Line chart showing monthly order value</p>
            </div>
              <TrendingUpIcon className="h-5 w-5 text-blue-600" />
          </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySalesTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Order Value (₹)', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Order Value']}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Monthly Order Value"
                />
              </LineChart>
            </ResponsiveContainer>
        </div>

          {/* 2. Region-wise Sales */}
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Region-wise Sales</h3>
                <p className="text-sm text-gray-500">Sales distribution across regions</p>
            </div>
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionWiseSales} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="region" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: '12px' }}
                />
                <YAxis 
                  tick={{ fontSize: '12px' }}
                  label={{ value: 'Sales (₹)', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Sales']}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="sales" fill="#10b981" radius={[8, 8, 0, 0]} name="Region Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 3 — Lead & Enquiry Analysis */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Lead & Enquiry Analysis</h2>
            </div>
        <p className="text-sm text-gray-500 mb-4">Analyze lead sources and product demand</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 1. Lead Source Breakdown */}
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Lead Source Breakdown</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadSources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {leadSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Exhibition</span>
          </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Dealer referral</span>
          </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Contractor referral</span>
            </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>Incoming call</span>
        </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Distributor network</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span>Website</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                <span>Govt Tender</span>
              </div>
        </div>
      </div>

          {/* 2. Enquiry → Order Conversion Rate */}
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Enquiry → Order Conversion Rate</h3>
            </div>
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center">
                <div className="text-6xl font-bold text-green-600 mb-2">68%</div>
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Enquiries:</span>
                    <span className="font-semibold">442</span>
          </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Orders Converted:</span>
                    <span className="font-semibold">301</span>
                  </div>
                </div>
            </div>
          </div>
          </div>
        </div>

        {/* 3. Product-wise Enquiries */}
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Table className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Product-wise Enquiries</h3>
            </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Enquiries
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Conversion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productEnquiries.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.product}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.enquiries}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.conversion}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-lg font-semibold ${
                        product.trend === '↑' ? 'text-green-600' : 
                        product.trend === '↓' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {product.trend}
            </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
                </div>

      {/* SECTION 4 — Production & Dispatch Tracking */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Production & Dispatch Tracking</h2>
              </div>
        <p className="text-sm text-gray-500 mb-4">Monitor production status and dispatch operations</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* 1. Orders in Production */}
          <div className="bg-white rounded-lg border-2 border-yellow-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Orders in Production</h3>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 text-yellow-600" />
          </div>
        </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{productionMetrics.inProduction}</div>
            <p className="text-xs text-gray-500">Active production orders</p>
      </div>

          {/* 2. Orders Ready for Dispatch */}
          <div className="bg-white rounded-lg border-2 border-green-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Orders Ready for Dispatch</h3>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
        </div>
          </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{productionMetrics.readyForDispatch}</div>
            <p className="text-xs text-gray-500">Ready to ship</p>
      </div>

          {/* 3. Delayed Orders */}
          <div className="bg-white rounded-lg border-2 border-red-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Delayed Orders</h3>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
        </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{productionMetrics.delayed}</div>
            <p className="text-xs text-gray-500">Behind schedule</p>
                </div>
              </div>

        {/* Delayed Orders List */}
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delayed Orders Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Expected Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actual Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Delay (Days)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {delayedOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.orderId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.expectedDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-red-600">{order.actualDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        {order.delay} days
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Dispatch Summary */}
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispatch Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Pending</span>
                <div className="w-8 h-8 bg-yellow-200 rounded-full"></div>
      </div>
              <div className="text-2xl font-bold text-gray-900">{dispatchSummary.pending}</div>
    </div>
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Shipped</span>
                <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
      </div>
              <div className="text-2xl font-bold text-gray-900">{dispatchSummary.shipped}</div>
    </div>
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Delivered</span>
                <div className="w-8 h-8 bg-green-200 rounded-full"></div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{dispatchSummary.delivered}</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5 — Payments & Finance */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Payments & Finance</h2>
            </div>
        <p className="text-sm text-gray-500 mb-4">Track outstanding payments and credit limits</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 1. Delay Payments (Aging Report) */}
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delay Payments (Aging Report)</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <span className="text-sm font-medium text-gray-700">0-30 days</span>
                  <p className="text-xs text-gray-500">Current</p>
                </div>
                <span className="text-lg font-bold text-gray-900">₹{outstandingPayments['0-30'].toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <span className="text-sm font-medium text-gray-700">30-60 days</span>
                  <p className="text-xs text-gray-500">Attention needed</p>
                </div>
                <span className="text-lg font-bold text-gray-900">₹{outstandingPayments['30-60'].toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <span className="text-sm font-medium text-gray-700">60-90 days</span>
                  <p className="text-xs text-gray-500">Overdue</p>
                </div>
                <span className="text-lg font-bold text-gray-900">₹{outstandingPayments['60-90'].toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <span className="text-sm font-medium text-gray-700">90+ days</span>
                  <p className="text-xs text-gray-500">Critical</p>
                </div>
                <span className="text-lg font-bold text-gray-900">₹{outstandingPayments['90+'].toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* 2. Customer Credit Limits */}
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Credit Limits</h3>
            <div className="space-y-3">
              {creditLimits.map((customer, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{customer.customer}</span>
                    <span className="text-xs text-gray-500">Usage</span>
        </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div 
                      className={`h-2 rounded-full ${
                        customer.percentage >= 90 ? 'bg-red-600' : 
                        customer.percentage >= 75 ? 'bg-orange-600' : 'bg-blue-600'
                      }`} 
                      style={{ width: `${customer.percentage}%` }}
                    ></div>
      </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>₹{customer.used.toLocaleString('en-IN')} / ₹{customer.limit.toLocaleString('en-IN')}</span>
                    <span>{customer.percentage}%</span>
              </div>
              </div>
              ))}
            </div>
          </div>
      </div>

        {/* 3. Top 10 Customers (Delay Payments) */}
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Customers (Delay Payments)</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Outstanding Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Credit Limit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Days Overdue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topCustomersOutstanding.map((customer, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{customer.customer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{customer.outstanding.toLocaleString('en-IN')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{customer.creditLimit.toLocaleString('en-IN')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.daysOverdue} days</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        customer.status === 'Critical' ? 'bg-red-100 text-red-800' :
                        customer.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
      </div>
    </div>
      </div>

      {/* SECTION 6 — Customer & Dealer Relationship Insights */}
      <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Customer & Dealer Relationship Insights</h2>
          </div>
        <p className="text-sm text-gray-500 mb-4">Manage customer relationships and dealer network</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Recent Dealer Visits */}
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Dealer Visits</h3>
              </div>
            <div className="space-y-3">
              {recentDealerVisits.map((visit, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{visit.dealer}</span>
                    <span className="text-xs text-gray-500">{visit.date}</span>
            </div>
                  <p className="text-xs text-gray-500">{visit.purpose}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Follow-ups Due Today */}
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Follow-ups Due Today</h3>
            </div>
            <div className="space-y-3">
              {followUpsDue.map((followUp, index) => (
                <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{followUp.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      followUp.priority === 'High' ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'
                    }`}>
                      {followUp.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{followUp.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 7 — Inventory & Product Insights */}
      <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
          <Table className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Inventory & Product Insights</h2>
          </div>
        <p className="text-sm text-gray-500 mb-4">Monitor raw materials and finished goods stock</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 1. Raw Material Status */}
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw Material Status</h3>
            <div className="space-y-3">
              {rawMaterials.map((material, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{material.material}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      material.status === 'Low' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {material.status}
                    </span>
              </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        material.percentage < 40 ? 'bg-red-600' : 'bg-green-600'
                      }`}
                      style={{ width: `${material.percentage}%` }}
                    ></div>
            </div>
                  <p className="text-xs text-gray-500 mt-1">Stock: {material.stock.toLocaleString('en-IN')} {material.unit}</p>
          </div>
        ))}
            </div>
          </div>

          {/* 2. Finished Goods Ready Stock */}
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Finished Goods Ready Stock</h3>
            <div className="space-y-3">
              {finishedGoods.map((product, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{product.product}</span>
                    <span className="text-xs text-gray-500">Quantity</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{product.quantity.toLocaleString('en-IN')} {product.unit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Low Stock Alerts */}
        <div className="bg-white rounded-lg border-2 border-red-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
              </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Material/Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Minimum Required
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Shortfall
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lowStockAlerts.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.material || item.product}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.currentStock.toLocaleString('en-IN')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.minimumRequired.toLocaleString('en-IN')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-red-600 font-medium">{item.shortfall.toLocaleString('en-IN')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.priority === 'High' ? 'bg-red-100 text-red-800' :
                        item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
      </div>
        </>
      )}

      {activeTab === 'performance' && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm max-w-2xl w-full p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-blue-100">
              <Target className="h-10 w-10 text-blue-600" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Feature Upcoming
            </h2>
            
            <p className="text-lg mb-6 text-gray-600">
              This feature will be available soon
            </p>
            
            <div className="space-y-4 mb-8 text-gray-700">
              <div className="flex items-center justify-center gap-3">
                <Calendar className="h-6 w-6 text-blue-600" />
                <span className="text-base font-medium">Performance Tracking</span>
              </div>
              
              <div className="flex items-center justify-center gap-3">
                <Award className="h-6 w-6 text-yellow-600" />
                <span className="text-base font-medium">Performance Reports</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              You will be able to view your performance metrics and detailed reports here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingSalespersonDashboard;
