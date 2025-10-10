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

export function CorporateStandardInvoice({ selectedBranch = 'SAMRIDDHI_CABLE', companyBranches, quotations = [] }) {
    // Default company branches if not provided
    const defaultBranches = {
        ANODE: {
            name: 'ANODE ELECTRIC PRIVATE LIMITED',
            gstNumber: '(23AANCA7455R1ZX)',
            description: 'MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES.',
            address: 'KHASRA NO. 805/5, PLOT NO. 10, IT PARK, BARGI HILLS, JABALPUR - 482003, MADHYA PRADESH, INDIA.',
            tel: '+91-761-492-0000',
            web: 'www.anodeelectric.com',
            email: 'info@anodeelectric.com'
        },
        SAMRIDDHI_CABLE: {
            name: 'SAMRIDDHI CABLE INDUSTRIES PRIVATE LIMITED',
            gstNumber: '(23ABPCS7684F1ZT)',
            description: 'MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES.',
            address: 'KHASRA NO. 805/5, PLOT NO. 10, IT PARK, BARGI HILLS, JABALPUR - 482003, MADHYA PRADESH, INDIA.',
            tel: '+91-761-492-0000',
            web: 'www.samriddhicable.com',
            email: 'info@samriddhicable.com'
        },
        SAMRIDDHI_INDUSTRIES: {
            name: 'SAMRIDDHI INDUSTRIES',
            gstNumber: '(23ABWFS1117M1ZT)',
            description: 'MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES.',
            address: 'KHASRA NO. 805/5, PLOT NO. 10, IT PARK, BARGI HILLS, JABALPUR - 482003, MADHYA PRADESH, INDIA.',
            tel: '+91-761-492-0000',
            web: 'www.samriddhiindustries.com',
            email: 'info@samriddhiindustries.com'
        }
    }
    
    const branches = companyBranches || defaultBranches
    const currentBranch = branches[selectedBranch] || branches.SAMRIDDHI_CABLE

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
    const cgstRate = 9
    const sgstRate = 9
    const cgstAmount = (taxableAmount * cgstRate) / 100
    const sgstAmount = (taxableAmount * sgstRate) / 100
    const taxAmount = selectedQuotation?.taxAmount ?? (cgstAmount + sgstAmount)
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
              <title>Performa Invoice - ${selectedQuotation?.quotationNumber || 'PI-25-26-458'}</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                @page { size: A4; margin: 12mm; }
                html, body { width: 210mm; background: #ffffff; }
                body {
                  margin: 0;
                  padding: 0;
                  font-family: Arial, Helvetica, sans-serif;
                  font-size: 12px;
                  line-height: 1.4;
                  color: #000;
                }
                .container { width: calc(210mm - 24mm); margin: 0 auto; }
                .border-2 { border: 2px solid #000; }
                .border { border: 1px solid #000; }
                .border-black { border-color: #000; }
                .border-gray-300 { border-color: #d1d5db; }
                .mb-4 { margin-bottom: 1rem; }
                .mb-2 { margin-bottom: 0.5rem; }
                .mb-8 { margin-bottom: 2rem; }
                .p-2 { padding: 0.5rem; }
                .p-3 { padding: 0.75rem; }
                .p-6 { padding: 1.5rem; }
                .pt-1 { padding-top: 0.25rem; }
                .text-xl { font-size: 18px; }
                .text-xs { font-size: 10px; }
                .text-sm { font-size: 12px; }
                .font-bold { font-weight: bold; }
                .font-semibold { font-weight: 600; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .text-left { text-align: left; }
                .flex { display: flex; }
                .justify-between { justify-content: space-between; }
                .items-center { align-items: center; }
                .grid { display: grid; }
                .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                .grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
                .gap-2 { gap: 0.5rem; }
                .gap-4 { gap: 1rem; }
                .bg-gray-50 { background-color: #f9fafb; }
                .bg-gray-100 { background-color: #f3f4f6; }
                .space-y-1 > * + * { margin-top: 0.25rem; }
                .space-y-2 > * + * { margin-top: 0.5rem; }
                .w-full { width: 100%; }
                .h-12 { height: 3rem; }
                .w-auto { width: auto; }
                .w-24 { width: 6rem; }
                .rounded { border-radius: 0.25rem; }
                .flex-col { flex-direction: column; }
                .bg-blue-600 { background-color: #2563eb; }
                .text-white { color: white; }
                table { border-collapse: collapse; width: 100%; table-layout: fixed; }
                th, td { border: 1px solid #d1d5db; padding: 8px; }
                th { background-color: #f3f4f6; font-weight: bold; text-align: left; }
                .border-t { border-top: 1px solid #000; }
                .no-print { display: none !important; }
                img { max-width: 100%; height: auto; }
                @media print {
                  body { margin: 0; padding: 0; }
                  .no-print { display: none !important; }
                  * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
                }
              </style>
            </head>
            <body>
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
      <div id="pi-content" className="mx-auto bg-white border border-gray-300" style={{fontSize: '12px', lineHeight: '1.2', width: '8.5in', minHeight: '11in', margin: '0 auto', padding: '0.5in', maxWidth: '100%'}}>
        <style jsx>{`
          @media screen and (max-width: 1200px) {
            #pi-content {
              width: 100% !important;
              max-width: 8.5in !important;
              transform: scale(0.8) !important;
              transform-origin: top left !important;
            }
          }
          @media screen and (max-width: 1000px) {
            #pi-content {
              width: 100% !important;
              max-width: 8.5in !important;
              transform: scale(0.7) !important;
              transform-origin: top left !important;
            }
          }
          @media print {
            #pi-content {
              font-size: 10px !important;
              line-height: 1.1 !important;
              padding: 0.4in !important;
              margin: 0 !important;
              width: 8.5in !important;
              min-height: 11in !important;
            }
            #pi-content .p-3, #pi-content .p-4, #pi-content .p-6 {
              padding: 0.05in !important;
            }
            #pi-content .mb-3, #pi-content .mb-4, #pi-content .mb-6, #pi-content .mb-8 {
              margin-bottom: 0.05in !important;
            }
            #pi-content .mt-4, #pi-content .mt-8 {
              margin-top: 0.05in !important;
            }
            #pi-content .pt-4, #pi-content .pt-6 {
              padding-top: 0.05in !important;
            }
            #pi-content .gap-4, #pi-content .gap-6, #pi-content .gap-8 {
              gap: 0.05in !important;
            }
            #pi-content h1, #pi-content h2, #pi-content h3, #pi-content h4 {
              margin: 0.05in 0 !important;
            }
            #pi-content .text-2xl {
              font-size: 14px !important;
            }
            #pi-content .text-lg {
              font-size: 12px !important;
            }
            #pi-content .text-sm {
              font-size: 9px !important;
            }
            #pi-content .text-xs {
              font-size: 8px !important;
            }
            #pi-content table {
              font-size: 9px !important;
            }
            #pi-content .w-80 {
              width: 200px !important;
            }
            #pi-content .mb-16 {
              margin-bottom: 0.2in !important;
            }
            #pi-content .mt-16 {
              margin-top: 0.2in !important;
            }
          }
        `}</style>
        <div className="p-3 mb-3 border-b-2 border-gray-400">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-black">PROFORMA INVOICE</h1>
              <p className="text-sm text-gray-600">Printed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="border border-gray-400 p-3">
                <p className="text-xs text-gray-600">Voucher No.</p>
                <p className="text-xl font-bold">PI-{new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}-{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}</p>
              </div>
              <div className="text-right">
                <img
                  src="https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png"
                  alt="Company Logo"
                  className="h-12 w-auto bg-white p-1 rounded"
                />
              </div>
            </div>
          </div>
          {/* Quotation selector removed */}
        </div>
  
        <div className="mb-4">
          <div className="p-3 border-l-4 border-gray-400">
            <h2 className="text-lg font-bold text-black mb-2">{currentBranch.name}</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p>OPPOSITE DADDA NAGAR, WARD NO 73</p>
                <p>KATANGI ROAD, KARMETA, Jabalpur</p>
                <p>Madhya Pradesh - 482002, India</p>
              </div>
              <div>
                <p>
                  <span className="font-bold">GSTIN/UIN:</span> {currentBranch.gstNumber}
                </p>
                <p>
                  <span className="font-bold">State Name:</span> Madhya Pradesh, Code: 23
                </p>
                <p>
                  <span className="font-bold">Contact:</span> {currentBranch.tel}
                </p>
                <p>
                  <span className="font-bold">E-Mail:</span> {currentBranch.email}
                </p>
              </div>
            </div>
          </div>
        </div>
  
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="border border-gray-300">
            <div className="bg-gray-100 p-3 border-b border-gray-300">
              <h3 className="font-bold text-black">Consignee (Ship to)</h3>
            </div>
            <div className="p-4 text-sm">
              <p className="font-bold text-black mb-2">{billTo.business || '—'}</p>
              <p className="text-gray-700">{billTo.address || '—'}</p>
              <p className="text-gray-700">{billTo.state || ''}</p>
              <div className="mt-3 pt-3 border-t border-gray-200 text-xs">
                <p>
                  <span className="font-bold">GSTIN/UIN:</span> {billTo.gstNo || ''}
                </p>
                <p>
                  <span className="font-bold">Phone:</span> {billTo.phone || ''}
                </p>
              </div>
            </div>
          </div>
  
          <div className="border border-gray-300">
            <div className="bg-gray-100 p-3 border-b border-gray-300">
              <h3 className="font-bold text-black">Buyer (Bill to)</h3>
            </div>
            <div className="p-4 text-sm">
              <p className="font-bold text-black mb-2">{billTo.business || '—'}</p>
              <p className="text-gray-700">{billTo.address || '—'}</p>
              <p className="text-gray-700">{billTo.state || ''}</p>
              <div className="mt-3 pt-3 border-t border-gray-200 text-xs">
                <p>
                  <span className="font-bold">GSTIN/UIN:</span> {billTo.gstNo || ''}
                </p>
                <p>
                  <span className="font-bold">Phone:</span> {billTo.phone || ''}
                </p>
              </div>
            </div>
          </div>
        </div>
  
        <div className="bg-gray-50 p-3 mb-4 border border-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-bold text-black">Voucher No.</p>
              <p className="text-gray-700">PI-{new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}-{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}</p>
            </div>
            <div>
              <p className="font-bold text-black">Dated</p>
              <p className="text-gray-700">{new Date().toLocaleDateString('en-GB')}</p>
            </div>
            <div>
              <p className="font-bold text-black">Payment Terms</p>
              <p className="text-gray-700">ADVANCE</p>
            </div>
            <div>
              <p className="font-bold text-black">Buyer's Ref.</p>
              <p className="text-gray-700">BR-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 10000)).padStart(4, '0')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-4">
            <div>
              <p className="font-bold text-black">Other References</p>
              <p className="text-gray-700">DIRECT SALE</p>
            </div>
            <div>
              <p className="font-bold text-black">Dispatched Through</p>
              <p className="text-gray-700">BY TRANSPORT</p>
            </div>
            <div>
              <p className="font-bold text-black">Destination</p>
              <p className="text-gray-700">Chandrapur Transport</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-bold text-black">Delivery Terms</p>
            <p className="text-gray-700">Delivery :- FOR upto Chandrapur Transport</p>
          </div>
        </div>
  
        <div className="border border-gray-300 mb-4 overflow-hidden">
          <div className="bg-gray-100 p-3">
            <div className="grid grid-cols-8 gap-2 text-sm font-bold text-black">
              <div>Sl No.</div>
              <div className="col-span-2">Description of Goods</div>
              <div>HSN/SAC</div>
              <div>Quantity</div>
              <div>Rate</div>
              <div>per</div>
              <div className="text-right">Amount</div>
            </div>
          </div>
          <div className="p-4 bg-white">
            {items.length > 0 ? items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-8 gap-2 text-sm">
                <div className="font-bold">{idx + 1}</div>
                <div className="col-span-2">
                  <p className="font-bold text-black">{it.productName || it.description || 'Item'}</p>
                </div>
                <div className="text-gray-700">{it.hsn || '76141000'}</div>
                <div className="text-gray-700">{it.quantity} {it.unit}</div>
                <div className="text-gray-700">{Number(it.buyerRate || 0).toFixed(2)}</div>
                <div className="text-gray-700">{it.unit || ''}</div>
                <div className="text-right font-bold">{Number(it.amount || 0).toFixed(2)}</div>
              </div>
            )) : (
              <div className="text-sm text-gray-600">No items found for selected quotation.</div>
            )}
          </div>
        </div>
  
        <div className="flex justify-end mb-4">
          <div className="w-80 border border-gray-300">
            <div className="p-4 bg-white">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-bold">{Number(subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Less: Discount ({discountRate}%)</span>
                  <span className="font-bold">{Number(discountAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Taxable Amount</span>
                  <span className="font-bold">{Number(taxableAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Add: CGST (9%)</span>
                  <span className="font-bold">{Number(cgstAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Add: SGST (9%)</span>
                  <span className="font-bold">{Number(sgstAmount).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg text-black">
                    <span>Total Amount</span>
                    <span>₹ {Number(total).toFixed(2)}</span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-xs">(Rupees {numberToWords(Math.floor(total || 0))} Only)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div className="bg-gray-50 p-3 border border-gray-300 mb-4">
          <p className="text-sm font-bold text-black mb-1">Amount Chargeable (in words)</p>
          <p className="font-bold text-black">INR {numberToWords(Math.floor(total || 0))} Only</p>
          <p className="text-xs text-gray-600 mt-2">E. & O.E</p>
        </div>
  
        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-300">
          <div className="bg-gray-50 p-4 border border-gray-300">
            <h4 className="font-bold text-black mb-2">Company's Bank Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p><span className="font-bold">A/c Holder's Name:</span></p>
                <p>{currentBranch.name}</p>
                <p><span className="font-bold">Bank Name:</span> ICICI BANK</p>
                <p><span className="font-bold">A/c No.:</span> 777705336601</p>
              </div>
              <div>
                <p><span className="font-bold">Branch:</span> NIWARGANJ</p>
                <p><span className="font-bold">IFSC Code:</span> ICIC0007345</p>
                <p><span className="font-bold">Bank Code:</span> 36601</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-16">for {currentBranch.name}</p>
            <div className="border-t-2 border-gray-400 w-48 ml-auto pt-2">
              <p className="text-sm font-bold text-black">Authorised Signatory</p>
            </div>
          </div>
        </div>
  
        <div className="text-center mt-4 pt-2 border-t border-gray-300">
          <p className="text-xs text-gray-500 bg-gray-50 inline-block px-4 py-1">This is a Computer Generated Document</p>
        </div>
        
      </div>
    )
  }
  