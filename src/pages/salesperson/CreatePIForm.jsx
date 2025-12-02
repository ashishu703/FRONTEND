"use client"

import { useState, useEffect } from "react"
import { X, FileText, Calendar, User, Building2, FileCheck, Eye, Download, Package, Plus } from "lucide-react"
import { CorporateStandardInvoice } from './salespersonpi'
import PITemplate2 from '../../components/PITemplate2'
import PITemplate3 from '../../components/PITemplate3'
import html2pdf from 'html2pdf.js'
import proformaInvoiceService from '../../api/admin_api/proformaInvoiceService'
import quotationService from '../../api/admin_api/quotationService'

function Card({ className, children }) {
  return <div className={`rounded-lg border bg-white shadow-sm ${className || ''}`}>{children}</div>
}

function CardContent({ className, children }) {
  return <div className={`p-0 ${className || ''}`}>{children}</div>
}

function CardHeader({ className, children }) {
  return <div className={`p-6 ${className || ''}`}>{children}</div>
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
  // Company branch configuration
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
  };

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
  const [selectedTemplate, setSelectedTemplate] = useState('template1') // 'template1', 'template2', 'template3'

  // Load quotation data from sessionStorage or props
  useEffect(() => {
    const loadQuotationData = async () => {
      try {
        // If props are provided, use them directly
        if (propQuotation && propCustomer) {
          setQuotationData(propQuotation)
          setCustomer(propCustomer)
          setUser(propUser)
          setLoading(false)
          
          // Initialize PI form data from quotation
          const quotationItems = propQuotation.items || []
          const subtotal = quotationItems.reduce((sum, item) => {
            const amount = item.taxable_amount || item.amount || (item.unit_price * item.quantity) || 0
            return sum + amount
          }, 0)
          const discountRate = propQuotation.discount_rate || propQuotation.discountRate || 0
          const discountAmount = propQuotation.discount_amount || propQuotation.discountAmount || (subtotal * discountRate / 100)
          const taxableAmount = Math.max(0, subtotal - discountAmount)
          const taxRate = propQuotation.tax_rate || propQuotation.taxRate || 18
          const taxAmount = propQuotation.tax_amount || propQuotation.taxAmount || (taxableAmount * taxRate / 100)
          const total = propQuotation.total_amount || propQuotation.total || (taxableAmount + taxAmount)

          const initialPiData = {
            invoiceNumber: `PI-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            invoiceDate: propQuotation.quotation_date || propQuotation.quotationDate || new Date().toISOString().split('T')[0],
            selectedBranch: propQuotation.branch || 'ANODE',
            billTo: {
              business: propCustomer?.business || propQuotation.customer_business || propQuotation.billTo?.business || '',
              address: propCustomer?.address || propQuotation.customer_address || propQuotation.billTo?.address || '',
              phone: propCustomer?.phone || propQuotation.customer_phone || propQuotation.billTo?.phone || '',
              gstNo: propCustomer?.gstNo || propQuotation.customer_gst_no || propQuotation.billTo?.gstNo || '',
              state: propCustomer?.state || propQuotation.customer_state || propQuotation.billTo?.state || ''
            },
            items: quotationItems.map(item => ({
              id: item.id || Math.random(),
              productName: item.product_name || item.productName || '',
              description: item.description || item.product_name || item.productName || '',
              quantity: item.quantity || 0,
              unit: item.unit || 'Nos',
              rate: item.unit_price || item.buyer_rate || item.buyerRate || 0,
              buyerRate: item.buyer_rate || item.buyerRate || item.unit_price || 0,
              amount: item.taxable_amount || item.amount || (item.unit_price * item.quantity) || 0,
              hsn: item.hsn_code || item.hsn || item.hsnCode || '85446090'
            })),
            subtotal: subtotal,
            discountRate: discountRate,
            discountAmount: discountAmount,
            taxableAmount: taxableAmount,
            taxRate: taxRate,
            taxAmount: taxAmount,
            total: total,
            deliveryTerms: 'FOR upto Destination',
            paymentTerms: 'ADVANCE',
            validity: '30 days',
            warranty: ''
          }

          setPiFormData(initialPiData)
          return
        }

        // Otherwise, try to load from sessionStorage
        const storedData = sessionStorage.getItem('piQuotationData')
        if (!storedData) {
          alert('No quotation data found. Please go back and try again.')
          setLoading(false)
          return
        }

        const { quotation, customer: storedCustomer, user: storedUser } = JSON.parse(storedData)
        
        // If quotation has an ID, fetch complete quotation data
        let completeQuotation = quotation
        if (quotation.id) {
          try {
            const response = await quotationService.getCompleteData(quotation.id)
            if (response && response.success) {
              completeQuotation = response.data?.quotation || quotation
            }
          } catch (error) {
            console.error('Error fetching complete quotation:', error)
          }
        }

        setQuotationData(completeQuotation)
        setCustomer(storedCustomer)
        setUser(storedUser)

        // Initialize PI form data from quotation
        const quotationItems = completeQuotation.items || []
        const subtotal = quotationItems.reduce((sum, item) => {
          const amount = item.taxable_amount || item.amount || (item.unit_price * item.quantity) || 0
          return sum + amount
        }, 0)
        const discountRate = completeQuotation.discount_rate || completeQuotation.discountRate || 0
        const discountAmount = completeQuotation.discount_amount || completeQuotation.discountAmount || (subtotal * discountRate / 100)
        const taxableAmount = Math.max(0, subtotal - discountAmount)
        const taxRate = completeQuotation.tax_rate || completeQuotation.taxRate || 18
        const taxAmount = completeQuotation.tax_amount || completeQuotation.taxAmount || (taxableAmount * taxRate / 100)
        const total = completeQuotation.total_amount || completeQuotation.total || (taxableAmount + taxAmount)

        const initialPiData = {
          invoiceNumber: `PI-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          invoiceDate: completeQuotation.quotation_date || completeQuotation.quotationDate || new Date().toISOString().split('T')[0],
          selectedBranch: completeQuotation.branch || 'ANODE',
          billTo: {
            business: storedCustomer?.business || completeQuotation.customer_business || completeQuotation.billTo?.business || '',
            address: storedCustomer?.address || completeQuotation.customer_address || completeQuotation.billTo?.address || '',
            phone: storedCustomer?.phone || completeQuotation.customer_phone || completeQuotation.billTo?.phone || '',
            gstNo: storedCustomer?.gstNo || completeQuotation.customer_gst_no || completeQuotation.billTo?.gstNo || '',
            state: storedCustomer?.state || completeQuotation.customer_state || completeQuotation.billTo?.state || ''
          },
          items: quotationItems.map(item => ({
            id: item.id || Math.random(),
            productName: item.product_name || item.productName || '',
            description: item.description || item.product_name || item.productName || '',
            quantity: item.quantity || 0,
            unit: item.unit || 'Nos',
            rate: item.unit_price || item.buyer_rate || item.buyerRate || 0,
            amount: item.taxable_amount || item.amount || (item.unit_price * item.quantity) || 0,
            hsn: item.hsn_code || item.hsn || item.hsnCode || '85446090'
          })),
          subtotal: subtotal,
          discountRate: discountRate,
          discountAmount: discountAmount,
          taxableAmount: taxableAmount,
          taxRate: taxRate,
          taxAmount: taxAmount,
          total: total,
          deliveryTerms: 'FOR upto Destination',
          paymentTerms: 'ADVANCE',
          validity: '30 days',
          warranty: ''
        }

        setPiFormData(initialPiData)
      } catch (error) {
        console.error('Error loading quotation data:', error)
        alert('Error loading quotation data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    // If props are provided, use them directly
    if (propQuotation && propCustomer) {
      setQuotationData(propQuotation)
      setCustomer(propCustomer)
      setUser(propUser)
      setLoading(false)
      
      // Initialize PI form data from quotation
      const quotationItems = propQuotation.items || []
      const subtotal = quotationItems.reduce((sum, item) => {
        const amount = item.taxable_amount || item.amount || (item.unit_price * item.quantity) || 0
        return sum + amount
      }, 0)
      const discountRate = propQuotation.discount_rate || propQuotation.discountRate || 0
      const discountAmount = propQuotation.discount_amount || propQuotation.discountAmount || (subtotal * discountRate / 100)
      const taxableAmount = Math.max(0, subtotal - discountAmount)
      const taxRate = propQuotation.tax_rate || propQuotation.taxRate || 18
      const taxAmount = propQuotation.tax_amount || propQuotation.taxAmount || (taxableAmount * taxRate / 100)
      const total = propQuotation.total_amount || propQuotation.total || (taxableAmount + taxAmount)

      const initialPiData = {
        invoiceNumber: `PI-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        invoiceDate: propQuotation.quotation_date || propQuotation.quotationDate || new Date().toISOString().split('T')[0],
        selectedBranch: propQuotation.branch || 'ANODE',
        billTo: {
          business: propCustomer?.business || propQuotation.customer_business || propQuotation.billTo?.business || '',
          address: propCustomer?.address || propQuotation.customer_address || propQuotation.billTo?.address || '',
          phone: propCustomer?.phone || propQuotation.customer_phone || propQuotation.billTo?.phone || '',
          gstNo: propCustomer?.gstNo || propQuotation.customer_gst_no || propQuotation.billTo?.gstNo || '',
          state: propCustomer?.state || propQuotation.customer_state || propQuotation.billTo?.state || ''
        },
        items: quotationItems.map(item => ({
          id: item.id || Math.random(),
          productName: item.product_name || item.productName || '',
          description: item.description || item.product_name || item.productName || '',
          quantity: item.quantity || 0,
          unit: item.unit || 'Nos',
          rate: item.unit_price || item.buyer_rate || item.buyerRate || 0,
          amount: item.taxable_amount || item.amount || (item.unit_price * item.quantity) || 0,
          hsn: item.hsn_code || item.hsn || item.hsnCode || '85446090'
        })),
        subtotal: subtotal,
        discountRate: discountRate,
        discountAmount: discountAmount,
        taxableAmount: taxableAmount,
        taxRate: taxRate,
        taxAmount: taxAmount,
        total: total,
        deliveryTerms: 'FOR upto Destination',
        paymentTerms: 'ADVANCE',
        validity: '30 days',
        warranty: ''
      }

      setPiFormData(initialPiData)
    } else {
      // Load from sessionStorage if props not provided
      loadQuotationData()
    }
  }, [propQuotation, propCustomer, propUser])

  // Update PI preview data when PI form data changes
  useEffect(() => {
    if (piFormData.items.length > 0) {
      const formattedPiData = {
        quotationNumber: quotationData?.quotation_number || quotationData?.quotationNumber || '',
        quotationDate: piFormData.invoiceDate,
        invoiceNumber: piFormData.invoiceNumber,
        invoiceDate: piFormData.invoiceDate,
        billTo: piFormData.billTo,
        items: piFormData.items.map(item => ({
          productName: item.productName,
          description: item.description || item.productName,
          quantity: item.quantity,
          unit: item.unit,
          rate: item.rate,
          buyerRate: item.rate,
          amount: item.amount,
          hsn: item.hsn || '85446090'
        })),
        subtotal: piFormData.subtotal,
        discountRate: piFormData.discountRate,
        discountAmount: piFormData.discountAmount,
        taxableAmount: piFormData.taxableAmount,
        taxRate: piFormData.taxRate,
        taxAmount: piFormData.taxAmount,
        total: piFormData.total,
        deliveryTerms: piFormData.deliveryTerms,
        paymentTerms: piFormData.paymentTerms,
        validity: piFormData.validity,
        warranty: piFormData.warranty
      }
      setPiPreviewData(formattedPiData)
    }
  }, [piFormData, quotationData])

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
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-700">Loading PI form...</p>
        </div>
      </div>
    )
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
    <Card className={`w-full ${modal ? 'h-screen rounded-none' : 'max-w-7xl max-h-[95vh]'} overflow-hidden flex flex-col`}>
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <FileCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Create Proforma Invoice</CardTitle>
                <p className="text-sm text-gray-600">Based on Quotation</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          {/* PI Form Content with Live Preview */}
          <div className="flex flex-row gap-4 p-6 flex-1 overflow-hidden">
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
                        <option value="ANODE">ANODE ELECTRIC PRIVATE LIMITED</option>
                        <option value="SAMRIDDHI_CABLE">SAMRIDDHI CABLE INDUSTRIES PRIVATE LIMITED</option>
                        <option value="SAMRIDDHI_INDUSTRIES">SAMRIDDHI INDUSTRIES</option>
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
                    <button
                      onClick={() => setSelectedTemplate('template1')}
                      className={`flex-1 px-2 py-1.5 text-xs rounded border transition-colors ${
                        selectedTemplate === 'template1'
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                      title="Classic Template"
                    >
                      Classic
                    </button>
                    <button
                      onClick={() => setSelectedTemplate('template2')}
                      className={`flex-1 px-2 py-1.5 text-xs rounded border transition-colors ${
                        selectedTemplate === 'template2'
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                      title="Modern Template"
                    >
                      Modern
                    </button>
                    <button
                      onClick={() => setSelectedTemplate('template3')}
                      className={`flex-1 px-2 py-1.5 text-xs rounded border transition-colors ${
                        selectedTemplate === 'template3'
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                      title="Minimal Template"
                    >
                      Minimal
                    </button>
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
                  {selectedTemplate === 'template1' && (
                    <CorporateStandardInvoice 
                      selectedBranch={piFormData.selectedBranch}
                      companyBranches={companyBranches}
                      quotations={[piPreviewData]}
                    />
                  )}
                  {selectedTemplate === 'template2' && (
                    <PITemplate2 
                      selectedBranch={piFormData.selectedBranch}
                      companyBranches={companyBranches}
                      quotations={[piPreviewData]}
                    />
                  )}
                  {selectedTemplate === 'template3' && (
                    <PITemplate3 
                      selectedBranch={piFormData.selectedBranch}
                      companyBranches={companyBranches}
                      quotations={[piPreviewData]}
                    />
                  )}
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

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="w-full max-w-7xl mx-auto p-4">
        {formContent}
      </div>
    </div>
  )
}

