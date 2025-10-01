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
  Target,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

function cx(...classes) {
  return classes.filter(Boolean).join(" ")
}

function Card({ className, children }) {
  return <div className={cx("rounded-lg border bg-white transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1", className)}>{children}</div>
}

function CardHeader({ className, children }) {
  return <div className={cx("p-4", className)}>{children}</div>
}

function CardTitle({ className, children }) {
  return <div className={cx("text-base font-semibold", className)}>{children}</div>
}

function CardContent({ className, children }) {
  return <div className={cx("p-4 pt-0", className)}>{children}</div>
}

const MarketingSalespersonDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const marketingCards = [
    {
      title: 'Total Marketing Leads',
      value: '45',
      description: 'All marketing leads generated',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: 'Active Campaigns',
      value: '8',
      description: 'Currently running campaigns',
      icon: <Activity className="w-5 h-5" />,
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      title: 'Today\'s Visits',
      value: '6',
      description: 'Scheduled visits for today',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      title: 'Conversion Rate',
      value: '33.3%',
      description: 'Lead to customer conversion',
      icon: <Percent className="w-5 h-5" />,
      color: 'bg-orange-50 text-orange-600 border-orange-200'
    },
    {
      title: 'Revenue Generated',
      value: '₹1,80,000',
      description: 'This month\'s revenue',
      icon: <IndianRupee className="w-5 h-5" />,
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      title: 'Pending Follow-ups',
      value: '8',
      description: 'Leads requiring follow-up',
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-red-50 text-red-600 border-red-200'
    }
  ];

  const marketingTeam = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      leads: 15,
      conversions: 8,
      revenue: 45000,
      performance: 'Excellent',
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'Campaign Specialist',
      leads: 12,
      conversions: 5,
      revenue: 32000,
      performance: 'Good',
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Emily Davis',
      role: 'Content Creator',
      leads: 18,
      conversions: 7,
      revenue: 38000,
      performance: 'Good',
      avatar: 'ED'
    }
  ];

  const todayVisits = [
    {
      id: 1,
      customer: 'TechCorp Solutions',
      time: '10:00 AM',
      address: '123 Business Park, Mumbai',
      salesperson: 'Sarah Johnson',
      status: 'Scheduled'
    },
    {
      id: 2,
      customer: 'InnovateTech Ltd',
      time: '2:00 PM',
      address: '456 Tech Street, Delhi',
      salesperson: 'Mike Chen',
      status: 'Confirmed'
    },
    {
      id: 3,
      customer: 'Digital Solutions Inc',
      time: '4:30 PM',
      address: '789 Innovation Hub, Bangalore',
      salesperson: 'Emily Davis',
      status: 'Pending'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Marketing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {marketingCards.map((card, index) => (
          <Card key={index} className={cx("border-2 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50", card.color)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium transition-all duration-300 group-hover:text-gray-800 group-hover:font-semibold">{card.title}</CardTitle>
              <div className="p-2 rounded-full bg-white shadow-md group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                {card.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 transition-all duration-300 group-hover:scale-110">{card.value}</div>
              <p className="text-xs text-gray-500 transition-all duration-300 group-hover:text-gray-700">{card.description}</p>
              <div className="w-full bg-gradient-to-r from-current to-transparent opacity-30 h-2 rounded-full transition-all duration-300 group-hover:opacity-50 group-hover:h-2.5 mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Visits Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-blue-600">Today's Visits</h2>
        </div>
        <Card className="border-2 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salesperson</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {todayVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-md group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 transition-colors duration-300 group-hover:text-blue-800">
                      {visit.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 transition-colors duration-300 group-hover:text-blue-700">
                      {visit.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 transition-colors duration-300 group-hover:text-blue-700">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                        {visit.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 group-hover:text-blue-700 transition-colors duration-300">
                      {visit.salesperson}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full transition-all duration-300 group-hover:scale-105 ${
                        visit.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        visit.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {visit.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Marketing Team Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-blue-600">Marketing Team Performance</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketingTeam.map((member) => (
            <Card key={member.id} className="border-2 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <span className="text-lg font-bold text-blue-600">{member.avatar}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-800">{member.name}</h3>
                    <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-blue-700">{member.role}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-800">Leads</span>
                    <span className="text-sm font-medium text-gray-900 transition-all duration-300 group-hover:scale-110">{member.leads}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-800">Conversions</span>
                    <span className="text-sm font-medium text-gray-900 transition-all duration-300 group-hover:scale-110">{member.conversions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-800">Revenue</span>
                    <span className="text-sm font-medium text-green-600 transition-all duration-300 group-hover:scale-110">₹{member.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-800">Performance</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full transition-all duration-300 group-hover:scale-105 ${
                      member.performance === 'Excellent' ? 'bg-green-100 text-green-800' :
                      member.performance === 'Good' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.performance}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketingSalespersonDashboard;
