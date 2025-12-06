import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, User, Phone, Mail, CheckCircle, X, AlertCircle, Loader, Search, Filter, Users as UsersIcon, CheckSquare, Square, UserCheck } from 'lucide-react';
import { API_ENDPOINTS } from '../../api/admin_api/api';
import apiClient from '../../utils/apiClient';
import departmentUsersService, { apiToUiDepartment } from '../../api/admin_api/departmentUsersService';
import departmentHeadService from '../../api/admin_api/departmentHeadService';

export default function MeetingAssignment() {
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' or 'meetings'
  const [leads, setLeads] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [salespersons, setSalespersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [salespersonsLoading, setSalespersonsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showSalespersonModal, setShowSalespersonModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchSalespersons();
    if (activeTab === 'leads') {
      fetchLeads();
    } else {
      fetchMeetings();
    }
  }, [activeTab]);

  // Listen for meeting updates from other components (e.g., Leads component)
  useEffect(() => {
    const handleMeetingUpdate = () => {
      if (activeTab === 'meetings') {
        fetchMeetings();
      }
    };

    window.addEventListener('marketingMeetingsUpdated', handleMeetingUpdate);
    return () => {
      window.removeEventListener('marketingMeetingsUpdated', handleMeetingUpdate);
    };
  }, [activeTab]);

  const fetchLeads = async () => {
    try {
      setLeadsLoading(true);
      setError(null);
      const response = await departmentHeadService.getAllLeads({ limit: 100, page: 1 });
      
      if (response?.data) {
        const leadsData = Array.isArray(response.data) ? response.data : [];
        setLeads(leadsData);
      } else if (response?.success && response?.data) {
        setLeads(Array.isArray(response.data) ? response.data : []);
      } else {
        setLeads([]);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err.response?.data?.message || 'Failed to fetch leads');
      setLeads([]);
    } finally {
      setLeadsLoading(false);
      setLoading(false);
    }
  };

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get(API_ENDPOINTS.MARKETING_MEETINGS_GET_ALL());
      
      // apiClient.get() returns the parsed JSON response directly
      // Backend returns: { success: true, data: [...], count: ... }
      // Check multiple possible response structures
      if (response && response.success === true && Array.isArray(response.data)) {
        setMeetings(response.data);
      } else if (response && Array.isArray(response.data)) {
        setMeetings(response.data);
      } else if (Array.isArray(response)) {
        setMeetings(response);
      } else if (response && response.success === false) {
        setError(response.message || response.error || 'Failed to fetch meetings');
        setMeetings([]);
      } else {
        // Empty response or unexpected structure
        setMeetings([]);
      }
    } catch (err) {
      console.error('Error fetching meetings:', err);
      console.error('Full error:', {
        message: err.message,
        status: err.status,
        data: err.data,
        response: err.response
      });
      
      // Extract error message from various possible error structures
      let errorMessage = 'Failed to fetch meetings';
      if (err.response?.data) {
        errorMessage = err.response.data.message || err.response.data.error || errorMessage;
      } else if (err.data) {
        errorMessage = err.data.message || err.data.error || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalespersons = async () => {
    try {
      setSalespersonsLoading(true);
      const res = await departmentUsersService.listUsers({ limit: 100, page: 1 });
      const payload = res.data || res;
      const users = (payload.users || []).filter(u => {
        const deptType = u.departmentType || u.department_type;
        // Filter for marketing_sales department
        return deptType === 'marketing_sales';
      }).map(u => ({
        id: u.id,
        name: u.username || u.name || u.email?.split('@')[0] || 'User',
        email: u.email,
        department: apiToUiDepartment ? apiToUiDepartment(u.departmentType || u.department_type) : (u.departmentType || u.department_type || '')
      }));
      setSalespersons(users);
    } catch (err) {
      console.error('Error fetching salespersons:', err);
    } finally {
      setSalespersonsLoading(false);
    }
  };

  const handleLeadSelect = (lead) => {
    if (selectedLead?.id === lead.id) {
      setSelectedLead(null);
    } else {
      setSelectedLead(lead);
    }
  };

  const handleAssignClick = () => {
    if (!selectedLead) {
      setError('Please select a lead first');
      return;
    }
    setShowSalespersonModal(true);
    // Set default meeting date to today
    if (!meetingDate) {
      setMeetingDate(new Date().toISOString().split('T')[0]);
    }
  };

  const handleAssignToSalesperson = async (salespersonEmail) => {
    if (!selectedLead) {
      setError('No lead selected');
      return;
    }

    if (!meetingDate) {
      setError('Please select a meeting date');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare meeting data from lead
      const meetingData = {
        customer_name: selectedLead.customer || selectedLead.name || 'N/A',
        customer_phone: selectedLead.phone || selectedLead.phone_number || '',
        customer_email: selectedLead.email || '',
        address: selectedLead.address || '',
        city: selectedLead.city || '',
        state: selectedLead.state || '',
        pincode: selectedLead.pincode || '',
        assigned_to: salespersonEmail,
        meeting_date: meetingDate,
        meeting_time: meetingTime || '',
        scheduled_date: meetingDate,
        status: 'Scheduled',
        notes: notes || `Assigned from lead: ${selectedLead.customer_id || selectedLead.id}`,
        customer_id: selectedLead.id,
        lead_id: selectedLead.id
      };

      const response = await apiClient.post(API_ENDPOINTS.MARKETING_MEETINGS_CREATE(), meetingData);

      if (response.data.success) {
        // Reset state
        setSelectedLead(null);
        setShowSalespersonModal(false);
        setMeetingDate('');
        setMeetingTime('');
        setNotes('');
        setError(null);
        
        // Refresh meetings and switch to meetings tab
        await fetchMeetings();
        setActiveTab('meetings');
        
        alert('Meeting assigned successfully!');
      } else {
        setError(response.data.message || 'Failed to assign meeting');
      }
    } catch (err) {
      console.error('Error assigning meeting:', err);
      setError(err.response?.data?.message || 'Failed to assign meeting');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filteredLeads = leads.filter(lead => {
    const customerName = (lead.customer || lead.name || '').toLowerCase();
    const phone = (lead.phone || lead.phone_number || '').toLowerCase();
    const email = (lead.email || '').toLowerCase();
    const matchesSearch = customerName.includes(searchTerm.toLowerCase()) ||
                         phone.includes(searchTerm.toLowerCase()) ||
                         email.includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Meeting Assignment</h1>
        <p className="text-gray-600">Select leads and assign them to salespersons for meetings</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'leads'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('meetings')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'meetings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Assigned Meetings ({meetings.length})
          </button>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'leads' ? 'Search leads by name, phone, or email...' : 'Search by customer name or salesperson...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {activeTab === 'meetings' && (
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          )}
          {activeTab === 'leads' && selectedLead && (
            <button
              onClick={handleAssignClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <UserCheck className="h-5 w-5" />
              <span>Assign Selected Lead</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 mb-1">{error}</p>
              <p className="text-xs text-red-600">
                Check the browser console (F12) for more details. If the error persists, please restart the backend server.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setError(null);
                  if (activeTab === 'meetings') {
                    fetchMeetings();
                  }
                }}
                className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leads Tab Content */}
      {activeTab === 'leads' && (
        <>
          {leadsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium text-lg mb-2">
                {searchTerm ? 'No leads match your search' : 'No leads available'}
              </p>
              <p className="text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria' : 'Leads will appear here once they are added'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"></th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Type</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map((lead) => {
                      const isSelected = selectedLead?.id === lead.id;
                      return (
                        <tr
                          key={lead.id}
                          onClick={() => handleLeadSelect(lead)}
                          className={`hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isSelected ? (
                              <CheckSquare className="h-5 w-5 text-blue-600" />
                            ) : (
                              <Square className="h-5 w-5 text-gray-400" />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{lead.customer || lead.name || 'N/A'}</div>
                            {lead.customer_id && (
                              <div className="text-sm text-gray-500">ID: {lead.customer_id}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {lead.phone && (
                              <div className="flex items-center gap-1 text-sm text-gray-900">
                                <Phone className="h-4 w-4" />
                                {lead.phone}
                              </div>
                            )}
                            {lead.email && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Mail className="h-4 w-4" />
                                {lead.email}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">{lead.address || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.state || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.product_type || lead.productType || 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Meetings Tab Content */}
      {activeTab === 'meetings' && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredMeetings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium text-lg mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No meetings match your filters' : 'No meetings assigned yet'}
              </p>
              <p className="text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Select a lead from the Leads tab and assign it to a salesperson'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMeetings.map((meeting) => (
                      <tr key={meeting.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{meeting.customer_name}</div>
                          {meeting.customer_phone && (
                            <div className="text-sm text-gray-500">{meeting.customer_phone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {meeting.assigned_to}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(meeting.meeting_date)}</div>
                          {meeting.meeting_time && (
                            <div className="text-sm text-gray-500">{meeting.meeting_time.substring(0, 5)}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{meeting.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                            {meeting.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Salesperson Selection Modal */}
      {showSalespersonModal && selectedLead && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Assign Lead to Salesperson</h2>
              <button
                onClick={() => {
                  setShowSalespersonModal(false);
                  setError(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Selected Lead Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Selected Lead:</h3>
                <p className="text-sm text-gray-700">
                  <strong>{selectedLead.customer || selectedLead.name || 'N/A'}</strong>
                  {selectedLead.phone && <span className="ml-2">• {selectedLead.phone}</span>}
                </p>
                {selectedLead.address && (
                  <p className="text-sm text-gray-600 mt-1">{selectedLead.address}</p>
                )}
              </div>

              {/* Meeting Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Meeting Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Time
                </label>
                <input
                  type="time"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any additional notes for this meeting..."
                />
              </div>

              {/* Salespersons List */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Salesperson <span className="text-red-500">*</span>
                </label>
                {salespersonsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : salespersons.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No salespersons available</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {salespersons.map((sp) => (
                      <button
                        key={sp.id}
                        onClick={() => handleAssignToSalesperson(sp.email)}
                        disabled={loading}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <UsersIcon className="h-5 w-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{sp.name}</p>
                          <p className="text-sm text-gray-500">{sp.email}</p>
                        </div>
                        {loading && (
                          <Loader className="h-5 w-5 animate-spin text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
