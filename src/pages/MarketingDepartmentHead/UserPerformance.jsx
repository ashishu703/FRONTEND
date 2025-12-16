import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Clock, Phone, CheckCircle, XCircle, UserX, Calendar, Edit, Trash2, ArrowRight, Search, RefreshCw, BarChart3, Users, DollarSign, Eye, Megaphone, Target } from 'lucide-react';
import departmentUsersService, { apiToUiDepartment, apiToUiRole, DepartmentType } from '../../api/admin_api/departmentUsersService';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../api/admin_api/api';

const MarketingUserPerformance = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch marketing department users and calculate their performance
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching marketing salespersons with params:', {
        departmentType: DepartmentType.MARKETING_SALES,
        page: 1,
        limit: 100
      });
      
      const response = await departmentUsersService.listUsers({
        departmentType: DepartmentType.MARKETING_SALES,
        page: 1,
        limit: 100
      });

      console.log('Full API Response:', JSON.stringify(response, null, 2));
      
      // Handle different response structures
      // Response can be: { success: true, data: { users: [...], pagination: {...} } }
      // Or: { users: [...], pagination: {...} }
      // Or: { data: { users: [...], pagination: {...} } }
      let usersArray = [];
      
      if (response?.success && response?.data) {
        // Structure: { success: true, data: { users: [...], pagination: {...} } }
        usersArray = Array.isArray(response.data.users) ? response.data.users : (Array.isArray(response.data) ? response.data : []);
      } else if (response?.data) {
        // Structure: { data: { users: [...], pagination: {...} } }
        usersArray = Array.isArray(response.data.users) ? response.data.users : (Array.isArray(response.data) ? response.data : []);
      } else if (response?.users) {
        // Structure: { users: [...], pagination: {...} }
        usersArray = Array.isArray(response.users) ? response.users : [];
      } else if (Array.isArray(response)) {
        // Direct array response
        usersArray = response;
      } else if (Array.isArray(response?.data)) {
        // Structure: { data: [...] }
        usersArray = response.data;
      }
      
      console.log(`Found ${usersArray.length} marketing salespersons:`, usersArray.map(u => ({ 
        id: u.id,
        username: u.username, 
        email: u.email, 
        departmentType: u.departmentType || u.department_type,
        isActive: u.isActive || u.is_active
      })));
      
      if (usersArray.length === 0) {
        console.warn('No marketing salespersons found. Please ensure users are created with departmentType: marketing_sales');
        setError('No marketing salespersons found. Please add marketing salespersons in the system with department type "marketing_sales".');
        setUsers([]);
        setLoading(false);
        return;
      }
        
        // Fetch performance data for each user in parallel
        const userPerformanceData = await Promise.all(usersArray.map(async (u, idx) => {
          try {
            const userEmail = u.email || '';
            const username = u.username || '';
            
            console.log(`Fetching performance data for ${username} (${userEmail})...`);
            
            // Fetch leads assigned to this user (try both username and email)
            let leads = [];
            try {
              if (username) {
                const leadsRes = await apiClient.get(API_ENDPOINTS.SALESPERSON_ASSIGNED_LEADS_BY_USERNAME(username));
                leads = Array.isArray(leadsRes?.data) ? leadsRes.data : (Array.isArray(leadsRes?.rows) ? leadsRes.rows : []);
              }
            } catch (e) {
              console.warn(`Failed to fetch leads for ${username}:`, e);
            }
            
            // Fetch meetings assigned to this user (try both email and username)
            let meetings = [];
            try {
              // Try with email first
              if (userEmail) {
                const meetingsResEmail = await apiClient.get(`${API_ENDPOINTS.MARKETING_MEETINGS_GET_ALL()}?assigned_to=${encodeURIComponent(userEmail)}`);
                const meetingsFromEmail = Array.isArray(meetingsResEmail?.data) ? meetingsResEmail.data : [];
                meetings.push(...meetingsFromEmail);
              }
              // Also try with username
              if (username && username !== userEmail) {
                const meetingsResUsername = await apiClient.get(`${API_ENDPOINTS.MARKETING_MEETINGS_GET_ALL()}?assigned_to=${encodeURIComponent(username)}`);
                const meetingsFromUsername = Array.isArray(meetingsResUsername?.data) ? meetingsResUsername.data : [];
                meetings.push(...meetingsFromUsername);
              }
              // Remove duplicates based on meeting id
              meetings = meetings.filter((m, index, self) => 
                index === self.findIndex((t) => t.id === m.id)
              );
            } catch (e) {
              console.warn(`Failed to fetch meetings for ${username}:`, e);
            }
            
            // Fetch check-ins by this user (try both email and username)
            let checkIns = [];
            try {
              // Try with email first
              if (userEmail) {
                const checkInsResEmail = await apiClient.get(`${API_ENDPOINTS.MARKETING_CHECK_INS_GET_ALL()}?salesperson_email=${encodeURIComponent(userEmail)}`);
                const checkInsFromEmail = Array.isArray(checkInsResEmail?.data) ? checkInsResEmail.data : [];
                checkIns.push(...checkInsFromEmail);
              }
              // Also try with username
              if (username && username !== userEmail) {
                const checkInsResUsername = await apiClient.get(`${API_ENDPOINTS.MARKETING_CHECK_INS_GET_ALL()}?salesperson_email=${encodeURIComponent(username)}`);
                const checkInsFromUsername = Array.isArray(checkInsResUsername?.data) ? checkInsResUsername.data : [];
                checkIns.push(...checkInsFromUsername);
              }
              // Remove duplicates based on check-in id
              checkIns = checkIns.filter((c, index, self) => 
                index === self.findIndex((t) => t.id === c.id)
              );
            } catch (e) {
              console.warn(`Failed to fetch check-ins for ${username}:`, e);
            }
            
            // Fetch orders created by this user (try both email and username)
            let orders = [];
            try {
              // Try with email first
              if (userEmail) {
                const ordersResEmail = await apiClient.get(`${API_ENDPOINTS.MARKETING_ORDERS_GET_ALL()}?created_by=${encodeURIComponent(userEmail)}`);
                const ordersFromEmail = Array.isArray(ordersResEmail?.data) ? ordersResEmail.data : [];
                orders.push(...ordersFromEmail);
              }
              // Also try with username
              if (username && username !== userEmail) {
                const ordersResUsername = await apiClient.get(`${API_ENDPOINTS.MARKETING_ORDERS_GET_ALL()}?created_by=${encodeURIComponent(username)}`);
                const ordersFromUsername = Array.isArray(ordersResUsername?.data) ? ordersResUsername.data : [];
                orders.push(...ordersFromUsername);
              }
              // Remove duplicates based on order id
              orders = orders.filter((o, index, self) => 
                index === self.findIndex((t) => t.id === o.id)
              );
            } catch (e) {
              console.warn(`Failed to fetch orders for ${username}:`, e);
            }
            
            console.log(`Performance data for ${username}:`, {
              leads: leads.length,
              meetings: meetings.length,
              checkIns: checkIns.length,
              orders: orders.length
            });
            
            // Calculate metrics from actual data
            const totalLeads = leads.length;
            const pendingLeads = leads.filter(l => {
              const status = String(l.sales_status || '').toLowerCase();
              return status === 'pending' || status === '';
            }).length;
            
            const followUpLeads = leads.filter(l => {
              const status = String(l.follow_up_status || '').toLowerCase();
              return status === 'follow up' || status === 'follow-up' || status === 'appointment scheduled';
            }).length;
            
            const doneLeads = leads.filter(l => {
              const status = String(l.sales_status || '').toLowerCase();
              return status === 'interested' || status === 'converted' || status === 'win/closed' || status === 'win' || status === 'closed';
            }).length;
            
            const notConnectedLeads = leads.filter(l => {
              const status = String(l.sales_status || '').toLowerCase();
              return status === 'not connected' || status === 'not_connected';
            }).length;
            
            const notInterestedLeads = leads.filter(l => {
              const status = String(l.sales_status || '').toLowerCase();
              return status === 'not interested' || status === 'not_interested' || status === 'lost';
            }).length;
            
            const scheduledMeetings = meetings.filter(m => {
              const status = String(m.status || '').toLowerCase();
              return status === 'scheduled' || status === 'pending';
            }).length;
            
            const completedMeetings = meetings.filter(m => {
              const status = String(m.status || '').toLowerCase();
              return status === 'completed';
            }).length;
            
            // Calculate order amounts
            const totalAmount = orders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
            const paidAmount = orders.reduce((sum, o) => sum + (parseFloat(o.paid_amount) || 0), 0);
            const dueAmount = orders.reduce((sum, o) => sum + (parseFloat(o.pending_amount) || 0), 0);
            
            // Count verified check-ins
            const verifiedCheckIns = checkIns.filter(c => c.status === 'Verified').length;
            
            return {
              id: u.id || idx,
              username: u.username || u.name || 'Unknown',
              email: u.email || '',
              department: apiToUiDepartment(u.department) || 'Marketing Department',
              role: apiToUiRole(u.role) || 'Department User',
              associatedEmail: u.assigned_email || u.email || '',
              date: u.createdAt || u.created_at ? new Date(u.createdAt || u.created_at).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : '',
              pending: { count: pendingLeads, total: totalLeads },
              followUp: { count: followUpLeads, total: totalLeads },
              done: { count: doneLeads, total: totalLeads },
              notConnected: { count: notConnectedLeads, total: totalLeads },
              notInterested: { count: notInterestedLeads, total: totalLeads },
              meetingScheduled: { count: scheduledMeetings, total: meetings.length },
              totalAmount: totalAmount,
              dueAmount: dueAmount,
              campaignLeads: totalLeads, // Using total leads as campaign leads
              socialMediaLeads: 0, // This would need to be tracked separately if needed
              verifiedCheckIns: verifiedCheckIns,
              totalMeetings: meetings.length,
              totalOrders: orders.length
            };
          } catch (err) {
            console.error(`Error calculating performance for user ${u.username}:`, err);
            // Return default values if calculation fails
            return {
              id: u.id || idx,
              username: u.username || u.name || 'Unknown',
              email: u.email || '',
              department: apiToUiDepartment(u.department) || 'Marketing Department',
              role: apiToUiRole(u.role) || 'Department User',
              associatedEmail: u.assigned_email || u.email || '',
              date: u.createdAt || u.created_at ? new Date(u.createdAt || u.created_at).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : '',
              pending: { count: 0, total: 0 },
              followUp: { count: 0, total: 0 },
              done: { count: 0, total: 0 },
              notConnected: { count: 0, total: 0 },
              notInterested: { count: 0, total: 0 },
              meetingScheduled: { count: 0, total: 0 },
              totalAmount: 0,
              dueAmount: 0,
              campaignLeads: 0,
              socialMediaLeads: 0,
              verifiedCheckIns: 0,
              totalMeetings: 0,
              totalOrders: 0
            };
          }
        }));
        
        console.log(`Successfully loaded performance data for ${userPerformanceData.length} marketing salespersons`);
        setUsers(userPerformanceData);
    } catch (err) {
      const errorMsg = err?.message || 'Failed to load marketing users';
      console.error('Error fetching marketing users:', err);
      setError(errorMsg);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Refresh function
  const handleRefresh = () => {
    fetchUsers();
  };

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
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...editFormData } : u));
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
    return filterUsers(users);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marketing User Performance</h1>
            <p className="text-gray-600">
              Performance metrics for all marketing salespersons
              {users.length > 0 && (
                <span className="ml-2 text-blue-600 font-medium">
                  ({users.length} {users.length === 1 ? 'salesperson' : 'salespersons'})
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>

        {loading && (
          <div className="p-4 mb-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
            Loading marketing users...
          </div>
        )}

        {error && (
          <div className="p-4 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

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
                  Showing {getFilteredUsers().length} of {users.length} users
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
        {getFilteredUsers().length === 0 && !loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <UserX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {users.length === 0 ? 'No Marketing Salespersons Found' : 'No Users Match Your Filters'}
            </h3>
            <p className="text-gray-600 mb-4">
              {users.length === 0 
                ? 'Please add marketing salespersons to the system. They will appear here once created with department type "marketing_sales".'
                : 'Try adjusting your search or date range filters to see more results.'
              }
            </p>
            {users.length === 0 && (
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            )}
          </div>
        ) : (
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
        )}
      </div>
      
      {/* User Details Drawer */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={closeUserModal}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl border-l border-gray-200 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Marketing User Performance Details</h2>
              <button onClick={closeUserModal} className="text-gray-400 hover:text-gray-600 transition-colors" title="Close">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
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
                <button onClick={closeUserModal} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">Close</button>
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
