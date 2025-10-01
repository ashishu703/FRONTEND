import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Clock, Phone, CheckCircle, XCircle, UserX, Calendar, Edit, Trash2, ArrowRight, Search, RefreshCw, BarChart3, Users, DollarSign, Eye } from 'lucide-react';

const SalesDashboard = () => {
  const userData = [
    {
      id: 1,
      username: 'shivank_admin',
      email: 'shivank@mbgcard.com',
      department: 'Sales Department',
      role: 'Department Head',
      associatedEmail: 'admin@mbg.com',
      date: 'Thu, May 15, 2025',
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
      email: 'ankit@gmail.com',
      department: 'Sales Department',
      role: 'Department User',
      associatedEmail: 'shivank@mbgcard.com',
      date: 'Thu, May 15, 2025',
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
      email: 'automation@mbg.com',
      department: 'Automation Department',
      role: 'Department Head',
      associatedEmail: 'admin@mbg.com',
      date: 'Thu, May 15, 2025',
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
      email: 'telesalesuser@gmail.com',
      department: 'Telesales Department',
      role: 'Department User',
      associatedEmail: 'shivank@mbgcard.com',
      date: 'Tue, May 20, 2025',
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
      email: 'teleuser@gmail.com',
      department: 'Telesales Department',
      role: 'Department User',
      associatedEmail: 'shivank@mbgcard.com',
      date: 'Tue, May 20, 2025',
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
      email: 'mohitpa021@gmail.com',
      department: 'Sales Department',
      role: 'Department User',
      associatedEmail: 'shivank@mbgcard.com',
      date: 'Wed, May 21, 2025',
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

  const teleSalesData = [
    {
      id: 1,
      username: 'tele_agent_01',
      email: 'teleagent01@company.com',
      department: 'Telesales Department',
      role: 'Office Sales Agent',
      associatedEmail: 'telehead@company.com',
      date: 'Mon, May 13, 2025',
      pending: { count: 45, total: 80 },
      followUp: { count: 20, total: 50 },
      done: { count: 15, total: 30 },
      notConnected: { count: 25, total: 60 },
      notInterested: { count: 18, total: 40 },
      meetingScheduled: { count: 8, total: 20 },
      totalAmount: 95000,
      dueAmount: 22000
    },
    {
      id: 2,
      username: 'tele_agent_02',
      email: 'teleagent02@company.com',
      department: 'Telesales Department',
      role: 'Office Sales Agent',
      associatedEmail: 'telehead@company.com',
      date: 'Tue, May 14, 2025',
      pending: { count: 38, total: 70 },
      followUp: { count: 15, total: 45 },
      done: { count: 12, total: 25 },
      notConnected: { count: 20, total: 50 },
      notInterested: { count: 15, total: 35 },
      meetingScheduled: { count: 6, total: 18 },
      totalAmount: 78000,
      dueAmount: 15000
    },
    {
      id: 3,
      username: 'tele_agent_03',
      email: 'teleagent03@company.com',
      department: 'Telesales Department',
      role: 'Office Sales Agent',
      associatedEmail: 'telehead@company.com',
      date: 'Wed, May 15, 2025',
      pending: { count: 52, total: 90 },
      followUp: { count: 25, total: 55 },
      done: { count: 18, total: 35 },
      notConnected: { count: 30, total: 65 },
      notInterested: { count: 22, total: 45 },
      meetingScheduled: { count: 10, total: 25 },
      totalAmount: 105000,
      dueAmount: 28000
    },
    {
      id: 4,
      username: 'tele_agent_04',
      email: 'teleagent04@company.com',
      department: 'Telesales Department',
      role: 'Office Sales Agent',
      associatedEmail: 'telehead@company.com',
      date: 'Thu, May 16, 2025',
      pending: { count: 42, total: 75 },
      followUp: { count: 18, total: 48 },
      done: { count: 14, total: 28 },
      notConnected: { count: 22, total: 55 },
      notInterested: { count: 16, total: 38 },
      meetingScheduled: { count: 7, total: 22 },
      totalAmount: 88000,
      dueAmount: 18000
    },
    {
      id: 5,
      username: 'tele_agent_05',
      email: 'teleagent05@company.com',
      department: 'Telesales Department',
      role: 'Office Sales Agent',
      associatedEmail: 'telehead@company.com',
      date: 'Fri, May 17, 2025',
      pending: { count: 35, total: 65 },
      followUp: { count: 12, total: 40 },
      done: { count: 10, total: 22 },
      notConnected: { count: 18, total: 45 },
      notInterested: { count: 12, total: 30 },
      meetingScheduled: { count: 5, total: 15 },
      totalAmount: 72000,
      dueAmount: 12000
    }
  ];

  const [activeTab, setActiveTab] = useState('sales');
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

  const handleDeleteUser = (user) => {
    console.log('Delete user:', user);
    // Add delete functionality here
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
      // Update the user data (in a real app, this would be an API call)
      const currentData = activeTab === 'sales' ? userData : teleSalesData;
      const userIndex = currentData.findIndex(user => user.id === editingUser.id);
      
      if (userIndex !== -1) {
        // Update the user data
        const updatedUser = {
          ...currentData[userIndex],
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
    const currentData = activeTab === 'sales' ? userData : teleSalesData;
    return filterUsers(currentData);
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
                  Showing {getFilteredUsers().length} of {(activeTab === 'sales' ? userData : teleSalesData).length} users
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

        {/* Tab Navigation */}
        <div className="mb-6 flex">
          <button 
            onClick={() => setActiveTab('sales')}
            className={`px-6 py-3 font-medium flex items-center ${
              activeTab === 'sales' 
                ? 'bg-white border-b-2 border-blue-500 text-blue-600' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Sales User
          </button>
          <button 
            onClick={() => setActiveTab('tele')}
            className={`px-6 py-3 font-medium flex items-center ${
              activeTab === 'tele' 
                ? 'bg-white border-b-2 border-blue-500 text-blue-600' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Office Sales User
          </button>
        </div>

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
                {getFilteredUsers().map((user, index) => (
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
      </div>
      
      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
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
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Department</label>
                      <p className="text-gray-900">{selectedUser.department}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Role</label>
                      <p className="text-gray-900">{selectedUser.role}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Associated Email</label>
                      <p className="text-gray-900">{selectedUser.associatedEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date</label>
                      <p className="text-gray-900">{selectedUser.date}</p>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
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

                {/* Financial Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Target</label>
                      <p className="text-gray-900">₹{selectedUser.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Due Target</label>
                      <p className="text-gray-900">₹{selectedUser.dueAmount.toLocaleString()}</p>
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