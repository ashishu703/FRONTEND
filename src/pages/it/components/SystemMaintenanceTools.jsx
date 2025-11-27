import React, { useState } from 'react';
import { Settings, RefreshCw, Database, Trash2, History, Server, HardDrive, Shield } from 'lucide-react';

const SystemMaintenanceTools = () => {
  const [lastBackup, setLastBackup] = useState({
    date: '2025-01-26 11:30 PM',
    size: '1.2GB',
    status: 'Success'
  });

  const maintenanceTasks = [
    { id: 1, name: 'Clear Cache', description: 'Remove temporary files and cache', icon: Trash2, color: 'cyan' },
    { id: 2, name: 'Restart Services', description: 'Restart backend and database services', icon: RefreshCw, color: 'blue' },
    { id: 3, name: 'Database Backup', description: 'Create full database backup', icon: Database, color: 'emerald' },
    { id: 4, name: 'Clear Temp Files', description: 'Remove temporary system files', icon: Trash2, color: 'amber' }
  ];

  const handleMaintenance = (taskId) => {
    alert(`Executing ${maintenanceTasks.find(t => t.id === taskId)?.name}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">System Control</p>
        <h1 className="text-2xl font-bold text-slate-900">System Maintenance Tools</h1>
        <p className="text-sm text-slate-500">Maintain and manage CRM system operations</p>
      </div>

      {/* Maintenance Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {maintenanceTasks.map((task) => {
          const Icon = task.icon;
          const colorClasses = {
            cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200 hover:bg-cyan-100',
            blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
            emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100',
            amber: 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
          };
          return (
            <button
              key={task.id}
              onClick={() => handleMaintenance(task.id)}
              className={`border-2 rounded-2xl p-6 text-left transition-colors ${colorClasses[task.color]}`}
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
                <p className="text-sm text-slate-600">Date: {lastBackup.date}</p>
                <p className="text-sm text-slate-600">Size: {lastBackup.size}</p>
                <p className="text-sm text-emerald-600 font-semibold">Status: {lastBackup.status}</p>
              </div>
            </div>
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
              <Database className="w-4 h-4" />
              Create Backup Now
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">Restore from Backup</p>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800 mb-2">⚠️ Warning: This will overwrite current database</p>
                <input type="file" accept=".sql,.backup" className="text-xs" />
              </div>
            </div>
            <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
              <History className="w-4 h-4" />
              Restore Backup
            </button>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Version Control</h3>
          <div className="space-y-3">
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

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Service Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">Backend API</span>
              </div>
              <span className="text-sm font-semibold text-emerald-600">Running</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">Database</span>
              </div>
              <span className="text-sm font-semibold text-emerald-600">Running</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">Cache Service</span>
              </div>
              <span className="text-sm font-semibold text-emerald-600">Running</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMaintenanceTools;

