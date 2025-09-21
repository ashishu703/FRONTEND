import React, { useState, useMemo } from 'react';
import { Calendar, Users, MessageSquare, Clock, CheckCircle, XCircle, TrendingDown, Filter, BarChart3, PieChart, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  const [showCharts, setShowCharts] = useState(false);
  const [filteredData, setFilteredData] = useState(null);

  const sampleData = {
    'All Salespersons': {
      totalLeads: 127,
      pendingLeads: 23,
      followUpLeads: 31,
      meetingScheduled: 18,
      completedLeads: 30,
      notConnected: 12,
      overallRevenue: 2400000,
      totalRevenue: 120000,
      currentMonthEarnings: 460064,
      monthGrowth: 15.3,
      conversionRate: 23.6,
      meetingConversion: 87.5,
      pendingRate: 18.1
    },
    'Rajesh Kumar': {
      totalLeads: 18,
      pendingLeads: 3,
      followUpLeads: 5,
      meetingScheduled: 2,
      completedLeads: 7,
      notConnected: 1,
      overallRevenue: 320000,
      totalRevenue: 18000,
      currentMonthEarnings: 65000,
      monthGrowth: 8.5,
      conversionRate: 38.9,
      meetingConversion: 85.0,
      pendingRate: 16.7
    },
    'Priya Sharma': {
      totalLeads: 22,
      pendingLeads: 4,
      followUpLeads: 6,
      meetingScheduled: 3,
      completedLeads: 8,
      notConnected: 1,
      overallRevenue: 410000,
      totalRevenue: 22000,
      currentMonthEarnings: 78000,
      monthGrowth: 12.3,
      conversionRate: 36.4,
      meetingConversion: 88.0,
      pendingRate: 18.2
    },
    'Amit Patel': {
      totalLeads: 15,
      pendingLeads: 2,
      followUpLeads: 4,
      meetingScheduled: 2,
      completedLeads: 6,
      notConnected: 1,
      overallRevenue: 280000,
      totalRevenue: 15000,
      currentMonthEarnings: 52000,
      monthGrowth: 15.7,
      conversionRate: 40.0,
      meetingConversion: 90.0,
      pendingRate: 13.3
    },
    'Sneha Gupta': {
      totalLeads: 20,
      pendingLeads: 3,
      followUpLeads: 5,
      meetingScheduled: 3,
      completedLeads: 8,
      notConnected: 1,
      overallRevenue: 380000,
      totalRevenue: 20000,
      currentMonthEarnings: 72000,
      monthGrowth: 9.8,
      conversionRate: 40.0,
      meetingConversion: 87.5,
      pendingRate: 15.0
    },
    'Vikram Singh': {
      totalLeads: 16,
      pendingLeads: 2,
      followUpLeads: 4,
      meetingScheduled: 2,
      completedLeads: 7,
      notConnected: 1,
      overallRevenue: 290000,
      totalRevenue: 16000,
      currentMonthEarnings: 55000,
      monthGrowth: 18.2,
      conversionRate: 43.8,
      meetingConversion: 92.0,
      pendingRate: 12.5
    },
    'Anita Joshi': {
      totalLeads: 19,
      pendingLeads: 3,
      followUpLeads: 5,
      meetingScheduled: 2,
      completedLeads: 8,
      notConnected: 1,
      overallRevenue: 350000,
      totalRevenue: 19000,
      currentMonthEarnings: 68000,
      monthGrowth: 11.4,
      conversionRate: 42.1,
      meetingConversion: 89.0,
      pendingRate: 15.8
    },
    'Rohit Verma': {
      totalLeads: 14,
      pendingLeads: 2,
      followUpLeads: 3,
      meetingScheduled: 2,
      completedLeads: 6,
      notConnected: 1,
      overallRevenue: 260000,
      totalRevenue: 14000,
      currentMonthEarnings: 48000,
      monthGrowth: 7.9,
      conversionRate: 42.9,
      meetingConversion: 86.0,
      pendingRate: 14.3
    },
    'Kavita Reddy': {
      totalLeads: 17,
      pendingLeads: 2,
      followUpLeads: 4,
      meetingScheduled: 2,
      completedLeads: 8,
      notConnected: 1,
      overallRevenue: 310000,
      totalRevenue: 17000,
      currentMonthEarnings: 59000,
      monthGrowth: 13.6,
      conversionRate: 47.1,
      meetingConversion: 91.0,
      pendingRate: 11.8
    },
    'Suresh Mehta': {
      totalLeads: 13,
      pendingLeads: 2,
      followUpLeads: 3,
      meetingScheduled: 1,
      completedLeads: 6,
      notConnected: 1,
      overallRevenue: 240000,
      totalRevenue: 13000,
      currentMonthEarnings: 45000,
      monthGrowth: 6.2,
      conversionRate: 46.2,
      meetingConversion: 88.0,
      pendingRate: 15.4
    },
    'Deepika Agarwal': {
      totalLeads: 21,
      pendingLeads: 3,
      followUpLeads: 5,
      meetingScheduled: 3,
      completedLeads: 9,
      notConnected: 1,
      overallRevenue: 390000,
      totalRevenue: 21000,
      currentMonthEarnings: 74000,
      monthGrowth: 14.1,
      conversionRate: 42.9,
      meetingConversion: 87.0,
      pendingRate: 14.3
    }
  };

  const [currentData, setCurrentData] = useState(sampleData['All Salespersons']);

  const salespersons = [
    'All Salespersons',
    'Rajesh Kumar',
    'Priya Sharma', 
    'Amit Patel',
    'Sneha Gupta',
    'Vikram Singh',
    'Anita Joshi',
    'Rohit Verma',
    'Kavita Reddy',
    'Suresh Mehta',
    'Deepika Agarwal'
  ];

  // Date range filtering function
  const applyDateRangeFilter = (data, dateRange) => {
    if (!dateRange || dateRange === '') {
      return data;
    }

    // Parse date range (assuming format "MM/DD/YYYY - MM/DD/YYYY")
    const [startDateStr, endDateStr] = dateRange.split(' - ');
    if (!startDateStr || !endDateStr) {
      return data;
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    // Calculate date range multiplier (simulate different performance based on date range)
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const rangeMultiplier = Math.min(daysDiff / 30, 1); // Normalize to monthly data
    
    // Apply date range filtering to data
    const filteredData = { ...data };
    
    // Adjust metrics based on date range
    Object.keys(filteredData).forEach(key => {
      if (typeof filteredData[key] === 'object' && filteredData[key] !== null) {
        filteredData[key] = {
          ...filteredData[key],
          totalLeads: Math.round(filteredData[key].totalLeads * rangeMultiplier),
          pendingLeads: Math.round(filteredData[key].pendingLeads * rangeMultiplier),
          followUpLeads: Math.round(filteredData[key].followUpLeads * rangeMultiplier),
          meetingScheduled: Math.round(filteredData[key].meetingScheduled * rangeMultiplier),
          completedLeads: Math.round(filteredData[key].completedLeads * rangeMultiplier),
          notConnected: Math.round(filteredData[key].notConnected * rangeMultiplier),
          overallRevenue: Math.round(filteredData[key].overallRevenue * rangeMultiplier),
          totalRevenue: Math.round(filteredData[key].totalRevenue * rangeMultiplier),
          currentMonthEarnings: Math.round(filteredData[key].currentMonthEarnings * rangeMultiplier),
          monthGrowth: filteredData[key].monthGrowth * rangeMultiplier,
          conversionRate: filteredData[key].conversionRate, // Keep conversion rate as is
          meetingConversion: filteredData[key].meetingConversion, // Keep meeting conversion as is
          pendingRate: filteredData[key].pendingRate // Keep pending rate as is
        };
      }
    });
    
    return filteredData;
  };

  // Update data when date range changes
  React.useEffect(() => {
    const filtered = applyDateRangeFilter(sampleData, dateRange);
    setFilteredData(filtered);
    
    // Update current data based on selected salesperson
    const newCurrentData = filtered[selectedSalesperson] || filtered['All Salespersons'];
    setCurrentData(newCurrentData);
  }, [dateRange, selectedSalesperson]);

  const handleSalespersonChange = (salesperson) => {
    setSelectedSalesperson(salesperson);
    const dataToUse = filteredData || sampleData;
    setCurrentData(dataToUse[salesperson] || dataToUse['All Salespersons']);
  };

  const handleRefresh = () => {
    // Force a re-render by updating the data
    const currentSalesperson = selectedSalesperson;
    const dataToUse = filteredData || sampleData;
    const newData = dataToUse[currentSalesperson] || dataToUse['All Salespersons'];
    
    // Update the data to trigger a re-render
    setCurrentData({ ...newData });
    
    // You can add additional refresh logic here if needed
    // For example, refetch data from API, reload from server, etc.
  };

  // Function to render content based on selected salesperson
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

  // Chart data
  const pieChartData = useMemo(() => [
    { name: 'Completed', value: currentData.completedLeads, color: '#10B981' },
    { name: 'Pending', value: currentData.pendingLeads, color: '#F59E0B' },
    { name: 'Follow-up', value: currentData.followUpLeads, color: '#F97316' },
    { name: 'Meeting', value: currentData.meetingScheduled, color: '#EF4444' },
    { name: 'Not Connected', value: currentData.notConnected, color: '#DC2626' }
  ], [currentData]);

  const barChartData = useMemo(() => [
    { name: 'Total', value: currentData.totalLeads, color: '#8B5CF6' },
    { name: 'Pending', value: currentData.pendingLeads, color: '#3B82F6' },
    { name: 'Follow-up', value: currentData.followUpLeads, color: '#F59E0B' },
    { name: 'Meeting', value: currentData.meetingScheduled, color: '#EF4444' },
    { name: 'Completed', value: currentData.completedLeads, color: '#10B981' },
    { name: 'Not Connected', value: currentData.notConnected, color: '#DC2626' }
  ], [currentData]);

  const revenueChartData = useMemo(() => [
    { month: 'Jan', revenue: Math.round(currentData.overallRevenue * 0.1) },
    { month: 'Feb', revenue: Math.round(currentData.overallRevenue * 0.15) },
    { month: 'Mar', revenue: Math.round(currentData.overallRevenue * 0.2) },
    { month: 'Apr', revenue: Math.round(currentData.overallRevenue * 0.25) },
    { month: 'May', revenue: Math.round(currentData.overallRevenue * 0.3) },
    { month: 'Jun', revenue: Math.round(currentData.overallRevenue * 0.4) },
    { month: 'Jul', revenue: Math.round(currentData.overallRevenue * 0.5) },
    { month: 'Aug', revenue: Math.round(currentData.overallRevenue * 0.6) },
    { month: 'Sep', revenue: Math.round(currentData.overallRevenue * 0.7) },
    { month: 'Oct', revenue: Math.round(currentData.overallRevenue * 0.8) },
    { month: 'Nov', revenue: Math.round(currentData.overallRevenue * 0.9) },
    { month: 'Dec', revenue: currentData.overallRevenue }
  ], [currentData]);

  const conversionChartData = useMemo(() => [
    { type: 'Overall', rate: currentData.conversionRate },
    { type: 'Meeting', rate: currentData.meetingConversion },
    { type: 'Pending', rate: currentData.pendingRate },
    { type: 'Follow-up', rate: currentData.followUpLeads > 0 ? Math.round((currentData.completedLeads / currentData.followUpLeads) * 100) : 0 }
  ], [currentData]);

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
              onClick={() => setShowCharts(!showCharts)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {showCharts ? <PieChart className="w-4 h-4 transition-transform duration-300 hover:scale-110" /> : <BarChart3 className="w-4 h-4 transition-transform duration-300 hover:scale-110" />}
              {showCharts ? 'Stats' : 'Charts'}
            </button>
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:scale-105 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              title="Refresh Dashboard"
            >
              <RefreshCw className="w-4 h-4 hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              Additional Filters
            </h3>
          </div>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="Select date range"
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

      {/* Default Content - Only show when All Salespersons is selected */}
      {selectedSalesperson === 'All Salespersons' && (
        <>
      {showCharts ? (
        /* Charts View */
        <div className="space-y-6">
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

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Pie Chart */}
            <Card className="border-2 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <CardTitle className="text-lg font-semibold transition-all duration-300 group-hover:text-purple-700">Lead Distribution</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card className="border-2 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <CardTitle className="text-lg font-semibold transition-all duration-300 group-hover:text-blue-700">Lead Statistics</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
              </CardContent>
            </Card>
            </div>

          {/* Additional Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <Card className="border-2 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-green-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <CardTitle className="text-lg font-semibold transition-all duration-300 group-hover:text-green-700">Revenue Trend</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Conversion Rate Chart */}
            <Card className="border-2 group shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-orange-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <CardTitle className="text-lg font-semibold transition-all duration-300 group-hover:text-orange-700">Conversion Rates</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={conversionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Rate']} />
                    <Bar dataKey="rate" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Original Dashboard View */
        <>
          {/* Lead Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
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
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-purple-600">Revenue Overview</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Overall Revenue */}
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 shadow-sm hover:shadow-lg hover:scale-105 hover:border-blue-300 hover:bg-blue-100 transition-all duration-300 ease-in-out cursor-pointer group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-blue-600 group-hover:scale-110 transition-transform duration-300">₹</div>
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-300">Overall Revenue</h3>
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-blue-600 group-hover:scale-105 transition-transform duration-300">
                    {formatCurrency(currentData.overallRevenue)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">Total Revenue (All Time)</p>
              </div>

              {/* Total Revenue */}
              <div className="bg-gray-100 rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:scale-105 hover:border-gray-300 hover:bg-gray-200 transition-all duration-300 ease-in-out cursor-pointer group">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-gray-600 group-hover:scale-110 group-hover:text-gray-700 transition-all duration-300" />
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-300">Total Revenue</h3>
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
                    {formatCurrency(currentData.totalRevenue)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">Filtered Revenue</p>
              </div>

              {/* Current Month */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:scale-105 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 ease-in-out cursor-pointer group">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-gray-600 group-hover:scale-110 group-hover:text-gray-700 transition-all duration-300" />
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-300">Current month earnings</h3>
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
                    {formatCurrency(currentData.currentMonthEarnings)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">September Revenue</p>
              </div>

              {/* Month Growth */}
              <div className="bg-red-50 rounded-lg border border-red-200 p-6 shadow-sm hover:shadow-lg hover:scale-105 hover:border-red-300 hover:bg-red-100 transition-all duration-300 ease-in-out cursor-pointer group">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingDown className="w-5 h-5 text-green-600 group-hover:scale-110 group-hover:text-green-700 transition-all duration-300" />
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-300">Month-over-Month Growth</h3>
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-red-600 group-hover:scale-105 transition-transform duration-300">
                    {currentData.monthGrowth}%
                  </span>
                  <TrendingDown className="w-4 h-4 inline ml-2 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">Revenue decreased compared to August</p>
              </div>
            </div>
          </div>

          {/* Conversion Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              icon={Users}
              title="Conversion Rate"
              value={`${currentData.conversionRate}%`}
              subtitle={`${Math.round(currentData.totalLeads * currentData.conversionRate / 100)} of ${currentData.totalLeads} leads converted`}
              trendColor="text-green-600"
            />
            
            <MetricCard
              icon={Calendar}
              title="Meeting Scheduled Conversion"
              value={`${currentData.meetingConversion}%`}
              subtitle={`${Math.round(currentData.meetingScheduled * currentData.meetingConversion / 100)} of ${currentData.meetingScheduled} leads scheduled`}
              trendColor="text-purple-600"
            />
            
            <MetricCard
              icon={Clock}
              title="Pending Rate"
              value={`${currentData.pendingRate}%`}
              subtitle={`${Math.round(currentData.totalLeads * currentData.pendingRate / 100)} of ${currentData.totalLeads} leads pending`}
              trendColor="text-orange-600"
            />
          </div>

          {/* Performance Insights */}
          <div className="mt-6 space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>Higher conversion rates indicate better sales performance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>Higher meeting scheduled rates indicate better lead engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>Lower pending rates indicate more efficient processing</span>
            </div>
          </div>
        </>
      )}
        </>
      )}
    </div>
  );
};

export default SalesDashboard;