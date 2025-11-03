import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Phone, Mail, MapPin, Calendar, User, ChevronRight, Building, FileText, Tag, CreditCard, Send, DollarSign, ArrowRight, Upload, Download, X, RefreshCw } from 'lucide-react';
import apiClient from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../api/admin_api/api';
import AddCustomerForm from '../salespersonaddcustomer.jsx';

const MobileLeads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // States for validation
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const leadSources = [
    'Website Inquiry', 'Referral', 'Cold Call', 'Trade Show', 'Social Media',
    'Email Campaign', 'Advertisement', 'Direct Visit', 'Other'
  ];

  const customerTypes = ['Individual', 'Corporate', 'Retail', 'Government', 'Other'];

  // Leads data - fetched from API (same as desktop)
  const [leads, setLeads] = useState([]);

  // Fetch leads from API (same endpoint as desktop)
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(API_ENDPOINTS.SALESPERSON_ASSIGNED_LEADS_ME());
        const leadsData = response?.data || [];
        
        // Transform API data to match mobile view format
        const transformedLeads = leadsData.map((lead) => ({
          id: lead.id,
          name: lead.name || 'N/A',
          phone: lead.phone || 'N/A',
          business: lead.business || 'N/A',
          address: lead.address || 'N/A',
          gstNo: lead.gst_no || 'N/A',
          productName: lead.product_type || 'N/A',
          state: lead.state || 'N/A',
          leadSource: lead.lead_source || 'N/A',
          customerType: lead.customer_type || 'N/A',
          date: lead.date ? new Date(lead.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          salesStatus: (lead.sales_status || 'follow up').toLowerCase(),
          transferredTo: lead.transferred_to || 'N/A',
          quotationSend: lead.quotation_count > 0 ? 'Yes' : 'No',
          paymentStatus: lead.payment_status === 'COMPLETED' ? 'Paid' : 
                        lead.payment_status === 'PARTIAL' ? 'Partially Paid' :
                        lead.payment_status === 'PENDING' ? 'Pending' : 'Not Started'
        }));
        
        setLeads(transformedLeads);
      } catch (error) {
        console.error('Error fetching leads:', error);
        // Fallback to empty array on error
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Refresh leads data (can be called after import or updates)
  const refreshLeads = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SALESPERSON_ASSIGNED_LEADS_ME());
      const leadsData = response?.data || [];
      
      const transformedLeads = leadsData.map((lead) => ({
        id: lead.id,
        name: lead.name || 'N/A',
        phone: lead.phone || 'N/A',
        business: lead.business || 'N/A',
        address: lead.address || 'N/A',
        gstNo: lead.gst_no || 'N/A',
        productName: lead.product_type || 'N/A',
        state: lead.state || 'N/A',
        leadSource: lead.lead_source || 'N/A',
        customerType: lead.customer_type || 'N/A',
        date: lead.date ? new Date(lead.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        salesStatus: (lead.sales_status || 'follow up').toLowerCase(),
        transferredTo: lead.transferred_to || 'N/A',
        quotationSend: lead.quotation_count > 0 ? 'Yes' : 'No',
        paymentStatus: lead.payment_status === 'COMPLETED' ? 'Paid' : 
                      lead.payment_status === 'PARTIAL' ? 'Partially Paid' :
                      lead.payment_status === 'PENDING' ? 'Pending' : 'Not Started'
      }));
      
      setLeads(transformedLeads);
    } catch (error) {
      console.error('Error refreshing leads:', error);
    }
  };

  // Handle save customer (add or update)
  const handleSaveCustomer = async (newCustomerData) => {
    try {
      if (editingCustomer) {
        // Update existing customer
        const formData = new FormData();
        formData.append('name', newCustomerData.customerName);
        formData.append('phone', newCustomerData.mobileNumber);
        formData.append('email', newCustomerData.email || '');
        formData.append('business', newCustomerData.business || 'N/A');
        formData.append('address', newCustomerData.address || 'N/A');
        formData.append('gst_no', newCustomerData.gstNumber || '');
        formData.append('product_type', newCustomerData.productName || 'N/A');
        formData.append('state', newCustomerData.state || 'N/A');
        formData.append('lead_source', newCustomerData.leadSource || 'N/A');
        formData.append('customer_type', newCustomerData.customerType || 'N/A');
        formData.append('date', newCustomerData.date);
        formData.append('whatsapp', newCustomerData.whatsappNumber ? newCustomerData.whatsappNumber.replace(/\D/g, '').slice(-10) : '');
        formData.append('sales_status', newCustomerData.salesStatus || 'pending');
        formData.append('sales_status_remark', newCustomerData.salesStatusRemark || '');
        formData.append('transferred_to', newCustomerData.transferredTo || '');

        // Add call recording file if present
        if (newCustomerData.callRecordingFile) {
          formData.append('call_recording', newCustomerData.callRecordingFile);
        }

        await apiClient.putFormData(API_ENDPOINTS.SALESPERSON_LEAD_BY_ID(editingCustomer.id), formData);
        alert('Customer updated successfully!');
      } else {
        // Add new customer
        const formData = new FormData();
        formData.append('name', newCustomerData.customerName);
        formData.append('phone', newCustomerData.mobileNumber.replace(/\D/g, '').slice(-10));
        formData.append('whatsapp', newCustomerData.whatsappNumber ? newCustomerData.whatsappNumber.replace(/\D/g, '').slice(-10) : newCustomerData.mobileNumber.replace(/\D/g, '').slice(-10));
        formData.append('email', newCustomerData.email || '');
        formData.append('business', newCustomerData.business || 'N/A');
        formData.append('address', newCustomerData.address || 'N/A');
        formData.append('state', newCustomerData.state || 'N/A');
        formData.append('gst_no', newCustomerData.gstNumber || 'N/A');
        formData.append('product_type', newCustomerData.productName || 'N/A');
        formData.append('lead_source', newCustomerData.leadSource || 'N/A');
        formData.append('customer_type', newCustomerData.customerType || 'N/A');
        formData.append('date', newCustomerData.date);
        formData.append('sales_status', newCustomerData.salesStatus || 'pending');

        if (newCustomerData.callRecordingFile) {
          formData.append('call_recording', newCustomerData.callRecordingFile);
        }

        await apiClient.postFormData(API_ENDPOINTS.LEADS_CREATE(), formData);
        alert('Customer added successfully!');
      }

      // Refresh leads from API
      await refreshLeads();
      
      // Close modal and reset editing state
      setShowAddCustomer(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error('Error saving customer:', error);
      alert(`Failed to ${editingCustomer ? 'update' : 'add'} customer. Please try again.`);
    }
  };

  const statusFilters = [
    { id: 'all', label: 'All Status', count: leads.length },
    { id: 'win', label: 'Win', count: leads.filter(l => l.salesStatus?.toLowerCase() === 'win').length },
    { id: 'loose', label: 'Loose', count: leads.filter(l => l.salesStatus?.toLowerCase() === 'loose').length },
    { id: 'follow up', label: 'Follow Up', count: leads.filter(l => l.salesStatus?.toLowerCase() === 'follow up').length },
    { id: 'not interested', label: 'Not Interested', count: leads.filter(l => l.salesStatus?.toLowerCase() === 'not interested').length }
  ];

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case 'win': return 'bg-green-100 text-green-800';
      case 'loose': return 'bg-red-100 text-red-800';
      case 'follow up': return 'bg-yellow-100 text-yellow-800';
      case 'not interested': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Partially Paid': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCustomerTypeColor = (type) => {
    switch (type) {
      case 'Corporate': return 'bg-purple-100 text-purple-800';
      case 'Retail': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm);
    const matchesFilter = selectedFilter === 'all' || lead.salesStatus?.toLowerCase() === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleLeadClick = (lead) => {
    if (selectedLead?.id === lead.id) {
      setSelectedLead(null);
    } else {
      setSelectedLead(lead);
    }
  };

  // Import functionality - same as desktop
  const handleDownloadTemplate = () => {
    // Create CSV template with headers
    const headers = [
      'Name', 'Phone', 'WhatsApp', 'Email', 'Address', 'State', 'GST No', 
      'Product Name', 'Lead Source', 'Customer Type', 'Date'
    ];
    
    // Create sample data row with example values
    const sampleData = [
      'John Doe', '9876543210', '9876543210', 'john.doe@email.com', 
      '123 Main Street, City', 'Karnataka', '29ABCDE1234F1Z5', 
      'XLPE Cable 1.5mm', 'Website Inquiry', 'Individual', '2024-01-15'
    ];
    
    const csvContent = [headers, sampleData].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'leads_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportLeads = () => {
    setShowImportModal(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setImportFile(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  // Helper function to parse CSV line properly (handles commas in quoted fields)
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result.map(v => v.replace(/"/g, '').trim());
  };

  // Helper function to validate headers
  const validateHeaders = (actualHeaders, expectedHeaders) => {
    const errors = [];
    
    if (actualHeaders.length !== expectedHeaders.length) {
      errors.push(`Expected ${expectedHeaders.length} columns, found ${actualHeaders.length}`);
    }
    
    expectedHeaders.forEach((expected, index) => {
      if (actualHeaders[index] !== expected) {
        errors.push(`Column ${index + 1}: Expected "${expected}", found "${actualHeaders[index] || 'empty'}"`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Helper function to validate customer data
  const validateCustomerData = (values, headers, rowNumber) => {
    const errors = [];
    const data = {};
    
    // Map values to field names
    headers.forEach((header, index) => {
      const value = values[index] || '';
      
      switch (header) {
        case 'Name':
          if (!value || value.length < 2) {
            errors.push('Name is required and must be at least 2 characters');
          }
          data.name = value;
          break;
          
        case 'Phone':
          const phoneRegex = /^[6-9]\d{9}$/;
          if (!value || !phoneRegex.test(value)) {
            errors.push('Phone must be a valid 10-digit Indian mobile number');
          }
          data.phone = `+91 ${value}`;
          break;
          
        case 'WhatsApp':
          const whatsappRegex = /^[6-9]\d{9}$/;
          if (value && !whatsappRegex.test(value)) {
            errors.push('WhatsApp must be a valid 10-digit Indian mobile number');
          }
          data.whatsapp = value ? `+91${value}` : null;
          break;
          
        case 'Email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (value && !emailRegex.test(value)) {
            errors.push('Email must be a valid email address');
          }
          data.email = value || 'N/A';
          break;
          
        case 'Address':
          data.address = value || 'N/A';
          break;
          
        case 'State':
          if (value && !states.includes(value)) {
            errors.push(`State must be one of: ${states.join(', ')}`);
          }
          data.state = value || 'N/A';
          break;
          
        case 'GST No':
          const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
          if (value && !gstRegex.test(value)) {
            errors.push('GST No must be a valid GST number format');
          }
          data.gstNo = value || 'N/A';
          break;
          
        case 'Product Name':
          data.productName = value || 'N/A';
          break;
          
        case 'Lead Source':
          if (value && !leadSources.includes(value)) {
            errors.push(`Lead Source must be one of: ${leadSources.join(', ')}`);
          }
          data.leadSource = value || 'N/A';
          break;
          
        case 'Customer Type':
          if (value && !customerTypes.includes(value)) {
            errors.push(`Customer Type must be one of: ${customerTypes.join(', ')}`);
          }
          data.customerType = value || 'N/A';
          break;
          
        case 'Date':
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (value && !dateRegex.test(value)) {
            errors.push('Date must be in YYYY-MM-DD format');
          }
          data.date = value || new Date().toISOString().split('T')[0];
          break;
          
        default:
          data[header.toLowerCase().replace(/\s+/g, '')] = value;
      }
    });
    
    return {
      isValid: errors.length === 0,
      data,
      errors
    };
  };

  const processCSVImport = async () => {
    if (!importFile) {
      alert('Please select a CSV file first');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n').filter(line => line.trim()); // Remove empty lines
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        
        // Expected headers for validation
        const expectedHeaders = [
          'Name', 'Phone', 'WhatsApp', 'Email', 'Address', 'State', 'GST No', 
          'Product Name', 'Lead Source', 'Customer Type', 'Date'
        ];
        
        // Validate headers
        const headerValidation = validateHeaders(headers, expectedHeaders);
        if (!headerValidation.isValid) {
          alert(`CSV header validation failed:\n${headerValidation.errors.join('\n')}\n\nPlease use the correct template format.`);
          return;
        }
        
        const importedLeads = [];
        const errors = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = parseCSVLine(lines[i]);
            
            if (values.length >= headers.length) {
              // Validate and clean data
              const validatedData = validateCustomerData(values, headers, i + 1);
              
              if (validatedData.isValid) {
                const newLead = {
                  id: leads.length + importedLeads.length + 1,
                  name: validatedData.data.name,
                  phone: validatedData.data.phone,
                  business: validatedData.data.name + ' Business', // Default business name
                  address: validatedData.data.address,
                  gstNo: validatedData.data.gstNo,
                  productName: validatedData.data.productName,
                  state: validatedData.data.state,
                  leadSource: validatedData.data.leadSource,
                  customerType: validatedData.data.customerType,
                  date: validatedData.data.date,
                  salesStatus: 'Follow Up',
                  transferredTo: 'N/A',
                  quotationSend: 'No',
                  paymentStatus: 'Not Started'
                };
                importedLeads.push(newLead);
              } else {
                errors.push(`Row ${i + 1}: ${validatedData.errors.join(', ')}`);
              }
            } else {
              errors.push(`Row ${i + 1}: Insufficient data columns`);
            }
          }
        }
        
        if (importedLeads.length > 0) {
          // Upload imported leads to API
          try {
            for (const lead of importedLeads) {
              const formData = new FormData();
              formData.append('name', lead.name);
              formData.append('phone', lead.phone.replace(/\D/g, '').slice(-10));
              formData.append('whatsapp', lead.phone.replace(/\D/g, '').slice(-10));
              formData.append('email', lead.email || '');
              formData.append('business', lead.business || 'N/A');
              formData.append('address', lead.address || 'N/A');
              formData.append('state', lead.state || 'N/A');
              formData.append('gst_no', lead.gstNo || 'N/A');
              formData.append('product_type', lead.productName || 'N/A');
              formData.append('lead_source', lead.leadSource || 'N/A');
              formData.append('customer_type', lead.customerType || 'N/A');
              formData.append('date', lead.date);
              formData.append('sales_status', lead.salesStatus || 'follow up');
              
              await apiClient.postFormData(API_ENDPOINTS.LEADS_CREATE(), formData);
            }
            
            // Refresh leads from API after successful import
            await refreshLeads();
            
            const successMessage = errors.length > 0 
              ? `Successfully imported ${importedLeads.length} leads. ${errors.length} rows had errors and were skipped.`
              : `Successfully imported ${importedLeads.length} leads`;
            alert(successMessage);
            setShowImportModal(false);
            setImportFile(null);
          } catch (error) {
            console.error('Error uploading imported leads:', error);
            // Still update local state even if API fails
            setLeads(prev => [...prev, ...importedLeads]);
            alert(`Imported ${importedLeads.length} leads locally. Some may not have been saved to server.`);
            setShowImportModal(false);
            setImportFile(null);
          }
        } else {
          const errorMessage = errors.length > 0 
            ? `CSV validation failed:\n\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n... and ${errors.length - 5} more errors` : ''}\n\nPlease check the format and try again.`
            : 'No valid data found in CSV file. Please check the format and try again.';
          alert(errorMessage);
        }
      } catch (error) {
        console.error('Error processing CSV:', error);
        alert('Error processing CSV file. Please check the format.');
      }
    };
    reader.readAsText(importFile);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Leads</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleImportLeads}
            className="p-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
            title="Import Leads"
          >
            <Upload className="h-4 w-4" />
          </button>
          <button 
            onClick={refreshLeads}
            className="p-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            title="Refresh Leads"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button 
            onClick={() => {
              setEditingCustomer(null);
              setShowAddCustomer(true);
            }}
            className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            title="Add Customer"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500">Loading leads...</p>
        </div>
      )}

      {/* Search Bar */}
      {!loading && (
        <>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 overflow-x-auto pb-1">
            {statusFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {/* Leads List */}
          <div className="space-y-2">
        {filteredLeads.map((lead) => (
          <div 
            key={lead.id} 
            className={`bg-white rounded-lg shadow-sm border transition-all ${
              selectedLead?.id === lead.id 
                ? 'border-blue-500 shadow-md' 
                : 'border-gray-100'
            }`}
          >
            {/* Default View - Always Visible */}
            <div 
              className="p-3 cursor-pointer"
              onClick={() => handleLeadClick(lead)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">{lead.name}</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.salesStatus)}`}>
                      {lead.salesStatus}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCustomerTypeColor(lead.customerType)}`}>
                      {lead.customerType}
                    </span>
                  </div>
                </div>
                <ChevronRight 
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    selectedLead?.id === lead.id ? 'rotate-90' : ''
                  }`} 
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Phone className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{lead.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Building className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{lead.business}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <CreditCard className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate font-mono">{lead.gstNo}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{lead.state}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  <span>{lead.date}</span>
                </div>
              </div>
            </div>

            {/* Expanded View - Show when clicked */}
            {selectedLead?.id === lead.id && (
              <div className="px-3 pb-3 pt-0 border-t border-gray-100 space-y-2 mt-2">
                <div className="pt-2 space-y-2">
                  <div className="flex items-start space-x-2 text-xs">
                    <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-gray-500 mb-0.5">Address</div>
                      <div className="text-gray-900">{lead.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 text-xs">
                    <FileText className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-gray-500 mb-0.5">Product Name</div>
                      <div className="text-gray-900">{lead.productName}</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 text-xs">
                    <Tag className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-gray-500 mb-0.5">Lead Source</div>
                      <div className="text-gray-900">{lead.leadSource}</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 text-xs">
                    <ArrowRight className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-gray-500 mb-0.5">Transferred To</div>
                      <div className="text-gray-900">{lead.transferredTo}</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 text-xs">
                    <Send className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-gray-500 mb-0.5">Quotation Send</div>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        lead.quotationSend === 'Yes' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.quotationSend}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 text-xs">
                    <DollarSign className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-gray-500 mb-0.5">Payment Status</div>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getPaymentStatusColor(lead.paymentStatus)}`}>
                        {lead.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

          {/* Empty State */}
          {!loading && filteredLeads.length === 0 && (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No leads found</p>
              <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Import Leads</h3>
                <button 
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-600">
                    Upload a CSV file with lead data. Make sure the format matches the template.
                  </p>
                </div>
                
                <button
                  onClick={handleDownloadTemplate}
                  className="w-full mb-3 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Template
                </button>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="csv-upload-mobile" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        {importFile ? importFile.name : 'Click to upload CSV file'}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        CSV files only
                      </span>
                    </label>
                    <input
                      id="csv-upload-mobile"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={processCSVImport}
                  disabled={!importFile}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import Leads
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <AddCustomerForm
          onClose={() => {
            setShowAddCustomer(false);
            setEditingCustomer(null);
          }}
          onSave={handleSaveCustomer}
          editingCustomer={editingCustomer}
        />
      )}
    </div>
  );
};

export default MobileLeads;
