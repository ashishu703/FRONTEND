import React, { useState } from 'react';
import { Search, Filter, Plus, Calendar, Phone, Mail, CheckCircle, Clock, X, User, MapPin } from 'lucide-react';

const MobileFollowUps = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sample follow-ups data
  const followUps = [
    {
      id: 1,
      customerName: 'John Doe',
      company: 'ABC Industries',
      type: 'call',
      status: 'pending',
      scheduledDate: '2024-01-16',
      scheduledTime: '10:00 AM',
      priority: 'high',
      notes: 'Discuss pricing for cable installation project',
      contactInfo: {
        phone: '+91 98765 43210',
        email: 'john@abc.com',
        location: 'Mumbai, Maharashtra'
      },
      lastContact: '2 days ago'
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      company: 'XYZ Corp',
      type: 'meeting',
      status: 'completed',
      scheduledDate: '2024-01-15',
      scheduledTime: '2:00 PM',
      priority: 'medium',
      notes: 'Product demonstration completed successfully',
      contactInfo: {
        phone: '+91 87654 32109',
        email: 'jane@xyz.com',
        location: 'Delhi, NCR'
      },
      lastContact: '1 day ago'
    },
    {
      id: 3,
      customerName: 'Mike Johnson',
      company: 'Tech Solutions',
      type: 'email',
      status: 'overdue',
      scheduledDate: '2024-01-14',
      scheduledTime: '3:00 PM',
      priority: 'high',
      notes: 'Send quotation for electrical components',
      contactInfo: {
        phone: '+91 76543 21098',
        email: 'mike@tech.com',
        location: 'Bangalore, Karnataka'
      },
      lastContact: '3 days ago'
    },
    {
      id: 4,
      customerName: 'Sarah Wilson',
      company: 'Global Enterprises',
      type: 'call',
      status: 'scheduled',
      scheduledDate: '2024-01-17',
      scheduledTime: '11:00 AM',
      priority: 'low',
      notes: 'Follow up on proposal submission',
      contactInfo: {
        phone: '+91 65432 10987',
        email: 'sarah@global.com',
        location: 'Chennai, Tamil Nadu'
      },
      lastContact: '5 days ago'
    }
  ];

  const statusFilters = [
    { id: 'all', label: 'All', count: followUps.length },
    { id: 'pending', label: 'Pending', count: followUps.filter(f => f.status === 'pending').length },
    { id: 'scheduled', label: 'Scheduled', count: followUps.filter(f => f.status === 'scheduled').length },
    { id: 'completed', label: 'Completed', count: followUps.filter(f => f.status === 'completed').length },
    { id: 'overdue', label: 'Overdue', count: followUps.filter(f => f.status === 'overdue').length }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'call': return Phone;
      case 'meeting': return Calendar;
      case 'email': return Mail;
      default: return Clock;
    }
  };

  const filteredFollowUps = followUps.filter(followUp => {
    const matchesSearch = followUp.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         followUp.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || followUp.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Follow-ups</h1>
        <button className="p-2 bg-blue-600 text-white rounded-lg">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search follow-ups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Status Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedStatus(filter.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedStatus === filter.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* Follow-ups List */}
      <div className="space-y-3">
        {filteredFollowUps.map((followUp) => {
          const TypeIcon = getTypeIcon(followUp.type);
          return (
            <div key={followUp.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{followUp.customerName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(followUp.priority)}`}>
                      {followUp.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{followUp.company}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(followUp.status)}`}>
                    {followUp.status}
                  </span>
                  <div className="p-1 bg-gray-100 rounded">
                    <TypeIcon className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Scheduled:</span>
                  <span className="font-medium text-gray-900">{followUp.scheduledDate} at {followUp.scheduledTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type:</span>
                  <span className="text-gray-900 capitalize">{followUp.type}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Notes:</span>
                  <span className="ml-2 text-gray-900">{followUp.notes}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{followUp.contactInfo.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{followUp.contactInfo.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{followUp.contactInfo.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Last contact: {followUp.lastContact}
                </div>
                <div className="flex space-x-2">
                  {followUp.status === 'pending' && (
                    <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors">
                      <CheckCircle className="h-3 w-3 inline mr-1" />
                      Complete
                    </button>
                  )}
                  {followUp.status === 'overdue' && (
                    <button className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Reschedule
                    </button>
                  )}
                  <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors">
                    <Phone className="h-3 w-3 inline mr-1" />
                    Call
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredFollowUps.length === 0 && (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No follow-ups found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default MobileFollowUps;
