"use client"

import React, { useState } from 'react';
import { Package, Eye, X } from 'lucide-react';
import Toolbar, { ProductPagination } from './Toolbar';

// Modal component for viewing product details
const ProductDetailsModal = ({ product, onClose }) => {
  if (!product) return null;

  const statusText = {
    'in-stock': 'In Stock',
    'low-stock': 'Low Stock',
    'out-of-stock': 'Out of Stock',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Product Code</p>
              <p className="mt-1 text-sm text-gray-900">{product.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="mt-1 text-sm text-gray-900">{product.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="mt-1 text-sm text-gray-900">{product.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Stock</p>
              <p className="mt-1 text-sm text-gray-900">{product.stock.toLocaleString()} {product.unit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="mt-1 text-sm text-gray-900">₹{product.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="mt-1 text-sm text-gray-900">{statusText[product.status]}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="mt-1 text-sm text-gray-900">{product.lastUpdated}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tooltip component for action buttons
const Tooltip = ({ children, text }) => (
  <div className="relative group">
    {children}
    <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute z-10 left-1/2 transform -translate-x-1/2 -translate-y-8 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap">
      {text}
    </span>
  </div>
);

const sampleProducts = [
  {
    id: 1,
    code: 'CBL-001',
    name: 'Copper Cable 1.5mm',
    category: 'cable',
    stock: 1250,
    unit: 'Meter',
    price: 125.50,
    status: 'in-stock',
    description: 'High quality copper cable for electrical wiring',
    lastUpdated: '2025-09-10',
  },
  {
    id: 2,
    code: 'CND-002',
    name: 'Aluminum Conductor 4mm',
    category: 'conductor',
    stock: 850,
    unit: 'Meter',
    price: 95.75,
    status: 'in-stock',
    description: 'Lightweight aluminum conductor for power transmission',
    lastUpdated: '2025-09-11',
  },
  {
    id: 3,
    code: 'WIR-003',
    name: 'Copper Wire 2.5mm',
    category: 'wire',
    stock: 2000,
    unit: 'Meter',
    price: 85.25,
    status: 'in-stock',
    description: 'Flexible copper wire for general electrical applications',
    lastUpdated: '2025-09-12',
  },
  {
    id: 4,
    code: 'ACC-004',
    name: 'Cable Glands',
    category: 'accessories',
    stock: 500,
    unit: 'Pieces',
    price: 25.00,
    status: 'low-stock',
    description: 'Cable glands for secure cable termination',
    lastUpdated: '2025-09-10',
  },
  {
    id: 5,
    code: 'CBL-005',
    name: 'Armored Cable 4mm',
    category: 'cable',
    stock: 0,
    unit: 'Meter',
    price: 210.00,
    status: 'out-of-stock',
    description: 'Armored cable for outdoor and underground installations',
    lastUpdated: '2025-09-11',
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(sampleProducts);
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredProducts(products);
      setCurrentPage(1); // Reset to first page
      return;
    }
    
    const lowercasedQuery = query.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercasedQuery) ||
        product.code.toLowerCase().includes(lowercasedQuery) ||
        product.category.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page
  };

  const handleFilterChange = (filters) => {
    let filtered = [...products];
    
    if (filters.category) {
      filtered = filtered.filter(product => product.category.toLowerCase() === filters.category);
    }
    
    if (filters.status) {
      filtered = filtered.filter(product => product.status === filters.status);
    }
    
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const handleAddProduct = () => {
    alert('Add new product functionality will be implemented here');
  };

  const handleExport = () => {
    alert('Export functionality will be implemented here');
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };


  const getStatusBadge = (status) => {
    const statusClasses = {
      'in-stock': 'bg-green-100 text-green-800',
      'low-stock': 'bg-yellow-100 text-yellow-800',
      'out-of-stock': 'bg-red-100 text-red-800',
    };

    const statusText = {
      'in-stock': 'In Stock',
      'low-stock': 'Low Stock',
      'out-of-stock': 'Out of Stock',
    };

    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}
      >
        {statusText[status]}
      </span>
    );
  };

  return (
    <div className="p-6">

      <Toolbar
        onSearch={handleSearch}
        onAddProduct={handleAddProduct}
        onExport={handleExport}
        onFilterChange={handleFilterChange}
        products={products}
      />

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Code
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.stock.toLocaleString()} {product.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Tooltip text="View Details">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProduct(product);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No products found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredProducts.length}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
      
      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
      
    </div>
  );
}
