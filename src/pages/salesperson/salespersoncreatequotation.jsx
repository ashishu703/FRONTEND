"use client";

import { useState, useEffect } from "react";
import { X, FileText, Calendar, User, Package, DollarSign, Plus, Eye, Building2, Layout, Download, Truck, CreditCard } from "lucide-react";
import DynamicTemplateRenderer from "../../components/DynamicTemplateRenderer";
import { defaultQuotationTerms } from '../../constants/quotationTerms';
import html2pdf from 'html2pdf.js';
import templateService from '../../services/TemplateService';
import companyBranchService from '../../services/CompanyBranchService';
import { QuotationDataMapper } from '../../utils/QuotationDataMapper';

function Card({ className, children }) {
  return <div className={`rounded-lg border bg-white shadow-sm ${className || ''}`}>{children}</div>;
}

function CardContent({ className, children }) {
  return <div className={`p-0 ${className || ''}`}>{children}</div>;
}

function CardHeader({ className, children }) {
  return <div className={`p-6 ${className || ''}`}>{children}</div>;
}

function CardTitle({ className, children }) {
  return <h3 className={`text-lg font-semibold ${className || ''}`}>{children}</h3>;
}

function Button({ children, onClick, type = "button", variant = "default", size = "default", className = "" }) {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-blue-500"
  };
  
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-8 py-1 px-3 text-xs",
    icon: "h-10 w-10"
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

const calculateTotals = (items, discountRate, taxRate) => {
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const discountRateNum = parseFloat(discountRate) || 0;
  const taxRateNum = parseFloat(taxRate) || 0;
  const discountAmount = (subtotal * discountRateNum) / 100;
  const taxable = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxable * taxRateNum) / 100;
  const total = taxable + taxAmount;

  return {
    subtotal,
    discountAmount,
    taxAmount,
    total
  };
};

export default function CreateQuotationForm({ customer, user, onClose, onSave, standalone = false }) {
  const getSevenDaysLater = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  const [companyBranches, setCompanyBranches] = useState({});
  const [organizations, setOrganizations] = useState([]);

  const [quotationData, setQuotationData] = useState({
    quotationNumber: `ANQ${Date.now().toString().slice(-6)}`,
    quotationDate: new Date().toISOString().split('T')[0],
    validUpto: getSevenDaysLater(new Date().toISOString().split('T')[0]),
    selectedBranch: '', // Will be set from organizations list
    items: [
      {
        id: 1,
        productName: "",
        quantity: "",
        unit: "",
        companyRate: 0,
        buyerRate: "",
        amount: 0,
        hsn: ""
      }
    ],
    subtotal: 0,
    discountRate: 0,
    discountAmount: 0,
    taxRate: 18,
    taxAmount: 0,
    total: 0,
    paymentMode: "",
    transportTc: "",
    dispatchThrough: "",
    deliveryTerms: "",
    materialType: "",
    termsSections: defaultQuotationTerms.map(section => ({ ...section, points: [...section.points] })),
    // Editable bill-to information
    billTo: {
      business: "",
      buyerName: "",
      address: "",
      phone: "",
      gstNo: "",
      state: ""
    },
    // Transport Details
    transportDetails: {
      lrNo: "",
      transport: "",
      transportId: "",
      vehicleNumber: ""
    },
    // Bank Details
    bankDetails: {
      bankName: "ICICI Bank",
      branchName: "WRIGHT TOWN JABALPUR",
      accountNumber: "657605601783",
      ifscCode: "ICIC0006576"
    }
  });

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [availableTemplates, setAvailableTemplates] = useState([]);

  // Auto-fill bill-to from customer data
  useEffect(() => {
    if (!customer) {
      return;
    }

    setQuotationData(prev => ({
      ...prev,
      customer: customer, // Store the full customer object
      billTo: {
        business: (customer.business && customer.business !== 'N/A') ? customer.business : (customer.name || ""),
        buyerName: (customer.business && customer.business !== 'N/A') ? customer.business : (customer.name || ""), // Set Buyer Name same as Business Name
        address: (customer.address && customer.address !== 'N/A') ? customer.address : "",
        phone: customer.phone || "",
        gstNo: (customer.gstNo && customer.gstNo !== 'N/A' && customer.gstNo.trim() !== '') ? customer.gstNo : "URC",
        state: customer.state || ""
        }
    }));
  }, [customer]);

  // Load quotation templates from configuration
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templates = await templateService.getTemplatesByType('quotation');
        setAvailableTemplates(templates);
        if (!selectedTemplate && templates.length > 0) {
          setSelectedTemplate(templates[0].template_key);
        }
      } catch (error) {
        console.error('Failed to load quotation templates:', error);
      }
    };

    loadTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load company branches (organizations) from backend
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const { branches, organizations: orgs } = await companyBranchService.fetchBranches();
        setCompanyBranches(branches);
        setOrganizations(orgs);

        if (!quotationData.selectedBranch && orgs.length > 0) {
          setQuotationData(prev => ({
            ...prev,
            selectedBranch: String(orgs[0].id)
          }));
        }
      } catch (error) {
        console.error('Failed to load organizations for quotation:', error);
      }
    };

    loadBranches();
    // We intentionally omit quotationData from deps to avoid resetting selection
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (field, value) => {
    const newData = {
      ...quotationData,
      [field]: value
    };

    // If quotationDate changes, update validUpto to be 7 days later
    if (field === 'quotationDate') {
      newData.validUpto = getSevenDaysLater(value);
    }

    // Recalculate totals when discount or tax changes
    if (field === 'discountRate' || field === 'taxRate') {
      const totals = calculateTotals(
        newData.items,
        newData.discountRate,
        newData.taxRate
      );
      newData.subtotal = totals.subtotal;
      newData.discountAmount = totals.discountAmount;
      newData.taxAmount = totals.taxAmount;
      newData.total = totals.total;
    }

    setQuotationData(newData);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...quotationData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    }
    
    // Calculate amount for this item
    if (['quantity', 'companyRate', 'buyerRate'].includes(field)) {
      // Use buyerRate for amount calculation
      const qty = parseFloat(updatedItems[index].quantity) || 0;
      const rate = parseFloat(updatedItems[index].buyerRate) || 0;
      updatedItems[index].amount = qty * rate;
    }
    
    const totals = calculateTotals(
      updatedItems,
      quotationData.discountRate,
      quotationData.taxRate
    );
    
    setQuotationData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      taxAmount: totals.taxAmount,
      total: totals.total
    }));
  };

  const handleTermTitleChange = (index, value) => {
    setQuotationData(prev => {
      const termsSections = (prev.termsSections || []).map((section, idx) =>
        idx === index ? { ...section, title: value } : section
      )
      return { ...prev, termsSections }
    })
  }

  const handleTermPointsChange = (index, value) => {
    const points = value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    setQuotationData(prev => {
      const termsSections = (prev.termsSections || []).map((section, idx) =>
        idx === index ? { ...section, points } : section
      )
      return { ...prev, termsSections }
    })
  }

  const resetTermsToDefault = () => {
    setQuotationData(prev => ({
      ...prev,
      termsSections: defaultQuotationTerms.map(section => ({
        title: section.title,
        points: [...section.points]
      }))
    }));
  };

  const handleTransportDetailsChange = (field, value) => {
    setQuotationData(prev => ({
      ...prev,
      transportDetails: {
        ...prev.transportDetails,
        [field]: value
      }
    }));
  };

  const handleBankDetailsChange = (field, value) => {
    setQuotationData(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value
      }
    }));
  };

  const addItem = () => {
    setQuotationData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: prev.items.length + 1,
        productName: "",
        quantity: "",
        unit: "",
        companyRate: 0,
        buyerRate: "",
        amount: 0,
        hsn: ""
      }]
    }));
  };

  const removeItem = (index) => {
    if (quotationData.items.length > 1) {
      const updatedItems = quotationData.items.filter((_, i) => i !== index);
      const totals = calculateTotals(
        updatedItems,
        quotationData.discountRate,
        quotationData.taxRate
      );
      
      setQuotationData(prev => ({
        ...prev,
        items: updatedItems,
        subtotal: totals.subtotal,
        discountAmount: totals.discountAmount,
        taxAmount: totals.taxAmount,
        total: totals.total
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTemplate) {
      alert('Please select a quotation template.');
      return;
    }

    try {
      await onSave({
      ...quotationData,
        customer,
      createdAt: new Date().toISOString(),
        template: selectedTemplate
      });
      // Let parent decide whether to close (onSave may handle it)
      if (!standalone && typeof onClose === 'function') {
        onClose();
      }
    } catch (error) {
      console.error('Failed to save quotation:', error);
      alert('Failed to save quotation. Please try again.');
    }
  };

  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState({});

  // Update preview data when form data changes
  useEffect(() => {
    setPreviewData(quotationData);
  }, [quotationData]);


  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Download PDF function that uses the selected template
  const handleDownloadPDF = async () => {
    try {
      // Find the currently rendered quotation content in the preview modal
      const quotationContent = document.getElementById('quotation-content');
      
      if (!quotationContent) {
        alert('Quotation preview not found. Please try again.');
        return;
      }

      // Temporarily hide the signatory section if needed
      const signatorySection = quotationContent.querySelector('.quotation-signatory-section');
      let wasVisible = true;
      if (signatorySection) {
        wasVisible = signatorySection.style.display !== 'none';
        // Keep it visible for PDF - no need to hide
      }

      // PDF options
      const opt = {
        margin: [0.4, 0.4, 0.4, 0.4],
        filename: `Quotation-${previewData?.quotationNumber || 'Draft'}-${(previewData?.billTo?.business || 'Customer').replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.8 },
        html2canvas: { 
          scale: 1.1,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true,
          putOnlyUsedFonts: true
        }
      };

      // Generate and download PDF from the currently visible template
      await html2pdf().set(opt).from(quotationContent).save();

      // Restore signatory section visibility if it was changed
      if (signatorySection && !wasVisible) {
        signatorySection.style.display = '';
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    const { billTo, items } = quotationData;
    
    // Check bill-to information
    if (!billTo.business || !billTo.phone || !billTo.address || !billTo.state) {
      return false;
    }
    
    // Check items
    if (items.length === 0) {
      return false;
    }
    
    return items.every(item => 
      item.productName && 
      item.quantity > 0 && 
      item.buyerRate > 0
    );
  };


  if (showPreview) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto relative bg-white rounded-lg shadow-xl">
          {/* Header with Template Selector */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-gray-900">Quotation Preview</h2>
            <div className="flex items-center gap-3">
              {/* Template Selector */}
              <div className="flex gap-2">
                {availableTemplates.map((template) => (
                <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.template_key)}
                  className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                      selectedTemplate === template.template_key
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                    title={template.description || template.name}
                >
                    {template.name}
                </button>
                ))}
              </div>
          {/* Close button */}
          <button
            onClick={togglePreview}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            title="Close Preview"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
            </div>
          </div>
          
          {/* Preview Content */}
          <div className="p-6">
            {(() => {
              const activeTemplate = availableTemplates.find(
                (tpl) => tpl.template_key === selectedTemplate
              );
              if (!activeTemplate?.html_content) {
                return null;
              }

              const context = QuotationDataMapper.prepareContext(
                previewData,
                companyBranches,
                user,
                selectedTemplate
              );

              return (
                <DynamicTemplateRenderer
                  html={activeTemplate.html_content}
                  data={context}
                  containerId="quotation-content"
                />
              );
            })()}
          </div>
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <Button 
              type="button" 
              onClick={handleDownloadPDF}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button 
              type="button" 
              onClick={() => onSave({
                ...previewData,
                template: selectedTemplate // Include the selected template
              })}
              className="bg-green-600 hover:bg-green-700"
            >
              Save Quotation
            </Button>
          </div>
        </div>
      </div>
    );
  }


  const formContent = (
    <>
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-4 border-b ${standalone ? 'pt-6' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">Create Quotation</CardTitle>
              <p className="text-sm text-gray-600">For {customer?.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

      <div className="flex flex-row gap-4 p-6" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {/* Left Side - Form */}
        <div className="flex-1 overflow-y-auto pr-4" style={{ maxHeight: 'calc(100vh - 200px)', minWidth: '60%' }}>
          <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quotation Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-500" />
                  Quotation Number
                </label>
                <input
                  type="text"
                  value={quotationData.quotationNumber}
                  disabled
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-sm text-gray-600 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Quotation Date *
                </label>
                <input
                  type="date"
                  required
                  value={quotationData.quotationDate}
                  onChange={(e) => handleInputChange("quotationDate", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Valid Until *
                </label>
                <div className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm">
                  {quotationData.validUpto} (7 days from quotation date)
                </div>
                <input
                  type="hidden"
                  value={quotationData.validUpto}
                  name="validUpto"
                />
              </div>
            </div>

            {/* Branch Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-500" />
                Company Branch
              </h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Select Branch *</label>
                <select
                  value={quotationData.selectedBranch}
                  onChange={(e) => handleInputChange("selectedBranch", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Organization</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={String(org.id)}>
                      {org.organization_name || org.legal_name || `Organization #${org.id}`}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">
                  Selected branch will determine the letterhead and company details for this quotation.
                </p>
              </div>
            </div>

            {/* Bill To Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Bill To Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={quotationData.billTo.business}
                    onChange={(e) => setQuotationData(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, business: e.target.value }
                    }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Buyer Name *</label>
                  <input
                    type="text"
                    required
                    value={quotationData.billTo.buyerName}
                    onChange={(e) => setQuotationData(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, buyerName: e.target.value }
                    }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone *</label>
                  <input
                    type="text"
                    required
                    value={quotationData.billTo.phone}
                    onChange={(e) => setQuotationData(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, phone: e.target.value }
                    }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Address *</label>
                  <input
                    type="text"
                    required
                    value={quotationData.billTo.address}
                    onChange={(e) => setQuotationData(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, address: e.target.value }
                    }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">GST Number</label>
                  <input
                    type="text"
                    value={quotationData.billTo.gstNo}
                    onChange={(e) => setQuotationData(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, gstNo: e.target.value }
                    }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">State *</label>
                  <input
                    type="text"
                    required
                    value={quotationData.billTo.state}
                    onChange={(e) => setQuotationData(prev => ({
                      ...prev,
                      billTo: { ...prev.billTo, state: e.target.value }
                    }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-orange-500" />
                  Items
                </h3>
                <Button type="button" onClick={addItem} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-x-auto">
                <table className="w-full min-w-full table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: '30%' }}>Product Name</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: '12%' }}>HSN/SAC</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: '8%' }}>Qty</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: '10%' }}>Unit</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: '15%' }}>Buyer Rate</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: '15%' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {quotationData.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-2 py-3">
                          <input
                            type="text"
                            placeholder="Product name"
                            value={item.productName}
                            onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                            required
                          />
                        </td>
                        <td className="px-2 py-3">
                          <input
                            type="text"
                            placeholder="HSN/SAC"
                            value={item.hsn || ''}
                            onChange={(e) => handleItemChange(index, 'hsn', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-xs"
                          />
                        </td>
                        <td className="px-2 py-3">
                          <input
                            type="number"
                            min="0"
                            placeholder="Qty"
                            value={item.quantity || ''}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value === '' ? '' : parseFloat(e.target.value) || '')}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </td>
                        <td className="px-2 py-3">
                          <select
                            value={item.unit || ''}
                            onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            <option value="">Select</option>
                            <option value="Nos">Nos</option>
                            <option value="Mtr">Mtr</option>
                            <option value="Kg">Kg</option>
                            <option value="Set">Set</option>
                          </select>
                        </td>
                        <td className="px-2 py-3">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                            placeholder="Rate"
                            value={item.buyerRate || ''}
                            onChange={(e) => handleItemChange(index, 'buyerRate', e.target.value === '' ? '' : parseFloat(e.target.value) || '')}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </td>
                        <td className="px-2 py-3 text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                          ₹{parseFloat(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₹{quotationData.subtotal.toFixed(2)}</span>
                  </div>
              <div className="flex justify-between text-sm items-center gap-2">
                <span>Discount (%):</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={quotationData.discountRate}
                    onChange={(e) => handleInputChange('discountRate', e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-right"
                  />
                  <span className="text-gray-600">₹{quotationData.discountAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST (18%):</span>
                <span>₹{quotationData.taxAmount.toFixed(2)}</span>
              </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>₹{quotationData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transport & Delivery Terms - New Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-500" />
                Delivery & Payment Terms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mode/Term & Payment</label>
                  <input
                    type="text"
                    value={quotationData.paymentMode}
                    onChange={(e) => handleInputChange('paymentMode', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. Advance, 30 days credit"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Transport T&C</label>
                  <input
                    type="text"
                    value={quotationData.transportTc}
                    onChange={(e) => handleInputChange('transportTc', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. To Pay, Paid"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Dispatch Through</label>
                  <input
                    type="text"
                    value={quotationData.dispatchThrough}
                    onChange={(e) => handleInputChange('dispatchThrough', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. Road, Transport Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Terms of Delivery</label>
                  <input
                    type="text"
                    value={quotationData.deliveryTerms}
                    onChange={(e) => handleInputChange('deliveryTerms', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. Within 7 days"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Material Type</label>
                  <input
                    type="text"
                    value={quotationData.materialType}
                    onChange={(e) => handleInputChange('materialType', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. Original, Spare"
                  />
                </div>
              </div>
            </div>

            {/* Transport Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-500" />
                Transport Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">L.R. No</label>
                  <input
                    type="text"
                    value={quotationData.transportDetails.lrNo}
                    onChange={(e) => handleTransportDetailsChange('lrNo', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter L.R. Number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Transport Name</label>
                  <input
                    type="text"
                    value={quotationData.transportDetails.transport}
                    onChange={(e) => handleTransportDetailsChange('transport', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter Transport Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Transport ID</label>
                  <input
                    type="text"
                    value={quotationData.transportDetails.transportId}
                    onChange={(e) => handleTransportDetailsChange('transportId', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter Transport ID"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Vehicle Number</label>
                  <input
                    type="text"
                    value={quotationData.transportDetails.vehicleNumber}
                    onChange={(e) => handleTransportDetailsChange('vehicleNumber', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter Vehicle Number"
                  />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-500" />
                Bank Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Account Holder Name</label>
                  <input
                    type="text"
                    value={quotationData.bankDetails.accountHolderName || ''}
                    onChange={(e) => handleBankDetailsChange('accountHolderName', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter Account Holder Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Bank Name</label>
                  <input
                    type="text"
                    value={quotationData.bankDetails.bankName}
                    onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter Bank Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Branch Name</label>
                  <input
                    type="text"
                    value={quotationData.bankDetails.branchName}
                    onChange={(e) => handleBankDetailsChange('branchName', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter Branch Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Account Number</label>
                  <input
                    type="text"
                    value={quotationData.bankDetails.accountNumber}
                    onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter Account Number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">IFSC Code</label>
                  <input
                    type="text"
                    value={quotationData.bankDetails.ifscCode}
                    onChange={(e) => handleBankDetailsChange('ifscCode', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter IFSC Code"
                  />
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Terms & Conditions</span>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={resetTermsToDefault}>
                  Reset to Default
                </Button>
              </div>
              <p className="text-xs text-gray-500">Edit headings and bullet points below. Each new line becomes a bullet in the quotation preview.</p>
              <div className="space-y-4">
                {(quotationData.termsSections || []).map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-gray-200 rounded-lg bg-white">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleTermTitleChange(sectionIndex, e.target.value)}
                        className="w-full text-sm font-semibold text-gray-800 border-none focus:outline-none focus:ring-0"
                        placeholder="Section title"
                      />
                    </div>
                    <div className="p-4">
              <textarea
                        value={section.points.join('\n')}
                        onChange={(e) => handleTermPointsChange(sectionIndex, e.target.value)}
                        rows={Math.max(3, section.points.length)}
                        className="w-full text-xs text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter each bullet point on a new line"
              />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end pt-6 border-t">
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Save Quotation
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        </div>

        {/* Right Side - Live Preview */}
        <div className="w-2/5 border-l border-gray-200 pl-4" style={{ maxWidth: '400px' }}>
          <div className="sticky top-4">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  Live Preview
                </h3>
                <Layout className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mb-3">Updates as you type</p>
              
              {/* Template Selector */}
              <div className="flex gap-2 mb-3">
                {availableTemplates.map((template) => (
                <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.template_key)}
                  className={`flex-1 px-2 py-1.5 text-xs rounded border transition-colors ${
                      selectedTemplate === template.template_key
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                    title={template.description || template.name}
                >
                    {template.name}
                </button>
                ))}
              </div>
            </div>
            <div
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-auto"
              style={{
                maxHeight: 'calc(100vh - 150px)',
                transform: 'scale(0.8)',
                transformOrigin: 'top left',
                width: '125%'
              }}
            >
              {(() => {
                const activeTemplate = availableTemplates.find(
                  (tpl) => tpl.template_key === selectedTemplate
                );
                if (!activeTemplate?.html_content) {
                  return null;
                }

                const context = QuotationDataMapper.prepareContext(
                  previewData,
                  companyBranches,
                  user,
                  selectedTemplate
                );

                return (
                  <DynamicTemplateRenderer
                    html={activeTemplate.html_content}
                    data={context}
                    containerId="quotation-content"
                  />
                );
              })()}
            </div>
          </div>
        </div>
      </div>
      </>
  )

  // If standalone mode, render without modal wrapper
  if (standalone) {
    return (
      <Card className="w-full max-h-screen overflow-y-auto shadow-lg">
        {formContent}
      </Card>
    )
  }

  // Otherwise render as modal
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {formContent}
      </Card>
    </div>
  )
}
