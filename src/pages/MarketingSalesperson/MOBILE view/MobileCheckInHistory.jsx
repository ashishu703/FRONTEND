import React, { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle, XCircle, AlertCircle, Loader, Calendar, User, Image as ImageIcon, X } from 'lucide-react';
import { API_ENDPOINTS } from '../../../api/admin_api/api';
import apiClient from '../../../utils/apiClient';

export default function MobileCheckInHistory() {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCheckIn, setSelectedCheckIn] = useState(null);

  useEffect(() => {
    fetchCheckIns();
  }, []);

  const fetchCheckIns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(API_ENDPOINTS.MARKETING_CHECK_INS_MY_CHECKINS());
      
      if (response.data.success) {
        setCheckIns(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to fetch check-ins');
      }
    } catch (err) {
      console.error('Error fetching check-ins:', err);
      setError(err.response?.data?.message || 'Failed to fetch check-ins');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
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

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={fetchCheckIns}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">Check-In History</h1>
        <p className="text-sm text-gray-500 mt-1">Your submitted check-ins</p>
      </div>

      {checkIns.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No check-ins yet</p>
          <p className="text-sm text-gray-500 mt-1">Your check-ins will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {checkIns.map((checkIn) => (
            <div
              key={checkIn.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {checkIn.customer_name || 'Meeting'}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatDateTime(checkIn.check_in_time)}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(checkIn.status)}`}>
                  {getStatusIcon(checkIn.status)}
                  <span>{checkIn.status}</span>
                </div>
              </div>

              {/* Photo */}
              {checkIn.photo_url && (
                <div className="mb-3">
                  <img
                    src={checkIn.photo_url}
                    alt="Check-in photo"
                    className="w-full h-40 object-cover rounded-lg"
                    onClick={() => setSelectedCheckIn(checkIn)}
                  />
                </div>
              )}

              {/* Location */}
              {(checkIn.latitude && checkIn.longitude) && (
                <div className="mb-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin className="h-3 w-3" />
                    <strong>Location:</strong>
                  </div>
                  <div>Lat: {parseFloat(checkIn.latitude).toFixed(6)}</div>
                  <div>Lng: {parseFloat(checkIn.longitude).toFixed(6)}</div>
                  {checkIn.address && (
                    <div className="mt-1">{checkIn.address}</div>
                  )}
                </div>
              )}

              {/* Notes */}
              {checkIn.notes && (
                <div className="text-xs text-gray-600">
                  <strong>Notes:</strong> {checkIn.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {selectedCheckIn && selectedCheckIn.photo_url && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedCheckIn(null)}
        >
          <div className="relative max-w-2xl w-full">
            <button
              onClick={() => setSelectedCheckIn(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={selectedCheckIn.photo_url}
              alt="Check-in photo"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

