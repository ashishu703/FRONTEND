import React, { useState } from 'react';
import { Settings, Plus, Edit, Trash2, Package, AlertTriangle, CheckCircle } from 'lucide-react';

const InventoryControl = () => {
  const [inventory, setInventory] = useState([
    { id: 1, itemName: 'Steel Sheet', category: 'Raw Material', quantity: 500, minThreshold: 200, unit: 'Kg', status: 'In Stock' },
    { id: 2, itemName: 'Copper Wire', category: 'Raw Material', quantity: 150, minThreshold: 100, unit: 'Meter', status: 'Low Stock' },
    { id: 3, itemName: 'Safety Helmet', category: 'Safety Equipment', quantity: 50, minThreshold: 30, unit: 'Pcs', status: 'In Stock' },
    { id: 4, itemName: 'Welding Rod', category: 'Consumables', quantity: 25, minThreshold: 50, unit: 'Pcs', status: 'Critical' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-7 h-7 text-orange-600" />
            Inventory Control
          </h1>
          <p className="text-gray-600 mt-1">Monitor and manage inventory levels</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Threshold</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{item.itemName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.minThreshold}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.status === 'In Stock' ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                      <CheckCircle className="w-3 h-3" />
                      {item.status}
                    </span>
                  ) : item.status === 'Low Stock' ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1 w-fit">
                      <AlertTriangle className="w-3 h-3" />
                      {item.status}
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                      <AlertTriangle className="w-3 h-3" />
                      {item.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-900">
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
  );
};

export default InventoryControl;

