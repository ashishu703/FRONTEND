"use client"

import { useState, useEffect } from "react"
import { X, FileText, Calendar, User, Building2, FileCheck, Eye, Download, Package, Plus } from "lucide-react"
import DynamicTemplateRenderer from '../../components/DynamicTemplateRenderer'
import html2pdf from 'html2pdf.js'
import proformaInvoiceService from '../../api/admin_api/proformaInvoiceService'
import quotationService from '../../api/admin_api/quotationService'
import companyBranchService from '../../services/CompanyBranchService'
import templateService from '../../services/TemplateService'
import apiClient from '../../utils/apiClient'
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton'

function Card({ className, children }) {
  return <div className={`rounded-lg border bg-white shadow-sm ${className || ''}`}>{children}</div>
}

function CardContent({ className, children }) {
  return <div className={`p-0 ${className || ''}`}>{children}</div>
}

function CardHeader({ className, children }) {
  return <div className={`p-3 sm:p-4 md:p-6 ${className || ''}`}>{children}</div>
}

function CardTitle({ className, children }) {
  return <h3 className={`text-lg font-semibold ${className || ''}`}>{children}</h3>
}

function Button({ children, onClick, type = "button", variant = "default", size = "default", className = "" }) {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-blue-500"
  }
  
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-8 py-1 px-3 text-xs",
    icon: "h-10 w-10"
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

export default function CreatePIForm({ quotation: propQuotation, customer: propCustomer, user: propUser, onClose: propOnClose, modal = false }) {
  const [companyBranches, setCompanyBranches] = useState({})
  const [organizations, setOrganizations] = useState([])

  const [quotationData, setQuotationData] = useState(null)
  const [customer, setCustomer] = useState(null)
  const [user, setUser] = useState(null)
  const [piFormData, setPiFormData] = useState({
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    selectedBranch: 'ANODE',
    billTo: {
      business: '',
      address: '',
      phone: '',
      gstNo: '',
      state: ''
    },
    items: [],
    subtotal: 0,
    discountRate: 0,
    discountAmount: 0,
    taxableAmount: 0,
    taxRate: 18,
    taxAmount: 0,
    total: 0,
    deliveryTerms: 'FOR upto Destination',
    paymentTerms: 'ADVANCE',
    validity: '30 days',
    warranty: ''
  })
  const [piPreviewData, setPiPreviewData] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [availableTemplates, setAvailableTemplates] = useState([])

  useEffect(() => {
    const buildInitialPiData = (quotation, customerLike) => {
      const quotationItems = quotation.items || []
      const subtotal = quotationItems.reduce((sum, item) => {
        const amount = Number(item.taxable_amount || item.amount || (item.unit_price * item.quantity) || 0)
        return sum + amount
      }, 0)
      const discountRate = Number(quotation.discount_rate || quotation.discountRate || 0)
      const discountAmount = Number(quotation.discount_amount || quotation.discountAmount || (subtotal * discountRate / 100))
      const taxableAmount = Math.max(0, subtotal - discountAmount)
      const taxRate = Number(quotation.tax_rate || quotation.taxRate || 18)
      const taxAmount = Number(quotation.tax_amount || quotation.taxAmount || (taxableAmount * taxRate / 100))
      const total = Number(quotation.total_amount || quotation.total || (taxableAmount + taxAmount))

      // Normalise invoice date to YYYY-MM-DD for <input type="date">
      const rawDate = quotation.quotation_date || quotation.quotationDate
      const invoiceDate = rawDate
        ? new Date(rawDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]

      // Prefer real values from quotation over placeholder like 'N/A'
      const safeValue = (fromCustomer, fromQuotation) => {
        if (fromCustomer && fromCustomer !== 'N/A' && fromCustomer !== '-') return fromCustomer
        return fromQuotation || ''
      }

      return {
        // Auto PI number, invoice date from quotation (or today)
        invoiceNumber: `PI-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        invoiceDate,
        selectedBranch: quotation.branch || 'ANODE',
        billTo: {
          business: safeValue(customerLike?.business, quotation.customer_business || quotation.billTo?.business),
          address: safeValue(customerLike?.address, quotation.customer_address || quotation.billTo?.address),
          phone: customerLike?.phone || quotation.customer_phone || quotation.billTo?.phone || '',
          gstNo: safeValue(customerLike?.gstNo, quotation.customer_gst_no || quotation.billTo?.gstNo),
          state: safeValue(customerLike?.state, quotation.customer_state || quotation.billTo?.state)
        },
        items: quotationItems.map(item => ({
          id: item.id || Math.random(),
          productName: item.product_name || item.productName || '',
          description: item.description || item.product_name || item.productName || '',
          quantity: Number(item.quantity) || 0,
          unit: item.unit || 'Nos',
          rate: Number(item.unit_price || item.buyer_rate || item.buyerRate || 0),
          buyerRate: Number(item.buyer_rate || item.buyerRate || item.unit_price || 0),
          amount: Number(item.taxable_amount || item.amount || (item.unit_price * item.quantity) || 0),
          hsn: item.hsn_code || item.hsn || item.hsnCode || '85446090'
        })),
        subtotal,
        discountRate,
        discountAmount,
        taxableAmount,
        taxRate,
        taxAmount,
        total,
        // Try to carry over quotation-level terms when present
        deliveryTerms: quotation.delivery_terms || quotation.deliveryTerms || 'FOR upto Destination',
        paymentTerms: quotation.payment_terms || quotation.paymentTerms || 'ADVANCE',
        validity: quotation.validity || '30 days',
        warranty: quotation.warranty || ''
      }
    }

    const calculateRemainingBalance = async (quotationId, quotationTotal) => {
      try {
        console.log('💰 Quotation Total:', quotationTotal)
        
        // Fetch approved payments for this quotation
        // Payments are more accurate than PI total_amount
        try {
          const payRes = await apiClient.get(`/api/payments/quotation/${quotationId}`)
          const allPayments = payRes?.data || []
          
          console.log('📦 All Payments:', allPayments)
          
          // Filter only approved payments
          const approvedPayments = allPayments.filter(p => 
            (p.approval_status || p.accounts_approval_status || '').toLowerCase() === 'approved'
          )
          
          console.log('✅ Approved Payments:', approvedPayments)
          
          // Sum approved payment amounts
          const totalPaid = approvedPayments.reduce((sum, p) => {
            const amount = Number(p.installment_amount || p.paid_amount || p.amount || 0)
            console.log(`💳 Payment ${p.id || p.payment_reference}: ₹${amount}`)
            return sum + amount
          }, 0)
          
          console.log('💸 Total Paid via Payments: ₹', totalPaid)
          
          // Calculate remaining balance
          const remaining = Math.max(0, quotationTotal - totalPaid)
          console.log('🎯 Remaining Balance: ₹', remaining)
          
          return remaining
        } catch (e) {
          console.error('❌ Failed to fetch payments:', e)
          return quotationTotal
        }
      } catch (error) {
        console.error('❌ Error calculating remaining balance:', error)
        return quotationTotal
      }
    }

    const loadQuotationData = async () => {
      try {
        if (propQuotation && propCustomer) {
          let completeQuotation = propQuotation

          if (propQuotation.id) {
            try {
              const response = await quotationService.getCompleteData(propQuotation.id)
              if (response && response.success) {
                completeQuotation = response.data?.quotation || response.data || propQuotation
              }
            } catch (error) {
              console.error('Error fetching complete quotation from props:', error)
            }
          }

          // Calculate remaining balance
          const quotationTotal = Number(completeQuotation.total_amount || completeQuotation.total || 0)
          const remainingBalance = await calculateRemainingBalance(completeQuotation.id, quotationTotal)
          
          console.log('💰 Quotation Total:', quotationTotal)
          console.log('💸 Remaining Balance:', remainingBalance)
          console.log('📊 Has existing PIs:', remainingBalance < quotationTotal)
          
          setQuotationData(completeQuotation)
          setCustomer(propCustomer)
          setUser(propUser)
          
          const initialData = buildInitialPiData(completeQuotation, propCustomer)
          console.log('📋 Initial Data:', {
            subtotal: initialData.subtotal,
            taxableAmount: initialData.taxableAmount,
            taxAmount: initialData.taxAmount,
            total: initialData.total
          })
          
          if (remainingBalance < quotationTotal && remainingBalance > 0) {
            const taxRate = initialData.taxRate || 18
            const taxableAmount = remainingBalance / (1 + (taxRate / 100))
            const taxAmount = remainingBalance - taxableAmount
            
            const discountRate = initialData.discountRate || 0
            const subtotal = discountRate > 0 
              ? taxableAmount / (1 - (discountRate / 100))
              : taxableAmount
            const discountAmount = subtotal - taxableAmount
            
            setPiFormData({
              ...initialData,
              subtotal: Number(subtotal.toFixed(2)),
              discountRate,
              discountAmount: Number(discountAmount.toFixed(2)),
              taxableAmount: Number(taxableAmount.toFixed(2)),
              taxRate,
              taxAmount: Number(taxAmount.toFixed(2)),
              total: Number(remainingBalance.toFixed(2))
            })
          } else {
            setPiFormData(initialData)
          }
          return
        }

        // 2) Fallback: standalone PI page using sessionStorage
        const storedData = sessionStorage.getItem('piQuotationData')
        if (!storedData) {
          alert('No quotation data found. Please go back and try again.')
          setLoading(false)
          return
        }

        const { quotation, customer: storedCustomer, user: storedUser } = JSON.parse(storedData)

        let completeQuotation = quotation
        if (quotation.id) {
          try {
            const response = await quotationService.getCompleteData(quotation.id)
            if (response && response.success) {
              completeQuotation = response.data?.quotation || response.data || quotation
            }
          } catch (error) {
            console.error('Error fetching complete quotation:', error)
          }
        }

        // Calculate remaining balance
        const quotationTotal = Number(completeQuotation.total_amount || completeQuotation.total || 0)
        const remainingBalance = await calculateRemainingBalance(completeQuotation.id, quotationTotal)
        
        console.log('💰 Quotation Total:', quotationTotal)
        console.log('💸 Remaining Balance:', remainingBalance)
        console.log('📊 Has existing PIs:', remainingBalance < quotationTotal)
        
        setQuotationData(completeQuotation)
        setCustomer(storedCustomer)
        setUser(storedUser)
        
        const initialData = buildInitialPiData(completeQuotation, storedCustomer)
        console.log('📋 Initial Data:', {
          subtotal: initialData.subtotal,
          taxableAmount: initialData.taxableAmount,
          taxAmount: initialData.taxAmount,
          total: initialData.total
        })
        
          // Override amounts with remaining balance if there are existing PIs
          if (remainingBalance < quotationTotal && remainingBalance > 0) {
            // Calculate tax breakdown from remaining balance
            const taxRate = Number(initialData.taxRate) || 18
            const taxableAmount = remainingBalance / (1 + (taxRate / 100))
            const taxAmount = remainingBalance - taxableAmount
            
            // Calculate subtotal considering discount
            const discountRate = Number(initialData.discountRate) || 0
            const subtotal = discountRate > 0 
              ? taxableAmount / (1 - (discountRate / 100))
              : taxableAmount
            const discountAmount = subtotal - taxableAmount
            
            const updatedData = {
              ...initialData,
              subtotal: Math.round(subtotal * 100) / 100,
              discountRate: Math.round(discountRate * 100) / 100,
              discountAmount: Math.round(discountAmount * 100) / 100,
              taxableAmount: Math.round(taxableAmount * 100) / 100,
              taxRate: Math.round(taxRate * 100) / 100,
              taxAmount: Math.round(taxAmount * 100) / 100,
              total: Math.round(remainingBalance * 100) / 100
            }
            
            console.log('✅ Updated PI Data (with remaining balance):', {
              subtotal: updatedData.subtotal,
              taxableAmount: updatedData.taxableAmount,
              taxAmount: updatedData.taxAmount,
              total: updatedData.total
            })
            
            setPiFormData(updatedData)
          } else {
            console.log('✅ Using full quotation amount (no existing PIs)')
            setPiFormData(initialData)
          }
      } catch (error) {
        console.error('Error loading quotation data:', error)
        alert('Error loading quotation data. Please try again.')
      } finally {
        setLoading(false)
        setInitialLoading(false)
      }
    }

    loadQuotationData()
  }, [propQuotation, propCustomer, propUser])

  // Update PI preview data when PI form data changes
  useEffect(() => {
    if (piFormData.items.length > 0) {
      console.log('🔢 CreatePIForm - piFormData values:', {
        subtotal: piFormData.subtotal,
        taxableAmount: piFormData.taxableAmount,
        taxAmount: piFormData.taxAmount,
        total: piFormData.total
      })
      
      // Derive extra fields from the underlying quotation so that
      // the PI preview can show the same details (mode/term & payment,
      // transport T&C, dispatch through, material type, bank details, terms, etc.)
      const q = quotationData || {}

      const rawBankDetails = q.bank_details || q.bankDetails
      let bankDetails = null
      if (rawBankDetails) {
        try {
          bankDetails = typeof rawBankDetails === 'string'
            ? JSON.parse(rawBankDetails)
            : rawBankDetails
        } catch (e) {
          console.warn('Failed to parse bank_details for PI preview:', e)
        }
      }

      const rawTerms = q.terms_sections || q.termsSections
      let terms = []
      try {
        const baseTerms = typeof rawTerms === 'string' ? JSON.parse(rawTerms) : rawTerms
        if (Array.isArray(baseTerms)) {
          terms = baseTerms.map(sec => ({
            title: sec.title || '',
            points: Array.isArray(sec.points) ? sec.points : []
          }))
        }
      } catch (e) {
        console.warn('Failed to parse terms_sections for PI preview:', e)
      }

      const formattedPiData = {
        quotationNumber: quotationData?.quotation_number || quotationData?.quotationNumber || '',
        quotationDate: piFormData.invoiceDate,
        // Header identifiers for PI template
        invoiceNumber: piFormData.invoiceNumber,
        invoiceDate: piFormData.invoiceDate,
        piNumber: piFormData.invoiceNumber,
        piDate: piFormData.invoiceDate,
        piId: piFormData.invoiceNumber,
        validUpto: piFormData.validity || '',
        piValidUpto: piFormData.validity || '',
        billTo: piFormData.billTo,
        items: piFormData.items.map(item => ({
          productName: item.productName,
          description: item.description || item.productName,
          quantity: Number(item.quantity) || 0,
          unit: item.unit,
          rate: Number(item.rate) || 0,
          buyerRate: Number(item.rate) || 0,
          amount: Number(item.amount) || 0,
          hsn: item.hsn || '85446090',
          hsnCode: item.hsn || '85446090'
        })),
        subtotal: Number(piFormData.subtotal) || 0,
        discountRate: Number(piFormData.discountRate) || 0,
        discountAmount: Number(piFormData.discountAmount) || 0,
        taxableAmount: Number(piFormData.taxableAmount) || 0,
        taxRate: Number(piFormData.taxRate) || 18,
        taxAmount: Number(piFormData.taxAmount) || 0,
        total: Number(piFormData.total) || 0,
        paymentMode: q.payment_mode || q.paymentMode || '',
        transportTc: q.transport_tc || q.transportTc || '',
        dispatchThrough: q.dispatch_through || q.dispatchThrough || '',
        deliveryTerms: piFormData.deliveryTerms || q.delivery_terms || q.deliveryTerms || '',
        materialType: q.material_type || q.materialType || '',
        paymentTerms: piFormData.paymentTerms,
        validity: piFormData.validity,
        warranty: piFormData.warranty,
        bankDetails,
        terms
      }
      
      console.log('📊 CreatePIForm - formattedPiData for preview:', {
        subtotal: formattedPiData.subtotal,
        taxableAmount: formattedPiData.taxableAmount,
        taxAmount: formattedPiData.taxAmount,
        total: formattedPiData.total,
        itemsCount: formattedPiData.items.length
      })
      
      setPiPreviewData(formattedPiData)
    }
  }, [piFormData, quotationData])

  // Load PI templates from config  uration
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templates = await templateService.getTemplatesByType('pi')
        setAvailableTemplates(templates)
        if (!selectedTemplate && templates.length > 0) {
          setSelectedTemplate(templates[0].template_key)
        }
      } catch (error) {
        console.error('Failed to load PI templates:', error)
      }
    }

    loadTemplates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load company branches (organizations) from backend
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const { branches, organizations: orgs } = await companyBranchService.fetchBranches()
        setCompanyBranches(branches)
        setOrganizations(orgs)

        if (!piFormData.selectedBranch && orgs.length > 0) {
          setPiFormData(prev => ({
            ...prev,
            selectedBranch: String(orgs[0].id)
          }))
        }
      } catch (error) {
        console.error('Failed to load organizations for PI:', error)
      }
    }

    loadBranches()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load PI templates from configuration
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templates = await templateService.getTemplatesByType('pi')
        setAvailableTemplates(templates)
        if (!selectedTemplate && templates.length > 0) {
          setSelectedTemplate(templates[0].template_key)
        }
      } catch (error) {
        console.error('Failed to load PI templates:', error)
      }
    }

    loadTemplates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePIInputChange = (field, value) => {
    setPiFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePIBillToChange = (field, value) => {
    setPiFormData(prev => ({
      ...prev,
      billTo: {
        ...prev.billTo,
        [field]: value
      }
    }))
  }

  const handlePIItemChange = (index, field, value) => {
    setPiFormData(prev => {
      const updatedItems = [...prev.items]
      const item = { ...updatedItems[index] }
      
      if (field === 'productName' || field === 'description') {
        item.productName = value
        item.description = value
      } else if (['quantity', 'buyerRate'].includes(field)) {
        item[field] = value === '' ? '' : parseFloat(value) || 0
        if (field === 'buyerRate') {
          item.rate = value === '' ? '' : parseFloat(value) || 0
        }
        
        // Recalculate amount when quantity or rate changes
        const qty = parseFloat(item.quantity || 0)
        const rate = parseFloat(item.buyerRate || item.rate || 0)
        item.amount = qty * rate
      } else {
        item[field] = value
      }
      
      updatedItems[index] = item
      
      // Recalculate totals
      const subtotal = updatedItems.reduce((sum, itm) => {
        return sum + (parseFloat(itm.amount || 0))
      }, 0)
      
      const discountRate = prev.discountRate || 0
      const discountAmount = subtotal * (discountRate / 100)
      const taxableAmount = Math.max(0, subtotal - discountAmount)
      const taxRate = prev.taxRate || 18
      const taxAmount = taxableAmount * (taxRate / 100)
      const total = taxableAmount + taxAmount
      
      return {
        ...prev,
        items: updatedItems,
        subtotal: subtotal,
        discountAmount: discountAmount,
        taxableAmount: taxableAmount,
        taxAmount: taxAmount,
        total: total
      }
    })
  }

  const handleSave = async () => {
    try {
      if (!quotationData) {
        alert('Quotation data not found')
        return
      }

      if (!selectedTemplate) {
        alert('Please select a PI template.')
        return
      }

      // Check if quotation is saved (has ID)
      if (quotationData.id) {
        // Create PI in database
        const today = new Date().toISOString().split('T')[0]
        const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        
        const piPayload = {
          piDate: today,
          validUntil: validUntil,
          status: 'pending',
          subtotal: piFormData.subtotal,
          taxAmount: piFormData.taxAmount,
          totalAmount: piFormData.total,
          template: selectedTemplate // Include selected template
        }
        
        const response = await proformaInvoiceService.createFromQuotation(quotationData.id, piPayload)
        
        if (response && response.success) {
          alert('PI created and saved successfully!')
          
          // If modal mode, call onClose callback with success flag, otherwise close tab
          if (propOnClose) {
            propOnClose(response.data)
          } else {
            // Close tab or navigate back
            sessionStorage.removeItem('piQuotationData')
            if (window.opener) {
              window.close()
            } else {
              window.location.href = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '') + '?page=customers'
            }
          }
        } else {
          alert('Failed to save PI. Please check the response.')
        }
      } else {
        // Quotation not saved yet - store PI in sessionStorage
        const quotationNumber = quotationData.quotationNumber || quotationData.quotation_number
        const piStorageKey = `pending_pi_${quotationNumber}`
        const piDataToStore = {
          customerId: customer?.id,
          quotationNumber: quotationNumber,
          selectedBranch: piFormData.selectedBranch,
          template: selectedTemplate, // Include selected template
          piData: piPreviewData,
          piFormData: piFormData,
          quotationData: quotationData,
          savedAt: new Date().toISOString()
        }
        sessionStorage.setItem(piStorageKey, JSON.stringify(piDataToStore))
        alert('PI saved successfully! It will be created in the database when the quotation is saved.')
        
        // If modal mode, call onClose callback, otherwise close tab
        if (propOnClose) {
          propOnClose()
        } else {
          // Close tab or navigate back
          sessionStorage.removeItem('piQuotationData')
          if (window.opener) {
            window.close()
          } else {
            window.location.href = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '') + '?page=customers'
          }
        }
      }
    } catch (error) {
      console.error('Error saving PI:', error)
      const errorMessage = error?.response?.data?.error || error?.message || 'Unknown error'
      alert(`Failed to save PI: ${errorMessage}. Please check the console for more details.`)
    }
  }

  const handleClose = () => {
    if (propOnClose) {
      propOnClose()
    } else {
      sessionStorage.removeItem('piQuotationData')
      if (window.opener) {
        window.close()
      } else {
        window.location.href = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '') + '?page=customers'
      }
    }
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!quotationData) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-700">No quotation data found.</p>
          <p className="text-sm text-gray-500 mt-2">Please go back and try again.</p>
        </div>
      </div>
    )
  }

  const formContent = (
    <Card className={`w-full ${modal ? 'h-screen rounded-none' : 'max-w-7xl max-h-[95vh] sm:max-h-[95vh]'} overflow-hidden flex flex-col`}>
          {/* Header */}
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pb-4 border-b pt-3 sm:pt-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <FileCheck className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-semibold">Create Proforma Invoice</CardTitle>
                <p className="text-xs sm:text-sm text-gray-600">Based on Quotation</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          {/* PI Form Content with Live Preview */}
          <div className="flex flex-col lg:flex-row gap-4 p-3 sm:p-4 md:p-6 flex-1 overflow-hidden">
            {/* Left Side - PI Form */}
            <div className="flex-1 overflow-y-auto pr-4" style={{ maxHeight: modal ? 'calc(100vh - 150px)' : 'calc(95vh - 150px)', minWidth: '60%' }}>
              <CardContent className="p-0">
                <form className="space-y-6">
                  {/* PI Header Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-purple-500" />
                        Invoice Number
                      </label>
                      <input
                        type="text"
                        value={piFormData.invoiceNumber}
                        onChange={(e) => handlePIInputChange('invoiceNumber', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        Invoice Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={piFormData.invoiceDate}
                        onChange={(e) => handlePIInputChange('invoiceDate', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Branch Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-green-500" />
                      Company Branch
                    </h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Select Branch *</label>
                      <select
                        value={piFormData.selectedBranch}
                        onChange={(e) => handlePIInputChange('selectedBranch', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        <option value="">Select Organization</option>
                        {organizations.map((org) => (
                          <option key={org.id} value={String(org.id)}>
                            {org.organization_name || org.legal_name || `Organization #${org.id}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Bill To Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-500" />
                      Bill To Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Business Name *</label>
                        <input
                          type="text"
                          required
                          value={piFormData.billTo.business}
                          onChange={(e) => handlePIBillToChange('business', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone *</label>
                        <input
                          type="text"
                          required
                          value={piFormData.billTo.phone}
                          onChange={(e) => handlePIBillToChange('phone', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Address *</label>
                        <input
                          type="text"
                          required
                          value={piFormData.billTo.address}
                          onChange={(e) => handlePIBillToChange('address', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">GST Number</label>
                        <input
                          type="text"
                          value={piFormData.billTo.gstNo}
                          onChange={(e) => handlePIBillToChange('gstNo', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">State *</label>
                        <input
                          type="text"
                          required
                          value={piFormData.billTo.state}
                          onChange={(e) => handlePIBillToChange('state', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Items Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                        <Package className="h-5 w-5 text-orange-500" />
                        Items
                      </h3>
                    </div>

                    {piFormData.items && piFormData.items.length > 0 ? (
                      <div className="border border-gray-200 rounded-lg overflow-x-auto">
                        <table className="w-full min-w-full table-fixed">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: '30%' }}>Product Name</th>
                              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: '12%' }}>HSN/SAC</th>
                              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: '8%' }}>Qty</th>
                              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: '10%' }}>Unit</th>
                              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: '15%' }}>Buyer Rate</th>
                              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: '15%' }}>Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {piFormData.items.map((item, index) => (
                              <tr key={item.id || index}>
                                <td className="px-2 py-3">
                                  <input
                                    type="text"
                                    placeholder="Product name"
                                    value={item.productName || item.description || ''}
                                    onChange={(e) => handlePIItemChange(index, 'productName', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    required
                                  />
                                </td>
                                <td className="px-2 py-3">
                                  <input
                                    type="text"
                                    placeholder="HSN/SAC"
                                    value={item.hsn || ''}
                                    onChange={(e) => handlePIItemChange(index, 'hsn', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-xs"
                                  />
                                </td>
                                <td className="px-2 py-3">
                                  <input
                                    type="number"
                                    min="0"
                                    placeholder="Qty"
                                    value={item.quantity || ''}
                                    onChange={(e) => handlePIItemChange(index, 'quantity', e.target.value === '' ? '' : parseFloat(e.target.value) || '')}
                                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                  />
                                </td>
                                <td className="px-2 py-3">
                                  <select
                                    value={item.unit || ''}
                                    onChange={(e) => handlePIItemChange(index, 'unit', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                  >
                                    <option value="">Select</option>
                                    <option value="Nos">Nos</option>
                                    <option value="Mtr">Mtr</option>
                                    <option value="Kg">Kg</option>
                                    <option value="Set">Set</option>
                                    <option value="PCS">PCS</option>
                                  </select>
                                </td>
                                <td className="px-2 py-3">
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Rate"
                                    value={item.buyerRate || item.rate || ''}
                                    onChange={(e) => handlePIItemChange(index, 'buyerRate', e.target.value === '' ? '' : parseFloat(e.target.value) || '')}
                                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                  />
                                </td>
                                <td className="px-2 py-3 text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                  ₹{parseFloat(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                        <p>No items found in the quotation.</p>
                      </div>
                    )}
                  </div>

                  {/* Terms & Conditions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-500" />
                      Terms & Conditions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Payment Terms</label>
                        <input
                          type="text"
                          value={piFormData.paymentTerms}
                          onChange={(e) => handlePIInputChange('paymentTerms', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Delivery Terms</label>
                        <input
                          type="text"
                          value={piFormData.deliveryTerms}
                          onChange={(e) => handlePIInputChange('deliveryTerms', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Validity of Proforma Invoice</label>
                        <input
                          type="text"
                          value={piFormData.validity}
                          onChange={(e) => handlePIInputChange('validity', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g., 30 days"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Warranty (if applicable)</label>
                        <input
                          type="text"
                          value={piFormData.warranty}
                          onChange={(e) => handlePIInputChange('warranty', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g., 1 year"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </div>

            {/* Right Side - Live Preview */}
            <div className="w-2/5 border-l border-gray-200 pl-4" style={{ maxWidth: '400px' }}>
              <div className="sticky top-4">
                <div className="mb-3">
                  <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    Live Preview
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">Updates as you type</p>
                  
                  {/* Template Selector */}
                  <div className="flex gap-2 mb-3">
                    {availableTemplates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.template_key)}
                      className={`flex-1 px-2 py-1.5 text-xs rounded border transition-colors ${
                          selectedTemplate === template.template_key
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                        title={template.description || template.name}
                    >
                        {template.name}
                    </button>
                    ))}
                  </div>
                </div>
                <div
                  id="pi-preview-content"
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-auto pi-preview"
                  style={{
                    maxHeight: modal ? 'calc(100vh - 150px)' : 'calc(95vh - 150px)',
                    transform: 'scale(0.75)',
                    transformOrigin: 'top left',
                    width: '133.33%'
                  }}
                >
                  {(() => {
                    const activeTemplate = availableTemplates.find(
                      (tpl) => tpl.template_key === selectedTemplate
                    )
                    if (!activeTemplate?.html_content) {
                      return null
                    }

                    const branch =
                      (piFormData.selectedBranch &&
                        companyBranches[piFormData.selectedBranch]) ||
                      Object.values(companyBranches)[0] ||
                      {}

                    const context = {
                      ...piPreviewData,
                      branch,
                      billTo: piPreviewData.billTo,
                      user,
                      templateKey: selectedTemplate,
                      templateType: 'pi',
                    }

                    return (
                      <DynamicTemplateRenderer
                        html={activeTemplate.html_content}
                        data={context}
                        containerId="pi-content"
                      />
                    )
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={async () => {
                try {
                  const wrapper = document.getElementById('pi-preview-content') || document.querySelector('.pi-preview');
                  if (!wrapper) {
                    alert('PI preview not found. Please try again.');
                    return;
                  }

                  // Find the actual template content (pi-content) inside the wrapper
                  const element = wrapper.querySelector('#pi-content');
                  if (!element) {
                    alert('PI template content not found. Please try again.');
                    return;
                  }

                  // Store original transform and width of wrapper
                  const originalTransform = wrapper.style.transform;
                  const originalTransformOrigin = wrapper.style.transformOrigin;
                  const originalWidth = wrapper.style.width;
                  const originalMaxHeight = wrapper.style.maxHeight;
                  
                  // Temporarily remove scale transform and adjust width for full-size PDF
                  wrapper.style.transform = 'scale(1)';
                  wrapper.style.transformOrigin = 'top left';
                  wrapper.style.width = '100%';
                  wrapper.style.maxHeight = 'none';

                  // Wait a bit for layout to update
                  await new Promise(resolve => setTimeout(resolve, 300));

                  const opt = {
                    margin: [0.3, 0.3, 0.3, 0.3],
                    filename: `PI-${piFormData.invoiceNumber || 'Draft'}-${(piFormData.billTo?.business || 'Customer').replace(/\s+/g, '-')}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { 
                      scale: 2,
                      useCORS: true,
                      letterRendering: true,
                      allowTaint: true,
                      backgroundColor: '#ffffff',
                      logging: false,
                      scrollX: 0,
                      scrollY: 0,
                      windowWidth: element.scrollWidth,
                      windowHeight: element.scrollHeight
                    },
                    jsPDF: { 
                      unit: 'in', 
                      format: 'a4', 
                      orientation: 'portrait',
                      compress: false,
                      putOnlyUsedFonts: true
                    },
                    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                  };

                  // Generate PDF from the template content (pi-content)
                  await html2pdf().set(opt).from(element).save();

                  // Restore original transform and styles
                  wrapper.style.transform = originalTransform;
                  wrapper.style.transformOrigin = originalTransformOrigin;
                  wrapper.style.width = originalWidth;
                  wrapper.style.maxHeight = originalMaxHeight;
                } catch (error) {
                  console.error('Error generating PI PDF:', error);
                  alert('Failed to generate PDF. Please try again.');
                  
                  // Ensure styles are restored even on error
                  const wrapper = document.getElementById('pi-preview-content') || document.querySelector('.pi-preview');
                  if (wrapper) {
                    wrapper.style.transform = 'scale(0.75)';
                    wrapper.style.transformOrigin = 'top left';
                    wrapper.style.width = '133.33%';
                    wrapper.style.maxHeight = modal ? 'calc(100vh - 150px)' : 'calc(95vh - 150px)';
                  }
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button 
              type="button" 
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700"
            >
              Save PI
            </Button>
          </div>
        </Card>
  )

  // If modal mode, wrap in full-screen overlay, otherwise use standalone layout
  if (modal) {
    return (
      <div className="fixed inset-0 z-[100] bg-white overflow-hidden">
        {formContent}
      </div>
    )
  }

  // Show skeleton loader on initial load
  if (initialLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="w-full max-w-7xl mx-auto p-2 sm:p-4">
        {formContent}
      </div>
    </div>
  )
}

