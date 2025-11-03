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
import { useAuth } from '../../context/AuthContext';

const MarketingSalespersonCalendar = () => {
  const { customers: leads, loading, updateCustomer } = useMarketingSharedData();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'month' or 'week'
  const [showLeadPanel, setShowLeadPanel] = useState(false);
  const [selectedLeadDetails, setSelectedLeadDetails] = useState(null);
  const [assignmentsTick, setAssignmentsTick] = useState(0);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    productType: '',
    visitingStatus: 'Scheduled',
    finalStatus: 'Pending',
    remark: ''
  });

  const openEdit = (lead) => {
    setEditLead(lead);
    setEditForm({
      name: lead.name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      address: lead.address || '',
      productType: lead.productType || '',
      visitingStatus: lead.visitingStatus || 'Scheduled',
      finalStatus: lead.finalStatus || 'Pending',
      remark: lead.notes || lead.remark || lead.finalStatusRemark || lead.connectedStatusRemark || ''
    });
    setShowEditPanel(true);
  };

  const saveEdit = () => {
    if (!editLead) return;
    try {
      // Update shared context (for in-memory list)
      updateCustomer(editLead.id, {
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
        address: editForm.address,
        productType: editForm.productType,
        visitingStatus: editForm.visitingStatus,
        finalStatus: editForm.finalStatus,
        notes: editForm.remark,
        finalStatusRemark: editForm.remark
      });

      // Update localStorage assignments if this lead exists there
      try {
        const allAssignments = JSON.parse(localStorage.getItem('marketingAssignments') || '[]');
        const updated = Array.isArray(allAssignments)
          ? allAssignments.map(e => {
              const same = String(e.leadId || e.id) === String(editLead.leadId || editLead.id);
              if (!same) return e;
              return {
                ...e,
                name: editForm.name,
                phone: editForm.phone,
                address: editForm.address,
                productType: editForm.productType,
                visitingStatus: editForm.visitingStatus,
                finalStatus: editForm.finalStatus,
                remark: editForm.remark,
                notes: editForm.remark
              };
            })
          : allAssignments;
        localStorage.setItem('marketingAssignments', JSON.stringify(updated));
        try { window.dispatchEvent(new CustomEvent('marketingAssignmentsUpdated')); } catch {}
      } catch {}

      // Keep any currently selected details in sync
      const updatedLead = {
        ...editLead,
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
        address: editForm.address,
        productType: editForm.productType,
        visitingStatus: editForm.visitingStatus,
        finalStatus: editForm.finalStatus,
        notes: editForm.remark,
        finalStatusRemark: editForm.remark,
        remark: editForm.remark
      };
      if (selectedLeadDetails && String(selectedLeadDetails.id) === String(editLead.id)) {
        setSelectedLeadDetails(updatedLead);
      }

      setShowEditPanel(false);
      setEditLead(null);
    } catch (e) { console.error('saveEdit error', e); }
  };

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

  // Sample demo leads if none available
  const demoLeads = React.useMemo(() => {
    const today = new Date();
    const day = today.getDay();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - day);
    const d = (offset) => {
      const x = new Date(start);
      x.setDate(start.getDate() + offset);
      return x.toISOString().split('T')[0];
    };
    return [
      { id: 101, name: 'Akash Verma', phone: '9876500012', email: 'akash@example.com', address: 'Andheri, Mumbai', state: 'Maharashtra', productType: 'Cable', visitingStatus: 'Scheduled', finalStatus: 'Pending', assignedDate: d(0) },
      { id: 102, name: 'Priya Singh', phone: '9876500013', email: 'priya@example.com', address: 'Borivali, Mumbai', state: 'Maharashtra', productType: 'Wire', visitingStatus: 'Visited', finalStatus: 'Interested', assignedDate: d(1) },
      { id: 103, name: 'Rohit Sharma', phone: '9876500014', email: 'rohit@example.com', address: 'Thane, Mumbai', state: 'Maharashtra', productType: 'Conductor', visitingStatus: 'Not Visited', finalStatus: 'Pending', assignedDate: d(2) },
      { id: 104, name: 'Neha Gupta', phone: '9876500015', email: 'neha@example.com', address: 'Vashi, Navi Mumbai', state: 'Maharashtra', productType: 'Cable', visitingStatus: 'Scheduled', finalStatus: 'Pending', assignedDate: d(3) },
      { id: 105, name: 'Manish Jain', phone: '9876500016', email: 'manish@example.com', address: 'Powai, Mumbai', state: 'Maharashtra', productType: 'Wire', visitingStatus: 'Visited', finalStatus: 'Interested', assignedDate: d(4) }
    ];
  }, []);

  // Merge assigned events from localStorage for current salesperson
  const assignedEvents = React.useMemo(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('marketingAssignments') || '[]');
      const salespersonId = (localStorage.getItem('currentMarketingSalesperson') || user?.email || user?.username || '').toLowerCase();
      if (!Array.isArray(raw)) return [];

      const mapped = raw.map(e => ({
        id: e.leadId || e.id,
        name: e.name,
        phone: e.phone,
        email: e.email || '',
        address: e.address,
        productType: e.productType,
        visitingStatus: e.visitingStatus || 'Scheduled',
        finalStatus: e.finalStatus || 'Pending',
        // surface remarks into the event so preview/edit shows latest
        notes: e.notes || e.remark || e.finalStatusRemark || e.connectedStatusRemark || '',
        remark: e.remark || e.notes || '',
        finalStatusRemark: e.finalStatusRemark || '',
        connectedStatusRemark: e.connectedStatusRemark || '',
        assignedDate: (typeof e.assignedDate === 'string' ? e.assignedDate : (e.assignedDate ? new Date(e.assignedDate) : null)) ? (typeof e.assignedDate === 'string' ? e.assignedDate : (()=>{ const y=e.assignedDate.getFullYear?.(); return y?`${y}-${String(e.assignedDate.getMonth()+1).padStart(2,'0')}-${String(e.assignedDate.getDate()).padStart(2,'0')}`:e.assignedDate; })()) : e.assignedDate,
        assignedToName: e.assignedToName || '',
        assignedToEmail: e.assignedToEmail || '',
      }));

      // Deduplicate by (leadId + assignedDate + assignee)
      const seen = new Set();
      const uniqueMapped = mapped.filter(e => {
        const k = `${String(e.id)}|${e.assignedDate}|${(e.assignedToEmail||e.assignedToName||'').toLowerCase()}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });

      if (!salespersonId) {
        return uniqueMapped; // no context, show all
      }

      const filtered = uniqueMapped.filter(e => {
        const byName = (e.assignedToName || '').toLowerCase();
        const byEmail = (e.assignedToEmail || '').toLowerCase();
        return (byEmail.includes(salespersonId) || byName.includes(salespersonId));
      });

      return filtered.length ? filtered : uniqueMapped; // fallback to all if no match
    } catch { return []; }
  }, [user, assignmentsTick]);

  // Listen for assignment updates
  useEffect(() => {
    const onUpdate = () => setAssignmentsTick(t => t + 1);
    window.addEventListener('marketingAssignmentsUpdated', onUpdate);
    return () => window.removeEventListener('marketingAssignmentsUpdated', onUpdate);
  }, []);

  const effectiveLeads = React.useMemo(() => {
    const base = Array.isArray(leads) && leads.length > 0 ? leads : demoLeads;
    return [...base, ...assignedEvents];
  }, [leads, demoLeads, assignedEvents]);

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

  // Move a lead from calendar to Visits page
  const moveToVisits = (lead) => {
    try {
      // 1) Add to visits storage
      const visitItem = {
        id: lead.id,
        leadId: lead.leadId || lead.id,
        name: lead.name,
        phone: lead.phone || '',
        address: lead.address || '',
        gstNo: lead.gstNo || '',
        productType: lead.productType || '',
        state: lead.state || '',
        leadSource: lead.leadSource || '',
        visitingStatus: 'scheduled',
        visitDate: toLocalYMD(selectedDate)
      };
      const existing = JSON.parse(localStorage.getItem('marketingVisits') || '[]');
      const isDup = Array.isArray(existing) && existing.some(v => String(v.leadId || v.id) === String(visitItem.leadId) && (v.visitDate || '') === (visitItem.visitDate || ''));
      const next = isDup ? existing : (Array.isArray(existing) ? [...existing, visitItem] : [visitItem]);
      localStorage.setItem('marketingVisits', JSON.stringify(next));

      // 2) Remove from assignments so it disappears from calendar
      const allAssignments = JSON.parse(localStorage.getItem('marketingAssignments') || '[]');
      const dayStr = toLocalYMD(selectedDate);
      const filtered = Array.isArray(allAssignments)
        ? allAssignments.filter(e => String(e.leadId || e.id) !== String(lead.id) || (e.assignedDate && e.assignedDate !== dayStr))
        : [];
      localStorage.setItem('marketingAssignments', JSON.stringify(filtered));

      // 3) Refresh calendar consumers
      try { window.dispatchEvent(new CustomEvent('marketingAssignmentsUpdated')); } catch {}
    } catch (e) { console.error('moveToVisits error', e); }
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
    <div className="bg-gray-50 min-h-screen pl-0 pr-6 py-6">
      <div className="w-full">
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

      {/* Lead details slide-over */}
      {showLeadPanel && selectedLeadDetails && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black bg-opacity-30" onClick={() => setShowLeadPanel(false)}></div>
          <aside className="w-full max-w-md bg-white h-full shadow-xl overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Lead Details</h3>
              <button onClick={() => setShowLeadPanel(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div>
                <div className="text-xs text-gray-500">Name</div>
                <div className="text-gray-900 font-medium">{selectedLeadDetails.name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Phone</div>
                <div className="text-gray-900">{selectedLeadDetails.phone}</div>
              </div>
              {selectedLeadDetails.email && (
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-gray-900">{selectedLeadDetails.email}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-gray-500">Address</div>
                <div className="text-gray-900">{selectedLeadDetails.address || '-'}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-500">Visiting Status</div>
                  <div className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getVisitingStatusColor(selectedLeadDetails.visitingStatus)}`}>
                    {selectedLeadDetails.visitingStatus}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Final Status</div>
                  <div className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLeadDetails.finalStatus)}`}>
                    {selectedLeadDetails.finalStatus}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Product Type</div>
                <div className="text-gray-900">{selectedLeadDetails.productType || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Remark</div>
                <div className="text-gray-900 whitespace-pre-wrap break-words">
                  {selectedLeadDetails.notes || selectedLeadDetails.remark || selectedLeadDetails.finalStatusRemark || selectedLeadDetails.connectedStatusRemark || '-'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Assigned Date</div>
                <div className="text-gray-900">{(selectedLeadDetails.assignedDate || selectedLeadDetails.followUpDate || selectedLeadDetails.date || '').toString()}</div>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => { moveToVisits(selectedLeadDetails); setShowLeadPanel(false); }}
                  className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Move to Visits
                </button>
                <button onClick={() => setShowLeadPanel(false)} className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">Close</button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Edit Lead slide-over */}
      {showEditPanel && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black bg-opacity-30" onClick={() => setShowEditPanel(false)}></div>
          <aside className="w-full max-w-md bg-white h-full shadow-xl overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit Lead</h3>
              <button onClick={() => setShowEditPanel(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div>
                <label className="text-xs text-gray-500">Name</label>
                <input value={editForm.name} onChange={(e)=>setEditForm(f=>({...f,name:e.target.value}))} className="mt-1 w-full border rounded px-2 py-1" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Phone</label>
                <input value={editForm.phone} onChange={(e)=>setEditForm(f=>({...f,phone:e.target.value}))} className="mt-1 w-full border rounded px-2 py-1" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Email</label>
                <input value={editForm.email} onChange={(e)=>setEditForm(f=>({...f,email:e.target.value}))} className="mt-1 w-full border rounded px-2 py-1" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Address</label>
                <textarea value={editForm.address} onChange={(e)=>setEditForm(f=>({...f,address:e.target.value}))} className="mt-1 w-full border rounded px-2 py-1" rows={2} />
              </div>
              <div>
                <label className="text-xs text-gray-500">Product Type</label>
                <input value={editForm.productType} onChange={(e)=>setEditForm(f=>({...f,productType:e.target.value}))} className="mt-1 w-full border rounded px-2 py-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Visiting Status</label>
                  <select value={editForm.visitingStatus} onChange={(e)=>setEditForm(f=>({...f,visitingStatus:e.target.value}))} className="mt-1 w-full border rounded px-2 py-1">
                    <option>Scheduled</option>
                    <option>Visited</option>
                    <option>Not Visited</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Final Status</label>
                  <select value={editForm.finalStatus} onChange={(e)=>setEditForm(f=>({...f,finalStatus:e.target.value}))} className="mt-1 w-full border rounded px-2 py-1">
                    <option>Pending</option>
                    <option>Interested</option>
                    <option>Not Interested</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Remark</label>
                <textarea value={editForm.remark} onChange={(e)=>setEditForm(f=>({...f,remark:e.target.value}))} className="mt-1 w-full border rounded px-2 py-1" rows={3} />
              </div>
              <div className="pt-2 flex gap-2">
                <button onClick={saveEdit} className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Save</button>
                <button onClick={() => setShowEditPanel(false)} className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
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
                            <div className="text-xs text-gray-400 text-center py-6">No leads</div>
                          ) : (
                            dayLeads.map((lead) => (
                              <div 
                                key={lead.id} 
                                className="bg-white border rounded-md p-2 shadow-sm hover:border-blue-300"
                                onClick={() => { setSelectedLeadDetails(lead); setShowLeadPanel(true); }}
                              >
                                <div className="text-xs font-medium text-gray-900 truncate">{lead.name}</div>
                                <div className="text-[11px] text-gray-600 truncate">{lead.phone}</div>
                                <div className="flex items-center justify-between mt-1">
                                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getVisitingStatusColor(lead.visitingStatus)}`}>
                                    {lead.visitingStatus}
                                  </span>
                                  <button
                                    onClick={() => moveToVisits(lead)}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                                  >
                                    Move to Visits
                                  </button>
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
                          <button
                            className="p-1 text-gray-400 hover:text-blue-600"
                            onClick={() => { setSelectedLeadDetails(lead); setShowLeadPanel(true); }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600">
                            <Edit className="w-4 h-4" onClick={() => openEdit(lead)} />
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
                          <button
                            onClick={() => moveToVisits(lead)}
                            className="px-2 py-1 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-700 inline-flex items-center gap-1"
                          >
                            Move to Visits
                          </button>
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
