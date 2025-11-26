import React, { useState } from 'react';
import { Ticket, Plus, Search, Filter, UserPlus, MessageSquare, Paperclip, Clock, AlertCircle, CheckCircle, X } from 'lucide-react';

const PRIORITIES = ['low', 'medium', 'high', 'critical'];
const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

const TicketManagement = () => {
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-001',
      title: 'Login page not loading',
      createdBy: 'Rahul Sharma',
      assignedTo: 'Amit Patel',
      priority: 'high',
      status: 'In Progress',
      createdAt: '2025-01-27 10:30 AM',
      sla: '4h remaining',
      description: 'Users reporting login page timeout error'
    },
    {
      id: 'TKT-002',
      title: 'Email notifications not sending',
      createdBy: 'Priya Singh',
      assignedTo: null,
      priority: 'medium',
      status: 'Open',
      createdAt: '2025-01-27 09:15 AM',
      sla: '2h remaining',
      description: 'Email service appears to be down'
    },
    {
      id: 'TKT-003',
      title: 'Database slow query issue',
      createdBy: 'IT System',
      assignedTo: 'Vikram Kumar',
      priority: 'critical',
      status: 'In Progress',
      createdAt: '2025-01-27 08:00 AM',
      sla: '1h remaining',
      description: 'Customer API queries taking >5 seconds'
    }
  ]);

  const [itUsers, setItUsers] = useState([
    { id: 1, name: 'Amit Patel', email: 'amit@anocab.com' },
    { id: 2, name: 'Vikram Kumar', email: 'vikram@anocab.com' },
    { id: 3, name: 'Sneha Reddy', email: 'sneha@anocab.com' },
    { id: 4, name: 'Rajesh Mehta', email: 'rajesh@anocab.com' }
  ]);

  const [showAssignModal, setShowAssignModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-rose-100 text-rose-700 border-rose-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-amber-100 text-amber-700';
      case 'Resolved': return 'bg-emerald-100 text-emerald-700';
      case 'Closed': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleAssign = (ticketId) => {
    if (!selectedUser) return;
    setTickets(tickets.map(t => 
      t.id === ticketId ? { ...t, assignedTo: itUsers.find(u => u.id === parseInt(selectedUser))?.name, status: 'In Progress' } : t
    ));
    setShowAssignModal(null);
    setSelectedUser('');
  };

  const handleStatusChange = (ticketId, newStatus) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Issue Management</p>
          <h1 className="text-2xl font-bold text-slate-900">Ticket Management</h1>
          <p className="text-sm text-slate-500">Track, assign, and resolve IT issues</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500">
          <Plus className="w-4 h-4" />
          New Ticket
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Priority</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">SLA</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-900">{ticket.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{ticket.title}</p>
                      <p className="text-xs text-slate-500">{ticket.createdAt}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{ticket.createdBy}</td>
                  <td className="px-6 py-4">
                    {ticket.assignedTo ? (
                      <span className="text-sm text-slate-600">{ticket.assignedTo}</span>
                    ) : (
                      <button
                        onClick={() => setShowAssignModal(ticket.id)}
                        className="inline-flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-700 font-medium"
                      >
                        <UserPlus className="w-3 h-3" />
                        Assign
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(ticket.status)} border-0 focus:ring-2 focus:ring-cyan-500`}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Clock className="w-3 h-3" />
                      {ticket.sla}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-slate-400 hover:text-slate-600">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-slate-600">
                        <Paperclip className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Assign Ticket</h3>
              <button onClick={() => setShowAssignModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4">Select IT team member to assign this ticket:</p>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-4"
            >
              <option value="">Select User</option>
              {itUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => handleAssign(showAssignModal)}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Assign
              </button>
              <button
                onClick={() => setShowAssignModal(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketManagement;

