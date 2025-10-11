import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Package,
  DollarSign,
  Hash,
  Eye,
  Download
} from 'lucide-react';

const MobileMarketingSalespersonOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: 'ORD-2025-001',
      customerName: 'Rajesh Kumar',
      customerPhone: '+91 98765 43210',
      customerEmail: 'rajesh@example.com',
      address: '123 Main Street, Mumbai',
      area: 'Andheri',
      orderDate: '2025-01-15',
      deliveryDate: '2025-01-25',
      status: 'Confirmed',
      paymentStatus: 'Pending',
      totalAmount: 50000,
      items: [
        { name: 'Industrial Motor 5HP', quantity: 2, rate: 25000, amount: 50000 }
      ],
      notes: 'Urgent delivery required',
      priority: 'High'
    },
    {
      id: 2,
      orderNumber: 'ORD-2025-002',
      customerName: 'Priya Sharma',
      customerPhone: '+91 87654 32109',
      customerEmail: 'priya@example.com',
      address: '456 Park Avenue, Delhi',
      area: 'Connaught Place',
      orderDate: '2025-01-14',
      deliveryDate: '2025-01-24',
      status: 'Delivered',
      paymentStatus: 'Paid',
      totalAmount: 175000,
      items: [
        { name: 'LED Street Light 100W', quantity: 10, rate: 17500, amount: 175000 }
      ],
      notes: 'Installation completed',
      priority: 'Medium'
    },
    {
      id: 3,
      orderNumber: 'ORD-2025-003',
      customerName: 'Amit Patel',
      customerPhone: '+91 76543 21098',
      customerEmail: 'amit@example.com',
      address: '789 Business District, Bangalore',
      area: 'Electronic City',
      orderDate: '2025-01-13',
      deliveryDate: '2025-01-23',
      status: 'Processing',
      paymentStatus: 'Partial',
      totalAmount: 85000,
      items: [
        { name: 'Power Distribution Panel', quantity: 1, rate: 85000, amount: 85000 }
      ],
      notes: 'Awaiting final approval',
      priority: 'Low'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Partial': return 'bg-blue-100 text-blue-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerPhone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus;
    const matchesPaymentStatus = filterPaymentStatus === 'all' || order.paymentStatus.toLowerCase() === filterPaymentStatus;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handlePaymentStatusChange = (orderId, newPaymentStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, paymentStatus: newPaymentStatus } : order
    ));
  };

  const handleDeleteOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Mobile Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Orders</h1>
        
        {/* Mobile Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Order</span>
            </button>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  value={filterPaymentStatus}
                  onChange={(e) => setFilterPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Payment Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Order Header */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-600">{order.customerName}</p>
                  <p className="text-xs text-gray-500">{order.customerPhone}</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{order.orderDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-3 h-3" />
                  <span>₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{order.items.length} item(s)</span>
                <button
                  onClick={() => toggleOrderExpansion(order.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {expandedOrder === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Expanded Order Details */}
            {expandedOrder === order.id && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="space-y-3 mt-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Customer:</span>
                      <p className="text-gray-900">{order.customerName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="text-gray-900">{order.customerPhone}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="text-gray-900">{order.customerEmail}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Area:</span>
                      <p className="text-gray-900">{order.area}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Order Date:</span>
                      <p className="text-gray-900">{order.orderDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Delivery Date:</span>
                      <p className="text-gray-900">{order.deliveryDate}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Address:</span>
                      <p className="text-gray-900">{order.address}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Notes:</span>
                      <p className="text-gray-900">{order.notes}</p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-600">Qty: {item.quantity} × ₹{item.rate}</p>
                            </div>
                            <p className="font-medium text-gray-900">₹{item.amount.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-3">
                    <button
                      onClick={() => setEditingOrder(order)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {/* View order details */}}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => {/* Download order */}}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Order Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Add New Order</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-center py-8">Add Order Form - Implementation needed</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Edit Order</h2>
              <button 
                onClick={() => setEditingOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-center py-8">Edit Order Form - Implementation needed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMarketingSalespersonOrders;
