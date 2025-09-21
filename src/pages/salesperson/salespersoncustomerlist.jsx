"use client"

import React from "react"
import { Search, RefreshCw, User, Mail, Building2, Pencil, Eye, Plus, Download, Filter, Wallet, MessageCircle, Package, MapPin, Map, BadgeCheck, XCircle, FileText, Globe, X, Clock, Check, Clock as ClockIcon, ArrowRightLeft } from "lucide-react"
import html2pdf from 'html2pdf.js'
import Quotation from './salespersonquotation.jsx'
import AddCustomerForm from './salespersonaddcustomer.jsx'
import CreateQuotationForm from './salespersoncreatequotation.jsx'

function cx(...classes) {
  return classes.filter(Boolean).join(" ")
}

function Card({ className, children }) {
  return <div className={cx("rounded-lg border bg-white", className)}>{children}</div>
}

function CardContent({ className, children }) {
  return <div className={cx("p-0", className)}>{children}</div>
}

export default function CustomerListContent() {
  const [viewingCustomer, setViewingCustomer] = React.useState(null)
  const [modalTab, setModalTab] = React.useState('details')
  const [showAddCustomer, setShowAddCustomer] = React.useState(false)
  const [showCreateQuotation, setShowCreateQuotation] = React.useState(false)
  const [selectedCustomerForQuotation, setSelectedCustomerForQuotation] = React.useState(null)
  const [quotationData, setQuotationData] = React.useState(null)
  const [lastQuotationData, setLastQuotationData] = React.useState(null)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [editingCustomer, setEditingCustomer] = React.useState(null)
  const [showFilters, setShowFilters] = React.useState(false)
  // Payment related state
  const [showPaymentDetails, setShowPaymentDetails] = React.useState(false)
  const [selectedCustomer, setSelectedCustomer] = React.useState(null)
  const [paymentHistory, setPaymentHistory] = React.useState([])
  const [totalAmount, setTotalAmount] = React.useState(0)
  
  // Quotations data
  const [quotations, setQuotations] = React.useState([
    {
      id: 'QTN-2025-001',
      date: '2025-09-10T14:30:00',
      amount: 15000,
      status: 'sent',
      remarks: 'Initial quotation for 100m cable',
      documentUrl: '/quotation-1.pdf',
      items: [
        { description: '100m Copper Cable', quantity: 100, rate: 100, amount: 10000 },
        { description: 'Installation Charges', quantity: 1, rate: 5000, amount: 5000 }
      ],
      total: 15000,
      customerNotes: 'Customer requested discount on bulk order',
      validity: '2025-10-10',
      terms: '50% advance, 50% on delivery',
      preparedBy: 'John Doe'
    },
    {
      id: 'QTN-2025-002',
      date: '2025-09-15T11:20:00',
      amount: 25000,
      status: 'revised',
      remarks: 'Revised quotation with additional items',
      documentUrl: '/quotation-2.pdf',
      items: [
        { description: '150m Copper Cable', quantity: 150, rate: 100, amount: 15000 },
        { description: 'Installation Charges', quantity: 1, rate: 5000, amount: 5000 },
        { description: 'Additional Wiring', quantity: 1, rate: 5000, amount: 5000 }
      ],
      total: 25000,
      customerNotes: 'Customer approved the revised quote',
      validity: '2025-10-15',
      terms: '30% advance, 70% on completion',
      preparedBy: 'John Doe',
      revisionOf: 'QTN-2025-001'
    },
    {
      id: 'QTN-2025-003',
      date: '2025-09-20T16:45:00',
      amount: 12000,
      status: 'accepted',
      remarks: 'Follow-up quotation for additional work',
      documentUrl: '/quotation-3.pdf',
      items: [
        { description: 'Additional Wiring', quantity: 1, rate: 7000, amount: 7000 },
        { description: 'Labor Charges', quantity: 1, rate: 5000, amount: 5000 }
      ],
      total: 12000,
      customerNotes: 'Customer requested urgent completion',
      validity: '2025-10-20',
      terms: 'Full payment on completion',
      preparedBy: 'John Doe'
    }
  ])
  const [showPdfViewer, setShowPdfViewer] = React.useState(false)
  const [currentPdfUrl, setCurrentPdfUrl] = React.useState('')
  // Available options for dropdowns
  const productTypes = ['Conductor', 'Cable', 'AAAC', 'Aluminium', 'Copper', 'PVC', 'Wire'];
  const customerTypes = ['Business', 'Corporate', 'Individual', 'Reseller', 'Government'];
  const leadSources = ['Phone', 'Marketing', 'FB Ads', 'Google Ads', 'Referral', 'Webinar', 'Website', 'Email', 'Other'];
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
    productType: '',
    customerType: '',
    enquiryBy: '',
    date: '',
    connectedStatus: '',
    finalStatus: ''
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
      productType: '',
      customerType: '',
      enquiryBy: '',
      date: '',
      connectedStatus: '',
      finalStatus: ''
    });
  };
  const [customers, setCustomers] = React.useState([
    {
      id: 1,
      name: "Raj Koshta",
      phone: "9340662655",
      email: "telesalesuser@gmail.com",
      business: "Tech Team",
      location: "Jabalpur",
      gstNo: "27ABCDE1234F1Z5",
      address: "KHASRA NO. 805/5, IT PARK, BARGI HILLS",
      state: "Madhya Pradesh",
      enquiryBy: "Phone",
      productType: "Conductor",
      customerType: "Business",
      date: "2025-09-10",
      connected: { status: "Connected", remark: "Spoke with Raj, requested quote", datetime: "2025-09-10 11:15 AM" },
      finalStatus: "Hot",
      finalInfo: { status: "next_meeting", datetime: "2025-09-12 03:30 PM", remark: "Interested" },
      latestQuotationUrl: "#",
      quotationsSent: 0,
      followUpLink: "https://calendar.google.com/",
      whatsapp: "+919340662655",
      transferredLeads: [
        { from: "John Doe", to: "Sarah Wilson", date: "2025-09-08", reason: "Geographic reassignment" },
        { from: "John Doe", to: "Mike Johnson", date: "2025-09-09", reason: "Product specialization" }
      ],
    },
    {
      id: 2,
      name: "Ankit",
      phone: "7879431560",
      email: "telesalesuser@gmail.com",
      business: "Anit MBG",
      location: "Jabalpur, MP",
      gstNo: "27AABCU9603R1ZV",
      address: "Anit MBG Campus, Jabalpur",
      state: "Madhya Pradesh",
      enquiryBy: "Marketing",
      productType: "Cable",
      customerType: "Corporate",
      date: "2025-09-09",
      connected: { status: "Follow Up", remark: "Call back tomorrow", datetime: "2025-09-09 05:30 PM" },
      finalStatus: "Warm",
      finalInfo: { status: "next_meeting", datetime: "2025-09-11 11:00 AM", remark: "Interested" },
      latestQuotationUrl: "#",
      quotationsSent: 1,
      followUpLink: "https://calendar.google.com/",
      whatsapp: "+917879431560",
      transferredLeads: [],
    },
    {
      id: 3,
      name: "Mohit Patel",
      phone: "7879431560",
      email: "telesalesuser@gmail.com",
      business: "Mbg Card",
      location: "Jabalpur, MP",
      gstNo: "27BBBCU9603R2ZA",
      address: "Mbg Card Office, Jabalpur",
      state: "Madhya Pradesh",
      enquiryBy: "FB Ads",
      productType: "AAAC",
      customerType: "Individual",
      date: "2025-09-08",
      connected: { status: "Not Connected", remark: "No answer", datetime: "2025-09-08 02:10 PM" },
      finalStatus: "Cold",
      finalInfo: { status: "next_meeting", datetime: "2025-09-13 02:00 PM", remark: "Not Interested" },
      latestQuotationUrl: "#",
      quotationsSent: 0,
      followUpLink: "https://calendar.google.com/",
      whatsapp: "+917879431560",
      transferredLeads: [
        { from: "Alex Brown", to: "Mohit Patel", date: "2025-09-07", reason: "Workload distribution" }
      ],
    },
    {
      id: 4,
      name: "Ankit",
      phone: "7879431560",
      email: "telesalesuser@gmail.com",
      business: "Anit MBG",
      location: "Jabalpur, MP",
      gstNo: "27ABCDE1234F1Z5",
      address: "Street 12, Jabalpur",
      state: "Madhya Pradesh",
      enquiryBy: "Marketing",
      productType: "Aluminium",
      connected: { status: "Connected", remark: "Negotiation in progress", datetime: "2025-09-07 03:45 PM" },
      finalStatus: "Hot",
      finalInfo: { status: "closed", datetime: "2025-09-07 04:00 PM", remark: "Interested" },
      latestQuotationUrl: "#",
      quotationsSent: 2,
      followUpLink: "https://calendar.google.com/",
      whatsapp: "+917879431560",
      transferredLeads: [],
    },
    {
      id: 5,
      name: "Mohit Patel Test Name",
      phone: "7879431560",
      email: "test@gmail.com",
      business: "Test Business MBG Card ndia PVT LTD Jabalpur",
      location: "Jabalpur, MP",
      gstNo: "27TEST1234F1Z5",
      address: "Industrial Area, Jabalpur",
      state: "Madhya Pradesh",
      enquiryBy: "Referral",
      productType: "Copper",
      connected: { status: "Connected", remark: "Sent brochure via email", datetime: "2025-09-06 10:00 AM" },
      finalStatus: "Warm",
      finalInfo: { status: "next_meeting", datetime: "2025-09-15 10:30 AM", remark: "Interested" },
      latestQuotationUrl: "#",
      quotationsSent: 3,
      followUpLink: "https://calendar.google.com/",
      whatsapp: "+917879431560",
      transferredLeads: [],
    },
    {
      id: 6,
      name: "Mohit Patel Test Name",
      phone: "7879431560",
      email: "test@gmail.com",
      business: "Test Business MBG Card ndia PVT LTD Jabalpur",
      location: "Jabalpur, MP",
      gstNo: "27TEST5678F1Z5",
      address: "Industrial Park, Jabalpur",
      state: "Madhya Pradesh",
      enquiryBy: "Marketing",
      productType: "PVC",
      connected: { status: "Follow Up", remark: "Awaiting requirement list", datetime: "2025-09-05 01:20 PM" },
      finalStatus: "Warm",
      finalInfo: { status: "next_meeting", datetime: "2025-09-14 05:00 PM", remark: "Interested" },
      latestQuotationUrl: "#",
      quotationsSent: 0,
      followUpLink: "https://calendar.google.com/",
      whatsapp: "+917879431560",
      transferredLeads: [],
    },
    {
      id: 7,
      name: "Abid",
      phone: "7845416535",
      email: "N/A",
      business: "MBG SALES",
      location: "Pune",
      gstNo: "27ABIDA1234F1Z5",
      address: "MG Road, Pune",
      state: "Maharashtra",
      enquiryBy: "Google Ads",
      productType: "Cable",
      connected: { status: "Connected", remark: "Shared price list", datetime: "2025-09-04 04:00 PM" },
      finalStatus: "Hot",
      finalInfo: { status: "closed", datetime: "2025-09-04 04:30 PM", remark: "Interested" },
      latestQuotationUrl: "#",
      quotationsSent: 1,
      followUpLink: "https://calendar.google.com/",
      whatsapp: "+917845416535",
      transferredLeads: [
        { from: "David Lee", to: "Abid", date: "2025-09-03", reason: "Regional expertise" },
        { from: "Emma Davis", to: "Abid", date: "2025-09-04", reason: "Product knowledge" },
        { from: "Tom Wilson", to: "Abid", date: "2025-09-05", reason: "Customer relationship" }
      ],
    },
    {
      id: 8,
      name: "Naman",
      phone: "9340662655",
      email: "N/A",
      business: "FINANCE",
      location: "Delhi",
      gstNo: "07NAMAN1234F1Z5",
      address: "Connaught Place, Delhi",
      state: "Delhi",
      enquiryBy: "Webinar",
      productType: "Wire",
      connected: { status: "Not Interested", remark: "Budget constraints", datetime: "2025-09-03 12:30 PM" },
      finalStatus: "Lost",
      finalInfo: { status: "closed", datetime: "2025-09-03 01:00 PM", remark: "Not Interested" },
      latestQuotationUrl: "#",
      quotationsSent: 0,
      followUpLink: "https://calendar.google.com/",
      whatsapp: "+919340662655",
      transferredLeads: [],
    },
    {
      id: 9,
      name: "Gourav",
      phone: "9340662655",
      email: "N/A",
      business: "MBG SALES",
      location: "Pune",
      gstNo: "27GOURA1234F1Z5",
      address: "Baner, Pune",
      state: "Maharashtra",
      enquiryBy: "Facebook",
      productType: "Conductor",
      connected: { status: "Connected", remark: "Site visit scheduled", datetime: "2025-09-02 09:45 AM" },
      finalStatus: "Warm",
      finalInfo: { status: "next_meeting", datetime: "2025-09-16 09:45 AM", remark: "Interested" },
      latestQuotationUrl: "#",
      quotationsSent: 0,
      followUpLink: "https://calendar.google.com/",
      whatsapp: "+919340662655",
      transferredLeads: [],
    },
  ])

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

  const handleSaveQuotation = (newQuotationData) => {
    setQuotationData(newQuotationData)
    setLastQuotationData(newQuotationData) // Store the last created quotation
    
    // Update customer's quotation count and latest quotation flag
    setCustomers(prevCustomers => 
      prevCustomers.map(customer => 
        customer.id === selectedCustomerForQuotation.id 
          ? { 
              ...customer, 
              quotationsSent: (customer.quotationsSent || 0) + 1,
              latestQuotationUrl: "latest" // Mark that this customer has a latest quotation
            }
          : customer
      )
    )
    
    setShowCreateQuotation(false)
    setSelectedCustomerForQuotation(null)
  }


  const handleViewLatestQuotation = async (customer) => {
    try {
      if (lastQuotationData && lastQuotationData.customer?.id === customer.id) {
        // Generate PDF and show in modal
        const pdfBlob = await generateQuotationPDF(lastQuotationData, customer, true)
        const pdfUrl = URL.createObjectURL(pdfBlob)
        setCurrentPdfUrl(pdfUrl)
        setShowPdfViewer(true)
      }
    } catch (error) {
      console.error('Error viewing quotation:', error)
      // You might want to show an error message to the user here
      alert('Failed to generate PDF. Please try again.')
    }
  }

  const handleWalletClick = async (customer) => {
    // Sample payment history data
    const sampleHistory = [
      {
        id: 1,
        date: '2025-09-10',
        amount: 12500.00,
        receiptNo: 'RCPT-' + Math.floor(100000 + Math.random() * 900000),
        paymentMethod: 'Bank Transfer',
        status: 'Completed',
        description: 'Final Payment for Order #ORD-2025-0098'
      },
      {
        id: 2,
        date: '2025-08-25',
        amount: 8750.00,
        receiptNo: 'RCPT-' + Math.floor(100000 + Math.random() * 900000),
        paymentMethod: 'UPI',
        status: 'Completed',
        description: 'Advance Payment for Order #ORD-2025-0098'
      }
    ]
    
    // Calculate total amount (in a real app, this would come from the order/quote)
    const customerTotal = 30000.00 // Example total amount
    
    setPaymentHistory(sampleHistory)
    setTotalAmount(customerTotal)
    setSelectedCustomer({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email
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
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Product Type</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">State</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Lead Source</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Customer Type</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Date</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Connected Status</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left; font-weight: bold;">Final Status</th>
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
                <td style="border: 1px solid #d1d5db; padding: 8px;">${customer.productType || 'N/A'}</td>
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

  const handleSaveCustomer = (newCustomerData) => {
    if (editingCustomer) {
      // Update existing customer
      const updatedCustomer = {
        ...editingCustomer,
        name: newCustomerData.customerName,
        phone: newCustomerData.mobileNumber,
        email: newCustomerData.email || "N/A",
        business: newCustomerData.businessType,
        location: newCustomerData.state, // Use state as location
        gstNo: newCustomerData.gstNumber || "N/A",
        address: newCustomerData.address,
        state: newCustomerData.state,
        productType: newCustomerData.productType,
        customerType: newCustomerData.customerType,
        enquiryBy: newCustomerData.leadSource,
        date: newCustomerData.date,
        connected: { 
          ...editingCustomer.connected,
          status: newCustomerData.connectionStatus,
          remark: "Customer information updated", 
          datetime: new Date().toLocaleString() 
        },
        finalInfo: { 
          ...editingCustomer.finalInfo,
          status: newCustomerData.finalStatus === "Closed" ? "closed" : "next_meeting", 
          remark: newCustomerData.finalStatus 
        },
        whatsapp: newCustomerData.whatsappNumber ? `+91${newCustomerData.whatsappNumber}` : editingCustomer.whatsapp,
      }
      
      setCustomers(prev => prev.map(customer => 
        customer.id === editingCustomer.id ? updatedCustomer : customer
      ))
    } else {
      // Add new customer
      const newCustomer = {
        id: customers.length + 1,
        name: newCustomerData.customerName,
        phone: newCustomerData.mobileNumber,
        email: newCustomerData.email || "N/A",
        business: newCustomerData.businessType,
        location: newCustomerData.state, // Use state as location
        gstNo: newCustomerData.gstNumber || "N/A",
        address: newCustomerData.address,
        state: newCustomerData.state,
        enquiryBy: newCustomerData.leadSource,
        productType: newCustomerData.productType,
        customerType: newCustomerData.customerType,
        date: newCustomerData.date,
        connected: { 
          status: newCustomerData.connectionStatus, 
          remark: "New customer added", 
          datetime: new Date().toLocaleString() 
        },
        finalStatus: "New",
        finalInfo: { 
          status: newCustomerData.finalStatus === "Closed" ? "closed" : "next_meeting", 
          datetime: "", 
          remark: newCustomerData.finalStatus 
        },
        latestQuotationUrl: "#",
        quotationsSent: 0,
        followUpLink: "https://calendar.google.com/",
        whatsapp: newCustomerData.whatsappNumber ? `+91${newCustomerData.whatsappNumber}` : null,
      }
      
      setCustomers(prev => [...prev, newCustomer])
    }
    
    setShowAddCustomer(false)
    setEditingCustomer(null)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // In a real application, you would fetch fresh data from your API
    // For now, we'll simulate refreshing by updating timestamps and connection status
    setCustomers(prevCustomers => 
      prevCustomers.map(customer => ({
        ...customer,
        connected: {
          ...customer.connected,
          datetime: new Date().toLocaleString()
        },
        // Randomly update some connection statuses to simulate real-time changes
        ...(Math.random() > 0.7 && {
          connected: {
            ...customer.connected,
            status: ['Connected', 'Follow Up', 'Not Connected'][Math.floor(Math.random() * 3)],
            datetime: new Date().toLocaleString()
          }
        })
      }))
    )
    
    setIsRefreshing(false)
    
    // Show success feedback
    const refreshButton = document.querySelector('[data-refresh-btn]')
    if (refreshButton) {
      refreshButton.style.transform = 'scale(1.1)'
      setTimeout(() => {
        refreshButton.style.transform = 'scale(1)'
      }, 200)
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
          customer.productType?.toLowerCase() || '',
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
          
          // Special handling for connected status to match exactly
          if (key === 'connectedStatus') {
            // For connected status, do an exact match (case-insensitive)
            return customer.connected?.status?.toLowerCase() === value.toLowerCase();
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
    <main className="flex-1 overflow-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
            <p className="text-sm text-gray-600">Manage and track your sales leads</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
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
              onClick={handleExportLeads}
              className="px-3 py-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
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

      <Card className="border-0 shadow-sm max-w-7xl mx-auto">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-6 font-medium text-gray-600 text-xs">#</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600 text-xs">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-indigo-500" />
                      Name & Phone
                    </div>
                    {showFilters && (
                      <input
                        type="text"
                        value={filters.customer}
                        onChange={(e) => handleFilterChange('customer', e.target.value)}
                        className="mt-1 w-full text-xs p-1 border rounded"
                        placeholder="Filter customer..."
                      />
                    )}
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600 text-xs">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-blue-500" />
                      Address
                    </div>
                    {showFilters && (
                      <input
                        type="text"
                        value={filters.address}
                        onChange={(e) => handleFilterChange('address', e.target.value)}
                        className="mt-1 w-full text-xs p-1 border rounded"
                        placeholder="Filter address..."
                      />
                    )}
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600 text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3 text-purple-500" />
                      GST No.
                    </div>
                    {showFilters && (
                      <input
                        type="text"
                        value={filters.gstNo}
                        onChange={(e) => handleFilterChange('gstNo', e.target.value)}
                        className="mt-1 w-full text-xs p-1 border rounded"
                        placeholder="Filter GST..."
                      />
                    )}
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600 text-xs w-48">
                    <div className="flex items-center gap-2">
                      <Package className="h-3 w-3 text-violet-500" />
                      Product Type
                    </div>
                    {showFilters && (
                      <select
                        value={filters.productType}
                        onChange={(e) => handleFilterChange('productType', e.target.value)}
                        className="mt-1 w-full text-xs p-1 border rounded bg-white"
                      >
                        <option value="">All Types</option>
                        {productTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    )}
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600 text-xs">
                    <div className="flex items-center gap-2">
                      <Map className="h-3 w-3 text-indigo-500" />
                      State
                    </div>
                    {showFilters && (
                      <select
                        value={filters.state}
                        onChange={(e) => handleFilterChange('state', e.target.value)}
                        className="mt-1 w-full text-xs p-1 border rounded bg-white"
                      >
                        <option value="">All States</option>
                        {states.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    )}
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600 text-xs">
                    <div className="flex items-center gap-2">
                      <Globe className="h-3 w-3 text-orange-500" />
                      Lead Source
                    </div>
                    {showFilters && (
                      <select
                        value={filters.enquiryBy}
                        onChange={(e) => handleFilterChange('enquiryBy', e.target.value)}
                        className="mt-1 w-full text-xs p-1 border rounded bg-white"
                      >
                        <option value="">All Sources</option>
                        {leadSources.map(source => (
                          <option key={source} value={source}>{source}</option>
                        ))}
                      </select>
                    )}
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600 text-xs">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-purple-500" />
                      Customer Type
                    </div>
                    {showFilters && (
                      <select
                        value={filters.customerType}
                        onChange={(e) => handleFilterChange('customerType', e.target.value)}
                        className="mt-1 w-full text-xs p-1 border rounded bg-white"
                      >
                        <option value="">All Types</option>
                        {customerTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    )}
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600 text-xs w-28">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3 text-indigo-500" />
                      Date
                    </div>
                    {showFilters && (
                      <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => handleFilterChange('date', e.target.value)}
                        className="mt-1 w-full text-xs p-1 border rounded bg-white"
                      />
                    )}
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600 text-xs">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-3 w-3 text-emerald-600" />
                      Connected Status
                    </div>
                    {showFilters && (
                      <select
                        value={filters.connectedStatus}
                        onChange={(e) => handleFilterChange('connectedStatus', e.target.value)}
                        className="mt-1 w-full text-xs p-1 border rounded bg-white"
                      >
                        <option value="">All Statuses</option>
                        <option value="Connected">Connected</option>
                        <option value="Not Connected">Not Connected</option>
                        <option value="Follow Up">Follow Up</option>
                        <option value="Not Interested">Not Interested</option>
                      </select>
                    )}
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600 text-xs">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-3 w-3 text-blue-600" />
                      Final Status
                    </div>
                    {showFilters && (
                      <select
                        value={filters.finalStatus}
                        onChange={(e) => handleFilterChange('finalStatus', e.target.value)}
                        className="mt-1 w-full text-xs p-1 border rounded bg-white"
                      >
                        <option value="">All Statuses</option>
                        <option value="Hot">Hot</option>
                        <option value="Warm">Warm</option>
                        <option value="Cold">Cold</option>
                        <option value="Lost">Lost</option>
                        <option value="Won">Won</option>
                      </select>
                    )}
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600 text-xs">
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft className="h-3 w-3 text-indigo-500" />
                      Transferred Leads
                    </div>
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600 text-xs">
                    <div className="flex items-center gap-2">
                      <Pencil className="h-3 w-3 text-gray-500" />
                      Action
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-gray-300" />
                        <p className="text-sm">
                          {searchQuery ? `No customers found for "${searchQuery}"` : 'No customers available'}
                        </p>
                        {searchQuery && (
                          <button 
                            onClick={() => setSearchQuery('')}
                            className="text-blue-600 hover:text-blue-700 text-sm underline"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-50 odd:bg-white even:bg-gray-50/40 hover:bg-white transition-colors">
                    <td className="py-3 px-6 text-xs font-medium text-gray-900">{customer.id}</td>
                    <td className="py-3 px-6">
                      <div>
                        <div className="font-medium text-gray-900 text-xs">{customer.name}</div>
                        <div className="text-xs text-gray-500">{customer.phone}</div>
                        {customer.whatsapp && (
                          <div className="text-xs text-green-600 mt-1">
                            <a href={`https://wa.me/${customer.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" /> WhatsApp
                            </a>
                          </div>
                        )}
                        {customer.email && customer.email !== "N/A" && (
                          <div className="text-xs text-cyan-600 mt-1">
                            <button 
                              onClick={() => window.open(`mailto:${customer.email}?subject=Follow up from ANOCAB&body=Dear ${customer.name},%0D%0A%0D%0AThank you for your interest in our products.%0D%0A%0D%0ABest regards,%0D%0AANOCAB Team`, '_blank')}
                              className="inline-flex items-center gap-1 hover:text-cyan-700 transition-colors"
                              title="Send Email"
                            >
                              <Mail className="h-3 w-3" /> {customer.email}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-xs text-gray-700">
                      <div className="font-medium">{customer.address}</div>
                    </td>
                    <td className="py-3 px-6 text-xs text-gray-700">
                      <div className="font-medium">{customer.gstNo}</div>
                    </td>
                    <td className="py-3 px-6 text-xs text-gray-700">
                      <div className="font-medium">{customer.productType}</div>
                    </td>
                    <td className="py-3 px-6 text-xs text-gray-700">
                      <div className="font-medium">{customer.state}</div>
                    </td>
                    <td className="py-3 px-6 text-xs text-gray-700">
                      <div className="font-medium">{customer.enquiryBy}</div>
                    </td>
                    <td className="py-3 px-6 text-xs text-gray-700">
                      <div className="font-medium">{customer.customerType || 'N/A'}</div>
                    </td>
                    <td className="py-3 px-6 text-xs text-gray-700 w-28">
                      <div className="font-medium whitespace-nowrap">{customer.date}</div>
                    </td>
                    <td className="py-3 px-6 text-xs text-gray-700">
                      <div className="flex flex-col">
                        <span className={
                          customer.connected?.status === 'Connected'
                            ? 'inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border bg-green-50 text-green-700 border-green-200'
                            : customer.connected?.status === 'Not Connected'
                            ? 'inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border bg-red-50 text-red-700 border-red-200'
                            : 'inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border bg-yellow-50 text-yellow-700 border-yellow-200'
                        }>
                          {customer.connected?.status || '-'}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">{customer.connected?.remark || '-'}</span>
                        <span className="text-xs text-gray-400">{customer.connected?.datetime || ''}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-xs text-gray-700">
                      <div className="flex flex-col">
                        <span className={
                          customer.finalInfo?.status === 'closed'
                            ? 'inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border bg-gray-50 text-gray-700 border-gray-200'
                            : 'inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200'
                        }>
                          {customer.finalInfo?.status === 'closed' ? 'Closed' : 'Next Scheduled Meeting'}
                        </span>
                        {customer.finalInfo?.datetime && (
                          <span className="text-xs text-gray-500 mt-1">{customer.finalInfo.datetime}</span>
                        )}
                        {customer.finalInfo?.remark && (
                          <span className={
                            customer.finalInfo.remark.toLowerCase().includes('not')
                              ? 'text-xs text-red-600'
                              : 'text-xs text-green-600'
                          }>
                            {customer.finalInfo.remark}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex flex-col gap-1">
                        {customer.transferredLeads && customer.transferredLeads.length > 0 ? (
                          customer.transferredLeads.map((transfer, index) => (
                            <div key={index} className="text-xs">
                              <div className="flex items-center gap-1 mb-1">
                                <ArrowRightLeft className="h-3 w-3 text-indigo-500" />
                                <span className="font-medium text-indigo-800">
                                  {transfer.from} → {transfer.to}
                                </span>
                              </div>
                              <div className="text-gray-500 ml-4">
                                {transfer.date} • {transfer.reason}
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            <ArrowRightLeft className="h-3 w-3 mr-1" />
                            No transfers
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex flex-col gap-2">
                        <button onClick={() => handleEdit(customer)} className="p-1.5 rounded-md hover:bg-gray-100 relative group" title="Edit Customer">
                          <Pencil className="h-3 w-3 text-gray-600" />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                            Edit Customer
                          </span>
                        </button>
                        <button onClick={() => handleView(customer)} className="p-1.5 rounded-md hover:bg-gray-100 relative group" title="View Details">
                          <Eye className="h-3 w-3 text-gray-600" />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                            View Details
                          </span>
                        </button>
                        <button 
                          onClick={() => handleWalletClick(customer)}
                          className="p-1.5 rounded-md hover:bg-green-50 text-green-600 relative group" 
                          title="View Payment Receipt"
                        >
                          <Wallet className="h-3 w-3" />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                            Last Payment
                          </span>
                        </button>
                        <button onClick={() => handleQuotation(customer)} className="p-1.5 rounded-md hover:bg-purple-50 text-purple-600 relative group" title="Quotation">
                          <FileText className="h-3 w-3" />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                            Quotation
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
                <button className={cx("px-3 py-2 text-sm flex items-center gap-1", modalTab === 'payment_timeline' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900')} onClick={() => setModalTab('payment_timeline')}>
                  <Clock className="h-4 w-4" />
                  Performa Invoice
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
              {modalTab === 'payment_timeline' && (
                <div className="bg-white" style={{fontFamily: 'Arial, sans-serif', fontSize: '12px', lineHeight: '1.4'}}>
                  {/* Header Section - Exact match to your PI */}
                  <div style={{borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '15px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                      <div style={{flex: '1', textAlign: 'center'}}>
                        <div style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '5px'}}>PROFORMA INVOICE</div>
                        <div style={{fontSize: '18px', fontWeight: '600'}}>PROFORMA INVOICE</div>
                      </div>
                      <div style={{fontSize: '11px', color: '#666'}}>
                        Printed on {new Date().toLocaleDateString('en-GB')} at {new Date().toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'})}
                      </div>
                    </div>
                  </div>

                  {/* Invoice Details Box - Exact positioning */}
                  <div style={{marginBottom: '20px'}}>
                    <div style={{border: '2px solid #000', padding: '15px', backgroundColor: '#f5f5f5', float: 'right', width: '300px'}}>
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px'}}>
                        <div><strong>Voucher No.:</strong> 415</div>
                        <div><strong>Dated:</strong> {new Date().toLocaleDateString('en-GB')}</div>
                        <div><strong>Mode/Terms of Payment:</strong> ADVANCE</div>
                        <div><strong>Buyer's Ref./Order No.:</strong> 415</div>
                        <div><strong>Other References:</strong> DIRECT SALE</div>
                        <div><strong>Dispatched through:</strong> BY TRANSPORT</div>
                        <div><strong>Destination:</strong> Chandrapur Transport</div>
                        <div><strong>Terms of Delivery:</strong> Delivery :- FOR upto Chandrapur Transport</div>
                      </div>
                    </div>
                    <div style={{clear: 'both'}}></div>
                  </div>

                  {/* Company Details - 3 column layout exactly like your PI */}
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px'}}>
                    {/* Seller Details */}
                    <div>
                      <div style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '8px'}}>ANODE ELECTRIC PVT. LTD.</div>
                      <div style={{fontSize: '11px', lineHeight: '1.3'}}>
                        <div>Plot No.FA-42, Ghugus Road, Chinchala</div>
                        <div>Sai Mobile Training Institute, Additional Chandrapur</div>
                        <div>Maharashtra - 442406, India</div>
                        <div><strong>GSTIN/UIN:</strong> 27AADCF6974E1ZF</div>
                        <div><strong>State Name:</strong> Maharashtra, Code: 27</div>
                        <div><strong>Contact:</strong> +91-9876543210</div>
                        <div><strong>E-Mail:</strong> info@anodeelectric.com</div>
                      </div>
                    </div>

                    {/* Consignee Details */}
                    <div>
                      <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '5px'}}>Consignee (Ship to)</div>
                      <div style={{fontSize: '11px', lineHeight: '1.3'}}>
                        <div style={{fontWeight: '600'}}>FORSICA SHIND ELECTRICALS PRIVATE LIMITED</div>
                        <div>Chandrapur Transport, Chandrapur</div>
                        <div>Maharashtra - 442406, India</div>
                        <div><strong>GSTIN/UIN:</strong> 27AADCF6974E1ZF</div>
                        <div><strong>PAN/IT No.:</strong> AADCF6974E</div>
                        <div><strong>State Name:</strong> Maharashtra, Code: 27</div>
                      </div>
                    </div>

                    {/* Bill To Details */}
                    <div>
                      <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '5px'}}>Bill To</div>
                      <div style={{fontSize: '11px', lineHeight: '1.3'}}>
                        <div style={{fontWeight: '600'}}>ANODE AND ELECTRICALS PRIVATE LIMITED</div>
                        <div>Plot No.FA-42, Ghugus Road, Chinchala</div>
                        <div>Sai Mobile Training Institute, Additional Chandrapur</div>
                        <div>Maharashtra - 442406, India</div>
                        <div><strong>GSTIN/UIN:</strong> 27AADCF6974E1ZF</div>
                        <div><strong>PAN/IT No.:</strong> AADCF6974E</div>
                        <div><strong>State Name:</strong> Maharashtra, Code: 27</div>
                      </div>
                    </div>
                  </div>

                  {/* Items Table - Exact structure */}
                  <div style={{marginBottom: '20px'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse', border: '1px solid #000'}}>
                      <thead>
                        <tr style={{backgroundColor: '#f0f0f0'}}>
                          <th style={{border: '1px solid #000', padding: '4px 6px', textAlign: 'left', fontSize: '10px', fontWeight: '600'}}>S.No.</th>
                          <th style={{border: '1px solid #000', padding: '4px 6px', textAlign: 'left', fontSize: '10px', fontWeight: '600'}}>Description of Goods</th>
                          <th style={{border: '1px solid #000', padding: '4px 6px', textAlign: 'left', fontSize: '10px', fontWeight: '600'}}>HSN/SAC</th>
                          <th style={{border: '1px solid #000', padding: '4px 6px', textAlign: 'left', fontSize: '10px', fontWeight: '600'}}>Due on</th>
                          <th style={{border: '1px solid #000', padding: '4px 6px', textAlign: 'left', fontSize: '10px', fontWeight: '600'}}>Quantity</th>
                          <th style={{border: '1px solid #000', padding: '4px 6px', textAlign: 'left', fontSize: '10px', fontWeight: '600'}}>Rate</th>
                          <th style={{border: '1px solid #000', padding: '4px 6px', textAlign: 'left', fontSize: '10px', fontWeight: '600'}}>per</th>
                          <th style={{border: '1px solid #000', padding: '4px 6px', textAlign: 'left', fontSize: '10px', fontWeight: '600'}}>Disc.%</th>
                          <th style={{border: '1px solid #000', padding: '4px 6px', textAlign: 'left', fontSize: '10px', fontWeight: '600'}}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{border: '1px solid #000', padding: '4px 6px', fontSize: '11px'}}>1</td>
                          <td style={{border: '1px solid #000', padding: '4px 6px', fontSize: '11px'}}>
                            <div style={{fontWeight: '600'}}>COVERED CONDUCTOR 34 SQMM</div>
                            <div style={{fontSize: '10px', color: '#666'}}>COVERED CONDUCTOR 34SQMM XLPE 3 LAYER</div>
                          </td>
                          <td style={{border: '1px solid #000', padding: '4px 6px', fontSize: '11px'}}>76141000</td>
                          <td style={{border: '1px solid #000', padding: '4px 6px', fontSize: '11px'}}>{new Date().toLocaleDateString('en-GB')}</td>
                          <td style={{border: '1px solid #000', padding: '4px 6px', fontSize: '11px'}}>600 MTR</td>
                          <td style={{border: '1px solid #000', padding: '4px 6px', fontSize: '11px'}}>48.00</td>
                          <td style={{border: '1px solid #000', padding: '4px 6px', fontSize: '11px'}}>MTR</td>
                          <td style={{border: '1px solid #000', padding: '4px 6px', fontSize: '11px'}}>-</td>
                          <td style={{border: '1px solid #000', padding: '4px 6px', fontSize: '11px'}}>28,800.00</td>
                        </tr>
                        <tr>
                          <td colSpan="8" style={{border: '1px solid #000', padding: '4px 6px', fontSize: '11px', textAlign: 'right', fontWeight: '600'}}>IGST:</td>
                          <td style={{border: '1px solid #000', padding: '4px 6px', fontSize: '11px'}}>5,184.00</td>
                        </tr>
                        <tr style={{backgroundColor: '#f0f0f0'}}>
                          <td colSpan="4" style={{border: '1px solid #000', padding: '4px 6px', fontSize: '11px', fontWeight: '600'}}>Total</td>
                          <td style={{border: '1px solid #000', padding: '4px 6px', fontSize: '11px', fontWeight: '600'}}>600 MTR</td>
                          <td colSpan="3" style={{border: '1px solid #000', padding: '4px 6px', fontSize: '11px'}}></td>
                          <td style={{border: '1px solid #000', padding: '4px 6px', fontSize: '11px', fontWeight: '600'}}>33,984.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Footer Section - Exact positioning */}
                  <div>
                    <div style={{fontSize: '11px', marginBottom: '15px'}}>
                      <strong>Amount Chargeable (in words):</strong> INR Thirty Three Thousand Nine Hundred Eighty Four Only
                    </div>
                    
                    <div style={{border: '1px solid #000', padding: '15px', backgroundColor: '#f5f5f5', marginBottom: '15px'}}>
                      <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '8px'}}>Company's Bank Details</div>
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '11px'}}>
                        <div>
                          <div><strong>A/c Holder's Name:</strong> ANODE ELECTRIC PVT. LTD.</div>
                          <div><strong>Bank Name:</strong> ICICI BANK 36601</div>
                        </div>
                        <div>
                          <div><strong>A/c No.:</strong> 777705336601</div>
                          <div><strong>Branch & IFS Code:</strong> NIWARGANJ & ICIC0007345</div>
                        </div>
                      </div>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px'}}>
                      <div style={{fontSize: '11px'}}>
                        <div style={{textAlign: 'right'}}>E. & O.E</div>
                      </div>
                      <div style={{textAlign: 'center'}}>
                        <div style={{fontSize: '11px', fontWeight: '600'}}>for ANODE ELECTRIC PVT. LTD.</div>
                        <div style={{marginTop: '30px', fontSize: '11px'}}>Authorised Signatory</div>
                      </div>
                    </div>

                    <div style={{textAlign: 'center', fontSize: '10px', color: '#666'}}>
                      This is a Computer Generated Document
                    </div>
                  </div>
                </div>
              )}
              {modalTab === 'quotation_status' && (
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Quotation Status</h3>
                    <div className="rounded-md border border-gray-200 divide-y">
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-gray-700">Latest Quotation</span>
                        <span className="text-xs">{viewingCustomer.latestQuotationUrl === "latest" ? (
                          <button 
                            onClick={() => handleViewLatestQuotation(viewingCustomer)}
                            className="text-blue-600 underline inline-flex items-center gap-1 hover:text-blue-700"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>
                        ) : viewingCustomer.latestQuotationUrl ? (
                          <a href={viewingCustomer.latestQuotationUrl} className="text-blue-600 underline inline-flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" /> View
                          </a>
                        ) : (
                          <span className="text-gray-500">None</span>
                        )}</span>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-gray-700">Quotations Sent</span>
                        <span className="text-xs text-gray-500">{viewingCustomer.quotationsSent ?? 0}</span>
                      </div>
                      <div className="p-3">
                        <button 
                          onClick={handleCreateQuotation}
                          className="px-3 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 inline-flex items-center gap-2"
                        >
                          Create Quotation
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Quotation Preview</h3>
                    <div className="rounded-md border border-gray-200 max-h-[320px] overflow-auto bg-white">
                      <Quotation quotationData={quotationData} customer={viewingCustomer} />
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
            </div>
            <div className="px-6 pb-4 flex justify-end gap-3">
              <button className="px-3 py-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50" onClick={() => setViewingCustomer(null)}>Close</button>
              <button className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700" onClick={() => setViewingCustomer(null)}>Done</button>
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
          onClose={() => {
            setShowCreateQuotation(false)
            setSelectedCustomerForQuotation(null)
          }}
          onSave={handleSaveQuotation}
        />
      )}

      {/* Payment Details Modal */}
      {showPaymentDetails && selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Payment Details</h3>
                <button 
                  onClick={() => setShowPaymentDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close payment details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Customer Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">{selectedCustomer.name}</h4>
                <p className="text-sm text-gray-600">{selectedCustomer.phone} • {selectedCustomer.email}</p>
              </div>
              
              {/* Payment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-lg font-semibold text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Paid Amount</p>
                  <p className="text-lg font-semibold text-green-600">
                    ₹{paymentHistory.reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Remaining</p>
                  <p className="text-lg font-semibold text-amber-600">
                    ₹{(totalAmount - paymentHistory.reduce((sum, p) => sum + p.amount, 0)).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              
              {/* Payment History */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Payment History</h4>
                {paymentHistory.length > 0 ? (
                  <div className="space-y-4">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">₹{payment.amount.toLocaleString('en-IN')}</p>
                            <p className="text-sm text-gray-500">{payment.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{payment.date} • {payment.paymentMethod}</p>
                          </div>
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No payment history found</p>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowPaymentDetails(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  // In a real app, this would open a form to add a new payment
                  alert('Add new payment functionality would open here');
                }}
              >
                Add Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
