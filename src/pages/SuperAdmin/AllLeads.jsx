import React, { useState, useRef } from 'react';
import { Search, Trash2, Filter, Upload, RefreshCw, Eye, MoreVertical, User, Mail, Building, Shield, Tag, Clock, Calendar, Phone, CheckCircle, XCircle, Download, FileText } from 'lucide-react';

const AllLeads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [importing, setImporting] = useState(false);
  
  const importFileInputRef = useRef(null);

  // Download CSV template
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
    alert('CSV template downloaded successfully');
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
      alert('Please select a valid CSV file');
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
      alert('No data to import');
      return;
    }

    setImporting(true);
    // Here you would implement the actual import logic
    // For now, just simulate the import
    setTimeout(() => {
      alert(`Import completed! ${importPreview.length} leads imported successfully`);
      setShowImportModal(false);
      setImportPreview([]);
      setImportFile(null);
      setImporting(false);
    }, 2000);
  };

  // Sample data
  const leads = [
    {
      id: 1,
      customer: 'na 9769334242',
      email: 'tejaldrive@gmail.com',
      business: 'na',
      leadType: '999 7 aug',
      category: 'na',
      salesStatus: 'PENDING',
      createdAt: '2024-01-15',
      assigned: 'John Doe',
      telecaller: 'Sarah Smith',
      telecallerStatus: 'ACTIVE',
      paymentStatus: 'PENDING'
    },
    {
      id: 2,
      customer: 'na 9769868287',
      email: 'Shilpawadkar29@gmail.com',
      business: 'na',
      leadType: '999 7 aug',
      category: 'na',
      salesStatus: 'PENDING',
      createdAt: '2024-01-16',
      assigned: 'Mike Johnson',
      telecaller: 'Alex Brown',
      telecallerStatus: 'INACTIVE',
      paymentStatus: 'COMPLETED'
    },
    {
      id: 3,
      customer: 'na 9840457999',
      email: 'rahul.44@gmail.com',
      business: 'na',
      leadType: '999 7 aug',
      category: 'na',
      salesStatus: 'PENDING',
      createdAt: '2024-01-17',
      assigned: 'Lisa Wilson',
      telecaller: 'Tom Davis',
      telecallerStatus: 'ACTIVE',
      paymentStatus: 'PENDING'
    },
    {
      id: 4,
      customer: 'na 9876543210',
      email: 'bluestarindustriespvtltd@gmail.com',
      business: 'na',
      leadType: '999 7 aug',
      category: 'na',
      salesStatus: 'PENDING',
      createdAt: '2024-01-18',
      assigned: 'David Lee',
      telecaller: 'Emma Taylor',
      telecallerStatus: 'ACTIVE',
      paymentStatus: 'IN_PROGRESS'
    },
    {
      id: 5,
      customer: 'na 9123456789',
      email: 'testuser@gmail.com',
      business: 'na',
      leadType: '999 7 aug',
      category: 'na',
      salesStatus: 'PENDING',
      createdAt: '2024-01-19',
      assigned: 'Anna Garcia',
      telecaller: 'Chris Miller',
      telecallerStatus: 'INACTIVE',
      paymentStatus: 'PENDING'
    }
  ];

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

  const getStatusBadge = (status, type) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium";
    
    switch (type) {
      case 'sales':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`}>
            {status}
          </span>
        );
      case 'telecaller':
        return (
          <span className={`${baseClasses} ${
            status === 'ACTIVE' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {status}
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
            {status}
          </span>
        );
      default:
        return <span className={baseClasses}>{status}</span>;
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.business.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">All Leads</h1>
      </div>

      {/* Search and Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, or business..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button
              onClick={() => {
                downloadCSVTemplate();
                setTimeout(() => {
                  importFileInputRef.current?.click();
                }, 1000);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Import CSV</span>
            </button>
            <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <RefreshCw className="w-4 h-4" />
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
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === leads.length && leads.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Customer</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4" />
                    <span>Business</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Lead Type</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>Category</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Sales Status</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Created</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Assigned</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Telecaller</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Telecaller Status</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4" />
                    <span>Payment Status</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {lead.customer}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {lead.email}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {lead.business}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {lead.leadType}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {lead.category}
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(lead.salesStatus, 'sales')}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {lead.createdAt}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {lead.assigned}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {lead.telecaller}
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(lead.telecallerStatus, 'telecaller')}
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(lead.paymentStatus, 'payment')}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default AllLeads;
