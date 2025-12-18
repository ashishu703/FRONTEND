import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, RefreshCw, Plus, Package, Calendar, Edit, Eye, X, Filter,
  Clock, CheckCircle, XCircle, AlertCircle, DollarSign, Truck, Hash,
  Phone, MapPin, Building, FileText
} from 'lucide-react';
import { API_ENDPOINTS } from '../../../api/admin_api/api';
import apiClient from '../../../utils/apiClient';
import { useMarketingSharedData } from '../MarketingSharedDataContext';

// Mobile Add Order Form Component
const MobileAddOrderForm = ({ onSave, onClose }) => {
  const { customers } = useMarketingSharedData();
  
  const customerData = customers.map(customer => ({
    name: customer.name || 'N/A',
    phone: customer.phone || 'N/A',
    address: customer.address || 'N/A',
    gst: (customer.gstNo && customer.gstNo !== 'N/A') ? customer.gstNo : (customer.gst_no && customer.gst_no !== 'N/A' ? customer.gst_no : 'NA')
  })).filter(customer => customer.name !== 'N/A' && customer.name);

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    customerGst: '',
    productName: '',
    productType: '',
    quantity: 1,
    unitPrice: '',
    totalAmount: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    deliveredDate: '',
    orderStatus: 'Pending',
    dispatchFrom: 'Plant',
    paymentStatus: 'Not Started',
    paidAmount: 0,
    pendingAmount: 0,
    workOrder: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderData = {
      ...formData,
      totalAmount: (formData.quantity * formData.unitPrice).toFixed(2)
    };
    onSave(orderData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'quantity' || name === 'unitPrice') {
        updated.totalAmount = (updated.quantity * updated.unitPrice).toFixed(2);
      }
      if (name === 'paidAmount') {
        const paidAmount = parseFloat(value) || 0;
        const totalAmount = parseFloat(updated.totalAmount) || 0;
        updated.pendingAmount = Math.max(0, totalAmount - paidAmount);
      }
      return updated;
    });
  };

  const handleCustomerSelect = (e) => {
    const selectedCustomer = customerData.find(customer => customer.name === e.target.value);
    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        customerName: selectedCustomer.name,
        customerPhone: selectedCustomer.phone,
        customerAddress: selectedCustomer.address,
        customerGst: selectedCustomer.gst
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Customer Information */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Customer Information</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Customer Name *</label>
            <select
              name="customerName"
              value={formData.customerName}
              onChange={handleCustomerSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Customer</option>
              {customerData.map((customer, index) => (
                <option key={index} value={customer.name}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Address *</label>
            <textarea
              name="customerAddress"
              value={formData.customerAddress}
              readOnly
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">GST No.</label>
            <input
              type="text"
              name="customerGst"
              value={formData.customerGst || 'NA'}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Product Information</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Product Type *</label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Product Type</option>
              <option value="Cable">Cable</option>
              <option value="Conductor">Conductor</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Product Name *</label>
            <select
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Product</option>
              <option value="Aerial Bunch Cable">Aerial Bunch Cable</option>
              <option value="Aluminium Conductor Galvanized Steel Reinforced">Aluminium Conductor Galvanized Steel Reinforced</option>
              <option value="All Aluminium Alloy Conductor">All Aluminium Alloy Conductor</option>
              <option value="PVC Insulated Submersible Cable">PVC Insulated Submersible Cable</option>
              <option value="Multi Core XLPE Insulated Aluminium Unarmoured Cable">Multi Core XLPE Insulated Aluminium Unarmoured Cable</option>
              <option value="Paper Cover Aluminium Conductor">Paper Cover Aluminium Conductor</option>
              <option value="Single Core PVC Insulated Aluminium/Copper Armoured/Unarmoured Cable">Single Core PVC Insulated Aluminium/Copper Armoured/Unarmoured Cable</option>
              <option value="Single Core XLPE Insulated Aluminium/Copper Armoured/Unarmoured Cable">Single Core XLPE Insulated Aluminium/Copper Armoured/Unarmoured Cable</option>
              <option value="Multi Core PVC Insulated Aluminium Armoured Cable">Multi Core PVC Insulated Aluminium Armoured Cable</option>
              <option value="Multi Core XLPE Insulated Aluminium Armoured Cable">Multi Core XLPE Insulated Aluminium Armoured Cable</option>
              <option value="Multi Core PVC Insulated Aluminium Unarmoured Cable">Multi Core PVC Insulated Aluminium Unarmoured Cable</option>
              <option value="Multistrand Single Core Copper Cable">Multistrand Single Core Copper Cable</option>
              <option value="Multi Core Copper Cable">Multi Core Copper Cable</option>
              <option value="PVC Insulated Single Core Aluminium Cable">PVC Insulated Single Core Aluminium Cable</option>
              <option value="PVC Insulated Multicore Aluminium Cable">PVC Insulated Multicore Aluminium Cable</option>
              <option value="Submersible Winding Wire">Submersible Winding Wire</option>
              <option value="Twin Twisted Copper Wire">Twin Twisted Copper Wire</option>
              <option value="Speaker Cable">Speaker Cable</option>
              <option value="CCTV Cable">CCTV Cable</option>
              <option value="LAN Cable">LAN Cable</option>
              <option value="Automobile Cable">Automobile Cable</option>
              <option value="PV Solar Cable">PV Solar Cable</option>
              <option value="Co Axial Cable">Co Axial Cable</option>
              <option value="Uni-tube Unarmoured Optical Fibre Cable">Uni-tube Unarmoured Optical Fibre Cable</option>
              <option value="Armoured Unarmoured PVC Insulated Copper Control Cable">Armoured Unarmoured PVC Insulated Copper Control Cable</option>
              <option value="Telecom Switch Board Cables">Telecom Switch Board Cables</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price (₹) *</label>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Total Amount (₹)</label>
            <input
              type="text"
              value={formData.totalAmount}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Details</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Order Date *</label>
            <input
              type="date"
              name="orderDate"
              value={formData.orderDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Expected Delivery Date</label>
            <input
              type="date"
              name="expectedDeliveryDate"
              value={formData.expectedDeliveryDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Work Order No.</label>
            <input
              type="text"
              name="workOrder"
              value={formData.workOrder}
              onChange={handleChange}
              placeholder="WO-2025-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Dispatch From *</label>
              <select
                name="dispatchFrom"
                value={formData.dispatchFrom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Plant">Plant</option>
                <option value="CNF">CNF</option>
                <option value="Dealer">Dealer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Order Status</label>
              <select
                name="orderStatus"
                value={formData.orderStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Payment Status</label>
            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Not Started">Not Started</option>
              <option value="Pending">Pending</option>
              <option value="Advance">Advance</option>
              <option value="Partial">Partial</option>
              <option value="Paid">Paid</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
          {(formData.paymentStatus === 'Advance' || formData.paymentStatus === 'Partial') && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="text-xs font-medium text-gray-700 mb-2">Payment Details</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Paid Amount (₹)</label>
                  <input
                    type="number"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleChange}
                    min="0"
                    max={formData.totalAmount}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Pending Amount (₹)</label>
                  <input
                    type="number"
                    name="pendingAmount"
                    value={formData.pendingAmount}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                  />
                </div>
                <div className="text-xs text-gray-600">
                  <p>Total: ₹{parseFloat(formData.totalAmount || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes..."
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Create Order
        </button>
      </div>
    </form>
  );
};

// Mobile Edit Order Form Component
const MobileEditOrderForm = ({ order, onSave, onClose }) => {
  const { customers } = useMarketingSharedData();
  
  const customerData = customers.map(customer => ({
    name: customer.name || 'N/A',
    phone: customer.phone || 'N/A',
    address: customer.address || 'N/A',
    gst: (customer.gstNo && customer.gstNo !== 'N/A') ? customer.gstNo : (customer.gst_no && customer.gst_no !== 'N/A' ? customer.gst_no : 'NA')
  })).filter(customer => customer.name !== 'N/A' && customer.name);

  const [formData, setFormData] = useState({
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress,
    customerGst: order.customerGst,
    productName: order.productName,
    productType: order.productType,
    quantity: order.quantity,
    unitPrice: order.unitPrice,
    totalAmount: order.totalAmount,
    orderDate: order.orderDate || '',
    expectedDeliveryDate: order.expectedDeliveryDate || '',
    deliveredDate: (order.deliveredDate && order.deliveredDate !== 'ND') ? order.deliveredDate : '',
    orderStatus: order.orderStatus,
    dispatchFrom: order.dispatchFrom || 'Plant',
    paymentStatus: order.paymentStatus,
    paidAmount: order.paidAmount || 0,
    pendingAmount: order.pendingAmount || 0,
    workOrder: order.workOrder,
    notes: order.notes
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalizeDateForSubmit = (dateValue) => {
      if (!dateValue || dateValue === '' || dateValue === 'ND') {
        return null;
      }
      return dateValue;
    };

    const updatedOrder = {
      ...order,
      ...formData,
      totalAmount: (formData.quantity * formData.unitPrice).toFixed(2),
      expectedDeliveryDate: normalizeDateForSubmit(formData.expectedDeliveryDate),
      deliveredDate: normalizeDateForSubmit(formData.deliveredDate),
      orderDate: normalizeDateForSubmit(formData.orderDate) || formData.orderDate
    };
    onSave(updatedOrder);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'quantity' || name === 'unitPrice') {
        updated.totalAmount = (updated.quantity * updated.unitPrice).toFixed(2);
      }
      if (name === 'paidAmount') {
        const paidAmount = parseFloat(value) || 0;
        const totalAmount = parseFloat(updated.totalAmount) || 0;
        updated.pendingAmount = Math.max(0, totalAmount - paidAmount);
      }
      return updated;
    });
  };

  const handleCustomerSelect = (e) => {
    const selectedCustomer = customerData.find(customer => customer.name === e.target.value);
    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        customerName: selectedCustomer.name,
        customerPhone: selectedCustomer.phone,
        customerAddress: selectedCustomer.address,
        customerGst: selectedCustomer.gst || 'NA'
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Customer Information */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Customer Information</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Customer Name *</label>
            <select
              name="customerName"
              value={formData.customerName}
              onChange={handleCustomerSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Customer</option>
              {customerData.map((customer, index) => (
                <option key={index} value={customer.name}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Address *</label>
            <textarea
              name="customerAddress"
              value={formData.customerAddress}
              readOnly
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">GST No.</label>
            <input
              type="text"
              name="customerGst"
              value={formData.customerGst || 'NA'}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Product Information</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Product Type *</label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Product Type</option>
              <option value="Cable">Cable</option>
              <option value="Conductor">Conductor</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Product Name *</label>
            <select
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Product</option>
              <option value="Aerial Bunch Cable">Aerial Bunch Cable</option>
              <option value="Aluminium Conductor Galvanized Steel Reinforced">Aluminium Conductor Galvanized Steel Reinforced</option>
              <option value="All Aluminium Alloy Conductor">All Aluminium Alloy Conductor</option>
              <option value="PVC Insulated Submersible Cable">PVC Insulated Submersible Cable</option>
              <option value="Multi Core XLPE Insulated Aluminium Unarmoured Cable">Multi Core XLPE Insulated Aluminium Unarmoured Cable</option>
              <option value="Paper Cover Aluminium Conductor">Paper Cover Aluminium Conductor</option>
              <option value="Single Core PVC Insulated Aluminium/Copper Armoured/Unarmoured Cable">Single Core PVC Insulated Aluminium/Copper Armoured/Unarmoured Cable</option>
              <option value="Single Core XLPE Insulated Aluminium/Copper Armoured/Unarmoured Cable">Single Core XLPE Insulated Aluminium/Copper Armoured/Unarmoured Cable</option>
              <option value="Multi Core PVC Insulated Aluminium Armoured Cable">Multi Core PVC Insulated Aluminium Armoured Cable</option>
              <option value="Multi Core XLPE Insulated Aluminium Armoured Cable">Multi Core XLPE Insulated Aluminium Armoured Cable</option>
              <option value="Multi Core PVC Insulated Aluminium Unarmoured Cable">Multi Core PVC Insulated Aluminium Unarmoured Cable</option>
              <option value="Multistrand Single Core Copper Cable">Multistrand Single Core Copper Cable</option>
              <option value="Multi Core Copper Cable">Multi Core Copper Cable</option>
              <option value="PVC Insulated Single Core Aluminium Cable">PVC Insulated Single Core Aluminium Cable</option>
              <option value="PVC Insulated Multicore Aluminium Cable">PVC Insulated Multicore Aluminium Cable</option>
              <option value="Submersible Winding Wire">Submersible Winding Wire</option>
              <option value="Twin Twisted Copper Wire">Twin Twisted Copper Wire</option>
              <option value="Speaker Cable">Speaker Cable</option>
              <option value="CCTV Cable">CCTV Cable</option>
              <option value="LAN Cable">LAN Cable</option>
              <option value="Automobile Cable">Automobile Cable</option>
              <option value="PV Solar Cable">PV Solar Cable</option>
              <option value="Co Axial Cable">Co Axial Cable</option>
              <option value="Uni-tube Unarmoured Optical Fibre Cable">Uni-tube Unarmoured Optical Fibre Cable</option>
              <option value="Armoured Unarmoured PVC Insulated Copper Control Cable">Armoured Unarmoured PVC Insulated Copper Control Cable</option>
              <option value="Telecom Switch Board Cables">Telecom Switch Board Cables</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price (₹) *</label>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Total Amount (₹)</label>
            <input
              type="text"
              value={formData.totalAmount}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Details</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Order Date *</label>
            <input
              type="date"
              name="orderDate"
              value={formData.orderDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Expected Delivery Date</label>
            <input
              type="date"
              name="expectedDeliveryDate"
              value={formData.expectedDeliveryDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Delivered Date</label>
            <input
              type="date"
              name="deliveredDate"
              value={formData.deliveredDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Work Order No.</label>
            <input
              type="text"
              name="workOrder"
              value={formData.workOrder}
              onChange={handleChange}
              placeholder="WO-2025-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Dispatch From *</label>
              <select
                name="dispatchFrom"
                value={formData.dispatchFrom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Plant">Plant</option>
                <option value="CNF">CNF</option>
                <option value="Dealer">Dealer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Order Status</label>
              <select
                name="orderStatus"
                value={formData.orderStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Payment Status</label>
            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Not Started">Not Started</option>
              <option value="Pending">Pending</option>
              <option value="Advance">Advance</option>
              <option value="Partial">Partial</option>
              <option value="Paid">Paid</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
          {(formData.paymentStatus === 'Advance' || formData.paymentStatus === 'Partial') && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="text-xs font-medium text-gray-700 mb-2">Payment Details</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Paid Amount (₹)</label>
                  <input
                    type="number"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleChange}
                    min="0"
                    max={formData.totalAmount}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Pending Amount (₹)</label>
                  <input
                    type="number"
                    name="pendingAmount"
                    value={formData.pendingAmount}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                  />
                </div>
                <div className="text-xs text-gray-600">
                  <p>Total: ₹{parseFloat(formData.totalAmount || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes..."
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Update Order
        </button>
      </div>
    </form>
  );
};

export default function MobileOrders() {
  const { customers } = useMarketingSharedData();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [filters, setFilters] = useState({
    customerName: '',
    productType: '',
    orderStatus: '',
    paymentStatus: '',
    orderDate: '',
    workOrder: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setLoadingRefresh(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await apiClient.get(API_ENDPOINTS.MARKETING_ORDERS_GET_ALL());
      
      if (response && response.success) {
        const transformedOrders = (response.data || []).map(order => ({
          id: order.id,
          leadNumber: order.lead_number,
          customerName: order.customer_name,
          customerPhone: order.customer_phone || '',
          customerAddress: order.customer_address || '',
          customerGst: order.customer_gst || 'NA',
          productName: order.product_name,
          productType: order.product_type,
          quantity: order.quantity,
          unitPrice: parseFloat(order.unit_price) || 0,
          totalAmount: parseFloat(order.total_amount) || 0,
          orderDate: order.order_date,
          expectedDeliveryDate: order.expected_delivery_date || '',
          deliveredDate: order.delivered_date || order.delivered_date_display || 'ND',
          orderStatus: order.order_status,
          dispatchFrom: order.dispatch_from || 'Plant',
          workOrder: order.work_order || '',
          paymentStatus: order.payment_status,
          paidAmount: parseFloat(order.paid_amount) || 0,
          pendingAmount: parseFloat(order.pending_amount) || 0,
          notes: order.notes || '',
          orderHistory: order.order_history || []
        }));
        setOrders(transformedOrders);
      } else {
        setError(response?.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.data?.message || err.message || 'Failed to fetch orders');
    } finally {
      if (isRefresh) {
        setLoadingRefresh(false);
      } else {
        setLoading(false);
      }
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = searchTerm === '' || 
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm) ||
        order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.workOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.leadNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm);
      
      const matchesFilters = 
        (filters.customerName === '' || order.customerName.toLowerCase().includes(filters.customerName.toLowerCase())) &&
        (filters.productType === '' || order.productType === filters.productType) &&
        (filters.orderStatus === '' || order.orderStatus === filters.orderStatus) &&
        (filters.paymentStatus === '' || order.paymentStatus === filters.paymentStatus) &&
        (filters.orderDate === '' || order.orderDate === filters.orderDate) &&
        (filters.workOrder === '' || order.workOrder.toLowerCase().includes(filters.workOrder.toLowerCase()));
      
      return matchesSearch && matchesFilters;
    });
  }, [orders, searchTerm, filters]);

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'Partial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advance': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Pending': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Not Started': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Refunded': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="h-3 w-3" />;
      case 'Confirmed': return <CheckCircle className="h-3 w-3" />;
      case 'Processing': return <Package className="h-3 w-3" />;
      case 'Shipped': return <Truck className="h-3 w-3" />;
      case 'Delivered': return <CheckCircle className="h-3 w-3" />;
      case 'Cancelled': return <XCircle className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'ND') return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleAddOrder = async (newOrder) => {
    try {
      const currentYear = new Date().getFullYear();
      const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
      const existingLeadNumbers = orders
        .filter(order => order.leadNumber && order.leadNumber.startsWith(`LD-${currentYear}-${currentMonth}`))
        .map(order => {
          const match = order.leadNumber.match(/LD-\d{4}-\d{2}-(\d+)/);
          return match ? parseInt(match[1]) : 0;
        });
      const nextSequence = existingLeadNumbers.length > 0 
        ? Math.max(...existingLeadNumbers) + 1 
        : 1;
      const leadNumber = `LD-${currentYear}-${currentMonth}-${String(nextSequence).padStart(3, '0')}`;

      const normalizeDate = (dateValue) => {
        if (!dateValue || dateValue === '' || dateValue === 'ND' || dateValue === 'null' || dateValue === 'undefined' || (typeof dateValue === 'string' && dateValue.trim() === '')) {
          return null;
        }
        return dateValue;
      };

      const orderData = {
        lead_number: leadNumber,
        customer_name: newOrder.customerName,
        customer_phone: newOrder.customerPhone || null,
        customer_address: newOrder.customerAddress || null,
        customer_gst: newOrder.customerGst === 'NA' ? null : newOrder.customerGst,
        product_name: newOrder.productName,
        product_type: newOrder.productType,
        quantity: parseInt(newOrder.quantity) || 1,
        unit_price: parseFloat(newOrder.unitPrice) || 0,
        total_amount: parseFloat(newOrder.totalAmount) || 0,
        order_date: normalizeDate(newOrder.orderDate) || new Date().toISOString().split('T')[0],
        expected_delivery_date: normalizeDate(newOrder.expectedDeliveryDate) || null,
        delivered_date: normalizeDate(newOrder.deliveredDate) || null,
        order_status: newOrder.orderStatus || 'Pending',
        dispatch_from: newOrder.dispatchFrom || 'Plant',
        work_order: newOrder.workOrder || null,
        payment_status: newOrder.paymentStatus || 'Not Started',
        paid_amount: parseFloat(newOrder.paidAmount) || 0,
        notes: newOrder.notes || null,
        order_history: [{
          date: newOrder.orderDate,
          status: 'Order Placed',
          description: 'Order created by marketing team'
        }]
      };

      const response = await apiClient.post(API_ENDPOINTS.MARKETING_ORDERS_CREATE(), orderData);
      
      if (response && response.success) {
        setShowAddModal(false);
        fetchOrders(true);
      } else {
        setError(response?.message || 'Failed to create order');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.data?.message || err.message || 'Failed to create order');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const clearFilters = () => {
    setFilters({
      customerName: '',
      productType: '',
      orderStatus: '',
      paymentStatus: '',
      orderDate: '',
      workOrder: ''
    });
    setSearchTerm('');
  };

  const hasActiveFilters = Object.values(filters).some(f => f !== '') || searchTerm !== '';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Orders</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your orders</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchOrders(true)}
                disabled={loadingRefresh}
                className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 ${loadingRefresh ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${
              hasActiveFilters
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters</span>
            </div>
            {hasActiveFilters && (
              <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </button>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Customer</label>
                <input
                  type="text"
                  placeholder="Filter by customer"
                  value={filters.customerName}
                  onChange={(e) => setFilters(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Product Type</label>
                <select
                  value={filters.productType}
                  onChange={(e) => setFilters(prev => ({ ...prev, productType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="Cable">Cable</option>
                  <option value="Conductor">Conductor</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Order Status</label>
                <select
                  value={filters.orderStatus}
                  onChange={(e) => setFilters(prev => ({ ...prev, orderStatus: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  value={filters.paymentStatus}
                  onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Payment</option>
                  <option value="Not Started">Not Started</option>
                  <option value="Pending">Pending</option>
                  <option value="Advance">Advance</option>
                  <option value="Partial">Partial</option>
                  <option value="Paid">Paid</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Order Date</label>
                <input
                  type="date"
                  value={filters.orderDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, orderDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Work Order</label>
                <input
                  type="text"
                  placeholder="Filter by work order"
                  value={filters.workOrder}
                  onChange={(e) => setFilters(prev => ({ ...prev, workOrder: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={() => fetchOrders()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium text-sm mb-1">
              {hasActiveFilters ? 'No orders match your filters' : 'No orders yet'}
            </p>
            <p className="text-xs text-gray-500">
              {hasActiveFilters 
                ? 'Try adjusting your search or filter criteria' 
                : 'Create your first order to get started'}
            </p>
          </div>
        ) : (
          <>
            <div className="text-xs text-gray-500 mb-3">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1">
                        {order.customerName}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Hash className="h-3 w-3" />
                        <span>{order.leadNumber}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getOrderStatusColor(order.orderStatus)}`}>
                        {getOrderStatusIcon(order.orderStatus)}
                        <span>{order.orderStatus}</span>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                        <DollarSign className="h-3 w-3" />
                        <span>{order.paymentStatus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="mb-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Package className="h-3 w-3" />
                      <span className="font-medium">{order.productName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Type: {order.productType}</span>
                      <span>•</span>
                      <span>Qty: {order.quantity}</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="mb-3 space-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>Order: {formatDate(order.orderDate)}</span>
                    </div>
                    {order.expectedDeliveryDate && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>Expected: {formatDate(order.expectedDeliveryDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Payment Info */}
                  <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                    {order.paidAmount > 0 && (
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-600">Paid:</span>
                        <span className="text-green-600 font-medium">₹{order.paidAmount.toLocaleString()}</span>
                      </div>
                    )}
                    {order.pendingAmount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Pending:</span>
                        <span className="text-red-600 font-medium">₹{order.pendingAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Work Order */}
                  {order.workOrder && (
                    <div className="mb-3 flex items-center gap-2 text-xs text-gray-600">
                      <FileText className="h-3 w-3" />
                      <span>WO: {order.workOrder}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </button>
                    <button
                      onClick={() => handleEditOrder(order)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Order Modal - Using desktop component wrapped */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end">
          <div className="bg-white w-full max-h-[90vh] rounded-t-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-900">Create New Order</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              {/* Use desktop Orders component's AddOrderModal logic */}
              <MobileAddOrderForm
                onSave={handleAddOrder}
                onClose={() => setShowAddModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Order Modal - Simplified for mobile */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end">
          <div className="bg-white w-full max-h-[90vh] rounded-t-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedOrder(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Customer Information</h3>
                <div className="space-y-1.5 text-xs">
                  <div><strong>Name:</strong> {selectedOrder.customerName}</div>
                  {selectedOrder.customerPhone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                  )}
                  {selectedOrder.customerAddress && (
                    <div className="flex items-start gap-1">
                      <MapPin className="h-3 w-3 mt-0.5" />
                      <span>{selectedOrder.customerAddress}</span>
                    </div>
                  )}
                  {selectedOrder.customerGst && selectedOrder.customerGst !== 'NA' && (
                    <div><strong>GST:</strong> {selectedOrder.customerGst}</div>
                  )}
                </div>
              </div>

              {/* Order Info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Order Information</h3>
                <div className="space-y-1.5 text-xs">
                  <div><strong>Lead Number:</strong> {selectedOrder.leadNumber}</div>
                  <div><strong>Product:</strong> {selectedOrder.productName}</div>
                  <div><strong>Type:</strong> {selectedOrder.productType}</div>
                  <div><strong>Quantity:</strong> {selectedOrder.quantity}</div>
                  <div><strong>Unit Price:</strong> ₹{selectedOrder.unitPrice.toLocaleString()}</div>
                  <div><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount.toLocaleString()}</div>
                  {selectedOrder.workOrder && (
                    <div><strong>Work Order:</strong> {selectedOrder.workOrder}</div>
                  )}
                  <div><strong>Dispatch From:</strong> {selectedOrder.dispatchFrom}</div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Status</h3>
                <div className="flex flex-wrap gap-2">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getOrderStatusColor(selectedOrder.orderStatus)}`}>
                    {getOrderStatusIcon(selectedOrder.orderStatus)}
                    <span>{selectedOrder.orderStatus}</span>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                    <DollarSign className="h-3 w-3" />
                    <span>{selectedOrder.paymentStatus}</span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Dates</h3>
                <div className="space-y-1 text-xs">
                  <div><strong>Order Date:</strong> {formatDate(selectedOrder.orderDate)}</div>
                  {selectedOrder.expectedDeliveryDate && (
                    <div><strong>Expected Delivery:</strong> {formatDate(selectedOrder.expectedDeliveryDate)}</div>
                  )}
                  {selectedOrder.deliveredDate && selectedOrder.deliveredDate !== 'ND' && (
                    <div><strong>Delivered:</strong> {formatDate(selectedOrder.deliveredDate)}</div>
                  )}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid:</span>
                    <span className="text-green-600">₹{selectedOrder.paidAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending:</span>
                    <span className="text-red-600">₹{selectedOrder.pendingAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-xs text-gray-600">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditOrder(selectedOrder);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Edit Order
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedOrder(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal - Will use the desktop component wrapped */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end">
          <div className="bg-white w-full max-h-[90vh] rounded-t-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Edit Order</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedOrder(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <MobileEditOrderForm
                order={selectedOrder}
                onSave={async (updatedOrder) => {
                  try {
                    const normalizeDate = (dateValue) => {
                      if (!dateValue || dateValue === '' || dateValue === 'ND' || dateValue === 'null' || dateValue === 'undefined' || (typeof dateValue === 'string' && dateValue.trim() === '')) {
                        return null;
                      }
                      return dateValue;
                    };

                    const orderData = {
                      lead_number: selectedOrder.leadNumber,
                      customer_name: updatedOrder.customerName,
                      customer_phone: updatedOrder.customerPhone || null,
                      customer_address: updatedOrder.customerAddress || null,
                      customer_gst: updatedOrder.customerGst === 'NA' ? null : updatedOrder.customerGst,
                      product_name: updatedOrder.productName,
                      product_type: updatedOrder.productType,
                      quantity: parseInt(updatedOrder.quantity) || 1,
                      unit_price: parseFloat(updatedOrder.unitPrice) || 0,
                      total_amount: parseFloat(updatedOrder.totalAmount) || 0,
                      order_date: normalizeDate(updatedOrder.orderDate) || selectedOrder.orderDate,
                      expected_delivery_date: normalizeDate(updatedOrder.expectedDeliveryDate) || null,
                      delivered_date: normalizeDate(updatedOrder.deliveredDate) || null,
                      order_status: updatedOrder.orderStatus || selectedOrder.orderStatus,
                      dispatch_from: updatedOrder.dispatchFrom || selectedOrder.dispatchFrom,
                      work_order: updatedOrder.workOrder || null,
                      payment_status: updatedOrder.paymentStatus || selectedOrder.paymentStatus,
                      paid_amount: parseFloat(updatedOrder.paidAmount) || 0,
                      notes: updatedOrder.notes || null
                    };

                    const response = await apiClient.put(API_ENDPOINTS.MARKETING_ORDERS_UPDATE(selectedOrder.id), orderData);
                    
                    if (response && response.success) {
                      setShowEditModal(false);
                      setSelectedOrder(null);
                      fetchOrders(true);
                    } else {
                      setError(response?.message || 'Failed to update order');
                    }
                  } catch (err) {
                    console.error('Error updating order:', err);
                    setError(err.data?.message || err.message || 'Failed to update order');
                  }
                }}
                onClose={() => {
                  setShowEditModal(false);
                  setSelectedOrder(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

