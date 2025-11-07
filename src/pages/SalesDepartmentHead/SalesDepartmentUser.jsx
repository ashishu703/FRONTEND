import React, { useState, useRef, useEffect } from 'react';
import { Search, UserPlus, Upload, Edit, LogOut, Trash2, Hash, User, Mail, Shield, Building, Target, Calendar, MoreHorizontal, TrendingUp, AlertTriangle, LogIn } from 'lucide-react';
import departmentUserService, { apiToUiDepartment } from '../../api/admin_api/departmentUserService';
import { useAuth } from '../../context/AuthContext';
import toastManager from '../../utils/ToastManager';

const SalesDepartmentUser = ({ setActiveView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.achievedTarget.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.remainingTarget.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // UI state (to preserve previous experience)
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    target: '',
    targetStartDate: '',
    targetDurationDays: '30',
    customDays: '' // Separate field for custom days input
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const handleAddUser = () => setShowAddModal(true);
  const handleEdit = (userId) => {
    const u = users.find(x => x.id === userId);
    if (!u) return;
    // Initialize customDays if current duration is not in standard options
    const currentDuration = String(u.targetDurationDays || u.target_duration_days || '30');
    const isCustom = !['15', '30', '60', '90'].includes(currentDuration);
    
    // Format date for input field (YYYY-MM-DD format) - use already formatted input date if available
    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString + 'T00:00:00');
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
      } catch {
        return '';
      }
    };
    
    setEditingUser({ 
      ...u, 
      targetDurationDays: isCustom ? 'custom' : currentDuration,
      customDays: isCustom ? currentDuration : '',
      targetStartDateInput: u.targetStartDateInput || formatDateForInput(u.targetStartDate || u.target_start_date),
      targetEndDateInput: u.targetEndDateInput || formatDateForInput(u.targetEndDate || u.target_end_date)
    });
    setShowEditModal(true);
  };
  const handleLogout = () => {};
  const { impersonate } = useAuth();
  const handleDelete = async (userId) => {
    try {
      await departmentUserService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const fileInputRef = React.useRef(null);
  const handleImportClick = () => fileInputRef.current?.click();
  const handleFileChange = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      const text = await file.text();
      const rows = text.split(/\r?\n/).filter(Boolean);
      if (rows.length <= 1) return;
      const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
      const getIndex = (n) => headers.indexOf(n);
      const idx = {
        username: getIndex('username'),
        email: getIndex('email'),
        target: getIndex('target'),
        createdAt: getIndex('createdat'),
      };
      const parsed = rows.slice(1).map((line, i) => {
        const cols = line.split(',');
        return {
          id: (users.at(-1)?.id ?? 0) + i + 1,
          username: idx.username >= 0 ? cols[idx.username]?.trim() : '',
          email: idx.email >= 0 ? cols[idx.email]?.trim() : '',
          target: idx.target >= 0 ? cols[idx.target]?.trim() : '',
          achievedTarget: '0',
          remainingTarget: '',
          createdAt: idx.createdAt >= 0 ? cols[idx.createdAt]?.trim() : new Date().toDateString(),
        };
      }).filter(u => u.username || u.email);
      if (parsed.length) setUsers(prev => [...parsed, ...prev]);
    } catch (err) {
      console.warn('Import failed', err);
    } finally {
      e.target.value = '';
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      const res = await departmentUserService.listUsers(params);
      const payload = res.data || res;
      const items = (payload.users || []).map(u => {
        const target = parseFloat(u.target || 0);
        const achievedTarget = parseFloat(u.achievedTarget || u.achieved_target || 0);
        const remainingTarget = target - achievedTarget;
        
        // Format dates properly for display (supports 'YYYY-MM-DD' and full ISO strings)
        const formatDateForDisplay = (dateString) => {
          if (!dateString) return null;
          try {
            const normalized = typeof dateString === 'string' && dateString.includes('T')
              ? dateString
              : `${dateString}T00:00:00`;
            const date = new Date(normalized);
            if (isNaN(date.getTime())) return null;
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            return `${month}/${day}/${year}`;
          } catch {
            return null;
          }
        };

        const formatDateForInput = (dateString) => {
          if (!dateString) return '';
          try {
            const normalized = typeof dateString === 'string' && dateString.includes('T')
              ? dateString
              : `${dateString}T00:00:00`;
            const date = new Date(normalized);
            if (isNaN(date.getTime())) return '';
            return date.toISOString().split('T')[0];
          } catch {
            return '';
          }
        };
        
        return {
          id: u.id,
          username: u.username,
          email: u.email,
          role: 'DEPARTMENT USER',
          department: apiToUiDepartment(u.departmentType || u.department_type),
          target: String(target),
          achievedTarget: String(achievedTarget),
          remainingTarget: String(remainingTarget),
          targetStartDate: u.targetStartDate || u.target_start_date || null,
          targetEndDate: u.targetEndDate || u.target_end_date || null,
          targetDurationDays: u.targetDurationDays || u.target_duration_days || null,
          targetStatus: u.targetStatus || u.target_status || 'active',
          createdAt: u.createdAt || u.created_at ? new Date(u.createdAt || u.created_at).toDateString() : '',
          // Add formatted dates for display
          targetStartDateDisplay: formatDateForDisplay(u.targetStartDate || u.target_start_date),
          targetEndDateDisplay: formatDateForDisplay(u.targetEndDate || u.target_end_date),
          // Add formatted dates for input fields
          targetStartDateInput: formatDateForInput(u.targetStartDate || u.target_start_date),
          targetEndDateInput: formatDateForInput(u.targetEndDate || u.target_end_date)
        };
      });
      setUsers(items);
      const pagination = payload.pagination || {};
      setTotal(pagination.total || 0);
      setPages(pagination.pages || 0);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, searchTerm]);

  const getDepartmentBadgeColor = (department) => {
    switch (department) {
      case 'SALES DEPARTMENT':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'OFFICE SALES DEPARTMENT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MARKETING DEPARTMENT':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Search and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by username, email, department type, target, achieved target, or remaining target"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            />
          </div>
          
          <div className="flex items-center gap-3 ml-6">
            <button
              onClick={handleAddUser}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
            <button
              onClick={handleImportClick}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <Hash className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-700">#</span>
                  </div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <User className="w-4 h-4 text-blue-600" />
                    Username
                  </div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    Email
                  </div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <Shield className="w-4 h-4 text-orange-600" />
                    Role
                  </div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <Building className="w-4 h-4 text-indigo-600" />
                    Department Type
                  </div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <Target className="w-4 h-4 text-cyan-600" />
                    Target
                  </div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    Achieved Target
                  </div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Remaining Target
                  </div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    Target Period
                  </div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Status
                  </div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    Created At
                  </div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <MoreHorizontal className="w-4 h-4" />
                    Action
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td className="py-8 px-4 text-center text-gray-500" colSpan={12}>Loading...</td></tr>
              )}
              {!loading && filteredUsers.length === 0 && (
                <tr><td className="py-8 px-4 text-center text-gray-500" colSpan={12}>{error || 'No users found'}</td></tr>
              )}
              {!loading && filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-gray-700 font-medium">{user.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900 font-medium">{user.username}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-700">{user.email}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-center">
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-lg border border-gray-200">
                        DEPARTMENT
                      </span>
                      <div className="text-xs text-gray-600 mt-1">USER</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${getDepartmentBadgeColor(user.department)}`}>
                      {user.department}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-600">{user.target}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md">{user.achievedTarget}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-red-600 font-medium bg-red-50 px-2 py-1 rounded-md">{user.remainingTarget}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-xs text-gray-600">
                      {user.targetStartDateDisplay ? (
                        <>
                          <div>From: {user.targetStartDateDisplay}</div>
                          <div>To: {user.targetEndDateDisplay || 'N/A'}</div>
                          {user.targetDurationDays && <div className="text-gray-500">({user.targetDurationDays} days)</div>}
                        </>
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2 py-1 rounded-md text-xs font-semibold ${
                      user.targetStatus === 'achieved' ? 'bg-green-100 text-green-800' :
                      user.targetStatus === 'overachieved' ? 'bg-blue-100 text-blue-800' :
                      user.targetStatus === 'unachieved' ? 'bg-red-100 text-red-800' :
                      user.targetStatus === 'expired' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.targetStatus?.toUpperCase() || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-700">{user.createdAt}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={user.targetStatus === 'achieved' || user.targetStatus === 'unachieved' || user.targetStatus === 'overachieved' ? 'Set New Target' : 'Edit Target'}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          // Login as this specific user
                          try {
                            const result = await impersonate(user.email);
                            if (result.success) {
                              const token = result.token || result?.user?.token || '';
                              const url = `${window.location.origin}/?impersonateToken=${encodeURIComponent(token)}`;
                              window.open(url, '_blank');
                            } else {
                              alert(result.error || 'Failed to login as user');
                            }
                          } catch (err) {
                            alert('Failed to login as user: ' + (err.message || 'Unknown error'));
                          }
                        }}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Login as this user"
                      >
                        <LogIn className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* Table Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50" disabled>
              Previous
            </button>
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">1</span>
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Add User</h3>
              <button
                className="p-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSaving(true);
                try {
                  // Only set dates if explicitly provided - no auto-selection
                  const payload = {
                    username: newUser.username,
                    email: newUser.email,
                    password: newUser.password,
                    headUserEmail: currentUser?.email,
                    target: Number(newUser.target || 0)
                  };
                  
                  // Only add target dates if both start date and duration are provided
                  if (newUser.targetStartDate && newUser.targetStartDate.trim() !== '' && 
                      newUser.targetDurationDays && newUser.targetDurationDays !== '') {
                    const targetStartDate = new Date(newUser.targetStartDate);
                    if (!isNaN(targetStartDate.getTime())) {
                      const targetDurationDays = newUser.targetDurationDays === 'custom' 
                        ? parseInt(newUser.customDays || 0)
                        : parseInt(newUser.targetDurationDays || 0);
                      
                      if (targetDurationDays > 0) {
                        const targetEndDate = new Date(targetStartDate);
                        targetEndDate.setDate(targetEndDate.getDate() + targetDurationDays);
                        payload.targetStartDate = targetStartDate.toISOString().split('T')[0];
                        payload.targetDurationDays = targetDurationDays;
                      }
                    }
                  }
                  await departmentUserService.createUser(payload);
                  await fetchUsers();
                  setShowAddModal(false);
                  setNewUser({ username: '', email: '', password: '', target: '', targetStartDate: '', targetDurationDays: '30', customDays: '' });
                  toastManager.success('User created successfully');
                } catch (err) {
                  // Extract error message from API response
                  const errorMessage = err?.data?.error || err?.data?.message || err?.message || 'Failed to create user';
                  setError(errorMessage);
                  toastManager.error(errorMessage);
                } finally {
                  setSaving(false);
                }
              }}
            >
              <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Payment Target (Rs)</label>
                  <input
                    type="number"
                    min="0"
                    value={newUser.target}
                    onChange={(e) => setNewUser({ ...newUser, target: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter payment target"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Target Start Date</label>
                  <input
                    type="date"
                    value={newUser.targetStartDate}
                    onChange={(e) => setNewUser({ ...newUser, targetStartDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Target Duration (Days)</label>
                  <select
                    value={newUser.targetDurationDays}
                    onChange={(e) => setNewUser({ ...newUser, targetDurationDays: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="15">15 Days</option>
                    <option value="30">30 Days (Monthly)</option>
                    <option value="60">60 Days (2 Months)</option>
                    <option value="90">90 Days (Quarterly)</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                {newUser.targetDurationDays === 'custom' && (
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Custom Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      value={newUser.customDays || ''}
                      onChange={(e) => setNewUser({ ...newUser, customDays: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter number of days"
                    />
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Edit User</h3>
              <button
                className="p-2 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSavingEdit(true);
                try {
                  // Build base payload
                  const payload = {
                    username: editingUser.username,
                    email: editingUser.email,
                    target: Number(editingUser.target || 0)
                  };
                  
                  // Handle target date updates - only if explicitly set
                  const hasTargetStartDate = editingUser.targetStartDate && 
                                           editingUser.targetStartDate.trim() !== '';
                  const hasTargetDuration = editingUser.targetDurationDays && 
                                          editingUser.targetDurationDays !== '';
                  
                  // Only update target dates if explicitly provided - no auto-selection
                  if (hasTargetStartDate || hasTargetDuration) {
                    let targetStartDate = null;
                    let targetDurationDays = null;
                    
                    // Determine targetStartDate - use provided value or existing, NO auto-defaults
                    if (hasTargetStartDate) {
                      targetStartDate = new Date(editingUser.targetStartDate);
                      if (isNaN(targetStartDate.getTime())) {
                        targetStartDate = null; // Invalid date, don't proceed
                      }
                    } else if (editingUser.target_start_date) {
                      targetStartDate = new Date(editingUser.target_start_date);
                    }
                    // No else - if not provided and no existing, leave as null
                    
                    // Determine targetDurationDays - use provided value or existing, NO auto-defaults
                    if (hasTargetDuration) {
                      if (editingUser.targetDurationDays === 'custom') {
                        targetDurationDays = editingUser.customDays ? parseInt(editingUser.customDays) : null;
                      } else {
                        targetDurationDays = parseInt(editingUser.targetDurationDays);
                      }
                      if (isNaN(targetDurationDays) || targetDurationDays <= 0) {
                        targetDurationDays = null; // Invalid duration, don't proceed
                      }
                    } else if (editingUser.target_duration_days) {
                      targetDurationDays = parseInt(editingUser.target_duration_days);
                    }
                    // No else - if not provided and no existing, leave as null
                    
                    // Only calculate and add to payload if we have valid start date AND duration
                    if (targetStartDate && !isNaN(targetStartDate.getTime()) && targetDurationDays && targetDurationDays > 0) {
                      const targetEndDate = new Date(targetStartDate);
                      targetEndDate.setDate(targetEndDate.getDate() + targetDurationDays);
                      
                      // Add to payload as ISO date strings (YYYY-MM-DD)
                      payload.targetStartDate = targetStartDate.toISOString().split('T')[0];
                      payload.targetEndDate = targetEndDate.toISOString().split('T')[0];
                      payload.targetDurationDays = targetDurationDays;
                    }
                    // If invalid combination, don't add dates to payload (keeps existing or null)
                  }
                  
                  await departmentUserService.updateUser(editingUser.id, payload);
                  await fetchUsers();
                  setShowEditModal(false);
                  setEditingUser(null);
                  toastManager.success('User updated successfully');
                } catch (err) {
                  // Extract error message from API response
                  const errorMessage = err?.data?.error || err?.data?.message || err?.message || 'Failed to update user';
                  setError(errorMessage);
                  toastManager.error(errorMessage);
                } finally {
                  setSavingEdit(false);
                }
              }}
            >
              <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={editingUser.username || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editingUser.email || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Payment Target (Rs)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingUser.target || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, target: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter payment target"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Target Start Date</label>
                  <input
                    type="date"
                    value={editingUser.targetStartDateInput || editingUser.targetStartDate || 
                          (editingUser.target_start_date ? new Date(editingUser.target_start_date + 'T00:00:00').toISOString().split('T')[0] : '')}
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      setEditingUser({ 
                        ...editingUser, 
                        targetStartDate: dateValue,
                        targetStartDateInput: dateValue
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Target Duration (Days)</label>
                  <select
                    value={editingUser.targetDurationDays || (editingUser.target_duration_days && !['15', '30', '60', '90'].includes(String(editingUser.target_duration_days)) ? 'custom' : String(editingUser.target_duration_days)) || '30'}
                    onChange={(e) => {
                      const newState = { ...editingUser, targetDurationDays: e.target.value };
                      // If switching away from custom, clear customDays
                      if (e.target.value !== 'custom') {
                        newState.customDays = '';
                      }
                      setEditingUser(newState);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="15">15 Days</option>
                    <option value="30">30 Days (Monthly)</option>
                    <option value="60">60 Days (2 Months)</option>
                    <option value="90">90 Days (Quarterly)</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                {(editingUser.targetDurationDays === 'custom' || (editingUser.target_duration_days && !['15', '30', '60', '90'].includes(String(editingUser.target_duration_days)))) && (
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Custom Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      value={editingUser.customDays || editingUser.target_duration_days || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, customDays: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter number of days"
                    />
                  </div>
                )}
                {editingUser.targetStatus && editingUser.targetStatus !== 'active' && (
                  <div className="md:col-span-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800">
                      <strong>Current Status:</strong> {editingUser.targetStatus.toUpperCase()}
                      <br />
                      Setting a new target will reset status to ACTIVE.
                    </p>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {savingEdit ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDepartmentUser;
