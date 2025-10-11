import React, { useState } from 'react';
import MobileMarketingSalespersonLayout from './MobileMarketingSalespersonLayout';
import { Smartphone, Monitor, ArrowLeft } from 'lucide-react';

const MobileViewTest = () => {
  const [currentView, setCurrentView] = useState('desktop');

  const switchToMobile = () => {
    setCurrentView('mobile');
  };

  const switchToDesktop = () => {
    setCurrentView('desktop');
  };

  if (currentView === 'mobile') {
    return (
      <div className="relative">
        <MobileMarketingSalespersonLayout />
        
        {/* Back to Desktop Button */}
        <button
          onClick={switchToDesktop}
          className="fixed top-4 left-4 z-50 p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors"
          title="Back to Desktop View"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Mobile View Test</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Desktop View Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Monitor className="w-8 h-8 text-blue-600" />
                <h2 className="text-lg font-semibold text-blue-900">Desktop View</h2>
              </div>
              <p className="text-blue-700 mb-4">
                This is the current desktop view. The mobile view components are ready and functional.
              </p>
              <div className="space-y-2 text-sm text-blue-600">
                <p>✅ MobileMarketingSalespersonLayout.jsx</p>
                <p>✅ MobileMarketingSalespersonSidebar.jsx</p>
                <p>✅ MobileMarketingSalespersonDashboard.jsx</p>
                <p>✅ All mobile components created</p>
              </div>
            </div>

            {/* Mobile View Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Smartphone className="w-8 h-8 text-green-600" />
                <h2 className="text-lg font-semibold text-green-900">Mobile View</h2>
              </div>
              <p className="text-green-700 mb-4">
                Click the button below to test the mobile view interface.
              </p>
              <button
                onClick={switchToMobile}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Smartphone className="w-5 h-5" />
                <span>Test Mobile View</span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Access Mobile View</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <p>Navigate to the MarketingSalesperson interface</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <p>Look for the blue floating button in the bottom-right corner</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <p>Click the smartphone icon to switch to mobile view</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <p>Use the green floating button to return to desktop view</p>
              </div>
            </div>
          </div>

          {/* Test Button */}
          <div className="mt-6 text-center">
            <button
              onClick={switchToMobile}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Smartphone className="w-5 h-5" />
              <span>Test Mobile View Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileViewTest;
