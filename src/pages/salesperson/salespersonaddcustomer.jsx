"use client"

import { useState } from "react"
import { X, User, Phone, MessageCircle, Mail, Building2, FileText, MapPin, Globe, Package, Wrench } from "lucide-react"

function Card({ className, children }) {
  return <div className={`rounded-lg border bg-white shadow-sm ${className || ''}`}>{children}</div>
}

function CardContent({ className, children }) {
  return <div className={`p-0 ${className || ''}`}>{children}</div>
}

function CardHeader({ className, children }) {
  return <div className={`p-6 ${className || ''}`}>{children}</div>
}

function CardTitle({ className, children }) {
  return <h3 className={`text-lg font-semibold ${className || ''}`}>{children}</h3>
}

function Button({ children, onClick, type = "button", variant = "default", size = "default", className = "" }) {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-blue-500"
  }
  
  const sizes = {
    default: "h-10 py-2 px-4",
    icon: "h-10 w-10"
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

export default function AddCustomerForm({ onClose, onSave, editingCustomer }) {
  const [formData, setFormData] = useState({
    customerName: editingCustomer?.name || "",
    mobileNumber: editingCustomer?.phone || "",
    whatsappNumber: editingCustomer?.whatsapp?.replace('+91', '') || "",
    email: editingCustomer?.email === "N/A" ? "" : editingCustomer?.email || "",
    business: editingCustomer?.business || "",
    productName: editingCustomer?.productName || "",
    gstNumber: editingCustomer?.gstNo === "N/A" ? "" : editingCustomer?.gstNo || "",
    address: editingCustomer?.address || "",
    state: editingCustomer?.state || "",
    customerType: editingCustomer?.customerType || "",
    leadSource: editingCustomer?.enquiryBy || "",
    salesStatus: editingCustomer?.salesStatus || 'pending',
    salesStatusRemark: editingCustomer?.salesStatusRemark || '',
    callDurationSeconds: editingCustomer?.callDurationSeconds || '',
    callRecordingFile: null,
    transferredTo: editingCustomer?.transferredTo || '',
    date: new Date().toISOString().split('T')[0],
    meetingDate: editingCustomer?.meetingDate || '',
    meetingTime: editingCustomer?.meetingTime || '',
    // Technical Data fields for AB Cable
    reference: editingCustomer?.reference || "IS 14255:1995",
    ratedVoltage: editingCustomer?.ratedVoltage || "1100 volts",
    conductor: editingCustomer?.conductor || "Class-2 as per IS-8130",
    insulation: editingCustomer?.insulation || "Cross link polythene insulated",
    messenger: editingCustomer?.messenger || "Aluminium alloy conductor as per IS-398 pt-4",
    temperatureRange: editingCustomer?.temperatureRange || "-30°C to 90°C",
    features: editingCustomer?.features || "• UV radiation protected\n• Higher current carrying capacity\n• High temperature range -30°C to 90°C",
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (field, file) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }))
  }

  const isDisabled = (field) => {
    if (!editingCustomer) return false
    const initialMap = {
      customerName: editingCustomer?.name,
      mobileNumber: editingCustomer?.phone,
      whatsappNumber: editingCustomer?.whatsapp,
      email: editingCustomer?.email,
      business: editingCustomer?.business,
      productName: editingCustomer?.productName,
      gstNumber: editingCustomer?.gstNo,
      address: editingCustomer?.address,
      state: editingCustomer?.state,
      customerType: editingCustomer?.customerType,
      leadSource: editingCustomer?.enquiryBy,
    }
    const raw = (initialMap[field] ?? '').toString().trim()
    return raw !== '' && raw.toUpperCase() !== 'N/A'
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {editingCustomer ? 'Update the customer details below' : 'Fill in the customer details below'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  Customer Name *
                </label>
                <input
                  type="text"
                  disabled={isDisabled('customerName')}
                  value={formData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter customer name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-500" />
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  disabled={isDisabled('mobileNumber')}
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter mobile number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  disabled={isDisabled('whatsappNumber')}
                  value={formData.whatsappNumber}
                  onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter WhatsApp number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-cyan-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  disabled={isDisabled('email')}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            {/* Business Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Package className="h-4 w-4 text-purple-500" />
                  Product Name *
                </label>
                <input
                  type="text"
                  disabled={isDisabled('productName')}
                  value={formData.productName}
                  onChange={(e) => handleInputChange("productName", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-orange-500" />
                  GST Number
                </label>
                <input
                  type="text"
                  disabled={isDisabled('gstNumber')}
                  value={formData.gstNumber}
                  onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter GST number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-red-500" />
                  State *
                </label>
                <input
                  type="text"
                  disabled={isDisabled('state')}
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter state"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  Business
                </label>
                <input
                  type="text"
                  disabled={isDisabled('business')}
                  value={formData.business}
                  onChange={(e) => handleInputChange("business", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter business name"
                />
              </div>
              
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                Address *
              </label>
              <textarea
                disabled={isDisabled('address')}
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter complete address"
              />
            </div>


            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-500" />
                  Customer Type *
                </label>
                <input
                  type="text"
                  disabled={isDisabled('customerType')}
                  value={formData.customerType}
                  onChange={(e) => handleInputChange("customerType", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter customer type"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-orange-500" />
                  Lead Source *
                </label>
                <input
                  type="text"
                  disabled={isDisabled('leadSource')}
                  value={formData.leadSource}
                  onChange={(e) => handleInputChange("leadSource", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter lead source"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  Date *
                </label>
                <input
                  type="date"
                  disabled
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  readOnly={true}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">Date is auto-detected</p>
              </div>
            </div>

            {/* Sales Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  Sales Status
                </label>
                <select
                  value={formData.salesStatus}
                  onChange={(e) => handleInputChange("salesStatus", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="running">Running</option>
                  <option value="converted">Converted</option>
                  <option value="lost_closed">Lost/Closed</option>
                  <option value="interested">Interested</option>
                  <option value="win_converted">Win - CONVERTED</option>
                  <option value="next_meeting">Next Meeting</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {formData.salesStatus === 'other' ? 'Please specify status' : 
                   formData.salesStatus === 'next_meeting' ? 'Meeting Date & Time' : 
                   'Remark for sales status'}
                </label>
                {formData.salesStatus === 'next_meeting' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Date</label>
                      <input
                        type="date"
                        value={formData.meetingDate || ''}
                        onChange={(e) => handleInputChange("meetingDate", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Time</label>
                      <input
                        type="time"
                        value={formData.meetingTime || ''}
                        onChange={(e) => handleInputChange("meetingTime", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={formData.salesStatusRemark}
                    onChange={(e) => handleInputChange("salesStatusRemark", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder={formData.salesStatus === 'other' ? 'Please specify sales status' : 'Remark for sales status'}
                  />
                )}
              </div>
            </div>


            {/* Transfer Lead field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-purple-600" />
                Transfer Lead to
              </label>
              <input
                type="text"
                value={formData.transferredTo}
                onChange={(e) => handleInputChange("transferredTo", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter who the lead was transferred to"
              />
            </div>

            {/* Technical Data Section - AB Cable Specifications */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-600" />
                Technical Data
              </h3>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Reference
                    </label>
                    <input
                      type="text"
                      value={formData.reference || "IS 14255:1995"}
                      onChange={(e) => handleInputChange("reference", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter reference standard"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Rated Voltage
                    </label>
                    <input
                      type="text"
                      value={formData.ratedVoltage || "1100 volts"}
                      onChange={(e) => handleInputChange("ratedVoltage", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter rated voltage"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Conductor
                    </label>
                    <input
                      type="text"
                      value={formData.conductor || "Class-2 as per IS-8130"}
                      onChange={(e) => handleInputChange("conductor", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter conductor specification"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Insulation
                    </label>
                    <input
                      type="text"
                      value={formData.insulation || "Cross link polythene insulated"}
                      onChange={(e) => handleInputChange("insulation", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter insulation type"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Messenger
                    </label>
                    <input
                      type="text"
                      value={formData.messenger || "Aluminium alloy conductor as per IS-398 pt-4"}
                      onChange={(e) => handleInputChange("messenger", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter messenger specification"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Temperature Range
                    </label>
                    <input
                      type="text"
                      value={formData.temperatureRange || "-30°C to 90°C"}
                      onChange={(e) => handleInputChange("temperatureRange", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter temperature range"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Features
                  </label>
                  <textarea
                    value={formData.features || "• UV radiation protected\n• Higher current carrying capacity\n• High temperature range -30°C to 90°C"}
                    onChange={(e) => handleInputChange("features", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter features (one per line)"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                {editingCustomer ? 'Update Customer' : 'Add Customer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
