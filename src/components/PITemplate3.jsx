import React, { useMemo } from 'react'

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

export default function PITemplate3({ selectedBranch = 'ANODE', companyBranches, quotations = [] }) {
  const defaultBranches = {
    ANODE: {
      name: 'ANODE ELECTRIC PRIVATE LIMITED',
      gstNumber: '(23AANCA7455R1ZX)',
      description: 'MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES.',
      address: 'KHASRA NO. 805/5, PLOT NO. 10, IT PARK, BARGI HILLS, JABALPUR - 482003, MADHYA PRADESH, INDIA.',
      tel: '6262002116, 6262002113',
      web: 'www.anocab.com',
      email: 'info@anocab.com',
    },
    SAMRIDDHI_CABLE: {
      name: 'SAMRIDDHI CABLE INDUSTRIES PRIVATE LIMITED',
      gstNumber: '(23ABPCS7684F1ZT)',
      description: 'MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES.',
      address: 'KHASRA NO. 805/5, PLOT NO. 10, IT PARK, BARGI HILLS, JABALPUR - 482003, MADHYA PRADESH, INDIA.',
      tel: '6262002116, 6262002113',
      web: 'www.samriddhicable.com',
      email: 'info@samriddhicable.com',
    },
    SAMRIDDHI_INDUSTRIES: {
      name: 'SAMRIDDHI INDUSTRIES',
      gstNumber: '(23ABWFS1117M1ZT)',
      description: 'MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES.',
      address: 'KHASRA NO. 805/5, PLOT NO. 10, IT PARK, BARGI HILLS, JABALPUR - 482003, MADHYA PRADESH, INDIA.',
      tel: '6262002116, 6262002113',
      web: 'www.samriddhiindustries.com',
      email: 'info@samriddhiindustries.com',
    }
  }
  
  const branches = companyBranches || defaultBranches
  const currentBranch = branches[selectedBranch] || branches.ANODE
  
  const selectedQuotation = useMemo(() => {
    return quotations?.[0] || null
  }, [quotations])
  
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
  
  const cgstRate = taxRate / 2
  const sgstRate = taxRate / 2
  const cgstAmount = taxAmount / 2
  const sgstAmount = taxAmount / 2
  
  const invoiceDate = selectedQuotation?.quotationDate || new Date().toISOString().split('T')[0]
  const invoiceNumber = `PI-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
  
  const amountInWords = numberToWords(Math.round(total)) + ' Only'
  
  const getStateCode = (gstNo) => {
    if (!gstNo) return '23'
    const code = gstNo.substring(0, 2)
    return code || '23'
  }
  
  const stateCode = getStateCode(billTo.gstNo || currentBranch.gstNumber)
  const stateName = billTo.state || 'Madhya Pradesh'

  return (
    <div className="max-w-4xl mx-auto bg-white font-serif text-sm" id="pi-content" style={{ 
      fontFamily: 'Georgia, serif',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale'
    }}>
      <div className="p-8">
        {/* Minimal Header */}
        <div className="mb-6 pb-4 border-b-2 border-gray-300">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-light text-gray-800 tracking-wide">{currentBranch.name}</h1>
              {currentBranch.gstNumber && (
                <p className="text-xs text-gray-500 mt-1">{currentBranch.gstNumber}</p>
              )}
              <p className="text-xs text-gray-400 mt-1 italic">{currentBranch.description}</p>
            </div>
            <div>
              <img
                src="https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png"
                alt="Company Logo"
                className="h-14 w-auto opacity-90"
              />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-600">
            <p className="font-light">{currentBranch.address}</p>
            <div className="flex gap-3 mt-2 text-gray-500">
              {currentBranch.tel && <span>{currentBranch.tel}</span>}
              {currentBranch.web && <span>• {currentBranch.web}</span>}
              {currentBranch.email && <span>• {currentBranch.email}</span>}
            </div>
          </div>
        </div>

        {/* Minimal Proforma Invoice Title */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-light text-gray-800 text-center tracking-widest">PROFORMA INVOICE</h2>
        </div>

        {/* Minimal Invoice Details */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-8 text-xs">
            <div>
              <h3 className="font-light text-gray-500 mb-3 text-xs uppercase tracking-wide">Buyer Details</h3>
              <p className="font-medium text-gray-900 text-base mb-1">{billTo.business || 'Customer'}</p>
              {billTo.address && <p className="text-gray-600 mb-1">{billTo.address}</p>}
              <p className="text-gray-600 mb-1">State: {stateName}, Code: {stateCode}</p>
              <p className="text-gray-600 mb-1">Place of Supply: {stateName}</p>
              {billTo.phone && <p className="text-gray-600 mt-2">Phone: {billTo.phone}</p>}
              {billTo.gstNo && <p className="text-gray-600">GSTIN: {billTo.gstNo}</p>}
            </div>
            <div className="text-right">
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Proforma Invoice No.</p>
                  <p className="text-gray-900 font-medium">{selectedQuotation?.invoiceNumber || invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Date</p>
                  <p className="text-gray-900">{new Date(invoiceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Products Table */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-gray-400">
                <th className="p-3 text-left font-light text-gray-700">Sr.</th>
                <th className="p-3 text-left font-light text-gray-700">Item Description</th>
                <th className="p-3 text-center font-light text-gray-700">HSN</th>
                <th className="p-3 text-center font-light text-gray-700">Qty</th>
                <th className="p-3 text-center font-light text-gray-700">Unit</th>
                <th className="p-3 text-right font-light text-gray-700">Rate</th>
                <th className="p-3 text-right font-light text-gray-700">Amount</th>
                <th className="p-3 text-center font-light text-gray-700">Tax %</th>
                <th className="p-3 text-right font-light text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(items) && items.length > 0 && items.map((item, index) => {
                const itemTaxRate = item.gstRate || taxRate || 18
                const itemAmount = parseFloat(item.amount || item.taxableAmount || 0)
                const itemTaxAmount = (itemAmount * itemTaxRate) / 100
                const itemTotal = itemAmount + itemTaxAmount
                return (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="p-3 text-gray-700">{index + 1}</td>
                    <td className="p-3 text-gray-800">{item.productName || item.description}</td>
                    <td className="p-3 text-center text-gray-700">{item.hsn || item.hsnCode || '85441110'}</td>
                    <td className="p-3 text-center text-gray-700">{parseFloat(item.quantity || 0).toFixed(2)}</td>
                    <td className="p-3 text-center text-gray-700">{item.unit || 'Nos'}</td>
                    <td className="p-3 text-right text-gray-700">{parseFloat(item.buyerRate || item.unitPrice || item.rate || 0).toFixed(2)}</td>
                    <td className="p-3 text-right text-gray-700">{itemAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="p-3 text-center text-gray-700">{itemTaxRate}%</td>
                    <td className="p-3 text-right text-gray-800 font-medium">{itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                )
              })}
              <tr className="border-t-2 border-gray-400 font-medium">
                <td className="p-3 text-gray-900">Total</td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3 text-center text-gray-900">{items.reduce((sum, i) => sum + parseFloat(i.quantity || 0), 0).toFixed(2)}</td>
                <td className="p-3 text-center text-gray-700">{items[0]?.unit || 'Nos'}</td>
                <td className="p-3"></td>
                <td className="p-3 text-right text-gray-900">{parseFloat(subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-3"></td>
                <td className="p-3 text-right text-gray-900">{parseFloat(total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Minimal Tax Summary */}
        <div className="grid grid-cols-3 gap-6 mb-6 pb-4 border-b border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">CGST</p>
            <p className="text-base font-light text-gray-900">₹{parseFloat(cgstAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">SGST</p>
            <p className="text-base font-light text-gray-900">₹{parseFloat(sgstAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">Total Amount</p>
            <p className="text-xl font-light text-gray-900">₹{parseFloat(total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        {/* Amount Payable */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <p className="text-xs text-gray-600 mb-2"><strong>Amount Payable:</strong> <span className="text-lg font-light text-gray-900">₹{parseFloat(total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          <p className="text-xs text-gray-500 italic">Amount Chargeable (in words): INR {amountInWords}</p>
        </div>

        {/* Minimal Tax Summary Table */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-300">
                <th rowSpan={2} className="p-2 text-left font-light text-gray-700">Taxable Value</th>
                <th colSpan={2} className="p-2 text-center font-light text-gray-700 border-l border-r border-gray-300">CGST</th>
                <th colSpan={2} className="p-2 text-center font-light text-gray-700 border-r border-gray-300">SGST/UTGST</th>
                <th rowSpan={2} className="p-2 text-center font-light text-gray-700">Total Tax Amount</th>
              </tr>
              <tr className="border-b border-gray-300">
                <th className="p-2 text-center font-light text-gray-700 border-l border-r border-gray-300">Rate</th>
                <th className="p-2 text-center font-light text-gray-700 border-r border-gray-300">Amount</th>
                <th className="p-2 text-center font-light text-gray-700 border-r border-gray-300">Rate</th>
                <th className="p-2 text-center font-light text-gray-700 border-r border-gray-300">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-2 text-right text-gray-700">{parseFloat(taxableAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-2 text-center text-gray-700 border-l border-r border-gray-200">{cgstRate}%</td>
                <td className="p-2 text-right text-gray-700 border-r border-gray-200">{parseFloat(cgstAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-2 text-center text-gray-700 border-r border-gray-200">{sgstRate}%</td>
                <td className="p-2 text-right text-gray-700 border-r border-gray-200">{parseFloat(sgstAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-2 text-right text-gray-900 font-medium">{parseFloat(taxAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Minimal Bank Details and Declaration */}
        <div className="grid grid-cols-2 gap-8 mb-6 pb-4 border-b border-gray-200">
          <div>
            <p className="font-light text-xs text-gray-600 mb-3 uppercase tracking-wide">Company's Bank Details</p>
            <div className="text-xs space-y-1 text-gray-700">
              <p><strong>A/c Holder's Name:</strong> {currentBranch.name}</p>
              <p><strong>Bank Name:</strong> ICICI BANK 01783</p>
              <p><strong>A/c No.:</strong> 657605601783</p>
              <p><strong>Branch & IFS Code:</strong> WRIGHT TOWN JABALPUR & ICIC0006576</p>
            </div>
          </div>
          <div>
            <p className="font-light text-xs text-gray-600 mb-3 uppercase tracking-wide">Declaration</p>
            <p className="text-xs text-gray-700 italic">We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
          </div>
        </div>

        {/* Minimal Terms & Conditions */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <p className="font-light text-xs text-gray-600 mb-3 uppercase tracking-wide">Terms & Conditions</p>
          <div className="text-xs space-y-1 text-gray-700">
            {selectedQuotation?.paymentTerms && (
              <p><strong>Payment Terms:</strong> {selectedQuotation.paymentTerms}</p>
            )}
            {selectedQuotation?.deliveryTerms && (
              <p><strong>Delivery Terms:</strong> {selectedQuotation.deliveryTerms}</p>
            )}
            {selectedQuotation?.validity && (
              <p><strong>Validity of Proforma Invoice:</strong> {selectedQuotation.validity}</p>
            )}
            {selectedQuotation?.warranty && (
              <p><strong>Warranty:</strong> {selectedQuotation.warranty}</p>
            )}
          </div>
        </div>

        {/* Minimal Signatures */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center border-t border-gray-300 pt-6">
              <p className="text-xs font-light text-gray-600">Customer's Seal and Signature</p>
            </div>
            <div className="text-center border-t border-gray-300 pt-6">
              <p className="text-xs font-light text-gray-600">Checked by</p>
            </div>
            <div className="text-center border-t border-gray-300 pt-6">
              <p className="text-xs font-light text-gray-600">Verified by</p>
            </div>
            <div className="text-center border-t border-gray-300 pt-6">
              <p className="text-xs mb-1 text-gray-600">For {currentBranch.name}</p>
              <p className="text-xs font-light text-gray-800">Authorised Signatory</p>
            </div>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="text-center pt-4 border-t border-gray-300">
          <p className="text-xs text-gray-500 font-light">SUBJECT TO ALL DISPUTES ARE SUBJECT TO JABALPUR JURIDICTION. JURISDICTION</p>
          <p className="text-xs text-gray-400 mt-2 italic">This is a Computer Generated Invoice</p>
        </div>
      </div>
    </div>
  )
}
