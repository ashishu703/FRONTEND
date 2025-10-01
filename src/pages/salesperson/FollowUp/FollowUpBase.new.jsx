import React, { useState } from 'react';
import { 
  Eye, 
  Pencil, 
  MessageCircle, 
  Mail, 
  Calendar, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ChevronDown, 
  Search, 
  RefreshCw,
  Filter,
  User,
  Building2,
  Package,
  Globe,
  X
} from 'lucide-react';

const FollowUpBase = ({ status, customData = [] }) => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    business: '',
    phone: '',
    email: '',
    state: '',
    productType: '',
    customerType: '',
    leadSource: '',
    date: ''
  });
  
  // Available options for dropdowns
  const productTypes = ['Conductor', 'Cable', 'AAAC', 'Aluminium', 'Copper', 'PVC', 'Wire'];
  const customerTypes = ['Business', 'Corporate', 'Individual', 'Reseller', 'Government'];
  const leadSources = ['Phone', 'Marketing', 'FB Ads', 'Google Ads', 'Referral', 'Webinar', 'Website', 'Email', 'Other'];
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
    'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
    'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const statusColors = {
    'connected': 'bg-green-100 text-green-800',
    'not-connected': 'bg-red-100 text-red-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'next-meeting': 'bg-blue-100 text-blue-800',
    'closed': 'bg-gray-100 text-gray-800'
  };

  const statusLabels = {
    'connected': 'Connected',
    'not-connected': 'Not Connected',
    'pending': 'Pending',
    'next-meeting': 'Next Meeting',
    'closed': 'Closed'
  };

  // Filter data based on search and filters
  const filteredData = customData.filter(item => {
    // Search query filter
    const matchesSearch = 
      searchQuery === '' || 
      (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.business && item.business.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.phone && item.phone.includes(searchQuery)) ||
      (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Individual field filters
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true; // Skip if filter is not set
      const itemValue = item[key]?.toString().toLowerCase() || '';
      return itemValue.includes(value.toLowerCase());
    });
    
    return matchesSearch && matchesFilters;
  });
  
  // Use filtered data if available, otherwise show empty state
  const tableData = filteredData.length > 0 ? filteredData : [];
  
  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      name: '',
      business: '',
      phone: '',
      email: '',
      state: '',
      productType: '',
      customerType: '',
      leadSource: '',
      date: ''
    });
    setSearchQuery('');
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {statusLabels[status] || 'Follow Ups'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your {statusLabels[status]?.toLowerCase() || 'follow up'} activities
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="flex">
              <input
                type="text"
                placeholder="Search follow-ups..."
                className="flex-1 px-4 py-2 border border-blue-500 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                showFilters 
                  ? 'bg-blue-50 border-blue-500 text-blue-700' 
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700">Filters</h3>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Name Filter */}
              <div>
                <label htmlFor="name-filter" className="block text-xs font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name-filter"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                />
              </div>

              {/* Business Filter */}
              <div>
                <label htmlFor="business-filter" className="block text-xs font-medium text-gray-700 mb-1">
                  Business
                </label>
                <input
                  type="text"
                  id="business-filter"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters.business}
                  onChange={(e) => handleFilterChange('business', e.target.value)}
                />
              </div>

              {/* Phone Filter */}
              <div>
                <label htmlFor="phone-filter" className="block text-xs font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone-filter"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters.phone}
                  onChange={(e) => handleFilterChange('phone', e.target.value)}
                />
              </div>

              {/* Email Filter */}
              <div>
                <label htmlFor="email-filter" className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="text"
                  id="email-filter"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters.email}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                />
              </div>

              {/* State Filter */}
              <div>
                <label htmlFor="state-filter" className="block text-xs font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  id="state-filter"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                >
                  <option value="">All States</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Type Filter */}
              <div>
                <label htmlFor="product-type-filter" className="block text-xs font-medium text-gray-700 mb-1">
                  Product Type
                </label>
                <select
                  id="product-type-filter"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters.productType}
                  onChange={(e) => handleFilterChange('productType', e.target.value)}
                >
                  <option value="">All Types</option>
                  {productTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Type Filter */}
              <div>
                <label htmlFor="customer-type-filter" className="block text-xs font-medium text-gray-700 mb-1">
                  Customer Type
                </label>
                <select
                  id="customer-type-filter"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters.customerType}
                  onChange={(e) => handleFilterChange('customerType', e.target.value)}
                >
                  <option value="">All Types</option>
                  {customerTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lead Source Filter */}
              <div>
                <label htmlFor="lead-source-filter" className="block text-xs font-medium text-gray-700 mb-1">
                  Lead Source
                </label>
                <select
                  id="lead-source-filter"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters.leadSource}
                  onChange={(e) => handleFilterChange('leadSource', e.target.value)}
                >
                  <option value="">All Sources</option>
                  {leadSources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label htmlFor="date-filter" className="block text-xs font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date-filter"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                />
              </div>
            </div>
            
            {/* Active Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <span 
                    key={key}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                    <button 
                      type="button"
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-600 hover:bg-blue-300 focus:outline-none focus:bg-blue-500 focus:text-white"
                      onClick={() => handleFilterChange(key, '')}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-blue-500" />
                    Customer
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-1 text-green-500" />
                    Business
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-amber-500" />
                    Location
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-1 text-purple-500" />
                    Product
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-pink-500" />
                    Follow-up Date
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-indigo-500" />
                    Status
                  </div>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.length > 0 ? (
                tableData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{item.phone || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.business || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{item.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.city || 'N/A'}, {item.state || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{item.country || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.product || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{item.quantity || 'N/A'} units</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.followUpDate ? new Date(item.followUpDate).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.followUpTime || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                        {statusLabels[status] || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="text-purple-600 hover:text-purple-900"
                          title="Message"
                        >
                          <MessageCircle className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="text-amber-600 hover:text-amber-900"
                          title="Schedule Follow-up"
                        >
                          <Calendar className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No follow-ups found. Try adjusting your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {tableData.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                href="#"
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </a>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{tableData.length}</span> of{' '}
                  <span className="font-medium">{tableData.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronDown className="h-5 w-5 transform -rotate-90" aria-hidden="true" />
                  </a>
                  <a
                    href="#"
                    aria-current="page"
                    className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    2
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    3
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronDown className="h-5 w-5 transform rotate-90" aria-hidden="true" />
                  </a>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowUpBase;
