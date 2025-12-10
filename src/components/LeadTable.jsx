import React, { useState, useRef, useEffect } from 'react';
import { 
  Hash, User, Building, Shield, Tag, Clock, Settings,
  Calendar, CheckCircle, XCircle, Edit, Eye, Phone, RefreshCw, Filter, X
} from 'lucide-react';

const LeadTable = ({
  filteredLeads,
  tableLoading,
  hasStatusFilter,
  visibleColumns,
  isAllSelected,
  selectedLeadIds,
  isLeadAssigned,
  isValueAssigned,
  getStatusBadge,
  toggleSelectAll,
  toggleSelectOne,
  onEdit,
  onViewTimeline,
  onAssign,
  showCustomerTimeline,
  setShowColumnFilter,
  allLeadsData,
  assignedSalespersonFilter,
  assignedTelecallerFilter,
  onAssignedSalespersonFilterChange,
  onAssignedTelecallerFilterChange,
  usernames,
  columnFilters = {},
  onColumnFilterChange,
  showColumnFilterRow = false,
  onToggleColumnFilterRow
}) => {
  const [showSalespersonFilter, setShowSalespersonFilter] = useState(false);
  const [showTelecallerFilter, setShowTelecallerFilter] = useState(false);
  const salespersonFilterRef = useRef(null);
  const telecallerFilterRef = useRef(null);

  // Get unique salesperson values from all leads
  const uniqueSalespersons = React.useMemo(() => {
    const salespersons = new Set();
    const allData = allLeadsData && allLeadsData.length > 0 ? allLeadsData : filteredLeads;
    allData.forEach(lead => {
      const sp = lead.assignedSalesperson?.trim();
      if (sp && sp.toLowerCase() !== 'n/a' && sp.toLowerCase() !== 'na' && sp !== '-' && sp !== '') {
        salespersons.add(sp);
      }
    });
    return Array.from(salespersons).sort();
  }, [allLeadsData, filteredLeads]);

  // Get unique telecaller values from all leads
  const uniqueTelecallers = React.useMemo(() => {
    const telecallers = new Set();
    const allData = allLeadsData && allLeadsData.length > 0 ? allLeadsData : filteredLeads;
    allData.forEach(lead => {
      const tc = lead.assignedTelecaller?.trim();
      if (tc && tc.toLowerCase() !== 'n/a' && tc.toLowerCase() !== 'na' && tc !== '-' && tc !== '') {
        telecallers.add(tc);
      }
    });
    return Array.from(telecallers).sort();
  }, [allLeadsData, filteredLeads]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (salespersonFilterRef.current && !salespersonFilterRef.current.contains(event.target)) {
        setShowSalespersonFilter(false);
      }
      if (telecallerFilterRef.current && !telecallerFilterRef.current.contains(event.target)) {
        setShowTelecallerFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      style={{
        marginRight: 0,
        marginLeft: 0,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        borderTopRightRadius: showCustomerTimeline ? 0 : '0.5rem',
        borderBottomRightRadius: showCustomerTimeline ? 0 : '0.5rem',
        borderRight: showCustomerTimeline ? 'none' : '1px solid #e5e7eb'
      }}
    >
      <div
        className="overflow-x-auto"
        style={{
          marginRight: 0,
          paddingRight: 0,
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}
      >
        <table className="w-full" style={{ width: '100%', tableLayout: 'auto', borderCollapse: 'collapse', margin: 0 }}>
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={isAllSelected && filteredLeads.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              {visibleColumns.customerId && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[130px]">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-purple-600" />
                    <span>Customer ID</span>
                  </div>
                </th>
              )}
              {visibleColumns.customer && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[220px]">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Customer</span>
                  </div>
                </th>
              )}
              {visibleColumns.business && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-indigo-600" />
                    <span>Business</span>
                  </div>
                </th>
              )}
              {visibleColumns.address && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-indigo-600" />
                    <span>Address</span>
                  </div>
                </th>
              )}
              {visibleColumns.state && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-green-600" />
                    <span>State</span>
                  </div>
                </th>
              )}
              {visibleColumns.followUpStatus && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Follow Up Status</span>
                  </div>
                </th>
              )}
              {visibleColumns.salesStatus && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Sales Status</span>
                  </div>
                </th>
              )}
              {visibleColumns.assignedSalesperson && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px]">
                  <div className="flex items-center space-x-2 relative" ref={salespersonFilterRef}>
                    <User className="w-4 h-4 text-sky-600" />
                    <span>Assigned Salesperson</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSalespersonFilter(!showSalespersonFilter);
                        setShowTelecallerFilter(false);
                      }}
                      className={`ml-1 p-1 rounded hover:bg-gray-200 transition-colors ${
                        assignedSalespersonFilter ? 'text-blue-600' : 'text-gray-400'
                      }`}
                      title="Filter by Salesperson"
                    >
                      <Filter className="w-3 h-3" />
                    </button>
                    {showSalespersonFilter && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
                        <div className="p-2 border-b border-gray-200 flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-700">Filter by Salesperson</span>
                          {assignedSalespersonFilter && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAssignedSalespersonFilterChange('');
                                setShowSalespersonFilter(false);
                              }}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAssignedSalespersonFilterChange('');
                              setShowSalespersonFilter(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                              !assignedSalespersonFilter ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                            }`}
                          >
                            All Salespersons
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAssignedSalespersonFilterChange('Unassigned');
                              setShowSalespersonFilter(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                              assignedSalespersonFilter === 'Unassigned' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                            }`}
                          >
                            Unassigned
                          </button>
                          {uniqueSalespersons.map((sp) => (
                            <button
                              key={sp}
                              onClick={(e) => {
                                e.stopPropagation();
                                onAssignedSalespersonFilterChange(sp);
                                setShowSalespersonFilter(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                                assignedSalespersonFilter === sp ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                              }`}
                            >
                              {sp}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </th>
              )}
              {visibleColumns.assignedTelecaller && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px]">
                  <div className="flex items-center space-x-2 relative" ref={telecallerFilterRef}>
                    <Phone className="w-4 h-4 text-cyan-600" />
                    <span>Assigned Telecaller</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTelecallerFilter(!showTelecallerFilter);
                        setShowSalespersonFilter(false);
                      }}
                      className={`ml-1 p-1 rounded hover:bg-gray-200 transition-colors ${
                        assignedTelecallerFilter ? 'text-blue-600' : 'text-gray-400'
                      }`}
                      title="Filter by Telecaller"
                    >
                      <Filter className="w-3 h-3" />
                    </button>
                    {showTelecallerFilter && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
                        <div className="p-2 border-b border-gray-200 flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-700">Filter by Telecaller</span>
                          {assignedTelecallerFilter && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAssignedTelecallerFilterChange('');
                                setShowTelecallerFilter(false);
                              }}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAssignedTelecallerFilterChange('');
                              setShowTelecallerFilter(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                              !assignedTelecallerFilter ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                            }`}
                          >
                            All Telecallers
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAssignedTelecallerFilterChange('Unassigned');
                              setShowTelecallerFilter(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                              assignedTelecallerFilter === 'Unassigned' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                            }`}
                          >
                            Unassigned
                          </button>
                          {uniqueTelecallers.map((tc) => (
                            <button
                              key={tc}
                              onClick={(e) => {
                                e.stopPropagation();
                                onAssignedTelecallerFilterChange(tc);
                                setShowTelecallerFilter(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                                assignedTelecallerFilter === tc ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                              }`}
                            >
                              {tc}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </th>
              )}
              {visibleColumns.gstNo && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-indigo-600" />
                    <span>GST No</span>
                  </div>
                </th>
              )}
              {visibleColumns.leadSource && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-orange-600" />
                    <span>Lead Source</span>
                  </div>
                </th>
              )}
              {visibleColumns.productNames && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[220px]">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-pink-600" />
                    <span>Product Name</span>
                  </div>
                </th>
              )}
              {visibleColumns.category && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px]">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-pink-600" />
                    <span>Category</span>
                  </div>
                </th>
              )}
              {visibleColumns.createdAt && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>Created</span>
                  </div>
                </th>
              )}
              {visibleColumns.telecallerStatus && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px]">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Telecaller Status</span>
                  </div>
                </th>
              )}
              {visibleColumns.paymentStatus && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px]">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Payment Status</span>
                  </div>
                </th>
              )}
              {visibleColumns.updatedAt && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>Updated At</span>
                  </div>
                </th>
              )}
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => setShowColumnFilter(true)}
                    className="text-gray-600 hover:text-gray-900"
                    title="Column Visibility"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onToggleColumnFilterRow}
                    className={`text-gray-600 hover:text-gray-900 ${showColumnFilterRow ? 'text-blue-600' : ''}`}
                    title="Toggle Column Filters"
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                  <span>Actions</span>
                </div>
              </th>
            </tr>
            {showColumnFilterRow && (
              <tr className="bg-gray-50 border-b border-gray-200">
                <td className="px-4 py-2"></td>
                {visibleColumns.customerId && (
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={columnFilters.customerId || ''}
                      onChange={(e) => onColumnFilterChange?.('customerId', e.target.value)}
                      placeholder="Filter ID"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                )}
                {visibleColumns.customer && (
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={columnFilters.customer || ''}
                      onChange={(e) => onColumnFilterChange?.('customer', e.target.value)}
                      placeholder="Filter Customer"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                )}
                {visibleColumns.business && (
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={columnFilters.business || ''}
                      onChange={(e) => onColumnFilterChange?.('business', e.target.value)}
                      placeholder="Filter Business"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                )}
                {visibleColumns.address && (
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={columnFilters.address || ''}
                      onChange={(e) => onColumnFilterChange?.('address', e.target.value)}
                      placeholder="Filter Address"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                )}
                {visibleColumns.state && (
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={columnFilters.state || ''}
                      onChange={(e) => onColumnFilterChange?.('state', e.target.value)}
                      placeholder="Filter State"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                )}
                {visibleColumns.followUpStatus && (
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={columnFilters.followUpStatus || ''}
                      onChange={(e) => onColumnFilterChange?.('followUpStatus', e.target.value)}
                      placeholder="Filter Status"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                )}
                {visibleColumns.salesStatus && (
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={columnFilters.salesStatus || ''}
                      onChange={(e) => onColumnFilterChange?.('salesStatus', e.target.value)}
                      placeholder="Filter Status"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                )}
                {visibleColumns.assignedSalesperson && (
                  <td className="px-4 py-2"></td>
                )}
                {visibleColumns.assignedTelecaller && (
                  <td className="px-4 py-2"></td>
                )}
                {visibleColumns.gstNo && (
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={columnFilters.gstNo || ''}
                      onChange={(e) => onColumnFilterChange?.('gstNo', e.target.value)}
                      placeholder="Filter GST"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                )}
                {visibleColumns.leadSource && (
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={columnFilters.leadSource || ''}
                      onChange={(e) => onColumnFilterChange?.('leadSource', e.target.value)}
                      placeholder="Filter Source"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                )}
                {visibleColumns.productNames && (
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={columnFilters.productNames || ''}
                      onChange={(e) => onColumnFilterChange?.('productNames', e.target.value)}
                      placeholder="Filter Product"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                )}
                {visibleColumns.category && (
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={columnFilters.category || ''}
                      onChange={(e) => onColumnFilterChange?.('category', e.target.value)}
                      placeholder="Filter Category"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                )}
                {visibleColumns.createdAt && (
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={columnFilters.createdAt || ''}
                      onChange={(e) => onColumnFilterChange?.('createdAt', e.target.value)}
                      placeholder="Filter Date"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                )}
                {visibleColumns.telecallerStatus && (
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={columnFilters.telecallerStatus || ''}
                      onChange={(e) => onColumnFilterChange?.('telecallerStatus', e.target.value)}
                      placeholder="Filter Status"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                )}
                {visibleColumns.paymentStatus && (
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={columnFilters.paymentStatus || ''}
                      onChange={(e) => onColumnFilterChange?.('paymentStatus', e.target.value)}
                      placeholder="Filter Status"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                )}
                {visibleColumns.updatedAt && (
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={columnFilters.updatedAt || ''}
                      onChange={(e) => onColumnFilterChange?.('updatedAt', e.target.value)}
                      placeholder="Filter Date"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                )}
                <td className="px-4 py-2"></td>
              </tr>
            )}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableLoading ? (
              <tr>
                <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 2} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Loading leads...</span>
                  </div>
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 2} className="px-4 py-8 text-center text-gray-500">
                  {hasStatusFilter
                    ? 'No leads match this filter. Clear filter to see all leads.'
                    : 'No leads found. Add a new customer to get started.'}
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead, index) => (
                <tr key={lead.id != null ? `lead-${lead.id}` : `lead-${index}`} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedLeadIds.includes(lead.id)}
                      onChange={() => toggleSelectOne(lead.id)}
                      title={isLeadAssigned(lead) ? 'Click to reassign' : 'Select for assignment'}
                    />
                  </td>
                  {visibleColumns.customerId && (
                    <td className="px-4 py-4 text-sm text-gray-700">{lead.customerId}</td>
                  )}
                  {visibleColumns.customer && (
                    <td className="px-4 py-4 text-sm text-gray-900 max-w-[220px]">
                      <div>
                        <div className="flex items-start gap-2 flex-wrap">
                          <span className="font-medium break-words whitespace-normal">{lead.customer}</span>
                          {lead.leadSource && lead.leadSource.toUpperCase() === 'TRADEINDIA' && (
                            <span className="px-2 py-0.5 text-xs font-semibold text-orange-700 bg-orange-100 border border-orange-300 rounded-full flex-shrink-0" title="Generated from TradeIndia">
                              TRADEINDIA
                            </span>
                          )}
                        </div>
                        <div className="text-gray-600 break-words whitespace-normal">{lead.phone}</div>
                        {lead.whatsapp && (
                          <a 
                            href={`https://wa.me/91${lead.whatsapp}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 text-xs flex items-center gap-1"
                          >
                            💬 WhatsApp
                          </a>
                        )}
                        {lead.email && (
                          <a 
                            href={`mailto:${lead.email}`}
                            className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                          >
                            📧 Email
                          </a>
                        )}
                      </div>
                    </td>
                  )}
                  {visibleColumns.business && (
                    <td className="px-4 py-4 text-sm text-gray-900 max-w-[200px] break-words whitespace-normal">{lead.business}</td>
                  )}
                  {visibleColumns.address && (
                    <td className="px-4 py-4 text-sm text-gray-900 max-w-[200px] break-words whitespace-normal">{lead.address}</td>
                  )}
                  {visibleColumns.state && (
                    <td className="px-4 py-4 text-sm text-gray-900">{lead.state}</td>
                  )}
                  {visibleColumns.followUpStatus && (
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        {getStatusBadge(lead.followUpStatus || lead.connectedStatus || lead.telecallerStatus, 'telecaller')}
                        {lead.followUpRemark && (
                          <div className="text-xs text-gray-600 italic">"{lead.followUpRemark}"</div>
                        )}
                      </div>
                    </td>
                  )}
                  {visibleColumns.salesStatus && (
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        {getStatusBadge(lead.salesStatus, 'sales')}
                        {lead.salesStatusRemark && (
                          <div className="text-xs text-gray-600 italic">"{lead.salesStatusRemark}"</div>
                        )}
                      </div>
                    </td>
                  )}
                  {visibleColumns.assignedSalesperson && (
                    <td className="px-4 py-4 text-sm text-gray-900">{isValueAssigned(lead.assignedSalesperson) ? lead.assignedSalesperson : 'Unassigned'}</td>
                  )}
                  {visibleColumns.assignedTelecaller && (
                    <td className="px-4 py-4 text-sm text-gray-900">{isValueAssigned(lead.assignedTelecaller) ? lead.assignedTelecaller : 'Unassigned'}</td>
                  )}
                  {visibleColumns.gstNo && (
                    <td className="px-4 py-4 text-sm text-gray-900">{lead.gstNo}</td>
                  )}
                  {visibleColumns.leadSource && (
                    <td className="px-4 py-4 text-sm text-gray-900">{lead.leadSource}</td>
                  )}
                  {visibleColumns.productNames && (
                    <td className="px-4 py-4 text-sm text-gray-900">{lead.productNamesText}</td>
                  )}
                  {visibleColumns.category && (
                    <td className="px-4 py-4 text-sm text-gray-900">{lead.category}</td>
                  )}
                  {visibleColumns.createdAt && (
                    <td className="px-4 py-4 text-sm text-gray-900">{lead.createdAt}</td>
                  )}
                  {visibleColumns.telecallerStatus && (
                    <td className="px-4 py-4">
                      {getStatusBadge(lead.telecallerStatus, 'telecaller')}
                    </td>
                  )}
                  {visibleColumns.paymentStatus && (
                    <td className="px-4 py-4">
                      {getStatusBadge(lead.paymentStatus, 'payment')}
                    </td>
                  )}
                  {visibleColumns.updatedAt && (
                    <td className="px-4 py-4 text-sm text-gray-900">{lead.updated_at || lead.createdAt}</td>
                  )}
                  <td className="px-4 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(lead)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Lead"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onViewTimeline(lead)}
                        className="text-green-600 hover:text-green-900"
                        title="View Customer Timeline"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {isLeadAssigned(lead) ? (
                        <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded" title="Already assigned">
                          Assigned
                        </span>
                      ) : (
                        <button
                          onClick={() => onAssign(lead)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Assign Lead"
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;

