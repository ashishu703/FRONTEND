import React, { useState, useEffect } from 'react'
import { defaultQuotationTerms } from '../constants/quotationTerms'
import apiClient from '../utils/apiClient'
import { API_ENDPOINTS } from '../api/admin_api/api'

export default function QuotationPreviewTemplate3({ data, companyBranches, user, hideSignatory = false }) {
  const selectedBranch = companyBranches[data?.selectedBranch] || companyBranches.ANODE
  
  const getSalespersonNameSync = () => {
    if (user && (user.username || user.name)) {
      return user.username || user.name;
    }
    try {
      const localUserData = JSON.parse(localStorage.getItem('user') || '{}');
      const name = localUserData.username || localUserData.name;
      if (name && name !== 'User' && name !== '') {
        return name;
      }
    } catch (e) {}
    return null;
  };

  const [salespersonName, setSalespersonName] = useState(() => getSalespersonNameSync());

  useEffect(() => {
    const fetchFromAPI = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.PROFILE);
        if (response && response.data && response.data.user) {
          const apiUser = response.data.user;
          const name = apiUser.username || apiUser.name;
          if (name && name !== 'User' && name !== '') {
            setSalespersonName(name);
            return;
          }
        }
      } catch (error) {
        const currentName = getSalespersonNameSync();
        if (currentName && currentName !== 'User' && currentName !== '') {
          setSalespersonName(currentName);
        }
      }
    };
    fetchFromAPI();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto bg-white font-serif text-sm" id="quotation-content">
      <div className="p-8">
        {/* Minimal Header */}
        <div className="mb-6 pb-4 border-b-2 border-gray-300">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-light text-gray-800 tracking-wide">{selectedBranch.name}</h1>
              {selectedBranch.gstNumber && (
                <p className="text-xs text-gray-500 mt-1">{selectedBranch.gstNumber}</p>
              )}
              <p className="text-xs text-gray-400 mt-1 italic">{selectedBranch.description}</p>
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
            <p className="font-light">{selectedBranch.address}</p>
            <div className="flex gap-3 mt-2 text-gray-500">
              {selectedBranch.tel && <span>{selectedBranch.tel}</span>}
              {selectedBranch.web && <span>• {selectedBranch.web}</span>}
              {selectedBranch.email && <span>• {selectedBranch.email}</span>}
            </div>
          </div>
        </div>

        {/* Minimal Quotation Details */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-6 text-xs">
            <div>
              <p className="text-gray-400 uppercase text-[10px] tracking-wider mb-1">Date</p>
              <p className="text-gray-800">
                {(() => {
                  const dateValue = data?.quotationDate || new Date().toISOString();
                  const date = new Date(dateValue);
                  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                })()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 uppercase text-[10px] tracking-wider mb-1">Quotation #</p>
              <p className="text-gray-800">{data?.quotationNumber || `ANO/${new Date().getFullYear().toString().slice(-2)}-${(new Date().getFullYear() + 1).toString().slice(-2)}/${Math.floor(1000 + Math.random() * 9000)}`}</p>
            </div>
            <div>
              <p className="text-gray-400 uppercase text-[10px] tracking-wider mb-1">Valid Until</p>
              <p className="text-gray-800">
                {(() => {
                  const dateValue = data?.validUpto || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
                  const date = new Date(dateValue);
                  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                })()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 uppercase text-[10px] tracking-wider mb-1">Voucher</p>
              <p className="text-gray-800">{data?.voucherNumber || `VOUCH-${Math.floor(1000 + Math.random() * 9000)}`}</p>
            </div>
          </div>
        </div>

        {/* Minimal Bill To */}
        <div className="mb-6 grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-3">Bill To</h3>
            <p className="text-base font-light text-gray-800 mb-2">{data?.billTo?.business || 'Customer'}</p>
            {data?.billTo?.address && <p className="text-xs text-gray-500 mb-1">{data.billTo.address}</p>}
            {data?.billTo?.phone && <p className="text-xs text-gray-500 mb-1">{data.billTo.phone}</p>}
            {data?.billTo?.gstNo && <p className="text-xs text-gray-500 mb-1">GST: {data.billTo.gstNo}</p>}
            {data?.billTo?.state && <p className="text-xs text-gray-500">{data.billTo.state}</p>}
          </div>
          <div className="text-xs text-gray-600">
            <p className="mb-1">L.R. No: -</p>
            <p className="mb-1">Transport: STAR TRANSPORTS</p>
            <p className="mb-1">Transport ID: 562345</p>
            <p>Vehicle: GJ01HJ2520</p>
          </div>
        </div>

        {/* Minimal Products Table */}
        <div className="mb-6">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 text-gray-600 font-light">Item</th>
                <th className="text-center py-3 text-gray-600 font-light">HSN</th>
                <th className="text-center py-3 text-gray-600 font-light">Qty</th>
                <th className="text-center py-3 text-gray-600 font-light">Unit</th>
                <th className="text-right py-3 text-gray-600 font-light">Rate</th>
                <th className="text-center py-3 text-gray-600 font-light">GST</th>
                <th className="text-right py-3 text-gray-600 font-light">Total</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data?.items) && data.items.length > 0 ? (
                data.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 text-gray-800">
                      <span className="text-gray-400 mr-2">{index + 1}.</span>
                      {item.productName || item.description || '-'}
                    </td>
                    <td className="text-center py-3 text-gray-600">{item.hsn || '-'}</td>
                    <td className="text-center py-3 text-gray-600">{item.quantity}</td>
                    <td className="text-center py-3 text-gray-600">{item.unit || 'Nos'}</td>
                    <td className="text-right py-3 text-gray-600">
                      {parseFloat(item.buyerRate || item.unitPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-center py-3 text-gray-600">{item.gstRate ? `${item.gstRate}%` : '18%'}</td>
                    <td className="text-right py-3 text-gray-800">
                      {parseFloat((item.amount ?? item.total ?? 0) * (item.gstMultiplier ?? 1.18)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-gray-800"><span className="text-gray-400 mr-2">1.</span>cable</td>
                  <td className="text-center py-3 text-gray-600">-</td>
                  <td className="text-center py-3 text-gray-600">1</td>
                  <td className="text-center py-3 text-gray-600">Nos</td>
                  <td className="text-right py-3 text-gray-600">100.00</td>
                  <td className="text-center py-3 text-gray-600">18%</td>
                  <td className="text-right py-3 text-gray-800">118.00</td>
                </tr>
              )}
              <tr className="border-t-2 border-gray-400">
                <td className="py-3 font-light" colSpan={4}>Total</td>
                <td className="text-right py-3 text-gray-800">
                  {data?.subtotal?.toFixed ? parseFloat(data.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : data?.subtotal || '0.00'}
                </td>
                <td className="py-3"></td>
                <td className="text-right py-3 font-light text-gray-800">
                  {data?.total?.toFixed ? parseFloat(data.total).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : data?.total || '0.00'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Minimal Financial Summary */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="text-xs text-gray-600">
            <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-3">Bank Details</h3>
            <p className="mb-1">ICICI Bank</p>
            <p className="mb-1">WRIGHT TOWN JABALPUR</p>
            <p className="mb-1">A/C: 657605601783</p>
            <p>IFSC: ICIC0006576</p>
          </div>
          <div className="text-xs">
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-800">{data?.subtotal?.toFixed ? parseFloat(data.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : (data?.subtotal || '0.00')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600">Discount ({data?.discountRate || 0}%)</span>
              <span className="text-gray-800">{data?.discountAmount?.toFixed ? parseFloat(data.discountAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : (data?.discountAmount || '0.00')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600">Taxable</span>
              <span className="text-gray-800">{(typeof data?.subtotal === 'number' ? parseFloat(data.subtotal - (data?.discountAmount || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : (data?.taxable || '')).toString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600">GST ({data?.taxRate || 18}%)</span>
              <span className="text-gray-800">{data?.taxAmount?.toFixed ? parseFloat(data.taxAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : (data?.taxAmount || '0.00')}</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-gray-400 mt-1">
              <span className="font-light text-gray-800">Total</span>
              <span className="font-light text-gray-800">₹ {data?.total?.toFixed ? parseFloat(data.total).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : (data?.total || '0.00')}</span>
            </div>
            {data?.amountInWords && (
              <div className="text-center mt-2 text-gray-500 italic text-[10px]">
                ({data.amountInWords})
              </div>
            )}
          </div>
        </div>

        {/* Minimal Terms */}
        <div className="mb-6 pt-4 border-t border-gray-200">
          <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-3">Terms & Conditions</h3>
          <div className="text-xs text-gray-600 space-y-1">
            {(data?.termsSections?.length ? data.termsSections : defaultQuotationTerms).map((section) => (
              <div key={section.title}>
                <h4 className="font-light text-gray-800 mb-1">{section.title}</h4>
                {section.points.map((point, idx) => (
                  <p key={idx} className="ml-4 text-gray-500">• {point}</p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="text-xs text-gray-600 text-right pt-6 border-t border-gray-200">
          <p className="mb-4">For <span className="font-light">{selectedBranch.name}</span></p>
          <p className="mb-8 italic text-gray-400">Computer generated - No signature required.</p>
          {!hideSignatory && (
            <div>
              <p className="text-gray-400 uppercase tracking-wider text-[10px] mb-2">Authorized Signatory</p>
              {salespersonName ? (
                <>
                  <p className="text-gray-800 font-light">{salespersonName}</p>
                  <p className="text-gray-500 text-[10px] mt-1">Salesperson</p>
                </>
              ) : (
                <p className="text-gray-800 font-light">Salesperson</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

