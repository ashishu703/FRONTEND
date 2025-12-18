import React, { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle, XCircle, AlertCircle, Loader, Calendar, User, Image as ImageIcon, X, Search, Filter, RefreshCw } from 'lucide-react';
import { API_ENDPOINTS } from '../../../api/admin_api/api';
import apiClient from '../../../utils/apiClient';

export default function MobileCheckInHistory() {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCheckIn, setSelectedCheckIn] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchCheckIns = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setLoadingRefresh(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await apiClient.get(API_ENDPOINTS.MARKETING_CHECK_INS_MY_CHECKINS());
      
      // apiClient.get() returns data directly, not wrapped in response.data
      if (response && response.success) {
        setCheckIns(response.data || []);
      } else {
        setError(response?.message || 'Failed to fetch check-ins');
      }
    } catch (err) {
      console.error('Error fetching check-ins:', err);
      const errorMessage = err.data?.message || err.message || err.response?.data?.message || 'Failed to fetch check-ins';
      setError(errorMessage);
    } finally {
      if (isRefresh) {
        setLoadingRefresh(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCheckIns();
    
    // Listen for check-in submission and rejection events
    const handleCheckInSubmitted = () => {
      console.log('Check-in submitted, refreshing history...');
      setTimeout(() => {
        fetchCheckIns(true);
      }, 1000);
    };
    
    const handleCheckInRejected = () => {
      console.log('Check-in rejected, refreshing history...');
      setTimeout(() => {
        fetchCheckIns(true);
      }, 1000);
    };
    
    window.addEventListener('checkInSubmitted', handleCheckInSubmitted);
    window.addEventListener('checkInRejected', handleCheckInRejected);
    return () => {
      window.removeEventListener('checkInSubmitted', handleCheckInSubmitted);
      window.removeEventListener('checkInRejected', handleCheckInRejected);
    };
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Check-In History</h1>
              <p className="text-sm text-gray-500 mt-1">View all your submitted check-ins</p>
            </div>
            <button
              onClick={() => fetchCheckIns(true)}
              disabled={loadingRefresh}
              className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${loadingRefresh ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={() => fetchCheckIns()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredCheckIns.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium text-sm mb-1">
              {searchTerm || statusFilter !== 'all' ? 'No check-ins match your filters' : 'No check-ins yet'}
            </p>
            <p className="text-xs text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Your check-ins will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCheckIns.map((checkIn) => (
              <div
                key={checkIn.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Photo */}
                {checkIn.photo_url && (
                  <div className="relative h-32 bg-gray-100">
                    <img
                      src={checkIn.photo_url}
                      alt="Check-in photo"
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setSelectedCheckIn(checkIn)}
                    />
                    <div className="absolute top-1.5 right-1.5">
                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(checkIn.status)}`}>
                        {getStatusIcon(checkIn.status)}
                        <span>{checkIn.status}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">
                    {checkIn.customer_name || 'Meeting'}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-2">
                    <Clock className="h-3 w-3" />
                    <span>{formatDateTime(checkIn.check_in_time)}</span>
                  </div>

                  {/* Location */}
                  {(checkIn.latitude && checkIn.longitude) && (
                    <div className="mb-2 p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MapPin className="h-3 w-3 text-blue-600" />
                        <span className="text-[10px] font-medium text-gray-700">Location</span>
                      </div>
                      <div className="text-[10px] text-gray-600 space-y-0.5">
                        <div className="font-mono">Lat: {parseFloat(checkIn.latitude).toFixed(6)}</div>
                        <div className="font-mono">Lng: {parseFloat(checkIn.longitude).toFixed(6)}</div>
                        {checkIn.address && (
                          <div className="pt-0.5 border-t border-gray-200 text-xs">{checkIn.address}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {checkIn.notes && (
                    <div className="text-[10px] text-gray-600">
                      <strong>Notes:</strong> {checkIn.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {selectedCheckIn && selectedCheckIn.photo_url && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedCheckIn(null)}
        >
          <div className="relative max-w-2xl w-full">
            <button
              onClick={() => setSelectedCheckIn(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white z-10 hover:bg-black/70 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={selectedCheckIn.photo_url}
              alt="Check-in photo"
              className="w-full h-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
