import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  RefreshCw, 
  User, 
  MapPin, 
  FileText, 
  Package, 
  Map, 
  Globe, 
  Calendar, 
  ArrowUpDown, 
  Edit, 
  Plus,
  X,
  Filter,
  Hash,
  Mail,
  Building,
  Shield,
  Tag,
  Users,
  Upload,
  Eye,
  Save,
  CreditCard,
  Clock,
  Download,
  DollarSign,
  Wallet,
  Phone,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import MobileMarketingQuotationForm from './MobileMarketingCreateQuotationForm';
import MobileMarketingQuotation from './MobileMarketingQuotation';
import { MarketingCorporateStandardInvoice } from '../MarketingSalesperson/MarketingProformaInvoice';
import MobileMarketingFollowUpBase from './MobileMarketingFollowUpBase';
import MobileMarketingQuotationPreview from "./MobileMarketingQuotationPreview"

// Mobile Edit Lead Modal Component
const MobileEditLeadModal = ({ lead, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: lead.name,
    phone: lead.phone,
    address: lead.address,
    area: lead.area || '',
    division: lead.division || '',
    gstNo: lead.gstNo,
    productType: lead.productType,
    state: lead.state,
    leadSource: lead.leadSource,
    customerType: lead.customerType,
    date: lead.date,
    visitingStatus: lead.visitingStatus,
    visitingStatusUpdated: lead.visitingStatusUpdated || '',
    paymentStatus: lead.paymentStatus,
    transferredTo: lead.transferredTo || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...lead, ...formData });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Edit Lead - {lead.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                <input
                  type="text"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST No</label>
                <input
                  type="text"
                  name="gstNo"
                  value={formData.gstNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Product</option>
                  <option value="Industrial Motor">Industrial Motor</option>
                  <option value="LED Street Light">LED Street Light</option>
                  <option value="Power Distribution Panel">Power Distribution Panel</option>
                  <option value="Cable">Cable</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
                <select
                  name="leadSource"
                  value={formData.leadSource}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Source</option>
                  <option value="Website">Website</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Email Campaign">Email Campaign</option>
                  <option value="Referrals">Referrals</option>
                  <option value="Cold Calls">Cold Calls</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
                <select
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="Individual">Individual</option>
                  <option value="Business">Business</option>
                  <option value="Government">Government</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visiting Status</label>
                <select
                  name="visitingStatus"
                  value={formData.visitingStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Visited">Visited</option>
                  <option value="Not Visited">Not Visited</option>
                  <option value="Rescheduled">Rescheduled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Mobile All Leads Component
const MobileAllLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [showQuotation, setShowQuotation] = useState(false);
  const [showQuotationPreview, setShowQuotationPreview] = useState(false);
  const [quotationData, setQuotationData] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [expandedLead, setExpandedLead] = useState(null);

  // Sample data for demonstration
  const sampleLeads = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      address: '123 Main Street, Mumbai',
      area: 'Andheri',
      division: 'Mumbai',
      gstNo: '27ABCDE1234F1Z5',
      productType: 'Industrial Motor',
      state: 'Maharashtra',
      leadSource: 'Website',
      customerType: 'Business',
      date: '2025-01-15',
      visitingStatus: 'Pending',
      visitingStatusUpdated: '2025-01-15',
      paymentStatus: 'Pending',
      transferredTo: '',
      status: 'Hot'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      phone: '+91 87654 32109',
      address: '456 Park Avenue, Delhi',
      area: 'Connaught Place',
      division: 'Delhi',
      gstNo: '07ABCDE1234F1Z5',
      productType: 'LED Street Light',
      state: 'Delhi',
      leadSource: 'Social Media',
      customerType: 'Government',
      date: '2025-01-14',
      visitingStatus: 'Visited',
      visitingStatusUpdated: '2025-01-14',
      paymentStatus: 'Paid',
      transferredTo: '',
      status: 'Warm'
    },
    {
      id: 3,
      name: 'Amit Patel',
      phone: '+91 76543 21098',
      address: '789 Business District, Bangalore',
      area: 'Electronic City',
      division: 'Bangalore',
      gstNo: '29ABCDE1234F1Z5',
      productType: 'Power Distribution Panel',
      state: 'Karnataka',
      leadSource: 'Email Campaign',
      customerType: 'Business',
      date: '2025-01-13',
      visitingStatus: 'Not Visited',
      visitingStatusUpdated: '2025-01-13',
      paymentStatus: 'Partial',
      transferredTo: '',
      status: 'Cold'
    }
  ];

  useEffect(() => {
    setLeads(sampleLeads);
  }, []);

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setShowEditModal(true);
  };

  const handleSaveLead = (updatedLead) => {
    setLeads(leads.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
    setShowEditModal(false);
    setSelectedLead(null);
  };

  const handleCreateQuotation = (lead) => {
    setSelectedLead(lead);
    setShowQuotationForm(true);
  };

  const handleQuotationCreated = (quotation) => {
    setQuotationData(quotation);
    setShowQuotationForm(false);
    setShowQuotation(true);
  };

  const handleCreateInvoice = (lead) => {
    setSelectedLead(lead);
    setShowInvoice(true);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm) ||
                         lead.productType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lead.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
    }
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    return 0;
  });

  const toggleLeadExpansion = (leadId) => {
    setExpandedLead(expandedLead === leadId ? null : leadId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hot': return 'bg-red-100 text-red-800';
      case 'Warm': return 'bg-orange-100 text-orange-800';
      case 'Cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVisitingStatusColor = (status) => {
    switch (status) {
      case 'Visited': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Not Visited': return 'bg-red-100 text-red-800';
      case 'Rescheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Mobile Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-4">All Leads</h1>
        
        {/* Mobile Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>Sort</span>
            </button>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="hot">Hot</option>
                  <option value="warm">Warm</option>
                  <option value="cold">Cold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Leads List */}
      <div className="space-y-3">
        {sortedLeads.map((lead) => (
          <div key={lead.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Lead Header */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                  <p className="text-sm text-gray-600">{lead.phone}</p>
                  <p className="text-xs text-gray-500">{lead.productType}</p>
                </div>
                <div className="flex space-x-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                  <button
                    onClick={() => toggleLeadExpansion(lead.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedLead === lead.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{lead.date}</span>
                <span className={`px-2 py-1 rounded-full ${getVisitingStatusColor(lead.visitingStatus)}`}>
                  {lead.visitingStatus}
                </span>
              </div>
            </div>

            {/* Expanded Lead Details */}
            {expandedLead === lead.id && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="space-y-2 mt-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Address:</span>
                      <p className="text-gray-900">{lead.address}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Area:</span>
                      <p className="text-gray-900">{lead.area}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Division:</span>
                      <p className="text-gray-900">{lead.division}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">State:</span>
                      <p className="text-gray-900">{lead.state}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Lead Source:</span>
                      <p className="text-gray-900">{lead.leadSource}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Customer Type:</span>
                      <p className="text-gray-900">{lead.customerType}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-3">
                    <button
                      onClick={() => handleEditLead(lead)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleCreateQuotation(lead)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Quote</span>
                    </button>
                    <button
                      onClick={() => handleCreateInvoice(lead)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      {showEditModal && selectedLead && (
        <MobileEditLeadModal
          lead={selectedLead}
          onSave={handleSaveLead}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showQuotationForm && selectedLead && (
        <MobileMarketingQuotationForm
          lead={selectedLead}
          onQuotationCreated={handleQuotationCreated}
          onClose={() => setShowQuotationForm(false)}
        />
      )}

      {showQuotation && quotationData && (
        <MobileMarketingQuotation
          quotationData={quotationData}
          selectedBranch="ANODE"
          onClose={() => setShowQuotation(false)}
        />
      )}

      {showQuotationPreview && quotationData && (
        <MobileMarketingQuotationPreview
          quotationData={quotationData}
          onClose={() => setShowQuotationPreview(false)}
        />
      )}

      {showInvoice && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Create Invoice</h2>
              <button 
                onClick={() => setShowInvoice(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <MarketingCorporateStandardInvoice 
                leadData={selectedLead}
                onClose={() => setShowInvoice(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileAllLeads;
