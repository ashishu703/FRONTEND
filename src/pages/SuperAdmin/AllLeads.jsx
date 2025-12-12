import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Search, Filter, RefreshCw, Eye, X } from 'lucide-react';
import LeadTable from '../../components/LeadTable';
import CustomerTimeline from '../../components/CustomerTimeline';
import ColumnFilterModal from '../../components/ColumnFilterModal';
import departmentHeadService from '../../api/admin_api/departmentHeadService';
import LeadService from '../../services/LeadService';
import { getStatusBadge as getStatusBadgeUtil } from '../../utils/statusUtils';
import { useAuth } from '../../hooks/useAuth';

const AllLeads = () => {
  const { user } = useAuth();
  const [leadsData, setLeadsData] = useState([]);
  const [allLeadsData, setAllLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showColumnFilter, setShowColumnFilter] = useState(false);
  const [showColumnFilterRow, setShowColumnFilterRow] = useState(false);
  const [showCustomerTimeline, setShowCustomerTimeline] = useState(false);
  const [timelineLead, setTimelineLead] = useState(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [assignedSalespersonFilter, setAssignedSalespersonFilter] = useState('');
  const [assignedTelecallerFilter, setAssignedTelecallerFilter] = useState('');
  
  const [columnFilters, setColumnFilters] = useState({
    customerId: '',
    customer: '',
    business: '',
    address: '',
    state: '',
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

  const searchTimeoutRef = useRef(null);
  const leadService = useMemo(() => new LeadService(), []);

  // Debounce search term
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 500);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // Fetch leads from all departments and companies (SUPERADMIN)
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = {
        page,
        limit,
        departmentType: 'office_sales', // Only fetch Sales Department (office_sales) leads
      };
      
      if (debouncedSearchTerm.trim()) {
        params.search = debouncedSearchTerm.trim();
      }
      
      // Add column filter params
      if (columnFilters.state) params.state = columnFilters.state;
      if (columnFilters.leadSource) params.leadSource = columnFilters.leadSource;
      if (columnFilters.salesStatus) params.salesStatus = columnFilters.salesStatus;
      if (columnFilters.followUpStatus) params.followUpStatus = columnFilters.followUpStatus;
      
      // SUPERADMIN: Filter by office_sales department only
      const response = await departmentHeadService.getAllLeads(params);
      
      // Handle different response structures
      let leadsData = [];
      if (Array.isArray(response)) {
        leadsData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        leadsData = response.data;
      } else if (response?.leads && Array.isArray(response.leads)) {
        leadsData = response.leads;
      }
      
      console.log('[AllLeads] Raw API response:', {
        responseType: Array.isArray(response) ? 'array' : typeof response,
        responseKeys: response && typeof response === 'object' ? Object.keys(response) : [],
        leadsDataLength: leadsData.length,
        paginationTotal: response?.pagination?.total,
        statsTotal: response?.stats?.total
      });
      
      // Remove duplicates based on lead ID
      const uniqueLeadsMap = new Map();
      const duplicateIds = [];
      leadsData.forEach(lead => {
        if (lead && lead.id != null) {
          // Use ID as key to prevent duplicates
          if (!uniqueLeadsMap.has(lead.id)) {
            uniqueLeadsMap.set(lead.id, lead);
          } else {
            duplicateIds.push(lead.id);
          }
        }
      });
      const uniqueLeadsData = Array.from(uniqueLeadsMap.values());
      
      if (duplicateIds.length > 0) {
        console.log('[AllLeads] Found duplicate lead IDs:', duplicateIds);
      }
      
      // Transform API data using LeadService
      const transformedLeads = leadService.transformApiData(uniqueLeadsData)
        .filter(lead => {
          // Filter out null/undefined leads and test/sample data
          if (!lead || lead == null) return false;
          
          // Filter out obvious test/sample data
          const customer = (lead.customer || '').toLowerCase();
          const business = (lead.business || '').toLowerCase();
          const email = (lead.email || '').toLowerCase();
          
          // Check for test/sample patterns
          const isTestData = customer.includes('sample') || 
              customer.includes('test') || 
              customer.includes('demo') ||
              customer.includes('another customer') ||
              business.includes('sample') ||
              business.includes('test') ||
              business.includes('demo') ||
              business.includes('another business') ||
              email.includes('sample@') ||
              email.includes('test@') ||
              email.includes('demo@');
          
          if (isTestData) {
            console.log('[AllLeads] Filtering out test/sample data:', { customer, business, email });
            return false;
          }
          
          return true;
        })
        .map(lead => ({
          ...lead,
          productNames: lead.productNamesText || lead.product_names || '', // Map productNamesText to productNames for LeadTable
          updatedAt: lead.updated_at || lead.created_at || '',
          assignedSalesperson: lead.assignedSalesperson || lead.assigned_salesperson || 'Unassigned',
          assignedTelecaller: lead.assignedTelecaller || lead.assigned_telecaller || 'Unassigned'
        }));
      
      console.log('[AllLeads] Final leads count:', {
        rawLeadsCount: leadsData.length,
        uniqueLeadsCount: uniqueLeadsData.length,
        afterFilteringCount: transformedLeads.length,
        duplicatesRemoved: leadsData.length - uniqueLeadsData.length
      });
      
      setLeadsData(transformedLeads);
      setAllLeadsData(transformedLeads);
      
      // Update pagination - use backend total from stats, not transformed length
      if (response?.pagination?.total != null) {
        setTotal(response.pagination.total);
      } else if (response?.stats?.total != null) {
        setTotal(response.stats.total);
      } else {
        // Fallback to unique leads count
        setTotal(transformedLeads.length);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearchTerm, columnFilters.state, columnFilters.leadSource, columnFilters.salesStatus, columnFilters.followUpStatus, leadService]);

  // Fetch leads when filters change
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Filter leads based on column filters and search
  const filteredLeads = useMemo(() => {
    // Filter out null/undefined leads first
    let filtered = leadsData.filter(lead => lead != null && typeof lead === 'object');
    
    // Apply search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(lead => {
        if (!lead) return false;
        return (
          (lead.customer || '').toLowerCase().includes(searchLower) ||
          (lead.customerId || '').toLowerCase().includes(searchLower) ||
          (lead.email || '').toLowerCase().includes(searchLower) ||
          (lead.business || '').toLowerCase().includes(searchLower) ||
          (lead.phone || '').toLowerCase().includes(searchLower) ||
          (lead.address || '').toLowerCase().includes(searchLower)
        );
      });
    }
    
    // Apply column filters
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value) {
        const filterValue = value.toLowerCase();
        filtered = filtered.filter(lead => {
          if (!lead) return false;
          const leadValue = String(lead[key] || '').toLowerCase();
          return leadValue.includes(filterValue);
        });
      }
    });
    
    // Apply assigned salesperson filter
    if (assignedSalespersonFilter) {
      filtered = filtered.filter(lead => {
        if (!lead) return false;
        const assigned = lead.assignedSalesperson || lead.assigned_salesperson || '';
        if (assignedSalespersonFilter === 'Unassigned') {
          return !assigned || assigned === 'Unassigned' || assigned === 'N/A' || assigned === '';
        }
        return assigned === assignedSalespersonFilter;
      });
    }
    
    // Apply assigned telecaller filter
    if (assignedTelecallerFilter) {
      filtered = filtered.filter(lead => {
        if (!lead) return false;
        const assigned = lead.assignedTelecaller || lead.assigned_telecaller || '';
        if (assignedTelecallerFilter === 'Unassigned') {
          return !assigned || assigned === 'Unassigned' || assigned === 'N/A' || assigned === '';
        }
        return assigned === assignedTelecallerFilter;
      });
    }
    
    return filtered;
  }, [leadsData, debouncedSearchTerm, columnFilters, assignedSalespersonFilter, assignedTelecallerFilter]);

  // Toggle column visibility
  const toggleColumn = useCallback((columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  }, []);

  // Reset columns to default
  const resetColumns = useCallback(() => {
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
  }, []);

  // Show all columns
  const showAllColumns = useCallback(() => {
    setVisibleColumns(prev => {
      const allTrue = {};
      Object.keys(prev).forEach(key => {
        allTrue[key] = true;
      });
      return allTrue;
    });
  }, []);

  // Toggle select all
  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedLeadIds([]);
      setIsAllSelected(false);
    } else {
      const validLeadIds = filteredLeads
        .filter(lead => lead != null && lead.id != null)
        .map(lead => lead.id);
      setSelectedLeadIds(validLeadIds);
      setIsAllSelected(validLeadIds.length > 0);
    }
  }, [isAllSelected, filteredLeads]);

  // Toggle select one
  const toggleSelectOne = useCallback((leadId) => {
    if (leadId == null) return;
    setSelectedLeadIds(prev => {
      if (prev.includes(leadId)) {
        setIsAllSelected(false);
        return prev.filter(id => id !== leadId);
      } else {
        const newSelected = [...prev, leadId];
        const validLeadsCount = filteredLeads.filter(lead => lead != null && lead.id != null).length;
        setIsAllSelected(newSelected.length === validLeadsCount && validLeadsCount > 0);
        return newSelected;
      }
    });
  }, [filteredLeads]);

  // Handle edit
  const handleEdit = useCallback((lead) => {
    console.log('Edit lead:', lead);
    // Implement edit functionality
  }, []);

  // Handle view timeline
  const handleViewTimeline = useCallback((lead) => {
    setTimelineLead(lead);
    setShowCustomerTimeline(true);
  }, []);

  // Handle assign
  const handleAssign = useCallback((lead) => {
    console.log('Assign lead:', lead);
    // Implement assign functionality
  }, []);

  // Get status badge
  const getStatusBadge = useCallback((status, type) => {
    return getStatusBadgeUtil(status, type);
  }, []);

  // Check if lead is assigned
  const isLeadAssigned = useCallback((lead) => {
    if (!lead || lead === null || lead === undefined) return false;
    const assigned = lead.assignedSalesperson || lead.assigned_salesperson;
    return assigned && assigned !== 'Unassigned' && assigned !== 'N/A' && assigned !== '' && assigned.trim() !== '';
  }, []);

  // Check if value is assigned (for individual field checks - handles both string values and lead objects)
  const isValueAssigned = useCallback((value) => {
    if (value === null || value === undefined) return false;
    
    // If it's a string value (like lead.assignedSalesperson)
    if (typeof value === 'string') {
      return value !== 'Unassigned' && value !== 'N/A' && value !== '' && value.trim() !== '';
    }
    
    // If it's a lead object, use isLeadAssigned
    if (typeof value === 'object') {
      return isLeadAssigned(value);
    }
    
    return false;
  }, [isLeadAssigned]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setColumnFilters({
      customerId: '',
      customer: '',
      business: '',
      address: '',
      state: '',
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
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setAssignedSalespersonFilter('');
    setAssignedTelecallerFilter('');
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.values(columnFilters).some(filter => filter !== '') || 
           debouncedSearchTerm !== '' || 
           assignedSalespersonFilter !== '' || 
           assignedTelecallerFilter !== '';
  }, [columnFilters, debouncedSearchTerm, assignedSalespersonFilter, assignedTelecallerFilter]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      

      {/* Search and Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, or business..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              className={`px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 text-base ${
                hasActiveFilters
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setShowColumnFilterRow(!showColumnFilterRow)}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <button
              className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={() => setShowColumnFilter(true)}
              title="Toggle Columns"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
            
            <button 
              className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" 
              onClick={fetchLeads}
              disabled={loading}
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Active Filters:</span>
              <div className="flex flex-wrap gap-2">
                {debouncedSearchTerm && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Search: "{debouncedSearchTerm}"
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setDebouncedSearchTerm('');
                      }}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {assignedSalespersonFilter && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Salesperson: {assignedSalespersonFilter}
                    <button
                      onClick={() => setAssignedSalespersonFilter('')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {assignedTelecallerFilter && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Telecaller: {assignedTelecallerFilter}
                    <button
                      onClick={() => setAssignedTelecallerFilter('')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {Object.entries(columnFilters).map(([key, value]) => {
                  if (value) {
                    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                    return (
                      <span key={key} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {label}: {value}
                        <button
                          onClick={() => setColumnFilters(prev => ({ ...prev, [key]: '' }))}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
            <button
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Lead Table */}
      <div className="flex gap-0">
        <LeadTable
          filteredLeads={filteredLeads}
          tableLoading={loading}
          hasStatusFilter={hasActiveFilters}
          visibleColumns={visibleColumns}
          isAllSelected={isAllSelected}
          selectedLeadIds={selectedLeadIds}
          isLeadAssigned={isLeadAssigned}
          isValueAssigned={isValueAssigned}
          getStatusBadge={getStatusBadge}
          toggleSelectAll={toggleSelectAll}
          toggleSelectOne={toggleSelectOne}
          onEdit={handleEdit}
          onViewTimeline={handleViewTimeline}
          onAssign={handleAssign}
          showCustomerTimeline={showCustomerTimeline}
          setShowColumnFilter={setShowColumnFilter}
          allLeadsData={allLeadsData}
          assignedSalespersonFilter={assignedSalespersonFilter}
          assignedTelecallerFilter={assignedTelecallerFilter}
          onAssignedSalespersonFilterChange={setAssignedSalespersonFilter}
          onAssignedTelecallerFilterChange={setAssignedTelecallerFilter}
          usernames={[]}
          columnFilters={columnFilters}
          onColumnFilterChange={(key, value) => setColumnFilters(prev => ({ ...prev, [key]: value }))}
          showColumnFilterRow={showColumnFilterRow}
          onToggleColumnFilterRow={() => setShowColumnFilterRow(prev => !prev)}
        />
        
        {/* Customer Timeline */}
        {showCustomerTimeline && timelineLead && (
          <CustomerTimeline
            lead={timelineLead}
            onClose={() => {
              setShowCustomerTimeline(false);
              setTimelineLead(null);
          }}
        />
      )}
              </div>
              
      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Rows per page:</span>
                <select
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value));
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
                </select>
          <span>Showing {filteredLeads.length} of {total} leads</span>
              </div>
        <div className="flex items-center space-x-2">
                <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-3 py-1 border rounded ${
              page === 1
                ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Prev
                </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages || 1}
          </span>
                <button
            onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
            disabled={page >= totalPages || total === 0}
            className={`px-3 py-1 border rounded ${
              page >= totalPages || total === 0
                ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Next
                </button>
              </div>
                      </div>

      {/* Column Filter Modal */}
      <ColumnFilterModal
        isOpen={showColumnFilter}
        onClose={() => setShowColumnFilter(false)}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
        onResetColumns={resetColumns}
        onShowAllColumns={showAllColumns}
      />
    </div>
  );
};

export default AllLeads;
