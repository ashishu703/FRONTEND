import { Printer } from "lucide-react"

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

const MarketingQuotation = ({ quotationData, customer, selectedBranch = 'ANODE' }) => {
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
  }
  
  const currentCompany = companyBranches[selectedBranch] || companyBranches.ANODE
  // Compute amounts like salesperson template
  const discountRate = parseFloat(quotationData?.discountRate || 0)
  const subtotal = parseFloat(quotationData?.subtotal || 0)
  const discountAmount = quotationData?.discountAmount != null 
    ? parseFloat(quotationData.discountAmount) 
    : (subtotal * discountRate) / 100
  const taxableAmount = Math.max(0, subtotal - discountAmount)
  const taxRate = parseFloat(quotationData?.taxRate != null ? quotationData.taxRate : 18)
  const taxAmount = quotationData?.taxAmount != null 
    ? parseFloat(quotationData.taxAmount) 
    : (taxableAmount * taxRate) / 100
  const totalAmount = quotationData?.total != null 
    ? parseFloat(quotationData.total) 
    : (taxableAmount + taxAmount)
  const handlePrint = async () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    const quotationElement = document.getElementById('marketing-quotation-content')
    
    if (printWindow && quotationElement) {
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
      const clonedContent = quotationElement.cloneNode(true)
      const logoImg = clonedContent.querySelector('img')
      if (logoImg) {
        logoImg.src = base64Logo
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Marketing Quotation - ${quotationData?.quotationNumber || 'ANO/25-26/458'}</title>
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
              /* Column sizing to match template */
              .col-sr { width: 28px; text-align:center; }
              .col-hsn { width: 80px; text-align:center; }
              .col-qty { width: 40px; text-align:center; }
              .col-unit { width: 50px; text-align:center; }
              .col-rate { width: 90px; text-align:right; }
              .col-taxable { width: 110px; text-align:right; }
              .col-gst { width: 48px; text-align:center; }
              .col-total { width: 110px; text-align:right; }
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
      <div className="max-w-4xl mx-auto bg-white font-sans text-sm">        
        {/* Marketing Quotation Content */}
        <div id="marketing-quotation-content" className="p-6">
        {/* Header */}
        <div className="border-2 border-black mb-4">
          <div className="p-2 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">{currentCompany.name}</h1>
              <p className="text-xs">{currentCompany.description}</p>
            </div>
            <div className="text-right">
              <img
                src="https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png"
                alt="Anode Electric Logo"
                className="h-12 w-auto bg-white p-1 rounded"
              />
            </div>
          </div>
  
          <div className="p-3 bg-gray-50">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p>
                  <strong>{currentCompany.address}</strong>
                </p>
              </div>
              <div className="text-right">
                <p>Tel: {currentCompany.tel}</p>
                <p>Web: {currentCompany.web}</p>
                <p>Email: {currentCompany.email}</p>
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
            <div>{quotationData?.quotationDate || new Date().toLocaleDateString()}</div>
            <div>{quotationData?.quotationNumber || `ANO/${new Date().getFullYear().toString().slice(-2)}-${(new Date().getFullYear() + 1).toString().slice(-2)}/${Math.floor(1000 + Math.random() * 9000)}`}</div>
            <div>{quotationData?.validUpto || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
            <div>{`VOUCH-${Math.floor(1000 + Math.random() * 9000)}`}</div>
          </div>
        </div>
  
        {/* Customer Information */}
        <div className="border border-black mb-4">
          <div className="grid grid-cols-2 gap-4 p-3 text-xs">
            <div>
              <h3 className="font-bold mb-2">BILL TO:</h3>
              <p>
                <strong>{quotationData?.billTo?.business || customer?.business || 'Das Industrial Controls'}</strong>
              </p>
              <p>{quotationData?.billTo?.address || customer?.address || 'Panvel, Maharashtra, India'}</p>
              <p>
                <strong>PHONE:</strong> {quotationData?.billTo?.phone || customer?.phone || '7039542259'}
              </p>
              {quotationData?.billTo?.gstNo || customer?.gstNo ? (
                <p>
                  <strong>GSTIN:</strong> {quotationData?.billTo?.gstNo || customer?.gstNo}
                </p>
              ) : null}
              <p>
                <strong>State:</strong> {quotationData?.billTo?.state || customer?.state || 'Maharashtra'}
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
                <th className="border border-gray-300 p-1 text-right w-20">Buyer Rate</th>
                <th className="border border-gray-300 p-1 text-right w-20">Taxable Value</th>
                <th className="border border-gray-300 p-0.5 text-center w-8 text-[10px] whitespace-nowrap">GST%</th>
                <th className="border border-gray-300 p-1 text-right w-24">Total</th>
              </tr>
            </thead>
            <tbody>
              {quotationData?.items?.length > 0 ? (
                quotationData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-1 text-center">{index + 1}</td>
                    <td className="border border-gray-300 p-2">{item.productName || item.description}</td>
                    <td className="border border-gray-300 p-1 text-center">85446090</td>
                    <td className="border border-gray-300 p-1 text-center">{item.quantity}</td>
                    <td className="border border-gray-300 p-1 text-center">{item.unit}</td>
                    <td className="border border-gray-300 p-1 text-right">{parseFloat(item.buyerRate || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
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
                <td className="border border-gray-300 p-2">{subtotal.toFixed(2)}</td>
                <td className="border border-gray-300 p-2">{taxAmount.toFixed(2)}</td>
                <td className="border border-gray-300 p-2">{totalAmount.toFixed(2)}</td>
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
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Less: Discount ({discountRate || 0}%)</span>
                <span>{discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxable Amount</span>
                <span>{taxableAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Add: Total GST ({taxRate || 18}%)</span>
                <span>{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-1">
                <span>Total Amount After Tax</span>
                <span>₹ {totalAmount.toFixed(2)}</span>
              </div>
              <div className="text-center mt-2">
                <span className="text-xs">(Rupees {numberToWords(Math.floor(totalAmount || 0))} Only)</span>
              </div>
            </div>
          </div>
        </div>
  
        {/* Terms and Conditions */}
        <div className="border border-black mb-4">
          <div className="bg-gray-100 p-2 font-bold text-xs">
            <h3>Marketing Terms and Conditions</h3>
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
            For <strong>{currentCompany.name}</strong>
          </p>
          <p className="mb-8">This is computer generated marketing quotation no signature required.</p>
          <p className="font-bold">Marketing Authorized Signatory</p>
        </div>
        </div>
        
        {/* Print Button - Bottom Left */}
        <div className="flex justify-start mt-4 no-print">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print Marketing Quotation
          </button>
        </div>
      </div>
    )
  }
  
  export default MarketingQuotation
