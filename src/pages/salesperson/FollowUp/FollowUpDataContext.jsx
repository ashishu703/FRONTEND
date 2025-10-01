import React, { createContext, useContext } from 'react';
import { useSharedData } from '../SharedDataContext';

// Create the context
const FollowUpDataContext = createContext();

// Provider component
export const FollowUpDataProvider = ({ children }) => {
  const { customers, loading, getCustomersByStatus, getStatusCounts, updateCustomer } = useSharedData();

  // Filter leads by connection status
  const getLeadsByStatus = (status) => {
    // Map status from FollowUpDropdown to SharedDataContext's getCustomersByStatus
    const result = (() => {
      switch (status) {
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
    
    console.log(`FollowUpDataContext - getLeadsByStatus('${status}'):`, result);
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
    <FollowUpDataContext.Provider value={value}>
      {children}
    </FollowUpDataContext.Provider>
  );
};

// Custom hook to use the context
export const useFollowUpData = () => {
  const context = useContext(FollowUpDataContext);
  if (!context) {
    throw new Error('useFollowUpData must be used within a FollowUpDataProvider');
  }
  return context;
};

export default FollowUpDataContext;