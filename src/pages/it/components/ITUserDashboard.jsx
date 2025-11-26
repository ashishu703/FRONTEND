import React from 'react';
import { Ticket, Server, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ITUserDashboard = ({ activeView, setActiveView }) => {
  const myTickets = [
    {
      id: 'TKT-001',
      title: 'Login page not loading',
      priority: 'high',
      status: 'In Progress',
      createdAt: '2025-01-27 10:30 AM'
    },
    {
      id: 'TKT-003',
      title: 'Database slow query issue',
      priority: 'critical',
      status: 'In Progress',
      createdAt: '2025-01-27 08:00 AM'
    }
  ];

  if (activeView === 'it-tickets') {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">My Work</p>
          <h1 className="text-2xl font-bold text-slate-900">My Assigned Tickets</h1>
        </div>
        <div className="space-y-3">
          {myTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{ticket.id}: {ticket.title}</p>
                  <p className="text-xs text-slate-500 mt-1">Created: {ticket.createdAt}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    ticket.priority === 'critical' ? 'bg-rose-100 text-rose-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded">
                    {ticket.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeView === 'it-systems') {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
          <h1 className="text-2xl font-bold text-slate-900">System Status</h1>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <span className="font-medium">CRM Cluster</span>
              <span className="text-emerald-600 font-semibold">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <span className="font-medium">Database</span>
              <span className="text-emerald-600 font-semibold">Connected</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">My Dashboard</p>
        <h1 className="text-2xl font-bold text-slate-900">IT User Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of your assigned work and system status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Ticket className="w-6 h-6 text-cyan-600" />
            <span className="text-xs font-semibold text-slate-500">My Tickets</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">2</p>
          <p className="text-xs text-slate-600 mt-1">Assigned to me</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-6 h-6 text-amber-600" />
            <span className="text-xs font-semibold text-slate-500">In Progress</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">2</p>
          <p className="text-xs text-slate-600 mt-1">Currently working</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-500">Resolved Today</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">5</p>
          <p className="text-xs text-slate-600 mt-1">Completed today</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">My Recent Tickets</h3>
        <div className="space-y-3">
          {myTickets.map((ticket) => (
            <div key={ticket.id} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{ticket.id}</p>
                  <p className="text-sm text-slate-600">{ticket.title}</p>
                </div>
                <button
                  onClick={() => setActiveView('it-tickets')}
                  className="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ITUserDashboard;

