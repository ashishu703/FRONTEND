import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Eye } from 'lucide-react';

const MobileMarketingQuotationForm = ({ lead, onQuotationCreated, onClose }) => {
  const [formData, setFormData] = useState({
    quotationDate: new Date().toISOString().split('T')[0],
    quotationNumber: `ANQ${Date.now().toString().slice(-6)}`,
    validUpto: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
    billTo: {
      business: lead.name || '',
      address: lead.address || '',
      phone: lead.phone || '',
      gstNo: lead.gstNo || '',
      state: lead.state || ''
    },
    items: [],
    subtotal: 0,
    taxAmount: 0,
    total: 0
  });

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    quantity: 1,
    rate: 0,
    amount: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleBillToChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      billTo: {
        ...formData.billTo,
        [name]: value
      }
    });
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    const updatedItem = {
      ...newItem,
      [name]: value
    };
    
    if (name === 'quantity' || name === 'rate') {
      updatedItem.amount = updatedItem.quantity * updatedItem.rate;
    }
    
    setNewItem(updatedItem);
  };

  const addItem = () => {
    if (newItem.name && newItem.quantity > 0 && newItem.rate > 0) {
      const updatedItems = [...formData.items, newItem];
      const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
      const taxAmount = subtotal * 0.18;
      const total = subtotal + taxAmount;
      
      setFormData({
        ...formData,
        items: updatedItems,
        subtotal,
        taxAmount,
        total
      });
      
      setNewItem({
        name: '',
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0
      });
    }
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * 0.18;
    const total = subtotal + taxAmount;
    
    setFormData({
      ...formData,
      items: updatedItems,
      subtotal,
      taxAmount,
      total
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onQuotationCreated(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Create Quotation</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {/* Quotation Details */}
          <div className="space-y-4 mb-6">
            <h3 className="text-base font-semibold text-gray-900">Quotation Details</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Date</label>
                <input
                  type="date"
                  name="quotationDate"
                  value={formData.quotationDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                <input
                  type="date"
                  name="validUpto"
                  value={formData.validUpto}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Number</label>
              <input
                type="text"
                name="quotationNumber"
                value={formData.quotationNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Bill To Section */}
          <div className="space-y-4 mb-6">
            <h3 className="text-base font-semibold text-gray-900">Bill To</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                name="business"
                value={formData.billTo.business}
                onChange={handleBillToChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                value={formData.billTo.address}
                onChange={handleBillToChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.billTo.phone}
                  onChange={handleBillToChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST No</label>
                <input
                  type="text"
                  name="gstNo"
                  value={formData.billTo.gstNo}
                  onChange={handleBillToChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.billTo.state}
                onChange={handleBillToChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-4 mb-6">
            <h3 className="text-base font-semibold text-gray-900">Items</h3>
            
            {/* Add New Item */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Add New Item</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={newItem.name}
                  onChange={handleItemChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newItem.description}
                  onChange={handleItemChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter item description"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={newItem.quantity}
                    onChange={handleItemChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate (₹)</label>
                  <input
                    type="number"
                    name="rate"
                    value={newItem.rate}
                    onChange={handleItemChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={newItem.amount}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={addItem}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Items List */}
            {formData.items.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Added Items</h4>
                {formData.items.map((item, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{item.name}</h5>
                        {item.description && (
                          <p className="text-sm text-gray-600">{item.description}</p>
                        )}
                        <div className="flex space-x-4 mt-1 text-sm text-gray-500">
                          <span>Qty: {item.quantity}</span>
                          <span>Rate: ₹{item.rate}</span>
                          <span>Amount: ₹{item.amount}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals */}
          {formData.items.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Totals</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹{formData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (18%):</span>
                  <span>₹{formData.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>₹{formData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formData.items.length === 0}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>Create Quotation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MobileMarketingQuotationForm;
