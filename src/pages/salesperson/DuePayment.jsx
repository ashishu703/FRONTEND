"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Package, Eye, X, Edit, Clock, CheckCircle, MessageCircle, Mail, CreditCard } from 'lucide-react';
import Toolbar, { ProductPagination } from './PaymentTracking';
import apiClient from '../../utils/apiClient';
import quotationService from '../../api/admin_api/quotationService';
import paymentService from '../../api/admin_api/paymentService';
import proformaInvoiceService from '../../api/admin_api/proformaInvoiceService';
import uploadService from '../../api/admin_api/uploadService';
import { API_ENDPOINTS } from '../../api/admin_api/api';

// Timeline Sidebar component for viewing payment tracking details
const PaymentTimelineSidebar = ({ item, onClose, refreshKey = 0 }) => {
  const [customerQuotations, setCustomerQuotations] = useState([]);
  const [loadingQuotations, setLoadingQuotations] = useState(false);
  const [quotationError, setQuotationError] = useState(null);
  const [quotationSummary, setQuotationSummary] = useState(null);
  const [paymentsForQuotation, setPaymentsForQuotation] = useState([]);

  if (!item) return null;

  // Fetch quotation summary + payments (avoid listing all quotations if we already have one)
  const fetchedKeyRef = useRef('');
  useEffect(() => {
    const fetchKey = `${item.leadData?.id || ''}-${item.quotationData?.id || ''}-${refreshKey}`;
    if (fetchedKeyRef.current === fetchKey) {
      return; // avoid duplicate fetch in React StrictMode
    }
    fetchedKeyRef.current = fetchKey;
    const fetchCustomerQuotations = async () => {
      if (!item.leadData?.id) return;

      try {
        setLoadingQuotations(true);
        setQuotationError(null);
        
        // If we already have a quotation ID, only fetch its summary and payments
        const chosenQuotationId = item.quotationData?.id;
        if (chosenQuotationId) {
          try {
            const [sRes, pRes] = await Promise.all([
              quotationService.getSummary(chosenQuotationId),
              paymentService.getPaymentsByQuotation(chosenQuotationId)
            ]);
            setCustomerQuotations([item.quotationData]);
            setQuotationSummary(sRes?.data || null);
            setPaymentsForQuotation(pRes?.data || []);
            return;
          } catch (innerErr) {
            console.warn('Failed to load quotation summary/payments', innerErr);
          }
        }

        // Fallback: fetch quotations for this customer/lead and then pick latest approved
        const quotationsResponse = await quotationService.getQuotationsByCustomer(item.leadData.id);
        const qList = quotationsResponse?.data || [];
        setCustomerQuotations(qList);
        const latestApproved = qList.filter(q => q.status === 'approved').slice(-1)[0];
        if (latestApproved?.id) {
          const [sRes, pRes] = await Promise.all([
            quotationService.getSummary(latestApproved.id),
            paymentService.getPaymentsByQuotation(latestApproved.id)
          ]);
          setQuotationSummary(sRes?.data || null);
          setPaymentsForQuotation(pRes?.data || []);
        }
      } catch (error) {
        console.error('Error fetching customer quotations:', error);
        setQuotationError('Failed to load quotations');
      } finally {
        setLoadingQuotations(false);
      }
    };

    fetchCustomerQuotations();
  }, [item.leadData?.id, item.quotationData?.id, refreshKey]);

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
            total: parseFloat(quotation.total_amount || 0),
            discountRate: parseFloat(quotation.discount_rate || 0),
            discountAmount: parseFloat(quotation.discount_amount || 0),
            taxRate: parseFloat(quotation.tax_rate || 18),
            selectedBranch: 'ANODE'
          };
          
          // Create HTML content using the exact same format as QuotationPreview
          const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Quotation ${quotationData.quotationNumber}</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                @media print {
                  .no-print { display: none !important; }
                }
              </style>
            </head>
            <body class="bg-gray-100">
              <div class="max-w-4xl mx-auto bg-white font-sans text-sm" id="quotation-content">
                <div class="p-6">
                  <div class="border-2 border-black mb-4">
                    <div class="p-2 flex justify-between items-center">
                      <div>
                        <h1 class="text-xl font-bold">${companyBranches.ANODE.name}</h1>
                        <p class="text-xs font-semibold text-gray-700">${companyBranches.ANODE.gstNumber}</p>
                        <p class="text-xs">${companyBranches.ANODE.description}</p>
                      </div>
                      <div class="text-right">
                        <img
                          src="https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png"
                          alt="Company Logo"
                          class="h-12 w-auto bg-white p-1 rounded"
                        />
                      </div>
                    </div>

                    <div class="p-3 bg-gray-50">
                      <div class="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p><strong>${companyBranches.ANODE.address}</strong></p>
                        </div>
                        <div class="text-right">
                          <p>Tel: ${companyBranches.ANODE.tel}</p>
                          <p>Web: ${companyBranches.ANODE.web}</p>
                          <p>Email: ${companyBranches.ANODE.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="border border-black mb-4">
                    <div class="bg-gray-100 p-2 text-center font-bold">
                      <h2>Quotation Details</h2>
                    </div>
                    <div class="grid grid-cols-4 gap-2 p-2 text-xs border-b">
                      <div><strong>Quotation Date</strong></div>
                      <div><strong>Quotation Number</strong></div>
                      <div><strong>Valid Upto</strong></div>
                      <div><strong>Voucher Number</strong></div>
                    </div>
                    <div class="grid grid-cols-4 gap-2 p-2 text-xs">
                      <div>${quotationData.quotationDate}</div>
                      <div>${quotationData.quotationNumber}</div>
                      <div>${quotationData.validUpto}</div>
                      <div>${quotationData.voucherNumber}</div>
                    </div>
                  </div>

                  <div class="border border-black mb-4">
                    <div class="grid grid-cols-2 gap-4 p-3 text-xs">
                      <div>
                        <h3 class="font-bold mb-2">BILL TO:</h3>
                        <p><strong>${quotationData.billTo.business || 'Customer'}</strong></p>
                        ${quotationData.billTo.address ? `<p>${quotationData.billTo.address}</p>` : ''}
                        ${quotationData.billTo.phone ? `<p><strong>PHONE:</strong> ${quotationData.billTo.phone}</p>` : ''}
                        ${quotationData.billTo.gstNo ? `<p><strong>GSTIN:</strong> ${quotationData.billTo.gstNo}</p>` : ''}
                        ${quotationData.billTo.state ? `<p><strong>State:</strong> ${quotationData.billTo.state}</p>` : ''}
                      </div>
                      <div>
                        <p><strong>L.R. No:</strong> -</p>
                        <p><strong>Transport:</strong> STAR TRANSPORTS</p>
                        <p><strong>Transport ID:</strong> 562345</p>
                        <p><strong>Vehicle Number:</strong> GJ01HJ2520</p>
                      </div>
                    </div>
                  </div>

                  <div class="border border-black mb-4">
                    <table class="w-full text-xs">
                      <thead>
                        <tr class="bg-gray-100">
                          <th class="border border-gray-300 p-1 text-center w-10">Sr.</th>
                          <th class="border border-gray-300 p-2 text-left">Name of Product / Service</th>
                          <th class="border border-gray-300 p-1 text-center w-16">HSN / SAC</th>
                          <th class="border border-gray-300 p-1 text-center w-12">Qty</th>
                          <th class="border border-gray-300 p-1 text-center w-12">Unit</th>
                          <th class="border border-gray-300 p-1 text-right w-20">Buyer Rate</th>
                          <th class="border border-gray-300 p-1 text-right w-20">Taxable Value</th>
                          <th class="border border-gray-300 p-0.5 text-center w-8 text-[10px] whitespace-nowrap">GST%</th>
                          <th class="border border-gray-300 p-1 text-right w-24">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${quotationData.items && quotationData.items.length > 0 ? 
                          quotationData.items.map((item, index) => `
                            <tr>
                              <td class="border border-gray-300 p-1 text-center">${index + 1}</td>
                              <td class="border border-gray-300 p-2">${item.productName || item.description}</td>
                              <td class="border border-gray-300 p-1 text-center">${item.hsn || '85446090'}</td>
                              <td class="border border-gray-300 p-1 text-center">${item.quantity}</td>
                              <td class="border border-gray-300 p-1 text-center">${item.unit || 'Nos'}</td>
                              <td class="border border-gray-300 p-1 text-right">${parseFloat(item.buyerRate || item.unitPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              <td class="border border-gray-300 p-1 text-right">${parseFloat(item.amount || item.taxable || item.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              <td class="border border-gray-300 p-0 text-center text-xs">${item.gstRate ? `${item.gstRate}%` : '18%'}</td>
                              <td class="border border-gray-300 p-1 text-right">${parseFloat((item.amount ?? item.total ?? 0) * (item.gstMultiplier ?? 1.18)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            </tr>
                          `).join('') : 
                          '<tr><td colspan="9" class="border border-gray-300 p-2 text-center">No items</td></tr>'
                        }

                        ${Array.from({ length: 8 }).map((_, i) => `
                          <tr class="h-8">
                            <td class="border border-gray-300 p-2"></td>
                            <td class="border border-gray-300 p-2"></td>
                            <td class="border border-gray-300 p-2"></td>
                            <td class="border border-gray-300 p-2"></td>
                            <td class="border border-gray-300 p-2"></td>
                            <td class="border border-gray-300 p-2"></td>
                            <td class="border border-gray-300 p-2"></td>
                            <td class="border border-gray-300 p-2"></td>
                            <td class="border border-gray-300 p-2"></td>
                          </tr>
                        `).join('')}

                        <tr class="bg-gray-100 font-bold">
                          <td class="border border-gray-300 p-2 text-left">Total</td>
                          <td class="border border-gray-300 p-2"></td>
                          <td class="border border-gray-300 p-2"></td>
                          <td class="border border-gray-300 p-2"></td>
                          <td class="border border-gray-300 p-2"></td>
                          <td class="border border-gray-300 p-2"></td>
                          <td class="border border-gray-300 p-2">${quotationData.subtotal?.toFixed ? quotationData.subtotal.toFixed(2) : (quotationData.subtotal || '').toString()}</td>
                          <td class="border border-gray-300 p-2">${quotationData.taxAmount?.toFixed ? quotationData.taxAmount.toFixed(2) : (quotationData.taxAmount || '').toString()}</td>
                          <td class="border border-gray-300 p-2">${quotationData.total?.toFixed ? quotationData.total.toFixed(2) : (quotationData.total || '').toString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="border border-black p-3">
                      <h3 class="font-bold text-xs mb-2">Bank Details</h3>
                      <div class="text-xs space-y-1">
                        <p><strong>Bank Name:</strong> ICICI Bank</p>
                        <p><strong>Branch Name:</strong> WRIGHT TOWN JABALPUR</p>
                        <p><strong>Bank Account Number:</strong> 657605601783</p>
                        <p><strong>Bank Branch IFSC:</strong> ICIC0006576</p>
                      </div>
                    </div>
                    <div class="border border-black p-3">
                      <div class="text-xs space-y-1">
                        <div class="flex justify-between">
                          <span>Subtotal</span>
                          <span>${quotationData.subtotal?.toFixed ? quotationData.subtotal.toFixed(2) : (quotationData.subtotal || '0.00')}</span>
                        </div>
                        <div class="flex justify-between">
                          <span>Less: Discount (${quotationData.discountRate || 0}%)</span>
                          <span>${quotationData.discountAmount?.toFixed ? quotationData.discountAmount.toFixed(2) : (quotationData.discountAmount || '0.00')}</span>
                        </div>
                        <div class="flex justify-between">
                          <span>Taxable Amount</span>
                          <span>${(typeof quotationData.subtotal === 'number' ? (quotationData.subtotal - (quotationData.discountAmount || 0)).toFixed(2) : (quotationData.taxable || '')).toString()}</span>
                        </div>
                        <div class="flex justify-between">
                          <span>Add: Total GST (${quotationData.taxRate || 18}%)</span>
                          <span>${quotationData.taxAmount?.toFixed ? quotationData.taxAmount.toFixed(2) : (quotationData.taxAmount || '0.00')}</span>
                        </div>
                        <div class="flex justify-between font-bold border-t pt-1">
                          <span>Total Amount After Tax</span>
                          <span>₹ ${quotationData.total?.toFixed ? quotationData.total.toFixed(2) : (quotationData.total || '0.00')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="border border-black mb-4">
                    <div class="bg-gray-100 p-2 font-bold text-xs">
                      <h3>Terms and Conditions</h3>
                    </div>
                    <div class="p-3 text-xs space-y-2">
                      <div>
                        <h4 class="font-bold">PRICING & VALIDITY</h4>
                        <p>• Prices are valid for 3 days only from the date of the final quotation/PI unless otherwise specified terms.</p>
                        <p>• The order will be considered confirmed only upon receipt of the advance payment.</p>
                      </div>
                      <div>
                        <h4 class="font-bold">PAYMENT TERMS</h4>
                        <p>• 30% advance payment upon order confirmation</p>
                        <p>• Remaining Balance at time of final dispatch / against LC / Bank Guarantee (if applicable).</p>
                        <p>• Liquidated Damages @ 0.5% to 1% per WEEK will be charged on delayed payments beyond the agreed terms.</p>
                      </div>
                      <div>
                        <h4 class="font-bold">DELIVERY & DISPATCH</h4>
                        <p>• Standard delivery period as per the telecommunication with customer.</p>
                        <p>• Any delays due to unforeseen circumstances (force majeure, strikes, and transportation issues) will be communicated.</p>
                      </div>
                      <div>
                        <h4 class="font-bold">QUALITY & WARRANTY</h4>
                        <p>• Cables will be supplied as per IS and other applicable BIS standards/or as per the agreed specifications mentioned/special demand by the customer.</p>
                        <p>• Any manufacturing defects should be reported immediately, within 3 working days of receipt.</p>
                        <p>• Warranty: 12 months from the date of dispatch for manufacturing defects only in ISI mark products.</p>
                      </div>
                    </div>
                  </div>

                  <div class="text-right text-xs">
                    <p class="mb-4">For <strong>${companyBranches.ANODE.name}</strong></p>
                    <p class="mb-8">This is computer generated invoice no signature required.</p>
                    <p class="font-bold">Authorized Signatory</p>
                    <p class="mt-2 text-sm font-semibold text-gray-800">${user.name || user.email || 'User'}</p>
                  </div>
                </div>
              </div>
              
              <div class="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-300 flex justify-between no-print">
                <button onclick="window.close()" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Close</button>
                <button onclick="window.print()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Print PDF</button>
              </div>
            </body>
            </html>
          `;
          
          quotationWindow.document.write(htmlContent);
          quotationWindow.document.close();
        }
      }
    } catch (error) {
      console.error('Error viewing quotation:', error);
      alert('Failed to load quotation');
    }
  };

  // Format date to Indian format (DD/MM/YYYY)
  const formatIndianDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format date and time to Indian format
  const formatIndianDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get status badge component
  const getStatusBadge = (status, type = 'default') => {
    const statusConfig = {
      'completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'COMPLETED' },
      'approved': { bg: 'bg-green-100', text: 'text-green-800', label: 'APPROVED' },
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'PENDING' },
      'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'REJECTED' },
      'paid': { bg: 'bg-green-100', text: 'text-green-800', label: 'PAID' },
      'partial': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'PARTIAL' },
      'overdue': { bg: 'bg-red-100', text: 'text-red-800', label: 'OVERDUE' },
      'due': { bg: 'bg-red-100', text: 'text-red-800', label: 'PENDING' },
      'deal-closed': { bg: 'bg-green-100', text: 'text-green-800', label: 'DEAL CLOSED' }
    };

    const config = statusConfig[status] || statusConfig['pending'];
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Calculate payment summary from approved quotations
  const calculatePaymentSummary = () => {
    const approvedQuotations = customerQuotations.filter(q => q.status === 'approved');
    
    if (approvedQuotations.length === 0) {
      return {
        totalAmount: 0,
        paidAmount: 0,
        remainingAmount: 0,
        advanceAmount: 0,
        partialAmount: 0,
        dueAmount: 0,
        paymentStatus: 'pending'
      };
    }

    // Get the latest approved quotation amount
    const latestApprovedQuotation = approvedQuotations[approvedQuotations.length - 1];
    // Prefer backend summary if available for accuracy
    const totalAmount = (quotationSummary?.total_amount ?? latestApprovedQuotation.total_amount) || 0;
    const paidAmount = typeof quotationSummary?.total_paid === 'number'
      ? quotationSummary.total_paid
      : (typeof quotationSummary?.paid === 'number'
        ? quotationSummary.paid
        : (Array.isArray(paymentsForQuotation)
            ? paymentsForQuotation.filter(p => (p.payment_status || p.status || '').toLowerCase() === 'completed')
                .reduce((sum, p) => sum + (Number((p.paid_amount ?? p.installment_amount ?? p.amount) || 0)), 0)
            : 0));
    const remainingAmount = typeof quotationSummary?.current_remaining === 'number'
      ? quotationSummary.current_remaining
      : (typeof quotationSummary?.remaining === 'number'
        ? quotationSummary.remaining
        : Math.max(0, Number(totalAmount) - Number(paidAmount)));
    
    // Calculate advance (first payment), partial (subsequent payments), due (remaining)
    let advanceAmount = 0;
    let partialAmount = 0;
    
    const pmts = Array.isArray(paymentsForQuotation) ? paymentsForQuotation.slice().sort((a,b)=> new Date(a.payment_date) - new Date(b.payment_date)) : [];
    if (pmts.length > 0) {
      advanceAmount = Number((pmts[0]?.paid_amount ?? pmts[0]?.installment_amount ?? pmts[0]?.amount) || 0);
      if (pmts.length > 1) {
        partialAmount = pmts.slice(1).reduce((sum, p) => sum + (Number((p.paid_amount ?? p.installment_amount ?? p.amount) || 0)), 0);
      }
    }
    
    const dueAmount = remainingAmount;
    
    let paymentStatus = 'pending';
    if (paidAmount >= totalAmount) {
      paymentStatus = 'paid';
    } else if (paidAmount > 0) {
      paymentStatus = 'partial';
    }

    return {
      totalAmount,
      paidAmount,
      remainingAmount,
      advanceAmount,
      partialAmount,
      dueAmount,
      paymentStatus
    };
  };

  const dataReady = !loadingQuotations && (
    quotationSummary !== null || (Array.isArray(paymentsForQuotation) && paymentsForQuotation.length > 0)
  );
  const paymentSummary = dataReady ? calculatePaymentSummary() : null;

  // Build chronological payment timeline with running remaining balance
  const buildPaymentTimeline = () => {
    const approvedQuotations = customerQuotations.filter(q => q.status === 'approved');
    if (approvedQuotations.length === 0) return [];
    const latestApprovedQuotation = approvedQuotations[approvedQuotations.length - 1];
    const totalAmount = (quotationSummary?.total_amount ?? latestApprovedQuotation.total_amount) || 0;
    const pmts = Array.isArray(paymentsForQuotation)
      ? paymentsForQuotation.slice().sort((a, b) => new Date(a.payment_date) - new Date(b.payment_date))
      : [];
    let cumulativePaid = 0;
    return pmts.map((p, idx) => {
      const amountNum = Number(p.paid_amount ?? p.installment_amount ?? p.amount ?? 0);
      cumulativePaid += amountNum;
      const remaining = Math.max(0, Number(totalAmount) - cumulativePaid);
      // Label logic: If cumulative paid >= total amount, it's "Full Payment", otherwise "Advance Payment"
      const isFullPayment = cumulativePaid >= totalAmount && totalAmount > 0;
      const label = isFullPayment ? 'Full Payment' : 'Advance Payment';
      return { ...p, amount: amountNum, label, remainingAfter: remaining };
    });
  };
  const paymentTimeline = buildPaymentTimeline();

  // Get due date from payments (delivery_date or revised_delivery_date)
  const getDueDate = () => {
    const paymentsWithDates = Array.isArray(paymentsForQuotation) 
      ? paymentsForQuotation.filter(p => p.revised_delivery_date || p.delivery_date) 
      : [];
    if (paymentsWithDates.length > 0) {
      const latestPayment = paymentsWithDates[paymentsWithDates.length - 1];
      return latestPayment.revised_delivery_date || latestPayment.delivery_date;
    }
    return null;
  };

  const dueDate = getDueDate();
  const hasPendingAmount = dataReady && paymentSummary?.dueAmount > 0;

  // Timeline events data - complete sequence (include payments inline)
  const timelineEvents = [
    {
      id: 'customer-created',
      title: 'Customer Created',
      date: formatIndianDate(item.leadData?.created_at),
      status: 'completed',
      icon: '✓',
      description: `Lead ID: ${item.leadId}`
    },
    ...customerQuotations.map((quotation, index) => ({
      id: `quotation-${quotation.id}`,
      title: `Quotation ${index + 1}`,
      date: formatIndianDateTime(quotation.created_at),
      status: quotation.status === 'approved' ? 'approved' : 'pending',
      icon: quotation.status === 'approved' ? '✓' : '⏳',
      description: `ID: ${quotation.quotation_number || `QT-${quotation.id}`} | Purchase Order: ${quotation.work_order_id ? `PO-${quotation.work_order_id}` : 'N/A'}`,
      amount: quotation.total_amount || 0,
      quotationId: quotation.id,
      quotationStatus: quotation.status
    })),
    ...paymentTimeline.map((payment, index) => ({
      id: `payment-${index + 1}`,
      title: `${payment.label} Payment #${index + 1}`,
      date: formatIndianDateTime(payment.payment_date),
      status: (payment.status || 'completed').toLowerCase(),
      icon: '₹',
      description: `Method: ${payment.payment_method || 'N/A'}`,
      amount: payment.amount ?? payment.installment_amount,
      remainingAmount: payment.remainingAfter
    })),
    ...(hasPendingAmount ? [{
      id: 'due-payment',
      title: 'DUE',
      date: dueDate ? formatIndianDate(dueDate) : 'N/A',
      status: 'due',
      icon: '⚠',
      description: dueDate ? `Due Date: ${formatIndianDate(dueDate)}` : 'Payment pending',
      amount: paymentSummary.dueAmount,
      isDue: true
    }] : []),
    ...((paymentSummary && paymentSummary.paymentStatus === 'paid') ? [{
      id: 'deal-closed',
      title: 'Deal Closed',
      date: Array.isArray(item.paymentsData) && item.paymentsData.length > 0 ? formatIndianDateTime(item.paymentsData[item.paymentsData.length - 1]?.payment_date) : 'N/A',
      status: 'completed',
      icon: '✓',
      description: 'Full and final payment received'
    }] : [])
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-96 h-full overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Customer Timeline</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
            </div>

        {/* Customer Details */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-md font-semibold text-gray-900 mb-3">Customer Details</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-600">Customer Name:</span>
              <span className="ml-2 text-sm text-gray-900">{item.customerName}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Lead ID:</span>
              <span className="ml-2 text-sm text-gray-900">{item.leadId}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Product Name:</span>
              <span className="ml-2 text-sm text-gray-900">{item.productName}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Address:</span>
              <span className="ml-2 text-sm text-gray-900">{item.address}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-4">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            {timelineEvents.map((event, index) => (
              <div key={event.id} className="relative flex items-start mb-6">
                {/* Timeline icon */}
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                  event.isDue
                    ? 'bg-red-500'
                    : event.id?.startsWith('payment-')
                    ? 'bg-yellow-500'
                    : event.status === 'completed' || event.status === 'approved' || event.status === 'paid'
                    ? 'bg-green-500'
                    : 'bg-gray-400'
                }`}>
                  <span className="text-white text-sm font-bold">{event.icon}</span>
                </div>
                
                {/* Event card */}
                <div className={`ml-4 flex-1 p-3 rounded-lg ${
                  event.isDue
                    ? 'bg-red-50 border border-red-300'
                    : event.id?.startsWith('payment-')
                    ? 'bg-yellow-50'
                    : event.status === 'completed' || event.status === 'approved' || event.status === 'paid'
                    ? 'bg-green-50'
                    : 'bg-gray-50'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-semibold ${event.isDue ? 'text-red-700' : 'text-gray-900'}`}>{event.title}</h4>
                        {!event.id?.startsWith('payment-') && event.amount && (
                          <span className={`text-sm font-bold ${event.isDue ? 'text-red-700' : 'text-gray-900'}`}>₹{Number(event.amount).toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 ${event.isDue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>{event.date}</p>
                      <p className={`text-xs mt-1 ${event.isDue ? 'text-red-600' : 'text-gray-500'}`}>{event.description}</p>
                      {/* PI number intentionally hidden per requirement */}
                      {!event.isDue && event.remainingAmount !== undefined && (
                        <p className="text-xs text-red-600 mt-1 font-medium">Remaining: ₹{Number(event.remainingAmount).toLocaleString('en-IN')}</p>
                      )}
                      
                      {/* View button for quotations */}
                      {event.quotationId && (
                        <div className="mt-2 flex items-center space-x-2">
                          <button
                            onClick={() => handleViewQuotation(event.quotationId)}
                            className="text-blue-600 hover:text-blue-800 text-xs flex items-center space-x-1"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="ml-2">
                      {event.id?.startsWith('payment-') ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">
                          ₹{Number(event.amount || 0).toLocaleString('en-IN')}
                        </span>
                      ) : (
                        getStatusBadge(event.status)
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Modal component for adding payments
const PaymentModal = ({ item, onClose, onPaymentAdded }) => {
  const [paymentData, setPaymentData] = useState({
    installment_amount: '',
    payment_method: 'cash',
    payment_reference: '',
    delivery_note: '',
    payment_remark: '',
    payment_status: 'advance',
    payment_receipt_url: '',
    purchase_order_id: '',
    delivery_date: '',
    delivery_status: 'pending'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [approvedQuotations, setApprovedQuotations] = useState([]);
  const [selectedQuotationId, setSelectedQuotationId] = useState(item.quotationData?.id || '');
  const [proformaInvoices, setProformaInvoices] = useState([]);
  const [selectedPIId, setSelectedPIId] = useState('');
  const [summary, setSummary] = useState({ total: 0, paid: 0, remaining: 0 });
  const [credit, setCredit] = useState(0);
  const [installments, setInstallments] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        if (!item?.leadData?.id) return;
        const [qRes, cRes] = await Promise.all([
          quotationService.getApproved(item.leadData.id),
          paymentService.getCustomerCredit(item.leadData.id)
        ]);
        
        // Filter quotations to only show those with PI created
        const allApprovedQuotations = qRes?.data || [];
        const quotationsWithPI = [];
        
        for (const q of allApprovedQuotations) {
          try {
            const piRes = await proformaInvoiceService.getPIsByQuotation(q.id);
            const pis = piRes?.data || [];
            if (pis.length > 0) {
              quotationsWithPI.push(q);
            }
          } catch (err) {
            console.warn(`Error fetching PI for quotation ${q.id}:`, err);
          }
        }
        
        setApprovedQuotations(quotationsWithPI);
        setCredit(cRes?.data?.balance || 0);
        
        // Pre-select quotation if available
        const qid = item.quotationData?.id || (quotationsWithPI?.[0]?.id || '');
        if (qid) {
          setSelectedQuotationId(qid);
          const [sRes, pRes, piRes] = await Promise.all([
            quotationService.getSummary(qid),
            paymentService.getPaymentsByQuotation(qid),
            proformaInvoiceService.getPIsByQuotation(qid)
          ]);
          const s = sRes?.data || { total: 0, paid: 0, remaining: 0 };
          setSummary(s);
          setInstallments(pRes?.data || []);
          const pis = piRes?.data || [];
          setProformaInvoices(pis);
          
          // Auto-select first PI if available
          if (pis.length > 0) {
            setSelectedPIId(pis[0].id);
          }
          
          setPaymentData((p) => ({ 
            ...p, 
            installment_amount: String(s.remaining || ''),
            purchase_order_id: item.quotationData?.work_order_id || ''
          }));
        }
      } catch (e) {
        console.error('Init payment modal failed', e);
        setError('Failed to load quotations. Please try again.');
      }
    };
    init();
  }, [item?.leadData?.id, item.quotationData?.id]);

  const handleSelectQuotation = async (qid) => {
    setSelectedQuotationId(qid);
    setSelectedPIId('');
    setProformaInvoices([]);
    if (!qid) return;
    try {
      const [sRes, pRes, piRes] = await Promise.all([
        quotationService.getSummary(qid),
        paymentService.getPaymentsByQuotation(qid),
        proformaInvoiceService.getPIsByQuotation(qid)
      ]);
      const s = sRes?.data || { total: 0, paid: 0, remaining: 0 };
      setSummary(s);
      setInstallments(pRes?.data || []);
      const pis = piRes?.data || [];
      setProformaInvoices(pis);
      
      // Auto-select first PI if available
      if (pis.length > 0) {
        setSelectedPIId(pis[0].id);
      }
      
      setPaymentData((p) => ({ ...p, installment_amount: String(s.remaining || '') }));
    } catch (e) {
      setProformaInvoices([]);
      setError('Failed to load PI for selected quotation');
    }
  };

  const handleReceiptUpload = async (file) => {
    if (!file) return;
    
    setUploadingReceipt(true);
    try {
      const url = await uploadService.uploadFile(file, 'payments');
      setPaymentData(prev => ({ ...prev, payment_receipt_url: url }));
      setReceiptFile(file);
    } catch (error) {
      setError('Failed to upload receipt: ' + (error.message || 'Unknown error'));
    } finally {
      setUploadingReceipt(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate PI is selected
      if (!selectedPIId) {
        setError('Please create PI first, then add payment. PI (Proforma Invoice) is required to add payment.');
        setLoading(false);
        return;
      }

      if (!selectedQuotationId) {
        setError('Please select a quotation with PI created.');
        setLoading(false);
        return;
      }

      // Upload receipt if file is selected but URL is not set
      let receiptUrl = paymentData.payment_receipt_url;
      if (receiptFile && !receiptUrl) {
        receiptUrl = await uploadService.uploadFile(receiptFile, 'payments');
      }

      const paymentPayload = {
        lead_id: item.leadData?.id,
        quotation_id: selectedQuotationId,
        pi_id: selectedPIId,
        installment_amount: parseFloat(paymentData.installment_amount),
        payment_method: paymentData.payment_method,
        payment_reference: paymentData.payment_reference,
        payment_status: paymentData.payment_status,
        payment_receipt_url: receiptUrl || undefined,
        payment_date: new Date().toISOString(),
        notes: paymentData.delivery_note,
        remarks: paymentData.payment_remark,
        purchase_order_id: paymentData.purchase_order_id,
        delivery_date: paymentData.delivery_date || null,
        delivery_status: paymentData.delivery_status
      };

      const response = await paymentService.createPayment(paymentPayload);
      if (response.success) {
        const { summary: responseSummary } = response.data;
        onClose();
        onPaymentAdded({ leadId: item.leadData?.id, quotationId: selectedQuotationId });
        alert(`Payment installment #${responseSummary.installment_number} added successfully!\nPaid: ₹${responseSummary.total_paid.toLocaleString('en-IN')}\nRemaining: ₹${responseSummary.remaining.toLocaleString('en-IN')}`);
      } else {
        setError('Failed to add payment');
      }
    } catch (error) {
      console.error('Error adding payment:', error);
      setError(error.response?.data?.message || 'Failed to add payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Add Payment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">{item.customerName}</h4>
            <p className="text-sm text-gray-600">Lead ID: {item.leadId}</p>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quotation (approved only)</label>
            <select
              value={selectedQuotationId}
              onChange={(e) => handleSelectQuotation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select Approved Quotation --</option>
              {approvedQuotations.map((q) => (
                <option key={q.id} value={q.id}>{q.quotation_number || q.id} - ₹{Number(q.total_amount || q.totalAmount || 0).toLocaleString()}</option>
              ))}
            </select>
              {selectedQuotationId && proformaInvoices.length > 0 && (
                <div className="text-xs text-gray-600 mt-2 grid grid-cols-2 gap-2">
                  <div>Total: ₹{Number(summary.total ?? 0).toLocaleString()}</div>
                  <div>Paid: ₹{Number(summary.paid ?? 0).toLocaleString()}</div>
                  <div>Remaining: ₹{Number(summary.remaining ?? 0).toLocaleString()}</div>
                  <div>Available credit: ₹{Number(credit ?? 0).toLocaleString()}</div>
                </div>
              )}
            </div>

            {selectedQuotationId && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proforma Invoice (PI) <span className="text-red-600">*</span>
                </label>
                {proformaInvoices.length > 0 ? (
                  <>
                    <select
                      value={selectedPIId}
                      onChange={(e) => setSelectedPIId(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">-- Select PI (Required) --</option>
                      {proformaInvoices.map((pi) => (
                        <option key={pi.id} value={pi.id}>
                          {pi.pi_number} - ₹{Number(pi.total_amount || 0).toLocaleString()} 
                          {pi.status && ` (${pi.status})`}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-blue-600 mt-1 font-medium">PI is required to add payment</p>
                  </>
                ) : (
                  <div className="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50">
                    <p className="text-sm text-red-600 font-medium">⚠ No PI found for this quotation</p>
                    <p className="text-xs text-red-500 mt-1">Please create PI first before adding payment</p>
                  </div>
                )}
              </div>
            )}
            
            {approvedQuotations.length === 0 && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800 font-medium">⚠ No quotations with PI available</p>
                <p className="text-xs text-yellow-700 mt-1">Please create a PI for an approved quotation first, then you can add payment.</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Installment Amount *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={paymentData.installment_amount}
                onChange={(e) => setPaymentData(prev => ({ ...prev, installment_amount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter installment amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method *
              </label>
              <select
                required
                value={paymentData.payment_method}
                onChange={(e) => setPaymentData(prev => ({ ...prev, payment_method: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
                <option value="credit">Credit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select
                value={paymentData.payment_status}
                onChange={(e) => setPaymentData(prev => ({ ...prev, payment_status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="advance">Advance</option>
                <option value="full">Full Payment</option>
                <option value="completed">Completed</option>
                <option value="due">Due</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Reference
              </label>
              <input
                type="text"
                value={paymentData.payment_reference}
                onChange={(e) => setPaymentData(prev => ({ ...prev, payment_reference: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="UTR/Ref No, UPI Txn ID, Cheque No, Bank Ref No"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Payment Receipt {paymentData.payment_receipt_url && <span className="text-green-600 text-xs">✓ Uploaded</span>}
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleReceiptUpload(file);
                    }
                  }}
                  disabled={uploadingReceipt}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                />
                {uploadingReceipt && (
                  <p className="text-sm text-blue-600">Uploading...</p>
                )}
                {paymentData.payment_receipt_url && (
                  <a
                    href={paymentData.payment_receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline block"
                  >
                    View Receipt
                  </a>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Order ID
              </label>
              <input
                type="text"
                value={paymentData.purchase_order_id}
                onChange={(e) => setPaymentData(prev => ({ ...prev, purchase_order_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Purchase order reference"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={paymentData.delivery_date}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, delivery_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Status
                </label>
                <select
                  value={paymentData.delivery_status}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, delivery_status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Remark</label>
              <textarea
                value={paymentData.payment_remark}
                onChange={(e) => setPaymentData(prev => ({ ...prev, payment_remark: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Payment remarks"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Note</label>
              <textarea
                value={paymentData.delivery_note}
                onChange={(e) => setPaymentData(prev => ({ ...prev, delivery_note: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Delivery note (optional)"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Add Payment Installment'}
              </button>
            </div>
          </form>
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentItem, setSelectedPaymentItem] = useState(null);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPaymentTracking.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPaymentTracking = filteredPaymentTracking.slice(startIndex, endIndex);

  // Fetch payment tracking data - fetch ALL payments from payment_history table
  useEffect(() => {
    const fetchPaymentTracking = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch assigned leads for the salesperson
        const leadsResponse = await apiClient.get(API_ENDPOINTS.SALESPERSON_ASSIGNED_LEADS_ME());
        const leads = leadsResponse?.data || [];
        const leadIds = leads.map(lead => lead.id);
        
        // Create a map of customer ID to lead data for quick lookup
        const leadsMap = {};
        leads.forEach(lead => {
          leadsMap[lead.id] = lead;
        });
        
        // Fetch ALL payments from payment_history table for all assigned leads
        const allPayments = [];
        for (const leadId of leadIds) {
          try {
            const paymentRes = await paymentService.getPaymentsByCustomer(leadId);
            const payments = Array.isArray(paymentRes?.data) ? paymentRes.data : [];
            allPayments.push(...payments);
          } catch (err) {
            console.warn(`Error fetching payments for lead ${leadId}:`, err);
          }
        }
        
        // Also fetch payments by quotation to catch any missed payments
        const allQuotations = [];
        for (const leadId of leadIds) {
          try {
            const qRes = await quotationService.getQuotationsByCustomer(leadId);
            const quotations = Array.isArray(qRes?.data) ? qRes.data : [];
            allQuotations.push(...quotations);
            
            for (const quotation of quotations) {
              try {
                const pRes = await paymentService.getPaymentsByQuotation(quotation.id);
                const payments = Array.isArray(pRes?.data) ? pRes.data : [];
                payments.forEach(p => {
                  const exists = allPayments.some(ap => ap.id === p.id || 
                    (ap.payment_reference && p.payment_reference && ap.payment_reference === p.payment_reference));
                  if (!exists) {
                    allPayments.push(p);
                  }
                });
              } catch (err) {
                console.warn(`Error fetching payments for quotation ${quotation.id}:`, err);
              }
            }
          } catch (err) {
            console.warn(`Error fetching quotations for lead ${leadId}:`, err);
          }
        }
        
        // Group payments by quotation_id and lead_id
        const paymentMap = new Map();
        
        allQuotations.forEach(quotation => {
          const lead = leadsMap[quotation.customer_id] || {};
          const key = quotation.id || `lead_${quotation.customer_id}`;
          if (!paymentMap.has(key)) {
            paymentMap.set(key, {
              quotation,
              lead,
              payments: []
            });
          }
        });
        
        allPayments.forEach(payment => {
          const key = payment.quotation_id || `lead_${payment.lead_id}`;
          if (paymentMap.has(key)) {
            paymentMap.get(key).payments.push(payment);
          } else {
            const lead = leadsMap[payment.lead_id] || {};
            paymentMap.set(key, {
              quotation: null,
              lead,
              payments: [payment]
            });
          }
        });
        
        // Build payment tracking data with correct status logic
        // ONLY show items with PI created
        const paymentTrackingData = [];
        
        // Fetch PI for each quotation to filter
        for (const [key, { quotation, lead, payments }] of paymentMap.entries()) {
          // Skip if no quotation
          if (!quotation) continue;
          
          // Check if PI exists for this quotation
          let hasPIForQuotation = false;
          try {
            const piRes = await proformaInvoiceService.getPIsByQuotation(quotation.id);
            const pis = piRes?.data || [];
            hasPIForQuotation = pis.length > 0;
          } catch (err) {
            console.warn(`Error checking PI for quotation ${quotation.id}:`, err);
            hasPIForQuotation = false;
          }
          
          // Skip if no PI exists
          if (!hasPIForQuotation) {
            continue;
          }
          
          // Filter out refunds
          const validPayments = payments.filter(p => !p.is_refund);
          
          // Calculate payment totals using installment_amount
          // ONLY count APPROVED payments
          const totalPaid = validPayments
            .filter(p => {
              const status = (p.payment_status || '').toLowerCase();
              const approvalStatus = (p.approval_status || '').toLowerCase();
              const isApproved = approvalStatus === 'approved';
              return (status === 'completed' || status === 'paid' || status === 'success' || status === 'advance') && isApproved;
            })
            .reduce((sum, p) => sum + Number(p.installment_amount || p.paid_amount || 0), 0);
          
          const quotationTotal = quotation ? Number(quotation.total_amount || 0) : 0;
          const remainingAmount = Math.max(0, quotationTotal - totalPaid);
          
          // Determine payment status
          let paymentStatus = 'due';
          let displayStatus = 'Due';
          
          if (quotationTotal > 0) {
            if (totalPaid >= quotationTotal) {
              paymentStatus = 'paid';
              displayStatus = 'Paid';
            } else if (totalPaid > 0) {
              paymentStatus = 'advance';
              displayStatus = 'Advance';
            } else {
              paymentStatus = 'due';
              displayStatus = 'Due';
            }
          } else if (totalPaid > 0) {
            paymentStatus = 'advance';
            displayStatus = 'Advance';
          }
          
          // Get due date and purchase order from latest payment
          const paymentsWithDates = validPayments.filter(p => p.revised_delivery_date || p.delivery_date);
          let dueDate = null;
          let deliveryStatus = 'pending';
          let purchaseOrderId = null;
          
          if (paymentsWithDates.length > 0) {
            const latestPayment = paymentsWithDates[paymentsWithDates.length - 1];
            dueDate = latestPayment.revised_delivery_date || latestPayment.delivery_date;
            deliveryStatus = latestPayment.delivery_status || 'pending';
          }
          
          if (validPayments.length > 0) {
            const latestPayment = validPayments[validPayments.length - 1];
            purchaseOrderId = latestPayment.purchase_order_id || (quotation ? quotation.work_order_id : null);
          }
          
          // Calculate days overdue
          const daysOverdue = dueDate ? Math.max(0, Math.ceil((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24))) : 0;
          
          const firstPayment = validPayments.length > 0 ? validPayments[0] : null;
          
          paymentTrackingData.push({
            id: quotation ? `${quotation.customer_id || lead.id}-${quotation.id}` : `lead_${lead.id || (firstPayment?.lead_id)}`,
            leadId: `LD-${quotation ? (quotation.customer_id || lead.id) : (lead.id || firstPayment?.lead_id)}`,
            customerName: quotation?.customer_name || lead.name || firstPayment?.customer_name || 'N/A',
            productName: lead.product_type || quotation?.items?.[0]?.description || firstPayment?.product_name || 'N/A',
            address: quotation?.customer_address || lead.address || firstPayment?.address || 'N/A',
            quotationId: quotation?.quotation_number || (quotation ? `QT-${quotation.id}` : 'N/A'),
            paymentStatus: paymentStatus,
            displayStatus: displayStatus,
            dueAmount: remainingAmount,
            dueDate: dueDate,
            deliveryStatus: deliveryStatus,
            daysOverdue: daysOverdue,
            totalAmount: quotationTotal,
            paidAmount: totalPaid,
            remainingAmount: remainingAmount,
            workOrderId: purchaseOrderId ? `PO-${purchaseOrderId}` : (quotation?.work_order_id ? `PO-${quotation.work_order_id}` : 'N/A'),
            leadData: lead,
            quotationData: quotation ? {
              ...quotation,
              paid_amount: totalPaid,
              remaining_amount: remainingAmount,
              delivery_date: dueDate,
              delivery_status: deliveryStatus
            } : null,
            paymentsData: validPayments
          });
        }
        
        // Filter only items with due amount (remaining_amount > 0) OR advance payments (status = 'advance')
        // Due Payment page should show: items with no payment (due) AND items with partial payment (advance)
        const duePayments = paymentTrackingData.filter(item => 
          item.remainingAmount > 0 || item.paymentStatus === 'advance' || item.paymentStatus === 'due'
        );
        
        // Sort by most recent payment date
        duePayments.sort((a, b) => {
          const aDate = a.paymentsData?.length > 0 ? new Date(a.paymentsData[a.paymentsData.length - 1].payment_date || a.paymentsData[a.paymentsData.length - 1].created_at) : new Date(0);
          const bDate = b.paymentsData?.length > 0 ? new Date(b.paymentsData[b.paymentsData.length - 1].payment_date || b.paymentsData[b.paymentsData.length - 1].created_at) : new Date(0);
          return bDate - aDate;
        });
        
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

  const handleAddPayment = (item) => {
    if (!item) {
      alert('Please select a payment record from the table to add payment');
      return;
    }
    setSelectedPaymentItem(item);
    setShowPaymentModal(true);
  };

  const getPaymentStatusBadge = (status, item) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    // Always show "Due" for items in this page since they have remaining amount
    const isOverdue = item.daysOverdue > 0;
    return (
      <span className={`${baseClasses} ${
        isOverdue 
          ? 'bg-red-100 text-red-800' 
          : 'bg-orange-100 text-orange-800'
      }`}>
        {isOverdue ? `Overdue (${item.daysOverdue} days)` : 'Due'}
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

  // Group payments by due date
  const groupPaymentsByDate = (payments) => {
    const grouped = {};
    payments.forEach(payment => {
      const dateKey = payment.dueDate ? new Date(payment.dueDate).toDateString() : 'No Due Date';
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(payment);
    });
    // Sort groups by date
    return Object.entries(grouped).sort(([dateA], [dateB]) => {
      if (dateA === 'No Due Date') return 1;
      if (dateB === 'No Due Date') return -1;
      return new Date(dateA) - new Date(dateB);
    });
  };

  const groupedPayments = groupPaymentsByDate(paginatedPaymentTracking);

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      {/* Toolbar */}
      <Toolbar
        onSearch={handleSearch}
        onAddProduct={handleAddProduct}
        onFilterChange={handleFilterChange}
        onRefresh={() => window.location.reload()}
        products={paymentTracking}
        loading={loading}
      />

      {/* Grouped Payments by Date */}
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
        <div className="space-y-6">
          {groupedPayments.map(([dateKey, datePayments]) => {
            const date = dateKey !== 'No Due Date' ? new Date(dateKey) : null;
            const dateStr = date ? date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'No Due Date';
            const fullDateStr = date ? date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'No Due Date Set';
            
            return (
              <div key={dateKey} className="bg-white shadow overflow-hidden sm:rounded-lg">
                {/* Date Header */}
                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{dateStr}</h2>
                        <p className="text-sm text-gray-600">{fullDateStr}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      {datePayments.length} {datePayments.length === 1 ? 'payment' : 'payments'}
                    </span>
                  </div>
                </div>

                {/* Table for this date group */}
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
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {datePayments.map((item) => (
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
                              <Tooltip text="Add Payment">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddPayment(item);
                                  }}
                                  className="text-purple-600 hover:text-purple-900 p-1 rounded-full hover:bg-purple-50"
                                >
                                  <CreditCard className="h-4 w-4" />
                                </button>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
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
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal 
          item={selectedPaymentItem} 
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPaymentItem(null);
          }}
          onPaymentAdded={async () => {
            setShowPaymentModal(false);
            setSelectedPaymentItem(null);
            await fetchPaymentTracking();
          }}
        />
      )}
      
    </div>
  );
}
