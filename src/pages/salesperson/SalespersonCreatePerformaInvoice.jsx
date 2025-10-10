import React, { useState } from 'react'
import { Plus, Trash2, Save, Eye, Printer } from 'lucide-react'
import CorporateStandardInvoice from './salespersonpi'

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

const SalespersonCreatePerformaInvoice = () => {
  const [showPreview, setShowPreview] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState('SAMRIDDHI_CABLE')
  
  const [piFormData, setPiFormData] = useState({
    invoiceNumber: `PI-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    poNumber: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
    billTo: {
      business: '',
      address: '',
      phone: '',
      gstNo: '',
      state: ''
    },
    shipTo: {
      business: '',
      address: '',
      phone: '',
      gstNo: ''
    },
    items: [{
      id: 1,
      productName: '',
      quantity: 1,
      unit: 'Nos',
      rate: 0,
      amount: 0,
      hsn: '85446090'
    }],
    subtotal: 0,
    discountRate: 0,
    discountAmount: 0,
    taxableAmount: 0,
    taxRate: 18,
    taxAmount: 0,
    total: 0,
    deliveryTerms: 'FOR upto Destination',
    paymentTerms: 'ADVANCE',
    otherReferences: 'DIRECT SALE',
    dispatchedThrough: 'BY TRANSPORT',
    destination: 'Destination Transport'
  })

  const handleInputChange = (field, value) => {
    setPiFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBillToChange = (field, value) => {
    setPiFormData(prev => ({
      ...prev,
      billTo: {
        ...prev.billTo,
        [field]: value
      }
    }))
  }

  const handleShipToChange = (field, value) => {
    setPiFormData(prev => ({
      ...prev,
      shipTo: {
        ...prev.shipTo,
        [field]: value
      }
    }))
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...piFormData.items]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    }
    
    // Calculate amount for this item
    if (['quantity', 'rate'].includes(field)) {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate
    }
    
    // Calculate totals
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
    const discountAmount = (subtotal * piFormData.discountRate) / 100
    const taxableAmount = Math.max(0, subtotal - discountAmount)
    const taxAmount = (taxableAmount * piFormData.taxRate) / 100
    const total = taxableAmount + taxAmount
    
    setPiFormData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      discountAmount,
      taxableAmount,
      taxAmount,
      total
    }))
  }

  const addItem = () => {
    setPiFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: prev.items.length + 1,
        productName: '',
        quantity: 1,
        unit: 'Nos',
        rate: 0,
        amount: 0,
        hsn: '85446090'
      }]
    }))
  }

  const removeItem = (index) => {
    if (piFormData.items.length > 1) {
      const updatedItems = piFormData.items.filter((_, i) => i !== index)
      const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
      const discountAmount = (subtotal * piFormData.discountRate) / 100
      const taxableAmount = Math.max(0, subtotal - discountAmount)
      const taxAmount = (taxableAmount * piFormData.taxRate) / 100
      const total = taxableAmount + taxAmount
      
      setPiFormData(prev => ({
        ...prev,
        items: updatedItems,
        subtotal,
        discountAmount,
        taxableAmount,
        taxAmount,
        total
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically save the performa invoice
    console.log('Performa Invoice Data:', piFormData)
    alert('Performa Invoice created successfully!')
  }

  const companyBranches = {
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

  if (showPreview) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Performa Invoice Preview</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Edit
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>
        <CorporateStandardInvoice 
          selectedBranch={selectedBranch}
          companyBranches={companyBranches}
          quotations={[piFormData]}
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Create Performa Invoice</h1>
          <p className="text-gray-600 mt-1">Fill in the details to create a new performa invoice</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Company Branch Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Company Branch *</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="ANODE">ANODE ELECTRIC PRIVATE LIMITED</option>
                <option value="SAMRIDDHI_CABLE">SAMRIDDHI CABLE INDUSTRIES PRIVATE LIMITED</option>
                <option value="SAMRIDDHI_INDUSTRIES">SAMRIDDHI INDUSTRIES</option>
              </select>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Invoice Number *</label>
                <input
                  type="text"
                  value={piFormData.invoiceNumber}
                  onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Invoice Date *</label>
                <input
                  type="date"
                  value={piFormData.invoiceDate}
                  onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Due Date *</label>
                <input
                  type="date"
                  value={piFormData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">PO Number</label>
                <input
                  type="text"
                  value={piFormData.poNumber}
                  onChange={(e) => handleInputChange('poNumber', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bill To */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill To *</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Business Name *</label>
                  <input
                    type="text"
                    value={piFormData.billTo.business}
                    onChange={(e) => handleBillToChange('business', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Address *</label>
                  <textarea
                    value={piFormData.billTo.address}
                    onChange={(e) => handleBillToChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone *</label>
                    <input
                      type="tel"
                      value={piFormData.billTo.phone}
                      onChange={(e) => handleBillToChange('phone', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">GST Number</label>
                    <input
                      type="text"
                      value={piFormData.billTo.gstNo}
                      onChange={(e) => handleBillToChange('gstNo', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">State *</label>
                  <input
                    type="text"
                    value={piFormData.billTo.state}
                    onChange={(e) => handleBillToChange('state', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Ship To */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ship To</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Business Name</label>
                  <input
                    type="text"
                    value={piFormData.shipTo.business}
                    onChange={(e) => handleShipToChange('business', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    value={piFormData.shipTo.address}
                    onChange={(e) => handleShipToChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={piFormData.shipTo.phone}
                      onChange={(e) => handleShipToChange('phone', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">GST Number</label>
                    <input
                      type="text"
                      value={piFormData.shipTo.gstNo}
                      onChange={(e) => handleShipToChange('gstNo', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Items</h3>
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
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">HSN</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Qty</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Unit</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rate</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {piFormData.items.map((item, index) => (
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
                          type="text"
                          value={item.hsn}
                          onChange={(e) => handleItemChange(index, 'hsn', e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
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
                          <option value="MTR">MTR</option>
                          <option value="KG">KG</option>
                          <option value="SET">SET</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.amount}
                          readOnly
                          className="w-24 px-2 py-1 border border-gray-200 rounded text-sm bg-gray-50"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {piFormData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tax and Discount */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Discount Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={piFormData.discountRate}
                onChange={(e) => handleInputChange('discountRate', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={piFormData.taxRate}
                onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Total Amount</label>
              <input
                type="text"
                value={`₹ ${piFormData.total.toFixed(2)}`}
                readOnly
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm font-semibold"
              />
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Delivery Terms</label>
              <input
                type="text"
                value={piFormData.deliveryTerms}
                onChange={(e) => handleInputChange('deliveryTerms', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Payment Terms</label>
              <input
                type="text"
                value={piFormData.paymentTerms}
                onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Create PI</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SalespersonCreatePerformaInvoice
