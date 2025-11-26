import React, { useState } from 'react';
import { Bell, AlertTriangle, Server, Database, Ticket, CheckCircle, X } from 'lucide-react';

const NotificationsAlerts = () => {
  const [notifications] = useState([
    {
      id: 1,
      type: 'New Ticket',
      title: 'New ticket raised',
      message: 'Login page not loading - TKT-001',
      timestamp: '2025-01-27 10:30 AM',
      priority: 'high',
      read: false
    },
    {
      id: 2,
      type: 'Server Alert',
      title: 'Server down',
      message: 'Remote Telephony service is down',
      timestamp: '2025-01-27 09:15 AM',
      priority: 'critical',
      read: false
    },
    {
      id: 3,
      type: 'Security Alert',
      title: 'Unauthorized access',
      message: '3 failed login attempts detected',
      timestamp: '2025-01-27 08:00 AM',
      priority: 'high',
      read: true
    }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Alerts</p>
        <h1 className="text-2xl font-bold text-slate-900">Notifications & Alerts</h1>
        <p className="text-sm text-slate-500">Real-time alerts and notifications for IT team</p>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`bg-white border-2 rounded-2xl p-6 ${
              !notif.read ? 'border-cyan-200 bg-cyan-50' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  notif.type === 'Server Alert' ? 'bg-rose-100' :
                  notif.type === 'Security Alert' ? 'bg-amber-100' :
                  'bg-blue-100'
                }`}>
                  <Bell className={`w-5 h-5 ${
                    notif.type === 'Server Alert' ? 'text-rose-600' :
                    notif.type === 'Security Alert' ? 'text-amber-600' :
                    'text-blue-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{notif.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                  <p className="text-xs text-slate-500 mt-2">{notif.timestamp}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                notif.priority === 'critical' ? 'bg-rose-100 text-rose-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {notif.priority.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsAlerts;

