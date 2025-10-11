import React, { useState } from 'react';
import { Search, Filter, Plus, Phone, Mail, MapPin, Calendar, User, ChevronRight } from 'lucide-react';

const MobileLeads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Sample leads data - replace with real data from your API
  const leads = [
    {
      id: 1,
      name: 'John Doe',
      company: 'ABC Industries',
      email: 'john@abc.com',
      phone: '+91 98765 43210',
      location: 'Mumbai, Maharashtra',
      status: 'win',
      value: '₹2,50,000',
      assignedDate: '2024-01-15',
      lastContact: '2 hours ago',
      priority: 'high'
    },
    {
      id: 2,
      name: 'Jane Smith',
      company: 'XYZ Corp',
      email: 'jane@xyz.com',
      phone: '+91 87654 32109',
      location: 'Delhi, NCR',
      status: 'loose',
      value: '₹1,80,000',
      assignedDate: '2024-01-14',
      lastContact: '1 day ago',
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      company: 'Tech Solutions',
      email: 'mike@tech.com',
      phone: '+91 76543 21098',
      location: 'Bangalore, Karnataka',
      status: 'win',
      value: '₹3,20,000',
      assignedDate: '2024-01-13',
      lastContact: '3 days ago',
      priority: 'high'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      company: 'Global Enterprises',
      email: 'sarah@global.com',
      phone: '+91 65432 10987',
      location: 'Chennai, Tamil Nadu',
      status: 'closed',
      value: '₹4,50,000',
      assignedDate: '2024-01-12',
      lastContact: '5 days ago',
      priority: 'low'
    }
  ];

  const statusFilters = [
    { id: 'all', label: 'All Leads', count: leads.length },
    { id: 'win', label: 'Win Leads', count: leads.filter(l => l.status === 'win').length },
    { id: 'loose', label: 'Loose Leads', count: leads.filter(l => l.status === 'loose').length },
    { id: 'closed', label: 'Closed Leads', count: leads.filter(l => l.status === 'closed').length }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'win': return 'bg-green-100 text-green-800';
      case 'loose': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
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

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || lead.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Leads</h1>
        <button className="p-1.5 bg-blue-600 text-white rounded-lg">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 overflow-x-auto pb-1">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedFilter === filter.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* Leads List */}
      <div className="space-y-2">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-sm text-gray-900">{lead.name}</h3>
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                    {lead.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{lead.company}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
            </div>

            <div className="space-y-1 mb-2">
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Phone className="h-3 w-3" />
                <span className="truncate">{lead.phone}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Mail className="h-3 w-3" />
                <span className="truncate">{lead.email}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{lead.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-900">{lead.value}</p>
                <p className="text-xs text-gray-500">Last: {lead.lastContact}</p>
              </div>
              <button className="p-1.5 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                <ChevronRight className="h-3 w-3 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredLeads.length === 0 && (
        <div className="text-center py-8">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No leads found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default MobileLeads;
