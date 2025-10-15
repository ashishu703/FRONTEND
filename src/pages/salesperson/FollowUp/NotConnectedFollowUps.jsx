import React, { useState, useEffect } from 'react';
import { 
  XCircle, 
  RefreshCw, 
  Filter, 
  Calendar, 
  User, 
  Building, 
  MapPin, 
  Package, 
  Clock,
  Search,
  Plus,
  Download,
  Pencil,
  Eye,
  Wallet,
  MessageCircle,
  Globe,
  BadgeCheck,
  FileText,
  Mail,
  X
} from 'lucide-react';
import apiClient from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../api/admin_api/api';
import { mapSalesStatusToBucket } from './statusMapping';

const NotConnectedFollowUps = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusForm, setStatusForm] = useState({
    status: '',
    date: '',
    time: '',
    remarks: '',
    otherStatus: ''
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    customer: '',
    business: '',
    state: '',
    leadSource: '',
    customerType: '',
    connectedStatus: '',
    finalStatus: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load not connected leads (connected_status = 'not_connected' or 'pending')
  useEffect(() => {
    const loadNotConnectedLeads = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(API_ENDPOINTS.SALESPERSON_ASSIGNED_LEADS_ME());
        const rows = res?.data || [];
        
        // Filter by unified sales_status bucket: 'not-connected'
        const notConnectedLeads = rows
          .filter(r => {
            const b = mapSalesStatusToBucket(r.sales_status);
            return b === 'not-connected';
          })
          .map((r) => ({
            id: r.id,
            name: r.name,
            phone: r.phone,
            email: r.email || 'N/A',
            business: r.business || 'N/A',
            address: r.address || 'N/A',
            gstNo: r.gst_no || 'N/A',
            productName: r.product_type || 'N/A',
            state: r.state || 'N/A',
            enquiryBy: r.lead_source || 'N/A',
            customerType: r.customer_type || 'N/A',
            date: r.date ? new Date(r.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            salesStatus: r.sales_status || 'pending',
            salesStatusRemark: r.sales_status_remark || null,
            salesStatusDate: new Date(r.updated_at || r.created_at || Date.now()).toLocaleString(),
            latestQuotationUrl: '#',
            quotationsSent: 0,
            followUpLink: 'https://calendar.google.com/',
            whatsapp: r.whatsapp ? `+91${String(r.whatsapp).replace(/\D/g, '').slice(-10)}` : null,
            transferredLeads: 0,
            transferredTo: r.transferred_to || null,
            callDurationSeconds: r.call_duration_seconds || null,
          }));
        
        setFollowUps(notConnectedLeads);
      } catch (err) {
        console.error('Failed to load not connected leads:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNotConnectedLeads();
  }, []);

  // Handle edit button click
  const handleEditClick = (lead) => {
    setSelectedLead(lead);
    setStatusForm({
      status: lead.salesStatus || '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      remarks: lead.salesStatusRemark || '',
      otherStatus: ''
    });
    setShowStatusModal(true);
  };

  // Handle status form submission
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      // Determine the final status - use otherStatus if status is 'other'
      const finalStatus = statusForm.status === 'other' ? statusForm.otherStatus : statusForm.status;
      const finalRemarks = statusForm.status === 'other' 
        ? `${statusForm.otherStatus}${statusForm.remarks ? ' - ' + statusForm.remarks : ''}`
        : statusForm.remarks;

      // Update the lead status
      await apiClient.put(`${API_ENDPOINTS.SALESPERSON_ASSIGNED_LEADS_ME()}/${selectedLead.id}`, {
        sales_status: finalStatus,
        sales_status_remark: finalRemarks,
        sales_status_date: new Date(`${statusForm.date}T${statusForm.time}`).toISOString()
      });
      
      // Update local state
      setFollowUps(prev => prev.map(lead => 
        lead.id === selectedLead.id 
          ? { ...lead, salesStatus: finalStatus, salesStatusRemark: finalRemarks }
          : lead
      ));
      
      setShowStatusModal(false);
      setSelectedLead(null);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await apiClient.get(API_ENDPOINTS.SALESPERSON_ASSIGNED_LEADS_ME());
      const rows = res?.data || [];
      
      const notConnectedLeads = rows
        .filter(r => mapSalesStatusToBucket(r.sales_status) === 'not-connected')
        .map((r) => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          email: r.email || 'N/A',
          business: r.business || 'N/A',
          address: r.address || 'N/A',
          gstNo: r.gst_no || 'N/A',
          productName: r.product_type || 'N/A',
          state: r.state || 'N/A',
          enquiryBy: r.lead_source || 'N/A',
          customerType: r.customer_type || 'N/A',
          date: r.date ? new Date(r.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          salesStatus: r.sales_status || 'pending',
          salesStatusRemark: r.sales_status_remark || null,
          salesStatusDate: new Date(r.updated_at || r.created_at || Date.now()).toLocaleString(),
          latestQuotationUrl: '#',
          quotationsSent: 0,
          followUpLink: 'https://calendar.google.com/',
          whatsapp: r.whatsapp ? `+91${String(r.whatsapp).replace(/\D/g, '').slice(-10)}` : null,
          transferredLeads: 0,
          transferredTo: r.transferred_to || null,
          callDurationSeconds: r.call_duration_seconds || null,
        }));
      
      setFollowUps(notConnectedLeads);
    } catch (err) {
      console.error('Failed to refresh not connected leads:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Filter leads based on search and filters
  const filteredLeads = followUps.filter(lead => {
    const matchesSearch = !searchQuery || 
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.includes(searchQuery) ||
      lead.business?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      const leadValue = lead[key]?.toString().toLowerCase() || '';
      return leadValue.includes(value.toLowerCase());
    });

    return matchesSearch && matchesFilters;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

    return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-4 px-4 font-medium text-gray-600 text-sm">#</th>
                <th className="text-left py-2 px-4 font-medium text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo-500" />
                    Name & Phone
                  </div>
                  {showFilters && (
                    <input
                      type="text"
                      value={filters.customer}
                      onChange={(e) => handleFilterChange('customer', e.target.value)}
                      className="mt-1 w-full text-xs p-1 border rounded"
                      placeholder="Filter customer..."
                    />
                  )}
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-indigo-500" />
                    Business
                  </div>
                  {showFilters && (
                    <input
                      type="text"
                      value={filters.business}
                      onChange={(e) => handleFilterChange('business', e.target.value)}
                      className="mt-1 w-full text-xs p-1 border rounded"
                      placeholder="Filter business..."
                    />
                  )}
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-500" />
                    Address
                  </div>
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-indigo-500" />
                    Product Name
                  </div>
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-500" />
                    State
                  </div>
                  {showFilters && (
                    <input
                      type="text"
                      value={filters.state}
                      onChange={(e) => handleFilterChange('state', e.target.value)}
                      className="mt-1 w-full text-xs p-1 border rounded"
                      placeholder="Filter state..."
                    />
                  )}
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo-500" />
                    Customer Type
                  </div>
                  {showFilters && (
                    <input
                      type="text"
                      value={filters.customerType}
                      onChange={(e) => handleFilterChange('customerType', e.target.value)}
                      className="mt-1 w-full text-xs p-1 border rounded"
                      placeholder="Filter customer type..."
                    />
                  )}
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    Status
                  </div>
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <Pencil className="h-4 w-4 text-indigo-500" />
                    Action
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Loading not connected leads...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    No not connected leads found. Try adjusting your search or filters.
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-700">
                      <div className="font-medium">{lead.id}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-gray-600">{lead.phone}</div>
                        {lead.whatsapp && (
                          <a 
                            href={`https://wa.me/91${lead.whatsapp}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 text-xs flex items-center gap-1"
                          >
                            <MessageCircle className="h-3 w-3" />
                            WhatsApp
                          </a>
                        )}
                        {lead.email && lead.email !== 'N/A' && (
                          <a 
                            href={`mailto:${lead.email}`}
                            className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                          >
                            <Mail className="h-3 w-3" />
                            Email
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      <div className="font-medium">{lead.business}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      <div className="font-medium">{lead.address}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      <div className="font-medium">{lead.productName}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      <div className="font-medium">{lead.state}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      <div className="font-medium">{lead.customerType}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      <div className="flex flex-col space-y-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 w-fit">
                          {lead.connectedStatus === 'not_connected' ? 'Not Connected' : 'Pending'}
                        </span>
                        {lead.finalStatusRemark && (
                          <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            {lead.finalStatusRemark}
                          </div>
                        )}
                        <span className="text-xs text-gray-500">{lead.connectedStatusDate}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900" 
                          title="Edit"
                          onClick={() => handleEditClick(lead)}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900" title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-purple-600 hover:text-purple-900" title="Payment">
                          <Wallet className="h-4 w-4" />
                        </button>
                        <button className="text-orange-600 hover:text-orange-900" title="Document">
                          <FileText className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredLeads.length > itemsPerPage && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Showing {startIndex + 1} to {Math.min(endIndex, filteredLeads.length)} of {filteredLeads.length} results
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    currentPage === page
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Follow-up Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Follow Up Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleStatusSubmit} className="p-6">
              <div className="space-y-4">
                {/* Status Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow Up Status
                  </label>
                  <select
                    value={statusForm.status}
                    onChange={(e) => setStatusForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="appointment_schedule">APPOINTMENT SCHEDULE</option>
                    <option value="not_interested">NOT INTERESTED</option>
                    <option value="interested">INTERESTED</option>
                    <option value="quotation_send">QUOTATION SEND</option>
                    <option value="negotiation">NEGOTIATION</option>
                    <option value="close_order">CLOSE ORDER</option>
                    <option value="closed_lot">CLOSED/LOT</option>
                    <option value="call_back_request">CALL BACK REQUEST</option>
                    <option value="unreachable_call_not_connected">UNREACHABLE/CALL NOT CONNECTED</option>
                    <option value="currently_not_required">CURRENTLY NOT REQUIRED</option>
                    <option value="not_relevant">NOT RELEVANT</option>
                    <option value="other">OTHER</option>
                  </select>
                </div>

                {/* Other Status Input - Show when "OTHER" is selected */}
                {statusForm.status === 'other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Please specify
                    </label>
                    <input
                      type="text"
                      value={statusForm.otherStatus}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, otherStatus: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter custom status..."
                      required
                    />
                  </div>
                )}

                {/* Date and Time Fields - Show for specific statuses */}
                {(statusForm.status === 'appointment_schedule' || 
                  statusForm.status === 'call_back_request' || 
                  statusForm.status === 'quotation_send') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={statusForm.date}
                        onChange={(e) => setStatusForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        value={statusForm.time}
                        onChange={(e) => setStatusForm(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Remarks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <textarea
                    value={statusForm.remarks}
                    onChange={(e) => setStatusForm(prev => ({ ...prev, remarks: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter any additional remarks..."
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotConnectedFollowUps;