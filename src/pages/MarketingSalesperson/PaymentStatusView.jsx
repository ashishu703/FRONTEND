import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Loader, 
  Search,
  Phone,
  Calendar,
  Package,
  RefreshCw
} from 'lucide-react';
import { API_ENDPOINTS } from '../../api/admin_api/api';
import apiClient from '../../utils/apiClient';

const PaymentStatusView = ({ type }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [type]);

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
          orderHistory: order.order_history || [],
          salesPersonEmail: order.created_by || ''
        }));

        // Filter orders based on payment status type
        let filteredOrders = [];
        if (type === 'due') {
          // Show orders with Pending, Partial, or Advance payment status
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
      setLoading(false);
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
        return 'View all orders with pending, partial, or advance payments';
      case 'advance':
        return 'View all orders with advance payments';
      case 'completed':
        return 'View all orders with completed payments';
      default:
        return 'View payment status';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'due':
        return <AlertCircle className="h-8 w-8 text-orange-600" />;
      case 'advance':
        return <Clock className="h-8 w-8 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      default:
        return <IndianRupee className="h-8 w-8 text-gray-600" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      case 'Advance': return 'bg-purple-100 text-purple-800';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      order.customerName.toLowerCase().includes(searchLower) ||
      order.customerPhone.includes(searchTerm) ||
      order.leadNumber.toLowerCase().includes(searchLower) ||
      order.productName.toLowerCase().includes(searchLower) ||
      (order.salesPersonEmail && order.salesPersonEmail.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {getIcon()}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
              <p className="text-gray-600">{getDescription()}</p>
            </div>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone, lead number, or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-gray-100">
              {getIcon()}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'No orders match your search criteria'
                : `No orders with ${getTitle().toLowerCase()} found`
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salesperson
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pending Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.leadNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Phone className="w-3 h-3 mr-1" />
                          {order.customerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.salesPersonEmail || '—'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.productName}</div>
                        <div className="text-sm text-gray-500">{order.productType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {order.orderDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{order.paidAmount.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-orange-600">
                        ₹{order.pendingAmount.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {filteredOrders.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Total Orders</div>
              <div className="text-2xl font-bold text-gray-900">{filteredOrders.length}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Total Amount</div>
              <div className="text-2xl font-bold text-gray-900">
                ₹{filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Total Pending</div>
              <div className="text-2xl font-bold text-orange-600">
                ₹{filteredOrders.reduce((sum, order) => sum + order.pendingAmount, 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStatusView;

