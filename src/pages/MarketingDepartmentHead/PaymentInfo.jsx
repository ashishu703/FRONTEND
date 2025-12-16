import React, { useState } from 'react';
import { CreditCard, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import PaymentStatusView from '../MarketingSalesperson/PaymentStatusView';

// Marketing Department Head Payment Info
// Mirrors the Marketing Salesperson "Payments" section with three tabs:
// Due Payments, Advance Payments, Completed Payments.
const MarketingPaymentInfo = () => {
  const [activeTab, setActiveTab] = useState('due'); // 'due' | 'advance' | 'completed'

  const tabs = [
    {
      id: 'due',
      label: 'Due Payments',
      description: 'Pending, Partial, or Advance payments',
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50 border-orange-200'
    },
    {
      id: 'advance',
      label: 'Advance Payments',
      description: 'Orders with advance payment status',
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'completed',
      label: 'Completed Payments',
      description: 'Orders marked as Paid/Completed',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50 border-green-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
                      <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            Payment Info
          </h1>
          <p className="text-gray-600">View payments by status: Due, Advance, Completed</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
                <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                isActive
                  ? `${tab.bg} ring-2 ring-offset-2 ring-blue-400`
                  : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isActive ? tab.bg : 'bg-gray-100 border border-gray-200'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? tab.color : 'text-gray-500'}`} />
                </div>
                    <div>
                  <div className={`text-sm font-semibold ${isActive ? tab.color : 'text-gray-900'}`}>{tab.label}</div>
                  <div className="text-xs text-gray-600">{tab.description}</div>
                </div>
              </div>
                </button>
          );
        })}
              </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <PaymentStatusView type={activeTab} />
        </div>
    </div>
  );
};

export default MarketingPaymentInfo;


