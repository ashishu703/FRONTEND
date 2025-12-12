import React from 'react';

const StatCard = ({ title, value, suffix = '', icon: Icon, color, change, changeType, description }) => (
  <div className={`${color.bg} ${color.border} border rounded-xl p-4 hover:shadow-md transition-shadow`}>
    <div className="flex items-center justify-between mb-2">
      <h3 className={`text-sm font-medium ${color.text}`}>{title}</h3>
      {Icon && (
        <div className={color.text}>
          <Icon className="h-5 w-5" />
        </div>
      )}
    </div>
    <div className={`text-2xl font-bold ${color.value} mb-1`}>
      {value}{suffix}
    </div>
    {change !== undefined && (
      <p className={`text-xs ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
        {changeType === 'positive' ? '+' : ''}{change}% from last month
      </p>
    )}
    {description && (
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    )}
  </div>
);

export default StatCard;

