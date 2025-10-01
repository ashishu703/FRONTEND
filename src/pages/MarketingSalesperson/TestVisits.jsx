import React from 'react';

const TestVisits = () => {
  console.log('TestVisits component is rendering');
  
  return (
    <div className="p-6 bg-red-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-red-600 mb-4">🧪 TEST COMPONENT</h1>
        <p className="text-lg text-gray-700 mb-4">This is a simple test component to verify routing works.</p>
        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800">✅ Success!</h2>
          <p className="text-green-600">If you can see this, the visits route is working correctly.</p>
        </div>
      </div>
    </div>
  );
};

export default TestVisits;
