import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const MobileMarketingSalespersonVisits = () => {
  const [visits, setVisits] = useState([
    {
      id: 1,
      customerName: 'Rajesh Kumar',
      customerPhone: '+91 98765 43210',
      address: '123 Main Street, Mumbai',
      area: 'Andheri',
      scheduledDate: '2025-01-20',
      scheduledTime: '10:00 AM',
      status: 'Scheduled',
      purpose: 'Product Demonstration',
      notes: 'Interested in Industrial Motors',
      visitType: 'First Visit',
      priority: 'High'
    },
    {
      id: 2,
      customerName: 'Priya Sharma',
      customerPhone: '+91 87654 32109',
      address: '456 Park Avenue, Delhi',
      area: 'Connaught Place',
      scheduledDate: '2025-01-21',
      scheduledTime: '2:00 PM',
      status: 'Completed',
      purpose: 'Follow-up Meeting',
      notes: 'Discussed LED Street Lights',
      visitType: 'Follow-up',
      priority: 'Medium'
    },
    {
      id: 3,
      customerName: 'Amit Patel',
      customerPhone: '+91 76543 21098',
      address: '789 Business District, Bangalore',
      area: 'Electronic City',
      scheduledDate: '2025-01-22',
      scheduledTime: '11:00 AM',
      status: 'Cancelled',
      purpose: 'Quotation Discussion',
      notes: 'Customer cancelled due to emergency',
      visitType: 'Follow-up',
      priority: 'Low'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedVisit, setExpandedVisit] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Rescheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = visit.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visit.customerPhone.includes(searchTerm) ||
                         visit.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || visit.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleVisitExpansion = (visitId) => {
    setExpandedVisit(expandedVisit === visitId ? null : visitId);
  };

  const handleStatusChange = (visitId, newStatus) => {
    setVisits(visits.map(visit => 
      visit.id === visitId ? { ...visit, status: newStatus } : visit
    ));
  };

  const handleDeleteVisit = (visitId) => {
    setVisits(visits.filter(visit => visit.id !== visitId));
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Mobile Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Visits</h1>
        
        {/* Mobile Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search visits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Visit</span>
            </button>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Visits List */}
      <div className="space-y-3">
        {filteredVisits.map((visit) => (
          <div key={visit.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Visit Header */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{visit.customerName}</h3>
                  <p className="text-sm text-gray-600">{visit.customerPhone}</p>
                  <p className="text-xs text-gray-500">{visit.address}</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                    {visit.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(visit.priority)}`}>
                    {visit.priority}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{visit.scheduledDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{visit.scheduledTime}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{visit.purpose}</span>
                <button
                  onClick={() => toggleVisitExpansion(visit.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {expandedVisit === visit.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Expanded Visit Details */}
            {expandedVisit === visit.id && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="space-y-3 mt-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Visit Type:</span>
                      <p className="text-gray-900">{visit.visitType}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Priority:</span>
                      <p className="text-gray-900">{visit.priority}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Purpose:</span>
                      <p className="text-gray-900">{visit.purpose}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Notes:</span>
                      <p className="text-gray-900">{visit.notes}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-3">
                    {visit.status === 'Scheduled' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(visit.id, 'Completed')}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Complete</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(visit.id, 'Cancelled')}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setEditingVisit(visit)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteVisit(visit.id)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Visit Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Add New Visit</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-center py-8">Add Visit Form - Implementation needed</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Visit Modal */}
      {editingVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Edit Visit</h2>
              <button 
                onClick={() => setEditingVisit(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-center py-8">Edit Visit Form - Implementation needed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMarketingSalespersonVisits;
