import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Building, 
  Users, 
  Clock, 
  CheckCircle, 
  BarChart3, 
  Settings,
  TrendingUp,
  UserX,
  XCircle,
  Info
} from 'lucide-react';

const Performance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('Select date range');

  // Sample data
  const services = [
    {
      id: 1,
      serviceType: 'CREATIVE DEPARTMENT',
      department: 'SMO_DEPARTMENT',
      pending: 142,
      inProgress: 0,
      completed: 0,
      churned: 0,
      expired: 0,
      total: 142,
      overallRating: 0,
      greenPercentage: 0,
      bluePercentage: 0
    },
    {
      id: 2,
      serviceType: 'AUTOMATION',
      department: 'SALES_DEPARTMENT',
      pending: 2,
      inProgress: 1,
      completed: 0,
      churned: 0,
      expired: 0,
      total: 3,
      overallRating: 7,
      greenPercentage: 0,
      bluePercentage: 7
    },
    {
      id: 3,
      serviceType: 'WEBSITE CREATION',
      department: 'WEBSITE_DEPARTMENT',
      pending: 81,
      inProgress: 0,
      completed: 0,
      churned: 0,
      expired: 0,
      total: 81,
      overallRating: 0,
      greenPercentage: 0,
      bluePercentage: 0
    },
    {
      id: 4,
      serviceType: 'GOOGLE SERVICE',
      department: 'GOOGLE_DEPARTMENT',
      pending: 145,
      inProgress: 1,
      completed: 0,
      churned: 0,
      expired: 0,
      total: 146,
      overallRating: 0,
      greenPercentage: 0,
      bluePercentage: 0
    },
    {
      id: 5,
      serviceType: 'WEBSITE DEPARTMENT',
      department: 'WEBSITE_DEPARTMENT',
      pending: 30,
      inProgress: 0,
      completed: 1,
      churned: 0,
      expired: 0,
      total: 31,
      overallRating: 3,
      greenPercentage: 3,
      bluePercentage: 0
    },
    {
      id: 6,
      serviceType: 'SOCIAL MEDIA',
      department: 'SMO_DEPARTMENT',
      pending: 25,
      inProgress: 2,
      completed: 5,
      churned: 1,
      expired: 0,
      total: 33,
      overallRating: 15,
      greenPercentage: 15,
      bluePercentage: 6
    },
    {
      id: 7,
      serviceType: 'DIGITAL MARKETING',
      department: 'MARKETING_DEPARTMENT',
      pending: 50,
      inProgress: 3,
      completed: 8,
      churned: 2,
      expired: 1,
      total: 64,
      overallRating: 12,
      greenPercentage: 12,
      bluePercentage: 5
    }
  ];

  const summaryCards = [
    {
      title: 'Total Services',
      value: '7',
      icon: <Building className="w-6 h-6" />,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Total Services',
      value: '814',
      icon: <Users className="w-6 h-6" />,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      title: 'Pending Services',
      value: '788',
      icon: <Clock className="w-6 h-6" />,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Completed',
      value: '15',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      title: 'Avg Performance',
      value: '2/100',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    }
  ];

  const getStatusBadge = (count, type) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (type) {
      case 'pending':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            {count}
          </span>
        );
      case 'inProgress':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            {count}
          </span>
        );
      case 'completed':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            {count}
          </span>
        );
      case 'churned':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            {count}
          </span>
        );
      case 'expired':
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            {count}
          </span>
        );
      case 'rating':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            {count}/100
          </span>
        );
      default:
        return <span className={baseClasses}>{count}</span>;
    }
  };

  const filteredServices = services.filter(service =>
    service.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Performance Overview</h1>
        <p className="text-gray-600">Monitor service performance and department metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {summaryCards.map((card, index) => (
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
          </div>
        ))}
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by service type, department, username or email.."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="ml-4">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{dateRange}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Service Type</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Pending</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>In Progress</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <UserX className="w-4 h-4" />
                    <span>Churned</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4" />
                    <span>Expired</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Total</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4" />
                    <BarChart3 className="w-4 h-4" />
                    <span>Overall Rating</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.map((service, index) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {service.serviceType}
                      </div>
                      <div className="text-sm text-gray-500">
                        {service.department}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(service.pending, 'pending')}
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(service.inProgress, 'inProgress')}
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(service.completed, 'completed')}
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(service.churned, 'churned')}
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(service.expired, 'expired')}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {service.total}
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      {getStatusBadge(service.overallRating, 'rating')}
                      <div className="flex space-x-2 text-xs">
                        <span className="text-green-600">{service.greenPercentage}%</span>
                        <span className="text-blue-600">{service.bluePercentage}%</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No services found</div>
          <div className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</div>
        </div>
      )}
    </div>
  );
};

export default Performance;
