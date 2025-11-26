import React from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, WifiOff, Server, Database, Cpu, HardDrive, TrendingUp, Users, Ticket } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid } from 'recharts';

const statusCards = [
  { label: 'CRITICAL ALERTS', value: 3, trend: '+1 vs yesterday', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: AlertTriangle },
  { label: 'ACTIVE TICKETS', value: 18, trend: '6 high priority', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  { label: 'RESOLVED TODAY', value: 27, trend: '+8 vs avg', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle }
];

const ITDashboardMain = ({ setActiveView }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">IT Operations</p>
          <h1 className="text-2xl font-bold text-slate-900">IT OPERATIONS Command Center</h1>
          <p className="text-sm text-slate-500">Monitor uptime, incidents, and change windows.</p>
        </div>
        <button
          onClick={() => setActiveView('it-systems')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500"
        >
          <Server className="w-4 h-4" />
          Systems Health
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statusCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`rounded-2xl border-2 p-6 ${card.color}`}>
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8" />
                <span className="text-xs font-bold uppercase tracking-wide">{card.label}</span>
              </div>
              <p className="text-4xl font-bold mb-1">{card.value}</p>
              <p className="text-xs font-semibold opacity-80">{card.trend}</p>
            </div>
          );
        })}
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">MongoDB</p>
              <p className="text-xs text-slate-500">Database Status</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-emerald-600">Connected</span>
          </div>
          <p className="text-xs text-slate-600">API Latency: 210ms</p>
          <p className="text-xs text-slate-600">3 Warnings in logs (last 24h)</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Server Resources</p>
              <p className="text-xs text-slate-500">CPU, Memory, Disk</p>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>CPU</span>
                <span className="font-semibold">45%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Memory</span>
                <span className="font-semibold">62%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-amber-600 h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Disk</span>
                <span className="font-semibold">78%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-rose-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Active Sessions</p>
              <p className="text-xs text-slate-500">Current users</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">247</p>
          <p className="text-xs text-slate-600">+12 in last hour</p>
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-500">Peak today: 312 users</p>
          </div>
        </div>
      </div>

      {/* Network Pulse & Change Windows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-cyan-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Network Pulse</p>
              <p className="text-xs text-slate-500">Realtime dependency map</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium">Datacenter WAN</span>
              <span className="text-emerald-600 font-semibold">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium">VPN Gateway</span>
              <span className="text-amber-600 font-semibold">Monitoring latency</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium">Field connectivity</span>
              <span className="text-rose-600 font-semibold inline-flex items-center gap-1">
                Partial outage <WifiOff className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-cyan-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Upcoming Change Windows</p>
              <p className="text-xs text-slate-500">Next 48 hours</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="p-3 bg-slate-50 rounded-lg">
              <p className="font-medium text-slate-900">Tonight 11:30 PM</p>
              <p className="text-slate-600">CRM patch rollout <span className="text-amber-600 font-semibold">(planned)</span></p>
            </li>
            <li className="p-3 bg-slate-50 rounded-lg">
              <p className="font-medium text-slate-900">Tomorrow 02:00 AM</p>
              <p className="text-slate-600">Database index maintenance <span className="text-emerald-600 font-semibold">(approved)</span></p>
            </li>
            <li className="p-3 bg-slate-50 rounded-lg">
              <p className="font-medium text-slate-900">Tomorrow 05:00 AM</p>
              <p className="text-slate-600">Voice infra upgrade <span className="text-rose-600 font-semibold">(pending)</span></p>
            </li>
          </ul>
        </div>
      </div>

      {/* System Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Trend Chart */}
        <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Ticket className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Ticket Trends</h3>
                <p className="text-xs text-slate-500">Last 7 days</p>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={[
              { name: 'Mon', open: 12, resolved: 8 },
              { name: 'Tue', open: 15, resolved: 10 },
              { name: 'Wed', open: 18, resolved: 12 },
              { name: 'Thu', open: 16, resolved: 14 },
              { name: 'Fri', open: 18, resolved: 15 },
              { name: 'Sat', open: 10, resolved: 12 },
              { name: 'Sun', open: 8, resolved: 9 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Legend />
              <Line type="monotone" dataKey="open" stroke="#ef4444" strokeWidth={2} name="Open Tickets" dot={{ fill: '#ef4444' }} />
              <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} name="Resolved" dot={{ fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* System Performance Chart */}
        <div className="bg-gradient-to-br from-white to-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">System Performance</h3>
                <p className="text-xs text-slate-500">Resource usage</p>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { name: 'CPU', usage: 45 },
              { name: 'Memory', usage: 62 },
              { name: 'Disk', usage: 78 },
              { name: 'Network', usage: 32 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                formatter={(value) => `${value}%`}
              />
              <Bar dataKey="usage" fill="#06b6d4" radius={[8, 8, 0, 0]} name="Usage %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Complete System Overview */}
      <div className="bg-gradient-to-br from-slate-50 to-cyan-50 border-2 border-slate-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-cyan-600" />
          <h3 className="text-xl font-bold text-slate-900">Complete System Overview</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Overview Cards */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-semibold text-slate-600">Total Users</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">247</p>
            <p className="text-xs text-slate-500 mt-1">Active sessions</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-4 h-4 text-emerald-600" />
              <p className="text-xs font-semibold text-slate-600">System Uptime</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">99.8%</p>
            <p className="text-xs text-emerald-600 mt-1 font-semibold">+0.2% vs last month</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-purple-600" />
              <p className="text-xs font-semibold text-slate-600">DB Queries</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">1.2K</p>
            <p className="text-xs text-slate-500 mt-1">Last hour</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-orange-600" />
              <p className="text-xs font-semibold text-slate-600">Avg Response</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">210ms</p>
            <p className="text-xs text-slate-500 mt-1">API latency</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveView('it-tickets')}
            className="bg-white hover:bg-cyan-50 border border-cyan-200 rounded-lg p-4 text-left transition-colors shadow-sm hover:shadow-md"
          >
            <Clock className="w-5 h-5 text-cyan-600 mb-2" />
            <p className="text-sm font-semibold text-slate-900">View Tickets</p>
            <p className="text-xs text-slate-500">Manage issues</p>
          </button>
          <button
            onClick={() => setActiveView('it-users')}
            className="bg-white hover:bg-cyan-50 border border-cyan-200 rounded-lg p-4 text-left transition-colors shadow-sm hover:shadow-md"
          >
            <Users className="w-5 h-5 text-cyan-600 mb-2" />
            <p className="text-sm font-semibold text-slate-900">Manage Users</p>
            <p className="text-xs text-slate-500">Access control</p>
          </button>
          <button
            onClick={() => setActiveView('it-security')}
            className="bg-white hover:bg-cyan-50 border border-cyan-200 rounded-lg p-4 text-left transition-colors shadow-sm hover:shadow-md"
          >
            <AlertTriangle className="w-5 h-5 text-cyan-600 mb-2" />
            <p className="text-sm font-semibold text-slate-900">Security Logs</p>
            <p className="text-xs text-slate-500">Audit trail</p>
          </button>
          <button
            onClick={() => setActiveView('it-reports')}
            className="bg-white hover:bg-cyan-50 border border-cyan-200 rounded-lg p-4 text-left transition-colors shadow-sm hover:shadow-md"
          >
            <Activity className="w-5 h-5 text-cyan-600 mb-2" />
            <p className="text-sm font-semibold text-slate-900">View Reports</p>
            <p className="text-xs text-slate-500">Analytics</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ITDashboardMain;

