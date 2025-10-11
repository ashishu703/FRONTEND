import React from 'react';
import { Download, X, Printer } from 'lucide-react';

const MobileMarketingQuotationPreview = ({ quotationData, onClose }) => {
  const handleDownload = () => {
    // Download logic here
    console.log('Downloading quotation preview...');
  };

  const handlePrint = () => {
    // Print logic here
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Quotation Preview</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Quotation Preview Content */}
        <div className="p-4">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Company Header */}
            <div className="bg-blue-600 text-white p-4 text-center">
              <h1 className="text-xl font-bold">ANOCAB</h1>
              <p className="text-sm opacity-90">Electrical Solutions</p>
              <p className="text-xs opacity-75">Your Trusted Electrical Partner</p>
            </div>

            {/* Quotation Details */}
            <div className="p-4 space-y-4">
              {/* Quotation Info */}
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Quotation No:</span>
                    <span className="font-semibold text-gray-900">{quotationData.quotationNumber}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Date:</span>
                    <span className="text-gray-900">{quotationData.quotationDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Valid Until:</span>
                    <span className="text-gray-900">{quotationData.validUpto}</span>
                  </div>
                </div>
              </div>

              {/* Bill To Section */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Bill To:
                </h3>
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                  <p className="font-medium text-gray-900 mb-1">{quotationData.billTo.business}</p>
                  <p className="mb-1">{quotationData.billTo.address}</p>
                  <p className="mb-1">Phone: {quotationData.billTo.phone}</p>
                  {quotationData.billTo.gstNo && <p className="mb-1">GST No: {quotationData.billTo.gstNo}</p>}
                  <p>State: {quotationData.billTo.state}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Items:
                </h3>
                {quotationData.items && quotationData.items.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Item</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Qty</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Rate</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotationData.items.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="px-3 py-2">
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                {item.description && (
                                  <p className="text-xs text-gray-600">{item.description}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2">{item.quantity}</td>
                            <td className="px-3 py-2">₹{item.rate}</td>
                            <td className="px-3 py-2 font-medium">₹{item.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No items added yet</p>
                    <p className="text-xs mt-1">Add items to create a complete quotation</p>
                  </div>
                )}
              </div>

              {/* Totals */}
              {quotationData.items && quotationData.items.length > 0 && (
                <div className="border-t pt-4">
                  <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>₹{quotationData.subtotal || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax (18%):</span>
                        <span>₹{quotationData.taxAmount || 0}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>₹{quotationData.total || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Terms & Conditions:
                </h3>
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 space-y-1">
                  <p>• Prices are subject to change without notice</p>
                  <p>• Payment terms: 50% advance, 50% on delivery</p>
                  <p>• Delivery: 7-10 working days</p>
                  <p>• Warranty: 1 year from date of delivery</p>
                  <p>• Installation charges extra if required</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 text-center text-sm text-gray-600">
              <p className="font-medium">Thank you for your business!</p>
              <p>For any queries, contact us at: info@anocab.com</p>
              <p className="text-xs mt-2">This is a computer generated quotation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMarketingQuotationPreview;
