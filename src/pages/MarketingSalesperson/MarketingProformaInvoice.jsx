import html2pdf from 'html2pdf.js'

export function MarketingCorporateStandardInvoice({ selectedBranch = 'SAMRIDDHI_CABLE', companyBranches }) {
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
    
    return (
      <div id="marketing-pi-content" className="mx-auto bg-white border border-gray-300" style={{fontSize: '12px', lineHeight: '1.2', width: '8.5in', minHeight: '11in', margin: '0 auto', padding: '0.5in', maxWidth: '100%'}}>
        <style jsx>{`
          @media screen and (max-width: 1200px) {
            #marketing-pi-content {
              width: 100% !important;
              max-width: 8.5in !important;
              transform: scale(0.8) !important;
              transform-origin: top left !important;
            }
          }
          @media screen and (max-width: 1000px) {
            #marketing-pi-content {
              width: 100% !important;
              max-width: 8.5in !important;
              transform: scale(0.7) !important;
              transform-origin: top left !important;
            }
          }
          @media print {
            #marketing-pi-content {
              font-size: 10px !important;
              line-height: 1.1 !important;
              padding: 0.4in !important;
              margin: 0 !important;
              width: 8.5in !important;
              min-height: 11in !important;
            }
            #marketing-pi-content .p-3, #marketing-pi-content .p-4, #marketing-pi-content .p-6 {
              padding: 0.05in !important;
            }
            #marketing-pi-content .mb-3, #marketing-pi-content .mb-4, #marketing-pi-content .mb-6, #marketing-pi-content .mb-8 {
              margin-bottom: 0.05in !important;
            }
            #marketing-pi-content .mt-4, #marketing-pi-content .mt-8 {
              margin-top: 0.05in !important;
            }
            #marketing-pi-content .pt-4, #marketing-pi-content .pt-6 {
              padding-top: 0.05in !important;
            }
            #marketing-pi-content .gap-4, #marketing-pi-content .gap-6, #marketing-pi-content .gap-8 {
              gap: 0.05in !important;
            }
            #marketing-pi-content h1, #marketing-pi-content h2, #marketing-pi-content h3, #marketing-pi-content h4 {
              margin: 0.05in 0 !important;
            }
            #marketing-pi-content .text-2xl {
              font-size: 14px !important;
            }
            #marketing-pi-content .text-lg {
              font-size: 12px !important;
            }
            #marketing-pi-content .text-sm {
              font-size: 9px !important;
            }
            #marketing-pi-content .text-xs {
              font-size: 8px !important;
            }
            #marketing-pi-content table {
              font-size: 9px !important;
            }
            #marketing-pi-content .w-80 {
              width: 200px !important;
            }
            #marketing-pi-content .mb-16 {
              margin-bottom: 0.2in !important;
            }
            #marketing-pi-content .mt-16 {
              margin-top: 0.2in !important;
            }
          }
        `}</style>
        <div className="p-3 mb-3 border-b-2 border-gray-400">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-black">MARKETING PROFORMA INVOICE</h1>
              <p className="text-sm text-gray-600">Printed on {new Date().toLocaleDateString('en-GB')} at {new Date().toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'})}</p>
            </div>
            <div className="border border-gray-400 p-3">
              <p className="text-xs text-gray-600">Voucher No.</p>
              <p className="text-xl font-bold">MK-{Math.floor(Math.random() * 1000)}</p>
            </div>
          </div>
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
              <p className="font-bold text-black mb-2">MARKETING CUSTOMER COMPANY</p>
              <p className="text-gray-700">Marketing Department, Business Center</p>
              <p className="text-gray-700">Maharashtra - 400001, India</p>
              <div className="mt-3 pt-3 border-t border-gray-200 text-xs">
                <p>
                  <span className="font-bold">GSTIN/UIN:</span> 27AADCF6974E1ZF
                </p>
                <p>
                  <span className="font-bold">PAN/IT No:</span> AADCF6974E
                </p>
                <p>
                  <span className="font-bold">State Name:</span> Maharashtra, Code: 27
                </p>
              </div>
            </div>
          </div>
  
          <div className="border border-gray-300">
            <div className="bg-gray-100 p-3 border-b border-gray-300">
              <h3 className="font-bold text-black">Buyer (Bill to)</h3>
            </div>
            <div className="p-4 text-sm">
              <p className="font-bold text-black mb-2">MARKETING CUSTOMER COMPANY</p>
              <p className="text-gray-700">Plot No.MK-42, Marketing Road, Business Center</p>
              <p className="text-gray-700">Marketing Training Institute</p>
              <p className="text-gray-700">Additional Marketing Maharashtra - 400001, India</p>
              <div className="mt-3 pt-3 border-t border-gray-200 text-xs">
                <p>
                  <span className="font-bold">GSTIN/UIN:</span> 27AADCF6974E1ZF
                </p>
                <p>
                  <span className="font-bold">PAN/IT No:</span> AADCF6974E
                </p>
              </div>
            </div>
          </div>
        </div>
  
        <div className="bg-gray-50 p-3 mb-4 border border-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-bold text-black">Voucher No.</p>
              <p className="text-gray-700">MK-PI-{new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}-{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}</p>
            </div>
            <div>
              <p className="font-bold text-black">Dated</p>
              <p className="text-gray-700">{new Date().toLocaleDateString('en-GB')}</p>
            </div>
            <div>
              <p className="font-bold text-black">Payment Terms</p>
              <p className="text-gray-700">MARKETING ADVANCE</p>
            </div>
            <div>
              <p className="font-bold text-black">Buyer's Ref.</p>
              <p className="text-gray-700">MK-BR-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 10000)).padStart(4, '0')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-4">
            <div>
              <p className="font-bold text-black">Other References</p>
              <p className="text-gray-700">MARKETING DIRECT SALE</p>
            </div>
            <div>
              <p className="font-bold text-black">Dispatched Through</p>
              <p className="text-gray-700">BY MARKETING TRANSPORT</p>
            </div>
            <div>
              <p className="font-bold text-black">Destination</p>
              <p className="text-gray-700">Marketing Business Center</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-bold text-black">Delivery Terms</p>
            <p className="text-gray-700">Delivery :- FOR upto Marketing Business Center</p>
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
            <div className="grid grid-cols-8 gap-2 text-sm">
              <div className="font-bold">1</div>
              <div className="col-span-2">
                <p className="font-bold text-black">MARKETING COVERED CONDUCTOR 34 SQMM</p>
                <p className="text-gray-600 mt-1">MARKETING COVERED CONDUCTOR 34SQMM XLPE 3 LAYER</p>
              </div>
              <div className="text-gray-700">76141000</div>
              <div className="text-gray-700">600 MTR</div>
              <div className="text-gray-700">48.00</div>
              <div className="text-gray-700">MTR</div>
              <div className="text-right font-bold">28,800.00</div>
            </div>
          </div>
        </div>
  
        <div className="flex justify-end mb-4">
          <div className="w-80 border border-gray-300">
            <div className="p-4 bg-white">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">IGST (18%)</span>
                  <span className="font-bold">5,184.00</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg text-black">
                    <span>Total Amount</span>
                    <span>33,984.00</span>
                  </div>
                  <div className="text-right text-sm text-gray-700">600 MTR</div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div className="bg-gray-50 p-3 border border-gray-300 mb-4">
          <p className="text-sm font-bold text-black mb-1">Amount Chargeable (in words)</p>
          <p className="font-bold text-black">INR Thirty Three Thousand Nine Hundred Eighty Four Only</p>
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
              <p className="text-sm font-bold text-black">Marketing Authorised Signatory</p>
            </div>
          </div>
        </div>
  
        <div className="text-center mt-4 pt-2 border-t border-gray-300">
          <p className="text-xs text-gray-500 bg-gray-50 inline-block px-4 py-1">This is a Computer Generated Marketing Document</p>
        </div>
      </div>
    )
  }
