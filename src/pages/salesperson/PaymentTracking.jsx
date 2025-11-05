"use client"

import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, RotateCw, ChevronDown, X, Save, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function ProductToolbar({ onSearch, onAddProduct, onFilterChange, onRefresh, products = [], loading = false }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    paymentType: '', // 'advance', 'due', or ''
    quotationId: '',
    quotationStatus: '', // 'pending_approval' | 'approved' | 'rejected' | ''
  });

  const badgeDefs = [
    { key: 'pending_approval', label: 'Quotation Sent for Approval', bg: 'bg-purple-100', text: 'text-purple-800', ring: 'ring-purple-300', type: 'quotation' },
    { key: 'approved', label: 'Approved Quotation', bg: 'bg-green-100', text: 'text-green-800', ring: 'ring-green-300', type: 'quotation' },
    { key: 'rejected', label: 'Rejected Quotation', bg: 'bg-rose-100', text: 'text-rose-800', ring: 'ring-rose-300', type: 'quotation' },
    { key: 'advance', label: 'Advance Payment', bg: 'bg-blue-100', text: 'text-blue-800', ring: 'ring-blue-300', type: 'payment' },
    { key: 'due', label: 'Due Payment', bg: 'bg-red-100', text: 'text-red-800', ring: 'ring-red-300', type: 'payment' },
  ];

  const toggleBadge = (badge) => {
    if (badge.type === 'payment') {
      const newVal = filters.paymentType === badge.key ? '' : badge.key;
      const newFilters = { ...filters, paymentType: newVal };
      setFilters(newFilters);
      onFilterChange(newFilters);
    } else if (badge.type === 'quotation') {
      const newVal = filters.quotationStatus === badge.key ? '' : badge.key;
      const newFilters = { ...filters, quotationStatus: newVal };
      setFilters(newFilters);
      onFilterChange(newFilters);
    }
  };

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    leadId: '',
    customerName: '',
    productName: '',
    address: '',
    quotationId: '',
    paymentStatus: 'pending',
    workOrderId: ''
  });

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAddProduct = () => {
    setEditingItem(null);
    setFormData({
      leadId: '',
      customerName: '',
      productName: '',
      address: '',
      quotationId: '',
      paymentStatus: 'pending',
      workOrderId: ''
    });
    setShowAddItemModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!formData.customerName.trim()) {
      alert('Please enter a customer name');
      return;
    }

    const paymentData = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now(),
      leadId: formData.leadId || `LD-${String(Date.now()).slice(-6)}`,
      quotationId: formData.quotationId || `QT-${String(Date.now()).slice(-6)}`,
      workOrderId: formData.workOrderId || `WO-${String(Date.now()).slice(-6)}`
    };

    onAddProduct(paymentData, editingItem);
    setShowAddItemModal(false);
    setEditingItem(null);
    setFormData({
      leadId: '',
      customerName: '',
      productName: '',
      address: '',
      quotationId: '',
      paymentStatus: 'pending',
      workOrderId: ''
    });
  };

  // Export functionality removed. Using Refresh instead.

  return (
    <div className="mb-6">
      {/* Top Row - Filters and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        {/* Left side - Search */}
        <div className="relative w-full sm:w-80">
          <div className="flex">
            <input
              type="text"
              className="flex-1 px-4 py-2 border border-blue-500 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Search by customer, quotation ID (QT), lead ID..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right side - Filters and Actions */}
        <div className="flex items-center gap-3">
          {/* Quotation ID Filter */}
          <input
            type="text"
            placeholder="Filter by Quotation ID (QT...)"
            value={filters.quotationId}
            onChange={(e) => handleFilterChange('quotationId', e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48"
          />

          {/* Payment Type Filter */}
          <select
            value={filters.paymentType}
            onChange={(e) => handleFilterChange('paymentType', e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Payments</option>
            <option value="advance">Advance Payment</option>
            <option value="due">Due Payment</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="overdue">Overdue</option>
          </select>

          <button
            onClick={onRefresh}
            className="px-3 py-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2"
            title="Refresh"
          >
            <RotateCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Badge Filters Row (separate full-width row between search and table) */}
      <div className="w-full mt-2">
        <div className="flex gap-2 flex-nowrap overflow-x-auto whitespace-nowrap items-center bg-white rounded-md p-2 border border-gray-200">
          {/* All Payments badge */}
          <button
            onClick={() => {
              const newFilters = { ...filters, paymentType: '', quotationStatus: '' };
              setFilters(newFilters);
              onFilterChange(newFilters);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border bg-gray-100 text-gray-800 hover:ring-2 ring-gray-300 transition ${!filters.paymentType && !filters.quotationStatus ? 'ring-2' : ''}`}
            title="All Payments"
          >
            All Payments
          </button>

          {badgeDefs.map(b => (
            <button
              key={b.key}
              onClick={() => toggleBadge(b)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${b.bg} ${b.text} hover:ring-2 ${b.ring} transition ` +
                ((b.type === 'payment' && filters.paymentType === b.key) || (b.type === 'quotation' && filters.quotationStatus === b.key) ? 'ring-2' : '')}
              title={`Filter: ${b.label}`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Edit Payment Tracking' : 'Add New Payment Tracking'}
              </h3>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lead ID
                </label>
                <input
                  type="text"
                  name="leadId"
                  value={formData.leadId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter lead ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quotation ID
                  </label>
                  <input
                    type="text"
                    name="quotationId"
                    value={formData.quotationId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter quotation ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Order ID
                  </label>
                  <input
                    type="text"
                    name="workOrderId"
                    value={formData.workOrderId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter work order ID"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {editingItem ? 'Update' : 'Add'} Payment Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Separate Pagination Component
export function ProductPagination({ 
  currentPage, 
  totalPages, 
  itemsPerPage, 
  totalItems, 
  onPageChange, 
  onItemsPerPageChange 
}) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const goToFirstPage = () => onPageChange(1);
  const goToPreviousPage = () => onPageChange(Math.max(1, currentPage - 1));
  const goToNextPage = () => onPageChange(Math.min(totalPages, currentPage + 1));
  const goToLastPage = () => onPageChange(totalPages);

  return (
    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
      {/* Items per page selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Show:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span className="text-sm text-gray-700">per page</span>
      </div>

      {/* Page info */}
      <div className="text-sm text-gray-700">
        {totalItems > 0 ? (
          <>
            Showing {startIndex + 1} to {endIndex} of {totalItems} results
          </>
        ) : (
          <>No results found</>
        )}
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center gap-2">
        {/* First page */}
        <button
          onClick={goToFirstPage}
          disabled={currentPage === 1 || totalItems === 0}
          className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Previous page */}
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1 || totalItems === 0}
          className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1 text-sm rounded-md border ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next page */}
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages || totalItems === 0}
          className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last page */}
        <button
          onClick={goToLastPage}
          disabled={currentPage === totalPages || totalItems === 0}
          className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}