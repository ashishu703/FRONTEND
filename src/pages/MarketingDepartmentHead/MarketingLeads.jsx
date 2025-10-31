import React, { useRef, useState, useEffect } from 'react';
import { Search, Filter, Upload, RefreshCw, User, Mail, Building, Shield, Tag, Clock, Calendar, Phone, CheckCircle, XCircle, Hash, MapPin, Info, Plus, TrendingUp, Target, Users, BarChart3, ChevronDown, Download, UserPlus, X, Package, CreditCard, PhoneCall, FileText, Calendar as CalendarIcon, Edit, Eye, Navigation, Printer, DollarSign, Map, Globe, Settings } from 'lucide-react';
import departmentUsersService, { apiToUiDepartment } from '../../api/admin_api/departmentUsersService';
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
  // Close lightweight popups on outside click
  useEffect(() => {
    const handleGlobalClick = () => {
      setShowImportDropdown(false);
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedLeadForAssignment, setSelectedLeadForAssignment] = useState(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState('');
  const [assignmentDate, setAssignmentDate] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState(null);
  const [selectedLeadForView, setSelectedLeadForView] = useState(null);
  const [activeViewTab, setActiveViewTab] = useState('overview');
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [quotationData, setQuotationData] = useState(null);
  const [showProformaModal, setShowProformaModal] = useState(false);
  const [proformaData, setProformaData] = useState(null);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [showBulkAssignmentModal, setShowBulkAssignmentModal] = useState(false);
  const [selectedLeadsForBulk, setSelectedLeadsForBulk] = useState([]);
  const [bulkAssignmentUser, setBulkAssignmentUser] = useState('');
  const [bulkAssignmentDate, setBulkAssignmentDate] = useState('');
  const [bulkAssignmentNotes, setBulkAssignmentNotes] = useState('');
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [showLeadImportModal, setShowLeadImportModal] = useState(false);
  const [salespersons, setSalespersons] = useState([]);
  const [salespersonsLoading, setSalespersonsLoading] = useState(false);
  const [salespersonsError, setSalespersonsError] = useState('');
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
    gstNo: '',
    area: '',
    division: '',
    state: '',
    customerType: '',
    productType: '',
    address: ''
  });

  // Column visibility chooser
  const defaultVisibleColumns = {
    leadId: true,
    namePhone: true,
    address: true,
    area: true,
    division: true,
    gstNo: true,
    productType: true,
    phone: false,
    email: false,
    state: false,
    customerType: false,
    leadSource: false,
    assignedSalesperson: false,
    followUpStatus: false,
    salesStatus: false,
    connectedStatus: false,
    finalStatus: false,
    expectedValue: false,
    createdAt: false,
    updatedAt: false,
    notes: false
  };
  const [showColumnChooser, setShowColumnChooser] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);

  // Fetch real department users for assignment
  useEffect(() => {
    const fetchSalespersons = async () => {
      try {
        setSalespersonsLoading(true);
        setSalespersonsError('');
        const res = await departmentUsersService.listUsers({ limit: 100, page: 1 });
        const payload = res.data || res;
        const users = (payload.users || []).map(u => ({
          id: u.id,
          name: u.username || u.name || u.email?.split('@')[0] || 'User',
          email: u.email,
          department: apiToUiDepartment ? apiToUiDepartment(u.departmentType || u.department_type) : (u.departmentType || u.department_type || '')
        }));
        setSalespersons(users);
      } catch (e) {
        setSalespersonsError('Failed to load users');
      } finally {
        setSalespersonsLoading(false);
      }
    };
    fetchSalespersons();
  }, []);

  // Available options for dropdowns
  const areas = ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Rewa', 'Satna'];
  const divisions = ['Dewas', 'Raisen', 'Narsinghpur', 'Morena', 'Shajapur', 'Damoh', 'Sidhi', 'Panna'];
  const states = ['Madhya Pradesh', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Chhattisgarh'];
  const leadSources = ['Website Inquiry', 'Social Media', 'Referral', 'Email Campaign', 'Trade Show', 'Cold Call', 'Advertisement'];
  const customerTypes = ['Individual', 'Business', 'Enterprise', 'Startup', 'Government', 'Non-Profit'];
  const productTypes = ['Digital Marketing Package', 'SEO Services', 'Content Marketing', 'PPC Advertising', 'Social Media Marketing', 'Email Marketing'];
  const categories = ['Hot Lead', 'Warm Lead', 'Cold Lead', 'Qualified Lead', 'Unqualified Lead'];
  const salesStatuses = ['PENDING', 'FOLLOW_UP', 'MEETING_SCHEDULED', 'QUOTATION_SENT', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];
  const paymentStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'PARTIAL', 'OVERDUE'];
  const visitingStatuses = ['NOT_SCHEDULED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  const telecallerStatuses = ['ACTIVE', 'INACTIVE', 'BUSY', 'NOT_AVAILABLE'];

  // Sample data for marketing leads
  const leads = [
    {
      id: 1,
      customerId: 'MKT-0001',
      customer: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+91 98765 43210',
      business: 'Tech Solutions Inc',
      address: '123 MG Road, Indore, MP',
      area: 'Indore',
      division: 'Dewas',
      leadSource: 'Website Inquiry',
      productName: 'Digital Marketing Package',
      productType: 'Digital Marketing Package',
      category: 'Hot Lead',
      salesStatus: 'PENDING',
      createdAt: '2024-01-15',
      assigned: 'Sarah Johnson',
      telecaller: 'Mike Wilson',
      telecallerStatus: 'ACTIVE',
      paymentStatus: 'PENDING',
      visitingStatus: 'SCHEDULED',
      gstNo: '29ABCDE1234F1Z5',
      state: 'Madhya Pradesh',
      customerType: 'Individual',
      // Demo payment data
      totalAmount: 25000,
      paidAmount: 10000,
      paymentMethod: 'Bank Transfer',
      paymentDueDate: '2025-11-29',
      paymentHistory: [
        { title: 'Initial Payment', status: 'completed', amount: 10000, method: 'Bank Transfer', date: '2025-10-15' },
        { title: 'Second Payment', status: 'pending', amount: 15000, method: '—', note: 'Due on 2025-11-29' }
      ],
      // Demo quotation & PI
      quotation: {
        quotationNumber: 'ANQ-000458',
        total: 40639200,
        validUpto: '2025-11-29',
        preparedBy: 'Sarah Johnson',
        status: 'Active',
        title: 'Digital Marketing Package - Premium Plan'
      },
      proforma: {
        invoiceNumber: 'PI-2024-001',
        total: 40639200,
        invoiceDate: '2025-10-30',
        generatedBy: 'David Lee',
        status: 'Generated',
        title: 'Electrical Cables & Wires Supply'
      }
    },
    {
      id: 2,
      customerId: 'MKT-0002',
      customer: 'Emily Davis',
      email: 'emily.davis@company.com',
      phone: '+91 87654 32109',
      business: 'Marketing Agency',
      address: '456 Business Park, Bhopal, MP',
      area: 'Bhopal',
      division: 'Raisen',
      leadSource: 'Social Media',
      productName: 'SEO Services',
      productType: 'SEO Services',
      category: 'Warm Lead',
      salesStatus: 'FOLLOW_UP',
      createdAt: '2024-01-16',
      assigned: 'David Lee',
      telecaller: 'Lisa Chen',
      telecallerStatus: 'ACTIVE',
      paymentStatus: 'IN_PROGRESS',
      visitingStatus: 'COMPLETED',
      gstNo: '27FGHIJ5678K2L6',
      state: 'Madhya Pradesh',
      customerType: 'Business',
      totalAmount: 18000,
      paidAmount: 18000,
      paymentMethod: 'UPI',
      paymentDueDate: '2025-10-30',
      paymentHistory: [
        { title: 'Single Payment', status: 'completed', amount: 18000, method: 'UPI', date: '2025-10-15' }
      ],
      quotation: {
        quotationNumber: 'ANQ-000459',
        total: 18000,
        validUpto: '2025-12-15',
        preparedBy: 'David Lee',
        status: 'Active',
        title: 'SEO Services - Monthly'
      },
      proforma: {
        invoiceNumber: 'PI-2024-002',
        total: 18000,
        invoiceDate: '2025-10-16',
        generatedBy: 'Ops Team',
        status: 'Generated',
        title: 'SEO Services Billing'
      }
    },
    {
      id: 3,
      customerId: 'MKT-0003',
      customer: 'Robert Brown',
      email: 'robert.brown@business.com',
      phone: '+91 76543 21098',
      business: 'Manufacturing Co',
      address: '789 Industrial Area, Jabalpur, MP',
      area: 'Jabalpur',
      division: 'Narsinghpur',
      leadSource: 'Referral',
      productName: 'Content Marketing',
      productType: 'Content Marketing',
      category: 'Cold Lead',
      salesStatus: 'PENDING',
      createdAt: '2024-01-17',
      assigned: 'Anna Garcia',
      telecaller: 'Tom Davis',
      telecallerStatus: 'INACTIVE',
      paymentStatus: 'PENDING',
      visitingStatus: 'PENDING',
      gstNo: '24MNOPQ9012R3S7',
      state: 'Madhya Pradesh',
      customerType: 'Enterprise',
      totalAmount: 52000,
      paidAmount: 0,
      paymentMethod: '—',
      paymentDueDate: '2025-12-10',
      paymentHistory: []
    },
    {
      id: 4,
      customerId: 'MKT-0004',
      customer: 'Maria Rodriguez',
      email: 'maria.rodriguez@enterprise.com',
      phone: '+91 65432 10987',
      business: 'Enterprise Solutions',
      address: '321 Tech Hub, Gwalior, MP',
      area: 'Gwalior',
      division: 'Morena',
      leadSource: 'Email Campaign',
      productName: 'PPC Advertising',
      productType: 'PPC Advertising',
      category: 'Hot Lead',
      salesStatus: 'MEETING_SCHEDULED',
      createdAt: '2024-01-18',
      assigned: 'Chris Miller',
      telecaller: 'Emma Taylor',
      telecallerStatus: 'ACTIVE',
      paymentStatus: 'COMPLETED',
      visitingStatus: 'IN_PROGRESS',
      gstNo: '31TUVWX3456Y8Z9',
      state: 'Madhya Pradesh',
      customerType: 'Enterprise',
      totalAmount: 75000,
      paidAmount: 50000,
      paymentMethod: 'NEFT',
      paymentDueDate: '2025-11-20',
      paymentHistory: [
        { title: 'Advance', status: 'completed', amount: 50000, method: 'NEFT', date: '2025-10-10' }
      ]
    },
    {
      id: 5,
      customerId: 'MKT-0005',
      customer: 'James Wilson',
      email: 'james.wilson@startup.com',
      phone: '+91 54321 09876',
      business: 'Startup Ventures',
      address: '654 Innovation Center, Ujjain, MP',
      area: 'Ujjain',
      division: 'Shajapur',
      leadSource: 'Trade Show',
      productName: 'Social Media Marketing',
      productType: 'Social Media Marketing',
      category: 'Warm Lead',
      salesStatus: 'PENDING',
      createdAt: '2024-01-19',
      assigned: 'Alex Johnson',
      telecaller: 'Sarah Smith',
      telecallerStatus: 'ACTIVE',
      paymentStatus: 'PENDING',
      visitingStatus: 'SCHEDULED',
      gstNo: '07ABCD1234E1F2',
      state: 'Madhya Pradesh',
      customerType: 'Startup',
      totalAmount: 32000,
      paidAmount: 8000,
      paymentMethod: 'Cash',
      paymentDueDate: '2025-11-05',
      paymentHistory: [
        { title: 'Booking', status: 'completed', amount: 8000, method: 'Cash', date: '2025-10-12' },
        { title: 'Balance', status: 'pending', amount: 24000, method: '—', note: 'Due on 2025-11-05' }
      ]
    }
  ];

  // Removed sample quotation/proforma constants to avoid hardcoded UI data

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
      const updatedLeads = (leadsData || leads).map(lead => 
        lead.id === selectedLeadForAssignment.id 
          ? { 
              ...lead, 
              assigned: selectedSalesperson,
              assignmentDate: assignmentDate || new Date().toISOString().split('T')[0]
            }
          : lead
      );
      
      // In a real app, you would update the database here
      console.log(`Assigned lead ${selectedLeadForAssignment.customerId} to ${selectedSalesperson} on ${assignmentDate}`);

      // Persist assignment event for calendar consumption (localStorage)
      try {
        const existing = JSON.parse(localStorage.getItem('marketingAssignments') || '[]');
        const salespersonMeta = salespersons.find(u => u.name === selectedSalesperson) || {};
        const event = {
          id: `${selectedLeadForAssignment.id}-${Date.now()}`,
          leadId: selectedLeadForAssignment.id,
          customerId: selectedLeadForAssignment.customerId,
          name: selectedLeadForAssignment.customer,
          phone: selectedLeadForAssignment.phone || '',
          address: selectedLeadForAssignment.address || '',
          productType: selectedLeadForAssignment.productType || selectedLeadForAssignment.productName || '',
          assignedDate: assignmentDate || new Date().toISOString().split('T')[0],
          assignedToName: selectedSalesperson,
          assignedToEmail: salespersonMeta.email || '',
          visitingStatus: 'Scheduled',
          finalStatus: 'Pending'
        };
        const next = Array.isArray(existing) ? [...existing, event] : [event];
        localStorage.setItem('marketingAssignments', JSON.stringify(next));
      } catch {}

      // Help calendar identify current demo salesperson context (non-auth flows)
      try {
        if (salespersonMeta?.email) {
          localStorage.setItem('currentMarketingSalesperson', salespersonMeta.email);
        } else if (selectedSalesperson) {
          localStorage.setItem('currentMarketingSalesperson', selectedSalesperson);
        }
      } catch {}

      // Notify other tabs/components
      try { window.dispatchEvent(new CustomEvent('marketingAssignmentsUpdated')); } catch {}
      
      // Close modal and reset state
      setShowAssignmentModal(false);
      setSelectedLeadForAssignment(null);
      setSelectedSalesperson('');
      setAssignmentDate('');
      
      // Show success message
      alert(`Lead ${selectedLeadForAssignment.customerId} has been assigned to ${selectedSalesperson}${assignmentDate ? ` on ${assignmentDate}` : ''}`);
    }
  };

  const handleSaveLeadDate = () => {
    if (!selectedLeadForAssignment || !assignmentDate) {
      alert('Please choose a date to save.');
      return;
    }

    const updatedLeads = (leadsData || leads).map(lead =>
      lead.id === selectedLeadForAssignment.id
        ? { ...lead, assignmentDate }
        : lead
    );

    setLeadsData(updatedLeads);

    console.log(`Saved assignment date ${assignmentDate} for lead ${selectedLeadForAssignment.customerId}`);
    setShowAssignmentModal(false);
    setSelectedLeadForAssignment(null);
    setAssignmentDate('');
    setSelectedSalesperson('');
    alert(`Saved date ${assignmentDate} for ${selectedLeadForAssignment.customerId}`);
  };

  const handleDeleteLead = (leadId) => {
    // Update the leads data by removing the deleted lead
    setLeadsData(prevData => {
      const currentData = Array.isArray(prevData) ? prevData : leads;
      return currentData.filter(lead => lead.id !== leadId);
    });
    
    // In a real app, you would delete from the database here
    console.log(`Deleted lead with ID: ${leadId}`);
    
    // Show success message
    alert('Lead has been deleted successfully');
  };

  const handleStatusUpdate = (leadId, newStatus, statusType) => {
    // Update the leads data with new status
    setLeadsData(prevData => {
      const currentData = Array.isArray(prevData) ? prevData : leads;
      return currentData.map(lead => 
        lead.id === leadId 
          ? { ...lead, [statusType]: newStatus }
          : lead
      );
    });
    
    // In a real app, you would update the database here
    console.log(`Updated ${statusType} status for lead ${leadId} to ${newStatus}`);
    
    // Close modal
    setShowStatusUpdateModal(false);
    setSelectedLeadForEdit(null);
    
    // Show success message
    alert(`Lead status updated successfully to ${newStatus}`);
  };

  const handleRefresh = () => {
    // Force a re-render by updating the data
    console.log('Marketing Leads refreshed');
    
    // In a real app, you would refetch data from API here
    // For now, we'll just log the refresh action
    alert('Leads data refreshed successfully!');
  };

  // Clear all filters
  const clearAllFilters = () => {
    setColumnFilters({
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
      gstNo: '',
      area: '',
      division: '',
      state: '',
      customerType: '',
      productType: '',
      address: ''
    });
    setSearchTerm('');
    setShowColumnFilters(false);
  };

  // Bulk assignment functions
  const toggleBulkAssignment = () => {
    setShowCheckboxes(!showCheckboxes);
    if (showCheckboxes) {
      setSelectedLeadsForBulk([]);
    }
  };

  const handleBulkSelectLead = (leadId) => {
    if (selectedLeadsForBulk.includes(leadId)) {
      setSelectedLeadsForBulk(selectedLeadsForBulk.filter(id => id !== leadId));
    } else {
      setSelectedLeadsForBulk([...selectedLeadsForBulk, leadId]);
    }
  };

  const handleSelectAllLeads = () => {
    const currentLeads = leadsData || leads;
    if (selectedLeadsForBulk.length === currentLeads.length) {
      setSelectedLeadsForBulk([]);
    } else {
      setSelectedLeadsForBulk(currentLeads.map(lead => lead.id));
    }
  };

  const openBulkAssignmentModal = () => {
    if (selectedLeadsForBulk.length === 0) {
      alert('Please select at least one lead to assign.');
      return;
    }
    setShowBulkAssignmentModal(true);
  };

  const handleBulkAssignLeads = () => {
    if (!bulkAssignmentUser) {
      alert('Please select a user to assign leads to.');
      return;
    }

    // Update the leads with bulk assignment
    const updatedLeads = (leadsData || leads).map(lead => {
      if (selectedLeadsForBulk.includes(lead.id)) {
        return {
          ...lead,
          assigned: bulkAssignmentUser,
          assignmentDate: lead.assignmentDate || bulkAssignmentDate || undefined,
          assignmentNotes: bulkAssignmentNotes,
          salesStatus: 'ASSIGNED'
        };
      }
      return lead;
    });

    setLeadsData(updatedLeads);

    // Persist assignment events for calendar (localStorage)
    try {
      const existing = JSON.parse(localStorage.getItem('marketingAssignments') || '[]');
      const salespersonMeta = salespersons.find(u => u.name === bulkAssignmentUser) || {};
      const baseLeads = leadsData || leads;
      const eventsToAdd = baseLeads
        .filter(l => selectedLeadsForBulk.includes(l.id))
        .map(l => ({
          id: `${l.id}-${Date.now()}`,
          leadId: l.id,
          customerId: l.customerId,
          name: l.customer,
          phone: l.phone || '',
          address: l.address || '',
          productType: l.productType || l.productName || '',
          assignedDate: l.assignmentDate || bulkAssignmentDate || new Date().toISOString().split('T')[0],
          assignedToName: bulkAssignmentUser,
          assignedToEmail: salespersonMeta.email || '',
          visitingStatus: 'Scheduled',
          finalStatus: 'Pending'
        }));
      const next = Array.isArray(existing) ? [...existing, ...eventsToAdd] : eventsToAdd;
      localStorage.setItem('marketingAssignments', JSON.stringify(next));
    } catch {}

    // Help calendar identify current demo salesperson context (non-auth flows)
    try {
      if (salespersonMeta?.email) {
        localStorage.setItem('currentMarketingSalesperson', salespersonMeta.email);
      } else if (bulkAssignmentUser) {
        localStorage.setItem('currentMarketingSalesperson', bulkAssignmentUser);
      }
    } catch {}

    // Notify other tabs/components
    try { window.dispatchEvent(new CustomEvent('marketingAssignmentsUpdated')); } catch {}

    // Log the bulk assignment
    console.log(`Bulk assigned ${selectedLeadsForBulk.length} leads to ${bulkAssignmentUser} for ${bulkAssignmentDate}`);

    // Close modal and reset state
    setShowBulkAssignmentModal(false);
    setSelectedLeadsForBulk([]);
    setBulkAssignmentUser('');
    setBulkAssignmentDate('');
    setBulkAssignmentNotes('');
    setShowCheckboxes(false);

    // Show success message
    alert(`Successfully assigned ${selectedLeadsForBulk.length} leads to ${bulkAssignmentUser}`);
  };

  const closeBulkAssignmentModal = () => {
    setShowBulkAssignmentModal(false);
    setBulkAssignmentUser('');
    setBulkAssignmentDate('');
    setBulkAssignmentNotes('');
  };

  const closeAssignmentModal = () => {
    setShowAssignmentModal(false);
    setSelectedLeadForAssignment(null);
    setSelectedSalesperson('');
    setAssignmentDate('');
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
          <span className={`${baseClasses} text-[10px] px-2 py-0.5 min-w-[90px] ${
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
      (lead.business || '').toLowerCase().includes(t) ||
      (lead.phone || '').toLowerCase().includes(t) ||
      (lead.address || '').toLowerCase().includes(t) ||
      (lead.area || '').toLowerCase().includes(t) ||
      (lead.division || '').toLowerCase().includes(t) ||
      (lead.customerId || '').toLowerCase().includes(t)
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
      (!cf.gstNo || includes(lead.gstNo, cf.gstNo)) &&
      (!cf.area || includes(lead.area, cf.area)) &&
      (!cf.division || includes(lead.division, cf.division)) &&
      (!cf.state || includes(lead.state, cf.state)) &&
      (!cf.customerType || includes(lead.customerType, cf.customerType)) &&
      (!cf.productType || includes(lead.productType, cf.productType)) &&
      (!cf.address || includes(lead.address, cf.address))
    );
  };

  const filteredLeads = importedLeads.filter(lead => matchesGlobal(lead) && matchesColumnFilters(lead));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">


      {/* Search and Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          {/* Left: Search */}
          <div className="flex items-center gap-3 w-full max-w-xl">
            <div className="relative w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, phone, address, area, division, or lead ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-1.5 rounded-full bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-inner"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <button
                className={`p-2 rounded-lg transition-colors ${
                  showColumnFilters 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setShowColumnFilters(!showColumnFilters)}
                title="Toggle Filters"
              >
                <Filter className="w-4 h-4" />
              </button>
              {showColumnFilters && (
                <button
                  className="px-3 py-2 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  onClick={clearAllFilters}
                  title="Clear All Filters"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showCheckboxes 
                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={toggleBulkAssignment}
                title="Toggle Bulk Assignment"
              >
                Assign Leads
              </button>
              {showCheckboxes && selectedLeadsForBulk.length > 0 && (
                <button
                  className="px-3 py-2 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  onClick={openBulkAssignmentModal}
                  title="Assign Selected Leads"
                >
                  Assign ({selectedLeadsForBulk.length})
                </button>
              )}
            </div>
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
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-200">
              {showColumnFilters && (
                <tr className="bg-blue-50">
                  <th className="px-6 py-2">
                    {showCheckboxes ? (
                      <input
                        type="checkbox"
                        checked={selectedLeadsForBulk.length === (leadsData || leads).length && (leadsData || leads).length > 0}
                        onChange={handleSelectAllLeads}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="Filter by ID..."
                        value={columnFilters.customerId}
                        onChange={(e) => setColumnFilters(prev => ({ ...prev, customerId: e.target.value }))}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    )}
                  </th>
                  <th className="px-6 py-2">
                    <input
                      type="text"
                      placeholder="Filter customer"
                      value={columnFilters.customer}
                      onChange={(e) => setColumnFilters(prev => ({ ...prev, customer: e.target.value }))}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-2">
                    <input
                      type="text"
                      placeholder="Filter address"
                      value={columnFilters.address}
                      onChange={(e) => setColumnFilters(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-2">
                    <select
                      value={columnFilters.area}
                      onChange={(e) => setColumnFilters(prev => ({ ...prev, area: e.target.value }))}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">All Areas</option>
                      {areas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </th>
                  <th className="px-6 py-2">
                    <select
                      value={columnFilters.division}
                      onChange={(e) => setColumnFilters(prev => ({ ...prev, division: e.target.value }))}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">All Divisions</option>
                      {divisions.map(division => (
                        <option key={division} value={division}>{division}</option>
                      ))}
                    </select>
                  </th>
                  <th className="px-6 py-2">
                    <input
                      type="text"
                      placeholder="Filter GST"
                      value={columnFilters.gstNo}
                      onChange={(e) => setColumnFilters(prev => ({ ...prev, gstNo: e.target.value }))}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-2">
                    <select
                      value={columnFilters.productType}
                      onChange={(e) => setColumnFilters(prev => ({ ...prev, productType: e.target.value }))}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">All Products</option>
                      {productTypes.map(productType => (
                        <option key={productType} value={productType}>{productType}</option>
                      ))}
                    </select>
                  </th>
                  <th className="px-6 py-2">
                    {/* Action - No filter */}
                  </th>
                </tr>
              )}
              
              {/* Header Row */}
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: showCheckboxes ? '50px' : '100px', minWidth: showCheckboxes ? '50px' : '100px', display: visibleColumns.leadId ? '' : 'none'}}>
                  {showCheckboxes ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedLeadsForBulk.length === (leadsData || leads).length && (leadsData || leads).length > 0}
                        onChange={handleSelectAllLeads}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4 text-purple-600" />
                      <span>LEAD ID</span>
                    </div>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '200px', minWidth: '200px', display: visibleColumns.namePhone ? '' : 'none'}}>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>NAME & PHONE</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '250px', minWidth: '250px', display: visibleColumns.address ? '' : 'none'}}>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>ADDRESS</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '140px', minWidth: '140px', display: visibleColumns.area ? '' : 'none'}}>
                  <div className="flex items-center space-x-2">
                    <Map className="w-4 h-4 text-green-600" />
                    <span>AREA</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '140px', minWidth: '140px', display: visibleColumns.division ? '' : 'none'}}>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-green-600" />
                    <span>DIVISION</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '150px', minWidth: '150px', display: visibleColumns.gstNo ? '' : 'none'}}>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>GST NO.</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '150px', minWidth: '150px', display: visibleColumns.productType ? '' : 'none'}}>
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-purple-600" />
                    <span>PRODUCT TYPE</span>
                  </div>
                </th>
                {/* Extra selectable columns */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{display: visibleColumns.phone ? '' : 'none'}}>
                  <span>PHONE</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{display: visibleColumns.email ? '' : 'none'}}>
                  <span>EMAIL</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{display: visibleColumns.state ? '' : 'none'}}>
                  <span>STATE</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{display: visibleColumns.customerType ? '' : 'none'}}>
                  <span>CUSTOMER TYPE</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{display: visibleColumns.leadSource ? '' : 'none'}}>
                  <span>LEAD SOURCE</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{display: visibleColumns.assignedSalesperson ? '' : 'none'}}>
                  <span>ASSIGNED SALESPERSON</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{display: visibleColumns.followUpStatus ? '' : 'none'}}>
                  <span>FOLLOW UP STATUS</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{display: visibleColumns.salesStatus ? '' : 'none'}}>
                  <span>SALES STATUS</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{display: visibleColumns.connectedStatus ? '' : 'none'}}>
                  <span>CONNECTED STATUS</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{display: visibleColumns.finalStatus ? '' : 'none'}}>
                  <span>FINAL STATUS</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{display: visibleColumns.expectedValue ? '' : 'none'}}>
                  <span>EXPECTED VALUE</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{display: visibleColumns.createdAt ? '' : 'none'}}>
                  <span>CREATED AT</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{display: visibleColumns.updatedAt ? '' : 'none'}}>
                  <span>UPDATED AT</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{display: visibleColumns.notes ? '' : 'none'}}>
                  <span>NOTES</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '120px', minWidth: '120px'}}>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowColumnChooser(true)}
                      className="ml-2 p-1 rounded hover:bg-gray-100"
                      title="Column Filter"
                    >
                      <Settings className="w-4 h-4 text-gray-600" />
                    </button>
                    <span>ACTION</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50" 
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}>
                  <td className="px-6 py-4 whitespace-nowrap" style={{display: visibleColumns.leadId ? '' : 'none'}}>
                    {showCheckboxes ? (
                      <input
                        type="checkbox"
                        checked={selectedLeadsForBulk.includes(lead.id)}
                        onChange={() => handleBulkSelectLead(lead.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-900">{lead.customerId}</span>
                    )}
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{display: visibleColumns.namePhone ? '' : 'none'}}>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.customer}</div>
                        <div className="text-sm text-gray-500">{lead.phone}</div>
                        <div className="flex space-x-3 mt-1">
                          <span 
                            className="text-xs text-green-600 cursor-pointer hover:text-green-800 transition-colors"
                            onClick={() => {
                              const phoneNumber = lead.phone.replace(/\D/g, '');
                              window.open(`https://wa.me/${phoneNumber}`, '_blank');
                            }}
                            title="Click to open WhatsApp"
                          >
                            WhatsApp
                          </span>
                          <span 
                            className="text-xs text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
                            onClick={() => {
                              window.open(`mailto:${lead.email || 'contact@example.com'}`, '_blank');
                            }}
                            title="Click to open Email"
                          >
                            Email
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs" style={{display: visibleColumns.address ? '' : 'none'}}>
                      <div className="truncate">{lead.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{display: visibleColumns.area ? '' : 'none'}}>
                      {lead.area || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{display: visibleColumns.division ? '' : 'none'}}>
                      {lead.division || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{display: visibleColumns.gstNo ? '' : 'none'}}>
                      {lead.gstNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{display: visibleColumns.productType ? '' : 'none'}}>
                      {lead.productType}
                    </td>
                    {/* Extra selectable cells */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{display: visibleColumns.phone ? '' : 'none'}}>
                      {lead.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{display: visibleColumns.email ? '' : 'none'}}>
                      {lead.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{display: visibleColumns.state ? '' : 'none'}}>
                      {lead.state || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{display: visibleColumns.customerType ? '' : 'none'}}>
                      {lead.customerType || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{display: visibleColumns.leadSource ? '' : 'none'}}>
                      {lead.leadSource || lead.source || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{display: visibleColumns.assignedSalesperson ? '' : 'none'}}>
                      {lead.assignedSalesperson || lead.assignedTo || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{display: visibleColumns.followUpStatus ? '' : 'none'}}>
                      {lead.followUpStatus || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{display: visibleColumns.salesStatus ? '' : 'none'}}>
                      {lead.salesStatus || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{display: visibleColumns.connectedStatus ? '' : 'none'}}>
                      {lead.connectedStatus || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{display: visibleColumns.finalStatus ? '' : 'none'}}>
                      {lead.finalStatus || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{display: visibleColumns.expectedValue ? '' : 'none'}}>
                      {lead.expectedValue != null ? lead.expectedValue : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{display: visibleColumns.createdAt ? '' : 'none'}}>
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{display: visibleColumns.updatedAt ? '' : 'none'}}>
                      {lead.updatedAt ? new Date(lead.updatedAt).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{display: visibleColumns.notes ? '' : 'none'}}>
                      {lead.notes || lead.remark || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        {lead.assigned && lead.assigned !== 'Unassigned' ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200" title={`Assigned to ${lead.assigned}`}>
                            Assigned
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200" title="Not Assigned">
                            Unassigned
                          </span>
                        )}
                        <button 
                          onClick={() => {
                            console.log('Opening view modal for lead:', lead);
                            setSelectedLeadForView(lead);
                            setShowViewModal(true);
                            setActiveViewTab('overview');
                          }}
                          className="w-8 h-8 rounded-full border-2 border-blue-500 bg-white hover:bg-blue-50 transition-colors flex items-center justify-center"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                        <button 
                          onClick={() => {
                            console.log('Opening edit modal for lead:', lead);
                            setSelectedLeadForEdit(lead);
                            setShowEditModal(true);
                          }}
                          className="w-8 h-8 rounded-full border-2 border-orange-500 bg-white hover:bg-orange-50 transition-colors flex items-center justify-center"
                          title="Edit Lead"
                        >
                          <Edit className="w-4 h-4 text-orange-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No leads found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    {/* Column Chooser Modal */}
    {showColumnChooser && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30" onClick={() => setShowColumnChooser(false)}></div>
        <div className="relative bg-white w-full max-w-sm mx-4 rounded-lg shadow-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Column Filter</h3>
            <button className="p-1 rounded hover:bg-gray-100" onClick={() => setShowColumnChooser(false)} title="Close">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-3">Show/Hide Columns</p>
          <div className="max-h-72 overflow-y-auto pr-1">
            {[
              { key: 'leadId', label: 'Customer ID' },
              { key: 'namePhone', label: 'Customer' },
              { key: 'address', label: 'Address' },
              { key: 'area', label: 'Area' },
              { key: 'division', label: 'Division' },
              { key: 'gstNo', label: 'GST No.' },
              { key: 'productType', label: 'Product Type' },
              { key: 'phone', label: 'Phone' },
              { key: 'email', label: 'Email' },
              { key: 'state', label: 'State' },
              { key: 'customerType', label: 'Customer Type' },
              { key: 'leadSource', label: 'Lead Source' },
              { key: 'assignedSalesperson', label: 'Assigned Salesperson' },
              { key: 'followUpStatus', label: 'Follow Up Status' },
              { key: 'salesStatus', label: 'Sales Status' },
              { key: 'connectedStatus', label: 'Connected Status' },
              { key: 'finalStatus', label: 'Final Status' },
              { key: 'expectedValue', label: 'Expected Value' },
              { key: 'createdAt', label: 'Created At' },
              { key: 'updatedAt', label: 'Updated At' },
              { key: 'notes', label: 'Notes' }
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between py-2 text-sm">
                <span className="text-gray-800">{label}</span>
                <input
                  type="checkbox"
                  checked={!!visibleColumns[key]}
                  onChange={(e) => setVisibleColumns(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="space-x-2">
              <button
                className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
                onClick={() => setVisibleColumns(defaultVisibleColumns)}
              >
                Reset
              </button>
              <button
                className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
                onClick={() => setVisibleColumns(Object.keys(defaultVisibleColumns).reduce((a,k)=>({ ...a, [k]: true}), {}))}
              >
                Show All
              </button>
            </div>
            <button
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setShowColumnChooser(false)}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    )}

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeAssignmentModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
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
                  Select Salesperson (optional)
                </label>
                <select
                  value={selectedSalesperson}
                  onChange={(e) => setSelectedSalesperson(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{salespersonsLoading ? 'Loading users...' : 'Skip for now'}</option>
                  {salespersonsError && <option value="" disabled>{salespersonsError}</option>}
                  {salespersons.map((salesperson) => (
                    <option key={salesperson.id} value={salesperson.name}>
                      {salesperson.name} {salesperson.department ? `- ${salesperson.department}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Date
                </label>
                <input
                  type="date"
                  value={assignmentDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setAssignmentDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeAssignmentModal}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLeadDate}
                  disabled={!assignmentDate}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Save Date
                </button>
                <button
                  onClick={handleAssignLead}
                  disabled={!selectedSalesperson}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Assign Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Drawer (Right Sidebar) */}
      {showViewModal && selectedLeadForView && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={closeViewModal}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl border-l border-gray-200 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Lead Details - {selectedLeadForView.customerId || selectedLeadForView.id}</h3>
              <button onClick={closeViewModal} className="text-gray-400 hover:text-gray-600 transition-colors" title="Close">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {/* Tab Navigation */}
              <div className="grid grid-cols-4 gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveViewTab('overview')}
                  className={`w-full text-center px-3 py-1.5 text-xs whitespace-nowrap font-medium rounded-md transition-colors ${
                    activeViewTab === 'overview'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveViewTab('payment')}
                  className={`w-full text-center px-3 py-1.5 text-xs whitespace-nowrap font-medium rounded-md transition-colors ${
                    activeViewTab === 'payment'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Payment Status
                </button>
                <button
                  onClick={() => setActiveViewTab('docs')}
                  className={`w-full text-center px-3 py-1.5 text-xs whitespace-nowrap font-medium rounded-md transition-colors ${
                    activeViewTab === 'docs'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Quotation & PI
                </button>
                <button
                  onClick={() => setActiveViewTab('meetings')}
                  className={`w-full text-center px-3 py-1.5 text-xs whitespace-nowrap font-medium rounded-md transition-colors ${
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

                    {/* Payment Summary Cards - stacked with wrapping */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                       <div className="text-xs text-gray-600">Total Amount</div>
                         <div className="text-lg font-semibold text-gray-900 mt-1">₹{(selectedLeadForView?.paymentTotal || selectedLeadForView?.totalAmount || 0).toLocaleString?.() || (selectedLeadForView?.paymentTotal || selectedLeadForView?.totalAmount || 0)}</div>
                        <div className="text-xs text-gray-600 mt-2 flex items-center gap-2">
                          <span>Status</span>
                          <span className="text-[10px] leading-none">{getStatusBadge(selectedLeadForView.paymentStatus, 'payment')}</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                         <div className="text-xs text-gray-600">Paid Amount</div>
                         <div className="text-lg font-semibold text-green-600 mt-1">₹{(selectedLeadForView?.paidAmount || 0).toLocaleString?.() || (selectedLeadForView?.paidAmount || 0)}</div>
                        <div className="text-xs text-gray-600 mt-2">
                           Method <span className="text-gray-900">{selectedLeadForView?.paymentMethod || '—'}</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                         <div className="text-xs text-gray-600">Pending Amount</div>
                         <div className="text-lg font-semibold text-orange-600 mt-1">₹{(() => {
                           const total = selectedLeadForView?.paymentTotal ?? selectedLeadForView?.totalAmount ?? 0;
                           const paid = selectedLeadForView?.paidAmount ?? 0;
                           const pending = selectedLeadForView?.pendingAmount ?? Math.max(total - paid, 0);
                           return pending.toLocaleString?.() || pending;
                         })()}</div>
                        <div className="text-xs text-gray-600 mt-2">
                           Due Date <span className="text-gray-900">{selectedLeadForView?.paymentDueDate || '—'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment History */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-4">Payment History</h5>
                      <div className="space-y-3">
                        {(selectedLeadForView?.paymentHistory || []).length === 0 ? (
                          <div className="text-sm text-gray-600">No payment history available</div>
                        ) : (
                          (selectedLeadForView.paymentHistory).map((row, idx) => (
                            <div key={idx} className={`flex items-center justify-between p-3 border rounded-lg ${row.status === 'completed' ? 'bg-green-50 border-green-200' : row.status === 'pending' ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${row.status === 'completed' ? 'bg-green-500' : row.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
                                <div>
                                  <p className="font-medium text-gray-900">{row.title || 'Payment'}</p>
                                  <p className="text-sm text-gray-600">{row.note || row.date || ''}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`font-semibold ${row.status === 'completed' ? 'text-green-600' : row.status === 'pending' ? 'text-orange-600' : 'text-gray-700'}`}>₹{(row.amount || 0).toLocaleString?.() || (row.amount || 0)}</p>
                                <p className="text-sm text-gray-600">{row.method || '—'}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quotation & PI removed from Payment tab; now shown under Docs tab only */}
                </div>
              )}

              {activeViewTab === 'docs' && (
                <div className="space-y-6">
                   {/* Active Quotation Section */}
                   <div className="bg-white border border-gray-200 rounded-lg p-4">
                     <h5 className="font-semibold text-gray-900 mb-3">Active Quotation</h5>
                     {selectedLeadForView?.quotation ? (
                       <div className="space-y-3">
                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
                           <div>
                             <span className="text-sm font-medium text-gray-900">Quotation #{selectedLeadForView.quotation.quotationNumber || selectedLeadForView.quotation.number}</span>
                             <p className="text-sm text-gray-600">{selectedLeadForView.quotation.title || '—'}</p>
                           </div>
                           <span className="text-sm font-medium text-green-600">₹{(selectedLeadForView.quotation.total || 0).toLocaleString?.() || (selectedLeadForView.quotation.total || 0)}{selectedLeadForView.quotation.status ? ` - ${selectedLeadForView.quotation.status}` : ''}</span>
                         </div>
                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
                           <div>
                             <span className="text-sm text-gray-600">Valid Until: {selectedLeadForView.quotation.validUpto || '—'}</span>
                             <p className="text-sm text-gray-600">Prepared by: {selectedLeadForView.quotation.preparedBy || '—'}</p>
                           </div>
                           <div className="flex gap-2">
                             <button
                               onClick={() => { setQuotationData(selectedLeadForView.quotation); setShowQuotationModal(true); }}
                               className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                             >
                               View Quotation
                             </button>
                           </div>
                         </div>
                       </div>
                     ) : (
                       <div className="text-sm text-gray-600">No quotation available</div>
                     )}
                   </div>

                   {/* Proforma Invoice Section */}
                   <div className="bg-white border border-gray-200 rounded-lg p-4">
                     <h5 className="font-semibold text-gray-900 mb-3">Proforma Invoice</h5>
                     {selectedLeadForView?.proforma ? (
                       <div className="space-y-3">
                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
                           <div>
                             <span className="text-sm font-medium text-gray-900">Invoice #{selectedLeadForView.proforma.invoiceNumber || selectedLeadForView.proforma.number}</span>
                             <p className="text-sm text-gray-600">{selectedLeadForView.proforma.title || '—'}</p>
                           </div>
                           <span className="text-sm font-medium text-blue-600">₹{(selectedLeadForView.proforma.total || 0).toLocaleString?.() || (selectedLeadForView.proforma.total || 0)}{selectedLeadForView.proforma.status ? ` - ${selectedLeadForView.proforma.status}` : ''}</span>
                         </div>
                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
                           <div>
                             <span className="text-sm text-gray-600">Invoice Date: {selectedLeadForView.proforma.invoiceDate || '—'}</span>
                             <p className="text-sm text-gray-600">Generated by: {selectedLeadForView.proforma.generatedBy || '—'}</p>
                           </div>
                           <div className="flex gap-2">
                             <button
                               onClick={() => { setProformaData(selectedLeadForView.proforma); setShowProformaModal(true); }}
                               className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                             >
                               View PI
                             </button>
                           </div>
                         </div>
                       </div>
                     ) : (
                       <div className="text-sm text-gray-600">No proforma invoice available</div>
                     )}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeEditModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Edit Lead - {selectedLeadForEdit.customerId || selectedLeadForEdit.id}</h3>
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

      {/* Status Update Modal */}
      {showStatusUpdateModal && selectedLeadForEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Update Lead Status - {selectedLeadForEdit.customerId || selectedLeadForEdit.id}</h3>
                <button
                  onClick={() => {
                    setShowStatusUpdateModal(false);
                    setSelectedLeadForEdit(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sales Status</label>
                  <select
                    defaultValue={selectedLeadForEdit.salesStatus}
                    onChange={(e) => handleStatusUpdate(selectedLeadForEdit.id, e.target.value, 'salesStatus')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="FOLLOW_UP">Follow Up</option>
                    <option value="MEETING_SCHEDULED">Meeting Scheduled</option>
                    <option value="QUOTATION_SENT">Quotation Sent</option>
                    <option value="NEGOTIATION">Negotiation</option>
                    <option value="CLOSED_WON">Closed Won</option>
                    <option value="CLOSED_LOST">Closed Lost</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visiting Status</label>
                  <select
                    defaultValue={selectedLeadForEdit.visitingStatus}
                    onChange={(e) => handleStatusUpdate(selectedLeadForEdit.id, e.target.value, 'visitingStatus')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="NOT_SCHEDULED">Not Scheduled</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <select
                    defaultValue={selectedLeadForEdit.paymentStatus}
                    onChange={(e) => handleStatusUpdate(selectedLeadForEdit.id, e.target.value, 'paymentStatus')}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telecaller Status</label>
                  <select
                    defaultValue={selectedLeadForEdit.telecallerStatus}
                    onChange={(e) => handleStatusUpdate(selectedLeadForEdit.id, e.target.value, 'telecallerStatus')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="BUSY">Busy</option>
                    <option value="NOT_AVAILABLE">Not Available</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowStatusUpdateModal(false);
                    setSelectedLeadForEdit(null);
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowQuotationModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
      {/* Bulk Assignment Modal */}
      {showBulkAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeBulkAssignmentModal}>
          <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Assign Leads ({selectedLeadsForBulk.length})
              </h3>
              <button
                onClick={closeBulkAssignmentModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* User Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign to Salesperson *
                </label>
                <select
                  value={bulkAssignmentUser}
                  onChange={(e) => setBulkAssignmentUser(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{salespersonsLoading ? 'Loading users...' : 'Select Salesperson'}</option>
                  {salespersonsError && <option value="" disabled>{salespersonsError}</option>}
                  {salespersons.map(salesperson => (
                    <option key={salesperson.id} value={salesperson.name}>
                      {salesperson.name} {salesperson.department ? `- ${salesperson.department}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignment Date (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Date (optional)
                </label>
                <input
                  type="date"
                  value={bulkAssignmentDate}
                  onChange={(e) => setBulkAssignmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Assignment Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={bulkAssignmentNotes}
                  onChange={(e) => setBulkAssignmentNotes(e.target.value)}
                  placeholder="Add instructions for the salesperson..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={closeBulkAssignmentModal}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAssignLeads}
                disabled={!bulkAssignmentUser}
                className="px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Assign {selectedLeadsForBulk.length} Leads
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingLeads;
