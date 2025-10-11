import React, { useState } from 'react';
import { TrendingUp, Users, Phone, Calendar, CheckCircle, Clock, Target, BarChart3, PieChart as PieChartIcon, Activity, Award, TrendingDown, ArrowRightLeft, Calendar as CalendarIcon, MapPin, PhoneOff, XCircle, UserPlus, CreditCard } from 'lucide-react';

// Simple Chart Components (without external dependencies)
function CustomPieChart({ data, size = 200 }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercentage = 0
  
  // If no data, show a placeholder
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

function CustomBarChart({ data, height = 200 }) {
  const maxValue = Math.max(...data.map(item => item.value))
  
  return (
    <div className="w-full transition-all duration-300 hover:scale-105" style={{ height }}>
      <div className="flex items-end justify-between h-full space-x-2">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 40)
          return (
            <div key={index} className="flex flex-col items-center flex-1 group">
              <div className="text-xs text-gray-500 mb-1 transition-all duration-300 group-hover:text-gray-700 group-hover:font-semibold">{item.value}</div>
              <div
                className="w-full rounded-t transition-all duration-500 hover:opacity-80 hover:shadow-lg hover:scale-110 cursor-pointer relative"
                style={{
                  height: barHeight,
                  backgroundColor: item.color,
                  minHeight: '4px',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
                title={`${item.label}: ${item.value}`}
              />
              <div className="text-xs text-gray-600 mt-2 text-center transition-all duration-300 group-hover:text-gray-800 group-hover:font-medium">{item.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ProgressBar({ value, max, label, color = "bg-blue-500" }) {
  const percentage = Math.min((value / max) * 100, 100)
  
  return (
    <div className="w-full group cursor-pointer">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 transition-all duration-300 group-hover:text-gray-900 group-hover:font-semibold">{label}</span>
        <span className="text-sm text-gray-500 transition-all duration-300 group-hover:text-gray-700 group-hover:font-medium">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden transition-all duration-300 group-hover:shadow-inner">
        <div
          className={`h-2 rounded-full transition-all duration-500 hover:shadow-lg ${color}`}
          style={{ 
            width: `${percentage}%`,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
          }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1 transition-all duration-300 group-hover:text-gray-700 group-hover:font-medium">{percentage.toFixed(1)}%</div>
    </div>
  )
}

const MobileDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [dateFilter, setDateFilter] = useState('')

  // Demo data for leads
  const demoLeads = [
    { id: 1, name: 'ABC Corp', sales_status: 'new', source: 'Website', created_at: new Date('2025-09-01').toISOString() },
    { id: 2, name: 'XYZ Ltd', sales_status: 'contacted', source: 'Referral', created_at: new Date('2025-09-05').toISOString() },
    { id: 3, name: 'PQR Industries', sales_status: 'proposal_sent', source: 'Cold Call', created_at: new Date('2025-09-10').toISOString() },
    { id: 4, name: 'MNO Enterprises', sales_status: 'meeting_scheduled', source: 'Email Campaign', created_at: new Date('2025-09-15').toISOString() },
    { id: 5, name: 'DEF Solutions', sales_status: 'proposal_sent', source: 'Website', created_at: new Date('2025-09-20').toISOString() },
    { id: 6, name: 'GHI Technologies', sales_status: 'closed_won', source: 'Referral', created_at: new Date('2025-09-25').toISOString() },
    { id: 7, name: 'JKL Systems', sales_status: 'closed_lost', source: 'Cold Call', created_at: new Date('2025-09-28').toISOString() },
  ]

  // Calculate real data from leads
  const calculateLeadStatusData = () => {
    const statusCounts = {}
    demoLeads.forEach(lead => {
      const bucket = mapSalesStatusToBucket(lead.sales_status)
      statusCounts[bucket] = (statusCounts[bucket] || 0) + 1
    })
    return statusCounts
  }

  const mapSalesStatusToBucket = (status) => {
    const statusMap = {
      'new': 'not-connected',
      'contacted': 'connected',
      'proposal_sent': 'connected',
      'meeting_scheduled': 'next-meeting',
      'closed_won': 'converted',
      'closed_lost': 'closed'
    }
    return statusMap[status] || 'not-connected'
  }

  const calculateMetrics = () => {
    const totalLeads = demoLeads.length
    const convertedLeads = demoLeads.filter(lead => mapSalesStatusToBucket(lead.sales_status) === 'converted').length
    const pendingLeads = demoLeads.filter(lead => mapSalesStatusToBucket(lead.sales_status) === 'not-connected').length
    const nextMeetingLeads = demoLeads.filter(lead => mapSalesStatusToBucket(lead.sales_status) === 'next-meeting').length
    const connectedLeads = demoLeads.filter(lead => mapSalesStatusToBucket(lead.sales_status) === 'connected').length
    const closedLeads = demoLeads.filter(lead => mapSalesStatusToBucket(lead.sales_status) === 'closed').length

    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0
    const pendingRate = totalLeads > 0 ? ((pendingLeads / totalLeads) * 100).toFixed(1) : 0

    return {
      totalLeads,
      convertedLeads,
      pendingLeads,
      nextMeetingLeads,
      connectedLeads,
      closedLeads,
      conversionRate,
      pendingRate
    }
  }

  // Calculate lead sources with demo data
  const calculateLeadSources = () => {
    const sourceCounts = {
      'Website': 2,
      'Referral': 2,
      'Cold Call': 2,
      'Email Campaign': 1,
      'Social Media': 1,
      'Trade Show': 1
    }
    
    // Convert to array format for charts
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280']
    return Object.entries(sourceCounts).map(([label, value], index) => ({
      label,
      value,
      color: colors[index % colors.length]
    }))
  }

  // Calculate weekly activity with demo data
  const calculateWeeklyActivity = () => {
    return [
      { label: 'Mon', value: 3, color: '#3b82f6' },
      { label: 'Tue', value: 5, color: '#3b82f6' },
      { label: 'Wed', value: 4, color: '#3b82f6' },
      { label: 'Thu', value: 7, color: '#3b82f6' },
      { label: 'Fri', value: 6, color: '#3b82f6' },
      { label: 'Sat', value: 2, color: '#3b82f6' },
      { label: 'Sun', value: 1, color: '#3b82f6' }
    ]
  }

  // Calculate monthly revenue trend with demo data
  const calculateMonthlyRevenue = () => {
    return [
      { label: "Jan", value: 45000, color: "#3b82f6" },
      { label: "Feb", value: 52000, color: "#3b82f6" },
      { label: "Mar", value: 48000, color: "#3b82f6" },
      { label: "Apr", value: 55000, color: "#3b82f6" },
      { label: "May", value: 61000, color: "#3b82f6" },
      { label: "Jun", value: 68000, color: "#10b981" }
    ]
  }

  // Handle date filter change
  const handleDateFilterChange = (selectedDate) => {
    setDateFilter(selectedDate)
    console.log('Filtering performance data for date:', selectedDate)
  }

  // Calculate real metrics
  const calculatedMetrics = calculateMetrics()
  const statusData = calculateLeadStatusData()

  // Generate performance data with demo data
  const getPerformanceData = (selectedDate) => {
    // Demo performance data
    const baseData = {
      targets: {
        monthlyLeads: { current: 45, target: 100, label: "Monthly Leads" },
        conversionRate: { current: 28, target: 30, label: "Conversion Rate (%)" },
        revenue: { current: 1250000, target: 1500000, label: "Quarterly Revenue (₹)" },
        calls: { current: 45, target: 60, label: "Daily Calls" }
      },
      leadStatusData: [
        { label: "New", value: 5, color: "#3b82f6" },
        { label: "Contacted", value: 8, color: "#60a5fa" },
        { label: "Proposal Sent", value: 6, color: "#f59e0b" },
        { label: "Meeting Scheduled", value: 4, color: "#8b5cf6" },
        { label: "Closed Won", value: 3, color: "#10b981" },
        { label: "Closed Lost", value: 2, color: "#ef4444" }
      ],
      monthlyPerformance: [
        { label: "Jan", value: 78, color: "#3b82f6" },
        { label: "Feb", value: 85, color: "#3b82f6" },
        { label: "Mar", value: 92, color: "#3b82f6" },
        { label: "Apr", value: 88, color: "#3b82f6" },
        { label: "May", value: 95, color: "#3b82f6" },
        { label: "Jun", value: 102, color: "#10b981" }
      ],
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
          icon: Award,
          color: "bg-orange-50 text-orange-600 border-orange-200"
        },
        {
          title: "Quotation Success",
          value: "0%",
          target: "> 70%",
          status: "warning",
          icon: CheckCircle,
          color: "bg-orange-50 text-orange-600 border-orange-200"
        },
        {
          title: "Transfer Leads",
          value: "0",
          target: "< 20",
          status: "success",
          icon: ArrowRightLeft,
          color: "bg-green-50 text-green-600 border-green-200"
        }
      ]
    }

    // If no date is selected, return base data
    if (!selectedDate) {
      return baseData
    }

    // Return base data for any selected date (no dummy variations)
    return baseData
  }

  // Get filtered performance data
  const performanceData = getPerformanceData(dateFilter)

  // Dashboard extras
  const daysLeftInMonth = (() => {
    const now = new Date()
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return Math.max(0, (last.getDate() - now.getDate()) + 1)
  })()
  const monthlyTarget = performanceData?.targets?.monthlyLeads?.target || 0

  // Overview Data - Real data from API
  const overviewData = {
    metrics: [
      {
        title: "Total Leads",
        value: calculatedMetrics.totalLeads.toString(),
        subtitle: "Active leads this month",
        icon: UserPlus,
        color: "bg-blue-50 text-blue-600 border-blue-200",
        trend: "+12%",
        trendUp: true
      },
      {
        title: "Conversion Rate",
        value: `${calculatedMetrics.conversionRate}%`,
        subtitle: "Above target of 20%",
        icon: CheckCircle,
        color: "bg-green-50 text-green-600 border-green-200",
        trend: "+3.2%",
        trendUp: true
      },
      {
        title: "Pending Rate",
        value: `${calculatedMetrics.pendingRate}%`,
        subtitle: "Leads requiring follow-up",
        icon: Clock,
        color: "bg-orange-50 text-orange-600 border-orange-200",
        trend: "-2.1%",
        trendUp: false
      },
      {
        title: "Total Revenue",
        value: "₹0",
        subtitle: "Revenue generated this month",
        icon: CreditCard,
        color: "bg-purple-50 text-purple-600 border-purple-200",
        trend: "0%",
        trendUp: false
      },
    ],
    weeklyLeads: calculateWeeklyActivity(),
    leadSourceData: calculateLeadSources(),
    monthlyRevenue: calculateMonthlyRevenue()
  }

  const overviewMetrics = overviewData.metrics

  const leadStatuses = [
    {
      title: "Pending",
      count: statusData['not-connected']?.toString() || "0",
      subtitle: "Leads awaiting response",
      icon: Clock,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      title: "Meeting scheduled",
      count: statusData['next-meeting']?.toString() || "0",
      subtitle: "Upcoming meetings",
      icon: Calendar,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      title: "Follow Up",
      count: statusData['connected']?.toString() || "0",
      subtitle: "Requires follow-up",
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      title: "Win Leads",
      count: statusData['converted']?.toString() || "0",
      subtitle: "Successful conversions",
      icon: CheckCircle,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      title: "Not Interested",
      count: "0",
      subtitle: "Declined leads",
      icon: XCircle,
      color: "bg-red-50 text-red-600 border-red-200",
    },
    {
      title: "Loose Leads",
      count: statusData['closed']?.toString() || "0",
      subtitle: "Unreachable leads",
      icon: PhoneOff,
      color: "bg-gray-50 text-gray-600 border-gray-200",
    },
    {
      title: "Transfer Leads",
      count: "0",
      subtitle: "Transferred to other teams",
      icon: ArrowRightLeft,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
  ]

  return (
    <div className="p-4 space-y-4">

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-4">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'overview' 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('performance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'performance' 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Performance
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Lead Status Summary */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold">Lead Status Summary</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">Overview of your leads by status</p>

            <div className="grid grid-cols-3 gap-1">
              {leadStatuses.map((status, index) => {
                const Icon = status.icon
                return (
                  <div key={index} className={`p-2 rounded border ${status.color} group`}>
                    <div className="flex flex-col items-center text-center">
                      <Icon className="h-3 w-3 mb-1" />
                      <h3 className="font-semibold text-xs">{status.title}</h3>
                      <div className="text-sm font-bold">{status.count}</div>
                      <p className="text-xs opacity-75 text-center leading-tight">{status.subtitle}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Target & Timeline */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold">Target & Timeline</h2>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <div className="p-2 rounded border bg-indigo-50 text-indigo-600 border-indigo-200 text-center">
                <Target className="h-3 w-3 mx-auto mb-1" />
                <h3 className="font-semibold text-xs">Monthly Target</h3>
                <div className="text-sm font-bold">{monthlyTarget}</div>
                <p className="text-xs opacity-75">Leads target</p>
              </div>

              <div className="p-2 rounded border bg-green-50 text-green-700 border-green-200 text-center">
                <CheckCircle className="h-3 w-3 mx-auto mb-1" />
                <h3 className="font-semibold text-xs">Target Achieved</h3>
                <div className="text-sm font-bold">{performanceData?.targets?.monthlyLeads?.current || 0}</div>
                <p className="text-xs opacity-75">Leads achieved</p>
              </div>

              <div className="p-2 rounded border bg-gray-50 text-gray-700 border-gray-200 text-center">
                <CalendarIcon className="h-3 w-3 mx-auto mb-1" />
                <h3 className="font-semibold text-xs">Days Left</h3>
                <div className="text-sm font-bold">{daysLeftInMonth}</div>
                <p className="text-xs opacity-75">Remaining days</p>
              </div>
            </div>
          </div>

          {/* Key Performance Metrics */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Key Performance Metrics</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">Critical business indicators and trends</p>

            <div className="grid grid-cols-2 gap-1">
              {overviewMetrics.map((metric, index) => {
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
                        <TrendingDown className="w-2 h-2 mr-1" />
                      )}
                      {metric.trend}
                    </div>
                    <p className="text-xs opacity-75 mt-1 leading-tight">{metric.subtitle}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Charts */}
          <div className="space-y-4">
            {/* Weekly Leads Bar Chart */}
            <div className="p-4 rounded-xl border-2 bg-white">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Weekly Leads Activity</h3>
              </div>
              <div className="h-48">
                <CustomBarChart data={overviewData.weeklyLeads} height={150} />
              </div>
              <div className="mt-2 text-center">
                <span className="text-sm text-gray-500">Leads Generated This Week</span>
              </div>
            </div>

            {/* Lead Source Pie Chart */}
            <div className="p-4 rounded-xl border-2 bg-white">
              <div className="flex items-center gap-2 mb-4">
                <PieChartIcon className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Lead Sources</h3>
              </div>
              <div className="flex items-center justify-center mb-4">
                <CustomPieChart data={overviewData.leadSourceData} size={150} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {overviewData.leadSourceData.map((item, index) => (
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

            {/* Monthly Revenue Chart */}
            <div className="p-4 rounded-xl border-2 bg-white">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Monthly Revenue Trend</h3>
              </div>
              <div className="h-48">
                <CustomBarChart data={overviewData.monthlyRevenue.map(item => ({
                  ...item,
                  value: item.value / 1000, // Convert to thousands for better display
                  label: item.label
                }))} height={150} />
              </div>
              <div className="mt-2 text-center">
                <span className="text-sm text-gray-500">Revenue in Thousands (₹)</span>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-4">
          {/* Performance Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Performance Dashboard</h1>
                <p className="text-xs text-gray-600">Track your targets and performance metrics</p>
              </div>
            </div>
            
            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <CalendarIcon className={`h-4 w-4 ${dateFilter ? 'text-blue-500' : 'text-gray-500'}`} />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => handleDateFilterChange(e.target.value)}
                className={`px-2 py-1 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  dateFilter ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                title="Filter performance by date"
              />
              {dateFilter && (
                <button
                  onClick={() => handleDateFilterChange('')}
                  className="px-1 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  title="Clear date filter"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter Status */}
          {dateFilter && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-blue-800">
                  Showing performance data for: <strong>{new Date(dateFilter).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Target Progress Cards */}
          <div className="grid grid-cols-2 gap-1 mb-6">
            {Object.entries(performanceData.targets).map(([key, target]) => {
              const progress = (target.current / target.target) * 100;
              const remaining = target.target - target.current;
              const isBelowTarget = remaining > 0;
              
              return (
                <div key={key} className={`p-2 rounded border ${isBelowTarget ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'} group relative overflow-hidden text-center`}>
                  {isBelowTarget && (
                    <div className="absolute top-0 right-0 bg-red-100 text-red-800 text-xs font-semibold px-1 py-0.5 rounded-bl">
                      {remaining} to go
                    </div>
                  )}
                  <div className="flex items-center justify-center mb-1">
                    <div className={`h-2 w-2 ${isBelowTarget ? 'text-red-500' : 'text-green-500'}`}>
                      {isBelowTarget ? (
                        <TrendingDown className="h-2 w-2" />
                      ) : (
                        <TrendingUp className="h-2 w-2" />
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-xs text-gray-700 mb-1">{target.label}</h3>
                  <div className="text-sm font-bold mb-1">
                    {target.current}<span className="text-xs text-gray-500">/{target.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden mb-1">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isBelowTarget ? 'bg-red-500' : 'bg-green-500'}`} 
                      style={{ width: `${Math.min(100, progress)}%` }}
                    ></div>
                  </div>
                  {isBelowTarget && (
                    <p className="text-xs text-red-600 font-medium">
                      {Math.ceil(100 - progress)}% remaining
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* KPI Cards */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold">Key Performance Indicators</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">Track important metrics that impact your success</p>

            <div className="grid grid-cols-2 gap-1">
              {performanceData.kpis.map((kpi, index) => {
                const Icon = kpi.icon
                return (
                  <div key={index} className={`p-2 rounded border ${kpi.color} group text-center`}>
                    <Icon className="h-3 w-3 mx-auto mb-1" />
                    <h3 className="font-semibold text-xs mb-1">{kpi.title}</h3>
                    <div className="text-sm font-bold mb-1">{kpi.value}</div>
                    <p className="text-xs text-gray-500 mb-1">Target: {kpi.target}</p>
                    <div className="flex items-center justify-center gap-1">
                      {kpi.status === 'warning' ? (
                        <>
                          <TrendingDown className="h-2 w-2 text-orange-500" />
                          <span className="text-xs text-orange-600">Below</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-2 w-2 text-green-500" />
                          <span className="text-xs text-green-600">Above</span>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Charts Row */}
          <div className="space-y-4">
            {/* Lead Status Pie Chart */}
            <div className="p-4 rounded-xl border-2 bg-white">
              <div className="flex items-center gap-2 mb-4">
                <PieChartIcon className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Lead Status Distribution</h3>
              </div>
              <div className="flex items-center justify-center mb-4">
                <CustomPieChart data={performanceData.leadStatusData} size={150} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {performanceData.leadStatusData.map((item, index) => (
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

            {/* Monthly Performance Bar Chart */}
            <div className="p-4 rounded-xl border-2 bg-white">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Monthly Performance</h3>
              </div>
              <div className="h-48">
                <CustomBarChart data={performanceData.monthlyPerformance} height={150} />
              </div>
              <div className="mt-2 text-center">
                <span className="text-sm text-gray-500">Performance Score (0-100)</span>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="p-4 rounded-xl border-2 border-gray-200 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-yellow-600" />
              <h3 className="text-lg font-semibold">Performance Summary</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">87%</div>
                <div className="text-sm text-gray-600">Overall Target Achievement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">2</div>
                <div className="text-sm text-gray-600">Areas Need Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">3</div>
                <div className="text-sm text-gray-600">Area Exceeding Target</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileDashboard;