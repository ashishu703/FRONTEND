import React, { useState, useEffect } from 'react';
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
  Wallet
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import MarketingQuotationForm from './MarketingCreateQuotationForm';
import MarketingQuotation from './MarketingQuotation';
import { MarketingCorporateStandardInvoice } from './MarketingProformaInvoice';
import MarketingFollowUpBase from './FollowUp/MarketingFollowUpBase';

// Edit Lead Modal Component
const EditLeadModal = ({ lead, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: lead.name,
    phone: lead.phone,
    address: lead.address,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Lead - {lead.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST No.</label>
              <input
                type="text"
                name="gstNo"
                value={formData.gstNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Industrial Equipment">Industrial Equipment</option>
                <option value="Commercial Lighting">Commercial Lighting</option>
                <option value="Power Solutions">Power Solutions</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
              <select
                name="leadSource"
                value={formData.leadSource}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Social Media">Social Media</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
              <select
                name="customerType"
                value={formData.customerType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="B2B">B2B</option>
                <option value="B2C">B2C</option>
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
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visiting Status</label>
              <select
                name="visitingStatus"
                value={formData.visitingStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Visited">Visited</option>
                <option value="Not Visited">Not Visited</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status Updated At</label>
              <input
                type="datetime-local"
                name="visitingStatusUpdated"
                value={formData.visitingStatusUpdated}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
                <option value="Not Started">Not Started</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transfer Lead To</label>
              <select
                name="transferredTo"
                value={formData.transferredTo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Not Transferred</option>
                <option value="John Smith">John Smith</option>
                <option value="Sarah Johnson">Sarah Johnson</option>
                <option value="Mike Davis">Mike Davis</option>
                <option value="Lisa Wilson">Lisa Wilson</option>
                <option value="David Brown">David Brown</option>
                <option value="Emma Taylor">Emma Taylor</option>
                <option value="Alex Martinez">Alex Martinez</option>
                <option value="Sophie Anderson">Sophie Anderson</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Customer Modal Component
const AddCustomerModal = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    gstNo: '',
    productType: '',
    state: '',
    leadSource: '',
    customerType: '',
    date: new Date().toISOString().split('T')[0],
    visitingStatus: 'Not Visited',
    visitingStatusUpdated: new Date().toISOString().slice(0, 16),
    paymentStatus: 'Not Started'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add New Customer</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST No. *</label>
              <input
                type="text"
                name="gstNo"
                value={formData.gstNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Product Type</option>
                <option value="Industrial Equipment">Industrial Equipment</option>
                <option value="Commercial Lighting">Commercial Lighting</option>
                <option value="Power Solutions">Power Solutions</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select State</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source *</label>
              <select
                name="leadSource"
                value={formData.leadSource}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Lead Source</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Social Media">Social Media</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type *</label>
              <select
                name="customerType"
                value={formData.customerType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Customer Type</option>
                <option value="B2B">B2B</option>
                <option value="B2C">B2C</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          {/* Visiting Status Section */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Visiting Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="visitingStatus"
                  value={formData.visitingStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Not Visited">Not Visited</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Visited">Visited</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Updated At</label>
                <input
                  type="datetime-local"
                  name="visitingStatusUpdated"
                  value={formData.visitingStatusUpdated}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Payment Status Section */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="Pending">Pending</option>
                  <option value="Partial">Partial</option>
                  <option value="Paid">Paid</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Lead Import Modal Component
const LeadImportModal = ({ onImport, onClose }) => {
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      setError('');
      parseCSV(file);
    } else {
      setError('Please select a valid CSV file');
    }
  };

  const parseCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',').map(v => v.trim());
          const lead = {};
          headers.forEach((header, index) => {
            lead[header.toLowerCase().replace(/\s+/g, '')] = values[index] || '';
          });
          return lead;
        })
        .map(lead => ({
          name: lead.name || '',
          phone: lead.phone || '',
          address: lead.address || '',
          gstNo: lead.gstno || lead.gstno || '',
          productType: lead.producttype || lead.producttype || 'Industrial Equipment',
          state: lead.state || 'Madhya Pradesh',
          leadSource: lead.leadsource || lead.leadsource || 'Website',
          customerType: lead.customertype || lead.customertype || 'B2B',
          date: lead.date || new Date().toISOString().split('T')[0],
          visitingStatus: lead.visitingstatus || lead.visitingstatus || 'Not Visited',
          visitingStatusUpdated: new Date().toISOString(),
          paymentStatus: lead.paymentstatus || lead.paymentstatus || 'Not Started'
        }));
      
      setCsvData(data);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (csvData.length > 0) {
      setIsProcessing(true);
      setTimeout(() => {
        onImport(csvData);
        setIsProcessing(false);
      }, 1000);
    }
  };

  const downloadTemplate = () => {
    const template = [
      'Name,Phone,Address,GST No,Product Type,State,Lead Source,Customer Type,Date,Visiting Status,Final Status,Payment Status',
      'John Doe,+91 98765 43210,123 Main St,23ABCDE1234F1Z5,Industrial Equipment,Madhya Pradesh,Website,B2B,2025-01-20,Not Visited,Pending,Not Started',
      'Jane Smith,+91 87654 32109,456 Oak Ave,23FGHIJ5678K2L6,Commercial Lighting,Maharashtra,Referral,B2C,2025-01-21,Scheduled,Interested,Pending'
    ].join('\n');
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lead_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Import Leads from CSV</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Template Download */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">CSV Template</h3>
            <p className="text-sm text-gray-600 mb-4">
              Download the template to see the required format for your CSV file.
            </p>
            <button
              onClick={downloadTemplate}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Template</span>
            </button>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload CSV File</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Click to upload CSV file or drag and drop
                </span>
                <span className="text-xs text-gray-500">
                  CSV files only
                </span>
              </label>
            </div>
            {csvFile && (
              <div className="mt-2 text-sm text-green-600">
                ✓ File selected: {csvFile.name}
              </div>
            )}
            {error && (
              <div className="mt-2 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>

          {/* Preview Data */}
          {csvData.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Preview ({csvData.length} leads found)
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-500 mb-2">
                  <div>Name</div>
                  <div>Phone</div>
                  <div>Product Type</div>
                  <div>Status</div>
                </div>
                {csvData.slice(0, 5).map((lead, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 text-xs text-gray-700 py-1 border-b border-gray-200">
                    <div className="truncate">{lead.name}</div>
                    <div className="truncate">{lead.phone}</div>
                    <div className="truncate">{lead.productType}</div>
                  </div>
                ))}
                {csvData.length > 5 && (
                  <div className="text-xs text-gray-500 mt-2">
                    ... and {csvData.length - 5} more leads
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={csvData.length === 0 || isProcessing}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Import {csvData.length} Leads</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketingSalespersonLeads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showPIModal, setShowPIModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeTab, setActiveTab] = useState('Details');
  const [showPIPreview, setShowPIPreview] = useState(false);
  const [showPIPopup, setShowPIPopup] = useState(false);
  const [piPopupData, setPiPopupData] = useState(null);
  const [piFormData, setPiFormData] = useState({
    branch: 'ANODE',
    voucherNo: `PI-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    dated: new Date().toISOString().split('T')[0],
    paymentTerms: 'ADVANCE',
    buyersRef: `BR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    otherReferences: 'DIRECT SALE',
    dispatchedThrough: 'BY TRANSPORT',
    destination: '',
    deliveryTerms: 'Delivery :- FOR upto',
    items: [
      {
        id: 1,
        description: 'COVERED CONDUCTOR 34 SQMM',
        subDescription: 'COVERED CONDUCTOR 34SQMM XLPE 3 LAYER',
        hsnSac: '76141000',
        dueOn: new Date().toISOString().split('T')[0],
        quantity: 600,
        unit: 'MTR',
        rate: 48.00,
        amount: 28800.00
      }
    ],
    subtotal: 28800.00,
    taxRate: 18,
    taxAmount: 5184.00,
    total: 33984.00,
    amountInWords: 'INR Thirty Three Thousand Nine Hundred Eighty Four Only',
    bankDetails: {
      accountHolderName: 'ANODE ELECTRIC PVT. LTD.',
      accountNumber: '777705336601',
      ifscCode: 'ICIC0007345',
      bankName: 'ICICI BANK',
      branch: 'NIWARGANJ',
      bankCode: '36601'
    }
  });
  const [quotations, setQuotations] = useState(() => {
    // Load quotations from localStorage on component mount
    const savedQuotations = localStorage.getItem('marketingQuotations');
    return savedQuotations ? JSON.parse(savedQuotations) : [];
  });
  const [pis, setPis] = useState(() => {
    // Load PIs from localStorage on component mount
    const savedPis = localStorage.getItem('marketingPIs');
    return savedPis ? JSON.parse(savedPis) : [];
  });
  const [quotationData, setQuotationData] = useState({
    quotationNumber: `ANQ${Date.now().toString().slice(-6)}`,
    quotationDate: new Date().toISOString().split('T')[0],
    validUpto: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    selectedBranch: 'ANODE',
    items: [
      {
        id: 1,
        description: "Industrial Motor 5HP",
        quantity: 1,
        unit: "Nos",
        amount: 50000
      }
    ],
    subtotal: 50000,
    taxRate: 18,
    taxAmount: 9000,
    total: 59000,
    billTo: {
      business: "",
      address: "",
      phone: "",
      gstNo: "",
      state: ""
    }
  });
  const [selectedBranch, setSelectedBranch] = useState('ANODE');
  const [showQuotationPopup, setShowQuotationPopup] = useState(false);
  const [quotationPopupData, setQuotationPopupData] = useState(null);
  
  // Payment related state
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    amount: '',
    paymentMethod: 'Cash',
    dueDate: '',
    paidDate: '',
    reference: '',
    status: 'paid'
  });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  
  // Sync quotations with localStorage whenever quotations change
  useEffect(() => {
    localStorage.setItem('marketingQuotations', JSON.stringify(quotations));
  }, [quotations]);

  // Sync PIs with localStorage whenever PIs change
  useEffect(() => {
    localStorage.setItem('marketingPIs', JSON.stringify(pis));
  }, [pis]);
  
  // Company branch configuration
  const companyBranches = {
    ANODE: {
      name: 'ANODE ELECTRIC PRIVATE LIMITED',
      gstNumber: '(23AANCA7455R1ZX)',
      description: 'MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES.',
      address: 'KHASRA NO. 805/5, PLOT NO. 10, IT PARK, BARGI HILLS, JABALPUR - 482003, MADHYA PRADESH, INDIA.',
      tel: '6262002116, 6262002113',
      web: 'www.anocab.com',
      email: 'info@anocab.com',
      logo: 'Anocab - A Positive Connection.....'
    },
    SAMRIDDHI_CABLE: {
      name: 'SAMRIDDHI CABLE INDUSTRIES PRIVATE LIMITED',
      gstNumber: '(23ABPCS7684F1ZT)',
      description: 'MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES.',
      address: 'KHASRA NO. 805/5, PLOT NO. 10, IT PARK, BARGI HILLS, JABALPUR - 482003, MADHYA PRADESH, INDIA.',
      tel: '6262002116, 6262002113',
      web: 'www.samriddhicable.com',
      email: 'info@samriddhicable.com',
      logo: 'Samriddhi Cable - Quality & Excellence.....'
    },
    SAMRIDDHI_INDUSTRIES: {
      name: 'SAMRIDDHI INDUSTRIES',
      gstNumber: '(23ABWFS1117M1ZT)',
      description: 'MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES.',
      address: 'KHASRA NO. 805/5, PLOT NO. 10, IT PARK, BARGI HILLS, JABALPUR - 482003, MADHYA PRADESH, INDIA.',
      tel: '6262002116, 6262002113',
      web: 'www.samriddhiindustries.com',
      email: 'info@samriddhiindustries.com',
      logo: 'Samriddhi Industries - Innovation & Trust.....'
    }
  };
  const [filters, setFilters] = useState({
    name: '',
    address: '',
    gstNo: '',
    visitingStatus: '',
    leadSource: '',
    customerType: '',
    productType: '',
    state: '',
    date: ''
  });
  const [leads, setLeads] = useState([
    {
      id: 1,
      leadId: 'LD-2025-001',
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      address: '123 MG Road, Indore, MP',
      gstNo: '23ABCDE1234F1Z5',
      productType: 'Industrial Equipment',
      state: 'Madhya Pradesh',
      leadSource: 'Website',
      customerType: 'B2B',
      date: '2025-01-17',
      visitingStatus: 'Scheduled',
      visitingStatusUpdated: '2025-01-17T10:30:00',
      transferredLeads: 0,
      transferredTo: null,
      paymentStatus: 'Pending',
      meetings: [
        { date: '2025-01-20', time: '10:00 AM', type: 'Initial Meeting', status: 'Scheduled' },
        { date: '2025-01-25', time: '2:00 PM', type: 'Follow-up', status: 'Planned' }
      ]
    },
    {
      id: 2,
      leadId: 'LD-2025-002',
      name: 'Priya Sharma',
      phone: '+91 87654 32109',
      address: '456 Business Park, Bhopal, MP',
      gstNo: '23FGHIJ5678K2L6',
      productType: 'Commercial Lighting',
      state: 'Madhya Pradesh',
      leadSource: 'Referral',
      customerType: 'B2B',
      date: '2025-01-16',
      visitingStatus: 'Visited',
      visitingStatusUpdated: '2025-01-16T14:45:00',
      transferredLeads: 1,
      transferredTo: 'John Smith',
      paymentStatus: 'Partial',
      meetings: [
        { date: '2025-01-18', time: '11:00 AM', type: 'Product Demo', status: 'Completed' },
        { date: '2025-01-22', time: '3:00 PM', type: 'Proposal Discussion', status: 'Scheduled' }
      ]
    },
    {
      id: 3,
      leadId: 'LD-2025-003',
      name: 'Amit Patel',
      phone: '+91 76543 21098',
      address: '789 Industrial Area, Jabalpur, MP',
      gstNo: '23KLMNO9012P3M7',
      productType: 'Power Solutions',
      state: 'Madhya Pradesh',
      leadSource: 'Cold Call',
      customerType: 'B2B',
      date: '2025-01-15',
      visitingStatus: 'Not Visited',
      visitingStatusUpdated: '2025-01-15T09:15:00',
      transferredLeads: 0,
      transferredTo: null,
      paymentStatus: 'Not Started',
      meetings: [
        { date: '2025-01-21', time: '9:00 AM', type: 'Initial Contact', status: 'Planned' }
      ]
    },
    {
      id: 4,
      leadId: 'LD-2025-004',
      name: 'Sneha Gupta',
      phone: '+91 65432 10987',
      address: '321 Tech Hub, Gwalior, MP',
      gstNo: '23PQRST3456U4V8',
      productType: 'Industrial Equipment',
      state: 'Madhya Pradesh',
      leadSource: 'Social Media',
      customerType: 'B2C',
      date: '2025-01-14',
      visitingStatus: 'Scheduled',
      visitingStatusUpdated: '2025-01-14T16:20:00',
      transferredLeads: 0,
      transferredTo: null,
      paymentStatus: 'Paid',
      meetings: [
        { date: '2025-01-19', time: '2:30 PM', type: 'Site Visit', status: 'Completed' },
        { date: '2025-01-23', time: '10:30 AM', type: 'Final Discussion', status: 'Scheduled' }
      ]
    },
    {
      id: 5,
      leadId: 'LD-2025-005',
      name: 'Vikram Singh',
      phone: '+91 54321 09876',
      address: '654 Corporate Plaza, Ujjain, MP',
      gstNo: '23WXYZ7890A5B9',
      productType: 'Commercial Lighting',
      state: 'Madhya Pradesh',
      leadSource: 'Website',
      customerType: 'B2B',
      date: '2025-01-13',
      visitingStatus: 'Visited',
      visitingStatusUpdated: '2025-01-13T11:30:00',
      transferredLeads: 0,
      transferredTo: null,
      paymentStatus: 'Cancelled',
      meetings: [
        { date: '2025-01-17', time: '1:00 PM', type: 'Initial Meeting', status: 'Completed' }
      ]
    }
  ]);

  const filteredLeads = leads.filter(lead => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.address.toLowerCase().includes(searchTerm) ||
      lead.gstNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.leadId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter conditions
    const matchesFilters = 
      (filters.name === '' || lead.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.address === '' || lead.address.toLowerCase().includes(filters.address.toLowerCase())) &&
      (filters.gstNo === '' || lead.gstNo.toLowerCase().includes(filters.gstNo.toLowerCase())) &&
      (filters.visitingStatus === '' || lead.visitingStatus === filters.visitingStatus) &&
      (filters.leadSource === '' || lead.leadSource === filters.leadSource) &&
      (filters.customerType === '' || lead.customerType === filters.customerType) &&
      (filters.productType === '' || lead.productType === filters.productType) &&
      (filters.state === '' || lead.state === filters.state) &&
      (filters.date === '' || lead.date === filters.date);
    
    return matchesSearch && matchesFilters;
  });

  const getVisitingStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Visited': return 'bg-green-100 text-green-800';
      case 'Not Visited': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: 'numeric' 
    });
    const formattedTime = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    return `${formattedDate}, ${formattedTime}`;
  };

  const getFinalStatusColor = (status) => {
    switch (status) {
      case 'Interested': return 'bg-green-100 text-green-800';
      case 'Not Interested': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setActiveTab('Details');
    setShowViewModal(true);
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setShowEditModal(true);
  };

  const handleSaveLead = (updatedLead) => {
    setLeads(leads.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
    setShowEditModal(false);
    setSelectedLead(null);
  };

  const handleAddLead = (newLead) => {
    const newId = Math.max(...leads.map(l => l.id)) + 1;
    const leadWithId = {
      ...newLead,
      id: newId,
      leadId: `LD-2025-${String(newId).padStart(3, '0')}`,
      transferredLeads: 0,
      transferredTo: null,
      visitingStatusUpdated: new Date().toISOString(),
      meetings: []
    };
    setLeads([...leads, leadWithId]);
    setShowAddModal(false);
  };

  const handleImportLeads = (importedLeads) => {
    const leadsWithIds = importedLeads.map((lead, index) => {
      const newId = Math.max(...leads.map(l => l.id)) + index + 1;
      return {
        ...lead,
        id: newId,
        leadId: `LD-2025-${String(newId).padStart(3, '0')}`,
        transferredLeads: 0,
        transferredTo: null,
        visitingStatusUpdated: new Date().toISOString(),
        meetings: []
      };
    });
    setLeads([...leads, ...leadsWithIds]);
    setShowImportModal(false);
  };

  const handleSaveQuotation = (quotationData) => {
    const newQuotations = [...quotations, quotationData];
    setQuotations(newQuotations);
    
    setShowQuotationModal(false);
    setSelectedLead(null);
    // You can add a success message here
    alert('Quotation created successfully!');
  };

  const handleCreateQuotation = () => {
    if (selectedLead) {
      setShowQuotationModal(true);
    }
  };

  const handleCreatePI = () => {
    if (selectedLead) {
      setShowPIModal(true);
    }
  };

  const handlePIInputChange = (field, value) => {
    setPiFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePIItemChange = (index, field, value) => {
    const updatedItems = [...piFormData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    // Calculate amount for this item
    if (['quantity', 'rate'].includes(field)) {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
    }
    
    // Calculate totals
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * piFormData.taxRate) / 100;
    const total = subtotal + taxAmount;
    
    // Generate amount in words
    const amountInWords = `INR ${numberToWords(total)} Only`;
    
    setPiFormData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      taxAmount,
      total,
      amountInWords
    }));
  };

  // Helper function to convert numbers to words (simplified version)
  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    if (num === 0) return 'Zero';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
    if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
    return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
  };

  const addPIItem = () => {
    setPiFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: prev.items.length + 1,
        description: '',
        subDescription: '',
        hsnSac: '',
        dueOn: new Date().toISOString().split('T')[0],
        quantity: 1,
        unit: 'MTR',
        rate: 0,
        amount: 0
      }]
    }));
  };

  const removePIItem = (index) => {
    if (piFormData.items.length > 1) {
      const updatedItems = piFormData.items.filter((_, i) => i !== index);
      const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
      const taxAmount = (subtotal * piFormData.taxRate) / 100;
      const total = subtotal + taxAmount;
      
      setPiFormData(prev => ({
        ...prev,
        items: updatedItems,
        subtotal,
        taxAmount,
        total
      }));
    }
  };

  const handleSavePI = () => {
    // Create new PI object
    const newPI = {
      id: Date.now(),
      voucherNo: piFormData.voucherNo,
      dated: piFormData.dated,
      branch: piFormData.branch,
      paymentTerms: piFormData.paymentTerms,
      buyersRef: piFormData.buyersRef,
      otherReferences: piFormData.otherReferences,
      dispatchedThrough: piFormData.dispatchedThrough,
      destination: piFormData.destination,
      deliveryTerms: piFormData.deliveryTerms,
      items: piFormData.items,
      subtotal: piFormData.subtotal,
      taxRate: piFormData.taxRate,
      taxAmount: piFormData.taxAmount,
      total: piFormData.total,
      amountInWords: piFormData.amountInWords,
      bankDetails: piFormData.bankDetails,
      createdAt: new Date().toISOString(),
      leadId: selectedLead?.id,
      leadName: selectedLead?.name
    };

    // Add PI to the list
    setPis(prev => [newPI, ...prev]);
    
    alert('PI created successfully!');
    setShowPIModal(false);
    
    // Reset form
    setPiFormData({
      branch: 'ANODE',
      voucherNo: `PI-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      dated: new Date().toISOString().split('T')[0],
      paymentTerms: 'ADVANCE',
      buyersRef: `BR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      otherReferences: 'DIRECT SALE',
      dispatchedThrough: 'BY TRANSPORT',
      destination: '',
      deliveryTerms: 'Delivery :- FOR upto',
      items: [
        {
          id: 1,
          description: '',
          subDescription: '',
          hsnSac: '',
          dueOn: new Date().toISOString().split('T')[0],
          quantity: 1,
          unit: 'MTR',
          rate: 0,
          amount: 0
        }
      ],
      subtotal: 0,
      taxRate: 18,
      taxAmount: 0,
      total: 0,
      amountInWords: 'INR Zero Only',
      bankDetails: {
        accountHolderName: 'ANODE ELECTRIC PVT. LTD.',
        accountNumber: '777705336601',
        ifscCode: 'ICIC0007345',
        bankName: 'ICICI BANK',
        branch: 'NIWARGANJ',
        bankCode: '36601'
      }
    });
  };

  const handlePIPreview = () => {
    setShowPIPreview(true);
  };

  const handlePIDownload = () => {
    const element = document.getElementById('pi-preview-content');
    if (element) {
      const opt = {
        margin: [0.4, 0.4, 0.4, 0.4],
        filename: `PI-${selectedLead.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.8 },
        html2canvas: { 
          scale: 1.1,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true,
          putOnlyUsedFonts: true
        }
      };
      html2pdf().set(opt).from(element).save();
    } else {
      alert('No PI content to download');
    }
  };

  const isPIFormValid = () => {
    return piFormData.branch && 
           piFormData.voucherNo && 
           piFormData.dated && 
           piFormData.paymentTerms && 
           piFormData.buyersRef && 
           piFormData.otherReferences && 
           piFormData.dispatchedThrough && 
           piFormData.destination && 
           piFormData.deliveryTerms &&
           piFormData.items.some(item => item.description && item.hsnSac && item.quantity > 0 && item.rate > 0);
  };

  // Function to clear all quotations (for testing purposes)
  const clearAllQuotations = () => {
    setQuotations([]);
    localStorage.removeItem('marketingQuotations');
    alert('All quotations cleared!');
  };

  const handleSendVerification = (lead) => {
    // Update lead's quotation status to pending
    const updatedLead = {
      ...lead,
      quotationStatus: 'pending',
      verificationSentAt: new Date().toISOString()
    }
    
    // Update the lead in the leads array
    setLeads(prevLeads => 
      prevLeads.map(l => l.id === lead.id ? updatedLead : l)
    );
    
    // Update the selected lead if it's the same
    if (selectedLead && selectedLead.id === lead.id) {
      setSelectedLead(updatedLead);
    }
    
    // Show success message
    alert('Verification request sent successfully! Status will be updated when the customer responds.');
  };

  const handleViewLatestQuotation = (lead) => {
    // Create sample quotation data for demo purposes
    const sampleQuotationData = {
      quotationNumber: `ANO/25-26/${Math.floor(Math.random() * 9999)}`,
      quotationDate: new Date().toISOString().split('T')[0],
      validUpto: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      voucherNumber: `VOUCH-${Math.floor(Math.random() * 9999)}`,
      customer: lead,
      items: [
        {
          description: lead.productName || "XLPE Cable 1.5mm",
          quantity: 100,
          unitPrice: 150.00,
          total: 15000.00
        }
      ],
      subtotal: 15000.00,
      tax: 2700.00,
      total: 17700.00
    }
    
    setQuotationPopupData(sampleQuotationData);
    setShowQuotationPopup(true);
  };

  const handleWalletClick = async (lead) => {
    console.log('Opening payment modal for lead:', lead);
    // Use the demo payment history data
    setPaymentHistory([
      {
        id: 1,
        amount: 50000,
        date: '2024-01-15',
        status: 'paid',
        paymentMethod: 'Cash',
        remarks: 'Initial advance payment',
        reference: 'CASH001',
        dueDate: '2024-01-15',
        paidDate: '2024-01-15'
      },
      {
        id: 2,
        amount: 25000,
        date: '2024-01-20',
        status: 'paid',
        paymentMethod: 'UPI',
        remarks: 'Second installment',
        reference: 'UPI123456',
        dueDate: '2024-01-20',
        paidDate: '2024-01-20'
      },
      {
        id: 3,
        amount: 15000,
        date: '2024-01-25',
        status: 'pending',
        paymentMethod: 'Bank Transfer',
        remarks: 'Final payment pending',
        reference: 'BANK789',
        dueDate: '2024-01-25',
        paidDate: null
      }
    ]);
    console.log('Payment history set with demo data');
    setTotalAmount(90000);
    setSelectedCustomer({
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      business: lead.business,
      address: lead.address
    });
    setShowPaymentDetails(true);
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPayment = () => {
    if (!paymentFormData.amount || !paymentFormData.paymentMethod) {
      alert('Please fill in all required fields');
      return;
    }

    const newPayment = {
      id: Date.now(),
      amount: parseFloat(paymentFormData.amount),
      paymentMethod: paymentFormData.paymentMethod,
      dueDate: paymentFormData.dueDate || new Date().toISOString().split('T')[0],
      paidDate: paymentFormData.paidDate || new Date().toISOString().split('T')[0],
      reference: paymentFormData.reference || `REF-${Date.now()}`,
      status: paymentFormData.status,
      customerId: selectedCustomer?.id,
      date: paymentFormData.paidDate || new Date().toISOString().split('T')[0],
      remarks: `Payment via ${paymentFormData.paymentMethod}`
    };

    setPaymentHistory(prev => [...prev, newPayment]);
    setTotalAmount(prev => prev + newPayment.amount);
    
    // Reset form
    setPaymentFormData({
      amount: '',
      paymentMethod: 'Cash',
      dueDate: '',
      paidDate: '',
      reference: '',
      status: 'paid'
    });
    
    setShowAddPaymentModal(false);
    alert('Payment added successfully!');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-16">
      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          height: 8px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 4px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
      {/* Top Section - Search and Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, phone, address, or lead ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 ml-6">
            {/* Filter Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <Filter className="w-5 h-5 text-purple-600" />
            </button>

            {/* Add Customer Button */}
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>

            {/* Lead Import Button */}
            <button 
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Lead Import</span>
            </button>

            {/* Refresh Button */}
            <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>


      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <table className="min-w-full divide-y divide-gray-200" style={{minWidth: '1200px'}}>
            <thead className="bg-gray-50">
              {/* Filter Row */}
              {showFilters && (
                <tr className="bg-blue-50">
                  <th className="px-6 py-2">
                    {/* # Column - No filter */}
                  </th>
                  <th className="px-6 py-2">
                    <input
                      type="text"
                      placeholder="Filter customer"
                      value={filters.name || ''}
                      onChange={(e) => setFilters({...filters, name: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-2">
                    <input
                      type="text"
                      placeholder="Filter address"
                      value={filters.address || ''}
                      onChange={(e) => setFilters({...filters, address: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-2">
                    <input
                      type="text"
                      placeholder="Filter GST"
                      value={filters.gstNo || ''}
                      onChange={(e) => setFilters({...filters, gstNo: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-2">
                    <select
                      value={filters.productType}
                      onChange={(e) => setFilters({...filters, productType: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">All Type</option>
                      <option value="Industrial Equipment">Industrial Equipment</option>
                      <option value="Commercial Lighting">Commercial Lighting</option>
                      <option value="Power Solutions">Power Solutions</option>
                    </select>
                  </th>
                  <th className="px-6 py-2">
                    <select
                      value={filters.state}
                      onChange={(e) => setFilters({...filters, state: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">All St</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Rajasthan">Rajasthan</option>
                    </select>
                  </th>
                  <th className="px-6 py-2">
                    <select
                      value={filters.leadSource}
                      onChange={(e) => setFilters({...filters, leadSource: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">All Sou</option>
                      <option value="Website">Website</option>
                      <option value="Referral">Referral</option>
                      <option value="Cold Call">Cold Call</option>
                      <option value="Social Media">Social Media</option>
                    </select>
                  </th>
                  <th className="px-6 py-2">
                    <select
                      value={filters.customerType}
                      onChange={(e) => setFilters({...filters, customerType: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="B2B">B2B</option>
                      <option value="B2C">B2C</option>
                    </select>
                  </th>
                  <th className="px-6 py-2">
                    <input
                      type="date"
                      value={filters.date || ''}
                      onChange={(e) => setFilters({...filters, date: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-2">
                    <select
                      value={filters.visitingStatus}
                      onChange={(e) => setFilters({...filters, visitingStatus: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Visited">Visited</option>
                      <option value="Not Visited">Not Visited</option>
                    </select>
                  </th>
                  <th className="px-6 py-2">
                    {/* Transferred Leads - No filter */}
                  </th>
                  <th className="px-6 py-2">
                    {/* Action - No filter */}
                  </th>
                </tr>
              )}
              
              {/* Header Row */}
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '100px', minWidth: '100px'}}>
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-purple-600" />
                    <span>LEAD ID</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '200px', minWidth: '200px'}}>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>NAME & PHONE</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '250px', minWidth: '250px'}}>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>ADDRESS</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '150px', minWidth: '150px'}}>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>GST NO.</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '150px', minWidth: '150px'}}>
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-purple-600" />
                    <span>PRODUCT TYPE</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '120px', minWidth: '120px'}}>
                  <div className="flex items-center space-x-2">
                    <Map className="w-4 h-4 text-blue-600" />
                    <span>STATE</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '120px', minWidth: '120px'}}>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-orange-600" />
                    <span>LEAD SOURCE</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '120px', minWidth: '120px'}}>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>CUSTOMER TYPE</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '100px', minWidth: '100px'}}>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span>DATE</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '120px', minWidth: '120px'}}>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span>VISITING STATUS</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '150px', minWidth: '150px'}}>
                  <div className="flex items-center space-x-2">
                    <ArrowUpDown className="w-4 h-4 text-purple-600" />
                    <span>TRANSFERRED LEADS</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '120px', minWidth: '120px'}}>
                  <div className="flex items-center space-x-2">
                    <Edit className="w-4 h-4 text-gray-600" />
                    <span>ACTION</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lead.leadId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate">{lead.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.gstNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.productType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.leadSource}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.customerType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getVisitingStatusColor(lead.visitingStatus)}`}>
                          {lead.visitingStatus}
                        </span>
                        {lead.visitingStatusUpdated && (
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(lead.visitingStatusUpdated)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-1 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      {lead.transferredTo ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {lead.transferredTo}
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          Not Transferred
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewLead(lead)}
                          className="w-8 h-8 rounded-full border-2 border-blue-500 bg-white hover:bg-blue-50 transition-colors flex items-center justify-center"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                        <button 
                          onClick={() => handleEditLead(lead)}
                          className="w-8 h-8 rounded-full border-2 border-orange-500 bg-white hover:bg-orange-50 transition-colors flex items-center justify-center"
                          title="Edit Lead"
                        >
                          <Edit className="w-4 h-4 text-orange-500" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowQuotationModal(true);
                          }}
                          className="w-8 h-8 rounded-full border-2 border-green-500 bg-white hover:bg-green-50 transition-colors flex items-center justify-center"
                          title="Create Quotation"
                        >
                          <DollarSign className="w-4 h-4 text-green-500" />
                        </button>
                        <button 
                          onClick={() => handleWalletClick(lead)}
                          className="w-8 h-8 rounded-full border-2 border-purple-500 bg-white hover:bg-purple-50 transition-colors flex items-center justify-center"
                          title="View Payment Details"
                        >
                          <Wallet className="w-4 h-4 text-purple-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Search className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">No customers available</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Lead Details Modal */}
      {showViewModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Lead Details - MKT-{selectedLead.id.toString().padStart(4, '0')}</h2>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <div className="flex items-center gap-2 border-b border-gray-200 px-6">
                <button
                  className={`px-3 py-2 text-sm flex items-center gap-1 ${
                    activeTab === 'Details' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`} 
                  onClick={() => setActiveTab('Details')}
                >
                  <User className="h-4 w-4" />
                  Details
                </button>
                <button
                  className={`px-3 py-2 text-sm flex items-center gap-1 ${
                    activeTab === 'Quotation & Payments' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`} 
                  onClick={() => setActiveTab('Quotation & Payments')}
                >
                  <FileText className="h-4 w-4" />
                  Quotation & Payment
                </button>
                <button
                  className={`px-3 py-2 text-sm flex items-center gap-1 ${
                    activeTab === 'Proforma Invoice' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`} 
                  onClick={() => setActiveTab('Proforma Invoice')}
                >
                  <Clock className="h-4 w-4" />
                  Performa Invoice
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Details Tab */}
              {activeTab === 'Details' && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Customer Name</span>
                    <span className="font-medium text-gray-900">{selectedLead.name}</span>
                    </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-medium text-gray-900">{selectedLead.phone}</span>
                    </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Address</span>
                    <span className="font-medium text-gray-900 text-right max-w-[60%]">{selectedLead.address}</span>
                    </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">GST No.</span>
                    <span className="font-medium text-gray-900">{selectedLead.gstNo || '-'}</span>
                    </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Product Type</span>
                    <span className="font-medium text-gray-900">{selectedLead.productType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">State</span>
                    <span className="font-medium text-gray-900">{selectedLead.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lead Source</span>
                    <span className="font-medium text-gray-900">{selectedLead.leadSource}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Customer Type</span>
                    <span className="font-medium text-gray-900">{selectedLead.customerType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium text-gray-900">{selectedLead.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Visiting Status</span>
                    <div className="flex flex-col items-center space-y-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVisitingStatusColor(selectedLead.visitingStatus)}`}>
                        {selectedLead.visitingStatus}
                      </span>
                      {selectedLead.visitingStatusUpdated && (
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(selectedLead.visitingStatusUpdated)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Final Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFinalStatusColor(selectedLead.finalStatus)}`}>
                      {selectedLead.finalStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedLead.paymentStatus)}`}>
                      {selectedLead.paymentStatus}
                    </span>
                  </div>
                </div>
              )}

              {/* Quotation & Payments Tab */}
              {activeTab === 'Quotation & Payments' && (
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Quotation Status</h3>
                    <div className="rounded-md border border-gray-200 divide-y">
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-gray-700">Latest Quotation</span>
                        <button 
                          onClick={() => handleViewLatestQuotation(selectedLead)}
                          className="text-blue-600 underline inline-flex items-center gap-1 hover:text-blue-700 text-xs"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-gray-700">Quotations Sent</span>
                        <span className="text-xs text-gray-500">{quotations.length}</span>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-gray-700">Verification Status</span>
                        {!selectedLead.quotationStatus || selectedLead.quotationStatus === 'send_verification' ? (
                        <button 
                            onClick={() => handleSendVerification(selectedLead)}
                            className="text-xs px-3 py-1 rounded-full font-medium bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Send Verification
                        </button>
                        ) : (
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            selectedLead.quotationStatus === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : selectedLead.quotationStatus === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : selectedLead.quotationStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {selectedLead.quotationStatus === 'approved' 
                              ? 'Verified' 
                              : selectedLead.quotationStatus === 'rejected'
                              ? 'Rejected'
                              : selectedLead.quotationStatus === 'pending'
                              ? 'Pending'
                              : 'Send Verification'
                            }
                          </span>
                        )}
                      </div>
                    </div>
                        </div>
                    <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Quotation Details</h3>
                    <div className="rounded-md border border-gray-200 divide-y">
                      {quotations.length > 0 ? (
                        quotations
                          .sort((a, b) => new Date(b.createdAt || b.quotationDate) - new Date(a.createdAt || a.quotationDate))
                          .map((quotation, index) => (
                            <div key={quotation.quotationNumber || index} className="p-3 flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <span className="text-gray-700">
                                  {index === 0 ? 'Latest Quotation:' : `Quotation #${quotations.length - index}:`}
                                </span>
                                <span 
                                  className="text-xs text-blue-600 cursor-pointer hover:text-blue-800 hover:underline"
                                  onClick={() => {
                                    setQuotationPopupData(quotation);
                                    setShowQuotationPopup(true);
                                  }}
                                >
                                  {quotation.quotationNumber}
                                </span>
                                <span className="text-xs text-gray-500">{quotation.quotationDate}</span>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="p-3 text-center text-gray-500 text-sm">
                          No quotations created yet
                        </div>
                      )}
                    </div>
                          </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment Status</h3>
                    <div className="rounded-md border border-gray-200 divide-y">
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-gray-700">Advance</span>
                        <span className="text-xs text-gray-500">Not received</span>
                        </div>
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-gray-700">Balance</span>
                        <span className="text-xs text-gray-500">N/A</span>
                      </div>
                    </div>
                    </div>
                    </div>
              )}

              {/* Proforma Invoice Tab */}
              {activeTab === 'Proforma Invoice' && (
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">PI Status</h3>
                    <div className="rounded-md border border-gray-200 divide-y">
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-gray-700">Latest PI</span>
                        {pis.filter(pi => pi.leadId === selectedLead.id).length > 0 ? (
                          <button 
                            onClick={() => {
                              const latestPI = pis.filter(pi => pi.leadId === selectedLead.id)
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                              setPiPopupData(latestPI);
                              setShowPIPopup(true);
                            }}
                            className="text-blue-600 underline inline-flex items-center gap-1 hover:text-blue-700 text-xs"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500">No PI created</span>
                        )}
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-gray-700">PIs Sent</span>
                        <span className="text-xs text-gray-500">{pis.filter(pi => pi.leadId === selectedLead.id).length}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">PI Details</h3>
                    <div className="rounded-md border border-gray-200 divide-y">
                      {pis.filter(pi => pi.leadId === selectedLead.id).length > 0 ? (
                        pis
                          .filter(pi => pi.leadId === selectedLead.id)
                          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                          .map((pi, index) => (
                            <div key={pi.id} className="p-3 flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <span className="text-gray-700">
                                  {index === 0 ? 'Latest PI:' : `PI #${pis.filter(p => p.leadId === selectedLead.id).length - index}:`}
                                </span>
                                <span 
                                  className="text-xs text-blue-600 cursor-pointer hover:text-blue-800 hover:underline"
                                  onClick={() => {
                                    setPiPopupData(pi);
                                    setShowPIPopup(true);
                                  }}
                                >
                                  {pi.voucherNo}
                                </span>
                                <span className="text-xs text-gray-500">{pi.dated}</span>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="p-3 text-center text-gray-500 text-sm">
                          No PIs created yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

                      </div>
                      
            {/* Modal Footer */}
            <div className="px-6 pb-4 flex justify-end gap-3">
              <button 
                className="px-3 py-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50" 
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
              <button 
                className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700" 
                onClick={() => setShowViewModal(false)}
              >
                Done
              </button>
              {activeTab === 'Quotation & Payments' && (
                <button
                  onClick={handleCreateQuotation}
                  className="px-3 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 inline-flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Create Quotation
                </button>
              )}
              {activeTab === 'Proforma Invoice' && (
                <button
                  onClick={handleCreatePI}
                  className="px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Create PI
                </button>
              )}
                          </div>
                          </div>
                        </div>
      )}

      {/* Payment Details Modal */}
      {showPaymentDetails && selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Payment Details</h3>
                <button 
                  onClick={() => setShowPaymentDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close payment details"
                >
                  <X className="h-5 w-5" />
                </button>
                      </div>
                      
              {/* Main Content Layout */}
              <div className="flex gap-4 mb-4">
                {/* Customer Details Box (Left - Main Area) */}
                <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 text-xl mb-2">{selectedCustomer.name}</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-700 flex items-center">
                        <span className="w-16 text-gray-500">Phone:</span> 
                        <span className="font-medium">{selectedCustomer.phone}</span>
                      </p>
                      <p className="text-sm text-gray-700 flex items-center">
                        <span className="w-16 text-gray-500">Email:</span> 
                        <span className="font-medium">{selectedCustomer.email}</span>
                      </p>
                      <p className="text-sm text-gray-700 flex items-center">
                        <span className="w-16 text-gray-500">Business:</span> 
                        <span className="font-medium">{selectedCustomer.business || 'N/A'}</span>
                      </p>
                      <p className="text-sm text-gray-700 flex items-center">
                        <span className="w-16 text-gray-500">Address:</span> 
                        <span className="font-medium">{selectedCustomer.address || 'N/A'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Selected Payment Details */}
                  <div className="bg-white rounded-lg border-2 border-blue-200 p-4 shadow-sm">
                    <h5 className="font-semibold text-gray-800 mb-3 text-sm">Selected Payment Details</h5>
                    {selectedPayment ? (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Method:</span> 
                          <span className="font-semibold text-blue-600">{selectedPayment.paymentMethod}</span>
                    </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Amount:</span> 
                          <span className="font-semibold text-green-600">₹{selectedPayment.amount.toLocaleString('en-IN')}</span>
                      </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Due Date:</span> 
                          <span className="font-medium">{selectedPayment.dueDate}</span>
                      </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Paid Date:</span> 
                          <span className="font-medium">{selectedPayment.paidDate || 'Not Paid'}</span>
                      </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status:</span> 
                          <span className={`font-semibold ${selectedPayment.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                            {selectedPayment.status === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                    </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Reference:</span> 
                          <span className="font-medium text-xs">{selectedPayment.reference}</span>
                  </div>
                </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Click on a payment to view details</p>
                    )}
                        </div>
                      </div>
                    
                {/* Payment Methods (Right - Vertical) */}
                <div className="w-32 space-y-2">
                  <div className="bg-blue-100 border-2 border-blue-300 p-2 rounded-lg text-center text-sm font-semibold cursor-pointer hover:bg-blue-200 hover:scale-105 transition-all duration-200 shadow-sm">
                    Cash
                    </div>
                  <div className="bg-gray-100 border-2 border-gray-300 p-2 rounded-lg text-center text-sm font-semibold cursor-pointer hover:bg-gray-200 hover:scale-105 transition-all duration-200 shadow-sm">
                    Card
                      </div>
                  <div className="bg-gray-100 border-2 border-gray-300 p-2 rounded-lg text-center text-sm font-semibold cursor-pointer hover:bg-gray-200 hover:scale-105 transition-all duration-200 shadow-sm">
                    UPI
                    </div>
                  <div className="bg-gray-100 border-2 border-gray-300 p-2 rounded-lg text-center text-sm font-semibold cursor-pointer hover:bg-gray-200 hover:scale-105 transition-all duration-200 shadow-sm">
                    Bank
                      </div>
                  <div className="bg-gray-100 border-2 border-gray-300 p-2 rounded-lg text-center text-sm font-semibold cursor-pointer hover:bg-gray-200 hover:scale-105 transition-all duration-200 shadow-sm">
                    Cheque
                    </div>
                  <div className="bg-gray-100 border-2 border-gray-300 p-2 rounded-lg text-center text-sm font-semibold cursor-pointer hover:bg-gray-200 hover:scale-105 transition-all duration-200 shadow-sm">
                    Other
                  </div>
                      </div>
                    </div>
                    
              {/* Payment History - Interactive */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 text-sm">Payment History</h4>
                {paymentHistory.length > 0 ? (
                  <div className="space-y-2">
                    {paymentHistory.map((payment) => (
                      <div 
                        key={payment.id} 
                        className={`rounded-lg p-3 text-sm cursor-pointer transition-all duration-200 hover:scale-105 shadow-sm border-2 ${
                          selectedPayment?.id === payment.id 
                            ? 'bg-blue-100 border-blue-300 shadow-md' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPayment(payment)}
                        title="Click to view payment details"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <span className="font-bold text-lg">₹{payment.amount.toLocaleString('en-IN')}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              payment.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {payment.status === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                        </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-700">{payment.paymentMethod}</div>
                            <div className="text-gray-500 text-xs">{payment.date}</div>
                        </div>
                        </div>
                        {selectedPayment?.id === payment.id && (
                          <div className="mt-2 pt-2 border-t border-gray-300">
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Reference:</span> {payment.reference}
                            </p>
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Remarks:</span> {payment.remarks}
                            </p>
                      </div>
                        )}
                    </div>
                    ))}
                    </div>
                ) : (
                  <p className="text-center text-gray-500 py-4 text-sm">No payment history found</p>
                )}
                  </div>
                </div>
            
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowPaymentDetails(false)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded shadow-sm hover:bg-blue-700"
                onClick={() => setShowAddPaymentModal(true)}
              >
                Add Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {showEditModal && selectedLead && (
        <EditLeadModal 
          lead={selectedLead} 
          onSave={handleSaveLead}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <AddCustomerModal 
          onSave={handleAddLead}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Lead Import Modal */}
      {showImportModal && (
        <LeadImportModal 
          onImport={handleImportLeads}
          onClose={() => setShowImportModal(false)}
        />
      )}

      {/* Quotation Modal */}
      {showQuotationModal && selectedLead && (
        <MarketingQuotationForm 
          customer={selectedLead}
          user={{ username: 'Marketing User', email: 'marketing@anocab.com' }}
          onSave={handleSaveQuotation}
          onClose={() => {
            setShowQuotationModal(false);
            setSelectedLead(null);
          }}
        />
      )}

      {/* Quotation Popup Modal */}
      {showQuotationPopup && quotationPopupData && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Latest Quotation - {quotationPopupData.customer.name}</h3>
                <button 
                  onClick={() => setShowQuotationPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close quotation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Quotation Content */}
              <div id="quotation-preview-content" className="border-2 border-black p-6 bg-white">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h1 className="text-xl font-bold">ANODE ELECTRIC PRIVATE LIMITED</h1>
                    <p className="text-sm font-semibold text-gray-700">(23AANCA7455R1ZX)</p>
                    <p className="text-xs">MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES.</p>
                  </div>
                  <div className="text-right">
                    <img
                      src="https://res.cloudinary.com/drpbrn2ax/image/upload/v1757416761/logo2_kpbkwm-removebg-preview_jteu6d.png"
                      alt="Company Logo"
                      className="h-12 w-auto bg-white p-1 rounded"
                    />
                  </div>
                </div>
                
                {/* Company Details */}
                <div className="border-2 border-black p-4 mb-4">
                  <h3 className="font-bold mb-2">Company Details</h3>
                  <p className="text-sm">KHASRA NO. 805/5, PLOT NO. 10, IT PARK, BARGI HILLS, JABALPUR - 482003, MADHYA PRADESH, INDIA.</p>
                  <p className="text-sm">Tel: 6262002116, 6262002113</p>
                  <p className="text-sm">Web: www.anocab.com</p>
                  <p className="text-sm">Email: info@anocab.com</p>
                </div>
              
                {/* Quotation Details Table */}
                <div className="border border-black p-4 mb-4">
                  <h3 className="font-bold mb-2">Quotation Details</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-black">
                        <th className="text-left p-2 border-r border-black">Quotation Date</th>
                        <th className="text-left p-2 border-r border-black">Quotation Number</th>
                        <th className="text-left p-2 border-r border-black">Valid Upto</th>
                        <th className="text-left p-2">Voucher Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-r border-black">{quotationPopupData.quotationDate}</td>
                        <td className="p-2 border-r border-black">{quotationPopupData.quotationNumber}</td>
                        <td className="p-2 border-r border-black">{quotationPopupData.validUpto}</td>
                        <td className="p-2">{quotationPopupData.voucherNumber}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {/* Customer Details */}
                <div className="border border-black p-4 mb-4">
                  <h3 className="font-bold mb-2">Bill To:</h3>
                  <p className="font-semibold">{quotationPopupData.customer.name}</p>
                  <p>{quotationPopupData.customer.business}</p>
                  <p>{quotationPopupData.customer.address}</p>
                  <p>Phone: {quotationPopupData.customer.phone}</p>
                  <p>Email: {quotationPopupData.customer.email}</p>
                </div>
                
                {/* Items Table */}
                <div className="border border-black p-4 mb-4">
                  <h3 className="font-bold mb-2">Items</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-black">
                        <th className="text-left p-2 border-r border-black">Description</th>
                        <th className="text-center p-2 border-r border-black">Quantity</th>
                        <th className="text-right p-2 border-r border-black">Unit Price</th>
                        <th className="text-right p-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotationPopupData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="p-2 border-r border-black">{item.description}</td>
                          <td className="p-2 text-center border-r border-black">{item.quantity}</td>
                          <td className="p-2 text-right border-r border-black">₹{item.unitPrice.toFixed(2)}</td>
                          <td className="p-2 text-right">₹{item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Totals */}
                <div className="border border-black p-4">
                  <div className="flex justify-end">
                    <div className="w-64">
                      <div className="flex justify-between p-2 border-b">
                        <span>Subtotal:</span>
                        <span>₹{quotationPopupData.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between p-2 border-b">
                        <span>Tax (18%):</span>
                        <span>₹{quotationPopupData.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between p-2 font-bold">
                        <span>Total:</span>
                        <span>₹{quotationPopupData.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="text-right text-xs mt-4">
                  <p className="mb-4">
                    For <strong>ANODE ELECTRIC PRIVATE LIMITED</strong>
                  </p>
                  <p className="mb-8">This is computer generated quotation no signature required.</p>
                  <p className="font-bold">Authorized Signatory</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowQuotationPopup(false)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 border border-transparent rounded shadow-sm hover:bg-green-700 flex items-center gap-2"
                onClick={() => {
                  const element = document.getElementById('quotation-preview-content');
                  if (element) {
                    const opt = {
                      margin: [0.4, 0.4, 0.4, 0.4],
                      filename: `Quotation-${quotationPopupData.quotationNumber}-${quotationPopupData.customer.name.replace(/\s+/g, '-')}.pdf`,
                      image: { type: 'jpeg', quality: 0.8 },
                      html2canvas: { 
                        scale: 1.1,
                        useCORS: true,
                        letterRendering: true,
                        allowTaint: true,
                        backgroundColor: '#ffffff'
                      },
                      jsPDF: { 
                        unit: 'in', 
                        format: 'a4', 
                        orientation: 'portrait',
                        compress: true,
                        putOnlyUsedFonts: true
                      }
                    };
                    html2pdf().set(opt).from(element).save();
                  } else {
                    alert('No quotation content to download');
                  }
                }}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded shadow-sm hover:bg-blue-700"
                onClick={() => {
                  alert('Print functionality would open here');
                }}
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PI Modal */}
      {showPIModal && selectedLead && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Create Proforma Invoice - {selectedLead.name}</h2>
              <button 
                onClick={() => setShowPIModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <form className="space-y-6">
                {/* General Invoice Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">General Invoice Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Select Branch *</label>
                      <select
                        value={piFormData.branch}
                        onChange={(e) => handlePIInputChange('branch', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="ANODE">ANODE ELECTRIC PRIVATE LIMITED</option>
                        <option value="SAMRIDDHI_CABLE">SAMRIDDHI CABLE INDUSTRIES PRIVATE LIMITED</option>
                        <option value="SAMRIDDHI_INDUSTRIES">SAMRIDDHI INDUSTRIES</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Voucher No. *</label>
                      <input
                        type="text"
                        value={piFormData.voucherNo}
                        onChange={(e) => handlePIInputChange('voucherNo', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Dated *</label>
                      <input
                        type="date"
                        value={piFormData.dated}
                        onChange={(e) => handlePIInputChange('dated', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Payment Terms *</label>
                      <select
                        value={piFormData.paymentTerms}
                        onChange={(e) => handlePIInputChange('paymentTerms', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="ADVANCE">ADVANCE</option>
                        <option value="NET 30">NET 30</option>
                        <option value="NET 60">NET 60</option>
                        <option value="CASH">CASH</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Buyer's Ref. *</label>
                      <input
                        type="text"
                        value={piFormData.buyersRef}
                        onChange={(e) => handlePIInputChange('buyersRef', e.target.value)}
                        className="w-full px-3 py-2.5 border border-orange-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Other References *</label>
                      <select
                        value={piFormData.otherReferences}
                        onChange={(e) => handlePIInputChange('otherReferences', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="DIRECT SALE">DIRECT SALE</option>
                        <option value="REFERRAL">REFERRAL</option>
                        <option value="WEBSITE">WEBSITE</option>
                        <option value="COLD CALL">COLD CALL</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Dispatched Through *</label>
                      <select
                        value={piFormData.dispatchedThrough}
                        onChange={(e) => handlePIInputChange('dispatchedThrough', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="BY TRANSPORT">BY TRANSPORT</option>
                        <option value="BY COURIER">BY COURIER</option>
                        <option value="BY HAND">BY HAND</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Destination *</label>
                      <input
                        type="text"
                        value={piFormData.destination}
                        onChange={(e) => handlePIInputChange('destination', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700">Delivery Terms *</label>
                    <input
                      type="text"
                      value={piFormData.deliveryTerms}
                      onChange={(e) => handlePIInputChange('deliveryTerms', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Items Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Items</h3>
                    <button 
                      type="button" 
                      onClick={addPIItem}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Item</span>
                    </button>
                  </div>

                  {piFormData.items.map((item, index) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Description</label>
                          <select
                            value={item.description}
                            onChange={(e) => handlePIItemChange(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          >
                            <option value="">Select Description</option>
                            <option value="COVERED CONDUCTOR 34 SQMM">COVERED CONDUCTOR 34 SQMM</option>
                            <option value="COVERED CONDUCTOR 25 SQMM">COVERED CONDUCTOR 25 SQMM</option>
                            <option value="COVERED CONDUCTOR 16 SQMM">COVERED CONDUCTOR 16 SQMM</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Sub Description</label>
                          <select
                            value={item.subDescription}
                            onChange={(e) => handlePIItemChange(index, 'subDescription', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          >
                            <option value="">Select Sub Description</option>
                            <option value="COVERED CONDUCTOR 34SQMM XLPE 3 LAYER">COVERED CONDUCTOR 34SQMM XLPE 3 LAYER</option>
                            <option value="COVERED CONDUCTOR 25SQMM XLPE 3 LAYER">COVERED CONDUCTOR 25SQMM XLPE 3 LAYER</option>
                            <option value="COVERED CONDUCTOR 16SQMM XLPE 3 LAYER">COVERED CONDUCTOR 16SQMM XLPE 3 LAYER</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">HSN/SAC</label>
                          <input
                            type="text"
                            value={item.hsnSac}
                            onChange={(e) => handlePIItemChange(index, 'hsnSac', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Due On</label>
                          <input
                            type="date"
                            value={item.dueOn}
                            onChange={(e) => handlePIItemChange(index, 'dueOn', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Quantity</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handlePIItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Unit</label>
                          <select
                            value={item.unit}
                            onChange={(e) => handlePIItemChange(index, 'unit', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="MTR">MTR</option>
                            <option value="Nos">Nos</option>
                            <option value="Kg">Kg</option>
                            <option value="Set">Set</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Rate (Auto-Calculated)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => handlePIItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Amount (Auto-Calculated)</label>
                          <input
                            type="number"
                            value={item.amount}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"
                          />
                        </div>
                      </div>
                      {piFormData.items.length > 1 && (
                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removePIItem(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded flex items-center space-x-1"
                          >
                            <X className="h-4 w-4" />
                            <span>Remove Item</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">IGST (18%) - Auto-Calculated</label>
                      <input
                        type="text"
                        value={`₹${piFormData.taxAmount.toFixed(2)}`}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Total Amount - Auto-Calculated</label>
                      <input
                        type="text"
                        value={`₹${piFormData.total.toFixed(2)}`}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Amount in Words - Auto-Generated</label>
                      <input
                        type="text"
                        value={piFormData.amountInWords}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">🏦</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Bank Details (Separate Fields)</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Account Holder's Name</label>
                      <input
                        type="text"
                        value={piFormData.bankDetails.accountHolderName}
                        onChange={(e) => handlePIInputChange('bankDetails', {...piFormData.bankDetails, accountHolderName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Account Number</label>
                      <input
                        type="text"
                        value={piFormData.bankDetails.accountNumber}
                        onChange={(e) => handlePIInputChange('bankDetails', {...piFormData.bankDetails, accountNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">IFSC Code (Separate Field)</label>
                      <input
                        type="text"
                        value={piFormData.bankDetails.ifscCode}
                        onChange={(e) => handlePIInputChange('bankDetails', {...piFormData.bankDetails, ifscCode: e.target.value})}
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg bg-orange-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Bank Name</label>
                      <select
                        value={piFormData.bankDetails.bankName}
                        onChange={(e) => handlePIInputChange('bankDetails', {...piFormData.bankDetails, bankName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="ICICI BANK">ICICI BANK</option>
                        <option value="HDFC BANK">HDFC BANK</option>
                        <option value="SBI">SBI</option>
                        <option value="AXIS BANK">AXIS BANK</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Branch (Separate Field)</label>
                      <input
                        type="text"
                        value={piFormData.bankDetails.branch}
                        onChange={(e) => handlePIInputChange('bankDetails', {...piFormData.bankDetails, branch: e.target.value})}
                        className="w-full px-3 py-2 border border-green-200 rounded-lg bg-green-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Bank Code (Separate Field)</label>
                      <input
                        type="text"
                        value={piFormData.bankDetails.bankCode}
                        onChange={(e) => handlePIInputChange('bankDetails', {...piFormData.bankDetails, bankCode: e.target.value})}
                        className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-purple-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end pt-6 border-t space-x-3">
                  <button 
                    type="button" 
                    onClick={() => setShowPIModal(false)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={handleSavePI}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Save PI
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* PI Preview Modal */}
      {showPIPreview && selectedLead && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">PI Preview - {selectedLead.name}</h3>
                <button 
                  onClick={() => setShowPIPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close PI Preview"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* PI Content */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-center">
                  <div className="bg-white shadow-2xl rounded-lg overflow-hidden border-2 border-gray-300 max-w-full" style={{width: '100%', maxWidth: '8.5in'}}>
                    <div id="pi-preview-content" className="transform scale-75 origin-top-left" style={{width: '133.33%'}}>
                      <MarketingCorporateStandardInvoice 
                        selectedBranch={piFormData.branch} 
                        companyBranches={companyBranches} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowPIPreview(false)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 border border-transparent rounded shadow-sm hover:bg-green-700 flex items-center gap-2"
                onClick={handlePIDownload}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PI Popup Modal */}
      {showPIPopup && piPopupData && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">PI Preview - {piPopupData.voucherNo}</h3>
                <button 
                  onClick={() => setShowPIPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close PI"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* PI Content */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-center">
                  <div className="bg-white shadow-2xl rounded-lg overflow-hidden border-2 border-gray-300 max-w-full" style={{width: '100%', maxWidth: '8.5in'}}>
                    <div id="pi-popup-content" className="transform scale-75 origin-top-left" style={{width: '133.33%'}}>
                      <MarketingCorporateStandardInvoice 
                        selectedBranch={piPopupData.branch} 
                        companyBranches={companyBranches}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowPIPopup(false)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 border border-transparent rounded shadow-sm hover:bg-green-700 flex items-center gap-2"
                onClick={() => {
                  const element = document.getElementById('pi-popup-content');
                  if (element) {
                    const opt = {
                      margin: [0.4, 0.4, 0.4, 0.4],
                      filename: `PI-${piPopupData.voucherNo}-${new Date().toISOString().split('T')[0]}.pdf`,
                      image: { type: 'jpeg', quality: 0.8 },
                      html2canvas: { 
                        scale: 1.1,
                        useCORS: true,
                        letterRendering: true,
                        allowTaint: true,
                        backgroundColor: '#ffffff'
                      },
                      jsPDF: { 
                        unit: 'in', 
                        format: 'a4', 
                        orientation: 'portrait',
                        compress: true,
                        putOnlyUsedFonts: true
                      }
                    };
                    html2pdf().set(opt).from(element).save();
                  } else {
                    alert('No PI content to download');
                  }
                }}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Payment</h3>
                <button
                  onClick={() => setShowAddPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                  <input
                    type="number"
                    name="amount"
                    value={paymentFormData.amount}
                    onChange={handlePaymentInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                  <select
                    name="paymentMethod"
                    value={paymentFormData.paymentMethod}
                    onChange={handlePaymentInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={paymentFormData.dueDate}
                    onChange={handlePaymentInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paid Date</label>
                  <input
                    type="date"
                    name="paidDate"
                    value={paymentFormData.paidDate}
                    onChange={handlePaymentInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                  <input
                    type="text"
                    name="reference"
                    value={paymentFormData.reference}
                    onChange={handlePaymentInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Payment reference"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={paymentFormData.status}
                    onChange={handlePaymentInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </form>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddPaymentModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPayment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingSalespersonLeads;
