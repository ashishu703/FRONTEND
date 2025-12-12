import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, CheckCircle, X, AlertCircle, Loader, Search, Filter, XCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../../api/admin_api/api';
import apiClient from '../../utils/apiClient';

export default function MeetingAssignment() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchMeetings();
  }, []);

  // Listen for meeting updates from other components (e.g., Leads component)
  useEffect(() => {
    const handleMeetingUpdate = () => {
      fetchMeetings();
    };

    window.addEventListener('marketingMeetingsUpdated', handleMeetingUpdate);
    return () => {
      window.removeEventListener('marketingMeetingsUpdated', handleMeetingUpdate);
    };
  }, []);

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
        <p className="text-gray-600">View all assigned meetings and their check-in status</p>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name or salesperson..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
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
                  fetchMeetings();
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

      {/* Assigned Meetings Content */}
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
                  : 'Meetings will appear here once leads are assigned to salespersons'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMeetings.map((meeting) => (
                      <tr key={meeting.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {meeting.customer_name || meeting.lead_customer || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {meeting.customer_phone || meeting.lead_phone || meeting.phone || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs">
                            {meeting.address || meeting.lead_address || 'Address not provided'}
                          </div>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          {meeting.is_checked_in || meeting.status === 'Completed' ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200 flex items-center gap-1 w-fit">
                              <CheckCircle className="h-4 w-4" />
                              <span>Checked In</span>
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200 flex items-center gap-1 w-fit">
                              <AlertCircle className="h-4 w-4" />
                              <span>Not Checked In</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

    </div>
  );
}
