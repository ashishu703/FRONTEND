import React, { useState } from 'react';
import { X, MapPin, Clock, User, Camera, CheckCircle, XCircle, AlertCircle, ExternalLink, Save } from 'lucide-react';

export default function CheckInDetailsModal({ checkIn, onClose, onStatusUpdate }) {
  const [selectedStatus, setSelectedStatus] = useState(checkIn.status);
  const [notes, setNotes] = useState(checkIn.notes || '');

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="h-4 w-4" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const openGoogleMaps = () => {
    if (checkIn.latitude && checkIn.longitude) {
      const url = `https://www.google.com/maps?q=${checkIn.latitude},${checkIn.longitude}`;
      window.open(url, '_blank');
    }
  };

  const getGoogleMapsEmbedUrl = () => {
    if (!checkIn.latitude || !checkIn.longitude) return null;
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${checkIn.latitude},${checkIn.longitude}&zoom=15`;
  };

  const handleSaveStatus = () => {
    if (onStatusUpdate) {
      onStatusUpdate(selectedStatus);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Check-In Details</h2>
            <p className="text-sm text-gray-500">View photo and location information</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Photo */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Check-In Photo</h3>
                  </div>
                </div>
                {checkIn.photo_url ? (
                  <div className="relative bg-gray-50">
                    <img
                      src={checkIn.photo_url}
                      alt="Check-in photo"
                      className="w-full h-auto max-h-[500px] object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-64 bg-gray-100 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Details & Map */}
            <div className="space-y-4">
              {/* Customer & Salesperson Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Meeting Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Customer Name</p>
                    <p className="font-medium text-gray-900">{checkIn.customer_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Salesperson</p>
                    <p className="font-medium text-gray-900">
                      {checkIn.salesperson_name || checkIn.salesperson_email || 'N/A'}
                    </p>
                    {checkIn.salesperson_email && (
                      <p className="text-sm text-gray-500">{checkIn.salesperson_email}</p>
                    )}
                  </div>
                  {checkIn.meeting_address && (
                    <div>
                      <p className="text-sm text-gray-500">Meeting Address</p>
                      <p className="text-gray-900">{checkIn.meeting_address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Check-In Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Check-In Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Check-In Time</p>
                      <p className="font-medium text-gray-900">{formatDateTime(checkIn.check_in_time)}</p>
                    </div>
                  </div>

                  {/* Location */}
                  {checkIn.latitude && checkIn.longitude && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-500">Location Coordinates</p>
                      </div>
                      <div className="ml-6 space-y-1">
                        <p className="text-sm font-mono text-gray-700">
                          Lat: {parseFloat(checkIn.latitude).toFixed(6)}
                        </p>
                        <p className="text-sm font-mono text-gray-700">
                          Lng: {parseFloat(checkIn.longitude).toFixed(6)}
                        </p>
                        {checkIn.address && (
                          <p className="text-sm text-gray-600 mt-2">{checkIn.address}</p>
                        )}
                        <button
                          onClick={openGoogleMaps}
                          className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Open in Google Maps</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Map View */}
              {checkIn.latitude && checkIn.longitude && (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">Location on Map</h3>
                    </div>
                  </div>
                  <div className="h-64 bg-gray-100 relative">
                    {/* Google Maps Embed */}
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6d-s6U4iYWEzq8E&q=${checkIn.latitude},${checkIn.longitude}&zoom=15`}
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={openGoogleMaps}
                        className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 shadow-sm"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Open in Maps</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Update Status</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${getStatusColor(selectedStatus)} focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="Pending Review">Pending Review</option>
                      <option value="Verified">Verified</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {checkIn.notes && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Notes</p>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {checkIn.notes}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleSaveStatus}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Save className="h-5 w-5" />
                    <span>Update Status</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


