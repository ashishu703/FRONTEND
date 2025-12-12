import React from 'react'
import { Filter, X } from 'lucide-react'
import { cx } from '../../utils/globalImports'

export default function LeadFilters({ 
  showFilterPanel, setShowFilterPanel, enabledFilters, advancedFilters, 
  getUniqueFilterOptions, handleAdvancedFilterChange, toggleFilterSection, clearAdvancedFilters 
}) {
  return showFilterPanel && (
    <div id="filter-panel" className="fixed right-4 top-32 z-[100] bg-white rounded-lg shadow-2xl border border-gray-200 w-96 max-h-[calc(100vh-150px)] overflow-hidden flex flex-col">
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-600" /> Filters
        </h3>
        <button onClick={() => setShowFilterPanel(false)} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4 space-y-3 overflow-y-auto flex-1">
        {['tag', 'followUpStatus', 'salesStatus', 'state', 'leadSource', 'productType', 'dateRange'].map(filterKey => (
          <div key={filterKey} className="border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 p-3 bg-gray-50">
              <input type="checkbox" checked={enabledFilters[filterKey]} onChange={() => toggleFilterSection(filterKey)} className="w-4 h-4" />
              <label className="text-sm font-medium text-gray-700 capitalize">{filterKey === 'dateRange' ? 'Date Range' : filterKey.replace(/([A-Z])/g, ' $1').trim()}</label>
            </div>
            {enabledFilters[filterKey] && (
              <div className="p-3">
                {filterKey === 'dateRange' ? (
                  <div className="space-y-2">
                    <input type="date" value={advancedFilters.dateFrom} onChange={(e) => handleAdvancedFilterChange('dateFrom', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                    <input type="date" value={advancedFilters.dateTo} onChange={(e) => handleAdvancedFilterChange('dateTo', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                  </div>
                ) : (
                  <select value={advancedFilters[filterKey]} onChange={(e) => handleAdvancedFilterChange(filterKey, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option value="">All</option>
                    {(getUniqueFilterOptions[filterKey === 'tag' ? 'tags' : filterKey === 'followUpStatus' ? 'followUpStatuses' : filterKey === 'salesStatus' ? 'salesStatuses' : filterKey === 'state' ? 'states' : filterKey === 'leadSource' ? 'leadSources' : 'products'] || []).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200">
        <button onClick={clearAdvancedFilters} className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
          Clear All Filters
        </button>
      </div>
    </div>
  )
}
