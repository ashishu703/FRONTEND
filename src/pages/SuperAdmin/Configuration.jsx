import React, { useState } from 'react';
import { 
  Server, 
  Mail, 
  MessageSquare, 
  Save, 
  TestTube, 
  Upload, 
  Eye, 
  Code, 
  X, 
  Plus,
  Settings,
  User,
  Lock,
  AtSign,
  Users,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Configuration = () => {
  const [activeTab, setActiveTab] = useState('smtp');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
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

  // Templates State
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Welcome Email',
      subject: 'Welcome to our platform',
      description: 'Welcome new users',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Password Reset',
      subject: 'Reset your password',
      description: 'Password reset instructions',
      createdAt: '2024-01-16'
    }
  ]);

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

  const handleTemplateChange = (field, value) => {
    setTemplateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTemplateForm(prev => ({
          ...prev,
          content: file,
          htmlContent: e.target.result
        }));
      };
      reader.readAsText(file);
    }
  };

  const handleSaveTemplate = () => {
    if (templateForm.name && templateForm.subject && templateForm.description) {
      const newTemplate = {
        id: templates.length + 1,
        name: templateForm.name,
        subject: templateForm.subject,
        description: templateForm.description,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTemplates([...templates, newTemplate]);
      setTemplateForm({ name: '', subject: '', description: '', content: null, htmlContent: '' });
      setShowTemplateModal(false);
    }
  };

  const handleTestSmtp = () => {
    // Test SMTP configuration
    console.log('Testing SMTP configuration...', smtpSettings);
  };

  const handleSaveSmtp = () => {
    // Save SMTP configuration
    console.log('Saving SMTP configuration...', smtpSettings);
  };

  const handleSaveWhatsapp = () => {
    // Save WhatsApp configuration
    console.log('Saving WhatsApp configuration...', whatsappSettings);
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
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Config</span>
        </button>
      </div>
    </div>
  );

  const renderEmailTemplates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Email Templates</h3>
        <button
          onClick={() => setShowTemplateModal(true)}
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
              {templates.map((template) => (
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
              ))}
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
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Config</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuration</h1>
        <p className="text-gray-600">Manage your system settings and configurations</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'smtp', label: 'SMTP Settings', icon: Server },
              { id: 'templates', label: 'Email Templates', icon: Mail },
              { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare }
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
          {activeTab === 'whatsapp' && renderWhatsappSettings()}
        </div>
      </div>

      {/* Create Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create New Template</h2>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={templateForm.name}
                  onChange={(e) => handleTemplateChange('name', e.target.value)}
                  placeholder="Enter template name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={templateForm.subject}
                  onChange={(e) => handleTemplateChange('subject', e.target.value)}
                  placeholder="Enter email subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template For <span className="text-red-500">*</span>
                  <span className="ml-2 w-4 h-4 bg-gray-300 rounded-full inline-flex items-center justify-center text-xs text-gray-600 cursor-help">
                    ?
                  </span>
                </label>
                <input
                  type="text"
                  value={templateForm.description}
                  onChange={(e) => handleTemplateChange('description', e.target.value)}
                  placeholder="Short description of the template"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Template Content
                  </label>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm flex items-center space-x-1">
                      <Code className="w-4 h-4" />
                      <span>HTML</span>
                    </button>
                    <button className="px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded text-sm flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 mb-2">No HTML file uploaded yet</p>
                  <button
                    onClick={() => document.getElementById('file-upload').click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Select HTML File</span>
                  </button>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".html"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Template</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuration;
