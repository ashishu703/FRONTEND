import React, { useState, useEffect, useMemo } from 'react';
import { 
  IndianRupee, AlertCircle, CheckCircle, Clock, Loader, Search,
  Phone, Calendar, Package, RefreshCw, DollarSign, User, Hash, X
} from 'lucide-react';
import { API_ENDPOINTS } from '../../../api/admin_api/api';
import apiClient from '../../../utils/apiClient';

const MobilePaymentStatusView = ({ type }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [type]);

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
          orderHistory: order.order_history || [],
          salesPersonEmail: order.created_by || ''
        }));

        // Filter orders based on payment status type
        let filteredOrders = [];
        if (type === 'due') {
          filteredOrders = transformedOrders.filter(order => 
            order.paymentStatus === 'Pending' || 
            order.paymentStatus === 'Partial' || 
            order.paymentStatus === 'Advance'
          );
        } else if (type === 'advance') {
          filteredOrders = transformedOrders.filter(order => 
            order.paymentStatus === 'Advance'
          );
        } else if (type === 'completed') {
          filteredOrders = transformedOrders.filter(order => 
            order.paymentStatus === 'Paid' || order.paymentStatus === 'Completed'
          );
        }

        setOrders(filteredOrders);
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

  const getTitle = () => {
    switch (type) {
      case 'due':
        return 'Due Payments';
      case 'advance':
        return 'Advance Payments';
      case 'completed':
        return 'Completed Payments';
      default:
        return 'Payment Status';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'due':
        return 'Orders with pending, partial, or advance payments';
      case 'advance':
        return 'Orders with advance payments';
      case 'completed':
        return 'Orders with completed payments';
      default:
        return 'View payment status';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'due':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'advance':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <IndianRupee className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'Partial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advance': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Pending': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Not Started': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const searchLower = searchTerm.toLowerCase();
    return orders.filter(order => 
      order.customerName.toLowerCase().includes(searchLower) ||
      order.customerPhone.includes(searchTerm) ||
      order.leadNumber.toLowerCase().includes(searchLower) ||
      order.productName.toLowerCase().includes(searchLower) ||
      (order.salesPersonEmail && order.salesPersonEmail.toLowerCase().includes(searchLower))
    );
  }, [orders, searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const summary = useMemo(() => {
    return {
      totalOrders: filteredOrders.length,
      totalAmount: filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      totalPaid: filteredOrders.reduce((sum, order) => sum + order.paidAmount, 0),
      totalPending: filteredOrders.reduce((sum, order) => sum + order.pendingAmount, 0)
    };
  }, [filteredOrders]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getIcon()}
              <div>
                <h1 className="text-lg font-bold text-gray-900">{getTitle()}</h1>
                <p className="text-xs text-gray-500 mt-0.5">{getDescription()}</p>
              </div>
            </div>
            <button
              onClick={() => fetchOrders(true)}
              disabled={loadingRefresh}
              className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${loadingRefresh ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer, phone, lead number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {!loading && filteredOrders.length > 0 && (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Total Orders</div>
              <div className="text-lg font-bold text-gray-900">{summary.totalOrders}</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Total Amount</div>
              <div className="text-lg font-bold text-gray-900">
                ₹{(summary.totalAmount / 1000).toFixed(1)}K
              </div>
            </div>
            {type === 'due' && (
              <>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Total Paid</div>
                  <div className="text-lg font-bold text-green-600">
                    ₹{(summary.totalPaid / 1000).toFixed(1)}K
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Total Pending</div>
                  <div className="text-lg font-bold text-orange-600">
                    ₹{(summary.totalPending / 1000).toFixed(1)}K
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-blue-600" />
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
            <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center bg-gray-100">
              {getIcon()}
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">No Orders Found</h3>
            <p className="text-xs text-gray-500">
              {searchTerm 
                ? 'No orders match your search criteria'
                : `No orders with ${getTitle().toLowerCase()} found`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
                onClick={() => {
                  setSelectedOrder(order);
                  setShowOrderDetails(true);
                }}
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
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                    <DollarSign className="h-3 w-3" />
                    <span>{order.paymentStatus}</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="mb-3 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Package className="h-3 w-3" />
                    <span className="font-medium">{order.productName}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.productType} • Qty: {order.quantity}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="mb-3 p-2 bg-gray-50 rounded space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                  {order.paidAmount > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Paid:</span>
                      <span className="text-green-600 font-medium">₹{order.paidAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {order.pendingAmount > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Pending:</span>
                      <span className="text-orange-600 font-semibold">₹{order.pendingAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Order: {formatDate(order.orderDate)}</span>
                  </div>
                  {order.customerPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{order.customerPhone}</span>
                    </div>
                  )}
                  {order.salesPersonEmail && (
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span className="truncate">{order.salesPersonEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end"
          onClick={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }}
        >
          <div 
            className="bg-white w-full max-h-[90vh] rounded-t-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
              <button
                onClick={() => {
                  setShowOrderDetails(false);
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
                      <Package className="h-3 w-3 mt-0.5" />
                      <span>{selectedOrder.customerAddress}</span>
                    </div>
                  )}
                  {selectedOrder.salesPersonEmail && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>Salesperson: {selectedOrder.salesPersonEmail}</span>
                    </div>
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
                  <div><strong>Order Date:</strong> {formatDate(selectedOrder.orderDate)}</div>
                  {selectedOrder.workOrder && (
                    <div><strong>Work Order:</strong> {selectedOrder.workOrder}</div>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment Information</h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid Amount:</span>
                    <span className="text-green-600 font-medium">₹{selectedOrder.paidAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Amount:</span>
                    <span className="text-orange-600 font-semibold">₹{selectedOrder.pendingAmount.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span>Payment Status:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowOrderDetails(false);
                  setSelectedOrder(null);
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobilePaymentStatusView;

