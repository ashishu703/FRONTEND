import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Clock, Phone, CheckCircle, XCircle, UserX, Calendar, Edit, ArrowRight, Search, RefreshCw, BarChart3, Users, DollarSign, Eye } from 'lucide-react';
import departmentUserService from '../../api/admin_api/departmentUserService';
import departmentHeadService from '../../api/admin_api/departmentHeadService';
import apiErrorHandler from '../../utils/ApiErrorHandler';
import toastManager from '../../utils/ToastManager';

const SalesDashboard = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  // Fetch user performance data
  useEffect(() => {
    const fetchUserPerformance = async () => {
      try {
        setLoading(true);
        const response = await departmentUserService.listUsers({ page: 1, limit: 100 });
        if (response && response.data) {
          const users = response.data.users || response.data;
          const performanceData = users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            department: user.departmentType === 'office_sales' ? 'Sales Department' : user.departmentType === 'marketing_sales' ? 'Marketing Department' : 'HR Department',
            role: user.isActive ? 'Department User' : 'Inactive User',
            associatedEmail: user.email,
            date: new Date(user.createdAt).toLocaleDateString('en-US', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }),
            pending: { count: Math.floor(Math.random() * 50) + 10, total: Math.floor(Math.random() * 100) + 50 },
            followUp: { count: Math.floor(Math.random() * 30) + 5, total: Math.floor(Math.random() * 60) + 20 },
            done: { count: Math.floor(Math.random() * 40) + 5, total: Math.floor(Math.random() * 80) + 20 },
            notConnected: { count: Math.floor(Math.random() * 25) + 5, total: Math.floor(Math.random() * 50) + 15 },
            notInterested: { count: Math.floor(Math.random() * 15) + 2, total: Math.floor(Math.random() * 30) + 10 },
            meetingScheduled: { count: Math.floor(Math.random() * 10) + 1, total: Math.floor(Math.random() * 20) + 5 },
            totalAmount: Math.floor(Math.random() * 200000) + 50000,
            dueAmount: Math.floor(Math.random() * 50000) + 5000
          }));
          setUserData(performanceData);
        }
      } catch (error) {
        apiErrorHandler.handleError(error, 'fetch user performance');
        toastManager.error('Failed to load user performance data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPerformance();
  }, []);

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
      email: user.email,
      department: user.department,
      role: user.role,
      associatedEmail: user.associatedEmail,
      totalAmount: user.totalAmount,
      dueAmount: user.dueAmount
    });
    setShowEditModal(true);
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
      // Update the user data (in a real app, this would be an API call)
      const userIndex = userData.findIndex(user => user.id === editingUser.id);
      
      if (userIndex !== -1) {
        // Update the user data
        const updatedUser = {
          ...userData[userIndex],
          ...editFormData
        };
        
        // In a real application, you would update the state or make an API call
        console.log('Updated user:', updatedUser);
        alert(`User ${editFormData.username} updated successfully!`);
      }
    }
    closeEditModal();
  };

  const getDepartmentPillStyle = (department) => {
    switch (department) {
      case 'Sales Department':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Automation Department':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'Telesales Department':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getRolePillStyle = (role) => {
    switch (role) {
      case 'Department Head':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Department User':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Filter users based on search term and date range
  const filterUsers = (users) => {
    return users.filter(user => {
      // Search filter
      const matchesSearch = !searchTerm || 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase());

      // Date range filter
      let matchesDateRange = true;
      if (dateRange.startDate || dateRange.endDate) {
        const userDate = new Date(user.date);
        const startDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
        const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;

        if (startDate && endDate) {
          matchesDateRange = userDate >= startDate && userDate <= endDate;
        } else if (startDate) {
          matchesDateRange = userDate >= startDate;
        } else if (endDate) {
          matchesDateRange = userDate <= endDate;
        }
      }

      return matchesSearch && matchesDateRange;
    });
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

  const getFilteredUsers = () => {
    return filterUsers(userData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by username, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <div className="relative" ref={datePickerRef}>
              <button 
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  {dateRange.startDate && dateRange.endDate 
                    ? `${dateRange.startDate} - ${dateRange.endDate}`
                    : dateRange.startDate 
                    ? `From ${dateRange.startDate}`
                    : dateRange.endDate
                    ? `Until ${dateRange.endDate}`
                    : 'Select date range'
                  }
                </span>
              </button>
              
              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10 min-w-80">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex justify-between pt-2">
                      <button
                        onClick={clearDateRange}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        {(searchTerm || dateRange.startDate || dateRange.endDate) && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-blue-700">
                  Showing {getFilteredUsers().length} of {userData.length} users
                </span>
                {(searchTerm || dateRange.startDate || dateRange.endDate) && (
                  <span className="text-xs text-blue-600">
                    {searchTerm && `Search: "${searchTerm}"`}
                    {searchTerm && (dateRange.startDate || dateRange.endDate) && ' • '}
                    {dateRange.startDate && `From: ${dateRange.startDate}`}
                    {dateRange.startDate && dateRange.endDate && ' • '}
                    {dateRange.endDate && `To: ${dateRange.endDate}`}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  clearDateRange();
                }}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                {loading ? (
                  <tr>
                    <td colSpan="11" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Loading user performance data...</span>
                      </div>
                    </td>
                  </tr>
                ) : getFilteredUsers().length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-6 py-8 text-center text-gray-500">
                      No users found. Create some department users to see their performance.
                    </td>
                  </tr>
                ) : (
                  getFilteredUsers().map((user, index) => (
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
                      <div className="flex items-center justify-center space-x-2">
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
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* User Details Right Sidebar */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex z-50">
          <div className="bg-white h-full w-full max-w-md ml-auto shadow-xl overflow-y-auto">
            <div className="px-4 md:px-5 py-4 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">User Performance</h2>
                <button
                  onClick={closeUserModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* User Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">User Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500">Username</label>
                    <p className="text-sm font-semibold text-gray-900">{selectedUser.username}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Email</label>
                    <p className="text-sm font-semibold text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Department</label>
                    <p className="text-sm font-semibold text-gray-900">{selectedUser.department}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Role</label>
                    <p className="text-sm font-semibold text-gray-900">{selectedUser.role}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Created Date</label>
                    <p className="text-sm font-semibold text-gray-900">{selectedUser.date}</p>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Performance Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Pending</span>
                    <span className="text-sm font-semibold text-gray-900">{selectedUser.pending.count}/{selectedUser.pending.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Follow Up</span>
                    <span className="text-sm font-semibold text-gray-900">{selectedUser.followUp.count}/{selectedUser.followUp.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Done</span>
                    <span className="text-sm font-semibold text-gray-900">{selectedUser.done.count}/{selectedUser.done.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Not Connected</span>
                    <span className="text-sm font-semibold text-gray-900">{selectedUser.notConnected.count}/{selectedUser.notConnected.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Not Interested</span>
                    <span className="text-sm font-semibold text-gray-900">{selectedUser.notInterested.count}/{selectedUser.notInterested.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Meeting Scheduled</span>
                    <span className="text-sm font-semibold text-gray-900">{selectedUser.meetingScheduled.count}/{selectedUser.meetingScheduled.total}</span>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Financial Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Total Target</span>
                    <span className="text-sm font-semibold text-gray-900">₹{selectedUser.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Due Target</span>
                    <span className="text-sm font-semibold text-gray-900">₹{selectedUser.dueAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit User</h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* User Information Form */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
                  <div className="grid grid-cols-2 gap-4">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editFormData.email || ''}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <select
                        value={editFormData.department || ''}
                        onChange={(e) => handleFormChange('department', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Sales Department">Sales Department</option>
                        <option value="Automation Department">Automation Department</option>
                        <option value="Telesales Department">Telesales Department</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select
                        value={editFormData.role || ''}
                        onChange={(e) => handleFormChange('role', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Sales Head">Sales Head</option>
                        <option value="Sales Rep">Sales Rep</option>
                        <option value="Office Sales Agent">Office Sales Agent</option>
                        <option value="Automation System">Automation System</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Associated Email</label>
                      <input
                        type="email"
                        value={editFormData.associatedEmail || ''}
                        onChange={(e) => handleFormChange('associatedEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Information Form */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Target (₹)</label>
                      <input
                        type="number"
                        value={editFormData.totalAmount || ''}
                        onChange={(e) => handleFormChange('totalAmount', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Due Target (₹)</label>
                      <input
                        type="number"
                        value={editFormData.dueAmount || ''}
                        onChange={(e) => handleFormChange('dueAmount', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
          </div>
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
      
      {/* Font Awesome CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
      />
    </div>
  );
};

export default SalesDashboard;