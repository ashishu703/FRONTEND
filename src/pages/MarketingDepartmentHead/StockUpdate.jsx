import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Plus, Edit, Eye, Download, Trash2, AlertCircle, CheckCircle, XCircle, BarChart3, TrendingUp, TrendingDown, Megaphone, Target, Palette } from 'lucide-react';

const MarketingStockUpdate = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Sample marketing materials stock data
  const [stockItems, setStockItems] = useState([
    {
      id: 1,
      itemName: 'Business Cards',
      category: 'Print Materials',
      description: 'Premium business cards with company branding',
      currentStock: 5000,
      minimumStock: 1000,
      maximumStock: 10000,
      unit: 'pieces',
      pricePerUnit: 0.25,
      location: 'Marketing Storage A',
      supplier: 'PrintPro Solutions',
      lastUpdated: '2024-01-15',
      status: 'In Stock',
      campaign: 'General Branding'
    },
    {
      id: 2,
      itemName: 'Brochures - Product Catalog',
      category: 'Print Materials',
      description: 'Full-color product catalog brochures',
      currentStock: 800,
      minimumStock: 500,
      maximumStock: 2000,
      unit: 'pieces',
      pricePerUnit: 1.50,
      location: 'Marketing Storage A',
      supplier: 'Creative Print House',
      lastUpdated: '2024-01-14',
      status: 'In Stock',
      campaign: 'Product Launch 2024'
    },
    {
      id: 3,
      itemName: 'Banner Stands',
      category: 'Display Materials',
      description: 'Retractable banner stands for trade shows',
      currentStock: 15,
      minimumStock: 10,
      maximumStock: 50,
      unit: 'pieces',
      pricePerUnit: 85.00,
      location: 'Marketing Storage B',
      supplier: 'Display Masters',
      lastUpdated: '2024-01-13',
      status: 'In Stock',
      campaign: 'Trade Show 2024'
    },
    {
      id: 4,
      itemName: 'Promotional Pens',
      category: 'Promotional Items',
      description: 'Custom branded promotional pens',
      currentStock: 200,
      minimumStock: 500,
      maximumStock: 5000,
      unit: 'pieces',
      pricePerUnit: 0.75,
      location: 'Marketing Storage C',
      supplier: 'Promo Plus',
      lastUpdated: '2024-01-12',
      status: 'Low Stock',
      campaign: 'General Promotion'
    },
    {
      id: 5,
      itemName: 'T-Shirts - Company Logo',
      category: 'Promotional Items',
      description: 'Cotton t-shirts with company logo',
      currentStock: 0,
      minimumStock: 100,
      maximumStock: 1000,
      unit: 'pieces',
      pricePerUnit: 12.00,
      location: 'Marketing Storage C',
      supplier: 'Apparel Works',
      lastUpdated: '2024-01-11',
      status: 'Out of Stock',
      campaign: 'Employee Branding'
    },
    {
      id: 6,
      itemName: 'Digital Signage Content',
      category: 'Digital Assets',
      description: 'Digital content for marketing displays',
      currentStock: 25,
      minimumStock: 10,
      maximumStock: 100,
      unit: 'files',
      pricePerUnit: 50.00,
      location: 'Digital Storage',
      supplier: 'Digital Creative Co',
      lastUpdated: '2024-01-16',
      status: 'In Stock',
      campaign: 'Digital Marketing 2024'
    },
    {
      id: 7,
      itemName: 'Trade Show Booth Materials',
      category: 'Display Materials',
      description: 'Complete trade show booth setup materials',
      currentStock: 3,
      minimumStock: 2,
      maximumStock: 10,
      unit: 'sets',
      pricePerUnit: 1200.00,
      location: 'Marketing Storage B',
      supplier: 'Exhibit Pro',
      lastUpdated: '2024-01-10',
      status: 'In Stock',
      campaign: 'Trade Show 2024'
    },
    {
      id: 8,
      itemName: 'Email Templates',
      category: 'Digital Assets',
      description: 'Professional email marketing templates',
      currentStock: 50,
      minimumStock: 20,
      maximumStock: 200,
      unit: 'templates',
      pricePerUnit: 25.00,
      location: 'Digital Storage',
      supplier: 'Template Designs Inc',
      lastUpdated: '2024-01-17',
      status: 'In Stock',
      campaign: 'Email Marketing'
    }
  ]);

  const [newItem, setNewItem] = useState({
    itemName: '',
    category: '',
    description: '',
    currentStock: 0,
    minimumStock: 0,
    maximumStock: 0,
    unit: '',
    pricePerUnit: 0,
    location: '',
    supplier: '',
    campaign: ''
  });

  const categories = ['All Categories', 'Print Materials', 'Display Materials', 'Promotional Items', 'Digital Assets'];
  const locations = ['All Locations', 'Marketing Storage A', 'Marketing Storage B', 'Marketing Storage C', 'Digital Storage'];
  const units = ['pieces', 'sets', 'files', 'templates', 'boxes', 'rolls'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'In Stock':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Low Stock':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'Out of Stock':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Print Materials':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'Display Materials':
        return <BarChart3 className="w-4 h-4 text-purple-600" />;
      case 'Promotional Items':
        return <Target className="w-4 h-4 text-green-600" />;
      case 'Digital Assets':
        return <Palette className="w-4 h-4 text-orange-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = !searchTerm || 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All Locations' || item.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleAddItem = () => {
    const newId = Math.max(...stockItems.map(item => item.id)) + 1;
    const status = newItem.currentStock === 0 ? 'Out of Stock' : 
                  newItem.currentStock <= newItem.minimumStock ? 'Low Stock' : 'In Stock';
    
    const itemToAdd = {
      ...newItem,
      id: newId,
      lastUpdated: new Date().toISOString().split('T')[0],
      status
    };
    
    setStockItems([...stockItems, itemToAdd]);
    setNewItem({
      itemName: '',
      category: '',
      description: '',
      currentStock: 0,
      minimumStock: 0,
      maximumStock: 0,
      unit: '',
      pricePerUnit: 0,
      location: '',
      supplier: '',
      campaign: ''
    });
    setShowAddModal(false);
  };

  const handleEditItem = () => {
    const status = selectedItem.currentStock === 0 ? 'Out of Stock' : 
                  selectedItem.currentStock <= selectedItem.minimumStock ? 'Low Stock' : 'In Stock';
    
    const updatedItems = stockItems.map(item => 
      item.id === selectedItem.id 
        ? { ...selectedItem, status, lastUpdated: new Date().toISOString().split('T')[0] }
        : item
    );
    
    setStockItems(updatedItems);
    setShowEditModal(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = (id) => {
    setStockItems(stockItems.filter(item => item.id !== id));
  };

  const exportToPDF = () => {
    // This would typically use a library like html2pdf.js
    const element = document.createElement('div');
    element.innerHTML = `
      <h1>Marketing Materials Stock Report</h1>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Category</th>
            <th>Current Stock</th>
            <th>Status</th>
            <th>Location</th>
            <th>Campaign</th>
          </tr>
        </thead>
        <tbody>
          ${filteredItems.map(item => `
            <tr>
              <td>${item.itemName}</td>
              <td>${item.category}</td>
              <td>${item.currentStock} ${item.unit}</td>
              <td>${item.status}</td>
              <td>${item.location}</td>
              <td>${item.campaign}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    // For demo purposes, we'll just show an alert
    alert('Stock report would be exported as PDF in a real implementation');
  };

  const getTotalValue = () => {
    return filteredItems.reduce((total, item) => total + (item.currentStock * item.pricePerUnit), 0);
  };

  const getStockStats = () => {
    const inStock = filteredItems.filter(item => item.status === 'In Stock').length;
    const lowStock = filteredItems.filter(item => item.status === 'Low Stock').length;
    const outOfStock = filteredItems.filter(item => item.status === 'Out of Stock').length;
    
    return { inStock, lowStock, outOfStock };
  };

  const stats = getStockStats();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">In Stock</h3>
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
          <p className="text-xs text-gray-600">Items available</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">Low Stock</h3>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
          <p className="text-xs text-gray-600">Need reorder</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">Out of Stock</h3>
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
          <p className="text-xs text-gray-600">Urgent reorder</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">Total Value</h3>
          </div>
          <div className="text-2xl font-bold text-blue-600">${getTotalValue().toFixed(2)}</div>
          <p className="text-xs text-gray-600">Current inventory</p>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search marketing materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(item.category)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.currentStock} {item.unit}</div>
                    <div className="text-sm text-gray-500">Min: {item.minimumStock} | Max: {item.maximumStock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                      {item.campaign}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${(item.currentStock * item.pricePerUnit).toFixed(2)}</div>
                    <div className="text-sm text-gray-500">${item.pricePerUnit}/{item.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowViewModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowEditModal(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
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

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 text-lg">No marketing materials found</div>
          <div className="text-gray-400 text-sm mt-2">Try adjusting your search criteria or add new items</div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Marketing Material</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    value={newItem.itemName}
                    onChange={(e) => setNewItem({...newItem, itemName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                  <input
                    type="number"
                    value={newItem.currentStock}
                    onChange={(e) => setNewItem({...newItem, currentStock: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Unit</option>
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock</label>
                  <input
                    type="number"
                    value={newItem.minimumStock}
                    onChange={(e) => setNewItem({...newItem, minimumStock: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Stock</label>
                  <input
                    type="number"
                    value={newItem.maximumStock}
                    onChange={(e) => setNewItem({...newItem, maximumStock: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.pricePerUnit}
                    onChange={(e) => setNewItem({...newItem, pricePerUnit: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    value={newItem.location}
                    onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Location</option>
                    {locations.slice(1).map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <input
                    type="text"
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign</label>
                  <input
                    type="text"
                    value={newItem.campaign}
                    onChange={(e) => setNewItem({...newItem, campaign: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Marketing Material</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    value={selectedItem.itemName}
                    onChange={(e) => setSelectedItem({...selectedItem, itemName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={selectedItem.category}
                    onChange={(e) => setSelectedItem({...selectedItem, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={selectedItem.description}
                    onChange={(e) => setSelectedItem({...selectedItem, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                  <input
                    type="number"
                    value={selectedItem.currentStock}
                    onChange={(e) => setSelectedItem({...selectedItem, currentStock: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    value={selectedItem.unit}
                    onChange={(e) => setSelectedItem({...selectedItem, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock</label>
                  <input
                    type="number"
                    value={selectedItem.minimumStock}
                    onChange={(e) => setSelectedItem({...selectedItem, minimumStock: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Stock</label>
                  <input
                    type="number"
                    value={selectedItem.maximumStock}
                    onChange={(e) => setSelectedItem({...selectedItem, maximumStock: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedItem.pricePerUnit}
                    onChange={(e) => setSelectedItem({...selectedItem, pricePerUnit: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    value={selectedItem.location}
                    onChange={(e) => setSelectedItem({...selectedItem, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {locations.slice(1).map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <input
                    type="text"
                    value={selectedItem.supplier}
                    onChange={(e) => setSelectedItem({...selectedItem, supplier: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign</label>
                  <input
                    type="text"
                    value={selectedItem.campaign}
                    onChange={(e) => setSelectedItem({...selectedItem, campaign: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Item Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {getCategoryIcon(selectedItem.category)}
                <h3 className="text-lg font-semibold text-gray-900">{selectedItem.itemName}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedItem.status)}`}>
                  {selectedItem.status}
                </span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">{selectedItem.category}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">{selectedItem.campaign}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">{selectedItem.description}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">{selectedItem.currentStock} {selectedItem.unit}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Range</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    Min: {selectedItem.minimumStock} | Max: {selectedItem.maximumStock}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">${selectedItem.pricePerUnit}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Value</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-semibold">
                    ${(selectedItem.currentStock * selectedItem.pricePerUnit).toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">{selectedItem.location}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">{selectedItem.supplier}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">{selectedItem.lastUpdated}</div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingStockUpdate;
