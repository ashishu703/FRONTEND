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
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useMarketingSharedData } from './MarketingSharedDataContext';

const MarketingSalespersonCalendar = () => {
  const { customers: leads, loading, updateCustomer } = useMarketingSharedData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'month' or 'week'

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

  // Filter leads by date
  const getLeadsForDate = (date) => {
    if (!leads || !(date instanceof Date)) return [];
    const dateTime = date.getTime();
    if (Number.isNaN(dateTime)) return [];

    const dateStr = date.toISOString().split('T')[0];

    return leads.filter((lead) => {
      // Prefer head assigned or planned follow-up date for day grouping
      const rawDate = lead?.assignedDate || lead?.followUpDate || lead?.date || lead?.createdAt;
      if (!rawDate) return false;
      const leadDate = new Date(rawDate);
      if (Number.isNaN(leadDate.getTime())) return false;
      const leadDateStr = leadDate.toISOString().split('T')[0];
      return leadDateStr === dateStr;
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

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-blue-600" />
              Lead Calendar
            </h1>
            <div className="flex items-center space-x-2">
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
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                          className={`h-24 border-r border-b border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
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
                              <div key={leadIndex} className="text-xs p-1 bg-gray-100 rounded truncate" title={lead.name}>
                                {lead.name}
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
                        className={`border-r border-gray-200 min-h-[320px] cursor-pointer ${isSelected ? 'ring-1 ring-blue-400' : ''}`}
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
                        <div className="p-2 space-y-2 max-h-[360px] overflow-auto">
                          {dayLeads.length === 0 ? (
                            <div className="text-xs text-gray-400 text-center py-6">No leads</div>
                          ) : (
                            dayLeads.map((lead) => (
                              <div key={lead.id} className="bg-white border rounded-md p-2 shadow-sm">
                                <div className="text-xs font-medium text-gray-900 truncate">{lead.name}</div>
                                <div className="text-[11px] text-gray-600 truncate">{lead.phone}</div>
                                <div className="flex items-center justify-between mt-1">
                                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getVisitingStatusColor(lead.visitingStatus)}`}>
                                    {lead.visitingStatus}
                                  </span>
                                  {lead.visitingStatus !== 'Visited' ? (
                                    <button
                                      onClick={() => updateCustomer(lead.id, { visitingStatus: 'Visited', visitingStatusUpdated: new Date().toISOString() })}
                                      className="text-[10px] px-1.5 py-0.5 rounded bg-green-600 text-white hover:bg-green-700"
                                    >
                                      Visit Done
                                    </button>
                                  ) : (
                                    <span className="text-[10px] text-green-700">Visited</span>
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
                Leads for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>

              {selectedDateLeads.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No leads assigned for this date</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateLeads.map((lead) => (
                    <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 truncate">{lead.name}</h4>
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{lead.phone}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
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

                        <div className="pt-2 flex justify-end">
                          {lead.visitingStatus !== 'Visited' ? (
                            <button
                              onClick={() => updateCustomer(lead.id, { visitingStatus: 'Visited', visitingStatusUpdated: new Date().toISOString() })}
                              className="px-2 py-1 text-xs rounded-md bg-green-600 text-white hover:bg-green-700 inline-flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Mark Visit Done
                            </button>
                          ) : (
                            <span className="text-xs text-green-700 inline-flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Visited
                            </span>
                          )}
                        </div>
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
