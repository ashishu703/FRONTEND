import React from 'react';
import { Search, Plus, Upload, RefreshCw, Download, Trash2 } from 'lucide-react';

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  onImportClick, 
  onAddCustomer, 
  onAssignSelected,
  onDeleteSelected,
  selectedCount,
  onRefresh 
}) => {
  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email, or business"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onImportClick}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download className="w-4 h-4" />
          <span>Import CSV</span>
        </button>
        
        <button
          onClick={onAddCustomer}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
        <button
          onClick={onAssignSelected}
          disabled={selectedCount === 0}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${selectedCount === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          title={selectedCount > 0 ? `Reassign ${selectedCount} selected lead(s)` : 'Select leads to assign/reassign'}
        >
          <span>{selectedCount > 0 ? 'Reassign' : 'Assign'} Selected{selectedCount ? ` (${selectedCount})` : ''}</span>
        </button>
        
        {onDeleteSelected && (
          <button
            onClick={onDeleteSelected}
            disabled={selectedCount === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${selectedCount === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
            title={selectedCount > 0 ? `Delete ${selectedCount} selected lead(s)` : 'Select leads to delete'}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Selected{selectedCount ? ` (${selectedCount})` : ''}</span>
          </button>
        )}
          
        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;

