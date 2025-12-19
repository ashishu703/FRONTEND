import React from 'react'
import { X, Eye, Package, Send, Trash2, FileText, Receipt, Pencil } from 'lucide-react'
import { QuotationHelper } from '../../utils/QuotationHelper'
import Toast from '../../utils/Toast'

export default function CustomerDetailSidebar({ 
  customer, onClose, onEdit, onQuotation, quotations, 
  onViewQuotation, onEditQuotation, onSendQuotation, onDeleteQuotation, 
  onCreatePI, quotationPIs, piHook, onViewPI 
}) {
  if (!customer) return null

  const isApprovedQuotation = QuotationHelper.isApproved
  const isPaymentCompleted = QuotationHelper.isPaymentCompleted

  // Fetch PIs for quotations when component mounts or quotations change
  React.useEffect(() => {
    if (quotations && quotations.length > 0 && piHook?.fetchPIsForQuotation) {
      quotations.forEach(q => {
        if (q.id && !quotationPIs?.[q.id]) {
          piHook.fetchPIsForQuotation(q.id)
        }
      })
    }
  }, [quotations?.length, customer?.id])

  const getPIsForQuotation = (quotationId) => {
    return quotationPIs?.[quotationId] || []
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Customer Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Customer Info */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Customer Information</h3>
            <div className="grid grid-cols-1 gap-1.5 text-sm">
              <div className="flex">
                <span className="font-medium text-gray-600 w-24 text-xs">Name:</span>
                <span className="text-gray-900 text-xs">{customer.name}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-24 text-xs">Phone:</span>
                <span className="text-gray-900 text-xs">{customer.phone}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-24 text-xs">Email:</span>
                <span className="text-gray-900 text-xs">{customer.email}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-24 text-xs">Business:</span>
                <span className="text-gray-900 text-xs">{customer.business}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-24 text-xs">Address:</span>
                <span className="text-gray-900 text-xs">{customer.address}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-24 text-xs">State:</span>
                <span className="text-gray-900 text-xs">{customer.state}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-24 text-xs">GST No:</span>
                <span className="text-gray-900 text-xs">{customer.gstNo}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-24 text-xs">Type:</span>
                <span className="text-gray-900 text-xs">{customer.customerType}</span>
              </div>
            </div>
          </div>
          
          {/* Quotations Section */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Quotations</h3>
              <button 
                onClick={() => {
                  onQuotation(customer)
                  onClose()
                }} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm"
              >
                <Package className="h-4 w-4" /> Create Quotation
              </button>
            </div>
            
            {quotations && quotations.length > 0 ? (
              <div className="space-y-3">
                {quotations.filter(q => q.customerId === customer.id || !q.customerId).map((quotation, index) => {
                  const pis = getPIsForQuotation(quotation.id)
                  return (
                    <div key={quotation.id || index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-gray-900">{quotation.quotationNumber || `Quotation #${index + 1}`}</span>
                          </div>
                        <div className="text-sm text-gray-500 mb-2">
                          Date: {quotation.quotationDate ? (quotation.quotationDate.includes('T') ? new Date(quotation.quotationDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : quotation.quotationDate) : 'N/A'}
                        </div>
                          <div className="text-sm text-gray-700 mb-2">
                            Total: ₹{quotation.total ? Number(quotation.total).toLocaleString('en-IN') : '0.00'}
                          </div>
                          <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                            quotation.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            quotation.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            quotation.status === 'pending' || quotation.status === 'pending_verification' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {quotation.status === 'approved' ? '✅ Approved' :
                             quotation.status === 'rejected' ? '❌ Rejected' :
                             quotation.status === 'pending' || quotation.status === 'pending_verification' ? '⏳ Pending' :
                             quotation.status || 'Draft'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 ml-2 flex-wrap">
                          <button 
                            onClick={() => {
                              console.log('👁️ Eye button clicked for quotation:', quotation)
                              onViewQuotation(quotation)
                            }} 
                            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded" 
                            title="View Quotation"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          {quotation.id && onEditQuotation && (
                            <button 
                              onClick={() => {
                                onEditQuotation(quotation, customer)
                                onClose()
                              }} 
                              className="p-1.5 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded" 
                              title="Edit Quotation"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {quotation.status !== 'approved' && quotation.status !== 'rejected' && quotation.status !== 'pending_verification' && quotation.status !== 'pending' && (
                            <button 
                              onClick={() => onSendQuotation(quotation)} 
                              className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded" 
                              title="Send for Verification"
                            >
                              <Send className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {isApprovedQuotation(quotation) && !isPaymentCompleted(quotation) && (
                            <button 
                              onClick={() => {
                                if (onCreatePI && quotation.id) {
                                  onCreatePI(quotation, customer)
                                } else {
                                  Toast.info('Please save the quotation first')
                                }
                              }} 
                              className="p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded" 
                              title="Create PI"
                            >
                              <Package className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {quotation.status !== 'approved' && quotation.status !== 'pending_verification' && quotation.status !== 'pending' && quotation.status !== 'completed' && (
                            <button 
                              onClick={() => onDeleteQuotation(quotation)} 
                              className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded" 
                              title="Delete Quotation"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* PIs for this quotation */}
                      {quotation.id && pis && pis.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                            <Receipt className="h-3 w-3" />
                            Proforma Invoices ({pis.length})
                          </div>
                          <div className="space-y-2">
                            {pis.map((pi, piIndex) => (
                              <div key={pi.id || piIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                <div className="flex items-center gap-2 flex-1">
                                  <Receipt className="h-3 w-3 text-gray-500" />
                                  <span className="font-medium text-gray-700">{pi.pi_number || pi.piNumber || `PI-${piIndex + 1}`}</span>
                                  <span className="text-xs text-gray-500">
                                    {pi.pi_date || pi.piDate || pi.created_at ? (() => {
                                      const dateStr = pi.pi_date || pi.piDate || pi.created_at
                                      const date = dateStr.includes('T') ? new Date(dateStr) : new Date(dateStr)
                                      return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
                                    })() : 'N/A'}
                                  </span>
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                                    pi.status === 'approved' ? 'bg-green-100 text-green-700' :
                                    pi.status === 'pending_approval' || pi.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {pi.status || 'Draft'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      if (onViewPI && pi.id) {
                                        onViewPI(pi.id, quotation)
                                      }
                                    }}
                                    className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                                    title="View PI"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </button>
                                  {pi.status !== 'approved' && pi.status !== 'pending_approval' && pi.status !== 'pending_verification' && pi.status !== 'completed' && (
                                    <button
                                      onClick={() => {
                                        if (piHook?.handleDeletePI && pi.id && quotation.id) {
                                          piHook.handleDeletePI(pi.id, quotation.id)
                                        }
                                      }}
                                      className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                      title="Delete PI"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No quotations found</p>
                <button 
                  onClick={() => {
                    onQuotation(customer)
                    onClose()
                  }} 
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Create First Quotation
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
          <button 
            onClick={() => {
              onEdit()
              onClose()
            }} 
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Edit Customer
          </button>
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}
