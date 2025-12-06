"use client"

import React from 'react'
import { useSharedData } from './SharedDataContext'
import { useSalespersonLeads } from '../../hooks/useSalespersonLeads'
import { useQuotationFlow } from '../../hooks/useQuotationFlow'
import { usePIFlow } from '../../hooks/usePIFlow'
import CompanyBranchService from '../../services/CompanyBranchService'
import QuotationPreview from '../../components/QuotationPreview'
import PIPreview from '../../components/PIPreview'
import LeadFilters from '../../components/salesperson/LeadFilters'
import TagManager from '../../components/salesperson/TagManager'
import CustomerDetailSidebar from '../../components/salesperson/CustomerDetailSidebar'
import ImportLeadsModal from '../../components/salesperson/ImportLeadsModal'
import ColumnVisibilityModal from '../../components/salesperson/ColumnVisibilityModal'
import AddCustomerForm from './salespersonaddcustomer.jsx'
import CreateQuotationForm from './salespersoncreatequotation.jsx'
import CreatePIForm from './CreatePIForm.jsx'
import Toast from '../../utils/Toast'
import { QuotationHelper } from '../../utils/QuotationHelper'
import { StatusConverter } from '../../utils/StatusConverter'
import { Search, RefreshCw, Plus, Filter, Eye, Pencil, FileText, Upload, Settings, Tag, X } from 'lucide-react'
import { apiClient, API_ENDPOINTS, quotationService } from '../../utils/globalImports'

const getUserData = () => {
  try {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    return { username: userData.username || userData.name || 'User', email: userData.email || '', name: userData.name || userData.username || 'User' }
  } catch {
    return { username: 'User', email: '', name: 'User' }
  }
}

export default function CustomerListContent({ isDarkMode = false }) {
  const { customers, setCustomers } = useSharedData()
  const user = getUserData()
  
  // Modal states
  const [viewingCustomer, setViewingCustomer] = React.useState(null)
  const [viewingCustomerForQuotation, setViewingCustomerForQuotation] = React.useState(null)
  const [showAddCustomer, setShowAddCustomer] = React.useState(false)
  const [showCreateQuotation, setShowCreateQuotation] = React.useState(false)
  const [selectedCustomerForQuotation, setSelectedCustomerForQuotation] = React.useState(null)
  const [selectedCustomerForPI, setSelectedCustomerForPI] = React.useState(null)
  const [selectedQuotationForPI, setSelectedQuotationForPI] = React.useState(null)
  const [showCreatePIModal, setShowCreatePIModal] = React.useState(false)
  const [editingCustomer, setEditingCustomer] = React.useState(null)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [selectedBranch, setSelectedBranch] = React.useState('')
  const [companyBranches, setCompanyBranches] = React.useState({})

  // Tag management
  const [showCreateTagModal, setShowCreateTagModal] = React.useState(false)
  const [newTagName, setNewTagName] = React.useState('')
  const [selectedLeadsForTag, setSelectedLeadsForTag] = React.useState([])
  const [isCreatingTag, setIsCreatingTag] = React.useState(false)
  const [showBulkActions, setShowBulkActions] = React.useState(false)
  const [bulkActionType, setBulkActionType] = React.useState('tag') // 'tag' or 'sku'
  const [bulkTagValue, setBulkTagValue] = React.useState('')
  const [bulkSkuValue, setBulkSkuValue] = React.useState('')

  // Import leads modal
  const [showImportModal, setShowImportModal] = React.useState(false)

  // Column visibility - all fields from edit modal
  const defaultColumns = React.useMemo(() => ({
    namePhone: true,
    email: false,
    whatsapp: false,
    business: true,
    productType: true,
    gstNo: false,
    address: true,
    state: true,
    customerType: false,
    leadSource: false,
    salesStatus: false,
    salesStatusRemark: false,
    followUpStatus: true,
    followUpRemark: false,
    followUpDate: false,
    followUpTime: false,
    date: false
  }), [])
  const [columnVisibility, setColumnVisibility] = React.useState(defaultColumns)
  const [showColumnModal, setShowColumnModal] = React.useState(false)

  const handleToggleColumn = (columnKey) => {
    setColumnVisibility(prev => ({ ...prev, [columnKey]: !prev[columnKey] }))
  }

  const handleImportSuccess = () => {
    setShowImportModal(false)
    handleRefresh()
  }

  // Use custom hooks
  const leadsHook = useSalespersonLeads(customers)
  const activeCustomerId = viewingCustomer?.id || viewingCustomerForQuotation?.id
  const quotationHook = useQuotationFlow(activeCustomerId, isRefreshing)
  const piHook = usePIFlow(viewingCustomer, viewingCustomerForQuotation, selectedBranch)

  // Load company branches
  React.useEffect(() => {
    const loadBranches = async () => {
      try {
        const { branches } = await CompanyBranchService.fetchBranches()
        setCompanyBranches(branches)
        if (Object.keys(branches).length > 0 && !selectedBranch) {
          setSelectedBranch(Object.keys(branches)[0])
        }
      } catch (error) {
        Toast.error('Failed to load company branches')
      }
    }
    loadBranches()
  }, [])

  // Refresh leads
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const res = await apiClient.get(API_ENDPOINTS.SALESPERSON_ASSIGNED_LEADS_ME())
      const rows = res?.data || []
      const mapped = rows.map((r) => ({
        id: r.id, name: r.name, phone: r.phone, email: r.email || 'N/A', business: r.business || 'N/A',
        address: r.address || 'N/A', gstNo: r.gst_no || 'N/A', productName: r.product_type || 'N/A',
        state: r.state || 'N/A', enquiryBy: r.lead_source || 'N/A', customerType: r.customer_type || 'N/A',
        date: r.date ? new Date(r.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        salesStatus: r.sales_status || 'pending', salesStatusRemark: r.sales_status_remark || null,
        salesStatusDate: new Date(r.updated_at || r.created_at || Date.now()).toLocaleString(),
        whatsapp: r.whatsapp ? `+91${String(r.whatsapp).replace(/\D/g, '').slice(-10)}` : null,
        transferredTo: r.transferred_to || null, callDurationSeconds: r.call_duration_seconds || null,
        quotationUrl: r.quotation_url || null, proformaInvoiceUrl: r.proforma_invoice_url || null,
        paymentReceiptUrl: r.payment_receipt_url || null, quotationCount: typeof r.quotation_count === 'number' ? r.quotation_count : (parseInt(r.quotation_count) || 0),
        paymentStatusDb: r.payment_status || null, paymentModeDb: r.payment_mode || null,
        followUpStatus: r.follow_up_status || null, followUpRemark: r.follow_up_remark || null,
        followUpDate: r.follow_up_date ? new Date(r.follow_up_date).toISOString().split('T')[0] : null,
        followUpTime: r.follow_up_time || null,
      }))
      leadsHook.setCustomers(mapped)
      setCustomers(mapped)
    } catch (err) {
      Toast.error('Failed to refresh leads')
    } finally {
      setIsRefreshing(false)
    }
  }

  // Handlers
  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setShowAddCustomer(true)
  }

  const handleView = (customer) => {
    setViewingCustomer(customer)
  }

  const handleQuotation = (customer) => {
    setViewingCustomerForQuotation(customer)
    setShowCreateQuotation(true)
  }

  const handleToggleLeadForTag = (leadId) => {
    setSelectedLeadsForTag(prev => prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId])
  }

  const handleSelectAllLeadsForTag = () => {
    setSelectedLeadsForTag(prev => prev.length === leadsHook.paginatedCustomers.length ? [] : leadsHook.paginatedCustomers.map(c => c.id))
  }

  const handleBulkTagChange = async () => {
    const trimmedTag = bulkTagValue.trim().toLowerCase()
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
      // Use the same logic as TagManager component
      const updatePromises = selectedLeadsForTag.map(async (leadId) => {
        const lead = leadsHook.customers.find(c => c.id === leadId)
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
      
      // Update local state
      const updatedCustomers = leadsHook.customers.map(customer => 
        selectedLeadsForTag.includes(customer.id) 
          ? { ...customer, customerType: trimmedTag } 
          : customer
      )
      
      leadsHook.setCustomers(updatedCustomers)
      setCustomers(updatedCustomers)
      
      Toast.success(`Tag "${trimmedTag}" created and assigned to ${selectedLeadsForTag.length} lead(s) successfully!`)
      setSelectedLeadsForTag([])
      setBulkTagValue('')
      setShowBulkActions(false)
    } catch (error) {
      console.error('Error creating tag:', error)
      Toast.error('Failed to create tag. Please try again.')
    } finally {
      setIsCreatingTag(false)
    }
  }

  const handleBulkSkuChange = async () => {
    if (selectedLeadsForTag.length === 0) {
      Toast.error('Please select at least one lead')
      return
    }
    if (!bulkSkuValue.trim()) {
      Toast.error('Please enter a SKU value')
      return
    }
    
    setIsCreatingTag(true)
    try {
      // Update product type (SKU) for selected leads via API
      const updatePromises = selectedLeadsForTag.map(async (leadId) => {
        const lead = leadsHook.customers.find(c => c.id === leadId)
        if (!lead) return null
        const formData = new FormData()
        formData.append('name', lead.name)
        formData.append('phone', lead.phone)
        formData.append('email', lead.email === 'N/A' ? '' : lead.email)
        formData.append('business', lead.business)
        formData.append('address', lead.address)
        formData.append('gst_no', lead.gstNo === 'N/A' ? '' : lead.gstNo)
        formData.append('product_type', bulkSkuValue.trim())
        formData.append('state', lead.state)
        formData.append('lead_source', lead.enquiryBy)
        formData.append('customer_type', lead.customerType || '')
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
      
      // Update local state
      const updatedCustomers = leadsHook.customers.map(customer => {
        if (selectedLeadsForTag.includes(customer.id)) {
          return { ...customer, productName: bulkSkuValue.trim(), product_type: bulkSkuValue.trim() }
        }
        return customer
      })
      
      leadsHook.setCustomers(updatedCustomers)
      setCustomers(updatedCustomers)
      
      Toast.success(`SKU updated for ${selectedLeadsForTag.length} lead(s)`)
      setSelectedLeadsForTag([])
      setBulkSkuValue('')
      setShowBulkActions(false)
    } catch (error) {
      console.error('Error updating SKU:', error)
      Toast.error('Failed to update SKU')
    } finally {
      setIsCreatingTag(false)
    }
  }

  const handleTagSelect = (tag) => {
    leadsHook.setSelectedTag(tag)
  }

  // Save quotation handler
  const handleSaveQuotation = async (quotationData) => {
    const customerToUse = viewingCustomerForQuotation || viewingCustomer
    if (!customerToUse) {
      Toast.error('Customer not found')
      return
    }
    const success = await quotationHook.handleSaveQuotation(quotationData, customerToUse)
    if (success) {
      setShowCreateQuotation(false)
      setViewingCustomerForQuotation(null)
      // Refresh quotations list
      if (customerToUse.id) {
        const res = await quotationService.getQuotationsByCustomer(customerToUse.id)
        if (res?.success) {
          quotationHook.setQuotations((res.data || []).map(q => QuotationHelper.normalizeQuotation(q)))
        }
      }
    }
  }

  // View quotation with global component - Fetch full details first
  const handleViewQuotation = async (quotationSummary) => {
    console.log('🔍 handleViewQuotation called with:', quotationSummary)
    try {
      // Fetch full quotation details to ensure we have items, terms, and all fields
      console.log('📡 Fetching quotation with ID:', quotationSummary.id)
      const response = await quotationService.getQuotation(quotationSummary.id);
      console.log('✅ Quotation response:', response)
      
      if (response?.success && response?.data) {
        const dbQuotation = response.data;
        console.log('📦 Full DB Quotation Data:', dbQuotation);
        console.log('🎨 Template field from DB:', dbQuotation.template);
        console.log('🔑 All DB fields:', Object.keys(dbQuotation));
        
        // EXACT data from database - NO FALLBACKS
        const normalized = {
          id: dbQuotation.id,
          quotationNumber: dbQuotation.quotation_number,
          quotationDate: dbQuotation.quotation_date,
          validUpto: dbQuotation.valid_until,
          validUntil: dbQuotation.valid_until,
          selectedBranch: dbQuotation.branch,
          template: dbQuotation.template,
          
          // Customer and billing info - EXACT from DB
          customer: {
            id: dbQuotation.customer_id,
            name: dbQuotation.customer_name,
            business: dbQuotation.customer_business,
            phone: dbQuotation.customer_phone,
            email: dbQuotation.customer_email,
            address: dbQuotation.customer_address,
            gstNo: dbQuotation.customer_gst_no,
            state: dbQuotation.customer_state
          },
          billTo: dbQuotation.bill_to ? dbQuotation.bill_to : {
            business: dbQuotation.customer_business,
            buyerName: dbQuotation.customer_business,
            address: dbQuotation.customer_address,
            phone: dbQuotation.customer_phone,
            gstNo: dbQuotation.customer_gst_no,
            state: dbQuotation.customer_state
          },
          
          items: (dbQuotation.items || []).map(i => ({
            productName: i.product_name,
            description: i.description,
            quantity: i.quantity,
            unit: i.unit,
            buyerRate: i.unit_price,
            unitPrice: i.unit_price,
            rate: i.unit_price,
            amount: i.taxable_amount,
            total: i.total_amount,
            hsn: i.hsn_code,
            hsnCode: i.hsn_code,
            gstRate: i.gst_rate
          })),
          
          // Financial details - EXACT
          subtotal: parseFloat(dbQuotation.subtotal),
          discountRate: parseFloat(dbQuotation.discount_rate),
          discountAmount: parseFloat(dbQuotation.discount_amount),
          taxRate: parseFloat(dbQuotation.tax_rate),
          taxAmount: parseFloat(dbQuotation.tax_amount),
          total: parseFloat(dbQuotation.total_amount),
          
          // Customer ID
          customerId: dbQuotation.customer_id,
          
          // New fields for delivery & payment - EXACT (handle nulls)
          paymentMode: dbQuotation.payment_mode || '',
          transportTc: dbQuotation.transport_tc || '',
          dispatchThrough: dbQuotation.dispatch_through || '',
          deliveryTerms: dbQuotation.delivery_terms || '',
          materialType: dbQuotation.material_type || '',
          
          // Bank details and terms - EXACT (parse JSON if string)
          bankDetails: typeof dbQuotation.bank_details === 'string' 
            ? JSON.parse(dbQuotation.bank_details) 
            : dbQuotation.bank_details,
          termsSections: typeof dbQuotation.terms_sections === 'string' 
            ? JSON.parse(dbQuotation.terms_sections) 
            : dbQuotation.terms_sections,
          
          // Status
          status: dbQuotation.status
        };
        
        console.log('🎯 Normalized quotation for display:', normalized);
        await quotationHook.handleViewQuotation(normalized);
      } else {
        // Only show error if fetch fails - NO FALLBACK to summary
        console.error('Failed to fetch full quotation details');
        Toast.error('Failed to load full quotation details. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching quotation details:', error);
      Toast.error('Failed to load quotation details');
    }
  }

  // Pagination
  const totalPages = Math.ceil(leadsHook.filteredCustomers.length / leadsHook.itemsPerPage)
  const goToPreviousPage = () => leadsHook.setCurrentPage(prev => Math.max(1, prev - 1))
  const goToNextPage = () => leadsHook.setCurrentPage(prev => Math.min(totalPages, prev + 1))

  return (
    <main className={`flex-1 overflow-auto p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex">
              <input type="text" placeholder="Search items..." value={leadsHook.searchQuery} onChange={(e) => leadsHook.setSearchQuery(e.target.value)} className="px-4 py-2 border border-blue-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
              <button className="px-3 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"><Search className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => leadsHook.setShowFilterPanel(!leadsHook.showFilterPanel)} className={`p-2 rounded-md border inline-flex items-center relative ${leadsHook.showFilterPanel ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200'}`} id="filter-button">
              <Filter className="h-4 w-4" />
              {Object.values(leadsHook.enabledFilters).some(Boolean) && <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-medium text-white bg-blue-500 rounded-full">{Object.values(leadsHook.enabledFilters).filter(Boolean).length}</span>}
            </button>
            <button onClick={handleRefresh} disabled={isRefreshing} className="p-2 rounded-md border bg-white border-gray-200 hover:bg-gray-50" data-refresh-btn>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setShowAddCustomer(true)} className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" title="Add Lead">
              <Plus className="h-4 w-4" />
            </button>
            <button onClick={() => setShowImportModal(true)} className="p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700" title="Import Leads">
              <Upload className="h-4 w-4" />
            </button>
            <button onClick={() => setShowCreateTagModal(true)} className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700" title="Create Tag">
              <Tag className="h-4 w-4" />
            </button>
            {selectedLeadsForTag.length > 0 && (
              <button 
                onClick={() => setShowBulkActions(true)} 
                className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
                title="Bulk Actions"
              >
                Bulk Actions ({selectedLeadsForTag.length})
              </button>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <button onClick={() => handleTagSelect('all')} className={`px-3 py-1 rounded-full text-sm ${leadsHook.selectedTag === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>All</button>
          {leadsHook.tags.map(tag => (
            <button key={tag} onClick={() => handleTagSelect(tag)} className={`px-3 py-1 rounded-full text-sm ${leadsHook.selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{tag}</button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <LeadFilters {...leadsHook} />

      {/* Customer Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-12">
                  <input
                    type="checkbox"
                    checked={selectedLeadsForTag.length > 0 && selectedLeadsForTag.length === leadsHook.paginatedCustomers.length}
                    onChange={handleSelectAllLeadsForTag}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                {columnVisibility.namePhone && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name/Phone</th>}
                {columnVisibility.email && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>}
                {columnVisibility.whatsapp && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">WhatsApp</th>}
                {columnVisibility.business && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>}
                {columnVisibility.productType && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Type</th>}
                {columnVisibility.gstNo && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">GST No</th>}
                {columnVisibility.address && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>}
                {columnVisibility.state && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>}
                {columnVisibility.customerType && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Type</th>}
                {columnVisibility.leadSource && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead Source</th>}
                {columnVisibility.salesStatus && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales Status</th>}
                {columnVisibility.salesStatusRemark && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales Remark</th>}
                {columnVisibility.followUpStatus && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Follow Up</th>}
                {columnVisibility.followUpRemark && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Follow Up Remark</th>}
                {columnVisibility.followUpDate && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Follow Up Date</th>}
                {columnVisibility.followUpTime && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Follow Up Time</th>}
                {columnVisibility.date && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowColumnModal(true)} className="p-1 rounded hover:bg-gray-200" title="Column Settings">
                      <Settings className="h-4 w-4 text-gray-600" />
                    </button>
                    <span>Actions</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leadsHook.paginatedCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedLeadsForTag.includes(customer.id)}
                      onChange={() => handleToggleLeadForTag(customer.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  {columnVisibility.namePhone && (
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    </td>
                  )}
                  {columnVisibility.email && <td className="px-4 py-3 text-sm text-gray-500">{customer.email !== 'N/A' ? customer.email : '-'}</td>}
                  {columnVisibility.whatsapp && <td className="px-4 py-3 text-sm text-gray-500">{customer.whatsapp || '-'}</td>}
                  {columnVisibility.business && <td className="px-4 py-3 text-sm text-gray-900">{customer.business}</td>}
                  {columnVisibility.productType && <td className="px-4 py-3 text-sm text-gray-500">{customer.productName !== 'N/A' ? customer.productName : '-'}</td>}
                  {columnVisibility.gstNo && <td className="px-4 py-3 text-sm text-gray-500">{customer.gstNo !== 'N/A' ? customer.gstNo : '-'}</td>}
                  {columnVisibility.address && <td className="px-4 py-3 text-sm text-gray-500">{customer.address}</td>}
                  {columnVisibility.state && <td className="px-4 py-3 text-sm text-gray-500">{customer.state}</td>}
                  {columnVisibility.customerType && <td className="px-4 py-3"><span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{customer.customerType}</span></td>}
                  {columnVisibility.leadSource && <td className="px-4 py-3 text-sm text-gray-500">{customer.enquiryBy !== 'N/A' ? customer.enquiryBy : '-'}</td>}
                  {columnVisibility.salesStatus && <td className="px-4 py-3 text-sm text-gray-500">{StatusConverter.toTitleStatus(customer.salesStatus)}</td>}
                  {columnVisibility.salesStatusRemark && <td className="px-4 py-3 text-sm text-gray-500">{customer.salesStatusRemark || '-'}</td>}
                  {columnVisibility.followUpStatus && <td className="px-4 py-3 text-sm text-gray-500">{StatusConverter.toTitleStatus(customer.followUpStatus)}</td>}
                  {columnVisibility.followUpRemark && <td className="px-4 py-3 text-sm text-gray-500">{customer.followUpRemark || '-'}</td>}
                  {columnVisibility.followUpDate && <td className="px-4 py-3 text-sm text-gray-500">{customer.followUpDate || '-'}</td>}
                  {columnVisibility.followUpTime && <td className="px-4 py-3 text-sm text-gray-500">{customer.followUpTime || '-'}</td>}
                  {columnVisibility.date && <td className="px-4 py-3 text-sm text-gray-500">{customer.date ? new Date(customer.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</td>}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleView(customer)} className="p-1 text-blue-600 hover:text-blue-700" title="View"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => handleEdit(customer)} className="p-1 text-green-600 hover:text-green-700" title="Edit"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleQuotation(customer)} className="p-1 text-purple-600 hover:text-purple-700" title="Create Quotation"><FileText className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Page {leadsHook.currentPage} of {totalPages}</span>
            <select value={leadsHook.itemsPerPage} onChange={(e) => { leadsHook.setItemsPerPage(Number(e.target.value)); leadsHook.setCurrentPage(1) }} className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => leadsHook.setCurrentPage(1)} disabled={leadsHook.currentPage === 1} className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">First</button>
            <button onClick={goToPreviousPage} disabled={leadsHook.currentPage === 1} className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">Previous</button>
            <button onClick={goToNextPage} disabled={leadsHook.currentPage === totalPages} className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">Next</button>
            <button onClick={() => leadsHook.setCurrentPage(totalPages)} disabled={leadsHook.currentPage === totalPages} className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">Last</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {viewingCustomer && <CustomerDetailSidebar customer={viewingCustomer} onClose={() => setViewingCustomer(null)} onEdit={() => { setEditingCustomer(viewingCustomer); setViewingCustomer(null); setShowAddCustomer(true) }} onQuotation={handleQuotation} quotations={quotationHook.quotations} onViewQuotation={handleViewQuotation} onSendQuotation={quotationHook.handleSendQuotation} onDeleteQuotation={quotationHook.handleDeleteQuotation} onCreatePI={(quotation, customer) => { setSelectedQuotationForPI(quotation); setViewingCustomerForQuotation(customer); setShowCreatePIModal(true); setViewingCustomer(null) }} quotationPIs={piHook.quotationPIs} piHook={piHook} onViewPI={piHook.handleViewPI} />}
      {showAddCustomer && <AddCustomerForm onClose={() => { setShowAddCustomer(false); setEditingCustomer(null) }} editingCustomer={editingCustomer} />}
      {showCreateQuotation && viewingCustomerForQuotation && <CreateQuotationForm customer={viewingCustomerForQuotation} user={user} onClose={() => { setShowCreateQuotation(false); setViewingCustomerForQuotation(null) }} onSave={handleSaveQuotation} />}
      {showCreatePIModal && selectedQuotationForPI && viewingCustomerForQuotation && <CreatePIForm quotation={selectedQuotationForPI} customer={viewingCustomerForQuotation} user={user} modal={true} onClose={async (savedPI) => { 
        setShowCreatePIModal(false)
        if (selectedQuotationForPI?.id) {
          await piHook.fetchPIsForQuotation(selectedQuotationForPI.id)
        }
        setTimeout(() => {
          setSelectedQuotationForPI(null)
        }, 100)
      }} />}
      {quotationHook.showQuotationPopup && quotationHook.quotationPopupData && <QuotationPreview quotationData={quotationHook.quotationPopupData} companyBranches={companyBranches} user={user} onClose={() => quotationHook.setShowQuotationPopup(false)} />}
      {piHook.showPIPreview && piHook.savedPiPreview && (
        <PIPreview
          // Merge core PI preview data with template + branch metadata
          piData={{
            ...piHook.savedPiPreview.data,
            template: piHook.savedPiPreview.template,
            selectedBranch: piHook.savedPiPreview.selectedBranch
          }}
          companyBranches={companyBranches}
          user={user}
          onClose={() => piHook.setShowPIPreview(false)}
        />
      )}
      <ImportLeadsModal show={showImportModal} onClose={() => setShowImportModal(false)} onImportSuccess={handleImportSuccess} />
      <ColumnVisibilityModal show={showColumnModal} onClose={() => setShowColumnModal(false)} columns={{ namePhone: 'Name/Phone', email: 'Email', whatsapp: 'WhatsApp', business: 'Business', productType: 'Product Type', gstNo: 'GST No', address: 'Address', state: 'State', customerType: 'Customer Type', leadSource: 'Lead Source', salesStatus: 'Sales Status', salesStatusRemark: 'Sales Status Remark', followUpStatus: 'Follow Up Status', followUpRemark: 'Follow Up Remark', followUpDate: 'Follow Up Date', followUpTime: 'Follow Up Time', date: 'Date' }} visibleColumns={columnVisibility} onToggleColumn={handleToggleColumn} />
      <TagManager showCreateTagModal={showCreateTagModal} setShowCreateTagModal={setShowCreateTagModal} newTagName={newTagName} setNewTagName={setNewTagName} selectedLeadsForTag={selectedLeadsForTag} setSelectedLeadsForTag={setSelectedLeadsForTag} customers={leadsHook.customers} setCustomers={leadsHook.setCustomers} isCreatingTag={isCreatingTag} setIsCreatingTag={setIsCreatingTag} handleToggleLeadForTag={handleToggleLeadForTag} handleSelectAllLeadsForTag={handleSelectAllLeadsForTag} />
      
      {/* Bulk Actions Modal */}
      {showBulkActions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Bulk Actions ({selectedLeadsForTag.length} selected)
              </h3>
              <button
                onClick={() => {
                  setShowBulkActions(false)
                  setBulkTagValue('')
                  setBulkSkuValue('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="tag"
                      checked={bulkActionType === 'tag'}
                      onChange={(e) => setBulkActionType(e.target.value)}
                      className="mr-2"
                    />
                    <span>Create/Add Tag</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="sku"
                      checked={bulkActionType === 'sku'}
                      onChange={(e) => setBulkActionType(e.target.value)}
                      className="mr-2"
                    />
                    <span>Change SKU/Product Type</span>
                  </label>
                </div>
              </div>

              {bulkActionType === 'tag' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tag Name
                  </label>
                  <input
                    type="text"
                    value={bulkTagValue}
                    onChange={(e) => setBulkTagValue(e.target.value)}
                    placeholder="Enter tag name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU/Product Type
                  </label>
                  <input
                    type="text"
                    value={bulkSkuValue}
                    onChange={(e) => setBulkSkuValue(e.target.value)}
                    placeholder="Enter SKU or Product Type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowBulkActions(false)
                  setBulkTagValue('')
                  setBulkSkuValue('')
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={bulkActionType === 'tag' ? handleBulkTagChange : handleBulkSkuChange}
                disabled={isCreatingTag}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isCreatingTag ? 'Processing...' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
