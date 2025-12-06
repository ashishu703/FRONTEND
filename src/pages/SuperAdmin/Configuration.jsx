import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Mail, 
  MessageSquare, 
  Save, 
  TestTube, 
  Eye, 
  Settings,
  Lock,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  Cloud,
  Key,
  Loader,
  Plus,
  X
} from 'lucide-react';
import configurationService from '../../api/admin_api/configurationService';
import TemplateFormSidebar from '../../components/TemplateFormSidebar';
import EmailTemplateFormSidebar from '../../components/EmailTemplateFormSidebar';

const Configuration = () => {
  const [activeTab, setActiveTab] = useState('smtp');
  const [showEmailTemplateSidebar, setShowEmailTemplateSidebar] = useState(false);
  const [showDocumentTemplateSidebar, setShowDocumentTemplateSidebar] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    description: '',
    content: null,
    htmlContent: ''
  });

  // SMTP Settings State
  const [smtpSettings, setSmtpSettings] = useState({
    host: '',
    port: '',
    username: '',
    password: '',
    fromName: '',
    fromEmail: '',
    recipients: '',
    ccRecipients: '',
    bccRecipients: ''
  });

  // WhatsApp Settings State
  const [whatsappSettings, setWhatsappSettings] = useState({
    flowId: '',
    flowName: '',
    apiKey: '',
    phoneNumber: ''
  });

  // Cloudinary Settings State
  const [cloudinarySettings, setCloudinarySettings] = useState({
    cloudName: '',
    apiKey: '',
    apiSecret: '',
    uploadPreset: '',
    folder: ''
  });

  // Indiamart Settings State
  const [indiamartSettings, setIndiamartSettings] = useState({
    apiKey: '',
    apiSecret: '',
    accessToken: '',
    refreshToken: '',
    tokenExpiresAt: '',
    webhookUrl: ''
  });

  // TradeIndia Settings State
  const [tradeindiaSettings, setTradeindiaSettings] = useState({
    apiKey: '',
    apiSecret: '',
    accessToken: '',
    refreshToken: '',
    tokenExpiresAt: '',
    webhookUrl: ''
  });

  // Templates State
  const [templates, setTemplates] = useState([]);
  const [documentTemplates, setDocumentTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingDocumentTemplateId, setEditingDocumentTemplateId] = useState(null);
  const [documentTemplateForm, setDocumentTemplateForm] = useState({
    templateType: 'quotation',
    name: '',
    templateKey: '',
    description: '',
    htmlContent: '',
    isDefault: false,
    isActive: true
  });

  // Load configurations on mount
  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    setLoading(true);
    try {
      const response = await configurationService.getAll();
      if (response.success) {
        const {
          email,
          whatsapp,
          cloudinary,
          indiamart,
          tradeindia,
          templates: emailTemplates,
          documentTemplates: loadedDocumentTemplates
        } = response.data;
        
        if (email) {
          setSmtpSettings({
            host: email.host || '',
            port: email.port || '',
            username: email.username || '',
            password: email.password || '',
            fromName: email.from_name || '',
            fromEmail: email.from_email || '',
            recipients: email.recipients || '',
            ccRecipients: email.cc_recipients || '',
            bccRecipients: email.bcc_recipients || ''
          });
        }
        
        if (whatsapp) {
          setWhatsappSettings({
            flowId: whatsapp.flow_id || '',
            flowName: whatsapp.flow_name || '',
            apiKey: whatsapp.api_key || '',
            phoneNumber: whatsapp.phone_number || ''
          });
        }
        
        if (cloudinary) {
          setCloudinarySettings({
            cloudName: cloudinary.cloud_name || '',
            apiKey: cloudinary.api_key || '',
            apiSecret: cloudinary.api_secret || '',
            uploadPreset: cloudinary.upload_preset || '',
            folder: cloudinary.default_folder || ''
          });
        }
        
        if (indiamart) {
          setIndiamartSettings({
            apiKey: indiamart.api_key || '',
            apiSecret: indiamart.api_secret || '',
            accessToken: indiamart.access_token || '',
            refreshToken: indiamart.refresh_token || '',
            tokenExpiresAt: indiamart.token_expires_at || '',
            webhookUrl: indiamart.webhook_url || ''
          });
        }
        
        if (tradeindia) {
          setTradeindiaSettings({
            apiKey: tradeindia.api_key || '',
            apiSecret: tradeindia.api_secret || '',
            accessToken: tradeindia.access_token || '',
            refreshToken: tradeindia.refresh_token || '',
            tokenExpiresAt: tradeindia.token_expires_at || '',
            webhookUrl: tradeindia.webhook_url || ''
          });
        }
        
        if (emailTemplates) {
          setTemplates(emailTemplates);
        }

        if (loadedDocumentTemplates) {
          setDocumentTemplates(loadedDocumentTemplates);
        }
      }
    } catch (error) {
      console.error('Error loading configurations:', error);
      setMessage({ type: 'error', text: 'Failed to load configurations' });
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSmtpChange = (field, value) => {
    setSmtpSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWhatsappChange = (field, value) => {
    setWhatsappSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCloudinaryChange = (field, value) => {
    setCloudinarySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIndiamartChange = (field, value) => {
    setIndiamartSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTradeIndiaChange = (field, value) => {
    setTradeindiaSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateChange = (field, value) => {
    setTemplateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDocumentTemplateChange = (field, value) => {
    setDocumentTemplateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const resetDocumentTemplateForm = () => {
    setEditingDocumentTemplateId(null);
    setDocumentTemplateForm({
      templateType: 'quotation',
      name: '',
      templateKey: '',
      description: '',
      htmlContent: '',
      isDefault: false,
      isActive: true
    });
    setShowDocumentTemplateSidebar(false);
  };

  const handleOpenDocumentTemplateSidebar = () => {
    resetDocumentTemplateForm();
    setShowDocumentTemplateSidebar(true);
  };

  const handleOpenEmailTemplateSidebar = () => {
    setTemplateForm({ name: '', subject: '', description: '', content: null, htmlContent: '' });
    setShowEmailTemplateSidebar(true);
  };

  const handleCancelEmailTemplate = () => {
    setTemplateForm({ name: '', subject: '', description: '', content: null, htmlContent: '' });
    setShowEmailTemplateSidebar(false);
  };

  const handleSaveEmailTemplate = async () => {
    if (!templateForm.name || !templateForm.subject || !templateForm.htmlContent) {
      showMessage('error', 'Please fill all required fields');
      return;
    }
    
    setSaving(true);
    try {
      const response = await configurationService.createEmailTemplate({
        name: templateForm.name,
        subject: templateForm.subject,
        description: templateForm.description,
        htmlContent: templateForm.htmlContent
      });
      
      if (response.success) {
        showMessage('success', 'Template created successfully');
        setTemplateForm({ name: '', subject: '', description: '', content: null, htmlContent: '' });
        setShowEmailTemplateSidebar(false);
        loadConfigurations();
      }
    } catch (error) {
      showMessage('error', error.message || 'Failed to create template');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDocumentTemplate = async () => {
    const { templateType, name, templateKey } = documentTemplateForm;

    if (!templateType || !name || !templateKey) {
      showMessage('error', 'Template type, name and key are required');
      return;
    }

    setSaving(true);
    try {
      if (editingDocumentTemplateId) {
        const response = await configurationService.updateDocumentTemplate(
          editingDocumentTemplateId,
          documentTemplateForm
        );
        if (response.success && response.data) {
          const updated = documentTemplates.map(template =>
            template.id === response.data.id ? response.data : template
          );
          setDocumentTemplates(updated);
          showMessage('success', 'Document template updated successfully');
        }
      } else {
        const response = await configurationService.createDocumentTemplate(documentTemplateForm);
        if (response.success && response.data) {
          setDocumentTemplates([response.data, ...documentTemplates]);
          showMessage('success', 'Document template created successfully');
        }
      }

      resetDocumentTemplateForm();
    } catch (error) {
      const text = error?.message || 'Failed to save document template';
      showMessage('error', text);
    } finally {
      setSaving(false);
    }
  };


  const handleEditDocumentTemplate = (template) => {
    setEditingDocumentTemplateId(template.id);
    setDocumentTemplateForm({
      templateType: template.template_type,
      name: template.name,
      templateKey: template.template_key,
      description: template.description || '',
      htmlContent: template.html_content || '',
      isDefault: Boolean(template.is_default),
      isActive: Boolean(template.is_active)
    });
    setShowDocumentTemplateSidebar(true);
  };

  const handleDeleteDocumentTemplate = async (id) => {
    setSaving(true);
    try {
      const response = await configurationService.deleteDocumentTemplate(id);
      if (response.success) {
        const remaining = documentTemplates.filter(template => template.id !== id);
        setDocumentTemplates(remaining);
        if (editingDocumentTemplateId === id) {
          resetDocumentTemplateForm();
        }
        showMessage('success', 'Document template deleted successfully');
      }
    } catch (error) {
      const text = error?.message || 'Failed to delete document template';
      showMessage('error', text);
    } finally {
      setSaving(false);
    }
  };


  const handleTestSmtp = async () => {
    // Test SMTP configuration
    setSaving(true);
    try {
      // TODO: Implement SMTP test functionality
      showMessage('success', 'SMTP test functionality will be implemented soon');
    } catch (error) {
      showMessage('error', error.message || 'Failed to test SMTP configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSmtp = async () => {
    setSaving(true);
    try {
      const response = await configurationService.saveEmail({
        host: smtpSettings.host,
        port: parseInt(smtpSettings.port),
        username: smtpSettings.username,
        password: smtpSettings.password,
        fromName: smtpSettings.fromName,
        fromEmail: smtpSettings.fromEmail,
        recipients: smtpSettings.recipients,
        ccRecipients: smtpSettings.ccRecipients,
        bccRecipients: smtpSettings.bccRecipients
      });
      
      if (response.success) {
        showMessage('success', 'SMTP configuration saved successfully');
      }
    } catch (error) {
      showMessage('error', error.message || 'Failed to save SMTP configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWhatsapp = async () => {
    setSaving(true);
    try {
      const response = await configurationService.saveWhatsApp({
        flowId: whatsappSettings.flowId,
        flowName: whatsappSettings.flowName,
        apiKey: whatsappSettings.apiKey,
        phoneNumber: whatsappSettings.phoneNumber
      });
      
      if (response.success) {
        showMessage('success', 'WhatsApp configuration saved successfully');
      }
    } catch (error) {
      showMessage('error', error.message || 'Failed to save WhatsApp configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCloudinary = async () => {
    setSaving(true);
    try {
      const response = await configurationService.saveCloudinary({
        cloudName: cloudinarySettings.cloudName,
        apiKey: cloudinarySettings.apiKey,
        apiSecret: cloudinarySettings.apiSecret,
        uploadPreset: cloudinarySettings.uploadPreset,
        folder: cloudinarySettings.folder
      });
      
      if (response.success) {
        showMessage('success', 'Cloudinary configuration saved successfully');
      }
    } catch (error) {
      showMessage('error', error.message || 'Failed to save Cloudinary configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveIndiamart = async () => {
    setSaving(true);
    try {
      const response = await configurationService.saveIndiamart({
        apiKey: indiamartSettings.apiKey,
        apiSecret: indiamartSettings.apiSecret,
        accessToken: indiamartSettings.accessToken,
        refreshToken: indiamartSettings.refreshToken,
        tokenExpiresAt: indiamartSettings.tokenExpiresAt || null,
        webhookUrl: indiamartSettings.webhookUrl
      });
      
      if (response.success) {
        showMessage('success', 'Indiamart configuration saved successfully');
      }
    } catch (error) {
      showMessage('error', error.message || 'Failed to save Indiamart configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTradeIndia = async () => {
    setSaving(true);
    try {
      const response = await configurationService.saveTradeIndia({
        apiKey: tradeindiaSettings.apiKey,
        apiSecret: tradeindiaSettings.apiSecret,
        accessToken: tradeindiaSettings.accessToken,
        refreshToken: tradeindiaSettings.refreshToken,
        tokenExpiresAt: tradeindiaSettings.tokenExpiresAt || null,
        webhookUrl: tradeindiaSettings.webhookUrl
      });
      
      if (response.success) {
        showMessage('success', 'TradeIndia configuration saved successfully');
      }
    } catch (error) {
      showMessage('error', error.message || 'Failed to save TradeIndia configuration');
    } finally {
      setSaving(false);
    }
  };

  const renderSmtpSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Server className="w-5 h-5 mr-2 text-blue-600" />
          Server Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Host <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={smtpSettings.host}
              onChange={(e) => handleSmtpChange('host', e.target.value)}
              placeholder="smtp.gmail.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Port <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={smtpSettings.port}
              onChange={(e) => handleSmtpChange('port', e.target.value)}
              placeholder="587"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-green-600" />
          Authentication
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={smtpSettings.username}
              onChange={(e) => handleSmtpChange('username', e.target.value)}
              placeholder="your-email@gmail.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={smtpSettings.password}
              onChange={(e) => handleSmtpChange('password', e.target.value)}
              placeholder="Your app password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-purple-600" />
          Recipients
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={smtpSettings.fromName}
              onChange={(e) => handleSmtpChange('fromName', e.target.value)}
              placeholder="Your Company Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={smtpSettings.fromEmail}
              onChange={(e) => handleSmtpChange('fromEmail', e.target.value)}
              placeholder="noreply@yourcompany.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipients
              </label>
              <input
                type="text"
                value={smtpSettings.recipients}
                onChange={(e) => handleSmtpChange('recipients', e.target.value)}
                placeholder="user1@example.com, user2@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CC Recipients
              </label>
              <input
                type="text"
                value={smtpSettings.ccRecipients}
                onChange={(e) => handleSmtpChange('ccRecipients', e.target.value)}
                placeholder="cc@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BCC Recipients
              </label>
              <input
                type="text"
                value={smtpSettings.bccRecipients}
                onChange={(e) => handleSmtpChange('bccRecipients', e.target.value)}
                placeholder="bcc@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleTestSmtp}
          className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors flex items-center space-x-2"
        >
          <TestTube className="w-4 h-4" />
          <span>Test Config</span>
        </button>
        <button
          onClick={handleSaveSmtp}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Config'}</span>
        </button>
      </div>
    </div>
  );

  const renderEmailTemplates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Email Templates</h3>
        <button
          onClick={handleOpenEmailTemplateSidebar}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Template</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {templates.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No email templates found. Create your first template to get started.
                  </td>
                </tr>
              ) : (
                templates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {template.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {template.subject}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {template.description}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {template.createdAt}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDocumentTemplates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-600" />
          Document Templates
        </h3>
        <button
          onClick={handleOpenDocumentTemplateSidebar}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Template</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Default
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documentTemplates.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No document templates found. Create your first template to get started.
                  </td>
                </tr>
              ) : (
                documentTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900 capitalize">
                      {template.template_type}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {template.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {template.template_key}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {template.is_default ? 'Yes' : 'No'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {template.is_active ? 'Yes' : 'No'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {template.created_at}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditDocumentTemplate(template)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit Template"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDocumentTemplate(template.id)}
                          className="p-1 text-red-400 hover:text-red-600 transition-colors"
                          title="Delete Template"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderWhatsappSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
          WhatsApp Configuration
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Flow <span className="text-red-500">*</span>
              </label>
              <select
                value={whatsappSettings.flowName}
                onChange={(e) => handleWhatsappChange('flowName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Flow</option>
                <option value="welcome-flow">Welcome Flow</option>
                <option value="follow-up-flow">Follow-up Flow</option>
                <option value="payment-reminder">Payment Reminder</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flow ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={whatsappSettings.flowId}
                onChange={(e) => handleWhatsappChange('flowId', e.target.value)}
                placeholder="Enter Flow ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={whatsappSettings.apiKey}
                onChange={(e) => handleWhatsappChange('apiKey', e.target.value)}
                placeholder="Enter WhatsApp API Key"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={whatsappSettings.phoneNumber}
                onChange={(e) => handleWhatsappChange('phoneNumber', e.target.value)}
                placeholder="+1234567890"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveWhatsapp}
          disabled={saving}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Config'}</span>
        </button>
      </div>
    </div>
  );

  const renderIndiamartSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Key className="w-5 h-5 mr-2 text-orange-600" />
          Indiamart API Configuration
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={indiamartSettings.apiKey}
                onChange={(e) => handleIndiamartChange('apiKey', e.target.value)}
                placeholder="Enter Indiamart API Key"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Secret <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={indiamartSettings.apiSecret}
                onChange={(e) => handleIndiamartChange('apiSecret', e.target.value)}
                placeholder="Enter Indiamart API Secret"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Token
              </label>
              <input
                type="password"
                value={indiamartSettings.accessToken}
                onChange={(e) => handleIndiamartChange('accessToken', e.target.value)}
                placeholder="Access Token (auto-generated)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refresh Token
              </label>
              <input
                type="password"
                value={indiamartSettings.refreshToken}
                onChange={(e) => handleIndiamartChange('refreshToken', e.target.value)}
                placeholder="Refresh Token (auto-generated)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token Expires At
              </label>
              <input
                type="datetime-local"
                value={indiamartSettings.tokenExpiresAt}
                onChange={(e) => handleIndiamartChange('tokenExpiresAt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <input
                type="url"
                value={indiamartSettings.webhookUrl}
                onChange={(e) => handleIndiamartChange('webhookUrl', e.target.value)}
                placeholder="https://your-domain.com/webhook/indiamart"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveIndiamart}
          disabled={saving}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Config'}</span>
        </button>
      </div>
    </div>
  );

  const renderTradeIndiaSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Key className="w-5 h-5 mr-2 text-blue-600" />
          TradeIndia API Configuration
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={tradeindiaSettings.apiKey}
                onChange={(e) => handleTradeIndiaChange('apiKey', e.target.value)}
                placeholder="Enter TradeIndia API Key"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Secret <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={tradeindiaSettings.apiSecret}
                onChange={(e) => handleTradeIndiaChange('apiSecret', e.target.value)}
                placeholder="Enter TradeIndia API Secret"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Token
              </label>
              <input
                type="password"
                value={tradeindiaSettings.accessToken}
                onChange={(e) => handleTradeIndiaChange('accessToken', e.target.value)}
                placeholder="Access Token (auto-generated)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refresh Token
              </label>
              <input
                type="password"
                value={tradeindiaSettings.refreshToken}
                onChange={(e) => handleTradeIndiaChange('refreshToken', e.target.value)}
                placeholder="Refresh Token (auto-generated)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token Expires At
              </label>
              <input
                type="datetime-local"
                value={tradeindiaSettings.tokenExpiresAt}
                onChange={(e) => handleTradeIndiaChange('tokenExpiresAt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <input
                type="url"
                value={tradeindiaSettings.webhookUrl}
                onChange={(e) => handleTradeIndiaChange('webhookUrl', e.target.value)}
                placeholder="https://your-domain.com/webhook/tradeindia"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveTradeIndia}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Config'}</span>
        </button>
      </div>
    </div>
  );

  const renderCloudinarySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Cloud className="w-5 h-5 mr-2 text-blue-600" />
          Cloudinary Configuration
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cloud Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cloudinarySettings.cloudName}
                onChange={(e) => handleCloudinaryChange('cloudName', e.target.value)}
                placeholder="your-cloud-name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cloudinarySettings.apiKey}
                onChange={(e) => handleCloudinaryChange('apiKey', e.target.value)}
                placeholder="Enter API Key"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Secret <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={cloudinarySettings.apiSecret}
                onChange={(e) => handleCloudinaryChange('apiSecret', e.target.value)}
                placeholder="Enter API Secret"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Preset
              </label>
              <input
                type="text"
                value={cloudinarySettings.uploadPreset}
                onChange={(e) => handleCloudinaryChange('uploadPreset', e.target.value)}
                placeholder="Enter Upload Preset (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Folder
            </label>
            <input
              type="text"
              value={cloudinarySettings.folder}
              onChange={(e) => handleCloudinaryChange('folder', e.target.value)}
              placeholder="folder-name (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">Optional: Default folder path for uploads</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveCloudinary}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Config'}</span>
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuration</h1>
        <p className="text-gray-600">Manage your system settings and configurations</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`mb-4 p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'smtp', label: 'SMTP Settings', icon: Server },
              { id: 'templates', label: 'Email Templates', icon: Mail },
              { id: 'documentTemplates', label: 'Document Templates', icon: FileText },
              { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
              { id: 'cloudinary', label: 'File Upload', icon: Cloud },
              { id: 'indiamart', label: 'Indiamart', icon: Key },
              { id: 'tradeindia', label: 'TradeIndia', icon: Key }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'smtp' && renderSmtpSettings()}
          {activeTab === 'templates' && renderEmailTemplates()}
          {activeTab === 'documentTemplates' && renderDocumentTemplates()}
          {activeTab === 'whatsapp' && renderWhatsappSettings()}
          {activeTab === 'cloudinary' && renderCloudinarySettings()}
          {activeTab === 'indiamart' && renderIndiamartSettings()}
          {activeTab === 'tradeindia' && renderTradeIndiaSettings()}
        </div>
      </div>

      {/* Document Template Sidebar */}
      <TemplateFormSidebar
        isOpen={showDocumentTemplateSidebar}
        onClose={() => {
          resetDocumentTemplateForm();
        }}
        formData={documentTemplateForm}
        onFormChange={handleDocumentTemplateChange}
        onSave={handleSaveDocumentTemplate}
        onClear={resetDocumentTemplateForm}
        saving={saving}
        isEditing={!!editingDocumentTemplateId}
      />

      {/* Email Template Sidebar */}
      <EmailTemplateFormSidebar
        isOpen={showEmailTemplateSidebar}
        onClose={handleCancelEmailTemplate}
        formData={templateForm}
        onFormChange={handleTemplateChange}
        onSave={handleSaveEmailTemplate}
        onCancel={handleCancelEmailTemplate}
        saving={saving}
      />
    </div>
  );
};

export default Configuration;
