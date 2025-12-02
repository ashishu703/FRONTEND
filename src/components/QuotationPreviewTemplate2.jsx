import React, { useState, useEffect } from 'react'
import { defaultQuotationTerms } from '../constants/quotationTerms'
import apiClient from '../utils/apiClient'
import { API_ENDPOINTS } from '../api/admin_api/api'

export default function QuotationPreviewTemplate2({ data, companyBranches, user, hideSignatory = false }) {
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
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-white font-sans text-sm" id="quotation-content">
      <div className="p-6">
        {/* Modern Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg mb-4 shadow-lg">
          <div className="p-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{selectedBranch.name}</h1>
              {selectedBranch.gstNumber && (
                <p className="text-sm opacity-90">{selectedBranch.gstNumber}</p>
              )}
              <p className="text-xs opacity-80 mt-1">{selectedBranch.description}</p>
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
            <p><strong>{selectedBranch.address}</strong></p>
            <div className="flex gap-4 mt-1 text-xs opacity-90">
              {selectedBranch.tel && <span>Tel: {selectedBranch.tel}</span>}
              {selectedBranch.web && <span>Web: {selectedBranch.web}</span>}
              {selectedBranch.email && <span>Email: {selectedBranch.email}</span>}
            </div>
          </div>
        </div>

        {/* Quotation Details - Modern Card Style */}
        <div className="bg-white rounded-lg shadow-md mb-4 p-4 border-l-4 border-blue-600">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Quotation Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-gray-500 font-semibold">Quotation Date</p>
              <p className="text-gray-800 mt-1">
                {(() => {
                  const dateValue = data?.quotationDate || new Date().toISOString();
                  const date = new Date(dateValue);
                  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                })()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold">Quotation Number</p>
              <p className="text-gray-800 mt-1">{data?.quotationNumber || `ANO/${new Date().getFullYear().toString().slice(-2)}-${(new Date().getFullYear() + 1).toString().slice(-2)}/${Math.floor(1000 + Math.random() * 9000)}`}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold">Valid Upto</p>
              <p className="text-gray-800 mt-1">
                {(() => {
                  const dateValue = data?.validUpto || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
                  const date = new Date(dateValue);
                  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                })()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold">Voucher Number</p>
              <p className="text-gray-800 mt-1">{data?.voucherNumber || `VOUCH-${Math.floor(1000 + Math.random() * 9000)}`}</p>
            </div>
          </div>
        </div>

        {/* Bill To Section - Modern Style */}
        <div className="bg-white rounded-lg shadow-md mb-4 p-4 border-l-4 border-green-500">
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div>
              <h3 className="font-bold text-green-600 mb-3 text-sm">BILL TO:</h3>
              <p className="font-semibold text-gray-800 text-base">{data?.billTo?.business || 'Customer'}</p>
              {data?.billTo?.address && <p className="text-gray-600 mt-1">{data.billTo.address}</p>}
              {data?.billTo?.phone && <p className="mt-2"><strong className="text-gray-700">PHONE:</strong> <span className="text-gray-600">{data.billTo.phone}</span></p>}
              {data?.billTo?.gstNo && <p className="mt-1"><strong className="text-gray-700">GSTIN:</strong> <span className="text-gray-600">{data.billTo.gstNo}</span></p>}
              {data?.billTo?.state && <p className="mt-1"><strong className="text-gray-700">State:</strong> <span className="text-gray-600">{data.billTo.state}</span></p>}
            </div>
            <div className="bg-gray-50 rounded p-3">
              <p className="text-gray-700"><strong>L.R. No:</strong> {data?.transportDetails?.lrNo || '-'}</p>
              <p className="text-gray-700 mt-1"><strong>Transport:</strong> {data?.transportDetails?.transport || '-'}</p>
              <p className="text-gray-700 mt-1"><strong>Transport ID:</strong> {data?.transportDetails?.transportId || '-'}</p>
              <p className="text-gray-700 mt-1"><strong>Vehicle Number:</strong> {data?.transportDetails?.vehicleNumber || '-'}</p>
            </div>
          </div>
        </div>

        {/* Products Table - Modern Style */}
        <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <th className="p-2 text-center border-r border-blue-500">Sr.</th>
                <th className="p-2 text-left border-r border-blue-500">Product / Service</th>
                <th className="p-2 text-center border-r border-blue-500">HSN/SAC</th>
                <th className="p-2 text-center border-r border-blue-500">Qty</th>
                <th className="p-2 text-center border-r border-blue-500">Unit</th>
                <th className="p-2 text-right border-r border-blue-500">Rate</th>
                <th className="p-2 text-center border-r border-blue-500">GST</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data?.items) && data.items.length > 0 ? (
                data.items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 text-center border-b border-gray-200">{index + 1}</td>
                    <td className="p-2 border-b border-gray-200">{item.productName || item.description || '-'}</td>
                    <td className="p-2 text-center border-b border-gray-200">{item.hsn || '-'}</td>
                    <td className="p-2 text-center border-b border-gray-200">{item.quantity}</td>
                    <td className="p-2 text-center border-b border-gray-200">{item.unit || 'Nos'}</td>
                    <td className="p-2 text-right border-b border-gray-200">
                      {parseFloat(item.buyerRate || item.unitPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-2 text-center border-b border-gray-200">{item.gstRate ? `${item.gstRate}%` : '18%'}</td>
                    <td className="p-2 text-right border-b border-gray-200">
                      {parseFloat((item.amount ?? item.total ?? 0) * (item.gstMultiplier ?? 1.18)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-2 text-center border-b border-gray-200">1</td>
                  <td className="p-2 border-b border-gray-200">cable</td>
                  <td className="p-2 text-center border-b border-gray-200">-</td>
                  <td className="p-2 text-center border-b border-gray-200">1</td>
                  <td className="p-2 text-center border-b border-gray-200">Nos</td>
                  <td className="p-2 text-right border-b border-gray-200">100.00</td>
                  <td className="p-2 text-center border-b border-gray-200">18%</td>
                  <td className="p-2 text-right border-b border-gray-200">118.00</td>
                </tr>
              )}
              <tr className="bg-blue-50 font-bold">
                <td className="p-2 border-t-2 border-blue-600" colSpan={5}>Total</td>
                <td className="p-2 text-right border-t-2 border-blue-600">
                  {data?.subtotal?.toFixed ? parseFloat(data.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : data?.subtotal || '0.00'}
                </td>
                <td className="p-2 border-t-2 border-blue-600"></td>
                <td className="p-2 text-right border-t-2 border-blue-600">
                  {data?.total?.toFixed ? parseFloat(data.total).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : data?.total || '0.00'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Financial Summary - Modern Card */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
            <h3 className="font-bold text-purple-600 mb-3">Bank Details</h3>
            <div className="text-xs space-y-1 text-gray-700">
              <p><strong>Bank Name:</strong> {data?.bankDetails?.bankName || 'ICICI Bank'}</p>
              <p><strong>Branch:</strong> {data?.bankDetails?.branchName || 'WRIGHT TOWN JABALPUR'}</p>
              <p><strong>Account Number:</strong> {data?.bankDetails?.accountNumber || '657605601783'}</p>
              <p><strong>IFSC:</strong> {data?.bankDetails?.ifscCode || 'ICIC0006576'}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="text-xs space-y-2">
              <div className="flex justify-between pb-1 border-b border-gray-200">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{data?.subtotal?.toFixed ? parseFloat(data.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : (data?.subtotal || '0.00')}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-gray-200">
                <span className="text-gray-600">Discount ({data?.discountRate || 0}%)</span>
                <span className="font-semibold">{data?.discountAmount?.toFixed ? parseFloat(data.discountAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : (data?.discountAmount || '0.00')}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-gray-200">
                <span className="text-gray-600">Taxable Amount</span>
                <span className="font-semibold">{(typeof data?.subtotal === 'number' ? parseFloat(data.subtotal - (data?.discountAmount || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : (data?.taxable || '')).toString()}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-gray-200">
                <span className="text-gray-600">GST ({data?.taxRate || 18}%)</span>
                <span className="font-semibold">{data?.taxAmount?.toFixed ? parseFloat(data.taxAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : (data?.taxAmount || '0.00')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-green-500">
                <span className="font-bold text-green-700">Total Amount</span>
                <span className="font-bold text-green-700">₹ {data?.total?.toFixed ? parseFloat(data.total).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : (data?.total || '0.00')}</span>
              </div>
              {data?.amountInWords && (
                <div className="text-center mt-2 text-gray-600 italic">
                  ({data.amountInWords})
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Terms - Modern Style */}
        <div className="bg-white rounded-lg shadow-md mb-4 p-4 border-l-4 border-orange-500">
          <h3 className="font-bold text-orange-600 mb-3">Terms and Conditions</h3>
          <div className="text-xs space-y-2 text-gray-700">
            {(data?.termsSections?.length ? data.termsSections : defaultQuotationTerms).map((section) => (
              <div key={section.title}>
                <h4 className="font-bold text-gray-800">{section.title}</h4>
                {section.points.map((point, idx) => (
                  <p key={idx} className="ml-2">• {point}</p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-right text-xs text-gray-700">
          <p className="mb-4">For <strong className="text-blue-600">{selectedBranch.name}</strong></p>
          <p className="mb-8 text-gray-500 italic">This is computer generated invoice no signature required.</p>
          {!hideSignatory && (
            <div className="bg-gray-50 rounded-lg p-4 inline-block">
              <p className="font-bold text-gray-800">Authorized Signatory</p>
              {salespersonName ? (
                <>
                  <p className="mt-2 text-sm font-semibold text-blue-600">{salespersonName}</p>
                  <p className="mt-1 text-xs text-gray-600">Salesperson</p>
                </>
              ) : (
                <p className="mt-2 text-sm font-semibold text-blue-600">Salesperson</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

