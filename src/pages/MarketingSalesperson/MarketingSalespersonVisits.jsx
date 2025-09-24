import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const Visits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  console.log('Visits component is rendering');

  // Mock data for demonstration
  useEffect(() => {
    const mockVisits = [
      {
        id: 1,
        customerName: 'Rajesh Kumar',
        company: 'Kumar Industries',
        visitDate: '2024-01-15',
        visitTime: '10:00 AM',
        status: 'scheduled',
        address: '123 Industrial Area, Mumbai',
        phone: '+91 98765 43210',
        email: 'rajesh@kumarindustries.com',
        purpose: 'Product Demo',
        notes: 'Interested in industrial motors'
      },
      {
        id: 2,
        customerName: 'Priya Sharma',
        company: 'Sharma Enterprises',
        visitDate: '2024-01-16',
        visitTime: '2:00 PM',
        status: 'completed',
        address: '456 Business Park, Delhi',
        phone: '+91 98765 43211',
        email: 'priya@sharmaenterprises.com',
        purpose: 'Follow-up Meeting',
        notes: 'Discussed pricing and delivery'
      },
      {
        id: 3,
        customerName: 'Amit Patel',
        company: 'Patel Motors',
        visitDate: '2024-01-17',
        visitTime: '11:30 AM',
        status: 'pending',
        address: '789 Auto Zone, Ahmedabad',
        phone: '+91 98765 43212',
        email: 'amit@patelmotors.com',
        purpose: 'Initial Consultation',
        notes: 'New customer inquiry'
      }
    ];
    setVisits(mockVisits);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return <Calendar className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = visit.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visit.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || visit.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Visits Management</h1>
            <p className="text-gray-600">Manage your customer visits and appointments</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Schedule Visit</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search visits by customer name or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { title: 'Total Visits', value: visits.length, icon: MapPin, color: 'bg-blue-50 text-blue-600' },
          { title: 'Scheduled', value: visits.filter(v => v.status === 'scheduled').length, icon: Calendar, color: 'bg-blue-50 text-blue-600' },
          { title: 'Completed', value: visits.filter(v => v.status === 'completed').length, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
          { title: 'Pending', value: visits.filter(v => v.status === 'pending').length, icon: Clock, color: 'bg-yellow-50 text-yellow-600' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visits List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Visits</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredVisits.length > 0 ? (
            filteredVisits.map((visit) => (
              <div key={visit.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{visit.customerName}</h4>
                        <p className="text-sm text-gray-600">{visit.company}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{visit.visitDate}</p>
                      <p className="text-sm text-gray-600">{visit.visitTime}</p>
                    </div>
                    
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${getStatusColor(visit.status)}`}>
                      {getStatusIcon(visit.status)}
                      <span className="text-sm font-medium capitalize">{visit.status}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{visit.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{visit.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{visit.email}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Purpose:</span> {visit.purpose}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Notes:</span> {visit.notes}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No visits found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visits;