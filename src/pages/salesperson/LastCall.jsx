"use client"

import React, { useState, useEffect } from 'react';
import { Eye, Edit, MessageCircle, Mail, Search, Filter, Download, ChevronDown, X, Save, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CheckCircle, Clock, FileText, Receipt, CreditCard, Phone } from 'lucide-react';
import apiClient from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../api/admin_api/api';

// Lead Status Preview Modal Component
const LeadStatusPreview = ({ lead, onClose }) => {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Customer Timeline</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Customer Details */}
          <div className="mb-6">
            <h4 className="text-md font-bold text-gray-900 mb-3">Customer Details</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-600">Customer Name:</span>
                <span className="ml-2 text-gray-900">{lead.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Business Name:</span>
                <span className="ml-2 text-gray-900">{lead.business || 'N/A'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Contact No:</span>
                <span className="ml-2 text-gray-900">{lead.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Email Address:</span>
                <span className="ml-2 text-gray-900">{lead.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            <h4 className="text-md font-bold text-gray-900 mb-4">Timeline</h4>
            
            {/* Timeline Line */}
            <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-300"></div>
            
            <div className="space-y-6">
              {/* Customer Created */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">Customer Created</h5>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        COMPLETED
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>{new Date(lead.created_at).toLocaleDateString('en-GB')}</div>
                      <div>Lead ID: LD-{lead.id}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Follow Up Status */}
              <div className="relative flex items-start">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                  lead.follow_up_status === 'appointment scheduled' ? 'bg-blue-500' :
                  lead.follow_up_status === 'not interested' ? 'bg-red-500' :
                  lead.follow_up_status === 'interested' ? 'bg-green-500' :
                  lead.follow_up_status === 'quotation sent' ? 'bg-purple-500' :
                  lead.follow_up_status === 'negotiation' ? 'bg-orange-500' :
                  lead.follow_up_status === 'close order' ? 'bg-emerald-500' :
                  lead.follow_up_status === 'closed/lost' ? 'bg-red-500' :
                  lead.follow_up_status === 'call back request' ? 'bg-yellow-500' :
                  lead.follow_up_status === 'unreachable/call not connected' ? 'bg-red-500' :
                  lead.follow_up_status === 'currently not required' ? 'bg-gray-500' :
                  lead.follow_up_status === 'not relevant' ? 'bg-gray-500' :
                  'bg-gray-500'
                }`}>
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">Follow Up Status</h5>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        lead.follow_up_status === 'appointment scheduled' ? 'bg-blue-100 text-blue-800' :
                        lead.follow_up_status === 'not interested' ? 'bg-red-100 text-red-800' :
                        lead.follow_up_status === 'interested' ? 'bg-green-100 text-green-800' :
                        lead.follow_up_status === 'quotation sent' ? 'bg-purple-100 text-purple-800' :
                        lead.follow_up_status === 'negotiation' ? 'bg-orange-100 text-orange-800' :
                        lead.follow_up_status === 'close order' ? 'bg-emerald-100 text-emerald-800' :
                        lead.follow_up_status === 'closed/lost' ? 'bg-red-100 text-red-800' :
                        lead.follow_up_status === 'call back request' ? 'bg-yellow-100 text-yellow-800' :
                        lead.follow_up_status === 'unreachable/call not connected' ? 'bg-red-100 text-red-800' :
                        lead.follow_up_status === 'currently not required' ? 'bg-gray-100 text-gray-800' :
                        lead.follow_up_status === 'not relevant' ? 'bg-gray-100 text-gray-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.follow_up_status?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {lead.follow_up_remark && (
                        <div className="font-bold text-gray-900 mb-1">{lead.follow_up_remark}</div>
                      )}
                      {lead.follow_up_date && lead.follow_up_time && (
                        <div>Scheduled: {lead.follow_up_date} at {lead.follow_up_time}</div>
                      )}
                      <div>Updated: {lead.updated_at ? new Date(lead.updated_at).toLocaleDateString('en-GB') : 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Status */}
              <div className="relative flex items-start">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                  lead.sales_status === 'pending' ? 'bg-yellow-500' :
                  lead.sales_status === 'running' ? 'bg-blue-500' :
                  lead.sales_status === 'converted' ? 'bg-green-500' :
                  lead.sales_status === 'lost/closed' ? 'bg-red-500' :
                  lead.sales_status === 'interested' ? 'bg-purple-500' :
                  lead.sales_status === 'win lead' ? 'bg-emerald-500' :
                  'bg-gray-500'
                }`}>
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">Lead Status</h5>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        lead.sales_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        lead.sales_status === 'running' ? 'bg-blue-100 text-blue-800' :
                        lead.sales_status === 'converted' ? 'bg-green-100 text-green-800' :
                        lead.sales_status === 'lost/closed' ? 'bg-red-100 text-red-800' :
                        lead.sales_status === 'interested' ? 'bg-purple-100 text-purple-800' :
                        lead.sales_status === 'win lead' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.sales_status?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {lead.sales_status_remark && (
                        <div className="font-bold text-gray-900 mb-1">{lead.sales_status_remark}</div>
                      )}
                      <div>Updated: {lead.updated_at ? new Date(lead.updated_at).toLocaleDateString('en-GB') : 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quotation Status */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center z-10">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">Quotation Status</h5>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                        PENDING
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Date: N/A</div>
                      <div>Time: N/A</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PI Status */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center z-10">
                  <Receipt className="h-4 w-4 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">PI Status</h5>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                        PENDING
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Date: N/A</div>
                      <div>Time: N/A</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center z-10">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">Payment Status</h5>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                        PENDING
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Amount: N/A</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Lead Status Modal Component
const EditLeadStatusModal = ({ lead, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    sales_status: lead?.sales_status || 'pending',
    sales_status_remark: lead?.sales_status_remark || '',
    follow_up_status: lead?.follow_up_status || '',
    follow_up_remark: lead?.follow_up_remark || '',
    follow_up_date: lead?.follow_up_date || '',
    follow_up_time: lead?.follow_up_time || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await onSave(lead.id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating lead status:', error);
      alert('Failed to update lead status');
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'running', label: 'Running' },
    { value: 'converted', label: 'Converted' },
    { value: 'lost/closed', label: 'Lost/Closed' },
    { value: 'interested', label: 'Interested' },
    { value: 'win lead', label: 'Win Lead' }
  ];

  const followUpOptions = [
    { value: '', label: 'Select Follow Up Status' },
    { value: 'appointment scheduled', label: 'Appointment Scheduled' },
    { value: 'not interested', label: 'Not Interested' },
    { value: 'interested', label: 'Interested' },
    { value: 'quotation sent', label: 'Quotation Sent' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'close order', label: 'Close Order' },
    { value: 'closed/lost', label: 'Closed/Lost' },
    { value: 'call back request', label: 'Call Back Request' },
    { value: 'unreachable/call not connected', label: 'Unreachable/Call Not Connected' },
    { value: 'currently not required', label: 'Currently Not Required' },
    { value: 'not relevant', label: 'Not Relevant' }
  ];

  // Check if date/time fields should be shown
  const showDateTimeFields = ['appointment scheduled', 'interested', 'negotiation', 'call back request'].includes(formData.follow_up_status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Update Lead Status & Follow Up</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Follow Up Status
            </label>
            <select
              name="follow_up_status"
              value={formData.follow_up_status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {followUpOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Follow Up Remark
            </label>
            <textarea
              name="follow_up_remark"
              value={formData.follow_up_remark}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter any remarks about the follow up..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lead Status *
            </label>
            <select
              name="sales_status"
              value={formData.sales_status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lead Status Remark
            </label>
            <textarea
              name="sales_status_remark"
              value={formData.sales_status_remark}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter any remarks about the lead status..."
            />
          </div>

          {showDateTimeFields && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Follow Up Date *
                </label>
                <input
                  type="date"
                  name="follow_up_date"
                  value={formData.follow_up_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required={showDateTimeFields}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Follow Up Time *
                </label>
                <input
                  type="time"
                  name="follow_up_time"
                  value={formData.follow_up_time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required={showDateTimeFields}
                />
                <p className="text-xs text-gray-500 mt-1">Time will be saved in Indian Standard Time (IST)</p>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Status & Follow Up
          </button>
        </div>
      </div>
    </div>
  );
};

// Tooltip component for action buttons
const Tooltip = ({ children, text }) => (
  <div className="relative group">
    {children}
    <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute z-10 left-1/2 transform -translate-x-1/2 -translate-y-8 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap">
      {text}
    </span>
  </div>
);

export default function LastCall() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch leads data
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get(API_ENDPOINTS.SALESPERSON_ASSIGNED_LEADS_ME());
        const leadsData = response?.data || [];
        
        setLeads(leadsData);
        setFilteredLeads(leadsData);
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError('Failed to load last call data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredLeads(leads);
      setCurrentPage(1);
      return;
    }
    
    const lowercasedQuery = query.toLowerCase();
    const filtered = leads.filter(
      (lead) =>
        lead.name?.toLowerCase().includes(lowercasedQuery) ||
        lead.phone?.toLowerCase().includes(lowercasedQuery) ||
        lead.email?.toLowerCase().includes(lowercasedQuery) ||
        lead.business?.toLowerCase().includes(lowercasedQuery) ||
        lead.address?.toLowerCase().includes(lowercasedQuery) ||
        lead.product_type?.toLowerCase().includes(lowercasedQuery) ||
        lead.lead_source?.toLowerCase().includes(lowercasedQuery) ||
        lead.sales_status?.toLowerCase().includes(lowercasedQuery) ||
        lead.follow_up_status?.toLowerCase().includes(lowercasedQuery) ||
        lead.id?.toString().includes(lowercasedQuery)
    );
    setFilteredLeads(filtered);
    setCurrentPage(1);
  };

  // Handle status filter
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    
    if (!status) {
      setFilteredLeads(leads);
    } else {
      const filtered = leads.filter(lead => lead.sales_status === status);
      setFilteredLeads(filtered);
    }
    setCurrentPage(1);
  };

  // Handle lead status update
  const handleUpdateLeadStatus = async (leadId, statusData) => {
    try {
      const response = await apiClient.put(`/api/leads/${leadId}/status`, statusData);
      
      if (response.success) {
        // Update the leads list
        setLeads(prevLeads => 
          prevLeads.map(lead => 
            lead.id === leadId 
              ? { ...lead, ...statusData, updated_at: new Date().toISOString() }
              : lead
          )
        );
        
        // Update filtered leads
        setFilteredLeads(prevFiltered => 
          prevFiltered.map(lead => 
            lead.id === leadId 
              ? { ...lead, ...statusData, updated_at: new Date().toISOString() }
              : lead
          )
        );
        
        alert('Lead status updated successfully!');
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      throw error;
    }
  };

  // Handle preview
  const handlePreview = (lead) => {
    setSelectedLead(lead);
    setShowPreview(true);
  };

  // Handle edit
  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setShowEditModal(true);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'running': 'bg-blue-100 text-blue-800 border border-blue-200',
      'converted': 'bg-green-100 text-green-800 border border-green-200',
      'lost/closed': 'bg-red-100 text-red-800 border border-red-200',
      'interested': 'bg-purple-100 text-purple-800 border border-purple-200',
      'win lead': 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    };

    const statusText = {
      'pending': 'Pending',
      'running': 'Running',
      'converted': 'Converted',
      'lost/closed': 'Lost/Closed',
      'interested': 'Interested',
      'win lead': 'Win Lead',
    };

    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}
      >
        {statusText[status] || status}
      </span>
    );
  };

  // Get follow up badge
  const getFollowUpBadge = (status) => {
    const followUpClasses = {
      'appointment scheduled': 'bg-blue-100 text-blue-800 border border-blue-200',
      'not interested': 'bg-red-100 text-red-800 border border-red-200',
      'interested': 'bg-green-100 text-green-800 border border-green-200',
      'quotation sent': 'bg-purple-100 text-purple-800 border border-purple-200',
      'negotiation': 'bg-orange-100 text-orange-800 border border-orange-200',
      'close order': 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      'closed/lost': 'bg-gray-100 text-gray-800 border border-gray-200',
      'call back request': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'unreachable/call not connected': 'bg-red-100 text-red-800 border border-red-200',
      'currently not required': 'bg-gray-100 text-gray-800 border border-gray-200',
      'not relevant': 'bg-gray-100 text-gray-800 border border-gray-200',
    };

    const followUpText = {
      'appointment scheduled': 'Appointment Scheduled',
      'not interested': 'Not Interested',
      'interested': 'Interested',
      'quotation sent': 'Quotation Sent',
      'negotiation': 'Negotiation',
      'close order': 'Close Order',
      'closed/lost': 'Closed/Lost',
      'call back request': 'Call Back Request',
      'unreachable/call not connected': 'Unreachable',
      'currently not required': 'Not Required',
      'not relevant': 'Not Relevant',
    };

    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${followUpClasses[status] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}
      >
        {followUpText[status] || status || 'Pending'}
      </span>
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="p-6">

      {/* Search and Filter Bar */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          {/* Left side - Search */}
          <div className="relative w-full sm:w-80">
            <div className="flex">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-blue-500 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Search by customer name, phone, email..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right side - Filters */}
          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Lead Status</option>
              <option value="pending">Pending</option>
              <option value="running">Running</option>
              <option value="converted">Converted</option>
              <option value="lost/closed">Lost/Closed</option>
              <option value="interested">Interested</option>
              <option value="win lead">Win Lead</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading leads data...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Follow Up Status & Remark
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead Status & Remark
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Call
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedLeads.length > 0 ? (
                  paginatedLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {lead.id}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-sm text-gray-900">{lead.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </div>
                          {lead.email && lead.email !== "N/A" && (
                            <div className="text-xs mt-1 text-cyan-600">
                              <button 
                                onClick={() => window.open(`mailto:${lead.email}?subject=Follow up from ANOCAB&body=Dear ${lead.name},%0D%0A%0D%0AThank you for your interest in our products.%0D%0A%0D%0ABest regards,%0D%0AANOCAB Team`, '_blank')}
                                className="inline-flex items-center gap-1 transition-colors hover:text-cyan-700"
                                title="Send Email"
                              >
                                <Mail className="h-3 w-3" /> {lead.email}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.business || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.address || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="space-y-1">
                          {getFollowUpBadge(lead.follow_up_status)}
                          {lead.follow_up_remark && (
                            <div className="text-xs text-gray-600 italic">
                              "{lead.follow_up_remark}"
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="space-y-1">
                          {getStatusBadge(lead.sales_status)}
                          {lead.sales_status_remark && (
                            <div className="text-xs text-gray-600 italic">
                              "{lead.sales_status_remark}"
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.updated_at ? new Date(lead.updated_at).toLocaleDateString('en-GB') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Tooltip text="View Details">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreview(lead);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </Tooltip>
                          <Tooltip text="Edit Status">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(lead);
                              }}
                              className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                      No leads found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">per page</span>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-700">
              {filteredLeads.length > 0 ? (
                <>
                  Showing {startIndex + 1} to {endIndex} of {filteredLeads.length} results
                </>
              ) : (
                <>No results found</>
              )}
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-2">
              {/* First page */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || filteredLeads.length === 0}
                className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>

              {/* Previous page */}
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || filteredLeads.length === 0}
                className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 text-sm rounded-md border ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next page */}
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || filteredLeads.length === 0}
                className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Last page */}
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || filteredLeads.length === 0}
                className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <LeadStatusPreview
          lead={selectedLead}
          onClose={() => {
            setShowPreview(false);
            setSelectedLead(null);
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <EditLeadStatusModal
          lead={selectedLead}
          onClose={() => {
            setShowEditModal(false);
            setSelectedLead(null);
          }}
          onSave={handleUpdateLeadStatus}
        />
      )}
    </div>
  );
}
