import apiClient from '../../utils/apiClient';

class ConfigurationService {
  // Get all configurations
  async getAll() {
    try {
      const response = await apiClient.get('/api/configuration');
      return response;
    } catch (error) {
      console.error('Error fetching configurations:', error);
      throw error;
    }
  }

  // Save email configuration
  async saveEmail(config) {
    try {
      const response = await apiClient.post('/api/configuration/email', config);
      return response;
    } catch (error) {
      console.error('Error saving email configuration:', error);
      throw error;
    }
  }

  // Save WhatsApp configuration
  async saveWhatsApp(config) {
    try {
      const response = await apiClient.post('/api/configuration/whatsapp', config);
      return response;
    } catch (error) {
      console.error('Error saving WhatsApp configuration:', error);
      throw error;
    }
  }

  // Save Cloudinary configuration
  async saveCloudinary(config) {
    try {
      const response = await apiClient.post('/api/configuration/cloudinary', config);
      return response;
    } catch (error) {
      console.error('Error saving Cloudinary configuration:', error);
      throw error;
    }
  }

  // Get global settings
  async getGlobalSettings() {
    try {
      const response = await apiClient.get('/api/configuration/global');
      return response;
    } catch (error) {
      console.error('Error fetching global settings:', error);
      throw error;
    }
  }

  // Set global setting
  async setGlobalSetting(key, value, description = null) {
    try {
      const response = await apiClient.post('/api/configuration/global', {
        key,
        value,
        description
      });
      return response;
    } catch (error) {
      console.error('Error setting global setting:', error);
      throw error;
    }
  }

  // Get email templates
  async getEmailTemplates() {
    try {
      const response = await apiClient.get('/api/configuration/templates');
      return response;
    } catch (error) {
      console.error('Error fetching email templates:', error);
      throw error;
    }
  }

  // Create email template
  async createEmailTemplate(template) {
    try {
      const response = await apiClient.post('/api/configuration/templates', template);
      return response;
    } catch (error) {
      console.error('Error creating email template:', error);
      throw error;
    }
  }

  // Update email template
  async updateEmailTemplate(id, template) {
    try {
      const response = await apiClient.put(`/api/configuration/templates/${id}`, template);
      return response;
    } catch (error) {
      console.error('Error updating email template:', error);
      throw error;
    }
  }

  // Delete email template
  async deleteEmailTemplate(id) {
    try {
      const response = await apiClient.delete(`/api/configuration/templates/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting email template:', error);
      throw error;
    }
  }
}

export default new ConfigurationService();

