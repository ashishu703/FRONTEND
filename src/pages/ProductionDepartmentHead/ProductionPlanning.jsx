import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Target, 
  Plus, 
  Filter, 
  Search,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

const ProductionPlanning = ({ activeView, setActiveView }) => {
  const [selectedTab, setSelectedTab] = useState(activeView || 'production-schedule');
  const [showAddModal, setShowAddModal] = useState(false);

  const tabs = [
    { id: 'production-schedule', label: 'Production Schedule', icon: <Calendar className="w-4 h-4" /> },
    { id: 'work-orders', label: 'Work Orders', icon: <FileText className="w-4 h-4" /> },
    { id: 'capacity-planning', label: 'Capacity Planning', icon: <Target className="w-4 h-4" /> }
  ];

  // Sample data
  const productionSchedule = [
    {
      id: 1,
      orderId: 'PO-2024-001',
      product: 'Cable Assembly A',
      quantity: 500,
      startDate: '2024-01-15',
      endDate: '2024-01-18',
      line: 'Line 1 - Assembly',
      status: 'In Progress',
      priority: 'High',
      progress: 65
    },
    {
      id: 2,
      orderId: 'PO-2024-002',
      product: 'Cable Assembly B',
      quantity: 300,
      startDate: '2024-01-16',
      endDate: '2024-01-19',
      line: 'Line 2 - Packaging',
      status: 'Scheduled',
      priority: 'Medium',
      progress: 0
    },
    {
      id: 3,
      orderId: 'PO-2024-003',
      product: 'Cable Assembly C',
      quantity: 800,
      startDate: '2024-01-20',
      endDate: '2024-01-25',
      line: 'Line 3 - Quality Control',
      status: 'Planned',
      priority: 'Low',
      progress: 0
    }
  ];

  const workOrders = [
    {
      id: 1,
      orderId: 'WO-2024-001',
      product: 'Cable Assembly A',
      quantity: 500,
      assignedTo: 'John Smith',
      startTime: '08:00',
      endTime: '16:00',
      status: 'In Progress',
      priority: 'High'
    },
    {
      id: 2,
      orderId: 'WO-2024-002',
      product: 'Cable Assembly B',
      quantity: 300,
      assignedTo: 'Jane Doe',
      startTime: '09:00',
      endTime: '17:00',
      status: 'Pending',
      priority: 'Medium'
    }
  ];

  const capacityData = [
    { line: 'Line 1 - Assembly', capacity: 1000, utilized: 750, efficiency: 75 },
    { line: 'Line 2 - Packaging', capacity: 800, utilized: 600, efficiency: 75 },
    { line: 'Line 3 - Quality Control', capacity: 600, utilized: 450, efficiency: 75 },
    { line: 'Line 4 - Finishing', capacity: 900, utilized: 720, efficiency: 80 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Planned': return 'bg-gray-100 text-gray-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderProductionSchedule = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Production Schedule</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Schedule
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Line</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productionSchedule.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.endDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.line}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full" 
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-orange-600 hover:text-orange-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderWorkOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Work Orders</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Work Order
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{order.orderId}</h3>
                <p className="text-sm text-gray-600">{order.product}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Quantity:</span>
                <span className="text-sm font-medium">{order.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Assigned To:</span>
                <span className="text-sm font-medium">{order.assignedTo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Time:</span>
                <span className="text-sm font-medium">{order.startTime} - {order.endTime}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(order.priority)}`}>
                {order.priority}
              </span>
              <div className="flex space-x-2">
                <button className="text-orange-600 hover:text-orange-900">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCapacityPlanning = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Capacity Planning</h2>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {capacityData.map((line, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{line.line}</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Capacity Utilization</span>
                  <span className="font-medium">{line.utilized}/{line.capacity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full" 
                    style={{ width: `${(line.utilized / line.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Efficiency</span>
                  <span className="font-medium">{line.efficiency}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${line.efficiency}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available Capacity:</span>
                <span className="font-medium text-green-600">{line.capacity - line.utilized} units</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-7 h-7 text-orange-600" />
          Production Planning
        </h1>
        <p className="text-gray-600 mt-1">Manage production schedules, work orders, and capacity planning</p>
      </div>

      {/* Tabs */}
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

      {/* Content */}
      {selectedTab === 'production-schedule' && renderProductionSchedule()}
      {selectedTab === 'work-orders' && renderWorkOrders()}
      {selectedTab === 'capacity-planning' && renderCapacityPlanning()}
    </div>
  );
};

export default ProductionPlanning;
