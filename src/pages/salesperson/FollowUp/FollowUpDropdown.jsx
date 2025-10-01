import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Clock } from 'lucide-react';

const FollowUpDropdown = ({ currentPage, onNavigate, sidebarOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const statuses = [
    { id: 'connected', label: 'Connected', color: 'text-green-500' },
    { id: 'not-connected', label: 'Not Connected', color: 'text-red-500' },
    { id: 'next-meeting', label: "Today's Meeting", color: 'text-blue-500' },
    { id: 'converted', label: 'Converted', color: 'text-purple-500' },
    { id: 'closed', label: 'Closed', color: 'text-gray-500' },
  ];

  const isActive = currentPage.startsWith('followup-');
  const activeStatus = statuses.find(s => currentPage === `followup-${s.id}`);

  if (!sidebarOpen) {
    return (
      <li>
        <button
          onClick={() => onNavigate('followup-connected')}
          className={`w-full flex items-center justify-center p-2 rounded-lg transition-colors ${
            isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <Clock className="h-5 w-5" />
        </button>
      </li>
    );
  }

  return (
    <li>
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
            isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <span className="flex items-center space-x-3">
            <Clock className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
            <span className="text-sm font-medium">Follow Up</span>
          </span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        
        {isOpen && (
          <ul className="pl-10 space-y-1">
            {statuses.map((status) => (
              <li key={status.id}>
                <button
                  onClick={() => onNavigate(`followup-${status.id}`)}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    currentPage === `followup-${status.id}`
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full mr-2 ${status.color}`}></span>
                  {status.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};

export default FollowUpDropdown;
