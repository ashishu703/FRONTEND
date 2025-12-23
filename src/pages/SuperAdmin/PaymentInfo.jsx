import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, User, DollarSign, Clock, Calendar, Link, Copy, Eye, MoreHorizontal, CreditCard, AlertCircle, CheckCircle, XCircle, ChevronDown, Edit, Package, RotateCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Building2, Users } from 'lucide-react';
import paymentService from '../../api/admin_api/paymentService';
import departmentHeadService from '../../api/admin_api/departmentHeadService';
import PaymentInfoTable from '../../components/payment/PaymentInfoTable';
import { SkeletonTable, SkeletonStatCard } from '../../components/dashboard/DashboardSkeleton';

const PaymentInfo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingPayment, setViewingPayment] = useState(null);
  const [isModalAnimating, setIsModalAnimating] = useState(false);
  const [departmentHeadsMap, setDepartmentHeadsMap] = useState({}); // Map to store department head info
  const [leadsMap, setLeadsMap] = useState({}); // Map lead_id -> {companyName, departmentType}
  
  // Date range filter
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [showDateRangeFilter, setShowDateRangeFilter] = useState(false);
  
  const [payments, setPayments] = useState([]);
  const [allPaymentsData, setAllPaymentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // Initial page load state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Fetch all leads to get company name and department type
  const fetchLeads = async () => {
    try {
      let allLeads = [];
      let page = 1;
      const limit = 100;
      
      while (true) {
        const response = await departmentHeadService.getAllLeads({
          page,
          limit
        });
        
        const leadsData = response?.data || response?.leads || [];
        if (!leadsData || leadsData.length === 0) break;
        
        allLeads = allLeads.concat(leadsData);
        
        const pagination = response?.pagination;
        if (!pagination || page >= pagination.pages || leadsData.length < limit) break;
        page += 1;
      }
      
      // Create a map: lead_id -> {companyName, departmentType}
      // Store both string and number versions of ID for matching
      const leadsDataMap = {};
      allLeads.forEach(lead => {
        if (lead.id) {
          const leadId = String(lead.id);
          const leadIdNum = Number(lead.id);
          const leadInfo = {
            companyName: lead.company_name || lead.companyName || 'N/A',
            departmentType: lead.department_type || lead.departmentType || ''
          };
          // Store with both string and number keys for flexible matching
          leadsDataMap[leadId] = leadInfo;
          if (!isNaN(leadIdNum)) {
            leadsDataMap[leadIdNum] = leadInfo;
          }
        }
      });
      
      setLeadsMap(leadsDataMap);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Fetch all department heads to map company + department to department head name
  const fetchDepartmentHeads = async () => {
    try {
      let allHeads = [];
      let page = 1;
      const limit = 100;
      
      while (true) {
        const response = await departmentHeadService.listHeads({
          page,
          limit,
          isActive: true
        });
        
        const heads = response?.users || response?.data?.users || [];
        if (!heads || heads.length === 0) break;
        
        allHeads = allHeads.concat(heads);
        
        const pagination = response?.pagination || response?.data?.pagination;
        if (!pagination || page >= pagination.pages || heads.length < limit) break;
        page += 1;
      }
      
      // Create a map: "companyName|departmentType" -> department head name
      const headsMap = {};
      allHeads.forEach(head => {
        const companyName = head.company_name || head.companyName || '';
        const departmentType = head.department_type || head.departmentType || '';
        const key = `${companyName}|${departmentType}`;
        if (key !== '|') { 
          headsMap[key] = head.username || head.email || 'N/A';
        }
      });
      
      setDepartmentHeadsMap(headsMap);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Fetch all payments from all companies and departments
  const fetchAllPayments = async () => {
    try {
      setLoading(true);
      
      const response = await paymentService.getAllPayments({
        page: 1,
        limit: 10000
      });
      
      const paymentsData = response?.data || [];
      
      // Transform payment data
      const transformedPayments = paymentsData.map((payment) => {
        const paymentAmount = Number(payment.installment_amount || payment.paid_amount || 0);
        const quotationTotal = Number(payment.quotation_total_amount || payment.total_quotation_amount || 0);
        const quotationTotalPaid = Number(payment.quotation_total_paid || 0);
        const quotationRemainingDue = Number(payment.quotation_remaining_due || 0);
        
        const approvalStatus = (payment.approval_status || '').toLowerCase();
        let displayStatus = 'Due';
        
        if (approvalStatus === 'rejected') {
          displayStatus = 'Rejected';
        } else {
          if (quotationTotal > 0) {
            if (quotationTotalPaid >= quotationTotal) {
              displayStatus = 'Paid';
            } else if (quotationTotalPaid > 0) {
              displayStatus = 'Advance';
            }
          } else if (quotationTotalPaid > 0) {
            displayStatus = 'Advance';
          }
        }
        
        const paymentDateObj = payment.payment_date ? new Date(payment.payment_date) : (payment.created_at ? new Date(payment.created_at) : null);
        const formattedPaymentDate = paymentDateObj ? paymentDateObj.toLocaleDateString('en-GB') : 'N/A';
        
        // Get company name, department type, and department head name from backend response
        // Fallback to mapping if backend data is not available
        const companyName = payment.lead_company_name && payment.lead_company_name !== 'N/A' 
          ? payment.lead_company_name 
          : (leadsMap[payment.lead_id]?.companyName || 'N/A');
        
        const departmentType = payment.lead_department_type && payment.lead_department_type !== 'N/A'
          ? payment.lead_department_type
          : (leadsMap[payment.lead_id]?.departmentType || '');
        
        const departmentHeadName = payment.department_head_name && payment.department_head_name !== 'N/A'
          ? payment.department_head_name
          : (departmentHeadsMap[`${companyName}|${departmentType}`] || 'N/A');
        
        return {
          id: payment.id,
          leadId: payment.lead_id,
          leadIdDisplay: `LD-${payment.lead_id}`,
          customer: {
            name: payment.customer_name || payment.lead_customer_name || 'N/A',
            email: payment.lead_email || 'N/A',
            phone: payment.lead_phone || 'N/A'
          },
          productName: payment.product_name_from_quotation || payment.product_name || 'N/A',
          address: payment.address || 'N/A',
          salespersonName: payment.salesperson_name || payment.salespersonName || 'N/A',
          companyName: companyName,
          departmentHeadName: departmentHeadName,
          amount: paymentAmount,
          quotationTotal: quotationTotal,
          quotationTotalPaid: quotationTotalPaid,
          quotationRemainingDue: quotationRemainingDue,
          totalAmount: quotationTotal,
          paidAmount: quotationTotalPaid,
          dueAmount: quotationRemainingDue,
          status: displayStatus,
          paymentStatus: payment.payment_status || 'pending',
          approvalStatus: payment.approval_status || 'pending',
          created: payment.payment_date ? new Date(payment.payment_date).toLocaleString() : (payment.created_at ? new Date(payment.created_at).toLocaleString() : ''),
          paymentDate: payment.payment_date || payment.created_at,
          formattedPaymentDate: formattedPaymentDate,
          paymentLink: payment.payment_receipt_url || '',
          quotationId: payment.quotation_number || `QT-${String(payment.quotation_id || '').slice(-4)}`,
          quotationIdRaw: payment.quotation_id || null, // Store raw quotation_id for grouping
          piId: payment.pi_number || `PI-${String(payment.pi_id || '').slice(-4)}`,
          purchaseOrderId: payment.purchase_order_id || 'N/A',
          deliveryDate: payment.delivery_date ? new Date(payment.delivery_date).toLocaleDateString('en-GB') : 'N/A',
          deliveryStatus: payment.delivery_status || 'pending',
          paymentData: payment
        };
      });
      
      setAllPaymentsData(transformedPayments);
      setPayments(transformedPayments);
      return true;
    } catch (e) {
      setAllPaymentsData([]);
      setPayments([]);
      setPagination({ page: 1, limit: 50, total: 0, pages: 0 });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load fallback data on component mount (optional, backend provides this data)
  useEffect(() => {
    Promise.all([fetchLeads(), fetchDepartmentHeads()]).catch(() => {
      // Silently fail - backend provides the main data
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch payments - no longer need to wait for maps since backend provides the data
  useEffect(() => {
    const loadPayments = async () => {
      if (initialLoading) {
        await fetchAllPayments();
        setInitialLoading(false);
      }
    };
    
    loadPayments();
  }, [initialLoading]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [searchTerm, statusFilter, dateRange.startDate, dateRange.endDate]);

  // Client-side filtering
  const filteredPayments = allPaymentsData.filter(payment => {
    const matchesSearch = !searchTerm || 
      payment.leadIdDisplay?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer?.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.quotationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.departmentHeadName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter !== 'All Status') {
      if (statusFilter === 'Due') {
        // For "Due" filter, check if payment has a due amount > 0
        const dueAmount = Number(payment.quotationRemainingDue || payment.dueAmount || 0);
        matchesStatus = dueAmount > 0 && payment.status !== 'Paid' && payment.status !== 'Rejected';
      } else {
        matchesStatus = payment.status === statusFilter;
      }
    }
    
    let matchesDateRange = true;
    if (dateRange.startDate || dateRange.endDate) {
      if (!payment.paymentDate) {
        matchesDateRange = false;
      } else {
        const paymentDate = new Date(payment.paymentDate);
        paymentDate.setHours(0, 0, 0, 0);
        
        if (dateRange.startDate) {
          const startDate = new Date(dateRange.startDate);
          startDate.setHours(0, 0, 0, 0);
          if (paymentDate < startDate) {
            matchesDateRange = false;
          }
        }
        
        if (dateRange.endDate) {
          const endDate = new Date(dateRange.endDate);
          endDate.setHours(23, 59, 59, 999);
          if (paymentDate > endDate) {
            matchesDateRange = false;
          }
        }
      }
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Calculate pagination
  const totalFiltered = filteredPayments.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pagination.limit));
  
  useEffect(() => {
    if (totalPages > 0 && pagination.page > totalPages) {
      setPagination(prev => ({ ...prev, page: totalPages }));
    }
  }, [totalPages, pagination.page]);
  
  const currentPage = Math.min(Math.max(1, pagination.page), totalPages);
  const startIndex = (currentPage - 1) * pagination.limit;
  const endIndex = Math.min(startIndex + pagination.limit, totalFiltered);
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    if (validPage >= 1 && validPage <= totalPages && validPage !== pagination.page) {
      setPagination(prev => ({ ...prev, page: validPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(pagination.page - 1);
  const goToNextPage = () => goToPage(pagination.page + 1);

  // Calculate stats using PaymentInfoTable utility
  const stats = PaymentInfoTable.calculateStats(filteredPayments);

  const getStatusColor = PaymentInfoTable.getStatusColor;
  const formatCurrency = PaymentInfoTable.formatCurrency;
  
  const getStatusIcon = (status) => {
    const Icon = PaymentInfoTable.getStatusIcon(status);
    return <Icon className="w-4 h-4" />;
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
  };

  const handleViewPayment = (payment) => {
    setViewingPayment(payment);
    setShowViewModal(true);
    setTimeout(() => {
      setIsModalAnimating(true);
    }, 10);
  };

  const closeViewModal = () => {
    setIsModalAnimating(false);
    setTimeout(() => {
      setShowViewModal(false);
      setViewingPayment(null);
    }, 300);
  };


  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setEditFormData({
      customerId: payment.customerId,
      customerName: payment.customer.name,
      customerEmail: payment.customer.email,
      customerPhone: payment.customer.phone,
      amount: payment.amount,
      totalAmount: payment.totalAmount,
      dueAmount: payment.dueAmount,
      status: payment.status,
      paymentLink: payment.paymentLink
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingPayment(null);
    setEditFormData({});
  };

  const handleFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = () => {
    if (editingPayment) {
      console.log('Updated payment:', editFormData);
      alert(`Payment updated successfully!`);
    }
    closeEditModal();
  };

  // Handle click outside to close filter dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilterDropdown && !event.target.closest('.filter-dropdown')) {
        setShowFilterDropdown(false);
      }
      if (showDateRangeFilter && !event.target.closest('.date-range-filter')) {
        setShowDateRangeFilter(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterDropdown, showDateRangeFilter]);

  const StatCard = ({ title, value, subtitle, color, bgColor, icon: Icon }) => (
    <div className={`${bgColor} rounded-lg border p-4 shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} />
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        </div>
      </div>
      <div className="mb-1">
        <span className={`text-2xl font-bold ${color}`}>{value}</span>
      </div>
      <p className="text-xs text-gray-600">{subtitle}</p>
    </div>
  );

  // Show skeleton loader while initial data is loading
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
        </div>

        {/* Stats Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonStatCard key={i} />
          ))}
        </div>

        {/* Search and filters skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-10 bg-gray-200 rounded w-96 animate-pulse"></div>
            <div className="flex items-center gap-3">
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
            </div>
          </div>

          {/* Table skeleton */}
          <SkeletonTable rows={10} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Info</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <StatCard
          title="All Payments"
          value={stats.allPayments}
          subtitle={`₹${stats.totalValue.toLocaleString('en-IN')} total value`}
          color="text-blue-600"
          bgColor="bg-blue-50 border-blue-200"
          icon={CreditCard}
        />
        <StatCard
          title="Paid"
          value={stats.paid}
          subtitle="Fully paid"
          color="text-green-600"
          bgColor="bg-green-50 border-green-200"
          icon={CheckCircle}
        />
        <StatCard
          title="Advance"
          value={stats.advance}
          subtitle="Partial payments"
          color="text-purple-600"
          bgColor="bg-purple-50 border-purple-200"
          icon={Clock}
        />
        <StatCard
          title="Due"
          value={stats.due}
          subtitle="Pending payments"
          color="text-red-600"
          bgColor="bg-red-50 border-red-200"
          icon={XCircle}
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by Lead ID, customer, company, department head..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors text-gray-700"
            />
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            {/* Date Range Filter */}
            <div className="relative date-range-filter">
              <button
                onClick={() => setShowDateRangeFilter(!showDateRangeFilter)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Date Range</span>
                {(dateRange.startDate || dateRange.endDate) && (
                  <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">●</span>
                )}
              </button>
              
              {showDateRangeFilter && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20 p-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setDateRange({ startDate: '', endDate: '' });
                        setShowDateRangeFilter(false);
                      }}
                      className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setShowDateRangeFilter(false)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative filter-dropdown">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm font-medium text-gray-500 border-b border-gray-100">Status Filter</div>
                    <button 
                      onClick={() => { setStatusFilter('All Status'); setShowFilterDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${statusFilter === 'All Status' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      All Status
                    </button>
                    <button 
                      onClick={() => { setStatusFilter('Paid'); setShowFilterDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${statusFilter === 'Paid' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      Paid
                    </button>
                    <button 
                      onClick={() => { setStatusFilter('Advance'); setShowFilterDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${statusFilter === 'Advance' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      Advance
                    </button>
                    <button 
                      onClick={() => { setStatusFilter('Due'); setShowFilterDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${statusFilter === 'Due' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      Due
                    </button>
                    <button 
                      onClick={() => { setStatusFilter('Rejected'); setShowFilterDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${statusFilter === 'Rejected' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      Rejected
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none cursor-pointer min-w-[140px]"
            >
              <option value="All Status">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Advance">Advance</option>
              <option value="Due">Due</option>
              <option value="Rejected">Rejected</option>
            </select>
            
            <button 
              onClick={() => {
                Promise.all([
                  fetchLeads(),
                  fetchDepartmentHeads()
                ]).then(() => {
                  fetchAllPayments();
                });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              title="Refresh payments"
            >
              <RotateCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Lead ID</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Customer Name</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Company</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Department Head</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Salesperson</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Product Name</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Address</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Quotation ID</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Payment Status</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Payment Date</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Purchase Order</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Delivery Date</span>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="13" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                        Loading payments...
                      </div>
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="13" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-3 text-gray-400" />
                        <p className="text-lg font-medium mb-1">No Payments Found</p>
                        <p className="text-sm">
                          {allPaymentsData.length === 0 
                            ? 'No payment data available. Payments will appear here once quotations have PIs and payments are approved.'
                            : 'No payments match your current filters. Try adjusting your search or filter criteria.'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 font-medium">
                        {payment.leadIdDisplay || `LD-${payment.leadId}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{payment.customer?.name || 'N/A'}</div>
                        {payment.customer?.phone && (
                          <div className="text-xs text-gray-600 mt-1">{payment.customer.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 font-medium">{payment.companyName || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 font-medium">{payment.departmentHeadName || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 font-medium">{payment.salespersonName || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{payment.productName || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        {(() => {
                          const address = payment.address || 'N/A';
                          if (!address || address === 'N/A') return <span className="text-sm text-gray-700">N/A</span>;
                          const parts = address.split(',').map(part => part.trim()).filter(part => part);
                          return parts.length > 0 ? parts.map((part, idx) => (
                            <span key={idx} className="text-sm text-gray-700">{part}</span>
                          )) : <span className="text-sm text-gray-700">N/A</span>;
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 font-mono">{payment.quotationId || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                            {getStatusIcon(payment.status)}
                            {payment.status}
                          </span>
                          {payment.amount > 0 && (
                            <span className="text-sm text-gray-600">₹{payment.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                          )}
                        </div>
                        {payment.quotationTotal > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            <span className="font-medium">Order:</span> ₹{payment.quotationTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })} | 
                            <span className="text-green-600 font-medium"> Paid:</span> ₹{payment.quotationTotalPaid.toLocaleString('en-IN', { maximumFractionDigits: 2 })} | 
                            <span className="text-red-600 font-medium"> Due:</span> ₹{payment.quotationRemainingDue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{payment.formattedPaymentDate || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{payment.purchaseOrderId || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">{payment.deliveryDate || 'N/A'}</span>
                        <span className={`text-xs mt-1 ${payment.deliveryStatus === 'delivered' ? 'text-green-600' : payment.deliveryStatus === 'pending' ? 'text-yellow-600' : 'text-gray-600'}`}>
                          {payment.deliveryStatus || 'pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleViewPayment(payment)}
                          className="w-8 h-8 flex items-center justify-center text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View payment details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table Footer with Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, totalFiltered)} of {totalFiltered} payments
              {totalFiltered !== allPaymentsData.length && (
                <span className="ml-2 text-blue-600">
                  (filtered from {allPaymentsData.length} total)
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Rows per page:</label>
              <select
                value={pagination.limit}
                onChange={(e) => {
                  const newLimit = Number(e.target.value);
                  setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
                }}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>
          </div>
          
          {totalPages > 1 && totalFiltered > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="First page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                {totalPages > 0 && Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded-md border transition-colors cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <span className="text-sm text-gray-600 px-2 whitespace-nowrap">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={goToLastPage}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Last page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* View Payment Modal - Same as SalesDepartmentHead */}
      {showViewModal && viewingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className={`absolute right-0 top-0 h-full w-80 max-w-sm bg-white shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto ${
            isModalAnimating ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Payment Overview</h2>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{viewingPayment.leadIdDisplay}</h3>
                      <p className="text-sm text-gray-600">Payment Details</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(viewingPayment.status)}`}>
                        {getStatusIcon(viewingPayment.status)}
                        {viewingPayment.status}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Customer Name</label>
                      <p className="text-sm text-gray-900">{viewingPayment.customer.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Email Address</label>
                      <p className="text-sm text-gray-900">{viewingPayment.customer.email}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Phone Number</label>
                      <p className="text-sm text-gray-900">{viewingPayment.customer.phone}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Company</label>
                      <p className="text-sm text-gray-900">{viewingPayment.companyName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Department Head</label>
                      <p className="text-sm text-gray-900">{viewingPayment.departmentHeadName || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-blue-50 p-2 rounded border border-blue-200">
                      <label className="text-xs font-medium text-gray-700">This Payment Amount</label>
                      <p className="text-green-600 font-semibold text-base">{formatCurrency(viewingPayment.amount)}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded border">
                      <label className="text-xs font-medium text-gray-700">Quotation Total (Order Amount)</label>
                      <p className="text-gray-900 font-semibold text-base">{formatCurrency(viewingPayment.quotationTotal || viewingPayment.totalAmount)}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded border border-green-200">
                      <label className="text-xs font-medium text-gray-700">Total Paid (All Approved Payments)</label>
                      <p className="text-green-600 font-semibold text-base">{formatCurrency(viewingPayment.quotationTotalPaid || viewingPayment.paidAmount)}</p>
                    </div>
                    <div className="bg-red-50 p-2 rounded border border-red-200">
                      <label className="text-xs font-medium text-gray-700">Remaining Due</label>
                      <p className="text-red-600 font-semibold text-base">{formatCurrency(viewingPayment.quotationRemainingDue || viewingPayment.dueAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={closeViewModal}
                  className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentInfo;

