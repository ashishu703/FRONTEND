import React, { useState } from 'react';
import { Shield, AlertTriangle, Lock, Key, User, Search, Download } from 'lucide-react';

const SecurityAuditLogs = () => {
  const [logs] = useState([
    {
      id: 1,
      type: 'Failed Login',
      user: 'vikram@anocab.com',
      ip: '192.168.1.47',
      timestamp: '2025-01-27 10:22 AM',
      severity: 'high',
      details: '3 consecutive failed login attempts'
    },
    {
      id: 2,
      type: 'API Access',
      user: 'system',
      ip: '10.0.0.5',
      timestamp: '2025-01-27 09:45 AM',
      severity: 'medium',
      details: 'Unusual API request pattern detected'
    },
    {
      id: 3,
      type: 'Password Reset',
      user: 'priya@anocab.com',
      ip: '192.168.1.52',
      timestamp: '2025-01-27 08:15 AM',
      severity: 'low',
      details: 'Password reset requested via email'
    }
  ]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-rose-100 text-rose-700 border-rose-300';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Security</p>
          <h1 className="text-2xl font-bold text-slate-900">Security & Audit Logs</h1>
          <p className="text-sm text-slate-500">Monitor security events and system activity</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500">
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      {/* Security Alerts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
            <span className="text-xs font-bold uppercase text-rose-700">High Severity</span>
          </div>
          <p className="text-3xl font-bold text-rose-700">3</p>
          <p className="text-xs text-rose-600">Failed login attempts</p>
        </div>
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-amber-600" />
            <span className="text-xs font-bold uppercase text-amber-700">Medium Severity</span>
          </div>
          <p className="text-3xl font-bold text-amber-700">1</p>
          <p className="text-xs text-amber-600">Unusual activity</p>
        </div>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-6 h-6 text-blue-600" />
            <span className="text-xs font-bold uppercase text-blue-700">Total Events</span>
          </div>
          <p className="text-3xl font-bold text-blue-700">156</p>
          <p className="text-xs text-blue-600">Last 24 hours</p>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{log.type}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{log.user}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{log.ip}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded border ${getSeverityColor(log.severity)}`}>
                      {log.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityAuditLogs;

