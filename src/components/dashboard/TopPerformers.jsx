import React from 'react';
import { Trophy } from 'lucide-react';

const TopPerformers = ({ performers = [] }) => {
  const getRankColor = (index) => {
    if (index === 0) return 'bg-yellow-500';
    if (index === 1) return 'bg-gray-400';
    return 'bg-orange-500';
  };

  const validPerformers = Array.isArray(performers) ? performers.filter(p => p && p.amount > 0) : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
        <Trophy className="w-5 h-5 text-yellow-600" />
      </div>
      <p className="text-sm text-gray-600 mb-4">Top 3 salespersons by payment received</p>
      {validPerformers.length > 0 ? (
        <div className="space-y-4">
          {validPerformers.map((performer, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getRankColor(index)}`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{performer.username || performer.name || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">Salesperson</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">₹{performer.amount.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Received</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No performance data available yet</p>
        </div>
      )}
    </div>
  );
};

export default TopPerformers;

