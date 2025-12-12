import React, { useState, useEffect } from 'react';
import { MapPin, Camera, Clock, User, Search, Filter, Eye, CheckCircle, XCircle, AlertCircle, Loader, ExternalLink } from 'lucide-react';
import { API_ENDPOINTS } from '../../api/admin_api/api';
import apiClient from '../../utils/apiClient';
import CheckInDetailsModal from './CheckInDetailsModal';

export default function CheckInDashboard() {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCheckIn, setSelectedCheckIn] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [salespersonFilter, setSalespersonFilter] = useState('all');

  useEffect(() => {
    fetchCheckIns();
  }, []);

  const fetchCheckIns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(API_ENDPOINTS.MARKETING_CHECK_INS_GET_ALL());
      
      // apiClient.get() returns data directly, not wrapped in response.data
      if (response && response.success) {
        setCheckIns(response.data || []);
      } else {
        setError(response?.message || 'Failed to fetch check-ins');
      }
    } catch (err) {
      console.error('Error fetching check-ins:', err);
      // apiClient throws errors with err.data or err.message
      const errorMessage = err.data?.message || err.message || err.response?.data?.message || 'Failed to fetch check-ins';
      setError(errorMessage);
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

  const openGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const handleViewDetails = (checkIn) => {
    setSelectedCheckIn(checkIn);
    setShowDetailsModal(true);
  };

  const handleStatusUpdate = async (checkInId, newStatus) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.MARKETING_CHECK_IN_UPDATE(checkInId),
        { status: newStatus }
      );

      if (response.data.success) {
        fetchCheckIns();
        if (selectedCheckIn && selectedCheckIn.id === checkInId) {
          setSelectedCheckIn({
            ...selectedCheckIn,
            status: newStatus
          });
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Get unique salespersons for filter
  const salespersons = Array.from(new Set(checkIns.map(ci => ci.salesperson_email))).filter(Boolean);

  const filteredCheckIns = checkIns.filter(checkIn => {
    const matchesSearch = checkIn.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checkIn.salesperson_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checkIn.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || checkIn.status === statusFilter;
    const matchesSalesperson = salespersonFilter === 'all' || checkIn.salesperson_email === salespersonFilter;
    return matchesSearch && matchesStatus && matchesSalesperson;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check-In Dashboard</h1>
        <p className="text-gray-600">View all check-ins with photos and locations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Check-Ins</p>
              <p className="text-2xl font-bold text-gray-900">{checkIns.length}</p>
            </div>
            <Camera className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">
                {checkIns.filter(ci => ci.status === 'Pending Review').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Verified</p>
              <p className="text-2xl font-bold text-green-600">
                {checkIns.filter(ci => ci.status === 'Verified').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unique Salespersons</p>
              <p className="text-2xl font-bold text-gray-900">{salespersons.length}</p>
            </div>
            <User className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name, salesperson, or address..."
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
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={salespersonFilter}
              onChange={(e) => setSalespersonFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="all">All Salespersons</option>
              {salespersons.map((sp) => (
                <option key={sp} value={sp}>{sp}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
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
      ) : filteredCheckIns.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg mb-2">
            {searchTerm || statusFilter !== 'all' || salespersonFilter !== 'all' 
              ? 'No check-ins match your filters' 
              : 'No check-ins yet'}
          </p>
          <p className="text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' || salespersonFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Check-ins will appear here once salespersons submit them'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salesperson</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCheckIns.map((checkIn) => (
                  <tr key={checkIn.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {checkIn.photo_url ? (
                        <img
                          src={checkIn.photo_url}
                          alt="Check-in"
                          className="h-16 w-16 object-cover rounded-lg cursor-pointer hover:opacity-80"
                          onClick={() => handleViewDetails(checkIn)}
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Camera className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {checkIn.salesperson_name || checkIn.salesperson_email}
                      </div>
                      <div className="text-sm text-gray-500">{checkIn.salesperson_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {checkIn.customer_name || 'N/A'}
                      </div>
                      {checkIn.meeting_address && (
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {checkIn.meeting_address}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {checkIn.latitude && checkIn.longitude ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openGoogleMaps(checkIn.latitude, checkIn.longitude)}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                          >
                            <MapPin className="h-4 w-4" />
                            <span>View Map</span>
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(checkIn.check_in_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={checkIn.status}
                        onChange={(e) => handleStatusUpdate(checkIn.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(checkIn.status)}`}
                      >
                        <option value="Pending Review">Pending Review</option>
                        <option value="Verified">Verified</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(checkIn)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Check-In Details Modal */}
      {showDetailsModal && selectedCheckIn && (
        <CheckInDetailsModal
          checkIn={selectedCheckIn}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedCheckIn(null);
          }}
          onStatusUpdate={(newStatus) => {
            handleStatusUpdate(selectedCheckIn.id, newStatus);
          }}
        />
      )}
    </div>
  );
}

