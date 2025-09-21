import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, User, DollarSign, Clock, Calendar, Link, Copy, Eye, MoreHorizontal, CreditCard, AlertCircle, CheckCircle, XCircle, ChevronDown, Edit, Plus } from 'lucide-react';

const MarketingPaymentInfo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingPayment, setViewingPayment] = useState(null);
  const [isModalAnimating, setIsModalAnimating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    amount: '',
    totalAmount: '',
    dueAmount: '',
    status: 'Pending',
    paymentLink: ''
  });
  
  const [payments, setPayments] = useState([
    {
      id: 1,
      customerId: 'MKT-0001',
      customer: {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '9876543210'
      },
      amount: 15000,
      totalAmount: 18000,
      dueAmount: 3000,
      status: 'Pending',
      created: '15 Sept 2025, 02:30 pm',
      paymentLink: 'https://rzp.io/rzp/marketing1',
      campaign: 'Digital Marketing Campaign'
    },
    {
      id: 2,
      customerId: 'MKT-0002',
      customer: {
        name: 'Emily Davis',
        email: 'emily.davis@company.com',
        phone: '9123456789'
      },
      amount: 22000,
      totalAmount: 25000,
      dueAmount: 3000,
      status: 'Paid',
      created: '14 Sept 2025, 10:15 am',
      paymentLink: 'https://rzp.io/rzp/marketing2',
      campaign: 'Social Media Marketing'
    },
    {
      id: 3,
      customerId: 'MKT-0003',
      customer: {
        name: 'Robert Brown',
        email: 'robert.brown@business.com',
        phone: '9988776655'
      },
      amount: 8000,
      totalAmount: 12000,
      dueAmount: 4000,
      status: 'Expired',
      created: '13 Sept 2025, 04:45 pm',
      paymentLink: 'https://rzp.io/rzp/marketing3',
      campaign: 'Email Marketing Campaign'
    },
    {
      id: 4,
      customerId: 'MKT-0004',
      customer: {
        name: 'Maria Rodriguez',
        email: 'maria.rodriguez@enterprise.com',
        phone: '9876543211'
      },
      amount: 30000,
      totalAmount: 30000,
      dueAmount: 0,
      status: 'Paid',
      created: '12 Sept 2025, 11:20 am',
      paymentLink: 'https://rzp.io/rzp/marketing4',
      campaign: 'Brand Awareness Campaign'
    },
    {
      id: 5,
      customerId: 'MKT-0005',
      customer: {
        name: 'James Wilson',
        email: 'james.wilson@startup.com',
        phone: '9123456788'
      },
      amount: 12000,
      totalAmount: 20000,
      dueAmount: 8000,
      status: 'Pending',
      created: '11 Sept 2025, 09:30 am',
      paymentLink: 'https://rzp.io/rzp/marketing5',
      campaign: 'Content Marketing'
    }
  ]);

  // Calculate stats
  const stats = {
    allPayments: payments.length,
    totalValue: payments.reduce((sum, payment) => sum + payment.amount, 0),
    created: payments.filter(p => p.status === 'Created').length,
    pending: payments.filter(p => p.status === 'Pending').length,
    paid: payments.filter(p => p.status === 'Paid').length,
    expired: payments.filter(p => p.status === 'Expired').length
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.phone.includes(searchTerm) ||
      payment.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'All Status' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Created':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'Expired':
        return <XCircle className="w-4 h-4" />;
      case 'Created':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
  };

  const handleViewPayment = (payment) => {
    console.log('View payment:', payment);
    setViewingPayment(payment);
    setShowViewModal(true);
    // Trigger animation after modal is shown
    setTimeout(() => {
      setIsModalAnimating(true);
    }, 10);
  };

  const closeViewModal = () => {
    setIsModalAnimating(false);
    // Wait for animation to complete before hiding modal
    setTimeout(() => {
      setShowViewModal(false);
      setViewingPayment(null);
    }, 300);
  };

  // Handle click outside to close filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilterDropdown && !event.target.closest('.filter-dropdown')) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterDropdown]);

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          title="All Payments"
          value={stats.allPayments}
          subtitle={`₹${stats.totalValue.toLocaleString('en-IN')} total value`}
          color="text-blue-600"
          bgColor="bg-blue-50 border-blue-200"
          icon={CreditCard}
        />
        <StatCard
          title="Created"
          value={stats.created}
          subtitle="Created payments"
          color="text-purple-600"
          bgColor="bg-purple-50 border-purple-200"
          icon={Clock}
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          subtitle="Money awaiting"
          color="text-yellow-600"
          bgColor="bg-yellow-50 border-yellow-200"
          icon={Clock}
        />
        <StatCard
          title="Paid"
          value={stats.paid}
          subtitle={`₹${payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-IN')} received`}
          color="text-green-600"
          bgColor="bg-green-50 border-green-200"
          icon={CheckCircle}
        />
        <StatCard
          title="Expired"
          value={stats.expired}
          subtitle="Expired payments"
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
              placeholder="Search by customer, campaign, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors text-gray-700"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none cursor-pointer min-w-[140px]"
            >
              <option value="All Status">All Status</option>
              <option value="Created">Created</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Customer ID</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Customer</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Paid / Total</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Status</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Created</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Campaign</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment, index) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                        {payment.customerId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 mb-1 text-xs">{payment.customer.name}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <span>✉</span>
                          <span className="truncate max-w-[200px]">{payment.customer.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <span>📞</span>
                          <span>{payment.customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 font-semibold text-sm bg-green-50 px-2 py-1 rounded">
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 font-semibold text-sm bg-green-50 px-2 py-1 rounded">
                        {formatCurrency(payment.amount)} / {formatCurrency(payment.totalAmount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-xs">{payment.created}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-600 bg-purple-50 px-2 py-1 rounded">
                        {payment.campaign}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleViewPayment(payment)}
                          className="w-8 h-8 flex items-center justify-center text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View payment overview"
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

        {/* No results message */}
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Search className="w-12 h-12 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}

        {/* Table Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {filteredPayments.length} of {payments.length} payments
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50" disabled>
              Previous
            </button>
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">1</span>
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Payment Overview Modal */}
      {showViewModal && viewingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className={`absolute right-0 top-0 h-full w-80 max-w-sm bg-white shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto ${
            isModalAnimating ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Marketing Payment Overview</h2>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Payment Header */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{viewingPayment.customerId}</h3>
                      <p className="text-sm text-gray-600">Marketing Payment Details</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(viewingPayment.status)}`}>
                        {getStatusIcon(viewingPayment.status)}
                        {viewingPayment.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Customer ID</label>
                      <p className="text-sm text-gray-900 font-mono bg-white px-2 py-1 rounded border">{viewingPayment.customerId}</p>
                    </div>
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
                  </div>
                </div>

                {/* Campaign Information */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-purple-600">📢</span>
                    Campaign Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Campaign</label>
                      <p className="text-sm text-gray-900 bg-purple-50 px-2 py-1 rounded">{viewingPayment.campaign}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Amount Paid</label>
                      <p className="text-green-600 font-semibold text-base">{formatCurrency(viewingPayment.amount)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Total Amount</label>
                      <p className="text-gray-900 font-semibold text-base">{formatCurrency(viewingPayment.totalAmount)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Due Amount</label>
                      <p className="text-red-600 font-semibold text-base">{formatCurrency(viewingPayment.dueAmount)}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Link */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Link className="w-4 h-4 text-cyan-600" />
                    Payment Link
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={viewingPayment.paymentLink}
                      readOnly
                      className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono"
                    />
                    <button
                      onClick={() => handleCopyLink(viewingPayment.paymentLink)}
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                    >
                      Copy
                    </button>
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

export default MarketingPaymentInfo;
