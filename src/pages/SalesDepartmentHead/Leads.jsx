import React, { useState, useEffect, useRef, useMemo } from 'react';
import AddCustomerModal from './AddCustomerModal';
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

const LeadsSimplified = () => {
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
        payload.date = formatDateUtil(row['Date (YYYY-MM-DD)']);
        return payload;
      });
      
      if (validationErrors.length > 0) {
        console.warn('CSV Import Validation Warnings:', validationErrors);
        const errorMsg = validationErrors.slice(0, 3).join('; ') + 
          (validationErrors.length > 3 ? ` and ${validationErrors.length - 3} more...` : '');
        toastManager.error(`Validation issues found: ${errorMsg}`);
      }

      await leadService.importLeads(leadsPayload);

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
    // Select all visible leads (including assigned ones for reassignment)
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
      // Check if all visible leads are selected (including assigned ones)
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

  // Handle edit
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

export default LeadsSimplified;
