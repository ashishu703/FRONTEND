import React, { useEffect, useMemo, useState } from 'react';
import { X, CheckCircle, FileText, Receipt, CreditCard, UserPlus } from 'lucide-react';
import customerTimelineService from '../services/CustomerTimelineService';
import DateFormatter from '../utils/DateFormatter';


const CustomerTimeline = ({
  lead,
  onClose,
  onReassign,
  onQuotationView,
  onApproveQuotation,
  onRejectQuotation,
  onPIView,
  onApprovePI,
  onRejectPI
}) => {
  if (!lead) return null;

  const [history, setHistory] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [pisByQuotationId, setPisByQuotationId] = useState({});
  const [payments, setPayments] = useState([]);
  const [transferInfo, setTransferInfo] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        if (!lead?.id) return;
        const data = await customerTimelineService.getTimelineData(lead.id);
        if (cancelled) return;

        setHistory(data.history || []);
        setQuotations(data.quotations || []);
        setPisByQuotationId(data.pisByQuotationId || {});
        setPayments(data.payments || []);
        setTransferInfo(data.transferInfo || null);
      } catch (e) {
        console.warn('Failed to load customer timeline', e);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [lead?.id, refreshKey]);

  const groupedHistory = useMemo(() => {
    const items = [...history].sort(
      (a, b) =>
        new Date(a.created_at || a.follow_up_date || 0) -
        new Date(b.created_at || b.follow_up_date || 0)
    );
    const groups = {};
    items.forEach((h) => {
      const dateInput = h.follow_up_date || h.created_at || Date.now();
      const key = DateFormatter.formatDate(dateInput);
      if (!groups[key]) groups[key] = [];
      groups[key].push(h);
    });
    return groups;
  }, [history]);

  const allQuotations = Array.isArray(quotations)
    ? [...quotations].sort(
        (a, b) =>
          new Date(a.quotation_date || a.created_at || 0) -
          new Date(b.quotation_date || b.created_at || 0)
      )
    : [];

  const createdDateLabel = DateFormatter.formatDate(lead.created_at || lead.createdAt);

  const getPaymentBadgeClasses = (summary) => {
    const status = (summary?.approvalStatus || '').toLowerCase();
    if (status === 'completed' || status === 'approved')
      return 'bg-green-100 text-green-800';
    if (status === 'partial') return 'bg-yellow-100 text-yellow-800';
    if (status === 'pending approval') return 'bg-yellow-100 text-yellow-800';
    if (status === 'rejected') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div
      className="fixed top-0 right-0 h-screen z-50"
      style={{ width: 'fit-content', maxWidth: 349, minWidth: 244 }}
    >
      <div className="bg-white h-screen flex flex-col shadow-xl border-l border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 className="text-sm font-semibold text-gray-900">
            Customer Timeline
          </h3>
          <div className="flex items-center gap-2">
            {onReassign && (
              <button
                type="button"
                onClick={() => onReassign(lead)}
                className="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50"
                title="Reassign Lead"
              >
                <UserPlus className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            maxHeight: 'calc(100vh - 50px)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            padding: 4
          }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          
          {/* Customer details */}
          <div style={{ marginBottom: 4 }}>
            <h4
              className="text-xs font-bold text-gray-900"
              style={{ marginBottom: 2 }}
            >
              Customer Details
            </h4>
            <div className="text-[11px]" style={{ gap: 1 }}>
              <div>
                <span className="font-medium text-gray-600">
                  Customer Name:
                </span>
                <span className="ml-1.5 text-gray-900">
                  {lead.customer || lead.name || 'N/A'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">
                  Business Name:
                </span>
                <span className="ml-1.5 text-gray-900">
                  {lead.business || 'N/A'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Contact No:</span>
                <span className="ml-1.5 text-gray-900">
                  {lead.phone || 'N/A'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">
                  Email Address:
                </span>
                <span className="ml-1.5 text-gray-900">
                  {lead.email || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline: created + follow‑ups */}
          <div style={{ marginTop: 4 }}>
            <h4
              className="text-xs font-bold text-gray-900"
              style={{ marginBottom: 2 }}
            >
              Timeline
            </h4>

            {/* Created chip */}
            <div className="flex justify-center" style={{ marginTop: 2 }}>
              <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                {createdDateLabel}
              </span>
            </div>

            {/* Created card */}
            <div className="flex justify-start" style={{ marginTop: 2 }}>
              <div className="max-w-[85%] rounded-lg rounded-tl-none bg-green-50 border border-green-200 p-1.5">
                <div
                  className="flex items-center gap-1.5"
                  style={{ marginBottom: 1 }}
                >
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="text-[11px] font-medium text-gray-900">
                    Customer Created
                  </span>
                  <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-green-100 text-green-800">
                    COMPLETED
                  </span>
                </div>
                <div className="text-[10px] text-gray-600">
                  Lead ID: LD-{lead.id}
                </div>
              </div>
            </div>

            {/* Transfer information */}
            {transferInfo && transferInfo.transferredAt && (
              <>
                <div className="flex justify-center" style={{ marginTop: 4 }}>
                  <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    {DateFormatter.formatDate(transferInfo.transferredAt)}
                  </span>
                </div>
                <div className="flex justify-start" style={{ marginTop: 2 }}>
                  <div className="max-w-[85%] rounded-lg rounded-tl-none bg-purple-50 border border-purple-200 p-1.5">
                    <div
                      className="flex items-center gap-1.5"
                      style={{ marginBottom: 1 }}
                    >
                      <UserPlus className="h-3 w-3 text-purple-600" />
                      <span className="text-[11px] font-medium text-gray-900">
                        Lead Transferred
                      </span>
                      <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                        TRANSFERRED
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-600 space-y-0.5">
                      {transferInfo.transferredFrom && (
                        <div>
                          <span className="font-medium">From:</span> {transferInfo.transferredFrom}
                        </div>
                      )}
                      {transferInfo.transferredTo && (
                        <div>
                          <span className="font-medium">To:</span> {transferInfo.transferredTo}
                        </div>
                      )}
                      {transferInfo.transferReason && (
                        <div className="mt-1 italic">
                          "{transferInfo.transferReason}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Follow‑up history grouped by date */}
            {Object.keys(groupedHistory)
              .sort((a, b) => new Date(a) - new Date(b))
              .map((dateKey) => (
                <div key={dateKey} style={{ marginTop: 4 }}>
                <div className="flex justify-center">
                    <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      {dateKey}
                    </span>
                </div>
                  <div style={{ marginTop: 2, gap: 2 }}>
                  {groupedHistory[dateKey].map((h, idx) => {
                      const isRightAligned =
                        h.sales_status &&
                        ['win', 'converted'].includes(
                          String(h.sales_status).toLowerCase()
                        );
                    return (
                        <div
                          key={`${h.id || idx}`}
                          className={
                            isRightAligned ? 'flex justify-end' : 'flex justify-start'
                          }
                        >
                          <div
                            className={
                              isRightAligned
                                ? 'max-w-[85%] rounded-lg rounded-tr-none bg-blue-50 border border-blue-200 p-1.5'
                                : 'max-w-[85%] rounded-lg rounded-tl-none bg-white border border-gray-200 p-1.5'
                            }
                            style={{ marginBottom: 2 }}
                          >
                            <div
                              className="flex items-center gap-1.5"
                              style={{ marginBottom: 1 }}
                            >
                              <span className="text-[10px] font-medium text-gray-700">
                                Follow Up
                              </span>
                            {h.sales_status && (
                                <span className="ml-auto px-1.5 py-0.5 text-[9px] font-medium rounded bg-yellow-100 text-yellow-800">
                                  {String(h.sales_status).toUpperCase()}
                                </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-800">
                              <div style={{ marginBottom: 1 }}>
                                <span className="font-medium">Status:</span>{' '}
                                {h.follow_up_status || '—'}
                              </div>
                            {h.follow_up_remark && (
                                <div style={{ marginBottom: 1 }}>
                                  <span className="font-medium">Remark:</span>{' '}
                                  {h.follow_up_remark}
                                </div>
                              )}
                              {(h.follow_up_date ||
                                h.follow_up_time ||
                                h.created_at) && (
                                <div className="text-[9px] text-gray-500">
                                  {customerTimelineService.formatIndianDateTime(
                                    h.follow_up_date,
                                    h.follow_up_time,
                                    h.created_at
                                  )}
                                </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quotations & PIs - show all quotations (PIs optional) */}
            {allQuotations.length > 0 && (
                <div style={{ marginTop: 4 }}>
                  <div className="flex justify-center">
                  <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    Quotations &amp; PIs
                  </span>
                </div>
                  <div className="flex justify-start" style={{ marginTop: 2 }}>
                  <div className="max-w-[85%] rounded-lg rounded-tl-none bg-yellow-50 border border-yellow-200 p-1.5">
                      <div
                        className="flex items-center gap-1.5"
                        style={{ marginBottom: 2 }}
                      >
                      <FileText className="h-3 w-3 text-yellow-600" />
                        <span className="text-[11px] font-medium text-gray-900">
                          Quotation History
                        </span>
                    </div>
                    <div className="space-y-1 text-[10px] text-gray-800">
                        {allQuotations.map((q) => {
                        const pis = pisByQuotationId[q.id] || [];
                        const status = String(q.status || 'PENDING').toLowerCase();
                        const statusClass =
                          status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : q.status
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800';

                        return (
                          <div
                            key={q.id}
                            className="border border-yellow-100 rounded px-1 py-0.5 bg-white"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium">
                                {q.quotation_number ||
                                  `QT-${String(q.id).slice(-4)}`}
                              </span>
                              <span className="text-[9px] text-gray-500">
                                {q.quotation_date ? DateFormatter.formatDate(q.quotation_date) : ''}
                              </span>
                              <span
                                className={`ml-auto px-1.5 py-0.5 text-[9px] font-medium rounded ${statusClass}`}
                              >
                                {(q.status || 'PENDING').toUpperCase()}
                              </span>
                            </div>

                            {/* Quotation actions */}
                            <div className="mt-0.5 flex flex-wrap gap-1">
                              {onQuotationView && (
                                <button
                                  type="button"
                                  onClick={() => onQuotationView(q)}
                                  className="px-1.5 py-0.5 text-[9px] rounded border border-blue-200 text-blue-700 hover:bg-blue-50"
                                >
                                  View
                                </button>
                              )}
                              {onApproveQuotation &&
                                (status === 'pending' ||
                                  status === 'pending_verification' ||
                                  status === 'pending_approval') && (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      await onApproveQuotation(q);
                                      setRefreshKey((k) => k + 1);
                                    }}
                                    className="px-1.5 py-0.5 text-[9px] rounded border border-green-200 text-green-700 hover:bg-green-50"
                                  >
                                    Approve
                                  </button>
                                )}
                              {onRejectQuotation &&
                                (status === 'pending' ||
                                  status === 'pending_verification' ||
                                  status === 'pending_approval') && (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      await onRejectQuotation(q);
                                      setRefreshKey((k) => k + 1);
                                    }}
                                    className="px-1.5 py-0.5 text-[9px] rounded border border-red-200 text-red-700 hover:bg-red-50"
                                  >
                                    Reject
                                  </button>
                                )}
                            </div>

                            {pis.length > 0 && (
                              <div className="mt-0.5 text-[9px] text-gray-700 flex flex-wrap gap-1">
                                {pis.map((pi) => {
                                  const piStatus = String(
                                    pi.status || 'PENDING'
                                  ).toLowerCase();
                                  const piClass =
                                    piStatus === 'approved'
                                      ? 'bg-green-100 text-green-800'
                                      : piStatus === 'pending_approval'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : pi.status
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800';
                                  return (
                                    <span
                                      key={pi.id}
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-orange-50 border border-orange-200"
                                    >
                                      <Receipt className="h-3 w-3 text-orange-600" />
                                      <span>
                                        {pi.pi_number ||
                                          `PI-${String(pi.id).slice(-4)}`}
                                      </span>
                                      <span
                                        className={`px-1 py-0.5 rounded text-[8px] ${piClass}`}
                                      >
                                        {(pi.status || 'PENDING').toUpperCase()}
                                      </span>

                                      {/* PI actions */}
                                      <span className="inline-flex gap-1 ml-1">
                                        {onPIView && (
                                          <button
                                            type="button"
                                            onClick={() => onPIView(pi)}
                                            className="px-1 py-0.5 text-[8px] rounded border border-blue-200 text-blue-700 hover:bg-blue-50 bg-white"
                                          >
                                            View
                                          </button>
                                        )}
                                        {onApprovePI &&
                                          (piStatus === 'pending' ||
                                            piStatus === 'pending_approval' ||
                                            piStatus === 'sent_for_approval') && (
                                            <button
                                              type="button"
                                              onClick={async () => {
                                                await onApprovePI(pi);
                                                setRefreshKey((k) => k + 1);
                                              }}
                                              className="px-1 py-0.5 text-[8px] rounded border border-green-200 text-green-700 hover:bg-green-50 bg-white"
                                            >
                                              Approve
                                            </button>
                                          )}
                                        {onRejectPI &&
                                          (piStatus === 'pending' ||
                                            piStatus === 'pending_approval' ||
                                            piStatus === 'sent_for_approval') && (
                                            <button
                                              type="button"
                                              onClick={async () => {
                                                await onRejectPI(pi);
                                                setRefreshKey((k) => k + 1);
                                              }}
                                              className="px-1 py-0.5 text-[8px] rounded border border-red-200 text-red-700 hover:bg-red-50 bg-white"
                                            >
                                              Reject
                                            </button>
                                          )}
                                      </span>
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment History by PI */}
            {payments.length > 0 && (
              <div style={{ marginTop: 4 }}>
                <div className="flex justify-center">
                    <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    Payment History
                    </span>
                  </div>
                <div className="flex justify-start" style={{ marginTop: 2 }}>
                  <div className="max-w-[85%] rounded-lg rounded-tl-none bg-blue-50 border border-blue-200 p-1.5">
                    <div
                      className="flex items-center gap-1.5"
                      style={{ marginBottom: 2 }}
                    >
                      <CreditCard className="h-3 w-3 text-blue-600" />
                      <span className="text-[11px] font-medium text-gray-900">
                        Payments by PI
                        </span>
                      </div>
                    <div className="space-y-1 text-[10px] text-gray-800">
                      {payments
                        .sort((a, b) => 
                          new Date(b.payment_date || b.created_at || 0) - 
                          new Date(a.payment_date || a.created_at || 0)
                        )
                        .map((payment) => {
                          const approvalStatus = (payment.approval_status || 'pending').toLowerCase();
                          const isApproved = approvalStatus === 'approved';
                          const isPending = approvalStatus === 'pending';
                          const isRejected = approvalStatus === 'rejected';
                          
                          // Determine payment type
                          const piTotal = payment.total_quotation_amount || 0;
                          const paidAmount = Number(payment.installment_amount || 0);
                          const remainingAfter = Number(payment.remaining_amount || 0);
                          let paymentType = 'Partial';
                          if (remainingAfter === 0 && paidAmount > 0) {
                            paymentType = 'Full';
                          } else if (payment.installment_number === 1 && paidAmount > 0) {
                            paymentType = 'Advance';
                          }

                          const statusClass = isApproved
                            ? 'bg-green-100 text-green-800'
                            : isRejected
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800';

                          return (
                            <div
                              key={payment.id || payment.payment_reference}
                              className="border border-blue-100 rounded px-1 py-0.5 bg-white"
                            >
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-medium">
                                  {payment.quotation_number || 'QT-N/A'}
                                </span>
                                {payment.pi_number && (
                                  <span className="text-[9px] text-gray-600">
                                    • {payment.pi_number}
                                  </span>
                                )}
                                <span className="text-[9px] text-gray-500">
                                  {payment.payment_date ? DateFormatter.formatDate(payment.payment_date) : ''}
                                </span>
                                <span
                                  className={`ml-auto px-1.5 py-0.5 text-[9px] font-medium rounded ${statusClass}`}
                                >
                                  {approvalStatus.toUpperCase()}
                                </span>
                              </div>
                              <div className="mt-0.5 text-[9px] text-gray-700">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    ₹{Number(paidAmount).toLocaleString('en-IN')}
                                  </span>
                                  <span className="text-gray-500">•</span>
                                  <span className={paymentType === 'Full' ? 'text-green-700' : paymentType === 'Advance' ? 'text-blue-700' : 'text-orange-700'}>
                                    {paymentType}
                                  </span>
                                  {payment.payment_method && (
                                    <>
                                      <span className="text-gray-500">•</span>
                                      <span className="text-gray-600">
                                        {payment.payment_method}
                                      </span>
                                    </>
                                  )}
                                </div>
                                {payment.installment_number && (
                                  <div className="text-[8px] text-gray-500 mt-0.5">
                                    Installment #{payment.installment_number}
                      </div>
                    )}
                  </div>
                </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTimeline;


