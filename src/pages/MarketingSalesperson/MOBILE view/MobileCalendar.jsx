import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, Clock, User, Phone, MapPin,
  Tag, Eye, CheckCircle, XCircle, AlertCircle, RefreshCw, X
} from 'lucide-react';
import { useMarketingSharedData } from '../MarketingSharedDataContext';
import { useAuth } from '../../../hooks/useAuth';
import apiClient from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../api/admin_api/api';

const MobileCalendar = () => {
  const { customers: leads, loading } = useMarketingSharedData();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'list'
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
  for (let i = 0; i < safeFirstDay; i++) {
    calendarDays.push(null);
  }
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
  const checkInEvents = useMemo(() => {
    return checkIns.map((checkIn) => {
      const checkInDate = checkIn.check_in_time 
        ? new Date(checkIn.check_in_time)
        : (checkIn.meeting_date ? new Date(checkIn.meeting_date) : new Date());
      
      const year = checkInDate.getFullYear();
      const month = String(checkInDate.getMonth() + 1).padStart(2, '0');
      const day = String(checkInDate.getDate()).padStart(2, '0');
      const assignedDate = `${year}-${month}-${day}`;
      
      let visitingStatus = 'Scheduled';
      if (checkIn.status === 'Verified') {
        visitingStatus = 'Visited';
      } else if (checkIn.status === 'Rejected') {
        visitingStatus = 'Not Visited';
      }
      
      let finalStatus = 'Pending';
      if (checkIn.status === 'Verified') {
        finalStatus = 'Interested';
      } else if (checkIn.status === 'Rejected') {
        finalStatus = 'Not Interested';
      }
      
      const isDeleted = checkIn.lead_is_deleted === true || checkIn.lead_is_deleted === 'true' || checkIn.lead_is_deleted === 1;
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
        isCheckIn: true
      };
    });
  }, [checkIns]);

  // Transform assigned meetings to calendar events
  const meetingEvents = useMemo(() => {
    const checkInMeetingIds = new Set();
    const checkInKeys = new Set();
    
    checkInEvents.forEach(ci => {
      if (ci.meetingId) {
        checkInMeetingIds.add(ci.meetingId);
      }
      if (ci.id) {
        checkInMeetingIds.add(ci.id);
      }
      if (ci.name && ci.assignedDate) {
        const key = `${ci.name.toLowerCase().trim()}_${ci.assignedDate}`;
        checkInKeys.add(key);
      }
    });

    return assignedMeetings.map((meeting) => {
      const meetingDate = meeting.meeting_date 
        ? new Date(meeting.meeting_date)
        : (meeting.scheduled_date 
          ? new Date(meeting.scheduled_date)
          : (meeting.created_at ? new Date(meeting.created_at) : new Date()));
      
      const year = meetingDate.getFullYear();
      const month = String(meetingDate.getMonth() + 1).padStart(2, '0');
      const day = String(meetingDate.getDate()).padStart(2, '0');
      const assignedDate = `${year}-${month}-${day}`;
      
      let visitingStatus = 'Scheduled';
      if (meeting.status === 'Completed' || meeting.has_checkin) {
        visitingStatus = 'Visited';
      } else if (meeting.status === 'Cancelled') {
        visitingStatus = 'Cancelled';
      }
      
      let finalStatus = 'Pending';
      if (meeting.checkin_status === 'Verified') {
        finalStatus = 'Interested';
      } else if (meeting.checkin_status === 'Rejected') {
        finalStatus = 'Not Interested';
      }
      
      const isDeleted = meeting.lead_is_deleted === true || meeting.lead_is_deleted === 'true' || meeting.lead_is_deleted === 1;
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
        checkInTime: null,
        checkInStatus: meeting.checkin_status || null,
        photoUrl: meeting.checkin_photo_url || null,
        latitude: meeting.checkin_latitude || null,
        longitude: meeting.checkin_longitude || null,
        isDeleted: isDeleted,
        deletedAt: meeting.lead_deleted_at || null,
        isCheckIn: false,
        meetingStatus: meeting.status,
        meetingDate: meeting.meeting_date,
        scheduledDate: meeting.scheduled_date
      };
    }).filter(meeting => {
      if (meeting.id && checkInMeetingIds.has(meeting.id)) {
        return false;
      }
      if (meeting.meetingId && checkInMeetingIds.has(meeting.meetingId)) {
        return false;
      }
      if (meeting.name && meeting.assignedDate) {
        const key = `${meeting.name.toLowerCase().trim()}_${meeting.assignedDate}`;
        if (checkInKeys.has(key)) {
          return false;
        }
      }
      if (meeting.meetingStatus === 'Completed' && meeting.checkInStatus) {
        return false;
      }
      return true;
    });
  }, [assignedMeetings, checkInEvents]);

  // Combine check-ins and meetings
  const effectiveLeads = useMemo(() => {
    return [...checkInEvents, ...meetingEvents];
  }, [checkInEvents, meetingEvents]);

  // Local date helpers
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
      const rawDate = lead?.assignedDate;
      if (!rawDate) return false;
      const assigned = parseAssignedDate(rawDate);
      if (!assigned) return false;
      return assigned >= dayStart && assigned <= dayEnd;
    });
  };

  // Get all dates with events for list view
  const datesWithEvents = useMemo(() => {
    const dateMap = new Map();
    effectiveLeads.forEach(lead => {
      if (lead.assignedDate) {
        const date = parseAssignedDate(lead.assignedDate);
        if (date) {
          const dateKey = date.toDateString();
          if (!dateMap.has(dateKey)) {
            dateMap.set(dateKey, { date, leads: [] });
          }
          dateMap.get(dateKey).leads.push(lead);
        }
      }
    });
    return Array.from(dateMap.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [effectiveLeads]);

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Interested': return 'bg-green-100 text-green-800 border-green-200';
      case 'Not Interested': return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get visiting status color
  const getVisitingStatusColor = (status) => {
    switch (status) {
      case 'Visited': return 'bg-green-100 text-green-800 border-green-200';
      case 'Scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Not Visited': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (loading || checkInsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h1 className="text-lg font-bold text-gray-900">Calendar</h1>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setViewMode('month')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              List
            </button>
          </div>

          {/* Month Navigation */}
          {viewMode === 'month' && (
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h2 className="text-base font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {viewMode === 'month' ? (
          <>
            {/* Calendar Grid */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
              <div className="grid grid-cols-7 bg-gray-50 border-b">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                  <div key={idx} className="p-2 text-center text-xs font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <div key={index} className="h-16 border-r border-b border-gray-100"></div>;
                  }
                  const dayLeads = getLeadsForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isSelected = date.toDateString() === selectedDate.toDateString();
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`h-16 border-r border-b border-gray-100 p-1 cursor-pointer transition-colors ${
                        isToday ? 'bg-blue-50' : ''
                      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-xs font-medium ${
                          isToday ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {date.getDate()}
                        </span>
                        {dayLeads.length > 0 && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 px-1 py-0.5 rounded-full">
                            {dayLeads.length}
                          </span>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        {dayLeads.slice(0, 1).map((lead, leadIndex) => (
                          <div 
                            key={leadIndex} 
                            className={`text-[9px] p-0.5 rounded truncate ${
                              lead.isCheckIn 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            } ${lead.isDeleted ? 'opacity-50 line-through' : ''}`}
                          >
                            {lead.name.substring(0, 8)}
                          </div>
                        ))}
                        {dayLeads.length > 1 && (
                          <div className="text-[9px] text-gray-500">
                            +{dayLeads.length - 1}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Events */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  {formatDate(selectedDate)}
                </h3>
                <button
                  onClick={goToToday}
                  className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                >
                  Today
                </button>
              </div>

              {getLeadsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">No meetings or check-ins</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {getLeadsForDate(selectedDate).map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => {
                        setSelectedLeadDetails(lead);
                        setShowLeadPanel(true);
                      }}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        lead.isDeleted ? 'opacity-50 bg-gray-50 border-gray-200' : ''
                      } ${lead.isCheckIn ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium mb-1 ${
                            lead.isDeleted ? 'text-gray-400 line-through' : 'text-gray-900'
                          }`}>
                            {lead.name}
                          </h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            {!lead.isCheckIn && !lead.isDeleted && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-600 border border-blue-200">
                                Assigned
                              </span>
                            )}
                            {lead.isDeleted && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-600 border border-red-200">
                                Deleted
                              </span>
                            )}
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${getVisitingStatusColor(lead.visitingStatus)}`}>
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
                        <Eye className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        {lead.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                        {lead.address && (
                          <div className="flex items-start gap-1">
                            <MapPin className="h-3 w-3 mt-0.5" />
                            <span className="line-clamp-1">{lead.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* List View */
          <div className="space-y-3">
            {datesWithEvents.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No meetings or check-ins found</p>
              </div>
            ) : (
              datesWithEvents.map(({ date, leads }) => (
                <div key={date.toDateString()} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">{formatDate(date)}</h3>
                    <p className="text-xs text-gray-500">{leads.length} {leads.length === 1 ? 'event' : 'events'}</p>
                  </div>
                  <div className="p-3 space-y-2">
                    {leads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => {
                          setSelectedLeadDetails(lead);
                          setShowLeadPanel(true);
                        }}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          lead.isDeleted ? 'opacity-50 bg-gray-50 border-gray-200' : ''
                        } ${lead.isCheckIn ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium mb-1 ${
                              lead.isDeleted ? 'text-gray-400 line-through' : 'text-gray-900'
                            }`}>
                              {lead.name}
                            </h4>
                            <div className="flex items-center gap-2 flex-wrap">
                              {!lead.isCheckIn && !lead.isDeleted && (
                                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-600 border border-blue-200">
                                  Assigned
                                </span>
                              )}
                              {lead.isDeleted && (
                                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-600 border border-red-200">
                                  Deleted
                                </span>
                              )}
                              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${getVisitingStatusColor(lead.visitingStatus)}`}>
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
                          <Eye className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        </div>
                        <div className="space-y-1 text-xs text-gray-600">
                          {lead.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                          {lead.address && (
                            <div className="flex items-start gap-1">
                              <MapPin className="h-3 w-3 mt-0.5" />
                              <span className="line-clamp-1">{lead.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Lead Details Modal */}
      {showLeadPanel && selectedLeadDetails && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end"
          onClick={() => {
            setShowLeadPanel(false);
            setSelectedLeadDetails(null);
          }}
        >
          <div 
            className="bg-white w-full max-h-[90vh] rounded-t-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-900">Check-In Details</h2>
              <button
                onClick={() => {
                  setShowLeadPanel(false);
                  setSelectedLeadDetails(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
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
                    className={`w-full rounded-lg border border-gray-200 ${
                      selectedLeadDetails.isDeleted ? 'opacity-50' : ''
                    }`}
                    onClick={() => window.open(selectedLeadDetails.photoUrl, '_blank')}
                  />
                </div>
              )}
              
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Customer Name</div>
                  <div className={`text-sm font-medium flex items-center gap-2 ${
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
                {selectedLeadDetails.phone && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Phone</div>
                    <div className={`text-sm ${selectedLeadDetails.isDeleted ? 'text-gray-400' : 'text-gray-900'}`}>
                      {selectedLeadDetails.phone}
                    </div>
                  </div>
                )}
                {selectedLeadDetails.email && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Email</div>
                    <div className={`text-sm ${selectedLeadDetails.isDeleted ? 'text-gray-400' : 'text-gray-900'}`}>
                      {selectedLeadDetails.email}
                    </div>
                  </div>
                )}
                {selectedLeadDetails.address && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Address</div>
                    <div className={`text-sm ${selectedLeadDetails.isDeleted ? 'text-gray-400' : 'text-gray-900'}`}>
                      {selectedLeadDetails.address}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Check-In Status</div>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
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
                  <div className="text-xs text-gray-500 mb-1">Visiting Status</div>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getVisitingStatusColor(selectedLeadDetails.visitingStatus)}`}>
                    {selectedLeadDetails.visitingStatus}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {selectedLeadDetails.productType && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Product Type</div>
                  <div className="text-sm text-gray-900">{selectedLeadDetails.productType}</div>
                </div>
              )}
              
              {selectedLeadDetails.notes && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Notes</div>
                  <div className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                    {selectedLeadDetails.notes}
                  </div>
                </div>
              )}
              
              <div>
                <div className="text-xs text-gray-500 mb-1">Check-In Date</div>
                <div className="text-sm text-gray-900">
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

              {/* Location */}
              {(selectedLeadDetails.latitude && selectedLeadDetails.longitude) && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Location</div>
                  <a 
                    href={`https://www.google.com/maps?q=${selectedLeadDetails.latitude},${selectedLeadDetails.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {selectedLeadDetails.latitude}, {selectedLeadDetails.longitude} (Open in Maps)
                  </a>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowLeadPanel(false);
                  setSelectedLeadDetails(null);
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileCalendar;

