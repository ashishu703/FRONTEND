import React, { useState } from 'react';
import { Search, Package, Image, ChevronRight, Download, Star, Info } from 'lucide-react';

const MobileToolbox = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample product categories and data
  const categories = [
    { id: 'all', label: 'All Products', count: 25 },
    { id: 'cables', label: 'Cables', count: 12 },
    { id: 'conductors', label: 'Conductors', count: 8 },
    { id: 'wires', label: 'Wires', count: 5 }
  ];

  const products = [
    {
      id: 1,
      name: 'ACSR Conductor',
      description: 'Aluminium Conductor Steel Reinforced for overhead transmission',
      category: 'conductors',
      image: '/images/products/all aluminium alloy conductor.jpeg',
      price: '₹150/m',
      stock: 'Available',
      rating: 4.5,
      specifications: {
        voltage: '33 kV',
        conductor: 'Aluminum + Steel',
        insulation: 'Bare',
        temperature: '-40°C to +80°C'
      }
    },
    {
      id: 2,
      name: 'Aerial Bunch Cable',
      description: 'Overhead power distribution cable',
      category: 'cables',
      image: '/images/products/aerial bunch cable.jpeg',
      price: '₹200/m',
      stock: 'Available',
      rating: 4.2,
      specifications: {
        voltage: '11 kV',
        conductor: 'Aluminum',
        insulation: 'XLPE',
        temperature: '-20°C to +70°C'
      }
    },
    {
      id: 3,
      name: 'Single Core PVC Cable',
      description: 'Single core power cable with PVC insulation',
      category: 'cables',
      image: '/images/products/single core pvc insulated aluminium copper armoured_unarmoured cable.jpeg',
      price: '₹120/m',
      stock: 'Limited',
      rating: 4.0,
      specifications: {
        voltage: '1.1 kV',
        conductor: 'Aluminum/Copper',
        insulation: 'PVC',
        temperature: '-15°C to +70°C'
      }
    },
    {
      id: 4,
      name: 'Multi Core XLPE Cable',
      description: 'Multi-core XLPE cable with aluminium armour',
      category: 'cables',
      image: '/images/products/multi core xlpe insulated aluminium armoured cable.jpeg',
      price: '₹180/m',
      stock: 'Available',
      rating: 4.3,
      specifications: {
        voltage: '11 kV',
        conductor: 'Aluminum',
        insulation: 'XLPE',
        temperature: '-20°C to +90°C'
      }
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockColor = (stock) => {
    switch (stock) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Limited': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Product Catalog</h1>
        <button className="p-2 bg-blue-600 text-white rounded-lg">
          <Package className="h-5 w-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Category Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Product Image */}
            <div className="relative h-48 bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="hidden absolute inset-0 items-center justify-center bg-gray-200">
                <Image className="h-12 w-12 text-gray-400" />
              </div>
              
              {/* Stock Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockColor(product.stock)}`}>
                  {product.stock}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{product.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-blue-600">{product.price}</span>
                <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                  <Info className="h-4 w-4" />
                </button>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-xs">
                  <span className="text-gray-500">Voltage:</span>
                  <span className="ml-1 font-medium">{product.specifications.voltage}</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">Conductor:</span>
                  <span className="ml-1 font-medium">{product.specifications.conductor}</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">Insulation:</span>
                  <span className="ml-1 font-medium">{product.specifications.insulation}</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">Temp:</span>
                  <span className="ml-1 font-medium">{product.specifications.temperature}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  View Details
                </button>
                <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No products found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default MobileToolbox;
