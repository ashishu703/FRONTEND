import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, User, Phone, Mail, CheckCircle, XCircle, AlertCircle, Camera, Loader } from 'lucide-react';
import { API_ENDPOINTS } from '../../../api/admin_api/api';
import apiClient from '../../../utils/apiClient';
import MobileCheckIn from './MobileCheckIn';

export default function MobileAssignedMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showCheckIn, setShowCheckIn] = useState(false);

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
      const response = await apiClient.get(API_ENDPOINTS.MARKETING_MEETINGS_ASSIGNED());
      
      // apiClient.get() returns data directly, not wrapped in response.data
      if (response && response.success) {
        const meetingsData = response.data || [];
        // Enrich meetings with check-in status
        const enrichedMeetings = meetingsData.map(meeting => ({
          ...meeting,
          customer_name: meeting.customer_name || meeting.customer || meeting.lead_customer || 'N/A',
          address: meeting.address || meeting.lead_address || 'Address not provided',
          customer_phone: meeting.customer_phone || meeting.phone || meeting.lead_phone || null,
          customer_email: meeting.customer_email || meeting.email || meeting.lead_email || null,
          // Check-in status: check if meeting has check-in or status is Completed
          is_checked_in: meeting.is_checked_in || meeting.has_checkin || meeting.status === 'Completed' || false,
        }));
        setMeetings(enrichedMeetings);
      } else {
        setError(response?.message || 'Failed to fetch meetings');
      }
    } catch (err) {
      console.error('Error fetching meetings:', err);
      // apiClient throws errors with err.data or err.message
      const errorMessage = err.data?.message || err.message || err.response?.data?.message || 'Failed to fetch meetings';
      setError(errorMessage);
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
    return timeString.substring(0, 5); // HH:MM format
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
    <div className="p-4 pb-24">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">Assigned Meetings</h1>
        <p className="text-sm text-gray-500 mt-1">View and check in to your assigned or imported customer leads</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={fetchMeetings}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      ) : meetings.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No meetings assigned</p>
          <p className="text-sm text-gray-500 mt-1">You don't have any assigned meetings yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{meeting.customer_name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(meeting.meeting_date)}</span>
                    {meeting.meeting_time && (
                      <>
                        <Clock className="h-3 w-3 ml-2" />
                        <span>{formatTime(meeting.meeting_time)}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                  {getStatusIcon(meeting.status)}
                  <span>{meeting.status}</span>
                </div>
              </div>

              {meeting.address && (
                <div className="flex items-start gap-2 mb-3 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="flex-1">{meeting.address}</span>
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
                <div className="mb-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                  <strong>Notes:</strong> {meeting.notes}
                </div>
              )}

              {!meeting.is_checked_in && meeting.status !== 'Completed' && meeting.status !== 'Cancelled' && (
                <button
                  onClick={() => handleCheckIn(meeting)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <span>Check In</span>
                </button>
              )}

              {(meeting.is_checked_in || meeting.status === 'Completed') && (
                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                  <CheckCircle className="h-4 w-4" />
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

