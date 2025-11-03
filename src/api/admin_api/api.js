const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4500';

const ADMIN_BASE = `${API_BASE_URL}/api/admin`;
const DEPT_HEADS_BASE = `${ADMIN_BASE}/department-heads`;
const DEPT_USERS_BASE = `${ADMIN_BASE}/department-users`;
const LEADS_BASE = `${API_BASE_URL}/api/leads`;
const PRODUCTION_BASE = `${API_BASE_URL}/api/production`;

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  PROFILE: `${API_BASE_URL}/api/auth/profile`,
  
  // Department heads
  DEPARTMENT_HEADS_BASE: DEPT_HEADS_BASE,
  DEPARTMENT_HEADS_LIST: (query = '') => `${DEPT_HEADS_BASE}${query ? `?${query}` : ''}`,
  DEPARTMENT_HEADS_CREATE: () => `${DEPT_HEADS_BASE}`,
  DEPARTMENT_HEADS_STATS: () => `${DEPT_HEADS_BASE}/stats`,
  DEPARTMENT_HEADS_BY_COMPANY_DEPARTMENT: (companyName, departmentType) => `${DEPT_HEADS_BASE}/by-company-department/${encodeURIComponent(companyName)}/${encodeURIComponent(departmentType)}`,
  DEPARTMENT_HEAD_BY_ID: (id) => `${DEPT_HEADS_BASE}/${id}`,
  DEPARTMENT_HEAD_STATUS: (id) => `${DEPT_HEADS_BASE}/${id}/status`,
  
  // Department users
  DEPARTMENT_USERS_BASE: DEPT_USERS_BASE,
  DEPARTMENT_USERS_LIST: (query = '') => `${DEPT_USERS_BASE}${query ? `?${query}` : ''}`,
  DEPARTMENT_USERS_CREATE: () => `${DEPT_USERS_BASE}`,
  DEPARTMENT_USERS_STATS: () => `${DEPT_USERS_BASE}/stats`,
  DEPARTMENT_USERS_BY_HEAD: (headUserId) => `${DEPT_USERS_BASE}/by-head/${encodeURIComponent(headUserId)}`,
  DEPARTMENT_USER_BY_ID: (id) => `${DEPT_USERS_BASE}/${id}`,
  DEPARTMENT_USER_STATUS: (id) => `${DEPT_USERS_BASE}/${id}/status`,

  // Leads
  LEADS_BASE: LEADS_BASE,
  LEADS_LIST: (query = '') => `${LEADS_BASE}${query ? `?${query}` : ''}`,
  LEADS_CREATE: () => `${LEADS_BASE}`,
  LEADS_IMPORT: () => `${LEADS_BASE}/import`,
  LEADS_BATCH_UPDATE: () => `${LEADS_BASE}/batch`,
  LEAD_BY_ID: (id) => `${LEADS_BASE}/${id}`,
  LEADS_STATS: () => `${LEADS_BASE}/stats`,
  SALESPERSON_ASSIGNED_LEADS_ME: () => `${LEADS_BASE}/assigned/salesperson`,
  SALESPERSON_ASSIGNED_LEADS_BY_USERNAME: (username) => `${LEADS_BASE}/assigned/salesperson/${encodeURIComponent(username)}`,
  SALESPERSON_LEAD_BY_ID: (id) => `${LEADS_BASE}/assigned/salesperson/lead/${id}`,

  // Production
  PRODUCTION_BASE: PRODUCTION_BASE,
  PRODUCTION_METRICS: (companyName) => `${PRODUCTION_BASE}/metrics${companyName ? `?company=${encodeURIComponent(companyName)}` : ''}`,
  PRODUCTION_SCHEDULE: (query = '') => `${PRODUCTION_BASE}/schedule${query ? `?${query}` : ''}`,
  PRODUCTION_TASKS: (query = '') => `${PRODUCTION_BASE}/tasks${query ? `?${query}` : ''}`,
  PRODUCTION_QC_LOTS: (query = '') => `${PRODUCTION_BASE}/qc/lots${query ? `?${query}` : ''}`,
  PRODUCTION_MAINT_ORDERS: (query = '') => `${PRODUCTION_BASE}/maintenance/orders${query ? `?${query}` : ''}`,
  PRODUCTION_INVENTORY: (query = '') => `${PRODUCTION_BASE}/inventory${query ? `?${query}` : ''}`,
};

export default API_BASE_URL;
