import React, { useState } from 'react';
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
  Phone
} from 'lucide-react';

// Add Order Modal Component
const AddOrderModal = ({ onSave, onClose }) => {
  // Sample customer data from visits/leads
  const customerData = [
    { name: 'Rajesh Kumar', phone: '+91 98765 43210', address: '123 MG Road, Indore, MP', gst: '23ABCDE1234F1Z5' },
    { name: 'Priya Sharma', phone: '+91 87654 32109', address: '456 Business Park, Bhopal, MP', gst: '23FGHIJ5678K2L6' },
    { name: 'Amit Patel', phone: '+91 76543 21098', address: '789 Industrial Area, Jabalpur, MP', gst: '23KLMNO9012P3M7' },
    { name: 'Sneha Gupta', phone: '+91 65432 10987', address: '321 Tech Hub, Gwalior, MP', gst: '23PQRST3456U4V8' },
    { name: 'Vikram Singh', phone: '+91 54321 09876', address: '654 Corporate Plaza, Ujjain, MP', gst: '23WXYZ7890A5B9' },
    { name: 'Anita Verma', phone: '+91 43210 98765', address: '987 Commercial Complex, Sagar, MP', gst: '23DEFGH1234I5J6' },
    { name: 'Rohit Agarwal', phone: '+91 32109 87654', address: '147 Industrial Zone, Dewas, MP', gst: '23KLMNOP7890Q1R2' },
    { name: 'Meera Joshi', phone: '+91 21098 76543', address: '258 Business Center, Ratlam, MP', gst: '23STUVWX4567Y8Z9' }
  ];

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
                <option value="">Select Customer from Visits</option>
                {customerData.map((customer, index) => (
                  <option key={index} value={customer.name}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
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
                value={formData.customerGst}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            {/* Product Information */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
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
                {formData.productType === 'Industrial Equipment' && (
                  <>
                    <option value="Industrial Motor 5HP">Industrial Motor 5HP</option>
                    <option value="Industrial Motor 10HP">Industrial Motor 10HP</option>
                    <option value="Industrial Motor 15HP">Industrial Motor 15HP</option>
                    <option value="Industrial Motor 20HP">Industrial Motor 20HP</option>
                    <option value="Industrial Motor 25HP">Industrial Motor 25HP</option>
                  </>
                )}
                {formData.productType === 'LED Lighting' && (
                  <>
                    <option value="Office LED Panels">Office LED Panels</option>
                    <option value="Street LED Lights">Street LED Lights</option>
                    <option value="Industrial LED Lights">Industrial LED Lights</option>
                    <option value="Commercial LED Strips">Commercial LED Strips</option>
                    <option value="Emergency LED Lights">Emergency LED Lights</option>
                  </>
                )}
                {formData.productType === 'Control Systems' && (
                  <>
                    <option value="Electrical Control Cabinet">Electrical Control Cabinet</option>
                    <option value="PLC Control Panel">PLC Control Panel</option>
                    <option value="Motor Control Center">Motor Control Center</option>
                    <option value="Distribution Panel">Distribution Panel</option>
                    <option value="Control Panel Enclosure">Control Panel Enclosure</option>
                  </>
                )}
                {formData.productType === 'Power Panels' && (
                  <>
                    <option value="Main Distribution Board">Main Distribution Board</option>
                    <option value="Sub Distribution Board">Sub Distribution Board</option>
                    <option value="Power Factor Panel">Power Factor Panel</option>
                    <option value="ATS Panel">ATS Panel</option>
                    <option value="Capacitor Bank Panel">Capacitor Bank Panel</option>
                  </>
                )}
                {formData.productType === 'Automation' && (
                  <>
                    <option value="SCADA System">SCADA System</option>
                    <option value="HMI Panel">HMI Panel</option>
                    <option value="VFD Drive">VFD Drive</option>
                    <option value="Sensors & Actuators">Sensors & Actuators</option>
                    <option value="PLC Programming">PLC Programming</option>
                  </>
                )}
                {formData.productType === 'Electrical Components' && (
                  <>
                    <option value="Circuit Breakers">Circuit Breakers</option>
                    <option value="Contactors & Relays">Contactors & Relays</option>
                    <option value="Cables & Wires">Cables & Wires</option>
                    <option value="Switches & Sockets">Switches & Sockets</option>
                    <option value="Fuses & MCBs">Fuses & MCBs</option>
                  </>
                )}
                {formData.productType === 'Safety Equipment' && (
                  <>
                    <option value="Fire Alarm System">Fire Alarm System</option>
                    <option value="Emergency Lighting">Emergency Lighting</option>
                    <option value="Safety Switches">Safety Switches</option>
                    <option value="Ground Fault Protection">Ground Fault Protection</option>
                    <option value="Safety Relays">Safety Relays</option>
                  </>
                )}
              </select>
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
                <option value="Industrial Equipment">Industrial Equipment</option>
                <option value="LED Lighting">LED Lighting</option>
                <option value="Control Systems">Control Systems</option>
                <option value="Power Panels">Power Panels</option>
                <option value="Automation">Automation</option>
                <option value="Electrical Components">Electrical Components</option>
                <option value="Safety Equipment">Safety Equipment</option>
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
                value={formData.expectedDeliveryDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivered Date</label>
              <input
                type="date"
                name="deliveredDate"
                value={formData.deliveredDate}
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
  // Sample customer data from visits/leads
  const customerData = [
    { name: 'Rajesh Kumar', phone: '+91 98765 43210', address: '123 MG Road, Indore, MP', gst: '23ABCDE1234F1Z5' },
    { name: 'Priya Sharma', phone: '+91 87654 32109', address: '456 Business Park, Bhopal, MP', gst: '23FGHIJ5678K2L6' },
    { name: 'Amit Patel', phone: '+91 76543 21098', address: '789 Industrial Area, Jabalpur, MP', gst: '23KLMNO9012P3M7' },
    { name: 'Sneha Gupta', phone: '+91 65432 10987', address: '321 Tech Hub, Gwalior, MP', gst: '23PQRST3456U4V8' },
    { name: 'Vikram Singh', phone: '+91 54321 09876', address: '654 Corporate Plaza, Ujjain, MP', gst: '23WXYZ7890A5B9' },
    { name: 'Anita Verma', phone: '+91 43210 98765', address: '987 Commercial Complex, Sagar, MP', gst: '23DEFGH1234I5J6' },
    { name: 'Rohit Agarwal', phone: '+91 32109 87654', address: '147 Industrial Zone, Dewas, MP', gst: '23KLMNOP7890Q1R2' },
    { name: 'Meera Joshi', phone: '+91 21098 76543', address: '258 Business Center, Ratlam, MP', gst: '23STUVWX4567Y8Z9' }
  ];

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
    orderDate: order.orderDate,
    expectedDeliveryDate: order.expectedDeliveryDate,
    deliveredDate: order.deliveredDate,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    paidAmount: order.paidAmount || 0,
    pendingAmount: order.pendingAmount || 0,
    workOrder: order.workOrder,
    notes: order.notes
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedOrder = {
      ...order,
      ...formData,
      totalAmount: (formData.quantity * formData.unitPrice).toFixed(2)
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
        customerGst: selectedCustomer.gst
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Order - ORD-{order.id.toString().padStart(4, '0')}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Similar form fields as AddOrderModal but with edit functionality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <select
                name="customerName"
                value={formData.customerName}
                onChange={handleCustomerSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Customer from Visits</option>
                {customerData.map((customer, index) => (
                  <option key={index} value={customer.name}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
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
                value={formData.customerGst}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
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

  const [orders, setOrders] = useState([
    {
      id: 1,
      customerName: 'Rajesh Kumar',
      customerPhone: '+91 98765 43210',
      customerAddress: '123 MG Road, Indore, MP',
      customerGst: '23ABCDE1234F1Z5',
      productName: 'Industrial Motor 5HP',
      productType: 'Industrial Equipment',
      quantity: 2,
      unitPrice: 25000,
      totalAmount: 50000,
      orderDate: '2025-01-15',
      expectedDeliveryDate: '2025-01-25',
      deliveredDate: '',
      orderStatus: 'Confirmed',
      paymentStatus: 'Advance',
      paidAmount: 20000,
      pendingAmount: 30000,
      workOrder: 'WO-2025-001',
      notes: 'Urgent delivery required',
      orderHistory: [
        { date: '2025-01-15', status: 'Order Placed', description: 'Order created by marketing team' },
        { date: '2025-01-16', status: 'Confirmed', description: 'Order confirmed by sales team' },
        { date: '2025-01-17', status: 'Advance Payment', description: 'Advance payment of ₹25,000 received' }
      ]
    },
    {
      id: 2,
      customerName: 'Priya Sharma',
      customerPhone: '+91 87654 32109',
      customerAddress: '456 Business Park, Bhopal, MP',
      customerGst: '23FGHIJ5678K2L6',
      productName: 'LED Street Light 100W',
      productType: 'Commercial Lighting',
      quantity: 50,
      unitPrice: 3500,
      totalAmount: 175000,
      orderDate: '2025-01-14',
      expectedDeliveryDate: '2025-01-30',
      deliveredDate: '2025-01-28',
      orderStatus: 'Confirmed',
      paymentStatus: 'Paid',
      paidAmount: 175000,
      pendingAmount: 0,
      workOrder: 'WO-2025-002',
      notes: 'Installation support required',
      orderHistory: [
        { date: '2025-01-14', status: 'Order Placed', description: 'Bulk order for street lighting project' },
        { date: '2025-01-15', status: 'Payment Received', description: 'Full payment of ₹1,75,000 received' },
        { date: '2025-01-16', status: 'Confirmed', description: 'Order confirmed and processing started' }
      ]
    },
    {
      id: 3,
      customerName: 'Amit Patel',
      customerPhone: '+91 76543 21098',
      customerAddress: '789 Industrial Area, Jabalpur, MP',
      customerGst: '23KLMNO9012P3M7',
      productName: 'Power Distribution Panel',
      productType: 'Power Solutions',
      quantity: 1,
      unitPrice: 85000,
      totalAmount: 85000,
      orderDate: '2025-01-13',
      expectedDeliveryDate: '2025-01-28',
      deliveredDate: '',
      orderStatus: 'Confirmed',
      paymentStatus: 'Advance',
      paidAmount: 42500,
      pendingAmount: 42500,
      workOrder: 'WO-2025-003',
      notes: 'Custom specifications provided',
      orderHistory: [
        { date: '2025-01-13', status: 'Order Placed', description: 'Custom power panel order' },
        { date: '2025-01-14', status: 'Advance Payment', description: 'Advance payment of ₹42,500 received' },
        { date: '2025-01-15', status: 'Confirmed', description: 'Order confirmed and production started' }
      ]
    },
    {
      id: 4,
      customerName: 'Sneha Gupta',
      customerPhone: '+91 65432 10987',
      customerAddress: '321 Tech Hub, Gwalior, MP',
      customerGst: '23PQRST3456U4V8',
      productName: 'Electrical Control Cabinet',
      productType: 'Industrial Equipment',
      quantity: 3,
      unitPrice: 45000,
      totalAmount: 135000,
      orderDate: '2025-01-12',
      expectedDeliveryDate: '2025-01-22',
      deliveredDate: '2025-01-20',
      orderStatus: 'Confirmed',
      paymentStatus: 'Partial',
      paidAmount: 67500,
      pendingAmount: 67500,
      workOrder: 'WO-2025-004',
      notes: 'Installation support required',
      orderHistory: [
        { date: '2025-01-12', status: 'Order Placed', description: 'Control cabinet order for automation project' },
        { date: '2025-01-13', status: 'Partial Payment', description: 'Partial payment of ₹67,500 received' },
        { date: '2025-01-14', status: 'Confirmed', description: 'Order confirmed and manufacturing started' }
      ]
    },
    {
      id: 5,
      customerName: 'Vikram Singh',
      customerPhone: '+91 54321 09876',
      customerAddress: '654 Corporate Plaza, Ujjain, MP',
      customerGst: '23WXYZ7890A5B9',
      productName: 'Office LED Panels',
      productType: 'Commercial Lighting',
      quantity: 25,
      unitPrice: 2500,
      totalAmount: 62500,
      orderDate: '2025-01-10',
      expectedDeliveryDate: '2025-01-20',
      deliveredDate: '',
      orderStatus: 'Confirmed',
      paymentStatus: 'Pending',
      paidAmount: 0,
      pendingAmount: 62500,
      workOrder: 'WO-2025-005',
      notes: 'Awaiting payment confirmation',
      orderHistory: [
        { date: '2025-01-10', status: 'Order Placed', description: 'Office lighting upgrade order' },
        { date: '2025-01-11', status: 'Confirmed', description: 'Order confirmed, awaiting payment' },
        { date: '2025-01-12', status: 'Payment Pending', description: 'Awaiting customer payment confirmation' }
      ]
    }
  ]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.workOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleSaveOrder = (updatedOrder) => {
    setOrders(orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
    setShowEditModal(false);
    setSelectedOrder(null);
  };

  const handleAddOrder = (newOrder) => {
    const orderWithId = {
      ...newOrder,
      id: Math.max(...orders.map(o => o.id)) + 1,
      orderHistory: [
        { 
          date: newOrder.orderDate, 
          status: 'Order Placed', 
          description: 'Order created by marketing team' 
        }
      ]
    };
    setOrders([...orders, orderWithId]);
    setShowAddModal(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-16">
      {/* Top Section - Search and Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders by customer, product, or order ID"
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
            <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
              <RefreshCw className="w-5 h-5 text-gray-600" />
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
                    <span>ORDER ID</span>
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
                    <Phone className="w-4 h-4 text-green-600" />
                    <span>PHONE</span>
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
                      ORD-{order.id.toString().padStart(4, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{order.customerAddress}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customerPhone}
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
                      {order.deliveredDate || '-'}
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
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Order Details - ORD-{selectedOrder.id.toString().padStart(4, '0')}</h2>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
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
            
            <div className="p-6">
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
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900 mt-1">{selectedOrder.customerPhone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-gray-900 mt-1">{selectedOrder.customerAddress}</p>
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
                      <label className="text-sm font-medium text-gray-500">Work Order No.</label>
                      <p className="text-gray-900 mt-1 font-medium">{selectedOrder.workOrder}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Expected Delivery Date</label>
                      <p className="text-gray-900 mt-1">{selectedOrder.expectedDeliveryDate || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Delivered Date</label>
                      <p className="text-gray-900 mt-1">{selectedOrder.deliveredDate || 'Not delivered'}</p>
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
