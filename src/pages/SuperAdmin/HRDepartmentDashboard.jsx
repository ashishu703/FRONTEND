import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  UserPlus,
  Building2,
  BarChart3,
  Activity,
  Target,
  PieChart
} from 'lucide-react';

const HRDepartmentDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Sample HR data
  const hrStats = {
    totalEmployees: 156,
    activeEmployees: 142,
    onLeave: 8,
    newHires: 12,
    pendingApprovals: 5,
    trainingSessions: 8,
    departments: 6,
    attendanceRate: 94.2
  };

  const departmentData = [
    { name: 'Human Resources', employees: 12, budget: '$500,000', status: 'active' },
    { name: 'Information Technology', employees: 25, budget: '$1,200,000', status: 'active' },
    { name: 'Finance', employees: 8, budget: '$300,000', status: 'active' },
    { name: 'Marketing', employees: 15, budget: '$800,000', status: 'active' },
    { name: 'Sales', employees: 32, budget: '$1,500,000', status: 'active' },
    { name: 'Operations', employees: 18, budget: '$600,000', status: 'active' }
  ];

  const performanceData = [
    { department: 'Human Resources', rating: 4.5, goals: 8, achieved: 7, percentage: 87.5 },
    { department: 'Information Technology', rating: 4.2, goals: 10, achieved: 9, percentage: 90.0 },
    { department: 'Finance', rating: 4.0, goals: 6, achieved: 5, percentage: 83.3 },
    { department: 'Marketing', rating: 4.7, goals: 12, achieved: 11, percentage: 91.7 },
    { department: 'Sales', rating: 4.3, goals: 15, achieved: 13, percentage: 86.7 },
    { department: 'Operations', rating: 4.1, goals: 7, achieved: 6, percentage: 85.7 }
  ];

  const StatCard = ({ title, value, icon: Icon, color, change, changeType, description }) => (
    <div className={`${color.bg} ${color.border} border rounded-xl p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-medium ${color.text}`}>{title}</h3>
        <div className={color.text}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className={`text-2xl font-bold ${color.value} mb-1`}>
        {value}
      </div>
      {change && (
        <p className={`text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
          {changeType === 'positive' ? '+' : ''}{change}% from last month
        </p>
      )}
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">HR Department Dashboard</h1>
            <p className="text-gray-600">Human Resources Management Overview</p>
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
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      {/* HR Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Employees"
          value={hrStats.totalEmployees}
          icon={Users}
          color={{
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-600',
            value: 'text-blue-600'
          }}
          change="5.2"
          changeType="positive"
          description="All employees in the system"
        />
        <StatCard
          title="Active Employees"
          value={hrStats.activeEmployees}
          icon={CheckCircle}
          color={{
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-600',
            value: 'text-green-600'
          }}
          change="2.1"
          changeType="positive"
          description="Currently working employees"
        />
        <StatCard
          title="On Leave"
          value={hrStats.onLeave}
          icon={Calendar}
          color={{
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            text: 'text-orange-600',
            value: 'text-orange-600'
          }}
          description="Employees currently on leave"
        />
        <StatCard
          title="New Hires"
          value={hrStats.newHires}
          icon={UserPlus}
          color={{
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            text: 'text-purple-600',
            value: 'text-purple-600'
          }}
          change="15.3"
          changeType="positive"
          description="New employees this month"
        />
      </div>

      {/* Additional HR Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Attendance Rate"
          value={`${hrStats.attendanceRate}%`}
          icon={Clock}
          color={{
            bg: 'bg-indigo-50',
            border: 'border-indigo-200',
            text: 'text-indigo-600',
            value: 'text-indigo-600'
          }}
          description="Average attendance rate"
        />
        <StatCard
          title="Pending Approvals"
          value={hrStats.pendingApprovals}
          icon={AlertCircle}
          color={{
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-600',
            value: 'text-yellow-600'
          }}
          description="Awaiting approval"
        />
        <StatCard
          title="Training Sessions"
          value={hrStats.trainingSessions}
          icon={Activity}
          color={{
            bg: 'bg-teal-50',
            border: 'border-teal-200',
            text: 'text-teal-600',
            value: 'text-teal-600'
          }}
          description="Scheduled this month"
        />
        <StatCard
          title="Departments"
          value={hrStats.departments}
          icon={Building2}
          color={{
            bg: 'bg-pink-50',
            border: 'border-pink-200',
            text: 'text-pink-600',
            value: 'text-pink-600'
          }}
          description="Active departments"
        />
      </div>

      {/* Department Overview */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <Building2 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-blue-600">Department Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentData.map((dept, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  dept.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {dept.status}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Employees:</span>
                  <span className="font-semibold text-gray-900">{dept.employees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Budget:</span>
                  <span className="font-semibold text-gray-900">{dept.budget}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-green-600">Performance Analytics</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Performance Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-4">
              {performanceData.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                    <span className="text-sm text-gray-600">{dept.achieved}/{dept.goals} goals</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 bg-green-500 rounded-full transition-all duration-300"
                      style={{ width: `${dept.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{dept.percentage}% completed</span>
                    <span>Rating: {dept.rating}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employee Distribution Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Employee Distribution</h3>
              <PieChart className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* HR - 8% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * 0.08} ${2 * Math.PI * 40}`}
                    strokeDashoffset="0"
                  />
                  {/* IT - 16% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * 0.16} ${2 * Math.PI * 40}`}
                    strokeDashoffset={`-${2 * Math.PI * 40 * 0.08}`}
                  />
                  {/* Finance - 5% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * 0.05} ${2 * Math.PI * 40}`}
                    strokeDashoffset={`-${2 * Math.PI * 40 * 0.24}`}
                  />
                  {/* Marketing - 10% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * 0.10} ${2 * Math.PI * 40}`}
                    strokeDashoffset={`-${2 * Math.PI * 40 * 0.29}`}
                  />
                  {/* Sales - 21% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * 0.21} ${2 * Math.PI * 40}`}
                    strokeDashoffset={`-${2 * Math.PI * 40 * 0.39}`}
                  />
                  {/* Operations - 12% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * 0.12} ${2 * Math.PI * 40}`}
                    strokeDashoffset={`-${2 * Math.PI * 40 * 0.60}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">156</div>
                    <div className="text-sm text-gray-500">Total Employees</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">HR (8%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">IT (16%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Finance (5%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Marketing (10%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Sales (21%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Operations (12%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent HR Activities</h3>
          <Activity className="w-5 h-5 text-blue-600" />
        </div>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">John Smith joined as Software Engineer</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">completed</span>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Sarah Johnson applied for vacation leave</p>
              <p className="text-xs text-gray-500">4 hours ago</p>
            </div>
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">pending</span>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">New training session scheduled for next week</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">scheduled</span>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Monthly performance reviews completed</p>
              <p className="text-xs text-gray-500">2 days ago</p>
            </div>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDepartmentDashboard;
