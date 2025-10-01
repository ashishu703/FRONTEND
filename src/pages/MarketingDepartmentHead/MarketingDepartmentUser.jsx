import React, { useState, useRef, useEffect } from 'react';
import { Search, UserPlus, Upload, Edit, LogOut, Trash2, Hash, User, Mail, Shield, Building, Target, Calendar, MoreHorizontal, TrendingUp, AlertTriangle, LogIn } from 'lucide-react';
import departmentUsersService, { apiToUiDepartment } from '../../api/admin_api/departmentUsersService';
import { useAuth } from '../../context/AuthContext';

const UserManagementTable = ({ setActiveView }) => {
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
    target: ''
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const handleAddUser = () => setShowAddModal(true);
  const handleEdit = (userId) => {
    const u = users.find(x => x.id === userId);
    if (!u) return;
    setEditingUser({ ...u });
    setShowEditModal(true);
  };
  const handleLogout = () => {};
  const { impersonate } = useAuth();
  const handleDelete = async (userId) => {
    try {
      await departmentUsersService.deleteUser(userId);
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
      const res = await departmentUsersService.listUsers(params);
      const payload = res.data || res;
      const items = (payload.users || []).map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: 'DEPARTMENT USER',
        department: apiToUiDepartment(u.departmentType || u.department_type),
        target: typeof u.target === 'number' ? String(u.target) : (u.target || ''),
        achievedTarget: typeof u.achievedTarget === 'number' ? String(u.achievedTarget) : (u.achievedTarget || '0'),
        remainingTarget: (u.remainingTarget ?? u.remaining_target) !== undefined ? String(u.remainingTarget ?? u.remaining_target) : (u.target && u.achievedTarget ? String((+u.target) - (+u.achievedTarget)) : ''),
        createdAt: u.createdAt || u.created_at ? new Date(u.createdAt || u.created_at).toDateString() : ''
      }));
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
                <tr><td className="py-8 px-4 text-center text-gray-500" colSpan={10}>Loading...</td></tr>
              )}
              {!loading && filteredUsers.length === 0 && (
                <tr><td className="py-8 px-4 text-center text-gray-500" colSpan={10}>{error || 'No users found'}</td></tr>
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
                    <span className="text-gray-700">{user.createdAt}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          // Navigate to Marketing Salesperson dashboard with correct userType
                          const url = `${window.location.origin}/?login=true&userType=marketing-salesperson`;
                          window.open(url, '_blank');
                        }}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Open Marketing Salesperson Dashboard"
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
                  const payload = {
                    username: newUser.username,
                    email: newUser.email,
                    password: newUser.password,
                    headUserEmail: currentUser?.email,
                    target: Number(newUser.target || 0)
                  };
                  await departmentUsersService.createUser(payload);
                  await fetchUsers();
                  setShowAddModal(false);
                  setNewUser({ username: '', email: '', password: '', target: '' });
                } catch (err) {
                  setError(err.message || 'Failed to create user');
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
                  <label className="block text-xs text-gray-600 mb-1">Target (Rs)</label>
                  <input
                    type="number"
                    min="0"
                    value={newUser.target}
                    onChange={(e) => setNewUser({ ...newUser, target: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter target to assign"
                  />
                </div>
                
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
    </div>
  );
};

export default UserManagementTable;