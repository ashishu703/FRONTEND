import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Plus, Phone, Mail, MapPin, Calendar, User, ChevronRight, 
  Building, FileText, Tag, Send, DollarSign, X, RefreshCw, Pencil, Eye,
  CheckCircle, Clock, AlertCircle, Package, Globe, MessageCircle
} from 'lucide-react';
import { useMarketingSharedData } from '../MarketingSharedDataContext';
import AddCustomerForm from '../../salesperson/salespersonaddcustomer.jsx';
import apiClient from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../api/admin_api/api';

const MobileLeads = () => {
  const { customers, loading, updateCustomer, addCustomer, deleteCustomer } = useMarketingSharedData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Advanced filters
  const [filters, setFilters] = useState({
    tag: '',
    followUpStatus: '',
    salesStatus: '',
    state: '',
    leadSource: ''
  });

  // Get unique filter options
  const uniqueTags = useMemo(() => {
    return [...new Set(customers.map(c => c.customerType).filter(t => t && t !== 'N/A'))].sort();
  }, [customers]);

  const uniqueStates = useMemo(() => {
    return [...new Set(customers.map(c => c.state).filter(s => s && s !== 'N/A'))].sort();
  }, [customers]);

  const uniqueLeadSources = useMemo(() => {
    return [...new Set(customers.map(c => c.enquiryBy).filter(s => s && s !== 'N/A'))].sort();
  }, [customers]);

  const statusFilters = [
    { id: 'all', label: 'All Status', count: customers.length },
    { id: 'pending', label: 'Pending', count: customers.filter(c => (c.salesStatus || '').toLowerCase() === 'pending').length },
    { id: 'follow up', label: 'Follow Up', count: customers.filter(c => (c.followUpStatus || '').toLowerCase() === 'follow up').length },
    { id: 'interested', label: 'Interested', count: customers.filter(c => (c.salesStatus || '').toLowerCase() === 'interested').length },
    { id: 'converted', label: 'Converted', count: customers.filter(c => (c.salesStatus || '').toLowerCase() === 'converted').length },
    { id: 'not interested', label: 'Not Interested', count: customers.filter(c => (c.salesStatus || '').toLowerCase() === 'not interested').length }
  ];

  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'converted':
      case 'win':
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'not interested':
      case 'lost':
        return 'bg-red-100 text-red-800';
      case 'follow up':
      case 'appointment scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'interested':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  const getCustomerTypeColor = (type) => {
    if (!type || type === 'N/A') return 'bg-gray-100 text-gray-800';
    return 'bg-indigo-100 text-indigo-800';
  };

  // Filter leads
  const filteredLeads = useMemo(() => {
    let result = [...customers];
    
    // Search filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter(lead => {
        return (
          (lead.name || '').toLowerCase().includes(query) ||
          (lead.phone || '').includes(query) ||
          (lead.business || '').toLowerCase().includes(query) ||
          (lead.email || '').toLowerCase().includes(query) ||
          (lead.state || '').toLowerCase().includes(query)
        );
      });
    }
    
    // Status filter
    if (selectedFilter !== 'all') {
      result = result.filter(lead => {
        const salesStatus = (lead.salesStatus || '').toLowerCase();
        const followUpStatus = (lead.followUpStatus || '').toLowerCase();
        return salesStatus === selectedFilter || followUpStatus === selectedFilter;
      });
    }
    
    // Advanced filters
    if (filters.tag) {
      result = result.filter(lead => 
        (lead.customerType || '').toLowerCase() === filters.tag.toLowerCase()
      );
    }
    
    if (filters.followUpStatus) {
      result = result.filter(lead => 
        (lead.followUpStatus || '').toLowerCase() === filters.followUpStatus.toLowerCase()
      );
    }
    
    if (filters.salesStatus) {
      result = result.filter(lead => 
        (lead.salesStatus || '').toLowerCase() === filters.salesStatus.toLowerCase()
      );
    }
    
    if (filters.state) {
      result = result.filter(lead => 
        (lead.state || '').toLowerCase() === filters.state.toLowerCase()
      );
    }
    
    if (filters.leadSource) {
      result = result.filter(lead => 
        (lead.enquiryBy || '').toLowerCase() === filters.leadSource.toLowerCase()
      );
    }
    
    return result;
  }, [customers, searchTerm, selectedFilter, filters]);

  const handleLeadClick = (lead) => {
    if (selectedLead?.id === lead.id) {
      setSelectedLead(null);
    } else {
      setSelectedLead(lead);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh will be handled by the context
      window.location.reload();
    } catch (error) {
      console.error('Error refreshing leads:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEditLead = (lead) => {
    setEditingCustomer(lead);
    setShowAddCustomer(true);
  };

  const handleSaveCustomer = async (customerData) => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, customerData);
      } else {
        await addCustomer(customerData);
      }
      setShowAddCustomer(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error('Error saving customer:', error);
      alert(`Failed to ${editingCustomer ? 'update' : 'add'} customer. Please try again.`);
    }
  };

  const clearFilters = () => {
    setFilters({
      tag: '',
      followUpStatus: '',
      salesStatus: '',
      state: '',
      leadSource: ''
    });
    setSelectedFilter('all');
    setSearchTerm('');
  };

  const hasActiveFilters = Object.values(filters).some(f => f !== '') || selectedFilter !== 'all';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="p-4 space-y-3">
          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`p-2 rounded-lg border transition-colors ${
                hasActiveFilters 
                  ? 'bg-blue-50 border-blue-300 text-blue-700' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <Filter className="h-5 w-5" />
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {statusFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="border-t border-gray-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Advanced Filters</h3>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {/* Tag Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tag</label>
                <select
                  value={filters.tag}
                  onChange={(e) => setFilters(prev => ({ ...prev, tag: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Tags</option>
                  {uniqueTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              {/* Follow Up Status */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Follow Up Status</label>
                <select
                  value={filters.followUpStatus}
                  onChange={(e) => setFilters(prev => ({ ...prev, followUpStatus: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="follow up">Follow Up</option>
                  <option value="appointment scheduled">Appointment Scheduled</option>
                  <option value="connected">Connected</option>
                  <option value="not connected">Not Connected</option>
                </select>
              </div>

              {/* Sales Status */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Sales Status</label>
                <select
                  value={filters.salesStatus}
                  onChange={(e) => setFilters(prev => ({ ...prev, salesStatus: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="interested">Interested</option>
                  <option value="converted">Converted</option>
                  <option value="not interested">Not Interested</option>
                </select>
              </div>

              {/* State Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                <select
                  value={filters.state}
                  onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All States</option>
                  {uniqueStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* Lead Source */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Lead Source</label>
                <select
                  value={filters.leadSource}
                  onChange={(e) => setFilters(prev => ({ ...prev, leadSource: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sources</option>
                  {uniqueLeadSources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Leads List */}
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading leads...</div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm mb-4">
              {searchTerm || hasActiveFilters ? 'No leads match your filters' : 'No leads found'}
            </p>
            {!searchTerm && !hasActiveFilters && (
              <button
                onClick={() => setShowAddCustomer(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 inline mr-1" />
                Add Lead
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="text-xs text-gray-500 mb-2">
              Showing {filteredLeads.length} of {customers.length} leads
            </div>
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className={`bg-white rounded-lg shadow-sm border transition-all ${
                  selectedLead?.id === lead.id
                    ? 'border-blue-500 shadow-md'
                    : 'border-gray-100'
                }`}
              >
                {/* Lead Card Header */}
                <div
                  className="p-3 cursor-pointer"
                  onClick={() => handleLeadClick(lead)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1">
                        {lead.name || 'N/A'}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        {lead.salesStatus && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.salesStatus)}`}>
                            {lead.salesStatus}
                          </span>
                        )}
                        {lead.customerType && lead.customerType !== 'N/A' && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCustomerTypeColor(lead.customerType)}`}>
                            {lead.customerType}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ${
                        selectedLead?.id === lead.id ? 'rotate-90' : ''
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    {lead.phone && lead.phone !== 'N/A' && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{lead.phone}</span>
                      </div>
                    )}
                    {lead.business && lead.business !== 'N/A' && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Building className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{lead.business}</span>
                      </div>
                    )}
                    {lead.state && lead.state !== 'N/A' && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{lead.state}</span>
                      </div>
                    )}
                    {lead.date && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span>{new Date(lead.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedLead?.id === lead.id && (
                  <div className="border-t border-gray-100 p-3 space-y-3">
                    {/* Contact Information */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-gray-700 uppercase">Contact Information</h4>
                      {lead.email && lead.email !== 'N/A' && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span>{lead.email}</span>
                        </div>
                      )}
                      {lead.address && lead.address !== 'N/A' && (
                        <div className="flex items-start gap-2 text-xs text-gray-600">
                          <MapPin className="h-3 w-3 mt-0.5" />
                          <span>{lead.address}</span>
                        </div>
                      )}
                      {lead.gstNo && lead.gstNo !== 'N/A' && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <FileText className="h-3 w-3" />
                          <span className="font-mono">GST: {lead.gstNo}</span>
                        </div>
                      )}
                    </div>

                    {/* Lead Details */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-gray-700 uppercase">Lead Details</h4>
                      {lead.productName && lead.productName !== 'N/A' && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Package className="h-3 w-3" />
                          <span>{lead.productName}</span>
                        </div>
                      )}
                      {lead.enquiryBy && lead.enquiryBy !== 'N/A' && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Globe className="h-3 w-3" />
                          <span>Source: {lead.enquiryBy}</span>
                        </div>
                      )}
                      {lead.followUpStatus && (
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className="h-3 w-3 text-yellow-600" />
                          <span className="text-gray-600">Follow Up: <span className="font-medium">{lead.followUpStatus}</span></span>
                        </div>
                      )}
                      {lead.followUpDate && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>Follow Up Date: {new Date(lead.followUpDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Remarks */}
                    {(lead.salesStatusRemark || lead.followUpRemark) && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-700 uppercase">Remarks</h4>
                        {lead.salesStatusRemark && (
                          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            <span className="font-medium">Sales:</span> {lead.salesStatusRemark}
                          </div>
                        )}
                        {lead.followUpRemark && (
                          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            <span className="font-medium">Follow Up:</span> {lead.followUpRemark}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditLead(lead);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                      {lead.phone && lead.phone !== 'N/A' && (
                        <a
                          href={`tel:${lead.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center px-3 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                        >
                          <Phone className="h-3 w-3" />
                        </a>
                      )}
                      {lead.whatsapp && (
                        <a
                          href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center px-3 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                        >
                          <MessageCircle className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => {
          setEditingCustomer(null);
          setShowAddCustomer(true);
        }}
        className="fixed bottom-24 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-30"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add/Edit Customer Modal */}
      {showAddCustomer && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddCustomer(false);
              setEditingCustomer(null);
            }
          }}
        >
          <div 
            className="bg-white w-full max-h-[90vh] rounded-t-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCustomer ? 'Edit Lead' : 'Add New Lead'}
              </h2>
              <button
                onClick={() => {
                  setShowAddCustomer(false);
                  setEditingCustomer(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <AddCustomerForm
                editingCustomer={editingCustomer}
                onSave={handleSaveCustomer}
                onClose={() => {
                  setShowAddCustomer(false);
                  setEditingCustomer(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileLeads;
