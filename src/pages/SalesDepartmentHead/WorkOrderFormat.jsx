import React, { useState, useEffect } from 'react';
import { X, Save, Download } from 'lucide-react';
import workOrderService from '../../services/WorkOrderService';
import DateFormatter from '../../utils/DateFormatter';

/**
 * WorkOrderFormat component - Editable work order with live preview
 * Follows OOP principles and DRY for reusable components
 */
const WorkOrderFormat = ({ paymentData, onClose, onSave }) => {
  const [workOrder, setWorkOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (paymentData) {
      const initialData = workOrderService.buildWorkOrderFromPayment(paymentData);
      setWorkOrder(initialData);
    }
  }, [paymentData]);

  const handleFieldChange = (section, field, value) => {
    setWorkOrder(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleOrderDetailsChange = (field, value) => {
    setWorkOrder(prev => ({
      ...prev,
      orderDetails: {
        ...prev.orderDetails,
        [field]: value
      }
    }));
  };

  const handleTermsChange = (index, value) => {
    setWorkOrder(prev => ({
      ...prev,
      terms: prev.terms.map((term, i) => i === index ? value : term)
    }));
  };

  const handleAddTerm = () => {
    setWorkOrder(prev => ({
      ...prev,
      terms: [...prev.terms, '']
    }));
  };

  const handleRemoveTerm = (index) => {
    setWorkOrder(prev => ({
      ...prev,
      terms: prev.terms.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!workOrder) return;
    
    setSaving(true);
    try {
      await workOrderService.saveWorkOrder(workOrder, paymentData);
      if (onSave) onSave(workOrder);
      alert('Work order saved successfully!');
    } catch (error) {
      console.error('Error saving work order:', error);
      alert('Failed to save work order');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    window.print();
  };

  if (!workOrder) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Work Order</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              {isEditing ? 'Preview' : 'Edit'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Edit Form */}
          {isEditing && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Edit Work Order</h3>
              
              {/* Basic Info */}
              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-gray-700">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={workOrder.date}
                      onChange={(e) => setWorkOrder(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                    <input
                      type="date"
                      value={workOrder.deliveryDate}
                      onChange={(e) => setWorkOrder(prev => ({ ...prev, deliveryDate: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Order Number</label>
                    <input
                      type="text"
                      value={workOrder.workOrderNumber}
                      onChange={(e) => setWorkOrder(prev => ({ ...prev, workOrderNumber: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quotation ID</label>
                    <input
                      type="text"
                      value={workOrder.quotationId}
                      onChange={(e) => setWorkOrder(prev => ({ ...prev, quotationId: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                    <input
                      type="text"
                      value={workOrder.contact}
                      onChange={(e) => setWorkOrder(prev => ({ ...prev, contact: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* From Section */}
              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-gray-700">From (Company)</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={workOrder.from.companyName}
                    onChange={(e) => handleFieldChange('from', 'companyName', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={workOrder.from.address}
                    onChange={(e) => handleFieldChange('from', 'address', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={workOrder.from.email}
                    onChange={(e) => handleFieldChange('from', 'email', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="GSTIN"
                    value={workOrder.from.gstin}
                    onChange={(e) => handleFieldChange('from', 'gstin', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              {/* To Section */}
              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-gray-700">To (Customer)</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={workOrder.to.companyName}
                    onChange={(e) => handleFieldChange('to', 'companyName', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={workOrder.to.address}
                    onChange={(e) => handleFieldChange('to', 'address', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={workOrder.to.email}
                    onChange={(e) => handleFieldChange('to', 'email', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-gray-700">Order Details</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Title"
                    value={workOrder.orderDetails.title}
                    onChange={(e) => handleOrderDetailsChange('title', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={workOrder.orderDetails.description}
                    onChange={(e) => handleOrderDetailsChange('description', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Quantity"
                      value={workOrder.orderDetails.quantity}
                      onChange={(e) => handleOrderDetailsChange('quantity', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Type"
                      value={workOrder.orderDetails.type}
                      onChange={(e) => handleOrderDetailsChange('type', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Length"
                      value={workOrder.orderDetails.length}
                      onChange={(e) => handleOrderDetailsChange('length', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Colour"
                      value={workOrder.orderDetails.colour}
                      onChange={(e) => handleOrderDetailsChange('colour', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Print"
                      value={workOrder.orderDetails.print}
                      onChange={(e) => handleOrderDetailsChange('print', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                      type="number"
                      placeholder="Total"
                      value={workOrder.orderDetails.total}
                      onChange={(e) => handleOrderDetailsChange('total', parseFloat(e.target.value) || 0)}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-gray-700">Terms & Conditions</h4>
                <div className="space-y-2">
                  {workOrder.terms.map((term, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={term}
                        onChange={(e) => handleTermsChange(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2"
                        placeholder={`Term ${index + 1}`}
                      />
                      <button
                        onClick={() => handleRemoveTerm(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddTerm}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add Term
                  </button>
                </div>
              </div>

              {/* Signatures */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Signatures</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prepared By</label>
                    <input
                      type="text"
                      value={workOrder.preparedBy}
                      onChange={(e) => setWorkOrder(prev => ({ ...prev, preparedBy: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Received By</label>
                    <input
                      type="text"
                      value={workOrder.receivedBy}
                      onChange={(e) => setWorkOrder(prev => ({ ...prev, receivedBy: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Live Preview */}
          <div className="bg-white rounded-lg shadow p-6 print:p-0">
            <h3 className="text-lg font-semibold mb-4 print:hidden">Live Preview</h3>
            <WorkOrderPreview workOrder={workOrder} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * WorkOrderPreview component - Reusable preview component (DRY)
 */
const WorkOrderPreview = ({ workOrder }) => {
  if (!workOrder) return null;

  const formattedDate = DateFormatter.formatDate(workOrder.date);
  const formattedDeliveryDate = DateFormatter.formatDate(workOrder.deliveryDate);
  const formattedTotal = workOrderService.formatCurrency(workOrder.orderDetails.total);
  const formattedUnitRate = workOrderService.formatCurrency(parseFloat(workOrder.unitRate || 0));

  return (
    <div className="max-w-4xl mx-auto bg-white font-sans text-sm print:max-w-full">
      {/* Header */}
      <div className="border-2 border-black mb-4">
        <div className="p-4 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-900 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{workOrder.from.companyName}</h1>
                <p className="text-xs font-semibold text-gray-700">GSTIN: {workOrder.from.gstin}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-orange-600">WORK ORDER</h2>
            <p className="text-sm text-gray-700">#{workOrder.workOrderNumber}</p>
          </div>
        </div>
      </div>

      {/* Key Info */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-amber-50 p-2 rounded border border-amber-200">
          <p className="text-xs text-gray-600">Date</p>
          <p className="font-semibold text-gray-900">{formattedDate}</p>
        </div>
        <div className="bg-amber-50 p-2 rounded border border-amber-200">
          <p className="text-xs text-gray-600">Delivery</p>
          <p className="font-semibold text-gray-900">{formattedDeliveryDate}</p>
        </div>
        <div className="bg-amber-50 p-2 rounded border border-amber-200">
          <p className="text-xs text-gray-600">Quotation ID</p>
          <p className="font-semibold text-gray-900">{workOrder.quotationId}</p>
        </div>
        <div className="bg-amber-50 p-2 rounded border border-amber-200">
          <p className="text-xs text-gray-600">Contact</p>
          <p className="font-semibold text-gray-900">{workOrder.contact}</p>
        </div>
      </div>

      {/* From/To */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border border-gray-300 p-4 rounded">
          <p className="font-bold mb-2">From:</p>
          <p className="font-semibold">{workOrder.from.companyName}</p>
          <p className="text-gray-600 text-xs">{workOrder.from.address}</p>
          <p className="text-gray-600 text-xs">{workOrder.from.email}</p>
        </div>
        <div className="border border-gray-300 p-4 rounded">
          <p className="font-bold mb-2">To:</p>
          <p className="font-semibold">{workOrder.to.companyName}</p>
          <p className="text-gray-600 text-xs">{workOrder.to.address}</p>
          <p className="text-gray-600 text-xs">{workOrder.to.email}</p>
        </div>
      </div>

      {/* Order Details */}
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-1">{workOrder.orderDetails.title}</h3>
        <p className="text-gray-600 text-xs mb-3">{workOrder.orderDetails.description}</p>
        <div className="border border-gray-300 rounded p-3">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-gray-600">Qty:</span>
              <span className="font-semibold ml-1">{workOrder.orderDetails.quantity}</span>
            </div>
            <div>
              <span className="text-gray-600">Type:</span>
              <span className="font-semibold ml-1">{workOrder.orderDetails.type}</span>
            </div>
            <div>
              <span className="text-gray-600">Length:</span>
              <span className="font-semibold ml-1">{workOrder.orderDetails.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Colour:</span>
              <span className="font-semibold ml-1">{workOrder.orderDetails.colour}</span>
            </div>
            <div>
              <span className="text-gray-600">Print:</span>
              <span className="font-semibold ml-1">{workOrder.orderDetails.print}</span>
            </div>
            <div>
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold text-orange-600 ml-1">{formattedTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Rate */}
      <div className="bg-amber-50 p-3 rounded border border-amber-200 mb-4 flex justify-between items-center">
        <span className="font-semibold text-gray-700">Unit Rate:</span>
        <span className="font-bold text-orange-600">{formattedUnitRate}</span>
      </div>

      {/* Terms & Conditions */}
      <div className="mb-4">
        <h4 className="font-bold mb-2">Terms & Conditions:</h4>
        <ul className="list-disc list-inside space-y-1 text-xs">
          {workOrder.terms.map((term, index) => (
            <li key={index} className="text-gray-700">{term}</li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-300">
        <div>
          <p className="font-semibold mb-1">Prepared By</p>
          <div className="border-b border-gray-400 pb-1 mb-2">{workOrder.preparedBy || ''}</div>
          <p className="text-xs text-gray-600">{formattedDate}</p>
        </div>
        <div></div>
        <div>
          <p className="font-semibold mb-1">Received By</p>
          <div className="border-b border-gray-400 pb-1">{workOrder.receivedBy || ''}</div>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderFormat;

