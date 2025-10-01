import React, { useState } from 'react';
import { X, Plus, DollarSign, Eye, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

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

  const [showPreview, setShowPreview] = useState(false);

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

  // Check if all required fields are filled
  const isFormValid = () => {
    const { billTo, items } = quotationData;
    
    // Check bill-to information
    if (!billTo.business || !billTo.phone || !billTo.address || !billTo.gstNo || !billTo.state) {
      return false;
    }
    
    // Check items
    if (items.length === 0) return false;
    
    return items.every(item => 
      item.productName && 
      item.quantity > 0 && 
      item.buyerRate > 0
    );
  };

  const handlePreview = () => {
    if (isFormValid()) {
      setShowPreview(true);
    } else {
      alert('Please fill all required fields before previewing');
    }
  };

  const handleDownload = () => {
    if (isFormValid()) {
      const element = document.getElementById('quotation-preview-content');
      if (element) {
        const opt = {
          margin: [0.4, 0.4, 0.4, 0.4],
          filename: `Quotation-${quotationData.quotationNumber}-${quotationData.billTo.business.replace(/\s+/g, '-')}.pdf`,
          image: { type: 'jpeg', quality: 0.8 },
          html2canvas: { 
            scale: 1.1,
            useCORS: true,
            letterRendering: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
          },
          jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true,
            putOnlyUsedFonts: true
          }
        };
        html2pdf().set(opt).from(element).save();
      }
    } else {
      alert('Please fill all required fields before downloading');
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
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={handlePreview}
                  disabled={!isFormValid()}
                  className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    isFormValid() 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button 
                  type="button" 
                  onClick={handleDownload}
                  disabled={!isFormValid()}
                  className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    isFormValid() 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
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

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Quotation Preview - {quotationData.billTo.business}</h3>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close preview"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Quotation Preview Content */}
              <div id="quotation-preview-content" className="border-2 border-black p-6 bg-white">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h1 className="text-xl font-bold">{companyBranches[quotationData.selectedBranch].name}</h1>
                    <p className="text-sm font-semibold text-gray-700">{companyBranches[quotationData.selectedBranch].gstNumber}</p>
                    <p className="text-xs">{companyBranches[quotationData.selectedBranch].description}</p>
                  </div>
                  <div className="text-right">
                    <img
                      src="https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png"
                      alt="Company Logo"
                      className="h-12 w-auto bg-white p-1 rounded"
                    />
                  </div>
                </div>
                
                {/* Company Details */}
                <div className="border-2 border-black p-4 mb-4">
                  <h3 className="font-bold mb-2">Company Details</h3>
                  <p className="text-sm">{companyBranches[quotationData.selectedBranch].address}</p>
                  <p className="text-sm">Tel: {companyBranches[quotationData.selectedBranch].tel}</p>
                  <p className="text-sm">Web: {companyBranches[quotationData.selectedBranch].web}</p>
                  <p className="text-sm">Email: {companyBranches[quotationData.selectedBranch].email}</p>
                </div>
              
                {/* Quotation Details Table */}
                <div className="border border-black p-4 mb-4">
                  <h3 className="font-bold mb-2">Quotation Details</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-black">
                        <th className="text-left p-2 border-r border-black">Quotation Date</th>
                        <th className="text-left p-2 border-r border-black">Quotation Number</th>
                        <th className="text-left p-2">Valid Upto</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-r border-black">{quotationData.quotationDate}</td>
                        <td className="p-2 border-r border-black">{quotationData.quotationNumber}</td>
                        <td className="p-2">{quotationData.validUpto}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {/* Customer Details */}
                <div className="border border-black p-4 mb-4">
                  <h3 className="font-bold mb-2">Bill To:</h3>
                  <p className="font-semibold">{quotationData.billTo.business}</p>
                  <p>{quotationData.billTo.address}</p>
                  <p>Phone: {quotationData.billTo.phone}</p>
                  <p>GST: {quotationData.billTo.gstNo}</p>
                  <p>State: {quotationData.billTo.state}</p>
                </div>
                
                {/* Items Table */}
                <div className="border border-black p-4 mb-4">
                  <h3 className="font-bold mb-2">Items</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-black">
                        <th className="text-left p-2 border-r border-black">Description</th>
                        <th className="text-center p-2 border-r border-black">Quantity</th>
                        <th className="text-right p-2 border-r border-black">Unit Price</th>
                        <th className="text-right p-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotationData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="p-2 border-r border-black">{item.productName}</td>
                          <td className="p-2 text-center border-r border-black">{item.quantity} {item.unit}</td>
                          <td className="p-2 text-right border-r border-black">₹{item.buyerRate.toFixed(2)}</td>
                          <td className="p-2 text-right">₹{item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Totals */}
                <div className="border border-black p-4 mb-4">
                  <div className="flex justify-end">
                    <div className="w-64">
                      <div className="flex justify-between p-2 border-b">
                        <span>Subtotal:</span>
                        <span>₹{quotationData.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between p-2 border-b">
                        <span>GST ({quotationData.taxRate}%):</span>
                        <span>₹{quotationData.taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between p-2 font-bold">
                        <span>Total:</span>
                        <span>₹{quotationData.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Terms & Conditions */}
                <div className="border border-black p-4 mb-4">
                  <h3 className="font-bold mb-2">Terms & Conditions</h3>
                  <p className="text-sm whitespace-pre-line">{quotationData.terms}</p>
                </div>
                
                {/* Footer */}
                <div className="text-right text-xs mt-4">
                  <p className="mb-4">
                    For <strong>{companyBranches[quotationData.selectedBranch].name}</strong>
                  </p>
                  <p className="mb-8">This is computer generated quotation no signature required.</p>
                  <p className="font-bold">Authorized Signatory</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 border border-transparent rounded shadow-sm hover:bg-green-700"
                onClick={handleDownload}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingQuotationForm;
