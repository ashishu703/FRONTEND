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
  ChevronDown,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Target
} from 'lucide-react';
import MarketingSalespersonDashboard from './MarketingSalespersonDashboard';
import TeleSalesDashboard from './TeleSalesDashboard';
import OfficeSalesPersonDashboard from './OfficeSalesPersonDashboard';
import HRDepartmentDashboard from './HRDepartmentDashboard';

const SalesDashboard = ({ setActiveView }) => {
  const [selectedSalesperson, setSelectedSalesperson] = useState('All Salespersons');
  const [dateRange, setDateRange] = useState('Select date range');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const formatDisplayRange = (start, end) => {
    if (!start && !end) return 'Select date range';
    if (start && end) return `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}`;
    if (start) return `${new Date(start).toLocaleDateString()} - ...`;
    return `... - ${new Date(end).toLocaleDateString()}`;
  };

  const applyDateRange = () => {
    setDateRange(formatDisplayRange(startDate, endDate));
    setShowDatePicker(false);
    // Hook to refetch data based on date range can be placed here
    // fetchDashboardData({ startDate, endDate })
  };

  // Generate dynamic revenue data based on date range
  const generateRevenueData = () => {
    if (!startDate || !endDate) {
      // Default 12 months data
      return [
        { month: 'Jan', revenue: 50000, x: 20, y: 180 },
        { month: 'Feb', revenue: 80000, x: 60, y: 160 },
        { month: 'Mar', revenue: 120000, x: 100, y: 140 },
        { month: 'Apr', revenue: 150000, x: 140, y: 120 },
        { month: 'May', revenue: 200000, x: 180, y: 100 },
        { month: 'Jun', revenue: 250000, x: 220, y: 80 },
        { month: 'Jul', revenue: 300000, x: 260, y: 60 },
        { month: 'Aug', revenue: 350000, x: 300, y: 40 },
        { month: 'Sep', revenue: 400000, x: 340, y: 20 },
        { month: 'Oct', revenue: 450000, x: 380, y: 10 }
      ];
    }

    // Calculate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    // Generate data points based on date range
    const dataPoints = Math.min(Math.max(Math.ceil(daysDiff / 30), 3), 12); // 3-12 data points
    const data = [];
    
    for (let i = 0; i < dataPoints; i++) {
      const monthDate = new Date(start);
      monthDate.setMonth(start.getMonth() + i);
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
      
      // Generate revenue based on position in range (simulate growth)
      const baseRevenue = 50000 + (i * 50000);
      const randomFactor = 0.8 + Math.random() * 0.4; // 80-120% variation
      const revenue = Math.round(baseRevenue * randomFactor);
      
      // Calculate position for chart
      const x = 20 + (i * (360 / (dataPoints - 1)));
      const y = 180 - (revenue / 500000) * 170; // Scale to chart height
      
      data.push({
        month: monthName,
        revenue: revenue,
        x: x,
        y: y
      });
    }
    
    return data;
  };

  const revenueData = generateRevenueData();

  const clearDateRange = () => {
    setStartDate('');
    setEndDate('');
    setDateRange('Select date range');
    setShowDatePicker(false);
    // Optionally refetch without filters
  };

  const leadCards = [
    {
      title: 'Total Leads',
      value: '0',
      description: 'All leads in the system',
      icon: <Users className="w-5 h-5" />,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Pending Leads',
      value: '0',
      description: 'Leads awaiting action',
      icon: <Clock className="w-5 h-5" />,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Follow-up Leads',
      value: '0',
      description: 'Leads in follow-up stage',
      icon: <UserCheck className="w-5 h-5" />,
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Meeting Scheduled',
      value: '0',
      description: 'meeting scheduled leads',
      icon: <Calendar className="w-5 h-5" />,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    {
      title: 'Win Leads',
      value: '0',
      description: 'Converted leads',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      title: 'Loose Leads',
      value: '0',
      description: 'Unreached Leads',
      icon: <XCircle className="w-5 h-5" />,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200'
    }
  ];

  // Calculate revenue metrics based on date range and current data
  const calculateRevenueMetrics = () => {
    // Sample revenue data - in a real app, this would come from API
    const totalRevenue = 15328246; // ₹1,53,28,246 (all time)
    
    // Calculate current month revenue based on date range
    let currentMonthRevenue = 992583; // ₹9,92,583 (September)
    let targetRevenue = 2000000; // ₹20,00,000 target for current month
    
    // If date range is selected, calculate filtered revenue
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      
      // Simulate revenue calculation based on date range
      // In real app, this would be actual data from API
      const dailyRevenue = currentMonthRevenue / 30; // Average daily revenue
      currentMonthRevenue = Math.round(dailyRevenue * daysDiff);
      
      // Adjust target based on date range
      const monthlyTarget = 2000000;
      const dailyTarget = monthlyTarget / 30;
      targetRevenue = Math.round(dailyTarget * daysDiff);
    }
    
    const achievedRevenue = currentMonthRevenue;
    const pendingRevenue = Math.max(targetRevenue - achievedRevenue, 0);
    const achievementPercentage = targetRevenue > 0 ? (achievedRevenue / targetRevenue) * 100 : 0;
    
    // Calculate month-over-month growth
    const previousMonthRevenue = 3500000; // August revenue
    const monthOverMonthGrowth = previousMonthRevenue > 0 
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
      : 0;
    
    return {
      totalRevenue,
      achievedRevenue,
      pendingRevenue,
      achievementPercentage,
      monthOverMonthGrowth
    };
  };

  const revenueMetrics = calculateRevenueMetrics();

  const revenueCards = [
    {
      title: 'Overall Revenue',
      value: `₹${revenueMetrics.totalRevenue.toLocaleString()}`,
      description: 'Total Revenue (All Time)',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      valueColor: 'text-blue-600'
    },
    {
      title: 'Achieved Revenue',
      value: `₹${revenueMetrics.achievedRevenue.toLocaleString()}`,
      description: `Current month achieved (${revenueMetrics.achievementPercentage.toFixed(1)}% of target)`,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      valueColor: 'text-green-600',
      hasIcon: true,
      icon: <CheckCircle className="w-4 h-4 text-green-600" />
    },
    {
      title: 'Pending Revenue',
      value: `₹${revenueMetrics.pendingRevenue.toLocaleString()}`,
      description: 'Remaining to achieve target',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      valueColor: 'text-orange-600',
      hasIcon: true,
      icon: <AlertCircle className="w-4 h-4 text-orange-600" />
    },
    {
      title: 'Month-over-Month Growth',
      value: `${revenueMetrics.monthOverMonthGrowth >= 0 ? '+' : ''}${revenueMetrics.monthOverMonthGrowth.toFixed(1)}%`,
      description: revenueMetrics.monthOverMonthGrowth >= 0 
        ? 'Revenue increased compared to previous month' 
        : 'Revenue decreased compared to previous month',
      bgColor: revenueMetrics.monthOverMonthGrowth >= 0 ? 'bg-green-50' : 'bg-red-50',
      textColor: revenueMetrics.monthOverMonthGrowth >= 0 ? 'text-green-600' : 'text-red-600',
      borderColor: revenueMetrics.monthOverMonthGrowth >= 0 ? 'border-green-200' : 'border-red-200',
      valueColor: revenueMetrics.monthOverMonthGrowth >= 0 ? 'text-green-600' : 'text-red-600',
      hasIcon: true,
      icon: revenueMetrics.monthOverMonthGrowth >= 0 
        ? <TrendingUp className="w-4 h-4 text-green-600" />
        : <TrendingDown className="w-4 h-4 text-red-600" />
    }
  ];

  const conversionCards = [
    {
      title: 'Conversion Rate',
      value: '0.0%',
      description: 'Overall conversion percentage',
      icon: <Percent className="w-5 h-5" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      valueColor: 'text-green-600'
    },
    {
      title: 'Meeting Scheduled Conversion',
      value: '0.0%',
      description: 'Meeting to conversion rate',
      icon: <CalendarCheck className="w-5 h-5" />,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      valueColor: 'text-purple-600'
    },
    {
      title: 'Pending Rate',
      value: '0.0%',
      description: 'Pending leads percentage',
      icon: <AlertCircle className="w-5 h-5" />,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      valueColor: 'text-orange-600'
    }
  ];

  // Centralized department performance data to compute targets and reuse in UI
  const departmentPerformanceData = [
    { department: 'Sales Department', leads: 350, target: 400, percentage: 87.5, color: 'bg-blue-500' },
    { department: 'Marketing Department', leads: 280, target: 300, percentage: 93.3, color: 'bg-green-500' },
    { department: 'Support Department', leads: 120, target: 150, percentage: 80.0, color: 'bg-yellow-500' },
    { department: 'Development Department', leads: 90, target: 100, percentage: 90.0, color: 'bg-purple-500' }
  ];

  const totalTarget = departmentPerformanceData.reduce((sum, d) => sum + (d.target || 0), 0);
  const achievedLeads = departmentPerformanceData.reduce((sum, d) => sum + (d.leads || 0), 0);
  const pendingTarget = Math.max(totalTarget - achievedLeads, 0);

  // Function to render content based on selected salesperson
  const renderSalespersonContent = () => {
    switch (selectedSalesperson) {
      case 'Marketing Salesperson':
        return <MarketingSalespersonDashboard />;
      case 'Office Sales Department':
        return <OfficeSalesPersonDashboard />;
      case 'HR Department':
        return <HRDepartmentDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-600 mb-2">
              {selectedSalesperson === 'All Salespersons' ? 'Sales Dashboard' : selectedSalesperson + ' Dashboard'}
            </h1>
            <p className="text-gray-600">
              {selectedSalesperson === 'All Salespersons' ? 'Sales Department Performance Overview' : 
               selectedSalesperson === 'HR Department' ? 'Human Resources Management Overview' : 
               selectedSalesperson + ' Performance Overview'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <div className="relative">
              <select 
                value={selectedSalesperson}
                onChange={(e) => {
                  const salesperson = e.target.value;
                  setSelectedSalesperson(salesperson);
                }}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>All Salespersons</option>
                <option>Marketing Salesperson</option>
                <option>Office Sales Department</option>
                <option>HR Department</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <button
              type="button"
              onClick={() => setShowDatePicker((v) => !v)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-60 text-left"
            >
              {dateRange}
            </button>
            {showDatePicker && (
              <div className="absolute z-20 mt-2 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-64">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-2 mt-4">
                  <button onClick={clearDateRange} className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800">Clear</button>
                  <button onClick={() => setShowDatePicker(false)} className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
                  <button onClick={applyDateRange} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Apply</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Salesperson Specific Content */}
      <div key={selectedSalesperson} className="animate-fade-up">
        {renderSalespersonContent()}
      </div>

      {/* Default Content - Only show when All Salespersons is selected */}
      {selectedSalesperson === 'All Salespersons' && (
        <>
          {/* Lead Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {leadCards.map((card, index) => (
          <div key={index} className={`${card.bgColor} ${card.borderColor} border rounded-xl p-2 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-medium ${card.textColor}`}>{card.title}</h3>
              <div className={card.textColor}>
                {card.icon}
              </div>
            </div>
            <div className={`text-2xl font-bold ${card.textColor} mb-1`}>
              {card.value}
            </div>
            <p className="text-xs text-gray-500">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Revenue Overview */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <IndianRupee className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-purple-600">Revenue Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {revenueCards.map((card, index) => (
            <div key={index} className={`${card.bgColor} ${card.borderColor} border rounded-xl p-3 hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-medium ${card.textColor}`}>{card.title}</h3>
                {card.hasIcon && card.icon}
              </div>
              <div className={`text-2xl font-bold ${card.valueColor} mb-1`}>
                {card.value}
              </div>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Rate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {conversionCards.map((card, index) => (
          <div key={index} className={`${card.bgColor} ${card.borderColor} border rounded-xl p-3 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-medium ${card.textColor}`}>{card.title}</h3>
              <div className={card.textColor}>
                {card.icon}
              </div>
            </div>
            <div className={`text-2xl font-bold ${card.valueColor} mb-1`}>
              {card.value}
            </div>
            <p className="text-xs text-gray-500">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Target Overview */
      }
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-purple-600">Target Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`bg-blue-50 border border-blue-200 rounded-xl p-2 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-medium text-blue-600`}>Total Target</h3>
              <div className="text-blue-600">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <div className={`text-2xl font-bold text-blue-600 mb-1`}>
              {totalTarget.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Sum of targets across departments</p>
          </div>
          <div className={`bg-green-50 border border-green-200 rounded-xl p-2 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-medium text-green-600`}>Target Achieved</h3>
              <div className="text-green-600">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className={`text-2xl font-bold text-green-600 mb-1`}>
              {achievedLeads.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Total completed towards target</p>
          </div>
          <div className={`bg-red-50 border border-red-200 rounded-xl p-2 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-medium text-red-600`}>Pending Target</h3>
              <div className="text-red-600">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div className={`text-2xl font-bold text-red-600 mb-1`}>
              {pendingTarget.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Remaining vs. achieved leads</p>
          </div>
        </div>
      </div>

      {/* Sales Analytics Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <Activity className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-purple-600">Sales Analytics</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Lead Status Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Lead Status Distribution</h3>
              <PieChart className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="relative w-48 h-48">
                {/* Pie Chart SVG */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Pending - 60% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * 0.6} ${2 * Math.PI * 40}`}
                    strokeDashoffset="0"
                  />
                  {/* In Progress - 20% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * 0.2} ${2 * Math.PI * 40}`}
                    strokeDashoffset={`-${2 * Math.PI * 40 * 0.6}`}
                  />
                  {/* Completed - 15% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * 0.15} ${2 * Math.PI * 40}`}
                    strokeDashoffset={`-${2 * Math.PI * 40 * 0.8}`}
                  />
                  {/* Not Connected - 5% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * 0.05} ${2 * Math.PI * 40}`}
                    strokeDashoffset={`-${2 * Math.PI * 40 * 0.95}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">814</div>
                    <div className="text-sm text-gray-500">Total Leads</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Pending (60%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">In Progress (20%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Completed (15%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Not Connected (5%)</span>
              </div>
            </div>
          </div>

          {/* Monthly Sales Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Sales Performance</h3>
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {[
                { month: 'Jan', value: 45, color: 'bg-blue-500' },
                { month: 'Feb', value: 60, color: 'bg-blue-500' },
                { month: 'Mar', value: 35, color: 'bg-blue-500' },
                { month: 'Apr', value: 80, color: 'bg-blue-500' },
                { month: 'May', value: 55, color: 'bg-blue-500' },
                { month: 'Jun', value: 70, color: 'bg-blue-500' },
                { month: 'Jul', value: 90, color: 'bg-blue-500' },
                { month: 'Aug', value: 75, color: 'bg-blue-500' },
                { month: 'Sep', value: 40, color: 'bg-blue-500' },
                { month: 'Oct', value: 65, color: 'bg-blue-500' },
                { month: 'Nov', value: 85, color: 'bg-blue-500' },
                { month: 'Dec', value: 95, color: 'bg-blue-500' }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="text-xs text-gray-500">{item.month}</div>
                  <div
                    className={`w-6 ${item.color} rounded-t transition-all duration-300 hover:opacity-80`}
                    style={{ height: `${item.value}%` }}
                    title={`${item.value} leads`}
                  ></div>
                  <div className="text-xs text-gray-600">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Trend Line Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue Trend {startDate && endDate ? `(${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()})` : '(Last 12 Months)'}
            </h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="w-full h-full relative">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Dynamic Revenue trend line */}
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  points={revenueData.map(point => `${point.x},${point.y}`).join(' ')}
                />
                
                {/* Dynamic Data points */}
                {revenueData.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#3B82F6"
                    className="hover:r-6 transition-all duration-200"
                    title={`${point.month}: ₹${point.revenue.toLocaleString()}`}
                  />
                ))}
              </svg>
              
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
                <span>₹500K</span>
                <span>₹400K</span>
                <span>₹300K</span>
                <span>₹200K</span>
                <span>₹100K</span>
                <span>₹0</span>
              </div>
              
              {/* Dynamic X-axis labels */}
              <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500">
                {revenueData.map((point, index) => (
                  <span key={index} style={{ left: `${point.x - 10}px`, position: 'absolute' }}>
                    {point.month}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
        </>
      )}
    </div>
  );
};



export default SalesDashboard;
