import React, { useState } from 'react';
import { Search, Filter, Plus, Box, Eye, Edit, Trash2, Calendar, Star, Package, Image } from 'lucide-react';

const MobileProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Product data matching the desktop toolbox interface
  const products = [
    { name: "Aerial Bunch Cable", description: "Overhead power distribution cable", imageUrl: "/images/products/aerial bunch cable.jpeg" },
    { name: "Aluminium Conductor Galvanized Steel Reinforced", description: "ACSR conductor for transmission lines", imageUrl: "/images/products/all aluminium alloy conductor.jpeg" },
    { name: "All Aluminium Alloy Conductor", description: "AAAC conductor for overhead lines", imageUrl: "/images/products/all aluminium alloy conductor.jpeg" },
    { name: "Paper Cover Aluminium Conductor", description: "Traditional paper insulated conductor", imageUrl: "/images/products/paper covered aluminium conductor.jpeg" },
    { name: "Single Core PVC Insulated Aluminium/Copper Armoured/Unarmoured Cable", description: "Single core power cable with PVC insulation", imageUrl: "/images/products/single core pvc insulated aluminium copper armoured_unarmoured cable.jpeg" },
    { name: "Single Core XLPE Insulated Aluminium/Copper Armoured/Unarmoured Cable", description: "Single core power cable with XLPE insulation", imageUrl: "/images/products/single core pvc insulated aluminium copper armoured_unarmoured cable.jpeg" },
    { name: "Multi Core PVC Insulated Aluminium Armoured Cable", description: "Multi-core power cable with aluminium armour", imageUrl: "/images/products/multi core pvc isulated aluminium armoured cable.jpeg" },
    { name: "Multi Core XLPE Insulated Aluminium Armoured Cable", description: "Multi-core XLPE cable with aluminium armour", imageUrl: "/images/products/multi core xlpe insulated aluminium armoured cable.jpeg" },
    { name: "Multi Core PVC Insulated Aluminium Unarmoured Cable", description: "Multi-core PVC cable without armour", imageUrl: "/images/products/multi core pvc insulated aluminium unarmoured cable.jpeg" },
    { name: "Multi Core XLPE Insulated Aluminium Unarmoured Cable", description: "Multi-core XLPE cable without armour", imageUrl: "/images/products/multi core pvc insulated aluminium unarmoured cable.jpeg" },
    { name: "Multistrand Single Core Copper Cable", description: "Flexible single core copper cable", imageUrl: "/images/products/multistrand single core copper cable.jpeg" },
    { name: "Multi Core Copper Cable", description: "Multi-core copper power cable", imageUrl: "/images/products/multi core copper cable.jpeg" },
    { name: "PVC Insulated Single Core Aluminium Cable", description: "Single core aluminium cable with PVC insulation", imageUrl: "/images/products/pvc insulated single core aluminium cables.jpeg" },
    { name: "PVC Insulated Submersible Cable", description: "Water-resistant submersible cable", imageUrl: "/images/products/pvc insulated submersible cable.jpeg" },
    { name: "PVC Insulated Multicore Aluminium Cable", description: "Multi-core aluminium cable with PVC insulation", imageUrl: "/images/products/pvc insulated multicore aluminium cable.jpeg" },
    { name: "Submersible Winding Wire", description: "Specialized winding wire for submersible applications", imageUrl: "/images/products/submersible winding wire.jpeg" },
    { name: "Twin Twisted Copper Wire", description: "Twisted pair copper wire", imageUrl: "/images/products/twin twisted copper wire.jpeg" },
    { name: "Speaker Cable", description: "Audio speaker connection cable", imageUrl: "/images/products/speaker cable.jpeg" },
    { name: "CCTV Cable", description: "Closed-circuit television cable", imageUrl: "/images/products/cctv cable.jpeg" },
    { name: "LAN Cable", description: "Local area network cable", imageUrl: "/images/products/telecom switch board cables.jpeg" },
    { name: "Automobile Cable", description: "Automotive electrical cable", imageUrl: "/images/products/automobile wire.jpeg" },
    { name: "PV Solar Cable", description: "Photovoltaic solar panel cable", imageUrl: "/images/products/pv solar cable.jpeg" },
    { name: "Co Axial Cable", description: "Coaxial transmission cable", imageUrl: "/images/products/co axial cable.jpeg" },
    { name: "Uni-tube Unarmoured Optical Fibre Cable", description: "Single tube optical fibre cable", imageUrl: "/images/products/unitube unarmoured optical fibre cable.jpeg" },
    { name: "Armoured Unarmoured PVC Insulated Copper Control Cable", description: "Control cable for industrial applications", imageUrl: "/images/products/armoured unarmoured pvc insulated copper control cable.jpeg" },
    { name: "Telecom Switch Board Cables", description: "Telecommunications switchboard cable", imageUrl: "/images/products/telecom switch board cables.jpeg" }
  ];

  const categories = [
    { id: 'all', label: 'All Products', count: products.length },
    { id: 'cables', label: 'Cables', count: products.filter(p => p.name.toLowerCase().includes('cable')).length },
    { id: 'conductors', label: 'Conductors', count: products.filter(p => p.name.toLowerCase().includes('conductor')).length },
    { id: 'wires', label: 'Wires', count: products.filter(p => p.name.toLowerCase().includes('wire')).length }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'cables' && product.name.toLowerCase().includes('cable')) ||
                           (selectedCategory === 'conductors' && product.name.toLowerCase().includes('conductor')) ||
                           (selectedCategory === 'wires' && product.name.toLowerCase().includes('wire'));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Product Toolbar</h1>
        <button className="p-2 bg-blue-600 text-white rounded-lg">
          <Plus className="h-5 w-5" />
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

      {/* Products Grid - 3 Columns */}
      <div className="grid grid-cols-3 gap-3">
        {filteredProducts.map((product, index) => (
          <div key={index} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            {/* Product Image */}
            <div className="relative h-24 bg-gray-100 rounded-lg mb-3 overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="hidden absolute inset-0 items-center justify-center bg-gray-200">
                <Image className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            {/* Product Info */}
            <div className="text-center">
              <h3 className="text-xs font-semibold text-gray-900 mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2">
                {product.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <Box className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No products found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default MobileProducts;
