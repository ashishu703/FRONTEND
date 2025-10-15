import React, { useState } from 'react';
import { Search, Filter, Plus, FileText, Download, Eye, Edit, Trash2, Calendar, DollarSign, User } from 'lucide-react';

const MobileQuotations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sample quotations data
  const quotations = [
    {
      id: 1,
      quoteNumber: 'QT-2024-001',
      customerName: 'ABC Industries',
      customerEmail: 'john@abc.com',
      amount: '₹2,50,000',
      status: 'sent',
      createdDate: '2024-01-15',
      validUntil: '2024-02-15',
      items: 5,
      lastModified: '2 hours ago'
    },
    {
      id: 2,
      quoteNumber: 'QT-2024-002',
      customerName: 'XYZ Corp',
      customerEmail: 'jane@xyz.com',
      amount: '₹1,80,000',
      status: 'approved',
      createdDate: '2024-01-14',
      validUntil: '2024-02-14',
      items: 3,
      lastModified: '1 day ago'
    },
    {
      id: 3,
      quoteNumber: 'QT-2024-003',
      customerName: 'Tech Solutions',
      customerEmail: 'mike@tech.com',
      amount: '₹3,20,000',
      status: 'pending',
      createdDate: '2024-01-13',
      validUntil: '2024-02-13',
      items: 7,
      lastModified: '3 days ago'
    },
    {
      id: 4,
      quoteNumber: 'QT-2024-004',
      customerName: 'Global Enterprises',
      customerEmail: 'sarah@global.com',
      amount: '₹4,50,000',
      status: 'rejected',
      createdDate: '2024-01-12',
      validUntil: '2024-02-12',
      items: 4,
      lastModified: '5 days ago'
    }
  ];

  const statusFilters = [
    { id: 'all', label: 'All', count: quotations.length },
    { id: 'pending', label: 'Pending', count: quotations.filter(q => q.status === 'pending').length },
    { id: 'sent', label: 'Sent', count: quotations.filter(q => q.status === 'sent').length },
    { id: 'approved', label: 'Approved', count: quotations.filter(q => q.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', count: quotations.filter(q => q.status === 'rejected').length }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredQuotations = quotations.filter(quote => {
    const matchesSearch = quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || quote.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Quotations</h1>
        <button className="p-2 bg-blue-600 text-white rounded-lg">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search quotations..."
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

      {/* Quotations List */}
      <div className="space-y-3">
        {filteredQuotations.map((quote) => (
          <div key={quote.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{quote.quoteNumber}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{quote.customerName}</p>
              </div>
              <div className="flex space-x-1">
                <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
                <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Edit className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Amount:</span>
                <span className="font-semibold text-gray-900">{quote.amount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Items:</span>
                <span className="text-gray-900">{quote.items} products</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Valid Until:</span>
                <span className="text-gray-900">{quote.validUntil}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Created: {quote.createdDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{quote.customerEmail}</span>
                </div>
              </div>
              <div className="flex space-x-1">
                <button className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors">
                  <Download className="h-3 w-3" />
                </button>
                <button className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredQuotations.length === 0 && (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No quotations found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default MobileQuotations;
