import React, { useState } from 'react';
import { X, Plus, DollarSign } from 'lucide-react';

// CreateQuotationForm Component for Marketing Salesperson
const MarketingQuotationForm = ({ customer, user, onClose, onSave }) => {
  const getSevenDaysLater = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

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
  };

  const [quotationData, setQuotationData] = useState({
    quotationNumber: `ANQ${Date.now().toString().slice(-6)}`,
    quotationDate: new Date().toISOString().split('T')[0],
    validUpto: getSevenDaysLater(new Date().toISOString().split('T')[0]),
    selectedBranch: 'ANODE', // Default branch
    items: [
      {
        id: 1,
        productName: "",
        quantity: 1,
        unit: "Nos",
        companyRate: 0,
        buyerRate: 0,
        amount: 0
      }
    ],
    subtotal: 0,
    taxRate: 18,
    taxAmount: 0,
    total: 0,
    terms: "1. Payment terms: 30 days from invoice date\n2. Delivery: 15-20 working days\n3. Prices are subject to change without notice\n4. All disputes subject to Jabalpur jurisdiction",
    // Editable bill-to information
    billTo: {
      business: customer?.name || "",
      address: customer?.address || "",
      phone: customer?.phone || "",
      gstNo: customer?.gstNo || "",
      state: customer?.state || ""
    }
  });

  const handleInputChange = (field, value) => {
    const newData = {
      ...quotationData,
      [field]: value
    };

    // If quotationDate changes, update validUpto to be 7 days later
    if (field === 'quotationDate') {
      newData.validUpto = getSevenDaysLater(value);
    }

    setQuotationData(newData);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...quotationData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    // Calculate amount for this item
    if (['quantity', 'companyRate', 'buyerRate'].includes(field)) {
      // Use buyerRate for amount calculation
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].buyerRate;
    }
    
    // Calculate totals
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * quotationData.taxRate) / 100;
    const total = subtotal + taxAmount;
    
    setQuotationData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      taxAmount,
      total
    }));
  };

  const addItem = () => {
    setQuotationData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: prev.items.length + 1,
        productName: "",
        quantity: 1,
        unit: "Nos",
        companyRate: 0,
        buyerRate: 0,
        amount: 0
      }]
    }));
  };

  const removeItem = (index) => {
    if (quotationData.items.length > 1) {
      const updatedItems = quotationData.items.filter((_, i) => i !== index);
      const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
      const taxAmount = (subtotal * quotationData.taxRate) / 100;
      const total = subtotal + taxAmount;
      
      setQuotationData(prev => ({
        ...prev,
        items: updatedItems,
        subtotal,
        taxAmount,
        total
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...quotationData,
      customer: customer,
      createdAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create Quotation for {customer?.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quotation Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quotation Number</label>
                <input
                  type="text"
                  value={quotationData.quotationNumber}
                  disabled
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-sm text-gray-600 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quotation Date *</label>
                <input
                  type="date"
                  required
                  value={quotationData.quotationDate}
                  onChange={(e) => handleInputChange("quotationDate", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Valid Until *</label>
                <div className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm">
                  {quotationData.validUpto} (7 days from quotation date)
                </div>
              </div>
            </div>

            {/* Branch Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Company Branch</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Select Branch *</label>
                <select
                  value={quotationData.selectedBranch}
                  onChange={(e) => handleInputChange("selectedBranch", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="ANODE">ANODE ELECTRIC PRIVATE LIMITED</option>
                  <option value="SAMRIDDHI_CABLE">SAMRIDDHI CABLE INDUSTRIES PRIVATE LIMITED</option>
                  <option value="SAMRIDDHI_INDUSTRIES">SAMRIDDHI INDUSTRIES</option>
                </select>
              </div>
            </div>

            {/* Bill To Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Bill To Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={quotationData.billTo.business}
                    onChange={(e) => setQuotationData(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, business: e.target.value }
                    }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone *</label>
                  <input
                    type="text"
                    required
                    value={quotationData.billTo.phone}
                    onChange={(e) => setQuotationData(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, phone: e.target.value }
                    }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Address *</label>
                  <input
                    type="text"
                    required
                    value={quotationData.billTo.address}
                    onChange={(e) => setQuotationData(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, address: e.target.value }
                    }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">GST Number *</label>
                  <input
                    type="text"
                    required
                    value={quotationData.billTo.gstNo}
                    onChange={(e) => setQuotationData(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, gstNo: e.target.value }
                    }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">State *</label>
                  <input
                    type="text"
                    required
                    value={quotationData.billTo.state}
                    onChange={(e) => setQuotationData(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, state: e.target.value }
                    }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Items</h3>
                <button 
                  type="button" 
                  onClick={addItem}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company Rate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer Rate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {quotationData.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            placeholder="Product name"
                            value={item.productName}
                            onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                            required
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={item.unit}
                            onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            <option value="Nos">Nos</option>
                            <option value="Mtr">Mtr</option>
                            <option value="Kg">Kg</option>
                            <option value="Set">Set</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.companyRate}
                            readOnly
                            className="w-24 px-2 py-1 border border-gray-200 rounded text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                            title="Company rate is fixed and cannot be edited"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.buyerRate}
                            onChange={(e) => handleItemChange(index, 'buyerRate', parseFloat(e.target.value) || 0)}
                            className="w-24 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">
                          ₹{item.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          {quotationData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₹{quotationData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST ({quotationData.taxRate}%):</span>
                    <span>₹{quotationData.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>₹{quotationData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Terms & Conditions
              </label>
              <textarea
                value={quotationData.terms}
                onChange={(e) => handleInputChange("terms", e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Enter terms and conditions"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end pt-6 border-t">
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Create Quotation
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MarketingQuotationForm;
