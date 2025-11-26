import React, { useState } from 'react';
import { Users, UserPlus, Lock, Unlock, Search, Shield, Key, Clock, Mail } from 'lucide-react';

const UserAccessManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul@anocab.com',
      role: 'Sales',
      status: 'Active',
      lastLogin: '2025-01-27 09:30 AM',
      permissions: ['view_leads', 'create_leads'],
      loginAttempts: 0
    },
    {
      id: 2,
      name: 'Priya Singh',
      email: 'priya@anocab.com',
      role: 'Marketing',
      status: 'Active',
      lastLogin: '2025-01-27 08:15 AM',
      permissions: ['view_leads', 'edit_leads'],
      loginAttempts: 0
    },
    {
      id: 3,
      name: 'Amit Patel',
      email: 'amit@anocab.com',
      role: 'IT User',
      status: 'Active',
      lastLogin: '2025-01-27 10:00 AM',
      permissions: ['view_tickets', 'resolve_tickets'],
      loginAttempts: 2
    },
    {
      id: 4,
      name: 'Vikram Kumar',
      email: 'vikram@anocab.com',
      role: 'IT User',
      status: 'Locked',
      lastLogin: '2025-01-26 03:45 PM',
      permissions: ['view_tickets'],
      loginAttempts: 5
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLockUser = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: 'Locked' } : u));
  };

  const handleUnlockUser = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: 'Active', loginAttempts: 0 } : u));
  };

  const handlePasswordReset = (userId) => {
    alert(`Password reset email sent to ${users.find(u => u.id === userId)?.email}`);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Access Control</p>
          <h1 className="text-2xl font-bold text-slate-900">User & Access Management</h1>
          <p className="text-sm text-slate-500">Create, manage, and control user access and permissions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500"
        >
          <UserPlus className="w-4 h-4" />
          Create User
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold bg-cyan-100 text-cyan-700 rounded">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      user.status === 'Active' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {user.status}
                      {user.loginAttempts > 3 && (
                        <span className="ml-1 text-amber-600">({user.loginAttempts} failed)</span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.slice(0, 2).map((perm, idx) => (
                        <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {perm.replace('_', ' ')}
                        </span>
                      ))}
                      {user.permissions.length > 2 && (
                        <span className="text-xs text-slate-500">+{user.permissions.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.status === 'Active' ? (
                        <button
                          onClick={() => handleLockUser(user.id)}
                          className="p-1 text-rose-400 hover:text-rose-600"
                          title="Lock User"
                        >
                          <Lock className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnlockUser(user.id)}
                          className="p-1 text-emerald-400 hover:text-emerald-600"
                          title="Unlock User"
                        >
                          <Unlock className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handlePasswordReset(user.id)}
                        className="p-1 text-cyan-400 hover:text-cyan-600"
                        title="Reset Password"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Logs Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity Logs</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Rahul Sharma logged in</p>
                <p className="text-xs text-slate-500">IP: 192.168.1.47 | 2025-01-27 09:30 AM</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-rose-600" />
              <div>
                <p className="text-sm font-semibold text-slate-900">3 failed login attempts</p>
                <p className="text-xs text-slate-500">vikram@anocab.com | IP: 192.168.1.47</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Password reset requested</p>
                <p className="text-xs text-slate-500">priya@anocab.com | 2025-01-27 08:15 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create New User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
                <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
                <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Role</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                  <option>Sales</option>
                  <option>Marketing</option>
                  <option>IT User</option>
                  <option>Admin</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded-lg">
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccessManagement;

