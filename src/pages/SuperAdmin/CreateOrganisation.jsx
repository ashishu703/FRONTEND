import React, { useState } from 'react';
import { Building2, MapPin, Phone, Mail, Globe, FileText, DollarSign, Clock, Upload, Save, X } from 'lucide-react';

const CreateOrganisation = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    legalName: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    taxInfo: {
      gstin: '',
      pan: '',
      tan: ''
    },
    financial: {
      currency: 'INR',
      fiscalYearStart: 'April',
      fiscalYearEnd: 'March'
    },
    timezone: 'Asia/Kolkata',
    logo: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setErrors(prev => ({
          ...prev,
          logo: 'Logo size should be less than 2MB'
        }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        logo: file
      }));
      setErrors(prev => ({
        ...prev,
        logo: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }
    
    if (!formData.legalName.trim()) {
      newErrors.legalName = 'Legal name is required';
    }
    
    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Street address is required';
    }
    
    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    }
    
    if (!formData.address.state.trim()) {
      newErrors['address.state'] = 'State is required';
    }
    
    if (!formData.address.zipCode.trim()) {
      newErrors['address.zipCode'] = 'ZIP code is required';
    }
    
    if (formData.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
      newErrors['contact.email'] = 'Invalid email format';
    }
    
    if (formData.contact.phone && !/^[0-9]{10}$/.test(formData.contact.phone.replace(/[\s-]/g, ''))) {
      newErrors['contact.phone'] = 'Invalid phone number';
    }
    
    if (formData.taxInfo.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.taxInfo.gstin)) {
      newErrors['taxInfo.gstin'] = 'Invalid GSTIN format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // TODO: Implement API call to create organization
      console.log('Form Data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Organization created successfully!');
      
      // Reset form
      setFormData({
        organizationName: '',
        legalName: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'India'
        },
        contact: {
          phone: '',
          email: '',
          website: ''
        },
        taxInfo: {
          gstin: '',
          pan: '',
          tan: ''
        },
        financial: {
          currency: 'INR',
          fiscalYearStart: 'April',
          fiscalYearEnd: 'March'
        },
        timezone: 'Asia/Kolkata',
        logo: null
      });
    } catch (error) {
      console.error('Error creating organization:', error);
      alert('Failed to create organization. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      organizationName: '',
      legalName: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      },
      contact: {
        phone: '',
        email: '',
        website: ''
      },
      taxInfo: {
        gstin: '',
        pan: '',
        tan: ''
      },
      financial: {
        currency: 'INR',
        fiscalYearStart: 'April',
        fiscalYearEnd: 'March'
      },
      timezone: 'Asia/Kolkata',
      logo: null
    });
    setErrors({});
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Organization</h1>
              <p className="text-sm text-gray-500">Set up your organization profile and details</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-600" />
              Organization Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.organizationName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter organization name"
                />
                {errors.organizationName && (
                  <p className="mt-1 text-sm text-red-500">{errors.organizationName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Legal Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="legalName"
                  value={formData.legalName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.legalName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter legal name"
                />
                {errors.legalName && (
                  <p className="mt-1 text-sm text-red-500">{errors.legalName}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Logo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      {formData.logo ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={URL.createObjectURL(formData.logo)}
                            alt="Logo preview"
                            className="h-20 w-auto object-contain"
                          />
                          <span className="mt-2 text-sm text-gray-600">{formData.logo.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-gray-400" />
                          <span className="mt-2 text-sm text-gray-600">Click to upload logo</span>
                          <span className="text-xs text-gray-500">PNG, JPG up to 2MB</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                {errors.logo && (
                  <p className="mt-1 text-sm text-red-500">{errors.logo}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Address Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['address.street'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter street address"
                />
                {errors['address.street'] && (
                  <p className="mt-1 text-sm text-red-500">{errors['address.street']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['address.city'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter city"
                />
                {errors['address.city'] && (
                  <p className="mt-1 text-sm text-red-500">{errors['address.city']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['address.state'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter state"
                />
                {errors['address.state'] && (
                  <p className="mt-1 text-sm text-red-500">{errors['address.state']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['address.zipCode'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter ZIP code"
                />
                {errors['address.zipCode'] && (
                  <p className="mt-1 text-sm text-red-500">{errors['address.zipCode']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-blue-600" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['contact.phone'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors['contact.phone'] && (
                  <p className="mt-1 text-sm text-red-500">{errors['contact.phone']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['contact.email'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors['contact.email'] && (
                  <p className="mt-1 text-sm text-red-500">{errors['contact.email']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="contact.website"
                  value={formData.contact.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Tax Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Tax Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GSTIN
                </label>
                <input
                  type="text"
                  name="taxInfo.gstin"
                  value={formData.taxInfo.gstin}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase ${
                    errors['taxInfo.gstin'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="15-character GSTIN"
                  maxLength={15}
                />
                {errors['taxInfo.gstin'] && (
                  <p className="mt-1 text-sm text-red-500">{errors['taxInfo.gstin']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAN
                </label>
                <input
                  type="text"
                  name="taxInfo.pan"
                  value={formData.taxInfo.pan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                  placeholder="10-character PAN"
                  maxLength={10}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TAN
                </label>
                <input
                  type="text"
                  name="taxInfo.tan"
                  value={formData.taxInfo.tan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                  placeholder="10-character TAN"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          {/* Financial Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
              Financial Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="financial.currency"
                  value={formData.financial.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiscal Year Start
                </label>
                <select
                  name="financial.fiscalYearStart"
                  value={formData.financial.fiscalYearStart}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="January">January</option>
                  <option value="April">April</option>
                  <option value="July">July</option>
                  <option value="October">October</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Creating...' : 'Create Organization'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrganisation;

