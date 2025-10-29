import html2pdf from 'html2pdf.js'
import React, { useMemo, useState } from 'react'
// print icon removed with print control

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

    const handlePrint = async () => {
      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      const invoiceElement = document.getElementById('pi-content')
      
      if (printWindow && invoiceElement) {
        // Convert image to base64 to ensure it loads in PDF
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
            img.onerror = () => resolve(imgUrl) // Fallback to original URL
            img.src = imgUrl
          })
        }

        const logoUrl = 'https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png'
        const base64Logo = await convertImageToBase64(logoUrl)
        
        // Clone the content and replace the image src
        const clonedContent = invoiceElement.cloneNode(true)
        const logoImg = clonedContent.querySelector('img')
        if (logoImg) {
          logoImg.src = base64Logo
        }
        
        printWindow.document.write(`
          <html>
            <head>
              <title>Proforma Invoice - ${selectedQuotation?.quotationNumber || 'PI-25-26-458'}</title>
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
      <div className="max-w-4xl mx-auto bg-white font-sans text-sm" id="pi-content">
        <div className="p-6">
          <div className="border-2 border-black mb-4">
            <div className="p-2 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold">{currentBranch.name}</h1>
                {currentBranch.gstNumber && (
                  <p className="text-xs font-semibold text-gray-700">{currentBranch.gstNumber}</p>
                )}
                <p className="text-xs">{currentBranch.description}</p>
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
                    <strong>{currentBranch.address}</strong>
                  </p>
                </div>
                <div className="text-right">
                  {currentBranch.tel && <p>Tel: {currentBranch.tel}</p>}
                  {currentBranch.web && <p>Web: {currentBranch.web}</p>}
                  {currentBranch.email && <p>Email: {currentBranch.email}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="border border-black mb-4">
            <div className="bg-gray-100 p-2 text-center font-bold">
              <h2>Proforma Invoice Details</h2>
            </div>
            <div className="grid grid-cols-4 gap-2 p-2 text-xs border-b">
              <div>
                <strong>PI Date</strong>
              </div>
              <div>
                <strong>PI Number</strong>
              </div>
              <div>
                <strong>Valid Upto</strong>
              </div>
              <div>
                <strong>Voucher Number</strong>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 p-2 text-xs">
              <div>{new Date().toLocaleDateString()}</div>
              <div>PI-{new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}-{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}</div>
              <div>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
              <div>VOUCH-{String(Math.floor(Math.random() * 10000)).padStart(4, '0')}</div>
            </div>
          </div>

          <div className="border border-black mb-4">
            <div className="grid grid-cols-2 gap-4 p-3 text-xs">
              <div>
                <h3 className="font-bold mb-2">BILL TO:</h3>
                <p>
                  <strong>{billTo.business || 'Customer'}</strong>
                </p>
                {billTo.address && <p>{billTo.address}</p>}
                {billTo.phone && (
                  <p>
                    <strong>PHONE:</strong> {billTo.phone}
                  </p>
                )}
                {billTo.gstNo && (
                  <p>
                    <strong>GSTIN:</strong> {billTo.gstNo}
                  </p>
                )}
                {billTo.state && (
                  <p>
                    <strong>State:</strong> {billTo.state}
                  </p>
                )}
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

          <div className="border border-black mb-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-1 text-center w-10">Sr.</th>
                  <th className="border border-gray-300 p-2 text-left">Name of Product / Service</th>
                  <th className="border border-gray-300 p-1 text-center w-16">HSN / SAC</th>
                  <th className="border border-gray-300 p-1 text-center w-12">Qty</th>
                  <th className="border border-gray-300 p-1 text-center w-12">Unit</th>
                  <th className="border border-gray-300 p-1 text-right w-20">Buyer Rate</th>
                  <th className="border border-gray-300 p-1 text-right w-20">Taxable Value</th>
                  <th className="border border-gray-300 p-0.5 text-center w-8 text-[10px] whitespace-nowrap">GST%</th>
                  <th className="border border-gray-300 p-1 text-right w-24">Total</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(items) && items.length > 0 ? (
                  items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-1 text-center">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{item.productName || item.description}</td>
                      <td className="border border-gray-300 p-1 text-center">{item.hsn || '85446090'}</td>
                      <td className="border border-gray-300 p-1 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 p-1 text-center">{item.unit || 'Nos'}</td>
                      <td className="border border-gray-300 p-1 text-right">{parseFloat(item.buyerRate || item.unitPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="border border-gray-300 p-1 text-right">{parseFloat(item.amount || item.taxable || item.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="border border-gray-300 p-0 text-center text-xs">{item.gstRate ? `${item.gstRate}%` : '18%'}</td>
                      <td className="border border-gray-300 p-1 text-right">{parseFloat((item.amount ?? item.total ?? 0) * (item.gstMultiplier ?? 1.18)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border border-gray-300 p-1 text-center">1</td>
                    <td className="border border-gray-300 p-2">cable</td>
                    <td className="border border-gray-300 p-1 text-center">85446090</td>
                    <td className="border border-gray-300 p-1 text-center">1</td>
                    <td className="border border-gray-300 p-1 text-center">Nos</td>
                    <td className="border border-gray-300 p-1 text-right">100.00</td>
                    <td className="border border-gray-300 p-1 text-right">100.00</td>
                    <td className="border border-gray-300 p-0 text-center text-xs">18%</td>
                    <td className="border border-gray-300 p-1 text-right">118.00</td>
                  </tr>
                )}

                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="h-8">
                    <td className="border border-gray-300 p-2"></td>
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
                  <td className="border border-gray-300 p-2 text-left">Total</td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2">{subtotal?.toFixed ? subtotal.toFixed(2) : (subtotal || '').toString()}</td>
                  <td className="border border-gray-300 p-2">{taxAmount?.toFixed ? taxAmount.toFixed(2) : (taxAmount || '').toString()}</td>
                  <td className="border border-gray-300 p-2">{total?.toFixed ? total.toFixed(2) : (total || '').toString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

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
                  <span>Subtotal</span>
                  <span>{subtotal?.toFixed ? subtotal.toFixed(2) : (subtotal || '0.00')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Less: Discount ({discountRate || 0}%)</span>
                  <span>{discountAmount?.toFixed ? discountAmount.toFixed(2) : (discountAmount || '0.00')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxable Amount</span>
                  <span>{(typeof subtotal === 'number' ? (subtotal - (discountAmount || 0)).toFixed(2) : (taxableAmount || '')).toString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Add: Total GST ({taxRate || 18}%)</span>
                  <span>{taxAmount?.toFixed ? taxAmount.toFixed(2) : (taxAmount || '0.00')}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-1">
                  <span>Total Amount After Tax</span>
                  <span>₹ {total?.toFixed ? total.toFixed(2) : (total || '0.00')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-black mb-4">
            <div className="bg-gray-100 p-2 font-bold text-xs">
              <h3>Terms and Conditions</h3>
            </div>
            <div className="p-3 text-xs space-y-2">
              <div>
                <h4 className="font-bold">PRICING & VALIDITY</h4>
                <p>• Prices are valid for 3 days only from the date of the final quotation/PI unless otherwise specified terms.</p>
                <p>• The order will be considered confirmed only upon receipt of the advance payment.</p>
              </div>
              <div>
                <h4 className="font-bold">PAYMENT TERMS</h4>
                <p>• 30% advance payment upon order confirmation</p>
                <p>• Remaining Balance at time of final dispatch / against LC / Bank Guarantee (if applicable).</p>
                <p>• Liquidated Damages @ 0.5% to 1% per WEEK will be charged on delayed payments beyond the agreed terms.</p>
              </div>
              <div>
                <h4 className="font-bold">DELIVERY & DISPATCH</h4>
                <p>• Standard delivery period as per the telecommunication with customer.</p>
                <p>• Any delays due to unforeseen circumstances (force majeure, strikes, and transportation issues) will be communicated.</p>
              </div>
              <div>
                <h4 className="font-bold">QUALITY & WARRANTY</h4>
                <p>• Cables will be supplied as per IS and other applicable BIS standards/or as per the agreed specifications mentioned/special demand by the customer.</p>
                <p>• Any manufacturing defects should be reported immediately, within 3 working days of receipt.</p>
                <p>• Warranty: 12 months from the date of dispatch for manufacturing defects only in ISI mark products.</p>
              </div>
            </div>
          </div>

          <div className="text-right text-xs">
            <p className="mb-4">For <strong>{currentBranch.name}</strong></p>
            <p className="mb-8">This is computer generated invoice no signature required.</p>
            <p className="font-bold">Authorized Signatory</p>
            <p className="mt-2 text-sm font-semibold text-gray-800">Salesperson</p>
          </div>
        </div>
      </div>
    )
  }
  