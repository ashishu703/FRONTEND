import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building,
  FileText,
  Hash,
  Eye,
  Save,
  X,
  Camera,
  FileText as Document,
  MapPin as Location,
  Upload,
  Package,
  Map,
  Video,
  Navigation,
  Download
} from 'lucide-react';
import { useMarketingSharedData } from './MarketingSharedDataContext';
import MarketingSalespersonToolbox from './MarketingSalespersonToolbox';

const Visits = () => {
  console.log('Visits component is rendering...');
  
  try {
    const { customers, updateCustomer, loading } = useMarketingSharedData();
    console.log('MarketingSharedData loaded:', { customers, loading });

    // Add some dummy visits data for demonstration
    React.useEffect(() => {
      console.log('Customers:', customers);
      console.log('Has visiting status:', customers.some(c => c.visitingStatus));
      
      if (customers.length > 0 && !customers.some(c => c.visitingStatus)) {
        console.log('Adding dummy visits...');
        // Add visiting status to first few customers to create dummy visits
        const customersToUpdate = customers.slice(0, 3).map((customer, index) => {
          const updatedCustomer = {
            ...customer,
            visitingStatus: index === 0 ? 'scheduled' : index === 1 ? 'completed' : 'pending',
            // Ensure all required fields exist
            address: customer.address || '123 Business Street, City',
            gstNo: customer.gstNo || '29ABCDE1234F1Z5',
            productType: customer.productType || 'Cable',
            state: customer.state || 'Maharashtra',
            leadSource: customer.leadSource || 'Website'
          };
          console.log('Updated customer:', updatedCustomer);
          return updatedCustomer;
        });
        
        customersToUpdate.forEach(customer => {
          updateCustomer(customer);
        });
      }
    }, [customers, updateCustomer]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAddVisitModal, setShowAddVisitModal] = useState(false);
    const [showEditVisitModal, setShowEditVisitModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [visitForm, setVisitForm] = useState({
      leadId: '',
      name: '',
      phone: '',
      address: '',
      gstNo: '',
      productType: '',
      state: '',
      leadSource: '',
      visitDate: '',
      visitTime: '',
      purpose: '',
      notes: '',
      status: 'scheduled'
    });
    const [capturedPhotos, setCapturedPhotos] = useState({});
    const [currentLocation, setCurrentLocation] = useState(null);

    console.log('Visits component is rendering with customers:', customers);

    // Create some dummy visits data for demonstration
    const dummyVisits = [
      {
        id: 1,
        name: 'Tech Solutions Inc',
        phone: '+91 98765 43210',
        address: '123 Business Street, Mumbai, Maharashtra',
        gstNo: '29ABCDE1234F1Z5',
        productType: 'Cable',
        state: 'Maharashtra',
        leadSource: 'Website',
        visitingStatus: 'scheduled'
      },
      {
        id: 2,
        name: 'Marketing Agency',
        phone: '+91 87654 32109',
        address: '456 Corporate Avenue, Delhi, Delhi',
        gstNo: '27FGHIJ5678K2L6',
        productType: 'Wire',
        state: 'Delhi',
        leadSource: 'Social Media',
        visitingStatus: 'completed'
      },
      {
        id: 3,
        name: 'Startup Ventures',
        phone: '+91 76543 21098',
        address: '789 Innovation Drive, Ahmedabad, Gujarat',
        gstNo: '24MNOPQ9012R3S7',
        productType: 'Conductor',
        state: 'Gujarat',
        leadSource: 'Referral',
        visitingStatus: 'pending'
      }
    ];

    // Filter customers that have visits or can have visits scheduled
    const customersWithVisits = customers.filter(customer => 
      customer.visitingStatus === 'scheduled' || 
      customer.visitingStatus === 'completed' || 
      customer.visitingStatus === 'pending' || 
      customer.visitingStatus === 'cancelled'
    );
    
    console.log('Filtering customers with visits:', customersWithVisits);
    console.log('Customers with visitingStatus:', customers.map(c => ({ name: c.name, visitingStatus: c.visitingStatus })));
    
    // Merge visits coming from calendar/localStorage
    let externalVisits = [];
    try {
      const raw = JSON.parse(localStorage.getItem('marketingVisits') || '[]');
      externalVisits = Array.isArray(raw) ? raw : [];
    } catch {}

    // Normalize fields to match table
    const normalizedExternal = externalVisits.map(v => ({
      id: v.id || Date.now(),
      leadId: v.leadId,
      name: v.name,
      phone: v.phone,
      address: v.address,
      gstNo: v.gstNo,
      productType: v.productType,
      state: v.state,
      leadSource: v.leadSource,
      visitingStatus: v.visitingStatus || 'scheduled',
      visitDate: v.visitDate || ''
    }));

    // Use combined list: real customers with visits + externally moved visits; fallback to dummy
    const combinedVisits = (customersWithVisits.length > 0 || normalizedExternal.length > 0)
      ? [...normalizedExternal, ...customersWithVisits]
      : dummyVisits;

    // Deduplicate by (leadId + visitDate) or fallback (name+phone)
    const seenVisits = new Set();
    const visitsToShow = combinedVisits.filter(v => {
      const key = `${String(v.leadId || v.id)}|${v.visitDate || ''}|${(v.name || '').toLowerCase()}|${(v.phone || '').toLowerCase()}`;
      if (seenVisits.has(key)) return false;
      seenVisits.add(key);
      return true;
    });
    
    console.log('All customers:', customers);
    console.log('Customers with visits:', customersWithVisits);
    console.log('Visits to show:', visitsToShow);

    const filteredLeads = customersWithVisits.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.business?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || customer.visitingStatus === filterStatus;
      return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
      switch (status) {
        case 'scheduled':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'completed':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'cancelled':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'scheduled':
          return <Calendar className="w-4 h-4" />;
        case 'completed':
          return <CheckCircle className="w-4 h-4" />;
        case 'pending':
          return <Clock className="w-4 h-4" />;
        case 'cancelled':
          return <XCircle className="w-4 h-4" />;
        default:
          return <AlertCircle className="w-4 h-4" />;
      }
    };

    const handleAddVisit = () => {
      setShowAddVisitModal(true);
      setVisitForm({
        visitDate: '',
        visitTime: '',
        purpose: '',
        notes: '',
        status: 'scheduled'
      });
    };

    const handleEditVisit = (lead) => {
      setSelectedLead(lead);
      setVisitForm({
        visitDate: lead.visitDate || '',
        visitTime: lead.visitTime || '',
        purpose: lead.purpose || '',
        notes: lead.notes || '',
        status: lead.visitingStatus || 'scheduled'
      });
      setShowEditVisitModal(true);
    };

    const handleSaveVisit = () => {
      if (selectedLead) {
        updateCustomer(selectedLead.id, {
          ...visitForm,
          visitingStatus: visitForm.status
        });
      }
      setShowAddVisitModal(false);
      setShowEditVisitModal(false);
      setSelectedLead(null);
    };

  const handleCancelVisit = () => {
    setShowAddVisitModal(false);
    setShowEditVisitModal(false);
    setSelectedLead(null);
  };

  const handleLivePhoto = (visit) => {
    setSelectedLead(visit);
    // Trigger camera modal
    const event = new CustomEvent('openCamera', { detail: visit });
    window.dispatchEvent(event);
  };

  const handleViewPhotos = (visit) => {
    // Find the latest customer data from shared context to ensure we have visitPhotos
    const latestCustomer = customers.find(c => c.id === visit.id);
    const visitToShow = latestCustomer || visit;
    setSelectedLead(visitToShow);
    // Trigger photo gallery modal
    const event = new CustomEvent('openGallery', { detail: visitToShow });
    window.dispatchEvent(event);
  };

  const handleViewVisit = (visit) => {
    // Find the latest customer data from shared context
    const latestCustomer = customers.find(c => c.id === visit.id);
    const visitToShow = latestCustomer || visit;
    setSelectedLead(visitToShow);
    setShowViewModal(true);
  };


  // Filter visits based on search term
  const filteredVisits = visitsToShow.filter(visit => {
    const searchLower = searchTerm.toLowerCase();
    const leadId = visit.leadId || `LD-2025-${visit.id.toString().padStart(3, '0')}`;
    return (
      visit.id.toString().includes(searchLower) ||
      leadId.toLowerCase().includes(searchLower) ||
      visit.name.toLowerCase().includes(searchLower) ||
      visit.phone.toLowerCase().includes(searchLower) ||
      visit.address.toLowerCase().includes(searchLower) ||
      (visit.gstNo && visit.gstNo.toLowerCase().includes(searchLower)) ||
      (visit.productType && visit.productType.toLowerCase().includes(searchLower)) ||
      (visit.state && visit.state.toLowerCase().includes(searchLower)) ||
      (visit.leadSource && visit.leadSource.toLowerCase().includes(searchLower))
    );
  }).filter(visit => {
    return filterStatus === 'all' || visit.visitingStatus === filterStatus;
  });

  console.log('Filtered visits:', filteredVisits);


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, phone, address, or Lead ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <MarketingSalespersonToolbox 
            customers={customers}
            updateCustomer={updateCustomer}
            onAddVisit={handleAddVisit}
            onEditVisit={handleEditVisit}
            selectedLead={selectedLead}
            capturedPhotos={capturedPhotos}
            setCapturedPhotos={setCapturedPhotos}
            currentLocation={currentLocation}
            setCurrentLocation={setCurrentLocation}
            onLivePhoto={handleLivePhoto}
            onViewPhotos={handleViewPhotos}
          />
        </div>
      </div>

      {/* Visits Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Hash className="w-4 h-4 text-purple-600 mr-2" />
                    LEAD ID
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-blue-600 mr-2" />
                    NAME & PHONE
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-green-600 mr-2" />
                    ADDRESS
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-purple-600 mr-2" />
                    GST NO.
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 text-purple-600 mr-2" />
                    PRODUCT TYPE
              </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Map className="w-4 h-4 text-blue-600 mr-2" />
                    STATE
              </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 text-orange-600 mr-2" />
                    <div>
                      <div>LEAD</div>
                      <div>SOURCE</div>
            </div>
          </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Camera className="w-4 h-4 text-blue-600 mr-2" />
                    ACTIONS
      </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
          {filteredVisits.length > 0 ? (
            filteredVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{visit.leadId || `LD-2025-${visit.id.toString().padStart(3, '0')}`}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{visit.name}</div>
                        <div className="text-sm text-gray-500">{visit.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{visit.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{visit.gstNo || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{visit.productType || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{visit.state || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{visit.leadSource || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleLivePhoto(visit)}
                          className="w-9 h-9 rounded-full border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300 shadow-sm transition-all flex items-center justify-center"
                          title="Live Photo"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleViewVisit(visit)}
                          className="w-9 h-9 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300 shadow-sm transition-all flex items-center justify-center"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleViewPhotos(visit)}
                          className="w-9 h-9 rounded-full border border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:border-green-300 shadow-sm transition-all flex items-center justify-center"
                          title="View Photos"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => console.log('Location Capture clicked for', visit.name)}
                          className="w-9 h-9 rounded-full border border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100 hover:border-purple-300 shadow-sm transition-all flex items-center justify-center"
                          title="Location Capture"
                        >
                          <Navigation className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <Search className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No visits found</h3>
                      <p className="text-gray-600">Try adjusting your search criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
                    </div>
                  </div>
                  
      {/* Add Visit Modal */}
      {showAddVisitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Schedule New Visit</h2>
              <button 
                onClick={handleCancelVisit}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
                    </div>
                    
            <form onSubmit={(e) => { e.preventDefault(); handleSaveVisit(); }} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Lead Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lead ID</label>
                    <input
                      type="text"
                      value={visitForm.leadId}
                      onChange={(e) => setVisitForm({...visitForm, leadId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter Lead ID"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={visitForm.name}
                      onChange={(e) => setVisitForm({...visitForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={visitForm.phone}
                      onChange={(e) => setVisitForm({...visitForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GST No.</label>
                    <input
                      type="text"
                      value={visitForm.gstNo}
                      onChange={(e) => setVisitForm({...visitForm, gstNo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter GST number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={visitForm.address}
                    onChange={(e) => setVisitForm({...visitForm, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Enter full address"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                    <input
                      type="text"
                      value={visitForm.productType}
                      onChange={(e) => setVisitForm({...visitForm, productType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter product type"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={visitForm.state}
                      onChange={(e) => setVisitForm({...visitForm, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter state"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
                  <input
                    type="text"
                    value={visitForm.leadSource}
                    onChange={(e) => setVisitForm({...visitForm, leadSource: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter lead source"
                  />
                </div>

                {/* Visit Details */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Visit Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
                      <input
                        type="date"
                        value={visitForm.visitDate}
                        onChange={(e) => setVisitForm({...visitForm, visitDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Visit Time</label>
                      <input
                        type="time"
                        value={visitForm.visitTime}
                        onChange={(e) => setVisitForm({...visitForm, visitTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                    <input
                      type="text"
                      value={visitForm.purpose}
                      onChange={(e) => setVisitForm({...visitForm, purpose: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter visit purpose"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={visitForm.notes}
                      onChange={(e) => setVisitForm({...visitForm, notes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Enter visit notes"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={visitForm.status}
                      onChange={(e) => setVisitForm({...visitForm, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                    </div>
                    
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancelVisit}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                      </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Schedule Visit
                      </button>
                    </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Visit Modal */}
      {showEditVisitModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Edit Visit - {selectedLead.name}</h2>
              <button 
                onClick={handleCancelVisit}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
                  </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSaveVisit(); }} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
                  <input
                    type="date"
                    value={visitForm.visitDate}
                    onChange={(e) => setVisitForm({...visitForm, visitDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visit Time</label>
                  <input
                    type="time"
                    value={visitForm.visitTime}
                    onChange={(e) => setVisitForm({...visitForm, visitTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                  <input
                    type="text"
                    value={visitForm.purpose}
                    onChange={(e) => setVisitForm({...visitForm, purpose: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter visit purpose"
                  />
                  </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={visitForm.notes}
                    onChange={(e) => setVisitForm({...visitForm, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter any additional notes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={visitForm.status}
                    onChange={(e) => setVisitForm({...visitForm, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancelVisit}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Update Visit
                </button>
              </div>
            </form>
            </div>
        </div>
      )}

      {/* View Visit Details Modal */}
      {showViewModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Visit Details - {selectedLead.name}</h2>
              <button 
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedLead(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lead Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Lead Information</h3>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Lead ID</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLead.leadId || `LD-2025-${selectedLead.id.toString().padStart(3, '0')}`}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLead.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLead.phone}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLead.email || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLead.address}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">GST No.</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLead.gstNo || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Product Type</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLead.productType || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">State</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLead.state || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Lead Source</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLead.leadSource || 'N/A'}</p>
                  </div>
                </div>
                
                {/* Visit & Status Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Visit & Status Information</h3>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Visiting Status</label>
                    <p className="text-sm text-gray-900 mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedLead.visitingStatus === 'completed' ? 'bg-green-100 text-green-800' :
                        selectedLead.visitingStatus === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        selectedLead.visitingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedLead.visitingStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedLead.visitingStatus || 'N/A'}
                      </span>
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Visit Date</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLead.visitDate || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Visit Time</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLead.visitTime || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Purpose</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLead.purpose || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Lead Status</label>
                    <p className="text-sm text-gray-900 mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedLead.finalStatus === 'Connected' ? 'bg-green-100 text-green-800' :
                        selectedLead.finalStatus === 'Not Connected' ? 'bg-red-100 text-red-800' :
                        selectedLead.finalStatus === 'Todays Meeting' ? 'bg-blue-100 text-blue-800' :
                        selectedLead.finalStatus === 'Converted' ? 'bg-purple-100 text-purple-800' :
                        selectedLead.finalStatus === 'Closed' ? 'bg-gray-100 text-gray-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedLead.finalStatus || selectedLead.connectedStatus || 'Pending'}
                      </span>
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Remark</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">
                        {selectedLead.finalStatusRemark || selectedLead.connectedStatusRemark || selectedLead.notes || 'No remark available'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Notes</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">
                        {selectedLead.notes || 'No notes available'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedLead(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

            </div>
  );
  } catch (error) {
    console.error('Error in Visits component:', error);
                        return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h3 className="font-bold">Error Loading Visits</h3>
          <p>There was an error loading the visits page. Please refresh and try again.</p>
          <p className="text-sm mt-2">Error: {error.message}</p>
                            </div>
                          </div>
                        );
  }
};

export default Visits;