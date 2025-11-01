"use client"

import React from "react"

// Convert number to words (Indian system)
function numberToWords(num) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  const scales = ['', 'Thousand', 'Lakh', 'Crore']

  if (!num || num === 0) return 'Zero'

  function convertHundreds(n) {
    let result = ''
    if (n > 99) {
      result += ones[Math.floor(n / 100)] + ' Hundred '
      n %= 100
    }
    if (n > 19) {
      result += tens[Math.floor(n / 10)] + ' '
      n %= 10
    } else if (n > 9) {
      result += teens[n - 10] + ' '
      return result
    }
    if (n > 0) {
      result += ones[n] + ' '
    }
    return result
  }

  let result = ''
  let scaleIndex = 0
  while (num > 0) {
    if (num % 1000 !== 0) {
      const chunk = num % 1000
      const chunkWords = convertHundreds(chunk)
      if (chunkWords.trim()) {
        result = chunkWords + scales[scaleIndex] + ' ' + result
      }
    }
    num = Math.floor(num / 1000)
    scaleIndex++
  }
  return result.trim()
}
import apiClient from '../../utils/apiClient'
import { API_ENDPOINTS } from '../../api/admin_api/api'
import quotationService from '../../api/admin_api/quotationService'
import paymentService from '../../api/admin_api/paymentService'
import { Search, RefreshCw, User, Mail, Building2, Pencil, Eye, Plus, Download, Filter, Wallet, MessageCircle, Package, MapPin, Map, BadgeCheck, XCircle, FileText, Globe, X, Clock, Check, Clock as ClockIcon, ArrowRightLeft, Upload, Send, Trash2 } from "lucide-react"
import html2pdf from 'html2pdf.js'
import Quotation from './salespersonquotation.jsx'
// using html2pdf.js (already imported above); no direct html2canvas/jsPDF imports needed
import AddCustomerForm from './salespersonaddcustomer.jsx'
import CreateQuotationForm from './salespersoncreatequotation.jsx'
import { CorporateStandardInvoice } from './salespersonpi'
import { useSharedData } from './SharedDataContext'
import QuotationPreview from "../../components/QuotationPreview"

function cx(...classes) {
  return classes.filter(Boolean).join(" ")
}

function Card({ className, children }) {
  return <div className={cx("rounded-lg border bg-white", className)}>{children}</div>
}

function CardContent({ className, children }) {
  return <div className={cx("p-0", className)}>{children}</div>
}

export default function CustomerListContent({ isDarkMode = false }) {
  const { customers, setCustomers, updateCustomer, addCustomer, deleteCustomer } = useSharedData()
  
  // Demo user data
  const user = {
    username: 'Abhay',
    email: 'abhay@anocab.com',
    name: 'Abhay'
  }
  
  // Debug: Log user data
  console.log('User data:', user)
  const [viewingCustomer, setViewingCustomer] = React.useState(null)
  const [modalTab, setModalTab] = React.useState('details')
  const [showAddCustomer, setShowAddCustomer] = React.useState(false)
  const [showCreateQuotation, setShowCreateQuotation] = React.useState(false)
  const [selectedCustomerForQuotation, setSelectedCustomerForQuotation] = React.useState(null)
  const [showCreatePI, setShowCreatePI] = React.useState(false)
  const [selectedCustomerForPI, setSelectedCustomerForPI] = React.useState(null)
  const [showFollowUpPicker, setShowFollowUpPicker] = React.useState(null) // lead id or null
  const [piData, setPiData] = React.useState(null)
  const [showPIPreview, setShowPIPreview] = React.useState(false)
  const [piFormData, setPiFormData] = React.useState({
    items: [{
      id: 1,
      description: '',
      subDescription: '',
      hsn: '76141000',
      dueOn: new Date().toISOString().split('T')[0],
      quantity: 1,
      unit: 'MTR',
      rate: 0,
      amount: 0
    }],
    discountRate: 0,
    customer: {
      business: '',
      address: '',
      phone: '',
      gstNo: '',
      state: ''
    }
  })
  const [quotationData, setQuotationData] = React.useState(null)
  const [lastQuotationData, setLastQuotationData] = React.useState(null)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  // Fetch quotations for the currently viewed customer (DB-backed) on open/refresh
  React.useEffect(() => {
    let ignore = false
    async function loadCustomerQuotations() {
      try {
        if (!viewingCustomer || !viewingCustomer.id) return
        console.log('Loading quotations for customer:', viewingCustomer.id);
        const res = await quotationService.getQuotationsByCustomer(viewingCustomer.id)
        console.log('Quotations API response:', res);
        
        if (!ignore && res && res.success) {
          const normalized = (res.data || []).map(q => ({
            id: q.id,
            quotationNumber: q.quotation_number,
            customerId: q.customer_id,
            quotationDate: q.quotation_date,
            total: q.total_amount,
            status: q.status,
            createdAt: q.created_at,
            items: q.items || []
          }))
          console.log('Normalized quotations with statuses:', normalized);
          setQuotations(normalized)
        }
      } catch (e) {
        console.error('Failed to load customer quotations:', e)
      }
    }
    loadCustomerQuotations()
    return () => { ignore = true }
  }, [viewingCustomer?.id, isRefreshing])

  // Auto-refresh quotations every 10 seconds to get status updates from department head
  React.useEffect(() => {
    if (!viewingCustomer || !viewingCustomer.id) return
    
    const interval = setInterval(async () => {
      try {
        console.log('Auto-refreshing quotations for status updates...');
        const res = await quotationService.getQuotationsByCustomer(viewingCustomer.id)
        if (res && res.success) {
          const normalized = (res.data || []).map(q => ({
            id: q.id,
            quotationNumber: q.quotation_number,
            customerId: q.customer_id,
            quotationDate: q.quotation_date,
            total: q.total_amount,
            status: q.status,
            createdAt: q.created_at,
            items: q.items || []
          }))
          
          setQuotations(prev => {
            // Check if any status has changed
            const hasChanges = normalized.some(newQ => {
              const oldQ = prev.find(p => p.id === newQ.id)
              return !oldQ || oldQ.status !== newQ.status
            })
            
            if (hasChanges) {
              console.log('Status changes detected:', normalized);
              
              // Show notification for status changes
              normalized.forEach(newQ => {
                const oldQ = prev.find(p => p.id === newQ.id)
                if (oldQ && oldQ.status !== newQ.status) {
                  if (newQ.status === 'approved') {
                    alert(`✅ Quotation ${newQ.quotationNumber} has been APPROVED by Department Head!`)
                  } else if (newQ.status === 'rejected') {
                    alert(`❌ Quotation ${newQ.quotationNumber} has been REJECTED by Department Head!`)
                  }
                }
              })
              
              return normalized
            }
            return prev
          })
        }
      } catch (e) {
        console.error('Auto-refresh failed:', e)
      }
    }, 10000) // 10 seconds
    
    return () => clearInterval(interval)
  }, [viewingCustomer?.id])
  const [editingCustomer, setEditingCustomer] = React.useState(null)
  const [showFilters, setShowFilters] = React.useState(false)
  // Payment related state
  const [showPaymentDetails, setShowPaymentDetails] = React.useState(false)
  const [showAddPaymentModal, setShowAddPaymentModal] = React.useState(false)
  const [selectedCustomer, setSelectedCustomer] = React.useState(null)
  const [addPaymentForm, setAddPaymentForm] = React.useState({
    quotationId: '',
    piId: '',
    amount: '',
    paymentMethod: 'Cash',
    paymentDate: new Date().toISOString().split('T')[0],
    reference: '',
    remarks: ''
  })
  const [paymentHistory, setPaymentHistory] = React.useState([
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
  ])
  const [totalAmount, setTotalAmount] = React.useState(90000)
  const [selectedPayment, setSelectedPayment] = React.useState(null)
  
  // Company branch configuration
  const [selectedBranch, setSelectedBranch] = React.useState('ANODE') // Default branch
  const [showQuotationPopup, setShowQuotationPopup] = React.useState(false)
  const [quotationPopupData, setQuotationPopupData] = React.useState(null)
  
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
  }
  
  // Set the last payment as default when payment modal opens
  React.useEffect(() => {
    if (showPaymentDetails && paymentHistory.length > 0) {
      console.log('Setting last payment as default:', paymentHistory[paymentHistory.length - 1])
      setSelectedPayment(paymentHistory[paymentHistory.length - 1])
    }
  }, [showPaymentDetails, paymentHistory])
  
  // Function to open payment modal for a specific customer
  const handlePaymentDetails = (customer) => {
    setSelectedCustomer(customer)
    setShowPaymentDetails(true)
    // Reset selected payment to null so useEffect can set the last payment
    setSelectedPayment(null)
  }
  const [showImportModal, setShowImportModal] = React.useState(false)
  const [importFile, setImportFile] = React.useState(null)
  
  // Quotations data - empty array ready for real data
  const [quotations, setQuotations] = React.useState([])
  const [piStore, setPiStore] = React.useState({})
  const [savedPiPreview, setSavedPiPreview] = React.useState(null) // { data, selectedBranch }

  React.useEffect(() => {
    function handlePiSaved(e) {
      const { quotationNumber, piData, selectedBranch: piBranch } = e.detail || {}
      if (!quotationNumber || !piData) return
      setPiStore(prev => ({ ...prev, [quotationNumber]: { data: piData, selectedBranch: piBranch } }))
      setLastQuotationData(prev => prev || { quotationNumber })
    }
    window.addEventListener('pi-saved', handlePiSaved)
    return () => window.removeEventListener('pi-saved', handlePiSaved)
  }, [])
  const [showPdfViewer, setShowPdfViewer] = React.useState(false)
  const [currentPdfUrl, setCurrentPdfUrl] = React.useState('')
  // Available options for dropdowns
  
  const customerTypes = ['Individual', 'Retailer', 'Distributer', 'Dealer', 'Contractor', 'Business'];
  const leadSources = [
    'Website Inquiry',
    'Phone Call', 
    'Walk-in / Direct Visit',
    'Distributor / Dealer',
    'Existing Customer Referral',
    'Trade Show / Exhibition',
    'Tender / Government Contract',
    'Social Media (LinkedIn, Facebook, Instagram, etc.)',
    'Email Campaign',
    'Online Marketplace (IndiaMART, TradeIndia, etc.)',
    'Advertisement (Newspaper / Hoarding / Online Ads)',
    'Cold Call / Telemarketing',
    'Salesperson Visit',
    'Networking / Business Association'
  ];
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
    'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
    'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const [filters, setFilters] = React.useState({
    customer: '',
    business: '',
    gstNo: '',
    address: '',
    state: '',
    productName: '',
    customerType: '',
    enquiryBy: '',
    date: '',
    salesStatus: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      customer: '',
      business: '',
      gstNo: '',
      address: '',
      state: '',
      productName: '',
      customerType: '',
      enquiryBy: '',
      date: '',
      salesStatus: ''
    });
  };

  // Load assigned leads for the logged-in salesperson/telecaller
  React.useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.SALESPERSON_ASSIGNED_LEADS_ME());
        const rows = res?.data || [];
        // Map API rows into existing UI customer shape
        const mapped = rows.map((r) => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          email: r.email || 'N/A',
          business: r.business || 'N/A',
          address: r.address || 'N/A',
          gstNo: r.gst_no || 'N/A',
          productName: r.product_type || 'N/A',
          state: r.state || 'N/A',
          enquiryBy: r.lead_source || 'N/A',
          customerType: r.customer_type || 'N/A',
          date: r.date ? new Date(r.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          salesStatus: r.sales_status || 'pending',
          salesStatusRemark: r.sales_status_remark || null,
          salesStatusDate: new Date(r.updated_at || r.created_at || Date.now()).toLocaleString(),
          latestQuotationUrl: '#',
          quotationsSent: 0,
          followUpLink: 'https://calendar.google.com/',
          whatsapp: r.whatsapp ? `+91${String(r.whatsapp).replace(/\D/g, '').slice(-10)}` : null,
          transferredLeads: 0,
          transferredTo: r.transferred_to || null,
          callDurationSeconds: r.call_duration_seconds || null,
          // Docs and payment info from DB (backend fields)
          quotationUrl: r.quotation_url || null,
          proformaInvoiceUrl: r.proforma_invoice_url || null,
          paymentReceiptUrl: r.payment_receipt_url || null,
          quotationCount: typeof r.quotation_count === 'number' ? r.quotation_count : (parseInt(r.quotation_count) || 0),
          paymentStatusDb: r.payment_status || null,
          paymentModeDb: r.payment_mode || null,
        }));
        setCustomers(mapped);
      } catch (err) {
        console.error('Failed to load assigned leads:', err);
      }
    };
    fetchAssigned();
  }, []);

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setShowAddCustomer(true)
  }

  const handleView = (customer) => {
    setViewingCustomer(customer)
    setModalTab('details')
  }

  const handleQuotation = (customer) => {
    setSelectedCustomerForQuotation(customer)
    setShowCreateQuotation(true)
  }

  const handleCreateQuotation = () => {
    if (viewingCustomer) {
      setSelectedCustomerForQuotation(viewingCustomer)
      setShowCreateQuotation(true)
    }
  }

  // Save quotation to database
  const handleSaveQuotation = async (quotationData) => {
    try {
      const quotationPayload = {
        customerId: viewingCustomer.id,
        customerName: viewingCustomer.name,
        customerBusiness: viewingCustomer.business,
        customerPhone: viewingCustomer.phone,
        customerEmail: viewingCustomer.email,
        customerAddress: viewingCustomer.address,
        customerGstNo: viewingCustomer.gstNo,
        customerState: viewingCustomer.state,
        quotationDate: quotationData.quotationDate,
        validUntil: quotationData.validUntil,
        branch: quotationData.selectedBranch || 'ANODE',
        subtotal: quotationData.subtotal,
        taxRate: quotationData.taxRate || 18.00,
        taxAmount: quotationData.taxAmount,
        discountRate: quotationData.discountRate || 0,
        discountAmount: quotationData.discountAmount || 0,
        totalAmount: quotationData.total,
        items: quotationData.items.map(item => ({
          productName: item.productName || item.description || 'Product',
          description: item.description || item.productName || 'Product',
          hsnCode: item.hsn || '85446090',
          quantity: item.quantity,
          unit: item.unit || 'Nos',
          unitPrice: item.buyerRate || item.unitPrice,
          gstRate: item.gstRate || 18.00,
          taxableAmount: item.amount,
          gstAmount: (item.amount * (item.gstRate || 18.00) / 100),
          totalAmount: item.amount * (1 + (item.gstRate || 18.00) / 100)
        }))
      };

      console.log('Sending quotation payload:', quotationPayload);
      console.log('Viewing customer data:', viewingCustomer);
      const response = await quotationService.createQuotation(quotationPayload);
      console.log('Quotation response:', response);
      
      if (response.success) {
        // Add to local quotations state
        const newQuotation = {
          id: response.data.id,
          quotationNumber: response.data.quotation_number,
          customerId: viewingCustomer.id,
          quotationDate: response.data.quotation_date,
          total: response.data.total_amount,
          status: response.data.status,
          createdAt: response.data.created_at,
          items: response.data.items || []
        };
        
        setQuotations(prev => [newQuotation, ...prev]);
        
        // Show success message
        alert('Quotation created and saved to database successfully!');
        
        // Close the quotation modal
        setShowCreateQuotation(false);
      }
    } catch (error) {
      console.error('Error saving quotation:', error);
      alert('Failed to save quotation to database. Please try again.');
    }
  }

  const handleSendVerification = (customer) => {
    // Update customer's quotation status to pending
    const updatedCustomer = {
      ...customer,
      quotationStatus: 'pending',
      verificationSentAt: new Date().toISOString()
    }
    
    // Update the customer in the shared data
    updateCustomer(updatedCustomer)
    
    // Update the viewing customer if it's the same
    if (viewingCustomer && viewingCustomer.id === customer.id) {
      setViewingCustomer(updatedCustomer)
    }
    
    // Show success message
    alert('Verification request sent successfully! Status will be updated when the customer responds.')
  }



  const handleSavePI = (newPiData) => {
    setPiData(newPiData)
    setShowCreatePI(false)
    setSelectedCustomerForPI(null)
  }

  // Auto-fill PI form with approved quotation data
  React.useEffect(() => {
    if (showCreatePI && selectedCustomerForPI?.approvedQuotation) {
      const approvedQuotation = selectedCustomerForPI.approvedQuotation;
      
      // Auto-fill PI form with quotation data
      setPiFormData({
        items: approvedQuotation.items?.map(item => ({
          id: item.id || Math.random(),
          description: item.productName || item.description || 'Product',
          subDescription: item.description || '',
          hsn: item.hsnCode || item.hsn || '85446090',
          dueOn: new Date().toISOString().split('T')[0],
          quantity: item.quantity || 1,
          unit: item.unit || 'Nos',
          rate: item.unitPrice || item.buyerRate || 0,
          amount: item.totalAmount || item.amount || 0
        })) || [{
          id: 1,
          description: '',
          subDescription: '',
          hsn: '76141000',
          dueOn: new Date().toISOString().split('T')[0],
          quantity: 1,
          unit: 'MTR',
          rate: 0,
          amount: 0
        }],
        discountRate: 0,
        customer: {
          business: selectedCustomerForPI.business || '',
          address: selectedCustomerForPI.address || '',
          phone: selectedCustomerForPI.phone || '',
          gstNo: selectedCustomerForPI.gstNo || '',
          state: selectedCustomerForPI.state || ''
        }
      });
      
      console.log('Auto-filled PI form with approved quotation:', approvedQuotation);
    }
  }, [showCreatePI, selectedCustomerForPI]);

  // Send a specific quotation for verification (persists to backend)
  const handleSendQuotation = async (quotation) => {
    try {
      if (!quotation.id) {
        alert('Please save the quotation first before sending for verification.')
        return
      }
      
      console.log('Sending quotation for verification:', quotation);
      const res = await quotationService.submitForVerification(quotation.id)
      console.log('Submit verification response:', res);
      
      if (res && res.success) {
        const newStatus = res.data?.status || 'pending';
        console.log('Updating quotation status to:', newStatus);
        
        setQuotations(prev => prev.map(q => (q.id === quotation.id ? {
          ...q,
          status: newStatus,
          verificationSentAt: new Date().toISOString()
        } : q)))
        
        alert('Sent to Department Head for verification.')
      } else {
        console.error('Submit verification failed:', res);
        alert('Failed to submit for verification. Please try again.')
      }
    } catch (e) {
      console.error('Error submitting quotation for verification:', e)
      alert('Failed to submit for verification. Please try again.')
    }
  }

  // Delete a specific quotation from the list and database
  const handleDeleteQuotation = async (quotation) => {
    if (!confirm('Are you sure you want to delete this quotation?')) return
    
    try {
      console.log('Attempting to delete quotation:', quotation);
      // If quotation has an ID, delete from database
      if (quotation.id) {
        console.log('Calling delete API for quotation ID:', quotation.id);
        const response = await quotationService.deleteQuotation(quotation.id);
        console.log('Delete API response:', response);
        if (!response.success) {
          alert('Failed to delete quotation from database. Please try again.');
          return;
        }
      }
      
      // Remove from local state
      setQuotations(prev => prev.filter(q => {
        const isSame = (q.quotationNumber && quotation.quotationNumber && q.quotationNumber === quotation.quotationNumber)
          || (q.id && quotation.id && q.id === quotation.id)
        return !isSame
      }))
      
      alert('Quotation deleted successfully!');
    } catch (error) {
      console.error('Error deleting quotation:', error);
      alert('Failed to delete quotation. Please try again.');
    }
  }


  const handleViewQuotation = async (quotation) => {
    try {
      // If quotation has an ID, fetch from database
      if (quotation.id) {
        const response = await quotationService.getQuotation(quotation.id);
        if (response.success) {
          const dbQuotation = response.data;
          const normalized = {
            id: dbQuotation.id,
            quotationNumber: dbQuotation.quotation_number,
            quotationDate: dbQuotation.quotation_date,
            validUpto: dbQuotation.valid_until,
            voucherNumber: `VOUCH-${Math.floor(1000 + Math.random() * 9000)}`,
            customer: {
              name: dbQuotation.customer_name,
              business: dbQuotation.customer_business,
              address: dbQuotation.customer_address,
              phone: dbQuotation.customer_phone,
              gstNo: dbQuotation.customer_gst_no,
              state: dbQuotation.customer_state
            },
            items: (dbQuotation.items || []).map(i => ({
              productName: i.product_name,
              description: i.description,
              quantity: i.quantity,
              unit: i.unit,
              buyerRate: i.unit_price,
              unitPrice: i.unit_price,
              amount: i.taxable_amount,
              total: i.total_amount,
              hsn: i.hsn_code,
              gstRate: i.gst_rate
            })),
            subtotal: parseFloat(dbQuotation.subtotal),
            taxAmount: parseFloat(dbQuotation.tax_amount),
            total: parseFloat(dbQuotation.total_amount),
            status: dbQuotation.status
          };
          console.log('Normalized quotation data:', normalized);
          setQuotationPopupData(normalized);
          setShowQuotationPopup(true);
          return;
        }
      }
      
      // Fallback to local quotation data
      const normalized = {
        ...quotation,
        customer: {
          name: quotation.billTo?.business || viewingCustomer?.name,
          business: quotation.billTo?.business,
          address: quotation.billTo?.address,
          phone: quotation.billTo?.phone,
          gstNo: quotation.billTo?.gstNo,
          state: quotation.billTo?.state
        },
        items: (quotation.items || []).map(i => ({
          productName: i.productName || i.description,
          description: i.productName || i.description,
          quantity: i.quantity,
          unit: i.unit,
          buyerRate: i.buyerRate ?? i.unitPrice ?? i.rate,
          unitPrice: i.buyerRate ?? i.unitPrice ?? i.rate,
          amount: i.amount ?? i.total,
          total: i.amount ?? i.total,
          hsn: i.hsnCode || i.hsn,
          gstRate: i.gstRate
        })),
        subtotal: quotation.subtotal,
        taxAmount: quotation.taxAmount ?? quotation.tax,
        total: quotation.total
      };
      setQuotationPopupData(normalized);
      setShowQuotationPopup(true);
    } catch (error) {
      console.error('Error loading quotation:', error);
      alert('Failed to load quotation details. Please try again.');
    }
  }

  const handleViewLatestQuotation = (customer) => {
    // Find latest quotation created for this customer (most recent at index 0)
    const latest = quotations.find(q => q.customerId === customer.id) || quotations[0]
    if (!latest) return
    handleViewQuotation(latest)
  }

  const handleWalletClick = async (customer) => {
    console.log('Opening payment modal for customer:', customer)
    
    try {
      // Fetch real payment data from database
      const response = await paymentService.getPaymentsByCustomer(customer.id);
      if (response.success && response.data.length > 0) {
        const dbPayments = response.data.map(payment => ({
          id: payment.id,
          amount: payment.amount,
          date: payment.payment_date,
          status: payment.status,
          paymentMethod: payment.payment_method,
          remarks: payment.remarks,
          reference: payment.reference_number,
          dueDate: payment.payment_date,
          paidDate: payment.status === 'completed' ? payment.payment_date : null,
          receiptUrl: payment.receipt_url
        }));
        setPaymentHistory(dbPayments);
        
        // Calculate total amount from payments
        const totalPaid = dbPayments
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0);
        setTotalAmount(totalPaid);
      } else {
        // Fallback to DB-backed URLs if no payments found
        const inferredPayments = []
        if (customer.paymentReceiptUrl) {
          inferredPayments.push({
        id: 1,
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            status: (customer.paymentStatusDb || 'pending').toLowerCase(),
            paymentMethod: customer.paymentModeDb || 'Other',
            remarks: 'Payment receipt uploaded',
            reference: 'DOC',
            dueDate: new Date().toISOString().split('T')[0],
            paidDate: (customer.paymentStatusDb === 'COMPLETED') ? new Date().toISOString().split('T')[0] : null,
            receiptUrl: customer.paymentReceiptUrl,
          })
        }
        setPaymentHistory(inferredPayments);
        setTotalAmount(0);
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
      // Fallback to empty payment history
      setPaymentHistory([]);
      setTotalAmount(0);
    }
    
    setSelectedCustomer({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      business: customer.business,
      address: customer.address
    })
    setShowPaymentDetails(true)
  }

  const handleDownloadReceipt = () => {
    // In a real app, this would generate a PDF receipt
    // For now, we'll create a simple download link
    const receiptText = `
      PAYMENT RECEIPT
      ----------------------------
      Receipt No: ${selectedPayment.receiptNo}
      Date: ${selectedPayment.date}
      Customer: ${selectedPayment.customerName}
      Amount: ${selectedPayment.amount}
      Payment Method: ${selectedPayment.paymentMethod}
      Status: ${selectedPayment.status}
      
      Thank you for your payment!
      ANODE ELECTRIC PVT. LTD.
    `
    
    const element = document.createElement('a')
    const file = new Blob([receiptText], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = `payment-receipt-${selectedPayment.receiptNo}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleDownloadTemplate = () => {
    // Create CSV template with headers
    const headers = [
      'Name', 'Phone', 'WhatsApp', 'Email', 'Address', 'State', 'GST No', 
      'Product Name', 'Lead Source', 'Customer Type', 'Date'
    ]
    
    // Create sample data row with example values using new options
    const sampleData = [
      'John Doe', '9876543210', '9876543210', 'john.doe@email.com', 
      '123 Main Street, City', 'Karnataka', '29ABCDE1234F1Z5', 
      'XLPE Cable 1.5mm', 'Website Inquiry', 'Individual', '2024-01-15'
    ]
    
    const csvContent = [headers, sampleData].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'leads_template.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleImportLeads = () => {
    setShowImportModal(true)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
      setImportFile(file)
    } else {
      alert('Please select a valid CSV file')
    }
  }

  const processCSVImport = () => {
    if (!importFile) {
      alert('Please select a CSV file first')
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const csv = e.target.result
        const lines = csv.split('\n').filter(line => line.trim()) // Remove empty lines
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
        
        // Expected headers for validation
        const expectedHeaders = [
          'Name', 'Phone', 'WhatsApp', 'Email', 'Address', 'State', 'GST No', 
          'Product Name', 'Lead Source', 'Customer Type', 'Date'
        ]
        
        // Validate headers
        const headerValidation = validateHeaders(headers, expectedHeaders)
        if (!headerValidation.isValid) {
          alert(`CSV header validation failed:\n${headerValidation.errors.join('\n')}\n\nPlease use the correct template format.`)
          return
        }
        
        const importedCustomers = []
        const errors = []
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = parseCSVLine(lines[i])
            
            if (values.length >= headers.length) {
              // Validate and clean data
              const validatedData = validateCustomerData(values, headers, i + 1)
              
              if (validatedData.isValid) {
                const newCustomer = {
                  id: customers.length + importedCustomers.length + 1,
                  name: validatedData.data.name,
                  phone: validatedData.data.phone,
                  email: validatedData.data.email,
                  business: validatedData.data.business || 'N/A',
                  address: validatedData.data.address,
                  gstNo: validatedData.data.gstNo,
                  productName: validatedData.data.productName,
                  state: validatedData.data.state,
                  enquiryBy: validatedData.data.enquiryBy,
                  customerType: validatedData.data.customerType,
                  date: validatedData.data.date,
                  salesStatus: 'pending',
                  salesStatusRemark: 'Imported from CSV',
                  salesStatusDate: new Date().toISOString().split('T')[0],
                  latestQuotationUrl: "#",
                  quotationsSent: 0,
                  followUpLink: "https://calendar.google.com/",
                  whatsapp: validatedData.data.whatsapp,
                  transferredLeads: 0,
                  transferredFrom: null,
                  transferredTo: null
                }
                importedCustomers.push(newCustomer)
              } else {
                errors.push(`Row ${i + 1}: ${validatedData.errors.join(', ')}`)
              }
            } else {
              errors.push(`Row ${i + 1}: Insufficient data columns`)
            }
          }
        }
        
        if (importedCustomers.length > 0) {
          // Upload imported leads to API
          try {
            for (const customer of importedCustomers) {
              const formData = new FormData();
              formData.append('name', customer.name);
              formData.append('phone', customer.phone.replace(/\D/g, '').slice(-10));
              formData.append('whatsapp', customer.whatsapp ? customer.whatsapp.replace('+91','').replace(/\D/g, '').slice(-10) : customer.phone.replace(/\D/g, '').slice(-10));
              formData.append('email', customer.email === 'N/A' ? '' : customer.email);
              formData.append('business', customer.business || 'N/A');
              formData.append('address', customer.address || 'N/A');
              formData.append('state', customer.state || 'N/A');
              formData.append('gst_no', customer.gstNo === 'N/A' ? '' : customer.gstNo);
              formData.append('product_type', customer.productName || 'N/A');
              formData.append('lead_source', customer.enquiryBy || 'N/A');
              formData.append('customer_type', customer.customerType || 'N/A');
              formData.append('date', customer.date);
              formData.append('sales_status', customer.salesStatus || 'follow up');
              formData.append('sales_status_remark', customer.salesStatusRemark || 'Imported from CSV');
              
              await apiClient.postFormData(API_ENDPOINTS.LEADS_CREATE(), formData);
            }
            
            // Refresh leads from API after successful import
            await handleRefresh();
            
            const successMessage = errors.length > 0 
              ? `Successfully imported ${importedCustomers.length} leads. ${errors.length} rows had errors and were skipped.`
              : `Successfully imported ${importedCustomers.length} leads`;
            alert(successMessage);
            setShowImportModal(false);
            setImportFile(null);
          } catch (error) {
            console.error('Error uploading imported leads:', error);
            // Still update local state even if API fails
            setCustomers(prev => [...prev, ...importedCustomers]);
            alert(`Imported ${importedCustomers.length} leads locally. Some may not have been saved to server.`);
            setShowImportModal(false);
            setImportFile(null);
          }
        } else {
          const errorMessage = errors.length > 0 
            ? `CSV validation failed:\n\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n... and ${errors.length - 5} more errors` : ''}\n\nPlease check the format and try again.`
            : 'No valid data found in CSV file. Please check the format and try again.'
          alert(errorMessage)
        }
      } catch (error) {
        console.error('Error processing CSV:', error)
        alert('Error processing CSV file. Please check the format.')
      }
    }
    reader.readAsText(importFile)
  }

  // Helper function to parse CSV line properly (handles commas in quoted fields)
  const parseCSVLine = (line) => {
    const result = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current.trim())
    return result.map(v => v.replace(/"/g, '').trim())
  }

  // Helper function to validate headers
  const validateHeaders = (actualHeaders, expectedHeaders) => {
    const errors = []
    
    if (actualHeaders.length !== expectedHeaders.length) {
      errors.push(`Expected ${expectedHeaders.length} columns, found ${actualHeaders.length}`)
    }
    
    expectedHeaders.forEach((expected, index) => {
      if (actualHeaders[index] !== expected) {
        errors.push(`Column ${index + 1}: Expected "${expected}", found "${actualHeaders[index] || 'empty'}"`)
      }
    })
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Helper function to validate customer data
  const validateCustomerData = (values, headers, rowNumber) => {
    const errors = []
    const data = {}
    
    // Map values to field names
    headers.forEach((header, index) => {
      const value = values[index] || ''
      
      switch (header) {
        case 'Name':
          if (!value || value.length < 2) {
            errors.push('Name is required and must be at least 2 characters')
          }
          data.name = value
          break
          
        case 'Phone':
          const phoneRegex = /^[6-9]\d{9}$/
          if (!value || !phoneRegex.test(value)) {
            errors.push('Phone must be a valid 10-digit Indian mobile number')
          }
          data.phone = value
          break
          
        case 'WhatsApp':
          const whatsappRegex = /^[6-9]\d{9}$/
          if (value && !whatsappRegex.test(value)) {
            errors.push('WhatsApp must be a valid 10-digit Indian mobile number')
          }
          data.whatsapp = value ? `+91${value}` : null
          break
          
        case 'Email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (value && !emailRegex.test(value)) {
            errors.push('Email must be a valid email address')
          }
          data.email = value || 'N/A'
          break
          
        case 'Address':
          data.address = value || 'N/A'
          break
          
        case 'State':
          if (value && !states.includes(value)) {
            errors.push(`State must be one of: ${states.join(', ')}`)
          }
          data.state = value || 'N/A'
          break
          
        case 'GST No':
          const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/
          if (value && !gstRegex.test(value)) {
            errors.push('GST No must be a valid GST number format')
          }
          data.gstNo = value || 'N/A'
          break
          
        case 'Product Name':
          data.productName = value || 'N/A'
          break
          
        
          
        case 'Lead Source':
          if (value && !leadSources.includes(value)) {
            errors.push(`Lead Source must be one of: ${leadSources.join(', ')}`)
          }
          data.enquiryBy = value || 'N/A'
          break
          
        case 'Customer Type':
          if (value && !customerTypes.includes(value)) {
            errors.push(`Customer Type must be one of: ${customerTypes.join(', ')}`)
          }
          data.customerType = value || 'N/A'
          break
          
        case 'Date':
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/
          if (value && !dateRegex.test(value)) {
            errors.push('Date must be in YYYY-MM-DD format')
          }
          data.date = value || new Date().toISOString().split('T')[0]
          break
          
        default:
          data[header.toLowerCase().replace(/\s+/g, '')] = value
      }
    })
    
    return {
      isValid: errors.length === 0,
      data,
      errors
    }
  }

  const handleExportLeads = async () => {
    try {
      // Create a temporary div for PDF generation
      const tempDiv = document.createElement('div')
      tempDiv.style.padding = '20px'
      tempDiv.style.fontFamily = 'Arial, sans-serif'
      tempDiv.style.fontSize = '12px'
      tempDiv.style.color = '#000'
      tempDiv.style.backgroundColor = '#fff'
      
      // Add title
      tempDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px;">
          <h1 style="margin: 0; font-size: 24px; color: #1f2937;">ANOCAB LEADS REPORT</h1>
          <p style="margin: 5px 0 0 0; color: #6b7280;">Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">#</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Name & Phone</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Address</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">GST No.</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Product Name</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">State</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Lead Source</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Customer Type</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Date</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Sales Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredCustomers.map((customer, index) => `
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${customer.id}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">
                  <div style="font-weight: bold;">${customer.name}</div>
                  <div style="color: #6b7280; font-size: 11px;">${customer.phone}</div>
                  ${customer.whatsapp ? `<div style="color: #059669; font-size: 11px;">WhatsApp: ${customer.whatsapp}</div>` : ''}
                </td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${customer.address || 'N/A'}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${customer.gstNo || 'N/A'}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${customer.productName || 'N/A'}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${customer.state || 'N/A'}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${customer.enquiryBy || 'N/A'}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${customer.customerType || 'N/A'}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${customer.date}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">
                  <span style="
                    padding: 2px 6px; 
                    border-radius: 4px; 
                    font-size: 10px; 
                    font-weight: bold;
                    ${customer.connected?.status === 'Connected' ? 'background-color: #dcfce7; color: #166534;' : 
                      customer.connected?.status === 'Follow Up' ? 'background-color: #fef3c7; color: #92400e;' : 
                      'background-color: #fee2e2; color: #991b1b;'}
                  ">
                    ${customer.connected?.status || 'Not Connected'}
                  </span>
                </td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">
                  <span style="
                    padding: 2px 6px; 
                    border-radius: 4px; 
                    font-size: 10px; 
                    font-weight: bold;
                    ${customer.finalInfo?.status === 'closed' ? 'background-color: #dcfce7; color: #166534;' : 
                      customer.finalInfo?.status === 'next_meeting' ? 'background-color: #dbeafe; color: #1e40af;' : 
                      'background-color: #f3f4f6; color: #374151;'}
                  ">
                    ${customer.finalInfo?.status === 'closed' ? 'Closed' : 
                      customer.finalInfo?.status === 'next_meeting' ? 'Next Meeting' : 
                      customer.finalStatus || 'New'}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 11px;">
          <p>Total Records: ${filteredCustomers.length}</p>
          <p>Generated by ANOCAB CRM System</p>
        </div>
      `
      
      // Temporarily add to DOM
      document.body.appendChild(tempDiv)
      
      // PDF generation options
      const opt = {
        margin: 0.5,
        filename: `anocab-leads-report-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1,
          useCORS: true,
          logging: false
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'landscape' 
        }
      }
      
      // Generate and download the PDF
      await html2pdf().set(opt).from(tempDiv).save()
      
      // Clean up
      document.body.removeChild(tempDiv)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  const generateQuotationPDF = async (quotationData, customer, returnBlob = false) => {
    // Create a simple test content first
    const tempDiv = document.createElement('div')
    tempDiv.style.position = 'fixed'
    tempDiv.style.left = '0'
    tempDiv.style.top = '0'
    tempDiv.style.width = '800px'
    tempDiv.style.backgroundColor = 'white'
    tempDiv.style.padding = '20px'
    tempDiv.style.fontFamily = 'Arial, sans-serif'
    tempDiv.style.fontSize = '14px'
    tempDiv.style.color = 'black'
    tempDiv.style.zIndex = '9999'
    tempDiv.style.visibility = 'hidden'
    
    // Simple test content
    tempDiv.innerHTML = `
      <div style="width: 100%; background: white; padding: 20px;">
        <h1 style="color: black; font-size: 24px; margin-bottom: 20px;">ANODE ELECTRIC PVT. LTD.</h1>
        <h2 style="color: black; font-size: 18px; margin-bottom: 15px;">QUOTATION</h2>
        
        <div style="border: 2px solid black; padding: 15px; margin-bottom: 20px;">
          <h3 style="color: black; margin-bottom: 10px;">Company Details</h3>
          <p style="color: black; margin: 5px 0;">MANUFACTURING & SUPPLY OF ELECTRICAL CABLES & WIRES</p>
          <p style="color: black; margin: 5px 0;">KHASRA NO. 805/5, PLOT NO. 10, IT PARK</p>
          <p style="color: black; margin: 5px 0;">BARGI HILLS, JABALPUR - 482003</p>
          <p style="color: black; margin: 5px 0;">MADHYA PRADESH, INDIA</p>
          <p style="color: black; margin: 5px 0;">Tel: 6262002116, 6262002113</p>
          <p style="color: black; margin: 5px 0;">Email: info@anocab.com</p>
        </div>
        
        <div style="border: 1px solid black; padding: 15px; margin-bottom: 20px;">
          <h3 style="color: black; margin-bottom: 10px;">Quotation Details</h3>
          <p style="color: black; margin: 5px 0;"><strong>Date:</strong> ${quotationData?.quotationDate || new Date().toLocaleDateString()}</p>
          <p style="color: black; margin: 5px 0;"><strong>Quotation No:</strong> ${quotationData?.quotationNumber || 'ANO/25-26/001'}</p>
          <p style="color: black; margin: 5px 0;"><strong>Valid Until:</strong> ${quotationData?.validUpto || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
        </div>
        
        <div style="border: 1px solid black; padding: 15px; margin-bottom: 20px;">
          <h3 style="color: black; margin-bottom: 10px;">Bill To:</h3>
          <p style="color: black; margin: 5px 0;"><strong>${quotationData?.billTo?.business || customer?.business || 'Customer Name'}</strong></p>
          <p style="color: black; margin: 5px 0;">${quotationData?.billTo?.address || customer?.address || 'Customer Address'}</p>
          <p style="color: black; margin: 5px 0;"><strong>Phone:</strong> ${quotationData?.billTo?.phone || customer?.phone || 'Phone Number'}</p>
          <p style="color: black; margin: 5px 0;"><strong>GST:</strong> ${quotationData?.billTo?.gstNo || customer?.gstNo || 'GST Number'}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="border: 1px solid black; padding: 8px; text-align: left;">Sr.</th>
              <th style="border: 1px solid black; padding: 8px; text-align: left;">Description</th>
              <th style="border: 1px solid black; padding: 8px; text-align: center;">Qty</th>
              <th style="border: 1px solid black; padding: 8px; text-align: right;">Rate</th>
              <th style="border: 1px solid black; padding: 8px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid black; padding: 8px;">1</td>
              <td style="border: 1px solid black; padding: 8px;">Sample Product</td>
              <td style="border: 1px solid black; padding: 8px; text-align: center;">1</td>
              <td style="border: 1px solid black; padding: 8px; text-align: right;">1000.00</td>
              <td style="border: 1px solid black; padding: 8px; text-align: right;">1000.00</td>
            </tr>
            <tr style="background-color: #f0f0f0;">
              <td style="border: 1px solid black; padding: 8px;" colspan="4"><strong>Total</strong></td>
              <td style="border: 1px solid black; padding: 8px; text-align: right;"><strong>1000.00</strong></td>
            </tr>
          </tbody>
        </table>
        
        <div style="text-align: right; margin-top: 30px;">
          <p style="color: black; margin: 5px 0;">For ANODE ELECTRIC PRIVATE LIMITED</p>
          <p style="color: black; margin: 5px 0;">Authorized Signatory</p>
        </div>
      </div>
    `
    
    // Add the temporary div to the document
    document.body.appendChild(tempDiv)
    
    // Debug: Check if element is visible
    console.log('Element created:', tempDiv)
    console.log('Element innerHTML length:', tempDiv.innerHTML.length)
    console.log('Element offsetHeight:', tempDiv.offsetHeight)

    // Wait a bit for the element to render
    await new Promise(resolve => setTimeout(resolve, 100))

    try {
      // Generate the PDF
      const element = tempDiv
      const opt = {
        margin: 0.5,
        filename: `quotation-${customer.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1,
          useCORS: true,
          logging: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait'
        }
      }

      if (returnBlob) {
        // Generate and return the PDF as a blob
        const result = await html2pdf().set(opt).from(element).outputPdf('blob')
        return result
      } else {
        // Generate and download the PDF
        await html2pdf().set(opt).from(element).save()
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw error
    } finally {
      // Clean up
      if (document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv)
      }
    }

    // The PDF generation is now handled in the try-catch block above
    // No additional cleanup needed here as it's handled in the finally block
  }

  const handleAddCustomer = () => {
    setEditingCustomer(null) // Clear editing customer when adding new
    setShowAddCustomer(true)
  }

  const handleSaveCustomer = async (newCustomerData) => {
    if (editingCustomer) {
      // Update existing customer
      const updatedCustomer = {
        ...editingCustomer,
        name: newCustomerData.customerName,
        phone: newCustomerData.mobileNumber,
        email: newCustomerData.email || "N/A",
        business: newCustomerData.business,
        location: newCustomerData.state, // Use state as location
        gstNo: newCustomerData.gstNumber || "N/A",
        address: newCustomerData.address,
        state: newCustomerData.state,
        productName: newCustomerData.productName,
        customerType: newCustomerData.customerType,
        enquiryBy: newCustomerData.leadSource,
        date: newCustomerData.date,
        // Status values from form
        salesStatus: newCustomerData.salesStatus,
        salesStatusRemark: newCustomerData.salesStatus === 'next_meeting' && newCustomerData.meetingDate && newCustomerData.meetingTime 
          ? `${newCustomerData.meetingDate} AT ${newCustomerData.meetingTime}` 
          : newCustomerData.salesStatusRemark,
        salesStatusDate: editingCustomer.salesStatusDate,
        callDurationSeconds: newCustomerData.callDurationSeconds,
        whatsapp: newCustomerData.whatsappNumber ? `+91${newCustomerData.whatsappNumber}` : editingCustomer.whatsapp,
        // Update transferred leads data
        transferredLeads: newCustomerData.transferredLeads || 0,
        transferredFrom: newCustomerData.transferredFrom || null,
        transferredTo: newCustomerData.transferredTo || null,
      }
      
      setCustomers(prev => prev.map(customer => 
        customer.id === editingCustomer.id ? updatedCustomer : customer
      ))

      // Persist update to backend with FormData for file upload
      const formData = new FormData();
      formData.append('name', updatedCustomer.name);
      formData.append('phone', updatedCustomer.phone);
      formData.append('email', updatedCustomer.email === 'N/A' ? '' : updatedCustomer.email);
      formData.append('business', updatedCustomer.business);
      formData.append('address', updatedCustomer.address);
      formData.append('gst_no', updatedCustomer.gstNo === 'N/A' ? '' : updatedCustomer.gstNo);
      formData.append('product_type', updatedCustomer.productName);
      formData.append('state', updatedCustomer.state);
      formData.append('lead_source', updatedCustomer.enquiryBy);
      formData.append('customer_type', updatedCustomer.customerType);
      formData.append('date', updatedCustomer.date);
      formData.append('whatsapp', updatedCustomer.whatsapp ? updatedCustomer.whatsapp.replace('+91','') : '');
      formData.append('sales_status', updatedCustomer.salesStatus);
      formData.append('sales_status_remark', updatedCustomer.salesStatusRemark);
      formData.append('call_duration_seconds', updatedCustomer.callDurationSeconds || '');
      formData.append('transferred_to', updatedCustomer.transferredTo || '');
      
      // Add call recording file if present
      if (newCustomerData.callRecordingFile) {
        formData.append('call_recording', newCustomerData.callRecordingFile);
      }

      try {
        await apiClient.putFormData(API_ENDPOINTS.SALESPERSON_LEAD_BY_ID(editingCustomer.id), formData);
      } catch (err) {
        console.error('Failed to update salesperson lead:', err);
      }
    } else {
      // Add new customer
      const newCustomer = {
        id: customers.length + 1,
        name: newCustomerData.customerName,
        phone: newCustomerData.mobileNumber,
        email: newCustomerData.email || "N/A",
        business: newCustomerData.business,
        location: newCustomerData.state, // Use state as location
        gstNo: newCustomerData.gstNumber || "N/A",
        address: newCustomerData.address,
        state: newCustomerData.state,
        enquiryBy: newCustomerData.leadSource,
        productName: newCustomerData.productName,
        customerType: newCustomerData.customerType,
        date: newCustomerData.date,
        // Set status values from form
        salesStatus: newCustomerData.salesStatus,
        salesStatusRemark: newCustomerData.salesStatus === 'next_meeting' && newCustomerData.meetingDate && newCustomerData.meetingTime 
          ? `${newCustomerData.meetingDate} AT ${newCustomerData.meetingTime}` 
          : newCustomerData.salesStatusRemark,
        salesStatusDate: new Date().toISOString().split('T')[0],
        latestQuotationUrl: "#",
        quotationsSent: 0,
        followUpLink: "https://calendar.google.com/",
        whatsapp: newCustomerData.whatsappNumber ? `+91${newCustomerData.whatsappNumber}` : null,
        transferredLeads: newCustomerData.transferredLeads || 0,
        transferredFrom: newCustomerData.transferredFrom || null,
        transferredTo: newCustomerData.transferredTo || null,
      }
      
      setCustomers(prev => [...prev, newCustomer])
    }
    
    setShowAddCustomer(false)
    setEditingCustomer(null)
  }

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      const res = await apiClient.get(API_ENDPOINTS.SALESPERSON_ASSIGNED_LEADS_ME());
      const rows = res?.data || [];
      const mapped = rows.map((r) => ({
        id: r.id,
        name: r.name,
        phone: r.phone,
        email: r.email || 'N/A',
        business: r.business || 'N/A',
        address: r.address || 'N/A',
        gstNo: r.gst_no || 'N/A',
        productName: r.product_type || 'N/A',
        state: r.state || 'N/A',
        enquiryBy: r.lead_source || 'N/A',
        customerType: r.customer_type || 'N/A',
        date: r.date ? new Date(r.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        salesStatus: r.sales_status || 'pending',
        salesStatusRemark: r.sales_status_remark || null,
        salesStatusDate: new Date(r.updated_at || r.created_at || Date.now()).toLocaleString(),
        latestQuotationUrl: '#',
        quotationsSent: 0,
        followUpLink: 'https://calendar.google.com/',
        whatsapp: r.whatsapp ? `+91${String(r.whatsapp).replace(/\D/g, '').slice(-10)}` : null,
        transferredLeads: 0,
        transferredTo: r.transferred_to || null,
        callDurationSeconds: r.call_duration_seconds || null,
      }));
      setCustomers(mapped)
    } catch (err) {
      console.error('Failed to refresh assigned leads:', err)
    } finally {
      setIsRefreshing(false)
      const refreshButton = document.querySelector('[data-refresh-btn]')
      if (refreshButton) {
        refreshButton.style.transform = 'scale(1.1)'
        setTimeout(() => {
          refreshButton.style.transform = 'scale(1)'
        }, 200)
      }
    }
  }

  // Filter customers based on search query and column filters
  const filteredCustomers = React.useMemo(() => {
    let result = [...customers];
    
    // Apply search query filter if exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(customer => {
        const searchFields = [
          customer.name?.toLowerCase() || '',
          customer.phone?.toLowerCase() || '',
          customer.email?.toLowerCase() || '',
          customer.business?.toLowerCase() || '',
          customer.state?.toLowerCase() || '',
          customer.gstNo?.toLowerCase() || '',
          customer.productName?.toLowerCase() || '',
          customer.customerType?.toLowerCase() || '',
          customer.enquiryBy?.toLowerCase() || '',
          customer.date?.toLowerCase() || '',
          customer.address?.toLowerCase() || ''
        ];
        return searchFields.some(field => field.includes(query));
      });
    }
    
    // Apply column filters if any active
    const activeFilters = Object.entries(filters).filter(([_, value]) => value.trim() !== '');
    
    if (activeFilters.length > 0) {
      result = result.filter(customer => {
        return activeFilters.every(([key, filterValue]) => {
          const value = filterValue.toString().toLowerCase().trim();
          if (!value) return true;
          
          // Special handling for sales status to match exactly
          if (key === 'salesStatus') {
            // Map old status values to new ones for compatibility
            const statusMapping = {
              'connected': 'win',
              'not connected': 'loose'
            };
            
            const customerStatus = customer.salesStatus?.toLowerCase() || '';
            const mappedStatus = statusMapping[customerStatus] || customerStatus;
            const filterValue = statusMapping[value.toLowerCase()] || value.toLowerCase();
            
            // For sales status, do an exact match (case-insensitive)
            return mappedStatus === filterValue;
          }
          
          // For other fields, do a partial match
          const customerValue = key === 'customer' ? customer.name || '' : customer[key] || '';
          return customerValue.toString().toLowerCase().includes(value);
        });
      });
    }
    
    return result;
  }, [customers, searchQuery, filters])

  // Pagination calculations
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Pagination functions
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  return (
    <main className={`flex-1 overflow-auto p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="mb-6">

        <div className="flex items-center justify-between gap-4">
          {/* Search Box */}
          <div className="flex items-center gap-3">
            <div className="flex">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-4 py-2 border border-blue-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
              <button className="px-3 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleFilters}
              className={`p-2 rounded-md border inline-flex items-center justify-center relative ${showFilters ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              title="Filters"
            >
              <Filter className="h-4 w-4" />
              {Object.values(filters).some(Boolean) && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-medium text-white bg-blue-500 rounded-full">
                  {Object.values(filters).filter(Boolean).length}
                </span>
              )}
            </button>
            <button 
              onClick={handleAddCustomer}
              className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Customer
            </button>
            <button 
              onClick={handleImportLeads}
              className="px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 inline-flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Import
            </button>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              data-refresh-btn
              className="h-9 w-9 inline-flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${
                  isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50/50'
                }`}>
                  <th className={`text-left py-4 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>#</th>
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <User className={`h-4 w-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                      Name & Phone
                    </div>
                    {showFilters && (
                      <input
                        type="text"
                        value={filters.customer}
                        onChange={(e) => handleFilterChange('customer', e.target.value)}
                        className={`mt-1 w-full text-xs p-1 border rounded ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Filter customer..."
                      />
                    )}
                  </th>
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Building2 className={`h-4 w-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                      Business
                    </div>
                    {showFilters && (
                      <input
                        type="text"
                        value={filters.business}
                        onChange={(e) => handleFilterChange('business', e.target.value)}
                        className={`mt-1 w-full text-xs p-1 border rounded ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Filter business..."
                      />
                    )}
                  </th>
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <MapPin className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                      Address
                    </div>
                    {showFilters && (
                      <input
                        type="text"
                        value={filters.address}
                        onChange={(e) => handleFilterChange('address', e.target.value)}
                        className={`mt-1 w-full text-xs p-1 border rounded ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Filter address..."
                      />
                    )}
                  </th>
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <FileText className={`h-4 w-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                      GST No.
                    </div>
                    {showFilters && (
                      <input
                        type="text"
                        value={filters.gstNo}
                        onChange={(e) => handleFilterChange('gstNo', e.target.value)}
                        className={`mt-1 w-full text-xs p-1 border rounded ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Filter GST..."
                      />
                    )}
                  </th>
                  <th className={`text-left py-2 px-4 font-medium text-sm w-48 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Package className={`h-4 w-4 ${isDarkMode ? 'text-violet-400' : 'text-violet-500'}`} />
                      Product Name
                    </div>
                    {showFilters && (
                      <input
                        type="text"
                        value={filters.productName}
                        onChange={(e) => handleFilterChange('productName', e.target.value)}
                        className={`mt-1 w-full text-xs p-1 border rounded ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Filter product name..."
                      />
                    )}
                  </th>
                  
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Map className={`h-4 w-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                      State
                    </div>
                    {showFilters && (
                      <select
                        value={filters.state}
                        onChange={(e) => handleFilterChange('state', e.target.value)}
                        className={`mt-1 w-full text-xs p-1 border rounded ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">All States</option>
                        {states.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    )}
                  </th>
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Globe className={`h-4 w-4 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`} />
                      Lead Source
                    </div>
                    {showFilters && (
                      <select
                        value={filters.enquiryBy}
                        onChange={(e) => handleFilterChange('enquiryBy', e.target.value)}
                        className={`mt-1 w-full text-xs p-1 border rounded ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">All Sources</option>
                        {leadSources.map(source => (
                          <option key={source} value={source}>{source}</option>
                        ))}
                      </select>
                    )}
                  </th>
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <User className={`h-4 w-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                      Customer Type
                    </div>
                    {showFilters && (
                      <select
                        value={filters.customerType}
                        onChange={(e) => handleFilterChange('customerType', e.target.value)}
                        className={`mt-1 w-full text-xs p-1 border rounded ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">All Types</option>
                        {customerTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    )}
                  </th>
                  <th className={`text-left py-2 px-4 font-medium text-sm w-32 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <FileText className={`h-4 w-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                      Date
                    </div>
                    {showFilters && (
                      <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => handleFilterChange('date', e.target.value)}
                        className={`mt-1 w-full text-xs p-1 border rounded ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    )}
                  </th>
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <BadgeCheck className={`h-4 w-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      Sales Status
                    </div>
                    {showFilters && (
                      <select
                        value={filters.salesStatus}
                        onChange={(e) => handleFilterChange('salesStatus', e.target.value)}
                        className={`mt-1 w-full text-xs p-1 border rounded ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">All Statuses</option>
                        <option value="win">Win Leads</option>
                        <option value="loose">Loose Leads</option>
                        <option value="follow up">Follow Up</option>
                        <option value="not interested">Not Interested</option>
                      </select>
                    )}
                  </th>
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft className={`h-4 w-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                      Transferred To
                    </div>
                  </th>
                  <th className={`text-left py-2 px-4 font-medium text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Pencil className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      Action
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="14" className={`py-12 text-center ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <div className="flex flex-col items-center gap-2">
                        <Search className={`h-8 w-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-300'}`} />
                        <p className="text-sm">
                          {searchQuery ? `No customers found for "${searchQuery}"` : 'No customers available'}
                        </p>
                        {searchQuery && (
                          <button 
                            onClick={() => setSearchQuery('')}
                            className={`text-sm underline ${
                              isDarkMode 
                                ? 'text-blue-400 hover:text-blue-300' 
                                : 'text-blue-600 hover:text-blue-700'
                            }`}
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className={`border-b transition-colors ${
                    isDarkMode 
                      ? 'border-gray-700 odd:bg-gray-800 even:bg-gray-800/50 hover:bg-gray-700' 
                      : 'border-gray-50 odd:bg-white even:bg-gray-50/40 hover:bg-white'
                  }`}>
                    <td className={`py-4 px-4 text-sm font-medium ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>{customer.id}</td>
                    <td className="py-4 px-4">
                      <div>
                        <div className={`font-medium text-sm ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>{customer.name}</div>
                        <div className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{customer.phone}</div>
                        {customer.whatsapp && (
                          <div className={`text-xs mt-1 ${
                            isDarkMode ? 'text-green-400' : 'text-green-600'
                          }`}>
                            <a href={`https://wa.me/${customer.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" /> WhatsApp
                            </a>
                          </div>
                        )}
                        {customer.email && customer.email !== "N/A" && (
                          <div className={`text-xs mt-1 ${
                            isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                          }`}>
                            <button 
                              onClick={() => window.open(`mailto:${customer.email}?subject=Follow up from ANOCAB&body=Dear ${customer.name},%0D%0A%0D%0AThank you for your interest in our products.%0D%0A%0D%0ABest regards,%0D%0AANOCAB Team`, '_blank')}
                              className={`inline-flex items-center gap-1 transition-colors ${
                                isDarkMode 
                                  ? 'hover:text-cyan-300' 
                                  : 'hover:text-cyan-700'
                              }`}
                              title="Send Email"
                            >
                              <Mail className="h-3 w-3" /> {customer.email}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={`py-4 px-4 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="font-medium">{customer.business}</div>
                    </td>
                    <td className={`py-4 px-4 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="font-medium">{customer.address}</div>
                    </td>
                    <td className={`py-4 px-4 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="font-medium">{customer.gstNo}</div>
                    </td>
                    <td className={`py-4 px-4 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="font-medium">{customer.productName}</div>
                    </td>
                    
                    <td className={`py-4 px-4 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="font-medium">{customer.state}</div>
                    </td>
                    <td className={`py-4 px-4 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="font-medium">{customer.enquiryBy}</div>
                    </td>
                    <td className={`py-4 px-4 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="font-medium">{customer.customerType || 'N/A'}</div>
                    </td>
                    <td className={`py-4 px-4 text-sm w-32 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="font-medium whitespace-nowrap">{customer.date}</div>
                    </td>
                    <td className={`py-4 px-4 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="flex flex-col">
                        <span className={
                          customer.salesStatus === 'connected'
                            ? `inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border ${
                                isDarkMode 
                                  ? 'bg-green-900 text-green-300 border-green-700' 
                                  : 'bg-green-50 text-green-700 border-green-200'
                              }`
                            : customer.salesStatus === 'not_connected'
                            ? `inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border ${
                                isDarkMode 
                                  ? 'bg-red-900 text-red-300 border-red-700' 
                                  : 'bg-red-50 text-red-700 border-red-200'
                              }`
                            : customer.salesStatus === 'next_meeting'
                            ? `inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border ${
                                isDarkMode 
                                  ? 'bg-blue-900 text-blue-300 border-blue-700' 
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`
                            : customer.salesStatus === 'closed'
                            ? `inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border ${
                                isDarkMode 
                                  ? 'bg-gray-700 text-gray-300 border-gray-600' 
                                  : 'bg-gray-50 text-gray-700 border-gray-200'
                              }`
                            : customer.salesStatus === 'order_confirmed'
                            ? `inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border ${
                                isDarkMode 
                                  ? 'bg-green-900 text-green-300 border-green-700' 
                                  : 'bg-green-50 text-green-700 border-green-200'
                              }`
                            : customer.salesStatus === 'other'
                            ? `inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border ${
                                isDarkMode 
                                  ? 'bg-purple-900 text-purple-300 border-purple-700' 
                                  : 'bg-purple-50 text-purple-700 border-purple-200'
                              }`
                            : `inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border ${
                                isDarkMode 
                                  ? 'bg-yellow-900 text-yellow-300 border-yellow-700' 
                                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }`
                        }>
                          {customer.salesStatus === 'connected' ? 'Connected' :
                           customer.salesStatus === 'not_connected' ? 'Not Connected' :
                           customer.salesStatus === 'next_meeting' ? 'Next Meeting' :
                           customer.salesStatus === 'closed' ? 'Closed' :
                           customer.salesStatus === 'order_confirmed' ? 'Order Confirmed' :
                           customer.salesStatus === 'open' ? 'Open' :
                           customer.salesStatus === 'pending' ? 'Pending' :
                           customer.salesStatus === 'other' ? 'Other' :
                           customer.salesStatus || 'Pending'}
                        </span>
                        {customer.salesStatusRemark && (
                          <span className={`text-xs mt-1 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>{customer.salesStatusRemark}</span>
                        )}
                        {customer.salesStatusDate && (
                          <span className={`text-xs ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>{customer.salesStatusDate}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                          <div className="flex flex-col">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.transferredTo 
                            ? (isDarkMode 
                                ? 'bg-indigo-900 text-indigo-300' 
                                : 'bg-indigo-100 text-indigo-800')
                            : (isDarkMode 
                                ? 'bg-gray-700 text-gray-400' 
                                : 'bg-gray-100 text-gray-600')
                        }`}>
                              <ArrowRightLeft className="h-3 w-3 mr-1" />
                          {customer.transferredTo || 'Not Transferred'}
                            </span>
                        {customer.transferredLeads > 0 && (
                          <div className={`text-xs mt-1 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <div>From: {customer.transferredFrom}</div>
                            <div>To: {customer.transferredTo}</div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-2">
                        <button onClick={() => handleEdit(customer)} className={`p-1.5 rounded-md relative group ${
                          isDarkMode 
                            ? 'hover:bg-gray-700' 
                            : 'hover:bg-gray-100'
                        }`} title="Edit Customer">
                          <Pencil className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                          <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none ${
                            isDarkMode ? 'bg-gray-600' : 'bg-gray-800'
                          }`}>
                            Edit Customer
                          </span>
                        </button>
                        <button onClick={() => handleView(customer)} className={`p-1.5 rounded-md relative group ${
                          isDarkMode 
                            ? 'hover:bg-gray-700' 
                            : 'hover:bg-gray-100'
                        }`} title="View Details">
                          <Eye className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                          <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none ${
                            isDarkMode ? 'bg-gray-600' : 'bg-gray-800'
                          }`}>
                            View Details
                          </span>
                        </button>
                        <button 
                          onClick={() => handleWalletClick(customer)}
                          className={`p-1.5 rounded-md relative group ${
                            isDarkMode 
                              ? 'hover:bg-green-900 text-green-400' 
                              : 'hover:bg-green-50 text-green-600'
                          }`} 
                          title="View Payment Receipt"
                        >
                          <Wallet className="h-4 w-4" />
                          <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none ${
                            isDarkMode ? 'bg-gray-600' : 'bg-gray-800'
                          }`}>
                            Payment
                          </span>
                        </button>
                        <button onClick={() => handleQuotation(customer)} className={`p-1.5 rounded-md relative group ${
                          isDarkMode 
                            ? 'hover:bg-purple-900 text-purple-400' 
                            : 'hover:bg-purple-50 text-purple-600'
                        }`} title="Quotation">
                          <FileText className="h-4 w-4" />
                          <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none ${
                            isDarkMode ? 'bg-gray-600' : 'bg-gray-800'
                          }`}>
                            Quotation
                          </span>
                        </button>
                        <button onClick={() => setShowFollowUpPicker(customer.id)} className={`p-1.5 rounded-md relative group ${
                          isDarkMode 
                            ? 'hover:bg-yellow-900 text-yellow-400' 
                            : 'hover:bg-yellow-50 text-yellow-600'
                        }`} title="Set Follow-up">
                          <ClockIcon className="h-4 w-4" />
                          <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none ${
                            isDarkMode ? 'bg-gray-600' : 'bg-gray-800'
                          }`}>
                            Set Follow-up
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Follow-up Picker Modal */}
      {showFollowUpPicker && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Set Follow-up Category</h3>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowFollowUpPicker(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {['Connected','Not Connected','Today\'s Meeting','Converted','Closed'].map((cat) => (
                <button
                  key={cat}
                  onClick={async () => {
                    try {
                      const formData = new FormData()
                      formData.append('connectedStatus', cat)
                      await apiClient.putFormData(API_ENDPOINTS.SALESPERSON_LEAD_BY_ID(showFollowUpPicker), formData)
                      setShowFollowUpPicker(null)
                      await fetchAssigned()
                    } catch (e) {
                      console.error('Failed to update follow-up:', e)
                      alert('Failed to update follow-up status')
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded border border-gray-200 hover:bg-gray-50"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {filteredCustomers.length > 0 && (
        <div className="mt-6 flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">entries</span>
            </div>
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredCustomers.length)} of {filteredCustomers.length} entries
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* First Page */}
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>

            {/* Previous Page */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {(() => {
                const pages = [];
                const maxVisiblePages = 5;
                let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                
                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-3 py-1 text-sm border rounded ${
                        i === currentPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
                return pages;
              })()}
            </div>

            {/* Next Page */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>

            {/* Last Page */}
            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>
      )}
      {viewingCustomer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-0">
            <div className="px-6 pt-5">
              <h2 className="text-lg font-semibold text-gray-900">{viewingCustomer.name}</h2>
              <p className="text-sm text-gray-500">Quick view and actions</p>
            </div>
            <div className="mt-4 px-3">
              <div className="flex items-center gap-2 border-b border-gray-200 px-3">
                <button className={cx("px-3 py-2 text-sm flex items-center gap-1", modalTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900')} onClick={() => setModalTab('details')}>
                  <User className="h-4 w-4" />
                  Details
                </button>
                <button className={cx("px-3 py-2 text-sm flex items-center gap-1", modalTab === 'quotation_status' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900')} onClick={() => setModalTab('quotation_status')}>
                  <FileText className="h-4 w-4" />
                  Quotation & Payment
                </button>
              </div>
            </div>
            <div className="px-6 py-4 max-h-[70vh] overflow-auto">
              {modalTab === 'details' && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Customer Name</span><span className="font-medium text-gray-900">{viewingCustomer.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Business Name</span><span className="font-medium text-gray-900">{viewingCustomer.business}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">GST</span><span className="font-medium text-gray-900">{viewingCustomer.gstNo || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Address</span><span className="font-medium text-gray-900 text-right max-w-[60%]">{viewingCustomer.address || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Contact</span><span className="font-medium text-gray-900">{viewingCustomer.phone}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium text-gray-900">{viewingCustomer.email}</span></div>
                </div>
              )}
              {modalTab === 'quotation_status' && (
                <div className="space-y-4 text-sm">
                  {/* Quotation Details - TOP */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">Quotation Details</h3>
                      <button
                        onClick={() => {
                          setIsRefreshing(true);
                          setTimeout(() => setIsRefreshing(false), 1000);
                        }}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center gap-1"
                        title="Refresh quotation status"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Refresh
                      </button>
                    </div>
                    {(() => {
                      const customerQuotations = quotations.filter(q => q.customerId === viewingCustomer.id)
                      if (customerQuotations.length === 0) {
                        return (
                          <div className="text-center py-8 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-sm">No quotations created yet</p>
                            <p className="text-xs text-gray-400 mt-1">Create a quotation to see it here</p>
                          </div>
                        )
                      }
                      return (
                        <div className="rounded-md border border-gray-200 divide-y">
                        {customerQuotations.map((quotation, index) => (
                          <div key={quotation.id || index} className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <div>
                                <span className="text-gray-700">
                                  {index === 0 ? 'Latest Quotation:' : `Quotation #${customerQuotations.length - index}:`}
                                </span>
                                <p className="text-sm font-medium text-gray-900">{quotation.quotationNumber || `ANQ${quotation.id || index + 1}`}</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-gray-500">{quotation.quotationDate || new Date().toLocaleDateString()}</p>
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    quotation.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    quotation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    quotation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {quotation.status === 'approved' ? '✅ Approved' :
                                     quotation.status === 'rejected' ? '❌ Rejected' :
                                     quotation.status === 'pending' ? '⏳ Pending' :
                                     quotation.status || 'Draft'}
                                  </span>
                                </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                                onClick={() => handleViewQuotation(quotation)}
                            className="text-blue-600 underline inline-flex items-center gap-1 hover:text-blue-700"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>
                              {piStore[quotation.quotationNumber] && (
                          <button 
                                  onClick={() => {
                                    const saved = piStore[quotation.quotationNumber]
                                    setSavedPiPreview(saved)
                                    setShowPIPreview(true)
                                  }}
                                  className="p-1 rounded-full bg-purple-600 text-white hover:bg-purple-700"
                                  title="View PI"
                                >
                                  <FileText className="h-3 w-3" />
                          </button>
                              )}
                          
                          {/* Show Create PI button for approved quotations, otherwise show status button */}
                          {quotation.status === 'approved' ? (
                            <button 
                              onClick={() => {
                                // Set the approved quotation for PI creation
                                setSelectedCustomerForPI({
                                  ...viewingCustomer,
                                  approvedQuotation: quotation
                                });
                                setShowCreatePI(true);
                              }}
                              className="text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1 bg-green-600 text-white hover:bg-green-700"
                              title="Create PI for approved quotation"
                            >
                              <FileText className="h-3 w-3" />
                              Create PI
                            </button>
                          ) : (
                            <button 
                                onClick={() => handleSendQuotation(quotation)}
                                className={`text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1 ${
                                  quotation.status === 'pending'
                                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                : quotation.status === 'rejected'
                                ? 'bg-red-600 text-white cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                                disabled={quotation.status === 'rejected'}
                            >
                                {quotation.status === 'pending' 
                              ? <Clock className="h-3 w-3" />
                              : quotation.status === 'rejected'
                              ? <XCircle className="h-3 w-3" />
                              : <Send className="h-3 w-3" />
                            }
                                {quotation.status === 'pending' ? 'Pending' : 
                                 quotation.status === 'rejected' ? 'Rejected' : 'Send'}
                            </button>
                          )}
                          
                          {/* Only show delete button for non-approved quotations */}
                          {quotation.status !== 'approved' && (
                            <button 
                                onClick={() => handleDeleteQuotation(quotation)}
                                className="p-1 rounded-full bg-red-600 text-white hover:bg-red-700"
                                title="Delete quotation"
                              >
                                <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                        ))}
                          </div>
                      )
                    })()}
                  </div>

                  {/* Payment Summary Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Summary</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{(() => {
                            const customerQuotations = quotations.filter(q => q.customerId === viewingCustomer.id);
                            const latestQuotation = customerQuotations[0];
                            if (latestQuotation && piStore[latestQuotation.quotationNumber]) {
                              return piStore[latestQuotation.quotationNumber].totalAmount?.toLocaleString('en-IN') || '0';
                            }
                            return '0';
                          })()}
                        </div>
                        <div className="text-xs text-gray-600">Total Amount</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          ₹{(() => {
                            const customerPayments = paymentHistory.filter(p => p.customerId === viewingCustomer.id);
                            const totalPaid = customerPayments.reduce((sum, payment) => sum + payment.amount, 0);
                            return totalPaid.toLocaleString('en-IN');
                          })()}
                        </div>
                        <div className="text-xs text-gray-600">Advance Paid</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">
                          ₹{(() => {
                            const customerQuotations = quotations.filter(q => q.customerId === viewingCustomer.id);
                            const latestQuotation = customerQuotations[0];
                            const totalAmount = latestQuotation && piStore[latestQuotation.quotationNumber] 
                              ? piStore[latestQuotation.quotationNumber].totalAmount || 0 
                              : 0;
                            const customerPayments = paymentHistory.filter(p => p.customerId === viewingCustomer.id);
                            const totalPaid = customerPayments.reduce((sum, payment) => sum + payment.amount, 0);
                            return (totalAmount - totalPaid).toLocaleString('en-IN');
                          })()}
                        </div>
                        <div className="text-xs text-gray-600">Remaining</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Add Payment Button */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Payment</h3>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-600">
                        Auto-fill payment form with quotation and PI details
                      </div>
                      <button
                        onClick={() => {
                          const customerQuotations = quotations.filter(q => q.customerId === viewingCustomer.id);
                          const latestQuotation = customerQuotations[0];
                          
                          if (!latestQuotation) {
                            alert('No quotation found for this customer');
                            return;
                          }

                          const quotationId = latestQuotation.quotationNumber || `ANQ${latestQuotation.id}`;
                          const piId = latestQuotation && piStore[latestQuotation.quotationNumber] 
                            ? (piStore[latestQuotation.quotationNumber].piNumber || `PI-${latestQuotation.quotationNumber}`)
                            : '';
                          const totalAmount = latestQuotation && piStore[latestQuotation.quotationNumber] 
                            ? piStore[latestQuotation.quotationNumber].totalAmount || 0 
                            : 0;

                          // Auto-fill the payment form
                          setAddPaymentForm({
                            quotationId: quotationId,
                            piId: piId,
                            amount: totalAmount.toString(),
                            paymentMethod: 'Cash',
                            paymentDate: new Date().toISOString().split('T')[0],
                            reference: `REF-${Date.now()}`,
                            remarks: `Payment for ${quotationId}`
                          });

                          // Open the payment modal
                          setShowAddPaymentModal(true);
                        }}
                        className="px-4 py-2 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <Wallet className="h-3 w-3" />
                        Quick Add Payment
                      </button>
                    </div>
                  </div>

                  {/* Payment History */}
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment History</h3>
                    {(() => {
                      const customerPayments = paymentHistory.filter(p => p.customerId === viewingCustomer.id);
                      if (customerPayments.length === 0) {
                        return (
                          <div className="text-center py-4 text-gray-500">
                            <Wallet className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-xs">No payments recorded yet</p>
                          </div>
                        );
                      }
                      return (
                        <div className="space-y-2">
                          {customerPayments.slice(0, 3).map((payment, index) => (
                            <div key={payment.id || index} className="flex items-center justify-between bg-white rounded p-2 border border-yellow-200">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${payment.status === 'paid' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                <span className="text-xs font-medium">₹{payment.amount.toLocaleString('en-IN')}</span>
                                <span className="text-xs text-gray-500">({payment.paymentMethod})</span>
                              </div>
                              <div className="text-xs text-gray-500">{payment.date}</div>
                            </div>
                          ))}
                          {customerPayments.length > 3 && (
                            <div className="text-xs text-center text-gray-500">
                              +{customerPayments.length - 3} more payments
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  
                  
                </div>
              )}
            </div>
            <div className="px-6 pb-4 flex justify-end gap-3">
              <button className="px-3 py-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50" onClick={() => setViewingCustomer(null)}>Close</button>
              {modalTab === 'quotation_status' && (
                <button 
                  onClick={handleCreateQuotation}
                  className="px-3 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 inline-flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Create Quotation
                </button>
              )}
              {modalTab === 'payment_timeline' && (
                <button 
                  onClick={() => setShowCreatePI(true)}
                  className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Create PI
                </button>
              )}
              {modalTab === 'payment_timeline' && (
                <button
                  onClick={() => setShowPIPreview(true)}
                  className="px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print PDF
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PI Preview Modal */}
      {showPIPreview && (
        <div className="fixed inset-0 z-50 overflow-auto bg-white flex items-center justify-center">
          <div className="w-full h-full flex flex-col">
            {/* Floating Action Buttons */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
              <button
                onClick={() => {
                  setShowPIPreview(false)
                  alert('PI saved successfully!')
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center gap-2 shadow-lg"
              >
                <Check className="h-4 w-4" />
                Save PI
              </button>
              <button
                onClick={async () => {
                  try {
                    const element = document.getElementById('pi-preview-content');
                    if (!element) {
                      alert('Unable to find PI content for PDF.');
                      return;
                    }

                    // Convert images to base64 to avoid CORS/tainted canvas issues
                    const convertImageToBase64 = (imgUrl) => {
                      return new Promise((resolve) => {
                        try {
                          const img = new Image();
                          img.crossOrigin = 'anonymous';
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0);
                            resolve(canvas.toDataURL('image/png'));
                          };
                          img.onerror = () => resolve(imgUrl);
                          img.src = imgUrl;
                        } catch (e) {
                          resolve(imgUrl);
                        }
                      });
                    };

                    const imgs = Array.from(element.querySelectorAll('img'));
                    await Promise.all(
                      imgs.map(async (img) => {
                        if (img && img.src && !img.src.startsWith('data:')) {
                          const b64 = await convertImageToBase64(img.src);
                          img.setAttribute('src', b64);
                        }
                      })
                    );

                    // Compute scale to fit a single A4 page
                    const originalTransform = element.style.transform
                    const originalTransformOrigin = element.style.transformOrigin
                    const DPI = 96
                    const A4_WIDTH_PX = Math.round(8.27 * DPI)
                    const A4_HEIGHT_PX = Math.round(11.69 * DPI)
                    const marginPxX = Math.round(0.4 * DPI) * 2
                    const marginPxY = Math.round(0.4 * DPI) * 2
                    const availableWidth = A4_WIDTH_PX - marginPxX
                    const availableHeight = A4_HEIGHT_PX - marginPxY
                    const contentWidth = Math.max(element.scrollWidth, element.getBoundingClientRect().width)
                    const contentHeight = Math.max(element.scrollHeight, element.getBoundingClientRect().height)
                    const scaleFactor = Math.min(1, availableWidth / contentWidth, availableHeight / contentHeight)
                    if (scaleFactor < 1) {
                      element.style.transform = `scale(${scaleFactor})`
                      element.style.transformOrigin = 'top left'
                    }

                    // Robust html2pdf one-page export
                    const opt = {
                      margin: [0.4, 0.4, 0.4, 0.4],
                      filename: `PI-${companyBranches[selectedBranch].name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`,
                      image: { type: 'jpeg', quality: 0.95 },
                      html2canvas: {
                        scale: 2,
                        useCORS: true,
                        allowTaint: false,
                        backgroundColor: '#ffffff',
                        logging: false
                      },
                      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait', compress: true, putOnlyUsedFonts: true },
                      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                    }
                    await html2pdf().set(opt).from(element).save()

                    // restore styles
                    element.style.transform = originalTransform
                    element.style.transformOrigin = originalTransformOrigin
                  } catch (err) {
                    console.error('PDF generation failed:', err);
                    alert('Failed to generate PDF. Please try again, or use the Print button as a fallback.');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center gap-2 shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Download PDF
              </button>
              <button
                onClick={() => setShowPIPreview(false)}
                className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 shadow-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* PI Content - Full Screen */}
            <div className="flex-1 overflow-y-auto bg-white">
              <div className="flex justify-center p-4">
                <div className="bg-white max-w-full" style={{width: '100%', maxWidth: '8.5in'}}>
                  <div id="pi-preview-content">
                    <CorporateStandardInvoice 
                      selectedBranch={(savedPiPreview && savedPiPreview.selectedBranch) || selectedBranch} 
                      companyBranches={companyBranches}
                      quotations={[(() => {
                        if (savedPiPreview && savedPiPreview.data) {
                          return savedPiPreview.data
                        }
                        const items = piFormData.items.map(item => ({
                          productName: item.description || item.subDescription || 'Product',
                          description: item.description || item.subDescription || 'Product',
                          quantity: item.quantity,
                          unit: item.unit,
                          buyerRate: item.rate,
                          amount: item.amount,
                          hsn: item.hsn
                        }))
                        const subtotal = items.reduce((sum, it) => sum + (it.amount || 0), 0)
                        const discountRate = parseFloat(piFormData.discountRate || 0)
                        const discountAmount = (subtotal * discountRate) / 100
                        const taxable = Math.max(0, subtotal - discountAmount)
                        const taxRate = 18
                        const taxAmount = taxable * (taxRate / 100)
                        const total = taxable + taxAmount
                        return ({
                          quotationNumber: `PI-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
                          items,
                          subtotal,
                          discountRate,
                          discountAmount,
                          taxRate,
                          taxAmount,
                          total,
                          billTo: {
                            business: piFormData.customer.business || 'Customer Business Name',
                            address: piFormData.customer.address || 'Customer Address',
                            phone: piFormData.customer.phone || 'Customer Phone',
                            gstNo: piFormData.customer.gstNo || 'Customer GST',
                            state: piFormData.customer.state || 'Customer State'
                          }
                        })
                      })()]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showAddCustomer && (
        <AddCustomerForm 
          onClose={() => {
            setShowAddCustomer(false)
            setEditingCustomer(null)
          }}
          onSave={handleSaveCustomer}
          editingCustomer={editingCustomer}
        />
      )}
      
      {showCreateQuotation && selectedCustomerForQuotation && (
        <CreateQuotationForm 
          customer={selectedCustomerForQuotation}
          user={user}
          onClose={() => {
            setShowCreateQuotation(false)
            setSelectedCustomerForQuotation(null)
          }}
          onSave={handleSaveQuotation}
        />
      )}

      {showCreatePI && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create Performa Invoice</h2>
              <button
                onClick={() => setShowCreatePI(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Branch Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Branch</label>
                  <select 
                    value={selectedBranch} 
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ANODE">ANODE ELECTRIC PRIVATE LIMITED</option>
                    <option value="SAMRIDDHI_CABLE">SAMRIDDHI CABLE INDUSTRIES PRIVATE LIMITED</option>
                    <option value="SAMRIDDHI_INDUSTRIES">SAMRIDDHI INDUSTRIES</option>
                  </select>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Voucher No.</label>
                    <input
                      type="text"
                      value={`PI-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dated</label>
                    <input
                      type="date"
                      value={new Date().toISOString().split('T')[0]}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="ADVANCE">ADVANCE</option>
                      <option value="CREDIT">CREDIT</option>
                      <option value="CASH">CASH</option>
                      <option value="CHEQUE">CHEQUE</option>
                      <option value="NET BANKING">NET BANKING</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buyer's Ref.</label>
                    <input
                      type="text"
                      value={`BR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Other References</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="DIRECT SALE">DIRECT SALE</option>
                      <option value="REFERRAL">REFERRAL</option>
                      <option value="WEBSITE">WEBSITE</option>
                      <option value="SOCIAL MEDIA">SOCIAL MEDIA</option>
                      <option value="ADVERTISING">ADVERTISING</option>
                      <option value="TRADE SHOW">TRADE SHOW</option>
                      <option value="EXISTING CUSTOMER">EXISTING CUSTOMER</option>
                      <option value="PARTNER">PARTNER</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dispatched Through</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="BY TRANSPORT">BY TRANSPORT</option>
                      <option value="BY COURIER">BY COURIER</option>
                      <option value="BY HAND">BY HAND</option>
                      <option value="BY POST">BY POST</option>
                      <option value="BY TRUCK">BY TRUCK</option>
                      <option value="BY TRAIN">BY TRAIN</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <input
                      type="text"
                      defaultValue="Chandrapur Transport"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Terms</label>
                    <input
                      type="text"
                      defaultValue="Delivery :- FOR upto Chandrapur Transport"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                      <input
                        type="text"
                        value={piFormData.customer.business}
                        onChange={(e) => setPiFormData(prev => ({
                          ...prev,
                          customer: { ...prev.customer, business: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter business name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={piFormData.customer.phone}
                        onChange={(e) => setPiFormData(prev => ({
                          ...prev,
                          customer: { ...prev.customer, phone: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        value={piFormData.customer.address}
                        onChange={(e) => setPiFormData(prev => ({
                          ...prev,
                          customer: { ...prev.customer, address: e.target.value }
                        }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter complete address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                      <input
                        type="text"
                        value={piFormData.customer.gstNo}
                        onChange={(e) => setPiFormData(prev => ({
                          ...prev,
                          customer: { ...prev.customer, gstNo: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter GST number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={piFormData.customer.state}
                        onChange={(e) => setPiFormData(prev => ({
                          ...prev,
                          customer: { ...prev.customer, state: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Items</h3>
                    <button 
                      type="button"
                      onClick={() => {
                        const newItem = {
                          id: Date.now(),
                          description: '',
                          subDescription: '',
                          hsn: '76141000',
                          dueOn: new Date().toISOString().split('T')[0],
                          quantity: 1,
                          unit: 'MTR',
                          rate: 0,
                          amount: 0
                        }
                        setPiFormData(prev => ({
                          ...prev,
                          items: [...prev.items, newItem]
                        }))
                      }}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {piFormData.items.map((item, index) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-medium text-gray-900">Item {index + 1}</h4>
                          {piFormData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setPiFormData(prev => ({
                                  ...prev,
                                  items: prev.items.filter((_, i) => i !== index)
                                }))
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <select 
                              value={item.description}
                              onChange={(e) => {
                                const updatedItems = [...piFormData.items]
                                updatedItems[index].description = e.target.value
                                setPiFormData(prev => ({ ...prev, items: updatedItems }))
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select Description</option>
                              <option value="COVERED CONDUCTOR 34 SQMM">COVERED CONDUCTOR 34 SQMM</option>
                              <option value="XLPE CABLE 1.5MM">XLPE CABLE 1.5MM</option>
                              <option value="ACSR CONDUCTOR 50MM²">ACSR CONDUCTOR 50MM²</option>
                              <option value="AAAC CONDUCTOR 70MM²">AAAC CONDUCTOR 70MM²</option>
                              <option value="ALUMINIUM WIRE">ALUMINIUM WIRE</option>
                              <option value="COPPER WIRE">COPPER WIRE</option>
                              <option value="ELECTRICAL PANEL">ELECTRICAL PANEL</option>
                              <option value="TRANSFORMER">TRANSFORMER</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sub Description</label>
                            <select 
                              value={item.subDescription}
                              onChange={(e) => {
                                const updatedItems = [...piFormData.items]
                                updatedItems[index].subDescription = e.target.value
                                setPiFormData(prev => ({ ...prev, items: updatedItems }))
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select Sub Description</option>
                              <option value="COVERED CONDUCTOR 34SQMM XLPE 3 LAYER">COVERED CONDUCTOR 34SQMM XLPE 3 LAYER</option>
                              <option value="XLPE CABLE 1.5MM SINGLE CORE">XLPE CABLE 1.5MM SINGLE CORE</option>
                              <option value="XLPE CABLE 1.5MM MULTI CORE">XLPE CABLE 1.5MM MULTI CORE</option>
                              <option value="ACSR CONDUCTOR 50MM² 7 STRAND">ACSR CONDUCTOR 50MM² 7 STRAND</option>
                              <option value="ACSR CONDUCTOR 50MM² 19 STRAND">ACSR CONDUCTOR 50MM² 19 STRAND</option>
                              <option value="AAAC CONDUCTOR 70MM² 7 STRAND">AAAC CONDUCTOR 70MM² 7 STRAND</option>
                              <option value="AAAC CONDUCTOR 70MM² 19 STRAND">AAAC CONDUCTOR 70MM² 19 STRAND</option>
                              <option value="ALUMINIUM WIRE 4MM">ALUMINIUM WIRE 4MM</option>
                              <option value="ALUMINIUM WIRE 6MM">ALUMINIUM WIRE 6MM</option>
                              <option value="COPPER WIRE 2.5MM">COPPER WIRE 2.5MM</option>
                              <option value="COPPER WIRE 4MM">COPPER WIRE 4MM</option>
                              <option value="ELECTRICAL PANEL 3 PHASE">ELECTRICAL PANEL 3 PHASE</option>
                              <option value="ELECTRICAL PANEL SINGLE PHASE">ELECTRICAL PANEL SINGLE PHASE</option>
                              <option value="TRANSFORMER 11KV/440V">TRANSFORMER 11KV/440V</option>
                              <option value="TRANSFORMER 33KV/11KV">TRANSFORMER 33KV/11KV</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">HSN/SAC</label>
                            <input
                              type="text"
                              value={item.hsn}
                              onChange={(e) => {
                                const updatedItems = [...piFormData.items]
                                updatedItems[index].hsn = e.target.value
                                setPiFormData(prev => ({ ...prev, items: updatedItems }))
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due On</label>
                            <input
                              type="date"
                              value={item.dueOn}
                              onChange={(e) => {
                                const updatedItems = [...piFormData.items]
                                updatedItems[index].dueOn = e.target.value
                                setPiFormData(prev => ({ ...prev, items: updatedItems }))
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const updatedItems = [...piFormData.items]
                                updatedItems[index].quantity = parseFloat(e.target.value) || 0
                                updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate
                                setPiFormData(prev => ({ ...prev, items: updatedItems }))
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                            <select 
                              value={item.unit}
                              onChange={(e) => {
                                const updatedItems = [...piFormData.items]
                                updatedItems[index].unit = e.target.value
                                setPiFormData(prev => ({ ...prev, items: updatedItems }))
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="MTR">MTR</option>
                              <option value="KG">KG</option>
                              <option value="PCS">PCS</option>
                              <option value="SET">SET</option>
                              <option value="BOX">BOX</option>
                              <option value="ROLL">ROLL</option>
                              <option value="BUNDLE">BUNDLE</option>
                              <option value="LOT">LOT</option>
                              <option value="TON">TON</option>
                              <option value="QUINTAL">QUINTAL</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) => {
                                const updatedItems = [...piFormData.items]
                                updatedItems[index].rate = parseFloat(e.target.value) || 0
                                updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate
                                setPiFormData(prev => ({ ...prev, items: updatedItems }))
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Auto-Calculated)</label>
                            <input
                              type="text"
                              value={item.amount.toFixed(2)}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                              style={{backgroundColor: '#f9fafb', color: '#6b7280'}}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals Section */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={piFormData.discountRate}
                      onChange={(e) => {
                        const discountRate = parseFloat(e.target.value) || 0
                        setPiFormData(prev => ({ ...prev, discountRate }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IGST (18%) - Auto-Calculated</label>
                    <input
                      type="text"
                      value={(() => {
                        const subtotal = piFormData.items.reduce((sum, item) => sum + item.amount, 0)
                        const discount = (subtotal * (piFormData.discountRate || 0)) / 100
                        const taxable = Math.max(0, subtotal - discount)
                        return (taxable * 0.18).toFixed(2)
                      })()}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                      style={{backgroundColor: '#f9fafb', color: '#6b7280'}}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount - Auto-Calculated</label>
                    <input
                      type="text"
                      value={(() => {
                        const subtotal = piFormData.items.reduce((sum, item) => sum + item.amount, 0)
                        const discount = (subtotal * (piFormData.discountRate || 0)) / 100
                        const taxable = Math.max(0, subtotal - discount)
                        const tax = taxable * 0.18
                        return (taxable + tax).toFixed(2)
                      })()}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                      style={{backgroundColor: '#f9fafb', color: '#6b7280'}}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount in Words - Auto-Generated</label>
                    <input
                      type="text"
                      value={`INR ${numberToWords(Math.floor(piFormData.items.reduce((sum, item) => sum + item.amount, 0) * 1.18))} Only`}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                      style={{backgroundColor: '#f9fafb', color: '#6b7280'}}
                    />
                  </div>
                </div>

                {/* Bank Details */}
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 text-blue-800">🏦 Bank Details (Separate Fields)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder's Name</label>
                      <input
                        type="text"
                        defaultValue="ANODE ELECTRIC PVT. LTD."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="ICICI BANK">ICICI BANK</option>
                        <option value="HDFC BANK">HDFC BANK</option>
                        <option value="SBI BANK">SBI BANK</option>
                        <option value="AXIS BANK">AXIS BANK</option>
                        <option value="KOTAK MAHINDRA BANK">KOTAK MAHINDRA BANK</option>
                        <option value="PUNJAB NATIONAL BANK">PUNJAB NATIONAL BANK</option>
                        <option value="BANK OF BARODA">BANK OF BARODA</option>
                        <option value="CANARA BANK">CANARA BANK</option>
                        <option value="UNION BANK">UNION BANK</option>
                        <option value="INDIAN BANK">INDIAN BANK</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        defaultValue="777705336601"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">📍 Branch (Separate Field)</label>
                      <input
                        type="text"
                        defaultValue="NIWARGANJ"
                        className="w-full px-3 py-2 border-2 border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">🔢 IFSC Code (Separate Field)</label>
                      <input
                        type="text"
                        defaultValue="ICIC0007345"
                        className="w-full px-3 py-2 border-2 border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">🏷️ Bank Code (Separate Field)</label>
                      <input
                        type="text"
                        defaultValue="36601"
                        className="w-full px-3 py-2 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreatePI(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Show PI preview modal
                  setShowPIPreview(true)
                  // Close the create PI modal
                  setShowCreatePI(false)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 inline-flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview & Save PI
              </button>
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
                onClick={() => {
                  setShowAddPaymentModal(true);
                }}
                >
                Add Payment
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Add Payment</h3>
                <button 
                  onClick={() => {
                    setShowAddPaymentModal(false);
                    setAddPaymentForm({
                      quotationId: '',
                      piId: '',
                      amount: '',
                      paymentMethod: 'Cash',
                      paymentDate: new Date().toISOString().split('T')[0],
                      reference: '',
                      remarks: ''
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-6">
                {/* Customer Info */}
                {selectedCustomer && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">{selectedCustomer.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <span className="ml-2 font-medium">{selectedCustomer.phone}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quotation ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addPaymentForm.quotationId}
                        onChange={(e) => setAddPaymentForm({...addPaymentForm, quotationId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter quotation ID"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PI ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addPaymentForm.piId}
                        onChange={(e) => setAddPaymentForm({...addPaymentForm, piId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter PI ID"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={addPaymentForm.amount}
                        onChange={(e) => setAddPaymentForm({...addPaymentForm, amount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter amount"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={addPaymentForm.paymentMethod}
                        onChange={(e) => setAddPaymentForm({...addPaymentForm, paymentMethod: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                        <option value="UPI">UPI</option>
                        <option value="Bank">Bank Transfer</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={addPaymentForm.paymentDate}
                        onChange={(e) => setAddPaymentForm({...addPaymentForm, paymentDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reference Number
                      </label>
                      <input
                        type="text"
                        value={addPaymentForm.reference}
                        onChange={(e) => setAddPaymentForm({...addPaymentForm, reference: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter reference number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Remarks
                      </label>
                      <textarea
                        value={addPaymentForm.remarks}
                        onChange={(e) => setAddPaymentForm({...addPaymentForm, remarks: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Enter any additional remarks"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                {addPaymentForm.amount && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Payment Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <span className="ml-2 font-bold text-green-600">₹{parseInt(addPaymentForm.amount || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Method:</span>
                        <span className="ml-2 font-medium">{addPaymentForm.paymentMethod}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Date:</span>
                        <span className="ml-2 font-medium">{addPaymentForm.paymentDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Reference:</span>
                        <span className="ml-2 font-medium">{addPaymentForm.reference || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddPaymentModal(false);
                  setAddPaymentForm({
                    quotationId: '',
                    piId: '',
                    amount: '',
                    paymentMethod: 'Cash',
                    paymentDate: new Date().toISOString().split('T')[0],
                    reference: '',
                    remarks: ''
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  // Handle payment submission
                  if (!addPaymentForm.quotationId || !addPaymentForm.piId || !addPaymentForm.amount) {
                    alert('Please fill in all required fields');
                    return;
                  }
                  
                  // Add to payment history
                  const newPayment = {
                    id: paymentHistory.length + 1,
                    amount: parseInt(addPaymentForm.amount),
                    date: addPaymentForm.paymentDate,
                    paymentMethod: addPaymentForm.paymentMethod,
                    status: 'paid',
                    reference: addPaymentForm.reference || `REF-${Date.now()}`,
                    remarks: addPaymentForm.remarks,
                    dueDate: addPaymentForm.paymentDate,
                    paidDate: addPaymentForm.paymentDate
                  };
                  
                  setPaymentHistory([...paymentHistory, newPayment]);
                  
                  // Reset form and close modal
                  setAddPaymentForm({
                    quotationId: '',
                    piId: '',
                    amount: '',
                    paymentMethod: 'Cash',
                    paymentDate: new Date().toISOString().split('T')[0],
                    reference: '',
                    remarks: ''
                  });
                  setShowAddPaymentModal(false);
                  
                  alert('Payment added successfully!');
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700"
                >
                Add Payment
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Import Leads</h3>
                <button 
                  onClick={() => {
                    setShowImportModal(false)
                    setImportFile(null)
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
                  <button
                    onClick={handleDownloadTemplate}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download Template
                  </button>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        {importFile ? importFile.name : 'Click to upload CSV file'}
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        or drag and drop
                      </span>
                    </label>
                    <input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowImportModal(false)
                    setImportFile(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={processCSVImport}
                  disabled={!importFile}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import Leads
                </button>
              </div>
            </div>
          </div>
        </div>
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
              <QuotationPreview
                data={{
                  quotationNumber: quotationPopupData.quotationNumber,
                  quotationDate: quotationPopupData.quotationDate,
                  validUpto: quotationPopupData.validUpto,
                  voucherNumber: quotationPopupData.voucherNumber,
                  billTo: {
                    business: quotationPopupData.customer.name || quotationPopupData.customer.business,
                    address: quotationPopupData.customer.address,
                    phone: quotationPopupData.customer.phone,
                    gstNo: quotationPopupData.customer.gstNo,
                    state: quotationPopupData.customer.state
                  },
                  items: quotationPopupData.items?.map(i => ({
                    productName: i.productName || i.description,
                    description: i.description || i.productName,
                    quantity: i.quantity,
                    unit: i.unit || 'Nos',
                    buyerRate: i.buyerRate || i.unitPrice,
                    unitPrice: i.unitPrice || i.buyerRate,
                    amount: i.amount || i.taxableAmount,
                    total: i.total || i.totalAmount,
                    hsn: i.hsn,
                    gstRate: i.gstRate
                  })),
                  subtotal: quotationPopupData.subtotal,
                  taxAmount: quotationPopupData.tax,
                  total: quotationPopupData.total,
                  selectedBranch: quotationPopupData.selectedBranch || selectedBranch
                }}
                companyBranches={companyBranches}
                user={user}
              />
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
                  const element = document.getElementById('quotation-preview-content') || document.getElementById('quotation-content')
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
                    }
                    html2pdf().set(opt).from(element).save()
                  } else {
                    alert('No quotation content to download')
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
    </main>
  )
}

