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
    const [showTimelineModal, setShowTimelineModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [timelineEvents, setTimelineEvents] = useState([]);
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

  const handleViewTimeline = (visit) => {
    try {
      // Base identity for matching across stores
      const leadId = String(visit.leadId || visit.id);

      // 1) Assignment history
      let assignmentEvents = [];
      try {
        const rawAssign = JSON.parse(localStorage.getItem('marketingAssignments') || '[]');
        const items = Array.isArray(rawAssign) ? rawAssign.filter(a => String(a.leadId || a.id) === leadId) : [];
        assignmentEvents = items.map(a => ({
          type: 'assigned',
          date: a.assignedDate || a.date || '',
          title: 'Lead Assigned',
          description: `Assigned to ${(a.assignedToName || a.assignedToEmail || 'Salesperson')}`,
          remark: a.remark || a.notes || '',
          meta: { assignedToName: a.assignedToName || '', assignedToEmail: a.assignedToEmail || '' }
        }));
      } catch {}

      // 2) Visit history
      let visitEvents = [];
      try {
        const rawVisits = JSON.parse(localStorage.getItem('marketingVisits') || '[]');
        const items = Array.isArray(rawVisits) ? rawVisits.filter(v => String(v.leadId || v.id) === leadId) : [];
        visitEvents = items.map(v => ({
          type: 'visit',
          date: v.visitDate || v.date || '',
          title: 'Visit Scheduled',
          description: v.purpose || 'Scheduled visit',
          remark: v.notes || '',
          status: v.visitingStatus || 'scheduled',
        }));
      } catch {}

      // 3) Status changes from latest customer record
      const latest = customers.find(c => String(c.id) === leadId) || visit;
      const statusEvents = [];
      if (latest.connectedStatus) {
        statusEvents.push({
          type: 'status',
          date: latest.connectedStatusDate || latest.connectedDate || latest.updatedAt || '',
          title: `Connected Status: ${latest.connectedStatus}`,
          description: '',
          remark: latest.connectedStatusRemark || ''
        });
      }
      if (latest.finalStatus) {
        statusEvents.push({
          type: 'status',
          date: latest.finalStatusDate || latest.updatedAt || '',
          title: `Lead Status: ${latest.finalStatus}`,
          description: '',
          remark: latest.finalStatusRemark || latest.notes || ''
        });
      }

      // 4) Photos (visitPhotos + runtime capturedPhotos)
      const photos = (latest.visitPhotos || []).map(p => ({ url: p, date: latest.visitDate || '' }));
      const runtimePhotos = (capturedPhotos[latest.id] || []).map(p => ({ url: p, date: latest.visitDate || '' }));
      const photoEvents = [...photos, ...runtimePhotos].map(p => ({
        type: 'photo',
        date: p.date || latest.visitDate || latest.updatedAt || '',
        title: 'Photo Captured',
        photoUrl: p.url,
        description: 'Visit photo'
      }));

      // Merge and sort by date desc
      const merged = [...assignmentEvents, ...visitEvents, ...statusEvents, ...photoEvents]
        .filter(e => e.date)
        .sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());

      setSelectedLead(latest);
      setTimelineEvents(merged);
      setShowTimelineModal(true);
    } catch (e) { console.error('handleViewTimeline error', e); }
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
                          onClick={() => handleViewTimeline(visit)}
                          className="w-9 h-9 rounded-full border border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100 hover:border-purple-300 shadow-sm transition-all flex items-center justify-center"
                          title="View Timeline"
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

      {/* View Visit Details - Right Sidebar */}
      {showViewModal && selectedLead && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => { setShowViewModal(false); setSelectedLead(null); }}></div>
          <aside className="w-full max-w-lg bg-white h-full shadow-xl overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                  {(selectedLead.name || '?').split(' ').map(w=>w[0]).slice(0,2).join('')}
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-900">Visit Details</div>
                  <div className="text-xs text-gray-500">{selectedLead.name} • {selectedLead.phone}</div>
                </div>
              </div>
              <button onClick={() => { setShowViewModal(false); setSelectedLead(null); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Summary badges */}
            <div className="px-5 pt-4">
              <div className="flex flex-wrap gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  selectedLead.visitingStatus === 'completed' ? 'bg-green-100 text-green-800' :
                  selectedLead.visitingStatus === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  selectedLead.visitingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedLead.visitingStatus === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{selectedLead.visitingStatus || 'N/A'}</span>
                {selectedLead.finalStatus && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{selectedLead.finalStatus}</span>
                )}
                {selectedLead.visitDate && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedLead.visitDate}</span>
                )}
              </div>
              {selectedLead.address && (
                <div className="mt-2 text-xs text-gray-600 flex items-start gap-2"><MapPin className="w-3.5 h-3.5 mt-0.5" /> <span>{selectedLead.address}</span></div>
              )}
            </div>

            {/* Details sections */}
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Lead ID</div>
                  <div className="text-gray-900">{selectedLead.leadId || `LD-2025-${selectedLead.id.toString().padStart(3, '0')}`}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-gray-900">{selectedLead.email || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Product Type</div>
                  <div className="text-gray-900">{selectedLead.productType || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">State</div>
                  <div className="text-gray-900">{selectedLead.state || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">GST No.</div>
                  <div className="text-gray-900">{selectedLead.gstNo || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Lead Source</div>
                  <div className="text-gray-900">{selectedLead.leadSource || 'N/A'}</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Purpose</div>
                <div className="text-sm text-gray-900">{selectedLead.purpose || 'N/A'}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Remark</div>
                <div className="p-3 bg-gray-50 rounded-md border text-sm text-gray-900 whitespace-pre-wrap">{selectedLead.finalStatusRemark || selectedLead.connectedStatusRemark || selectedLead.notes || 'No remark available'}</div>
              </div>

              {Array.isArray(selectedLead.visitPhotos) && selectedLead.visitPhotos.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 mb-2">Photos</div>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedLead.visitPhotos.map((p, i) => (
                      <img key={i} src={p} alt={`Visit ${i+1}`} className="w-full h-24 object-cover rounded border" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Timeline Slide-Over (Right Sidebar) */}
      {showTimelineModal && selectedLead && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => { setShowTimelineModal(false); setSelectedLead(null); }}></div>
          <aside className="w-full max-w-lg bg-white h-full shadow-xl overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">
                  {(selectedLead.name || '?').split(' ').map(w=>w[0]).slice(0,2).join('')}
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-900">Lead Timeline</div>
                  <div className="text-xs text-gray-500">{selectedLead.name} • {selectedLead.phone}</div>
                </div>
              </div>
              <button onClick={() => { setShowTimelineModal(false); setSelectedLead(null); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lead summary badges */}
            <div className="px-5 pt-4">
              <div className="flex flex-wrap gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  selectedLead.visitingStatus === 'completed' ? 'bg-green-100 text-green-800' :
                  selectedLead.visitingStatus === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  selectedLead.visitingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedLead.visitingStatus === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{selectedLead.visitingStatus || 'N/A'}</span>
                {selectedLead.finalStatus && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{selectedLead.finalStatus}</span>
                )}
                {selectedLead.visitDate && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedLead.visitDate}</span>
                )}
              </div>
              {selectedLead.address && (
                <div className="mt-2 text-xs text-gray-600 flex items-start gap-2"><MapPin className="w-3.5 h-3.5 mt-0.5" /> <span>{selectedLead.address}</span></div>
              )}
            </div>

            {/* Timeline list */}
            <div className="p-5">
              {timelineEvents.length === 0 ? (
                <div className="text-center text-gray-500 text-sm">No timeline events available</div>
              ) : (
                <div className="space-y-5">
                  {timelineEvents.map((ev, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center border ${
                        ev.type === 'assigned' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        ev.type === 'visit' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        ev.type === 'status' ? 'bg-green-50 text-green-700 border-green-200' :
                        ev.type === 'photo' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}>
                        {ev.type === 'assigned' && <User className="w-4 h-4" />}
                        {ev.type === 'visit' && <Calendar className="w-4 h-4" />}
                        {ev.type === 'status' && <CheckCircle className="w-4 h-4" />}
                        {ev.type === 'photo' && <Camera className="w-4 h-4" />}
                      </div>
                      {/* Content */}
                      <div className="flex-1 border-l border-gray-200 pl-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-gray-900">{ev.title}</div>
                          <time className="text-[11px] text-gray-500">{ev.date}</time>
                        </div>
                        {ev.status && (
                          <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full ${
                            ev.status === 'completed' ? 'bg-green-100 text-green-800' :
                            ev.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            ev.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            ev.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>{ev.status}</span>
                        )}
                        {ev.description && <p className="mt-1 text-sm text-gray-700">{ev.description}</p>}
                        {ev.remark && (
                          <div className="mt-2 text-xs text-gray-900 bg-gray-50 border rounded p-2 whitespace-pre-wrap">{ev.remark}</div>
                        )}
                        {ev.photoUrl && (
                          <img src={ev.photoUrl} alt="Visit" className="mt-2 w-full max-w-xs h-32 object-cover rounded border" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
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