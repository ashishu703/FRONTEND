import React, { useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, WifiOff } from 'lucide-react';

const statusCards = [
  { label: 'Critical Alerts', value: 3, trend: '+1 vs yesterday', color: 'bg-rose-50 text-rose-700', icon: AlertTriangle },
  { label: 'Active Tickets', value: 18, trend: '6 high priority', color: 'bg-amber-50 text-amber-700', icon: Clock },
  { label: 'Resolved Today', value: 27, trend: '+8 vs avg', color: 'bg-emerald-50 text-emerald-700', icon: CheckCircle }
];

const systems = [
  { name: 'CRM Cluster', status: 'Healthy', metric: '99.96% uptime', color: 'text-emerald-600' },
  { name: 'Payment Gateway VPN', status: 'Degraded', metric: 'Latency +240ms', color: 'text-amber-600' },
  { name: 'Analytics Warehouse', status: 'Maintenance', metric: 'ETA 02:30 hrs', color: 'text-slate-600' },
  { name: 'Remote Telephony', status: 'Down', metric: 'Provider outage', color: 'text-rose-600' }
];

const ItDashboard = ({ activeView, setActiveView }) => {
  useEffect(() => {
    if (!activeView || activeView === 'dashboard') {
      setActiveView('it-dashboard');
    }
  }, [activeView, setActiveView]);

  if (activeView === 'it-systems') {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Infrastructure Watch</p>
          <h1 className="text-2xl font-bold text-slate-900">Systems Health Board</h1>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                {['Service', 'Status', 'Metric', 'Action'].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {systems.map((service) => (
                <tr key={service.name}>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{service.name}</td>
                  <td className={`px-6 py-4 text-sm font-medium ${service.color}`}>{service.status}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{service.metric}</td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-cyan-600 hover:text-cyan-500 text-sm font-medium">View Logs</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">IT Operations</p>
          <h1 className="text-2xl font-bold text-slate-900">Command Center</h1>
          <p className="text-sm text-slate-500">Monitor uptime, incidents, and change windows.</p>
        </div>
        <button
          onClick={() => setActiveView('it-systems')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500"
        >
          Systems Health
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statusCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`rounded-2xl border border-slate-200 p-5 ${card.color}`}>
              <div className="flex items-center justify-between">
                <Icon className="w-6 h-6" />
                <span className="text-xs font-semibold uppercase">{card.label}</span>
              </div>
              <p className="mt-4 text-3xl font-bold">{card.value}</p>
              <p className="text-xs">{card.trend}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-cyan-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Network Pulse</p>
              <p className="text-xs text-slate-500">Realtime dependency map</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Datacenter WAN</span>
              <span className="text-emerald-600 font-semibold">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span>VPN Gateway</span>
              <span className="text-amber-600 font-semibold">Monitoring latency</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Field connectivity</span>
              <span className="text-rose-600 font-semibold inline-flex items-center gap-1">
                Partial outage <WifiOff className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-cyan-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Upcoming Change Windows</p>
              <p className="text-xs text-slate-500">Next 48 hours</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>
              Tonight 11:30 PM &mdash; CRM patch rollout <span className="text-amber-600">(planned)</span>
            </li>
            <li>
              Tomorrow 02:00 AM &mdash; Database index maintenance <span className="text-emerald-600">(approved)</span>
            </li>
            <li>
              Tomorrow 05:00 AM &mdash; Voice infra upgrade <span className="text-rose-600">(pending)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ItDashboard;

