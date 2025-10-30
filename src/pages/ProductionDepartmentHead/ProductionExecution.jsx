import React, { useState } from 'react';
import { Factory, Activity, Settings, Users, Play, Pause, Square, Plus } from 'lucide-react';

const ProductionExecution = ({ activeView, setActiveView }) => {
  const [selectedTab, setSelectedTab] = useState(activeView || 'execution-console');

  const tabs = [
    { id: 'execution-console', label: 'Execution Console', icon: <Activity className="w-4 h-4" /> },
    { id: 'machine-status', label: 'Machine Status', icon: <Settings className="w-4 h-4" /> },
    { id: 'operator-performance', label: 'Operator Performance', icon: <Users className="w-4 h-4" /> }
  ];

  const renderExecutionConsole = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Production Execution Console</h2>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Start New Order
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Production Lines</h3>
          <div className="space-y-4">
            {[
              { line: 'Line 1 - Assembly', status: 'Running', progress: 75, speed: 'Normal' },
              { line: 'Line 2 - Packaging', status: 'Running', progress: 60, speed: 'High' },
              { line: 'Line 3 - Quality Control', status: 'Stopped', progress: 0, speed: 'Stopped' },
              { line: 'Line 4 - Finishing', status: 'Running', progress: 90, speed: 'Normal' }
            ].map((line, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{line.line}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    line.status === 'Running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {line.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full" 
                    style={{ width: `${line.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress: {line.progress}%</span>
                  <span>Speed: {line.speed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2">
              <Play className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium">Start All Lines</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2">
              <Pause className="w-6 h-6 text-yellow-600" />
              <span className="text-sm font-medium">Pause All Lines</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2">
              <Square className="w-6 h-6 text-red-600" />
              <span className="text-sm font-medium">Stop All Lines</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2">
              <Settings className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMachineStatus = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Machine Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Assembly Machine 1', status: 'Running', efficiency: 89, nextMaintenance: '2 days' },
          { name: 'Packaging Machine 1', status: 'Running', efficiency: 92, nextMaintenance: '5 days' },
          { name: 'Quality Check Machine', status: 'Stopped', efficiency: 0, nextMaintenance: '1 day' },
          { name: 'Finishing Machine 1', status: 'Running', efficiency: 85, nextMaintenance: '3 days' }
        ].map((machine, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-900">{machine.name}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                machine.status === 'Running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {machine.status}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Efficiency:</span>
                <span className="font-medium">{machine.efficiency}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Next Maintenance:</span>
                <span className="font-medium">{machine.nextMaintenance}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOperatorPerformance = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Operator Performance</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operator</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Efficiency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quality Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { name: 'John Smith', shift: 'Day', efficiency: 92, quality: 98, status: 'Active' },
              { name: 'Jane Doe', shift: 'Day', efficiency: 88, quality: 95, status: 'Active' },
              { name: 'Mike Johnson', shift: 'Night', efficiency: 85, quality: 97, status: 'Active' },
              { name: 'Sarah Wilson', shift: 'Night', efficiency: 90, quality: 96, status: 'Break' }
            ].map((operator, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{operator.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{operator.shift}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{operator.efficiency}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{operator.quality}%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    operator.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {operator.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Factory className="w-7 h-7 text-orange-600" />
          Production Execution
        </h1>
        <p className="text-gray-600 mt-1">Monitor and control production operations in real-time</p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                selectedTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {selectedTab === 'execution-console' && renderExecutionConsole()}
      {selectedTab === 'machine-status' && renderMachineStatus()}
      {selectedTab === 'operator-performance' && renderOperatorPerformance()}
    </div>
  );
};

export default ProductionExecution;
