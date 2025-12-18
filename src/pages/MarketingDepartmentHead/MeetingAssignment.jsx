import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, CheckCircle, X, AlertCircle, Loader, Search, Filter, XCircle, Edit2, Trash2, Camera } from 'lucide-react';
import { API_ENDPOINTS } from '../../api/admin_api/api';
import apiClient from '../../utils/apiClient';

export default function MeetingAssignment() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deletingMeetingId, setDeletingMeetingId] = useState(null);

  useEffect(() => {
    fetchMeetings();
  }, []);

  // Listen for meeting updates and check-in submissions
  useEffect(() => {
    const handleMeetingUpdate = () => {
      console.log('Meeting update event received, refreshing...');
      fetchMeetings();
    };

    const handleCheckInSubmitted = () => {
      console.log('Check-in submitted event received, refreshing meetings...');
      // Refresh after a short delay to ensure backend has processed
      setTimeout(() => {
        fetchMeetings();
      }, 1000);
    };

    window.addEventListener('marketingMeetingsUpdated', handleMeetingUpdate);
    window.addEventListener('checkInSubmitted', handleCheckInSubmitted);
    return () => {
      window.removeEventListener('marketingMeetingsUpdated', handleMeetingUpdate);
      window.removeEventListener('checkInSubmitted', handleCheckInSubmitted);
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

  const handleUpdateDate = async () => {
    if (!editingMeeting || !newDate) {
      return;
    }

    try {
      setUpdating(true);
      const updateData = {
        meeting_date: newDate,
        ...(newTime && { meeting_time: newTime })
      };

      const response = await apiClient.put(
        API_ENDPOINTS.MARKETING_MEETING_UPDATE(editingMeeting.id),
        updateData
      );

      if (response && response.success) {
        // Refresh meetings list
        await fetchMeetings();
        // Dispatch event to refresh salesperson's assigned meetings
        try {
          window.dispatchEvent(new CustomEvent('marketingMeetingsUpdated'));
        } catch {}
        
        setEditingMeeting(null);
        setNewDate('');
        setNewTime('');
      } else {
        setError(response?.message || 'Failed to update meeting date');
      }
    } catch (err) {
      console.error('Error updating meeting date:', err);
      setError(err.data?.message || err.message || 'Failed to update meeting date');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (!window.confirm('Are you sure you want to delete this meeting? This will remove it from the salesperson\'s assigned meetings as well.')) {
      return;
    }

    try {
      setDeletingMeetingId(meetingId);
      const response = await apiClient.delete(API_ENDPOINTS.MARKETING_MEETING_DELETE(meetingId));

      if (response && response.success) {
        // Refresh meetings list
        await fetchMeetings();
        // Dispatch event to refresh salesperson's assigned meetings
        try {
          window.dispatchEvent(new CustomEvent('marketingMeetingsUpdated'));
        } catch {}
      } else {
        setError(response?.message || 'Failed to delete meeting');
      }
    } catch (err) {
      console.error('Error deleting meeting:', err);
      setError(err.data?.message || err.message || 'Failed to delete meeting');
    } finally {
      setDeletingMeetingId(null);
    }
  };

  const openDateEditor = (meeting) => {
    setEditingMeeting(meeting);
    // Set current date and time as defaults
    const currentDate = meeting.meeting_date ? meeting.meeting_date.split('T')[0] : new Date().toISOString().split('T')[0];
    const currentTime = meeting.meeting_time || '';
    setNewDate(currentDate);
    setNewTime(currentTime);
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In Photo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                          {meeting.is_checked_in || meeting.has_checkin || meeting.status === 'Completed' ? (
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          {meeting.checkin_photo_url ? (
                            <img
                              src={meeting.checkin_photo_url}
                              alt="Check-in photo"
                              className="h-16 w-16 object-cover rounded-lg cursor-pointer hover:opacity-80 border border-gray-200"
                              onClick={() => window.open(meeting.checkin_photo_url, '_blank')}
                              title="Click to view full size"
                            />
                          ) : (
                            <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                              <Camera className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openDateEditor(meeting)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Update Date"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMeeting(meeting.id)}
                              disabled={deletingMeetingId === meeting.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete Meeting"
                            >
                              {deletingMeetingId === meeting.id ? (
                                <Loader className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

      {/* Date Update Modal */}
      {editingMeeting && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Update Meeting Date</h3>
              <button
                onClick={() => {
                  setEditingMeeting(null);
                  setNewDate('');
                  setNewTime('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {editingMeeting.customer_name || editingMeeting.lead_customer || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned To
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {editingMeeting.assigned_to}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Meeting Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Meeting Time (Optional)
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdateDate}
                  disabled={updating || !newDate}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {updating ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    'Update Date'
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditingMeeting(null);
                    setNewDate('');
                    setNewTime('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
