import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Tag,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useMarketingSharedData } from './MarketingSharedDataContext';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../api/admin_api/api';

const MarketingSalespersonCalendar = () => {
  const { customers: leads, loading, updateCustomer } = useMarketingSharedData();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'month' or 'week'
  const [showLeadPanel, setShowLeadPanel] = useState(false);
  const [selectedLeadDetails, setSelectedLeadDetails] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [checkInsLoading, setCheckInsLoading] = useState(true);
  const [assignedMeetings, setAssignedMeetings] = useState([]);
  const [meetingsLoading, setMeetingsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const safeFirstDay = Number.isNaN(firstDayOfMonth) ? 0 : firstDayOfMonth;

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < safeFirstDay; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    calendarDays.push(date);
  }

  // Fetch check-ins from API
  const fetchCheckIns = async () => {
    try {
      setCheckInsLoading(true);
      const response = await apiClient.get(API_ENDPOINTS.MARKETING_CHECK_INS_MY_CHECKINS());
      
      if (response && response.success) {
        const checkInsData = response.data || [];
        setCheckIns(checkInsData);
      } else {
        console.error('Failed to fetch check-ins:', response?.message);
        setCheckIns([]);
      }
    } catch (err) {
      console.error('Error fetching check-ins:', err);
      setCheckIns([]);
    } finally {
      setCheckInsLoading(false);
    }
  };

  // Fetch assigned meetings from API
  const fetchAssignedMeetings = async () => {
    try {
      setMeetingsLoading(true);
      const response = await apiClient.get(API_ENDPOINTS.MARKETING_MEETINGS_ASSIGNED());
      
      if (response && response.success) {
        const meetingsData = response.data || [];
        setAssignedMeetings(meetingsData);
      } else {
        console.error('Failed to fetch assigned meetings:', response?.message);
        setAssignedMeetings([]);
      }
    } catch (err) {
      console.error('Error fetching assigned meetings:', err);
      setAssignedMeetings([]);
    } finally {
      setMeetingsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await Promise.all([fetchCheckIns(), fetchAssignedMeetings()]);
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch check-ins and meetings on component mount and listen for updates
  useEffect(() => {
    fetchCheckIns();
    fetchAssignedMeetings();
    
    const handleCheckInSubmitted = () => {
      setTimeout(() => {
        fetchCheckIns();
        fetchAssignedMeetings();
      }, 1000);
    };
    
    const handleCheckInRejected = () => {
      setTimeout(() => {
        fetchCheckIns();
        fetchAssignedMeetings();
      }, 1000);
    };
    
    const handleMeetingsUpdated = () => {
      setTimeout(() => {
        fetchCheckIns();
        fetchAssignedMeetings();
      }, 1000);
    };
    
    window.addEventListener('checkInSubmitted', handleCheckInSubmitted);
    window.addEventListener('checkInRejected', handleCheckInRejected);
    window.addEventListener('marketingMeetingsUpdated', handleMeetingsUpdated);
    
    return () => {
      window.removeEventListener('checkInSubmitted', handleCheckInSubmitted);
      window.removeEventListener('checkInRejected', handleCheckInRejected);
      window.removeEventListener('marketingMeetingsUpdated', handleMeetingsUpdated);
    };
  }, []);

  // Transform check-ins to calendar events
  const checkInEvents = React.useMemo(() => {
    return checkIns.map((checkIn) => {
      // Extract date from check_in_time
      const checkInDate = checkIn.check_in_time 
        ? new Date(checkIn.check_in_time)
        : (checkIn.meeting_date ? new Date(checkIn.meeting_date) : new Date());
      
      // Format date as YYYY-MM-DD
      const year = checkInDate.getFullYear();
      const month = String(checkInDate.getMonth() + 1).padStart(2, '0');
      const day = String(checkInDate.getDate()).padStart(2, '0');
      const assignedDate = `${year}-${month}-${day}`;
      
      // Map check-in status to visiting status
      let visitingStatus = 'Scheduled';
      if (checkIn.status === 'Verified') {
        visitingStatus = 'Visited';
      } else if (checkIn.status === 'Rejected') {
        visitingStatus = 'Not Visited';
      }
      
      // Map check-in status to final status
      let finalStatus = 'Pending';
      if (checkIn.status === 'Verified') {
        finalStatus = 'Interested';
      } else if (checkIn.status === 'Rejected') {
        finalStatus = 'Not Interested';
      }
      
      // Check if lead is deleted
      const isDeleted = checkIn.lead_is_deleted === true || checkIn.lead_is_deleted === 'true' || checkIn.lead_is_deleted === 1;
      
      // Prefer meeting_id as the unique key so we don't duplicate with the meeting record
      const meetingId = checkIn.meeting_id || checkIn.meetingId || checkIn.meetingid;

      return {
        id: meetingId || checkIn.id,
        meetingId: meetingId || null,
        name: checkIn.customer_name || 'Unknown Customer',
        phone: checkIn.customer_phone || checkIn.phone || '',
        email: checkIn.customer_email || checkIn.email || '',
        address: checkIn.address || checkIn.meeting_address || '',
        productType: checkIn.product_type || '',
        visitingStatus: visitingStatus,
        finalStatus: finalStatus,
        notes: checkIn.notes || '',
        remark: checkIn.notes || '',
        assignedDate: assignedDate,
        checkInTime: checkIn.check_in_time,
        checkInStatus: checkIn.status,
        photoUrl: checkIn.photo_url,
        latitude: checkIn.latitude,
        longitude: checkIn.longitude,
        isDeleted: isDeleted,
        deletedAt: checkIn.lead_deleted_at,
        isCheckIn: true // Mark as check-in
      };
    });
  }, [checkIns]);

  // Transform assigned meetings to calendar events
  const meetingEvents = React.useMemo(() => {
    // Build a set of meetingIds that already have check-ins
    const checkInMeetingIds = new Set();
    const checkInKeys = new Set(); // For matching by customer name + date
    
    checkInEvents.forEach(ci => {
      if (ci.meetingId) {
        checkInMeetingIds.add(ci.meetingId);
      }
      if (ci.id) {
        checkInMeetingIds.add(ci.id);
      }
      // Also add a composite key for matching: customer name + date
      if (ci.name && ci.assignedDate) {
        const key = `${ci.name.toLowerCase().trim()}_${ci.assignedDate}`;
        checkInKeys.add(key);
      }
    });

    return assignedMeetings.map((meeting) => {
      // Use meeting_date or scheduled_date, fallback to created_at
      const meetingDate = meeting.meeting_date 
        ? new Date(meeting.meeting_date)
        : (meeting.scheduled_date 
          ? new Date(meeting.scheduled_date)
          : (meeting.created_at ? new Date(meeting.created_at) : new Date()));
      
      // Format date as YYYY-MM-DD
      const year = meetingDate.getFullYear();
      const month = String(meetingDate.getMonth() + 1).padStart(2, '0');
      const day = String(meetingDate.getDate()).padStart(2, '0');
      const assignedDate = `${year}-${month}-${day}`;
      
      // Determine visiting status based on meeting status and check-in
      let visitingStatus = 'Scheduled';
      if (meeting.status === 'Completed' || meeting.has_checkin) {
        visitingStatus = 'Visited';
      } else if (meeting.status === 'Cancelled') {
        visitingStatus = 'Cancelled';
      }
      
      // Determine final status
      let finalStatus = 'Pending';
      if (meeting.checkin_status === 'Verified') {
        finalStatus = 'Interested';
      } else if (meeting.checkin_status === 'Rejected') {
        finalStatus = 'Not Interested';
      }
      
      // Check if lead is deleted
      const isDeleted = meeting.lead_is_deleted === true || meeting.lead_is_deleted === 'true' || meeting.lead_is_deleted === 1;
      
      // Prefer meeting_id for consistency with check-ins
      const meetingId = meeting.meeting_id || meeting.id;
      const customerName = meeting.customer_name || meeting.customer || meeting.lead_customer || 'Unknown Customer';

      return {
        id: meetingId,
        meetingId: meetingId,
        name: customerName,
        phone: meeting.customer_phone || meeting.phone || meeting.lead_phone || '',
        email: meeting.customer_email || meeting.email || meeting.lead_email || '',
        address: meeting.address || meeting.lead_address || 'Address not provided',
        productType: meeting.product_type || '',
        visitingStatus: visitingStatus,
        finalStatus: finalStatus,
        notes: meeting.notes || '',
        remark: meeting.notes || '',
        assignedDate: assignedDate,
        checkInTime: null, // No check-in yet
        checkInStatus: meeting.checkin_status || null,
        photoUrl: meeting.checkin_photo_url || null,
        latitude: meeting.checkin_latitude || null,
        longitude: meeting.checkin_longitude || null,
        isDeleted: isDeleted,
        deletedAt: meeting.lead_deleted_at || null,
        isCheckIn: false, // Mark as meeting (not check-in)
        meetingStatus: meeting.status,
        meetingDate: meeting.meeting_date,
        scheduledDate: meeting.scheduled_date
      };
    }).filter(meeting => {
      // Skip meetings that have check-ins
      // Check by meeting ID first
      if (meeting.id && checkInMeetingIds.has(meeting.id)) {
        return false;
      }
      if (meeting.meetingId && checkInMeetingIds.has(meeting.meetingId)) {
        return false;
      }
      // Also check by customer name + date as fallback
      if (meeting.name && meeting.assignedDate) {
        const key = `${meeting.name.toLowerCase().trim()}_${meeting.assignedDate}`;
        if (checkInKeys.has(key)) {
          return false;
        }
      }
      // Only show meetings that don't have check-ins
      // Also filter out meetings that are already completed with check-ins
      if (meeting.meetingStatus === 'Completed' && meeting.checkInStatus) {
        return false; // Don't show completed meetings that have check-ins
      }
      return true;
    });
  }, [assignedMeetings, checkInEvents]);

  // Combine check-ins and meetings, removing duplicates (prefer check-ins over meetings)
  const effectiveLeads = React.useMemo(() => {
    // meetingEvents are already filtered to exclude ones with check-ins
    return [...checkInEvents, ...meetingEvents];
  }, [checkInEvents, meetingEvents]);

  // Local date helpers to avoid timezone shifting issues
  const toLocalYMD = (input) => {
    if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
    const dt = input instanceof Date ? input : new Date(input);
    if (!(dt instanceof Date) || Number.isNaN(dt.getTime())) return null;
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const d = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const parseAssignedDate = (raw) => {
    if (!raw) return null;
    if (typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      const [y, m, d] = raw.split('-').map(n => parseInt(n, 10));
      return new Date(y, m - 1, d, 0, 0, 0, 0);
    }
    const dt = new Date(raw);
    return Number.isNaN(dt.getTime()) ? null : dt;
  };

  // Filter leads by date
  const getLeadsForDate = (date) => {
    if (!effectiveLeads || !(date instanceof Date)) return [];
    const dateTime = date.getTime();
    if (Number.isNaN(dateTime)) return [];

    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

    return effectiveLeads.filter((lead) => {
      // STRICT: show only leads explicitly assigned for a date
      const rawDate = lead?.assignedDate;
      if (!rawDate) return false;
      const assigned = parseAssignedDate(rawDate);
      if (!assigned) return false;
      return assigned >= dayStart && assigned <= dayEnd;
    });
  };

  // Get leads for selected date
  const selectedDateLeads = getLeadsForDate(selectedDate);

  // Guard against missing leads array shape
  const safeLeads = Array.isArray(leads) ? leads : [];

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Week helpers
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0=Sun
    const diff = d.getDate() - day;
    return new Date(d.getFullYear(), d.getMonth(), diff);
  };

  const currentWeekStart = getStartOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(currentWeekStart.getDate() + i);
    return d;
  });

  const goToPreviousWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const goToNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Interested': return 'bg-green-100 text-green-800';
      case 'Not Interested': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get visiting status color
  const getVisitingStatusColor = (status) => {
    switch (status) {
      case 'Visited': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Not Visited': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  if (loading || checkInsLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pl-0 pr-6 py-6">
      <div className="w-full">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-blue-600" />
              Check-In Calendar
            </h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
                title="Refresh calendar data"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : 'text-gray-600'}`} />
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  viewMode === 'month' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Month View
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  viewMode === 'week' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Week View
              </button>
            </div>
          </div>

      {/* Lead details slide-over */}
      {showLeadPanel && selectedLeadDetails && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black bg-opacity-30" onClick={() => setShowLeadPanel(false)}></div>
          <aside className="w-full max-w-md bg-white h-full shadow-xl overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Check-In Details</h3>
              <button onClick={() => setShowLeadPanel(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              {/* Deleted Lead Banner */}
              {selectedLeadDetails.isDeleted && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-r-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">This lead has been deleted by the marketing head</span>
                </div>
              )}
              
              {/* Check-in Photo */}
              {selectedLeadDetails.photoUrl && (
              <div>
                  <div className="text-xs text-gray-500 mb-2">Check-In Photo</div>
                  <img 
                    src={selectedLeadDetails.photoUrl} 
                    alt="Check-in" 
                    className={`w-full rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 ${
                      selectedLeadDetails.isDeleted ? 'opacity-50' : ''
                    }`}
                    onClick={() => window.open(selectedLeadDetails.photoUrl, '_blank')}
                  />
                </div>
              )}
              
              <div>
                <div className="text-xs text-gray-500">Customer Name</div>
                <div className={`font-medium flex items-center gap-2 ${
                  selectedLeadDetails.isDeleted ? 'text-gray-400 line-through' : 'text-gray-900'
                }`}>
                  {selectedLeadDetails.name}
                  {selectedLeadDetails.isDeleted && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600 border border-red-200">
                      Deleted Lead
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Phone</div>
                <div className={selectedLeadDetails.isDeleted ? 'text-gray-400' : 'text-gray-900'}>{selectedLeadDetails.phone}</div>
              </div>
              {selectedLeadDetails.email && (
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className={selectedLeadDetails.isDeleted ? 'text-gray-400' : 'text-gray-900'}>{selectedLeadDetails.email}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-gray-500">Address</div>
                <div className={selectedLeadDetails.isDeleted ? 'text-gray-400' : 'text-gray-900'}>{selectedLeadDetails.address || '-'}</div>
              </div>
              
              {/* Location Coordinates */}
              {(selectedLeadDetails.latitude && selectedLeadDetails.longitude) && (
                <div>
                  <div className="text-xs text-gray-500">Location</div>
                  <div className="text-gray-900">
                    {selectedLeadDetails.latitude}, {selectedLeadDetails.longitude}
                    <a 
                      href={`https://www.google.com/maps?q=${selectedLeadDetails.latitude},${selectedLeadDetails.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:underline"
                    >
                      (Open in Maps)
                    </a>
              </div>
        </div>
      )}

              <div className="grid grid-cols-2 gap-3">
              <div>
                  <div className="text-xs text-gray-500">Check-In Status</div>
                  <div className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                    selectedLeadDetails.checkInStatus === 'Verified' 
                      ? 'bg-green-100 text-green-800'
                      : selectedLeadDetails.checkInStatus === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedLeadDetails.checkInStatus || 'Pending'}
              </div>
              </div>
              <div>
                  <div className="text-xs text-gray-500">Visiting Status</div>
                  <div className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getVisitingStatusColor(selectedLeadDetails.visitingStatus)}`}>
                    {selectedLeadDetails.visitingStatus}
              </div>
              </div>
              </div>
              
              {selectedLeadDetails.productType && (
                <div>
                  <div className="text-xs text-gray-500">Product Type</div>
                  <div className="text-gray-900">{selectedLeadDetails.productType}</div>
                </div>
              )}
              
              {selectedLeadDetails.notes && (
                <div>
                  <div className="text-xs text-gray-500">Notes</div>
                  <div className="text-gray-900 whitespace-pre-wrap break-words">
                    {selectedLeadDetails.notes}
                </div>
              </div>
              )}
              
              <div>
                <div className="text-xs text-gray-500">Check-In Date</div>
                <div className="text-gray-900">
                  {selectedLeadDetails.checkInTime 
                    ? new Date(selectedLeadDetails.checkInTime).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : (selectedLeadDetails.assignedDate || 'N/A')}
              </div>
              </div>
              
              <div className="pt-2 flex gap-2">
                <button onClick={() => setShowLeadPanel(false)} className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">Close</button>
              </div>
            </div>
          </aside>
        </div>
      )}

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {viewMode === 'month' ? (
                <>
                  <button
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <button
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={goToPreviousWeek}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Week of {currentWeekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </h2>
                  <button
                    onClick={goToNextWeek}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              )}
            </div>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Today
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
                  {viewMode === 'month' ? (
                    <>
                      <div className="grid grid-cols-7 bg-gray-50 border-b">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                        {day}
                      </div>
                    ))}
                      </div>
                      <div className="grid grid-cols-7">
                    {calendarDays.map((date, index) => {
                      if (!date) {
                        return <div key={index} className="h-24 border-r border-b border-gray-200"></div>;
                      }
                      const dayLeads = getLeadsForDate(date);
                      const isToday = date.toDateString() === new Date().toDateString();
                      const isSelected = date.toDateString() === selectedDate.toDateString();
                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedDate(date)}
                            className={`h-28 border-r border-b border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                            isToday ? 'bg-blue-50' : ''
                          } ${isSelected ? 'bg-blue-100' : ''}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-medium ${
                              isToday ? 'text-blue-600' : 'text-gray-900'
                            }`}>
                              {date.getDate()}
                            </span>
                            {dayLeads.length > 0 && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                                {dayLeads.length}
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            {dayLeads.slice(0, 2).map((lead, leadIndex) => (
                              <div 
                                key={leadIndex} 
                                className={`text-xs p-1 rounded truncate ${
                                  lead.isCheckIn 
                                    ? 'bg-green-50 text-green-800' 
                                    : 'bg-blue-50 text-blue-800'
                                } ${
                                  lead.isDeleted ? 'opacity-50 line-through' : ''
                                }`} 
                                title={lead.name + (lead.isDeleted ? ' (Deleted)' : '') + (lead.isCheckIn ? ' (Checked In)' : ' (Assigned)')}
                              >
                                {lead.name}
                                {lead.isDeleted && <span className="ml-1 text-[9px] text-red-500">[D]</span>}
                                {!lead.isCheckIn && !lead.isDeleted && <span className="ml-1 text-[9px] text-blue-600">[A]</span>}
                              </div>
                            ))}
                            {dayLeads.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{dayLeads.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-7">
                  {weekDays.map((date, index) => {
                    const dayLeads = getLeadsForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isSelected = date.toDateString() === selectedDate.toDateString();
                    return (
                      <div
                        key={index}
                            className={`border-r border-gray-200 min-h-[360px] cursor-pointer ${isSelected ? 'ring-1 ring-blue-400' : ''}`}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className={`p-3 border-b ${isToday ? 'bg-blue-50' : 'bg-gray-50'}`}>
                          <div className="text-sm font-semibold text-gray-800">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className={`text-xs ${isToday ? 'text-blue-700' : 'text-gray-500'}`}>
                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                            <div className="p-2 space-y-2 max-h-[400px] overflow-auto">
                          {dayLeads.length === 0 ? (
                            <div className="text-xs text-gray-400 text-center py-6">No meetings or check-ins</div>
                          ) : (
                            dayLeads.map((lead) => (
                              <div 
                                key={lead.id} 
                                className={`bg-white border rounded-md p-2 shadow-sm hover:border-blue-300 transition-opacity ${
                                  lead.isDeleted ? 'opacity-50' : ''
                                } ${lead.isCheckIn ? 'border-green-200' : 'border-blue-200'}`}
                                onClick={() => { setSelectedLeadDetails(lead); setShowLeadPanel(true); }}
                              >
                                <div className="flex items-start justify-between mb-1">
                                  <div className="flex-1">
                                    <div className={`text-xs font-medium truncate ${
                                      lead.isDeleted ? 'text-gray-400 line-through' : 'text-gray-900'
                                    }`}>
                                      {lead.name}
                                    </div>
                                    <div className={`text-[11px] truncate ${
                                      lead.isDeleted ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                      {lead.phone}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {!lead.isCheckIn && !lead.isDeleted && (
                                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-blue-100 text-blue-600 border border-blue-200">
                                        Assigned
                                      </span>
                                    )}
                                    {lead.isDeleted && (
                                      <span className="ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-red-100 text-red-600 border border-red-200">
                                        Deleted
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getVisitingStatusColor(lead.visitingStatus)}`}>
                                    {lead.visitingStatus}
                                  </span>
                                  {lead.checkInStatus && (
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                                      lead.checkInStatus === 'Verified' 
                                        ? 'bg-green-100 text-green-800'
                                        : lead.checkInStatus === 'Rejected'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {lead.checkInStatus}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                    </div>
                  )}
            </div>
          </div>

          {/* Selected Date Leads */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Check-Ins for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>

              {selectedDateLeads.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No meetings or check-ins for this date</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateLeads.map((lead) => (
                    <div 
                      key={lead.id} 
                      className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                        lead.isDeleted ? 'opacity-50 bg-gray-50 border-gray-200' : ''
                      } ${lead.isCheckIn ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className={`font-medium truncate ${
                            lead.isDeleted ? 'text-gray-400 line-through' : 'text-gray-900'
                          }`}>
                            {lead.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {!lead.isCheckIn && !lead.isDeleted && (
                              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600 border border-blue-200">
                                Assigned Meeting
                              </span>
                            )}
                            {lead.isDeleted && (
                              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600 border border-red-200">
                                Deleted Lead
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            className="p-1 text-gray-400 hover:text-blue-600"
                            onClick={() => { setSelectedLeadDetails(lead); setShowLeadPanel(true); }}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className={`flex items-center ${lead.isDeleted ? 'text-gray-400' : 'text-gray-600'}`}>
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{lead.phone}</span>
                        </div>
                        
                        <div className={`flex items-center ${lead.isDeleted ? 'text-gray-400' : 'text-gray-600'}`}>
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="truncate">{lead.address}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVisitingStatusColor(lead.visitingStatus)}`}>
                            {lead.visitingStatus}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.finalStatus)}`}>
                            {lead.finalStatus}
                          </span>
                        </div>

                        {lead.productType && (
                          <div className="flex items-center text-gray-600">
                            <Tag className="w-4 h-4 mr-2" />
                            <span className="text-xs">{lead.productType}</span>
                          </div>
                        )}

                        {lead.checkInStatus && (
                          <div className="pt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              lead.checkInStatus === 'Verified' 
                                ? 'bg-green-100 text-green-800'
                                : lead.checkInStatus === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              Check-In: {lead.checkInStatus}
                            </span>
                        </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingSalespersonCalendar;

