import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Clock, Phone, CheckCircle, XCircle, UserX, Calendar, Edit, Trash2, ArrowRight, Search, RefreshCw, BarChart3, Users, DollarSign, Eye, Megaphone, Target } from 'lucide-react';

const MarketingUserPerformance = () => {
  const userData = [
    {
      id: 1,
      username: 'sarah_marketing',
      email: 'sarah@mbgcard.com',
      department: 'Marketing Department',
      role: 'Marketing Specialist',
      associatedEmail: 'marketing@mbg.com',
      date: 'Thu, May 15, 2025',
      pending: { count: 28, total: 55 },
      followUp: { count: 15, total: 35 },
      done: { count: 12, total: 25 },
      notConnected: { count: 8, total: 20 },
      notInterested: { count: 5, total: 15 },
      meetingScheduled: { count: 4, total: 12 },
      totalAmount: 145000,
      dueAmount: 35000,
      campaignLeads: 45,
      socialMediaLeads: 32
    },
    {
      id: 2,
      username: 'mike_digital',
      email: 'mike@gmail.com',
      department: 'Marketing Department',
      role: 'Digital Marketing Specialist',
      associatedEmail: 'sarah@mbgcard.com',
      date: 'Thu, May 15, 2025',
      pending: { count: 22, total: 45 },
      followUp: { count: 10, total: 28 },
      done: { count: 18, total: 38 },
      notConnected: { count: 6, total: 18 },
      notInterested: { count: 3, total: 12 },
      meetingScheduled: { count: 5, total: 15 },
      totalAmount: 125000,
      dueAmount: 28000,
      campaignLeads: 38,
      socialMediaLeads: 25
    },
    {
      id: 3,
      username: 'emma_content',
      email: 'emma@mbg.com',
      department: 'Marketing Department',
      role: 'Content Marketing Manager',
      associatedEmail: 'marketing@mbg.com',
      date: 'Thu, May 15, 2025',
      pending: { count: 15, total: 35 },
      followUp: { count: 8, total: 22 },
      done: { count: 25, total: 42 },
      notConnected: { count: 4, total: 15 },
      notInterested: { count: 2, total: 8 },
      meetingScheduled: { count: 3, total: 10 },
      totalAmount: 95000,
      dueAmount: 18000,
      campaignLeads: 28,
      socialMediaLeads: 18
    },
    {
      id: 4,
      username: 'alex_social',
      email: 'alex@gmail.com',
      department: 'Marketing Department',
      role: 'Social Media Manager',
      associatedEmail: 'sarah@mbgcard.com',
      date: 'Tue, May 20, 2025',
      pending: { count: 35, total: 65 },
      followUp: { count: 18, total: 40 },
      done: { count: 8, total: 28 },
      notConnected: { count: 15, total: 35 },
      notInterested: { count: 9, total: 22 },
      meetingScheduled: { count: 6, total: 18 },
      totalAmount: 105000,
      dueAmount: 25000,
      campaignLeads: 52,
      socialMediaLeads: 42
    },
    {
      id: 5,
      username: 'lisa_brand',
      email: 'lisa@gmail.com',
      department: 'Marketing Department',
      role: 'Brand Manager',
      associatedEmail: 'sarah@mbgcard.com',
      date: 'Tue, May 20, 2025',
      pending: { count: 20, total: 42 },
      followUp: { count: 12, total: 30 },
      done: { count: 15, total: 32 },
      notConnected: { count: 8, total: 22 },
      notInterested: { count: 4, total: 15 },
      meetingScheduled: { count: 5, total: 14 },
      totalAmount: 88000,
      dueAmount: 22000,
      campaignLeads: 35,
      socialMediaLeads: 28
    },
    {
      id: 6,
      username: 'david_email',
      email: 'david@gmail.com',
      department: 'Marketing Department',
      role: 'Email Marketing Specialist',
      associatedEmail: 'sarah@mbgcard.com',
      date: 'Wed, May 21, 2025',
      pending: { count: 18, total: 38 },
      followUp: { count: 9, total: 25 },
      done: { count: 22, total: 45 },
      notConnected: { count: 5, total: 18 },
      notInterested: { count: 3, total: 12 },
      meetingScheduled: { count: 4, total: 11 },
      totalAmount: 115000,
      dueAmount: 30000,
      campaignLeads: 40,
      socialMediaLeads: 15
    }
  ];

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

  // Filter users based on search term and date range
  const filterUsers = (users) => {
    return users.filter(user => {
      // Search filter
      const matchesSearch = !searchTerm || 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase());

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

        {/* Search and Filters */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by username, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-80"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
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
          <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-purple-700">
                  Showing {getFilteredUsers().length} of {userData.length} users
                </span>
                {(searchTerm || dateRange.startDate || dateRange.endDate) && (
                  <span className="text-xs text-purple-600">
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
                className="text-xs text-purple-600 hover:text-purple-800 underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Performance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{getFilteredUsers().length}</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {getFilteredUsers().reduce((sum, user) => sum + user.campaignLeads, 0)}
                </div>
                <div className="text-sm text-gray-600">Campaign Leads</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {getFilteredUsers().reduce((sum, user) => sum + user.socialMediaLeads, 0)}
                </div>
                <div className="text-sm text-gray-600">Social Media Leads</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  ₹{(getFilteredUsers().reduce((sum, user) => sum + user.totalAmount, 0) / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
            </div>
          </div>
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
                      <User className="w-3 h-3 text-purple-600" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Marketing User</span>
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
                      <Megaphone className="w-3 h-3 text-blue-600" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">CAMPAIGN LEADS</span>
                    </div>
                  </th>
                  <th className="px-2 py-2 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Target className="w-3 h-3 text-pink-600" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">SOCIAL LEADS</span>
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
                      <div>
                        <span className="text-xs text-gray-900 font-bold">{user.username}</span>
                        <div className="text-xs text-gray-500">{user.role}</div>
                      </div>
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
                      <span className="text-xs text-gray-900">{user.campaignLeads}</span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span className="text-xs text-gray-900">{user.socialMediaLeads}</span>
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
                <h2 className="text-2xl font-bold text-gray-900">Marketing User Performance Details</h2>
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
                  </div>
                </div>

                {/* Marketing Performance Metrics */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Campaign Leads</label>
                      <p className="text-gray-900 text-lg font-semibold text-blue-600">{selectedUser.campaignLeads}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Social Media Leads</label>
                      <p className="text-gray-900 text-lg font-semibold text-purple-600">{selectedUser.socialMediaLeads}</p>
                    </div>
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

      {/* Font Awesome CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
      />
    </div>
  );
};

export default MarketingUserPerformance;
