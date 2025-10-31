import React from 'react';
import { Package, Clock, Bell } from 'lucide-react';

const MobileStock = () => {
  return (
    <div className="p-4 min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-sm w-full text-center bg-white rounded-lg shadow-lg p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-100">
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold mb-3 text-gray-900">
          Available Stock
        </h1>

        {/* Coming Soon Message */}
        <div className="mb-4">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 mr-2 text-yellow-600" />
            <span className="text-lg font-semibold text-yellow-600">
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-gray-600">
            This feature is coming soon. Stay tuned for updates!
          </p>
        </div>

        {/* Notification */}
        <div className="flex items-center justify-center p-3 rounded-lg bg-gray-100">
          <Bell className="w-4 h-4 mr-2 text-blue-600" />
          <span className="text-sm text-gray-600">
            We'll notify you when this feature is available
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileStock;