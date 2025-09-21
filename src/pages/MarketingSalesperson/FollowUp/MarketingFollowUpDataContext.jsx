import React, { createContext, useContext } from 'react';
import { useMarketingSharedData } from '../MarketingSharedDataContext';

// Create the context
const MarketingFollowUpDataContext = createContext();

// Provider component
export const MarketingFollowUpDataProvider = ({ children }) => {
  const { customers, loading, getCustomersByStatus, getStatusCounts, updateCustomer } = useMarketingSharedData();

  // Filter leads by connection status
  const getLeadsByStatus = (status) => {
    // Map status from MarketingFollowUpDropdown to MarketingSharedDataContext's getCustomersByStatus
    const result = (() => {
      switch (status) {
        case 'all':
          return customers; // Return all customers
        case 'connected':
          return getCustomersByStatus('connected');
        case 'not-connected':
          return getCustomersByStatus('not-connected');
        case 'next-meeting':
          return getCustomersByStatus('next-meeting');
        case 'closed':
          return getCustomersByStatus('closed');
        default:
          return [];
      }
    })();
    
    console.log(`MarketingFollowUpDataContext - getLeadsByStatus('${status}'):`, result);
    return result;
  };

  // Get all leads
  const getAllLeads = () => {
    return customers;
  };

  // Update lead status
  const updateLeadStatus = (leadId, status, remark) => {
    updateCustomer(leadId, {
      connectedStatus: status,
      connectedStatusRemark: remark,
      connectedStatusDate: new Date().toISOString().split('T')[0]
    });
  };

  // Update final status
  const updateFinalStatus = (leadId, status, remark) => {
    updateCustomer(leadId, {
      finalStatus: status,
      finalStatusRemark: remark,
      finalStatusDate: new Date().toISOString().split('T')[0]
    });
  };

  const value = {
    leadsData: customers,
    loading,
    getLeadsByStatus,
    getAllLeads,
    updateLeadStatus,
    updateFinalStatus,
    getStatusCounts
  };

  return (
    <MarketingFollowUpDataContext.Provider value={value}>
      {children}
    </MarketingFollowUpDataContext.Provider>
  );
};

// Custom hook to use the context
export const useMarketingFollowUpData = () => {
  const context = useContext(MarketingFollowUpDataContext);
  if (!context) {
    throw new Error('useMarketingFollowUpData must be used within a MarketingFollowUpDataProvider');
  }
  return context;
};

export default MarketingFollowUpDataContext;
