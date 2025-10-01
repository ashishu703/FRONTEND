import React, { useRef, useState, useEffect } from 'react';
import { Search, Filter, Upload, RefreshCw, User, Mail, Building, Shield, Tag, Clock, Calendar, Phone, CheckCircle, XCircle, Hash, MapPin, Info, Plus, TrendingUp, Target, Users, BarChart3 } from 'lucide-react';
import AddCustomerForm from '../salesperson/salespersonaddcustomer.jsx';

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
  const [columnFilters, setColumnFilters] = useState({
    customerId: '',
    customer: '',
    email: '',
    business: '',
    leadType: '',
    category: '',
    salesStatus: '',
    createdAt: '',
    assigned: '',
    telecaller: '',
    telecallerStatus: '',
    paymentStatus: ''
  });

  // Sample data for marketing leads
  const leads = [
    {
      id: 1,
      customerId: 'MKT-0001',
      customer: 'John Smith',
      email: 'john.smith@example.com',
      business: 'Tech Solutions Inc',
      leadType: 'Website Inquiry',
      category: 'Hot Lead',
      salesStatus: 'PENDING',
      createdAt: '2024-01-15',
      assigned: 'Sarah Johnson',
      telecaller: 'Mike Wilson',
      telecallerStatus: 'ACTIVE',
      paymentStatus: 'PENDING'
    },
    {
      id: 2,
      customerId: 'MKT-0002',
      customer: 'Emily Davis',
      email: 'emily.davis@company.com',
      business: 'Marketing Agency',
      leadType: 'Social Media',
      category: 'Warm Lead',
      salesStatus: 'FOLLOW_UP',
      createdAt: '2024-01-16',
      assigned: 'David Lee',
      telecaller: 'Lisa Chen',
      telecallerStatus: 'ACTIVE',
      paymentStatus: 'IN_PROGRESS'
    },
    {
      id: 3,
      customerId: 'MKT-0003',
      customer: 'Robert Brown',
      email: 'robert.brown@business.com',
      business: 'Manufacturing Co',
      leadType: 'Referral',
      category: 'Cold Lead',
      salesStatus: 'PENDING',
      createdAt: '2024-01-17',
      assigned: 'Anna Garcia',
      telecaller: 'Tom Davis',
      telecallerStatus: 'INACTIVE',
      paymentStatus: 'PENDING'
    },
    {
      id: 4,
      customerId: 'MKT-0004',
      customer: 'Maria Rodriguez',
      email: 'maria.rodriguez@enterprise.com',
      business: 'Enterprise Solutions',
      leadType: 'Email Campaign',
      category: 'Hot Lead',
      salesStatus: 'MEETING_SCHEDULED',
      createdAt: '2024-01-18',
      assigned: 'Chris Miller',
      telecaller: 'Emma Taylor',
      telecallerStatus: 'ACTIVE',
      paymentStatus: 'COMPLETED'
    },
    {
      id: 5,
      customerId: 'MKT-0005',
      customer: 'James Wilson',
      email: 'james.wilson@startup.com',
      business: 'Startup Ventures',
      leadType: 'Trade Show',
      category: 'Warm Lead',
      salesStatus: 'PENDING',
      createdAt: '2024-01-19',
      assigned: 'Alex Johnson',
      telecaller: 'Sarah Smith',
      telecallerStatus: 'ACTIVE',
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

  const openPreview = (lead) => {
    setPreviewLead(lead);
    setShowPreview(true);
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
    const baseClasses = "px-2 py-1 rounded text-xs font-medium";
    
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
            {status.replace('_', ' ')}
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
            {status.replace('_', ' ')}
          </span>
        );
      default:
        return <span className={baseClasses}>{status}</span>;
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
      (!cf.leadType || includes(lead.leadType, cf.leadType)) &&
      (!cf.category || includes(lead.category, cf.category)) &&
      (!cf.salesStatus || includes(lead.salesStatus, cf.salesStatus)) &&
      (!cf.createdAt || includes(lead.createdAt, cf.createdAt)) &&
      (!cf.assigned || includes(lead.assigned, cf.assigned)) &&
      (!cf.telecaller || includes(lead.telecaller, cf.telecaller)) &&
      (!cf.telecallerStatus || includes(lead.telecallerStatus, cf.telecallerStatus)) &&
      (!cf.paymentStatus || includes(lead.paymentStatus, cf.paymentStatus))
    );
  };

  const filteredLeads = importedLeads.filter(lead => matchesGlobal(lead) && matchesColumnFilters(lead));

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const parseCsv = (text) => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    const records = lines.slice(1).map((line, idx) => {
      const cols = line.split(',');
      const row = {};
      headers.forEach((h, i) => {
        row[h] = (cols[i] || '').trim();
      });
      return row;
    });
    return records;
  };

  const normalizeImported = (rows) => {
    return rows.map((r, index) => ({
      id: index + 1,
      customerId: r.customerId || r.customer_id || `MKT-${String(index + 1).padStart(4, '0')}`,
      customer: r.customer || r.name || r.customer_name || 'N/A',
      email: r.email || 'N/A',
      business: r.business || r.business_name || 'N/A',
      leadType: r.leadType || r.lead_type || 'N/A',
      category: r.category || 'N/A',
      salesStatus: r.salesStatus || r.sales_status || 'PENDING',
      createdAt: r.createdAt || r.created_at || new Date().toISOString().slice(0,10),
      assigned: r.assigned || 'Unassigned',
      telecaller: r.telecaller || 'N/A',
      telecallerStatus: r.telecallerStatus || r.telecaller_status || 'INACTIVE',
      paymentStatus: r.paymentStatus || r.payment_status || 'PENDING'
    }));
  };

  const onFileSelected = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = String(evt.target.result || '');
        const rows = parseCsv(text);
        const normalized = normalizeImported(rows);
        setLeadsData(normalized);
      } catch (err) {
        console.error('Failed to import leads:', err);
        alert('Failed to import leads. Please ensure the CSV is valid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Marketing Leads</h1>
        </div>
        <p className="text-gray-600">Manage and track marketing salesperson leads</p>
      </div>

      {/* Search and Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          {/* Left: Search (half width) */}
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

          {/* Right: Small Filter + Add Customer + Import + Refresh */}
          <div className="flex items-center space-x-3">
            <button
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Toggle column filters"
              onClick={() => setShowColumnFilters(v => !v)}
            >
              <Filter className="w-4 h-4 text-indigo-600" />
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              onClick={() => setShowAddCustomer(true)}
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
            <button onClick={handleImportClick} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Upload className="w-4 h-4 text-white" />
              <span>Import Leads</span>
            </button>
            <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" onClick={() => setLeadsData(null)}>
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={onFileSelected}
              className="hidden"
            />
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
                    <Hash className="w-4 h-4 text-purple-600" />
                    <span>Customer ID</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Customer</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span>Email</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-indigo-600" />
                    <span>Business</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-orange-600" />
                    <span>Lead Type</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-pink-600" />
                    <span>Category</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Sales Status</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>Created</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-sky-600" />
                    <span>Assigned</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-cyan-600" />
                    <span>Telecaller</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Telecaller Status</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Payment Status</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
              {showColumnFilters && (
                <tr className="border-t border-gray-200 bg-white/70">
                  <th className="px-4 py-2"></th>
                  <th className="px-2 py-2">
                    <input value={columnFilters.customerId} onChange={e => setColumnFilters({ ...columnFilters, customerId: e.target.value })} placeholder="Filter" className="w-full px-2 py-1 border border-gray-300 rounded" />
                  </th>
                  <th className="px-2 py-2">
                    <input value={columnFilters.customer} onChange={e => setColumnFilters({ ...columnFilters, customer: e.target.value })} placeholder="Filter" className="w-full px-2 py-1 border border-gray-300 rounded" />
                  </th>
                  <th className="px-2 py-2">
                    <input value={columnFilters.email} onChange={e => setColumnFilters({ ...columnFilters, email: e.target.value })} placeholder="Filter" className="w-full px-2 py-1 border border-gray-300 rounded" />
                  </th>
                  <th className="px-2 py-2">
                    <input value={columnFilters.business} onChange={e => setColumnFilters({ ...columnFilters, business: e.target.value })} placeholder="Filter" className="w-full px-2 py-1 border border-gray-300 rounded" />
                  </th>
                  <th className="px-2 py-2">
                    <input value={columnFilters.leadType} onChange={e => setColumnFilters({ ...columnFilters, leadType: e.target.value })} placeholder="Filter" className="w-full px-2 py-1 border border-gray-300 rounded" />
                  </th>
                  <th className="px-2 py-2">
                    <input value={columnFilters.category} onChange={e => setColumnFilters({ ...columnFilters, category: e.target.value })} placeholder="Filter" className="w-full px-2 py-1 border border-gray-300 rounded" />
                  </th>
                  <th className="px-2 py-2">
                    <input value={columnFilters.salesStatus} onChange={e => setColumnFilters({ ...columnFilters, salesStatus: e.target.value })} placeholder="Filter" className="w-full px-2 py-1 border border-gray-300 rounded" />
                  </th>
                  <th className="px-2 py-2">
                    <input value={columnFilters.createdAt} onChange={e => setColumnFilters({ ...columnFilters, createdAt: e.target.value })} placeholder="YYYY-MM-DD" className="w-full px-2 py-1 border border-gray-300 rounded" />
                  </th>
                  <th className="px-2 py-2">
                    <input value={columnFilters.assigned} onChange={e => setColumnFilters({ ...columnFilters, assigned: e.target.value })} placeholder="Filter" className="w-full px-2 py-1 border border-gray-300 rounded" />
                  </th>
                  <th className="px-2 py-2">
                    <input value={columnFilters.telecaller} onChange={e => setColumnFilters({ ...columnFilters, telecaller: e.target.value })} placeholder="Filter" className="w-full px-2 py-1 border border-gray-300 rounded" />
                  </th>
                  <th className="px-2 py-2">
                    <input value={columnFilters.telecallerStatus} onChange={e => setColumnFilters({ ...columnFilters, telecallerStatus: e.target.value })} placeholder="Filter" className="w-full px-2 py-1 border border-gray-300 rounded" />
                  </th>
                  <th className="px-2 py-2">
                    <input value={columnFilters.paymentStatus} onChange={e => setColumnFilters({ ...columnFilters, paymentStatus: e.target.value })} placeholder="Filter" className="w-full px-2 py-1 border border-gray-300 rounded" />
                  </th>
                  <th className="px-4 py-2 text-right">
                    <button className="text-xs text-blue-600 hover:underline" onClick={() => setColumnFilters({
                      customerId: '', customer: '', email: '', business: '', leadType: '', category: '', salesStatus: '', createdAt: '', assigned: '', telecaller: '', telecallerStatus: '', paymentStatus: ''
                    })}>Clear</button>
                  </th>
                </tr>
              )}
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
                  <td className="px-4 py-4 text-sm text-gray-700">{lead.customerId}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{lead.customer}</td>
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
                      <button
                        className="w-6 h-6 flex items-center justify-center text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-full hover:bg-indigo-50 transition-colors"
                        title="Info"
                        aria-label="Info"
                        onClick={() => openPreview(lead)}
                      >
                        i
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && previewLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-3xl max-h-[70vh] overflow-y-auto rounded-2xl shadow-2xl border border-gray-200" role="dialog" aria-modal="true">
            {/* Header */}
            <div className="flex items-start justify-between px-6 md:px-8 py-5 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">{previewLead.customer}</h2>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${previewLead.salesStatus === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                    {previewLead.salesStatus.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-gray-600">{previewLead.business}</div>
              </div>
              <button
                className="p-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPreview(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 md:px-8 pt-4">
              <div className="flex items-center gap-3">
                {[
                  { key: 'overview', label: 'Overview' },
                  { key: 'paymentQuotation', label: 'Payment & Quotation' },
                  { key: 'meetings', label: 'Meetings' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === tab.key ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="px-6 md:px-8 py-5">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Lead Summary */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs font-medium text-gray-500">Customer ID</div>
                        <div className="text-sm text-gray-900">{previewLead.customerId || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500">Customer</div>
                        <div className="text-sm text-gray-900">{previewLead.customer || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500">Email</div>
                        <div className="text-sm text-gray-900 truncate">{previewLead.email || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500">Business</div>
                        <div className="text-sm text-gray-900">{previewLead.business || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500">Lead Type</div>
                        <div className="text-sm text-gray-900">{previewLead.leadType || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500">Category</div>
                        <div className="text-sm text-gray-900">{previewLead.category || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500">Sales Status</div>
                        <div className="mt-1">{getStatusBadge(previewLead.salesStatus, 'sales')}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500">Created</div>
                        <div className="text-sm text-gray-900">{previewLead.createdAt || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500">Assigned</div>
                        <div className="text-sm text-gray-900">{previewLead.assigned || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500">Telecaller</div>
                        <div className="text-sm text-gray-900">{previewLead.telecaller || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500">Telecaller Status</div>
                        <div className="mt-1">{getStatusBadge(previewLead.telecallerStatus, 'telecaller')}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500">Payment Status</div>
                        <div className="mt-1">{getStatusBadge(previewLead.paymentStatus, 'payment')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'paymentQuotation' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Overview</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs font-medium text-gray-500">Payment Status</div>
                        <div className="mt-1">{getStatusBadge(previewLead.paymentStatus, 'payment')}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment</h3>
                    <div className="text-sm text-gray-600">No payment information available.</div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Quotation</h3>
                    <div className="text-sm text-gray-600">No quotations available.</div>
                  </div>
                </div>
              )}

              {activeTab === 'meetings' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Overview</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs font-medium text-gray-500">Sales Status</div>
                        <div className="mt-1">{getStatusBadge(previewLead.salesStatus, 'sales')}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500">Telecaller Status</div>
                        <div className="mt-1">{getStatusBadge(previewLead.telecallerStatus, 'telecaller')}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Meeting / Remark</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>Meeting</option>
                          <option>Call</option>
                          <option>Follow-up</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                      <textarea rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Add meeting notes or remarks..."></textarea>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Save</button>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Previous Meetings / Remarks</h4>
                    <div className="text-sm text-gray-600">No meetings or remarks yet.</div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 md:px-8 py-4 border-t border-gray-100 flex items-center justify-end">
              <button
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setShowPreview(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <AddCustomerForm onClose={() => setShowAddCustomer(false)} />
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
