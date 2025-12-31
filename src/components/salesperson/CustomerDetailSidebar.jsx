import React from 'react'
import { X, Eye, Package, Send, Trash2, FileText, Receipt, Pencil, User, Phone, Mail, Building2, MapPin, Globe, Hash, Tag, Clock } from 'lucide-react'
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
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      
      <div className="fixed right-0 top-12 sm:top-14 h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] w-full sm:w-96 lg:max-w-lg bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-3 sm:p-4 flex items-center justify-between shadow-lg flex-shrink-0 gap-2 sm:gap-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            <User className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="truncate">Customer Details</span>
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 p-1.5 rounded-lg hover:bg-white/20 transition-colors flex-shrink-0">
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-lg p-4 mb-4 border border-purple-200 shadow-sm">
            <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-purple-600" />
              Customer Information
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-purple-700 text-xs">Name:</span>
                  <span className="ml-2 text-gray-800 font-medium text-xs">{customer.name || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-blue-700 text-xs">Phone:</span>
                  <span className="ml-2 text-gray-800 font-medium text-xs">{customer.phone || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-pink-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-pink-700 text-xs">Email:</span>
                  <span className="ml-2 text-gray-800 font-medium text-xs">{customer.email || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-indigo-700 text-xs">Business:</span>
                  <span className="ml-2 text-gray-800 font-medium text-xs">{customer.business || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-red-700 text-xs">Address:</span>
                  <span className="ml-2 text-gray-800 font-medium text-xs">{customer.address || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-teal-700 text-xs">State:</span>
                  <span className="ml-2 text-gray-800 font-medium text-xs">{customer.state || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Hash className="h-4 w-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-cyan-700 text-xs">GST No:</span>
                  <span className="ml-2 text-gray-800 font-medium text-xs">{customer.gstNo || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Tag className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-orange-700 text-xs">Type:</span>
                  <span className="ml-2 text-gray-800 font-medium text-xs">{customer.customerType || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2 sm:gap-3">
              <h3 className="text-sm sm:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span>Quotations</span>
              </h3>
              <button 
                onClick={() => {
                  onQuotation(customer)
                  onClose()
                }} 
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
              >
                <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" /> 
                <span className="truncate">Create Quotation</span>
              </button>
            </div>
            
            {quotations && quotations.length > 0 ? (
              <div className="space-y-3">
                {quotations.filter(q => q.customerId === customer.id || !q.customerId).map((quotation, index) => {
                  const pis = getPIsForQuotation(quotation.id)
                  return (
                    <div key={quotation.id || index} className="p-4 border-2 border-gray-200 rounded-lg bg-gradient-to-br from-white to-gray-50 hover:border-purple-300 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded">
                              <FileText className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-gray-900">{quotation.quotationNumber || `Quotation #${index + 1}`}</span>
                          </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <Clock className="h-3.5 w-3.5 text-pink-600" />
                          {quotation.quotationDate ? (quotation.quotationDate.includes('T') ? new Date(quotation.quotationDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : quotation.quotationDate) : 'N/A'}
                        </div>
                          <div className="text-sm font-semibold text-gray-800 mb-2">
                            Total: <span className="text-blue-700">₹{quotation.total ? Number(quotation.total).toLocaleString('en-IN') : '0.00'}</span>
                          </div>
                          <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm ${
                            quotation.status === 'approved' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 
                            quotation.status === 'rejected' ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white' : 
                            quotation.status === 'pending' || quotation.status === 'pending_verification' ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white' :
                            'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                          }`}>
                            {quotation.status === 'approved' ? '✅ Approved' :
                             quotation.status === 'rejected' ? '❌ Rejected' :
                             quotation.status === 'pending' || quotation.status === 'pending_verification' ? '⏳ Pending' :
                             quotation.status || 'Draft'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 ml-2 flex-wrap">
                          <button 
                            onClick={() => onViewQuotation(quotation)} 
                            className="p-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 rounded-lg shadow-sm transition-all duration-200" 
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
                              className="p-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 rounded-lg shadow-sm transition-all duration-200" 
                              title="Edit Quotation"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {quotation.status !== 'approved' && quotation.status !== 'rejected' && quotation.status !== 'pending_verification' && quotation.status !== 'pending' && (
                            <button 
                              onClick={() => onSendQuotation(quotation)} 
                              className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 rounded-lg shadow-sm transition-all duration-200" 
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
                              className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-lg shadow-sm transition-all duration-200" 
                              title="Create PI"
                            >
                              <Package className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {quotation.status !== 'approved' && quotation.status !== 'pending_verification' && quotation.status !== 'pending' && quotation.status !== 'completed' && (
                            <button 
                              onClick={() => onDeleteQuotation(quotation)} 
                              className="p-1.5 bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 rounded-lg shadow-sm transition-all duration-200" 
                              title="Delete Quotation"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {quotation.id && pis && pis.length > 0 && (
                        <div className="mt-3 pt-3 border-t-2 border-gray-300">
                          <div className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                            <div className="p-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded">
                              <Receipt className="h-3 w-3 text-white" />
                            </div>
                            Proforma Invoices ({pis.length})
                          </div>
                          <div className="space-y-2">
                            {pis.map((pi, piIndex) => (
                              <div key={pi.id || piIndex} className="flex items-center justify-between p-2.5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200 shadow-sm">
                                <div className="flex items-center gap-2 flex-1">
                                  <div className="p-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded">
                                    <Receipt className="h-3 w-3 text-white" />
                                  </div>
                                  <span className="font-bold text-gray-800">{pi.pi_number || pi.piNumber || `PI-${piIndex + 1}`}</span>
                                  <span className="flex items-center gap-0.5 text-xs text-gray-600">
                                    <Clock className="h-3 w-3 text-pink-600" />
                                    {pi.pi_date || pi.piDate || pi.created_at ? (() => {
                                      const dateStr = pi.pi_date || pi.piDate || pi.created_at
                                      const date = dateStr.includes('T') ? new Date(dateStr) : new Date(dateStr)
                                      return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
                                    })() : 'N/A'}
                                  </span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shadow-sm ${
                                    pi.status === 'approved' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                                    pi.status === 'pending_approval' || pi.status === 'pending' ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white' :
                                    'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
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
                                    className="p-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 rounded-lg shadow-sm transition-all duration-200"
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
                                      className="p-1 bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 rounded-lg shadow-sm transition-all duration-200"
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
              <div className="text-center py-8">
                <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-gray-600 font-medium mb-4">No quotations found</p>
                <button 
                  onClick={() => {
                    onQuotation(customer)
                    onClose()
                  }} 
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Create First Quotation
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-3 sm:p-4 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex flex-col sm:flex-row justify-end gap-2 sm:gap-2 flex-shrink-0">
          <button 
            onClick={() => {
              onEdit()
              onClose()
            }} 
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
          >
            Edit Customer
          </button>
          <button 
            onClick={onClose} 
            className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm sm:text-base font-semibold transition-all duration-200 w-full sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}
