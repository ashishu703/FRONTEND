import apiClient from '../../utils/apiClient';

class QuotationService {
  // Create quotation
  async createQuotation(quotationData) {
    try {
      const response = await apiClient.post('/api/quotations', quotationData);
      return response;
    } catch (error) {
      console.error('Error creating quotation:', error);
      throw error;
    }
  }

  // Get quotation by ID
  async getQuotation(id) {
    try {
      const response = await apiClient.get(`/api/quotations/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching quotation:', error);
      throw error;
    }
  }

  // Get quotations by customer
  async getQuotationsByCustomer(customerId) {
    try {
      const response = await apiClient.get(`/api/quotations/customer/${customerId}`);
      return response;
    } catch (error) {
      console.error('Error fetching customer quotations:', error);
      throw error;
    }
  }

  // Get approved quotations for dropdown
  async getApproved(customerId) {
    try {
      // Use existing customer list API and filter client-side for backward compatibility
      const response = await this.getQuotationsByCustomer(customerId);
      if (response?.success) {
        const approved = (response.data || []).filter(q => (q.status || '').toLowerCase() === 'approved');
        return { success: true, data: approved };
      }
      return response;
    } catch (error) {
      console.error('Error fetching approved quotations:', error);
      throw error;
    }
  }

  // Get quotation payment summary
  async getSummary(id) {
    try {
      const response = await apiClient.get(`/api/quotations/${id}/summary`);
      return response;
    } catch (error) {
      console.error('Error fetching quotation summary:', error);
      throw error;
    }
  }

  // Submit quotation for verification
  async submitForVerification(id) {
    try {
      const response = await apiClient.post(`/api/quotations/${id}/submit`);
      return response;
    } catch (error) {
      console.error('Error submitting quotation:', error);
      throw error;
    }
  }

  // Approve quotation
  async approveQuotation(id, notes = '') {
    try {
      const response = await apiClient.post(`/api/quotations/${id}/approve`, { notes });
      return response;
    } catch (error) {
      console.error('Error approving quotation:', error);
      throw error;
    }
  }

  // Reject quotation
  async rejectQuotation(id, notes = '') {
    try {
      const response = await apiClient.post(`/api/quotations/${id}/reject`, { notes });
      return response;
    } catch (error) {
      console.error('Error rejecting quotation:', error);
      throw error;
    }
  }

  // Send quotation to customer
  async sendToCustomer(id, sentTo, sentVia = 'email') {
    try {
      const response = await apiClient.post(`/api/quotations/${id}/send`, { sentTo, sentVia });
      return response;
    } catch (error) {
      console.error('Error sending quotation:', error);
      throw error;
    }
  }

  // Customer accepts quotation
  async acceptByCustomer(id, acceptedBy) {
    try {
      const response = await apiClient.post(`/api/quotations/${id}/accept`, { acceptedBy });
      return response;
    } catch (error) {
      console.error('Error accepting quotation:', error);
      throw error;
    }
  }

  // Get complete quotation data
  async getCompleteData(id) {
    try {
      const response = await apiClient.get(`/api/quotations/${id}/complete`);
      return response;
    } catch (error) {
      console.error('Error fetching complete quotation data:', error);
      throw error;
    }
  }

  // Update quotation
  async updateQuotation(id, updateData) {
    try {
      const response = await apiClient.put(`/api/quotations/${id}`, updateData);
      return response;
    } catch (error) {
      console.error('Error updating quotation:', error);
      throw error;
    }
  }

  // Delete quotation
  async deleteQuotation(id) {
    try {
      const response = await apiClient.delete(`/api/quotations/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting quotation:', error);
      throw error;
    }
  }

  // Generate PDF for quotation
  async generatePDF(id) {
    try {
      const response = await apiClient.get(`/api/quotations/${id}/pdf`);
      return response;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
}

export default new QuotationService();
