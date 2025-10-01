import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreHorizontal
} from 'lucide-react';
import html2pdf from 'html2pdf.js';

const StockUpdate = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [editingStock, setEditingStock] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    location: ''
  });
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowCategoryDropdown(false);
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sample stock data matching reference
  const [stockData, setStockData] = useState([
    {
      id: 1,
      itemCode: 'CBL-001',
      productName: 'Copper Cable 1.5mm',
      category: 'Cable',
      currentStock: 1250,
      unit: 'Meter',
      lastUpdated: '2025-09-10',
      price: 125.50,
      location: 'Warehouse A'
    },
    {
      id: 2,
      itemCode: 'CND-002',
      productName: 'Aluminum Conductor 4mm',
      category: 'Conductor',
      currentStock: 850,
      unit: 'Meter',
      lastUpdated: '2025-09-11',
      price: 95.75,
      location: 'Warehouse B'
    },
    {
      id: 3,
      itemCode: 'WIR-003',
      productName: 'Copper Wire 2.5mm',
      category: 'Wire',
      currentStock: 2000,
      unit: 'Meter',
      lastUpdated: '2025-09-12',
      price: 85.25,
      location: 'Warehouse A'
    },
    {
      id: 4,
      itemCode: 'ACC-004',
      productName: 'Cable Glands',
      category: 'Accessories',
      currentStock: 500,
      unit: 'Pieces',
      lastUpdated: '2025-09-10',
      price: 25.00,
      location: 'Warehouse C'
    },
    {
      id: 5,
      itemCode: 'CBL-005',
      productName: 'Armored Cable 4mm',
      category: 'Cable',
      currentStock: 750,
      unit: 'Meter',
      lastUpdated: '2025-09-11',
      price: 210.00,
      location: 'Warehouse B'
    }
  ]);

  const [addFormData, setAddFormData] = useState({
    itemCode: '',
    productName: '',
    category: '',
    currentStock: '',
    unit: '',
    price: '',
    location: ''
  });

  const [editFormData, setEditFormData] = useState({
    itemCode: '',
    productName: '',
    category: '',
    currentStock: '',
    unit: '',
    price: '',
    location: ''
  });

  const handleAddFormChange = (field, value) => {
    setAddFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddStock = () => {
    const newStock = {
      id: stockData.length + 1,
      ...addFormData,
      currentStock: parseInt(addFormData.currentStock),
      minThreshold: parseInt(addFormData.minThreshold),
      maxThreshold: parseInt(addFormData.maxThreshold),
      price: parseFloat(addFormData.price),
      lastUpdated: new Date().toISOString().split('T')[0],
      status: addFormData.currentStock >= addFormData.minThreshold ? 'In Stock' : 
              addFormData.currentStock > 0 ? 'Low Stock' : 'Out of Stock'
    };
    
    setStockData(prev => [...prev, newStock]);
    setShowAddModal(false);
    setAddFormData({
      productName: '',
      category: '',
      currentStock: '',
      minThreshold: '',
      maxThreshold: '',
      unit: '',
      price: '',
      supplier: ''
    });
  };

  const handleEditStock = () => {
    setStockData(prev => prev.map(stock => 
      stock.id === editingStock.id 
        ? {
            ...stock,
            ...editFormData,
            currentStock: parseInt(editFormData.currentStock),
            minThreshold: parseInt(editFormData.minThreshold),
            maxThreshold: parseInt(editFormData.maxThreshold),
            price: parseFloat(editFormData.price),
            lastUpdated: new Date().toISOString().split('T')[0],
            status: editFormData.currentStock >= editFormData.minThreshold ? 'In Stock' : 
                    editFormData.currentStock > 0 ? 'Low Stock' : 'Out of Stock'
          }
        : stock
    ));
    setShowEditModal(false);
    setEditingStock(null);
  };

  const handleDeleteStock = (id) => {
    setStockData(prev => prev.filter(stock => stock.id !== id));
  };

  const handleViewStock = (stock) => {
    setSelectedStock(stock);
    setShowViewModal(true);
  };

  const handleEditStockClick = (stock) => {
    setEditingStock(stock);
    setEditFormData({
      productName: stock.productName,
      category: stock.category,
      currentStock: stock.currentStock.toString(),
      minThreshold: stock.minThreshold.toString(),
      maxThreshold: stock.maxThreshold.toString(),
      unit: stock.unit,
      price: stock.price.toString(),
      supplier: stock.supplier
    });
    setShowEditModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Low Stock':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Out of Stock':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'In Stock':
        return <CheckCircle className="w-4 h-4" />;
      case 'Low Stock':
        return <AlertCircle className="w-4 h-4" />;
      case 'Out of Stock':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredStock = stockData.filter(stock => {
    const matchesSearch = stock.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === '' || stock.category === filters.category;
    const matchesLocation = filters.location === '' || stock.location === filters.location;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Get unique categories and locations for filter dropdowns
  const categories = [...new Set(stockData.map(item => item.category))];
  const locations = [...new Set(stockData.map(item => item.location))];

  // Filter handling functions
  const handleCategoryFilter = (category) => {
    setFilters(prev => ({ ...prev, category }));
    setShowCategoryDropdown(false);
  };

  const handleLocationFilter = (location) => {
    setFilters(prev => ({ ...prev, location }));
    setShowLocationDropdown(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleExport = async () => {
    try {
      // Create a temporary div for PDF generation
      const tempDiv = document.createElement('div')
      tempDiv.style.padding = '20px'
      tempDiv.style.fontFamily = 'Arial, sans-serif'
      tempDiv.style.fontSize = '12px'
      tempDiv.style.color = '#000'
      tempDiv.style.backgroundColor = '#fff'
      
      // Add title
      tempDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px;">
          <h1 style="margin: 0; font-size: 24px; color: #1f2937;">ANOCAB STOCK REPORT</h1>
          <p style="margin: 5px 0 0 0; color: #6b7280;">Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Item Code</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Name</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Category</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Quantity</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Unit</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Rate (₹)</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Location</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            ${filteredStock.map((item, index) => `
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${item.itemCode}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${item.productName}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${item.category}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${item.currentStock.toLocaleString()}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${item.unit}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">₹${item.price.toFixed(2)}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${item.location}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${item.lastUpdated}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 11px;">
          <p>Total Items: ${filteredStock.length}</p>
          <p>Generated by ANOCAB CRM System</p>
        </div>
      `
      
      // Temporarily add to DOM
      document.body.appendChild(tempDiv)
      
      // PDF generation options
      const opt = {
        margin: 0.5,
        filename: `anocab-stock-report-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1,
          useCORS: true,
          logging: false
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'landscape' 
        }
      }
      
      // Generate and download the PDF
      await html2pdf().set(opt).from(tempDiv).save()
      
      // Clean up
      document.body.removeChild(tempDiv)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">

      {/* Search and Filter Controls */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-3 py-1.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative dropdown-container">
              <button 
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <span className="text-gray-700">{filters.category || 'All Categories'}</span>
                <Filter className="w-3.5 h-3.5 text-gray-700" />
              </button>
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleCategoryFilter('')}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${!filters.category ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                    >
                      All Categories
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => handleCategoryFilter(category)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${filters.category === category ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative dropdown-container">
              <button 
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <span className="text-gray-700">{filters.location || 'All Locations'}</span>
                <Filter className="w-3.5 h-3.5 text-gray-700" />
              </button>
              {showLocationDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleLocationFilter('')}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${!filters.location ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                    >
                      All Locations
                    </button>
                    {locations.map(location => (
                      <button
                        key={location}
                        onClick={() => handleLocationFilter(location)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${filters.location === location ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Download className="w-3.5 h-3.5 text-gray-700" />
              <span className="text-gray-700">Export</span>
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add New Item
            </button>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ITEM CODE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NAME
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CATEGORY
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  QUANTITY
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  UNIT
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RATE (₹)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LOCATION
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LAST UPDATED
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStock.map((stock) => (
                <tr key={stock.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {stock.itemCode}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {stock.productName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {stock.category}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    {stock.currentStock.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    {stock.unit}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    ₹{stock.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {stock.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {stock.lastUpdated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Show</span>
          <select className="px-2 py-1 border border-gray-300 rounded text-sm">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span className="text-sm text-gray-700">entries</span>
        </div>
        <div className="text-sm text-gray-700">
          Showing 1 to {stockData.length} of {stockData.length} entries
        </div>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            First
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white border border-blue-600 rounded">
            1
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            Next
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            Last
          </button>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Stock Item</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={addFormData.productName}
                  onChange={(e) => handleAddFormChange('productName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={addFormData.category}
                  onChange={(e) => handleAddFormChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                <input
                  type="number"
                  value={addFormData.currentStock}
                  onChange={(e) => handleAddFormChange('currentStock', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <select
                  value={addFormData.unit}
                  onChange={(e) => handleAddFormChange('unit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Unit</option>
                  <option value="pieces">Pieces</option>
                  <option value="kg">Kilograms</option>
                  <option value="bags">Bags</option>
                  <option value="meters">Meters</option>
                  <option value="liters">Liters</option>
                  <option value="boxes">Boxes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Threshold</label>
                <input
                  type="number"
                  value={addFormData.minThreshold}
                  onChange={(e) => handleAddFormChange('minThreshold', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Threshold</label>
                <input
                  type="number"
                  value={addFormData.maxThreshold}
                  onChange={(e) => handleAddFormChange('maxThreshold', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={addFormData.price}
                  onChange={(e) => handleAddFormChange('price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input
                  type="text"
                  value={addFormData.supplier}
                  onChange={(e) => handleAddFormChange('supplier', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStock}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Stock Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Stock Item</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={editFormData.productName}
                  onChange={(e) => handleEditFormChange('productName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={editFormData.category}
                  onChange={(e) => handleEditFormChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                <input
                  type="number"
                  value={editFormData.currentStock}
                  onChange={(e) => handleEditFormChange('currentStock', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <select
                  value={editFormData.unit}
                  onChange={(e) => handleEditFormChange('unit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pieces">Pieces</option>
                  <option value="kg">Kilograms</option>
                  <option value="bags">Bags</option>
                  <option value="meters">Meters</option>
                  <option value="liters">Liters</option>
                  <option value="boxes">Boxes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Threshold</label>
                <input
                  type="number"
                  value={editFormData.minThreshold}
                  onChange={(e) => handleEditFormChange('minThreshold', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Threshold</label>
                <input
                  type="number"
                  value={editFormData.maxThreshold}
                  onChange={(e) => handleEditFormChange('maxThreshold', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={editFormData.price}
                  onChange={(e) => handleEditFormChange('price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input
                  type="text"
                  value={editFormData.supplier}
                  onChange={(e) => handleEditFormChange('supplier', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditStock}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Stock Modal */}
      {showViewModal && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Stock Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Product Name</label>
                <p className="text-gray-900 font-medium">{selectedStock.productName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-gray-900">{selectedStock.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Current Stock</label>
                <p className="text-gray-900 font-medium">{selectedStock.currentStock} {selectedStock.unit}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Stock Thresholds</label>
                <p className="text-gray-900">Min: {selectedStock.minThreshold} | Max: {selectedStock.maxThreshold}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Price</label>
                <p className="text-gray-900 font-medium">{formatCurrency(selectedStock.price)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Supplier</label>
                <p className="text-gray-900">{selectedStock.supplier}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedStock.status)}`}>
                  {getStatusIcon(selectedStock.status)}
                  {selectedStock.status}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-gray-900">{selectedStock.lastUpdated}</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

export default StockUpdate;
