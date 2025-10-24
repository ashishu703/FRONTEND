import React, { useRef, useState, useEffect } from 'react';
import { Search, Filter, Upload, RefreshCw, User, Mail, Building, Shield, Tag, Clock, Calendar, Phone, CheckCircle, XCircle, Hash, MapPin, Info, Plus, TrendingUp, Target, Users, BarChart3, ChevronDown, Download, UserPlus, X, Package, CreditCard, PhoneCall, FileText, Calendar as CalendarIcon, Edit, Eye, Navigation, Printer } from 'lucide-react';
import AddCustomerForm from '../salesperson/salespersonaddcustomer.jsx';
import MarketingQuotation from '../MarketingSalesperson/MarketingQuotation';
import { MarketingCorporateStandardInvoice } from '../MarketingSalesperson/MarketingProformaInvoice';

const MarketingLeads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewLead, setPreviewLead] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const fileInputRef = useRef(null);
  const [leadsData, setLeadsData] = useState(null);
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showImportDropdown, setShowImportDropdown] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedLeadForAssignment, setSelectedLeadForAssignment] = useState(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState(null);
  const [selectedLeadForView, setSelectedLeadForView] = useState(null);
  const [activeViewTab, setActiveViewTab] = useState('overview');
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [quotationData, setQuotationData] = useState(null);
  const [showProformaModal, setShowProformaModal] = useState(false);
  const [proformaData, setProformaData] = useState(null);
  const [showLeadImportModal, setShowLeadImportModal] = useState(false);
  const [leadImportData, setLeadImportData] = useState({
    customerName: '',
    mobileNumber: '',
    whatsappNumber: '',
    email: '',
    productName: '',
    gstNumber: '',
    address: '',
    state: '',
    productType: '',
    customerType: '',
    leadSource: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [importMode, setImportMode] = useState('csv'); // CSV import only
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [csvPreview, setCsvPreview] = useState([]);
  const [columnFilters, setColumnFilters] = useState({
    customerId: '',
    customer: '',
    email: '',
    business: '',
    leadSource: '',
    productName: '',
    category: '',
    salesStatus: '',
    createdAt: '',
    assigned: '',
    telecaller: '',
    telecallerStatus: '',
    paymentStatus: '',
    visitingStatus: '',
    gstNo: ''
  });

  // Available salespersons for assignment
  const salespersons = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.johnson@company.com', department: 'Sales' },
    { id: 2, name: 'David Lee', email: 'david.lee@company.com', department: 'Sales' },
    { id: 3, name: 'Anna Garcia', email: 'anna.garcia@company.com', department: 'Sales' },
    { id: 4, name: 'Chris Miller', email: 'chris.miller@company.com', department: 'Sales' },
    { id: 5, name: 'Alex Johnson', email: 'alex.johnson@company.com', department: 'Sales' },
    { id: 6, name: 'Lisa Chen', email: 'lisa.chen@company.com', department: 'Sales' },
    { id: 7, name: 'Mike Wilson', email: 'mike.wilson@company.com', department: 'Sales' },
    { id: 8, name: 'Emma Taylor', email: 'emma.taylor@company.com', department: 'Sales' }
  ];

  // Sample data for marketing leads
  const leads = [
    {
      id: 1,
      customerId: 'MKT-0001',
      customer: 'John Smith',
      email: 'john.smith@example.com',
      business: 'Tech Solutions Inc',
      leadSource: 'Website Inquiry',
      productName: 'Digital Marketing Package',
      category: 'Hot Lead',
      salesStatus: 'PENDING',
      createdAt: '2024-01-15',
      assigned: 'Sarah Johnson',
      telecaller: 'Mike Wilson',
      telecallerStatus: 'ACTIVE',
      paymentStatus: 'PENDING',
      visitingStatus: 'SCHEDULED',
      gstNo: '29ABCDE1234F1Z5'
    },
    {
      id: 2,
      customerId: 'MKT-0002',
      customer: 'Emily Davis',
      email: 'emily.davis@company.com',
      business: 'Marketing Agency',
      leadSource: 'Social Media',
      productName: 'SEO Services',
      category: 'Warm Lead',
      salesStatus: 'FOLLOW_UP',
      createdAt: '2024-01-16',
      assigned: 'David Lee',
      telecaller: 'Lisa Chen',
      telecallerStatus: 'ACTIVE',
      paymentStatus: 'IN_PROGRESS',
      visitingStatus: 'COMPLETED',
      gstNo: '27FGHIJ5678K2L6'
    },
    {
      id: 3,
      customerId: 'MKT-0003',
      customer: 'Robert Brown',
      email: 'robert.brown@business.com',
      business: 'Manufacturing Co',
      leadSource: 'Referral',
      productName: 'Content Marketing',
      category: 'Cold Lead',
      salesStatus: 'PENDING',
      createdAt: '2024-01-17',
      assigned: 'Anna Garcia',
      telecaller: 'Tom Davis',
      telecallerStatus: 'INACTIVE',
      paymentStatus: 'PENDING',
      visitingStatus: 'PENDING',
      gstNo: '24MNOPQ9012R3S7'
    },
    {
      id: 4,
      customerId: 'MKT-0004',
      customer: 'Maria Rodriguez',
      email: 'maria.rodriguez@enterprise.com',
      business: 'Enterprise Solutions',
      leadSource: 'Email Campaign',
      productName: 'PPC Advertising',
      category: 'Hot Lead',
      salesStatus: 'MEETING_SCHEDULED',
      createdAt: '2024-01-18',
      assigned: 'Chris Miller',
      telecaller: 'Emma Taylor',
      telecallerStatus: 'ACTIVE',
      paymentStatus: 'COMPLETED',
      visitingStatus: 'IN_PROGRESS',
      gstNo: '31TUVWX3456Y8Z9'
    },
    {
      id: 5,
      customerId: 'MKT-0005',
      customer: 'James Wilson',
      email: 'james.wilson@startup.com',
      business: 'Startup Ventures',
      leadSource: 'Trade Show',
      productName: 'Social Media Marketing',
      category: 'Warm Lead',
      salesStatus: 'PENDING',
      createdAt: '2024-01-19',
      assigned: 'Alex Johnson',
      telecaller: 'Sarah Smith',
      telecallerStatus: 'ACTIVE',
      paymentStatus: 'PENDING',
      visitingStatus: 'SCHEDULED',
      gstNo: '07ABCD1234E1F2'
    }
  ];

  // Sample quotation data
  const sampleQuotationData = {
    quotationNumber: 'ANO/25-26/458',
    quotationDate: new Date().toLocaleDateString(),
    validUpto: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    billTo: {
      business: 'Das Industrial Controls',
      address: 'Panvel, Maharashtra, India',
      phone: '7039542259',
      gstNo: '27DVTPS2973B1Z0',
      state: 'Maharashtra'
    },
    items: [
      {
        description: 'ACSR Dog Conductor',
        quantity: '120,000',
        unit: 'MTR',
        amount: 9840000,
        hsn: '76042910'
      },
      {
        description: 'AAAC Panther 232 SQMM',
        quantity: '120,000',
        unit: 'MTR',
        amount: 24600000,
        hsn: '85446090'
      }
    ],
    subtotal: 34440000,
    taxAmount: 6199200,
    total: 40639200
  };

  // Sample proforma invoice data
  const sampleProformaData = {
    invoiceNumber: 'PI-2024-001',
    invoiceDate: new Date().toLocaleDateString(),
    billTo: {
      business: 'Das Industrial Controls',
      address: 'Panvel, Maharashtra, India',
      phone: '7039542259',
      gstNo: '27DVTPS2973B1Z0',
      state: 'Maharashtra'
    },
    items: [
      {
        description: 'ACSR Dog Conductor',
        quantity: '120,000',
        unit: 'MTR',
        amount: 9840000,
        hsn: '76042910'
      },
      {
        description: 'AAAC Panther 232 SQMM',
        quantity: '120,000',
        unit: 'MTR',
        amount: 24600000,
        hsn: '85446090'
      }
    ],
    subtotal: 34440000,
    taxAmount: 6199200,
    total: 40639200
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead.id));
    }
  };

  const handleSelectLead = (leadId) => {
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    } else {
      setSelectedLeads([...selectedLeads, leadId]);
    }
  };

  const openPreview = (lead) => {
    setPreviewLead(lead);
    setShowPreview(true);
  };

  const openAssignmentModal = (lead) => {
    setSelectedLeadForAssignment(lead);
    setShowAssignmentModal(true);
  };

  const handleAssignLead = () => {
    if (selectedSalesperson && selectedLeadForAssignment) {
      // Update the lead's assigned salesperson
      const updatedLeads = leads.map(lead => 
        lead.id === selectedLeadForAssignment.id 
          ? { ...lead, assigned: selectedSalesperson }
          : lead
      );
      
      // In a real app, you would update the database here
      console.log(`Assigned lead ${selectedLeadForAssignment.customerId} to ${selectedSalesperson}`);
      
      // Close modal and reset state
      setShowAssignmentModal(false);
      setSelectedLeadForAssignment(null);
      setSelectedSalesperson('');
      
      // Show success message
      alert(`Lead ${selectedLeadForAssignment.customerId} has been assigned to ${selectedSalesperson}`);
    }
  };

  const closeAssignmentModal = () => {
    setShowAssignmentModal(false);
    setSelectedLeadForAssignment(null);
    setSelectedSalesperson('');
  };

  const openEditModal = (lead) => {
    setSelectedLeadForEdit(lead);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedLeadForEdit(null);
  };

  const openViewModal = (lead) => {
    setSelectedLeadForView(lead);
    setShowViewModal(true);
    setActiveViewTab('overview');
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedLeadForView(null);
    setActiveViewTab('overview');
  };

  const openLeadImportModal = () => {
    setShowLeadImportModal(true);
  };

  const closeLeadImportModal = () => {
    setShowLeadImportModal(false);
    setCsvFile(null);
    setCsvData([]);
    setCsvPreview([]);
    setLeadImportData({
      customerName: '',
      mobileNumber: '',
      whatsappNumber: '',
      email: '',
      productName: '',
      gstNumber: '',
      address: '',
      state: '',
      productType: '',
      customerType: '',
      leadSource: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleLeadImportInputChange = (field, value) => {
    setLeadImportData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLeadImportSubmit = (e) => {
    e.preventDefault();
    // Generate new customer ID
    const newId = Math.max(...leads.map(lead => parseInt(lead.customerId.split('-')[1]))) + 1;
    const newCustomerId = `MKT-${newId.toString().padStart(4, '0')}`;
    
    // Create new lead object
    const newLead = {
      id: leads.length + 1,
      customerId: newCustomerId,
      customer: leadImportData.customerName,
      email: leadImportData.email,
      business: leadImportData.customerType,
      leadSource: leadImportData.leadSource,
      productName: leadImportData.productName,
      category: 'Imported Lead',
      salesStatus: 'PENDING',
      createdAt: leadImportData.date,
      assigned: 'Unassigned',
      telecaller: 'Unassigned',
      telecallerStatus: 'INACTIVE',
      paymentStatus: 'PENDING',
      visitingStatus: 'PENDING',
      gstNo: leadImportData.gstNumber
    };
    
    // Add to leads array (in real app, this would be saved to database)
    console.log('New lead imported:', newLead);
    
    alert(`Lead imported successfully! Customer ID: ${newCustomerId}`);
    closeLeadImportModal();
  };

  const handleCsvFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      parseCsvFile(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const parseCsvFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const data = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });
      
      setCsvData(data);
      setCsvPreview(data.slice(0, 5)); // Show first 5 rows as preview
    };
    reader.readAsText(file);
  };

  const handleCsvImport = () => {
    if (csvData.length === 0) {
      alert('No data to import');
      return;
    }

    const importedLeads = csvData.map((row, index) => {
      const newId = Math.max(...leads.map(lead => parseInt(lead.customerId.split('-')[1]))) + index + 1;
      const newCustomerId = `MKT-${newId.toString().padStart(4, '0')}`;
      
      return {
        id: leads.length + index + 1,
        customerId: newCustomerId,
        customer: row.customerName || row.customer_name || '',
        email: row.email || '',
        business: row.customerType || row.customer_type || row.business || '',
        leadSource: row.leadSource || row.lead_source || row.enquiryBy || '',
        productName: row.productName || row.product_name || '',
        category: 'Imported Lead',
        salesStatus: 'PENDING',
        createdAt: row.date || new Date().toISOString().split('T')[0],
        assigned: 'Unassigned',
        telecaller: 'Unassigned',
        telecallerStatus: 'INACTIVE',
        paymentStatus: 'PENDING',
        visitingStatus: 'PENDING',
        gstNo: row.gstNumber || row.gst_number || ''
      };
    });

    console.log('CSV leads imported:', importedLeads);
    alert(`${importedLeads.length} leads imported successfully!`);
    closeLeadImportModal();
  };

  const downloadCsvTemplate = () => {
    const headers = [
      'customerName',
      'mobileNumber', 
      'whatsappNumber',
      'email',
      'productName',
      'gstNumber',
      'address',
      'state',
      'productType',
      'customerType',
      'leadSource',
      'date'
    ];
    
    const csvContent = headers.join(',') + '\n' +
      'John Doe,9876543210,9876543210,john@example.com,Digital Marketing,29ABCDE1234F1Z5,123 Main St,Madhya Pradesh,Conductor,Individual,Website,2024-01-20';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lead_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!showPreview) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setShowPreview(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showPreview]);

  const getStatusBadge = (status, type) => {
    const baseClasses = "inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium min-w-[120px]";
    
    const formatStatus = (status) => {
      return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };
    
    switch (type) {
      case 'sales':
        return (
          <span className={`${baseClasses} ${
            status === 'PENDING' 
              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              : status === 'FOLLOW_UP'
              ? 'bg-blue-100 text-blue-800 border border-blue-200'
              : status === 'MEETING_SCHEDULED'
              ? 'bg-purple-100 text-purple-800 border border-purple-200'
              : 'bg-green-100 text-green-800 border border-green-200'
          }`}>
            {formatStatus(status)}
          </span>
        );
      case 'telecaller':
        return (
          <span className={`${baseClasses} ${
            status === 'ACTIVE' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {formatStatus(status)}
          </span>
        );
      case 'payment':
        return (
          <span className={`${baseClasses} ${
            status === 'COMPLETED' 
              ? 'bg-green-100 text-green-800 border border-green-200'
              : status === 'IN_PROGRESS'
              ? 'bg-blue-100 text-blue-800 border border-blue-200'
              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
          }`}>
            {formatStatus(status)}
          </span>
        );
      case 'visiting':
        return (
          <span className={`${baseClasses} ${
            status === 'COMPLETED' 
              ? 'bg-green-100 text-green-800 border border-green-200'
              : status === 'IN_PROGRESS'
              ? 'bg-blue-100 text-blue-800 border border-blue-200'
              : status === 'SCHEDULED'
              ? 'bg-purple-100 text-purple-800 border border-purple-200'
              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
          }`}>
            {formatStatus(status)}
          </span>
        );
      default:
        return <span className={baseClasses}>{formatStatus(status)}</span>;
    }
  };

  const importedLeads = Array.isArray(leadsData) && leadsData.length > 0 ? leadsData : leads;

  const matchesGlobal = (lead) => {
    if (!searchTerm) return true;
    const t = searchTerm.toLowerCase();
    return (
      (lead.customer || '').toLowerCase().includes(t) ||
      (lead.email || '').toLowerCase().includes(t) ||
      (lead.business || '').toLowerCase().includes(t)
    );
  };

  const matchesColumnFilters = (lead) => {
    const cf = columnFilters;
    const includes = (val, q) => String(val || '').toLowerCase().includes(String(q || '').toLowerCase());
    return (
      (!cf.customerId || includes(lead.customerId, cf.customerId)) &&
      (!cf.customer || includes(lead.customer, cf.customer)) &&
      (!cf.email || includes(lead.email, cf.email)) &&
      (!cf.business || includes(lead.business, cf.business)) &&
      (!cf.leadSource || includes(lead.leadSource, cf.leadSource)) &&
      (!cf.productName || includes(lead.productName, cf.productName)) &&
      (!cf.category || includes(lead.category, cf.category)) &&
      (!cf.salesStatus || includes(lead.salesStatus, cf.salesStatus)) &&
      (!cf.createdAt || includes(lead.createdAt, cf.createdAt)) &&
      (!cf.assigned || includes(lead.assigned, cf.assigned)) &&
      (!cf.telecaller || includes(lead.telecaller, cf.telecaller)) &&
      (!cf.telecallerStatus || includes(lead.telecallerStatus, cf.telecallerStatus)) &&
      (!cf.paymentStatus || includes(lead.paymentStatus, cf.paymentStatus)) &&
      (!cf.visitingStatus || includes(lead.visitingStatus, cf.visitingStatus)) &&
      (!cf.gstNo || includes(lead.gstNo, cf.gstNo))
    );
  };

  const filteredLeads = importedLeads.filter(lead => matchesGlobal(lead) && matchesColumnFilters(lead));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}

      {/* Search and Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          {/* Left: Search */}
          <div className="flex items-center gap-3 w-full max-w-xl">
            <div className="relative w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, or business..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-1.5 rounded-full bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-inner"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3">
            <button
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 text-base"
              onClick={() => setShowColumnFilters(!showColumnFilters)}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              onClick={() => setShowAddCustomer(true)}
            >
              <Plus className="w-4 h-4" />
              <span>Add leads</span>
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
              onClick={openLeadImportModal}
            >
              <Upload className="w-4 h-4" />
              <span>Lead Import</span>
            </button>
            <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" onClick={() => setLeadsData(null)}>
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-purple-600" />
                    <span>Salesperson ID</span>
                  </div>
                  {showColumnFilters && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Filter by ID..."
                        value={columnFilters.customerId}
                        onChange={(e) => setColumnFilters(prev => ({ ...prev, customerId: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Salesperson</span>
                  </div>
                  {showColumnFilters && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Filter by name..."
                        value={columnFilters.customer}
                        onChange={(e) => setColumnFilters(prev => ({ ...prev, customer: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-indigo-600" />
                    <span>Business</span>
                  </div>
                  {showColumnFilters && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Filter by business..."
                        value={columnFilters.business}
                        onChange={(e) => setColumnFilters(prev => ({ ...prev, business: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-orange-600" />
                    <span>Lead Source</span>
                  </div>
                  {showColumnFilters && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Filter by source..."
                        value={columnFilters.leadSource}
                        onChange={(e) => setColumnFilters(prev => ({ ...prev, leadSource: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-purple-600" />
                    <span>Product Name</span>
                  </div>
                  {showColumnFilters && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Filter by product..."
                        value={columnFilters.productName}
                        onChange={(e) => setColumnFilters(prev => ({ ...prev, productName: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-pink-600" />
                    <span>Category</span>
                  </div>
                  {showColumnFilters && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Filter by category..."
                        value={columnFilters.category}
                        onChange={(e) => setColumnFilters(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Assigned Salesperson</span>
                  </div>
                  {showColumnFilters && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Filter by assigned..."
                        value={columnFilters.assigned}
                        onChange={(e) => setColumnFilters(prev => ({ ...prev, assigned: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>Visiting Status</span>
                  </div>
                  {showColumnFilters && (
                    <div className="mt-2">
                      <select
                        value={columnFilters.visitingStatus}
                        onChange={(e) => setColumnFilters(prev => ({ ...prev, visitingStatus: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Status</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="PENDING">Pending</option>
                      </select>
                    </div>
                  )}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Payment Status</span>
                  </div>
                  {showColumnFilters && (
                    <div className="mt-2">
                      <select
                        value={columnFilters.paymentStatus}
                        onChange={(e) => setColumnFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                  )}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Sales Status</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-red-600" />
                    <span>GST No</span>
                  </div>
                  {showColumnFilters && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Filter by GST..."
                        value={columnFilters.gstNo}
                        onChange={(e) => setColumnFilters(prev => ({ ...prev, gstNo: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-indigo-600" />
                    <span>Created</span>
                  </div>
                  {showColumnFilters && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Filter by date..."
                        value={columnFilters.createdAt}
                        onChange={(e) => setColumnFilters(prev => ({ ...prev, createdAt: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 text-base text-gray-700">{lead.customerId}</td>
                  <td className="px-6 py-5 text-base text-gray-900">
                    <div>
                      <div className="font-medium text-gray-900">{lead.customer}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-base text-gray-900">{lead.business}</td>
                  <td className="px-6 py-5 text-base text-gray-900">{lead.leadSource}</td>
                  <td className="px-6 py-5 text-base text-gray-900">{lead.productName}</td>
                  <td className="px-6 py-5 text-base text-gray-900">{lead.category}</td>
                  <td className="px-6 py-5 text-base text-gray-900">{lead.assigned}</td>
                  <td className="px-4 py-4">{getStatusBadge(lead.visitingStatus, 'visiting')}</td>
                  <td className="px-4 py-4">{getStatusBadge(lead.paymentStatus, 'payment')}</td>
                  <td className="px-4 py-4">{getStatusBadge(lead.salesStatus, 'sales')}</td>
                  <td className="px-6 py-5 text-base text-gray-700">{lead.gstNo}</td>
                  <td className="px-6 py-5 text-base text-gray-700">{lead.createdAt}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        className="w-6 h-6 flex items-center justify-center text-xs font-semibold text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors"
                        title="View Lead Details"
                        onClick={() => openViewModal(lead)}
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        className="w-6 h-6 flex items-center justify-center text-xs font-semibold text-orange-600 border border-orange-200 rounded-full hover:bg-orange-50 transition-colors"
                        title="Edit Lead"
                        onClick={() => openEditModal(lead)}
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add leads Modal */}
      {showAddCustomer && (
        <AddCustomerForm 
          onClose={() => setShowAddCustomer(false)} 
          onSave={(formData) => {
            // Create new lead object with proper structure
            const newLead = {
              id: Date.now(), // Generate unique ID
              customerId: `MKT-${String(Date.now()).slice(-4)}`,
              customer: formData.customerName,
              email: formData.email || 'N/A',
              business: formData.customerName, // Using customer name as business
              leadSource: formData.leadSource,
              productName: formData.productName,
              category: 'New Lead',
              salesStatus: 'PENDING',
              createdAt: formData.date,
              assigned: 'Unassigned',
              telecaller: 'Unassigned',
              telecallerStatus: 'PENDING',
              paymentStatus: 'PENDING',
              visitingStatus: 'NOT_SCHEDULED',
              gstNo: formData.gstNumber || 'N/A',
              phone: formData.mobileNumber,
              whatsapp: formData.whatsappNumber ? `+91${formData.whatsappNumber}` : 'N/A',
              address: formData.address,
              state: formData.state,
              productType: formData.productType,
              customerType: formData.customerType,
              assignedSalesperson: formData.assignedSalesperson || 'Unassigned'
            };
            
            // Update leads data
            setLeadsData(prevData => {
              const currentData = Array.isArray(prevData) ? prevData : leads;
              return [...currentData, newLead];
            });
            
            setShowAddCustomer(false);
          }}
        />
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Assign Lead to Salesperson</h3>
                <button
                  onClick={closeAssignmentModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {selectedLeadForAssignment && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Lead Details:</p>
                  <p className="font-medium text-gray-900">{selectedLeadForAssignment.customerId} - {selectedLeadForAssignment.customer}</p>
                  <p className="text-sm text-gray-600">{selectedLeadForAssignment.business}</p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Salesperson
                </label>
                <select
                  value={selectedSalesperson}
                  onChange={(e) => setSelectedSalesperson(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a salesperson...</option>
                  {salespersons.map((salesperson) => (
                    <option key={salesperson.id} value={salesperson.name}>
                      {salesperson.name} - {salesperson.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeAssignmentModal}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignLead}
                  disabled={!selectedSalesperson}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Assign Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedLeadForView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Lead Details - {selectedLeadForView.customerId}</h3>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveViewTab('overview')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeViewTab === 'overview'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveViewTab('payment')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeViewTab === 'payment'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Payment Status
                </button>
                <button
                  onClick={() => setActiveViewTab('meetings')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeViewTab === 'meetings'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Visits/Meetings
                </button>
              </div>

              {/* Tab Content */}
              {activeViewTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                      <div className="space-y-2">
                        <p><span className="font-medium">Name:</span> {selectedLeadForView.customer}</p>
                        <p><span className="font-medium">Email:</span> {selectedLeadForView.email}</p>
                        <p><span className="font-medium">Business:</span> {selectedLeadForView.business}</p>
                        <p><span className="font-medium">GST No:</span> {selectedLeadForView.gstNo}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Lead Information</h4>
                      <div className="space-y-2">
                        <p><span className="font-medium">Lead Source:</span> {selectedLeadForView.leadSource}</p>
                        <p><span className="font-medium">Product:</span> {selectedLeadForView.productName}</p>
                        <p><span className="font-medium">Category:</span> {selectedLeadForView.category}</p>
                        <p><span className="font-medium">Created:</span> {selectedLeadForView.createdAt}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Assignment</h4>
                      <p><span className="font-medium">Assigned to:</span> {selectedLeadForView.assigned}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Status</h4>
                      <div className="space-y-2">
                        <p><span className="font-medium">Sales Status:</span> {getStatusBadge(selectedLeadForView.salesStatus, 'sales')}</p>
                        <p><span className="font-medium">Visiting Status:</span> {getStatusBadge(selectedLeadForView.visitingStatus, 'visiting')}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Telecaller</h4>
                      <p><span className="font-medium">Telecaller:</span> {selectedLeadForView.telecaller}</p>
                      <p><span className="font-medium">Status:</span> {getStatusBadge(selectedLeadForView.telecallerStatus, 'telecaller')}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeViewTab === 'payment' && (
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-6">Payment Overview</h4>
                    
                    {/* Payment Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Total Amount</span>
                          <span className="text-lg font-bold text-gray-900">₹25,000</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          {getStatusBadge(selectedLeadForView.paymentStatus, 'payment')}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Paid Amount</span>
                          <span className="text-lg font-bold text-green-600">₹10,000</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Method</span>
                          <span className="text-sm text-gray-900">Bank Transfer</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Pending Amount</span>
                          <span className="text-lg font-bold text-orange-600">₹15,000</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Due Date</span>
                          <span className="text-sm text-gray-900">2024-02-15</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment History */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-4">Payment History</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="font-medium text-gray-900">Initial Payment</p>
                              <p className="text-sm text-gray-600">Completed on 2024-01-15</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">₹10,000</p>
                            <p className="text-sm text-gray-600">Bank Transfer</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div>
                              <p className="font-medium text-gray-900">Second Payment</p>
                              <p className="text-sm text-gray-600">Due on 2024-02-15</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-orange-600">₹15,000</p>
                            <p className="text-sm text-gray-600">Pending</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Quotation Section */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-3">Active Quotation</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <span className="text-sm font-medium text-gray-900">Quotation #{sampleQuotationData.quotationNumber}</span>
                          <p className="text-sm text-gray-600">Digital Marketing Package - Premium Plan</p>
                        </div>
                        <span className="text-sm font-medium text-green-600">₹{sampleQuotationData.total.toLocaleString()} - Active</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <span className="text-sm text-gray-600">Valid Until: {sampleQuotationData.validUpto}</span>
                          <p className="text-sm text-gray-600">Prepared by: Sarah Johnson</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setQuotationData(sampleQuotationData);
                              setShowQuotationModal(true);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            View Quotation
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Proforma Invoice Section */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-3">Proforma Invoice</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <span className="text-sm font-medium text-gray-900">Invoice #PI-2024-001</span>
                          <p className="text-sm text-gray-600">Electrical Cables & Wires Supply</p>
                        </div>
                        <span className="text-sm font-medium text-blue-600">₹{sampleQuotationData.total.toLocaleString()} - Generated</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <span className="text-sm text-gray-600">Invoice Date: {sampleQuotationData.quotationDate}</span>
                          <p className="text-sm text-gray-600">Generated by: David Lee</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setProformaData(sampleProformaData);
                              setShowProformaModal(true);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            View Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeViewTab === 'meetings' && (
                <div className="space-y-6">
                  {/* Site Visit Summary and Lead Performance - Side by Side */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Site Visit Summary */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Site Visit Summary</h4>
                      
                      {/* Next Visit - Simplified */}
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Next Visit</p>
                            <p className="text-sm text-gray-600">25 Jan 2024, 2:00 PM</p>
                          </div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            Scheduled
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">{selectedLeadForView?.assigned || 'Unassigned'}</span> • Follow-up
                        </div>
                      </div>
                    </div>

                    {/* Lead-Specific Performance */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Lead Performance</h4>
                          <p className="text-sm text-gray-600">Performance metrics for this specific lead</p>
                        </div>
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-semibold text-gray-900">{selectedLeadForView?.assigned || 'No Assigned Salesperson'}</h5>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              active
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600">Lead Status:</span>
                              <span className="ml-2 font-medium text-gray-900">{selectedLeadForView?.salesStatus || 'Pending'}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Visit Status:</span>
                              <span className="ml-2 font-medium text-gray-900">{selectedLeadForView?.visitingStatus || 'Not Scheduled'}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Payment Status:</span>
                              <span className="ml-2 font-medium text-gray-900">{selectedLeadForView?.paymentStatus || 'Pending'}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Lead Category:</span>
                              <span className="ml-2 font-medium text-gray-900">{selectedLeadForView?.category || 'Uncategorized'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visit Tracking Map */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Visit Tracking Map</h4>
                        <p className="text-sm text-gray-600">Track salesperson locations and routes</p>
                      </div>
                      <Navigation className="w-6 h-6 text-green-600" />
                    </div>
                    
                    <div className="relative">
                      <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">Interactive map will be displayed here</p>
                          <p className="text-sm text-gray-500">Integration with Google Maps API required</p>
                        </div>
                      </div>
                      
                      {/* Live tracking indicator */}
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        Live Tracking
                      </div>
                    </div>
                    
                    {/* Salesperson list with live status */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="font-medium text-gray-900">{selectedLeadForView?.assigned || 'No assigned salesperson'}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Distance: 0 KM
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Meeting History */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-3">Meeting History</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <span className="text-sm font-medium text-gray-900">Initial Discussion</span>
                          <p className="text-xs text-gray-600">2024-01-15 at 10:00 AM</p>
                        </div>
                        <span className="text-sm font-medium text-green-600">Completed</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <span className="text-sm font-medium text-gray-900">Product Demo</span>
                          <p className="text-xs text-gray-600">2024-01-20 at 3:00 PM</p>
                        </div>
                        <span className="text-sm font-medium text-green-600">Completed</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <div>
                          <span className="text-sm font-medium text-gray-900">Follow-up Meeting</span>
                          <p className="text-xs text-gray-600">2024-01-25 at 2:00 PM</p>
                        </div>
                        <span className="text-sm font-medium text-blue-600">Scheduled</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedLeadForEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Edit Lead - {selectedLeadForEdit.customerId}</h3>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Customer Information Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                      <input
                        type="text"
                        defaultValue={selectedLeadForEdit.customerId}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                      <input
                        type="text"
                        defaultValue={selectedLeadForEdit.customer}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue={selectedLeadForEdit.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business</label>
                      <input
                        type="text"
                        defaultValue={selectedLeadForEdit.business}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GST No</label>
                      <input
                        type="text"
                        defaultValue={selectedLeadForEdit.gstNo}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                      <input
                        type="date"
                        defaultValue={selectedLeadForEdit.createdAt}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Lead Information Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Lead Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
                      <select
                        defaultValue={selectedLeadForEdit.leadSource}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Website Inquiry">Website Inquiry</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Referral">Referral</option>
                        <option value="Email Campaign">Email Campaign</option>
                        <option value="Trade Show">Trade Show</option>
                        <option value="Cold Call">Cold Call</option>
                        <option value="Advertisement">Advertisement</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                      <input
                        type="text"
                        defaultValue={selectedLeadForEdit.productName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        defaultValue={selectedLeadForEdit.category}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Hot Lead">Hot Lead</option>
                        <option value="Warm Lead">Warm Lead</option>
                        <option value="Cold Lead">Cold Lead</option>
                        <option value="Qualified Lead">Qualified Lead</option>
                        <option value="Unqualified Lead">Unqualified Lead</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sales Status</label>
                      <select
                        defaultValue={selectedLeadForEdit.salesStatus}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="FOLLOW_UP">Follow Up</option>
                        <option value="MEETING_SCHEDULED">Meeting Scheduled</option>
                        <option value="QUOTATION_SENT">Quotation Sent</option>
                        <option value="NEGOTIATION">Negotiation</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="LOST">Lost</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Assignment Information Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Assignment Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Salesperson</label>
                      <select
                        defaultValue={selectedLeadForEdit.assigned}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Sarah Johnson">Sarah Johnson</option>
                        <option value="David Lee">David Lee</option>
                        <option value="Anna Garcia">Anna Garcia</option>
                        <option value="Chris Miller">Chris Miller</option>
                        <option value="Alex Johnson">Alex Johnson</option>
                        <option value="Lisa Chen">Lisa Chen</option>
                        <option value="Mike Wilson">Mike Wilson</option>
                        <option value="Emma Taylor">Emma Taylor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telecaller</label>
                      <select
                        defaultValue={selectedLeadForEdit.telecaller}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Mike Wilson">Mike Wilson</option>
                        <option value="Lisa Chen">Lisa Chen</option>
                        <option value="Tom Davis">Tom Davis</option>
                        <option value="Emma Taylor">Emma Taylor</option>
                        <option value="Sarah Smith">Sarah Smith</option>
                        <option value="John Doe">John Doe</option>
                        <option value="Jane Smith">Jane Smith</option>
                        <option value="Bob Johnson">Bob Johnson</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Status Information Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Visiting Status</label>
                      <select
                        defaultValue={selectedLeadForEdit.visitingStatus}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                      <select
                        defaultValue={selectedLeadForEdit.paymentStatus}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="PARTIAL">Partial</option>
                        <option value="OVERDUE">Overdue</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telecaller Status</label>
                      <select
                        defaultValue={selectedLeadForEdit.telecallerStatus}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="BUSY">Busy</option>
                        <option value="NOT_AVAILABLE">Not Available</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Lead updated successfully!');
                    closeEditModal();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lead Import Modal */}
      {showLeadImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Import New Lead</h3>
                <button
                  onClick={closeLeadImportModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* CSV Import Section */}
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">CSV Import Instructions</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload a CSV file with the same fields as the Add leads form. Download the template below for the correct format.
                  </p>
                  <button
                    onClick={downloadCsvTemplate}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download CSV Template
                  </button>
                </div>

                {/* CSV File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select CSV File</label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* CSV Preview */}
                {csvPreview.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Data Preview ({csvData.length} records)</h4>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            {Object.keys(csvPreview[0] || {}).map((key, index) => (
                              <th key={index} className="text-left py-2 px-2 font-medium text-gray-700">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {csvPreview.map((row, index) => (
                            <tr key={index} className="border-b border-gray-100">
                              {Object.values(row).map((value, cellIndex) => (
                                <td key={cellIndex} className="py-2 px-2 text-gray-600">
                                  {value}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* CSV Import Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeLeadImportModal}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCsvImport}
                    disabled={csvData.length === 0}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Import {csvData.length} Leads
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Modal */}
      {showQuotationModal && quotationData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Quotation - {quotationData.quotationNumber}</h3>
                <button
                  onClick={() => setShowQuotationModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <MarketingQuotation 
                selectedBranch="ANODE"
                companyBranches={{
                  ANODE: {
                    name: 'ANODE ELECTRIC PRIVATE LIMITED',
                    gstNumber: '(23AANCA7455R1ZX)',
                    description: 'MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES.',
                    address: 'KHASRA NO. 805/5, PLOT NO. 10, IT PARK, BARGI HILLS, JABALPUR - 482003, MADHYA PRADESH, INDIA.',
                    tel: '6262002116, 6262002113',
                    web: 'www.anocab.com',
                    email: 'info@anocab.com'
                  }
                }}
              />
              
              {/* Accept/Reject Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Valid Until: {quotationData?.validUpto || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        alert('Quotation rejected successfully!');
                        setShowQuotationModal(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject Quotation
                    </button>
                    <button
                      onClick={() => {
                        alert('Quotation accepted successfully!');
                        setShowQuotationModal(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept Quotation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proforma Invoice Modal */}
      {showProformaModal && proformaData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Proforma Invoice - {proformaData.invoiceNumber}</h3>
                <button
                  onClick={() => setShowProformaModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <MarketingCorporateStandardInvoice 
                selectedBranch="ANODE"
                companyBranches={{
                  ANODE: {
                    name: 'ANODE ELECTRIC PRIVATE LIMITED',
                    gstNumber: '(23AANCA7455R1ZX)',
                    description: 'MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES.',
                    address: 'KHASRA NO. 805/5, PLOT NO. 10, IT PARK, BARGI HILLS, JABALPUR - 482003, MADHYA PRADESH, INDIA.',
                    tel: '6262002116, 6262002113',
                    web: 'www.anocab.com',
                    email: 'info@anocab.com'
                  }
                }}
              />
              
              {/* Accept/Reject Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Generated
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Invoice Date: {proformaData?.invoiceDate || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        alert('Proforma Invoice rejected successfully!');
                        setShowProformaModal(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject Invoice
                    </button>
                    <button
                      onClick={() => {
                        alert('Proforma Invoice accepted successfully!');
                        setShowProformaModal(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination or Empty State */}
      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No leads found</div>
          <div className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</div>
        </div>
      )}
    </div>
  );
};

export default MarketingLeads;
