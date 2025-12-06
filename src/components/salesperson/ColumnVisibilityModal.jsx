import React from 'react'
import { X, Check } from 'lucide-react'

export default function ColumnVisibilityModal({ show, onClose, columns, visibleColumns, onToggleColumn }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Column Visibility</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-2">
            {Object.entries(columns).map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns[key] !== false}
                  onChange={() => onToggleColumn(key)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
