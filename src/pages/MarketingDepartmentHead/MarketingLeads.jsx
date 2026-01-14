import React, { useState, useEffect, useRef, useMemo } from 'react';
import AddCustomerModal from '../SalesDepartmentHead/AddCustomerModal';
import QuotationPreviewModal from '../../components/QuotationPreviewModal';
import PIPreviewModal from '../salesperson/PIPreviewModal';
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
import { LeadsFilterService } from '../../services/LeadsFilterService';
import LeadService from '../../services/LeadService';
import UserService from '../../services/UserService';
import PIService from '../../services/PIService';
import QuotationService from '../../services/QuotationService';
import { generateQuotationPDF } from '../../utils/pdfUtils';
import { downloadCSVTemplate, parseCSV, formatDate as formatDateUtil } from '../../utils/csvUtils';
import { getStatusBadge as getStatusBadgeUtil } from '../../utils/statusUtils';
import { calculateAssignedCounts, getUnassignedLeadIds, filterLeads } from '../../utils/leadFilters';
import { COMPANY_BRANCHES, DEFAULT_USER, DEFAULT_BRANCH } from '../../config/appConfig';

const MarketingLeads = () => {
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [importFile, setImportFile] = useState(null);
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
  const [selectedPIBranch, setSelectedPIBranch] = useState(DEFAULT_BRANCH);

  const importFileInputRef = useRef(null);

  const leadService = useMemo(() => new LeadService(), []);
  const userService = useMemo(() => new UserService(), []);
  const piService = useMemo(() => new PIService(), []);
  const quotationServiceInstance = useMemo(() => new QuotationService(), []);
  const leadsFilterService = useMemo(() => new LeadsFilterService(apiClient), []);

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

  const handleRejectQuotation = async (quotationId) => {
    const previewLeadId = previewLead?.id || null;
    const updatedQuotations = await quotationServiceInstance.rejectQuotation(quotationId, previewLeadId);
    if (updatedQuotations.length > 0) {
      setQuotations(updatedQuotations);
    }
  };

  const handleViewQuotation = async (quotationId) => {
    const quotation = await quotationServiceInstance.getQuotation(quotationId);
    if (quotation) {
      setSelectedQuotation(quotation);
      setShowQuotationModal(true);
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
      setImportFile(file);
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

    setImporting(true);

    try {
      const validationErrors = [];
      const leadsPayload = importPreview.map((row, index) => {
        const payload = leadService.buildCSVLeadPayload(row, index, validationErrors);
        // Date is already handled in buildCSVLeadPayload, but ensure it's formatted correctly
        const dateField = row['Date (DD/MM/YYYY or YYYY-MM-DD)'] || row['Date (YYYY-MM-DD)'] || row['Date'] || '';
        if (dateField) {
          payload.date = formatDateUtil(dateField);
        }
        return payload;
      });
      
      if (validationErrors.length > 0) {
        console.warn('CSV Import Validation Warnings:', validationErrors);
        const errorMsg = validationErrors.slice(0, 3).join('; ') + 
          (validationErrors.length > 3 ? ` and ${validationErrors.length - 3} more...` : '');
        toastManager.error(`Validation issues found: ${errorMsg}`);
      }

      const importResponse = await leadService.importLeads(leadsPayload);
      console.log('Import response:', importResponse);

      // Notify that meetings may have been created during import
      try { 
        window.dispatchEvent(new CustomEvent('marketingMeetingsUpdated')); 
        // Also dispatch after a delay to ensure backend has processed
        setTimeout(() => window.dispatchEvent(new CustomEvent('marketingMeetingsUpdated')), 1000);
      } catch (e) {
        console.error('Error dispatching meeting update event:', e);
      }

      const response = await leadService.fetchLeads({ page, limit });
      if (response.data) {
        setLeadsData(response.data);
        if (response.pagination) {
          setTotal(Number(response.pagination.total) || 0);
        }
        requestAllLeadsRefresh();
      }
      
      setShowImportModal(false);
      setImportPreview([]);
      setImportFile(null);
      if (importFileInputRef.current) {
        importFileInputRef.current.value = '';
      }
      } catch (error) {
      apiErrorHandler.handleError(error, 'import leads');
    } finally {
      setImporting(false);
    }
  };

  const requestAllLeadsRefresh = () => {
    setAllLeadsRefreshKey((prev) => prev + 1);
  };

  const handleDeleteSelected = async () => {
    if (selectedLeadIds.length === 0) {
      toastManager.error('Please select leads to delete');
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedLeadIds.length} lead(s)? This action cannot be undone and will also remove these leads from salesperson's lead lists.`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      
      // Delete leads one by one to ensure proper cleanup
      const deletePromises = selectedLeadIds.map(id => leadService.deleteLead(id));
      await Promise.all(deletePromises);

      // Remove deleted leads from local state
      const deletedSet = new Set(selectedLeadIds);
      setLeadsData(prev => prev.filter(lead => !deletedSet.has(lead.id)));
      setAllLeadsData(prev => prev.filter(lead => !deletedSet.has(lead.id)));
      
      // Clear selection
      const deletedCount = selectedLeadIds.length;
      setSelectedLeadIds([]);
      setIsAllSelected(false);
      
      // Refresh the leads list
      await fetchLeads();
      requestAllLeadsRefresh();
      
      toastManager.success(`Successfully deleted ${deletedCount} lead(s)`);
    } catch (error) {
      apiErrorHandler.handleError(error, 'delete leads');
      toastManager.error('Failed to delete some leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const buildLeadFetchParams = () => {
    const params = { page, limit };
    const trimmedSearch = searchTerm.trim();
    if (trimmedSearch) {
      params.search = trimmedSearch;
    }
    return params;
  };

  const applyLeadResponse = (response, { refreshAll = false } = {}) => {
    if (!response?.data) return;
    setLeadsData(response.data);
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

    const fetchPromise = (async () => {
      setLoadingAllLeads(true);
      try {
        const transformed = await leadService.fetchAllLeads();
        setAllLeadsData(transformed);
        allLeadsDataRef.current = transformed;
        return transformed;
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

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await leadService.fetchLeads(buildLeadFetchParams());
      applyLeadResponse(response);
    } catch (error) {
      apiErrorHandler.handleError(error, 'fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = () => {
    fetchLeads();
    requestAllLeadsRefresh();
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
    fetchLeads();
    fetchQuotationAndPICounts();
  }, [page, limit, searchTerm]);

  useEffect(() => {
    loadAllLeadsForFilters(true).catch(() => {});
  }, [allLeadsRefreshKey]);

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
    // Return false for any value that indicates unassigned
    return s !== 'unassigned' && s !== 'n/a' && s !== 'na' && s !== '-' && s !== 'assigned' && s !== '';
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
  const activeLeadPool = hasStatusFilter 
    ? (allLeadsDataRef.current.length > 0 ? allLeadsDataRef.current : allLeadsData.length > 0 ? allLeadsData : []) 
    : leadsData;

  const filteredLeads = useMemo(
    () =>
      filterLeads(
        activeLeadPool,
        searchTerm,
        assignmentFilter,
        statusFilter,
        filteredCustomerIds,
        isLeadAssigned
      ),
    [activeLeadPool, searchTerm, assignmentFilter, statusFilter, filteredCustomerIds, isLeadAssigned]
  );

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

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedLeadIds([]);
      setIsAllSelected(false);
      return;
    }
    const allVisibleLeadIds = uniqueFilteredLeads.map(l => l.id).filter(id => id != null);
    setSelectedLeadIds([...allVisibleLeadIds]);
    setIsAllSelected(allVisibleLeadIds.length > 0);
  };

  const toggleSelectOne = (id) => {
    setSelectedLeadIds((prev) => {
      const prevSet = new Set(prev);
      if (prevSet.has(id)) {
        prevSet.delete(id);
        } else {
        prevSet.add(id);
      }
      const next = Array.from(prevSet);
      setIsAllSelected(next.length > 0 && next.length === uniqueFilteredLeads.length);
      return next;
    });
  };

  const tableLoading = loading || (hasStatusFilter && loadingAllLeads && allLeadsData.length === 0);
  const paginationDisabled = hasStatusFilter;
  const totalPages = Math.max(1, Math.ceil(total / limit) || 1);
  const pageStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const pageEnd = total === 0 ? 0 : Math.min(page * limit, total);
  const paginationSummary = paginationDisabled
    ? `${uniqueFilteredLeads.length} matching lead${uniqueFilteredLeads.length === 1 ? '' : 's'}`
    : `${pageStart} - ${pageEnd} of ${total}`;
  
  const { assignedCount, unassignedCount } = useMemo(
    () => calculateAssignedCounts(leadsData, isLeadAssigned),
    [leadsData, isLeadAssigned]
  );

  const handleBadgeClick = async (type, status) => {
    if (statusFilter.type === type && statusFilter.status === status) {
      setStatusFilter({ type: null, status: null });
      setFilteredCustomerIds(new Set());
      return;
    }

    try {
      setStatusFilter({ type, status });
      
      const [loadedLeads, countsResult] = await Promise.all([
        loadAllLeadsForFilters(true),
        fetchQuotationAndPICounts()
      ]);
      
      let customerIds = new Set();
      if (type === 'pi') {
        const relevantPIs = countsResult?.filteredPIs[status] || [];
        if (relevantPIs.length > 0) {
          customerIds = await leadsFilterService.extractCustomerIdsFromPIs(relevantPIs);
        }
      } else if (type === 'quotation') {
        const relevantQuotations = countsResult?.filteredQuotations[status] || [];
        if (relevantQuotations.length > 0) {
          customerIds = await leadsFilterService.extractCustomerIdsFromQuotations(relevantQuotations);
        }
      }
      
      setFilteredCustomerIds(customerIds);
    } catch (err) {
      toastManager.error('Failed to load leads for filtering');
      setStatusFilter({ type: null, status: null });
    }
  };

  const handleCustomerSave = async (customerData) => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!customerData.customerName || !customerData.mobileNumber) {
        toastManager.error('Customer Name and Mobile Number are required');
        throw new Error('Customer Name and Mobile Number are required');
      }
      
      // Validate phone number format (10 digits, starting with 6-9)
      const phoneDigits = String(customerData.mobileNumber).replace(/\D/g, '');
      const cleanPhone = phoneDigits.slice(-10);
      if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
        toastManager.error('Please provide a valid 10-digit Indian mobile number (starting with 6-9)');
        throw new Error('Invalid mobile number format');
      }
      
      // Validate whatsapp if provided
      if (customerData.whatsappNumber) {
        const whatsappDigits = String(customerData.whatsappNumber).replace(/\D/g, '');
        const cleanWhatsapp = whatsappDigits.slice(-10);
        if (cleanWhatsapp.length !== 10 || !/^[6-9]/.test(cleanWhatsapp)) {
          toastManager.error('Please provide a valid 10-digit Indian WhatsApp number (starting with 6-9)');
          throw new Error('Invalid WhatsApp number format');
        }
      }
      
      const newCustomer = leadService.buildLeadPayload(customerData);
      console.log('Creating lead with payload:', newCustomer);
      
      const transformedLead = await leadService.createLead(newCustomer);
      console.log('Lead creation response:', transformedLead);
      
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
    } else {
        const errorMsg = 'Failed to create customer. Server returned no data.';
        toastManager.error(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      // Don't show error again if we already showed a specific validation error
      if (!error.message.includes('Invalid') && !error.message.includes('required')) {
        // Check if it's a validation error from backend
        if (error.data?.errors && Array.isArray(error.data.errors)) {
          const validationErrors = error.data.errors.map(e => e.msg || e.message).join(', ');
          toastManager.error(`Validation failed: ${validationErrors}`);
        } else {
          const errorMessage = error.data?.message || error.data?.error || error.message || 'Failed to create customer. Please check the console for details.';
          toastManager.error(`Failed to add lead: ${errorMessage}`);
        }
        console.error('Full error details:', {
          message: error.message,
          data: error.data,
          status: error.status
        });
      }
      apiErrorHandler.handleError(error, 'create customer');
      // Re-throw error so modal stays open
      throw error;
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
      const billTo = piService.buildBillTo(completeQuotation, pi);
      const previewData = piService.buildPIPreviewData(
        pi, 
        completeQuotation, 
        mappedItems, 
        totals, 
        finalTotal, 
        advancePayment, 
        originalQuotationTotal, 
        billTo
      );

      setPiPreviewData({
        data: previewData,
        selectedBranch: completeQuotation.branch || DEFAULT_BRANCH
      });
      setSelectedPIBranch(completeQuotation.branch || DEFAULT_BRANCH);
      setShowPIPreview(true);
    } catch (error) {
      console.error('Error viewing PI:', error);
      toastManager.error('Failed to load PI details');
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setEditFormData({
      customer: lead.customer || '',
      email: lead.email || '',
      business: lead.business || '',
      address: lead.address || '',
      state: lead.state || '',
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

  return (
    <div
      className={`space-y-6 transition-all duration-300 ${showCustomerTimeline ? 'pl-6' : 'p-6'}`}
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
        onDeleteSelected={handleDeleteSelected}
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
        onAssignmentFilter={setAssignmentFilter}
        onClearFilter={() => {
          setStatusFilter({ type: null, status: null });
          setAssignmentFilter(null);
          setFilteredCustomerIds(new Set());
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
      />

      <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Rows per page:</span>
                <select
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value));
            }}
            disabled={paginationDisabled}
            className={`border border-gray-300 rounded px-2 py-1 text-sm ${paginationDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
                </select>
          <span>{paginationSummary}</span>
              </div>
        <div className="flex items-center space-x-2">
                <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={paginationDisabled || page === 1}
            className={`px-3 py-1 border rounded ${
              paginationDisabled || page === 1
                ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Prev
                </button>
          <span className="text-sm text-gray-600">
            {paginationDisabled ? 'Filtered view' : `Page ${page} of ${totalPages}`}
          </span>
                <button
            onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
            disabled={paginationDisabled || page >= totalPages || total === 0}
            className={`px-3 py-1 border rounded ${
              paginationDisabled || page >= totalPages || total === 0
                ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Next
                </button>
              </div>
                      </div>

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
              const payload = {
                assignedSalesperson: assignForm.salesperson || null,
                assignedTelecaller: assignForm.telecaller || null,
                salesStatus: assigningLead.salesStatus || assigningLead.sales_status || '',
                followUpStatus: assigningLead.followUpStatus || assigningLead.follow_up_status || '',
                salesStatusRemark: assigningLead.salesStatusRemark || assigningLead.sales_status_remark || '',
                followUpRemark: assigningLead.followUpRemark || assigningLead.follow_up_remark || '',
              };
              await leadService.updateLead(leadId, payload);
              
              // Create meeting if assigned to a salesperson
              if (assignForm.salesperson) {
                try {
                  const leadAddress = assigningLead.address || assigningLead.location || 'Address not provided';
                  const meetingDate = new Date().toISOString().split('T')[0]; // Default to today
                  
                  const meetingData = {
                    customer_name: assigningLead.customer || assigningLead.name || 'N/A',
                    customer_phone: assigningLead.phone || assigningLead.phone_number || '',
                    customer_email: assigningLead.email || '',
                    address: leadAddress,
                    city: assigningLead.city || '',
                    state: assigningLead.state || '',
                    pincode: assigningLead.pincode || '',
                    assigned_to: assignForm.salesperson,
                    meeting_date: meetingDate,
                    meeting_time: '',
                    scheduled_date: meetingDate,
                    status: 'Scheduled',
                    notes: `Assigned from lead: ${leadId}`,
                    customer_id: leadId,
                    lead_id: leadId
                  };
                  
                  console.log('Creating meeting with data:', {
                    customer_name: meetingData.customer_name,
                    assigned_to: meetingData.assigned_to,
                    lead_id: meetingData.lead_id,
                    customer_id: meetingData.customer_id
                  });
                  
                  const meetingResponse = await apiClient.post(API_ENDPOINTS.MARKETING_MEETINGS_CREATE(), meetingData);
                  console.log('Meeting created successfully:', meetingResponse);
                  
                  if (!meetingResponse || !meetingResponse.success) {
                    console.error('Meeting creation failed:', meetingResponse);
                    toastManager.error(`Failed to create meeting: ${meetingResponse?.message || 'Unknown error'}`);
                  }
                  
                  // Notify other components to refresh
                  try { 
                    window.dispatchEvent(new CustomEvent('marketingMeetingsUpdated')); 
                    // Also dispatch after delays to ensure backend has processed
                    setTimeout(() => window.dispatchEvent(new CustomEvent('marketingMeetingsUpdated')), 500);
                    setTimeout(() => window.dispatchEvent(new CustomEvent('marketingMeetingsUpdated')), 2000);
                  } catch (e) {
                    console.error('Error dispatching meeting update event:', e);
                  }
                } catch (meetingError) {
                  console.error('Error creating meeting for assigned lead:', meetingError);
                  console.error('Meeting error details:', {
                    message: meetingError.message,
                    data: meetingError.data,
                    status: meetingError.status
                  });
                  // Show error to user but don't block assignment
                  toastManager.error(`Meeting creation failed: ${meetingError.message || 'Unknown error'}`);
                }
              }
              
              setLeadsData(prev => {
                const updated = [];
                for (let i = 0; i < prev.length; i++) {
                  const l = prev[i];
                  if (l.id === leadId) {
                    updated.push({
                      ...l,
                      assignedSalesperson: payload.assignedSalesperson || '',
                      assignedTelecaller: payload.assignedTelecaller || '',
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
              const selectedLeads = leadsData.filter(l => selectedLeadIds.includes(l.id));
              const basePayload = {
                assignedSalesperson: assignForm.salesperson || null,
                assignedTelecaller: assignForm.telecaller || null,
              };
              
              const updatePromises = selectedLeads.map(lead => {
                const payload = {
                  ...basePayload,
                  salesStatus: lead.salesStatus || lead.sales_status || '',
                  followUpStatus: lead.followUpStatus || lead.follow_up_status || '',
                  salesStatusRemark: lead.salesStatusRemark || lead.sales_status_remark || '',
                  followUpRemark: lead.followUpRemark || lead.follow_up_remark || '',
                };
                return leadService.updateLead(lead.id, payload);
              });
              
              await Promise.all(updatePromises);
              
              // Create meetings for all leads assigned to salesperson
              if (assignForm.salesperson) {
                const meetingDate = new Date().toISOString().split('T')[0]; // Default to today
                const meetingPromises = selectedLeads.map(async (lead) => {
                  try {
                    const leadAddress = lead.address || lead.location || 'Address not provided';
                    const meetingData = {
                      customer_name: lead.customer || lead.name || 'N/A',
                      customer_phone: lead.phone || lead.phone_number || '',
                      customer_email: lead.email || '',
                      address: leadAddress,
                      city: lead.city || '',
                      state: lead.state || '',
                      pincode: lead.pincode || '',
                      assigned_to: assignForm.salesperson,
                      meeting_date: meetingDate,
                      meeting_time: '',
                      scheduled_date: meetingDate,
                      status: 'Scheduled',
                      notes: `Assigned from lead: ${lead.id}`,
                      customer_id: lead.id,
                      lead_id: lead.id
                    };
                    const meetingResponse = await apiClient.post(API_ENDPOINTS.MARKETING_MEETINGS_CREATE(), meetingData);
                    console.log(`Meeting created for lead ${lead.id}:`, meetingResponse);
                  } catch (meetingError) {
                    console.error(`Error creating meeting for lead ${lead.id}:`, meetingError);
                    console.error('Meeting error details:', {
                      leadId: lead.id,
                      message: meetingError.message,
                      data: meetingError.data,
                      status: meetingError.status
                    });
                    // Don't block assignment if meeting creation fails, but log it
                  }
                });
                await Promise.all(meetingPromises);
                // Notify other components to refresh
                try { 
                  window.dispatchEvent(new CustomEvent('marketingMeetingsUpdated')); 
                  // Also dispatch after a delay to ensure backend has processed
                  setTimeout(() => window.dispatchEvent(new CustomEvent('marketingMeetingsUpdated')), 500);
                } catch (e) {
                  console.error('Error dispatching meeting update event:', e);
                }
              }
              
              const selectedSet = new Set(selectedLeadIds);
              setLeadsData(prev => {
                return prev.map(l => {
                  if (selectedSet.has(l.id)) {
                    const lead = selectedLeads.find(sl => sl.id === l.id);
                    return {
                      ...l,
                      assignedSalesperson: basePayload.assignedSalesperson || '',
                      assignedTelecaller: basePayload.assignedTelecaller || '',
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

      <QuotationPreviewModal
        isOpen={showQuotationModal}
        onClose={() => setShowQuotationModal(false)}
        quotationData={selectedQuotation ? {
          quotationNumber: selectedQuotation.quotation_number,
          quotationDate: selectedQuotation.quotation_date,
          validUpto: selectedQuotation.valid_until,
          voucherNumber: `VOUCH-${Math.floor(1000 + Math.random() * 9000)}`,
          billTo: {
            business: selectedQuotation.customer_name,
            address: selectedQuotation.customer_address,
            phone: selectedQuotation.customer_phone,
            gstNo: selectedQuotation.customer_gst_no,
            state: selectedQuotation.customer_state
          },
          items: selectedQuotation.items?.map(item => ({
            productName: item.product_name,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit || 'Nos',
            buyerRate: item.unit_price,
            unitPrice: item.unit_price,
            amount: item.taxable_amount,
            total: item.total_amount,
            hsn: item.hsn_code,
            gstRate: item.gst_rate
          })),
          subtotal: parseFloat(selectedQuotation.subtotal),
          taxAmount: parseFloat(selectedQuotation.tax_amount),
          total: parseFloat(selectedQuotation.total_amount),
          selectedBranch: DEFAULT_BRANCH
        } : null}
        companyBranches={COMPANY_BRANCHES}
        user={DEFAULT_USER}
        onDownloadPDF={selectedQuotation ? () => handleDownloadPDF(selectedQuotation.id) : null}
      />

      <PIPreviewModal
        open={showPIPreview}
        onClose={() => {
          setShowPIPreview(false);
          setPiPreviewData(null);
        }}
        piPreviewData={piPreviewData}
        selectedBranch={selectedPIBranch}
        companyBranches={COMPANY_BRANCHES}
        approvedQuotationId={null}
        viewingCustomerId={null}
        onPICreated={null}
      />

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
              if (quotation) {
                setSelectedQuotation(quotation);
                setShowQuotationModal(true);
              } else {
                toastManager.error('Quotation data is missing');
              }
            }}
            onPIView={(pi) => {
              setPiPreviewData(pi);
              setShowPIPreview(true);
            }}
            setSelectedQuotation={setSelectedQuotation}
            setShowQuotationModal={setShowQuotationModal}
            toastManager={toastManager}
          />
        </div>
      )}

    </div>
  );
};

export default MarketingLeads;
