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
  X,
  FileText,
  DollarSign,
  Clock3,
  Check,
  X as XIcon,
  Clock as ClockIcon
} from 'lucide-react';

const FollowUpBase = ({ status, customData = [] }) => {
  // State for payment timeline
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Mock data for payment timeline (replace with actual data from your API)
  const [paymentTimeline, setPaymentTimeline] = useState([
    {
      id: 1,
      type: 'quotation',
      amount: 15000,
      date: '2025-09-10T14:30:00',
      status: 'sent',
      remarks: 'Initial quotation sent',
      documentUrl: '/quotation-1.pdf'
    },
    {
      id: 2,
      type: 'payment',
      amount: 5000,
      date: '2025-09-12T10:15:00',
      status: 'received',
      remarks: 'Advance payment received',
      reference: 'TXN12345'
    },
    // Add more timeline items as needed
  ]);
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
  
  // Toggle filters visibility and clear all when hiding
  const toggleFilters = () => {
    if (showFilters) {
      // Clear all filters when hiding
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
    }
    setShowFilters(!showFilters);
  };

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

  // Status colors and labels
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
      (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.productName && item.productName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.state && item.state.toLowerCase().includes(searchQuery.toLowerCase()));
    
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

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Open timeline for a specific customer
  const openTimeline = (customer) => {
    setSelectedCustomer(customer);
    setShowTimeline(true);
  };

  // Close timeline
  const closeTimeline = () => {
    setShowTimeline(false);
    setSelectedCustomer(null);
  };

  // Payment Timeline Slide Component
  const PaymentTimelineSlide = () => (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeTimeline}></div>
        <div className="fixed inset-y-0 right-0 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl">
              <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-6 sm:px-6 bg-indigo-700 text-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Performa Invoice</h2>
                    <button
                      type="button"
                      className="text-white hover:text-gray-200 focus:outline-none"
                      onClick={closeTimeline}
                    >
                      <XIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="mt-1">
                    <p className="text-sm text-indigo-100">
                      {selectedCustomer?.name} • {selectedCustomer?.business}
                    </p>
                  </div>
                </div>
                
                <div className="px-4 py-6 sm:px-6">
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {paymentTimeline.map((event, eventIdx) => (
                        <li key={event.id}>
                          <div className="relative pb-8">
                            {eventIdx !== paymentTimeline.length - 1 ? (
                              <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                  event.type === 'quotation' ? 'bg-blue-500' : 'bg-green-500'
                                }`}>
                                  {event.type === 'quotation' ? (
                                    <FileText className="h-4 w-4 text-white" />
                                  ) : (
                                    <DollarSign className="h-4 w-4 text-white" />
                                  )}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-800">
                                    {event.type === 'quotation' ? 'Quotation Sent' : 'Payment Received'}
                                    {event.amount && (
                                      <span className="font-medium text-gray-900"> • ₹{event.amount.toLocaleString()}</span>
                                    )}
                                  </p>
                                  <p className="text-sm text-gray-500">{event.remarks}</p>
                                  {event.documentUrl && (
                                    <a 
                                      href={event.documentUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-flex items-center"
                                    >
                                      <FileText className="h-3 w-3 mr-1" />
                                      View Document
                                    </a>
                                  )}
                                  {event.reference && (
                                    <p className="text-xs text-gray-500 mt-1">Ref: {event.reference}</p>
                                  )}
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  <time dateTime={event.date}>
                                    {formatDate(event.date)}
                                  </time>
                                  <div className="mt-1">
                                    {event.status === 'sent' ? (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        <ClockIcon className="h-3 w-3 mr-1" /> Sent
                                      </span>
                                    ) : event.status === 'received' ? (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        <Check className="h-3 w-3 mr-1" /> Received
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                        <Clock3 className="h-3 w-3 mr-1" /> Pending
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 px-4 py-4 flex justify-end border-t border-gray-200">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={closeTimeline}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      {/* Payment Timeline Slide */}
      {showTimeline && <PaymentTimelineSlide />}

      {/* Filter and Refresh Controls */}
      <div className="mb-6 flex justify-end">
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={toggleFilters}
            className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
              showFilters 
                ? 'bg-blue-50 border-blue-500 text-blue-700' 
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Clear Filters' : 'Filters'}
          </button>
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => {
              // Clear all filters and refresh the data
              clearFilters();
              // You can add your data refresh logic here
              // For now, we'll just reset the search query
              setSearchQuery('');
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1 text-blue-500" />
                      Customer
                    </div>
                    {showFilters && (
                      <input
                        type="text"
                        value={filters.name}
                        onChange={(e) => handleFilterChange('name', e.target.value)}
                        className="mt-1 w-full text-xs p-1 border rounded bg-white"
                        placeholder="Filter customer..."
                      />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1 text-green-500" />
                      Business
                    </div>
                    {showFilters && (
                      <input
                        type="text"
                        value={filters.business}
                        onChange={(e) => handleFilterChange('business', e.target.value)}
                        className="mt-1 w-full text-xs p-1 border rounded bg-white"
                        placeholder="Filter business..."
                      />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-amber-500" />
                      Location
                    </div>
                    {showFilters && (
                      <select
                        value={filters.state}
                        onChange={(e) => handleFilterChange('state', e.target.value)}
                        className="mt-1 w-full text-xs p-1 border rounded bg-white"
                      >
                        <option value="">All States</option>
                        {states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-1 text-purple-500" />
                      Product
                    </div>
                    {showFilters && (
                      <select
                        value={filters.productType}
                        onChange={(e) => handleFilterChange('productType', e.target.value)}
                        className="mt-1 w-full text-xs p-1 border rounded bg-white"
                      >
                        <option value="">All Products</option>
                        {productTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-pink-500" />
                      Follow-up Date
                    </div>
                    {showFilters && (
                      <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => handleFilterChange('date', e.target.value)}
                        className="mt-1 w-full text-xs p-1 border rounded bg-white"
                      />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-indigo-500" />
                      Status
                    </div>
                    {showFilters && (
                      <select
                        value={filters.status || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="mt-1 w-full text-xs p-1 border rounded bg-white"
                      >
                        <option value="">All Statuses</option>
                        {Object.entries(statusLabels).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    )}
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
                      <div className="text-sm text-gray-900">{item.state || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{item.address || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.productName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{item.productType || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.connectedStatusDate ? new Date(item.connectedStatusDate).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.finalStatusDate ? new Date(item.finalStatusDate).toLocaleDateString() : ''}
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
                          title="View Performa Invoice"
                          onClick={() => openTimeline(item)}
                        >
                          <Clock className="h-5 w-5" />
                        </button>
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
