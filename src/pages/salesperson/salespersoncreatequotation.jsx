"use client"

import { useState, useEffect, useRef } from "react"
import { X, FileText, Calendar, User, Package, DollarSign, Plus, Eye, Edit, Building2, FileCheck } from "lucide-react"
import QuotationPreview from "../../components/QuotationPreview"
import { CorporateStandardInvoice } from './salespersonpi'
import { defaultQuotationTerms } from '../../constants/quotationTerms'

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

// removed local QuotationPreview; using shared component

export default function CreateQuotationForm({ customer, user, onClose, onSave, standalone = false }) {
  // Debug: Log user data
  console.log('CreateQuotationForm received user:', user);
  
  const getSevenDaysLater = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

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

  const [quotationData, setQuotationData] = useState({
    quotationNumber: `ANQ${Date.now().toString().slice(-6)}`,
    quotationDate: new Date().toISOString().split('T')[0],
    validUpto: getSevenDaysLater(new Date().toISOString().split('T')[0]),
    selectedBranch: 'ANODE', // Default branch
    items: [
      {
        id: 1,
        productName: "",
        quantity: "",
        unit: "",
        companyRate: 0,
        buyerRate: "",
        amount: 0,
        hsn: ""
      }
    ],
    subtotal: 0,
    discountRate: 0,
    discountAmount: 0,
    taxRate: 18,
    taxAmount: 0,
    total: 0,
    termsSections: defaultQuotationTerms.map(section => ({ ...section, points: [...section.points] })),
    // Editable bill-to information
    billTo: {
      business: "",
      address: "",
      phone: "",
      gstNo: "",
      state: ""
    }
  })

  // Optional: Auto-fill bill-to from customer data if user wants (commented out to start with empty fields)
  // useEffect(() => {
  //   if (customer) {
  //     setQuotationData(prev => ({
  //       ...prev,
  //       billTo: {
  //         business: (customer?.business && customer.business !== 'N/A') ? customer.business : (customer?.name || ""),
  //         address: (customer?.address && customer.address !== 'N/A') ? customer.address : "",
  //         phone: customer?.phone || "",
  //         gstNo: (customer?.gstNo && customer.gstNo !== 'N/A') ? customer.gstNo : "",
  //         state: customer?.state || ""
  //       }
  //     }))
  //   }
  // }, [customer])

  const handleInputChange = (field, value) => {
    const newData = {
      ...quotationData,
      [field]: value
    };

    // If quotationDate changes, update validUpto to be 7 days later
    if (field === 'quotationDate') {
      newData.validUpto = getSevenDaysLater(value);
    }

    // Recalculate totals when discount or tax changes
    if (field === 'discountRate' || field === 'taxRate') {
      const subtotal = newData.items.reduce((sum, item) => sum + item.amount, 0)
      const discountRateNum = parseFloat(newData.discountRate) || 0
      const taxRateNum = parseFloat(newData.taxRate) || 0
      const discountAmount = (subtotal * discountRateNum) / 100
      const taxable = Math.max(0, subtotal - discountAmount)
      const taxAmount = (taxable * taxRateNum) / 100
      const total = taxable + taxAmount
      newData.subtotal = subtotal
      newData.discountAmount = discountAmount
      newData.taxAmount = taxAmount
      newData.total = total
    }

    setQuotationData(newData);
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...quotationData.items]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    }
    
    // Calculate amount for this item
    if (['quantity', 'companyRate', 'buyerRate'].includes(field)) {
      // Use buyerRate for amount calculation
      const qty = parseFloat(updatedItems[index].quantity) || 0
      const rate = parseFloat(updatedItems[index].buyerRate) || 0
      updatedItems[index].amount = qty * rate;
    }
    
    // Calculate totals with discount before tax
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
    const discountAmount = (subtotal * (quotationData.discountRate || 0)) / 100
    const taxable = Math.max(0, subtotal - discountAmount)
    const taxAmount = (taxable * quotationData.taxRate) / 100
    const total = taxable + taxAmount
    
    setQuotationData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      discountAmount,
      taxAmount,
      total
    }))
  }

  const handleTermTitleChange = (index, value) => {
    setQuotationData(prev => {
      const termsSections = (prev.termsSections || []).map((section, idx) =>
        idx === index ? { ...section, title: value } : section
      )
      return { ...prev, termsSections }
    })
  }

  const handleTermPointsChange = (index, value) => {
    const points = value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    setQuotationData(prev => {
      const termsSections = (prev.termsSections || []).map((section, idx) =>
        idx === index ? { ...section, points } : section
      )
      return { ...prev, termsSections }
    })
  }

  const resetTermsToDefault = () => {
    setQuotationData(prev => ({
      ...prev,
      termsSections: defaultQuotationTerms.map(section => ({
        title: section.title,
        points: [...section.points]
      }))
    }))
  }

  const addItem = () => {
    setQuotationData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: prev.items.length + 1,
        productName: "",
        quantity: "",
        unit: "",
        companyRate: 0,
        buyerRate: "",
        amount: 0,
        hsn: ""
      }]
    }))
  }

  const removeItem = (index) => {
    if (quotationData.items.length > 1) {
      const updatedItems = quotationData.items.filter((_, i) => i !== index)
      const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
      const discountAmount = (subtotal * (quotationData.discountRate || 0)) / 100
      const taxable = Math.max(0, subtotal - discountAmount)
      const taxAmount = (taxable * quotationData.taxRate) / 100
      const total = taxable + taxAmount
      
      setQuotationData(prev => ({
        ...prev,
        items: updatedItems,
        subtotal,
        discountAmount,
        taxAmount,
        total
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await onSave({
      ...quotationData,
      customer: customer,
      createdAt: new Date().toISOString()
    })
      // Let parent decide whether to close (onSave may handle it)
      if (!standalone && typeof onClose === 'function') {
    onClose()
      }
    } catch (error) {
      console.error('Failed to save quotation:', error)
      alert('Failed to save quotation. Please try again.')
    }
  }

  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [showPIPreview, setShowPIPreview] = useState(false);
  const [piPreviewData, setPiPreviewData] = useState({});

  // Update preview data when form data changes
  useEffect(() => {
    setPreviewData(quotationData);
  }, [quotationData]);

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    const { billTo, items } = quotationData;
    
    // Check bill-to information
    if (!billTo.business || !billTo.phone || !billTo.address || !billTo.state) {
      return false;
    }
    
    // Check items
    if (items.length === 0) return false;
    
    return items.every(item => 
      item.productName && 
      item.quantity > 0 && 
      item.buyerRate > 0
    );
  };

  const handlePIClick = () => {
    if (isFormValid()) {
      // Convert quotation data to PI format
      const piData = {
        invoiceNumber: `PI-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        invoiceDate: quotationData.quotationDate,
        dueDate: quotationData.validUpto,
        poNumber: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
        billTo: {
          business: quotationData.billTo.business,
          address: quotationData.billTo.address,
          phone: quotationData.billTo.phone,
          gstNo: quotationData.billTo.gstNo || '',
          state: quotationData.billTo.state
        },
        shipTo: {
          business: quotationData.billTo.business,
          address: quotationData.billTo.address,
          phone: quotationData.billTo.phone,
          gstNo: quotationData.billTo.gstNo || ''
        },
        items: quotationData.items.map(item => ({
          productName: item.productName,
          description: item.productName,
          quantity: item.quantity,
          unit: item.unit,
          rate: item.buyerRate,
          amount: item.amount,
          hsn: '85446090' // Default HSN code
        })),
        subtotal: quotationData.subtotal,
        discountRate: quotationData.discountRate,
        discountAmount: quotationData.discountAmount,
        taxableAmount: quotationData.subtotal - quotationData.discountAmount,
        taxRate: 18,
        taxAmount: quotationData.taxAmount,
        total: quotationData.total,
        deliveryTerms: 'FOR upto Destination',
        paymentTerms: 'ADVANCE',
        otherReferences: 'DIRECT SALE',
        dispatchedThrough: 'BY TRANSPORT',
        destination: 'Destination Transport'
      };
      
      setPiPreviewData(piData);
      setShowPIPreview(true);
    } else {
      alert('Please fill all required fields before generating PI');
    }
  };

  if (showPreview) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
          {/* Close button */}
          <button
            onClick={togglePreview}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            title="Close Preview"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
          
          <QuotationPreview 
            data={previewData} 
            onEdit={togglePreview}
            companyBranches={companyBranches}
            user={user}
          />
          <div className="mt-4 flex justify-end gap-3">
            <Button 
              type="button" 
              onClick={() => onSave(previewData)}
              className="bg-green-600 hover:bg-green-700"
            >
              Save Quotation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showPIPreview) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
          {/* Close button */}
          <button
            onClick={() => setShowPIPreview(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            title="Close PI Preview"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Proforma Invoice Preview</h2>
              <CorporateStandardInvoice 
                selectedBranch={quotationData.selectedBranch}
                companyBranches={companyBranches}
                quotations={[piPreviewData]}
              />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <Button 
                type="button" 
                onClick={() => setShowPIPreview(false)}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Close
              </Button>
              <Button 
                type="button" 
                onClick={() => {
                  try {
                    const event = new CustomEvent('pi-saved', {
                      detail: {
                        customerId: customer?.id,
                        quotationNumber: previewData?.quotationNumber,
                        selectedBranch: quotationData.selectedBranch,
                        piData: piPreviewData
                      }
                    })
                    window.dispatchEvent(event)
                    setShowPIPreview(false)
                    alert('PI saved successfully!')
                  } catch (e) {
                    console.error('Failed to save PI', e)
                  }
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Save PI
              </Button>
              <Button 
                type="button" 
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Print PI
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formContent = (
    <>
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-4 border-b ${standalone ? 'pt-6' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">Create Quotation</CardTitle>
              <p className="text-sm text-gray-600">For {customer?.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

      <div className="flex flex-row gap-4 p-6" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {/* Left Side - Form */}
        <div className="flex-1 overflow-y-auto pr-4" style={{ maxHeight: 'calc(100vh - 200px)', minWidth: '60%' }}>
          <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quotation Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-500" />
                  Quotation Number
                </label>
                <input
                  type="text"
                  value={quotationData.quotationNumber}
                  disabled
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-sm text-gray-600 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Quotation Date *
                </label>
                <input
                  type="date"
                  required
                  value={quotationData.quotationDate}
                  onChange={(e) => handleInputChange("quotationDate", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Valid Until *
                </label>
                <div className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm">
                  {quotationData.validUpto} (7 days from quotation date)
                </div>
                <input
                  type="hidden"
                  value={quotationData.validUpto}
                  name="validUpto"
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
                  value={quotationData.selectedBranch}
                  onChange={(e) => handleInputChange("selectedBranch", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="ANODE">ANODE ELECTRIC PRIVATE LIMITED</option>
                  <option value="SAMRIDDHI_CABLE">SAMRIDDHI CABLE INDUSTRIES PRIVATE LIMITED</option>
                  <option value="SAMRIDDHI_INDUSTRIES">SAMRIDDHI INDUSTRIES</option>
                </select>
                <p className="text-xs text-gray-500">
                  Selected branch will determine the letterhead and company details for this quotation.
                </p>
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
                    value={quotationData.billTo.business}
                    onChange={(e) => setQuotationData(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, business: e.target.value }
                    }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone *</label>
                  <input
                    type="text"
                    required
                    value={quotationData.billTo.phone}
                    onChange={(e) => setQuotationData(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, phone: e.target.value }
                    }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Address *</label>
                  <input
                    type="text"
                    required
                    value={quotationData.billTo.address}
                    onChange={(e) => setQuotationData(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, address: e.target.value }
                    }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">GST Number</label>
                  <input
                    type="text"
                    value={quotationData.billTo.gstNo}
                    onChange={(e) => setQuotationData(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, gstNo: e.target.value }
                    }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">State *</label>
                  <input
                    type="text"
                    required
                    value={quotationData.billTo.state}
                    onChange={(e) => setQuotationData(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, state: e.target.value }
                    }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                <Button type="button" onClick={addItem} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>

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
                    {quotationData.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-2 py-3">
                          <input
                            type="text"
                            placeholder="Product name"
                            value={item.productName}
                            onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                            required
                          />
                        </td>
                        <td className="px-2 py-3">
                          <input
                            type="text"
                            placeholder="HSN/SAC"
                            value={item.hsn || ''}
                            onChange={(e) => handleItemChange(index, 'hsn', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-xs"
                          />
                        </td>
                        <td className="px-2 py-3">
                          <input
                            type="number"
                            min="0"
                            placeholder="Qty"
                            value={item.quantity || ''}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value === '' ? '' : parseFloat(e.target.value) || '')}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </td>
                        <td className="px-2 py-3">
                          <select
                            value={item.unit || ''}
                            onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
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
                            value={item.buyerRate || ''}
                            onChange={(e) => handleItemChange(index, 'buyerRate', e.target.value === '' ? '' : parseFloat(e.target.value) || '')}
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

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₹{quotationData.subtotal.toFixed(2)}</span>
                  </div>
              <div className="flex justify-between text-sm items-center gap-2">
                <span>Discount (%):</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={quotationData.discountRate}
                    onChange={(e) => handleInputChange('discountRate', e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-right"
                  />
                  <span className="text-gray-600">₹{quotationData.discountAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST (18%):</span>
                <span>₹{quotationData.taxAmount.toFixed(2)}</span>
              </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>₹{quotationData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Terms & Conditions</span>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={resetTermsToDefault}>
                  Reset to Default
                </Button>
              </div>
              <p className="text-xs text-gray-500">Edit headings and bullet points below. Each new line becomes a bullet in the quotation preview.</p>
              <div className="space-y-4">
                {(quotationData.termsSections || []).map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-gray-200 rounded-lg bg-white">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleTermTitleChange(sectionIndex, e.target.value)}
                        className="w-full text-sm font-semibold text-gray-800 border-none focus:outline-none focus:ring-0"
                        placeholder="Section title"
                      />
                    </div>
                    <div className="p-4">
              <textarea
                        value={section.points.join('\n')}
                        onChange={(e) => handleTermPointsChange(sectionIndex, e.target.value)}
                        rows={Math.max(3, section.points.length)}
                        className="w-full text-xs text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter each bullet point on a new line"
              />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end pt-6 border-t">
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  className={`flex items-center gap-2 ${
                    isFormValid() 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={handlePIClick}
                  disabled={!isFormValid()}
                >
                  <FileCheck className="w-4 h-4" />
                  PI
                </Button>
                <Button 
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Save Quotation
                </Button>
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
              <p className="text-xs text-gray-500">Updates as you type</p>
            </div>
            <div
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-auto"
              style={{
                maxHeight: 'calc(100vh - 150px)',
                transform: 'scale(0.8)',
                transformOrigin: 'top left',
                width: '125%'
              }}
            >
              <QuotationPreview 
                data={previewData} 
                onEdit={() => {}} // No edit action needed in live preview
                companyBranches={companyBranches}
                user={user}
              />
            </div>
          </div>
        </div>
      </div>
      </>
  )

  // If standalone mode, render without modal wrapper
  if (standalone) {
    return (
      <Card className="w-full max-h-screen overflow-y-auto shadow-lg">
        {formContent}
      </Card>
    )
  }

  // Otherwise render as modal
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {formContent}
      </Card>
    </div>
  )
}
