import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';

const MobileTest = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  const toggleView = () => {
    setIsMobile(!isMobile);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Mobile View Test</h1>
          
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={toggleView}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isMobile 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span>Mobile View</span>
            </button>
            
            <button
              onClick={toggleView}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                !isMobile 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Monitor className="w-5 h-5" />
              <span>Desktop View</span>
            </button>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            Current View: <span className="font-semibold">{isMobile ? 'Mobile' : 'Desktop'}</span>
          </div>
        </div>

        {isMobile ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Mobile View Active</h2>
            <p className="text-blue-700 mb-4">
              This simulates the mobile view. The mobile components are located in:
            </p>
            <div className="bg-white rounded-lg p-4 mb-4">
              <code className="text-sm text-gray-800">
                /src/pages/MARKETING SALESPERSON MOBILE VIEW/
              </code>
            </div>
            <div className="space-y-2 text-sm text-blue-700">
              <p>✅ MobileMarketingSalespersonLayout.jsx</p>
              <p>✅ MobileMarketingSalespersonSidebar.jsx</p>
              <p>✅ MobileMarketingSalespersonDashboard.jsx</p>
              <p>✅ MobileMarketingSalespersonLeads.jsx</p>
              <p>✅ MobileMarketingSalespersonVisits.jsx</p>
              <p>✅ MobileMarketingSalespersonOrders.jsx</p>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-green-900 mb-4">Desktop View Active</h2>
            <p className="text-green-700">
              This is the normal desktop view. Click "Mobile View" to switch to mobile interface.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileTest;
