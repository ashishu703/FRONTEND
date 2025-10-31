import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Calendar, 
  Building, 
  Users, 
  Clock, 
  CheckCircle, 
  BarChart3, 
  Settings,
  TrendingUp,
  UserX,
  XCircle,
  Info,
  User,
  Phone, 

  DollarSign,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

const Performance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedUserForQuotation, setSelectedUserForQuotation] = useState(null);
  const [selectedUserForPayment, setSelectedUserForPayment] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [quotationData, setQuotationData] = useState(null);
  const datePickerRef = useRef(null);

  // Sample data matching the screenshot format
  const userData = [
    {
      id: 1,
      username: 'shivank_admin',
      pending: { count: 25, total: 50 },
      followUp: { count: 12, total: 30 },
      done: { count: 8, total: 20 },
      notConnected: { count: 5, total: 15 },
      notInterested: { count: 3, total: 10 },
      meetingScheduled: { count: 2, total: 8 },
      totalAmount: 125000,
      dueAmount: 25000
    },
    {
      id: 2,
      username: 'ankit_sales',
      pending: { count: 18, total: 40 },
      followUp: { count: 7, total: 25 },
      done: { count: 15, total: 35 },
      notConnected: { count: 8, total: 20 },
      notInterested: { count: 4, total: 12 },
      meetingScheduled: { count: 3, total: 10 },
      totalAmount: 98000,
      dueAmount: 15000
    },
    {
      id: 3,
      username: 'auto_system',
      pending: { count: 5, total: 15 },
      followUp: { count: 3, total: 10 },
      done: { count: 22, total: 30 },
      notConnected: { count: 2, total: 8 },
      notInterested: { count: 1, total: 5 },
      meetingScheduled: { count: 1, total: 6 },
      totalAmount: 75000,
      dueAmount: 5000
    },
    {
      id: 4,
      username: 'telesales_user',
      pending: { count: 32, total: 60 },
      followUp: { count: 14, total: 35 },
      done: { count: 6, total: 25 },
      notConnected: { count: 12, total: 30 },
      notInterested: { count: 7, total: 18 },
      meetingScheduled: { count: 4, total: 12 },
      totalAmount: 85000,
      dueAmount: 18000
    },
    {
      id: 5,
      username: 'teleuser_01',
      pending: { count: 28, total: 55 },
      followUp: { count: 9, total: 30 },
      done: { count: 11, total: 28 },
      notConnected: { count: 10, total: 25 },
      notInterested: { count: 6, total: 15 },
      meetingScheduled: { count: 3, total: 9 },
      totalAmount: 92000,
      dueAmount: 12000
    },
    {
      id: 6,
      username: 'mohit_sales',
      pending: { count: 15, total: 35 },
      followUp: { count: 6, total: 20 },
      done: { count: 19, total: 40 },
      notConnected: { count: 4, total: 12 },
      notInterested: { count: 2, total: 8 },
      meetingScheduled: { count: 2, total: 7 },
      totalAmount: 110000,
      dueAmount: 20000
    }
  ];

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEditUser = (user) => {
    console.log('Edit user:', user);
    setEditingUser(user);
    setEditFormData({
      username: user.username,
      totalAmount: user.totalAmount,
      dueAmount: user.dueAmount
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    console.log('Delete user:', user);
    if (window.confirm(`Are you sure you want to delete ${user.username}?`)) {
      alert(`Delete functionality for ${user.username} - Coming soon!`);
    }
  };

  const handleViewUser = (user) => {
    console.log('View user:', user);
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditFormData({});
  };

  const handleFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = () => {
    if (editingUser) {
      const userIndex = userData.findIndex(user => user.id === editingUser.id);
      
      if (userIndex !== -1) {
        const updatedUser = {
          ...userData[userIndex],
          ...editFormData
        };
        
        console.log('Updated user:', updatedUser);
        alert(`User ${editFormData.username} updated successfully!`);
      }
    }
    closeEditModal();
  };

  // Additional handlers from MarketingSalespersonLeads.jsx
  const handleCreateQuotation = (user) => {
    console.log('Creating quotation for user:', user);
    setSelectedUserForQuotation(user);
    setQuotationData({
      customerName: user.username,
      customerId: user.id,
      date: new Date().toISOString().split('T')[0],
      items: [
        {
          id: 1,
          description: 'Sales Target Achievement',
          quantity: 1,
          unit: 'Target',
          rate: user.totalAmount,
          amount: user.totalAmount
        }
      ],
      subtotal: user.totalAmount,
      taxRate: 18,
      taxAmount: user.totalAmount * 0.18,
      total: user.totalAmount * 1.18
    });
    setShowQuotationModal(true);
  };

  const handleSaveQuotation = (quotationData) => {
    console.log('Saving quotation:', quotationData);
    alert(`Quotation saved successfully for ${quotationData.customerName}!`);
    setShowQuotationModal(false);
    setSelectedUserForQuotation(null);
    setQuotationData(null);
  };

  const handleWalletClick = async (user) => {
    console.log('Opening payment modal for user:', user);
    // Demo payment history data
    setPaymentHistory([
      {
        id: 1,
        amount: Math.floor(user.totalAmount * 0.3),
        date: '2024-01-15',
        status: 'paid',
        paymentMethod: 'Cash',
        remarks: 'Initial advance payment',
        reference: 'CASH001',
        dueDate: '2024-01-15',
        paidDate: '2024-01-15'
      },
      {
        id: 2,
        amount: Math.floor(user.totalAmount * 0.4),
        date: '2024-01-20',
        status: 'paid',
        paymentMethod: 'UPI',
        remarks: 'Second installment',
        reference: 'UPI123456',
        dueDate: '2024-01-20',
        paidDate: '2024-01-20'
      },
      {
        id: 3,
        amount: user.dueAmount,
        date: '2024-01-25',
        status: 'pending',
        paymentMethod: 'Bank Transfer',
        remarks: 'Final payment pending',
        reference: 'BANK789',
        dueDate: '2024-01-25',
        paidDate: null
      }
    ]);
    setTotalAmount(user.totalAmount);
    setSelectedUserForPayment(user);
    setShowPaymentModal(true);
  };

  const closeQuotationModal = () => {
    setShowQuotationModal(false);
    setSelectedUserForQuotation(null);
    setQuotationData(null);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedUserForPayment(null);
    setPaymentHistory([]);
    setTotalAmount(0);
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearDateRange = () => {
    setDateRange({
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Performance Overview</h1>
        <p className="text-gray-600">Monitor sales user performance and metrics</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <span className="text-sm font-medium text-gray-700 uppercase tracking-wider">#</span>
                </th>
                <th className="px-3 py-2 text-left">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3 text-blue-600" />
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Sales User</span>
                  </div>
                </th>
                <th className="px-2 py-2 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <i className="fas fa-clock text-orange-500 text-xs"></i>
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">PENDING</span>
                  </div>
                </th>
                <th className="px-2 py-2 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <i className="fas fa-phone text-purple-500 text-xs"></i>
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">FOLLOW UP</span>
                  </div>
                </th>
                <th className="px-2 py-2 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <i className="fas fa-check-circle text-green-500 text-xs"></i>
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">DONE</span>
                  </div>
                </th>
                <th className="px-2 py-2 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <i className="fas fa-times-circle text-blue-400 text-xs"></i>
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">NOT CONNECTED</span>
                  </div>
                </th>
                <th className="px-2 py-2 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <i className="fas fa-user-slash text-red-500 text-xs"></i>
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">NOT INTERESTED</span>
                  </div>
                </th>
                <th className="px-2 py-2 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <i className="fas fa-calendar-check text-blue-600 text-xs"></i>
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">MEETING SCHEDULED</span>
                  </div>
                </th>
                <th className="px-2 py-2 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <DollarSign className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">TOTAL TARGET</span>
                  </div>
                </th>
                <th className="px-2 py-2 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <DollarSign className="w-3 h-3 text-red-600" />
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">DUE TARGET</span>
                  </div>
                </th>
                <th className="px-2 py-2 text-center">
                  <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userData.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-500 font-medium">{index + 1}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-900 font-bold">{user.username}</span>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <span className="text-xs text-gray-900">{user.pending.count}/{user.pending.total}</span>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <span className="text-xs text-gray-900">{user.followUp.count}/{user.followUp.total}</span>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <span className="text-xs text-gray-900">{user.done.count}/{user.done.total}</span>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <span className="text-xs text-gray-900">{user.notConnected.count}/{user.notConnected.total}</span>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <span className="text-xs text-gray-900">{user.notInterested.count}/{user.notInterested.total}</span>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <span className="text-xs text-gray-900">{user.meetingScheduled.count}/{user.meetingScheduled.total}</span>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <span className="text-xs text-gray-900">₹{user.totalAmount.toLocaleString()}</span>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <span className="text-xs text-gray-900">₹{user.dueAmount.toLocaleString()}</span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="w-5 h-5 flex items-center justify-center text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                        title="Edit User"
                      >
                        <Edit className="w-2.5 h-2.5" />
                      </button>
                      <button 
                        onClick={() => handleViewUser(user)}
                        className="w-5 h-5 flex items-center justify-center text-green-600 border border-green-200 rounded hover:bg-green-50 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-2.5 h-2.5" />
                      </button>
                      <button 
                        onClick={() => handleCreateQuotation(user)}
                        className="w-5 h-5 flex items-center justify-center text-purple-600 border border-purple-200 rounded hover:bg-purple-50 transition-colors"
                        title="Create Quotation"
                      >
                        <DollarSign className="w-2.5 h-2.5" />
                      </button>
                      <button 
                        onClick={() => handleWalletClick(user)}
                        className="w-5 h-5 flex items-center justify-center text-orange-600 border border-orange-200 rounded hover:bg-orange-50 transition-colors"
                        title="View Payment Details"
                      >
                        <Phone className="w-2.5 h-2.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user)}
                        className="w-5 h-5 flex items-center justify-center text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Sales User Performance Details</h2>
                <button
                  onClick={closeUserModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* User Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Username</label>
                      <p className="text-gray-900">{selectedUser.username}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">User ID</label>
                      <p className="text-gray-900">{selectedUser.id}</p>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Target</label>
                      <p className="text-gray-900 text-lg font-semibold text-green-600">₹{selectedUser.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Due Target</label>
                      <p className="text-gray-900 text-lg font-semibold text-red-600">₹{selectedUser.dueAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Lead Management Metrics */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Management Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Pending</label>
                      <p className="text-gray-900">{selectedUser.pending.count}/{selectedUser.pending.total}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Follow Up</label>
                      <p className="text-gray-900">{selectedUser.followUp.count}/{selectedUser.followUp.total}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Done</label>
                      <p className="text-gray-900">{selectedUser.done.count}/{selectedUser.done.total}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Not Connected</label>
                      <p className="text-gray-900">{selectedUser.notConnected.count}/{selectedUser.notConnected.total}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Not Interested</label>
                      <p className="text-gray-900">{selectedUser.notInterested.count}/{selectedUser.notInterested.total}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Meeting Scheduled</label>
                      <p className="text-gray-900">{selectedUser.meetingScheduled.count}/{selectedUser.meetingScheduled.total}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={closeUserModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit User</h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={editFormData.username || ''}
                    onChange={(e) => handleFormChange('username', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Target Amount</label>
                  <input
                    type="number"
                    value={editFormData.totalAmount || ''}
                    onChange={(e) => handleFormChange('totalAmount', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Target Amount</label>
                  <input
                    type="number"
                    value={editFormData.dueAmount || ''}
                    onChange={(e) => handleFormChange('dueAmount', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Modal */}
      {showQuotationModal && quotationData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Quotation</h2>
                <button
                  onClick={closeQuotationModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Customer Name</label>
                      <p className="text-gray-900">{quotationData.customerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Customer ID</label>
                      <p className="text-gray-900">{quotationData.customerId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date</label>
                      <p className="text-gray-900">{quotationData.date}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Amount</label>
                      <p className="text-gray-900 text-lg font-semibold text-green-600">₹{quotationData.total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Description</th>
                          <th className="text-right py-2">Quantity</th>
                          <th className="text-right py-2">Unit</th>
                          <th className="text-right py-2">Rate</th>
                          <th className="text-right py-2">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotationData.items.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="py-2">{item.description}</td>
                            <td className="py-2 text-right">{item.quantity}</td>
                            <td className="py-2 text-right">{item.unit}</td>
                            <td className="py-2 text-right">₹{item.rate.toLocaleString()}</td>
                            <td className="py-2 text-right">₹{item.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{quotationData.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax ({quotationData.taxRate}%):</span>
                      <span>₹{quotationData.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>₹{quotationData.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeQuotationModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveQuotation(quotationData)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save Quotation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedUserForPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                <button
                  onClick={closePaymentModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Customer Name</label>
                      <p className="text-gray-900">{selectedUserForPayment.username}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Amount</label>
                      <p className="text-gray-900 text-lg font-semibold text-green-600">₹{totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Payment History */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Date</th>
                          <th className="text-right py-2">Amount</th>
                          <th className="text-center py-2">Status</th>
                          <th className="text-center py-2">Method</th>
                          <th className="text-left py-2">Reference</th>
                          <th className="text-left py-2">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map((payment) => (
                          <tr key={payment.id} className="border-b">
                            <td className="py-2">{payment.date}</td>
                            <td className="py-2 text-right">₹{payment.amount.toLocaleString()}</td>
                            <td className="py-2 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                payment.status === 'paid' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {payment.status}
                              </span>
                            </td>
                            <td className="py-2 text-center">{payment.paymentMethod}</td>
                            <td className="py-2">{payment.reference}</td>
                            <td className="py-2">{payment.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={closePaymentModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Font Awesome CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
      />
    </div>
  );
};

export default Performance;
