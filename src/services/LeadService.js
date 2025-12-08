import departmentHeadService from '../api/admin_api/departmentHeadService';
import apiErrorHandler from '../utils/ApiErrorHandler';
import toastManager from '../utils/ToastManager';

class LeadService {
  constructor() {
    this.formatToIST = this.formatToIST.bind(this);
    this.transformApiData = this.transformApiData.bind(this);
  }

  formatToIST(value) {
    if (!value) return 'N/A';
    try {
      const d = new Date(value);
      const date = d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
      const time = d.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
      return `${date} ${time}`;
    } catch (e) {
      return String(value);
    }
  }

  transformApiData(apiData) {
    return apiData.map(lead => ({
      id: lead.id,
      customerId: lead.customer_id,
      customer: lead.customer,
      email: lead.email,
      business: lead.business,
      leadSource: lead.lead_source,
      productNamesText: lead.product_names,
      category: lead.category,
      salesStatus: lead.sales_status,
      salesStatusRemark: lead.sales_status_remark || null,
      createdAt: this.formatToIST(lead.created_at),
      assignedSalesperson: lead.assigned_salesperson,
      assignedTelecaller: lead.assigned_telecaller,
      telecallerStatus: lead.telecaller_status,
      paymentStatus: lead.payment_status,
      phone: lead.phone,
      address: lead.address,
      gstNo: lead.gst_no,
      state: lead.state,
      customerType: lead.customer_type,
      date: lead.date,
      followUpStatus: lead.follow_up_status || lead.connected_status || lead.telecaller_status,
      connectedStatus: lead.follow_up_status || lead.connected_status || lead.telecaller_status,
      followUpRemark: lead.follow_up_remark || null,
      finalStatus: lead.final_status,
      whatsapp: lead.whatsapp,
      createdBy: lead.created_by,
      created_at: this.formatToIST(lead.created_at),
      updated_at: this.formatToIST(lead.updated_at)
    }));
  }

  async fetchLeads(params = {}) {
    try {
      const response = await departmentHeadService.getAllLeads(params);
      if (response && response.data) {
        return {
          data: this.transformApiData(response.data),
          pagination: response.pagination
        };
      }
      return { data: [], pagination: null };
    } catch (error) {
      apiErrorHandler.handleError(error, 'fetch leads');
      throw error;
    }
  }

  async fetchAllLeads(batchSize = 200) {
    try {
      const aggregated = [];
      let pageNumber = 1;
      while (true) {
        const response = await departmentHeadService.getAllLeads({
          page: pageNumber,
          limit: batchSize
        });

        const pageData = Array.isArray(response?.data) ? response.data : [];
        if (pageData.length === 0) {
          break;
        }

        aggregated.push(...pageData);

        const total = typeof response?.pagination?.total === 'number'
          ? response.pagination.total
          : null;

        if (total !== null && aggregated.length >= total) {
          break;
        }

        if (pageData.length < batchSize) {
          break;
        }

        pageNumber += 1;
      }

      return this.transformApiData(aggregated);
    } catch (error) {
      throw error;
    }
  }

  async createLead(leadData) {
    try {
      const resp = await departmentHeadService.createLead(leadData);
      if (resp && resp.data) {
        return this.transformApiData([resp.data])[0];
      }
      return null;
    } catch (error) {
      apiErrorHandler.handleError(error, 'create lead');
      throw error;
    }
  }

  async updateLead(leadId, payload) {
    try {
      await departmentHeadService.updateLead(leadId, payload);
      return true;
    } catch (error) {
      apiErrorHandler.handleError(error, 'update lead');
      throw error;
    }
  }

  async batchUpdateLeads(leadIds, payload) {
    try {
      await departmentHeadService.batchUpdateLeads(leadIds, payload);
      return true;
    } catch (error) {
      apiErrorHandler.handleError(error, 'batch update leads');
      throw error;
    }
  }

  async importLeads(leadsPayload) {
    try {
      const resp = await departmentHeadService.importLeads(leadsPayload);
      // Return full response including skipped rows info
      return resp;
    } catch (error) {
      apiErrorHandler.handleError(error, 'import leads');
      throw error;
    }
  }

  buildLeadPayload(customerData) {
    return {
      customer: customerData.customerName || null,
      phone: customerData.mobileNumber || null,
      email: customerData.email || null,
      business: customerData.businessType || null,
      leadSource: customerData.leadSource || null,
      category: customerData.businessCategory || 'N/A',
      salesStatus: 'PENDING',
      gstNo: customerData.gstNumber || null,
      productNames: Array.isArray(customerData.productNames) 
        ? customerData.productNames.join(', ') 
        : (customerData.productNames || 'N/A'),
      address: customerData.address || null,
      state: customerData.state || null,
      assignedSalesperson: customerData.assignedSalesperson || null,
      assignedTelecaller: customerData.assignedTelecaller || null,
      whatsapp: customerData.whatsappNumber || customerData.mobileNumber || null,
      date: customerData.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      telecallerStatus: 'INACTIVE',
      paymentStatus: 'PENDING',
      connectedStatus: 'pending',
      finalStatus: 'open',
      customerType: 'business'
    };
  }

  buildCSVLeadPayload(row, index, validationErrors) {
    const trimField = (value, maxLength) => {
      if (!value || typeof value !== 'string') return value;
      const trimmed = value.trim();
      return trimmed.length > maxLength ? trimmed.substring(0, maxLength) : trimmed;
    };
    
    const customer = trimField(row['Customer Name'], 100);
    const phone = (row['Mobile Number'] || '').trim();
    const whatsapp = (row['WhatsApp Number'] || '').trim();
    const email = trimField(row['Email'], 255);
    const address = trimField(row['Address'], 1000);
    const business = trimField(row['Business Name'], 100);
    const gstNo = trimField(row['GST Number'], 50);
    const leadSource = trimField(row['Lead Source'], 100);
    const category = trimField(row['Business Category'], 100);
    const state = trimField(row['State'], 100);
    const productNames = trimField(row['Product Names (comma separated)'], 500);
    const assignedSalesperson = trimField(row['Assigned Salesperson'], 255);
    const assignedTelecaller = trimField(row['Assigned Telecaller'], 255);
    
    const normalizePhoneDigits = (phoneValue, fieldName) => {
      if (!phoneValue) {
        if (fieldName === 'Mobile Number') {
          validationErrors.push(`Row ${index + 2}: Mobile Number is required. Skipping row.`);
        }
        return null;
      }
      const digits = phoneValue.replace(/\D/g, '');
      if (digits.length !== 10) {
        validationErrors.push(`Row ${index + 2}: ${fieldName} must be exactly 10 digits (found ${digits.length} digits). Skipping row.`);
        return null;
      }
      return digits;
    };
    
    const normalizedPhone = normalizePhoneDigits(phone, 'Mobile Number');
    if (!normalizedPhone) return null;
    
    const normalizedWhatsapp = whatsapp ? normalizePhoneDigits(whatsapp, 'WhatsApp Number') : normalizedPhone;
    if (whatsapp && !normalizedWhatsapp) return null;
    
    return {
      customer: customer || null,
      phone: normalizedPhone,
      email: email || null,
      address: address || null,
      business: business || null,
      leadSource: leadSource || null,
      category: category || null,
      salesStatus: null,
      gstNo: gstNo || null,
      productNames: productNames || null,
      state: state || null,
      assignedSalesperson: assignedSalesperson || null,
      assignedTelecaller: assignedTelecaller || null,
      whatsapp: normalizedWhatsapp,
      date: row['Date (YYYY-MM-DD)'] || null,
      createdAt: null,
      telecallerStatus: null,
      paymentStatus: null,
      connectedStatus: null,
      finalStatus: null,
      customerType: null
    };
  }
}

export default LeadService;

