import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, Upload, RefreshCw, Edit, Eye, 
  Hash, User, Mail, Building, Shield, Tag, Clock, Settings,
  Calendar, CheckCircle, XCircle, Download, FileText, Phone
} from 'lucide-react';
import AddCustomerModal from './AddCustomerModal';
import departmentHeadService from '../../api/admin_api/departmentHeadService';
import departmentUserService from '../../api/admin_api/departmentUserService';
import apiErrorHandler from '../../utils/ApiErrorHandler';
import toastManager from '../../utils/ToastManager';

const LeadsSimplified = () => {
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [importing, setImporting] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewLead, setPreviewLead] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [editFormData, setEditFormData] = useState({
    customer: '',
    email: '',
    business: '',
    leadSource: '',
    category: '',
    salesStatus: '',
    phone: '',
    gstNo: '',
    productNames: '',
    assignedSalesperson: '',
    assignedTelecaller: '',
    telecallerStatus: '',
    paymentStatus: ''
  });
  const [usernames, setUsernames] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const importFileInputRef = useRef(null);

  const downloadCSVTemplate = () => {
    const headers = [
      'Customer Name',
      'Mobile Number', 
      'WhatsApp Number',
      'Email',
      'GST Number',
      'Business Name',
      'Business Category',
      'Lead Source',
      'Product Names (comma separated)',
      'Assigned Salesperson',
      'Assigned Telecaller',
      'Address',
      'State',
      'Date (YYYY-MM-DD)'
    ];
    
    const csvContent = headers.join(',') + '\n' + 
      'Sample Customer,9876543210,9876543210,sample@email.com,22ABCDE1234F1Z5,Sample Business,dealer,instagram,ACSR AAAC,John Doe,Jane Smith,123 Main St,Delhi,2024-01-15\n' +
      'Another Customer,9876543211,9876543211,another@email.com,22ABCDE1234F1Z6,Another Business,contractor,facebook,AB CABLE AAAC,Jane Doe,John Smith,456 Main St,Mumbai,2024-01-16';
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'leads_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toastManager.success('CSV template downloaded successfully');
  };

  // Parse CSV file
  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        data.push(row);
      }
    }
    return data;
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setImportFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target.result;
        const parsedData = parseCSV(csvText);
        setImportPreview(parsedData);
        setShowImportModal(true);
      };
      reader.readAsText(file);
    } else {
      toastManager.error('Please select a valid CSV file');
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toISOString().split('T')[0];
    
    // Handle different date formats
    if (dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        // If it's DD-MM-YYYY format, convert to YYYY-MM-DD
        if (parts[0].length === 2 && parts[2].length === 4) {
          return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        // If it's already YYYY-MM-DD format, return as is
        if (parts[0].length === 4 && parts[1].length === 2 && parts[2].length === 2) {
          return dateString;
        }
      }
    }
    
    // If it's a valid date string, try to parse it
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {
      console.warn('Invalid date format:', dateString);
    }
    
    // Fallback to current date
    return new Date().toISOString().split('T')[0];
  };

  // Import leads from CSV
  const handleImportLeads = async () => {
    if (importPreview.length === 0) {
      toastManager.error('No data to import');
      return;
    }

    setImporting(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const row of importPreview) {
        try {
          const leadData = {
            customer: row['Customer Name'] || null,
            phone: row['Mobile Number'] || null,
            email: row['Email'] || null,
            business: row['Business Name'] || null,
            leadSource: row['Lead Source'] || null,
            category: row['Business Category'] || 'N/A',
            salesStatus: 'PENDING',
            gstNo: row['GST Number'] || null,
            productNames: row['Product Names (comma separated)'] || 'N/A',
            address: row['Address'] || null,
            state: row['State'] || null,
            assignedSalesperson: row['Assigned Salesperson'] || null,
            assignedTelecaller: row['Assigned Telecaller'] || null,
            whatsapp: row['WhatsApp Number'] || row['Mobile Number'] || null,
            date: formatDate(row['Date (YYYY-MM-DD)']),
            createdAt: new Date().toISOString().split('T')[0],
            telecallerStatus: 'INACTIVE',
            paymentStatus: 'PENDING',
            connectedStatus: 'pending',
            finalStatus: 'open',
            customerType: 'business'
          };

          await departmentHeadService.createLead(leadData);
          successCount++;
        } catch (error) {
          console.error('Error importing lead:', error);
          errorCount++;
        }
      }

      // Refresh leads data
      const response = await departmentHeadService.getAllLeads();
      if (response && response.data) {
        const transformedData = transformApiData(response.data);
        setLeadsData(transformedData);
      }

      toastManager.success(`Import completed! ${successCount} leads imported successfully, ${errorCount} failed`);
      setShowImportModal(false);
      setImportPreview([]);
      setImportFile(null);
    } catch (error) {
      apiErrorHandler.handleError(error, 'import leads');
    } finally {
      setImporting(false);
    }
  };

  // Transform API data to frontend format
  const transformApiData = (apiData) => {
    return apiData.map(lead => ({
      id: lead.id,
      customerId: lead.customer_id,
      customer: lead.customer,
      email: lead.email,
      business: lead.business,
      leadSource: lead.lead_source,
      productNamesText: lead.product_names,
      category: lead.category,
      salesStatus: lead.sales_status,
      createdAt: lead.created,
      assignedSalesperson: lead.assigned_salesperson,
      assignedTelecaller: lead.assigned_telecaller,
      telecallerStatus: lead.telecaller_status,
      paymentStatus: lead.payment_status,
      phone: lead.phone,
      address: lead.address,
      gstNo: lead.gst_no,
      state: lead.state,
      customerType: lead.customer_type,
      date: lead.date,
      connectedStatus: lead.connected_status,
      finalStatus: lead.final_status,
      whatsapp: lead.whatsapp,
      createdBy: lead.created_by,
      created_at: lead.created_at,
      updated_at: lead.updated_at
    }));
  };

  // Fetch leads when page, limit, or search changes
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const params = { page, limit };
        if (searchTerm && searchTerm.trim() !== '') {
          params.search = searchTerm.trim();
        }
        const response = await departmentHeadService.getAllLeads(params);
        if (response && response.data) {
          const transformedData = transformApiData(response.data);
          setLeadsData(transformedData);
          if (response.pagination) {
            setTotal(Number(response.pagination.total) || 0);
          }
        }
      } catch (error) {
        apiErrorHandler.handleError(error, 'fetch leads');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [page, limit, searchTerm]);

  // Load department usernames when edit modal opens
  useEffect(() => {
    if (!showEditModal) return;
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        setUsersError('');
        const res = await departmentUserService.listUsers({ page: 1, limit: 100 });
        const payload = res.data || res;
        const names = (payload.users || []).map(u => u.username).filter(Boolean);
        setUsernames(names);
      } catch (err) {
        setUsersError(err?.message || 'Failed to load users');
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [showEditModal]);

  // Filter leads based on search
  const filteredLeads = leadsData.filter(lead => {
    const matchesSearch = !searchTerm || 
      lead.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.business?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Handle customer creation
  const handleCustomerSave = async (customerData) => {
    try {
      setLoading(true);
      const newCustomer = {
        customer: customerData.customerName || null,
        phone: customerData.mobileNumber || null,
        email: customerData.email || null,
        business: customerData.businessType || null,
        leadSource: customerData.leadSource || null,
        category: customerData.businessCategory || 'N/A',
        salesStatus: 'PENDING',
        gstNo: customerData.gstNumber || null,
        productNames: Array.isArray(customerData.productNames) ? customerData.productNames.join(', ') : (customerData.productNames || 'N/A'),
        address: customerData.address || null,
        state: customerData.state || null,
        assignedSalesperson: customerData.assignedSalesperson || null,
        assignedTelecaller: customerData.assignedTelecaller || null,
        whatsapp: customerData.whatsappNumber || customerData.mobileNumber || null,
        date: customerData.date || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
        telecallerStatus: 'INACTIVE',
        paymentStatus: 'PENDING',
        connectedStatus: 'pending',
        finalStatus: 'open',
        customerType: 'business'
      };

      const resp = await departmentHeadService.createLead(newCustomer);
      
      if (resp && resp.data) {
        const transformedLead = transformApiData([resp.data])[0];
        
        // Always update the leads data with new lead
        setLeadsData(prevLeads => {
          if (prevLeads && prevLeads.length > 0) {
            return [...prevLeads, transformedLead];
          } else {
            return [transformedLead];
          }
        });
        
        toastManager.success('Customer created successfully');
        setShowAddCustomer(false);
        
        // Force refresh the leads data
        setTimeout(async () => {
          try {
            const params = { page, limit };
            if (searchTerm && searchTerm.trim() !== '') {
              params.search = searchTerm.trim();
            }
            const response = await departmentHeadService.getAllLeads(params);
            if (response && response.data) {
              const transformedData = transformApiData(response.data);
              setLeadsData(transformedData);
              if (response.pagination) {
                setTotal(Number(response.pagination.total) || 0);
              }
            }
          } catch (error) {
            console.error('Error refreshing leads:', error);
          }
        }, 100);
      }
    } catch (error) {
      apiErrorHandler.handleError(error, 'create customer');
    } finally {
      setLoading(false);
    }
  };


  // Handle edit
  const handleEdit = (lead) => {
    setEditingLead(lead);
    setEditFormData({
      customer: lead.customer || '',
      email: lead.email || '',
      business: lead.business || '',
      leadSource: lead.leadSource || '',
      category: lead.category || '',
      salesStatus: lead.salesStatus || '',
      phone: lead.phone || '',
      gstNo: lead.gstNo || '',
      productNames: lead.productNamesText || '',
      assignedSalesperson: lead.assignedSalesperson || '',
      assignedTelecaller: lead.assignedTelecaller || '',
      telecallerStatus: lead.telecallerStatus || '',
      paymentStatus: lead.paymentStatus || ''
    });
    setShowEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    try {
      if (editingLead && editingLead.id) {
        const apiPayload = {
          customer: editFormData.customer,
          email: editFormData.email,
          business: editFormData.business,
          leadSource: editFormData.leadSource,
          category: editFormData.category,
          salesStatus: editFormData.salesStatus,
          phone: editFormData.phone,
          gstNo: editFormData.gstNo,
          productNames: editFormData.productNames,
          assignedSalesperson: editFormData.assignedSalesperson,
          assignedTelecaller: editFormData.assignedTelecaller,
          telecallerStatus: editFormData.telecallerStatus,
          paymentStatus: editFormData.paymentStatus
        };
        
        await departmentHeadService.updateLead(editingLead.id, apiPayload);

        // Update local state
        const updatedLeads = leadsData.map(lead =>
          lead.id === editingLead.id
            ? { ...lead, ...editFormData }
            : lead
        );
        setLeadsData(updatedLeads);

        toastManager.success('Lead updated successfully');
        setShowEditModal(false);
        setEditingLead(null);
      }
    } catch (error) {
      apiErrorHandler.handleError(error, 'update lead');
    }
  };

  // Get status badge
  const getStatusBadge = (status, type) => {
    const statusConfig = {
      'sales': {
        'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'PENDING' },
        'IN_PROGRESS': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'IN PROGRESS' },
        'COMPLETED': { bg: 'bg-green-100', text: 'text-green-800', label: 'COMPLETED' }
      },
      'telecaller': {
        'ACTIVE': { bg: 'bg-green-100', text: 'text-green-800', label: 'ACTIVE' },
        'INACTIVE': { bg: 'bg-red-100', text: 'text-red-800', label: 'INACTIVE' }
      },
      'payment': {
        'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'PENDING' },
        'IN_PROGRESS': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'IN PROGRESS' },
        'COMPLETED': { bg: 'bg-green-100', text: 'text-green-800', label: 'COMPLETED' }
      }
    };

    const typeConfig = statusConfig[type] || statusConfig['sales'];
    const config = typeConfig[status] || typeConfig['PENDING'];
  return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Search and Actions */}
      <div className="flex items-center justify-between space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
              placeholder="Search by name, email, or business"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

        <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowImportPopup(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              <span>Import CSV</span>
            </button>
          
            <button
              onClick={() => setShowAddCustomer(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
              </button>
              
            <button
            onClick={async () => {
              try {
                setLoading(true);
                const params = { page, limit };
                if (searchTerm && searchTerm.trim() !== '') params.search = searchTerm.trim();
                const response = await departmentHeadService.getAllLeads(params);
                if (response && response.data) {
                  const transformedData = transformApiData(response.data);
                  setLeadsData(transformedData);
                  if (response.pagination) setTotal(Number(response.pagination.total) || 0);
                  toastManager.success('Data refreshed successfully');
                }
              } catch (error) {
                apiErrorHandler.handleError(error, 'refresh leads');
              } finally {
                setLoading(false);
              }
            }}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
                    </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[130px]">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-purple-600" />
                    <span>Customer ID</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[220px]">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Customer</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-indigo-600" />
                    <span>Business</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-indigo-600" />
                    <span>GST No</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-orange-600" />
                    <span>Lead Source</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[220px]">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-pink-600" />
                    <span>Product Name</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px]">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-pink-600" />
                    <span>Category</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-green-600" />
                    <span>State</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Sales Status</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>Created</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px]">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-sky-600" />
                    <span>Assigned Salesperson</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px]">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-cyan-600" />
                    <span>Assigned Telecaller</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px]">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Telecaller Status</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px]">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Payment Status</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>Updated At</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                  <div className="flex items-center justify-end space-x-2">
                    <Settings className="w-4 h-4 text-gray-600" />
                    <span>Actions</span>
                  </div>
                  </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="16" className="px-4 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Loading leads...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="16" className="px-4 py-8 text-center text-gray-500">
                    No leads found. Add a new customer to get started.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-700">{lead.customerId}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{lead.customer}</div>
                      <div className="text-gray-600">{lead.phone}</div>
                      {lead.whatsapp && (
                        <a 
                          href={`https://wa.me/91${lead.whatsapp}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 text-xs flex items-center gap-1"
                        >
                          💬 WhatsApp
                        </a>
                      )}
                      {lead.email && (
                        <a 
                          href={`mailto:${lead.email}`}
                          className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                        >
                          📧 Email
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{lead.business}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{lead.gstNo}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{lead.leadSource}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{lead.productNamesText}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{lead.category}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{lead.state}</td>
                  <td className="px-4 py-4">
                    {getStatusBadge(lead.salesStatus, 'sales')}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{lead.createdAt}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{lead.assignedSalesperson}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{lead.assignedTelecaller}</td>
                  <td className="px-4 py-4">
                    {getStatusBadge(lead.telecallerStatus, 'telecaller')}
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(lead.paymentStatus, 'payment')}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{lead.updated_at || lead.createdAt}</td>
                  <td className="px-4 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(lead)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Lead"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setPreviewLead(lead);
                          setActiveTab('overview');
                          setShowPreviewModal(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="View Lead"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setPage(1);
                setLimit(Number(e.target.value));
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>
              {total === 0 ? '0-0' : `${(page - 1) * limit + 1} - ${Math.min(page * limit, total)}`} of {total}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 border rounded ${page === 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">Page {page} of {Math.max(1, Math.ceil(total / limit) || 1)}</span>
            <button
              onClick={() => setPage((p) => (p < Math.ceil(total / limit) ? p + 1 : p))}
              disabled={page >= Math.ceil(total / limit) || total === 0}
              className={`px-3 py-1 border rounded ${(page >= Math.ceil(total / limit) || total === 0) ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file input for CSV import */}
      <input
        ref={importFileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Import Popup Modal */}
      {showImportPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Import Leads</h2>
              <button onClick={() => setShowImportPopup(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">Upload a CSV file with lead data. Make sure the format matches the template.</p>
              
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={downloadCSVTemplate}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Template</span>
                </button>
              </div>
              
              <div
                onClick={() => importFileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Click to upload CSV file</p>
                <p className="text-gray-400 text-sm">or drag and drop</p>
              </div>
              
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowImportPopup(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Lead Details - {previewLead.customerId}</h2>
              <button onClick={() => setShowPreviewModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            {/* Tabs */}
            <div className="px-6 md:px-8 pt-4">
              <div className="flex items-center gap-3">
                {[
                  { key: 'overview', label: 'Overview' },
                  { key: 'paymentQuotation', label: 'Payment & Quotation' },
                  { key: 'proformaInvoice', label: 'Proforma Invoice' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === tab.key ? 'bg-blue-100 text-blue-900' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="px-6 md:px-8 py-5">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                    <p className="text-gray-900">{previewLead.customer}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{previewLead.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{previewLead.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business</label>
                    <p className="text-gray-900">{previewLead.business}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
                    <p className="text-gray-900">{previewLead.leadSource}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <p className="text-gray-900">{previewLead.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sales Status</label>
                    <p className="text-gray-900">{previewLead.salesStatus}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Salesperson</label>
                    <p className="text-gray-900">{previewLead.assignedSalesperson}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Telecaller</label>
                    <p className="text-gray-900">{previewLead.assignedTelecaller}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telecaller Status</label>
                    <p className="text-gray-900">{previewLead.telecallerStatus}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                    <p className="text-gray-900">{previewLead.paymentStatus}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                    <p className="text-gray-900">{previewLead.gstNo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <p className="text-gray-900">{previewLead.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <p className="text-gray-900">{previewLead.state}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                    <p className="text-gray-900">{previewLead.createdAt}</p>
                  </div>
                </div>
              )}

              {activeTab === 'paymentQuotation' && (
                <div className="space-y-6">
                  {/* Active Quotation */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Quotation</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Quotation #QT-2024-001</p>
                          <p className="text-sm text-gray-600">Digital Marketing Package - Premium Plan</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">₹23,600 - Active</p>
                          <p className="text-sm text-gray-500">Valid Until: 2024-02-20</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">Prepared by: Sarah Johnson</p>
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                            View Quotation
                          </button>
                          <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm">
                            Download PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rejected Quotation */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rejected Quotation</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Quotation #QT-2024-002</p>
                          <p className="text-sm text-gray-600">Basic Marketing Package - Standard Plan</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-red-600">₹15,000 - Rejected</p>
                          <p className="text-sm text-gray-500">Rejected on: 2024-01-15</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">Prepared by: Mike Wilson</p>
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
                            View Quotation
                          </button>
                          <button className="px-4 py-2 text-gray-600 border border-gray-600 rounded-lg hover:bg-gray-50 text-sm">
                            Download PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'proformaInvoice' && (
                <div className="space-y-6">
                  {/* Payment Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Advance Payment</label>
                        <p className="text-green-600 font-semibold text-lg">₹10,000</p>
                        <p className="text-sm text-gray-500">Received on: 2024-01-10</p>
                        <p className="text-sm text-gray-600">Receiver: John Smith</p>
                        <p className="text-sm text-gray-600">Account ID: ACC-2024-001</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pending Payment</label>
                        <p className="text-yellow-600 font-semibold text-lg">₹15,000</p>
                        <p className="text-sm text-gray-500">Due on: 2024-02-15</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                        <p className="text-gray-900 font-semibold text-lg">₹25,000</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
                        <p className="text-red-600 font-semibold text-lg">₹15,000</p>
                      </div>
                    </div>
                  </div>

                  {/* Voucher Details */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Voucher Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Voucher Number</label>
                        <p className="text-gray-900 font-mono">VCH-2024-001</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Voucher Date</label>
                        <p className="text-gray-900">{new Date().toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Reference</label>
                        <p className="text-gray-900">#QT-2024-001</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lead ID</label>
                        <p className="text-gray-900">{previewLead.customerId}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                        <p className="text-gray-900">{previewLead.customer}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <p className="text-gray-900 font-semibold">₹25,000</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-3">
                    <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                      Preview Voucher
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Generate Voucher
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Download PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end gap-3 px-6 md:px-8 py-4 border-t border-gray-200">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Import Leads from CSV</h2>
                <p className="text-sm text-gray-600">Review the data before importing</p>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Found {importPreview.length} records to import. Please review the data below:
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Customer Name</th>
                      <th className="px-3 py-2 text-left">Mobile</th>
                      <th className="px-3 py-2 text-left">Email</th>
                      <th className="px-3 py-2 text-left">Business</th>
                      <th className="px-3 py-2 text-left">Lead Source</th>
                      <th className="px-3 py-2 text-left">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importPreview.slice(0, 10).map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-3 py-2">{row['Customer Name'] || '-'}</td>
                        <td className="px-3 py-2">{row['Mobile Number'] || '-'}</td>
                        <td className="px-3 py-2">{row['Email'] || '-'}</td>
                        <td className="px-3 py-2">{row['Business Name'] || '-'}</td>
                        <td className="px-3 py-2">{row['Lead Source'] || '-'}</td>
                        <td className="px-3 py-2">{row['Business Category'] || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {importPreview.length > 10 && (
                  <p className="text-sm text-gray-500 mt-2">
                    ... and {importPreview.length - 10} more records
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
              <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                  onClick={handleImportLeads}
                  disabled={importing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {importing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Importing...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Import {importPreview.length} Leads</span>
                    </>
                  )}
              </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <AddCustomerModal
          onClose={() => setShowAddCustomer(false)}
          onSave={handleCustomerSave}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Lead</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <input
                    type="text"
                    value={editFormData.customer}
                    onChange={(e) => setEditFormData({...editFormData, customer: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business</label>
                  <input
                    type="text"
                    value={editFormData.business}
                    onChange={(e) => setEditFormData({...editFormData, business: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST No</label>
                  <input
                    type="text"
                    value={editFormData.gstNo}
                    onChange={(e) => setEditFormData({...editFormData, gstNo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
                  <input
                    type="text"
                    value={editFormData.leadSource}
                    onChange={(e) => setEditFormData({...editFormData, leadSource: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={editFormData.productNames}
                    onChange={(e) => setEditFormData({...editFormData, productNames: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sales Status</label>
                  <select
                    value={editFormData.salesStatus}
                    onChange={(e) => setEditFormData({...editFormData, salesStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Salesperson</label>
                  <select
                    value={editFormData.assignedSalesperson}
                    onChange={(e) => setEditFormData({...editFormData, assignedSalesperson: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{loadingUsers ? 'Loading...' : 'Select username'}</option>
                    {usersError && <option value="" disabled>{usersError}</option>}
                    {usernames.map(name => (
                      <option key={`sp-${name}`} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Telecaller</label>
                  <select
                    value={editFormData.assignedTelecaller}
                    onChange={(e) => setEditFormData({...editFormData, assignedTelecaller: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{loadingUsers ? 'Loading...' : 'Select username'}</option>
                    {usersError && <option value="" disabled>{usersError}</option>}
                    {usernames.map(name => (
                      <option key={`tc-${name}`} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telecaller Status</label>
                  <select
                    value={editFormData.telecallerStatus}
                    onChange={(e) => setEditFormData({...editFormData, telecallerStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select
                    value={editFormData.paymentStatus}
                    onChange={(e) => setEditFormData({...editFormData, paymentStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LeadsSimplified;
