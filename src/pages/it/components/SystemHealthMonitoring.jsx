import React, { useState } from 'react';
import { Server, Database, Activity, AlertTriangle, CheckCircle, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';

const SystemHealthMonitoring = () => {
  const [systems, setSystems] = useState([
    {
      name: 'CRM Cluster',
      status: 'Healthy',
      uptime: '99.96%',
      responseTime: '210ms',
      lastCheck: '2 mins ago',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      name: 'MongoDB Database',
      status: 'Connected',
      uptime: '99.98%',
      responseTime: '45ms',
      lastCheck: '1 min ago',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      name: 'Payment Gateway VPN',
      status: 'Degraded',
      uptime: '98.5%',
      responseTime: '450ms',
      lastCheck: '30 secs ago',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      name: 'Analytics Warehouse',
      status: 'Maintenance',
      uptime: '95.2%',
      responseTime: 'N/A',
      lastCheck: '5 mins ago',
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200'
    },
    {
      name: 'Remote Telephony',
      status: 'Down',
      uptime: '92.1%',
      responseTime: 'N/A',
      lastCheck: '10 mins ago',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200'
    }
  ]);

  const metrics = [
    { label: 'API Response Time', value: '210ms', trend: 'down', change: '-5%' },
    { label: 'Active Users', value: '247', trend: 'up', change: '+12' },
    { label: 'Error Rate', value: '0.02%', trend: 'down', change: '-0.01%' },
    { label: 'Database Connections', value: '45/100', trend: 'stable', change: '0' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Infrastructure</p>
          <h1 className="text-2xl font-bold text-slate-900">System Health & Monitoring</h1>
          <p className="text-sm text-slate-500">Real-time system status and performance metrics</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systems.map((system, index) => (
          <div key={index} className={`border-2 rounded-2xl p-6 ${system.bgColor} ${system.borderColor}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${system.bgColor} rounded-lg flex items-center justify-center`}>
                  <Server className={`w-5 h-5 ${system.color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{system.name}</p>
                  <p className="text-xs text-slate-500">Last check: {system.lastCheck}</p>
                </div>
              </div>
              {system.status === 'Healthy' || system.status === 'Connected' ? (
                <CheckCircle className={`w-5 h-5 ${system.color}`} />
              ) : (
                <AlertTriangle className={`w-5 h-5 ${system.color}`} />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Status</span>
                <span className={`text-sm font-semibold ${system.color}`}>{system.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Uptime</span>
                <span className="text-sm font-semibold text-slate-900">{system.uptime}</span>
              </div>
              {system.responseTime !== 'N/A' && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Response Time</span>
                  <span className="text-sm font-semibold text-slate-900">{system.responseTime}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-2">{metric.label}</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-600" />}
                {metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-rose-600" />}
                <span className={`text-xs font-semibold ${metric.trend === 'up' ? 'text-emerald-600' : metric.trend === 'down' ? 'text-rose-600' : 'text-slate-600'}`}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Logs Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Error Logs Summary (Last 24h)</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <div>
                <p className="text-sm font-semibold text-slate-900">3 Warnings</p>
                <p className="text-xs text-slate-500">Database connection pool at 85%</p>
              </div>
            </div>
            <span className="text-xs text-slate-600">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-slate-900">API timeout</p>
                <p className="text-xs text-slate-500">Payment gateway response slow</p>
              </div>
            </div>
            <span className="text-xs text-slate-600">5 hours ago</span>
          </div>
        </div>
      </div>

      {/* Resource Usage Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">CPU Usage</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Server 1</span>
                <span className="font-semibold">45%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Server 2</span>
                <span className="font-semibold">32%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Memory Usage</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Server 1</span>
                <span className="font-semibold">62%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-amber-600 h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Server 2</span>
                <span className="font-semibold">48%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-amber-600 h-2 rounded-full" style={{ width: '48%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthMonitoring;

