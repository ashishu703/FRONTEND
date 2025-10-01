import React, { useState, useEffect } from 'react';
import { Search, Plus, RefreshCw, Edit, Trash2, LogOut, Calendar, Users, Building, User, Mail, Filter, Eye, EyeOff, X } from 'lucide-react';
import departmentHeadService, { uiToApiDepartment, apiToUiDepartment } from '../../api/admin_api/departmentHeadService';
import departmentUserService from '../../api/admin_api/departmentUserService';
import { useAuth } from '../../context/AuthContext';

const DepartmentManagement = () => {
  const { register, login, impersonate, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Departments');
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [departments, setDepartments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [newDept, setNewDept] = useState({
    username: '',
    email: '',
    password: '',
    departmentType: 'office_sales',
    companyName: 'Anode Electric Pvt. Ltd.',
    role: 'department_head',
    monthlyTarget: ''
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [stats, setStats] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isSuperAdmin = (user?.role === 'superadmin');
  const isDepartmentHead = (user?.role === 'department_head');

  const getDepartmentTypeColor = (type) => {
    switch (type) {
      case 'Sales Department':
        return 'bg-green-50 text-green-600 border border-green-200';
      case 'Marketing Department':
        return 'bg-purple-50 text-purple-600 border border-purple-200';
      case 'Telesales Department':
        return 'bg-gray-50 text-gray-600 border border-gray-200';
      default:
        return 'bg-blue-50 text-blue-600 border border-blue-200';
    }
  };

  const getRoleColor = (role) => {
    return role === 'Department Head' 
      ? 'bg-blue-50 text-blue-600 border border-blue-200'
      : 'bg-gray-50 text-gray-600 border border-gray-200';
  };

  const mapUserFromApi = (user) => {
    const createdAtRaw = user.createdAt || user.created_at;
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      password: '',
      departmentType: apiToUiDepartment(user.departmentType || user.department_type),
      companyName: user.companyName || user.company_name,
      role: 'Department Head',
      target: user.target ?? user.monthlyTarget ?? '',
      isActive: user.isActive ?? user.is_active,
      createdAt: createdAtRaw ? new Date(createdAtRaw).toDateString() : '',
    };
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit,
      };
      if (selectedFilter !== 'All Departments') params.departmentType = uiToApiDepartment(selectedFilter);
      if (searchTerm.trim()) params.search = searchTerm.trim();
      
      // Fetch only department heads (UI supports heads only)
      const headsRes = await departmentHeadService.listHeads(params);
      const heads = (headsRes.users || headsRes.data?.users || []).map(mapUserFromApi);
      const sorted = heads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setDepartments(sorted);
      
      // Use pagination from heads response (they should be the same)
      const pagination = headsRes.pagination || headsRes.data?.pagination || {};
      if (pagination) {
        setTotal(pagination.total || 0);
        setPages(pagination.pages || 0);
      }
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await departmentUserService.getStats();
      setStats(res);
    } catch (err) {
      console.warn('Failed to load stats', err);
    }
  };

  const reload = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchUsers(), fetchStats()]);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, selectedFilter, roleFilter, searchTerm]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!isSuperAdmin && user?.departmentType) {
      setSelectedFilter(apiToUiDepartment(user.departmentType));
    }
  }, [isSuperAdmin, user?.departmentType]);

  const handleEdit = (dept) => {
    setSelectedDept(dept);
    setShowEditModal(true);
  };

  const handleDelete = async (deptId) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await departmentHeadService.deleteHead(deptId);
      await fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  // Update department function
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        username: selectedDept.username,
        email: selectedDept.email,
        departmentType: uiToApiDepartment(selectedDept.departmentType),
        companyName: selectedDept.companyName,
        role: 'department_head',
        monthlyTarget: selectedDept.monthlyTarget,
      };
      if (selectedDept.password) payload.password = selectedDept.password;
      await departmentHeadService.updateHead(selectedDept.id, payload);
      await fetchUsers();
      setShowEditModal(false);
      setSelectedDept(null);
    } catch (err) {
      alert(err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const isWithinDateRange = (dateStr) => {
    if (!dateFrom && !dateTo) return true;
    const parsed = new Date(dateStr);
    const fromOk = dateFrom ? parsed >= new Date(dateFrom) : true;
    const toOk = dateTo ? parsed <= new Date(dateTo) : true;
    return fromOk && toOk;
  };

  const filteredDepartments = departments.filter((dept) => {
    const matchesDate = isWithinDateRange(dept.createdAt);
    return matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">{total}</div>
                <div className="text-gray-500 text-sm">Total Departments</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-1">{(stats?.byRole || []).find(r => r.role === 'department_head')?.totalUsers || 0}</div>
                <div className="text-gray-500 text-sm">Department Heads</div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-1">{(stats?.byDepartment || []).length || new Set(departments.map(dept => dept.departmentType)).size}</div>
                <div className="text-gray-500 text-sm">Department Types</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Building className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between gap-6">
            <div className="relative w-full sm:w-1/4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-5 h-11 border border-gray-200 rounded-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 text-sm"
              />
            </div>
            
            <div className="flex items-center gap-3">
              {isSuperAdmin && (
                <button
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus className="w-4 h-4" />
                  Add Department
                </button>
              )}

              <button
                className="p-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors"
                aria-label="Refresh"
                title="Refresh"
                onClick={() => reload()}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>

              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                disabled={!isSuperAdmin}
                className={`h-9 px-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm ${!isSuperAdmin ? 'opacity-60 cursor-not-allowed' : ''}`}
                title="Department Type"
                aria-label="Department Type"
              >
                <option>All Departments</option>
                <option>Sales Department</option>
                <option>Marketing Department</option>
                <option>Telesales Department</option>
              </select>

              <button
                className="p-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors"
                onClick={() => setShowFilters((s) => !s)}
                aria-expanded={showFilters}
                aria-controls="advanced-filters"
                aria-label="Filter"
                title="Filter"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
          {showFilters && (
            <div id="advanced-filters" className="mt-4 border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              {isSuperAdmin && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Role</label>
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option>All Roles</option>
                  <option>Department Head</option>
                  <option>Department User</option>
                </select>
              </div>
              )}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Head User</label>
                <input
                  type="text"
                  placeholder="e.g. admin@mbg.com"
                  value={headUserFilter}
                  onChange={(e) => setHeadUserFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="md:col-span-4 flex items-center justify-end gap-3">
                <button
                  className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
                  onClick={() => {
                    setRoleFilter('All Roles');
                    setHeadUserFilter('');
                    setDateFrom('');
                    setDateTo('');
                  }}
                >
                  Clear
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => setShowFilters(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          {loading ? (
            <div className="text-center py-16">Loading...</div>
          ) : filteredDepartments.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
              <p className="text-gray-500 mb-6">
                {departments.length === 0 
                  ? "Get started by adding your first department user."
                  : "No departments match your current filters. Try adjusting your search criteria."
                }
              </p>
              {departments.length === 0 && (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus className="w-4 h-4" />
                  Add First Department
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              {error && (
                <div className="text-sm text-red-600 p-3">{error}</div>
              )}
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-700">
                    <th className="text-left py-3 px-5 text-xs font-medium text-gray-500 w-12">#</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        Username
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        Email
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-green-600" />
                        Department Type
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-indigo-600" />
                        Company Name
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-600" />
                        Role
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-pink-600" />
                        Target (Rs)
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        Created At
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      <div className="flex items-center gap-2">
                        <Edit className="w-4 h-4 text-cyan-600" />
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.map((dept, index) => (
                    <tr key={dept.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-5 text-xs text-gray-500 align-top">{index + 1}</td>
                      <td className="py-3 px-6 text-sm text-gray-900 font-semibold">{dept.username}</td>
                      <td className="py-3 px-6 text-sm text-gray-700">{dept.email}</td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getDepartmentTypeColor(dept.departmentType)}`}>
                          {dept.departmentType}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-200">
                          {dept.companyName || 'Anode Electric Pvt. Ltd.'}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(dept.role)}`}>
                          {dept.role}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-sm text-gray-700">{String(dept.target ?? '')}</td>
                      <td className="py-3 px-6 text-xs text-gray-500 whitespace-nowrap">{dept.createdAt}</td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            onClick={() => handleEdit(dept)}
                            title="Edit Department"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            onClick={() => handleDelete(dept.id)}
                            title="Delete Department"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                            onClick={async () => {
                              // Check if current user is superadmin
                              const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
                              if (currentUser && currentUser.role === 'superadmin') {
                                // Superadmin can directly switch without password
                                try {
                                  const result = await impersonate(dept.email);
                                  if (result.success) {
                                    const token = result.token || result?.user?.token || '';
                                    const url = `${window.location.origin}/?impersonateToken=${encodeURIComponent(token)}`;
                                    window.open(url, '_blank');
                                  } else {
                                    alert('Failed to switch user');
                                  }
                                } catch (err) {
                                  alert('Failed to switch user');
                                }
                              } else {
                                setLoginData({
                                  email: dept.email,
                                  password: ''
                                });
                                setShowLoginModal(true);
                              }
                            }}
                            title="Login as this user"
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between p-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">Page {page} of {Math.max(pages, 1)} • Total {total}</div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1.5 border border-gray-200 rounded disabled:opacity-50"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </button>
                  <button
                    className="px-3 py-1.5 border border-gray-200 rounded disabled:opacity-50"
                    disabled={page >= pages}
                    onClick={() => setPage((p) => (pages ? Math.min(pages, p + 1) : p + 1))}
                  >
                    Next
                  </button>
                  <select
                    className="ml-2 h-9 px-2 border border-gray-200 rounded"
                    value={limit}
                    onChange={(e) => { setPage(1); setLimit(parseInt(e.target.value)); }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Department Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-gray-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900">Add Department User</h3>
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
                    const payload = {
                      username: newDept.username,
                      email: newDept.email,
                      password: newDept.password,
                      departmentType: newDept.departmentType,
                      companyName: newDept.companyName,
                      role: newDept.role,
                      monthlyTarget: newDept.monthlyTarget,
                    };
                    const result = await register(payload);
                    if (result.success) {
                      await fetchUsers();
                      setShowAddModal(false);
                      setNewDept({ username: '', email: '', password: '', departmentType: 'office_sales', companyName: 'Anode Electric Pvt. Ltd.', role: 'department_head', monthlyTarget: '' });
                    } else {
                      alert(result.error || 'Failed to create user');
                    }
                  } catch (err) {
                    alert(err.message || 'Failed to create user');
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
                      value={newDept.username}
                      onChange={(e) => setNewDept({ ...newDept, username: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="e.g. john_doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={newDept.email}
                      onChange={(e) => setNewDept({ ...newDept, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={newDept.password}
                        onChange={(e) => setNewDept({ ...newDept, password: e.target.value })}
                        className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Department Type</label>
                    <select
                      value={newDept.departmentType}
                      onChange={(e) => setNewDept({ ...newDept, departmentType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="office_sales">Sales Department</option>
                      <option value="marketing_sales">Marketing Department</option>
                      <option value="telesales">Telesales Department</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Company Name</label>
                    <select
                      value={newDept.companyName}
                      onChange={(e) => setNewDept({ ...newDept, companyName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option>Anode Electric Pvt. Ltd.</option>
                      <option>Anode Metals</option>
                      <option>Samrridhi Industries</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Role</label>
                    <select
                      value={newDept.role}
                      onChange={(e) => setNewDept({ ...newDept, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="department_head">Department Head</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Monthly Target (Rs)</label>
                    <input
                      type="number"
                      required
                      value={newDept.monthlyTarget}
                      onChange={(e) => setNewDept({ ...newDept, monthlyTarget: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter monthly target in Rs"
                    />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Department Modal */}
        {showEditModal && selectedDept && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-gray-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900">Edit Department User</h3>
                <button
                  className="p-2 text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedDept(null);
                  }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Username</label>
                    <input
                      type="text"
                      required
                      value={selectedDept.username}
                      onChange={(e) => setSelectedDept({ ...selectedDept, username: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="e.g. john_doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={selectedDept.email}
                      onChange={(e) => setSelectedDept({ ...selectedDept, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showEditPassword ? "text" : "password"}
                        
                        value={selectedDept.password}
                        onChange={(e) => setSelectedDept({ ...selectedDept, password: e.target.value })}
                        className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Leave blank to keep current password (min 6 if set)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditPassword(!showEditPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Department Type</label>
                    <select
                      value={selectedDept.departmentType}
                      onChange={(e) => setSelectedDept({ ...selectedDept, departmentType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option>Sales Department</option>
                      <option>Marketing Department</option>
                      <option>Telesales Department</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Company Name</label>
                    <select
                      value={selectedDept.companyName}
                      onChange={(e) => setSelectedDept({ ...selectedDept, companyName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option>Anode Electric Pvt. Ltd.</option>
                      <option>Anode Metals</option>
                      <option>Samrridhi Industries</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Role</label>
                    <select
                      value={selectedDept.role}
                      onChange={(e) => setSelectedDept({ ...selectedDept, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option>Department Head</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Monthly Target (Rs)</label>
                    <input
                      type="number"
                      value={selectedDept.monthlyTarget || selectedDept.target || ''}
                      onChange={(e) => setSelectedDept({ ...selectedDept, monthlyTarget: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter monthly target in Rs"
                    />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedDept(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-gray-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900">Login as User</h3>
                <button
                  className="p-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowLoginModal(false)}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSaving(true);
                  try {
                    const result = await login(loginData.email, loginData.password);
                    if (result.success) {
                      setShowLoginModal(false);
                      // The App component will automatically redirect based on user role
                    } else {
                      alert(result.error || 'Login failed');
                    }
                  } catch (err) {
                    alert(err.message || 'Login failed');
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        required
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
                    onClick={() => setShowLoginModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentManagement;
