import React from 'react'
import { X, RefreshCw } from 'lucide-react'
import { apiClient, API_ENDPOINTS } from '../../utils/globalImports'
import Toast from '../../utils/Toast'

export default function TagManager({ 
  showCreateTagModal, setShowCreateTagModal, newTagName, setNewTagName,
  selectedLeadsForTag, setSelectedLeadsForTag, customers, setCustomers,
  isCreatingTag, setIsCreatingTag, handleToggleLeadForTag, handleSelectAllLeadsForTag
}) {
  const handleCreateTag = async () => {
    const trimmedTag = newTagName.trim().toLowerCase()
    if (!trimmedTag) {
      Toast.warning('Please enter a tag name')
      return
    }
    if (selectedLeadsForTag.length === 0) {
      Toast.warning('Please select at least one lead to assign this tag')
      return
    }
    setIsCreatingTag(true)
    try {
      const updatePromises = selectedLeadsForTag.map(async (leadId) => {
        const lead = customers.find(c => c.id === leadId)
        if (!lead) return null
        const formData = new FormData()
        formData.append('name', lead.name)
        formData.append('phone', lead.phone)
        formData.append('email', lead.email === 'N/A' ? '' : lead.email)
        formData.append('business', lead.business)
        formData.append('address', lead.address)
        formData.append('gst_no', lead.gstNo === 'N/A' ? '' : lead.gstNo)
        formData.append('product_type', lead.productName)
        formData.append('state', lead.state)
        formData.append('lead_source', lead.enquiryBy)
        formData.append('customer_type', trimmedTag)
        formData.append('date', lead.date)
        formData.append('whatsapp', lead.whatsapp ? lead.whatsapp.replace('+91','') : '')
        formData.append('sales_status', lead.salesStatus)
        formData.append('sales_status_remark', lead.salesStatusRemark || '')
        formData.append('follow_up_status', lead.followUpStatus || '')
        formData.append('follow_up_remark', lead.followUpRemark || '')
        formData.append('follow_up_date', lead.followUpDate || '')
        formData.append('follow_up_time', lead.followUpTime || '')
        return apiClient.putFormData(API_ENDPOINTS.SALESPERSON_LEAD_BY_ID(leadId), formData)
      })
      await Promise.all(updatePromises)
      setCustomers(prev => prev.map(customer => selectedLeadsForTag.includes(customer.id) ? { ...customer, customerType: trimmedTag } : customer))
      setNewTagName('')
      setSelectedLeadsForTag([])
      setShowCreateTagModal(false)
      Toast.success(`Tag "${trimmedTag}" created and assigned to ${selectedLeadsForTag.length} lead(s) successfully!`)
    } catch (error) {
      Toast.error('Failed to create tag. Please try again.')
    } finally {
      setIsCreatingTag(false)
    }
  }

  return showCreateTagModal && (
    <div className="fixed inset-0 z-[100] overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Create New Tag</h3>
            <button onClick={() => { setShowCreateTagModal(false); setNewTagName(''); setSelectedLeadsForTag([]) }} className="text-gray-400 hover:text-gray-600" disabled={isCreatingTag}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tag Name</label>
            <input type="text" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} placeholder="e.g. Dealer, Contractor, Distributor" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus disabled={isCreatingTag} />
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Select Leads to Tag ({selectedLeadsForTag.length} selected)</label>
              <button onClick={handleSelectAllLeadsForTag} className="text-sm text-blue-600 hover:text-blue-700 font-medium" disabled={isCreatingTag}>
                {selectedLeadsForTag.length === customers.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
              {customers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No leads available</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <label key={customer.id} className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${isCreatingTag ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <input type="checkbox" checked={selectedLeadsForTag.includes(customer.id)} onChange={() => handleToggleLeadForTag(customer.id)} disabled={isCreatingTag} className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                            <p className="text-xs text-gray-500">{customer.phone} • {customer.business}</p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{customer.customerType}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-between items-center bg-gray-50">
          <p className="text-sm text-gray-600">{selectedLeadsForTag.length > 0 ? `${selectedLeadsForTag.length} lead(s) will be tagged as "${newTagName || '...'}"` : 'Select leads to tag'}</p>
          <div className="flex space-x-3">
            <button onClick={() => { setShowCreateTagModal(false); setNewTagName(''); setSelectedLeadsForTag([]) }} disabled={isCreatingTag} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50">Cancel</button>
            <button onClick={handleCreateTag} disabled={!newTagName.trim() || selectedLeadsForTag.length === 0 || isCreatingTag} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 inline-flex items-center gap-2">
              {isCreatingTag ? <><RefreshCw className="h-4 w-4 animate-spin" /> Creating...</> : 'Create Tag'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
