import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, Upload, RefreshCw, Edit, Eye, 
  Hash, User, Mail, Building, Shield, Tag, Clock, Settings,
  Calendar, CheckCircle, XCircle, Download, FileText, Phone, X, Receipt, CreditCard
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import AddCustomerModal from './AddCustomerModal';
import QuotationPreview from '../../components/QuotationPreview';
import PIPreviewModal from '../salesperson/PIPreviewModal';
import departmentHeadService from '../../api/admin_api/departmentHeadService';
import departmentUserService from '../../api/admin_api/departmentUserService';
import quotationService from '../../api/admin_api/quotationService';
import proformaInvoiceService from '../../api/admin_api/proformaInvoiceService';
import apiErrorHandler from '../../utils/ApiErrorHandler';
import toastManager from '../../utils/ToastManager';
import apiClient from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../api/admin_api/api';

// Customer Timeline Component (same styling as LeadStatus.jsx)
const CustomerTimeline = ({ lead, onClose, onQuotationView, onPIView, setSelectedQuotation, setShowQuotationModal, toastManager }) => {
  if (!lead) return null;

  const [latestQuotation, setLatestQuotation] = useState(null);
  const [latestPI, setLatestPI] = useState(null);
  const [payments, setPayments] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [history, setHistory] = useState([]);

  // Compact Indian date-time like "03 Nov 2025, 04:05 AM"
  const formatIndianDateTime = (dateStr, timeStr, createdAt) => {
    try {
      if (dateStr || timeStr) {
        const date = dateStr ? new Date(dateStr) : new Date(createdAt || Date.now());
        if (timeStr) {
          const [hh, mm] = String(timeStr).split(':');
          date.setHours(Number(hh || 0), Number(mm || 0), 0, 0);
        }
        return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      }
      if (createdAt) return new Date(createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (_) {}
    return '';
  };

  useEffect(() => {
    let cancelled = false;
    async function loadDocs() {
      try {
        if (!lead?.id) return;
        // Load lead history
        try {
          const hRes = await apiClient.get(API_ENDPOINTS.SALESPERSON_LEAD_HISTORY(lead.id));
          if (!cancelled) setHistory(hRes?.data?.data || hRes?.data || []);
        } catch (_) {}
        const qRes = await quotationService.getQuotationsByCustomer(lead.id);
        const qList = (qRes?.data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const q = qList[0] || null;
        if (!cancelled) setLatestQuotation(q);
        if (q?.id) {
          const piRes = await proformaInvoiceService.getPIsByQuotation(q.id);
          const piList = (piRes?.data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          if (!cancelled) setLatestPI(piList[0] || null);
          const payRes = await apiClient.get(`/api/payments/quotation/${q.id}`);
          if (!cancelled) setPayments(payRes?.data || []);
          const sumRes = await apiClient.get(`/api/quotations/${q.id}/summary`);
          if (!cancelled) setPaymentSummary(sumRes?.data || null);
        } else if (!cancelled) {
          setLatestPI(null);
          setPayments([]);
          setPaymentSummary(null);
        }
      } catch (e) {
        console.warn('Failed to load quotation/PI for lead preview', e);
      }
    }
    loadDocs();
    return () => { cancelled = true; };
  }, [lead?.id]);

  const groupedHistory = React.useMemo(() => {
    const items = [...history]
      .sort((a, b) => new Date(a.created_at || a.follow_up_date || 0) - new Date(b.created_at || b.follow_up_date || 0));
    const groups = {};
    items.forEach((h) => {
      const d = new Date(h.follow_up_date || h.created_at || Date.now());
      const key = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(h);
    });
    // Ensure the Customer Created day appears at top if different from first history item
    if (lead?.created_at) {
      const createdKey = new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      if (!groups[createdKey]) groups[createdKey] = [];
    }
    return groups;
  }, [history, lead?.created_at]);

  return (
    <div className="fixed top-0 right-0 h-screen z-50" style={{ right: 0, width: 'fit-content', maxWidth: '349px', minWidth: '244px' }}>
      <div className="bg-white h-screen flex flex-col shadow-xl border-l border-gray-200" style={{ width: 'fit-content', maxWidth: '349px', minWidth: '244px' }}>
        {/* Sticky Header */}
        <div className="flex justify-between items-center p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 className="text-sm font-semibold text-gray-900">Customer Timeline</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body - Show all content, hide scrollbar */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 50px)', scrollbarWidth: 'none', msOverflowStyle: 'none', padding: '4px' }}>
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {/* Customer Details */}
          <div style={{ marginBottom: '4px' }}>
            <h4 className="text-xs font-bold text-gray-900" style={{ marginBottom: '2px' }}>Customer Details</h4>
            <div className="text-[11px]" style={{ gap: '1px' }}>
              <div>
                <span className="font-medium text-gray-600">Customer Name:</span>
                <span className="ml-1.5 text-gray-900">{lead.customer || lead.name || 'N/A'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Business Name:</span>
                <span className="ml-1.5 text-gray-900">{lead.business || 'N/A'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Contact No:</span>
                <span className="ml-1.5 text-gray-900">{lead.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Email Address:</span>
                <span className="ml-1.5 text-gray-900">{lead.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ marginTop: '4px' }}>
            <h4 className="text-xs font-bold text-gray-900" style={{ marginBottom: '2px' }}>Timeline</h4>

            {/* Customer Created as first chat bubble */}
            <div className="flex justify-center" style={{ marginTop: '2px' }}>
              <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                {new Date(lead.created_at || lead.createdAt || Date.now()).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
              </span>
            </div>
            <div className="flex justify-start" style={{ marginTop: '2px' }}>
              <div className="max-w-[85%] rounded-lg rounded-tl-none bg-green-50 border border-green-200 p-1.5">
                <div className="flex items-center gap-1.5" style={{ marginBottom: '1px' }}>
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="text-[11px] font-medium text-gray-900">Customer Created</span>
                  <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-green-100 text-green-800">COMPLETED</span>
                </div>
                <div className="text-[10px] text-gray-600">Lead ID: LD-{lead.id}</div>
              </div>
            </div>

            {/* Follow ups grouped by date, chat style bubbles */}
            {Object.keys(groupedHistory).sort((a,b) => new Date(a) - new Date(b)).map((dateKey) => (
              <div key={dateKey} style={{ marginTop: '4px' }}>
                <div className="flex justify-center">
                  <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{dateKey}</span>
                </div>
                <div style={{ marginTop: '2px', gap: '2px' }}>
                  {groupedHistory[dateKey].map((h, idx) => {
                    const right = Boolean(h.sales_status && (h.sales_status.toLowerCase() === 'win' || h.sales_status.toLowerCase() === 'converted'));
                    return (
                      <div key={`${h.id || idx}`} className={right ? 'flex justify-end' : 'flex justify-start'}>
                        <div className={right ? 'max-w-[85%] rounded-lg rounded-tr-none bg-blue-50 border border-blue-200 p-1.5' : 'max-w-[85%] rounded-lg rounded-tl-none bg-white border border-gray-200 p-1.5'} style={{ marginBottom: '2px' }}>
                          <div className="flex items-center gap-1.5" style={{ marginBottom: '1px' }}>
                            <span className="text-[10px] font-medium text-gray-700">Follow Up</span>
                            {h.sales_status && (
                              <span className="ml-auto px-1.5 py-0.5 text-[9px] font-medium rounded bg-yellow-100 text-yellow-800">{String(h.sales_status).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-800">
                            <div style={{ marginBottom: '1px' }}><span className="font-medium">Status:</span> {h.follow_up_status || '—'}</div>
                            {h.follow_up_remark && (
                              <div style={{ marginBottom: '1px' }}><span className="font-medium">Remark:</span> {h.follow_up_remark}</div>
                            )}
                            {(h.follow_up_date || h.follow_up_time || h.created_at) && (
                              <div className="text-[9px] text-gray-500">{formatIndianDateTime(h.follow_up_date, h.follow_up_time, h.created_at)}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quotation Status - Chat Style with Actions */}
            {latestQuotation && (
              <>
                <div className="flex justify-center" style={{ marginTop: '4px' }}>
                  <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    {latestQuotation?.quotation_date ? new Date(latestQuotation.quotation_date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-start" style={{ marginTop: '2px' }}>
                  <div className="max-w-[85%] rounded-lg rounded-tl-none bg-yellow-50 border border-yellow-200 p-1.5">
                    <div className="flex items-center gap-1.5" style={{ marginBottom: '1px' }}>
                      <FileText className="h-3 w-3 text-yellow-600" />
                      <span className="text-[11px] font-medium text-gray-900">Quotation Status</span>
                      <span className={`ml-auto px-1.5 py-0.5 text-[9px] font-medium rounded ${
                        (latestQuotation?.status || '').toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                        (latestQuotation?.status || '').toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                        (latestQuotation?.status ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800')
                      }`}>
                        {(latestQuotation?.status || 'PENDING').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-700" style={{ marginBottom: '2px' }}>
                      <div>No.: {latestQuotation?.quotation_number || 'N/A'}</div>
                    </div>
                    {/* Action Buttons for Pending Quotations - Only show for pending status, hide for approved/rejected */}
                    {((latestQuotation?.status || '').toLowerCase() === 'pending' || 
                      (latestQuotation?.status || '').toLowerCase() === 'pending_verification' ||
                      (latestQuotation?.submitted_for_verification_at && 
                       (latestQuotation?.status || '').toLowerCase() !== 'approved' && 
                       (latestQuotation?.status || '').toLowerCase() !== 'rejected')) && (
                      <div className="flex flex-wrap gap-1" style={{ marginTop: '2px' }}>
                        <button
                          onClick={async () => {
                            try {
                              const res = await quotationService.approveQuotation(latestQuotation.id, '');
                              if (res?.success) {
                                toastManager.success('Quotation approved successfully');
                                // Update quotation status immediately to hide buttons
                                setLatestQuotation(prev => prev ? { ...prev, status: 'approved' } : null);
                                // Refresh quotation data from server
                                const qRes = await quotationService.getQuotationsByCustomer(lead.id);
                                const qList = (qRes?.data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                                setLatestQuotation(qList[0] || null);
                              }
                            } catch (e) {
                              toastManager.error('Failed to approve quotation');
                            }
                          }}
                          className="text-[9px] px-2 py-0.5 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={async () => {
                            const reason = prompt('Please enter rejection reason:');
                            if (!reason) return;
                            try {
                              const res = await quotationService.rejectQuotation(latestQuotation.id, reason);
                              if (res?.success) {
                                toastManager.success('Quotation rejected');
                                // Update quotation status immediately to hide buttons
                                setLatestQuotation(prev => prev ? { ...prev, status: 'rejected' } : null);
                                // Refresh quotation data from server
                                const qRes = await quotationService.getQuotationsByCustomer(lead.id);
                                const qList = (qRes?.data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                                setLatestQuotation(qList[0] || null);
                              }
                            } catch (e) {
                              toastManager.error('Failed to reject quotation');
                            }
                          }}
                          className="text-[9px] px-2 py-0.5 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                        >
                          Reject
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const qRes = await quotationService.getCompleteData(latestQuotation.id);
                              console.log('Quotation API Response:', qRes);
                              if (qRes?.success) {
                                // API returns { success: true, data: { quotation: {...}, items: [...] } }
                                const quotationData = qRes.data?.quotation || qRes.data;
                                console.log('Quotation data to pass:', quotationData);
                                if (quotationData) {
                                  // Try callback first, then fallback to direct state
                                  if (onQuotationView) {
                                    onQuotationView(quotationData);
                                  } else if (setSelectedQuotation && setShowQuotationModal) {
                                    setSelectedQuotation(quotationData);
                                    setShowQuotationModal(true);
                                  } else {
                                    console.error('No way to display quotation - missing callbacks and state setters');
                                    if (toastManager) {
                                      toastManager.error('Unable to display quotation - missing handlers');
                                    }
                                  }
                                } else {
                                  if (toastManager) {
                                    toastManager.error('Quotation data not found in response');
                                  }
                                }
                              } else {
                                toastManager.error('Failed to load quotation: ' + (qRes?.message || 'Unknown error'));
                              }
                            } catch (e) {
                              console.error('Error loading quotation:', e);
                              toastManager.error('Failed to load quotation: ' + (e?.message || 'Unknown error'));
                            }
                          }}
                          className="text-[9px] px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                        >
                          View
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* PI Status - Chat Style with Actions */}
            {latestPI && (
              <>
                <div className="flex justify-center" style={{ marginTop: '4px' }}>
                  <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    {latestPI?.created_at ? new Date(latestPI.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-start" style={{ marginTop: '2px' }}>
                  <div className="max-w-[85%] rounded-lg rounded-tl-none bg-orange-50 border border-orange-200 p-1.5">
                    <div className="flex items-center gap-1.5" style={{ marginBottom: '1px' }}>
                      <Receipt className="h-3 w-3 text-orange-600" />
                      <span className="text-[11px] font-medium text-gray-900">PI Status</span>
                      <span className={`ml-auto px-1.5 py-0.5 text-[9px] font-medium rounded ${
                        (latestPI?.status || '').toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                        (latestPI?.status || '').toLowerCase() === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                        (latestPI?.status ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800')
                      }`}>
                        {(latestPI?.status || 'PENDING').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-700" style={{ marginBottom: '2px' }}>
                      <div>No.: {latestPI?.pi_number || 'N/A'}</div>
                    </div>
                    {/* Action Buttons for Pending PIs - Only show for pending status, hide for approved/rejected */}
                    {((latestPI?.status || '').toLowerCase() === 'pending' || 
                      (latestPI?.status || '').toLowerCase() === 'pending_approval') &&
                      (latestPI?.status || '').toLowerCase() !== 'approved' &&
                      (latestPI?.status || '').toLowerCase() !== 'rejected' && (
                      <div className="flex flex-wrap gap-1" style={{ marginTop: '2px' }}>
                        <button
                          onClick={async () => {
                            try {
                              const res = await proformaInvoiceService.updatePI(latestPI.id, { status: 'approved' });
                              if (res?.success) {
                                toastManager.success('PI approved successfully');
                                // Update PI status immediately to hide buttons
                                setLatestPI(prev => prev ? { ...prev, status: 'approved' } : null);
                                // Refresh PI data from server
                                if (latestQuotation?.id) {
                                  const piRes = await proformaInvoiceService.getPIsByQuotation(latestQuotation.id);
                                  const piList = (piRes?.data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                                  setLatestPI(piList[0] || null);
                                }
                              }
                            } catch (e) {
                              toastManager.error('Failed to approve PI');
                            }
                          }}
                          className="text-[9px] px-2 py-0.5 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={async () => {
                            const reason = prompt('Please enter rejection reason:');
                            if (!reason) return;
                            try {
                              const res = await proformaInvoiceService.updatePI(latestPI.id, { 
                                status: 'rejected',
                                rejection_reason: reason 
                              });
                              if (res?.success) {
                                toastManager.success('PI rejected');
                                // Update PI status immediately to hide buttons
                                setLatestPI(prev => prev ? { ...prev, status: 'rejected' } : null);
                                // Refresh PI data from server
                                if (latestQuotation?.id) {
                                  const piRes = await proformaInvoiceService.getPIsByQuotation(latestQuotation.id);
                                  const piList = (piRes?.data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                                  setLatestPI(piList[0] || null);
                                }
                              }
                            } catch (e) {
                              toastManager.error('Failed to reject PI');
                            }
                          }}
                          className="text-[9px] px-2 py-0.5 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            if (onPIView) {
                              onPIView(latestPI);
                            }
                          }}
                          className="text-[9px] px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                        >
                          View
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Payment Status - Chat Style */}
            {paymentSummary && (
              <>
                <div className="flex justify-center" style={{ marginTop: '4px' }}>
                  <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    {payments.length > 0 && payments[0]?.payment_date ? new Date(payments[0].payment_date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : 'Today'}
                  </span>
                </div>
                <div className="flex justify-start" style={{ marginTop: '2px' }}>
                  <div className="max-w-[85%] rounded-lg rounded-tl-none bg-purple-50 border border-purple-200 p-1.5">
                    <div className="flex items-center gap-1.5" style={{ marginBottom: '1px' }}>
                      <CreditCard className="h-3 w-3 text-purple-600" />
                      <span className="text-[11px] font-medium text-gray-900">Payment Status</span>
                      <span className={`ml-auto px-1.5 py-0.5 text-[9px] font-medium rounded ${
                        paymentSummary && paymentSummary.remaining <= 0 ? 'bg-green-100 text-green-800' :
                        paymentSummary && paymentSummary.paid > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {paymentSummary && paymentSummary.remaining <= 0 ? 'COMPLETED' :
                         paymentSummary && paymentSummary.paid > 0 ? 'PARTIAL' : 'PENDING'}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-700" style={{ gap: '1px' }}>
                      <div className="font-medium text-gray-900" style={{ marginBottom: '1px' }}>Total: ₹{Number(paymentSummary.total || 0).toLocaleString('en-IN')}</div>
                      <div className="text-green-700" style={{ marginBottom: '1px' }}>Paid: ₹{Number(paymentSummary.paid || 0).toLocaleString('en-IN')}</div>
                      <div className="text-red-700" style={{ marginBottom: '1px' }}>Due: ₹{Number(paymentSummary.remaining || 0).toLocaleString('en-IN')}</div>
                      {payments.length > 0 && (
                        <div style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid #e5e7eb' }}>
                          <div className="font-medium text-gray-700 text-[9px]" style={{ marginBottom: '2px' }}>Payment History:</div>
                          {payments.map((payment, idx) => (
                            <div key={payment.id} className="text-[9px] p-1.5 bg-gray-50 rounded" style={{ marginBottom: '2px' }}>
                              <div className="flex justify-between">
                                <span className="font-medium">Advance Payment #{idx + 1}</span>
                                <span className="text-green-700 font-medium">₹{Number(payment.installment_amount || 0).toLocaleString('en-IN')}</span>
                              </div>
                              <div className="text-gray-500 mt-0.5">
                                Method: {payment.payment_method || 'N/A'}
                              </div>
                              <div className="text-gray-500">
                                Date: {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('en-GB') : 'N/A'}
                              </div>
                              {payment.quotation_number && (
                                <div className="text-gray-500">Quotation: {payment.quotation_number}</div>
                              )}
                              {payment.pi_number && (
                                <div className="text-gray-500">PI: {payment.pi_number}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LeadsSimplified = () => {
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [importing, setImporting] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewLead, setPreviewLead] = useState(null);
  const [showCustomerTimeline, setShowCustomerTimeline] = useState(false);
  const [timelineLead, setTimelineLead] = useState(null);
  const [quotationCounts, setQuotationCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [piCounts, setPiCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [statusFilter, setStatusFilter] = useState({ type: null, status: null }); // { type: 'quotation' | 'pi', status: 'pending' | 'approved' | 'rejected' }
  const [assignmentFilter, setAssignmentFilter] = useState(null); // 'assigned' | 'unassigned' | null
  const [filteredQuotations, setFilteredQuotations] = useState({ pending: [], approved: [], rejected: [] });
  const [filteredPIs, setFilteredPIs] = useState({ pending: [], approved: [], rejected: [] });
  const [filteredCustomerIds, setFilteredCustomerIds] = useState(new Set());
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningLead, setAssigningLead] = useState(null);
  const [assignForm, setAssignForm] = useState({ salesperson: '', telecaller: '' });
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showColumnFilter, setShowColumnFilter] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    customerId: false,
    customer: true,
    business: true,
    address: true,
    state: true,
    followUpStatus: true,
    salesStatus: true,
    assignedSalesperson: true,
    assignedTelecaller: true,
    gstNo: false,
    leadSource: false,
    productNames: false,
    category: false,
    createdAt: false,
    telecallerStatus: false,
    paymentStatus: false,
    updatedAt: false
  });
  const [editFormData, setEditFormData] = useState({
    customer: '',
    email: '',
    business: '',
    address: '',
    state: '',
    leadSource: '',
    category: '',
    salesStatus: '',
    phone: '',
    gstNo: '',
    productNames: '',
    assignedSalesperson: '',
    assignedTelecaller: '',
    telecallerStatus: '',
    paymentStatus: ''
  });
  const [usernames, setUsernames] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [quotations, setQuotations] = useState([]);
  const [loadingQuotations, setLoadingQuotations] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [proformaInvoices, setProformaInvoices] = useState([]);
  const [loadingPIs, setLoadingPIs] = useState(false);
  const [showPIPreview, setShowPIPreview] = useState(false);
  const [piPreviewData, setPiPreviewData] = useState(null);
  const [selectedPIBranch, setSelectedPIBranch] = useState('ANODE');

  // Company branches configuration (same as salesperson)
  const companyBranches = {
    ANODE: {
      name: 'ANODE ELECTRIC PVT. LTD.',
      gstNumber: '22ABCDE1234F1Z5',
      description: 'MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES',
      address: 'KHASRA NO. 805/5, PLOT NO. 10, IT PARK, BARGI HILLS, JABALPUR - 482003, MADHYA PRADESH, INDIA',
      tel: '6262002116, 6262002113',
      web: 'www.anocab.com',
      email: 'info@anocab.com'
    }
  };

  // Mock user data for QuotationPreview
  const user = {
    name: 'Department Head',
    email: 'department.head@anocab.com'
  };

  const importFileInputRef = useRef(null);

  // Fetch quotations for a specific lead
  const fetchQuotations = async (leadId) => {
    try {
      setLoadingQuotations(true);
      const response = await quotationService.getQuotationsByCustomer(leadId);
      if (response && response.success) {
        setQuotations(response.data || []);
      } else {
        setQuotations([]);
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
      setQuotations([]);
    } finally {
      setLoadingQuotations(false);
    }
  };

  // Handle quotation approval
  const handleApproveQuotation = async (quotationId) => {
    try {
      const response = await quotationService.approveQuotation(quotationId, 'Approved by department head');
      if (response && response.success) {
        toastManager.success('Quotation approved successfully');
        // Refresh quotations for the current lead
        if (previewLead && previewLead.id) {
          await fetchQuotations(previewLead.id);
        }
      }
    } catch (error) {
      apiErrorHandler.handleError(error, 'approve quotation');
    }
  };

  // Handle quotation rejection
  const handleRejectQuotation = async (quotationId) => {
    try {
      const response = await quotationService.rejectQuotation(quotationId, 'Rejected by department head');
      if (response && response.success) {
        toastManager.success('Quotation rejected successfully');
        // Refresh quotations for the current lead
        if (previewLead && previewLead.id) {
          await fetchQuotations(previewLead.id);
        }
      }
    } catch (error) {
      apiErrorHandler.handleError(error, 'reject quotation');
    }
  };

  // Handle view quotation
  const handleViewQuotation = async (quotationId) => {
    try {
      const response = await quotationService.getQuotation(quotationId);
      if (response && response.success) {
        setSelectedQuotation(response.data);
        setShowQuotationModal(true);
      }
    } catch (error) {
      apiErrorHandler.handleError(error, 'view quotation');
    }
  };

  // Handle download PDF
  const handleDownloadPDF = async (quotationId) => {
    try {
      const response = await quotationService.getQuotation(quotationId);
      if (response && response.success) {
        const quotationData = response.data;
        
        // Use the same approach as salesperson - create a temporary modal
        const tempDiv = document.createElement('div');
        tempDiv.id = 'quotation-pdf-content';
        tempDiv.style.position = 'fixed';
        tempDiv.style.left = '0';
        tempDiv.style.top = '0';
        tempDiv.style.width = '750px';
        tempDiv.style.maxWidth = '750px';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.padding = '20px';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        tempDiv.style.fontSize = '12px';
        tempDiv.style.color = 'black';
        tempDiv.style.zIndex = '9999';
        tempDiv.style.visibility = 'visible';
        tempDiv.style.opacity = '1';
        
        // Create a simpler HTML structure that's more compatible with html2pdf
        tempDiv.innerHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { 
                font-family: Arial, sans-serif; 
                font-size: 11px; 
                line-height: 1.3; 
                margin: 0; 
                padding: 15px; 
                background: white; 
                color: black;
                width: 100%;
                max-width: 750px;
                box-sizing: border-box;
              }
              .header { border: 2px solid black; margin-bottom: 20px; padding: 15px; }
              .company-name { font-size: 20px; font-weight: bold; margin: 0; }
              .gst-number { font-size: 10px; font-weight: bold; margin: 5px 0; }
              .company-desc { font-size: 10px; margin: 5px 0; }
              .address-section { padding: 10px; background-color: #f5f5f5; margin-top: 10px; }
              .address-grid { display: table; width: 100%; }
              .address-left, .address-right { display: table-cell; width: 50%; }
              .address-right { text-align: right; }
              .section { border: 1px solid black; margin-bottom: 20px; }
              .section-header { padding: 10px; background-color: #f5f5f5; font-weight: bold; }
              .section-content { padding: 10px; }
              .quotation-grid { display: table; width: 100%; }
              .quotation-cell { display: table-cell; width: 25%; padding: 5px; }
              .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 9px; table-layout: fixed; }
              .table th, .table td { border: 1px solid black; padding: 4px; word-wrap: break-word; }
              .table th { background-color: #f5f5f5; text-align: center; font-weight: bold; }
              .table td { text-align: center; }
              .table td:first-child { text-align: left; width: 5%; }
              .table td:nth-child(2) { text-align: left; width: 25%; }
              .table td:nth-child(3) { width: 12%; }
              .table td:nth-child(4), .table td:nth-child(5) { width: 8%; }
              .table td:nth-child(6), .table td:nth-child(7), .table td:nth-child(9) { text-align: right; width: 12%; }
              .table td:nth-child(8) { width: 8%; }
              .totals-grid { display: table; width: 100%; }
              .bank-details, .totals { display: table-cell; width: 50%; padding: 15px; border: 1px solid black; }
              .totals-row { display: table; width: 100%; margin-bottom: 5px; }
              .totals-label, .totals-value { display: table-cell; width: 50%; }
              .totals-value { text-align: right; }
              .total-row { font-weight: bold; border-top: 1px solid black; padding-top: 5px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div style="display: table; width: 100%;">
                <div style="display: table-cell; width: 70%;">
                  <div class="company-name">ANODE ELECTRIC PVT. LTD.</div>
                  <div class="gst-number">22ABCDE1234F1Z5</div>
                  <div class="company-desc">MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES</div>
                </div>
                <div style="display: table-cell; width: 30%; text-align: right;">
                  <img src="https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png" alt="Company Logo" style="height: 40px; width: auto; background: white; padding: 5px; border-radius: 4px;" />
                </div>
              </div>
              <div class="address-section">
                <div class="address-grid">
                  <div class="address-left">
                    <div style="font-weight: bold;">KHASRA NO. 805/5, PLOT NO. 10, IT PARK</div>
                    <div>BARGI HILLS, JABALPUR - 482003</div>
                    <div>MADHYA PRADESH, INDIA</div>
                  </div>
                  <div class="address-right">
                    <div>Tel: 6262002116, 6262002113</div>
                    <div>Web: www.anocab.com</div>
                    <div>Email: info@anocab.com</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-header">Quotation Details</div>
              <div class="section-content">
                <div class="quotation-grid">
                  <div class="quotation-cell">
                    <strong>Quotation Date</strong><br/>
                    ${new Date(quotationData.quotation_date).toLocaleDateString()}
                  </div>
                  <div class="quotation-cell">
                    <strong>Quotation Number</strong><br/>
                    ${quotationData.quotation_number}
                  </div>
                  <div class="quotation-cell">
                    <strong>Valid Upto</strong><br/>
                    ${new Date(quotationData.valid_until).toLocaleDateString()}
                  </div>
                  <div class="quotation-cell">
                    <strong>Voucher Number</strong><br/>
                    VOUCH-${Math.floor(1000 + Math.random() * 9000)}
                  </div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-header">Bill To:</div>
              <div class="section-content">
                <div style="font-weight: bold;">${quotationData.customer_name}</div>
                <div>${quotationData.customer_address || 'N/A'}</div>
                <div><strong>Phone:</strong> ${quotationData.customer_phone}</div>
                <div><strong>GST:</strong> ${quotationData.customer_gst_no || 'N/A'}</div>
              </div>
            </div>

            <table class="table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Description</th>
                  <th>HSN Code</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>GST %</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${quotationData.items ? quotationData.items.map((item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.product_name}</td>
                    <td>${item.hsn_code}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unit}</td>
                    <td>₹${parseFloat(item.unit_price).toFixed(2)}</td>
                    <td>₹${parseFloat(item.taxable_amount).toFixed(2)}</td>
                    <td>${item.gst_rate}%</td>
                    <td>₹${parseFloat(item.total_amount).toFixed(2)}</td>
                  </tr>
                `).join('') : '<tr><td colspan="9" style="text-align: center;">No items found</td></tr>'}
              </tbody>
            </table>

            <div class="totals-grid">
              <div class="bank-details">
                <h3 style="font-weight: bold; font-size: 12px; margin-bottom: 10px;">Bank Details</h3>
                <div style="font-size: 10px;">
                  <div><strong>Bank Name:</strong> ICICI Bank</div>
                  <div><strong>Branch Name:</strong> WRIGHT TOWN JABALPUR</div>
                  <div><strong>Bank Account Number:</strong> 657605601783</div>
                  <div><strong>Bank Branch IFSC:</strong> ICIC0006576</div>
                </div>
              </div>
              <div class="totals">
                <div class="totals-row">
                  <div class="totals-label">Subtotal</div>
                  <div class="totals-value">₹${parseFloat(quotationData.subtotal).toFixed(2)}</div>
                </div>
                <div class="totals-row">
                  <div class="totals-label">Less: Discount (0%)</div>
                  <div class="totals-value">₹0.00</div>
                </div>
                <div class="totals-row">
                  <div class="totals-label">Taxable Amount</div>
                  <div class="totals-value">₹${parseFloat(quotationData.subtotal).toFixed(2)}</div>
                </div>
                <div class="totals-row">
                  <div class="totals-label">Add: Total GST (${quotationData.tax_rate || 18}%)</div>
                  <div class="totals-value">₹${parseFloat(quotationData.tax_amount).toFixed(2)}</div>
                </div>
                <div class="totals-row total-row">
                  <div class="totals-label">Total Amount</div>
                  <div class="totals-value">₹${parseFloat(quotationData.total_amount).toFixed(2)}</div>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
        
        document.body.appendChild(tempDiv);
        
        // Wait for the content to be fully rendered and make sure it's visible
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Force a reflow to ensure content is rendered
        tempDiv.offsetHeight;
        
        // Use html2pdf to generate PDF with better settings
        try {
          const opt = {
            margin: [0.2, 0.2, 0.2, 0.2],
            filename: `Quotation-${quotationData.quotation_number}-${quotationData.customer_name.replace(/\s+/g, '-')}.pdf`,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { 
              scale: 1.5,
              useCORS: true,
              letterRendering: true,
              allowTaint: true,
              backgroundColor: '#ffffff',
              logging: true,
              width: 750,
              height: tempDiv.scrollHeight,
              scrollX: 0,
              scrollY: 0,
              windowWidth: 750,
              windowHeight: tempDiv.scrollHeight
            },
            jsPDF: { 
              unit: 'in', 
              format: 'a4', 
              orientation: 'portrait',
              compress: false,
              putOnlyUsedFonts: false
            }
          };
          
          await html2pdf().set(opt).from(tempDiv).save();
          toastManager.success('PDF downloaded successfully');
        } catch (error) {
          console.error('PDF generation error:', error);
          // Fallback: open in new tab
          const newWindow = window.open('', '_blank');
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Quotation - ${quotationData.quotation_number}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              ${tempDiv.innerHTML}
            </body>
            </html>
          `);
          newWindow.document.close();
          toastManager.success('Quotation opened in new tab');
        }
        
        document.body.removeChild(tempDiv);
      }
    } catch (error) {
      apiErrorHandler.handleError(error, 'download PDF');
    }
  };

  const downloadCSVTemplate = () => {
    const headers = [
      'Customer Name',
      'Mobile Number', 
      'WhatsApp Number',
      'Email',
      'Address',
      'GST Number',
      'Business Name',
      'Business Category',
      'Lead Source',
      'Product Names (comma separated)',
      'Assigned Salesperson',
      'Assigned Telecaller',
      'State',
      'Date (YYYY-MM-DD)'
    ];
    
    const csvContent = headers.join(',') + '\n' + 
      'Sample Customer,9876543210,9876543210,sample@email.com,123 Main St,22ABCDE1234F1Z5,Sample Business,dealer,instagram,ACSR AAAC,John Doe,Jane Smith,Delhi,2024-01-15\n' +
      'Another Customer,9876543211,9876543211,another@email.com,456 Main St,22ABCDE1234F1Z6,Another Business,contractor,facebook,AB CABLE AAAC,Jane Doe,John Smith,Mumbai,2024-01-16';
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'leads_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toastManager.success('CSV template downloaded successfully');
  };

  // Parse CSV file
  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    const isBlank = (v) => {
      const s = (v || '').toString().trim().toLowerCase();
      return s === '' || s === 'n/a' || /^-+$/.test(s);
    };
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        // Keep only meaningful rows (at least name or mobile present)
        const name = row['Customer Name'] || row['customer'] || '';
        const mobile = row['Mobile Number'] || row['phone'] || '';
        if (!(isBlank(name) && isBlank(mobile))) {
          data.push(row);
        }
      }
    }
    return data;
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setImportFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target.result;
        const parsedData = parseCSV(csvText);
        setImportPreview(parsedData);
        setShowImportModal(true);
        // Allow selecting the same file name again later
        if (importFileInputRef.current) {
          importFileInputRef.current.value = '';
        }
      };
      reader.readAsText(file);
    } else {
      toastManager.error('Please select a valid CSV file');
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toISOString().split('T')[0];
    
    // Handle different date formats
    if (dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        // If it's DD-MM-YYYY format, convert to YYYY-MM-DD
        if (parts[0].length === 2 && parts[2].length === 4) {
          return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        // If it's already YYYY-MM-DD format, return as is
        if (parts[0].length === 4 && parts[1].length === 2 && parts[2].length === 2) {
          return dateString;
        }
      }
    }
    
    // If it's a valid date string, try to parse it
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {
      console.warn('Invalid date format:', dateString);
    }
    
    // Fallback to current date
    return new Date().toISOString().split('T')[0];
  };

  // Import leads from CSV
  const handleImportLeads = async () => {
    if (importPreview.length === 0) {
      toastManager.error('No data to import');
      return;
    }

    setImporting(true);

    try {
      const leadsPayload = importPreview.map((row) => ({
        customer: row['Customer Name'] || null,
        phone: row['Mobile Number'] || null,
        email: row['Email'] || null,
        address: row['Address'] || null,
        business: row['Business Name'] || null,
        leadSource: row['Lead Source'] || null,
        category: row['Business Category'] || 'N/A',
        salesStatus: 'PENDING',
        gstNo: row['GST Number'] || null,
        productNames: row['Product Names (comma separated)'] || 'N/A',
        state: row['State'] || null,
        assignedSalesperson: row['Assigned Salesperson'] || null,
        assignedTelecaller: row['Assigned Telecaller'] || null,
        whatsapp: row['WhatsApp Number'] || row['Mobile Number'] || null,
        date: formatDate(row['Date (YYYY-MM-DD)']),
        createdAt: new Date().toISOString().split('T')[0],
        telecallerStatus: 'INACTIVE',
        paymentStatus: 'PENDING',
        connectedStatus: 'pending',
        finalStatus: 'open',
        customerType: 'business'
      }));

      const resp = await departmentHeadService.importLeads(leadsPayload);

      // Refresh leads data
      const response = await departmentHeadService.getAllLeads();
      if (response && response.data) {
        const transformedData = transformApiData(response.data);
        setLeadsData(transformedData);
      }
      const inserted = resp?.data?.importedCount ?? leadsPayload.length;
      const duplicates = resp?.data?.duplicatesCount ?? 0;
      const msg = duplicates > 0
        ? `Import completed! ${inserted} added, ${duplicates} duplicate(s) skipped`
        : `Import completed! ${inserted} leads processed`;
      toastManager.success(msg);
      setShowImportModal(false);
      setImportPreview([]);
      setImportFile(null);
      if (importFileInputRef.current) {
        importFileInputRef.current.value = '';
      }
    } catch (error) {
      apiErrorHandler.handleError(error, 'import leads');
    } finally {
      setImporting(false);
    }
  };

  // Format a datetime to IST (DD/MM/YYYY HH:mm)
  const formatToIST = (value) => {
    if (!value) return 'N/A';
    try {
      const d = new Date(value);
      const date = d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
      const time = d.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
      return `${date} ${time}`;
    } catch (e) {
      return String(value);
    }
  };

  // Transform API data to frontend format
  const transformApiData = (apiData) => {
    return apiData.map(lead => ({
      id: lead.id,
      customerId: lead.customer_id,
      customer: lead.customer,
      email: lead.email,
      business: lead.business,
      leadSource: lead.lead_source,
      productNamesText: lead.product_names,
      category: lead.category,
      salesStatus: lead.sales_status,
      salesStatusRemark: lead.sales_status_remark || null,
      createdAt: formatToIST(lead.created_at),
      assignedSalesperson: lead.assigned_salesperson,
      assignedTelecaller: lead.assigned_telecaller,
      telecallerStatus: lead.telecaller_status,
      paymentStatus: lead.payment_status,
      phone: lead.phone,
      address: lead.address,
      gstNo: lead.gst_no,
      state: lead.state,
      customerType: lead.customer_type,
      date: lead.date,
      // Normalized follow-up fields (prefer salesperson values if present)
      followUpStatus: lead.follow_up_status || lead.connected_status || lead.telecaller_status,
      // keep legacy key for any parts still reading connectedStatus
      connectedStatus: lead.follow_up_status || lead.connected_status || lead.telecaller_status,
      followUpRemark: lead.follow_up_remark || null,
      finalStatus: lead.final_status,
      whatsapp: lead.whatsapp,
      createdBy: lead.created_by,
      created_at: formatToIST(lead.created_at),
      updated_at: formatToIST(lead.updated_at)
    }));
  };

  // Fetch leads function
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = { page, limit };
      if (searchTerm && searchTerm.trim() !== '') {
        params.search = searchTerm.trim();
      }
      const response = await departmentHeadService.getAllLeads(params);
      if (response && response.data) {
        const transformedData = transformApiData(response.data);
        setLeadsData(transformedData);
        if (response.pagination) {
          setTotal(Number(response.pagination.total) || 0);
        }
      }
    } catch (error) {
      apiErrorHandler.handleError(error, 'fetch leads');
    } finally {
      setLoading(false);
    }
  };

  // Fetch quotation and PI counts
  const fetchQuotationAndPICounts = async () => {
    try {
      setLoadingCounts(true);
      
      // Fetch quotations pending verification (submitted by salespersons)
      const pendingVerificationRes = await apiClient.get('/api/quotations/pending-verification').catch(() => ({ data: { data: [] } }));
      const pendingVerificationQuotations = pendingVerificationRes?.data?.data || pendingVerificationRes?.data || [];
      
      // Fetch all quotations by status
      const [pendingQRes, approvedQRes, rejectedQRes] = await Promise.all([
        apiClient.get('/api/quotations/status/pending').catch(() => ({ data: { data: [] } })),
        apiClient.get('/api/quotations/status/approved').catch(() => ({ data: { data: [] } })),
        apiClient.get('/api/quotations/status/rejected').catch(() => ({ data: { data: [] } }))
      ]);
      
      const pendingQuotations = pendingQRes?.data?.data || pendingQRes?.data || [];
      const approvedQuotations = approvedQRes?.data?.data || approvedQRes?.data || [];
      const rejectedQuotations = rejectedQRes?.data?.data || rejectedQRes?.data || [];
      
      // Also check for "sent_for_approval" status
      const sentForApprovalRes = await apiClient.get('/api/quotations/status/sent_for_approval').catch(() => ({ data: { data: [] } }));
      const sentForApprovalQuotations = sentForApprovalRes?.data?.data || sentForApprovalRes?.data || [];
      
      // Combine pending verification (submitted by salespersons) with other pending
      // Filter out duplicates by quotation ID
      const allPendingIds = new Set();
      const allPendingQuotations = [];
      
      [...pendingVerificationQuotations, ...pendingQuotations, ...sentForApprovalQuotations].forEach(q => {
        if (q.id && !allPendingIds.has(q.id)) {
          allPendingIds.add(q.id);
          allPendingQuotations.push(q);
        }
      });
      
      setQuotationCounts({
        pending: allPendingQuotations.length,
        approved: approvedQuotations.length,
        rejected: rejectedQuotations.length
      });
      
      // Store all quotations for filtering
      setFilteredQuotations({
        pending: allPendingQuotations,
        approved: approvedQuotations,
        rejected: rejectedQuotations
      });
      
      // Fetch all PIs
      const piResponse = await departmentHeadService.getAllPIs();
      const allPIs = piResponse?.data || [];
      
      // Count PIs by status
      const pendingPIs = allPIs.filter(pi => {
        const status = (pi.status || '').toLowerCase();
        return status === 'pending' || status === 'pending_approval' || status === 'sent_for_approval';
      });
      const approvedPIs = allPIs.filter(pi => (pi.status || '').toLowerCase() === 'approved');
      const rejectedPIs = allPIs.filter(pi => (pi.status || '').toLowerCase() === 'rejected');
      
      setPiCounts({
        pending: pendingPIs.length,
        approved: approvedPIs.length,
        rejected: rejectedPIs.length
      });
      
      // Store all PIs for filtering
      setFilteredPIs({
        pending: pendingPIs,
        approved: approvedPIs,
        rejected: rejectedPIs
      });
    } catch (error) {
      console.error('Error fetching quotation and PI counts:', error);
    } finally {
      setLoadingCounts(false);
    }
  };

  // Fetch leads when page, limit, or search changes
  useEffect(() => {
    fetchLeads();
    fetchQuotationAndPICounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, searchTerm]);

  // Load department usernames when edit modal opens
  useEffect(() => {
    if (!showEditModal) return;
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        setUsersError('');
        const res = await departmentUserService.listUsers({ page: 1, limit: 100 });
        const payload = res.data || res;
        const names = (payload.users || []).map(u => u.username).filter(Boolean);
        setUsernames(names);
      } catch (err) {
        setUsersError(err?.message || 'Failed to load users');
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [showEditModal]);

  // Load department usernames when assign modal opens
  useEffect(() => {
    if (!showAssignModal) return;
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        setUsersError('');
        const res = await departmentUserService.listUsers({ page: 1, limit: 100 });
        const payload = res.data || res;
        const names = (payload.users || []).map(u => u.username).filter(Boolean);
        setUsernames(names);
      } catch (err) {
        setUsersError(err?.message || 'Failed to load users');
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [showAssignModal]);

  // Fetch quotations when preview modal opens
  useEffect(() => {
    if (showPreviewModal && previewLead && previewLead.id) {
      fetchQuotations(previewLead.id);
    }
  }, [showPreviewModal, previewLead]);

  const openAssignModal = (lead) => {
    setAssigningLead(lead);
    setAssignForm({
      salesperson: lead.assignedSalesperson || '',
      telecaller: lead.assignedTelecaller || ''
    });
    setShowAssignModal(true);
  };

  // Column filter handlers
  const toggleColumn = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  // Treat literal strings like 'Unassigned' or 'N/A' as not assigned
  const isValueAssigned = (val) => {
    if (!val) return false;
    const s = String(val).trim().toLowerCase();
    return s !== 'unassigned' && s !== 'n/a' && s !== 'na' && s !== '-';
  };

  const isLeadAssigned = (lead) =>
    isValueAssigned(lead.assignedSalesperson) || isValueAssigned(lead.assignedTelecaller);

  const resetColumns = () => {
    setVisibleColumns({
      customerId: false,
      customer: true,
      business: true,
      address: true,
      state: true,
      followUpStatus: true,
      salesStatus: true,
      assignedSalesperson: true,
      assignedTelecaller: true,
      gstNo: false,
      leadSource: false,
      productNames: false,
      category: false,
      createdAt: false,
      telecallerStatus: false,
      paymentStatus: false,
      updatedAt: false
    });
  };

  const showAllColumns = () => {
    setVisibleColumns(prev => {
      const allTrue = {};
      Object.keys(prev).forEach(key => {
        allTrue[key] = true;
      });
      return allTrue;
    });
  };

  // Selection handlers
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedLeadIds([]);
      setIsAllSelected(false);
      return;
    }
    // Only select leads that are not already assigned
    const ids = filteredLeads
      .filter(l => !isLeadAssigned(l))
      .map(l => l.id);
    setSelectedLeadIds(ids);
    setIsAllSelected(ids.length > 0 && ids.length === filteredLeads.filter(l => !isLeadAssigned(l)).length);
  };

  const toggleSelectOne = (id) => {
    const lead = filteredLeads.find(l => l.id === id);
    if (lead && isLeadAssigned(lead)) return; // prevent selecting assigned
    setSelectedLeadIds((prev) => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      const totalUnassigned = filteredLeads.filter(l => !isLeadAssigned(l)).length;
      setIsAllSelected(next.length > 0 && next.length === totalUnassigned);
      return next;
    });
  };

  // Filter leads based on search, status filter, and assignment filter
  const filteredLeads = leadsData.filter(lead => {
    const matchesSearch = !searchTerm || 
      lead.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.business?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by assignment status (assigned/unassigned)
    if (assignmentFilter) {
      const isAssigned = isLeadAssigned(lead);
      if (assignmentFilter === 'assigned' && !isAssigned) {
        return false;
      }
      if (assignmentFilter === 'unassigned' && isAssigned) {
        return false;
      }
    }

    // Filter by quotation/PI status if active
    if (statusFilter.type && statusFilter.status && filteredCustomerIds.size > 0) {
      // quotations.customer_id (INTEGER) matches department_head_leads.id (INTEGER)
      const leadId = Number(lead.id);
      const leadIdStr = String(lead.id);
      
      // Check both numeric and string formats
      const matches = (!isNaN(leadId) && filteredCustomerIds.has(leadId)) || 
                     filteredCustomerIds.has(leadIdStr);
      
      if (!matches) {
        return false;
      }
    }

    return matchesSearch;
  });
  
  // Calculate assigned and unassigned counts
  const assignedCount = leadsData.filter(lead => isLeadAssigned(lead)).length;
  const unassignedCount = leadsData.filter(lead => !isLeadAssigned(lead)).length;

  // Handle badge click to filter leads
  const handleBadgeClick = async (type, status) => {
    if (statusFilter.type === type && statusFilter.status === status) {
      // Clicking same badge again - clear filter
      setStatusFilter({ type: null, status: null });
      setFilteredCustomerIds(new Set());
      return;
    }
    
    setStatusFilter({ type, status });
    
    // If filtering by PI, we need to get customer IDs from quotations
    if (type === 'pi') {
      const relevantPIs = filteredPIs[status] || [];
      const quotationIds = relevantPIs.map(pi => pi.quotation_id).filter(Boolean);
      
      // Fetch quotations to get customer IDs
      const customerIds = new Set();
      for (const qId of quotationIds) {
        try {
          const qRes = await quotationService.getQuotation(qId);
          if (qRes?.data?.customer_id !== null && qRes?.data?.customer_id !== undefined) {
            const id = Number(qRes.data.customer_id);
            if (!isNaN(id)) {
              customerIds.add(id);
              customerIds.add(String(id)); // Also add as string for flexibility
            }
          }
        } catch (e) {
          console.warn('Error fetching quotation:', e);
        }
      }
      
      setFilteredCustomerIds(customerIds);
    } else if (type === 'quotation') {
      const relevantQuotations = filteredQuotations[status] || [];
      // quotations.customer_id (INTEGER) matches department_head_leads.id (INTEGER)
      const customerIds = new Set();
      relevantQuotations.forEach(q => {
        if (q.customer_id !== null && q.customer_id !== undefined) {
          // Convert to number for proper comparison with lead.id (which is INTEGER)
          const id = Number(q.customer_id);
          if (!isNaN(id)) {
            customerIds.add(id);
            customerIds.add(String(id)); // Also add as string for flexibility
          }
        }
      });
      setFilteredCustomerIds(customerIds);
    }
  };

  // Handle customer creation
  const handleCustomerSave = async (customerData) => {
    try {
      setLoading(true);
      const newCustomer = {
        customer: customerData.customerName || null,
        phone: customerData.mobileNumber || null,
        email: customerData.email || null,
        business: customerData.businessType || null,
        leadSource: customerData.leadSource || null,
        category: customerData.businessCategory || 'N/A',
        salesStatus: 'PENDING',
        gstNo: customerData.gstNumber || null,
        productNames: Array.isArray(customerData.productNames) ? customerData.productNames.join(', ') : (customerData.productNames || 'N/A'),
        address: customerData.address || null,
        state: customerData.state || null,
        assignedSalesperson: customerData.assignedSalesperson || null,
        assignedTelecaller: customerData.assignedTelecaller || null,
        whatsapp: customerData.whatsappNumber || customerData.mobileNumber || null,
        date: customerData.date || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
        telecallerStatus: 'INACTIVE',
        paymentStatus: 'PENDING',
        connectedStatus: 'pending',
        finalStatus: 'open',
        customerType: 'business'
      };

      const resp = await departmentHeadService.createLead(newCustomer);
      
      if (resp && resp.data) {
        const transformedLead = transformApiData([resp.data])[0];
        
        // Always update the leads data with new lead
        setLeadsData(prevLeads => {
          if (prevLeads && prevLeads.length > 0) {
            return [...prevLeads, transformedLead];
          } else {
            return [transformedLead];
          }
        });
        
        toastManager.success('Customer created successfully');
        setShowAddCustomer(false);
        
        // Force refresh the leads data
        setTimeout(async () => {
          try {
            const params = { page, limit };
            if (searchTerm && searchTerm.trim() !== '') {
              params.search = searchTerm.trim();
            }
            const response = await departmentHeadService.getAllLeads(params);
            if (response && response.data) {
              const transformedData = transformApiData(response.data);
              setLeadsData(transformedData);
              if (response.pagination) {
                setTotal(Number(response.pagination.total) || 0);
              }
            }
          } catch (error) {
            console.error('Error refreshing leads:', error);
          }
        }, 100);
      }
    } catch (error) {
      apiErrorHandler.handleError(error, 'create customer');
    } finally {
      setLoading(false);
    }
  };


  // Fetch all PIs (not just pending)
  const fetchPIsForLead = async (lead) => {
    try {
      setLoadingPIs(true);
      const response = await departmentHeadService.getAllPIs();
      
      if (response && response.success) {
        // Show all PIs (pending, approved, rejected)
        setProformaInvoices(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching PIs:', error);
      setProformaInvoices([]);
    } finally {
      setLoadingPIs(false);
    }
  };

  // Handle PI approval
  const handleApprovePI = async (piId) => {
    if (!confirm('Are you sure you want to approve this PI?')) return;
    try {
      await proformaInvoiceService.updatePI(piId, { status: 'approved' });
      toastManager.success('PI approved successfully!');
      // Refresh PIs
      if (previewLead) {
        await fetchPIsForLead(previewLead);
      }
    } catch (error) {
      console.error('Error approving PI:', error);
      toastManager.error('Failed to approve PI');
    }
  };

  // Handle PI rejection
  const handleRejectPI = async (piId) => {
    const reason = prompt('Please enter rejection reason:');
    if (!reason) return;
    try {
      await proformaInvoiceService.updatePI(piId, { 
        status: 'rejected',
        rejection_reason: reason 
      });
      toastManager.success('PI rejected');
      // Refresh PIs
      if (previewLead) {
        await fetchPIsForLead(previewLead);
      }
    } catch (error) {
      console.error('Error rejecting PI:', error);
      toastManager.error('Failed to reject PI');
    }
  };

  // Handle PI view
  const handleViewPI = async (piId) => {
    try {
      // Fetch PI details
      const piResponse = await proformaInvoiceService.getPI(piId);
      if (!piResponse || !piResponse.success) {
        alert('Failed to fetch PI details');
        return;
      }

      const pi = piResponse.data;

      // Fetch complete quotation data
      const quotationResponse = await quotationService.getCompleteData(pi.quotation_id);
      
      if (!quotationResponse || !quotationResponse.success) {
        alert('Failed to fetch quotation details');
        return;
      }

      const completeQuotation = quotationResponse.data?.quotation || quotationResponse.data || {};
      const quotationItems = completeQuotation.items || [];

      // If no items, show error
      if (!quotationItems || quotationItems.length === 0) {
        alert(`No items found in quotation!\n\nQuotation ID: ${pi.quotation_id}`);
        return;
      }

      // Map quotation items to PI format
      const mappedItems = quotationItems.map((item) => {
        const mapped = {
          id: item.id || Math.random(),
          description: item.product_name || item.productName || item.description || 'Product',
          subDescription: item.description || '',
          hsn: item.hsn_code || item.hsn || item.hsnCode || '85446090',
          dueOn: new Date().toISOString().split('T')[0],
          quantity: Number(item.quantity) || 1,
          unit: item.unit || 'Nos',
          rate: Number(item.unit_price || item.buyer_rate || item.unitPrice || 0),
          buyerRate: Number(item.unit_price || item.buyer_rate || item.unitPrice || 0),
          amount: Number(item.taxable_amount ?? item.amount ?? item.taxable ?? item.total_amount ?? item.total ?? 0),
          gstRate: Number(item.gst_rate ?? item.gstRate ?? 18),
          gstMultiplier: 1 + Number(item.gst_rate ?? item.gstRate ?? 18) / 100
        };
        return mapped;
      });

      const subtotal = mappedItems.reduce((s, i) => s + (Number(i.amount) || 0), 0);
      const discountRate = Number(completeQuotation.discount_rate ?? completeQuotation.discountRate ?? 0);
      const discountAmount = Number(completeQuotation.discount_amount ?? completeQuotation.discountAmount ?? (subtotal * discountRate) / 100);
      const taxableAmount = Math.max(0, subtotal - discountAmount);
      const taxRate = Number(completeQuotation.tax_rate ?? completeQuotation.taxRate ?? 18);
      const taxAmount = Number(completeQuotation.tax_amount ?? completeQuotation.taxAmount ?? (taxableAmount * taxRate) / 100);
      const total = Number(completeQuotation.total_amount ?? completeQuotation.total ?? taxableAmount + taxAmount);

      const billTo = {
        business: completeQuotation.customer_business || completeQuotation.billTo?.business || pi.customer_business || '',
        address: completeQuotation.customer_address || completeQuotation.billTo?.address || '',
        phone: completeQuotation.customer_phone || completeQuotation.billTo?.phone || '',
        gstNo: completeQuotation.customer_gst_no || completeQuotation.billTo?.gstNo || '',
        state: completeQuotation.customer_state || completeQuotation.billTo?.state || ''
      };

      // Build PI preview data with dispatch details
      const previewData = {
        quotationNumber: completeQuotation.quotation_number || pi.pi_number,
        items: mappedItems,
        subtotal,
        discountRate,
        discountAmount,
        taxableAmount,
        taxRate,
        taxAmount,
        total,
        billTo,
        dispatchMode: pi.dispatch_mode,
        shippingDetails: {
          transportName: pi.transport_name,
          vehicleNumber: pi.vehicle_number,
          transportId: pi.transport_id,
          lrNo: pi.lr_no,
          courierName: pi.courier_name,
          consignmentNo: pi.consignment_no,
          byHand: pi.by_hand,
          postService: pi.post_service,
          carrierName: pi.carrier_name,
          carrierNumber: pi.carrier_number
        }
      };

      // Wrap in the format expected by PIPreviewModal
      setPiPreviewData({
        data: previewData,
        selectedBranch: completeQuotation.branch || 'ANODE'
      });
      setSelectedPIBranch(completeQuotation.branch || 'ANODE');
      setShowPIPreview(true);
    } catch (error) {
      console.error('Error viewing PI:', error);
      toastManager.error('Failed to load PI details');
    }
  };

  // Handle edit
  const handleEdit = (lead) => {
    setEditingLead(lead);
    setEditFormData({
      customer: lead.customer || '',
      email: lead.email || '',
      business: lead.business || '',
      address: lead.address || '',
      state: lead.state || '',
      leadSource: lead.leadSource || '',
      category: lead.category || '',
      salesStatus: lead.salesStatus || '',
      phone: lead.phone || '',
      gstNo: lead.gstNo || '',
      productNames: lead.productNamesText || '',
      assignedSalesperson: lead.assignedSalesperson || '',
      assignedTelecaller: lead.assignedTelecaller || '',
      telecallerStatus: lead.telecallerStatus || '',
      paymentStatus: lead.paymentStatus || ''
    });
    setShowEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    try {
      if (editingLead && editingLead.id) {
        const apiPayload = {
          customer: editFormData.customer,
          email: editFormData.email,
          business: editFormData.business,
          address: editFormData.address,
          state: editFormData.state,
          leadSource: editFormData.leadSource,
          category: editFormData.category,
          salesStatus: editFormData.salesStatus,
          phone: editFormData.phone,
          gstNo: editFormData.gstNo,
          productNames: editFormData.productNames,
          assignedSalesperson: editFormData.assignedSalesperson,
          assignedTelecaller: editFormData.assignedTelecaller,
          telecallerStatus: editFormData.telecallerStatus,
          paymentStatus: editFormData.paymentStatus
        };
        
        await departmentHeadService.updateLead(editingLead.id, apiPayload);

        // Update local state
        const updatedLeads = leadsData.map(lead =>
          lead.id === editingLead.id
            ? { ...lead, ...editFormData }
            : lead
        );
        setLeadsData(updatedLeads);

        toastManager.success('Lead updated successfully');
        setShowEditModal(false);
        setEditingLead(null);
      }
    } catch (error) {
      apiErrorHandler.handleError(error, 'update lead');
    }
  };

  // Get status badge
  const getStatusBadge = (status, type) => {
    const normalized = (status || '').toString();
    const upper = normalized.toUpperCase();
    const lower = normalized.toLowerCase();

    // Sales status mapping (support old DH enums + salesperson enums)
    const salesMap = {
      'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'PENDING' },
      'IN_PROGRESS': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'IN PROGRESS' },
      'COMPLETED': { bg: 'bg-green-100', text: 'text-green-800', label: 'COMPLETED' },
      // Salesperson page values (lowercase)
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'PENDING' },
      'running': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'RUNNING' },
      'converted': { bg: 'bg-green-100', text: 'text-green-800', label: 'CONVERTED' },
      'interested': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'INTERESTED' },
      'loose': { bg: 'bg-red-100', text: 'text-red-800', label: 'LOOSE' },
      'win/closed': { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'WIN/CLOSED' },
      'win lead': { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'WIN LEAD' },
      'lost': { bg: 'bg-red-100', text: 'text-red-800', label: 'LOST' },
      'closed': { bg: 'bg-red-100', text: 'text-red-800', label: 'CLOSED' },
      'lost/closed': { bg: 'bg-red-100', text: 'text-red-800', label: 'LOST/CLOSED' }
    };

    // Follow-up mapping – reuse salesperson follow-up statuses for DH view
    const followUpMap = {
      'ACTIVE': { bg: 'bg-green-100', text: 'text-green-800', label: 'ACTIVE' },
      'INACTIVE': { bg: 'bg-red-100', text: 'text-red-800', label: 'INACTIVE' },
      'appointment scheduled': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'APPOINTMENT SCHEDULED' },
      'not interested': { bg: 'bg-red-100', text: 'text-red-800', label: 'NOT INTERESTED' },
      'interested': { bg: 'bg-green-100', text: 'text-green-800', label: 'INTERESTED' },
      'quotation sent': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'QUOTATION SENT' },
      'negotiation': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'NEGOTIATION' },
      'close order': { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'CLOSE ORDER' },
      'closed/lost': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'CLOSED/LOST' },
      'call back request': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'CALL BACK REQUEST' },
      'unreachable/call not connected': { bg: 'bg-red-100', text: 'text-red-800', label: 'UNREACHABLE' },
      'currently not required': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'NOT REQUIRED' },
      'not relevant': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'NOT RELEVANT' },
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'PENDING' }
    };

    const paymentMap = {
      'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'PENDING' },
      'IN_PROGRESS': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'IN PROGRESS' },
      'COMPLETED': { bg: 'bg-green-100', text: 'text-green-800', label: 'COMPLETED' }
    };

    const typeMap = type === 'telecaller' ? followUpMap : type === 'payment' ? paymentMap : salesMap;
    const config = typeMap[upper] || typeMap[lower] || typeMap['PENDING'] || { bg: 'bg-gray-100', text: 'text-gray-800', label: normalized || 'PENDING' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div
      className={`space-y-6 transition-all duration-300 ${showCustomerTimeline ? 'pl-6' : 'p-6'}`}
      style={{
        width: showCustomerTimeline ? 'calc(98% - 200px)' : '100%',
        marginRight: 0,
        paddingRight: showCustomerTimeline ? 0 : '1.5rem',
        paddingLeft: '1.5rem',
        boxSizing: 'border-box',
        overflow: 'visible',
        position: 'relative',
        marginLeft: 0,
        maxWidth: showCustomerTimeline ? 'calc(98% - 200px)' : '100%',
        flexShrink: 0
      }}
    >
      {/* Search and Actions */}
      <div className="flex items-center justify-between space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
              placeholder="Search by name, email, or business"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

        <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowImportPopup(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              <span>Import CSV</span>
            </button>
          
            <button
              onClick={() => setShowAddCustomer(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
              </button>
            <button
              onClick={() => {
                setAssigningLead(null);
                setAssignForm({ salesperson: '', telecaller: '' });
                setShowAssignModal(true);
              }}
              disabled={selectedLeadIds.length === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${selectedLeadIds.length === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
              <span>Assign Selected{selectedLeadIds.length ? ` (${selectedLeadIds.length})` : ''}</span>
            </button>
              
            <button
            onClick={fetchLeads}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
                    </button>
        </div>
      </div>

      {/* Quotation and PI Status Badges */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap gap-4">
          {/* Quotation Status Badges */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-gray-700">Quotation:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBadgeClick('quotation', 'pending')}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                  statusFilter.type === 'quotation' && statusFilter.status === 'pending'
                    ? 'bg-yellow-200 text-yellow-900 border-yellow-300 ring-2 ring-yellow-400'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'
                }`}
              >
                Sent for Approval ({loadingCounts ? '...' : quotationCounts.pending})
              </button>
              <button
                onClick={() => handleBadgeClick('quotation', 'approved')}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                  statusFilter.type === 'quotation' && statusFilter.status === 'approved'
                    ? 'bg-green-200 text-green-900 border-green-300 ring-2 ring-green-400'
                    : 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                }`}
              >
                Approved ({loadingCounts ? '...' : quotationCounts.approved})
              </button>
              <button
                onClick={() => handleBadgeClick('quotation', 'rejected')}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                  statusFilter.type === 'quotation' && statusFilter.status === 'rejected'
                    ? 'bg-red-200 text-red-900 border-red-300 ring-2 ring-red-400'
                    : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                }`}
              >
                Rejected ({loadingCounts ? '...' : quotationCounts.rejected})
              </button>
            </div>
          </div>

          {/* PI Status Badges */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-gray-700">PI:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBadgeClick('pi', 'pending')}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                  statusFilter.type === 'pi' && statusFilter.status === 'pending'
                    ? 'bg-yellow-200 text-yellow-900 border-yellow-300 ring-2 ring-yellow-400'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'
                }`}
              >
                Sent for Approval ({loadingCounts ? '...' : piCounts.pending})
              </button>
              <button
                onClick={() => handleBadgeClick('pi', 'approved')}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                  statusFilter.type === 'pi' && statusFilter.status === 'approved'
                    ? 'bg-green-200 text-green-900 border-green-300 ring-2 ring-green-400'
                    : 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                }`}
              >
                Approved ({loadingCounts ? '...' : piCounts.approved})
              </button>
              <button
                onClick={() => handleBadgeClick('pi', 'rejected')}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                  statusFilter.type === 'pi' && statusFilter.status === 'rejected'
                    ? 'bg-red-200 text-red-900 border-red-300 ring-2 ring-red-400'
                    : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                }`}
              >
                Rejected ({loadingCounts ? '...' : piCounts.rejected})
              </button>
            </div>
          </div>

          {/* Assignment Status Badges */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-gray-700">Assignment:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  if (assignmentFilter === 'assigned') {
                    setAssignmentFilter(null);
                  } else {
                    setAssignmentFilter('assigned');
                  }
                }}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                  assignmentFilter === 'assigned'
                    ? 'bg-blue-200 text-blue-900 border-blue-300 ring-2 ring-blue-400'
                    : 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
                }`}
              >
                Assigned ({assignedCount})
              </button>
              <button
                onClick={() => {
                  if (assignmentFilter === 'unassigned') {
                    setAssignmentFilter(null);
                  } else {
                    setAssignmentFilter('unassigned');
                  }
                }}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                  assignmentFilter === 'unassigned'
                    ? 'bg-gray-200 text-gray-900 border-gray-300 ring-2 ring-gray-400'
                    : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                }`}
              >
                Unassigned ({unassignedCount})
              </button>
            </div>
          </div>
        </div>
        {((statusFilter.type && statusFilter.status) || assignmentFilter) && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-600">
              Filtering by: {statusFilter.type && statusFilter.status && `${statusFilter.type === 'quotation' ? 'Quotation' : 'PI'} - ${statusFilter.status}`}
              {statusFilter.type && statusFilter.status && assignmentFilter && ' | '}
              {assignmentFilter && `Assignment - ${assignmentFilter === 'assigned' ? 'Assigned' : 'Unassigned'}`}
            </span>
            <button
              onClick={() => {
                setStatusFilter({ type: null, status: null });
                setAssignmentFilter(null);
                setFilteredCustomerIds(new Set());
              }}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>

      {/* Table - Full width when sidebar open */}
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        style={{
          marginRight: 0,
          marginLeft: 0,
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          borderTopRightRadius: showCustomerTimeline ? 0 : '0.5rem',
          borderBottomRightRadius: showCustomerTimeline ? 0 : '0.5rem',
          borderRight: showCustomerTimeline ? 'none' : '1px solid #e5e7eb'
        }}
      >
        <div
          className="overflow-x-auto"
          style={{
            marginRight: 0,
            paddingRight: 0,
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
        >
          <table className="w-full" style={{ width: '100%', tableLayout: 'auto', borderCollapse: 'collapse', margin: 0 }}>
             <thead className="bg-gray-50 border-b border-gray-200">
               <tr>
                 <th className="px-4 py-3">
                   <input
                     type="checkbox"
                     checked={isAllSelected && filteredLeads.length > 0}
                     onChange={toggleSelectAll}
                   />
                 </th>
                 {visibleColumns.customerId && (
                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[130px]">
                     <div className="flex items-center space-x-2">
                       <Hash className="w-4 h-4 text-purple-600" />
                       <span>Customer ID</span>
                     </div>
                   </th>
                 )}
                 {visibleColumns.customer && (
                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[220px]">
                     <div className="flex items-center space-x-2">
                       <User className="w-4 h-4 text-blue-600" />
                       <span>Customer</span>
                     </div>
                   </th>
                 )}
                 {visibleColumns.business && (
                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">
                     <div className="flex items-center space-x-2">
                       <Building className="w-4 h-4 text-indigo-600" />
                       <span>Business</span>
                     </div>
                   </th>
                 )}
                 {visibleColumns.address && (
                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">
                     <div className="flex items-center space-x-2">
                       <Building className="w-4 h-4 text-indigo-600" />
                       <span>Address</span>
                     </div>
                   </th>
                 )}
                 {visibleColumns.state && (
                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                     <div className="flex items-center space-x-2">
                       <Building className="w-4 h-4 text-green-600" />
                       <span>State</span>
                     </div>
                   </th>
                 )}
                 {visibleColumns.followUpStatus && (
                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                     <div className="flex items-center space-x-2">
                       <Clock className="w-4 h-4 text-amber-600" />
                       <span>Follow Up Status</span>
                     </div>
                   </th>
                 )}
                 {visibleColumns.salesStatus && (
                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                     <div className="flex items-center space-x-2">
                       <Clock className="w-4 h-4 text-amber-600" />
                       <span>Sales Status</span>
                     </div>
                   </th>
                 )}
                 {visibleColumns.assignedSalesperson && (
                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px]">
                     <div className="flex items-center space-x-2">
                       <User className="w-4 h-4 text-sky-600" />
                       <span>Assigned Salesperson</span>
                     </div>
                   </th>
                 )}
                 {visibleColumns.assignedTelecaller && (
                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px]">
                     <div className="flex items-center space-x-2">
                       <Phone className="w-4 h-4 text-cyan-600" />
                       <span>Assigned Telecaller</span>
                     </div>
                   </th>
                 )}
                 {visibleColumns.gstNo && (
                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                     <div className="flex items-center space-x-2">
                       <Hash className="w-4 h-4 text-indigo-600" />
                       <span>GST No</span>
                     </div>
                   </th>
                 )}
                 {visibleColumns.leadSource && (
                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">
                     <div className="flex items-center space-x-2">
                       <Shield className="w-4 h-4 text-orange-600" />
                       <span>Lead Source</span>
                     </div>
                   </th>
                 )}
                 {visibleColumns.productNames && (
                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[220px]">
                     <div className="flex items-center space-x-2">
                       <Tag className="w-4 h-4 text-pink-600" />
                       <span>Product Name</span>
                     </div>
                   </th>
                 )}
                 {visibleColumns.category && (
                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px]">
                     <div className="flex items-center space-x-2">
                       <Tag className="w-4 h-4 text-pink-600" />
                       <span>Category</span>
                     </div>
                   </th>
                 )}
                 {visibleColumns.createdAt && (
                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                     <div className="flex items-center space-x-2">
                       <Calendar className="w-4 h-4 text-purple-600" />
                       <span>Created</span>
                     </div>
                   </th>
                 )}
                 {visibleColumns.telecallerStatus && (
                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px]">
                     <div className="flex items-center space-x-2">
                       <CheckCircle className="w-4 h-4 text-green-600" />
                       <span>Telecaller Status</span>
                     </div>
                   </th>
                 )}
                 {visibleColumns.paymentStatus && (
                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px]">
                     <div className="flex items-center space-x-2">
                       <XCircle className="w-4 h-4 text-rose-600" />
                       <span>Payment Status</span>
                     </div>
                   </th>
                 )}
                 {visibleColumns.updatedAt && (
                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                     <div className="flex items-center space-x-2">
                       <Calendar className="w-4 h-4 text-purple-600" />
                       <span>Updated At</span>
                     </div>
                   </th>
                 )}
                 <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                   <div className="flex items-center justify-end space-x-2">
                     <button
                       onClick={() => setShowColumnFilter(!showColumnFilter)}
                       className="text-gray-600 hover:text-gray-900"
                       title="Column Filter"
                     >
                       <Settings className="w-4 h-4" />
                     </button>
                     <span>Actions</span>
                   </div>
                 </th>
               </tr>
             </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 2} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Loading leads...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 2} className="px-4 py-8 text-center text-gray-500">
                    No leads found. Add a new customer to get started.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedLeadIds.includes(lead.id)}
                      onChange={() => toggleSelectOne(lead.id)}
                      disabled={isLeadAssigned(lead)}
                      title={isLeadAssigned(lead) ? 'Already assigned' : ''}
                    />
                  </td>
                  {visibleColumns.customerId && (
                    <td className="px-4 py-4 text-sm text-gray-700">{lead.customerId}</td>
                  )}
                  {visibleColumns.customer && (
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{lead.customer}</div>
                        <div className="text-gray-600">{lead.phone}</div>
                        {lead.whatsapp && (
                          <a 
                            href={`https://wa.me/91${lead.whatsapp}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 text-xs flex items-center gap-1"
                          >
                            💬 WhatsApp
                          </a>
                        )}
                        {lead.email && (
                          <a 
                            href={`mailto:${lead.email}`}
                            className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                          >
                            📧 Email
                          </a>
                        )}
                      </div>
                    </td>
                  )}
                  {visibleColumns.business && (
                    <td className="px-4 py-4 text-sm text-gray-900">{lead.business}</td>
                  )}
                  {visibleColumns.address && (
                    <td className="px-4 py-4 text-sm text-gray-900">{lead.address}</td>
                  )}
                  {visibleColumns.state && (
                    <td className="px-4 py-4 text-sm text-gray-900">{lead.state}</td>
                  )}
                {visibleColumns.followUpStatus && (
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      {getStatusBadge(lead.followUpStatus || lead.connectedStatus || lead.telecallerStatus, 'telecaller')}
                      {lead.followUpRemark && (
                        <div className="text-xs text-gray-600 italic">"{lead.followUpRemark}"</div>
                      )}
                    </div>
                  </td>
                )}
                  {visibleColumns.salesStatus && (
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        {getStatusBadge(lead.salesStatus, 'sales')}
                        {lead.salesStatusRemark && (
                          <div className="text-xs text-gray-600 italic">"{lead.salesStatusRemark}"</div>
                        )}
                      </div>
                    </td>
                  )}
                  {visibleColumns.assignedSalesperson && (
                    <td className="px-4 py-4 text-sm text-gray-900">{isValueAssigned(lead.assignedSalesperson) ? lead.assignedSalesperson : 'Unassigned'}</td>
                  )}
                  {visibleColumns.assignedTelecaller && (
                    <td className="px-4 py-4 text-sm text-gray-900">{isValueAssigned(lead.assignedTelecaller) ? lead.assignedTelecaller : 'Unassigned'}</td>
                  )}
                  {visibleColumns.gstNo && (
                    <td className="px-4 py-4 text-sm text-gray-900">{lead.gstNo}</td>
                  )}
                  {visibleColumns.leadSource && (
                    <td className="px-4 py-4 text-sm text-gray-900">{lead.leadSource}</td>
                  )}
                  {visibleColumns.productNames && (
                    <td className="px-4 py-4 text-sm text-gray-900">{lead.productNamesText}</td>
                  )}
                  {visibleColumns.category && (
                    <td className="px-4 py-4 text-sm text-gray-900">{lead.category}</td>
                  )}
                  {visibleColumns.createdAt && (
                    <td className="px-4 py-4 text-sm text-gray-900">{lead.createdAt}</td>
                  )}
                  {visibleColumns.telecallerStatus && (
                    <td className="px-4 py-4">
                      {getStatusBadge(lead.telecallerStatus, 'telecaller')}
                    </td>
                  )}
                  {visibleColumns.paymentStatus && (
                    <td className="px-4 py-4">
                      {getStatusBadge(lead.paymentStatus, 'payment')}
                    </td>
                  )}
                  {visibleColumns.updatedAt && (
                    <td className="px-4 py-4 text-sm text-gray-900">{lead.updated_at || lead.createdAt}</td>
                  )}
                  <td className="px-4 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(lead)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Lead"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setTimelineLead(lead);
                          setShowCustomerTimeline(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="View Customer Timeline"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {isLeadAssigned(lead) ? (
                        <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded" title="Already assigned">
                          Assigned
                        </span>
                      ) : (
                        <button
                          onClick={() => openAssignModal(lead)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Assign Lead"
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setPage(1);
                setLimit(Number(e.target.value));
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>
              {total === 0 ? '0-0' : `${(page - 1) * limit + 1} - ${Math.min(page * limit, total)}`} of {total}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 border rounded ${page === 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">Page {page} of {Math.max(1, Math.ceil(total / limit) || 1)}</span>
            <button
              onClick={() => setPage((p) => (p < Math.ceil(total / limit) ? p + 1 : p))}
              disabled={page >= Math.ceil(total / limit) || total === 0}
              className={`px-3 py-1 border rounded ${(page >= Math.ceil(total / limit) || total === 0) ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Column Filter Modal */}
      {showColumnFilter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Column Filter</h2>
              <button onClick={() => setShowColumnFilter(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Show/Hide Columns</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={resetColumns}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Reset
                    </button>
                    <button
                      onClick={showAllColumns}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Show All
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {Object.entries(visibleColumns).map(([key, value]) => {
                    const columnLabels = {
                      customerId: 'Customer ID',
                      customer: 'Customer',
                      business: 'Business',
                      address: 'Address',
                      state: 'State',
                      followUpStatus: 'Follow Up Status',
                      salesStatus: 'Sales Status',
                      assignedSalesperson: 'Assigned Salesperson',
                      assignedTelecaller: 'Assigned Telecaller',
                      gstNo: 'GST No',
                      leadSource: 'Lead Source',
                      productNames: 'Product Name',
                      category: 'Category',
                      createdAt: 'Created',
                      telecallerStatus: 'Telecaller Status',
                      paymentStatus: 'Payment Status',
                      updatedAt: 'Updated At'
                    };
                    
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <label className="text-sm text-gray-700">{columnLabels[key]}</label>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => toggleColumn(key)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowColumnFilter(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input for CSV import */}
      <input
        ref={importFileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Import Popup Modal */}
      {showImportPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Import Leads</h2>
              <button onClick={() => setShowImportPopup(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">Upload a CSV file with lead data. Make sure the format matches the template.</p>
              
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={downloadCSVTemplate}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Template</span>
                </button>
              </div>
              
              <div
                onClick={() => importFileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Click to upload CSV file</p>
                <p className="text-gray-400 text-sm">or drag and drop</p>
              </div>
              
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowImportPopup(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Drawer (Right Sidebar) */}
      {showPreviewModal && previewLead && (
        <div className="fixed inset-0 bg-black/50 flex z-50">
          <div className="bg-white h-full w-full max-w-md ml-auto shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900">Lead Details - {previewLead.customerId}</h2>
              <button onClick={() => setShowPreviewModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {/* Drawer Content - show all sections stacked */}
            <div className="px-4 md:px-5 py-4 space-y-6">
              {/* Overview */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Customer Details</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Customer Name</label>
                    <p className="text-gray-900 font-semibold">{previewLead.customer}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Business</label>
                    <p className="text-gray-900 font-semibold">{previewLead.business || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Address</label>
                    <p className="text-gray-900 font-semibold">{previewLead.address || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">State</label>
                    <p className="text-gray-900 font-semibold">{previewLead.state || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Sales Status</label>
                    <p className="text-gray-900 font-semibold">{previewLead.salesStatus}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Follow Up Status</label>
                    <p className="text-gray-900 font-semibold">{previewLead.followUpStatus || previewLead.telecallerStatus || 'N/A'}</p>
                    {previewLead.followUpRemark && (
                      <p className="text-xs text-gray-600 italic mt-0.5">"{previewLead.followUpRemark}"</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Assigned Salesperson</label>
                    <p className="text-gray-900 font-semibold">{isValueAssigned(previewLead.assignedSalesperson) ? previewLead.assignedSalesperson : 'Unassigned'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Assigned Telecaller</label>
                    <p className="text-gray-900 font-semibold">{isValueAssigned(previewLead.assignedTelecaller) ? previewLead.assignedTelecaller : 'Unassigned'}</p>
                  </div>
                </div>
              </div>

              {/* Payment & Quotation */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-900">Payment & Quotation</h3>
                  {loadingQuotations ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">Loading quotations...</span>
                        </div>
                  ) : quotations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No quotations found for this lead</p>
                      <p className="text-xs text-gray-400 mt-1">Quotations will appear here once created</p>
                        </div>
                  ) : (
                    quotations.map((quotation) => {
                      const getStatusColor = (status) => {
                        switch (status) {
                          case 'pending_verification':
                          case 'pending':
                            return 'text-yellow-600';
                          case 'approved':
                            return 'text-green-600';
                          case 'rejected':
                            return 'text-red-600';
                          case 'sent':
                            return 'text-blue-600';
                          case 'accepted':
                            return 'text-green-600';
                          default:
                            return 'text-gray-600';
                        }
                      };

                      const getStatusLabel = (status) => {
                        switch (status) {
                          case 'pending_verification':
                          case 'pending':
                            return 'Pending Verification';
                          case 'approved':
                            return 'Approved';
                          case 'rejected':
                            return 'Rejected';
                          case 'sent':
                            return 'Sent';
                          case 'accepted':
                            return 'Accepted';
                          default:
                            return status;
                        }
                      };

                      const formatDate = (dateString) => {
                        if (!dateString) return 'N/A';
                        return new Date(dateString).toLocaleDateString();
                      };

                      const formatCurrency = (amount) => {
                        return new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(amount);
                      };

                      return (
                        <div key={quotation.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h3 className="text-base font-semibold text-gray-900 mb-2">
                            {getStatusLabel(quotation.status)} Quotation
                          </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                                <p className="font-medium text-gray-900">Quotation #{quotation.quotation_number}</p>
                                <p className="text-xs text-gray-600">
                                  {quotation.customer_name} - {quotation.customer_business}
                                </p>
                        </div>
                        <div className="text-right">
                                <p className={`text-sm font-semibold ${getStatusColor(quotation.status)}`}>
                                  {formatCurrency(quotation.total_amount)} - {getStatusLabel(quotation.status)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Valid Until: {formatDate(quotation.valid_until)}
                                </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                              <p className="text-xs text-gray-600">
                                Prepared by: {quotation.created_by}
                              </p>
                        <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleViewQuotation(quotation.id)}
                                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs"
                                >
                            View Quotation
                          </button>
                                <button 
                                  onClick={() => handleDownloadPDF(quotation.id)}
                                  className="px-3 py-1.5 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-xs"
                                >
                            Download PDF
                          </button>
                                {(['pending_verification', 'pending'].includes(quotation.status)) && (
                                  <>
                                    <button 
                                      onClick={() => handleApproveQuotation(quotation.id)}
                                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs"
                                    >
                                      Approve
                                    </button>
                                    <button 
                                      onClick={() => handleRejectQuotation(quotation.id)}
                                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                        </div>
                      </div>
                    </div>

                    {/* PIs for this quotation */}
                    {(() => {
                      const quotationPIs = proformaInvoices.filter(pi => pi.quotation_id === quotation.id);
                      if (quotationPIs.length === 0) return null;

                      return (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Proforma Invoices:</p>
                          <div className="space-y-2">
                            {quotationPIs.map((pi) => (
                              <div key={pi.id} className="bg-gray-50 border border-gray-200 rounded-md p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-purple-600" />
                                    <div>
                                      <p className="text-xs font-semibold text-gray-900">{pi.pi_number}</p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(pi.created_at).toLocaleDateString()} • ₹{Number(pi.total_amount || 0).toLocaleString()}
                                      </p>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                      pi.status === 'approved' ? 'bg-green-100 text-green-800' :
                                      pi.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                      pi.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-blue-100 text-blue-800'
                                    }`}>
                                      {pi.status === 'approved' ? '✅ Approved' :
                                       pi.status === 'rejected' ? '❌ Rejected' :
                                       pi.status === 'pending_approval' ? '⏳ Pending' :
                                       '📄 ' + (pi.status || 'Draft')}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleViewPI(pi.id)}
                                      className="text-blue-600 text-xs hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50"
                                    >
                                      View
                                    </button>
                                    {pi.status === 'pending_approval' && (
                                      <>
                                        <button
                                          onClick={() => handleApprovePI(pi.id)}
                                          className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                                        >
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => handleRejectPI(pi.id)}
                                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                                        >
                                          Reject
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                      );
                    })
                  )}
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 md:px-8 py-4 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Import Leads from CSV</h2>
                <p className="text-sm text-gray-600">Review the data before importing</p>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Found {importPreview.length} records to import. Please review the data below:
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Customer Name</th>
                      <th className="px-3 py-2 text-left">Mobile</th>
                      <th className="px-3 py-2 text-left">Email</th>
                      <th className="px-3 py-2 text-left">Address</th>
                      <th className="px-3 py-2 text-left">Business</th>
                      <th className="px-3 py-2 text-left">Lead Source</th>
                      <th className="px-3 py-2 text-left">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importPreview.slice(0, 10).map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-3 py-2">{row['Customer Name'] || '-'}</td>
                        <td className="px-3 py-2">{row['Mobile Number'] || '-'}</td>
                        <td className="px-3 py-2">{row['Email'] || '-'}</td>
                        <td className="px-3 py-2">{row['Address'] || '-'}</td>
                        <td className="px-3 py-2">{row['Business Name'] || '-'}</td>
                        <td className="px-3 py-2">{row['Lead Source'] || '-'}</td>
                        <td className="px-3 py-2">{row['Business Category'] || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {importPreview.length > 10 && (
                  <p className="text-sm text-gray-500 mt-2">
                    ... and {importPreview.length - 10} more records
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
              <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                  onClick={handleImportLeads}
                  disabled={importing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {importing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Importing...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Import {importPreview.length} Leads</span>
                    </>
                  )}
              </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <AddCustomerModal
          onClose={() => setShowAddCustomer(false)}
          onSave={handleCustomerSave}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Lead</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <input
                    type="text"
                    value={editFormData.customer}
                    onChange={(e) => setEditFormData({...editFormData, customer: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Business</label>
                   <input
                     type="text"
                     value={editFormData.business}
                     onChange={(e) => setEditFormData({...editFormData, business: e.target.value})}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                   <input
                     type="text"
                     value={editFormData.address}
                     onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">GST No</label>
                  <input
                    type="text"
                    value={editFormData.gstNo}
                    onChange={(e) => setEditFormData({...editFormData, gstNo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
                  <input
                    type="text"
                    value={editFormData.leadSource}
                    onChange={(e) => setEditFormData({...editFormData, leadSource: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={editFormData.productNames}
                    onChange={(e) => setEditFormData({...editFormData, productNames: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sales Status</label>
                  <select
                    value={editFormData.salesStatus}
                    onChange={(e) => setEditFormData({...editFormData, salesStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Salesperson</label>
                  <select
                    value={editFormData.assignedSalesperson}
                    onChange={(e) => setEditFormData({...editFormData, assignedSalesperson: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{loadingUsers ? 'Loading...' : 'Select username'}</option>
                    {usersError && <option value="" disabled>{usersError}</option>}
                    {usernames.map(name => (
                      <option key={`sp-${name}`} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Telecaller</label>
                  <select
                    value={editFormData.assignedTelecaller}
                    onChange={(e) => setEditFormData({...editFormData, assignedTelecaller: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{loadingUsers ? 'Loading...' : 'Select username'}</option>
                    {usersError && <option value="" disabled>{usersError}</option>}
                    {usernames.map(name => (
                      <option key={`tc-${name}`} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telecaller Status</label>
                  <select
                    value={editFormData.telecallerStatus}
                    onChange={(e) => setEditFormData({...editFormData, telecallerStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select
                    value={editFormData.paymentStatus}
                    onChange={(e) => setEditFormData({...editFormData, paymentStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={editFormData.state}
                    onChange={(e) => setEditFormData({...editFormData, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal (supports single or bulk) */}
      {showAssignModal && (assigningLead || selectedLeadIds.length > 0) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {assigningLead ? `Assign Lead - ${assigningLead.customer}` : `Assign ${selectedLeadIds.length} Selected Leads`}
              </h2>
              <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salesperson (username)</label>
                <select
                  value={assignForm.salesperson}
                  onChange={(e) => setAssignForm({ ...assignForm, salesperson: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">{loadingUsers ? 'Loading...' : 'Unassigned'}</option>
                  {usersError && <option value="" disabled>{usersError}</option>}
                  {usernames.map((name) => (
                    <option key={`sp-${name}`} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telecaller (optional)</label>
                <select
                  value={assignForm.telecaller}
                  onChange={(e) => setAssignForm({ ...assignForm, telecaller: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">{loadingUsers ? 'Loading...' : 'Unassigned'}</option>
                  {usersError && <option value="" disabled>{usersError}</option>}
                  {usernames.map((name) => (
                    <option key={`tc-${name}`} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button onClick={() => setShowAssignModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
              <button
                onClick={async () => {
                  try {
                    const payload = {
                      assignedSalesperson: assignForm.salesperson || null,
                      assignedTelecaller: assignForm.telecaller || null,
                    };
                    // Single lead assignment
                    if (assigningLead) {
                      const leadId = assigningLead.id;
                      await departmentHeadService.updateLead(leadId, payload);
                      // Update UI optimistically
                      setLeadsData(prev => prev.map(l =>
                        l.id === leadId
                          ? { ...l, assignedSalesperson: payload.assignedSalesperson || '', assignedTelecaller: payload.assignedTelecaller || '' }
                          : l
                      ));
                      toastManager.success('Lead assigned successfully');
                      setAssigningLead(null);
                    } else {
                      // Batch update multiple leads - single API call to avoid rate limiting
                      await departmentHeadService.batchUpdateLeads(selectedLeadIds, payload);
                      // Update UI optimistically
                      setLeadsData(prev => prev.map(l => selectedLeadIds.includes(l.id)
                        ? { ...l, assignedSalesperson: payload.assignedSalesperson || '', assignedTelecaller: payload.assignedTelecaller || '' }
                        : l
                      ));
                      toastManager.success(`Assigned ${selectedLeadIds.length} leads successfully`);
                      setSelectedLeadIds([]);
                      setIsAllSelected(false);
                    }

                    // Refresh from server to ensure latest values
                    try {
                      const params = { page, limit };
                      if (searchTerm && searchTerm.trim() !== '') params.search = searchTerm.trim();
                      const response = await departmentHeadService.getAllLeads(params);
                      if (response && response.data) {
                        const transformedData = transformApiData(response.data);
                        setLeadsData(transformedData);
                        if (response.pagination) setTotal(Number(response.pagination.total) || 0);
                      }
                    } catch (e) {}
                    setShowAssignModal(false);
                  } catch (err) {
                    apiErrorHandler.handleError(err, 'assign lead');
                  }
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Details Modal */}
      {showQuotationModal && selectedQuotation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Quotation Details - {selectedQuotation.quotation_number}
              </h2>
              <button 
                onClick={() => setShowQuotationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              {/* Use the exact same QuotationPreview component as salesperson */}
              <QuotationPreview
                data={{
                  quotationNumber: selectedQuotation.quotation_number,
                  quotationDate: selectedQuotation.quotation_date,
                  validUpto: selectedQuotation.valid_until,
                  voucherNumber: `VOUCH-${Math.floor(1000 + Math.random() * 9000)}`,
                  billTo: {
                    business: selectedQuotation.customer_name,
                    address: selectedQuotation.customer_address,
                    phone: selectedQuotation.customer_phone,
                    gstNo: selectedQuotation.customer_gst_no,
                    state: selectedQuotation.customer_state
                  },
                  items: selectedQuotation.items?.map(item => ({
                    productName: item.product_name,
                    description: item.description,
                    quantity: item.quantity,
                    unit: item.unit || 'Nos',
                    buyerRate: item.unit_price,
                    unitPrice: item.unit_price,
                    amount: item.taxable_amount,
                    total: item.total_amount,
                    hsn: item.hsn_code,
                    gstRate: item.gst_rate
                  })),
                  subtotal: parseFloat(selectedQuotation.subtotal),
                  taxAmount: parseFloat(selectedQuotation.tax_amount),
                  total: parseFloat(selectedQuotation.total_amount),
                  selectedBranch: 'ANODE'
                }}
                companyBranches={companyBranches}
                user={user}
              />
            </div>
            
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setShowQuotationModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadPDF(selectedQuotation.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PI Preview Modal */}
      <PIPreviewModal
        open={showPIPreview}
        onClose={() => {
          setShowPIPreview(false);
          setPiPreviewData(null);
        }}
        piPreviewData={piPreviewData}
        selectedBranch={selectedPIBranch}
        companyBranches={companyBranches}
        approvedQuotationId={null}
        viewingCustomerId={null}
        onPICreated={null}
      />

      {/* Customer Timeline Panel - Fixed position, no gap */}
      {showCustomerTimeline && timelineLead && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: 'fit-content', maxWidth: '349px', minWidth: '244px', height: '100vh', zIndex: 50, marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0, borderLeft: '1px solid #e5e7eb' }}>
          <CustomerTimeline
            lead={timelineLead}
            onClose={() => {
              setShowCustomerTimeline(false);
              setTimelineLead(null);
            }}
            onQuotationView={(quotation) => {
              if (quotation) {
                setSelectedQuotation(quotation);
                setShowQuotationModal(true);
              } else {
                toastManager.error('Quotation data is missing');
              }
            }}
            onPIView={(pi) => {
              setPiPreviewData(pi);
              setShowPIPreview(true);
            }}
            setSelectedQuotation={setSelectedQuotation}
            setShowQuotationModal={setShowQuotationModal}
            toastManager={toastManager}
          />
        </div>
      )}

    </div>
  );
};

export default LeadsSimplified;
