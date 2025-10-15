import React, { useState } from 'react';
import { Search, Filter, Plus, Package, Eye, Edit, Trash2, Calendar, MapPin, AlertCircle } from 'lucide-react';

const MobileStock = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Stock data matching the desktop stock interface
  const stockItems = [
    {
      id: 1,
      itemCode: "CBL-001",
      name: "Copper Cable 1.5mm",
      category: "Cable",
      quantity: 1250,
      unit: "Meter",
      rate: 125.50,
      location: "Warehouse A",
      lastUpdated: "2025-09-10"
    },
    {
      id: 2,
      itemCode: "CND-002",
      name: "Aluminum Conductor 4mm",
      category: "Conductor",
      quantity: 850,
      unit: "Meter",
      rate: 95.75,
      location: "Warehouse B",
      lastUpdated: "2025-09-11"
    },
    {
      id: 3,
      itemCode: "WIR-003",
      name: "Copper Wire 2.5mm",
      category: "Wire",
      quantity: 2000,
      unit: "Meter",
      rate: 85.25,
      location: "Warehouse A",
      lastUpdated: "2025-09-12"
    },
    {
      id: 4,
      itemCode: "ACC-004",
      name: "Cable Glands",
      category: "Accessories",
      quantity: 500,
      unit: "Pieces",
      rate: 25.00,
      location: "Warehouse C",
      lastUpdated: "2025-09-10"
    },
    {
      id: 5,
      itemCode: "CBL-005",
      name: "Armored Cable 4mm",
      category: "Cable",
      quantity: 750,
      unit: "Meter",
      rate: 210.00,
      location: "Warehouse B",
      lastUpdated: "2025-09-11"
    }
  ];

  const categories = [
    { id: 'all', label: 'All Items', count: stockItems.length },
    { id: 'Cable', label: 'Cables', count: stockItems.filter(item => item.category === 'Cable').length },
    { id: 'Conductor', label: 'Conductors', count: stockItems.filter(item => item.category === 'Conductor').length },
    { id: 'Wire', label: 'Wires', count: stockItems.filter(item => item.category === 'Wire').length },
    { id: 'Accessories', label: 'Accessories', count: stockItems.filter(item => item.category === 'Accessories').length }
  ];

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Available Stock</h1>
        <button className="p-1.5 bg-blue-600 text-white rounded-lg">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search stock items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Category Filters */}
      <div className="flex space-x-1 overflow-x-auto pb-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Stock Items List */}
      <div className="space-y-2">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-sm text-gray-900">{item.name}</h3>
                  <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Code: {item.itemCode}</p>
              </div>
              <div className="flex space-x-1">
                <button className="p-1.5 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                  <Eye className="h-3 w-3 text-gray-600" />
                </button>
                <button className="p-1.5 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                  <Edit className="h-3 w-3 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="space-y-1 mb-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Qty:</span>
                <span className="font-semibold text-gray-900">{item.quantity} {item.unit}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Rate:</span>
                <span className="font-semibold text-gray-900">₹{item.rate}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Total:</span>
                <span className="font-semibold text-gray-900">₹{(item.quantity * item.rate).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-1 mb-2">
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{item.location}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>Updated: {item.lastUpdated}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                <div className="flex items-center space-x-1 text-green-600">
                  <Package className="h-3 w-3" />
                  <span>In Stock</span>
                </div>
              </div>
              <div className="flex space-x-1">
                <button className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded hover:bg-blue-200 transition-colors">
                  Update
                </button>
                <button className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No stock items found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default MobileStock;
