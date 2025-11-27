import React from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle, Ticket, Activity } from 'lucide-react';

const ReportsAnalytics = () => {
  const metrics = [
    { label: 'Average Ticket Resolution', value: '3.4 hours', icon: Clock, bgColor: 'bg-cyan-50', textColor: 'text-cyan-600' },
    { label: 'Server Uptime', value: '99.8%', icon: Activity, bgColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { label: 'Tickets Resolved Today', value: '27', icon: CheckCircle, bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Active Tickets', value: '18', icon: Ticket, bgColor: 'bg-amber-50', textColor: 'text-amber-600' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Analytics</p>
        <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
        <p className="text-sm text-slate-500">Technical performance insights and metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${metric.textColor}`} />
                </div>
                <p className="text-xs text-slate-500">{metric.label}</p>
              </div>
              <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Ticket Resolution Trends</h3>
          <div className="h-48 flex items-center justify-center text-slate-400">
            <p className="text-sm">Chart visualization would go here</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">System Uptime Report</h3>
          <div className="h-48 flex items-center justify-center text-slate-400">
            <p className="text-sm">Chart visualization would go here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;

