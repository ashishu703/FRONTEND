import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Users, MessageSquare, Clock, CheckCircle, XCircle, TrendingDown, BarChart3, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import paymentService from '../../api/admin_api/paymentService';
import departmentHeadService from '../../api/admin_api/departmentHeadService';
import departmentUserService from '../../api/admin_api/departmentUserService';

function cx(...classes) {
  return classes.filter(Boolean).join(" ")
}

function Card({ className, children }) {
  return <div className={cx("rounded-lg border bg-white transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1", className)}>{children}</div>
}

function CardHeader({ className, children }) {
  return <div className={cx("p-4", className)}>{children}</div>
}

function CardTitle({ className, children }) {
  return <div className={cx("text-base font-semibold", className)}>{children}</div>
}

function CardContent({ className, children }) {
  return <div className={cx("p-4 pt-0", className)}>{children}</div>
}

// Calendar Component
const DateRangePicker = ({ value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  // Close calendar when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.date-range-picker')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateInRange = (date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isDateSelected = (date) => {
    if (!selectedStartDate && !selectedEndDate) return false;
    return (selectedStartDate && date.getTime() === selectedStartDate.getTime()) ||
           (selectedEndDate && date.getTime() === selectedEndDate.getTime());
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(clickedDate);
      setSelectedEndDate(null);
    } else if (selectedStartDate && !selectedEndDate) {
      if (clickedDate < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(clickedDate);
      } else {
        setSelectedEndDate(clickedDate);
      }
    }
  };

  const handleApply = () => {
    if (selectedStartDate && selectedEndDate) {
      const startStr = selectedStartDate.toLocaleDateString();
      const endStr = selectedEndDate.toLocaleDateString();
      onChange(`${startStr} - ${endStr}`);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    onChange('');
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = isDateSelected(date);
      const isInRange = isDateInRange(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={cx(
            "w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 hover:bg-blue-100",
            isSelected && "bg-blue-600 text-white hover:bg-blue-700",
            isInRange && !isSelected && "bg-blue-100 text-blue-700",
            isToday && !isSelected && "bg-gray-100 text-gray-700 font-semibold",
            !isSelected && !isInRange && !isToday && "text-gray-700 hover:text-blue-700"
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="relative date-range-picker">
      <div className="relative">
               <input
                 type="text"
                 placeholder={placeholder}
                 value={value}
                 readOnly
                 onClick={() => setIsOpen(!isOpen)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all duration-300 cursor-pointer"
               />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 p-4 min-w-80">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="font-semibold text-gray-700">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={handleClear}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!selectedStartDate || !selectedEndDate}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SalesDashboard = () => {
  const [selectedSalesperson, setSelectedSalesperson] = useState('All Salespersons');
  const [dateRange, setDateRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [salespersons, setSalespersons] = useState(['All Salespersons']);

  // Real computed data state
  const [currentData, setCurrentData] = useState({
    totalLeads: 0,
    pendingLeads: 0,
    followUpLeads: 0,
    meetingScheduled: 0,
    completedLeads: 0,
    notConnected: 0,
    overallRevenue: 0,
    totalRevenue: 0,
    currentMonthEarnings: 0,
    monthGrowth: 0,
    conversionRate: 0,
    meetingConversion: 0,
    pendingRate: 0,
    statusCounts: { pending: 0, completed: 0, failed: 0, refunded: 0, cancelled: 0 },
    revenueByMonth: {}
  });

  // Utilities
  const parseRange = (rangeStr) => {
    if (!rangeStr) return { start: null, end: null };
    const parts = rangeStr.split(' - ');
    if (parts.length !== 2) return { start: null, end: null };
    return { start: new Date(parts[0]), end: new Date(parts[1]) };
  };

  const inRange = (d, start, end) => {
    if (!d) return false;
    if (!start || !end) return true;
    const ts = new Date(d).getTime();
    return ts >= start.getTime() && ts <= end.getTime();
  };

  // Fetch real data
  const fetchData = async () => {
    try {
      setLoading(true);
      const { start, end } = parseRange(dateRange);

      // Payments: server-side date filtering
      const pRes = await paymentService.getAllPayments({
        page: 1,
        limit: 1000,
        startDate: start ? start.toISOString() : undefined,
        endDate: end ? end.toISOString() : undefined,
      });
      const pRows = Array.isArray(pRes?.data) ? pRes.data : [];
      setPayments(pRows);

      // Leads: fetch and client-side filter (API has no date filter)
      const lRes = await departmentHeadService.getAllLeads({ page: 1, limit: 100 });
      const lRows = Array.isArray(lRes?.data) ? lRes.data : (Array.isArray(lRes?.data?.leads) ? lRes.data.leads : []);
      const filteredLeads = lRows.filter((ld) => {
        const d = ld.created_at || ld.createdAt || ld.date || ld.updated_at || ld.updatedAt;
        return inRange(d, start, end);
      });
      setLeads(filteredLeads);
    } catch (e) {
      console.error('Failed to load dashboard data', e);
      setLeads([]);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  // Load department users for dropdown
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await departmentUserService.listUsers?.();
        const rows = Array.isArray(res?.data) ? res.data : (Array.isArray(res?.users) ? res.users : []);
        const names = rows
          .map(u => u.name || u.fullName || `${u.first_name || ''} ${u.last_name || ''}`.trim())
          .filter(Boolean);
        setSalespersons(['All Salespersons', ...Array.from(new Set(names))]);
      } catch (e) {
        // silently ignore
        setSalespersons(['All Salespersons']);
      }
    };
    loadUsers();
  }, []);

  // Build metrics from real data
  const computeMetricsFromData = (leadRows, paymentRows) => {
    const totalLeads = leadRows.length;
    const get = (obj, key, fallback = '') => (obj && obj[key] !== undefined ? obj[key] : fallback);

    const pendingLeads = leadRows.filter(ld => {
      const connected = (get(ld, 'connected_status') || get(ld, 'connectedStatus') || '').toLowerCase();
      const finalStatus = (get(ld, 'final_status') || get(ld, 'finalStatus') || '').toLowerCase();
      const salesStatus = (get(ld, 'sales_status') || get(ld, 'salesStatus') || '').toLowerCase();
      return connected === 'pending' || finalStatus === 'open' || salesStatus === 'pending';
    }).length;

    const followUpLeads = leadRows.filter(ld => {
      const tele = (get(ld, 'telecaller_status') || get(ld, 'telecallerStatus') || get(ld, 'connected_status') || '').toLowerCase();
      return tele.includes('follow') || tele === 'connected';
    }).length;

    const meetingScheduled = leadRows.filter(ld => {
      const finalStatus = (get(ld, 'final_status') || get(ld, 'finalStatus') || '').toLowerCase();
      const nextMeeting = get(ld, 'next_meeting_date') || get(ld, 'nextMeetingDate');
      return finalStatus === 'next_meeting' || !!nextMeeting;
    }).length;

    const completedLeads = leadRows.filter(ld => {
      const finalStatus = (get(ld, 'final_status') || get(ld, 'finalStatus') || '').toLowerCase();
      const salesStatus = (get(ld, 'sales_status') || get(ld, 'salesStatus') || '').toLowerCase();
      return finalStatus === 'closed' || salesStatus === 'completed' || salesStatus === 'done' || finalStatus === 'order_confirmed';
    }).length;

    const notConnected = leadRows.filter(ld => {
      const connected = (get(ld, 'connected_status') || get(ld, 'connectedStatus') || '').toLowerCase();
      return connected === 'not_connected';
    }).length;

    // Revenue metrics from payments
    let overallRevenue = 0;
    let totalPaid = 0;
    let remaining = 0;
    const statusCounts = { pending: 0, completed: 0, failed: 0, refunded: 0, cancelled: 0 };
    const revenueByMonth = {};
    paymentRows.forEach(p => {
      const paid = Number(p.installment_amount || p.amount || 0);
      const quotationTotal = Number(p.total_quotation_amount || 0);
      const remainingAmt = Number(p.remaining_amount || 0);
      totalPaid += isNaN(paid) ? 0 : paid;
      overallRevenue += isNaN(quotationTotal) ? 0 : quotationTotal;
      remaining += isNaN(remainingAmt) ? 0 : remainingAmt;
      const st = String(p.payment_status || '').toLowerCase();
      if (statusCounts[st] !== undefined) statusCounts[st] += 1;
      const pd = p.payment_date ? new Date(p.payment_date) : null;
      if (pd) {
        const key = pd.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
        revenueByMonth[key] = (revenueByMonth[key] || 0) + paid;
      }
    });

    const conversionRate = totalLeads ? Math.round((completedLeads / totalLeads) * 1000) / 10 : 0;

    return {
      totalLeads,
      pendingLeads,
      followUpLeads,
      meetingScheduled,
      completedLeads,
      notConnected,
      overallRevenue: overallRevenue || totalPaid, // fallback to paid if total not available
      totalRevenue: totalPaid,
      currentMonthEarnings: totalPaid,
      monthGrowth: 0,
      conversionRate,
      meetingConversion: meetingScheduled ? Math.round((completedLeads / meetingScheduled) * 1000) / 10 : 0,
      pendingRate: totalLeads ? Math.round((pendingLeads / totalLeads) * 1000) / 10 : 0,
      statusCounts,
      revenueByMonth,
    };
  };
  // Update metrics when data or filters change - ONLY REAL DATA
  useEffect(() => {
    // If a salesperson is selected, filter leads accordingly
    const filteredLeads = selectedSalesperson === 'All Salespersons' ? leads : leads.filter((ld) => {
      const name = (ld.assigned_salesperson_name || ld.assignedSalesperson || ld.salesperson_name || '').toString().trim();
      return name === selectedSalesperson;
    });
    const computed = computeMetricsFromData(filteredLeads, payments);
    setCurrentData(computed);
  }, [dateRange, leads, payments, selectedSalesperson]);

  const handleSalespersonChange = (salesperson) => {
    setSelectedSalesperson(salesperson);
  };

  const handleRefresh = () => {
    // Do a hard reload to avoid intermediate loader flicker and ensure fresh state
    window.location.reload();
  };

  // Salespersons list - simplified for now
  // salespersons are loaded from server; initial value is set in state above
  const renderSalespersonContent = () => {
    // Only show individual salesperson content when a specific salesperson is selected
    if (selectedSalesperson === 'All Salespersons') {
        return null;
    }

    return (
      <div className="mb-6">
        <Card className="border-2 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              {selectedSalesperson} - Performance Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-blue-600 mb-1">Total Leads</div>
                <div className="text-2xl font-bold text-blue-800">{currentData.totalLeads}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-green-600 mb-1">Completed</div>
                <div className="text-2xl font-bold text-green-800">{currentData.completedLeads}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-orange-600 mb-1">Pending</div>
                <div className="text-2xl font-bold text-orange-800">{currentData.pendingLeads}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-purple-600 mb-1">Conversion Rate</div>
                <div className="text-2xl font-bold text-purple-800">{currentData.conversionRate}%</div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600 mb-1">Total Revenue</div>
                <div className="text-xl font-bold text-gray-800">₹{currentData.overallRevenue.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600 mb-1">Monthly Growth</div>
                <div className="text-xl font-bold text-gray-800">
                  {currentData.monthGrowth > 0 ? '+' : ''}{currentData.monthGrowth}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, bgColor }) => (
    <Card className={cx("border-2 group", color)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium transition-all duration-300 group-hover:text-gray-800 group-hover:font-semibold">{title}</CardTitle>
        <Icon className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1 transition-all duration-300 group-hover:scale-110">{value}</div>
        <p className="text-xs text-gray-500 transition-all duration-300 group-hover:text-gray-700">{subtitle}</p>
      </CardContent>
    </Card>
  );

  // Charts: build datasets from currentData
  const pieChartData = useMemo(() => [
    { name: 'Completed', value: currentData.completedLeads, color: '#10B981' },
    { name: 'Pending', value: currentData.pendingLeads, color: '#F59E0B' },
    { name: 'Follow-up', value: currentData.followUpLeads, color: '#F97316' },
    { name: 'Meeting', value: currentData.meetingScheduled, color: '#3B82F6' },
    { name: 'Not Connected', value: currentData.notConnected, color: '#DC2626' }
  ].filter(d => d.value > 0), [currentData]);

  const barChartData = useMemo(() => [
    { name: 'Total', value: currentData.totalLeads },
    { name: 'Pending', value: currentData.pendingLeads },
    { name: 'Follow-up', value: currentData.followUpLeads },
    { name: 'Meeting', value: currentData.meetingScheduled },
    { name: 'Completed', value: currentData.completedLeads },
    { name: 'Not Connected', value: currentData.notConnected }
  ], [currentData]);

  const revenueChartData = useMemo(() => {
    const map = currentData.revenueByMonth || {};
    const entries = Object.entries(map);
    if (entries.length > 0) return entries.map(([month, revenue]) => ({ month, revenue }));
    return [];
  }, [currentData]);

  const conversionChartData = useMemo(() => [
    { type: 'Overall', rate: currentData.conversionRate },
    { type: 'Meeting', rate: currentData.meetingConversion },
    { type: 'Pending', rate: currentData.pendingRate },
    { type: 'Follow-up', rate: currentData.followUpLeads > 0 ? Math.round((currentData.completedLeads / currentData.followUpLeads) * 100) : 0 }
  ], [currentData]);

  const paymentStatusPieData = useMemo(() => {
    const c = currentData.statusCounts || {};
    return [
      { name: 'Completed', value: c.completed || 0, color: '#10B981' },
      { name: 'Pending', value: c.pending || 0, color: '#F59E0B' },
      { name: 'Failed', value: c.failed || 0, color: '#EF4444' },
      { name: 'Refunded', value: c.refunded || 0, color: '#6B7280' },
      { name: 'Cancelled', value: c.cancelled || 0, color: '#DC2626' }
    ].filter(d => d.value > 0);
  }, [currentData]);

  const MetricCard = ({ icon: Icon, title, value, subtitle, trend, trendColor }) => (
    <Card className={cx("border-2 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50", trendColor ? `text-${trendColor}-600 border-${trendColor}-200` : 'text-gray-600 border-gray-200')}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 transition-all duration-300 group-hover:text-gray-800 group-hover:font-semibold">{title}</CardTitle>
        <div className="p-2 rounded-full bg-white shadow-md">
          <Icon className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
      </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-1">
          <div className="text-3xl font-bold transition-all duration-300 group-hover:scale-110">{value}</div>
        {trend && (
            <div className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full transition-all duration-300 group-hover:scale-105 ${
              trendColor === 'red' ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'
            }`}>
              <TrendingDown className="w-4 h-4 mr-1 transition-all duration-300 group-hover:scale-110" />
            {trend}
            </div>
        )}
      </div>
        <p className="text-sm text-gray-600 transition-all duration-300 group-hover:text-gray-800 mb-3">{subtitle}</p>
        <div className="w-full bg-gradient-to-r from-current to-transparent opacity-30 h-2 rounded-full transition-all duration-300 group-hover:opacity-50 group-hover:h-2.5"></div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-gray-700">Loading dashboard data...</span>
          </div>
        </div>
      )}
      
      {/* Date Range Status Indicator */}
      {dateRange && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Date Range Filter Active: {dateRange}
            </span>
            <button
              onClick={() => setDateRange('')}
              className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear Filter
            </button>
          </div>
        </div>
      )}

      {/* Sales Department Filter */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Sales Department
            </label>
            <select 
              value={selectedSalesperson}
              onChange={(e) => handleSalespersonChange(e.target.value)}
              className="w-64 px-4 py-3 border-2 border-indigo-300 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              {salespersons.map(salesperson => (
                <option key={salesperson} value={salesperson} className="bg-white text-indigo-800 font-medium">
                  {salesperson}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:scale-105 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              title="Refresh Dashboard"
            >
              <RefreshCw className="w-4 h-4 hover:rotate-180 transition-transform duration-300" />
            </button>
            {/* Compact date range filter (single control) */}
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="Select date range"
              className="w-48"
            />
          </div>
        </div>
      </div>


      {/* Performance Summary */}
      {selectedSalesperson === 'All Salespersons' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="border-2 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-green-600" />
                Top Performer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 mb-2">
                Top Performer
              </div>
              <p className="text-sm text-gray-600">
                Best performing salesperson
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                ₹{currentData.overallRevenue.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">
                Total revenue generated
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Average Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {currentData.conversionRate}%
              </div>
              <p className="text-sm text-gray-600">
                Overall conversion rate
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="border-2 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                {selectedSalesperson}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {currentData.conversionRate}%
              </div>
              <p className="text-sm text-gray-600">
                Conversion rate
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 mb-2">
                ₹{currentData.overallRevenue.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">
                Total revenue generated
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-purple-600" />
                Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {currentData.monthGrowth > 0 ? '+' : ''}{currentData.monthGrowth}%
              </div>
              <p className="text-sm text-gray-600">
                Month-over-month growth
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Salesperson Specific Content */}
      {renderSalespersonContent()}

      {/* Lead Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <StatCard 
              icon={Users} 
              title="Total Leads" 
              value={currentData.totalLeads} 
              subtitle="All leads in the system"
              color="bg-purple-50 text-purple-600 border-purple-200"
            />
            <StatCard 
              icon={Clock} 
              title="Pending Leads" 
              value={currentData.pendingLeads} 
              subtitle="Leads awaiting action"
              color="bg-blue-50 text-blue-600 border-blue-200"
            />
            <StatCard 
              icon={MessageSquare} 
              title="Follow-up Leads" 
              value={currentData.followUpLeads} 
              subtitle="Leads in follow-up stage"
              color="bg-orange-50 text-orange-600 border-orange-200"
            />
            <StatCard 
              icon={Calendar} 
              title="Meeting Scheduled" 
              value={currentData.meetingScheduled} 
              subtitle="Meeting scheduled leads"
              color="bg-red-50 text-red-600 border-red-200"
            />
            <StatCard 
              icon={CheckCircle} 
              title="Completed Leads" 
              value={currentData.completedLeads} 
              subtitle="Converted leads"
              color="bg-green-50 text-green-600 border-green-200"
            />
            <StatCard 
              icon={XCircle} 
              title="Not Connected" 
              value={currentData.notConnected} 
              subtitle="Unreached leads"
              color="bg-red-50 text-red-600 border-red-200"
            />
          </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="border-2 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-600" />
              Overall Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">
              ₹{currentData.overallRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">
              Total Revenue (All Time)
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              ₹{currentData.totalRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">
              Filtered Revenue
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Current Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              ₹{currentData.currentMonthEarnings.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">
              September Revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Lead Distribution */}
          <Card className="border-2 group shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg font-semibold">Lead Distribution</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie data={pieChartData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={(e)=>`${e.name}: ${e.value}` }>
                    {pieChartData.map((d, i) => (<Cell key={`ld-${i}`} fill={d.color || '#6366F1'} />))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Lead Statistics */}
          <Card className="border-2 group shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg font-semibold">Lead Statistics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card className="border-2 group shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg font-semibold">Revenue Trend</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v)=>[`₹${Number(v||0).toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Conversion Rates */}
          <Card className="border-2 group shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg font-semibold">Conversion Rates</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conversionChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip formatter={(v)=>[`${v}%`, 'Rate']} />
                  <Bar dataKey="rate" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Status */}
          <Card className="border-2 group shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg font-semibold">Payment Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie data={paymentStatusPieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={(e)=>`${e.name}: ${e.value}` }>
                    {paymentStatusPieData.map((d, i) => (<Cell key={`ps-${i}`} fill={d.color} />))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Follow-up Status */}
          <Card className="border-2 group shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg font-semibold">Follow-up Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie data={pieChartData.filter(d=>d.name==='Follow-up'|| d.name==='Meeting' || d.name==='Pending' || d.name==='Completed')} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={(e)=>`${e.name}: ${e.value}` }>
                    {pieChartData.filter(d=>d.name==='Follow-up'|| d.name==='Meeting' || d.name==='Pending' || d.name==='Completed').map((d, i) => (<Cell key={`fu-${i}`} fill={d.color} />))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;