import React from 'react';
import { BarChart3, CreditCard, LogOut, Shield, HelpCircle } from 'lucide-react';

const menuItems = [
  {
    id: 'accounts-dashboard',
    label: 'Accounts Dashboard',
    icon: BarChart3,
    description: 'Overview & insights'
  },
  {
    id: 'accounts-payments',
    label: 'Payment Info',
    icon: CreditCard,
    description: 'Approvals & history'
  }
];

const AccountsSidebar = ({ activeView, setActiveView, onLogout, userType = 'accountsdepartmenthead' }) => {
  const departmentLabel = userType.includes('it') ? 'IT Department' : 'Accounts Department';

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
      <div className="px-5 py-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">ANOCAB</p>
            <p className="text-sm font-semibold text-slate-900">{departmentLabel}</p>
            <p className="text-xs text-slate-500">{userType.includes('head') ? 'Department Head' : 'Team Workspace'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-2">
        {menuItems.map((item) => {
          const ItemIcon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ItemIcon className="w-5 h-5" />
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className={`text-xs ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>{item.description}</p>
              </div>
            </button>
          );
        })}
      </nav>
      
      {/* Support Button */}
      <div className="px-4 py-3 border-t border-slate-200">
        <button
          onClick={() => window.location.href = '/support'}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition text-slate-600 hover:bg-slate-100"
        >
          <HelpCircle className="w-5 h-5" />
          <div>
            <p className="text-sm font-semibold">Support</p>
            <p className="text-xs text-slate-500">Get help & assistance</p>
          </div>
        </button>
      </div>

      <div className="px-4 py-5 border-t border-slate-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AccountsSidebar;

