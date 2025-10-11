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
      status: 'new',
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
      status: 'contacted',
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
      status: 'qualified',
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
      status: 'proposal',
      value: '₹4,50,000',
      assignedDate: '2024-01-12',
      lastContact: '5 days ago',
      priority: 'low'
    }
  ];

  const statusFilters = [
    { id: 'all', label: 'All Leads', count: leads.length },
    { id: 'new', label: 'New', count: leads.filter(l => l.status === 'new').length },
    { id: 'contacted', label: 'Contacted', count: leads.filter(l => l.status === 'contacted').length },
    { id: 'qualified', label: 'Qualified', count: leads.filter(l => l.status === 'qualified').length },
    { id: 'proposal', label: 'Proposal', count: leads.filter(l => l.status === 'proposal').length }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
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
        <h1 className="text-xl font-bold text-gray-900">Leads</h1>
        <button className="p-2 bg-blue-600 text-white rounded-lg">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
      <div className="space-y-3">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                    {lead.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{lead.company}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{lead.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{lead.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{lead.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{lead.value}</p>
                <p className="text-xs text-gray-500">Last contact: {lead.lastContact}</p>
              </div>
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <ChevronRight className="h-4 w-4 text-gray-600" />
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
