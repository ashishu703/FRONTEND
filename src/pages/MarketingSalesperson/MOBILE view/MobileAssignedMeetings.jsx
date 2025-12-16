import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Phone, Mail, CheckCircle, XCircle, AlertCircle, Camera, Loader, Search, Filter, RefreshCw } from 'lucide-react';
import { API_ENDPOINTS } from '../../../api/admin_api/api';
import apiClient from '../../../utils/apiClient';
import MobileCheckIn from './MobileCheckIn';

export default function MobileAssignedMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchMeetings();
    
    // Listen for meeting updates, check-in submissions, and rejections
    const handleMeetingUpdate = () => {
      console.log('Meeting update event received, refreshing...');
      fetchMeetings();
    };
    
    const handleCheckInSubmitted = () => {
      console.log('Check-in submitted event received, refreshing...');
      // Refresh after a short delay to ensure backend has processed
      setTimeout(() => {
        fetchMeetings();
      }, 1000);
    };
    
    const handleCheckInRejected = (event) => {
      console.log('Check-in rejected event received, refreshing...', event.detail);
      // Refresh immediately to show rejection status
      fetchMeetings();
      setTimeout(() => {
        fetchMeetings();
      }, 1000);
    };
    
    window.addEventListener('marketingMeetingsUpdated', handleMeetingUpdate);
    window.addEventListener('checkInSubmitted', handleCheckInSubmitted);
    window.addEventListener('checkInRejected', handleCheckInRejected);
    return () => {
      window.removeEventListener('marketingMeetingsUpdated', handleMeetingUpdate);
      window.removeEventListener('checkInSubmitted', handleCheckInSubmitted);
      window.removeEventListener('checkInRejected', handleCheckInRejected);
    };
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching assigned meetings from:', API_ENDPOINTS.MARKETING_MEETINGS_ASSIGNED());
      const response = await apiClient.get(API_ENDPOINTS.MARKETING_MEETINGS_ASSIGNED());
      console.log('Assigned meetings API response:', response);
      
      // apiClient.get() returns data directly, not wrapped in response.data
      if (response && response.success) {
        const meetingsData = response.data || [];
        console.log('Setting meetings data:', meetingsData);
        // Ensure all meetings have required fields
        const enrichedMeetings = meetingsData.map(meeting => {
          return {
            ...meeting,
            // Use multiple fallbacks to ensure we get the name
            customer_name: meeting.customer_name || meeting.customer || meeting.lead_customer || 'N/A',
            // Use multiple fallbacks to ensure we get the address
            address: meeting.address || meeting.lead_address || 'Address not provided',
            customer_phone: meeting.customer_phone || meeting.phone || meeting.lead_phone || null,
            customer_email: meeting.customer_email || meeting.email || meeting.lead_email || null,
            // Check-in status: check if meeting has check-in or status is Completed
            // Also check if there's a check-in record (has_checkin flag from backend)
            // But exclude rejected check-ins - allow re-check-in if rejected
            checkin_status: meeting.checkin_status || null, // Store check-in status if available
            is_checked_in: (meeting.is_checked_in || meeting.has_checkin === true || meeting.status === 'Completed') && meeting.checkin_status !== 'Rejected' || false,
          };
        });
        console.log('Final enriched meetings:', enrichedMeetings);
        setMeetings(enrichedMeetings);
      } else {
        console.warn('API response indicates failure:', response);
        setError(response?.message || 'Failed to fetch meetings');
        setMeetings([]); // Ensure empty array on error
      }
    } catch (err) {
      console.error('Error fetching meetings:', err);
      console.error('Full error object:', {
        message: err.message,
        data: err.data,
        status: err.status,
        response: err.response
      });
      // apiClient throws errors with err.data or err.message
      const errorMessage = err.data?.message || err.message || err.response?.data?.message || 'Failed to fetch meetings';
      setError(errorMessage);
      setMeetings([]); // Ensure empty array on error
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMeetings();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  const handleCheckIn = (meeting) => {
    setSelectedMeeting(meeting);
    setShowCheckIn(true);
  };

  const handleCheckInComplete = () => {
    console.log('Check-in completed, updating meeting status...');
    
    // Close the check-in interface first (stays in AssignedMeetings view)
    setShowCheckIn(false);
    const completedMeetingId = selectedMeeting?.id;
    setSelectedMeeting(null);
    
    // Immediately update the local state to mark meeting as checked in
    if (completedMeetingId) {
      setMeetings(prevMeetings => 
        prevMeetings.map(meeting => 
          meeting.id === completedMeetingId
            ? { ...meeting, is_checked_in: true, status: 'Completed', has_checkin: true }
            : meeting
        )
      );
    }
    
    // Refresh meetings to get latest data from backend
    // Multiple refreshes to ensure we get the updated status
    setTimeout(() => {
      fetchMeetings();
    }, 500);
    
    // Second refresh after backend has more time to process
    setTimeout(() => {
      fetchMeetings();
    }, 2000);
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (showCheckIn && selectedMeeting) {
    return (
      <MobileCheckIn 
        meeting={selectedMeeting} 
        onComplete={handleCheckInComplete}
        onCancel={() => {
          setShowCheckIn(false);
          setSelectedMeeting(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Assigned Meetings</h1>
              <p className="text-sm text-gray-500 mt-1">View and check in to your assigned or imported customer leads</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
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
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={fetchMeetings}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium text-sm mb-1">
              {searchTerm || statusFilter !== 'all' ? 'No meetings match your filters' : 'No meetings assigned'}
            </p>
            <p className="text-xs text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'You don\'t have any assigned meetings yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {meeting.customer_name || meeting.customer || 'N/A'}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(meeting.meeting_date)}</span>
                      </div>
                      {meeting.meeting_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(meeting.meeting_time)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(meeting.status)}`}>
                    {getStatusIcon(meeting.status)}
                    <span>{meeting.status}</span>
                  </div>
                </div>

                {(meeting.address || meeting.lead_address) && (
                  <div className="flex items-start gap-2 mb-3 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="flex-1">{meeting.address || meeting.lead_address || 'Address not provided'}</span>
                  </div>
                )}

                {(meeting.customer_phone || meeting.customer_email) && (
                  <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-500">
                    {meeting.customer_phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{meeting.customer_phone}</span>
                      </div>
                    )}
                    {meeting.customer_email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate max-w-[150px]">{meeting.customer_email}</span>
                      </div>
                    )}
                  </div>
                )}

                {meeting.notes && (
                  <div className="mb-3 p-2 bg-gray-50 rounded-lg text-xs text-gray-600">
                    <strong>Notes:</strong> {meeting.notes}
                  </div>
                )}

                {(!meeting.is_checked_in && !meeting.has_checkin && meeting.status !== 'Completed' && meeting.status !== 'Cancelled') || meeting.checkin_status === 'Rejected' ? (
                  <div className="w-full">
                    {meeting.checkin_status === 'Rejected' && (
                      <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700 text-xs font-medium mb-1">
                          <XCircle className="h-3 w-3" />
                          <span>Check-in Rejected</span>
                        </div>
                        <p className="text-xs text-red-600">Please check in again</p>
                      </div>
                    )}
                    <button
                      onClick={() => handleCheckIn(meeting)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                      <span>{meeting.checkin_status === 'Rejected' ? 'Re-Check In' : 'Check In'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200">
                    <CheckCircle className="h-4 w-4" />
                    <span>Checked In</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
