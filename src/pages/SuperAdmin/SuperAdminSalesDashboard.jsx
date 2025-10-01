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

const SalesDashboard = ({ setActiveView }) => {
  const [selectedSalesperson, setSelectedSalesperson] = useState('All Salespersons');
  const [dateRange, setDateRange] = useState('Select date range');

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

  const revenueCards = [
    {
      title: 'Overall Revenue',
      value: '₹1,53,28,246',
      description: 'Total Revenue (All Time)',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      valueColor: 'text-blue-600'
    },
    {
      title: 'Total Revenue',
      value: '₹0',
      description: 'Filtered Revenue',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-200',
      valueColor: 'text-gray-800'
    },
    {
      title: 'Current month earnings',
      value: '₹9,92,583',
      description: 'September Revenue',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-200',
      valueColor: 'text-gray-800'
    },
    {
      title: 'Month-over-Month Growth',
      value: '-71.8%',
      description: 'Revenue decreased compared to August',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
      valueColor: 'text-red-600',
      hasIcon: true,
      icon: <TrendingDown className="w-4 h-4 text-red-600" />
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

  // Function to render content based on selected salesperson
  const renderSalespersonContent = () => {
    switch (selectedSalesperson) {
      case 'Marketing Salesperson':
        return <MarketingSalespersonDashboard />;
      case 'Office Sales Department':
        return <OfficeSalesPersonDashboard />;
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
              {selectedSalesperson === 'All Salespersons' ? 'Sales Department Performance Overview' : selectedSalesperson + ' Performance Overview'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Live Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Connected</span>
            </div>
            <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center space-x-2 hover:bg-green-200 transition-colors">
              <BarChart3 className="w-4 h-4" />
              <span>Complete Counts</span>
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sales Department</label>
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
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="relative">
              <input 
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                placeholder="Select date range"
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Salesperson Specific Content */}
      {renderSalespersonContent()}

      {/* Default Content - Only show when All Salespersons is selected */}
      {selectedSalesperson === 'All Salespersons' && (
        <>
          {/* Lead Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {leadCards.map((card, index) => (
          <div key={index} className={`${card.bgColor} ${card.borderColor} border rounded-xl p-4 hover:shadow-md transition-shadow`}>
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
            <div key={index} className={`${card.bgColor} ${card.borderColor} border rounded-xl p-6 hover:shadow-md transition-shadow`}>
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
          <div key={index} className={`${card.bgColor} ${card.borderColor} border rounded-xl p-6 hover:shadow-md transition-shadow`}>
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

      {/* Sales Analytics Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <Activity className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-purple-600">Sales Analytics</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Lead Status Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend (Last 12 Months)</h3>
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
                
                {/* Revenue trend line */}
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  points="20,180 60,160 100,140 140,120 180,100 220,80 260,60 300,40 340,20 380,10"
                />
                
                {/* Data points */}
                {[
                  { x: 20, y: 180, value: 50 },
                  { x: 60, y: 160, value: 80 },
                  { x: 100, y: 140, value: 120 },
                  { x: 140, y: 120, value: 150 },
                  { x: 180, y: 100, value: 200 },
                  { x: 220, y: 80, value: 250 },
                  { x: 260, y: 60, value: 300 },
                  { x: 300, y: 40, value: 350 },
                  { x: 340, y: 20, value: 400 },
                  { x: 380, y: 10, value: 450 }
                ].map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#3B82F6"
                    className="hover:r-6 transition-all duration-200"
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
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Nov</span>
              </div>
            </div>
          </div>
        </div>

        {/* Department Performance Comparison */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Department Performance Comparison</h3>
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <div className="space-y-4">
            {[
              { department: 'Sales Department', leads: 350, target: 400, percentage: 87.5, color: 'bg-blue-500' },
              { department: 'Marketing Department', leads: 280, target: 300, percentage: 93.3, color: 'bg-green-500' },
              { department: 'Support Department', leads: 120, target: 150, percentage: 80.0, color: 'bg-yellow-500' },
              { department: 'Development Department', leads: 90, target: 100, percentage: 90.0, color: 'bg-purple-500' }
            ].map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                  <span className="text-sm text-gray-600">{dept.leads}/{dept.target} leads</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${dept.color} transition-all duration-300`}
                    style={{ width: `${dept.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{dept.percentage}% completed</span>
                  <span>{dept.target - dept.leads} remaining</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default SalesDashboard;
