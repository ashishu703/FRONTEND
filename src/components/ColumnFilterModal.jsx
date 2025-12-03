import React from 'react';
import { X } from 'lucide-react';

const ColumnFilterModal = ({ isOpen, onClose, visibleColumns, onToggleColumn, onResetColumns, onShowAllColumns }) => {
  if (!isOpen) return null;

  const columnLabels = {
    customerId: 'Customer ID',
    customer: 'Customer',
    business: 'Business',
    address: 'Address',
    state: 'State',
    followUpStatus: 'Follow Up Status',
    salesStatus: 'Sales Status',
    assignedSalesperson: 'Assigned Salesperson',
    assignedTelecaller: 'Assigned Telecaller',
    gstNo: 'GST No',
    leadSource: 'Lead Source',
    productNames: 'Product Name',
    category: 'Category',
    createdAt: 'Created',
    telecallerStatus: 'Telecaller Status',
    paymentStatus: 'Payment Status',
    updatedAt: 'Updated At'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Column Filter</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Show/Hide Columns</span>
              <div className="flex space-x-2">
                <button
                  onClick={onResetColumns}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Reset
                </button>
                <button
                  onClick={onShowAllColumns}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Show All
                </button>
              </div>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {Object.entries(visibleColumns).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">{columnLabels[key]}</label>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => onToggleColumn(key)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnFilterModal;

