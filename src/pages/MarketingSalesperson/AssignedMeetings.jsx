import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, User, Phone, Mail, CheckCircle, XCircle, AlertCircle, Camera, Loader, Search, Filter } from 'lucide-react';
import { API_ENDPOINTS } from '../../api/admin_api/api';
import apiClient from '../../utils/apiClient';
import CheckInInterface from './CheckInInterface';

export default function AssignedMeetings({ setActiveView }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchMeetings();
    
    // Listen for meeting updates
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
      console.log('Fetching assigned meetings from:', API_ENDPOINTS.MARKETING_MEETINGS_ASSIGNED());
      const response = await apiClient.get(API_ENDPOINTS.MARKETING_MEETINGS_ASSIGNED());
      console.log('Assigned meetings API response:', response);
      
      // apiClient.get() returns data directly, not wrapped in response.data
      if (response && response.success) {
        const meetingsData = response.data || [];
        console.log('Setting meetings data:', meetingsData);
        console.log('Sample meeting data:', meetingsData[0]);
        // Ensure all meetings have required fields
        const enrichedMeetings = meetingsData.map(meeting => {
          // Log each meeting to debug
          console.log('Processing meeting:', {
            id: meeting.id,
            customer_name: meeting.customer_name,
            address: meeting.address,
            lead_customer: meeting.lead_customer,
            lead_address: meeting.lead_address,
            customer: meeting.customer,
            allKeys: Object.keys(meeting)
          });
          
          return {
            ...meeting,
            // Use multiple fallbacks to ensure we get the name
            customer_name: meeting.customer_name || meeting.customer || meeting.lead_customer || 'N/A',
            // Use multiple fallbacks to ensure we get the address
            address: meeting.address || meeting.lead_address || 'Address not provided',
            customer_phone: meeting.customer_phone || meeting.phone || meeting.lead_phone || null,
            customer_email: meeting.customer_email || meeting.email || meeting.lead_email || null,
            // Check-in status: check if meeting has check-in or status is Completed
            is_checked_in: meeting.is_checked_in || meeting.has_checkin || meeting.status === 'Completed' || false,
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
    }
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
    console.log('Check-in completed, refreshing meetings...');
    setShowCheckIn(false);
    setSelectedMeeting(null);
    // Refresh meetings to show updated status (stays on assigned meetings page)
    // Small delay to ensure backend has processed the check-in
    setTimeout(() => {
      fetchMeetings();
    }, 500);
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (showCheckIn && selectedMeeting) {
    return (
      <CheckInInterface 
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Assigned Meetings</h1>
        <p className="text-gray-600">View and check in to your assigned or imported customer leads</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name or address..."
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-3" />
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={fetchMeetings}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No meetings match your filters' : 'No meetings assigned'}
          </p>
          <p className="text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'You don\'t have any assigned meetings yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {meeting.customer_name || meeting.customer || 'N/A'}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(meeting.meeting_date)}</span>
                    </div>
                    {meeting.meeting_time && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(meeting.meeting_time)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(meeting.status)}`}>
                  {getStatusIcon(meeting.status)}
                  <span>{meeting.status}</span>
                </div>
              </div>

              {(meeting.address || meeting.lead_address) && (
                <div className="flex items-start gap-2 mb-4 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="flex-1">{meeting.address || meeting.lead_address || 'Address not provided'}</span>
                </div>
              )}

              {(meeting.customer_phone || meeting.customer_email) && (
                <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-500">
                  {meeting.customer_phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{meeting.customer_phone}</span>
                    </div>
                  )}
                  {meeting.customer_email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{meeting.customer_email}</span>
                    </div>
                  )}
                </div>
              )}

              {meeting.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  <strong>Notes:</strong> {meeting.notes}
                </div>
              )}

              {!meeting.is_checked_in && meeting.status !== 'Completed' && meeting.status !== 'Cancelled' && (
                <button
                  onClick={() => handleCheckIn(meeting)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <Camera className="h-5 w-5" />
                  <span>Check In</span>
                </button>
              )}

              {(meeting.is_checked_in || meeting.status === 'Completed') && (
                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                  <CheckCircle className="h-5 w-5" />
                  <span>Checked In</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

