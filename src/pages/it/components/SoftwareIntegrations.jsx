import React, { useState } from 'react';
import { Link, CheckCircle, XCircle, RefreshCw, Clock } from 'lucide-react';

const SoftwareIntegrations = () => {
  const [integrations] = useState([
    {
      name: 'IndiaMART API',
      status: 'Connected',
      lastSync: '2025-01-27 11:32 AM',
      syncStatus: 'success',
      apiKey: 'Active'
    },
    {
      name: 'TradeIndia API',
      status: 'Connected',
      lastSync: '2025-01-27 10:15 AM',
      syncStatus: 'success',
      apiKey: 'Active'
    },
    {
      name: 'Cloudinary',
      status: 'Connected',
      lastSync: '2025-01-27 11:45 AM',
      syncStatus: 'success',
      apiKey: 'Active'
    },
    {
      name: 'Payment Gateway',
      status: 'Degraded',
      lastSync: '2025-01-27 09:30 AM',
      syncStatus: 'warning',
      apiKey: 'Active'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Third-Party</p>
          <h1 className="text-2xl font-bold text-slate-900">Software & Integration Status</h1>
          <p className="text-sm text-slate-500">Monitor 3rd-party tool integrations and API health</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500">
          <Link className="w-4 h-4" />
          Add Integration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6">
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
                <span className={`text-sm font-semibold ${
                  integration.status === 'Connected' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
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
  );
};

export default SoftwareIntegrations;

