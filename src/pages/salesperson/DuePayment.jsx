"use client"

import React, { useState, useEffect } from 'react';
import { Package, Eye, X, Edit, Clock, CheckCircle, MessageCircle, Mail } from 'lucide-react';
import Toolbar, { ProductPagination } from './PaymentTracking';
import apiClient from '../../utils/apiClient';
import quotationService from '../../api/admin_api/quotationService';
import paymentService from '../../api/admin_api/paymentService';
import { API_ENDPOINTS } from '../../api/admin_api/api';

// Timeline Sidebar component for viewing payment tracking details
const PaymentTimelineSidebar = ({ item, onClose }) => {
  const [customerQuotations, setCustomerQuotations] = useState([]);
  const [loadingQuotations, setLoadingQuotations] = useState(false);
  const [quotationError, setQuotationError] = useState(null);

  if (!item) return null;

  // Fetch customer quotations when component mounts
  useEffect(() => {
    const fetchCustomerQuotations = async () => {
      if (!item.leadData?.id) return;
      
      try {
        setLoadingQuotations(true);
        setQuotationError(null);
        
        // Fetch quotations for this customer/lead
        const quotationsResponse = await quotationService.getQuotationsByCustomer(item.leadData.id);
        setCustomerQuotations(quotationsResponse?.data || []);
      } catch (error) {
        console.error('Error fetching customer quotations:', error);
        setQuotationError('Failed to load quotations');
      } finally {
        setLoadingQuotations(false);
      }
    };

    fetchCustomerQuotations();
  }, [item.leadData?.id]);

  // Handle view quotation - show in modal using QuotationPreview format
  const handleViewQuotation = async (quotationId) => {
    try {
      const response = await quotationService.getQuotation(quotationId);
      
      if (response.success) {
        // Open quotation in new tab/window for viewing
        const quotationWindow = window.open('', '_blank', 'width=1000,height=800,scrollbars=yes,resizable=yes');
        
        if (quotationWindow) {
          const quotation = response.data;
          
          // Company branches data (same as in quotation creation)
          const companyBranches = {
            ANODE: {
              name: 'ANODE ELECTRIC PRIVATE LIMITED',
              gstNumber: '(23AANCA7455R1ZX)',
              description: 'MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES.',
              address: 'KHASRA NO. 805/5, PLOT NO. 10, IT PARK, BARGI HILLS, JABALPUR - 482003, MADHYA PRADESH, INDIA.',
              tel: '6262002116, 6262002113',
              web: 'www.anocab.com',
              email: 'info@anocab.com',
              logo: 'Anocab - A Positive Connection.....'
            }
          };
          
          // Mock user data
          const user = {
            name: 'Salesperson',
            email: 'salesperson@anocab.com'
          };
          
          // Format quotation data to match QuotationPreview component
          const quotationData = {
            quotationNumber: quotation.quotation_number || `QT-${quotation.id}`,
            quotationDate: quotation.quotation_date || quotation.created_at?.split('T')[0],
            validUpto: quotation.valid_until,
            voucherNumber: `VOUCH-${quotation.id?.slice(-4) || '0000'}`,
            billTo: {
              business: quotation.customer_name,
              address: quotation.customer_address,
              phone: quotation.customer_phone,
              gstNo: quotation.customer_gst_no,
              state: quotation.customer_state
            },
            items: quotation.items?.map(item => ({
              productName: item.description || item.product_name,
              description: item.description || item.product_name,
              quantity: item.quantity,
              unit: item.unit || 'Nos',
              buyerRate: item.rate || item.unit_price,
              unitPrice: item.rate || item.unit_price,
              amount: item.amount || item.taxable_amount,
              total: item.total_amount || item.amount,
              hsn: item.hsn_code || '85446090',
              gstRate: item.gst_rate || quotation.tax_rate || 18
            })) || [],
            subtotal: parseFloat(quotation.subtotal || 0),
            taxAmount: parseFloat(quotation.tax_amount || 0),
            totalAmount: parseFloat(quotation.total_amount || 0),
            notes: quotation.notes || '',
            terms: quotation.terms || ''
          };
          
          // Generate HTML content for the quotation
          const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Quotation ${quotationData.quotationNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .company-info { margin-bottom: 20px; }
                .quotation-details { display: flex; justify-content: space-between; margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .total-section { text-align: right; margin-top: 20px; }
                .notes { margin-top: 30px; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>${companyBranches.ANODE.name}</h1>
                <p>${companyBranches.ANODE.description}</p>
                <p>${companyBranches.ANODE.address}</p>
                <p>Tel: ${companyBranches.ANODE.tel} | Web: ${companyBranches.ANODE.web} | Email: ${companyBranches.ANODE.email}</p>
              </div>
              
              <div class="quotation-details">
                <div>
                  <h3>Bill To:</h3>
                  <p><strong>${quotationData.billTo.business}</strong></p>
                  <p>${quotationData.billTo.address}</p>
                  <p>Phone: ${quotationData.billTo.phone}</p>
                  <p>GST No: ${quotationData.billTo.gstNo}</p>
                  <p>State: ${quotationData.billTo.state}</p>
                </div>
                <div>
                  <h3>Quotation Details:</h3>
                  <p><strong>Quotation No:</strong> ${quotationData.quotationNumber}</p>
                  <p><strong>Date:</strong> ${quotationData.quotationDate}</p>
                  <p><strong>Valid Until:</strong> ${quotationData.validUpto}</p>
                  <p><strong>Voucher No:</strong> ${quotationData.voucherNumber}</p>
                </div>
              </div>
              
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Rate</th>
                    <th>Amount</th>
                    <th>HSN</th>
                    <th>GST%</th>
                  </tr>
                </thead>
                <tbody>
                  ${quotationData.items.map(item => `
                    <tr>
                      <td>${item.productName}</td>
                      <td>${item.description}</td>
                      <td>${item.quantity}</td>
                      <td>${item.unit}</td>
                      <td>₹${item.unitPrice}</td>
                      <td>₹${item.amount}</td>
                      <td>${item.hsn}</td>
                      <td>${item.gstRate}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <div class="total-section">
                <p><strong>Subtotal: ₹${quotationData.subtotal.toFixed(2)}</strong></p>
                <p><strong>Tax Amount: ₹${quotationData.taxAmount.toFixed(2)}</strong></p>
                <p><strong>Total Amount: ₹${quotationData.totalAmount.toFixed(2)}</strong></p>
              </div>
              
              ${quotationData.notes ? `
                <div class="notes">
                  <h3>Notes:</h3>
                  <p>${quotationData.notes}</p>
                </div>
              ` : ''}
              
              ${quotationData.terms ? `
                <div class="notes">
                  <h3>Terms & Conditions:</h3>
                  <p>${quotationData.terms}</p>
                </div>
              ` : ''}
            </body>
            </html>
          `;
          
          quotationWindow.document.write(htmlContent);
          quotationWindow.document.close();
        }
      }
    } catch (error) {
      console.error('Error viewing quotation:', error);
      alert('Error loading quotation details');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white h-full w-full max-w-4xl shadow-xl overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Payment Details - Due Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Customer Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Customer Name</p>
                  <p className="text-sm text-gray-900">{item.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Lead ID</p>
                  <p className="text-sm text-gray-900">{item.leadId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-sm text-gray-900">{item.leadData?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-900">{item.leadData?.email || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-700">Address</p>
                  <p className="text-sm text-gray-900">{item.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Quotation ID</p>
                  <p className="text-sm text-gray-900">{item.quotationId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Work Order ID</p>
                  <p className="text-sm text-gray-900">{item.workOrderId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Payment Status</p>
                  <p className="text-sm text-gray-900">{item.paymentStatus}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Due Amount</p>
                  <p className="text-sm text-red-600 font-semibold">₹{item.dueAmount || '0'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Due Date</p>
                  <p className="text-sm text-gray-900">{item.dueDate || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Days Overdue</p>
                  <p className="text-sm text-red-600 font-semibold">{item.daysOverdue || '0'} days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Quotations */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Quotations</h3>
            {loadingQuotations ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading quotations...</p>
              </div>
            ) : quotationError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{quotationError}</p>
              </div>
            ) : customerQuotations.length > 0 ? (
              <div className="space-y-3">
                {customerQuotations.map((quotation) => (
                  <div key={quotation.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Quotation #{quotation.quotation_number || quotation.id}
                        </p>
                        <p className="text-sm text-gray-600">
                          Date: {quotation.quotation_date || quotation.created_at?.split('T')[0]}
                        </p>
                        <p className="text-sm text-gray-600">
                          Amount: ₹{quotation.total_amount || '0'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewQuotation(quotation.id)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">No quotations found for this customer</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Tooltip component
const Tooltip = ({ children, text }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </div>
      {showTooltip && (
        <div className="absolute z-10 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-1">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default function DuePaymentPage({ isDarkMode = false }) {
  const [paymentTracking, setPaymentTracking] = useState([]);
  const [filteredPaymentTracking, setFilteredPaymentTracking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPaymentTracking.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPaymentTracking = filteredPaymentTracking.slice(startIndex, endIndex);

  // Fetch payment tracking data
  useEffect(() => {
    const fetchPaymentTracking = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch leads with quotations and payments
        const leadsResponse = await apiClient.get(API_ENDPOINTS.LEADS_LIST());
        const leads = leadsResponse.data || [];

        // For now, use mock data since quotation and payment services don't have getAll methods
        // TODO: Implement proper API endpoints for fetching all quotations and payments
        const quotations = [];
        const payments = [];

        // Process and combine data
        const processedData = leads.map(lead => {
          // Find quotations for this lead
          const leadQuotations = quotations.filter(q => q.lead_id === lead.id);
          const latestQuotation = leadQuotations[leadQuotations.length - 1];

          // Find payments for this lead
          const leadPayments = payments.filter(p => p.lead_id === lead.id);
          const totalPaid = leadPayments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
          const quotationTotal = parseFloat(latestQuotation?.total_amount || 0);
          const dueAmount = quotationTotal - totalPaid;

          // Calculate due date and days overdue
          const dueDate = latestQuotation?.delivery_date || latestQuotation?.quotation_date;
          const daysOverdue = dueDate ? Math.max(0, Math.ceil((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24))) : 0;

          return {
            id: lead.id,
            leadId: lead.lead_id || `LD-${lead.id}`,
            customerName: lead.customer_name || 'N/A',
            productName: latestQuotation?.items?.[0]?.product_name || 'N/A',
            address: lead.address || 'N/A',
            quotationId: latestQuotation?.quotation_number || 'N/A',
            paymentStatus: dueAmount > 0 ? 'due' : 'paid',
            workOrderId: latestQuotation?.work_order_id || 'N/A',
            leadData: {
              id: lead.id,
              phone: lead.phone,
              email: lead.email,
              whatsapp: lead.whatsapp
            },
            quotationData: latestQuotation,
            dueAmount: dueAmount,
            dueDate: dueDate,
            daysOverdue: daysOverdue,
            totalAmount: quotationTotal,
            paidAmount: totalPaid
          };
        });

        // Filter only due payments
        const duePayments = processedData.filter(item => item.paymentStatus === 'due' && item.dueAmount > 0);
        
        setPaymentTracking(duePayments);
        setFilteredPaymentTracking(duePayments);
      } catch (error) {
        console.error('Error fetching payment tracking data:', error);
        setError('Failed to load payment tracking data');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentTracking();
  }, []);

  // Handle search and filtering
  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setFilteredPaymentTracking(paymentTracking);
      return;
    }

    const filtered = paymentTracking.filter(item => 
      item.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.leadId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.quotationId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.leadData?.phone?.includes(searchQuery) ||
      item.leadData?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredPaymentTracking(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (filters) => {
    let filtered = [...paymentTracking];

    // Apply quotation ID filter
    if (filters.quotationId) {
      filtered = filtered.filter(item => 
        item.quotationId?.toLowerCase().includes(filters.quotationId.toLowerCase())
      );
    }

    // Apply payment type filter
    if (filters.paymentType) {
      filtered = filtered.filter(item => {
        switch (filters.paymentType) {
          case 'due':
            return item.paymentStatus === 'due';
          case 'overdue':
            return item.daysOverdue > 0;
          default:
            return true;
        }
      });
    }

    setFilteredPaymentTracking(filtered);
    setCurrentPage(1);
  };

  const handleAddProduct = (paymentData, editingItem) => {
    if (editingItem) {
      setPaymentTracking(prev => 
        prev.map(item => item.id === editingItem.id ? { ...item, ...paymentData } : item)
      );
      setFilteredPaymentTracking(prev => 
        prev.map(item => item.id === editingItem.id ? { ...item, ...paymentData } : item)
      );
    } else {
      const newItem = { ...paymentData, id: Date.now() };
      setPaymentTracking(prev => [...prev, newItem]);
      setFilteredPaymentTracking(prev => [...prev, newItem]);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleViewPayment = (item) => {
    setSelectedProduct(item);
  };

  const handleEditPayment = (item) => {
    // Handle edit functionality
    console.log('Edit payment:', item);
  };

  const getPaymentStatusBadge = (status, item) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    if (status === 'due') {
      const isOverdue = item.daysOverdue > 0;
      return (
        <span className={`${baseClasses} ${
          isOverdue 
            ? 'bg-red-100 text-red-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {isOverdue ? `Overdue (${item.daysOverdue} days)` : 'Due'}
        </span>
      );
    }
    
    return (
      <span className={`${baseClasses} bg-green-100 text-green-800`}>
        Paid
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      {/* Toolbar */}
      <Toolbar
        onSearch={handleSearch}
        onAddProduct={handleAddProduct}
        onExport={() => {}}
        onFilterChange={handleFilterChange}
        onRefresh={() => window.location.reload()}
        products={paymentTracking}
        loading={loading}
      />

      {/* Table */}
      {filteredPaymentTracking.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-6 py-4 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No due payments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are currently no payments due for tracking.
            </p>
          </div>
        </div>
      ) : (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quotation ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {paginatedPaymentTracking.length > 0 ? (
                  paginatedPaymentTracking.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.leadId}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-sm text-gray-900">{item.customerName}</div>
                        <div className="text-xs text-gray-500">{item.leadData?.phone || 'N/A'}</div>
                        {item.leadData?.whatsapp && (
                          <div className="text-xs mt-1 text-green-600">
                            <a href={`https://wa.me/${item.leadData.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" /> WhatsApp
                            </a>
                          </div>
                        )}
                        {item.leadData?.email && item.leadData.email !== "N/A" && (
                          <div className="text-xs mt-1 text-cyan-600">
                            <button 
                              onClick={() => window.open(`mailto:${item.leadData.email}?subject=Payment Follow up from ANOCAB&body=Dear ${item.customerName},%0D%0A%0D%0AThis is a reminder about your pending payment.%0D%0A%0D%0ABest regards,%0D%0AANOCAB Team`, '_blank')}
                              className="inline-flex items-center gap-1 transition-colors hover:text-cyan-700"
                              title="Send Email"
                            >
                              <Mail className="h-3 w-3" /> {item.leadData.email}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.address}
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quotationId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getPaymentStatusBadge(item.paymentStatus, item)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                        ₹{item.dueAmount?.toFixed(2) || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {item.dueDate ? 
                            new Date(item.dueDate).toLocaleDateString('en-GB') : 
                            'N/A'
                          }
                        </div>
                        {item.daysOverdue > 0 && (
                          <div className="text-xs text-red-600 font-semibold">
                            {item.daysOverdue} days overdue
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Tooltip text="View Details">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                                handleViewPayment(item);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </Tooltip>
                          <Tooltip text="Edit">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPayment(item);
                              }}
                              className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                            >
                              <Edit className="h-4 w-4" />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                      No due payment records found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Pagination */}
      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredPaymentTracking.length}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
      
      {/* Payment Tracking Timeline Sidebar */}
      {selectedProduct && (
        <PaymentTimelineSidebar 
          item={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
      
    </div>
  );
}
