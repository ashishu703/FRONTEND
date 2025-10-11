import React from 'react';
import { TrendingUp, Users, DollarSign, Calendar, ArrowUp, ArrowDown, Eye } from 'lucide-react';

const MobileDashboard = () => {
  // Sample data - replace with real data from your API
  const stats = [
    {
      title: 'Total Leads',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Converted',
      value: '8',
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Revenue',
      value: '₹2.4L',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: 'Follow-ups',
      value: '12',
      change: '-2%',
      trend: 'down',
      icon: Calendar,
      color: 'bg-orange-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'lead',
      title: 'New lead assigned',
      description: 'John Doe from Mumbai',
      time: '2 minutes ago',
      status: 'new'
    },
    {
      id: 2,
      type: 'quotation',
      title: 'Quotation sent',
      description: 'QT-2024-001 for ₹50,000',
      time: '1 hour ago',
      status: 'sent'
    },
    {
      id: 3,
      type: 'followup',
      title: 'Follow-up completed',
      description: 'Meeting with ABC Corp',
      time: '3 hours ago',
      status: 'completed'
    },
    {
      id: 4,
      type: 'conversion',
      title: 'Lead converted',
      description: 'XYZ Industries - ₹75,000 deal',
      time: '1 day ago',
      status: 'converted'
    }
  ];

  const quickActions = [
    { label: 'Add Lead', icon: Users, color: 'bg-blue-500' },
    { label: 'Create Quote', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Schedule Follow-up', icon: Calendar, color: 'bg-purple-500' },
    { label: 'View Reports', icon: Eye, color: 'bg-orange-500' }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold mb-2">Good morning!</h2>
        <p className="text-blue-100">Here's your sales overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className={`flex items-center text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className={`p-3 rounded-full ${action.color} mb-2`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.status === 'new' ? 'bg-blue-500' :
                activity.status === 'sent' ? 'bg-yellow-500' :
                activity.status === 'completed' ? 'bg-green-500' :
                'bg-purple-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;
