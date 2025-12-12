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

export default function PITemplate2({ selectedBranch = 'ANODE', companyBranches, quotations = [] }) {
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
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-white font-sans text-sm" id="pi-content" style={{ 
      fontFamily: 'Arial, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale'
    }}>
      <div className="p-6">
        {/* Modern Header with Gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-t-lg mb-4 shadow-lg">
          <div className="p-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{currentBranch.name}</h1>
              {currentBranch.gstNumber && (
                <p className="text-sm opacity-90">{currentBranch.gstNumber}</p>
              )}
              <p className="text-xs opacity-80 mt-1">{currentBranch.description}</p>
            </div>
            <div>
              <img
                src="https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png"
                alt="Company Logo"
                className="h-16 w-auto bg-white p-2 rounded-lg shadow-md"
              />
            </div>
          </div>
          <div className="px-4 pb-4 text-sm">
            <p><strong>{currentBranch.address}</strong></p>
            <div className="flex gap-4 mt-1 text-xs opacity-90">
              {currentBranch.tel && <span>Tel: {currentBranch.tel}</span>}
              {currentBranch.web && <span>Web: {currentBranch.web}</span>}
              {currentBranch.email && <span>Email: {currentBranch.email}</span>}
            </div>
          </div>
        </div>

        {/* Proforma Invoice Title */}
        <div className="bg-white rounded-lg shadow-md mb-4 p-4 border-l-4 border-purple-600">
          <h2 className="text-2xl font-bold text-purple-800 text-center">PROFORMA INVOICE</h2>
        </div>

        {/* Invoice Details - Modern Card Style */}
        <div className="bg-white rounded-lg shadow-md mb-4 p-4 border-l-4 border-green-500">
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div>
              <h3 className="font-bold text-green-600 mb-3 text-sm">BUYER DETAILS:</h3>
              <p className="font-semibold text-gray-800 text-base">{billTo.business || 'Customer'}</p>
              {billTo.address && <p className="text-gray-600 mt-1">{billTo.address}</p>}
              <p className="text-gray-600 mt-1">State: {stateName}, Code: {stateCode}</p>
              <p className="text-gray-600 mt-1">Place of Supply: {stateName}</p>
              {billTo.phone && <p className="mt-2"><strong className="text-gray-700">PHONE:</strong> <span className="text-gray-600">{billTo.phone}</span></p>}
              {billTo.gstNo && <p className="mt-1"><strong className="text-gray-700">GSTIN:</strong> <span className="text-gray-600">{billTo.gstNo}</span></p>}
            </div>
            <div className="bg-gray-50 rounded p-3">
              <p className="text-gray-700"><strong>Proforma Invoice No.:</strong> {selectedQuotation?.invoiceNumber || invoiceNumber}</p>
              <p className="text-gray-700 mt-2"><strong>Date:</strong> {new Date(invoiceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}</p>
            </div>
          </div>
        </div>

        {/* Products Table - Modern Style */}
        <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                <th className="p-2 text-center border-r border-purple-500">Sr.</th>
                <th className="p-2 text-left border-r border-purple-500">Item Description</th>
                <th className="p-2 text-center border-r border-purple-500">HSN Code</th>
                <th className="p-2 text-center border-r border-purple-500">Qty</th>
                <th className="p-2 text-center border-r border-purple-500">Unit</th>
                <th className="p-2 text-right border-r border-purple-500">Rate</th>
                <th className="p-2 text-right border-r border-purple-500">Amount</th>
                <th className="p-2 text-center border-r border-purple-500">Tax %</th>
                <th className="p-2 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(items) && items.length > 0 && items.map((item, index) => {
                const itemTaxRate = item.gstRate || taxRate || 18
                const itemAmount = parseFloat(item.amount || item.taxableAmount || 0)
                const itemTaxAmount = (itemAmount * itemTaxRate) / 100
                const itemTotal = itemAmount + itemTaxAmount
                return (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-2 text-center">{index + 1}</td>
                    <td className="p-2">{item.productName || item.description}</td>
                    <td className="p-2 text-center">{item.hsn || item.hsnCode || '85441110'}</td>
                    <td className="p-2 text-center">{parseFloat(item.quantity || 0).toFixed(2)}</td>
                    <td className="p-2 text-center">{item.unit || 'Nos'}</td>
                    <td className="p-2 text-right">{parseFloat(item.buyerRate || item.unitPrice || item.rate || 0).toFixed(2)}</td>
                    <td className="p-2 text-right">{itemAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="p-2 text-center">{itemTaxRate}%</td>
                    <td className="p-2 text-right font-semibold">{itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                )
              })}
              <tr className="bg-gradient-to-r from-purple-100 to-purple-50 font-bold">
                <td className="p-2 text-center">Total</td>
                <td className="p-2"></td>
                <td className="p-2"></td>
                <td className="p-2 text-center">{items.reduce((sum, i) => sum + parseFloat(i.quantity || 0), 0).toFixed(2)}</td>
                <td className="p-2">{items[0]?.unit || 'Nos'}</td>
                <td className="p-2"></td>
                <td className="p-2 text-right">{parseFloat(subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-2"></td>
                <td className="p-2 text-right">{parseFloat(total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tax Summary - Modern Cards */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 shadow-md">
            <p className="font-bold text-xs text-blue-800 mb-1">CGST</p>
            <p className="text-sm font-semibold text-blue-900">₹{parseFloat(cgstAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 shadow-md">
            <p className="font-bold text-xs text-green-800 mb-1">SGST</p>
            <p className="text-sm font-semibold text-green-900">₹{parseFloat(sgstAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 shadow-md">
            <p className="font-bold text-xs text-purple-800 mb-1">Total Amount</p>
            <p className="text-lg font-bold text-purple-900">₹{parseFloat(total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        {/* Amount Payable */}
        <div className="bg-white rounded-lg shadow-md mb-4 p-4 border-l-4 border-orange-500">
          <p className="text-sm"><strong>Amount Payable:</strong> <span className="text-lg font-bold text-orange-600">₹{parseFloat(total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          <p className="text-xs text-gray-600 mt-2"><strong>Amount Chargeable (in words):</strong> INR {amountInWords}</p>
        </div>

        {/* Tax Summary Table */}
        <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                <th rowSpan={2} className="p-2 text-left border-r border-gray-600">Taxable Value</th>
                <th colSpan={2} className="p-2 text-center border-r border-gray-600">CGST</th>
                <th colSpan={2} className="p-2 text-center border-r border-gray-600">SGST/UTGST</th>
                <th rowSpan={2} className="p-2 text-center">Total Tax Amount</th>
              </tr>
              <tr className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                <th className="p-2 text-center border-r border-gray-600">Rate</th>
                <th className="p-2 text-center border-r border-gray-600">Amount</th>
                <th className="p-2 text-center border-r border-gray-600">Rate</th>
                <th className="p-2 text-center border-r border-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-2 text-right">{parseFloat(taxableAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-2 text-center">{cgstRate}%</td>
                <td className="p-2 text-right">{parseFloat(cgstAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-2 text-center">{sgstRate}%</td>
                <td className="p-2 text-right">{parseFloat(sgstAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-2 text-right font-semibold">{parseFloat(taxAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bank Details and Declaration */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <p className="font-bold text-sm mb-2 text-blue-800">Company's Bank Details</p>
            <div className="text-xs space-y-1 text-gray-700">
              <p><strong>A/c Holder's Name:</strong> {currentBranch.name}</p>
              <p><strong>Bank Name:</strong> ICICI BANK 01783</p>
              <p><strong>A/c No.:</strong> 657605601783</p>
              <p><strong>Branch & IFS Code:</strong> WRIGHT TOWN JABALPUR & ICIC0006576</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <p className="font-bold text-sm mb-2 text-green-800">Declaration</p>
            <p className="text-xs text-gray-700">We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-white rounded-lg shadow-md mb-4 p-4 border-l-4 border-purple-500">
          <p className="font-bold text-sm mb-2 text-purple-800">Terms & Conditions:</p>
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

        {/* Signatures */}
        <div className="bg-white rounded-lg shadow-md mb-4 p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center border-t-2 border-gray-300 pt-4">
              <p className="text-xs font-semibold text-gray-600">Customer's Seal and Signature</p>
            </div>
            <div className="text-center border-t-2 border-gray-300 pt-4">
              <p className="text-xs font-semibold text-gray-600">Checked by</p>
            </div>
            <div className="text-center border-t-2 border-gray-300 pt-4">
              <p className="text-xs font-semibold text-gray-600">Verified by</p>
            </div>
            <div className="text-center border-t-2 border-gray-300 pt-4">
              <p className="text-xs mb-1 text-gray-600">For {currentBranch.name}</p>
              <p className="text-xs font-semibold text-gray-700">Authorised Signatory</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 text-white rounded-lg p-3 text-center">
          <p className="text-xs font-semibold">SUBJECT TO ALL DISPUTES ARE SUBJECT TO JABALPUR JURIDICTION. JURISDICTION</p>
          <p className="text-xs mt-1 opacity-80">This is a Computer Generated Invoice</p>
        </div>
      </div>
    </div>
  )
}


