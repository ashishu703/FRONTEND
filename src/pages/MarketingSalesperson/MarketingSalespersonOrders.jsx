import React, { useState, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  User, 
  MapPin, 
  FileText, 
  Package, 
  Calendar, 
  Edit, 
  Plus,
  X,
  Filter,
  Hash,
  Mail,
  Building,
  Tag,
  Upload,
  Eye,
  Save,
  CreditCard,
  Clock,
  Download,
  ShoppingCart,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Phone,
  Loader
} from 'lucide-react';
import { useMarketingSharedData } from './MarketingSharedDataContext';
import { API_ENDPOINTS } from '../../api/admin_api/api';
import apiClient from '../../utils/apiClient';

// Add Order Modal Component
const AddOrderModal = ({ onSave, onClose }) => {
  // Get customers from All Leads section
  const { customers } = useMarketingSharedData();
  
  // Map customers to the format needed for dropdown
  const customerData = customers.map(customer => ({
    name: customer.name || 'N/A',
    phone: customer.phone || 'N/A',
    address: customer.address || 'N/A',
    gst: (customer.gstNo && customer.gstNo !== 'N/A') ? customer.gstNo : (customer.gst_no && customer.gst_no !== 'N/A' ? customer.gst_no : 'NA')
  })).filter(customer => customer.name !== 'N/A' && customer.name); // Filter out invalid customers

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
      // Auto-calculate pending amount when paid amount changes
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New Order</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <select
                name="customerName"
                value={formData.customerName}
                onChange={handleCustomerSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Customer</option>
                {customerData.length > 0 ? (
                  customerData.map((customer, index) => (
                  <option key={index} value={customer.name}>
                    {customer.name} - {customer.phone}
                  </option>
                  ))
                ) : (
                  <option value="" disabled>No customers available</option>
                )}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea
                name="customerAddress"
                value={formData.customerAddress}
                readOnly
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST No.</label>
              <input
                type="text"
                name="customerGst"
                value={formData.customerGst || 'NA'}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            {/* Product Information */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Product Type</option>
                <option value="Cable">Cable</option>
                <option value="Conductor">Conductor</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <select
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Product</option>
                {/* All 26 products from toolbox interface */}
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (₹) *</label>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (₹)</label>
              <input
                type="text"
                value={formData.totalAmount}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                readOnly
              />
            </div>

            {/* Order Details */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Date *</label>
              <input
                type="date"
                name="orderDate"
                value={formData.orderDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery Date</label>
              <input
                type="date"
                name="expectedDeliveryDate"
                value={formData.expectedDeliveryDate && formData.expectedDeliveryDate !== 'ND' ? formData.expectedDeliveryDate : ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivered Date</label>
              <input
                type="date"
                name="deliveredDate"
                value={formData.deliveredDate && formData.deliveredDate !== 'ND' ? formData.deliveredDate : ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Order No.</label>
              <input
                type="text"
                name="workOrder"
                value={formData.workOrder}
                onChange={handleChange}
                placeholder="WO-2025-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dispatch From *</label>
              <select
                name="dispatchFrom"
                value={formData.dispatchFrom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Plant">Plant</option>
                <option value="CNF">CNF</option>
                <option value="Dealer">Dealer</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
              <select
                name="orderStatus"
                value={formData.orderStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Not Started">Not Started</option>
                <option value="Pending">Pending</option>
                <option value="Advance">Advance</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
            
            {/* Payment Amount Fields - Show only for Advance and Partial */}
            {(formData.paymentStatus === 'Advance' || formData.paymentStatus === 'Partial') && (
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount (₹)</label>
                    <input
                      type="number"
                      name="paidAmount"
                      value={formData.paidAmount}
                      onChange={handleChange}
                      min="0"
                      max={formData.totalAmount}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter paid amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pending Amount (₹)</label>
                    <input
                      type="number"
                      name="pendingAmount"
                      value={formData.pendingAmount}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                      placeholder="Auto-calculated"
                    />
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Total Amount: ₹{parseFloat(formData.totalAmount || 0).toLocaleString()}</p>
                  <p>Remaining: ₹{(parseFloat(formData.totalAmount || 0) - parseFloat(formData.paidAmount || 0)).toLocaleString()}</p>
                </div>
              </div>
            )}
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes or requirements..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Order Modal Component
const EditOrderModal = ({ order, onSave, onClose }) => {
  // Get customers from All Leads section
  const { customers } = useMarketingSharedData();
  
  // Map customers to the format needed for dropdown
  const customerData = customers.map(customer => ({
    name: customer.name || 'N/A',
    phone: customer.phone || 'N/A',
    address: customer.address || 'N/A',
    gst: (customer.gstNo && customer.gstNo !== 'N/A') ? customer.gstNo : (customer.gst_no && customer.gst_no !== 'N/A' ? customer.gst_no : 'NA')
  })).filter(customer => customer.name !== 'N/A' && customer.name); // Filter out invalid customers

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
    // Normalize date values before submitting - convert 'ND' and empty strings to null
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
      // Ensure date fields are properly normalized before sending to API
      expectedDeliveryDate: normalizeDateForSubmit(formData.expectedDeliveryDate),
      deliveredDate: normalizeDateForSubmit(formData.deliveredDate),
      orderDate: normalizeDateForSubmit(formData.orderDate) || formData.orderDate // Keep orderDate as-is if valid, default to current value
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
      // Auto-calculate pending amount when paid amount changes
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
        customerGst: selectedCustomer.gst || 'NA' // Show 'NA' if GST is empty
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Order - {order.leadNumber} (ORD-{order.id.toString().padStart(4, '0')})</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <select
                name="customerName"
                value={formData.customerName}
                onChange={handleCustomerSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Customer</option>
                {customerData.length > 0 ? (
                  customerData.map((customer, index) => (
                  <option key={index} value={customer.name}>
                    {customer.name} - {customer.phone}
                  </option>
                  ))
                ) : (
                  <option value="" disabled>No customers available</option>
                )}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                name="customerAddress"
                value={formData.customerAddress}
                readOnly
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST No.</label>
              <input
                type="text"
                name="customerGst"
                value={formData.customerGst || 'NA'}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            {/* Product Information */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Product Type</option>
                <option value="Cable">Cable</option>
                <option value="Conductor">Conductor</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <select
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Product</option>
                {/* All 26 products from toolbox interface */}
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
              <select
                name="orderStatus"
                value={formData.orderStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dispatch From *</label>
              <select
                name="dispatchFrom"
                value={formData.dispatchFrom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Plant">Plant</option>
                <option value="CNF">CNF</option>
                <option value="Dealer">Dealer</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Not Started">Not Started</option>
                <option value="Pending">Pending</option>
                <option value="Advance">Advance</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
            
            {/* Payment Amount Fields - Show only for Advance and Partial */}
            {(formData.paymentStatus === 'Advance' || formData.paymentStatus === 'Partial') && (
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount (₹)</label>
                    <input
                      type="number"
                      name="paidAmount"
                      value={formData.paidAmount}
                      onChange={handleChange}
                      min="0"
                      max={formData.totalAmount}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter paid amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pending Amount (₹)</label>
                    <input
                      type="number"
                      name="pendingAmount"
                      value={formData.pendingAmount}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                      placeholder="Auto-calculated"
                    />
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Total Amount: ₹{parseFloat(formData.totalAmount).toLocaleString()}</p>
                  <p>Remaining: ₹{(parseFloat(formData.totalAmount) - parseFloat(formData.paidAmount)).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    customerName: '',
    productType: '',
    orderStatus: '',
    paymentStatus: '',
    orderDate: '',
    expectedDeliveryDate: '',
    deliveredDate: '',
    workOrder: ''
  });

  const [orders, setOrders] = useState([]);

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(API_ENDPOINTS.MARKETING_ORDERS_GET_ALL());
      
      if (response && response.success) {
        // Transform API response to match frontend format
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
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
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
      (filters.expectedDeliveryDate === '' || order.expectedDeliveryDate === filters.expectedDeliveryDate) &&
      (filters.deliveredDate === '' || order.deliveredDate === filters.deliveredDate) &&
      (filters.workOrder === '' || order.workOrder.toLowerCase().includes(filters.workOrder.toLowerCase()));
    
    return matchesSearch && matchesFilters;
  });

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-purple-100 text-purple-800';
      case 'Shipped': return 'bg-indigo-100 text-indigo-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      case 'Advance': return 'bg-purple-100 text-purple-800';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      case 'Refunded': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'Processing': return <Package className="w-4 h-4" />;
      case 'Shipped': return <Truck className="w-4 h-4" />;
      case 'Delivered': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setActiveTab('Overview');
    setShowViewModal(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const generateLeadNumber = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Find the highest lead number for this year/month
    const existingLeadNumbers = orders
      .filter(order => order.leadNumber && order.leadNumber.startsWith(`LD-${currentYear}-${currentMonth}`))
      .map(order => {
        const match = order.leadNumber.match(/LD-\d{4}-\d{2}-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
    
    const nextSequence = existingLeadNumbers.length > 0 
      ? Math.max(...existingLeadNumbers) + 1 
      : 1;
    
    return `LD-${currentYear}-${currentMonth}-${String(nextSequence).padStart(3, '0')}`;
  };

  const handleAddOrder = async (newOrder) => {
    try {
      const leadNumber = generateLeadNumber();
      
      // Helper function to normalize date values - always returns null for empty/invalid dates
      const normalizeDate = (dateValue) => {
        // Handle null, undefined, empty string, 'ND', or whitespace-only strings
        if (!dateValue || 
            dateValue === '' || 
            dateValue === 'ND' || 
            dateValue === 'null' ||
            dateValue === 'undefined' ||
            (typeof dateValue === 'string' && dateValue.trim() === '')) {
          return null;
        }
        // Return the date value as-is if it's valid
        return dateValue;
      };

      // Prepare order data for API
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
        order_date: normalizeDate(newOrder.orderDate) || new Date().toISOString().split('T')[0], // Default to today if empty
        expected_delivery_date: normalizeDate(newOrder.expectedDeliveryDate) || null,
        delivered_date: normalizeDate(newOrder.deliveredDate) || null,
        order_status: newOrder.orderStatus || 'Pending',
        dispatch_from: newOrder.dispatchFrom || 'Plant',
        work_order: newOrder.workOrder || null,
        payment_status: newOrder.paymentStatus || 'Not Started',
        paid_amount: parseFloat(newOrder.paidAmount) || 0,
        notes: newOrder.notes || null,
        order_history: [
        { 
          date: newOrder.orderDate, 
          status: 'Order Placed', 
          description: 'Order created by marketing team' 
        }
      ]
    };

      const response = await apiClient.post(API_ENDPOINTS.MARKETING_ORDERS_CREATE(), orderData);
      
      if (response && response.success) {
        // Transform API response to match frontend format
        const savedOrder = {
          id: response.data.id,
          leadNumber: response.data.lead_number,
          customerName: response.data.customer_name,
          customerPhone: response.data.customer_phone || '',
          customerAddress: response.data.customer_address || '',
          customerGst: response.data.customer_gst || 'NA',
          productName: response.data.product_name,
          productType: response.data.product_type,
          quantity: response.data.quantity,
          unitPrice: parseFloat(response.data.unit_price) || 0,
          totalAmount: parseFloat(response.data.total_amount) || 0,
          orderDate: response.data.order_date,
          expectedDeliveryDate: response.data.expected_delivery_date || '',
          deliveredDate: response.data.delivered_date || 'ND',
          orderStatus: response.data.order_status,
          dispatchFrom: response.data.dispatch_from || 'Plant',
          workOrder: response.data.work_order || '',
          paymentStatus: response.data.payment_status,
          paidAmount: parseFloat(response.data.paid_amount) || 0,
          pendingAmount: parseFloat(response.data.pending_amount) || 0,
          notes: response.data.notes || '',
          orderHistory: response.data.order_history || []
        };
        setOrders([...orders, savedOrder]);
    setShowAddModal(false);
      } else {
        setError(response?.message || 'Failed to create order');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.data?.message || err.message || 'Failed to create order');
    }
  };

  const handleSaveOrder = async (updatedOrder) => {
    try {
      // Helper function to normalize date values - always returns null for empty/invalid dates
      const normalizeDate = (dateValue) => {
        // Handle all possible empty/invalid date values (explicit checks first)
        if (dateValue === null || 
            dateValue === undefined || 
            dateValue === '' || 
            dateValue === 'ND' || 
            dateValue === 'null' ||
            dateValue === 'undefined' ||
            (typeof dateValue === 'string' && dateValue.trim() === '')) {
          return null;
        }
        // Return the date value as-is if it's valid
        return dateValue;
      };

      // Prepare update data for API - ensure all date fields are properly normalized
      // Only include fields that have values (don't send empty strings)
      const updateData = {};
      
      // Always include required fields
      updateData.customer_name = updatedOrder.customerName;
      updateData.customer_phone = updatedOrder.customerPhone || null;
      updateData.customer_address = updatedOrder.customerAddress || null;
      updateData.customer_gst = updatedOrder.customerGst === 'NA' ? null : updatedOrder.customerGst;
      updateData.product_name = updatedOrder.productName;
      updateData.product_type = updatedOrder.productType;
      updateData.quantity = parseInt(updatedOrder.quantity) || 1;
      updateData.unit_price = parseFloat(updatedOrder.unitPrice) || 0;
      updateData.total_amount = parseFloat(updatedOrder.totalAmount) || 0;
      
      // Normalize and set date fields - only set if not null
      const normalizedOrderDate = normalizeDate(updatedOrder.orderDate);
      updateData.order_date = normalizedOrderDate || new Date().toISOString().split('T')[0]; // Default to today if empty
      
      const normalizedExpectedDate = normalizeDate(updatedOrder.expectedDeliveryDate);
      if (normalizedExpectedDate !== null) {
        updateData.expected_delivery_date = normalizedExpectedDate;
      } else {
        updateData.expected_delivery_date = null; // Explicitly set to null
      }
      
      const normalizedDeliveredDate = normalizeDate(updatedOrder.deliveredDate);
      if (normalizedDeliveredDate !== null) {
        updateData.delivered_date = normalizedDeliveredDate;
      } else {
        updateData.delivered_date = null; // Explicitly set to null
      }
      
      updateData.order_status = updatedOrder.orderStatus;
      updateData.dispatch_from = updatedOrder.dispatchFrom || 'Plant';
      updateData.work_order = updatedOrder.workOrder || null;
      updateData.payment_status = updatedOrder.paymentStatus;
      updateData.paid_amount = parseFloat(updatedOrder.paidAmount) || 0;
      updateData.notes = updatedOrder.notes || null;

      const response = await apiClient.put(API_ENDPOINTS.MARKETING_ORDER_UPDATE(updatedOrder.id), updateData);
      
      if (response && response.success) {
        // Transform API response to match frontend format
        const savedOrder = {
          id: response.data.id,
          leadNumber: response.data.lead_number,
          customerName: response.data.customer_name,
          customerPhone: response.data.customer_phone || '',
          customerAddress: response.data.customer_address || '',
          customerGst: response.data.customer_gst || 'NA',
          productName: response.data.product_name,
          productType: response.data.product_type,
          quantity: response.data.quantity,
          unitPrice: parseFloat(response.data.unit_price) || 0,
          totalAmount: parseFloat(response.data.total_amount) || 0,
          orderDate: response.data.order_date,
          expectedDeliveryDate: response.data.expected_delivery_date || '',
          deliveredDate: response.data.delivered_date || response.data.delivered_date_display || 'ND',
          orderStatus: response.data.order_status,
          dispatchFrom: response.data.dispatch_from || 'Plant',
          workOrder: response.data.work_order || '',
          paymentStatus: response.data.payment_status,
          paidAmount: parseFloat(response.data.paid_amount) || 0,
          pendingAmount: parseFloat(response.data.pending_amount) || 0,
          notes: response.data.notes || '',
          orderHistory: response.data.order_history || []
        };
        setOrders(orders.map(order => 
          order.id === updatedOrder.id ? savedOrder : order
        ));
        setShowEditModal(false);
        setSelectedOrder(null);
      } else {
        setError(response?.message || 'Failed to update order');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      setError(err.data?.message || err.message || 'Failed to update order');
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen pb-16 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-16">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      
      {/* Top Section - Search and Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders by customer, product, or lead number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 ml-6">
            {/* Add Order Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Order
            </button>
            
            {/* Filter Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <Filter className="w-5 h-5 text-purple-600" />
            </button>


            {/* Refresh Button */}
            <button 
              onClick={fetchOrders}
              disabled={loading}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>


      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {/* Filter Row */}
              {showFilters && (
                <tr className="bg-blue-50">
                  <th className="px-6 py-2"></th>
                  <th className="px-6 py-2">
                    <input
                      type="text"
                      placeholder="Filter customer"
                      value={filters.customerName}
                      onChange={(e) => setFilters({...filters, customerName: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-2"></th>
                  <th className="px-6 py-2">
                    <select
                      value={filters.productType}
                      onChange={(e) => setFilters({...filters, productType: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="Industrial Equipment">Industrial Equipment</option>
                      <option value="Commercial Lighting">Commercial Lighting</option>
                      <option value="Power Solutions">Power Solutions</option>
                      <option value="Electrical Components">Electrical Components</option>
                    </select>
                  </th>
                  <th className="px-6 py-2"></th>
                  <th className="px-6 py-2">
                    <input
                      type="date"
                      value={filters.orderDate}
                      onChange={(e) => setFilters({...filters, orderDate: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-2">
                    <input
                      type="text"
                      placeholder="Filter work order"
                      value={filters.workOrder || ''}
                      onChange={(e) => setFilters({...filters, workOrder: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-2">
                    <select
                      value={filters.orderStatus}
                      onChange={(e) => setFilters({...filters, orderStatus: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </th>
                  <th className="px-6 py-2">
                    <select
                      value={filters.paymentStatus}
                      onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">All Payment</option>
                      <option value="Not Started">Not Started</option>
                      <option value="Pending">Pending</option>
                      <option value="Advance">Advance</option>
                      <option value="Partial">Partial</option>
                      <option value="Paid">Paid</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </th>
                  <th className="px-6 py-2"></th>
                </tr>
              )}
              
              {/* Header Row */}
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-purple-600" />
                    <span>LEAD NUMBER</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>CUSTOMER</span>
                  </div>
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-purple-600" />
                    <span>PRODUCT</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span>AMOUNT</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>ORDER DATE</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>WORK ORDER</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-600" />
                    <span>DISPATCH FROM</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-indigo-600" />
                    <span>ORDER STATUS</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-green-600" />
                    <span>PAYMENT</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span>EXPECTED DELIVERY</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>DELIVERED DATE</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Edit className="w-4 h-4 text-gray-600" />
                    <span>ACTION</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.leadNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{order.customerAddress}</div>
                        <div className="text-sm text-gray-700 mt-1 flex items-center"><Phone className="w-3 h-3 mr-1 text-green-600" />{order.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.productName}</div>
                        <div className="text-sm text-gray-500">{order.productType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">₹{order.totalAmount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Qty: {order.quantity}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.orderDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {order.workOrder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.dispatchFrom || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center space-x-1 ${getOrderStatusColor(order.orderStatus)}`}>
                        {getOrderStatusIcon(order.orderStatus)}
                        <span>{order.orderStatus}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.expectedDeliveryDate || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.deliveredDate || 'ND'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewOrder(order)}
                          className="w-8 h-8 rounded-full border-2 border-blue-500 bg-white hover:bg-blue-50 transition-colors flex items-center justify-center"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                        <button 
                          onClick={() => handleEditOrder(order)}
                          className="w-8 h-8 rounded-full border-2 border-orange-500 bg-white hover:bg-orange-50 transition-colors flex items-center justify-center"
                          title="Edit Order"
                        >
                          <Edit className="w-4 h-4 text-orange-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <ShoppingCart className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">No orders available</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Order Details Modal */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 flex flex-col" style={{ height: '700px' }}>
            <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">Order Details - {selectedOrder.leadNumber} (ORD-{selectedOrder.id.toString().padStart(4, '0')})</h2>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 flex-shrink-0">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('Overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'Overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('Order History')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'Order History'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Order History
                </button>
                <button
                  onClick={() => setActiveTab('Payment Details')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'Payment Details'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Payment Details
                </button>
              </nav>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1" style={{ minHeight: 0 }}>
              {/* Overview Tab */}
              {activeTab === 'Overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-gray-900 mt-1">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-gray-900 mt-1">{selectedOrder.customerAddress}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900 mt-1">{selectedOrder.customerPhone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">GST No.</label>
                      <p className="text-gray-900 mt-1">{selectedOrder.customerGst}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Order Information</h3>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Product Name</label>
                      <p className="text-gray-900 mt-1">{selectedOrder.productName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Product Type</label>
                      <p className="text-gray-900 mt-1">{selectedOrder.productType}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Quantity</label>
                        <p className="text-gray-900 mt-1">{selectedOrder.quantity}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Unit Price</label>
                        <p className="text-gray-900 mt-1">₹{selectedOrder.unitPrice.toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Amount</label>
                      <p className="text-xl font-bold text-gray-900 mt-1">₹{selectedOrder.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Order ID</label>
                      <p className="text-gray-900 mt-1 font-medium">ORD-{selectedOrder.id.toString().padStart(4, '0')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Dispatch From</label>
                      <p className="text-gray-900 mt-1">{selectedOrder.dispatchFrom || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Work Order No.</label>
                      <p className="text-gray-900 mt-1 font-medium">{selectedOrder.workOrder}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Expected Delivery Date</label>
                      <p className="text-gray-900 mt-1">{selectedOrder.expectedDeliveryDate || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Delivered Date</label>
                      <p className="text-gray-900 mt-1">{selectedOrder.deliveredDate || 'ND'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Order Status</label>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(selectedOrder.orderStatus)}`}>
                          {selectedOrder.orderStatus}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Payment Status</label>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order History Tab */}
              {activeTab === 'Order History' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Timeline</h3>
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {selectedOrder.orderHistory.map((event, eventIdx) => (
                        <li key={eventIdx}>
                          <div className="relative pb-8">
                            {eventIdx !== selectedOrder.orderHistory.length - 1 ? (
                              <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white">
                                  {getOrderStatusIcon(event.status)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div>
                                  <div className="text-sm">
                                    <span className="font-medium text-gray-900">{event.status}</span>
                                  </div>
                                  <p className="mt-0.5 text-sm text-gray-500">{event.date}</p>
                                </div>
                                <div className="mt-2 text-sm text-gray-700">
                                  <p>{event.description}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Payment Details Tab */}
              {activeTab === 'Payment Details' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Payment Summary</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-xl font-semibold text-gray-900">₹{selectedOrder.totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Paid Amount</p>
                      <p className="text-xl font-semibold text-gray-900">₹{selectedOrder.paidAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Pending Amount</p>
                      <p className="text-xl font-semibold text-gray-900">₹{selectedOrder.pendingAmount.toLocaleString()}</p>
                    </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && selectedOrder && (
        <EditOrderModal 
          order={selectedOrder} 
          onSave={handleSaveOrder}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Add Order Modal */}
      {showAddModal && (
        <AddOrderModal 
          onSave={handleAddOrder}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default Orders;
