"use client"

import React from "react"

// Convert number to words (Indian system)
function numberToWords(num) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  const scales = ['', 'Thousand', 'Lakh', 'Crore']

  if (!num || num === 0) return 'Zero'

  function convertHundreds(n) {
    let result = ''
    if (n > 99) {
      result += ones[Math.floor(n / 100)] + ' Hundred '
      n %= 100
    }
    if (n > 19) {
      result += tens[Math.floor(n / 10)] + ' '
      n %= 10
    } else if (n > 9) {
      result += teens[n - 10] + ' '
      return result
    }
    if (n > 0) {
      result += ones[n] + ' '
    }
    return result
  }

  let result = ''
  let scaleIndex = 0
  while (num > 0) {
    if (num % 1000 !== 0) {
      const chunk = num % 1000
      const chunkWords = convertHundreds(chunk)
      if (chunkWords.trim()) {
        result = chunkWords + scales[scaleIndex] + ' ' + result
      }
    }
    num = Math.floor(num / 1000)
    scaleIndex++
  }
  return result.trim()
}
import apiClient from '../../utils/apiClient'
import { API_ENDPOINTS } from '../../api/admin_api/api'
import quotationService from '../../api/admin_api/quotationService'
import proformaInvoiceService from '../../api/admin_api/proformaInvoiceService'
import { Search, RefreshCw, User, Mail, Building2, Pencil, Eye, Plus, Download, Filter, MessageCircle, Package, MapPin, Map, BadgeCheck, XCircle, FileText, Globe, X, Clock, Check, Clock as ClockIcon, ArrowRightLeft, Upload, Send, Trash2, Settings } from "lucide-react"
import html2pdf from 'html2pdf.js'
import Quotation from './salespersonquotation.jsx'
import AddCustomerForm from './salespersonaddcustomer.jsx'
import CreateQuotationForm from './salespersoncreatequotation.jsx'
import { CorporateStandardInvoice } from './salespersonpi'
import PIPreviewModal from './PIPreviewModal'
import { useSharedData } from './SharedDataContext'
import QuotationPreview from "../../components/QuotationPreview"

function cx(...classes) {
  return classes.filter(Boolean).join(" ")
}

function Card({ className, children }) {
  return <div className={cx("rounded-lg border bg-white", className)}>{children}</div>
}

function CardContent({ className, children }) {
  return <div className={cx("p-0", className)}>{children}</div>
}

export default function CustomerListContent({ isDarkMode = false }) {
  const { customers, setCustomers, updateCustomer, addCustomer, deleteCustomer } = useSharedData()
  
  // Get user data from localStorage or auth context
  const getUserData = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      return {
        username: userData.username || userData.name || 'User',
        email: userData.email || '',
        name: userData.name || userData.username || 'User'
      }
    } catch {
      return {
        username: 'User',
        email: '',
        name: 'User'
      }
    }
  }
  
  const user = getUserData()
  const [viewingCustomer, setViewingCustomer] = React.useState(null)
  const [modalTab, setModalTab] = React.useState('details')
  const [showAddCustomer, setShowAddCustomer] = React.useState(false)
  const [showCreateQuotation, setShowCreateQuotation] = React.useState(false)
  const [selectedCustomerForQuotation, setSelectedCustomerForQuotation] = React.useState(null)
  const [showCreatePI, setShowCreatePI] = React.useState(false)
  const [selectedCustomerForPI, setSelectedCustomerForPI] = React.useState(null)
  const [showFollowUpPicker, setShowFollowUpPicker] = React.useState(null) // lead id or null
  const [piData, setPiData] = React.useState(null)
  const [showPIPreview, setShowPIPreview] = React.useState(false)
  
  // Tag Management State - Dynamic from actual data
  const [selectedTag, setSelectedTag] = React.useState('all')
  const [showCreateTagModal, setShowCreateTagModal] = React.useState(false)
  const [newTagName, setNewTagName] = React.useState('')
  const [selectedLeadsForTag, setSelectedLeadsForTag] = React.useState([])
  const [isCreatingTag, setIsCreatingTag] = React.useState(false)
  
  // Get unique tags dynamically from customers
  const tags = React.useMemo(() => {
    const uniqueTypes = [...new Set(customers.map(c => c.customerType).filter(t => t && t !== 'N/A'))]
    return uniqueTypes.sort()
  }, [customers])
  
  // Advanced Filter State
  const [showFilterPanel, setShowFilterPanel] = React.useState(false)
  const [advancedFilters, setAdvancedFilters] = React.useState({
    tag: '',
    followUpStatus: '',
    salesStatus: '',
    state: '',
    leadSource: '',
    productType: '',
    dateFrom: '',
    dateTo: ''
  })
  
  // Filter section toggle state
  const [enabledFilters, setEnabledFilters] = React.useState({
    tag: false,
    followUpStatus: false,
    salesStatus: false,
    state: false,
    leadSource: false,
    productType: false,
    dateRange: false
  })
  
  // Close filter panel when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      const filterPanel = document.getElementById('filter-panel')
      const filterButton = document.getElementById('filter-button')
      if (filterPanel && !filterPanel.contains(event.target) && !filterButton?.contains(event.target)) {
        setShowFilterPanel(false)
      }
    }
    
    if (showFilterPanel) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showFilterPanel])
  const [piFormData, setPiFormData] = React.useState({
    items: [{
      id: 1,
      description: '',
      subDescription: '',
      hsn: '76141000',
      dueOn: new Date().toISOString().split('T')[0],
      quantity: 1,
      unit: 'MTR',
      rate: 0,
      amount: 0
    }],
    discountRate: 0,
    customer: {
      business: '',
      address: '',
      phone: '',
      gstNo: '',
      state: ''
    }
  })
  const [dispatchMode, setDispatchMode] = React.useState('BY TRANSPORT')
  const [shippingDetails, setShippingDetails] = React.useState({
    lrNo: '',
    transportName: '',
    transportId: '',
    vehicleNumber: '',
    courierName: '',
    consignmentNo: '',
    byHand: 'Self',
    postService: 'By Post',
    carrierName: '',
    carrierNumber: ''
  })
  const [quotationData, setQuotationData] = React.useState(null)
  const [lastQuotationData, setLastQuotationData] = React.useState(null)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  
  // Tag handling functions
  const handleCreateTag = async () => {
    const trimmedTag = newTagName.trim().toLowerCase()
    
    if (!trimmedTag) {
      alert('Please enter a tag name')
      return
    }
    
    if (selectedLeadsForTag.length === 0) {
      alert('Please select at least one lead to assign this tag')
      return
    }
    
    setIsCreatingTag(true)
    
    try {
      // Update all selected leads with the new customer_type
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
        formData.append('customer_type', trimmedTag) // New tag as customer_type
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
      
      // Update local state for all selected leads
      setCustomers(prev => prev.map(customer => 
        selectedLeadsForTag.includes(customer.id) 
          ? { ...customer, customerType: trimmedTag }
          : customer
      ))
      
      // Reset modal state
      setNewTagName('')
      setSelectedLeadsForTag([])
      setShowCreateTagModal(false)
      
      alert(`Tag "${trimmedTag}" created and assigned to ${selectedLeadsForTag.length} lead(s) successfully!`)
    } catch (error) {
      console.error('Failed to create tag:', error)
      alert('Failed to create tag. Please try again.')
    } finally {
      setIsCreatingTag(false)
    }
  }
  
  const handleToggleLeadForTag = (leadId) => {
    setSelectedLeadsForTag(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    )
  }
  
  const handleSelectAllLeadsForTag = () => {
    if (selectedLeadsForTag.length === customers.length) {
      setSelectedLeadsForTag([])
    } else {
      setSelectedLeadsForTag(customers.map(c => c.id))
    }
  }

  const handleDeleteTag = (tagToDelete) => {
    // Tags are dynamic based on actual customer_type values
    // To "delete" a tag, we would need to update all customers with that type
    // For now, we just inform the user
    alert(`To remove the "${tagToDelete}" tag, please change the customer type for all leads using this tag.`)
  }

  const handleTagSelect = (tag) => {
    setSelectedTag(tag)
  }
  
  // Advanced filter handling
  const handleAdvancedFilterChange = (filterKey, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [filterKey]: value
    }))
  }
  
  const clearAdvancedFilters = () => {
    setAdvancedFilters({
      tag: '',
      followUpStatus: '',
      salesStatus: '',
      state: '',
      leadSource: '',
      productType: '',
      dateFrom: '',
      dateTo: ''
    })
    setEnabledFilters({
      tag: false,
      followUpStatus: false,
      salesStatus: false,
      state: false,
      leadSource: false,
      productType: false,
      dateRange: false
    })
  }
  
  const toggleFilterSection = (filterKey) => {
    setEnabledFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }))
    
    // Clear filter value when disabling
    if (enabledFilters[filterKey]) {
      if (filterKey === 'dateRange') {
        setAdvancedFilters(prev => ({
          ...prev,
          dateFrom: '',
          dateTo: ''
        }))
      } else {
        setAdvancedFilters(prev => ({
          ...prev,
          [filterKey]: ''
        }))
      }
    }
  }
  
  // Get unique values from customers for dynamic filter options
  const getUniqueFilterOptions = React.useMemo(() => {
    const uniqueTags = [...new Set(customers.map(c => c.customerType).filter(Boolean))].sort()
    const uniqueFollowUpStatuses = [...new Set(customers.map(c => c.followUpStatus).filter(Boolean))].sort()
    const uniqueSalesStatuses = [...new Set(customers.map(c => c.salesStatus).filter(Boolean))].sort()
    const uniqueStates = [...new Set(customers.map(c => c.state).filter(s => s && s !== 'N/A'))].sort()
    const uniqueLeadSources = [...new Set(customers.map(c => c.enquiryBy).filter(s => s && s !== 'N/A'))].sort()
    const uniqueProducts = [...new Set(customers.map(c => c.productName).filter(s => s && s !== 'N/A'))].sort()
    
    return {
      tags: uniqueTags,
      followUpStatuses: uniqueFollowUpStatuses,
      salesStatuses: uniqueSalesStatuses,
      states: uniqueStates,
      leadSources: uniqueLeadSources,
      products: uniqueProducts
    }
  }, [customers])
  
  const defaultColumns = React.useMemo(() => ({
    id: false,
    namePhone: true,
    business: true,
    address: true,
    gstNo: false,
    productName: false,
    state: true,
    leadSource: false,
    customerType: true,
    date: false,
    salesStatus: false,
    followUp: true,
    transferredTo: true,
    actions: true,
  }), [])
  const [columnVisibility, setColumnVisibility] = React.useState(defaultColumns)
  const [showColumnModal, setShowColumnModal] = React.useState(false)

  const toTitleStatus = (value) => {
    if (!value) return 'Pending'
    const v = String(value).toLowerCase()
    if (v === 'connected') return 'Connected'
    if (v === 'not_connected') return 'Not Connected'
    if (v === 'follow_up') return 'Follow Up'
    if (v === 'not_interested') return 'Not Interested'
    if (v === 'next_meeting') return 'Next Meeting'
    if (v === 'order_confirmed') return 'Order Confirmed'
    if (v === 'closed') return 'Closed'
    if (v === 'open') return 'Open'
    return value
  }

  const toMachineStatus = (label) => {
    const l = String(label).toLowerCase()
    if (l.includes('not connected')) return 'not_connected'
    if (l.includes('connected')) return 'connected'
    if (l.includes('follow')) return 'follow_up'
    if (l.includes('not interested')) return 'not_interested'
    if (l.includes('next') || l.includes('meeting')) return 'next_meeting'
    if (l.includes('order')) return 'order_confirmed'
    if (l.includes('closed')) return 'closed'
    if (l.includes('open')) return 'open'
    return l.replace(/\s+/g, '_')
  }

  // ---------- Quotation Helpers (DRY) ----------
  const isApprovedQuotation = (q) => (q?.status || '').toLowerCase() === 'approved'
  const isPaymentCompleted = (q) => {
    const s = (q?.status || '').toLowerCase()
    return s === 'completed' || s === 'paid' || s === 'deal_closed' || s === 'closed'
  }

  // ---------- PI Number Generation ----------
  const generatePiNumber = () => {
    const now = new Date()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    // Financial year (Apr-Mar)
    const year = now.getFullYear()
    const fyStart = now.getMonth() + 1 >= 4 ? year : year - 1
    const fyEnd = (fyStart + 1).toString().slice(-2)
    const fyStartShort = fyStart.toString().slice(-2)
    const rand = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
    return `PI-${fyStartShort}${fyEnd}-${mm}${rand}`
  }
  const [piNumber, setPiNumber] = React.useState('')
  const isPiLocked = React.useMemo(() => Boolean(selectedCustomerForPI?.approvedQuotation), [selectedCustomerForPI])

  // Fetch quotations for the currently viewed customer (DB-backed) on open/refresh
  React.useEffect(() => {
    let ignore = false
    async function loadCustomerQuotations() {
      try {
        if (!viewingCustomer || !viewingCustomer.id) return
        console.log('Loading quotations for customer:', viewingCustomer.id);
        const res = await quotationService.getQuotationsByCustomer(viewingCustomer.id)
        console.log('Quotations API response:', res);
        
        if (!ignore && res && res.success) {
          const normalized = (res.data || []).map(q => ({
            id: q.id,
            quotationNumber: q.quotation_number,
            customerId: q.customer_id,
            quotationDate: q.quotation_date,
            total: q.total_amount,
            status: q.status,
            createdAt: q.created_at,
            branch: q.branch || 'ANODE',
            billTo: {
              business: viewingCustomer?.business,
              address: viewingCustomer?.address,
              phone: viewingCustomer?.phone,
              gstNo: viewingCustomer?.gstNo,
              state: viewingCustomer?.state,
              transport: q.transport || q.transport_company || q.transportCompany || null,
            },
            items: q.items || []
          }))
          console.log('Normalized quotations with statuses:', normalized);
          setQuotations(normalized)
        }
      } catch (e) {
        console.error('Failed to load customer quotations:', e)
      }
    }
    loadCustomerQuotations()
    return () => { ignore = true }
  }, [viewingCustomer?.id, isRefreshing])

  // Auto-refresh quotations every 10 seconds to get status updates from department head
  React.useEffect(() => {
    if (!viewingCustomer || !viewingCustomer.id) return
    
    const interval = setInterval(async () => {
      try {
        console.log('Auto-refreshing quotations for status updates...');
        const res = await quotationService.getQuotationsByCustomer(viewingCustomer.id)
        if (res && res.success) {
          const normalized = (res.data || []).map(q => ({
            id: q.id,
            quotationNumber: q.quotation_number,
            customerId: q.customer_id,
            quotationDate: q.quotation_date,
            total: q.total_amount,
            status: q.status,
            createdAt: q.created_at,
            branch: q.branch || 'ANODE',
            billTo: {
              business: viewingCustomer?.business,
              address: viewingCustomer?.address,
              phone: viewingCustomer?.phone,
              gstNo: viewingCustomer?.gstNo,
              state: viewingCustomer?.state,
              transport: q.transport || q.transport_company || q.transportCompany || null,
            },
            items: q.items || []
          }))
          
          setQuotations(prev => {
            // Check if any status has changed
            const hasChanges = normalized.some(newQ => {
              const oldQ = prev.find(p => p.id === newQ.id)
              return !oldQ || oldQ.status !== newQ.status
            })
            
            if (hasChanges) {
              console.log('Status changes detected:', normalized);
              
              // Show notification for status changes
              normalized.forEach(newQ => {
                const oldQ = prev.find(p => p.id === newQ.id)
                if (oldQ && oldQ.status !== newQ.status) {
                  if (newQ.status === 'approved') {
                    alert(`✅ Quotation ${newQ.quotationNumber} has been APPROVED by Department Head!`)
                  } else if (newQ.status === 'rejected') {
                    alert(`❌ Quotation ${newQ.quotationNumber} has been REJECTED by Department Head!`)
                  }
                }
              })
              
              return normalized
            }
            return prev
          })
        }
      } catch (e) {
        console.error('Auto-refresh failed:', e)
      }
    }, 10000) // 10 seconds
    
    return () => clearInterval(interval)
  }, [viewingCustomer?.id])
  const [editingCustomer, setEditingCustomer] = React.useState(null)
  // Payment features removed
  
  // Company branch configuration
  const [selectedBranch, setSelectedBranch] = React.useState('ANODE') // Default branch
  const [showQuotationPopup, setShowQuotationPopup] = React.useState(false)
  const [quotationPopupData, setQuotationPopupData] = React.useState(null)
  
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
    },
    SAMRIDDHI_CABLE: {
      name: 'SAMRIDDHI CABLE INDUSTRIES PRIVATE LIMITED',
      gstNumber: '(23ABPCS7684F1ZT)',
      description: 'MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES.',
      address: 'KHASRA NO. 805/5, PLOT NO. 10, IT PARK, BARGI HILLS, JABALPUR - 482003, MADHYA PRADESH, INDIA.',
      tel: '6262002116, 6262002113',
      web: 'www.samriddhicable.com',
      email: 'info@samriddhicable.com',
      logo: 'Samriddhi Cable - Quality & Excellence.....'
    },
    SAMRIDDHI_INDUSTRIES: {
      name: 'SAMRIDDHI INDUSTRIES',
      gstNumber: '(23ABWFS1117M1ZT)',
      description: 'MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES.',
      address: 'KHASRA NO. 805/5, PLOT NO. 10, IT PARK, BARGI HILLS, JABALPUR - 482003, MADHYA PRADESH, INDIA.',
      tel: '6262002116, 6262002113',
      web: 'www.samriddhiindustries.com',
      email: 'info@samriddhiindustries.com',
      logo: 'Samriddhi Industries - Innovation & Trust.....'
    }
  }
  
  // Payment logic removed
  const [showImportModal, setShowImportModal] = React.useState(false)
  const [importFile, setImportFile] = React.useState(null)
  
  // Quotations data - empty array ready for real data
  const [quotations, setQuotations] = React.useState([])
  const [piStore, setPiStore] = React.useState({})
  const [savedPiPreview, setSavedPiPreview] = React.useState(null) // { data, selectedBranch }
  const [quotationPIs, setQuotationPIs] = React.useState({}) // Store PIs by quotation ID

  React.useEffect(() => {
    function handlePiSaved(e) {
      const { quotationNumber, piData, selectedBranch: piBranch } = e.detail || {}
      if (!quotationNumber || !piData) return
      setPiStore(prev => ({ ...prev, [quotationNumber]: { data: piData, selectedBranch: piBranch } }))
      setLastQuotationData(prev => prev || { quotationNumber })
    }
    window.addEventListener('pi-saved', handlePiSaved)
    return () => window.removeEventListener('pi-saved', handlePiSaved)
  }, [])
  const [showPdfViewer, setShowPdfViewer] = React.useState(false)
  const [currentPdfUrl, setCurrentPdfUrl] = React.useState('')
  // Available options for dropdowns
  
  const customerTypes = ['Individual', 'Retailer', 'Distributer', 'Dealer', 'Contractor', 'Business'];
  const leadSources = [
    'Website Inquiry',
    'Phone Call', 
    'Walk-in / Direct Visit',
    'Distributor / Dealer',
    'Existing Customer Referral',
    'Trade Show / Exhibition',
    'Tender / Government Contract',
    'Social Media (LinkedIn, Facebook, Instagram, etc.)',
    'Email Campaign',
    'Online Marketplace (IndiaMART, TradeIndia, etc.)',
    'Advertisement (Newspaper / Hoarding / Online Ads)',
    'Cold Call / Telemarketing',
    'Salesperson Visit',
    'Networking / Business Association'
  ];
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
    'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
    'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  // Load assigned leads for the logged-in salesperson/telecaller
  React.useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.SALESPERSON_ASSIGNED_LEADS_ME());
        const rows = res?.data || [];
        // Map API rows into existing UI customer shape
        const mapped = rows.map((r) => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          email: r.email || 'N/A',
          business: r.business || 'N/A',
          address: r.address || 'N/A',
          gstNo: r.gst_no || 'N/A',
          productName: r.product_type || 'N/A',
          state: r.state || 'N/A',
          enquiryBy: r.lead_source || 'N/A',
          customerType: r.customer_type || 'N/A',
          date: r.date ? new Date(r.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          salesStatus: r.sales_status || 'pending',
          salesStatusRemark: r.sales_status_remark || null,
          salesStatusDate: new Date(r.updated_at || r.created_at || Date.now()).toLocaleString(),
          latestQuotationUrl: '#',
          quotationsSent: 0,
          followUpLink: 'https://calendar.google.com/',
          whatsapp: r.whatsapp ? `+91${String(r.whatsapp).replace(/\D/g, '').slice(-10)}` : null,
          transferredLeads: 0,
          transferredTo: r.transferred_to || null,
          callDurationSeconds: r.call_duration_seconds || null,
          // Docs and payment info from DB (backend fields)
          quotationUrl: r.quotation_url || null,
          proformaInvoiceUrl: r.proforma_invoice_url || null,
          paymentReceiptUrl: r.payment_receipt_url || null,
          quotationCount: typeof r.quotation_count === 'number' ? r.quotation_count : (parseInt(r.quotation_count) || 0),
          paymentStatusDb: r.payment_status || null,
          paymentModeDb: r.payment_mode || null,
          // Follow-up fields from DB
          followUpStatus: r.follow_up_status || null,
          followUpRemark: r.follow_up_remark || null,
          followUpDate: r.follow_up_date ? new Date(r.follow_up_date).toISOString().split('T')[0] : null,
          followUpTime: r.follow_up_time || null,
        }));
        setCustomers(mapped);
      } catch (err) {
        console.error('Failed to load assigned leads:', err);
      }
    };
    fetchAssigned();
  }, []);

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setShowAddCustomer(true)
  }

  const handleView = (customer) => {
    setViewingCustomer(customer)
    setModalTab('details')
  }

  const handleQuotation = (customer) => {
    setSelectedCustomerForQuotation(customer)
    setShowCreateQuotation(true)
  }

  const handleCreateQuotation = () => {
    if (viewingCustomer) {
      setSelectedCustomerForQuotation(viewingCustomer)
      setShowCreateQuotation(true)
    }
  }

  // Save quotation to database
  const handleSaveQuotation = async (quotationData) => {
    try {
      const quotationPayload = {
        customerId: viewingCustomer.id,
        customerName: viewingCustomer.name,
        customerBusiness: viewingCustomer.business,
        customerPhone: viewingCustomer.phone,
        customerEmail: viewingCustomer.email,
        customerAddress: viewingCustomer.address,
        customerGstNo: viewingCustomer.gstNo,
        customerState: viewingCustomer.state,
        quotationDate: quotationData.quotationDate,
        validUntil: quotationData.validUntil,
        branch: quotationData.selectedBranch || 'ANODE',
        subtotal: quotationData.subtotal,
        taxRate: quotationData.taxRate || 18.00,
        taxAmount: quotationData.taxAmount,
        discountRate: quotationData.discountRate || 0,
        discountAmount: quotationData.discountAmount || 0,
        totalAmount: quotationData.total,
        items: quotationData.items.map(item => ({
          productName: item.productName || item.description || 'Product',
          description: item.description || item.productName || 'Product',
          hsnCode: item.hsn || '85446090',
          quantity: item.quantity,
          unit: item.unit || 'Nos',
          unitPrice: item.buyerRate || item.unitPrice,
          gstRate: item.gstRate || 18.00,
          taxableAmount: item.amount,
          gstAmount: (item.amount * (item.gstRate || 18.00) / 100),
          totalAmount: item.amount * (1 + (item.gstRate || 18.00) / 100)
        }))
      };

      console.log('Sending quotation payload:', quotationPayload);
      console.log('Viewing customer data:', viewingCustomer);
      const response = await quotationService.createQuotation(quotationPayload);
      console.log('Quotation response:', response);
      
      if (response.success) {
        // Add to local quotations state
        const newQuotation = {
          id: response.data.id,
          quotationNumber: response.data.quotation_number,
          customerId: viewingCustomer.id,
          quotationDate: response.data.quotation_date,
          total: response.data.total_amount,
          status: response.data.status,
          createdAt: response.data.created_at,
          items: response.data.items || []
        };
        
        setQuotations(prev => [newQuotation, ...prev]);
        
        // Show success message
        alert('Quotation created and saved to database successfully!');
        
        // Close the quotation modal
        setShowCreateQuotation(false);
      }
    } catch (error) {
      console.error('Error saving quotation:', error);
      alert('Failed to save quotation to database. Please try again.');
    }
  }

  const handleSendVerification = (customer) => {
    // Update customer's quotation status to pending
    const updatedCustomer = {
      ...customer,
      quotationStatus: 'pending',
      verificationSentAt: new Date().toISOString()
    }
    
    // Update the customer in the shared data
    updateCustomer(updatedCustomer)
    
    // Update the viewing customer if it's the same
    if (viewingCustomer && viewingCustomer.id === customer.id) {
      setViewingCustomer(updatedCustomer)
    }
    
    // Show success message
    alert('Verification request sent successfully! Status will be updated when the customer responds.')
  }



  const handleSavePI = (newPiData) => {
    setPiData(newPiData)
    setShowCreatePI(false)
    setSelectedCustomerForPI(null)
  }

  // Fetch PIs for a quotation
  const fetchPIsForQuotation = async (quotationId) => {
    try {
      const response = await proformaInvoiceService.getPIsByQuotation(quotationId)
      if (response && response.success) {
        setQuotationPIs(prev => ({
          ...prev,
          [quotationId]: response.data || []
        }))
      }
    } catch (error) {
      console.error('Error fetching PIs:', error)
    }
  }

  // Send PI for approval
  const handleSendPIForApproval = async (piId, quotationId) => {
    try {
      await proformaInvoiceService.updatePI(piId, { status: 'pending_approval' })
      alert('PI sent for approval!')
      await fetchPIsForQuotation(quotationId)
    } catch (error) {
      console.error('Error sending PI for approval:', error)
      alert('Failed to send PI for approval')
    }
  }

  // Delete PI
  const handleDeletePI = async (piId, quotationId) => {
    if (!confirm('Are you sure you want to delete this PI?')) return
    try {
      await proformaInvoiceService.deletePI(piId)
      alert('PI deleted successfully!')
      await fetchPIsForQuotation(quotationId)
    } catch (error) {
      console.error('Error deleting PI:', error)
      alert('Failed to delete PI')
    }
  }

  // View PI
  const handleViewPI = async (piId, quotation) => {
    try {
      // Fetch PI details
      const piResponse = await proformaInvoiceService.getPI(piId)
      if (!piResponse || !piResponse.success) {
        alert('Failed to fetch PI details')
        return
      }

      const pi = piResponse.data

      // Fetch complete quotation data
      const quotationResponse = await quotationService.getCompleteData(quotation.id)
      if (!quotationResponse || !quotationResponse.success) {
        alert('Failed to fetch quotation details')
        return
      }

      const completeQuotation = quotationResponse.data?.quotation || {}
      const quotationItems = completeQuotation.items || []

      // Map quotation items to PI format
      const mappedItems = quotationItems.map(item => ({
        id: item.id || Math.random(),
        description: item.product_name || item.productName || item.description || 'Product',
        subDescription: item.description || '',
        hsn: item.hsn_code || item.hsn || item.hsnCode || '85446090',
        dueOn: new Date().toISOString().split('T')[0],
        quantity: Number(item.quantity) || 1,
        unit: item.unit || 'Nos',
        rate: Number(item.buyer_rate || item.unit_price || item.unitPrice || 0),
        buyerRate: Number(item.unit_price || item.buyer_rate || item.unitPrice || 0),
        amount: Number(item.taxable_amount ?? item.amount ?? item.taxable ?? item.total_amount ?? item.total ?? 0),
        gstRate: Number(item.gst_rate ?? item.gstRate ?? 18),
        gstMultiplier: 1 + Number(item.gst_rate ?? item.gstRate ?? 18) / 100
      }))

      const subtotal = mappedItems.reduce((s, i) => s + (Number(i.amount) || 0), 0)
      const discountRate = Number(completeQuotation.discount_rate ?? completeQuotation.discountRate ?? 0)
      const discountAmount = Number(completeQuotation.discount_amount ?? completeQuotation.discountAmount ?? (subtotal * discountRate) / 100)
      const taxableAmount = Math.max(0, subtotal - discountAmount)
      const taxRate = Number(completeQuotation.tax_rate ?? completeQuotation.taxRate ?? 18)
      const taxAmount = Number(completeQuotation.tax_amount ?? completeQuotation.taxAmount ?? (taxableAmount * taxRate) / 100)
      const total = Number(completeQuotation.total_amount ?? completeQuotation.total ?? taxableAmount + taxAmount)

      const billTo = {
        business: viewingCustomer.business || completeQuotation.customer_business || completeQuotation.billTo?.business || '',
        address: viewingCustomer.address || completeQuotation.customer_address || completeQuotation.billTo?.address || '',
        phone: viewingCustomer.phone || completeQuotation.customer_phone || completeQuotation.billTo?.phone || '',
        gstNo: viewingCustomer.gstNo || completeQuotation.customer_gst_no || completeQuotation.billTo?.gstNo || '',
        state: viewingCustomer.state || completeQuotation.customer_state || completeQuotation.billTo?.state || ''
      }

      // Build PI preview data with dispatch details
      const piPreviewData = {
        quotationNumber: quotation.quotationNumber || pi.pi_number,
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
      }

      setSavedPiPreview({ 
        data: piPreviewData, 
        selectedBranch: completeQuotation.branch || selectedBranch 
      })
      setShowPIPreview(true)
    } catch (error) {
      console.error('Error viewing PI:', error)
      alert('Failed to load PI details')
    }
  }

  // Fetch PIs when viewing customer
  React.useEffect(() => {
    if (viewingCustomer && quotations && quotations.length > 0) {
      const customerQuotations = quotations.filter(q => q.customerId === viewingCustomer.id)
      customerQuotations.forEach(quotation => {
        if (quotation.id) {
          fetchPIsForQuotation(quotation.id)
        }
      })
    }
  }, [viewingCustomer, quotations])

  // Auto-fill PI form with approved quotation data
  React.useEffect(() => {
    if (showCreatePI && selectedCustomerForPI?.approvedQuotation) {
      if (!piNumber) setPiNumber(generatePiNumber())
      const approvedQuotation = selectedCustomerForPI.approvedQuotation;

      const populateFrom = async () => {
        try {
          // Always fetch full quotation to get items with authoritative values
          let source = approvedQuotation
          const res = await quotationService.getCompleteData(approvedQuotation.id)
          if (res && res.success) {
            const q = res.data?.quotation || {}
            source = {
              ...approvedQuotation,
              ...q,
              items: Array.isArray(q.items) ? q.items : []
            }
          }

          const mappedItems = (source.items || []).map(item => ({
            id: item.id || Math.random(),
            description: item.product_name || item.productName || item.description || 'Product',
            subDescription: item.description || '',
            hsn: item.hsn_code || item.hsn || item.hsnCode || '85446090',
            dueOn: new Date().toISOString().split('T')[0],
            quantity: Number(item.quantity) || 1,
            unit: item.unit || 'Nos',
            rate: Number(item.buyer_rate || item.unit_price || item.unitPrice || 0),
            buyerRate: Number(item.unit_price || item.buyer_rate || item.unitPrice || 0),
            amount: Number(
              item.taxable_amount ?? item.amount ?? item.taxable ?? item.total_amount ?? item.total ?? 0
            ),
            gstRate: Number(item.gst_rate ?? item.gstRate ?? 18),
            gstMultiplier: 1 + Number(item.gst_rate ?? item.gstRate ?? 18) / 100
          }))

          const subtotal = mappedItems.reduce((s, i) => s + (Number(i.amount) || 0), 0)
          const discountRate = Number(source.discount_rate ?? source.discountRate ?? 0)
          const discountAmount = Number(source.discount_amount ?? source.discountAmount ?? (subtotal * discountRate) / 100)
          const taxableAmount = Math.max(0, subtotal - discountAmount)
          const taxRate = Number(source.tax_rate ?? source.taxRate ?? 18)
          const taxAmount = Number(source.tax_amount ?? source.taxAmount ?? (taxableAmount * taxRate) / 100)
          const total = Number(source.total_amount ?? source.total ?? taxableAmount + taxAmount)

          const billTo = {
            business: selectedCustomerForPI.business || source.customer_business || source.billTo?.business || '',
            address: selectedCustomerForPI.address || source.customer_address || source.billTo?.address || '',
            phone: selectedCustomerForPI.phone || source.customer_phone || source.billTo?.phone || '',
            gstNo: selectedCustomerForPI.gstNo || source.customer_gst_no || source.billTo?.gstNo || '',
            state: selectedCustomerForPI.state || source.customer_state || source.billTo?.state || '',
            transport: source.billTo?.transport || null
          }

          const previewData = {
            quotationNumber: source.quotation_number || approvedQuotation.quotationNumber || '',
            items: mappedItems,
            subtotal,
            discountRate,
            discountAmount,
            taxableAmount,
            taxRate,
            taxAmount,
            total,
            billTo,
            shippingDetails: shippingDetails,
            dispatchMode: dispatchMode
          }

          setSavedPiPreview({ data: previewData, selectedBranch: source.branch || selectedBranch })

          setPiFormData({
            items: mappedItems.length > 0 ? mappedItems : [{
              id: 1,
              description: '',
              subDescription: '',
              hsn: '76141000',
              dueOn: new Date().toISOString().split('T')[0],
              quantity: 1,
              unit: 'MTR',
              rate: 0,
              amount: 0
            }],
            discountRate,
            customer: billTo
          })

          console.log('Auto-filled PI form with quotation (complete, normalized):', source);
          if (source.branch) setSelectedBranch(source.branch)
        } catch (e) {
          console.warn('Failed to fetch complete quotation; using available data', e?.message || e)
        }
      }

      populateFrom()
    }
  }, [showCreatePI, selectedCustomerForPI]);

  // Send a specific quotation for verification (persists to backend)
  const handleSendQuotation = async (quotation) => {
    try {
      if (!quotation.id) {
        alert('Please save the quotation first before sending for verification.')
        return
      }
      
      console.log('Sending quotation for verification:', quotation);
      const res = await quotationService.submitForVerification(quotation.id)
      console.log('Submit verification response:', res);
      
      if (res && res.success) {
        const newStatus = res.data?.status || 'pending';
        console.log('Updating quotation status to:', newStatus);
        
        setQuotations(prev => prev.map(q => (q.id === quotation.id ? {
          ...q,
          status: newStatus,
          verificationSentAt: new Date().toISOString()
        } : q)))
        
        alert('Sent to Department Head for verification.')
      } else {
        console.error('Submit verification failed:', res);
        alert('Failed to submit for verification. Please try again.')
      }
    } catch (e) {
      console.error('Error submitting quotation for verification:', e)
      alert('Failed to submit for verification. Please try again.')
    }
  }

  // Delete a specific quotation from the list and database
  const handleDeleteQuotation = async (quotation) => {
    if (!confirm('Are you sure you want to delete this quotation?')) return
    
    try {
      console.log('Attempting to delete quotation:', quotation);
      // If quotation has an ID, delete from database
      if (quotation.id) {
        console.log('Calling delete API for quotation ID:', quotation.id);
        const response = await quotationService.deleteQuotation(quotation.id);
        console.log('Delete API response:', response);
        if (!response.success) {
          alert('Failed to delete quotation from database. Please try again.');
          return;
        }
      }
      
      // Remove from local state
      setQuotations(prev => prev.filter(q => {
        const isSame = (q.quotationNumber && quotation.quotationNumber && q.quotationNumber === quotation.quotationNumber)
          || (q.id && quotation.id && q.id === quotation.id)
        return !isSame
      }))
      
      alert('Quotation deleted successfully!');
    } catch (error) {
      console.error('Error deleting quotation:', error);
      alert('Failed to delete quotation. Please try again.');
    }
  }


  const handleViewQuotation = async (quotation) => {
    try {
      // If quotation has an ID, fetch from database
      if (quotation.id) {
        const response = await quotationService.getQuotation(quotation.id);
        if (response.success) {
          const dbQuotation = response.data;
          const normalized = {
            id: dbQuotation.id,
            quotationNumber: dbQuotation.quotation_number,
            quotationDate: dbQuotation.quotation_date,
            validUpto: dbQuotation.valid_until,
            voucherNumber: `VOUCH-${Math.floor(1000 + Math.random() * 9000)}`,
            customer: {
              name: dbQuotation.customer_name,
              business: dbQuotation.customer_business,
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
              amount: i.taxable_amount,
              total: i.total_amount,
              hsn: i.hsn_code,
              gstRate: i.gst_rate
            })),
            subtotal: parseFloat(dbQuotation.subtotal),
            taxAmount: parseFloat(dbQuotation.tax_amount),
            total: parseFloat(dbQuotation.total_amount),
            status: dbQuotation.status
          };
          console.log('Normalized quotation data:', normalized);
          setQuotationPopupData(normalized);
          setShowQuotationPopup(true);
          return;
        }
      }
      
      // Fallback to local quotation data
      const normalized = {
        ...quotation,
        customer: {
          name: quotation.billTo?.business || viewingCustomer?.name,
          business: quotation.billTo?.business,
          address: quotation.billTo?.address,
          phone: quotation.billTo?.phone,
          gstNo: quotation.billTo?.gstNo,
          state: quotation.billTo?.state
        },
        items: (quotation.items || []).map(i => ({
          productName: i.productName || i.description,
          description: i.productName || i.description,
          quantity: i.quantity,
          unit: i.unit,
          buyerRate: i.buyerRate ?? i.unitPrice ?? i.rate,
          unitPrice: i.buyerRate ?? i.unitPrice ?? i.rate,
          amount: i.amount ?? i.total,
          total: i.amount ?? i.total,
          hsn: i.hsnCode || i.hsn,
          gstRate: i.gstRate
        })),
        subtotal: quotation.subtotal,
        taxAmount: quotation.taxAmount ?? quotation.tax,
        total: quotation.total
      };
      setQuotationPopupData(normalized);
      setShowQuotationPopup(true);
    } catch (error) {
      console.error('Error loading quotation:', error);
      alert('Failed to load quotation details. Please try again.');
    }
  }

  const handleViewLatestQuotation = (customer) => {
    // Find latest quotation created for this customer (most recent at index 0)
    const latest = quotations.find(q => q.customerId === customer.id) || quotations[0]
    if (!latest) return
    handleViewQuotation(latest)
  }

  // Wallet click removed

  // Receipt download removed

  const handleDownloadTemplate = () => {
    // Create CSV template with headers
    const headers = [
      'Name', 'Phone', 'WhatsApp', 'Email', 'Address', 'State', 'GST No', 
      'Product Name', 'Lead Source', 'Customer Type', 'Date'
    ]
    
    // Create sample data row with example values using new options
    const sampleData = [
      'John Doe', '9876543210', '9876543210', 'john.doe@email.com', 
      '123 Main Street, City', 'Karnataka', '29ABCDE1234F1Z5', 
      'XLPE Cable 1.5mm', 'Website Inquiry', 'Individual', '2024-01-15'
    ]
    
    const csvContent = [headers, sampleData].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'leads_template.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleImportLeads = () => {
    setShowImportModal(true)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
      setImportFile(file)
    } else {
      alert('Please select a valid CSV file')
    }
  }

  const processCSVImport = () => {
    if (!importFile) {
      alert('Please select a CSV file first')
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const csv = e.target.result
        const lines = csv.split('\n').filter(line => line.trim()) // Remove empty lines
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
        
        // Expected headers for validation
        const expectedHeaders = [
          'Name', 'Phone', 'WhatsApp', 'Email', 'Address', 'State', 'GST No', 
          'Product Name', 'Lead Source', 'Customer Type', 'Date'
        ]
        
        // Validate headers
        const headerValidation = validateHeaders(headers, expectedHeaders)
        if (!headerValidation.isValid) {
          alert(`CSV header validation failed:\n${headerValidation.errors.join('\n')}\n\nPlease use the correct template format.`)
          return
        }
        
        const importedCustomers = []
        const errors = []
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = parseCSVLine(lines[i])
            
            if (values.length >= headers.length) {
              // Validate and clean data
              const validatedData = validateCustomerData(values, headers, i + 1)
              
              if (validatedData.isValid) {
                const newCustomer = {
                  id: customers.length + importedCustomers.length + 1,
                  name: validatedData.data.name,
                  phone: validatedData.data.phone,
                  email: validatedData.data.email,
                  business: validatedData.data.business || 'N/A',
                  address: validatedData.data.address,
                  gstNo: validatedData.data.gstNo,
                  productName: validatedData.data.productName,
                  state: validatedData.data.state,
                  enquiryBy: validatedData.data.enquiryBy,
                  customerType: validatedData.data.customerType,
                  date: validatedData.data.date,
                  salesStatus: 'pending',
                  salesStatusRemark: 'Imported from CSV',
                  salesStatusDate: new Date().toISOString().split('T')[0],
                  latestQuotationUrl: "#",
                  quotationsSent: 0,
                  followUpLink: "https://calendar.google.com/",
                  whatsapp: validatedData.data.whatsapp,
                  transferredLeads: 0,
                  transferredFrom: null,
                  transferredTo: null
                }
                importedCustomers.push(newCustomer)
              } else {
                errors.push(`Row ${i + 1}: ${validatedData.errors.join(', ')}`)
              }
            } else {
              errors.push(`Row ${i + 1}: Insufficient data columns`)
            }
          }
        }
        
        if (importedCustomers.length > 0) {
          // Upload imported leads to API
          try {
            for (const customer of importedCustomers) {
              const formData = new FormData();
              formData.append('name', customer.name);
              formData.append('phone', customer.phone.replace(/\D/g, '').slice(-10));
              formData.append('whatsapp', customer.whatsapp ? customer.whatsapp.replace('+91','').replace(/\D/g, '').slice(-10) : customer.phone.replace(/\D/g, '').slice(-10));
              formData.append('email', customer.email === 'N/A' ? '' : customer.email);
              formData.append('business', customer.business || 'N/A');
              formData.append('address', customer.address || 'N/A');
              formData.append('state', customer.state || 'N/A');
              formData.append('gst_no', customer.gstNo === 'N/A' ? '' : customer.gstNo);
              formData.append('product_type', customer.productName || 'N/A');
              formData.append('lead_source', customer.enquiryBy || 'N/A');
              formData.append('customer_type', customer.customerType || 'N/A');
              formData.append('date', customer.date);
              formData.append('sales_status', customer.salesStatus || 'follow up');
              formData.append('sales_status_remark', customer.salesStatusRemark || 'Imported from CSV');
              
              await apiClient.postFormData(API_ENDPOINTS.LEADS_CREATE(), formData);
            }
            
            // Refresh leads from API after successful import
            await handleRefresh();
            
            const successMessage = errors.length > 0 
              ? `Successfully imported ${importedCustomers.length} leads. ${errors.length} rows had errors and were skipped.`
              : `Successfully imported ${importedCustomers.length} leads`;
            alert(successMessage);
            setShowImportModal(false);
            setImportFile(null);
          } catch (error) {
            console.error('Error uploading imported leads:', error);
            // Still update local state even if API fails
            setCustomers(prev => [...prev, ...importedCustomers]);
            alert(`Imported ${importedCustomers.length} leads locally. Some may not have been saved to server.`);
            setShowImportModal(false);
            setImportFile(null);
          }
        } else {
          const errorMessage = errors.length > 0 
            ? `CSV validation failed:\n\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n... and ${errors.length - 5} more errors` : ''}\n\nPlease check the format and try again.`
            : 'No valid data found in CSV file. Please check the format and try again.'
          alert(errorMessage)
        }
      } catch (error) {
        console.error('Error processing CSV:', error)
        alert('Error processing CSV file. Please check the format.')
      }
    }
    reader.readAsText(importFile)
  }

  // Helper function to parse CSV line properly (handles commas in quoted fields)
  const parseCSVLine = (line) => {
    const result = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current.trim())
    return result.map(v => v.replace(/"/g, '').trim())
  }

  // Helper function to validate headers
  const validateHeaders = (actualHeaders, expectedHeaders) => {
    const errors = []
    
    if (actualHeaders.length !== expectedHeaders.length) {
      errors.push(`Expected ${expectedHeaders.length} columns, found ${actualHeaders.length}`)
    }
    
    expectedHeaders.forEach((expected, index) => {
      if (actualHeaders[index] !== expected) {
        errors.push(`Column ${index + 1}: Expected "${expected}", found "${actualHeaders[index] || 'empty'}"`)
      }
    })
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Helper function to validate customer data
  const validateCustomerData = (values, headers, rowNumber) => {
    const errors = []
    const data = {}
    
    // Map values to field names
    headers.forEach((header, index) => {
      const value = values[index] || ''
      
      switch (header) {
        case 'Name':
          if (!value || value.length < 2) {
            errors.push('Name is required and must be at least 2 characters')
          }
          data.name = value
          break
          
        case 'Phone':
          const phoneRegex = /^[6-9]\d{9}$/
          if (!value || !phoneRegex.test(value)) {
            errors.push('Phone must be a valid 10-digit Indian mobile number')
          }
          data.phone = value
          break
          
        case 'WhatsApp':
          const whatsappRegex = /^[6-9]\d{9}$/
          if (value && !whatsappRegex.test(value)) {
            errors.push('WhatsApp must be a valid 10-digit Indian mobile number')
          }
          data.whatsapp = value ? `+91${value}` : null
          break
          
        case 'Email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (value && !emailRegex.test(value)) {
            errors.push('Email must be a valid email address')
          }
          data.email = value || 'N/A'
          break
          
        case 'Address':
          data.address = value || 'N/A'
          break
          
        case 'State':
          if (value && !states.includes(value)) {
            errors.push(`State must be one of: ${states.join(', ')}`)
          }
          data.state = value || 'N/A'
          break
          
        case 'GST No':
          const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/
          if (value && !gstRegex.test(value)) {
            errors.push('GST No must be a valid GST number format')
          }
          data.gstNo = value || 'N/A'
          break
          
        case 'Product Name':
          data.productName = value || 'N/A'
          break
          
        
          
        case 'Lead Source':
          if (value && !leadSources.includes(value)) {
            errors.push(`Lead Source must be one of: ${leadSources.join(', ')}`)
          }
          data.enquiryBy = value || 'N/A'
          break
          
        case 'Customer Type':
          if (value && !customerTypes.includes(value)) {
            errors.push(`Customer Type must be one of: ${customerTypes.join(', ')}`)
          }
          data.customerType = value || 'N/A'
          break
          
        case 'Date':
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/
          if (value && !dateRegex.test(value)) {
            errors.push('Date must be in YYYY-MM-DD format')
          }
          data.date = value || new Date().toISOString().split('T')[0]
          break
          
        default:
          data[header.toLowerCase().replace(/\s+/g, '')] = value
      }
    })
    
    return {
      isValid: errors.length === 0,
      data,
      errors
    }
  }

  const handleExportLeads = async () => {
    try {
      // Create a temporary div for PDF generation
      const tempDiv = document.createElement('div')
      tempDiv.style.padding = '20px'
      tempDiv.style.fontFamily = 'Arial, sans-serif'
      tempDiv.style.fontSize = '12px'
      tempDiv.style.color = '#000'
      tempDiv.style.backgroundColor = '#fff'
      
      // Add title
      tempDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px;">
          <h1 style="margin: 0; font-size: 24px; color: #1f2937;">ANOCAB LEADS REPORT</h1>
          <p style="margin: 5px 0 0 0; color: #6b7280;">Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">#</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Name & Phone</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Address</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">GST No.</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Product Name</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">State</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Lead Source</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Customer Type</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Date</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Sales Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredCustomers.map((customer, index) => `
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${customer.id}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">
                  <div style="font-weight: bold;">${customer.name}</div>
                  <div style="color: #6b7280; font-size: 11px;">${customer.phone}</div>
                  ${customer.whatsapp ? `<div style="color: #059669; font-size: 11px;">WhatsApp: ${customer.whatsapp}</div>` : ''}
                </td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${customer.address || 'N/A'}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${customer.gstNo || 'N/A'}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${customer.productName || 'N/A'}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${customer.state || 'N/A'}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${customer.enquiryBy || 'N/A'}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${customer.customerType || 'N/A'}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${customer.date}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">
                  <span style="
                    padding: 2px 6px; 
                    border-radius: 4px; 
                    font-size: 10px; 
                    font-weight: bold;
                    ${customer.connected?.status === 'Connected' ? 'background-color: #dcfce7; color: #166534;' : 
                      customer.connected?.status === 'Follow Up' ? 'background-color: #fef3c7; color: #92400e;' : 
                      'background-color: #fee2e2; color: #991b1b;'}
                  ">
                    ${customer.connected?.status || 'Not Connected'}
                  </span>
                </td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">
                  <span style="
                    padding: 2px 6px; 
                    border-radius: 4px; 
                    font-size: 10px; 
                    font-weight: bold;
                    ${customer.finalInfo?.status === 'closed' ? 'background-color: #dcfce7; color: #166534;' : 
                      customer.finalInfo?.status === 'next_meeting' ? 'background-color: #dbeafe; color: #1e40af;' : 
                      'background-color: #f3f4f6; color: #374151;'}
                  ">
                    ${customer.finalInfo?.status === 'closed' ? 'Closed' : 
                      customer.finalInfo?.status === 'next_meeting' ? 'Next Meeting' : 
                      customer.finalStatus || 'New'}
                  </span>
                  </td>
                  )}
                  </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 11px;">
          <p>Total Records: ${filteredCustomers.length}</p>
          <p>Generated by ANOCAB CRM System</p>
        </div>
      `
      
      // Temporarily add to DOM
      document.body.appendChild(tempDiv)
      
      // PDF generation options
      const opt = {
        margin: 0.5,
        filename: `anocab-leads-report-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1,
          useCORS: true,
          logging: false
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'landscape' 
        }
      }
      
      // Generate and download the PDF
      await html2pdf().set(opt).from(tempDiv).save()
      
      // Clean up
      document.body.removeChild(tempDiv)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  const generateQuotationPDF = async (quotationData, customer, returnBlob = false) => {
    // Create a simple test content first
    const tempDiv = document.createElement('div')
    tempDiv.style.position = 'fixed'
    tempDiv.style.left = '0'
    tempDiv.style.top = '0'
    tempDiv.style.width = '800px'
    tempDiv.style.backgroundColor = 'white'
    tempDiv.style.padding = '20px'
    tempDiv.style.fontFamily = 'Arial, sans-serif'
    tempDiv.style.fontSize = '14px'
    tempDiv.style.color = 'black'
    tempDiv.style.zIndex = '9999'
    tempDiv.style.visibility = 'hidden'
    
    // Simple test content
    tempDiv.innerHTML = `
      <div style="width: 100%; background: white; padding: 20px;">
        <h1 style="color: black; font-size: 24px; margin-bottom: 20px;">ANODE ELECTRIC PVT. LTD.</h1>
        <h2 style="color: black; font-size: 18px; margin-bottom: 15px;">QUOTATION</h2>
        
        <div style="border: 2px solid black; padding: 15px; margin-bottom: 20px;">
          <h3 style="color: black; margin-bottom: 10px;">Company Details</h3>
          <p style="color: black; margin: 5px 0;">MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES</p>
          <p style="color: black; margin: 5px 0;">KHASRA NO. 805/5, PLOT NO. 10, IT PARK</p>
          <p style="color: black; margin: 5px 0;">BARGI HILLS, JABALPUR - 482003</p>
          <p style="color: black; margin: 5px 0;">MADHYA PRADESH, INDIA</p>
          <p style="color: black; margin: 5px 0;">Tel: 6262002116, 6262002113</p>
          <p style="color: black; margin: 5px 0;">Email: info@anocab.com</p>
        </div>
        
        <div style="border: 1px solid black; padding: 15px; margin-bottom: 20px;">
          <h3 style="color: black; margin-bottom: 10px;">Quotation Details</h3>
          <p style="color: black; margin: 5px 0;"><strong>Date:</strong> ${quotationData?.quotationDate || new Date().toLocaleDateString()}</p>
          <p style="color: black; margin: 5px 0;"><strong>Quotation No:</strong> ${quotationData?.quotationNumber || 'ANO/25-26/001'}</p>
          <p style="color: black; margin: 5px 0;"><strong>Valid Until:</strong> ${quotationData?.validUpto || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
        </div>
        
        <div style="border: 1px solid black; padding: 15px; margin-bottom: 20px;">
          <h3 style="color: black; margin-bottom: 10px;">Bill To:</h3>
          <p style="color: black; margin: 5px 0;"><strong>${quotationData?.billTo?.business || customer?.business || 'Customer Name'}</strong></p>
          <p style="color: black; margin: 5px 0;">${quotationData?.billTo?.address || customer?.address || 'Customer Address'}</p>
          <p style="color: black; margin: 5px 0;"><strong>Phone:</strong> ${quotationData?.billTo?.phone || customer?.phone || 'Phone Number'}</p>
          <p style="color: black; margin: 5px 0;"><strong>GST:</strong> ${quotationData?.billTo?.gstNo || customer?.gstNo || 'GST Number'}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="border: 1px solid black; padding: 8px; text-align: left;">Sr.</th>
              <th style="border: 1px solid black; padding: 8px; text-align: left;">Description</th>
              <th style="border: 1px solid black; padding: 8px; text-align: center;">Qty</th>
              <th style="border: 1px solid black; padding: 8px; text-align: right;">Rate</th>
              <th style="border: 1px solid black; padding: 8px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid black; padding: 8px;">1</td>
              <td style="border: 1px solid black; padding: 8px;">Sample Product</td>
              <td style="border: 1px solid black; padding: 8px; text-align: center;">1</td>
              <td style="border: 1px solid black; padding: 8px; text-align: right;">1000.00</td>
              <td style="border: 1px solid black; padding: 8px; text-align: right;">1000.00</td>
            </tr>
            <tr style="background-color: #f0f0f0;">
              <td style="border: 1px solid black; padding: 8px;" colspan="4"><strong>Total</strong></td>
              <td style="border: 1px solid black; padding: 8px; text-align: right;"><strong>1000.00</strong></td>
            </tr>
          </tbody>
        </table>
        
        <div style="text-align: right; margin-top: 30px;">
          <p style="color: black; margin: 5px 0;">For ANODE ELECTRIC PRIVATE LIMITED</p>
          <p style="color: black; margin: 5px 0;">Authorized Signatory</p>
        </div>
      </div>
    `
    
    // Add the temporary div to the document
    document.body.appendChild(tempDiv)
    
    // Debug: Check if element is visible
    console.log('Element created:', tempDiv)
    console.log('Element innerHTML length:', tempDiv.innerHTML.length)
    console.log('Element offsetHeight:', tempDiv.offsetHeight)

    // Wait a bit for the element to render
    await new Promise(resolve => setTimeout(resolve, 100))

    try {
      // Generate the PDF
      const element = tempDiv
      const opt = {
        margin: 0.5,
        filename: `quotation-${customer.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1,
          useCORS: true,
          logging: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait'
        }
      }

      if (returnBlob) {
        // Generate and return the PDF as a blob
        const result = await html2pdf().set(opt).from(element).outputPdf('blob')
        return result
      } else {
        // Generate and download the PDF
        await html2pdf().set(opt).from(element).save()
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw error
    } finally {
      // Clean up
      if (document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv)
      }
    }

    // The PDF generation is now handled in the try-catch block above
    // No additional cleanup needed here as it's handled in the finally block
  }

  const handleAddCustomer = () => {
    setEditingCustomer(null) // Clear editing customer when adding new
    setShowAddCustomer(true)
  }

  const handleSaveCustomer = async (newCustomerData) => {
    if (editingCustomer) {
      // Update existing customer
      const updatedCustomer = {
        ...editingCustomer,
        name: newCustomerData.customerName,
        phone: newCustomerData.mobileNumber,
        email: newCustomerData.email || "N/A",
        business: newCustomerData.business,
        location: newCustomerData.state, // Use state as location
        gstNo: newCustomerData.gstNumber || "N/A",
        address: newCustomerData.address,
        state: newCustomerData.state,
        productName: newCustomerData.productName,
        customerType: newCustomerData.customerType,
        enquiryBy: newCustomerData.leadSource,
        date: newCustomerData.date,
        // Status values from form
        salesStatus: newCustomerData.salesStatus,
        salesStatusRemark: newCustomerData.salesStatus === 'next_meeting' && newCustomerData.meetingDate && newCustomerData.meetingTime 
          ? `${newCustomerData.meetingDate} AT ${newCustomerData.meetingTime}` 
          : newCustomerData.salesStatusRemark,
        salesStatusDate: editingCustomer.salesStatusDate,
        callDurationSeconds: newCustomerData.callDurationSeconds,
        whatsapp: newCustomerData.whatsappNumber ? `+91${newCustomerData.whatsappNumber}` : editingCustomer.whatsapp,
        // Update transferred leads data
        transferredLeads: newCustomerData.transferredLeads || 0,
        transferredFrom: newCustomerData.transferredFrom || null,
        transferredTo: newCustomerData.transferredTo || null,
        // Follow-up fields
        followUpStatus: newCustomerData.followUpStatus || null,
        followUpRemark: newCustomerData.followUpRemark || null,
        followUpDate: newCustomerData.followUpDate || null,
        followUpTime: newCustomerData.followUpTime || null,
      }
      
      setCustomers(prev => prev.map(customer => 
        customer.id === editingCustomer.id ? updatedCustomer : customer
      ))

      // Persist update to backend with FormData for file upload
      const formData = new FormData();
      formData.append('name', updatedCustomer.name);
      formData.append('phone', updatedCustomer.phone);
      formData.append('email', updatedCustomer.email === 'N/A' ? '' : updatedCustomer.email);
      formData.append('business', updatedCustomer.business);
      formData.append('address', updatedCustomer.address);
      formData.append('gst_no', updatedCustomer.gstNo === 'N/A' ? '' : updatedCustomer.gstNo);
      formData.append('product_type', updatedCustomer.productName);
      formData.append('state', updatedCustomer.state);
      formData.append('lead_source', updatedCustomer.enquiryBy);
      formData.append('customer_type', updatedCustomer.customerType);
      formData.append('date', updatedCustomer.date);
      formData.append('whatsapp', updatedCustomer.whatsapp ? updatedCustomer.whatsapp.replace('+91','') : '');
      formData.append('sales_status', updatedCustomer.salesStatus);
      formData.append('sales_status_remark', updatedCustomer.salesStatusRemark);
      formData.append('call_duration_seconds', updatedCustomer.callDurationSeconds || '');
      formData.append('transferred_to', updatedCustomer.transferredTo || '');
      // Follow-up fields
      formData.append('follow_up_status', updatedCustomer.followUpStatus || '');
      formData.append('follow_up_remark', updatedCustomer.followUpRemark || '');
      formData.append('follow_up_date', updatedCustomer.followUpDate || '');
      formData.append('follow_up_time', updatedCustomer.followUpTime || '');
      
      // Add call recording file if present
      if (newCustomerData.callRecordingFile) {
        formData.append('call_recording', newCustomerData.callRecordingFile);
      }

      try {
        await apiClient.putFormData(API_ENDPOINTS.SALESPERSON_LEAD_BY_ID(editingCustomer.id), formData);
      } catch (err) {
        console.error('Failed to update salesperson lead:', err);
      }
    } else {
      // Add new customer
      const newCustomer = {
        id: customers.length + 1,
        name: newCustomerData.customerName,
        phone: newCustomerData.mobileNumber,
        email: newCustomerData.email || "N/A",
        business: newCustomerData.business,
        location: newCustomerData.state, // Use state as location
        gstNo: newCustomerData.gstNumber || "N/A",
        address: newCustomerData.address,
        state: newCustomerData.state,
        enquiryBy: newCustomerData.leadSource,
        productName: newCustomerData.productName,
        customerType: newCustomerData.customerType,
        date: newCustomerData.date,
        // Set status values from form
        salesStatus: newCustomerData.salesStatus,
        salesStatusRemark: newCustomerData.salesStatus === 'next_meeting' && newCustomerData.meetingDate && newCustomerData.meetingTime 
          ? `${newCustomerData.meetingDate} AT ${newCustomerData.meetingTime}` 
          : newCustomerData.salesStatusRemark,
        salesStatusDate: new Date().toISOString().split('T')[0],
        latestQuotationUrl: "#",
        quotationsSent: 0,
        followUpLink: "https://calendar.google.com/",
        whatsapp: newCustomerData.whatsappNumber ? `+91${newCustomerData.whatsappNumber}` : null,
        transferredLeads: newCustomerData.transferredLeads || 0,
        transferredFrom: newCustomerData.transferredFrom || null,
        transferredTo: newCustomerData.transferredTo || null,
      }
      
      setCustomers(prev => [...prev, newCustomer])
    }
    
    setShowAddCustomer(false)
    setEditingCustomer(null)
  }

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      const res = await apiClient.get(API_ENDPOINTS.SALESPERSON_ASSIGNED_LEADS_ME());
      const rows = res?.data || [];
      const mapped = rows.map((r) => ({
        id: r.id,
        name: r.name,
        phone: r.phone,
        email: r.email || 'N/A',
        business: r.business || 'N/A',
        address: r.address || 'N/A',
        gstNo: r.gst_no || 'N/A',
        productName: r.product_type || 'N/A',
        state: r.state || 'N/A',
        enquiryBy: r.lead_source || 'N/A',
        customerType: r.customer_type || 'N/A',
        date: r.date ? new Date(r.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        salesStatus: r.sales_status || 'pending',
        salesStatusRemark: r.sales_status_remark || null,
        salesStatusDate: new Date(r.updated_at || r.created_at || Date.now()).toLocaleString(),
        latestQuotationUrl: '#',
        quotationsSent: 0,
        followUpLink: 'https://calendar.google.com/',
        whatsapp: r.whatsapp ? `+91${String(r.whatsapp).replace(/\D/g, '').slice(-10)}` : null,
        transferredLeads: 0,
        transferredTo: r.transferred_to || null,
        callDurationSeconds: r.call_duration_seconds || null,
        // Docs and payment info from DB (backend fields)
        quotationUrl: r.quotation_url || null,
        proformaInvoiceUrl: r.proforma_invoice_url || null,
        paymentReceiptUrl: r.payment_receipt_url || null,
        quotationCount: typeof r.quotation_count === 'number' ? r.quotation_count : (parseInt(r.quotation_count) || 0),
        paymentStatusDb: r.payment_status || null,
        paymentModeDb: r.payment_mode || null,
        // Follow-up fields from DB
        followUpStatus: r.follow_up_status || null,
        followUpRemark: r.follow_up_remark || null,
        followUpDate: r.follow_up_date ? new Date(r.follow_up_date).toISOString().split('T')[0] : null,
        followUpTime: r.follow_up_time || null,
      }));
      setCustomers(mapped)
    } catch (err) {
      console.error('Failed to refresh assigned leads:', err)
    } finally {
      setIsRefreshing(false)
      const refreshButton = document.querySelector('[data-refresh-btn]')
      if (refreshButton) {
        refreshButton.style.transform = 'scale(1.1)'
        setTimeout(() => {
          refreshButton.style.transform = 'scale(1)'
        }, 200)
      }
    }
  }

  // Filter customers based on search query and advanced filters
  const filteredCustomers = React.useMemo(() => {
    let result = [...customers];
    
    // Apply search query filter if exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(customer => {
        const searchFields = [
          customer.name?.toLowerCase() || '',
          customer.phone?.toLowerCase() || '',
          customer.email?.toLowerCase() || '',
          customer.business?.toLowerCase() || '',
          customer.state?.toLowerCase() || '',
          customer.gstNo?.toLowerCase() || '',
          customer.productName?.toLowerCase() || '',
          customer.customerType?.toLowerCase() || '',
          customer.enquiryBy?.toLowerCase() || '',
          customer.date?.toLowerCase() || '',
          customer.address?.toLowerCase() || ''
        ];
        return searchFields.some(field => field.includes(query));
      });
    }
    
    // Apply advanced filters
    if (advancedFilters.tag) {
      result = result.filter(customer => 
        customer.customerType?.toLowerCase() === advancedFilters.tag.toLowerCase()
      );
    }
    
    if (advancedFilters.followUpStatus) {
      result = result.filter(customer => 
        customer.followUpStatus?.toLowerCase() === advancedFilters.followUpStatus.toLowerCase()
      );
    }
    
    if (advancedFilters.salesStatus) {
      result = result.filter(customer => 
        customer.salesStatus?.toLowerCase() === advancedFilters.salesStatus.toLowerCase()
      );
    }
    
    if (advancedFilters.state) {
      result = result.filter(customer => 
        customer.state?.toLowerCase() === advancedFilters.state.toLowerCase()
      );
    }
    
    if (advancedFilters.leadSource) {
      result = result.filter(customer => 
        customer.enquiryBy?.toLowerCase() === advancedFilters.leadSource.toLowerCase()
      );
    }
    
    if (advancedFilters.productType) {
      result = result.filter(customer => 
        customer.productName?.toLowerCase().includes(advancedFilters.productType.toLowerCase())
      );
    }
    
    if (advancedFilters.dateFrom) {
      result = result.filter(customer => {
        const customerDate = new Date(customer.date);
        const filterDate = new Date(advancedFilters.dateFrom);
        return customerDate >= filterDate;
      });
    }
    
    if (advancedFilters.dateTo) {
      result = result.filter(customer => {
        const customerDate = new Date(customer.date);
        const filterDate = new Date(advancedFilters.dateTo);
        return customerDate <= filterDate;
      });
    }
    
    return result;
  }, [customers, searchQuery, advancedFilters])

  // Pagination calculations
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, advancedFilters]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Pagination functions
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  return (
    <main className={`flex-1 overflow-auto p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="mb-6">

        <div className="flex items-center justify-between gap-4">
          {/* Search Box */}
          <div className="flex items-center gap-3">
            <div className="flex">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-4 py-2 border border-blue-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
              <button className="px-3 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="relative">
              <button 
                id="filter-button"
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`p-2 rounded-md border inline-flex items-center justify-center relative ${showFilterPanel ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                title="Filters"
              >
                <Filter className="h-4 w-4" />
                {Object.values(enabledFilters).some(Boolean) && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-medium text-white bg-blue-500 rounded-full">
                    {Object.values(enabledFilters).filter(Boolean).length}
                  </span>
                )}
              </button>
              
              {/* Filter Panel */}
              {showFilterPanel && (
                <div 
                  id="filter-panel"
                  className="fixed right-4 top-32 z-[100] bg-white rounded-lg shadow-2xl border border-gray-200 w-96 max-h-[calc(100vh-150px)] overflow-hidden flex flex-col"
                >
                  <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Filter className="h-5 w-5 text-blue-600" />
                      Filters
                    </h3>
                    <button
                      onClick={() => setShowFilterPanel(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="p-4 space-y-3 overflow-y-auto flex-1">
                    {/* Tag Filter */}
                    <div className="border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 p-3 bg-gray-50">
                        <input
                          type="checkbox"
                          id="filter-tag"
                          checked={enabledFilters.tag}
                          onChange={() => toggleFilterSection('tag')}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor="filter-tag" className="flex-1 text-sm font-medium text-gray-700 cursor-pointer">
                          Filter by Tag
                        </label>
                      </div>
                      {enabledFilters.tag && (
                        <div className="p-3 border-t border-gray-200">
                          <select
                            value={advancedFilters.tag}
                            onChange={(e) => handleAdvancedFilterChange('tag', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">All Tags</option>
                            {getUniqueFilterOptions.tags.map(tag => (
                              <option key={tag} value={tag}>{tag}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => setShowCreateTagModal(true)}
                            className="mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-md border border-dashed border-gray-300 text-xs font-medium text-gray-600 hover:bg-gray-50"
                          >
                            <Plus className="h-3 w-3" />
                            Create New Tag
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Follow Up Status Filter */}
                    <div className="border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 p-3 bg-gray-50">
                        <input
                          type="checkbox"
                          id="filter-followup"
                          checked={enabledFilters.followUpStatus}
                          onChange={() => toggleFilterSection('followUpStatus')}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor="filter-followup" className="flex-1 text-sm font-medium text-gray-700 cursor-pointer">
                          Filter by Follow Up Status
                        </label>
                      </div>
                      {enabledFilters.followUpStatus && (
                        <div className="p-3 border-t border-gray-200">
                          <select
                            value={advancedFilters.followUpStatus}
                            onChange={(e) => handleAdvancedFilterChange('followUpStatus', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">All Statuses</option>
                            {getUniqueFilterOptions.followUpStatuses.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    
                    {/* Sales Status Filter */}
                    <div className="border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 p-3 bg-gray-50">
                        <input
                          type="checkbox"
                          id="filter-sales"
                          checked={enabledFilters.salesStatus}
                          onChange={() => toggleFilterSection('salesStatus')}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor="filter-sales" className="flex-1 text-sm font-medium text-gray-700 cursor-pointer">
                          Filter by Sales Status
                        </label>
                      </div>
                      {enabledFilters.salesStatus && (
                        <div className="p-3 border-t border-gray-200">
                          <select
                            value={advancedFilters.salesStatus}
                            onChange={(e) => handleAdvancedFilterChange('salesStatus', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">All Statuses</option>
                            {getUniqueFilterOptions.salesStatuses.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    
                    {/* State Filter */}
                    <div className="border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 p-3 bg-gray-50">
                        <input
                          type="checkbox"
                          id="filter-state"
                          checked={enabledFilters.state}
                          onChange={() => toggleFilterSection('state')}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor="filter-state" className="flex-1 text-sm font-medium text-gray-700 cursor-pointer">
                          Filter by State
                        </label>
                      </div>
                      {enabledFilters.state && (
                        <div className="p-3 border-t border-gray-200">
                          <select
                            value={advancedFilters.state}
                            onChange={(e) => handleAdvancedFilterChange('state', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">All States</option>
                            {getUniqueFilterOptions.states.map(state => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    
                    {/* Lead Source Filter */}
                    <div className="border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 p-3 bg-gray-50">
                        <input
                          type="checkbox"
                          id="filter-source"
                          checked={enabledFilters.leadSource}
                          onChange={() => toggleFilterSection('leadSource')}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor="filter-source" className="flex-1 text-sm font-medium text-gray-700 cursor-pointer">
                          Filter by Lead Source
                        </label>
                      </div>
                      {enabledFilters.leadSource && (
                        <div className="p-3 border-t border-gray-200">
                          <select
                            value={advancedFilters.leadSource}
                            onChange={(e) => handleAdvancedFilterChange('leadSource', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">All Sources</option>
                            {getUniqueFilterOptions.leadSources.map(source => (
                              <option key={source} value={source}>{source}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    
                    {/* Product Type Filter */}
                    <div className="border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 p-3 bg-gray-50">
                        <input
                          type="checkbox"
                          id="filter-product"
                          checked={enabledFilters.productType}
                          onChange={() => toggleFilterSection('productType')}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor="filter-product" className="flex-1 text-sm font-medium text-gray-700 cursor-pointer">
                          Filter by Product
                        </label>
                      </div>
                      {enabledFilters.productType && (
                        <div className="p-3 border-t border-gray-200">
                          <select
                            value={advancedFilters.productType}
                            onChange={(e) => handleAdvancedFilterChange('productType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">All Products</option>
                            {getUniqueFilterOptions.products.map(product => (
                              <option key={product} value={product}>{product}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    
                    {/* Date Range Filter */}
                    <div className="border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 p-3 bg-gray-50">
                        <input
                          type="checkbox"
                          id="filter-date"
                          checked={enabledFilters.dateRange}
                          onChange={() => toggleFilterSection('dateRange')}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor="filter-date" className="flex-1 text-sm font-medium text-gray-700 cursor-pointer">
                          Filter by Date Range
                        </label>
                      </div>
                      {enabledFilters.dateRange && (
                        <div className="p-3 border-t border-gray-200 space-y-2">
                          <input
                            type="date"
                            value={advancedFilters.dateFrom}
                            onChange={(e) => handleAdvancedFilterChange('dateFrom', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="From Date"
                          />
                          <input
                            type="date"
                            value={advancedFilters.dateTo}
                            onChange={(e) => handleAdvancedFilterChange('dateTo', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="To Date"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex gap-2">
                    <button
                      onClick={clearAdvancedFilters}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-white transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowFilterPanel(false)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={handleAddCustomer}
              className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Customer
            </button>
            <button 
              onClick={handleImportLeads}
              className="px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 inline-flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Import
            </button>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              data-refresh-btn
              className="h-9 w-9 inline-flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setShowColumnModal(true)}
              className="h-9 w-9 inline-flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
              title="Column Filter"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${
                  isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50/50'
                }`}>
                  {columnVisibility.id && (
                    <th className={`text-left py-4 px-4 font-medium text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>#</th>
                  )}
                  {columnVisibility.namePhone && (
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <User className={`h-4 w-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                      Name & Phone
                    </div>
                  </th>
                  )}
                  {columnVisibility.business && (
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Building2 className={`h-4 w-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                      Business
                    </div>
                  </th>
                  )}
                  {columnVisibility.address && (
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <MapPin className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                      Address
                    </div>
                  </th>
                  )}
                  {columnVisibility.gstNo && (
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <FileText className={`h-4 w-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                      GST No.
                    </div>
                  </th>
                  )}
                  {columnVisibility.productName && (
                  <th className={`text-left py-2 px-4 font-medium text-sm w-48 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Package className={`h-4 w-4 ${isDarkMode ? 'text-violet-400' : 'text-violet-500'}`} />
                      Product Name
                    </div>
                  </th>
                  )}
                  
                  {columnVisibility.state && (
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Map className={`h-4 w-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                      State
                    </div>
                  </th>
                  )}
                  {columnVisibility.leadSource && (
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Globe className={`h-4 w-4 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`} />
                      Lead Source
                    </div>
                  </th>
                  )}
                  {columnVisibility.customerType && (
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <User className={`h-4 w-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                      Customer Type
                    </div>
                  </th>
                  )}
                  {columnVisibility.date && (
                  <th className={`text-left py-2 px-4 font-medium text-sm w-32 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <FileText className={`h-4 w-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                      Date
                    </div>
                  </th>
                  )}
                  {columnVisibility.salesStatus && (
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <BadgeCheck className={`h-4 w-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      Sales Status
                    </div>
                  </th>
                  )}
                  {columnVisibility.followUp && (
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Clock className={`h-4 w-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      Follow Up
                    </div>
                  </th>
                  )}
                  {columnVisibility.transferredTo && (
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft className={`h-4 w-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                      Transferred To
                    </div>
                  </th>
                  )}
                  {columnVisibility.actions && (
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Pencil className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      Action
                    </div>
                  </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="14" className={`py-12 text-center ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <div className="flex flex-col items-center gap-2">
                        <Search className={`h-8 w-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-300'}`} />
                        <p className="text-sm">
                          {searchQuery ? `No customers found for "${searchQuery}"` : 'No customers available'}
                        </p>
                        {searchQuery && (
                          <button 
                            onClick={() => setSearchQuery('')}
                            className={`text-sm underline ${
                              isDarkMode 
                                ? 'text-blue-400 hover:text-blue-300' 
                                : 'text-blue-600 hover:text-blue-700'
                            }`}
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className={`border-b transition-colors ${
                    isDarkMode 
                      ? 'border-gray-700 odd:bg-gray-800 even:bg-gray-800/50 hover:bg-gray-700' 
                      : 'border-gray-50 odd:bg-white even:bg-gray-50/40 hover:bg-white'
                  }`}>
                    {columnVisibility.id && (
                      <td className={`py-4 px-4 text-sm font-medium ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}>{customer.id}</td>
                    )}
                    {columnVisibility.namePhone && (
                    <td className="py-4 px-4">
                      <div>
                        <div className={`font-medium text-sm ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>{customer.name}</div>
                        <div className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{customer.phone}</div>
                        {customer.whatsapp && (
                          <div className={`text-xs mt-1 ${
                            isDarkMode ? 'text-green-400' : 'text-green-600'
                          }`}>
                            <a href={`https://wa.me/${customer.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" /> WhatsApp
                            </a>
                          </div>
                        )}
                        {customer.email && customer.email !== "N/A" && (
                          <div className={`text-xs mt-1 ${
                            isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                          }`}>
                            <button 
                              onClick={() => window.open(`mailto:${customer.email}?subject=Follow up from ANOCAB&body=Dear ${customer.name},%0D%0A%0D%0AThank you for your interest in our products.%0D%0A%0D%0ABest regards,%0D%0AANOCAB Team`, '_blank')}
                              className={`inline-flex items-center gap-1 transition-colors ${
                                isDarkMode 
                                  ? 'hover:text-cyan-300' 
                                  : 'hover:text-cyan-700'
                              }`}
                              title="Send Email"
                            >
                              <Mail className="h-3 w-3" /> {customer.email}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    )}
                    {columnVisibility.business && (
                    <td className={`py-4 px-4 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="font-medium">{customer.business}</div>
                    </td>
                    )}
                    {columnVisibility.address && (
                    <td className={`py-4 px-4 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="font-medium">{customer.address}</div>
                    </td>
                    )}
                    {columnVisibility.gstNo && (
                      <td className={`py-4 px-4 text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <div className="font-medium">{customer.gstNo}</div>
                      </td>
                    )}
                    {columnVisibility.productName && (
                      <td className={`py-4 px-4 text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <div className="font-medium">{customer.productName}</div>
                      </td>
                    )}
                    
                    {columnVisibility.state && (
                    <td className={`py-4 px-4 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="font-medium">{customer.state}</div>
                    </td>
                    )}
                    {columnVisibility.leadSource && (
                      <td className={`py-4 px-4 text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <div className="font-medium">{customer.enquiryBy}</div>
                      </td>
                    )}
                    {columnVisibility.customerType && (
                    <td className={`py-4 px-4 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="font-medium">{customer.customerType || 'N/A'}</div>
                    </td>
                    )}
                    {columnVisibility.date && (
                      <td className={`py-4 px-4 text-sm w-32 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <div className="font-medium whitespace-nowrap">{customer.date}</div>
                      </td>
                    )}
                    {columnVisibility.salesStatus && (
                    <td className={`py-4 px-4 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="flex flex-col">
                        <span className={
                          customer.salesStatus === 'connected'
                            ? `inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border ${
                                isDarkMode 
                                  ? 'bg-green-900 text-green-300 border-green-700' 
                                  : 'bg-green-50 text-green-700 border-green-200'
                              }`
                            : customer.salesStatus === 'not_connected'
                            ? `inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border ${
                                isDarkMode 
                                  ? 'bg-red-900 text-red-300 border-red-700' 
                                  : 'bg-red-50 text-red-700 border-red-200'
                              }`
                            : customer.salesStatus === 'next_meeting'
                            ? `inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border ${
                                isDarkMode 
                                  ? 'bg-blue-900 text-blue-300 border-blue-700' 
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`
                            : customer.salesStatus === 'closed'
                            ? `inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border ${
                                isDarkMode 
                                  ? 'bg-gray-700 text-gray-300 border-gray-600' 
                                  : 'bg-gray-50 text-gray-700 border-gray-200'
                              }`
                            : customer.salesStatus === 'order_confirmed'
                            ? `inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border ${
                                isDarkMode 
                                  ? 'bg-green-900 text-green-300 border-green-700' 
                                  : 'bg-green-50 text-green-700 border-green-200'
                              }`
                            : customer.salesStatus === 'other'
                            ? `inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border ${
                                isDarkMode 
                                  ? 'bg-purple-900 text-purple-300 border-purple-700' 
                                  : 'bg-purple-50 text-purple-700 border-purple-200'
                              }`
                            : `inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border ${
                                isDarkMode 
                                  ? 'bg-yellow-900 text-yellow-300 border-yellow-700' 
                                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }`
                        }>
                          {customer.salesStatus === 'connected' ? 'Connected' :
                           customer.salesStatus === 'not_connected' ? 'Not Connected' :
                           customer.salesStatus === 'next_meeting' ? 'Next Meeting' :
                           customer.salesStatus === 'closed' ? 'Closed' :
                           customer.salesStatus === 'order_confirmed' ? 'Order Confirmed' :
                           customer.salesStatus === 'open' ? 'Open' :
                           customer.salesStatus === 'pending' ? 'Pending' :
                           customer.salesStatus === 'other' ? 'Other' :
                           customer.salesStatus || 'Pending'}
                        </span>
                        {customer.salesStatusRemark && (
                          <span className={`text-xs mt-1 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>{customer.salesStatusRemark}</span>
                        )}
                        {customer.salesStatusDate && (
                          <span className={`text-xs ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>{customer.salesStatusDate}</span>
                        )}
                      </div>
                    </td>
                    )}
                    {columnVisibility.followUp && (
                    <td className={`py-4 px-4 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="flex flex-col gap-1">
                        {customer.followUpStatus && (
                          <span className={`inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border ${
                            isDarkMode 
                              ? 'bg-yellow-900 text-yellow-300 border-yellow-700' 
                              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            {toTitleStatus(customer.followUpStatus)}
                          </span>
                        )}
                        {customer.followUpRemark && (
                          <span className={`text-xs ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {customer.followUpRemark}
                          </span>
                        )}
                        {customer.followUpDate && (
                          <span className={`text-xs ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {new Date(customer.followUpDate).toLocaleDateString('en-IN', { 
                              day: '2-digit', 
                              month: '2-digit', 
                              year: 'numeric' 
                            })}
                            {customer.followUpTime && `, ${customer.followUpTime}`}
                          </span>
                        )}
                        {!customer.followUpStatus && !customer.followUpRemark && !customer.followUpDate && (
                          <span className={`text-xs ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            PENDING
                          </span>
                        )}
                      </div>
                    </td>
                    )}
                    {columnVisibility.transferredTo && (
                    <td className="py-4 px-4">
                          <div className="flex flex-col">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.transferredTo 
                            ? (isDarkMode 
                                ? 'bg-indigo-900 text-indigo-300' 
                                : 'bg-indigo-100 text-indigo-800')
                            : (isDarkMode 
                                ? 'bg-gray-700 text-gray-400' 
                                : 'bg-gray-100 text-gray-600')
                        }`}>
                              <ArrowRightLeft className="h-3 w-3 mr-1" />
                          {customer.transferredTo || 'Not Transferred'}
                            </span>
                        {customer.transferredLeads > 0 && (
                          <div className={`text-xs mt-1 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <div>From: {customer.transferredFrom}</div>
                            <div>To: {customer.transferredTo}</div>
                          </div>
                        )}
                      </div>
                    </td>
                    )}
                    {columnVisibility.actions && (
                    <td className="py-4 px-4">
                      <div className="flex flex-row items-center gap-2">
                        <button onClick={() => handleEdit(customer)} className={`p-1.5 rounded-md relative group ${
                          isDarkMode 
                            ? 'hover:bg-gray-700' 
                            : 'hover:bg-gray-100'
                        }`} title="Edit Customer">
                          <Pencil className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                          <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none ${
                            isDarkMode ? 'bg-gray-600' : 'bg-gray-800'
                          }`}>
                            Edit Customer
                          </span>
                        </button>
                        <button onClick={() => handleView(customer)} className={`p-1.5 rounded-md relative group ${
                          isDarkMode 
                            ? 'hover:bg-gray-700' 
                            : 'hover:bg-gray-100'
                        }`} title="View Details">
                          <Eye className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                          <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none ${
                            isDarkMode ? 'bg-gray-600' : 'bg-gray-800'
                          }`}>
                            View Details
                          </span>
                        </button>
                      </div>
                    </td>
                    )}
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Column Filter Modal */}
      {showColumnModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Column Filter</h3>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowColumnModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(columnVisibility).map(([key, value]) => (
                  <label key={key} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!value}
                      onChange={(e) => setColumnVisibility(prev => ({ ...prev, [key]: e.target.checked }))}
                    />
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded border" onClick={() => setColumnVisibility(defaultColumns)}>Reset</button>
                  <button className="px-3 py-1.5 rounded border" onClick={() => setColumnVisibility(Object.fromEntries(Object.keys(columnVisibility).map(k => [k, true])))}>Show All</button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded" onClick={() => setShowColumnModal(false)}>Cancel</button>
                  <button className="px-3 py-1.5 rounded bg-blue-600 text-white" onClick={() => setShowColumnModal(false)}>Apply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up Picker Modal */}
      {showFollowUpPicker && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Set Follow-up Category</h3>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowFollowUpPicker(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {['Connected','Not Connected','Today\'s Meeting','Converted','Closed'].map((cat) => (
                <button
                  key={cat}
                  onClick={async () => {
                    try {
                      const formData = new FormData()
                      formData.append('sales_status', toMachineStatus(cat))
                      await apiClient.putFormData(API_ENDPOINTS.SALESPERSON_LEAD_BY_ID(showFollowUpPicker), formData)
                      setShowFollowUpPicker(null)
                      await fetchAssigned()
                    } catch (e) {
                      console.error('Failed to update follow-up:', e)
                      alert('Failed to update follow-up status')
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded border border-gray-200 hover:bg-gray-50"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {filteredCustomers.length > 0 && (
        <div className="mt-6 flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">entries</span>
            </div>
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredCustomers.length)} of {filteredCustomers.length} entries
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* First Page */}
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>

            {/* Previous Page */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {(() => {
                const pages = [];
                const maxVisiblePages = 5;
                let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                
                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-3 py-1 text-sm border rounded ${
                        i === currentPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
                return pages;
              })()}
            </div>

            {/* Next Page */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>

            {/* Last Page */}
            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>
      )}
      {viewingCustomer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-0">
            <div className="px-6 pt-5">
              <h2 className="text-lg font-semibold text-gray-900">{viewingCustomer.name}</h2>
              <p className="text-sm text-gray-500">Quick view and actions</p>
            </div>
            <div className="mt-4 px-3">
              <div className="flex items-center gap-2 border-b border-gray-200 px-3">
                <button className={cx("px-3 py-2 text-sm flex items-center gap-1", modalTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900')} onClick={() => setModalTab('details')}>
                  <User className="h-4 w-4" />
                  Details
                </button>
                <button className={cx("px-3 py-2 text-sm flex items-center gap-1", modalTab === 'quotation_status' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900')} onClick={() => setModalTab('quotation_status')}>
                  <FileText className="h-4 w-4" />
                  Quotation & Payment
                </button>
              </div>
            </div>
            <div className="px-6 py-4 max-h-[70vh] overflow-auto">
              {modalTab === 'details' && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Customer Name</span><span className="font-medium text-gray-900">{viewingCustomer.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Business Name</span><span className="font-medium text-gray-900">{viewingCustomer.business}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">GST</span><span className="font-medium text-gray-900">{viewingCustomer.gstNo || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Address</span><span className="font-medium text-gray-900 text-right max-w-[60%]">{viewingCustomer.address || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Contact</span><span className="font-medium text-gray-900">{viewingCustomer.phone}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium text-gray-900">{viewingCustomer.email}</span></div>
                </div>
              )}
              {modalTab === 'quotation_status' && (
                <div className="space-y-4 text-sm">
                  {/* Quotation Details - TOP */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">Quotation Details</h3>
                      <button
                        onClick={() => {
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 1000);
                        }}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center gap-1"
                        title="Refresh quotation status"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Refresh
                      </button>
                    </div>
                    {(() => {
                      const customerQuotations = quotations.filter(q => q.customerId === viewingCustomer.id)
                      if (customerQuotations.length === 0) {
                        return (
                          <div className="text-center py-8 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-sm">No quotations created yet</p>
                            <p className="text-xs text-gray-400 mt-1">Create a quotation to see it here</p>
                          </div>
                        )
                      }
                      return (
                        <div className="rounded-md border border-gray-200 divide-y">
                        {customerQuotations.map((quotation, index) => (
                          <div key={quotation.id || index} className="p-3">
                          <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <div>
                                <span className="text-gray-700">
                                  {index === 0 ? 'Latest Quotation:' : `Quotation #${customerQuotations.length - index}:`}
                                </span>
                                <p className="text-sm font-medium text-gray-900">{quotation.quotationNumber || `ANQ${quotation.id || index + 1}`}</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-gray-500">{quotation.quotationDate || new Date().toLocaleDateString()}</p>
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    quotation.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    quotation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    quotation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {quotation.status === 'approved' ? '✅ Approved' :
                                     quotation.status === 'rejected' ? '❌ Rejected' :
                                     quotation.status === 'pending' ? '⏳ Pending' :
                                     quotation.status || 'Draft'}
                                  </span>
                                </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                                onClick={() => handleViewQuotation(quotation)}
                            className="text-blue-600 underline inline-flex items-center gap-1 hover:text-blue-700"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>
                              {piStore[quotation.quotationNumber] && (
                          <button 
                                  onClick={() => {
                                    const saved = piStore[quotation.quotationNumber]
                                    setSavedPiPreview(saved)
                                    setShowPIPreview(true)
                                  }}
                                  className="p-1 rounded-full bg-purple-600 text-white hover:bg-purple-700"
                                  title="View PI"
                                >
                                  <FileText className="h-3 w-3" />
                          </button>
                              )}
                          
                          {/* Show Create PI only for approved and not deal-closed; hide send/delete when deal closed */}
                          {isApprovedQuotation(quotation) && !isPaymentCompleted(quotation) ? (
                            <button 
                              onClick={() => {
                                // Set the approved quotation for PI creation
                                setSelectedCustomerForPI({
                                  ...viewingCustomer,
                                  approvedQuotation: quotation
                                });
                                setShowCreatePI(true);
                              }}
                              className="text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1 bg-green-600 text-white hover:bg-green-700"
                              title="Create PI for approved quotation"
                            >
                              <FileText className="h-3 w-3" />
                              Create PI
                            </button>
                          ) : !isPaymentCompleted(quotation) ? (
                            <button 
                              onClick={() => handleSendQuotation(quotation)}
                              className={`text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1 ${
                                quotation.status === 'pending'
                                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                  : quotation.status === 'rejected'
                                  ? 'bg-red-600 text-white cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                              disabled={quotation.status === 'rejected'}
                            >
                              {quotation.status === 'pending' 
                                ? <Clock className="h-3 w-3" />
                                : quotation.status === 'rejected'
                                ? <XCircle className="h-3 w-3" />
                                : <Send className="h-3 w-3" />
                              }
                              {quotation.status === 'pending' ? 'Pending' : 
                                quotation.status === 'rejected' ? 'Rejected' : 'Send'}
                            </button>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1 bg-emerald-100 text-emerald-700">
                              Deal Closed
                            </span>
                          )}
                          
                          {/* Only show delete button for non-approved quotations */}
                          {!isApprovedQuotation(quotation) && !isPaymentCompleted(quotation) && (
                            <button 
                                onClick={() => handleDeleteQuotation(quotation)}
                                className="p-1 rounded-full bg-red-600 text-white hover:bg-red-700"
                                title="Delete quotation"
                              >
                                <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* PI List for this quotation - Show directly below */}
                      {quotationPIs[quotation.id] && quotationPIs[quotation.id].length > 0 && (
                        <div className="mt-2 pl-4 border-l-2 border-purple-200 space-y-2">
                          {quotationPIs[quotation.id].map((pi) => (
                                <div key={pi.id} className="p-2 bg-purple-50 rounded flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-3.5 w-3.5 text-purple-600" />
                                    <div>
                                      <p className="text-xs font-medium text-gray-900">{pi.pi_number}</p>
                                      <p className="text-xs text-gray-500">{new Date(pi.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                      pi.status === 'approved' ? 'bg-green-100 text-green-800' :
                                      pi.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                                      pi.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {pi.status === 'approved' ? '✅ Approved' :
                                       pi.status === 'pending_approval' ? '⏳ Pending Approval' :
                                       pi.status === 'pending' ? '📄 Draft' :
                                       pi.status || 'Draft'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleViewPI(pi.id, quotation)}
                                      className="text-blue-600 text-xs underline hover:text-blue-700"
                                    >
                                      View
                                    </button>
                                    {pi.status !== 'approved' && pi.status !== 'pending_approval' && (
                                      <>
                                        <button
                                          onClick={() => handleSendPIForApproval(pi.id, quotation.id)}
                                          className="text-xs px-2 py-1 rounded bg-yellow-600 text-white hover:bg-yellow-700"
                                        >
                                          Send for Approval
                                        </button>
                                        <button
                                          onClick={() => handleDeletePI(pi.id, quotation.id)}
                                          className="p-1 rounded bg-red-600 text-white hover:bg-red-700"
                                          title="Delete PI"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                          ))}
                        </div>
                      )}
                      </div>
                        ))}
                          </div>
                      )
                    })()}
                  </div>

                  {/* Payment UI removed */}
                  
                  
                </div>
              )}
            </div>
            <div className="px-6 pb-4 flex justify-end gap-3">
              <button className="px-3 py-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50" onClick={() => setViewingCustomer(null)}>Close</button>
              {modalTab === 'quotation_status' && (
                <button 
                  onClick={handleCreateQuotation}
                  className="px-3 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 inline-flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Create Quotation
                </button>
              )}
              {modalTab === 'payment_timeline' && (
                <button 
                  onClick={() => setShowCreatePI(true)}
                  className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Create PI
                </button>
              )}
              {modalTab === 'payment_timeline' && (
                <button
                  onClick={() => setShowPIPreview(true)}
                  className="px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print PDF
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PI Preview Modal */}
      {showPIPreview && (
        <PIPreviewModal
          open={showPIPreview}
          onClose={() => {
            setShowPIPreview(false)
            setSelectedCustomerForPI(null) // Clear selection when closing
          }}
          piPreviewData={savedPiPreview}
          selectedBranch={savedPiPreview?.selectedBranch || selectedBranch}
          companyBranches={companyBranches}
          approvedQuotationId={selectedCustomerForPI?.approvedQuotation?.id}
          viewingCustomerId={viewingCustomer?.id}
          onPICreated={() => {
            const quotationId = selectedCustomerForPI?.approvedQuotation?.id
            if (quotationId) fetchPIsForQuotation(quotationId)
          }}
        />
      )}
      
      {showAddCustomer && (
        <AddCustomerForm 
          onClose={() => {
            setShowAddCustomer(false)
            setEditingCustomer(null)
          }}
          onSave={handleSaveCustomer}
          editingCustomer={editingCustomer}
        />
      )}
      
      {showCreateQuotation && selectedCustomerForQuotation && (
        <CreateQuotationForm 
          customer={selectedCustomerForQuotation}
          user={user}
          onClose={() => {
            setShowCreateQuotation(false)
            setSelectedCustomerForQuotation(null)
          }}
          onSave={handleSaveQuotation}
        />
      )}

      {showCreatePI && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create Performa Invoice</h2>
              <button
                onClick={() => setShowCreatePI(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Branch Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Branch</label>
                  <select 
                    value={selectedBranch} 
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ANODE">ANODE ELECTRIC PRIVATE LIMITED</option>
                    <option value="SAMRIDDHI_CABLE">SAMRIDDHI CABLE INDUSTRIES PRIVATE LIMITED</option>
                    <option value="SAMRIDDHI_INDUSTRIES">SAMRIDDHI INDUSTRIES</option>
                  </select>
                </div>

                {/* Invoice Details - Minimal */}
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PI Number</label>
                    <input
                      type="text"
                      value={piNumber || generatePiNumber()}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Number</label>
                    <input
                      type="text"
                      value={selectedCustomerForPI?.approvedQuotation?.quotationNumber || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dated</label>
                    <input
                      type="date"
                      value={new Date().toISOString().split('T')[0]}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dispatched Through</label>
                    <select 
                      value={dispatchMode}
                      onChange={(e)=> setDispatchMode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="BY TRANSPORT">BY TRANSPORT</option>
                      <option value="BY COURIER">BY COURIER</option>
                      <option value="BY HAND">BY HAND</option>
                      <option value="BY POST">BY POST</option>
                      <option value="BY TRAIN">BY TRAIN</option>
                      <option value="BY BUS">BY BUS</option>
                    </select>
                  </div>
                </div>

                {/* Dynamic dispatch detail fields */}
                <div className="grid grid-cols-4 gap-4 mt-3">
                  {dispatchMode === 'BY TRANSPORT' && (
                    <React.Fragment>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transport Name</label>
                        <input type="text" value={shippingDetails.transportName}
                          onChange={(e)=> setShippingDetails(prev=>({...prev, transportName: e.target.value}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                        <input type="text" value={shippingDetails.vehicleNumber}
                          onChange={(e)=> setShippingDetails(prev=>({...prev, vehicleNumber: e.target.value}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transport ID</label>
                        <input type="text" value={shippingDetails.transportId}
                          onChange={(e)=> setShippingDetails(prev=>({...prev, transportId: e.target.value}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">L.R. No.</label>
                        <input type="text" value={shippingDetails.lrNo}
                          onChange={(e)=> setShippingDetails(prev=>({...prev, lrNo: e.target.value}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </React.Fragment>
                  )}
                  {dispatchMode === 'BY COURIER' && (
                    <React.Fragment>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Courier Name</label>
                        <input type="text" value={shippingDetails.courierName}
                          onChange={(e)=> setShippingDetails(prev=>({...prev, courierName: e.target.value}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Consignment No</label>
                        <input type="text" value={shippingDetails.consignmentNo}
                          onChange={(e)=> setShippingDetails(prev=>({...prev, consignmentNo: e.target.value}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </React.Fragment>
                  )}
                  {dispatchMode === 'BY HAND' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Handed Over To</label>
                      <input type="text" value={shippingDetails.byHand}
                        onChange={(e)=> setShippingDetails(prev=>({...prev, byHand: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  )}
                  {dispatchMode === 'BY POST' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Post Service</label>
                      <input type="text" value={shippingDetails.postService}
                        onChange={(e)=> setShippingDetails(prev=>({...prev, postService: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  )}
                  {(dispatchMode === 'BY TRAIN' || dispatchMode === 'BY BUS') && (
                    <React.Fragment>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Carrier Name</label>
                        <input type="text" value={shippingDetails.carrierName}
                          onChange={(e)=> setShippingDetails(prev=>({...prev, carrierName: e.target.value}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number</label>
                        <input type="text" value={shippingDetails.carrierNumber}
                          onChange={(e)=> setShippingDetails(prev=>({...prev, carrierNumber: e.target.value}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </React.Fragment>
                  )}
                </div>

                {/* Valid Upto Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid Upto</label>
                  <input
                    type="date"
                    value={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                  />
                </div>

                {/* Customer Information (hidden) */}
                {false && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                      <input
                        type="text"
                        value={piFormData.customer.business}
                        onChange={(e) => setPiFormData(prev => ({
                          ...prev,
                          customer: { ...prev.customer, business: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter business name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={piFormData.customer.phone}
                        onChange={(e) => setPiFormData(prev => ({
                          ...prev,
                          customer: { ...prev.customer, phone: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        value={piFormData.customer.address}
                        onChange={(e) => setPiFormData(prev => ({
                          ...prev,
                          customer: { ...prev.customer, address: e.target.value }
                        }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter complete address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                      <input
                        type="text"
                        value={piFormData.customer.gstNo}
                        onChange={(e) => setPiFormData(prev => ({
                          ...prev,
                          customer: { ...prev.customer, gstNo: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter GST number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={piFormData.customer.state}
                        onChange={(e) => setPiFormData(prev => ({
                          ...prev,
                          customer: { ...prev.customer, state: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>
                </div>
                )}

                {/* Items Section (hidden) */}
                {false && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Items</h3>
                    <button 
                      type="button"
                      onClick={() => {
                        const newItem = {
                          id: Date.now(),
                          description: '',
                          subDescription: '',
                          hsn: '76141000',
                          dueOn: new Date().toISOString().split('T')[0],
                          quantity: 1,
                          unit: 'MTR',
                          rate: 0,
                          amount: 0
                        }
                        setPiFormData(prev => ({
                          ...prev,
                          items: [...prev.items, newItem]
                        }))
                      }}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </button>
                  </div>
                  
                <div className="space-y-4">
                  {/** Lock item fields when PI is created from an approved quotation */}
                  {/** This ensures products auto-capture exactly from quotation */}
                  {/** and users cannot accidentally change them here. */}
                  {/** Read-only mode is controlled by the presence of selectedCustomerForPI.approvedQuotation */}
                  {/** (i.e., when PI comes from an approved quotation). */}
                    {piFormData.items.map((item, index) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-medium text-gray-900">Item {index + 1}</h4>
                          {piFormData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setPiFormData(prev => ({
                                  ...prev,
                                  items: prev.items.filter((_, i) => i !== index)
                                }))
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            {isPiLocked ? (
                              <input
                                type="text"
                                value={item.description}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                              />
                            ) : (
                              <select 
                                value={item.description}
                                onChange={(e) => {
                                  const updatedItems = [...piFormData.items]
                                  updatedItems[index].description = e.target.value
                                  setPiFormData(prev => ({ ...prev, items: updatedItems }))
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Description</option>
                                <option value="COVERED CONDUCTOR 34 SQMM">COVERED CONDUCTOR 34 SQMM</option>
                                <option value="XLPE CABLE 1.5MM">XLPE CABLE 1.5MM</option>
                                <option value="ACSR CONDUCTOR 50MM²">ACSR CONDUCTOR 50MM²</option>
                                <option value="AAAC CONDUCTOR 70MM²">AAAC CONDUCTOR 70MM²</option>
                                <option value="ALUMINIUM WIRE">ALUMINIUM WIRE</option>
                                <option value="COPPER WIRE">COPPER WIRE</option>
                                <option value="ELECTRICAL PANEL">ELECTRICAL PANEL</option>
                                <option value="TRANSFORMER">TRANSFORMER</option>
                              </select>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sub Description</label>
                            {isPiLocked ? (
                              <input
                                type="text"
                                value={item.subDescription}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                              />
                            ) : (
                              <select 
                                value={item.subDescription}
                                onChange={(e) => {
                                  const updatedItems = [...piFormData.items]
                                  updatedItems[index].subDescription = e.target.value
                                  setPiFormData(prev => ({ ...prev, items: updatedItems }))
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Sub Description</option>
                                <option value="COVERED CONDUCTOR 34SQMM XLPE 3 LAYER">COVERED CONDUCTOR 34SQMM XLPE 3 LAYER</option>
                                <option value="XLPE CABLE 1.5MM SINGLE CORE">XLPE CABLE 1.5MM SINGLE CORE</option>
                                <option value="XLPE CABLE 1.5MM MULTI CORE">XLPE CABLE 1.5MM MULTI CORE</option>
                                <option value="ACSR CONDUCTOR 50MM² 7 STRAND">ACSR CONDUCTOR 50MM² 7 STRAND</option>
                                <option value="ACSR CONDUCTOR 50MM² 19 STRAND">ACSR CONDUCTOR 50MM² 19 STRAND</option>
                                <option value="AAAC CONDUCTOR 70MM² 7 STRAND">AAAC CONDUCTOR 70MM² 7 STRAND</option>
                                <option value="AAAC CONDUCTOR 70MM² 19 STRAND">AAAC CONDUCTOR 70MM² 19 STRAND</option>
                                <option value="ALUMINIUM WIRE 4MM">ALUMINIUM WIRE 4MM</option>
                                <option value="ALUMINIUM WIRE 6MM">ALUMINIUM WIRE 6MM</option>
                                <option value="COPPER WIRE 2.5MM">COPPER WIRE 2.5MM</option>
                                <option value="COPPER WIRE 4MM">COPPER WIRE 4MM</option>
                                <option value="ELECTRICAL PANEL 3 PHASE">ELECTRICAL PANEL 3 PHASE</option>
                                <option value="ELECTRICAL PANEL SINGLE PHASE">ELECTRICAL PANEL SINGLE PHASE</option>
                                <option value="TRANSFORMER 11KV/440V">TRANSFORMER 11KV/440V</option>
                                <option value="TRANSFORMER 33KV/11KV">TRANSFORMER 33KV/11KV</option>
                              </select>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">HSN/SAC</label>
                            <input
                              type="text"
                              value={item.hsn}
                              onChange={(e) => {
                                const updatedItems = [...piFormData.items]
                                updatedItems[index].hsn = e.target.value
                                setPiFormData(prev => ({ ...prev, items: updatedItems }))
                              }}
                              readOnly={isPiLocked}
                              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isPiLocked ? 'bg-gray-50 text-gray-600' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due On</label>
                            <input
                              type="date"
                              value={item.dueOn}
                              onChange={(e) => {
                                const updatedItems = [...piFormData.items]
                                updatedItems[index].dueOn = e.target.value
                                setPiFormData(prev => ({ ...prev, items: updatedItems }))
                              }}
                              readOnly={isPiLocked}
                              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isPiLocked ? 'bg-gray-50 text-gray-600' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const updatedItems = [...piFormData.items]
                                updatedItems[index].quantity = parseFloat(e.target.value) || 0
                                updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate
                                setPiFormData(prev => ({ ...prev, items: updatedItems }))
                              }}
                              readOnly={isPiLocked}
                              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isPiLocked ? 'bg-gray-50 text-gray-600' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                            <select 
                              value={item.unit}
                              onChange={(e) => {
                                const updatedItems = [...piFormData.items]
                                updatedItems[index].unit = e.target.value
                                setPiFormData(prev => ({ ...prev, items: updatedItems }))
                              }}
                              disabled={isPiLocked}
                              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isPiLocked ? 'bg-gray-50 text-gray-600' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
                            >
                              <option value="MTR">MTR</option>
                              <option value="KG">KG</option>
                              <option value="PCS">PCS</option>
                              <option value="SET">SET</option>
                              <option value="BOX">BOX</option>
                              <option value="ROLL">ROLL</option>
                              <option value="BUNDLE">BUNDLE</option>
                              <option value="LOT">LOT</option>
                              <option value="TON">TON</option>
                              <option value="QUINTAL">QUINTAL</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) => {
                                const updatedItems = [...piFormData.items]
                                updatedItems[index].rate = parseFloat(e.target.value) || 0
                                updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate
                                setPiFormData(prev => ({ ...prev, items: updatedItems }))
                              }}
                              readOnly={isPiLocked}
                              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isPiLocked ? 'bg-gray-50 text-gray-600' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Auto-Calculated)</label>
                            <input
                              type="text"
                              value={item.amount.toFixed(2)}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                              style={{backgroundColor: '#f9fafb', color: '#6b7280'}}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                )}

                {/* Totals Section (hidden) */}
                {false && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={piFormData.discountRate}
                      onChange={(e) => {
                        const discountRate = parseFloat(e.target.value) || 0
                        setPiFormData(prev => ({ ...prev, discountRate }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IGST (18%) - Auto-Calculated</label>
                    <input
                      type="text"
                      value={(() => {
                        const subtotal = piFormData.items.reduce((sum, item) => sum + item.amount, 0)
                        const discount = (subtotal * (piFormData.discountRate || 0)) / 100
                        const taxable = Math.max(0, subtotal - discount)
                        return (taxable * 0.18).toFixed(2)
                      })()}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                      style={{backgroundColor: '#f9fafb', color: '#6b7280'}}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount - Auto-Calculated</label>
                    <input
                      type="text"
                      value={(() => {
                        const subtotal = piFormData.items.reduce((sum, item) => sum + item.amount, 0)
                        const discount = (subtotal * (piFormData.discountRate || 0)) / 100
                        const taxable = Math.max(0, subtotal - discount)
                        const tax = taxable * 0.18
                        return (taxable + tax).toFixed(2)
                      })()}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                      style={{backgroundColor: '#f9fafb', color: '#6b7280'}}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount in Words - Auto-Generated</label>
                    <input
                      type="text"
                      value={`INR ${numberToWords(Math.floor(piFormData.items.reduce((sum, item) => sum + item.amount, 0) * 1.18))} Only`}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                      style={{backgroundColor: '#f9fafb', color: '#6b7280'}}
                    />
                  </div>
                </div>
                )}

                {/* Bank Details (hidden) */}
                {false && (
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 text-blue-800">🏦 Bank Details (Separate Fields)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder's Name</label>
                      <input
                        type="text"
                        defaultValue="ANODE ELECTRIC PVT. LTD."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="ICICI BANK">ICICI BANK</option>
                        <option value="HDFC BANK">HDFC BANK</option>
                        <option value="SBI BANK">SBI BANK</option>
                        <option value="AXIS BANK">AXIS BANK</option>
                        <option value="KOTAK MAHINDRA BANK">KOTAK MAHINDRA BANK</option>
                        <option value="PUNJAB NATIONAL BANK">PUNJAB NATIONAL BANK</option>
                        <option value="BANK OF BARODA">BANK OF BARODA</option>
                        <option value="CANARA BANK">CANARA BANK</option>
                        <option value="UNION BANK">UNION BANK</option>
                        <option value="INDIAN BANK">INDIAN BANK</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        defaultValue="777705336601"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">📍 Branch (Separate Field)</label>
                      <input
                        type="text"
                        defaultValue="NIWARGANJ"
                        className="w-full px-3 py-2 border-2 border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">🔢 IFSC Code (Separate Field)</label>
                      <input
                        type="text"
                        defaultValue="ICIC0007345"
                        className="w-full px-3 py-2 border-2 border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">🏷️ Bank Code (Separate Field)</label>
                      <input
                        type="text"
                        defaultValue="36601"
                        className="w-full px-3 py-2 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50"
                      />
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreatePI(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Show PI preview modal
                  setShowPIPreview(true)
                  // Close the create PI modal
                  setShowCreatePI(false)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 inline-flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview & Save PI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Import Leads</h3>
                <button 
                  onClick={() => {
                    setShowImportModal(false)
                    setImportFile(null)
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-600">
                    Upload a CSV file with lead data. Make sure the format matches the template.
                  </p>
                  <button
                    onClick={handleDownloadTemplate}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download Template
                  </button>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        {importFile ? importFile.name : 'Click to upload CSV file'}
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        or drag and drop
                      </span>
                    </label>
                    <input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowImportModal(false)
                    setImportFile(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={processCSVImport}
                  disabled={!importFile}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import Leads
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Tag Modal */}
      {showCreateTagModal && (
        <div className="fixed inset-0 z-[100] overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Tag</h3>
                <button
                  onClick={() => {
                    setShowCreateTagModal(false);
                    setNewTagName('');
                    setSelectedLeadsForTag([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={isCreatingTag}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag Name
                </label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="e.g. Dealer, Contractor, Distributor"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                  disabled={isCreatingTag}
                />
                <p className="mt-2 text-xs text-gray-500">
                  This tag will be saved as customer type in the database
                </p>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Leads to Tag ({selectedLeadsForTag.length} selected)
                  </label>
                  <button
                    onClick={handleSelectAllLeadsForTag}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    disabled={isCreatingTag}
                  >
                    {selectedLeadsForTag.length === customers.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                  {customers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No leads available
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {customers.map((customer) => (
                        <label
                          key={customer.id}
                          className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
                            isCreatingTag ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedLeadsForTag.includes(customer.id)}
                            onChange={() => handleToggleLeadForTag(customer.id)}
                            disabled={isCreatingTag}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {customer.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {customer.phone} • {customer.business}
                                </p>
                              </div>
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                {customer.customerType}
                              </span>
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
              <p className="text-sm text-gray-600">
                {selectedLeadsForTag.length > 0 
                  ? `${selectedLeadsForTag.length} lead(s) will be tagged as "${newTagName || '...'}"`
                  : 'Select leads to tag'}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowCreateTagModal(false);
                    setNewTagName('');
                    setSelectedLeadsForTag([]);
                  }}
                  disabled={isCreatingTag}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTag}
                  disabled={!newTagName.trim() || selectedLeadsForTag.length === 0 || isCreatingTag}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {isCreatingTag ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Tag'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Popup Modal */}
      {showQuotationPopup && quotationPopupData && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Latest Quotation - {quotationPopupData.customer.name}</h3>
                <button 
                  onClick={() => setShowQuotationPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close quotation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Quotation Content */}
              <QuotationPreview
                data={{
                  quotationNumber: quotationPopupData.quotationNumber,
                  quotationDate: quotationPopupData.quotationDate,
                  validUpto: quotationPopupData.validUpto,
                  voucherNumber: quotationPopupData.voucherNumber,
                  billTo: {
                    business: quotationPopupData.customer.name || quotationPopupData.customer.business,
                    address: quotationPopupData.customer.address,
                    phone: quotationPopupData.customer.phone,
                    gstNo: quotationPopupData.customer.gstNo,
                    state: quotationPopupData.customer.state
                  },
                  items: quotationPopupData.items?.map(i => ({
                    productName: i.productName || i.description,
                    description: i.description || i.productName,
                    quantity: i.quantity,
                    unit: i.unit || 'Nos',
                    buyerRate: i.buyerRate || i.unitPrice,
                    unitPrice: i.unitPrice || i.buyerRate,
                    amount: i.amount || i.taxableAmount,
                    total: i.total || i.totalAmount,
                    hsn: i.hsn,
                    gstRate: i.gstRate
                  })),
                  subtotal: quotationPopupData.subtotal,
                  taxAmount: quotationPopupData.tax,
                  total: quotationPopupData.total,
                  selectedBranch: quotationPopupData.selectedBranch || selectedBranch
                }}
                companyBranches={companyBranches}
                user={user}
              />
            </div>
            
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowQuotationPopup(false)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 border border-transparent rounded shadow-sm hover:bg-green-700 flex items-center gap-2"
                onClick={() => {
                  const element = document.getElementById('quotation-preview-content') || document.getElementById('quotation-content')
                  if (element) {
                    const opt = {
                      margin: [0.4, 0.4, 0.4, 0.4],
                      filename: `Quotation-${quotationPopupData.quotationNumber}-${quotationPopupData.customer.name.replace(/\s+/g, '-')}.pdf`,
                      image: { type: 'jpeg', quality: 0.8 },
                      html2canvas: { 
                        scale: 1.1,
                        useCORS: true,
                        letterRendering: true,
                        allowTaint: true,
                        backgroundColor: '#ffffff'
                      },
                      jsPDF: { 
                        unit: 'in', 
                        format: 'a4', 
                        orientation: 'portrait',
                        compress: true,
                        putOnlyUsedFonts: true
                      }
                    }
                    html2pdf().set(opt).from(element).save()
                  } else {
                    alert('No quotation content to download')
                  }
                }}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}


