import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FileText, Package, RefreshCw, Filter, Phone, Clock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import AddCustomerModal from './AddCustomerModal';
import QuotationPreview from '../../components/QuotationPreview';
import PIPreview from '../../components/PIPreview';
import CustomerTimeline from '../../components/CustomerTimeline';
import FilterBadges from '../../components/FilterBadges';
import SearchBar from '../../components/SearchBar';
import LeadTable from '../../components/LeadTable';
import ColumnFilterModal from '../../components/ColumnFilterModal';
import EditLeadModal from '../../components/EditLeadModal';
import AssignLeadModal from '../../components/AssignLeadModal';
import ImportCSVModal from '../../components/ImportCSVModal';
import ImportPreviewModal from '../../components/ImportPreviewModal';
import LeadPreviewDrawer from '../../components/LeadPreviewDrawer';
import apiErrorHandler from '../../utils/ApiErrorHandler';
import toastManager from '../../utils/ToastManager';
import apiClient from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../api/admin_api/api';
import { LeadsFilterService, IDMatcher } from '../../services/LeadsFilterService';
import LeadService from '../../services/LeadService';
import UserService from '../../services/UserService';
import PIService from '../../services/PIService';
import QuotationService from '../../services/QuotationService';
import { generateQuotationPDF } from '../../utils/pdfUtils';
import { downloadCSVTemplate, parseCSV, formatDate as formatDateUtil, exportToExcel } from '../../utils/csvUtils';
import { getStatusBadge as getStatusBadgeUtil } from '../../utils/statusUtils';
import { calculateAssignedCounts, getUnassignedLeadIds, filterLeads } from '../../utils/leadFilters';
import { COMPANY_BRANCHES, DEFAULT_USER, DEFAULT_BRANCH } from '../../config/appConfig';
import { useAuth } from '../../hooks/useAuth';
import CSVImportValidationService from '../../services/CSVImportValidationService';
import { debounce } from '../../utils/debounce';
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton';
import EnquiryTable from '../../components/EnquiryTable';

const LeadsSimplified = () => {
  const [activeTab, setActiveTab] = useState('leads');
  const { user } = useAuth();
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Enquiry state with pagination
  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesGroupedByDate, setEnquiriesGroupedByDate] = useState({});
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [enquiryPage, setEnquiryPage] = useState(1);
  const [enquiryLimit, setEnquiryLimit] = useState(50);
  const [enquiryTotal, setEnquiryTotal] = useState(0);
  
  // Enquiry filters
  const [enquiryFilters, setEnquiryFilters] = useState({
    salesperson: '',
    telecaller: '',
    state: '',
    division: '',
    follow_up_status: '',
    sales_status: '',
    enquiry_date: ''
  });
  const [showEnquiryFilters, setShowEnquiryFilters] = useState(false);
  
  const [enquiryVisibleColumns, setEnquiryVisibleColumns] = useState({
    customer_name: true,
    business: true,
    state: true,
    division: true,
    address: true,
    enquired_product: true,
    product_quantity: true,
    product_remark: true,
    follow_up_status: false,
    follow_up_remark: false,
    sales_status: false,
    sales_status_remark: false,
    salesperson: false,
    telecaller: false,
    enquiry_date: false
  });
  const [showEnquiryColumnModal, setShowEnquiryColumnModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showAll, setShowAll] = useState(false);
  const [total, setTotal] = useState(0);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [importPreview, setImportPreview] = useState([]);
  const [importing, setImporting] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewLead, setPreviewLead] = useState(null);
  const [showCustomerTimeline, setShowCustomerTimeline] = useState(false);
  const [timelineLead, setTimelineLead] = useState(null);
  const [quotationCounts, setQuotationCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [piCounts, setPiCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [statusFilter, setStatusFilter] = useState({ type: null, status: null });
  const [assignmentFilter, setAssignmentFilter] = useState(null);
  const [filteredCustomerIds, setFilteredCustomerIds] = useState(new Set());
  const [assignedSalespersonFilter, setAssignedSalespersonFilter] = useState('');
  const [assignedTelecallerFilter, setAssignedTelecallerFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState({
    customerId: '',
    customer: '',
    business: '',
    address: '',
    state: '',
    division: '',
    phone: '',
    email: '',
    gstNo: '',
    leadSource: '',
    productNames: '',
    category: '',
    followUpStatus: '',
    salesStatus: '',
    telecallerStatus: '',
    paymentStatus: '',
    createdAt: '',
    updatedAt: ''
  });
  const [showColumnFilterRow, setShowColumnFilterRow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningLead, setAssigningLead] = useState(null);
  const [assignForm, setAssignForm] = useState({ salesperson: '', telecaller: '' });
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showColumnFilter, setShowColumnFilter] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    customerId: false,
    customer: true,
    business: true,
    address: true,
    state: true,
    division: false,
    followUpStatus: true,
    salesStatus: true,
    assignedSalesperson: true,
    assignedTelecaller: true,
    gstNo: false,
    leadSource: false,
    productNames: false,
    category: false,
    createdAt: false,
    telecallerStatus: false,
    paymentStatus: false,
    updatedAt: false
  });
  const [editFormData, setEditFormData] = useState({
    customer: '',
    email: '',
    business: '',
    address: '',
    state: '',
    division: '',
    leadSource: '',
    category: '',
    salesStatus: '',
    phone: '',
    gstNo: '',
    productNames: '',
    assignedSalesperson: '',
    assignedTelecaller: '',
    telecallerStatus: '',
    paymentStatus: ''
  });
  const [usernames, setUsernames] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [quotations, setQuotations] = useState([]);
  const [loadingQuotations, setLoadingQuotations] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [proformaInvoices, setProformaInvoices] = useState([]);
  const [loadingPIs, setLoadingPIs] = useState(false);
  const [allLeadsData, setAllLeadsData] = useState([]);
  const [loadingAllLeads, setLoadingAllLeads] = useState(false);
  const [allLeadsRefreshKey, setAllLeadsRefreshKey] = useState(0);
  const allLeadsFetchPromiseRef = useRef(null);
  const allLeadsDataRef = useRef([]);
  const [showPIPreview, setShowPIPreview] = useState(false);
  const [piPreviewData, setPiPreviewData] = useState(null);
  
  // Last Call pagination state
  const [lastCallPage, setLastCallPage] = useState(1);
  const [lastCallLimit, setLastCallLimit] = useState(50);
  const [lastCallTotal, setLastCallTotal] = useState(0);
  const [lastCallLeadsData, setLastCallLeadsData] = useState([]);
  const [lastCallLoading, setLastCallLoading] = useState(false);
  const [lastCallInitialLoading, setLastCallInitialLoading] = useState(false);
  
  // Cache for enquiries and last call
  const enquiriesCacheRef = useRef(new Map());
  const lastCallCacheRef = useRef(new Map());
  const ENQUIRIES_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes
  const LAST_CALL_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes
  const fetchEnquiriesAbortControllerRef = useRef(null);
  const fetchLastCallAbortControllerRef = useRef(null);

  const importFileInputRef = useRef(null);

  const leadService = useMemo(() => new LeadService(), []);
  const userService = useMemo(() => new UserService(), []);
  const piService = useMemo(() => new PIService(), []);
  const quotationServiceInstance = useMemo(() => new QuotationService(), []);
  const leadsFilterService = useMemo(() => new LeadsFilterService(apiClient), []);

  // Helper function to transform leads (DRY principle) - with proper field mapping
  const transformLeads = useCallback((leads) => {
    return leads.map(lead => {
      // Transform using leadService first to get standard fields
      const transformed = leadService.transformApiData([lead])[0] || {};
      
      // Get all possible field name variations
      const followUpStatus = lead.follow_up_status || lead.followUpStatus || transformed.follow_up_status || transformed.followUpStatus || null;
      const followUpRemark = lead.follow_up_remark || lead.followUpRemark || transformed.follow_up_remark || transformed.followUpRemark || null;
      const salesStatus = lead.sales_status || lead.salesStatus || transformed.sales_status || transformed.salesStatus || null;
      const salesStatusRemark = lead.sales_status_remark || lead.salesStatusRemark || transformed.sales_status_remark || transformed.salesStatusRemark || null;
      
      return {
        ...lead,
        ...transformed,
        productNames: lead.productNamesText || lead.product_names || transformed.productNames || '',
        updatedAt: lead.updated_at || lead.created_at || transformed.updatedAt || '',
        assignedSalesperson: lead.assignedSalesperson || lead.assigned_salesperson || transformed.assignedSalesperson || 'Unassigned',
        assignedTelecaller: lead.assignedTelecaller || lead.assigned_telecaller || transformed.assignedTelecaller || 'Unassigned',
        // Preserve date fields for Last Call filtering (snake_case)
        follow_up_date: lead.follow_up_date || lead.followUpDate || transformed.follow_up_date || null,
        follow_up_remark: followUpRemark,
        follow_up_status: followUpStatus,
        next_meeting_date: lead.next_meeting_date || lead.nextMeetingDate || transformed.next_meeting_date || null,
        meeting_date: lead.meeting_date || lead.meetingDate || transformed.meeting_date || null,
        scheduled_date: lead.scheduled_date || lead.scheduledDate || transformed.scheduled_date || null,
        sales_status: salesStatus,
        sales_status_remark: salesStatusRemark,
        updated_at: lead.updated_at || lead.updatedAt || transformed.updated_at || null,
        // Map to camelCase for LeadTable component (required for display)
        followUpStatus: followUpStatus,
        followUpRemark: followUpRemark,
        salesStatus: salesStatus,
        salesStatusRemark: salesStatusRemark
      };
    });
  }, [leadService]);

  // Fetch enquiries with pagination and parallel API calls
  const fetchEnquiries = useCallback(async (forceRefresh = false, page = enquiryPage, limit = enquiryLimit) => {
    if (activeTab !== 'enquiry') return;
    
    // Cancel previous request
    if (fetchEnquiriesAbortControllerRef.current) {
      fetchEnquiriesAbortControllerRef.current.abort();
    }
    fetchEnquiriesAbortControllerRef.current = new AbortController();
    
    // Create cache key from page, limit, and filters
    const cacheKey = JSON.stringify({ page, limit, filters: enquiryFilters });
    const now = Date.now();
    
    // Check cache
    const cached = enquiriesCacheRef.current.get(cacheKey);
    if (!forceRefresh && cached && cached.timestamp && (now - cached.timestamp) < ENQUIRIES_CACHE_DURATION) {
      setEnquiries(cached.data.enquiries || []);
      setEnquiriesGroupedByDate(cached.data.groupedByDate || {});
      setEnquiryTotal(cached.data.total || 0);
      return;
    }
    
    setEnquiriesLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (enquiryFilters.enquiry_date) params.append('enquiryDate', enquiryFilters.enquiry_date);
      
      // Fetch paginated data and grouped data in parallel
      const groupedParams = new URLSearchParams();
      if (enquiryFilters.enquiry_date) groupedParams.append('enquiryDate', enquiryFilters.enquiry_date);
      
      const [paginatedResponse, groupedResponse] = await Promise.all([
        apiClient.get(`${API_ENDPOINTS.ENQUIRIES_DEPARTMENT_HEAD()}?${params.toString()}`),
        apiClient.get(`${API_ENDPOINTS.ENQUIRIES_DEPARTMENT_HEAD()}?${groupedParams.toString()}`)
      ]);
      
      if (paginatedResponse.success && groupedResponse.success) {
        const enquiriesData = {
          enquiries: paginatedResponse.data?.enquiries || [],
          groupedByDate: groupedResponse.data?.groupedByDate || {},
          total: paginatedResponse.data?.pagination?.total || 0
        };
        
        // Update cache
        enquiriesCacheRef.current.set(cacheKey, {
          data: enquiriesData,
          timestamp: now
        });
        
        setEnquiries(enquiriesData.enquiries);
        setEnquiriesGroupedByDate(enquiriesData.groupedByDate);
        setEnquiryTotal(enquiriesData.total);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching enquiries:', error);
        apiErrorHandler.handleError(error, 'fetch enquiries');
      }
    } finally {
      setEnquiriesLoading(false);
      fetchEnquiriesAbortControllerRef.current = null;
    }
  }, [activeTab, enquiryPage, enquiryLimit, enquiryFilters]);

  // Fetch enquiries when tab changes or pagination/filters change
  useEffect(() => {
    if (activeTab === 'enquiry') {
      fetchEnquiries(false, enquiryPage, enquiryLimit);
    }
  }, [activeTab, enquiryPage, enquiryLimit, fetchEnquiries]);

  // Define loadAllLeadsForFilters before fetchLastCallLeads to avoid initialization error
  const loadAllLeadsForFiltersRef = useRef(null);
  
  // Fetch last call leads with pagination, caching and parallel API calls
  const fetchLastCallLeads = useCallback(async (forceRefresh = false, page = lastCallPage, limit = lastCallLimit) => {
    if (activeTab !== 'lastCall') return;
    
    // Cancel previous request
    if (fetchLastCallAbortControllerRef.current) {
      fetchLastCallAbortControllerRef.current.abort();
    }
    fetchLastCallAbortControllerRef.current = new AbortController();
    
    // Create cache key
    const cacheKey = `page-${page}-limit-${limit}`;
    const now = Date.now();
    
    // Check cache
    const cached = lastCallCacheRef.current.get(cacheKey);
    if (!forceRefresh && cached && cached.timestamp && (now - cached.timestamp) < LAST_CALL_CACHE_DURATION) {
      setLastCallLeadsData(cached.data);
      setLastCallTotal(cached.total);
      return cached.data;
    }

    try {
      setLastCallLoading(true);
      if (page === 1) {
        setLastCallInitialLoading(true);
      }
      
      // Load all leads for filtering (use existing function via ref)
      const loadAllLeadsFn = loadAllLeadsForFiltersRef.current;
      if (!loadAllLeadsFn) {
        console.error('loadAllLeadsForFilters not available');
        return [];
      }
      const allLeads = await loadAllLeadsFn(true);
      
      // Transform leads with proper field mapping
      const transformedLeads = transformLeads(allLeads);
      
      // Filter for last call leads only
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      const allLastCallLeads = transformedLeads.filter(lead => {
        if (!lead) return false;
        
        const hasFollowUpStatus = lead.follow_up_status && lead.follow_up_status.trim() !== '';
        const hasFollowUpRemark = lead.follow_up_remark && lead.follow_up_remark.trim() !== '';
        
        const hasFollowUpDate = lead.follow_up_date && lead.follow_up_date !== 'N/A' && lead.follow_up_date !== '';
        const hasNextMeetingDate = lead.next_meeting_date && lead.next_meeting_date !== 'N/A' && lead.next_meeting_date !== '';
        const hasMeetingDate = lead.meeting_date && lead.meeting_date !== 'N/A' && lead.meeting_date !== '';
        const hasScheduledDate = lead.scheduled_date && lead.scheduled_date !== 'N/A' && lead.scheduled_date !== '';
        const hasNextMeetingStatus = lead.sales_status === 'next_meeting' && lead.sales_status_remark;
        
        const hasScheduledDateOrTime = hasFollowUpDate || hasNextMeetingDate || hasMeetingDate || hasScheduledDate || hasNextMeetingStatus;
        
        if (!hasFollowUpStatus && !hasFollowUpRemark && !hasScheduledDateOrTime) {
          return false;
        }
        
        let callDate = null;
        if (lead.follow_up_date) {
          callDate = new Date(lead.follow_up_date);
        } else if (lead.next_meeting_date) {
          callDate = new Date(lead.next_meeting_date);
        } else if (lead.meeting_date) {
          callDate = new Date(lead.meeting_date);
        } else if (lead.scheduled_date) {
          callDate = new Date(lead.scheduled_date);
        } else if (lead.sales_status === 'next_meeting' && lead.sales_status_remark) {
          const dateMatch = lead.sales_status_remark.match(/(\d{4}-\d{2}-\d{2})/);
          if (dateMatch) {
            callDate = new Date(dateMatch[1]);
          }
        } else if (lead.updated_at) {
          callDate = new Date(lead.updated_at);
        }
        
        if (!callDate || isNaN(callDate.getTime())) {
          return false;
        }
        
        callDate.setHours(0, 0, 0, 0);
        return callDate <= today;
      });
      
      // Apply pagination
      const total = allLastCallLeads.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedLeads = allLastCallLeads.slice(startIndex, endIndex);
      
      // Update cache
      lastCallCacheRef.current.set(cacheKey, {
        data: paginatedLeads,
        total,
        timestamp: now
      });
      
      setLastCallLeadsData(paginatedLeads);
      setLastCallTotal(total);
      return paginatedLeads;
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching last call leads:', err);
        apiErrorHandler.handleError(err, 'fetch last call leads');
      }
      return [];
    } finally {
      setLastCallLoading(false);
      setLastCallInitialLoading(false);
      fetchLastCallAbortControllerRef.current = null;
    }
  }, [activeTab, transformLeads, lastCallPage, lastCallLimit]);

  // Fetch last call leads when Last Call tab is active or pagination changes
  useEffect(() => {
    if (activeTab === 'lastCall') {
      fetchLastCallLeads(false, lastCallPage, lastCallLimit);
    }
  }, [activeTab, lastCallPage, lastCallLimit, fetchLastCallLeads]);

  // Extract unique values from enquiries for filter dropdowns
  const enquiryFilterOptions = useMemo(() => {
    const allEnquiries = Object.values(enquiriesGroupedByDate).flat();
    if (allEnquiries.length === 0 && enquiries.length > 0) {
      allEnquiries.push(...enquiries);
    }
    
    return {
      salespersons: [...new Set(allEnquiries.map(e => e.salesperson).filter(Boolean))].sort(),
      telecallers: [...new Set(allEnquiries.map(e => e.telecaller).filter(Boolean))].sort(),
      states: [...new Set(allEnquiries.map(e => e.state).filter(Boolean))].sort(),
      divisions: [...new Set(allEnquiries.map(e => e.division).filter(Boolean))].sort(),
      followUpStatuses: [...new Set(allEnquiries.map(e => e.follow_up_status).filter(Boolean))].sort(),
      salesStatuses: [...new Set(allEnquiries.map(e => e.sales_status).filter(Boolean))].sort()
    };
  }, [enquiries, enquiriesGroupedByDate]);

  // Format date for display (short format like "10 Dec")
  const formatDateShort = useCallback((dateString) => {
    if (!dateString || dateString === 'No Date') return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return 'N/A';
    }
  }, []);

  // Format date for grouping (full format)
  const formatDateForGrouping = useCallback((dateString) => {
    if (!dateString || dateString === 'No Date') return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  }, []);

  // Filter last call leads - use paginated lastCallLeadsData
  const filteredLastCallLeads = useMemo(() => {
    // Use paginated lastCallLeadsData
    return lastCallLeadsData;
  }, [lastCallLeadsData]);

  // Group leads by date (last call date) - using paginated data
  const groupedLastCallLeads = useMemo(() => {
    const groups = {};
    
    // Use paginated lastCallLeadsData
    filteredLastCallLeads.forEach(lead => {
      // Priority: follow_up_date > next_meeting_date > meeting_date > scheduled_date > updated_at
      let dateObj = null;
      let dateKey = '';
      
      if (lead.follow_up_date) {
        dateObj = new Date(lead.follow_up_date);
        dateKey = lead.follow_up_date; // Use ISO date string as key
      } else if (lead.next_meeting_date) {
        dateObj = new Date(lead.next_meeting_date);
        dateKey = lead.next_meeting_date;
      } else if (lead.meeting_date) {
        dateObj = new Date(lead.meeting_date);
        dateKey = lead.meeting_date;
      } else if (lead.scheduled_date) {
        dateObj = new Date(lead.scheduled_date);
        dateKey = lead.scheduled_date;
      } else if (lead.sales_status === 'next_meeting' && lead.sales_status_remark) {
        // Extract date from remark format like "2025-10-28 AT 19:10"
        const dateMatch = lead.sales_status_remark.match(/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          dateObj = new Date(dateMatch[1]);
          dateKey = dateMatch[1];
        }
      } else if (lead.updated_at) {
        dateObj = new Date(lead.updated_at);
        dateKey = lead.updated_at.split('T')[0]; // Use date part only
      } else {
        dateKey = 'No Date';
        dateObj = new Date(0); // Use epoch for sorting
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = {
          dateObj: dateObj,
          dateKey: dateKey,
          leads: []
        };
      }
      groups[dateKey].leads.push(lead);
    });
    
    // Sort dates in descending order (most recent first)
    const sortedDates = Object.keys(groups).sort((a, b) => {
      if (a === 'No Date') return 1;
      if (b === 'No Date') return -1;
      return groups[b].dateObj - groups[a].dateObj;
    });
    
    return sortedDates.map(dateKey => ({
      dateKey,
      dateObj: groups[dateKey].dateObj,
      leads: groups[dateKey].leads
    }));
  }, [filteredLastCallLeads]);

  // Filter enquiries based on selected filters - OPTIMIZED (client-side filtering on paginated data)
  const filteredEnquiries = useMemo(() => {
    // Use paginated enquiries directly (server-side pagination)
    if (!enquiries.length) return [];
    
    // Apply client-side filters on paginated data
    const hasFilters = Object.values(enquiryFilters).some(v => v && v !== 'enquiry_date'); // Exclude enquiry_date as it's handled server-side
    if (!hasFilters) return enquiries;
    
    return enquiries.filter(enquiry => {
      if (enquiryFilters.salesperson && enquiry.salesperson !== enquiryFilters.salesperson) return false;
      if (enquiryFilters.telecaller && enquiry.telecaller !== enquiryFilters.telecaller) return false;
      if (enquiryFilters.state && enquiry.state !== enquiryFilters.state) return false;
      if (enquiryFilters.division && enquiry.division !== enquiryFilters.division) return false;
      if (enquiryFilters.follow_up_status && enquiry.follow_up_status !== enquiryFilters.follow_up_status) return false;
      if (enquiryFilters.sales_status && enquiry.sales_status !== enquiryFilters.sales_status) return false;
      return true;
    });
  }, [enquiries, enquiryFilters]);

  // Group filtered enquiries by date - use server-side grouped data
  const filteredEnquiriesGroupedByDate = useMemo(() => {
    // Use server-side grouped data if available, otherwise group client-side
    if (Object.keys(enquiriesGroupedByDate).length > 0) {
      return enquiriesGroupedByDate;
    }
    
    // Fallback: group client-side
    const grouped = {};
    filteredEnquiries.forEach(enquiry => {
      const dateKey = enquiry.enquiry_date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(enquiry);
    });
    return grouped;
  }, [filteredEnquiries, enquiriesGroupedByDate]);

  // Export enquiries to CSV
  const handleExportEnquiries = () => {
    if (filteredEnquiries.length === 0) {
      toastManager.error('No enquiries to export');
      return;
    }

    const headers = [
      'Customer Name',
      'Business',
      'Address',
      'State',
      'Division',
      'Follow Up Status',
      'Follow Up Remark',
      'Sales Status',
      'Sales Status Remark',
      'Enquired Product',
      'Quantity',
      'Product Remark',
      'Salesperson',
      'Telecaller',
      'Enquiry Date'
    ];

    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = filteredEnquiries.map(enquiry => [
      escapeCSV(enquiry.customer_name || 'N/A'),
      escapeCSV(enquiry.business || 'N/A'),
      escapeCSV(enquiry.address || 'N/A'),
      escapeCSV(enquiry.state || 'N/A'),
      escapeCSV(enquiry.division || 'N/A'),
      escapeCSV(enquiry.follow_up_status || 'N/A'),
      escapeCSV(enquiry.follow_up_remark || 'N/A'),
      escapeCSV(enquiry.sales_status || 'N/A'),
      escapeCSV(enquiry.sales_status_remark || 'N/A'),
      escapeCSV(enquiry.enquired_product || 'N/A'),
      escapeCSV(enquiry.product_quantity || 'N/A'),
      escapeCSV(enquiry.product_remark || 'N/A'),
      escapeCSV(enquiry.salesperson || 'N/A'),
      escapeCSV(enquiry.telecaller || 'N/A'),
      escapeCSV(enquiry.enquiry_date || 'N/A')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `enquiries_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toastManager.success(`Exported ${filteredEnquiries.length} enquiry(ies) to CSV`);
  };

  // Handle enquiry edit
  const handleEditEnquiry = (enquiry) => {
    // TODO: Open edit modal
    console.log('Edit enquiry:', enquiry);
    toastManager.info('Edit functionality coming soon');
  };

  // Handle enquiry delete
  const handleDeleteEnquiry = async (enquiryId) => {
    try {
      setEnquiriesLoading(true);
      const response = await apiClient.delete(API_ENDPOINTS.ENQUIRY_DELETE(enquiryId));
      if (response.success) {
        toastManager.success('Enquiry deleted successfully');
        // Clear cache and refetch
        enquiriesCacheRef.current.clear();
        await fetchEnquiries(true, enquiryPage, enquiryLimit);
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      apiErrorHandler.handleError(error, 'delete enquiry');
    } finally {
      setEnquiriesLoading(false);
    }
  };

  // Handle enquiry column visibility
  const toggleEnquiryColumn = (columnKey) => {
    setEnquiryVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const resetEnquiryColumns = () => {
    setEnquiryVisibleColumns({
      customer_name: true,
      business: true,
      state: true,
      division: true,
      address: true,
      enquired_product: true,
      product_quantity: true,
      product_remark: true,
      follow_up_status: false,
      follow_up_remark: false,
      sales_status: false,
      sales_status_remark: false,
      salesperson: false,
      telecaller: false,
      enquiry_date: false
    });
  };

  const showAllEnquiryColumns = () => {
    setEnquiryVisibleColumns({
      customer_name: true,
      business: true,
      state: true,
      division: true,
      address: true,
      enquired_product: true,
      product_quantity: true,
      product_remark: true,
      follow_up_status: true,
      follow_up_remark: true,
      sales_status: true,
      sales_status_remark: true,
      salesperson: true,
      telecaller: true,
      enquiry_date: true
    });
  };

  const fetchQuotations = async (leadId) => {
    setLoadingQuotations(true);
    try {
      const quotations = await quotationServiceInstance.fetchQuotationsByCustomer(leadId);
      setQuotations(quotations);
    } finally {
      setLoadingQuotations(false);
    }
  };

  const handleApproveQuotation = async (quotationId) => {
    const previewLeadId = previewLead?.id || null;
    const updatedQuotations = await quotationServiceInstance.approveQuotation(quotationId, previewLeadId);
    if (updatedQuotations.length > 0) {
      setQuotations(updatedQuotations);
    }
  };

  const buildPreviewQuotation = (dbQuotation) => {
    if (!dbQuotation) return null;

    // Normalized shape compatible with QuotationPreview / QuotationDataMapper
    return {
      // Core identifiers
      id: dbQuotation.id,
      quotationNumber: dbQuotation.quotation_number,
      quotationDate: dbQuotation.quotation_date,
      validUpto: dbQuotation.valid_until,
      selectedBranch: dbQuotation.branch || DEFAULT_BRANCH,
      template: dbQuotation.template || '',

      // Customer / bill-to
      customerId: dbQuotation.customer_id,
      billTo: typeof dbQuotation.bill_to === 'string'
        ? JSON.parse(dbQuotation.bill_to)
        : (dbQuotation.bill_to || {
            business: dbQuotation.customer_business,
            buyerName: dbQuotation.customer_business,
            address: dbQuotation.customer_address,
            phone: dbQuotation.customer_phone,
            gstNo: dbQuotation.customer_gst_no,
            state: dbQuotation.customer_state
          }),

      // Line items
      items: (dbQuotation.items || []).map(i => ({
        productName: i.product_name || i.productName,
        description: i.description,
        quantity: i.quantity,
        unit: i.unit || 'Nos',
        buyerRate: i.unit_price || i.buyerRate,
        unitPrice: i.unit_price || i.buyerRate,
        amount: i.taxable_amount || i.amount,
        total: i.total_amount || i.total,
        hsn: i.hsn_code || i.hsn,
        hsnCode: i.hsn_code || i.hsn,
        gstRate: i.gst_rate || i.gstRate || 18
      })),

      // Financial summary
      subtotal: parseFloat(dbQuotation.subtotal || 0),
      discountRate: parseFloat(dbQuotation.discount_rate || 0),
      discountAmount: parseFloat(dbQuotation.discount_amount || 0),
      taxRate: parseFloat(dbQuotation.tax_rate || 0),
      taxAmount: parseFloat(dbQuotation.tax_amount || 0),
      total: parseFloat(dbQuotation.total_amount || 0),

      // Extra fields used by templates
      paymentMode: dbQuotation.payment_mode || '',
      transportTc: dbQuotation.transport_tc || '',
      dispatchThrough: dbQuotation.dispatch_through || '',
      deliveryTerms: dbQuotation.delivery_terms || '',
      materialType: dbQuotation.material_type || '',
      bankDetails: typeof dbQuotation.bank_details === 'string'
        ? JSON.parse(dbQuotation.bank_details)
        : dbQuotation.bank_details,
      termsSections: typeof dbQuotation.terms_sections === 'string'
        ? JSON.parse(dbQuotation.terms_sections)
        : dbQuotation.terms_sections,

      // Status
      status: dbQuotation.status
    };
  };

  const handleRejectQuotation = async (quotationId) => {
    const previewLeadId = previewLead?.id || null;
    const updatedQuotations = await quotationServiceInstance.rejectQuotation(quotationId, previewLeadId);
    if (updatedQuotations.length > 0) {
      setQuotations(updatedQuotations);
    }
  };

  const handleViewQuotation = async (quotationId) => {
    try {
      const dbQuotation = await quotationServiceInstance.getQuotation(quotationId);
      if (!dbQuotation) {
        toastManager.error('Failed to load quotation details');
        return;
      }
      const normalized = buildPreviewQuotation(dbQuotation);
      if (!normalized) {
        toastManager.error('Unable to prepare quotation for preview');
        return;
      }
      setSelectedQuotation(normalized);
      setShowQuotationModal(true);
    } catch (error) {
      apiErrorHandler.handleError(error, 'view quotation');
    }
  };

  const handleDownloadPDF = async (quotationId) => {
    const quotation = await quotationServiceInstance.getQuotation(quotationId);
    if (quotation) {
      await generateQuotationPDF(quotation);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target.result;
        const parsedData = parseCSV(csvText);
        setImportPreview(parsedData);
        setShowImportModal(true);
        if (importFileInputRef.current) {
          importFileInputRef.current.value = '';
        }
      };
      reader.readAsText(file);
    } else {
      toastManager.error('Please select a valid CSV file');
    }
  };

  const handleImportLeads = async () => {
    if (importPreview.length === 0) {
      toastManager.error('No data to import');
      return;
    }

    if (!user?.id) {
      toastManager.error('User information not available. Please refresh and try again.');
      return;
    }

    setImporting(true);

    try {
      // Initialize validation service
      const validationService = new CSVImportValidationService(user.id);
      await validationService.initialize();

      // Build initial payloads - STRICT: filter out null payloads (invalid rows)
      const validationErrors = [];
      const initialPayloads = importPreview
        .map((row, index) => {
          const payload = leadService.buildCSVLeadPayload(row, index, validationErrors);
          if (!payload) {
            return null; // Row was skipped due to validation
          }
          payload.date = formatDateUtil(row['Date (YYYY-MM-DD)']);
          return payload;
        })
        .filter(payload => payload !== null); // Remove null payloads (skipped rows)

      // Show initial validation errors (from buildCSVLeadPayload)
      if (validationErrors.length > 0) {
        const errorPreview = validationErrors.slice(0, 3).join('; ');
        const errorMsg = `${validationErrors.length} row(s) skipped due to validation errors. Examples: ${errorPreview}${validationErrors.length > 3 ? ` and ${validationErrors.length - 3} more...` : ''}`;
        toastManager.warning(errorMsg);
      }

      // Validate and process leads (further validation)
      const validLeads = validationService.processLeads(initialPayloads);
      const summary = validationService.getSummary();

      // Show validation summary
      const frontendSkipped = validationErrors.length + summary.skippedCount;
      if (frontendSkipped > 0) {
        const skippedMsg = `${frontendSkipped} lead(s) skipped due to validation errors`;
        const allErrors = [...validationErrors, ...summary.errors];
        const errorPreview = allErrors.slice(0, 3).join('; ');
        const fullMsg = errorPreview 
          ? `${skippedMsg}. Examples: ${errorPreview}${allErrors.length > 3 ? ` and ${allErrors.length - 3} more...` : ''}`
          : skippedMsg;
        toastManager.warning(fullMsg);
      }

      if (validLeads.length === 0) {
        toastManager.error('No valid leads to import. Please check your CSV data.');
        setImporting(false);
        return;
      }

      const importResult = await leadService.importLeads(validLeads);
      const response = await leadService.fetchLeads({ page, limit });
      if (response.data) {
        setLeadsData(response.data);
        if (response.pagination) {
          setTotal(Number(response.pagination.total) || 0);
        }
        // Only refresh all leads if filters are active
        const hasActiveFilters = statusFilter.type || assignmentFilter || 
          Object.values(columnFilters).some(v => v) || 
          assignedSalespersonFilter || assignedTelecallerFilter;
        if (hasActiveFilters) {
          requestAllLeadsRefresh();
        }
      }

      const totalSkipped = validationErrors.length + summary.skippedCount + (importResult?.data?.skippedCount || 0);
      const backendSkipped = importResult?.data?.skippedRows || [];
      const allSkippedReasons = [
        ...validationErrors,
        ...summary.errors,
        ...backendSkipped.map(s => `Row ${s.row}: ${s.reason}`)
      ];
      
      if (totalSkipped > 0) {
        const errorPreview = allSkippedReasons.slice(0, 5).join('; ');
        const warningMsg = `${totalSkipped} row(s) skipped due to validation errors. Examples: ${errorPreview}${allSkippedReasons.length > 5 ? ` and ${allSkippedReasons.length - 5} more...` : ''}`;
        toastManager.warning(warningMsg);
      }
      
      const importedCount = importResult?.data?.importedCount || validLeads.length;
      const successMsg = `Successfully imported ${importedCount} lead(s)`;
      toastManager.success(successMsg);
      
      setShowImportModal(false);
      setImportPreview([]);
      if (importFileInputRef.current) {
        importFileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('CSV Import Error:', error);
      apiErrorHandler.handleError(error, 'import leads');
      toastManager.error(`Failed to import leads: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };


  const requestAllLeadsRefresh = () => {
    setAllLeadsRefreshKey((prev) => prev + 1);
  };

  const buildLeadFetchParams = () => {
    const params = { page };
    if (limit && limit !== 'all' && limit < 50000) {
      params.limit = limit;
    } else {
      params.limit = 50000;
    }
    const trimmedSearch = searchTerm.trim();
    if (trimmedSearch) {
      params.search = trimmedSearch;
    }
    return params;
  };

  const applyLeadResponse = (response, { refreshAll = false } = {}) => {
    if (!response?.data) return;
    // Ensure date fields are preserved for Last Call filtering
    const leadsWithDates = response.data.map(lead => ({
      ...lead,
      follow_up_date: lead.follow_up_date || lead.followUpDate || null,
      follow_up_remark: lead.follow_up_remark || lead.followUpRemark || null,
      follow_up_status: lead.follow_up_status || lead.followUpStatus || null,
      next_meeting_date: lead.next_meeting_date || lead.nextMeetingDate || null,
      meeting_date: lead.meeting_date || lead.meetingDate || null,
      scheduled_date: lead.scheduled_date || lead.scheduledDate || null,
      sales_status: lead.sales_status || lead.salesStatus || null,
      sales_status_remark: lead.sales_status_remark || lead.salesStatusRemark || null,
      updated_at: lead.updated_at || lead.updatedAt || null
    }));
    setLeadsData(leadsWithDates);
    if (response.pagination) {
      setTotal(Number(response.pagination.total) || 0);
    }
    if (refreshAll) {
      requestAllLeadsRefresh();
    }
  };

  const loadAllLeadsForFilters = async (force = false) => {
    if (!force) {
      if (allLeadsFetchPromiseRef.current) {
        await allLeadsFetchPromiseRef.current;
        return allLeadsData;
      }
      if (allLeadsData.length > 0) {
        return allLeadsData;
      }
    }

    // If already loading, wait for existing promise
    if (allLeadsFetchPromiseRef.current) {
      return allLeadsFetchPromiseRef.current;
    }

    const fetchPromise = (async () => {
      setLoadingAllLeads(true);
      try {
        // Use setTimeout to yield to UI thread and prevent blocking
        await new Promise(resolve => setTimeout(resolve, 0));
        const transformed = await leadService.fetchAllLeads();
        // Ensure date fields are preserved for Last Call filtering
        const leadsWithDates = transformed.map(lead => ({
          ...lead,
          follow_up_date: lead.follow_up_date || lead.followUpDate || null,
          follow_up_remark: lead.follow_up_remark || lead.followUpRemark || null,
          follow_up_status: lead.follow_up_status || lead.followUpStatus || null,
          next_meeting_date: lead.next_meeting_date || lead.nextMeetingDate || null,
          meeting_date: lead.meeting_date || lead.meetingDate || null,
          scheduled_date: lead.scheduled_date || lead.scheduledDate || null,
          sales_status: lead.sales_status || lead.salesStatus || null,
          sales_status_remark: lead.sales_status_remark || lead.salesStatusRemark || null,
          updated_at: lead.updated_at || lead.updatedAt || null
        }));
        setAllLeadsData(leadsWithDates);
        allLeadsDataRef.current = leadsWithDates;
        return leadsWithDates;
      } catch (error) {
        throw error;
      } finally {
        setLoadingAllLeads(false);
        allLeadsFetchPromiseRef.current = null;
      }
    })();

    allLeadsFetchPromiseRef.current = fetchPromise;
    return fetchPromise;
  };

  // Set ref for fetchLastCallLeads to access (after function is defined)
  useEffect(() => {
    loadAllLeadsForFiltersRef.current = loadAllLeadsForFilters;
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await leadService.fetchLeads(buildLeadFetchParams());
      applyLeadResponse(response);
    } catch (error) {
      apiErrorHandler.handleError(error, 'fetch leads');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // OPTIMIZED: Only refresh all leads if filters are active
  const handleManualRefresh = () => {
    fetchLeads();
    // Only refresh all leads if filters are active
    const hasActiveFilters = statusFilter.type || assignmentFilter || 
      Object.values(columnFilters).some(v => v) || 
      assignedSalespersonFilter || assignedTelecallerFilter;
    if (hasActiveFilters) {
      requestAllLeadsRefresh();
    }
  };

  
  const handleBulkDelete = async () => {
    if (selectedLeadIds.length === 0) {
      toastManager.warning('Please select leads to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedLeadIds.length} lead(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.delete(API_ENDPOINTS.LEADS_BATCH_DELETE(), {
        ids: selectedLeadIds
      });

      if (response.success) {
        toastManager.success(`Successfully deleted ${response.deletedCount || selectedLeadIds.length} lead(s)`);
        setSelectedLeadIds([]);
        setIsAllSelected(false);
        await fetchLeads();
        const hasActiveFilters = statusFilter.type || assignmentFilter || 
          Object.values(columnFilters).some(v => v) || 
          assignedSalespersonFilter || assignedTelecallerFilter;
        if (hasActiveFilters) {
          requestAllLeadsRefresh();
        }
      } else {
        toastManager.error(response.message || 'Failed to delete leads');
      }
    } catch (error) {
      apiErrorHandler.handleError(error, 'bulk delete leads');
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = () => {
    const leadsToExport = uniqueFilteredLeads.length > 0 ? uniqueFilteredLeads : leadsData;
    
    if (!leadsToExport || leadsToExport.length === 0) {
      toastManager.warning('No leads to export');
      return;
    }

    exportToExcel(leadsToExport, 'leads_export');
  };

  const fetchQuotationAndPICounts = async () => {
    try {
      setLoadingCounts(true);
      const result = await leadsFilterService.fetchQuotationAndPICounts();
      setQuotationCounts(result.quotationCounts);
      setPiCounts(result.piCounts);
      return result;
    } catch (error) {
      return null;
    } finally {
      setLoadingCounts(false);
    }
  };

  useEffect(() => {
    // Sync showAll state with limit value
    if (limit >= 50000) {
      setShowAll(true);
    } else {
      setShowAll(false);
    }
  }, [limit]);

  // OPTIMIZED: Debounce search term to prevent excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // OPTIMIZED: Load counts on initial mount, but don't load all leads until filters are used
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Only load counts on initial mount (fast)
        // Don't load all leads until filters are actually used
        await fetchQuotationAndPICounts();
        // Then fetch paginated leads for display (only 10 initially)
        await fetchLeads();
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  // Separate effect for pagination/search changes (only when no filters active)
  useEffect(() => {
    // Only fetch paginated leads if no filters are active
    // When filters are active, we use allLeadsData and filter client-side
    if (!statusFilter.type && !assignmentFilter) {
      fetchLeads();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, searchTerm]);

  // OPTIMIZED: Only load all leads when filters are actually active
  useEffect(() => {
    const hasActiveFilters = statusFilter.type || assignmentFilter || 
      Object.values(columnFilters).some(v => v) || 
      assignedSalespersonFilter || assignedTelecallerFilter;
    
    // Only fetch all leads if filters are active or explicitly requested
    if (hasActiveFilters || allLeadsRefreshKey > 0) {
      loadAllLeadsForFilters(true).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allLeadsRefreshKey, statusFilter.type, assignmentFilter, assignedSalespersonFilter, assignedTelecallerFilter]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUsersError('');
    const result = await userService.fetchUsers();
    setUsernames(result.usernames);
    setUsersError(result.error);
    setLoadingUsers(false);
  };

  useEffect(() => {
    if (showEditModal || showAssignModal) {
      fetchUsers();
    }
  }, [showEditModal, showAssignModal]);

  useEffect(() => {
    if (showPreviewModal && previewLead && previewLead.id) {
      fetchQuotations(previewLead.id);
    }
  }, [showPreviewModal, previewLead]);

  const openAssignModal = (lead) => {
    setAssigningLead(lead);
    setAssignForm({
      salesperson: lead.assignedSalesperson || '',
      telecaller: lead.assignedTelecaller || ''
    });
    setShowAssignModal(true);
  };

  const toggleColumn = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const isValueAssigned = (val) => {
    if (!val) return false;
    const s = String(val).trim().toLowerCase();
    return s !== 'unassigned' && s !== 'n/a' && s !== 'na' && s !== '-';
  };

  const isLeadAssigned = (lead) =>
    isValueAssigned(lead.assignedSalesperson) || isValueAssigned(lead.assignedTelecaller);

  const resetColumns = () => {
    setVisibleColumns({
      customerId: false,
      customer: true,
      business: true,
      address: true,
      state: true,
      division: false,
      followUpStatus: true,
      salesStatus: true,
      assignedSalesperson: true,
      assignedTelecaller: true,
      gstNo: false,
      leadSource: false,
      productNames: false,
      category: false,
      createdAt: false,
      telecallerStatus: false,
      paymentStatus: false,
      updatedAt: false
    });
  };

  const showAllColumns = () => {
    setVisibleColumns(prev => {
      const allTrue = {};
      for (const key in prev) {
        if (prev.hasOwnProperty(key)) {
          allTrue[key] = true;
        }
      }
      return allTrue;
    });
  };

  const hasStatusFilter = Boolean(statusFilter.type && statusFilter.status);
  const hasAssignmentFilter = Boolean(assignmentFilter);
  // OPTIMIZED: Use all leads when filters are active (quotation, PI, or assignment)
  const activeLeadPool = (hasStatusFilter || hasAssignmentFilter)
    ? (allLeadsDataRef.current.length > 0 ? allLeadsDataRef.current : allLeadsData.length > 0 ? allLeadsData : []) 
    : leadsData;

  // OPTIMIZED: useMemo with async chunk processing for large arrays
  const filteredLeads = useMemo(() => {
    // For large arrays, use chunk processing (handled inside filterLeads)
    // For now, return synchronous result (filterLeads will handle chunking internally)
    const result = filterLeads(
      activeLeadPool,
      debouncedSearchTerm, // Use debounced search instead of immediate
      assignmentFilter,
      statusFilter,
      filteredCustomerIds,
      isLeadAssigned,
      assignedSalespersonFilter,
      assignedTelecallerFilter,
      columnFilters
    );
    // If result is a promise, we need to handle it differently
    // For now, assuming filterLeads returns sync result for small arrays
    return result;
  }, [activeLeadPool, debouncedSearchTerm, assignmentFilter, statusFilter, filteredCustomerIds, isLeadAssigned, assignedSalespersonFilter, assignedTelecallerFilter, columnFilters]);

  const uniqueFilteredLeads = useMemo(() => {
    const seen = new Set();
    const result = [];

    for (let i = 0; i < filteredLeads.length; i++) {
      const lead = filteredLeads[i];
      const key = lead?.id ?? lead?.customerId;
      if (key == null) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(lead);
    }

    return result;
  }, [filteredLeads]);

  const unassignedLeadIds = useMemo(() => 
    getUnassignedLeadIds(uniqueFilteredLeads, isLeadAssigned), 
    [uniqueFilteredLeads, isLeadAssigned]
  );

  // OPTIMIZED: useCallback to prevent unnecessary re-renders
  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedLeadIds([]);
      setIsAllSelected(false);
      return;
    }
    // Select all visible leads (including assigned ones for reassignment)
    const allVisibleLeadIds = uniqueFilteredLeads.map(l => l.id).filter(id => id != null);
    setSelectedLeadIds([...allVisibleLeadIds]);
    setIsAllSelected(allVisibleLeadIds.length > 0);
  }, [isAllSelected, uniqueFilteredLeads]);

  const toggleSelectOne = useCallback((id) => {
    setSelectedLeadIds((prev) => {
      const prevSet = new Set(prev);
      if (prevSet.has(id)) {
        prevSet.delete(id);
      } else {
        prevSet.add(id);
      }
      const next = Array.from(prevSet);
      // Check if all visible leads are selected (including assigned ones)
      setIsAllSelected(next.length > 0 && next.length === uniqueFilteredLeads.length);
      return next;
    });
  }, [uniqueFilteredLeads]);

  const tableLoading = loading || ((hasStatusFilter || hasAssignmentFilter) && loadingAllLeads && allLeadsData.length === 0);
  const paginationDisabled = hasStatusFilter || hasAssignmentFilter;
  const effectiveLimit = (limit === 'all' || limit >= 50000) ? total : limit;
  const totalPages = showAll ? 1 : Math.max(1, Math.ceil(total / effectiveLimit) || 1);
  const pageStart = total === 0 ? 0 : showAll ? 1 : (page - 1) * effectiveLimit + 1;
  const pageEnd = total === 0 ? 0 : showAll ? total : Math.min(page * effectiveLimit, total);
  const paginationSummary = paginationDisabled
    ? `${uniqueFilteredLeads.length} matching lead${uniqueFilteredLeads.length === 1 ? '' : 's'}`
    : showAll 
      ? `Showing all ${total} leads`
      : `${pageStart} - ${pageEnd} of ${total}`;
  
  // OPTIMIZED: Calculate assigned counts from ALL leads, not just current page
  const { assignedCount, unassignedCount } = useMemo(() => {
    // Use all leads data if available, otherwise use current page data
    const leadsToCount = allLeadsData.length > 0 ? allLeadsData : leadsData;
    return calculateAssignedCounts(leadsToCount, isLeadAssigned);
  }, [allLeadsData, leadsData, isLeadAssigned]);

  const handleBadgeClick = async (type, status) => {
    if (statusFilter.type === type && statusFilter.status === status) {
      setStatusFilter({ type: null, status: null });
      setFilteredCustomerIds(new Set());
      return;
    }
    
    try {
      setStatusFilter({ type, status });
      setPage(1); // Reset to first page when filter is applied
      
      // Show loading state immediately
      setLoadingAllLeads(true);
      
      // OPTIMIZED: Load all leads and counts in parallel, but with proper loading states
      // This ensures counts and filtering work on ALL leads (5000+), not just current page
      const [loadedLeads, countsResult] = await Promise.all([
        loadAllLeadsForFilters(true).catch(err => {
          console.error('Error loading all leads:', err);
          return [];
        }),
        fetchQuotationAndPICounts().catch(err => {
          console.error('Error loading counts:', err);
          return null;
        })
      ]);
      
      let customerIds = new Set();
      if (type === 'pi') {
        const relevantPIs = countsResult?.filteredPIs[status] || [];
        console.log(`[Filter Debug] PI Filter - Status: ${status}, Relevant PIs:`, relevantPIs.length, relevantPIs);
        if (relevantPIs.length > 0) {
          customerIds = await leadsFilterService.extractCustomerIdsFromPIs(relevantPIs);
          console.log(`[Filter Debug] Extracted customer IDs from PIs:`, Array.from(customerIds));
        }
      } else if (type === 'quotation') {
        const relevantQuotations = countsResult?.filteredQuotations[status] || [];
        console.log(`[Filter Debug] Quotation Filter - Status: ${status}, Relevant Quotations:`, relevantQuotations.length, relevantQuotations);
        if (relevantQuotations.length > 0) {
          // Log customer IDs from quotations
          const customerIdsFromQuotations = relevantQuotations.map(q => ({
            id: q.id,
            customer_id: q.customer_id,
            customerId: q.customerId,
            customerID: q.customerID
          }));
          console.log(`[Filter Debug] Customer IDs from quotations:`, customerIdsFromQuotations);
          
          customerIds = await leadsFilterService.extractCustomerIdsFromQuotations(relevantQuotations);
          console.log(`[Filter Debug] Extracted customer IDs:`, Array.from(customerIds));
        }
      }
      
      // Debug: Check sample lead IDs and test matching
      if (loadedLeads.length > 0) {
        const sampleLeadIds = loadedLeads.slice(0, 10).map(lead => ({
          id: lead.id,
          customerId: lead.customerId,
          customer_id: lead.customer_id,
          customer: lead.customer
        }));
        console.log(`[Filter Debug] Sample lead IDs:`, sampleLeadIds);
        
        // Test matching on sample leads
        const matchingLeads = loadedLeads.filter(lead => {
          const leadIdFields = [lead.id, lead.customerId, lead.customer_id].filter(
            (id) => id !== null && id !== undefined
          );
          for (const leadId of leadIdFields) {
            const normalized = IDMatcher.normalizeId(leadId);
            if (normalized.numeric !== null && customerIds.has(normalized.numeric)) {
              return true;
            }
            if (customerIds.has(normalized.string)) {
              return true;
            }
            if (customerIds.has(String(leadId))) {
              return true;
            }
          }
          return false;
        });
        console.log(`[Filter Debug] Matching leads found:`, matchingLeads.length, matchingLeads.slice(0, 3));
        
        // Check if customer_id 7634 exists in any lead
        const leadWith7634 = loadedLeads.find(lead => 
          lead.id === 7634 || lead.customerId === 7634 || lead.customer_id === 7634 ||
          String(lead.id) === '7634' || String(lead.customerId) === '7634' || String(lead.customer_id) === '7634'
        );
        console.log(`[Filter Debug] Lead with ID 7634:`, leadWith7634);
        
        // Check all leads with IDs close to 7634
        const leadsNear7634 = loadedLeads.filter(lead => {
          const id = lead.id || lead.customerId || lead.customer_id;
          return id && (Math.abs(Number(id) - 7634) < 10);
        }).slice(0, 5);
        console.log(`[Filter Debug] Leads near ID 7634:`, leadsNear7634);
        
        // Verify customerIds set contains 7634
        console.log(`[Filter Debug] Customer IDs set contains 7634:`, customerIds.has(7634), customerIds.has('7634'));
        console.log(`[Filter Debug] All customer IDs in set:`, Array.from(customerIds));
      }
      
      setFilteredCustomerIds(customerIds);
      console.log(`[Filter Debug] Filter applied: ${type} - ${status}, Customer IDs set size: ${customerIds.size}, Total leads loaded: ${loadedLeads.length}`);
    } catch (err) {
      console.error('Error in handleBadgeClick:', err);
      toastManager.error('Failed to load leads for filtering');
      setStatusFilter({ type: null, status: null });
      setFilteredCustomerIds(new Set());
    } finally {
      setLoadingAllLeads(false);
    }
  };

  const handleCustomerSave = async (customerData) => {
    try {
      setLoading(true);
      const newCustomer = leadService.buildLeadPayload(customerData);
      const transformedLead = await leadService.createLead(newCustomer);
      
      if (transformedLead) {
        setLeadsData(prevLeads => {
          if (prevLeads && prevLeads.length > 0) {
            return [...prevLeads, transformedLead];
          } else {
            return [transformedLead];
          }
        });
        requestAllLeadsRefresh();
        toastManager.success('Customer created successfully');
        setShowAddCustomer(false);
        
        setTimeout(async () => {
          try {
            const response = await leadService.fetchLeads(buildLeadFetchParams());
            applyLeadResponse(response, { refreshAll: true });
          } catch (error) {
            console.error('Error refreshing leads:', error);
          }
        }, 100);
      }
    } catch (error) {
      apiErrorHandler.handleError(error, 'create customer');
    } finally {
      setLoading(false);
    }
  };


  const fetchPIsForLead = async () => {
    try {
      setLoadingPIs(true);
      const pis = await piService.fetchAllPIs();
      setProformaInvoices(pis);
    } catch (error) {
      console.error('Error fetching PIs:', error);
      setProformaInvoices([]);
    } finally {
      setLoadingPIs(false);
    }
  };

  const handleApprovePI = async (piId) => {
    const success = await piService.approvePI(piId);
    if (success && previewLead) {
      await fetchPIsForLead();
    }
  };

  const handleRejectPI = async (piId) => {
    const reason = prompt('Please enter rejection reason:');
    const success = await piService.rejectPI(piId, reason);
    if (success && previewLead) {
      await fetchPIsForLead();
    }
  };

  const handleViewPI = async (piId) => {
    try {
      const result = await piService.fetchPIWithQuotation(piId);
      if (!result) return;

      const { pi, completeQuotation, quotationItems } = result;
      const mappedItems = piService.buildPIItems(quotationItems);
      const totals = piService.calculatePITotals(mappedItems, completeQuotation, pi);
      const { advancePayment, originalQuotationTotal } = await piService.calculateAdvancePayment(
        pi.quotation_id, 
        totals.piTotal, 
        totals.quotationTotal
      );
      const finalTotal = piService.calculateFinalTotal(
        totals.piTotal, 
        totals.quotationTotal, 
        advancePayment, 
        originalQuotationTotal
      );
      
      // Get customer data for billTo
      const customerData = allLeadsDataRef.current?.find(lead => lead.id === Number(pi.customer_id)) || null;
      const billTo = piService.buildBillTo(completeQuotation, pi, customerData);
      
      // Build PI data in the same shape used by salesperson PI preview / templates
      const quotationNumber = completeQuotation.quotation_number || pi.pi_number || pi.id;
      const rawPiDate = pi.pi_date || pi.piDate || pi.created_at;
      const piDate = rawPiDate ? new Date(rawPiDate).toISOString().split('T')[0] : '';
      const validUntil = pi.valid_until || pi.validUntil || completeQuotation.valid_until || '';

      // Bank details & terms from quotation (same as CreatePIForm)
      const rawBankDetails = completeQuotation.bank_details || completeQuotation.bankDetails;
      let bankDetails = null;
      try {
        if (rawBankDetails) {
          bankDetails = typeof rawBankDetails === 'string' ? JSON.parse(rawBankDetails) : rawBankDetails;
        }
      } catch (e) {
        // Bank details parsing failed, will use null
      }

      const rawTerms = completeQuotation.terms_sections || completeQuotation.termsSections;
      let terms = [];
      try {
        const baseTerms = typeof rawTerms === 'string' ? JSON.parse(rawTerms) : rawTerms;
        if (Array.isArray(baseTerms)) {
          terms = baseTerms.map((sec) => ({
            title: sec.title || '',
            points: Array.isArray(sec.points) ? sec.points : []
          }));
        }
      } catch (e) {
        // Terms parsing failed, will use empty array
      }

      // For PI preview we must use the PI's own template key (type "pi")
      // Do NOT fall back to the quotation's template key, since that is a different template type.
      const templateKey = pi.template || null;
      if (!templateKey) {
        toastManager.error('This PI has no template configured. Please recreate the PI with a PI template.');
        return;
      }
      const selectedBranch = completeQuotation.branch || DEFAULT_BRANCH;

      const formattedPiData = {
        // Header & identity
        quotationNumber,
        quotationDate: piDate,
        invoiceNumber: pi.pi_number || pi.piNumber || quotationNumber,
        invoiceDate: piDate,
        piNumber: pi.pi_number || pi.piNumber || quotationNumber,
        piDate,
        piId: pi.pi_number || pi.id,
        validUpto: validUntil,
        piValidUpto: validUntil,

        // Parties & template context
        billTo,
        items: mappedItems.map((item) => ({
          productName: item.description,
          description: item.subDescription || item.description,
          quantity: item.quantity,
          unit: item.unit,
          rate: item.rate,
          buyerRate: item.buyerRate,
          amount: item.amount,
          hsn: item.hsn || '85446090',
          hsnCode: item.hsn || '85446090'
        })),
        subtotal: totals.subtotal,
        discountRate: totals.discountRate,
        discountAmount: totals.discountAmount,
        taxableAmount: totals.taxableAmount,
        taxRate: totals.taxRate,
        taxAmount: totals.taxAmount,
        total: finalTotal,

        // Additional details from quotation
        paymentMode: completeQuotation.payment_mode || completeQuotation.paymentMode || '',
        transportTc: completeQuotation.transport_tc || completeQuotation.transportTc || '',
        dispatchThrough: completeQuotation.dispatch_through || completeQuotation.dispatchThrough || '',
        deliveryTerms: completeQuotation.delivery_terms || completeQuotation.deliveryTerms || '',
        materialType: completeQuotation.material_type || completeQuotation.materialType || '',

        // Textual terms
        paymentTerms: completeQuotation.payment_terms || completeQuotation.paymentTerms || '',
        validity: validUntil,
        warranty: completeQuotation.warranty || '',

        // Bank details & terms & conditions
        bankDetails,
        terms,

        // Meta
        template: templateKey,
        selectedBranch
      };

      setPiPreviewData(formattedPiData);
      setShowPIPreview(true);
    } catch (error) {
      console.error('Error viewing PI:', error);
      toastManager.error('Failed to load PI details');
    }
  };

  // Handle edit
  const handleEdit = (lead) => {
    setEditingLead(lead);
    setEditFormData({
      customer: lead.customer && lead.customer !== 'N/A' ? lead.customer : '',
      email: lead.email && lead.email !== 'N/A' ? lead.email : '',
      business: lead.business && lead.business !== 'N/A' ? lead.business : '',
      address: lead.address && lead.address !== 'N/A' ? lead.address : '',
      state: lead.state && lead.state !== 'N/A' ? lead.state : '',
      division: lead.division && lead.division !== 'N/A' ? lead.division : '',
      leadSource: lead.leadSource || '',
      category: lead.category || '',
      salesStatus: lead.salesStatus || '',
      phone: lead.phone || '',
      gstNo: lead.gstNo || '',
      productNames: lead.productNamesText || '',
      assignedSalesperson: lead.assignedSalesperson || '',
      assignedTelecaller: lead.assignedTelecaller || '',
      telecallerStatus: lead.telecallerStatus || '',
      paymentStatus: lead.paymentStatus || ''
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (editingLead && editingLead.id) {
        await leadService.updateLead(editingLead.id, editFormData);

        const updatedLeads = [];
        for (let i = 0; i < leadsData.length; i++) {
          const lead = leadsData[i];
          updatedLeads.push(lead.id === editingLead.id ? { ...lead, ...editFormData } : lead);
        }
        setLeadsData(updatedLeads);
        requestAllLeadsRefresh();

        toastManager.success('Lead updated successfully');
        setShowEditModal(false);
        setEditingLead(null);
      }
    } catch (error) {
      apiErrorHandler.handleError(error, 'update lead');
    }
  };

  const getStatusBadge = getStatusBadgeUtil;

  // Show skeleton loader on initial load
  if (initialLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div
      className={`space-y-4 sm:space-y-6 transition-all duration-300 ${showCustomerTimeline ? 'pl-3 sm:pl-4 md:pl-6' : 'p-3 sm:p-4 md:p-6'}`}
      style={{
        width: showCustomerTimeline ? 'calc(98% - 200px)' : '100%',
        marginRight: 0,
        paddingRight: showCustomerTimeline ? 0 : '1.5rem',
        paddingLeft: '1.5rem',
        boxSizing: 'border-box',
        overflow: 'visible',
        position: 'relative',
        marginLeft: 0,
        maxWidth: showCustomerTimeline ? 'calc(98% - 200px)' : '100%',
        flexShrink: 0
      }}
    >
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('leads')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'leads'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            Leads
          </button>
          <button
            onClick={() => setActiveTab('enquiry')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'enquiry'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package className="w-4 h-4" />
            Enquiry
          </button>
          <button
            onClick={() => setActiveTab('lastCall')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'lastCall'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Phone className="w-4 h-4" />
            Last Call
          </button>
        </nav>
      </div>

      {activeTab === 'leads' && (
        <>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onImportClick={() => setShowImportPopup(true)}
        onAddCustomer={() => setShowAddCustomer(true)}
        onAssignSelected={() => {
          setAssigningLead(null);
          setAssignForm({ salesperson: '', telecaller: '' });
          setShowAssignModal(true);
        }}
        onBulkDelete={handleBulkDelete}
        onExportExcel={handleExportToExcel}
        selectedCount={selectedLeadIds.length}
        onRefresh={handleManualRefresh}
      />

      <FilterBadges
        quotationCounts={quotationCounts}
        piCounts={piCounts}
        loadingCounts={loadingCounts}
        statusFilter={statusFilter}
        assignmentFilter={assignmentFilter}
        assignedCount={assignedCount}
        unassignedCount={unassignedCount}
        onBadgeClick={handleBadgeClick}
        onAssignmentFilter={async (filter) => {
          // OPTIMIZED: Load all leads before applying assignment filter
          if (filter && allLeadsData.length === 0) {
            setLoadingAllLeads(true);
            try {
              await loadAllLeadsForFilters(true);
            } catch (err) {
              console.error('Error loading all leads for assignment filter:', err);
              toastManager.error('Failed to load leads for filtering');
            } finally {
              setLoadingAllLeads(false);
            }
          }
          setAssignmentFilter(filter);
          setPage(1); // Reset to first page
        }}
        onClearFilter={() => {
          setStatusFilter({ type: null, status: null });
          setAssignmentFilter(null);
          setFilteredCustomerIds(new Set());
          setAssignedSalespersonFilter('');
          setAssignedTelecallerFilter('');
          setColumnFilters({
            customerId: '',
            customer: '',
            business: '',
            address: '',
            state: '',
            division: '',
            phone: '',
            email: '',
            gstNo: '',
            leadSource: '',
            productNames: '',
            category: '',
            followUpStatus: '',
            salesStatus: '',
            telecallerStatus: '',
            paymentStatus: '',
            createdAt: '',
            updatedAt: ''
          });
        }}
      />

      <LeadTable
        filteredLeads={uniqueFilteredLeads}
        tableLoading={tableLoading}
        hasStatusFilter={hasStatusFilter}
        visibleColumns={visibleColumns}
        isAllSelected={isAllSelected}
        selectedLeadIds={selectedLeadIds}
        isLeadAssigned={isLeadAssigned}
        isValueAssigned={isValueAssigned}
        getStatusBadge={getStatusBadge}
        toggleSelectAll={toggleSelectAll}
        toggleSelectOne={toggleSelectOne}
        onEdit={handleEdit}
        onViewTimeline={(lead) => {
          setTimelineLead(lead);
          setShowCustomerTimeline(true);
        }}
        onAssign={openAssignModal}
        showCustomerTimeline={showCustomerTimeline}
        setShowColumnFilter={setShowColumnFilter}
        allLeadsData={allLeadsData}
        assignedSalespersonFilter={assignedSalespersonFilter}
        assignedTelecallerFilter={assignedTelecallerFilter}
        onAssignedSalespersonFilterChange={setAssignedSalespersonFilter}
        onAssignedTelecallerFilterChange={setAssignedTelecallerFilter}
        usernames={usernames}
        columnFilters={columnFilters}
        onColumnFilterChange={(key, value) => setColumnFilters(prev => ({ ...prev, [key]: value }))}
        showColumnFilterRow={showColumnFilterRow}
        onToggleColumnFilterRow={() => setShowColumnFilterRow(prev => !prev)}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4 border-t border-gray-200 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Rows per page:</span>
          <select
            value={showAll ? 'all' : limit}
            onChange={(e) => {
              setPage(1);
              const value = e.target.value;
              if (value === 'all') {
                setShowAll(true);
                setLimit(50000); // Use max allowed by backend validation
              } else {
                setShowAll(false);
                setLimit(Number(value));
              }
            }}
            disabled={paginationDisabled}
            className={`border border-gray-300 rounded px-2 py-1 text-sm ${paginationDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value="all">All</option>
          </select>
          <span>{paginationSummary}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={paginationDisabled || page === 1 || showAll}
            className={`px-3 py-1 border rounded ${
              paginationDisabled || page === 1 || showAll
                ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            {paginationDisabled ? 'Filtered view' : showAll ? 'Showing all' : `Page ${page} of ${totalPages}`}
          </span>
          <button
            onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
            disabled={paginationDisabled || page >= totalPages || total === 0 || showAll}
            className={`px-3 py-1 border rounded ${
              paginationDisabled || page >= totalPages || total === 0 || showAll
                ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
      </div>
        </>
      )}

      {activeTab === 'lastCall' && (
        <>
          {/* Show skeleton loader on initial load */}
          {lastCallInitialLoading ? (
            <DashboardSkeleton />
          ) : (
            <>
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onImportClick={() => setShowImportPopup(true)}
                onAddCustomer={() => setShowAddCustomer(true)}
                onAssignSelected={() => {
                  setAssigningLead(null);
                  setAssignForm({ salesperson: '', telecaller: '' });
                  setShowAssignModal(true);
                }}
                onBulkDelete={handleBulkDelete}
                onExportExcel={handleExportToExcel}
                selectedCount={selectedLeadIds.length}
                onRefresh={() => fetchLastCallLeads(true)}
              />

              {/* Last Call Leads - Grouped by Date */}
              {groupedLastCallLeads.length > 0 ? (
            <div className="space-y-6">
              {groupedLastCallLeads.map((group) => {
                // Filter leads in this group by search term (on paginated data)
                const filteredGroupLeads = group.leads.filter(lead => {
                  if (!searchTerm) return true;
                  const searchLower = searchTerm.toLowerCase();
                  return (
                    (lead.customer || lead.name || '').toLowerCase().includes(searchLower) ||
                    (lead.email || '').toLowerCase().includes(searchLower) ||
                    (lead.business || '').toLowerCase().includes(searchLower) ||
                    (lead.phone || '').toLowerCase().includes(searchLower)
                  );
                });

                if (filteredGroupLeads.length === 0) return null;

                const dateDisplay = group.dateKey === 'No Date' 
                  ? 'No Date' 
                  : formatDateShort(group.dateKey);
                const dateFull = group.dateKey === 'No Date' 
                  ? 'No Date' 
                  : formatDateForGrouping(group.dateKey);
                
                return (
                  <div key={group.dateKey} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                              {dateDisplay}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600">{dateFull}</p>
                          </div>
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                          {filteredGroupLeads.length} call{filteredGroupLeads.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto -mx-3 sm:mx-0">
                      <LeadTable
                        filteredLeads={filteredGroupLeads}
                        tableLoading={lastCallLoading}
                        hasStatusFilter={false}
                        visibleColumns={visibleColumns}
                        isAllSelected={false}
                        selectedLeadIds={[]}
                        isLeadAssigned={isLeadAssigned}
                        isValueAssigned={isValueAssigned}
                        getStatusBadge={getStatusBadge}
                        toggleSelectAll={() => {}}
                        toggleSelectOne={() => {}}
                        onEdit={handleEdit}
                        onViewTimeline={(lead) => {
                          setTimelineLead(lead);
                          setShowCustomerTimeline(true);
                        }}
                        onAssign={openAssignModal}
                        showCustomerTimeline={showCustomerTimeline}
                        setShowColumnFilter={setShowColumnFilter}
                        allLeadsData={lastCallLeadsData}
                        assignedSalespersonFilter=""
                        assignedTelecallerFilter=""
                        onAssignedSalespersonFilterChange={() => {}}
                        onAssignedTelecallerFilterChange={() => {}}
                        usernames={usernames}
                        columnFilters={{}}
                        onColumnFilterChange={() => {}}
                        showColumnFilterRow={false}
                        onToggleColumnFilterRow={() => {}}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No last call data</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any last call activities at the moment.
              </p>
            </div>
          )}
          
          {/* Last Call Pagination */}
          {lastCallTotal > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4 border-t border-gray-200 bg-white rounded-lg shadow-sm mt-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                <span className="whitespace-nowrap">Rows per page:</span>
                <select
                  value={lastCallLimit}
                  onChange={(e) => {
                    setLastCallPage(1);
                    setLastCallLimit(Number(e.target.value));
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
                <span className="whitespace-nowrap">Showing {Math.min(((lastCallPage - 1) * lastCallLimit) + 1, lastCallTotal)} to {Math.min(lastCallPage * lastCallLimit, lastCallTotal)} of {lastCallTotal} calls</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                <button
                  onClick={() => setLastCallPage(1)}
                  disabled={lastCallPage === 1}
                  className="p-1.5 sm:p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  title="First page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLastCallPage(p => Math.max(1, p - 1))}
                  disabled={lastCallPage === 1}
                  className="p-1.5 sm:p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, Math.ceil(lastCallTotal / lastCallLimit)) }, (_, i) => {
                    let pageNum;
                    const totalPages = Math.ceil(lastCallTotal / lastCallLimit);
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (lastCallPage <= 3) {
                      pageNum = i + 1;
                    } else if (lastCallPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = lastCallPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setLastCallPage(pageNum)}
                        className={`px-3 py-1 text-sm rounded-md border ${
                          lastCallPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs sm:text-sm text-gray-600 px-1 sm:px-2 whitespace-nowrap">
                  Page {lastCallPage} of {Math.ceil(lastCallTotal / lastCallLimit) || 1}
                </span>
                <button
                  onClick={() => setLastCallPage(p => p < Math.ceil(lastCallTotal / lastCallLimit) ? p + 1 : p)}
                  disabled={lastCallPage >= Math.ceil(lastCallTotal / lastCallLimit)}
                  className="p-1.5 sm:p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLastCallPage(Math.ceil(lastCallTotal / lastCallLimit))}
                  disabled={lastCallPage >= Math.ceil(lastCallTotal / lastCallLimit)}
                  className="p-1.5 sm:p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  title="Last page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {showCustomerTimeline && timelineLead && (
            <div style={{ position: 'fixed', top: 0, right: 0, width: 'fit-content', maxWidth: '349px', minWidth: '244px', height: '100vh', zIndex: 50, marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0, borderLeft: '1px solid #e5e7eb' }}>
              <CustomerTimeline
                lead={timelineLead}
                onClose={() => {
                  setShowCustomerTimeline(false);
                  setTimelineLead(null);
                }}
                onReassign={(lead) => {
                  openAssignModal(lead);
                }}
                onQuotationView={(quotation) => {
                  if (quotation?.id) {
                    handleViewQuotation(quotation.id);
                  } else {
                    toastManager.error('Quotation data is missing');
                  }
                }}
                onApproveQuotation={(quotation) => {
                  if (quotation?.id) {
                    handleApproveQuotation(quotation.id);
                  }
                }}
                onRejectQuotation={(quotation) => {
                  if (quotation?.id) {
                    handleRejectQuotation(quotation.id);
                  }
                }}
                onPIView={(pi) => {
                  if (pi?.id) {
                    handleViewPI(pi.id);
                  }
                }}
                onApprovePI={(pi) => {
                  if (pi?.id) {
                    handleApprovePI(pi.id);
                  }
                }}
                onRejectPI={(pi) => {
                  if (pi?.id) {
                    handleRejectPI(pi.id);
                  }
                }}
              />
            </div>
          )}
            </>
          )}
        </>
      )}

      {activeTab === 'enquiry' && (
        <div className="space-y-4 sm:space-y-6 overflow-x-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Enquiries</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowEnquiryFilters(!showEnquiryFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showEnquiryFilters 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title="Toggle Filters"
              >
                <Filter className="w-4 h-4" />
              </button>
              <button
                onClick={handleExportEnquiries}
                disabled={filteredEnquiries.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={fetchEnquiries}
                disabled={enquiriesLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${enquiriesLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Filters - Collapsible */}
          {showEnquiryFilters && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Filter by Salesperson */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Salesperson</label>
                <select
                  value={enquiryFilters.salesperson}
                  onChange={(e) => setEnquiryFilters(prev => ({ ...prev, salesperson: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Salespersons</option>
                  {enquiryFilterOptions.salespersons.map(sp => (
                    <option key={sp} value={sp}>{sp}</option>
                  ))}
                </select>
              </div>

              {/* Filter by Telecaller */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Telecaller</label>
                <select
                  value={enquiryFilters.telecaller}
                  onChange={(e) => setEnquiryFilters(prev => ({ ...prev, telecaller: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Telecallers</option>
                  {enquiryFilterOptions.telecallers.map(tc => (
                    <option key={tc} value={tc}>{tc}</option>
                  ))}
                </select>
              </div>

              {/* Filter by State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by State</label>
                <select
                  value={enquiryFilters.state}
                  onChange={(e) => setEnquiryFilters(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All States</option>
                  {enquiryFilterOptions.states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* Filter by Division */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Division</label>
                <select
                  value={enquiryFilters.division}
                  onChange={(e) => setEnquiryFilters(prev => ({ ...prev, division: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Divisions</option>
                  {enquiryFilterOptions.divisions.map(div => (
                    <option key={div} value={div}>{div}</option>
                  ))}
                </select>
              </div>

              {/* Filter by Follow Up Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Follow Up Status</label>
                <select
                  value={enquiryFilters.follow_up_status}
                  onChange={(e) => setEnquiryFilters(prev => ({ ...prev, follow_up_status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Follow Up Statuses</option>
                  {enquiryFilterOptions.followUpStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Filter by Sales Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Sales Status</label>
                <select
                  value={enquiryFilters.sales_status}
                  onChange={(e) => setEnquiryFilters(prev => ({ ...prev, sales_status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sales Statuses</option>
                  {enquiryFilterOptions.salesStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Filter by Enquiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Enquiry Date</label>
                <input
                  type="date"
                  value={enquiryFilters.enquiry_date}
                  onChange={(e) => setEnquiryFilters(prev => ({ ...prev, enquiry_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => setEnquiryFilters({
                    salesperson: '',
                    telecaller: '',
                    state: '',
                    division: '',
                    follow_up_status: '',
                    sales_status: '',
                    enquiry_date: ''
                  })}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
          )}

          {enquiriesLoading && enquiryPage === 1 ? (
            <DashboardSkeleton />
          ) : (
            <>
              <EnquiryTable 
                enquiries={filteredEnquiries} 
                loading={enquiriesLoading}
                groupedByDate={filteredEnquiriesGroupedByDate}
                onRefresh={() => fetchEnquiries(true)}
                onEdit={handleEditEnquiry}
                onDelete={handleDeleteEnquiry}
                visibleColumns={enquiryVisibleColumns}
                onToggleColumnVisibility={() => setShowEnquiryColumnModal(true)}
              />
              
              {/* Enquiry Pagination */}
              {enquiryTotal > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4 border-t border-gray-200 bg-white rounded-lg shadow-sm mt-4">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                    <span>Rows per page:</span>
                    <select
                      value={enquiryLimit}
                      onChange={(e) => {
                        setEnquiryPage(1);
                        setEnquiryLimit(Number(e.target.value));
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                      <option value={200}>200</option>
                    </select>
                    <span className="whitespace-nowrap">Showing {Math.min(((enquiryPage - 1) * enquiryLimit) + 1, enquiryTotal)} to {Math.min(enquiryPage * enquiryLimit, enquiryTotal)} of {enquiryTotal} enquiries</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <button
                      onClick={() => setEnquiryPage(1)}
                      disabled={enquiryPage === 1}
                      className="p-1.5 sm:p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                      title="First page"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEnquiryPage(p => Math.max(1, p - 1))}
                      disabled={enquiryPage === 1}
                      className="p-1.5 sm:p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                      title="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, Math.ceil(enquiryTotal / enquiryLimit)) }, (_, i) => {
                        let pageNum;
                        const totalPages = Math.ceil(enquiryTotal / enquiryLimit);
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (enquiryPage <= 3) {
                          pageNum = i + 1;
                        } else if (enquiryPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = enquiryPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setEnquiryPage(pageNum)}
                            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md border ${
                              enquiryPage === pageNum
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 px-1 sm:px-2 whitespace-nowrap">
                      Page {enquiryPage} of {Math.ceil(enquiryTotal / enquiryLimit) || 1}
                    </span>
                    <button
                      onClick={() => setEnquiryPage(p => p < Math.ceil(enquiryTotal / enquiryLimit) ? p + 1 : p)}
                      disabled={enquiryPage >= Math.ceil(enquiryTotal / enquiryLimit)}
                      className="p-1.5 sm:p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                      title="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEnquiryPage(Math.ceil(enquiryTotal / enquiryLimit))}
                      disabled={enquiryPage >= Math.ceil(enquiryTotal / enquiryLimit)}
                      className="p-1.5 sm:p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                      title="Last page"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Column Visibility Modal */}
          {showEnquiryColumnModal && (
            <ColumnFilterModal
              isOpen={showEnquiryColumnModal}
              onClose={() => setShowEnquiryColumnModal(false)}
              visibleColumns={enquiryVisibleColumns}
              onToggleColumn={toggleEnquiryColumn}
              onResetColumns={resetEnquiryColumns}
              onShowAllColumns={showAllEnquiryColumns}
              columnLabels={{
                customer_name: 'Customer Name',
                business: 'Business',
                state: 'State',
                division: 'Division',
                address: 'Address',
                enquired_product: 'Enquired Product',
                product_quantity: 'Quantity',
                product_remark: 'Product Remark',
                follow_up_status: 'Follow Up Status',
                follow_up_remark: 'Follow Up Remark',
                sales_status: 'Sales Status',
                sales_status_remark: 'Sales Status Remark',
                salesperson: 'Salesperson',
                telecaller: 'Telecaller',
                enquiry_date: 'Enquiry Date'
              }}
            />
          )}
        </div>
      )}

      <ColumnFilterModal
        isOpen={showColumnFilter}
        onClose={() => setShowColumnFilter(false)}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
        onResetColumns={resetColumns}
        onShowAllColumns={showAllColumns}
      />

      <input
        ref={importFileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      <ImportCSVModal
        isOpen={showImportPopup}
        onClose={() => setShowImportPopup(false)}
        onDownloadTemplate={downloadCSVTemplate}
        onFileSelect={handleFileUpload}
        fileInputRef={importFileInputRef}
      />

      <LeadPreviewDrawer
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        previewLead={previewLead}
        loadingQuotations={loadingQuotations}
        quotations={quotations}
        proformaInvoices={proformaInvoices}
        isValueAssigned={isValueAssigned}
        onViewQuotation={handleViewQuotation}
        onDownloadPDF={handleDownloadPDF}
        onApproveQuotation={handleApproveQuotation}
        onRejectQuotation={handleRejectQuotation}
        onViewPI={handleViewPI}
        onApprovePI={handleApprovePI}
        onRejectPI={handleRejectPI}
      />

      <ImportPreviewModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        importPreview={importPreview}
        importing={importing}
        onImport={handleImportLeads}
      />

      {showAddCustomer && (
        <AddCustomerModal
          onClose={() => setShowAddCustomer(false)}
          onSave={handleCustomerSave}
        />
      )}

      <EditLeadModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        editFormData={editFormData}
        onFormChange={setEditFormData}
        onSave={handleSaveEdit}
        usernames={usernames}
        loadingUsers={loadingUsers}
        usersError={usersError}
      />

      <AssignLeadModal
        isOpen={showAssignModal && (assigningLead || selectedLeadIds.length > 0)}
        onClose={() => setShowAssignModal(false)}
        assigningLead={assigningLead}
        selectedLeadIds={selectedLeadIds}
        assignForm={assignForm}
        onFormChange={setAssignForm}
        onAssign={async () => {
          try {
            if (assigningLead) {
              const leadId = assigningLead.id;
              // Preserve existing status fields during reassignment
              const payload = {
                assignedSalesperson: assignForm.salesperson || null,
                assignedTelecaller: assignForm.telecaller || null,
                // Preserve status fields
                salesStatus: assigningLead.salesStatus || assigningLead.sales_status || '',
                followUpStatus: assigningLead.followUpStatus || assigningLead.follow_up_status || '',
                salesStatusRemark: assigningLead.salesStatusRemark || assigningLead.sales_status_remark || '',
                followUpRemark: assigningLead.followUpRemark || assigningLead.follow_up_remark || '',
              };
              await leadService.updateLead(leadId, payload);
              setLeadsData(prev => {
                const updated = [];
                for (let i = 0; i < prev.length; i++) {
                  const l = prev[i];
                  if (l.id === leadId) {
                    updated.push({
                      ...l,
                      assignedSalesperson: payload.assignedSalesperson || '',
                      assignedTelecaller: payload.assignedTelecaller || '',
                      // Preserve status
                      salesStatus: payload.salesStatus,
                      followUpStatus: payload.followUpStatus,
                    });
                  } else {
                    updated.push(l);
                  }
                }
                return updated;
              });
              toastManager.success('Lead reassigned successfully');
              setAssigningLead(null);
            } else {
              // For bulk reassign, preserve status from each lead
              const selectedLeads = leadsData.filter(l => selectedLeadIds.includes(l.id));
              const basePayload = {
                assignedSalesperson: assignForm.salesperson || null,
                assignedTelecaller: assignForm.telecaller || null,
              };
              
              // Update each lead individually to preserve status
              const updatePromises = selectedLeads.map(lead => {
                const payload = {
                  ...basePayload,
                  // Preserve status for each lead
                  salesStatus: lead.salesStatus || lead.sales_status || '',
                  followUpStatus: lead.followUpStatus || lead.follow_up_status || '',
                  salesStatusRemark: lead.salesStatusRemark || lead.sales_status_remark || '',
                  followUpRemark: lead.followUpRemark || lead.follow_up_remark || '',
                };
                return leadService.updateLead(lead.id, payload);
              });
              
              await Promise.all(updatePromises);
              
              const selectedSet = new Set(selectedLeadIds);
              setLeadsData(prev => {
                return prev.map(l => {
                  if (selectedSet.has(l.id)) {
                    const lead = selectedLeads.find(sl => sl.id === l.id);
                    return {
                      ...l,
                      assignedSalesperson: basePayload.assignedSalesperson || '',
                      assignedTelecaller: basePayload.assignedTelecaller || '',
                      // Preserve status
                      salesStatus: lead?.salesStatus || lead?.sales_status || l.salesStatus || l.sales_status || '',
                      followUpStatus: lead?.followUpStatus || lead?.follow_up_status || l.followUpStatus || l.follow_up_status || '',
                    };
                  }
                  return l;
                });
              });
              toastManager.success(`Reassigned ${selectedLeadIds.length} leads successfully`);
              setSelectedLeadIds([]);
              setIsAllSelected(false);
            }
            try {
              const response = await leadService.fetchLeads(buildLeadFetchParams());
              applyLeadResponse(response, { refreshAll: true });
            } catch (e) {}
            setShowAssignModal(false);
          } catch (err) {
            apiErrorHandler.handleError(err, 'assign lead');
          }
        }}
        usernames={usernames}
        loadingUsers={loadingUsers}
        usersError={usersError}
      />

      {showQuotationModal && selectedQuotation && (
        <QuotationPreview
          quotationData={selectedQuotation}
          companyBranches={COMPANY_BRANCHES}
          user={DEFAULT_USER}
          onClose={() => setShowQuotationModal(false)}
        />
      )}

      {showPIPreview && piPreviewData && (
        <PIPreview
          piData={piPreviewData}
          companyBranches={COMPANY_BRANCHES}
          user={DEFAULT_USER}
          onClose={() => {
            setShowPIPreview(false);
            setPiPreviewData(null);
          }}
        />
      )}

      {showCustomerTimeline && timelineLead && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: 'fit-content', maxWidth: '349px', minWidth: '244px', height: '100vh', zIndex: 50, marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0, borderLeft: '1px solid #e5e7eb' }}>
          <CustomerTimeline
            lead={timelineLead}
            onClose={() => {
              setShowCustomerTimeline(false);
              setTimelineLead(null);
            }}
            onReassign={(lead) => {
              openAssignModal(lead);
            }}
            onQuotationView={(quotation) => {
              if (quotation?.id) {
                handleViewQuotation(quotation.id);
              } else {
                toastManager.error('Quotation data is missing');
              }
            }}
            onApproveQuotation={(quotation) => {
              if (quotation?.id) {
                handleApproveQuotation(quotation.id);
              }
            }}
            onRejectQuotation={(quotation) => {
              if (quotation?.id) {
                handleRejectQuotation(quotation.id);
              }
            }}
            onPIView={(pi) => {
              if (pi?.id) {
                handleViewPI(pi.id);
              }
            }}
            onApprovePI={(pi) => {
              if (pi?.id) {
                handleApprovePI(pi.id);
              }
            }}
            onRejectPI={(pi) => {
              if (pi?.id) {
                handleRejectPI(pi.id);
              }
            }}
          />
        </div>
      )}

    </div>
  );
};

export default LeadsSimplified;
