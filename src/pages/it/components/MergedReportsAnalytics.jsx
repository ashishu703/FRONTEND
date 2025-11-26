import React, { useState } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle, Ticket, Activity, FileText, Download } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid } from 'recharts';

const MergedReportsAnalytics = () => {
  const ticketTrendData = [
    { name: 'Mon', open: 12, resolved: 8 },
    { name: 'Tue', open: 15, resolved: 10 },
    { name: 'Wed', open: 18, resolved: 12 },
    { name: 'Thu', open: 16, resolved: 14 },
    { name: 'Fri', open: 18, resolved: 15 },
    { name: 'Sat', open: 10, resolved: 12 },
    { name: 'Sun', open: 8, resolved: 9 }
  ];

  const uptimeData = [
    { name: 'Week 1', uptime: 99.8 },
    { name: 'Week 2', uptime: 99.9 },
    { name: 'Week 3', uptime: 99.7 },
    { name: 'Week 4', uptime: 99.8 }
  ];

  const ticketStatusData = [
    { name: 'Open', value: 18, color: '#3b82f6' },
    { name: 'In Progress', value: 12, color: '#f59e0b' },
    { name: 'Resolved', value: 27, color: '#10b981' },
    { name: 'Closed', value: 45, color: '#6b7280' }
  ];

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#6b7280'];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Analytics</p>
          <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-sm text-slate-500">Technical performance insights and metrics</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Average Resolution', value: '3.4 hours', icon: Clock, color: 'cyan' },
          { label: 'Server Uptime', value: '99.8%', icon: Activity, color: 'emerald' },
          { label: 'Resolved Today', value: '27', icon: CheckCircle, color: 'blue' },
          { label: 'Active Tickets', value: '18', icon: Ticket, color: 'amber' }
        ].map((metric, index) => {
          const Icon = metric.icon;
          const colorClasses = {
            cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600' },
            emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
            blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
            amber: { bg: 'bg-amber-50', text: 'text-amber-600' }
          };
          const colors = colorClasses[metric.color] || colorClasses.cyan;
          return (
            <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <p className="text-xs text-slate-500">{metric.label}</p>
              </div>
              <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Trend Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Ticket Resolution Trends (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ticketTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="open" stroke="#ef4444" strokeWidth={2} name="Open Tickets" />
              <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} name="Resolved Tickets" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Ticket Status Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Ticket Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ticketStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {ticketStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Uptime Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">System Uptime Report (Monthly)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={uptimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[99.0, 100]} />
            <Tooltip />
            <Bar dataKey="uptime" fill="#10b981" name="Uptime %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MergedReportsAnalytics;

