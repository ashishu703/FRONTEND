"use client"

import { useState, useEffect } from "react"
import { X, FileText, Calendar, User, Package, DollarSign, Plus, Minus, Eye, Edit, Building2 } from "lucide-react"

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

// Preview Component
function QuotationPreview({ data, onEdit, companyBranches, user }) {
  // Debug: Log user data
  console.log('QuotationPreview received user:', user);
  
  const selectedBranch = companyBranches[data?.selectedBranch] || companyBranches.ANODE;
  
  return (
    <div className="max-w-4xl mx-auto bg-white font-sans text-sm">        
      {/* Quotation Content */}
      <div className="p-6">
        {/* Header */}
        <div className="border-2 border-black mb-4">
          <div className="p-2 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">{selectedBranch.name}</h1>
              <p className="text-xs">{selectedBranch.description}</p>
            </div>
            <div className="text-right">
              <img
                src="https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png"
                alt="Company Logo"
                className="h-12 w-auto bg-white p-1 rounded"
              />
            </div>
          </div>
    
          <div className="p-3 bg-gray-50">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p>
                  <strong>{selectedBranch.address}</strong>
                </p>
              </div>
              <div className="text-right">
                <p>Tel: {selectedBranch.tel}</p>
                <p>Web: {selectedBranch.web}</p>
                <p>Email: {selectedBranch.email}</p>
              </div>
            </div>
          </div>
        </div>
    
        {/* Quotation Details */}
        <div className="border border-black mb-4">
          <div className="bg-gray-100 p-2 text-center font-bold">
            <h2>Quotation Details</h2>
          </div>
          <div className="grid grid-cols-4 gap-2 p-2 text-xs border-b">
            <div>
              <strong>Quotation Date</strong>
            </div>
            <div>
              <strong>Quotation Number</strong>
            </div>
            <div>
              <strong>Valid Upto</strong>
            </div>
            <div>
              <strong>Voucher Number</strong>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 p-2 text-xs">
            <div>{data?.quotationDate || new Date().toLocaleDateString()}</div>
            <div>{data?.quotationNumber || `ANO/${new Date().getFullYear().toString().slice(-2)}-${(new Date().getFullYear() + 1).toString().slice(-2)}/${Math.floor(1000 + Math.random() * 9000)}`}</div>
            <div>{data?.validUpto || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
            <div>{`VOUCH-${Math.floor(1000 + Math.random() * 9000)}`}</div>
          </div>
        </div>
    
        {/* Customer Information */}
        <div className="border border-black mb-4">
          <div className="grid grid-cols-2 gap-4 p-3 text-xs">
            <div>
              <h3 className="font-bold mb-2">BILL TO:</h3>
              <p>
                <strong>{data?.billTo?.business || 'Das Industrial Controls'}</strong>
              </p>
              <p>{data?.billTo?.address || 'Panvel, Maharashtra, India'}</p>
              <p>
                <strong>PHONE:</strong> {data?.billTo?.phone || '7039542259'}
              </p>
              <p>
                <strong>GSTIN:</strong> {data?.billTo?.gstNo || '27DVTPS2973B1Z0'}
              </p>
              <p>
                <strong>State:</strong> {data?.billTo?.state || 'Maharashtra'}
              </p>
            </div>
            <div>
              <p>
                <strong>L.R. No:</strong> -
              </p>
              <p>
                <strong>Transport:</strong> STAR TRANSPORTS
              </p>
              <p>
                <strong>Transport ID:</strong> 562345
              </p>
              <p>
                <strong>Vehicle Number:</strong> GJ01HJ2520
              </p>
            </div>
          </div>
        </div>
    
        {/* Product Details Table */}
        <div className="border border-black mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-1 text-center w-10">Sr.</th>
                <th className="border border-gray-300 p-2 text-left w-2/3">Name of Product / Service</th>
                <th className="border border-gray-300 p-1 text-center w-16">HSN / SAC</th>
                <th className="border border-gray-300 p-1 text-center w-12">Qty</th>
                <th className="border border-gray-300 p-1 text-center w-12">Unit</th>
                <th className="border border-gray-300 p-1 text-right w-20">Taxable Value</th>
                <th className="border border-gray-300 p-0.5 text-center w-8 text-[10px] whitespace-nowrap">GST%</th>
                <th className="border border-gray-300 p-1 text-right w-24">Total</th>
              </tr>
            </thead>
            <tbody>
              {data?.items?.length > 0 ? (
                data.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-1 text-center">{index + 1}</td>
                    <td className="border border-gray-300 p-2">{item.productName}</td>
                    <td className="border border-gray-300 p-1 text-center">85446090</td>
                    <td className="border border-gray-300 p-1 text-center">{item.quantity}</td>
                    <td className="border border-gray-300 p-1 text-center">{item.unit}</td>
                    <td className="border border-gray-300 p-1 text-right">{parseFloat(item.amount).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="border border-gray-300 p-0 text-center text-xs">18%</td>
                    <td className="border border-gray-300 p-1 text-right">{parseFloat(item.amount * 1.18).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                  </tr>
                ))
              ) : (
                <>
                  <tr>
                    <td className="border border-gray-300 p-1 text-center">1</td>
                    <td className="border border-gray-300 p-2">ACSR Dog Conductor</td>
                    <td className="border border-gray-300 p-1 text-center">76042910</td>
                    <td className="border border-gray-300 p-1 text-center">120,000</td>
                    <td className="border border-gray-300 p-1 text-center">MTR</td>
                    <td className="border border-gray-300 p-1 text-right">9,840,000.00</td>
                    <td className="border border-gray-300 p-0 text-center text-xs">18%</td>
                    <td className="border border-gray-300 p-1 text-right">11,612,400.00</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-1 text-center">2</td>
                    <td className="border border-gray-300 p-2">AAAC Panther 232 SQMM</td>
                    <td className="border border-gray-300 p-1 text-center">85446090</td>
                    <td className="border border-gray-300 p-1 text-center">120,000</td>
                    <td className="border border-gray-300 p-1 text-center">MTR</td>
                    <td className="border border-gray-300 p-1 text-right">24,600,000.00</td>
                    <td className="border border-gray-300 p-0 text-center text-xs">18%</td>
                    <td className="border border-gray-300 p-1 text-right">29,028,000.00</td>
                  </tr>
                </>
              )}
              {/* Empty rows for spacing */}
              {[...Array(8)].map((_, i) => (
                <tr key={i} className="h-8">
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2"></td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td className="border border-gray-300 p-2" colSpan="5">
                  Total
                </td>
                <td className="border border-gray-300 p-2">{data?.subtotal?.toFixed(2) || '34,440,000'}</td>
                <td className="border border-gray-300 p-2">{data?.taxAmount?.toFixed(2) || '6,200,400'}</td>
                <td className="border border-gray-300 p-2">{data?.total?.toFixed(2) || '40,640,400'}</td>
              </tr>
            </tbody>
          </table>
        </div>
    
        {/* Amount Summary */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border border-black p-3">
            <h3 className="font-bold text-xs mb-2">Bank Details</h3>
            <div className="text-xs space-y-1">
              <p>
                <strong>Bank Name:</strong> ICICI Bank
              </p>
              <p>
                <strong>Branch Name:</strong> WRIGHT TOWN JABALPUR
              </p>
              <p>
                <strong>Bank Account Number:</strong> 657605601783
              </p>
              <p>
                <strong>Bank Branch IFSC:</strong> ICIC0006576
              </p>
            </div>
          </div>
          <div className="border border-black p-3">
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Taxable Amount</span>
                <span>{data?.subtotal?.toFixed(2) || '34,440,000'}</span>
              </div>
              <div className="flex justify-between">
                <span>Add: Total GST (18%)</span>
                <span>{data?.taxAmount?.toFixed(2) || '6,200,400'}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-1">
                <span>Total Amount After Tax</span>
                <span>₹ {data?.total?.toFixed(2) || '40,640,400'}</span>
              </div>
              <div className="text-center mt-2">
                <span className="text-xs">(Rupees Four Crore Six Lakh Forty Thousand Four Hundred Only)</span>
              </div>
            </div>
          </div>
        </div>
    
        {/* Terms and Conditions */}
        <div className="border border-black mb-4">
          <div className="bg-gray-100 p-2 font-bold text-xs">
            <h3>Terms and Conditions</h3>
          </div>
          <div className="p-3 text-xs space-y-2">
            <div>
              <h4 className="font-bold">PRICING & VALIDITY</h4>
              <p>
                • Prices are valid for 3 days only from the date of the final quotation/PI unless otherwise specified
                terms.
              </p>
              <p>• The order will be considered confirmed only upon receipt of the advance payment.</p>
            </div>
            <div>
              <h4 className="font-bold">PAYMENT TERMS</h4>
              <p>• 30% advance payment upon order confirmation</p>
              <p>• Remaining Balance at time of final dispatch / against LC / Bank Guarantee (if applicable).</p>
              <p>
                • Liquidated Damages @ 0.5% to 1% per WEEK will be charged on delayed payments beyond the agreed terms.
              </p>
            </div>
            <div>
              <h4 className="font-bold">DELIVERY & DISPATCH</h4>
              <p>• Standard delivery period as per the telecommunication with customer.</p>
              <p>
                • Any delays due to unforeseen circumstances (force majeure, strikes, and transportation issues) will be
                communicated.
              </p>
            </div>
            <div>
              <h4 className="font-bold">QUALITY & WARRANTY</h4>
              <p>
                • Cables will be supplied as per IS and other applicable BIS standards/or as per the agreed specifications
                mentioned/special demand by the customer.
              </p>
              <p>• Any manufacturing defects should be reported immediately, within 3 working days of receipt.</p>
              <p>• Warranty: 12 months from the date of dispatch for manufacturing defects only in ISI mark products.</p>
            </div>
          </div>
        </div>
    
        {/* Footer */}
        <div className="text-right text-xs">
          <p className="mb-4">
            For <strong>{selectedBranch.name}</strong>
          </p>
          <p className="mb-8">This is computer generated invoice no signature required.</p>
          <p className="font-bold">Authorized Signatory</p>
          {user && (
            <p className="mt-2 text-sm font-semibold text-gray-800">
              {user.username || user.email || 'User'}
            </p>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end mt-4 space-x-3">
        <button
          onClick={async () => {
            try {
              // Import html2pdf dynamically
              const html2pdf = (await import('html2pdf.js')).default;
              
              // Create a temporary div with the quotation content
              const tempDiv = document.createElement('div');
              tempDiv.style.position = 'absolute';
              tempDiv.style.left = '-9999px';
              tempDiv.innerHTML = document.querySelector('.max-w-4xl').innerHTML;
              document.body.appendChild(tempDiv);
              
              // Generate PDF
              const opt = {
                margin: 0.5,
                filename: `quotation-${data?.quotationNumber || 'quotation'}-${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                  scale: 2,
                  useCORS: true,
                  logging: false,
                  letterRendering: true
                },
                jsPDF: { 
                  unit: 'in', 
                  format: 'letter', 
                  orientation: 'portrait' 
                }
              };
              
              await html2pdf().set(opt).from(tempDiv).save();
              
              // Clean up
              document.body.removeChild(tempDiv);
            } catch (error) {
              console.error('Error generating PDF:', error);
              alert('Failed to generate PDF. Please try again.');
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
}

export default function CreateQuotationForm({ customer, user, onClose, onSave }) {
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
        quantity: 1,
        unit: "Nos",
        companyRate: 0,
        buyerRate: 0,
        amount: 0
      }
    ],
    subtotal: 0,
    taxRate: 18,
    taxAmount: 0,
    total: 0,
    terms: "1. Payment terms: 30 days from invoice date\n2. Delivery: 15-20 working days\n3. Prices are subject to change without notice\n4. All disputes subject to Jabalpur jurisdiction",
    // Editable bill-to information
    billTo: {
      business: customer?.business || "",
      address: customer?.address || "",
      phone: customer?.phone || "",
      gstNo: customer?.gstNo || "",
      state: customer?.state || ""
    }
  })

  const handleInputChange = (field, value) => {
    const newData = {
      ...quotationData,
      [field]: value
    };

    // If quotationDate changes, update validUpto to be 7 days later
    if (field === 'quotationDate') {
      newData.validUpto = getSevenDaysLater(value);
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
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].buyerRate;
    }
    
    // Calculate totals
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = (subtotal * quotationData.taxRate) / 100
    const total = subtotal + taxAmount
    
    setQuotationData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      taxAmount,
      total
    }))
  }

  const addItem = () => {
    setQuotationData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: prev.items.length + 1,
        productName: "",
        quantity: 1,
        unit: "Nos",
        companyRate: 0,
        buyerRate: 0,
        amount: 0
      }]
    }))
  }

  const removeItem = (index) => {
    if (quotationData.items.length > 1) {
      const updatedItems = quotationData.items.filter((_, i) => i !== index)
      const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
      const taxAmount = (subtotal * quotationData.taxRate) / 100
      const total = subtotal + taxAmount
      
      setQuotationData(prev => ({
        ...prev,
        items: updatedItems,
        subtotal,
        taxAmount,
        total
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...quotationData,
      customer: customer,
      createdAt: new Date().toISOString()
    })
    onClose()
  }

  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState({});

  // Update preview data when form data changes
  useEffect(() => {
    setPreviewData(quotationData);
  }, [quotationData]);

  const togglePreview = () => {
    setShowPreview(!showPreview);
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
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

        <CardContent className="p-6">
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
                  <label className="text-sm font-medium text-gray-700">GST Number *</label>
                  <input
                    type="text"
                    required
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

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company Rate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer Rate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {quotationData.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            placeholder="Product name"
                            value={item.productName}
                            onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                            required
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={item.unit}
                            onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            <option value="Nos">Nos</option>
                            <option value="Mtr">Mtr</option>
                            <option value="Kg">Kg</option>
                            <option value="Set">Set</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.companyRate}
                              readOnly
                              className="w-24 px-2 py-1 border border-gray-200 rounded text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                              title="Company rate is fixed and cannot be edited"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 002 0v-3a1 1 0 10-2 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.buyerRate}
                            onChange={(e) => handleItemChange(index, 'buyerRate', parseFloat(e.target.value) || 0)}
                            className="w-24 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">
                          ₹{item.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          {quotationData.items.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeItem(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
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
                  <div className="flex justify-between text-sm">
                    <span>GST ({quotationData.taxRate}%):</span>
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Terms & Conditions
              </label>
              <textarea
                value={quotationData.terms}
                onChange={(e) => handleInputChange("terms", e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Enter terms and conditions"
              />
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
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={togglePreview}
                >
                  Preview & Save
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
