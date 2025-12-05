import { IDMatcher } from '../services/LeadsFilterService';

export const calculateAssignedCounts = (leads, isLeadAssigned) => {
  let assignedCount = 0;
  let unassignedCount = 0;
  
  for (let i = 0; i < leads.length; i++) {
    if (isLeadAssigned(leads[i])) {
      assignedCount++;
    } else {
      unassignedCount++;
    }
  }
  
  return { assignedCount, unassignedCount };
};

export const getUnassignedLeadIds = (leads, isLeadAssigned) => {
  const ids = [];
  for (let i = 0; i < leads.length; i++) {
    if (!isLeadAssigned(leads[i])) {
      ids.push(leads[i].id);
    }
  }
  return ids;
};

export const filterLeads = (activeLeadPool, searchTerm, assignmentFilter, statusFilter, filteredCustomerIds, isLeadAssigned) => {
  const searchLower = searchTerm?.toLowerCase() || '';
  const hasStatusFilter = Boolean(statusFilter.type && statusFilter.status);
  const hasCustomerIdFilter = hasStatusFilter && filteredCustomerIds.size > 0;
  
  const filtered = [];
  
  for (let i = 0; i < activeLeadPool.length; i++) {
    const lead = activeLeadPool[i];
    
    let matchesSearch = true;
    if (searchLower) {
      const customer = lead.customer?.toLowerCase() || '';
      const email = lead.email?.toLowerCase() || '';
      const business = lead.business?.toLowerCase() || '';
      matchesSearch = customer.includes(searchLower) || email.includes(searchLower) || business.includes(searchLower);
    }
    
    if (!matchesSearch) continue;
    
    if (assignmentFilter) {
      const isAssigned = isLeadAssigned(lead);
      if ((assignmentFilter === 'assigned' && !isAssigned) || (assignmentFilter === 'unassigned' && isAssigned)) {
        continue;
      }
    }
    
    if (hasCustomerIdFilter && !IDMatcher.matchesLead(lead, filteredCustomerIds)) {
      continue;
    }
    
    filtered.push(lead);
  }
  
  return filtered;
};

