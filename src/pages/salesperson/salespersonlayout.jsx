import React, { useState, useEffect } from 'react'
import Sidebar from './salespersonsidebar.jsx'
import DashboardContent from './salespersondashboard.jsx'
import CustomerListContent from './salespersonleads.jsx'
import StockManagement from './salespersonstock.jsx'
import ProductsPage from './salespersonproducts.jsx'
import LeadStatusPage from './LeadStatus.jsx'
import ScheduledCallPage from './ScheduledCall.jsx'
import LastCallPage from './LastCall.jsx'
import DuePaymentPage from './DuePayment.jsx'
import AdvancePaymentPage from './AdvancePayment.jsx'
import ToolboxInterface from './ToolboxInterface.jsx'
import NotificationsPage from './Notifications.jsx'
import MobileLayout from './MOBILE view/MobileLayout.jsx'
import FixedHeader from '../../Header.jsx'
import CreateQuotationForm from './salespersoncreatequotation.jsx'
import quotationService from '../../api/admin_api/quotationService'

import { SharedDataProvider } from './SharedDataContext';

export default function SalespersonLayout({ onLogout }) {
  // Check URL parameter for page
  const urlParams = new URLSearchParams(window.location.search)
  const urlPage = urlParams.get('page')
  
  // If this is a standalone quotation form page, render it full screen without layout
  if (urlPage === 'create-quotation') {
    const customerData = sessionStorage.getItem('quotationCustomer')
    const userData = sessionStorage.getItem('quotationUser')
    
    if (customerData && userData) {
      const customer = JSON.parse(customerData)
      const user = JSON.parse(userData)
      
      // Handle save quotation
      const handleSaveQuotation = async (quotationData) => {
        try {
          const quotationPayload = {
            customerId: customer.id,
            customerName: customer.name,
            customerBusiness: quotationData.billTo?.business || customer.business,
            customerPhone: quotationData.billTo?.phone || customer.phone,
            customerEmail: customer.email,
            customerAddress: quotationData.billTo?.address || customer.address,
            customerGstNo: quotationData.billTo?.gstNo || customer.gstNo,
            customerState: quotationData.billTo?.state || customer.state,
            quotationDate: quotationData.quotationDate,
            validUntil: quotationData.validUpto || quotationData.validUntil,
            branch: quotationData.selectedBranch || 'ANODE',
            subtotal: quotationData.subtotal,
            taxRate: quotationData.taxRate || 18.00,
            taxAmount: quotationData.taxAmount,
            discountRate: quotationData.discountRate || 0,
            discountAmount: quotationData.discountAmount || 0,
            totalAmount: quotationData.total,
            billTo: quotationData.billTo || {
              business: customer.business,
              address: customer.address,
              phone: customer.phone,
              gstNo: customer.gstNo,
              state: customer.state
            },
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
          }
          const response = await quotationService.createQuotation(quotationPayload)
          if (response.success) {
            alert('Quotation created successfully!')
            sessionStorage.removeItem('quotationCustomer')
            sessionStorage.removeItem('quotationUser')
            // Close the tab or navigate back
            if (window.opener) {
              window.close()
            } else {
              window.location.href = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '') + '?page=customers'
            }
          }
        } catch (error) {
          console.error('Error saving quotation:', error)
          alert('Failed to save quotation. Please try again.')
        }
      }
      
      return (
        <div className="min-h-screen w-full bg-gray-50">
          <div className="w-full max-w-7xl mx-auto p-4">
            <CreateQuotationForm
              customer={customer}
              user={user}
              onClose={() => {
                sessionStorage.removeItem('quotationCustomer')
                sessionStorage.removeItem('quotationUser')
                if (window.opener) {
                  window.close()
                } else {
                  window.location.href = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '') + '?page=customers'
                }
              }}
              onSave={handleSaveQuotation}
              standalone={true}
            />
          </div>
        </div>
      )
    }
    
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-700">No customer data found.</p>
          <p className="text-sm text-gray-500 mt-2">Please go back and try again.</p>
        </div>
      </div>
    )
  }
  
  const [currentPage, setCurrentPage] = useState(urlPage || 'dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobileView, setIsMobileView] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  // Check if we should show quotation form (from sessionStorage)
  useEffect(() => {
    const shouldShowQuotation = sessionStorage.getItem('openQuotationForm') === 'true'
    if (shouldShowQuotation) {
      setCurrentPage('create-quotation')
      sessionStorage.removeItem('openQuotationForm')
    }
  }, [])

  // Auto-detect mobile view based on viewport width (no manual toggle)
  useEffect(() => {
    const updateIsMobile = () => setIsMobileView(window.innerWidth <= 768);
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);
  const handleNavigation = (page) => {
    setCurrentPage(page);
    // Update the URL without a page reload
    window.history.pushState({}, '', `/${page}`);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // If mobile view is active, render mobile layout
  if (isMobileView) {
    return <MobileLayout onLogout={onLogout} onToggleDesktopView={() => setIsMobileView(false)} />
  }

  return (
    <SharedDataProvider>
      <div className={`min-h-screen relative transition-colors ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <Sidebar 
          currentPage={currentPage} 
          onNavigate={handleNavigation} 
          onLogout={onLogout} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          isDarkMode={isDarkMode}
        />
        <div className={sidebarOpen ? "flex-1 ml-64 transition-all duration-300" : "flex-1 ml-16 transition-all duration-300"}>
          <FixedHeader 
            userType="salesperson" 
            currentPage={currentPage} 
            isMobileView={isMobileView}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
          <div className={`flex-1 transition-colors ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            {currentPage === 'dashboard' && <DashboardContent isDarkMode={isDarkMode} />}
            {currentPage === 'customers' && <CustomerListContent isDarkMode={isDarkMode} />}
            {currentPage === 'stock' && <StockManagement isDarkMode={isDarkMode} />}
            {currentPage === 'products' && <ProductsPage isDarkMode={isDarkMode} />}
            {currentPage === 'lead-status' && <LeadStatusPage isDarkMode={isDarkMode} />}
            {currentPage === 'scheduled-call' && <ScheduledCallPage isDarkMode={isDarkMode} />}
            {currentPage === 'last-call' && <LastCallPage isDarkMode={isDarkMode} />}
            {currentPage === 'due-payment' && <DuePaymentPage isDarkMode={isDarkMode} />}
            {currentPage === 'advance-payment' && <AdvancePaymentPage isDarkMode={isDarkMode} />}
            {currentPage === 'toolbox' && <ToolboxInterface isDarkMode={isDarkMode} />}
            {currentPage === 'notifications' && <NotificationsPage isDarkMode={isDarkMode} />}
          </div>
        </div>
      </div>
    </SharedDataProvider>
  )
}


