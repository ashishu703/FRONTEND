import html2pdf from 'html2pdf.js'
import React, { useMemo, useState } from 'react'

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

export function CorporateStandardInvoice({ selectedBranch = 'ANODE', companyBranches, quotations = [] }) {
    // Default company branches if not provided
    const defaultBranches = {
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
    
    const branches = companyBranches || defaultBranches
    const currentBranch = branches[selectedBranch] || branches.ANODE

    // New: Allow selecting a Quotation to prefill PI lines
    const [selectedQuotationNumber, setSelectedQuotationNumber] = useState(quotations?.[0]?.quotationNumber || '')
    const selectedQuotation = useMemo(() => {
      return quotations?.find(q => q.quotationNumber === selectedQuotationNumber) || quotations?.[0] || null
    }, [quotations, selectedQuotationNumber])
    const items = selectedQuotation?.items || []
    const billTo = selectedQuotation?.billTo || {}
    const subtotal = selectedQuotation?.subtotal || items.reduce((s,i)=> s + (i.amount||0), 0)
    const discountRate = parseFloat(selectedQuotation?.discountRate || 0)
    const discountAmount = selectedQuotation?.discountAmount != null 
      ? parseFloat(selectedQuotation.discountAmount) 
      : (subtotal * discountRate) / 100
    const taxableAmount = Math.max(0, subtotal - discountAmount)
    const taxRate = selectedQuotation?.taxRate ?? 18
    const taxAmount = selectedQuotation?.taxAmount ?? (taxableAmount * taxRate / 100)
    const total = selectedQuotation?.total ?? (taxableAmount + taxAmount)
    
    // Calculate CGST and SGST (split tax equally for 18% GST)
    const cgstRate = taxRate / 2
    const sgstRate = taxRate / 2
    const cgstAmount = taxAmount / 2
    const sgstAmount = taxAmount / 2
    
    // Get invoice date and number
    const invoiceDate = selectedQuotation?.quotationDate || new Date().toISOString().split('T')[0]
    const invoiceNumber = `PI-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    const referenceNo = `${Math.floor(Math.random() * 10000)}`
    const dispatchDocNo = `${Math.floor(Math.random() * 1000)}`
    
    // Convert amount to words
    const amountInWords = numberToWords(Math.round(total)) + ' Only'
    const taxAmountInWords = numberToWords(Math.round(taxAmount)) + ' Only'
    
    // State code mapping (first 2 digits of GST)
    const getStateCode = (gstNo) => {
      if (!gstNo) return '23'
      const code = gstNo.substring(0, 2)
      return code || '23'
    }
    
    const stateCode = getStateCode(billTo.gstNo || currentBranch.gstNumber)
    const stateName = billTo.state || 'Madhya Pradesh'
    
    const handlePrint = async () => {
      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      const invoiceElement = document.getElementById('pi-content')
      
      if (printWindow && invoiceElement) {
        const convertImageToBase64 = (imgUrl) => {
          return new Promise((resolve) => {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => {
              const canvas = document.createElement('canvas')
              const ctx = canvas.getContext('2d')
              canvas.width = img.width
              canvas.height = img.height
              ctx.drawImage(img, 0, 0)
              resolve(canvas.toDataURL('image/png'))
            }
            img.onerror = () => resolve(imgUrl)
            img.src = imgUrl
          })
        }

        const logoUrl = 'https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png'
        const base64Logo = await convertImageToBase64(logoUrl)
        
        const clonedContent = invoiceElement.cloneNode(true)
        const logoImg = clonedContent.querySelector('img')
        if (logoImg) {
          logoImg.src = base64Logo
        }
        
        printWindow.document.write(`
          <html>
            <head>
              <title>Proforma Invoice - ${invoiceNumber}</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                @media print {
                  .no-print { display: none !important; }
                }
              </style>
            </head>
            <body class="bg-gray-100">
              <div class="container">${clonedContent.innerHTML}</div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
        printWindow.close()
      }
    }
    
    return (
      <div className="max-w-4xl mx-auto bg-white font-sans text-xs" id="pi-content">
        <div className="p-4">
          {/* Header Section */}
          <div className="border-2 border-black mb-2">
            <div className="p-2 flex justify-between items-start">
              {/* Seller Information (Left) */}
              <div className="flex-1">
                <h1 className="text-lg font-bold">{currentBranch.name}</h1>
                <p className="text-xs font-semibold">GSTIN/UIN: {currentBranch.gstNumber}</p>
                <p className="text-xs">State Name: {stateName}, Code: {stateCode}</p>
                <p className="text-xs">{currentBranch.address}</p>
                <div className="mt-1 space-y-0">
                  {currentBranch.tel && <p className="text-xs">Contact: +91-{currentBranch.tel.split(',')[0]}</p>}
                  {currentBranch.email && <p className="text-xs">E-Mail: {currentBranch.email}</p>}
                  {currentBranch.web && <p className="text-xs">Website: {currentBranch.web}</p>}
                </div>
              </div>
              
              {/* Logo (Right) */}
              <div className="text-right ml-4">
                <img
                  src="https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png"
                  alt="Company Logo"
                  className="h-16 w-auto bg-white p-1 rounded"
                />
              </div>
            </div>
          </div>

          {/* Invoice Details Section */}
          <div className="border-2 border-black mb-2">
            <div className="bg-gray-100 p-1 text-center font-bold text-xs border-b border-black">
              <h2>PROFORMA INVOICE</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 p-2">
              {/* Left: Consignee & Buyer Info */}
              <div className="space-y-2">
                {/* Consignee */}
                <div className="border border-black p-1">
                  <p className="font-bold text-xs mb-1">Consignee (Ship to):</p>
                  <p className="text-xs font-semibold">{billTo.business || 'Customer'}</p>
                  <p className="text-xs">{billTo.address || ''}</p>
                  <p className="text-xs">State Name: {stateName}, Code: {stateCode}</p>
                  {billTo.phone && <p className="text-xs">Contact: {billTo.phone}</p>}
                </div>
                
                {/* Buyer */}
                <div className="border border-black p-1">
                  <p className="font-bold text-xs mb-1">Buyer (Bill to):</p>
                  <p className="text-xs font-semibold">{billTo.business || 'Customer'}</p>
                  <p className="text-xs">{billTo.address || ''}</p>
                  <p className="text-xs">State Name: {stateName}, Code: {stateCode}</p>
                  <p className="text-xs">Place of Supply: {stateName}</p>
                  {billTo.phone && <p className="text-xs">Contact: {billTo.phone}</p>}
                </div>
              </div>
              
              {/* Right: Invoice Details */}
              <div className="border border-black p-1 space-y-1 text-xs">
                <div className="grid grid-cols-2 gap-1">
                  <span className="font-semibold">Invoice No.:</span>
                  <span>{invoiceNumber}</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="font-semibold">Dated:</span>
                  <span>{new Date(invoiceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="font-semibold">Delivery Note:</span>
                  <span></span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="font-semibold">Mode/Terms of Payment:</span>
                  <span></span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="font-semibold">Reference No. & Date:</span>
                  <span>{referenceNo} dt. {new Date(invoiceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="font-semibold">Other References:</span>
                  <span>DIRECT SALE</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="font-semibold">Buyer's Order No.:</span>
                  <span></span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="font-semibold">Dated:</span>
                  <span></span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="font-semibold">Dispatch Doc No.:</span>
                  <span>{dispatchDocNo}</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="font-semibold">Delivery Note Date:</span>
                  <span></span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="font-semibold">Dispatched through:</span>
                  <span>SELF VEHICLE</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="font-semibold">Destination:</span>
                  <span>{stateName.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="font-semibold">Bill of Lading/LR-RR No. dt. {new Date(invoiceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}:</span>
                  <span></span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="font-semibold">Motor Vehicle No.:</span>
                  <span></span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="font-semibold">Terms of Delivery:</span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Goods Description Table */}
          <div className="border-2 border-black mb-2">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-1 text-center w-8">Sl No</th>
                  <th className="border border-black p-1 text-left">Description of Goods</th>
                  <th className="border border-black p-1 text-center w-16">HSN/SAC</th>
                  <th className="border border-black p-1 text-center w-12">Part No.</th>
                  <th className="border border-black p-1 text-center w-16">Quantity (Shipped)</th>
                  <th className="border border-black p-1 text-center w-16">Quantity (Billed)</th>
                  <th className="border border-black p-1 text-right w-16">Rate</th>
                  <th className="border border-black p-1 text-center w-12">per</th>
                  <th className="border border-black p-1 text-center w-12">Disc. %</th>
                  <th className="border border-black p-1 text-right w-20">Amount</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(items) && items.length > 0 && (
                  items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-black p-1 text-center">{index + 1}</td>
                      <td className="border border-black p-1">
                        <div>{item.productName || item.description}</div>
                        <div className="text-[10px] text-gray-600">Location: UNIT 1</div>
                      </td>
                      <td className="border border-black p-1 text-center">{item.hsn || item.hsnCode || '85441110'}</td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1 text-center">{parseFloat(item.quantity || 0).toFixed(4)} {item.unit || 'MTR'}</td>
                      <td className="border border-black p-1 text-center">{parseFloat(item.quantity || 0).toFixed(4)} {item.unit || 'MTR'}</td>
                      <td className="border border-black p-1 text-right">{parseFloat(item.buyerRate || item.unitPrice || item.rate || 0).toFixed(2)}</td>
                      <td className="border border-black p-1 text-center">{item.unit || 'MTR'}</td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1 text-right">{parseFloat(item.amount || item.taxableAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  ))
                )}
                
                {/* Empty rows for formatting */}
                {Array.from({ length: Math.max(0, 8 - items.length) }).map((_, i) => (
                  <tr key={`empty-${i}`} className="h-6">
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                  </tr>
                ))}
                
                {/* Totals Row */}
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-black p-1 text-center">Total</td>
                  <td className="border border-black p-1"></td>
                  <td className="border border-black p-1"></td>
                  <td className="border border-black p-1"></td>
                  <td className="border border-black p-1 text-center">{items.reduce((sum, i) => sum + parseFloat(i.quantity || 0), 0).toFixed(4)} {items[0]?.unit || 'MTR'}</td>
                  <td className="border border-black p-1 text-center">{items.reduce((sum, i) => sum + parseFloat(i.quantity || 0), 0).toFixed(4)} {items[0]?.unit || 'MTR'}</td>
                  <td className="border border-black p-1"></td>
                  <td className="border border-black p-1"></td>
                  <td className="border border-black p-1"></td>
                  <td className="border border-black p-1 text-right">{parseFloat(subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax and Amount Section */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            {/* CGST */}
            <div className="border-2 border-black p-1">
              <p className="font-bold text-xs mb-1">CGST</p>
              <p className="text-xs">{parseFloat(cgstAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            
            {/* SGST */}
            <div className="border-2 border-black p-1">
              <p className="font-bold text-xs mb-1">SGST</p>
              <p className="text-xs">{parseFloat(sgstAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            
            {/* Total Amount */}
            <div className="border-2 border-black p-1">
              <p className="font-bold text-xs mb-1">Total Amount</p>
              <p className="text-xs">{parseFloat(total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>

          {/* Bill Details */}
          <div className="border-2 border-black mb-2 p-1">
            <p className="text-xs"><strong>On Account:</strong> {parseFloat(total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Dr</p>
          </div>

          {/* Amount in Words */}
          <div className="border-2 border-black mb-2 p-1">
            <p className="text-xs"><strong>Amount Chargeable (in words):</strong> INR {amountInWords}</p>
          </div>

          {/* Tax Summary Table */}
          <div className="border-2 border-black mb-2">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th rowSpan={2} className="border border-black p-1 text-left">Taxable Value</th>
                  <th colSpan={2} className="border border-black p-1 text-center">CGST</th>
                  <th colSpan={2} className="border border-black p-1 text-center">SGST/UTGST</th>
                  <th rowSpan={2} className="border border-black p-1 text-center">Total Tax Amount</th>
                </tr>
                <tr className="bg-gray-100">
                  <th className="border border-black p-1 text-center">Rate</th>
                  <th className="border border-black p-1 text-center">Amount</th>
                  <th className="border border-black p-1 text-center">Rate</th>
                  <th className="border border-black p-1 text-center">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-1 text-right">{parseFloat(taxableAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="border border-black p-1 text-center">{cgstRate}%</td>
                  <td className="border border-black p-1 text-right">{parseFloat(cgstAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="border border-black p-1 text-center">{sgstRate}%</td>
                  <td className="border border-black p-1 text-right">{parseFloat(sgstAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="border border-black p-1 text-right">{parseFloat(taxAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-black p-1 text-right">Total</td>
                  <td className="border border-black p-1 text-center">{cgstRate}%</td>
                  <td className="border border-black p-1 text-right">{parseFloat(cgstAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="border border-black p-1 text-center">{sgstRate}%</td>
                  <td className="border border-black p-1 text-right">{parseFloat(sgstAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="border border-black p-1 text-right">{parseFloat(taxAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Amount in Words */}
          <div className="border-2 border-black mb-2 p-1">
            <p className="text-xs"><strong>Tax Amount (in words):</strong> INR {taxAmountInWords}</p>
          </div>

          {/* Bank Details and Declaration */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            {/* Company's Bank Details */}
            <div className="border-2 border-black p-2">
              <p className="font-bold text-xs mb-1">Company's Bank Details</p>
              <div className="text-xs space-y-0.5">
                <p><strong>A/c Holder's Name:</strong> {currentBranch.name}</p>
                <p><strong>Bank Name:</strong> ICICI BANK 01783</p>
                <p><strong>A/c No.:</strong> 657605601783</p>
                <p><strong>Branch & IFS Code:</strong> WRIGHT TOWN JABALPUR & ICIC0006576</p>
              </div>
            </div>
            
            {/* Declaration */}
            <div className="border-2 border-black p-2">
              <p className="font-bold text-xs mb-1">Declaration</p>
              <p className="text-xs">We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
            </div>
          </div>

          {/* Signatures */}
          <div className="border-2 border-black mb-2">
            <div className="grid grid-cols-4 gap-2 p-2">
              <div className="text-center">
                <p className="text-xs font-semibold mb-8">Customer's Seal and Signature</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold mb-8">Checked by</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold mb-8">Verified by</p>
              </div>
              <div className="text-center">
                <p className="text-xs mb-1">For {currentBranch.name}</p>
                <p className="text-xs font-semibold mb-8">Authorised Signatory</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-2 border-black p-1">
            <p className="text-xs text-center font-semibold">SUBJECT TO ALL DISPUTES ARE SUBJECT TO JABALPUR JURIDICTION. JURISDICTION</p>
            <p className="text-xs text-center mt-1">This is a Computer Generated Invoice</p>
          </div>
        </div>
      </div>
    )
  }
