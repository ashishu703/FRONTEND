"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Eye, Edit, Mail, Search, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RefreshCcw } from 'lucide-react';
import apiClient from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../api/admin_api/api';
import SalespersonCustomerTimeline from '../../components/SalespersonCustomerTimeline';
import { useAuth } from '../../hooks/useAuth';
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton';
import { getProducts } from '../../constants/products';

// Edit Lead Status Modal Component
export const EditLeadStatusModal = ({ lead, onClose, onSave }) => {
  // Parse enquired products from lead - support both old format (array of strings) and new format (array of objects)
  const parseEnquiredProducts = () => {
    if (!lead?.enquired_products) return [];
    
    try {
      const parsed = Array.isArray(lead.enquired_products) 
        ? lead.enquired_products 
        : JSON.parse(lead.enquired_products || '[]');
      
      // Convert old format (strings) to new format (objects)
      return parsed.map(item => {
        if (typeof item === 'string') {
          return { product: item, quantity: '', remark: '' };
        }
        return { product: item.product || item.name || '', quantity: item.quantity || '', remark: item.remark || '' };
      });
    } catch {
      return [];
    }
  };
  
  const initialEnquiredProducts = parseEnquiredProducts();
  
  const [formData, setFormData] = useState({
    sales_status: lead?.sales_status || '',
    sales_status_remark: lead?.sales_status_remark || '',
    follow_up_status: lead?.follow_up_status || '',
    follow_up_remark: lead?.follow_up_remark || '',
    follow_up_date: lead?.follow_up_date || '',
    follow_up_time: lead?.follow_up_time || '',
    enquired_products: initialEnquiredProducts,
    other_product: lead?.other_product || ''
  });
  
  const [products] = useState(() => getProducts());
  const [showOtherInput, setShowOtherInput] = useState(
    initialEnquiredProducts.some(p => p.product === 'Other')
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductSelect = (e) => {
    const selectedProduct = e.target.value;
    if (!selectedProduct || selectedProduct === '') return;
    
    // Don't add if already exists
    if (formData.enquired_products.some(p => p.product === selectedProduct)) {
      e.target.value = ''; // Reset dropdown
      return;
    }
    
    const hasOther = selectedProduct === 'Other' || formData.enquired_products.some(p => p.product === 'Other');
    setShowOtherInput(hasOther);
    
    setFormData(prev => ({
      ...prev,
      enquired_products: [...prev.enquired_products, { product: selectedProduct, quantity: '', remark: '' }]
    }));
    
    e.target.value = ''; // Reset dropdown after selection
  };

  const handleRemoveProduct = (indexToRemove) => {
    const updatedProducts = formData.enquired_products.filter((_, index) => index !== indexToRemove);
    const hasOther = updatedProducts.some(p => p.product === 'Other');
    setShowOtherInput(hasOther);
    
    setFormData(prev => ({
      ...prev,
      enquired_products: updatedProducts
    }));
  };

  const handleProductQuantityChange = (index, quantity) => {
    setFormData(prev => ({
      ...prev,
      enquired_products: prev.enquired_products.map((item, i) => 
        i === index ? { ...item, quantity } : item
      )
    }));
  };

  const handleProductRemarkChange = (index, remark) => {
    setFormData(prev => ({
      ...prev,
      enquired_products: prev.enquired_products.map((item, i) => 
        i === index ? { ...item, remark } : item
      )
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
    { value: '', label: 'Select Lead Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'running', label: 'Running' },
    { value: 'converted', label: 'Converted' },
    { value: 'interested', label: 'Interested' },
    { value: 'loose', label: 'Loose' },
    { value: 'win/closed', label: 'Win/Closed' },
    { value: 'lost', label: 'Lost' },
    { value: 'closed', label: 'Closed' }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 my-4 max-h-[90vh] overflow-y-auto">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enquired Products
            </label>
            <select
              onChange={handleProductSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue=""
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.name} value={product.name}>
                  {product.name}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
            
            {/* Display selected products */}
            {formData.enquired_products.length > 0 && (
              <div className="mt-2 max-h-64 overflow-y-auto space-y-2 pr-1">
                {formData.enquired_products.map((item, index) => (
                  <div key={index} className="bg-blue-50 px-3 py-3 rounded-md border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-800 flex-1 break-words pr-2">
                        {item.product === 'Other' ? formData.other_product || 'Other' : item.product}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium flex-shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                        <input
                          type="text"
                          value={item.quantity}
                          onChange={(e) => handleProductQuantityChange(index, e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter quantity..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Remark</label>
                        <textarea
                          value={item.remark}
                          onChange={(e) => handleProductRemarkChange(index, e.target.value)}
                          rows={2}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter remark..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {showOtherInput && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Product Name
                </label>
                <input
                  type="text"
                  name="other_product"
                  value={formData.other_product}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter other product name..."
                />
              </div>
            )}
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

export default function LeadStatusPage() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [timelineLead, setTimelineLead] = useState(null);
  const [showCustomerTimeline, setShowCustomerTimeline] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [hydratingDocs, setHydratingDocs] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [followUpFilter, setFollowUpFilter] = useState('');
  const [quotationFilter, setQuotationFilter] = useState(''); 
  const [piFilter, setPiFilter] = useState('');
  
  const fetchingRef = React.useRef(false);
  const initialLoadRef = React.useRef(false);
  
  const { user } = useAuth();
  const currentUserId = user?.id;
  const lastUserIdRef = React.useRef(null);

  const [quotationStatusByLead, setQuotationStatusByLead] = useState({});
  const [piStatusByLead, setPiStatusByLead] = useState({});
  
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const leadStatusBadges = [
    { key: 'pending', label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'ring-yellow-300' },
    { key: 'running', label: 'Running', bg: 'bg-blue-100', text: 'text-blue-800', ring: 'ring-blue-300' },
    { key: 'converted', label: 'Converted', bg: 'bg-green-100', text: 'text-green-800', ring: 'ring-green-300' },
    { key: 'interested', label: 'Interested', bg: 'bg-purple-100', text: 'text-purple-800', ring: 'ring-purple-300' },
    { key: 'win/closed', label: 'Win', bg: 'bg-emerald-100', text: 'text-emerald-800', ring: 'ring-emerald-300' },
    { key: 'closed', label: 'Closed', bg: 'bg-gray-100', text: 'text-gray-800', ring: 'ring-gray-300' },
    { key: 'lost', label: 'Lost', bg: 'bg-red-100', text: 'text-red-800', ring: 'ring-red-300' },
  ];

  const toggleLeadStatusBadge = (key) => {
    const next = statusFilter === key ? '' : key;
    handleStatusFilter(next);
  };

  // Counts for badges
  const leadStatusCounts = React.useMemo(() => {
    const counts = {
      all: leads.length,
      pending: 0,
      running: 0,
      converted: 0,
      interested: 0,
      'win/closed': 0,
      closed: 0,
      lost: 0,
    };
    leads.forEach((l) => {
      const key = String(l.sales_status || '').toLowerCase();
      if (counts[key] != null) counts[key] += 1;
    });
    return counts;
  }, [leads]);

  const quotationCounts = React.useMemo(() => {
    const result = { pending_approval: 0, approved: 0, rejected: 0 };
    leads.forEach((l) => {
      const st = String(l.latest_quotation_status || quotationStatusByLead[l.id] || '').toLowerCase();
      if (result[st] != null) result[st] += 1;
    });
    return result;
  }, [leads, quotationStatusByLead]);

  const piCounts = React.useMemo(() => {
    const result = { pending_approval: 0, approved: 0, rejected: 0 };
    leads.forEach((l) => {
      const st = String(l.latest_pi_status || piStatusByLead[l.id] || '').toLowerCase();
      if (result[st] != null) result[st] += 1;
    });
    return result;
  }, [leads, piStatusByLead]);

  const fetchLeads = async (pageNum = currentPage, fetchAllForFiltering = false) => {
    if (fetchingRef.current) {
      return;
    }
    
    try {
      fetchingRef.current = true;
      setLoading(true);
      setError(null);

      const hasFilters = searchQuery || statusFilter || followUpFilter || quotationFilter || piFilter;
      const shouldFetchAll = fetchAllForFiltering || hasFilters;
      
      const limit = shouldFetchAll ? 10000 : itemsPerPage;
      
      const response = await apiClient.get(
        `${API_ENDPOINTS.SALESPERSON_ASSIGNED_LEADS_ME()}?page=${shouldFetchAll ? 1 : pageNum}&limit=${limit}&includeDocStatus=true`
      );
      
      const leadsData = response?.data || [];
      const pagination = response?.pagination || {};
      

      setLeads(leadsData);
      setTotalLeads(pagination.total || leadsData.length);
      setTotalPages(pagination.totalPages || 1);
      
      const newQuotationStatuses = {};
      const newPiStatuses = {};
      leadsData.forEach(lead => {
        if (lead.latest_quotation_status) {
          newQuotationStatuses[lead.id] = lead.latest_quotation_status;
        }
        if (lead.latest_pi_status) {
          newPiStatuses[lead.id] = lead.latest_pi_status;
        }
      });
      setQuotationStatusByLead(prev => ({ ...prev, ...newQuotationStatuses }));
      setPiStatusByLead(prev => ({ ...prev, ...newPiStatuses }));

      if (hasFilters) {
        setFilteredLeads(leadsData);
        setTimeout(() => applyFilters(statusFilter, followUpFilter, quotationFilter, piFilter), 0);
      } else {
        setFilteredLeads(leadsData);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to load leads data');
    } finally {
      setLoading(false);
      setInitialLoading(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    if (lastUserIdRef.current !== null && lastUserIdRef.current !== currentUserId) {
      setLeads([]);
      setFilteredLeads([]);
      setError(null);
      initialLoadRef.current = false;
    }

    // Update last user ID
    lastUserIdRef.current = currentUserId;

    // Initial load only once
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      const hasFilters = searchQuery || statusFilter || followUpFilter || quotationFilter || piFilter;
      fetchLeads(1, hasFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]); // Run on mount and when user changes

  // OPTIMIZED: Handle pagination changes (only if no filters active)
  useEffect(() => {
    // Skip if not yet initialized or already fetching
    if (!initialLoadRef.current || fetchingRef.current) return;
    
    const hasFilters = searchQuery || statusFilter || followUpFilter || quotationFilter || piFilter;
    // Only fetch if no filters and page actually changed
    if (!hasFilters && currentPage > 0) {
      fetchLeads(currentPage, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage]);
  
  // OPTIMIZED: Re-fetch all leads when filters change (for client-side filtering)
  useEffect(() => {
    // Skip if not yet initialized or already fetching
    if (!initialLoadRef.current || fetchingRef.current) return;
    
    const hasFilters = searchQuery || statusFilter || followUpFilter || quotationFilter || piFilter;
    // Only fetch if filters are active
    if (hasFilters) {
      fetchLeads(1, true);
    }
  }, [searchQuery, statusFilter, followUpFilter, quotationFilter, piFilter]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusFilter = useCallback((status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const handleQuotationFilter = useCallback(async (status) => {
    const next = quotationFilter === status ? '' : status;
    setQuotationFilter(next);
    setCurrentPage(1);
  }, [quotationFilter]);

  const handlePiFilter = useCallback(async (status) => {
    const next = piFilter === status ? '' : status;
    setPiFilter(next);
    setCurrentPage(1);
  }, [piFilter]);

  const filteredLeadsMemo = useMemo(() => {
    let filtered = leads;
    
    if (debouncedSearchQuery.trim()) {
      const lowercasedQuery = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
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
    }
    
    // Apply sales status filter
    if (statusFilter) {
      filtered = filtered.filter(lead => lead.sales_status?.toLowerCase() === statusFilter.toLowerCase());
    }
    
    // Apply follow-up status filter
    if (followUpFilter) {
      filtered = filtered.filter(lead => {
        const leadFollowUp = lead.follow_up_status?.toLowerCase() || '';
        return leadFollowUp === followUpFilter.toLowerCase();
      });
    }

    // Apply quotation status filter
    if (quotationFilter) {
      filtered = filtered.filter(lead => {
        const status = lead.latest_quotation_status || quotationStatusByLead[lead.id] || '';
        return status.toLowerCase() === quotationFilter.toLowerCase();
      });
    }

    // Apply PI status filter
    if (piFilter) {
      filtered = filtered.filter(lead => {
        const status = lead.latest_pi_status || piStatusByLead[lead.id] || '';
        return status.toLowerCase() === piFilter.toLowerCase();
      });
    }
    
    return filtered;
  }, [leads, debouncedSearchQuery, statusFilter, followUpFilter, quotationFilter, piFilter, quotationStatusByLead, piStatusByLead]);

  // OPTIMIZED: useCallback for applyFilters (now just sets the memoized result)
  const applyFilters = useCallback((status, followUp, quotation = quotationFilter, pi = piFilter) => {
    // Filters are now applied via useMemo, this just triggers re-computation
    setStatusFilter(status || '');
    setFollowUpFilter(followUp || '');
    setQuotationFilter(quotation || '');
    setPiFilter(pi || '');
  }, [quotationFilter, piFilter]);

  // Debounce search query to avoid excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync filteredLeadsMemo to filteredLeads state
  useEffect(() => {
    setFilteredLeads(filteredLeadsMemo);
  }, [filteredLeadsMemo]);

  // Show skeleton loader on initial load
  if (initialLoading) {
    return <DashboardSkeleton />;
  }

  // Handle lead status update
  const handleUpdateLeadStatus = async (leadId, statusData) => {
    try {
      // Handle enquired_products - convert array to JSON string if needed
      const enquiredProducts = statusData.enquired_products || [];
      const enquiredProductsStr = Array.isArray(enquiredProducts) 
        ? JSON.stringify(enquiredProducts) 
        : enquiredProducts;
      
      const payload = {
        sales_status: statusData.sales_status ?? statusData.salesStatus ?? '',
        sales_status_remark: statusData.sales_status_remark ?? statusData.salesStatusRemark ?? '',
        follow_up_status: statusData.follow_up_status ?? statusData.followUpStatus ?? '',
        follow_up_remark: statusData.follow_up_remark ?? statusData.followUpRemark ?? '',
        follow_up_date: statusData.follow_up_date ?? statusData.followUpDate ?? '',
        follow_up_time: statusData.follow_up_time ?? statusData.followUpTime ?? '',
        enquired_products: enquiredProductsStr,
        other_product: statusData.other_product || '',
      }
      const fd = new FormData()
      Object.entries(payload).forEach(([k, v]) => fd.append(k, v == null ? '' : v))
      const response = await apiClient.putFormData(`/api/leads/assigned/salesperson/lead/${leadId}`, fd);
      
      if (response.success) {
        // Update the leads list
        // Format products for state update - parse the string back to array
        let formattedProductsForState = [];
        try {
          formattedProductsForState = typeof enquiredProductsStr === 'string' 
            ? JSON.parse(enquiredProductsStr) 
            : enquiredProducts;
        } catch {
          formattedProductsForState = enquiredProducts;
        }
        
        setLeads(prevLeads => 
          prevLeads.map(lead => 
            lead.id === leadId 
              ? { 
                  ...lead, 
                  ...payload, 
                  enquired_products: formattedProductsForState,
                  other_product: statusData.other_product || '',
                  updated_at: new Date().toISOString() 
                }
              : lead
          )
        );
        
        // Update filtered leads
        setFilteredLeads(prevFiltered => 
          prevFiltered.map(lead => 
            lead.id === leadId 
              ? { 
                  ...lead, 
                  ...payload, 
                  enquired_products: formattedProductsForState,
                  other_product: statusData.other_product || '',
                  updated_at: new Date().toISOString() 
                }
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
    setTimelineLead(lead);
    setShowCustomerTimeline(true);
  };

  // Handle edit
  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setShowEditModal(true);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || '';
    const statusClasses = {
      'win': 'bg-green-100 text-green-800 border border-green-200',
      'loose': 'bg-red-100 text-red-800 border border-red-200',
      'follow up': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'not interested': 'bg-gray-100 text-gray-800 border border-gray-200',
    };

    const statusText = {
      'win': 'Win',
      'loose': 'Loose',
      'follow up': 'Follow Up',
      'not interested': 'Not Interested',
    };

    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[statusLower] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}
      >
        {statusText[statusLower] || status || 'Unknown'}
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

  // OPTIMIZED: Pagination is now handled by backend when no filters
  // For filtered results, we need client-side pagination
  const needsClientPagination = searchQuery || statusFilter || followUpFilter || quotationFilter || piFilter;
  const paginatedLeads = needsClientPagination
    ? filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredLeads; // Backend already paginated, filteredLeads = current page leads
  
  const displayTotalPages = needsClientPagination 
    ? Math.ceil(filteredLeads.length / itemsPerPage)
    : totalPages;
  const displayTotal = needsClientPagination ? filteredLeads.length : totalLeads;
  
  // Calculate start/end for display
  const startIndex = needsClientPagination 
    ? (currentPage - 1) * itemsPerPage + 1
    : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = needsClientPagination
    ? Math.min(currentPage * itemsPerPage, displayTotal)
    : Math.min(currentPage * itemsPerPage, displayTotal);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className={`pt-6 pb-6 pl-6 pr-0 transition-all duration-300 ${showCustomerTimeline ? 'pr-[360px]' : ''}`}>
      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 flex items-center gap-2">
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search by customer name, phone, email, business, lead id..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const hasFilters = searchQuery || statusFilter || followUpFilter || quotationFilter || piFilter;
                fetchLeads(currentPage, hasFilters);
              }}
              className="px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 inline-flex items-center gap-2"
              title="Refresh"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* One-line badges row (no scrollbar, compact) */}
        <div className="mt-4 overflow-hidden">
          <div className="flex items-center gap-1 whitespace-nowrap">
            {/* Lead status badges */}
            <button
              onClick={() => {
                setStatusFilter('');
                setFollowUpFilter('');
                setQuotationFilter('');
                setPiFilter('');
                applyFilters('', '');
                setCurrentPage(1);
              }}
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border bg-gray-100 text-gray-800 hover:ring-2 ring-gray-300 transition ${!statusFilter && !followUpFilter ? 'ring-2' : ''}`}
              title="Show All"
            >
              All ({leadStatusCounts.all})
            </button>
            {leadStatusBadges.map(b => (
              <button
                key={b.key}
                onClick={() => toggleLeadStatusBadge(b.key)}
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${b.bg} ${b.text} hover:ring-2 ${b.ring} transition ${statusFilter === b.key ? 'ring-2' : ''}`}
                title={`Filter: ${b.label}`}
              >
                {b.label} ({leadStatusCounts[b.key] || 0})
              </button>
            ))}

            {/* Quotation & PI filters inline */}
            <span className="mx-1 h-4 w-px bg-gray-200" />
            <div className="text-[11px] font-medium text-gray-600">Quotation:</div>
            <button
              onClick={() => handleQuotationFilter('pending_approval')}
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border bg-yellow-50 text-yellow-800 hover:ring-2 ring-yellow-200 transition ${quotationFilter === 'pending_approval' ? 'ring-2' : ''}`}
            >
              Sent for Approval ({quotationCounts.pending_approval || 0})
            </button>
            <button
              onClick={() => handleQuotationFilter('approved')}
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border bg-green-50 text-green-800 hover:ring-2 ring-green-200 transition ${quotationFilter === 'approved' ? 'ring-2' : ''}`}
            >
              Approved ({quotationCounts.approved || 0})
            </button>
            <button
              onClick={() => handleQuotationFilter('rejected')}
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border bg-red-50 text-red-800 hover:ring-2 ring-red-200 transition ${quotationFilter === 'rejected' ? 'ring-2' : ''}`}
            >
              Rejected ({quotationCounts.rejected || 0})
            </button>

            <span className="mx-1 h-4 w-px bg-gray-200" />
            <div className="text-[11px] font-medium text-gray-600">PI:</div>
            <button
              onClick={() => handlePiFilter('pending_approval')}
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border bg-yellow-50 text-yellow-800 hover:ring-2 ring-yellow-200 transition ${piFilter === 'pending_approval' ? 'ring-2' : ''}`}
            >
              Sent for Approval ({piCounts.pending_approval || 0})
            </button>
            <button
              onClick={() => handlePiFilter('approved')}
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border bg-green-50 text-green-800 hover:ring-2 ring-green-200 transition ${piFilter === 'approved' ? 'ring-2' : ''}`}
            >
              Approved ({piCounts.approved || 0})
            </button>
            <button
              onClick={() => handlePiFilter('rejected')}
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border bg-red-50 text-red-800 hover:ring-2 ring-red-200 transition ${piFilter === 'rejected' ? 'ring-2' : ''}`}
            >
              Rejected ({piCounts.rejected || 0})
            </button>

            {hydratingDocs && (
              <span className="text-[11px] text-gray-500 ml-2">Loading latest document statuses…</span>
            )}
          </div>
        </div>
      </div>

      {error ? (
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[200px]">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Follow Up
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead Status
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
                          <div className="text-xs text-gray-500">{lead.phone}</div>
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
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] align-top">
                        <div className="break-words whitespace-normal" style={{ wordBreak: 'break-word', maxWidth: '200px', lineHeight: '1.4em' }}>
                        {lead.address || 'N/A'}
                        </div>
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
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
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
              {paginatedLeads.length > 0 ? (
                <>
                  Showing {startIndex} to {endIndex} of {displayTotal} results
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
                disabled={currentPage === 1 || paginatedLeads.length === 0}
                className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>

              {/* Previous page */}
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || paginatedLeads.length === 0}
                className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, displayTotalPages) }, (_, i) => {
                  let pageNum;
                  if (displayTotalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= displayTotalPages - 2) {
                    pageNum = displayTotalPages - 4 + i;
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
                onClick={() => handlePageChange(Math.min(displayTotalPages, currentPage + 1))}
                disabled={currentPage === displayTotalPages || paginatedLeads.length === 0}
                className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Last page */}
              <button
                onClick={() => handlePageChange(displayTotalPages)}
                disabled={currentPage === displayTotalPages || paginatedLeads.length === 0}
                className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Customer Timeline Sidebar (salesperson view) */}
      {showCustomerTimeline && timelineLead && (
        <SalespersonCustomerTimeline
          lead={timelineLead}
          onClose={() => {
            setShowCustomerTimeline(false);
            setTimelineLead(null);
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
