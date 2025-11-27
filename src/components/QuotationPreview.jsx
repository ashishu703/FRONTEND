import React from 'react'
import { defaultQuotationTerms } from '../constants/quotationTerms'

export default function QuotationPreview({ data, companyBranches, user, hideSignatory = false }) {
  console.log('QuotationPreview received data:', data);
  const selectedBranch = companyBranches[data?.selectedBranch] || companyBranches.ANODE

  return (
    <div className="max-w-4xl mx-auto bg-white font-sans text-sm" id="quotation-content">
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
            <div>
              {(() => {
                const dateValue = data?.quotationDate || new Date().toISOString();
                const date = new Date(dateValue);
                return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
              })()}
            </div>
            <div>{data?.quotationNumber || `ANO/${new Date().getFullYear().toString().slice(-2)}-${(new Date().getFullYear() + 1).toString().slice(-2)}/${Math.floor(1000 + Math.random() * 9000)}`}</div>
            <div>
              {(() => {
                const dateValue = data?.validUpto || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
                const date = new Date(dateValue);
                return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
              })()}
            </div>
            <div>{data?.voucherNumber || `VOUCH-${Math.floor(1000 + Math.random() * 9000)}`}</div>
          </div>
        </div>

        <div className="border border-black mb-4">
          <div className="grid grid-cols-2 gap-4 p-3 text-xs">
            <div>
              <h3 className="font-bold mb-2">BILL TO:</h3>
              <p>
                <strong>{data?.billTo?.business || 'Customer'}</strong>
              </p>
              {data?.billTo?.address && <p>{data.billTo.address}</p>}
              {data?.billTo?.phone && (
                <p>
                  <strong>PHONE:</strong> {data.billTo.phone}
                </p>
              )}
              {data?.billTo?.gstNo && (
                <p>
                  <strong>GSTIN:</strong> {data.billTo.gstNo}
                </p>
              )}
              {data?.billTo?.state && (
                <p>
                  <strong>State:</strong> {data.billTo.state}
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
          <table className="w-full text-xs table-fixed">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-1 text-center w-6">Sr.</th>
                <th className="border border-gray-300 p-2 text-left">Name of Product / Service</th>
                <th className="border border-gray-300 p-1 text-center w-16">HSN / SAC</th>
                <th className="border border-gray-300 p-1 text-center w-12">Qty</th>
                <th className="border border-gray-300 p-1 text-center w-10">Unit</th>
                <th className="border border-gray-300 p-1 text-right min-w-[70px]">Buyer Rate</th>
                <th className="border border-gray-300 p-0.5 text-center w-12 text-[10px] whitespace-nowrap">GST</th>
                <th className="border border-gray-300 p-1 text-right min-w-[150px] text-[9px] leading-tight tracking-tight">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data?.items) && data.items.length > 0 ? (
                data.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-1 text-center w-6">{index + 1}</td>
                    <td className="border border-gray-300 p-2 break-words whitespace-normal align-top">
                      {item.productName || item.description || '-'}
                    </td>
                    <td className="border border-gray-300 p-1 text-center">{item.hsn || '-'}</td>
                    <td className="border border-gray-300 p-1 text-center">{item.quantity}</td>
                    <td className="border border-gray-300 p-1 text-center w-10">{item.unit || 'Nos'}</td>
                    <td className="border border-gray-300 p-1 text-right min-w-[70px] whitespace-nowrap">
                      {parseFloat(item.buyerRate || item.unitPrice || 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2
                      })}
                    </td>
                    <td className="border border-gray-300 p-0 text-center text-xs w-12">{item.gstRate ? `${item.gstRate}%` : '18%'}</td>
                    <td className="border border-gray-300 p-1 text-right min-w-[150px] whitespace-nowrap text-[9px] leading-tight tracking-tight">
                      {parseFloat((item.amount ?? item.total ?? 0) * (item.gstMultiplier ?? 1.18)).toLocaleString(
                        'en-IN',
                        { minimumFractionDigits: 2 }
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border border-gray-300 p-1 text-center w-6">1</td>
                  <td className="border border-gray-300 p-2 break-words whitespace-normal align-top">
                    cable
                  </td>
                  <td className="border border-gray-300 p-1 text-center">-</td>
                  <td className="border border-gray-300 p-1 text-center">1</td>
                  <td className="border border-gray-300 p-1 text-center w-10">Nos</td>
                  <td className="border border-gray-300 p-1 text-right whitespace-nowrap min-w-[70px]">100.00</td>
                  <td className="border border-gray-300 p-0 text-center text-xs w-12">18%</td>
                  <td className="border border-gray-300 p-1 text-right whitespace-nowrap min-w-[150px] text-[9px] leading-tight tracking-tight">
                    118.00
                  </td>
                </tr>
              )}

              <tr className="bg-gray-100 font-bold text-[10px] leading-tight">
                <td className="border border-gray-300 p-1 text-left" colSpan={5}>
                  Total
                </td>
                <td className="border border-gray-300 p-1 text-right whitespace-nowrap text-[9px] leading-tight tracking-tight">
                  {data?.subtotal?.toFixed
                    ? parseFloat(data.subtotal).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    : data?.subtotal || '0.00'}
                </td>
                <td className="border border-gray-300 p-1 text-right whitespace-nowrap text-[9px] leading-tight tracking-tight"></td>
                <td className="border border-gray-300 p-1 text-right whitespace-nowrap text-[9px] leading-tight tracking-tight">
                  {data?.total?.toFixed
                    ? parseFloat(data.total).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    : data?.total || '0.00'}
                </td>
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
          <div className="border border-black p-2">
            <div className="text-[10px] space-y-0.5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="whitespace-nowrap">{data?.subtotal?.toFixed ? parseFloat(data.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (data?.subtotal || '0.00')}</span>
              </div>
              <div className="flex justify-between">
                <span>Less: Discount ({data?.discountRate || 0}%)</span>
                <span className="whitespace-nowrap">{data?.discountAmount?.toFixed ? parseFloat(data.discountAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (data?.discountAmount || '0.00')}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxable Amount</span>
                <span className="whitespace-nowrap">{(typeof data?.subtotal === 'number' ? parseFloat(data.subtotal - (data?.discountAmount || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (data?.taxable || '')).toString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Add: Total GST ({data?.taxRate || 18}%)</span>
                <span className="whitespace-nowrap">{data?.taxAmount?.toFixed ? parseFloat(data.taxAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (data?.taxAmount || '0.00')}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-1">
                <span>Total Amount After Tax</span>
                <span className="whitespace-nowrap">₹ {data?.total?.toFixed ? parseFloat(data.total).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : (data?.total || '0.00')}</span>
              </div>
              {data?.amountInWords && (
                <div className="text-center mt-2">
                  <span className="text-xs">({data.amountInWords})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border border-black mb-4">
          <div className="bg-gray-100 p-2 font-bold text-xs">
            <h3>Terms and Conditions</h3>
          </div>
          <div className="p-3 text-xs space-y-2">
            {(data?.termsSections?.length ? data.termsSections : defaultQuotationTerms).map((section) => (
              <div key={section.title}>
                <h4 className="font-bold">{section.title}</h4>
                {section.points.map((point, idx) => (
                  <p key={idx}>• {point}</p>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="text-right text-xs">
          <p className="mb-4">For <strong>{selectedBranch.name}</strong></p>
          <p className="mb-8">This is computer generated invoice no signature required.</p>
          {!hideSignatory && (
            <div className="quotation-signatory-section">
              <p className="font-bold">Authorized Signatory</p>
              {user && (
                <p className="mt-2 text-sm font-semibold text-gray-800">{user.username || user.email || 'User'}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
