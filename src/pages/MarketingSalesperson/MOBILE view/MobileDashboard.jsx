import React, { useMemo, useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  UserCheck, 
  ArrowRight,
  UserPlus,
  Calendar, 
  CheckCircle, 
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  DollarSign,
  Clock,
  Table,
  MapPin,
  AlertCircle,
  Award,
  Phone,
  Package,
  Truck
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMarketingFollowUpData } from '../FollowUp/MarketingFollowUpDataContext';

// Simple Chart Components (matching salesperson dashboard style)
function CustomBarChart({ data, height = 200 }) {
  const maxValue = Math.max(...data.map(item => item.value))
  const barWidth = 40
  const spacing = 20
  const chartWidth = data.length * (barWidth + spacing)
  
  return (
    <div className="flex items-end justify-center space-x-2 h-full">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <div 
            className="bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
            style={{
              width: `${barWidth}px`,
              height: `${(item.value / maxValue) * (height - 30)}px`,
              minHeight: '4px'
            }}
          />
          <span className="text-xs text-gray-600 mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function CustomPieChart({ data, size = 200 }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercentage = 0
  
  if (total === 0 || !data || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-400">0</div>
          <div className="text-sm text-gray-500">No Data</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative transition-all duration-300 hover:scale-110" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100
          const startAngle = (cumulativePercentage / 100) * 360
          const endAngle = ((cumulativePercentage + percentage) / 100) * 360
          cumulativePercentage += percentage

          const radius = size / 2 - 10
          const centerX = size / 2
          const centerY = size / 2

          const startAngleRad = (startAngle * Math.PI) / 180
          const endAngleRad = (endAngle * Math.PI) / 180

          const x1 = centerX + radius * Math.cos(startAngleRad)
          const y1 = centerY + radius * Math.sin(startAngleRad)
          const x2 = centerX + radius * Math.cos(endAngleRad)
          const y2 = centerY + radius * Math.sin(endAngleRad)

          const largeArcFlag = percentage > 50 ? 1 : 0

          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ')

          return (
            <path
              key={index}
              d={pathData}
              fill={item.color}
              stroke="white"
              strokeWidth="2"
              className="transition-all duration-300 hover:opacity-80 hover:stroke-4"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center transition-all duration-300 hover:scale-110">
          <div className="text-2xl font-bold text-gray-700">{total}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
      </div>
    </div>
  )
}

export default function MobileDashboard() {
  const { leadsData } = useMarketingFollowUpData();
  const customers = leadsData || [];
  const [activeTab, setActiveTab] = useState('overview');

  // Demo data for Section 1 - High-Level Business Overview
  const overviewMetrics = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newEnquiriesThisWeek = customers.filter(lead => {
      const leadDate = new Date(lead.date || lead.createdAt || lead.created_at);
      return leadDate >= weekAgo;
    }).length;

    return {
      totalLeads: customers.length || 342,
      newEnquiriesThisWeek: newEnquiriesThisWeek || 28,
      ordersConfirmedThisMonth: 156,
      revenueThisQuarter: 28500000,
      paymentsPending: 4250000,
      ordersInProduction: 23,
      ordersDispatched: 89,
      activeDealers: 45
    };
  }, [customers]);

  // Demo data for Section 2 - Sales Performance
  const monthlySalesTrend = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      label: month,
      value: Math.floor(Math.random() * 5000000) + 2000000
    }));
  }, []);

  const regionWiseSales = useMemo(() => [
    { label: 'Bhopal', value: 1250000 },
    { label: 'Indore', value: 980000 },
    { label: 'Gwalior', value: 750000 },
    { label: 'UP West', value: 1100000 },
    { label: 'Delhi NCR', value: 1450000 },
    { label: 'Raipur', value: 680000 },
    { label: 'Jabalpur', value: 520000 }
  ], []);

  // Demo data for Section 3 - Lead & Enquiry Analysis
  const leadSources = useMemo(() => [
    { label: 'Exhibition', value: 68, color: '#3b82f6' },
    { label: 'Dealer referral', value: 95, color: '#10b981' },
    { label: 'Contractor referral', value: 52, color: '#f59e0b' },
    { label: 'Incoming call', value: 78, color: '#8b5cf6' },
    { label: 'Distributor network', value: 89, color: '#ef4444' },
    { label: 'Website', value: 34, color: '#06b6d4' },
    { label: 'Govt Tender', value: 26, color: '#6b7280' }
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

  // Format metrics for display (matching salesperson dashboard structure)
  const businessMetrics = [
    {
      title: "Total Leads",
      value: overviewMetrics.totalLeads.toString(),
      subtitle: "All leads generated",
      icon: Users,
      color: "bg-blue-50 text-blue-600 border-blue-200",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "New Enquiries",
      value: overviewMetrics.newEnquiriesThisWeek.toString(),
      subtitle: "This week",
      icon: UserPlus,
      color: "bg-green-50 text-green-600 border-green-200",
      trend: "+5%",
      trendUp: true
    },
    {
      title: "Orders Confirmed",
      value: overviewMetrics.ordersConfirmedThisMonth.toString(),
      subtitle: "This month",
      icon: CheckCircle,
      color: "bg-purple-50 text-purple-600 border-purple-200",
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Revenue",
      value: `₹${(overviewMetrics.revenueThisQuarter / 10000000).toFixed(1)}Cr`,
      subtitle: "This quarter",
      icon: DollarSign,
      color: "bg-orange-50 text-orange-600 border-orange-200",
      trend: "+15%",
      trendUp: true
    },
  ];

  const statusCards = [
    {
      title: "Payments Pending",
      count: `₹${(overviewMetrics.paymentsPending / 100000).toFixed(1)}L`,
      subtitle: "Outstanding payments",
      icon: Clock,
      color: "bg-red-50 text-red-600 border-red-200",
    },
    {
      title: "In Production",
      count: overviewMetrics.ordersInProduction.toString(),
      subtitle: "Active orders",
      icon: Target,
      color: "bg-yellow-50 text-yellow-600 border-yellow-200",
    },
    {
      title: "Dispatched",
      count: overviewMetrics.ordersDispatched.toString(),
      subtitle: "This month",
      icon: Truck,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      title: "Active Dealers",
      count: overviewMetrics.activeDealers.toString(),
      subtitle: "Dealer network",
      icon: UserCheck,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Tab Navigation */}
      <div className="flex items-center gap-4 mb-4 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`flex-1 flex items-center justify-center gap-2 pb-3 border-b-2 ${
            activeTab === 'overview' 
              ? 'text-blue-600 border-blue-600' 
              : 'text-gray-500 border-transparent'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">Overview</span>
        </button>
        <button 
          onClick={() => setActiveTab('performance')}
          className={`flex-1 flex items-center justify-center gap-2 pb-3 border-b-2 ${
            activeTab === 'performance' 
              ? 'text-blue-600 border-blue-600' 
              : 'text-gray-500 border-transparent'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span className="text-sm font-medium">Performance</span>
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
      {/* SECTION 1 — High-Level Business Overview */}
      <div className="space-y-4 mb-6">

        <div className="grid grid-cols-2 gap-1">
          {businessMetrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div key={index} className={`p-2 rounded border ${metric.color} group text-center`}>
                <Icon className="h-3 w-3 mx-auto mb-1" />
                <h3 className="font-semibold text-xs mb-1">{metric.title}</h3>
                <div className="text-sm font-bold mb-1">{metric.value}</div>
                <div className={`flex items-center justify-center text-xs font-semibold px-1 py-0.5 rounded-full ${
                  metric.trendUp ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                }`}>
                  {metric.trendUp ? (
                    <TrendingUp className="w-2 h-2 mr-1" />
                  ) : (
                    <TrendingUp className="w-2 h-2 mr-1" />
                  )}
                  {metric.trend}
                </div>
                <p className="text-xs opacity-75 mt-1 leading-tight">{metric.subtitle}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Status Cards */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Operations Status</h2>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {statusCards.map((status, index) => {
            const Icon = status.icon
            return (
              <div key={index} className={`p-2 rounded border ${status.color} group text-center`}>
                <Icon className="h-3 w-3 mx-auto mb-1" />
                <h3 className="font-semibold text-xs">{status.title}</h3>
                <div className="text-sm font-bold">{status.count}</div>
                <p className="text-xs opacity-75 text-center leading-tight">{status.subtitle}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-4">
        {/* Monthly Sales Trend */}
        <div className="p-4 rounded-xl border-2 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Monthly Sales Trend</h3>
          </div>
          <div className="h-48">
            <CustomBarChart data={monthlySalesTrend} height={150} />
          </div>
          <div className="mt-2 text-center">
            <span className="text-sm text-gray-500">Monthly Order Value</span>
          </div>
        </div>

        {/* Region-wise Sales */}
        <div className="p-4 rounded-xl border-2 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">Region-wise Sales</h3>
          </div>
          <div className="h-48">
            <CustomBarChart data={regionWiseSales} height={150} />
          </div>
          <div className="mt-2 text-center">
            <span className="text-sm text-gray-500">Sales Distribution by Region</span>
          </div>
        </div>

        {/* Lead Source Pie Chart */}
        <div className="p-4 rounded-xl border-2 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Lead Sources</h3>
          </div>
          <div className="flex items-center justify-center mb-4">
            <CustomPieChart data={leadSources} size={150} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {leadSources.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.label}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="p-4 rounded-xl border-2 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">Enquiry → Order Conversion</h3>
          </div>
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">68%</div>
              <p className="text-sm text-gray-500 mb-4">Conversion Rate</p>
              <div className="space-y-2 text-sm">
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

        {/* Production & Dispatch Status */}
        <div className="p-4 rounded-xl border-2 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Production & Dispatch</h3>
          </div>
          <div className="grid grid-cols-3 gap-1 mb-4">
            <div className="p-2 rounded border bg-yellow-50 text-yellow-600 border-yellow-200 text-center">
              <Target className="h-3 w-3 mx-auto mb-1" />
              <h3 className="font-semibold text-xs">In Production</h3>
              <div className="text-sm font-bold">{productionMetrics.inProduction}</div>
            </div>
            <div className="p-2 rounded border bg-green-50 text-green-600 border-green-200 text-center">
              <CheckCircle className="h-3 w-3 mx-auto mb-1" />
              <h3 className="font-semibold text-xs">Ready</h3>
              <div className="text-sm font-bold">{productionMetrics.readyForDispatch}</div>
            </div>
            <div className="p-2 rounded border bg-red-50 text-red-600 border-red-200 text-center">
              <AlertCircle className="h-3 w-3 mx-auto mb-1" />
              <h3 className="font-semibold text-xs">Delayed</h3>
              <div className="text-sm font-bold">{productionMetrics.delayed}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div className="p-2 rounded border bg-yellow-50 text-yellow-600 border-yellow-200 text-center">
              <div className="text-xs font-medium mb-1">Pending</div>
              <div className="text-sm font-bold">{dispatchSummary.pending}</div>
            </div>
            <div className="p-2 rounded border bg-blue-50 text-blue-600 border-blue-200 text-center">
              <div className="text-xs font-medium mb-1">Shipped</div>
              <div className="text-sm font-bold">{dispatchSummary.shipped}</div>
            </div>
            <div className="p-2 rounded border bg-green-50 text-green-600 border-green-200 text-center">
              <div className="text-xs font-medium mb-1">Delivered</div>
              <div className="text-sm font-bold">{dispatchSummary.delivered}</div>
            </div>
          </div>
        </div>

        {/* Delay Payments */}
        <div className="p-4 rounded-xl border-2 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold">Delay Payments (Aging)</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
              <div>
                <span className="text-xs font-medium text-gray-700">0-30 days</span>
                <p className="text-xs text-gray-500">Current</p>
              </div>
              <span className="text-sm font-bold text-gray-900">₹{(outstandingPayments['0-30'] / 100000).toFixed(1)}L</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200">
              <div>
                <span className="text-xs font-medium text-gray-700">30-60 days</span>
                <p className="text-xs text-gray-500">Attention</p>
              </div>
              <span className="text-sm font-bold text-gray-900">₹{(outstandingPayments['30-60'] / 100000).toFixed(1)}L</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-orange-50 rounded border border-orange-200">
              <div>
                <span className="text-xs font-medium text-gray-700">60-90 days</span>
                <p className="text-xs text-gray-500">Overdue</p>
              </div>
              <span className="text-sm font-bold text-gray-900">₹{(outstandingPayments['60-90'] / 100000).toFixed(1)}L</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
              <div>
                <span className="text-xs font-medium text-gray-700">90+ days</span>
                <p className="text-xs text-gray-500">Critical</p>
              </div>
              <span className="text-sm font-bold text-gray-900">₹{(outstandingPayments['90+'] / 100000).toFixed(1)}L</span>
            </div>
          </div>
        </div>

        {/* Customer & Dealer Relationship */}
        <div className="p-4 rounded-xl border-2 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Customer & Dealer</h3>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-semibold">Recent Dealer Visits</h4>
            </div>
            {recentDealerVisits.slice(0, 3).map((visit, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded border border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-900">{visit.dealer}</span>
                  <span className="text-xs text-gray-500">{visit.date}</span>
                </div>
                <p className="text-xs text-gray-500">{visit.purpose}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <h4 className="text-sm font-semibold">Follow-ups Due Today</h4>
            </div>
            {followUpsDue.map((followUp, index) => (
              <div key={index} className="p-2 bg-orange-50 rounded border border-orange-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-900">{followUp.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
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

        {/* Inventory & Products */}
        <div className="p-4 rounded-xl border-2 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Table className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Inventory & Products</h3>
          </div>
          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-semibold mb-2">Raw Material Status</h4>
            {rawMaterials.map((material, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded border border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">{material.material}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    material.status === 'Low' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {material.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                  <div 
                    className={`h-1.5 rounded-full ${
                      material.percentage < 40 ? 'bg-red-600' : 'bg-green-600'
                    }`}
                    style={{ width: `${material.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">Stock: {material.stock.toLocaleString('en-IN')} {material.unit}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold mb-2">Low Stock Alerts</h4>
            {lowStockAlerts.map((item, index) => (
              <div key={index} className="p-2 bg-red-50 rounded border border-red-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-900">{item.material || item.product}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    item.priority === 'High' ? 'bg-red-100 text-red-800' :
                    item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Current: {item.currentStock.toLocaleString('en-IN')} | Required: {item.minimumRequired.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
        </>
      )}

      {activeTab === 'performance' && (
        <div className="flex items-center justify-center min-h-[60vh] py-8">
          <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm w-full p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-blue-100">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-gray-900">
              Feature Upcoming
            </h2>
            
            <p className="text-base mb-4 text-gray-600">
              This feature will be available soon
            </p>
            
            <div className="space-y-3 mb-6 text-gray-700">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Performance Tracking</span>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium">Performance Reports</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              You will be able to view your performance metrics and detailed reports here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
