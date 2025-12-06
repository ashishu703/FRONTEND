import React, { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle, XCircle, AlertCircle, Loader, Calendar, User, Image as ImageIcon, X, Search, Filter } from 'lucide-react';
import { API_ENDPOINTS } from '../../api/admin_api/api';
import apiClient from '../../utils/apiClient';

export default function CheckInHistory() {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCheckIn, setSelectedCheckIn] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const filteredCheckIns = checkIns.filter(checkIn => {
    const matchesSearch = checkIn.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checkIn.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || checkIn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-3" />
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={fetchCheckIns}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check-In History</h1>
        <p className="text-gray-600">View all your submitted check-ins</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {filteredCheckIns.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No check-ins match your filters' : 'No check-ins yet'}
          </p>
          <p className="text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Your check-ins will appear here'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCheckIns.map((checkIn) => (
            <div
              key={checkIn.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Photo */}
              {checkIn.photo_url && (
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={checkIn.photo_url}
                    alt="Check-in photo"
                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedCheckIn(checkIn)}
                  />
                  <div className="absolute top-2 right-2">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(checkIn.status)}`}>
                      {getStatusIcon(checkIn.status)}
                      <span>{checkIn.status}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {checkIn.customer_name || 'Meeting'}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Clock className="h-4 w-4" />
                  <span>{formatDateTime(checkIn.check_in_time)}</span>
                </div>

                {/* Location */}
                {(checkIn.latitude && checkIn.longitude) && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-gray-700">Location</span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="font-mono">Lat: {parseFloat(checkIn.latitude).toFixed(6)}</div>
                      <div className="font-mono">Lng: {parseFloat(checkIn.longitude).toFixed(6)}</div>
                      {checkIn.address && (
                        <div className="pt-1 border-t border-gray-200">{checkIn.address}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {checkIn.notes && (
                  <div className="text-xs text-gray-600">
                    <strong>Notes:</strong> {checkIn.notes}
                  </div>
                )}
              </div>
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
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedCheckIn(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white z-10 hover:bg-black/70 transition-colors"
            >
              <X className="h-6 w-6" />
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

