import React from 'react'

export default function MarketingQuotationPreview({ data, companyBranches, user }) {
  const selectedBranch = companyBranches[data?.selectedBranch] || companyBranches.ANODE

  return (
    <div className="max-w-4xl mx-auto bg-white font-sans text-sm" id="marketing-quotation-preview">
      <div className="p-6">
        <div className="border-2 border-black mb-4">
          <div className="p-2 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">{selectedBranch.name}</h1>
              {selectedBranch.gstNumber && (
                <p className="text-xs font-semibold text-gray-700">{selectedBranch.gstNumber}</p>
              )}
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
                {selectedBranch.tel && <p>Tel: {selectedBranch.tel}</p>}
                {selectedBranch.web && <p>Web: {selectedBranch.web}</p>}
                {selectedBranch.email && <p>Email: {selectedBranch.email}</p>}
              </div>
            </div>
          </div>
        </div>

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
            <div>{data?.quotationNumber}</div>
            <div>{data?.validUpto}</div>
            <div>{data?.voucherNumber}</div>
          </div>
        </div>

        <div className="border border-black mb-4">
          <div className="grid grid-cols-2 gap-4 p-3 text-xs">
            <div>
              <h3 className="font-bold mb-2">BILL TO:</h3>
              <p>
                <strong>{data?.billTo?.business}</strong>
              </p>
              <p>{data?.billTo?.address}</p>
              {data?.billTo?.phone && <p><strong>PHONE:</strong> {data.billTo.phone}</p>}
              {data?.billTo?.gstNo && <p><strong>GSTIN:</strong> {data.billTo.gstNo}</p>}
              {data?.billTo?.state && <p><strong>State:</strong> {data.billTo.state}</p>}
            </div>
            <div>
              <p><strong>L.R. No:</strong> -</p>
              <p><strong>Transport:</strong> STAR TRANSPORTS</p>
              <p><strong>Transport ID:</strong> 562345</p>
              <p><strong>Vehicle Number:</strong> GJ01HJ2520</p>
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
              {Array.isArray(data?.items) && data.items.length > 0 ? (
                data.items.map((item, index) => (
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
                </tr>
              ))}

              <tr className="bg-gray-100 font-bold">
                <td className="border border-gray-300 p-2 text-left">Total</td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2">{data?.subtotal?.toFixed ? data.subtotal.toFixed(2) : (data?.subtotal || '').toString()}</td>
                <td className="border border-gray-300 p-2">{data?.taxAmount?.toFixed ? data.taxAmount.toFixed(2) : (data?.taxAmount || '').toString()}</td>
                <td className="border border-gray-300 p-2">{data?.total?.toFixed ? data.total.toFixed(2) : (data?.total || '').toString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border border-black p-3">
            <h3 className="font-bold text-xs mb-2">Bank Details</h3>
            <div className="text-xs space-y-1">
              <p><strong>Bank Name:</strong> ICICI Bank</p>
              <p><strong>Branch Name:</strong> WRIGHT TOWN JABALPUR</p>
              <p><strong>Bank Account Number:</strong> 657605601783</p>
              <p><strong>Bank Branch IFSC:</strong> ICIC0006576</p>
            </div>
          </div>
          <div className="border border-black p-3">
            <div className="text-xs space-y-1">
              <div className="flex justify-between"><span>Subtotal</span><span>{data?.subtotal?.toFixed ? data.subtotal.toFixed(2) : (data?.subtotal || '0.00')}</span></div>
              <div className="flex justify-between"><span>Less: Discount ({data?.discountRate || 0}%)</span><span>{data?.discountAmount?.toFixed ? data.discountAmount.toFixed(2) : (data?.discountAmount || '0.00')}</span></div>
              <div className="flex justify-between"><span>Taxable Amount</span><span>{(typeof data?.subtotal === 'number' ? (data.subtotal - (data?.discountAmount || 0)).toFixed(2) : (data?.taxable || '')).toString()}</span></div>
              <div className="flex justify-between"><span>Add: Total GST ({data?.taxRate || 18}%)</span><span>{data?.taxAmount?.toFixed ? data.taxAmount.toFixed(2) : (data?.taxAmount || '0.00')}</span></div>
              <div className="flex justify-between font-bold border-t pt-1"><span>Total Amount After Tax</span><span>₹ {data?.total?.toFixed ? data.total.toFixed(2) : (data?.total || '0.00')}</span></div>
              {data?.amountInWords && (<div className="text-center mt-2"><span className="text-xs">({data.amountInWords})</span></div>)}
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
          <p className="mb-4">For <strong>{selectedBranch.name}</strong></p>
          <p className="mb-8">This is computer generated invoice no signature required.</p>
          <p className="font-bold">Authorized Signatory</p>
          {user && (
            <p className="mt-2 text-sm font-semibold text-gray-800">{user.username || user.email || 'User'}</p>
          )}
        </div>
      </div>
    </div>
  )
}
