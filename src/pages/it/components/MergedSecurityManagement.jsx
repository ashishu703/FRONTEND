import React, { useState } from 'react';
import { Shield, AlertTriangle, Lock, Key, User, Download, RefreshCw, Database, Trash2, HardDrive, Link, CheckCircle, XCircle } from 'lucide-react';

const MergedSecurityManagement = () => {
  const [activeTab, setActiveTab] = useState('security');

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Security & System</p>
        <h1 className="text-2xl font-bold text-slate-900">Security, Logs & Maintenance</h1>
        <p className="text-sm text-slate-500">Manage security, audit logs, maintenance tools, assets, and integrations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {[
          { id: 'security', label: 'Security & Logs', icon: Shield },
          { id: 'maintenance', label: 'Maintenance', icon: RefreshCw },
          { id: 'assets', label: 'Assets', icon: HardDrive },
          { id: 'integrations', label: 'Integrations', icon: Link }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-cyan-600 text-cyan-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Security Alerts */}
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">Failed Login</td>
                    <td className="px-6 py-4 text-sm text-slate-600">vikram@anocab.com</td>
                    <td className="px-6 py-4 text-sm text-slate-600">192.168.1.47</td>
                    <td className="px-6 py-4 text-sm text-slate-600">2025-01-27 10:22 AM</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold bg-rose-100 text-rose-700 rounded border border-rose-300">HIGH</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Clear Cache', icon: Trash2, color: 'cyan', description: 'Remove temporary files' },
              { name: 'Restart Services', icon: RefreshCw, color: 'blue', description: 'Restart backend services' },
              { name: 'Database Backup', icon: Database, color: 'emerald', description: 'Create full backup' },
              { name: 'Clear Temp Files', icon: Trash2, color: 'amber', description: 'Remove system temp files' }
            ].map((task, idx) => {
              const Icon = task.icon;
              return (
                <button
                  key={idx}
                  className={`border-2 rounded-2xl p-6 text-left transition-colors ${
                  task.color === 'cyan' ? 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100' :
                  task.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' :
                  task.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' :
                  'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                }`}
                >
                  <Icon className="w-8 h-8 mb-3" />
                  <p className="text-sm font-semibold mb-1">{task.name}</p>
                  <p className="text-xs opacity-80">{task.description}</p>
                </button>
              );
            })}
          </div>
          
          {/* Backup & Restore */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Database Backup & Restore</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-2">Last Backup</p>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">Date: 2025-01-26 11:30 PM</p>
                    <p className="text-sm text-slate-600">Size: 1.2GB</p>
                    <p className="text-sm text-emerald-600 font-semibold">Status: Success</p>
                  </div>
                </div>
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
                  <Database className="w-4 h-4" />
                  Create Backup Now
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-2">Version Control</p>
                  <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Current Version</span>
                      <span className="text-sm font-semibold text-slate-900">v2.4.1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Last Updated</span>
                      <span className="text-sm font-semibold text-slate-900">2025-01-15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Deployment</span>
                      <span className="text-sm font-semibold text-emerald-600">Production</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Asset Inventory</h3>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500">
              <HardDrive className="w-4 h-4" />
              Add Asset
            </button>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Asset ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Serial Number</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Next AMC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {[
                    { id: 'AST-001', name: 'Dell Laptop XPS 15', type: 'Laptop', serial: '9YH7K2M1', assignedTo: 'Rahul Sharma', status: 'In Use', nextAMC: '2025-12-15' },
                    { id: 'AST-002', name: 'HP LaserJet Printer', type: 'Printer', serial: 'HP789456', assignedTo: 'Office Floor 1', status: 'In Use', nextAMC: '2025-06-20' },
                    { id: 'AST-003', name: 'Cisco Router 2900', type: 'Network Device', serial: 'CS2900X123', assignedTo: 'IT Department', status: 'In Use', nextAMC: '2025-03-10' }
                  ].map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{asset.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-900">{asset.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-semibold bg-cyan-100 text-cyan-700 rounded">{asset.type}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{asset.serial}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{asset.assignedTo}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded">{asset.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{asset.nextAMC}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Third-Party Integrations</h3>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500">
              <Link className="w-4 h-4" />
              Add Integration
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'IndiaMART API', status: 'Connected', lastSync: '2025-01-27 11:32 AM', apiKey: 'Active' },
              { name: 'TradeIndia API', status: 'Connected', lastSync: '2025-01-27 10:15 AM', apiKey: 'Active' },
              { name: 'Cloudinary', status: 'Connected', lastSync: '2025-01-27 11:45 AM', apiKey: 'Active' },
              { name: 'Payment Gateway', status: 'Degraded', lastSync: '2025-01-27 09:30 AM', apiKey: 'Active' }
            ].map((integration, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">{integration.name}</h3>
                  {integration.status === 'Connected' ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-600" />
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Status</span>
                    <span className={`text-sm font-semibold ${integration.status === 'Connected' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {integration.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Last Sync</span>
                    <span className="text-sm font-semibold text-slate-900">{integration.lastSync}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">API Key</span>
                    <span className="text-sm font-semibold text-emerald-600">{integration.apiKey}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-600 font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                    <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2 rounded-lg text-sm">
                      Reconnect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MergedSecurityManagement;

