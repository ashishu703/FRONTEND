import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import LeadStatusCards from '../../components/dashboard/LeadStatusCards';
import TargetTimeline from '../../components/dashboard/TargetTimeline';
import KeyPerformanceMetrics from '../../components/dashboard/KeyPerformanceMetrics';
import TopPerformers from '../../components/dashboard/TopPerformers';
import BusinessMetrics from '../../components/dashboard/BusinessMetrics';
import ColorfulPieChart from '../../components/dashboard/ColorfulPieChart';
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton';
import salesDataService from '../../services/SalesDataService';
import StatCard from '../../components/dashboard/StatCard';
import { DollarSign, Ticket, CheckCircle, Clock, XCircle, Server } from 'lucide-react';
import paymentService from '../../api/admin_api/paymentService';
import quotationService from '../../api/admin_api/quotationService';
import apiClient from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../api/admin_api/api';
import departmentHeadService from '../../api/admin_api/departmentHeadService';

const SuperAdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [dateRange, setDateRange] = useState('Select date range');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [salesData, setSalesData] = useState({
    leads: {
      total: 0, pending: 0, running: 0, converted: 0, interested: 0,
      winClosed: 0, closed: 0, lost: 0, meetingScheduled: 0,
      quotationSent: 0, closedLostFollowup: 0
    },
    revenue: {
      target: 0, achieved: 0, daysLeft: 0,
      targetStartDate: null, targetEndDate: null
    },
    metrics: {
      totalLeads: 0, conversionRate: 0, pendingRate: 0, totalRevenue: 0,
      conversionRateChange: 3.2, pendingRateChange: -2.1
    },
    quotations: { total: 0, approved: 0, pending: 0, rejected: 0 },
    proformaInvoices: { total: 0, approved: 0, pending: 0, rejected: 0 },
    payments: { totalAdvance: 0, duePayment: 0, totalSaleOrder: 0, totalReceived: 0 },
    topPerformers: []
  });

  const [accountsData, setAccountsData] = useState({
    pending: { count: 0, amount: 0 },
    approved: { count: 0, amount: 0 },
    rejected: { count: 0, amount: 0 }
  });

  const [itData, setItData] = useState({
    resolved: 0,
    pending: 0,
    inProgress: 0,
    open: 0,
    closed: 0
  });

  // OPTIMIZED: Fetch revenue targets with parallel pagination
  const fetchRevenueTargets = useCallback(async () => {
    try {
      // Fetch first page to get total pages, then fetch all in parallel
      const firstPageResponse = await departmentHeadService.listHeads({
        page: 1,
        limit: 100,
        departmentType: 'office_sales',
        isActive: true
      });
      
      const pagination = firstPageResponse?.pagination || firstPageResponse?.data?.pagination;
      const totalPages = pagination?.pages || 1;
      const firstPageData = firstPageResponse?.users || firstPageResponse?.data?.users || [];
      
      // If only one page, process and return early
      if (totalPages <= 1) {
        let allSalesHeads = firstPageData;
        
        // Filter to ensure only office_sales department heads
        const officeSalesHeads = allSalesHeads.filter(head => {
          const deptType = head.department_type || head.departmentType || '';
          return deptType.toLowerCase() === 'office_sales';
        });
        
        // Deduplicate by email
        const uniqueHeadsMap = new Map();
        officeSalesHeads.forEach(head => {
          const key = head.email || head.id;
          if (key && !uniqueHeadsMap.has(key)) {
            uniqueHeadsMap.set(key, head);
          }
        });
        const uniqueHeads = Array.from(uniqueHeadsMap.values());
        
        // Aggregate targets
        let totalTarget = 0;
        let earliestStartDate = null;
        let latestEndDate = null;
        
        uniqueHeads.forEach(head => {
          const targetValue = head.target || 0;
          const target = typeof targetValue === 'string' 
            ? parseFloat(targetValue.replace(/,/g, '')) || 0
            : parseFloat(targetValue) || 0;
          totalTarget += target;
          
          const startDate = head.target_start_date || head.targetStartDate;
          const endDate = head.target_end_date || head.targetEndDate;
          
          if (startDate) {
            const start = new Date(startDate);
            if (!earliestStartDate || start < earliestStartDate) {
              earliestStartDate = start;
            }
          }
          
          if (endDate) {
            const end = new Date(endDate);
            if (!latestEndDate || end > latestEndDate) {
              latestEndDate = end;
            }
          }
        });
        
        let daysLeft = 0;
        if (latestEndDate) {
          daysLeft = salesDataService.calculateDaysLeft(latestEndDate.toISOString().split('T')[0]);
        }
        
        setSalesData(prev => ({
          ...prev,
          revenue: {
            ...prev.revenue,
            target: totalTarget,
            targetStartDate: earliestStartDate ? earliestStartDate.toISOString().split('T')[0] : null,
            targetEndDate: latestEndDate ? latestEndDate.toISOString().split('T')[0] : null,
            daysLeft: daysLeft
          }
        }));
        return;
      }
      
      // Fetch remaining pages in parallel (skip page 1 as we already have it)
      const pagePromises = [];
      for (let page = 2; page <= totalPages; page++) {
        pagePromises.push(
          departmentHeadService.listHeads({
            page,
            limit: 100,
            departmentType: 'office_sales',
            isActive: true
          })
        );
      }
      
      const remainingResponses = await Promise.all(pagePromises);
      let allSalesHeads = [...firstPageData];
      
      remainingResponses.forEach(response => {
        const heads = response?.users || response?.data?.users || [];
        allSalesHeads = allSalesHeads.concat(heads);
      });
      
      // Filter to ensure only office_sales department heads
      const officeSalesHeads = allSalesHeads.filter(head => {
        const deptType = head.department_type || head.departmentType || '';
        return deptType.toLowerCase() === 'office_sales';
      });
      
      // Deduplicate by email
      const uniqueHeadsMap = new Map();
      officeSalesHeads.forEach(head => {
        const key = head.email || head.id;
        if (key && !uniqueHeadsMap.has(key)) {
          uniqueHeadsMap.set(key, head);
        }
      });
      const uniqueHeads = Array.from(uniqueHeadsMap.values());
      
      // Aggregate targets
      let totalTarget = 0;
      let earliestStartDate = null;
      let latestEndDate = null;
      
      uniqueHeads.forEach(head => {
        const targetValue = head.target || 0;
        const target = typeof targetValue === 'string' 
          ? parseFloat(targetValue.replace(/,/g, '')) || 0
          : parseFloat(targetValue) || 0;
        totalTarget += target;
        
        const startDate = head.target_start_date || head.targetStartDate;
        const endDate = head.target_end_date || head.targetEndDate;
        
        if (startDate) {
          const start = new Date(startDate);
          if (!earliestStartDate || start < earliestStartDate) {
            earliestStartDate = start;
          }
        }
        
        if (endDate) {
          const end = new Date(endDate);
          if (!latestEndDate || end > latestEndDate) {
            latestEndDate = end;
          }
        }
      });
      
      // Calculate days left
      let daysLeft = 0;
      if (latestEndDate) {
        daysLeft = salesDataService.calculateDaysLeft(latestEndDate.toISOString().split('T')[0]);
      }
      
      // Update revenue data
      setSalesData(prev => ({
        ...prev,
        revenue: {
          ...prev.revenue,
          target: totalTarget,
          targetStartDate: earliestStartDate ? earliestStartDate.toISOString().split('T')[0] : null,
          targetEndDate: latestEndDate ? latestEndDate.toISOString().split('T')[0] : null,
          daysLeft: daysLeft
        }
      }));
      
    } catch (error) {
      console.error('[SuperAdminDashboard] Error fetching revenue targets:', error);
      setSalesData(prev => ({
        ...prev,
        revenue: {
          ...prev.revenue,
          target: 0,
          targetStartDate: null,
          targetEndDate: null,
          daysLeft: 0
        }
      }));
    }
  }, []);

  // OPTIMIZED: Parallel API calls in fetchSalesData with progressive updates
  const fetchSalesData = useCallback(async () => {
    setRefreshing(true);
    try {
      // Step 1: Fetch leads
      const allLeads = await salesDataService.fetchAllLeads('office_sales');
      const leadStatuses = salesDataService.calculateLeadStatuses(allLeads);
      const leadIds = allLeads.map(l => l.id).filter(id => id != null);
      
      // Update leads immediately (progressive loading)
      setSalesData(prev => ({
        ...prev,
        leads: leadStatuses,
        metrics: {
          ...prev.metrics,
          totalLeads: leadStatuses.total
        }
      }));
      
      // Step 2: Fetch quotations (depends on leadIds)
      const allQuotations = await salesDataService.fetchQuotations(leadIds);
      const quotations = salesDataService.calculateQuotationMetrics(allQuotations);
      leadStatuses.quotationSent = quotations.total;
      const quotationIds = allQuotations.map(q => q.id).filter(id => id != null);
      
      // Update quotations immediately
      setSalesData(prev => ({
        ...prev,
        quotations,
        leads: { ...prev.leads, quotationSent: quotations.total }
      }));
      
      // Step 3: Parallel fetch of payments and PIs (skip summaries for now)
      const [allPayments, allPIs] = await Promise.all([
        salesDataService.fetchPayments(quotationIds, leadIds),
        salesDataService.fetchProformaInvoices(quotationIds)
      ]);
      
      const proformaInvoices = salesDataService.calculatePIMetrics(allPIs);
      const quotationIdsWithPI = new Set(allPIs.map(pi => pi.quotation_id).filter(id => id != null));
      const quotationsWithPI = allQuotations.filter(q => quotationIdsWithPI.has(q.id));
      
      // Update PIs immediately
      setSalesData(prev => ({
        ...prev,
        proformaInvoices,
        payments: {
          ...prev.payments,
          totalSaleOrder: quotationIdsWithPI.size
        }
      }));
      
      // Step 4: Calculate payment metrics (fast)
      const { totalReceived, totalAdvance } = salesDataService.calculatePaymentMetrics(
        allPayments, quotationsWithPI, allQuotations
      );
      const { conversionRate, pendingRate } = salesDataService.calculateMetrics(leadStatuses);
      
      // Update payment metrics immediately
      setSalesData(prev => ({
        ...prev,
        revenue: {
          ...prev.revenue,
          achieved: totalReceived,
        },
        metrics: {
          ...prev.metrics,
          conversionRate,
          pendingRate,
          totalRevenue: totalReceived,
          conversionRateChange: 3.2,
          pendingRateChange: -2.1
        },
        payments: {
          ...prev.payments,
          totalAdvance,
          totalReceived
        }
      }));
      
      // Step 5: Heavy calculations in background (non-blocking)
      // Calculate duePayment and topPerformers asynchronously
      Promise.all([
        salesDataService.calculateDuePayment(quotationsWithPI, allQuotations, allPayments),
        salesDataService.calculateTopPerformers(allPayments, allLeads, allQuotations, 'office_sales')
      ]).then(([duePayment, topPerformers]) => {
        setSalesData(prev => ({
          ...prev,
          payments: {
            ...prev.payments,
            duePayment
          },
          topPerformers
        }));
      }).catch(error => {
        console.error('[SuperAdminDashboard] Error in heavy calculations:', error);
      });
      
    } catch (error) {
      console.error('[SuperAdminDashboard] Error fetching sales data:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const formatDisplayRange = useCallback((start, end) => {
    if (!start && !end) return 'Select date range';
    if (start && end) return `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}`;
    if (start) return `${new Date(start).toLocaleDateString()} - ...`;
    return `... - ${new Date(end).toLocaleDateString()}`;
  }, []);

  // OPTIMIZED: Parallel fetch for accounts data
  const fetchAccountsData = useCallback(async () => {
    try {
      const statuses = ['pending', 'approved', 'rejected'];
      const responses = await Promise.all(
        statuses.map((status) =>
          paymentService.getAllPayments({ approvalStatus: status, limit: 1 })
        )
      );

      const nextStats = {};
      responses.forEach((res, idx) => {
        const status = statuses[idx];
        const rows = Array.isArray(res?.data) ? res.data : [];
        const total = res?.pagination?.total ?? rows.length;
        const totalAmount = rows.reduce((sum, row) => sum + Number(row.installment_amount || 0), 0);
        nextStats[status] = { count: total, amount: totalAmount };
      });
      setAccountsData(nextStats);
    } catch (err) {
      console.error('Failed to load accounts stats', err);
      setAccountsData({
        pending: { count: 0, amount: 0 },
        approved: { count: 0, amount: 0 },
        rejected: { count: 0, amount: 0 }
      });
    }
  }, []);

  const fetchITData = useCallback(async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TICKETS_LIST());
      const tickets = response?.data || response || [];
      
      const stats = {
        resolved: tickets.filter(t => (t.status || '').toLowerCase() === 'resolved').length,
        pending: tickets.filter(t => {
          const status = (t.status || '').toLowerCase();
          return status === 'open' || status === 'pending';
        }).length,
        inProgress: tickets.filter(t => (t.status || '').toLowerCase() === 'in progress').length,
        open: tickets.filter(t => (t.status || '').toLowerCase() === 'open').length,
        closed: tickets.filter(t => (t.status || '').toLowerCase() === 'closed').length
      };
      
      setItData(stats);
    } catch (err) {
      console.error('Failed to load IT stats', err);
      setItData({
        resolved: 0,
        pending: 0,
        inProgress: 0,
        open: 0,
        closed: 0
      });
    }
  }, []);

  const applyDateRange = useCallback(() => {
    setDateRange(formatDisplayRange(startDate, endDate));
    setShowDatePicker(false);
    // Refresh all data in parallel
    Promise.all([
      fetchSalesData(),
      fetchAccountsData(),
      fetchITData(),
      fetchRevenueTargets()
    ]);
  }, [startDate, endDate, formatDisplayRange, fetchSalesData, fetchAccountsData, fetchITData, fetchRevenueTargets]);

  const clearDateRange = useCallback(() => {
    setStartDate('');
    setEndDate('');
    setDateRange('Select date range');
    setShowDatePicker(false);
    // Refresh all data in parallel
    Promise.all([
      fetchSalesData(),
      fetchAccountsData(),
      fetchITData(),
      fetchRevenueTargets()
    ]);
  }, [fetchSalesData, fetchAccountsData, fetchITData, fetchRevenueTargets]);

  // OPTIMIZED: Memoized chart data calculation
  const leadStatusChartData = useMemo(() => {
    return [
      { label: 'Pending', value: salesData.leads.pending || 0, color: '#8b5cf6' },
      { label: 'Running', value: salesData.leads.running || 0, color: '#3b82f6' },
      { label: 'Converted', value: salesData.leads.converted || 0, color: '#10b981' },
      { label: 'Interested', value: salesData.leads.interested || 0, color: '#f59e0b' },
      { label: 'Win/Closed', value: salesData.leads.winClosed || 0, color: '#10b981' },
      { label: 'Closed', value: salesData.leads.closed || 0, color: '#6366f1' },
      { label: 'Lost', value: salesData.leads.lost || 0, color: '#ef4444' }
    ].filter(item => item.value > 0);
  }, [salesData.leads]);

  // OPTIMIZED: Memoized total chart value
  const totalChartValue = useMemo(() => {
    return leadStatusChartData.reduce((sum, item) => sum + item.value, 0);
  }, [leadStatusChartData]);

  // OPTIMIZED: Memoized refresh handler
  const handleRefresh = useCallback(() => {
    Promise.all([
      fetchSalesData(),
      fetchAccountsData(),
      fetchITData(),
      fetchRevenueTargets()
    ]);
  }, [fetchSalesData, fetchAccountsData, fetchITData, fetchRevenueTargets]);

  // Initial data load
  useEffect(() => {
    let isMounted = true;
    
    const loadAllData = async () => {
      setInitialLoading(true);
      try {
        await Promise.all([
          fetchSalesData(),
          fetchAccountsData(),
          fetchITData(),
          fetchRevenueTargets()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    };
    
    loadAllData();
    
    return () => {
      isMounted = false;
    };
  }, [selectedPeriod, fetchSalesData, fetchAccountsData, fetchITData, fetchRevenueTargets]);

  // Show skeleton loader instead of spinner
  if (initialLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Live Updates</span>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDatePicker((v) => !v)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-60 text-left"
              >
                {dateRange}
              </button>
              {showDatePicker && (
                <div className="absolute z-20 mt-2 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-64">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 mt-4">
                    <button onClick={clearDateRange} className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800">Clear</button>
                    <button onClick={() => setShowDatePicker(false)} className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
                    <button onClick={applyDateRange} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Apply</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-purple-600">Sales Department</h2>
        </div>
        
        <LeadStatusCards leads={salesData.leads} />
        <TargetTimeline revenue={salesData.revenue} />
        <KeyPerformanceMetrics metrics={salesData.metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ColorfulPieChart
            title="Total Leads Distribution"
            data={leadStatusChartData}
            total={totalChartValue || salesData.leads.total || 0}
          />
          <TopPerformers performers={salesData.topPerformers || []} />
        </div>

        <BusinessMetrics
          quotations={salesData.quotations}
          proformaInvoices={salesData.proformaInvoices}
          payments={salesData.payments}
        />
      </div>

      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-green-600">Accounts Department</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Pending Payments" 
            value={accountsData.pending.count} 
            icon={Clock} 
            color={{ bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', value: 'text-amber-600' }} 
            description={`₹${accountsData.pending.amount.toLocaleString('en-IN')} pending approval`} 
          />
          <StatCard 
            title="Approved Payments" 
            value={accountsData.approved.count} 
            icon={CheckCircle} 
            color={{ bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', value: 'text-emerald-600' }} 
            description={`₹${accountsData.approved.amount.toLocaleString('en-IN')} approved`} 
          />
          <StatCard 
            title="Rejected Payments" 
            value={accountsData.rejected.count} 
            icon={XCircle} 
            color={{ bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600', value: 'text-rose-600' }} 
            description={`₹${accountsData.rejected.amount.toLocaleString('en-IN')} rejected`} 
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Server className="w-6 h-6 text-cyan-600" />
          <h2 className="text-2xl font-bold text-cyan-600">IT Department</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard 
            title="Resolved Tickets" 
            value={itData.resolved} 
            icon={CheckCircle} 
            color={{ bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', value: 'text-emerald-600' }} 
            description="Tickets resolved" 
          />
          <StatCard 
            title="Pending Tickets" 
            value={itData.pending} 
            icon={Clock} 
            color={{ bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', value: 'text-amber-600' }} 
            description="Tickets pending" 
          />
          <StatCard 
            title="In Progress" 
            value={itData.inProgress} 
            icon={Ticket} 
            color={{ bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', value: 'text-blue-600' }} 
            description="Tickets in progress" 
          />
          <StatCard 
            title="Open Tickets" 
            value={itData.open} 
            icon={Ticket} 
            color={{ bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', value: 'text-indigo-600' }} 
            description="Open tickets" 
          />
          <StatCard 
            title="Closed Tickets" 
            value={itData.closed} 
            icon={CheckCircle} 
            color={{ bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', value: 'text-slate-600' }} 
            description="Closed tickets" 
          />
        </div>
      </div>
    </div>
  );
};

export default memo(SuperAdminDashboard);
