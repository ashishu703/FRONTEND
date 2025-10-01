import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, User, DollarSign, Clock, Calendar, Link, Copy, Eye, MoreHorizontal, CreditCard, AlertCircle, CheckCircle, XCircle, ChevronDown, Edit, Plus } from 'lucide-react';

const PaymentsDashboard = () => {
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
      customerId: 'CUST-0001',
      customer: {
        name: 'na',
        email: 'bharatfincappvtltd@gmail.com',
        phone: '8451868999'
      },
      amount: 12000,
      totalAmount: 15000,
      dueAmount: 3000,
      status: 'Pending',
      created: '10 Sept 2025, 11:33 am',
      paymentLink: 'https://rzp.io/rzp/...'
    },
    {
      id: 2,
      customerId: 'CUST-0002',
      customer: {
        name: 'na',
        email: 'projapatienterprisesag@gmail.com',
        phone: '8871863773'
      },
      amount: 12000,
      totalAmount: 18000,
      dueAmount: 6000,
      status: 'Expired',
      created: '09 Sept 2025, 05:00 pm',
      paymentLink: 'https://rzp.io/rzp/...'
    },
    {
      id: 3,
      customerId: 'CUST-0003',
      customer: {
        name: 'na',
        email: 'projapatienterprisesag@gmail.com',
        phone: '8871863773'
      },
      amount: 12000,
      totalAmount: 20000,
      dueAmount: 8000,
      status: 'Expired',
      created: '09 Sept 2025, 03:31 pm',
      paymentLink: 'https://rzp.io/rzp/...'
    },
    {
      id: 4,
      customerId: 'CUST-0004',
      customer: {
        name: 'na',
        email: 'shadakshari.chikmath@gmail.com',
        phone: '9741456971'
      },
      amount: 12000,
      totalAmount: 16000,
      dueAmount: 4000,
      status: 'Expired',
      created: '09 Sept 2025, 10:39 am',
      paymentLink: 'https://rzp.io/rzp/...'
    },
    {
      id: 5,
      customerId: 'CUST-0005',
      customer: {
        name: 'na',
        email: 'vikramvermakrd@gmail.com',
        phone: '7014131224'
      },
      amount: 9000,
      totalAmount: 12000,
      dueAmount: 3000,
      status: 'Expired',
      created: '08 Sept 2025, 05:10 pm',
      paymentLink: 'https://rzp.io/rzp/...'
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

  const handleAddPayment = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setAddFormData({
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
  };

  const handleAddFormChange = (field, value) => {
    setAddFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAdd = () => {
    // Generate new payment ID
    const newId = Math.max(...payments.map(p => p.id)) + 1;
    
    // Create new payment object
    const newPayment = {
      id: newId,
      customerId: addFormData.customerId,
      customer: {
        name: addFormData.customerName,
        email: addFormData.customerEmail,
        phone: addFormData.customerPhone
      },
      amount: parseFloat(addFormData.amount) || 0,
      totalAmount: parseFloat(addFormData.totalAmount) || 0,
      dueAmount: parseFloat(addFormData.dueAmount) || 0,
      status: addFormData.status,
      created: new Date().toLocaleDateString(),
      paymentLink: addFormData.paymentLink
    };

    // Add to payments array
    setPayments(prev => [...prev, newPayment]);
    
    // Close modal and reset form
    closeAddModal();
    
    // Show success message
    alert('Payment added successfully!');
  };

  const handleEditPayment = (payment) => {
    console.log('Edit payment:', payment);
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
      // Update the payment data (in a real app, this would be an API call)
      const paymentIndex = payments.findIndex(payment => payment.id === editingPayment.id);
      
      if (paymentIndex !== -1) {
        // Update the payment data
        const updatedPayment = {
          ...payments[paymentIndex],
          customerId: editFormData.customerId,
          customer: {
            name: editFormData.customerName,
            email: editFormData.customerEmail,
            phone: editFormData.customerPhone
          },
          amount: editFormData.amount,
          totalAmount: editFormData.totalAmount,
          dueAmount: editFormData.dueAmount,
          status: editFormData.status,
          paymentLink: editFormData.paymentLink
        };
        
        // In a real application, you would update the state or make an API call
        console.log('Updated payment:', updatedPayment);
        alert(`Payment ${editFormData.customerId} updated successfully!`);
      }
    }
    closeEditModal();
  };


  const handleDownloadInvoice = (payment) => {
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice - ${payment.customerId}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 28px;
          }
          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .customer-info, .invoice-info {
            flex: 1;
          }
          .customer-info h3, .invoice-info h3 {
            color: #374151;
            margin-bottom: 10px;
            font-size: 16px;
          }
          .info-item {
            margin-bottom: 5px;
            font-size: 14px;
          }
          .payment-details {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .payment-details h3 {
            color: #374151;
            margin-bottom: 15px;
            font-size: 18px;
          }
          .amount-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .amount-row:last-child {
            border-bottom: none;
            font-weight: bold;
            font-size: 16px;
            color: #dc2626;
          }
          .amount-label {
            color: #6b7280;
          }
          .amount-value {
            color: #111827;
            font-weight: 500;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INVOICE</h1>
        </div>
        
        <div class="invoice-details">
          <div class="customer-info">
            <h3>Customer Information</h3>
            <div class="info-item"><strong>Customer ID:</strong> ${payment.customerId}</div>
            <div class="info-item"><strong>Name:</strong> ${payment.customer.name}</div>
            <div class="info-item"><strong>Email:</strong> ${payment.customer.email}</div>
            <div class="info-item"><strong>Phone:</strong> ${payment.customer.phone}</div>
          </div>
          
          <div class="invoice-info">
            <h3>Invoice Information</h3>
            <div class="info-item"><strong>Status:</strong> ${payment.status}</div>
            <div class="info-item"><strong>Created:</strong> ${payment.created}</div>
            <div class="info-item"><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</div>
          </div>
        </div>
        
        <div class="payment-details">
          <h3>Payment Details</h3>
          <div class="amount-row">
            <span class="amount-label">Amount Paid:</span>
            <span class="amount-value">${formatCurrency(payment.amount)}</span>
          </div>
          <div class="amount-row">
            <span class="amount-label">Total Amount:</span>
            <span class="amount-value">${formatCurrency(payment.totalAmount)}</span>
          </div>
          <div class="amount-row">
            <span class="amount-label">Due Amount:</span>
            <span class="amount-value">${formatCurrency(payment.dueAmount)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Payment Link: ${payment.paymentLink}</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    // Create a new window to generate PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.print();
        // Close the window after printing
        setTimeout(() => {
          printWindow.close();
        }, 1000);
      }, 500);
    };
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
          subtitle="₹0 received"
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
              placeholder="Search by customer ID, name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors text-gray-700"
            />
          </div>
          
          <div className="flex items-center gap-3">
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
                      onClick={() => { setStatusFilter('Created'); setShowFilterDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${statusFilter === 'Created' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      Created
                    </button>
                    <button 
                      onClick={() => { setStatusFilter('Pending'); setShowFilterDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${statusFilter === 'Pending' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      Pending
                    </button>
                    <button 
                      onClick={() => { setStatusFilter('Paid'); setShowFilterDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${statusFilter === 'Paid' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      Paid
                    </button>
                    <button 
                      onClick={() => { setStatusFilter('Expired'); setShowFilterDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${statusFilter === 'Expired' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      Expired
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
              <option value="Created">Created</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Expired">Expired</option>
            </select>
            
            <button 
              onClick={handleAddPayment}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Payment
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
                  <th className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <DollarSign className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Due / Total</span>
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
                  <th className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Download className="w-4 h-4 text-cyan-600" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Invoice</span>
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
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600 font-semibold text-sm bg-red-50 px-2 py-1 rounded">
                        {formatCurrency(payment.dueAmount)} / {formatCurrency(payment.totalAmount)}
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
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDownloadInvoice(payment)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEditPayment(payment)}
                          className="w-8 h-8 flex items-center justify-center text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                          title="Edit payment"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
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

      {/* Edit Payment Modal */}
      {showEditModal && editingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Payment</h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Customer Information Form */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                      <input
                        type="text"
                        value={editFormData.customerId || ''}
                        onChange={(e) => handleFormChange('customerId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                      <input
                        type="text"
                        value={editFormData.customerName || ''}
                        onChange={(e) => handleFormChange('customerName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editFormData.customerEmail || ''}
                        onChange={(e) => handleFormChange('customerEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={editFormData.customerPhone || ''}
                        onChange={(e) => handleFormChange('customerPhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Information Form */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (₹)</label>
                      <input
                        type="number"
                        value={editFormData.amount || ''}
                        onChange={(e) => handleFormChange('amount', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (₹)</label>
                      <input
                        type="number"
                        value={editFormData.totalAmount || ''}
                        onChange={(e) => handleFormChange('totalAmount', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Due Amount (₹)</label>
                      <input
                        type="number"
                        value={editFormData.dueAmount || ''}
                        onChange={(e) => handleFormChange('dueAmount', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={editFormData.status || ''}
                        onChange={(e) => handleFormChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Expired">Expired</option>
                        <option value="Created">Created</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Link</label>
                      <input
                        type="url"
                        value={editFormData.paymentLink || ''}
                        onChange={(e) => handleFormChange('paymentLink', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Overview Modal */}
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
                {/* Payment Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{viewingPayment.customerId}</h3>
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
                    <div>
                      <label className="text-xs font-medium text-gray-500">Payment Status</label>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(viewingPayment.status)}`}>
                          {getStatusIcon(viewingPayment.status)}
                          {viewingPayment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Timeline */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    Payment Timeline
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">Payment Created</p>
                        <p className="text-xs text-gray-500">{viewingPayment.created}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">Last Updated</p>
                        <p className="text-xs text-gray-500">{new Date().toLocaleString()}</p>
                      </div>
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

      {/* Add Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Payment</h2>
                <button
                  onClick={closeAddModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                      <input
                        type="text"
                        value={addFormData.customerId}
                        onChange={(e) => handleAddFormChange('customerId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., CUST-0001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                      <input
                        type="text"
                        value={addFormData.customerName}
                        onChange={(e) => handleAddFormChange('customerName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={addFormData.customerEmail}
                        onChange={(e) => handleAddFormChange('customerEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={addFormData.customerPhone}
                        onChange={(e) => handleAddFormChange('customerPhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
                      <input
                        type="number"
                        value={addFormData.amount}
                        onChange={(e) => handleAddFormChange('amount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                      <input
                        type="number"
                        value={addFormData.totalAmount}
                        onChange={(e) => handleAddFormChange('totalAmount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Due Amount</label>
                      <input
                        type="number"
                        value={addFormData.dueAmount}
                        onChange={(e) => handleAddFormChange('dueAmount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                      <select
                        value={addFormData.status}
                        onChange={(e) => handleAddFormChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Created">Created</option>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Expired">Expired</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment Link */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Link className="w-5 h-5 text-cyan-600" />
                    Payment Link
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Link</label>
                    <input
                      type="url"
                      value={addFormData.paymentLink}
                      onChange={(e) => handleAddFormChange('paymentLink', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://payment.link/example"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeAddModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAdd}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsDashboard;