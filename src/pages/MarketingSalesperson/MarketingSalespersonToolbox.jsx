import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building,
  FileText,
  Hash,
  Eye,
  Save,
  X,
  Camera,
  FileText as Document,
  MapPin as Location,
  Upload,
  Package,
  Map,
  Video,
  Navigation,
  Download
} from 'lucide-react';

const MarketingSalespersonToolbox = ({ 
  customers, 
  updateCustomer, 
  onAddVisit, 
  onEditVisit,
  selectedLead,
  capturedPhotos,
  setCapturedPhotos,
  currentLocation,
  setCurrentLocation,
  onLivePhoto,
  onViewPhotos
}) => {
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [showLocationTimeline, setShowLocationTimeline] = useState(false);
  const [showImportLeads, setShowImportLeads] = useState(false);
  const [importSearchTerm, setImportSearchTerm] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  const handleLivePhoto = (visit) => {
    setShowCameraModal(true);
    getCurrentLocation();
  };

  // Listen for custom events from main component
  useEffect(() => {
    const handleOpenCamera = (event) => {
      console.log('Opening camera for:', event.detail);
      setShowCameraModal(true);
      getCurrentLocation();
    };

    const handleOpenGallery = (event) => {
      console.log('Opening gallery for:', event.detail);
      setShowPhotoGallery(true);
    };

    window.addEventListener('openCamera', handleOpenCamera);
    window.addEventListener('openGallery', handleOpenGallery);

    return () => {
      window.removeEventListener('openCamera', handleOpenCamera);
      window.removeEventListener('openGallery', handleOpenGallery);
    };
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          };
          setCurrentLocation(location);
          console.log('Location captured:', location);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please check location permissions.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleViewPhotos = (visit) => {
    setShowPhotoGallery(true);
  };

  const deletePhoto = (photoId, visitId) => {
    if (window.confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
      setCapturedPhotos(prev => {
        const updatedPhotos = { ...prev };
        if (updatedPhotos[visitId]) {
          updatedPhotos[visitId] = updatedPhotos[visitId].filter(photo => photo.id !== photoId);
          // If no photos left for this visit, remove the visit entry
          if (updatedPhotos[visitId].length === 0) {
            delete updatedPhotos[visitId];
          }
        }
        return updatedPhotos;
      });
      console.log('Photo deleted:', photoId);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) {
      console.error('Video element not found');
      alert('Camera not ready. Please wait for camera to load.');
      return;
    }
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('Video not ready');
      alert('Camera not ready. Please wait for video to load.');
      return;
    }
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData);
    console.log('Photo captured successfully');
  };

  const closeCamera = () => {
    stopCamera();
    setShowCameraModal(false);
    setCapturedImage(null);
  };

  const savePhoto = () => {
    if (capturedImage && selectedLead) {
      const visitId = selectedLead.id;
      const timestamp = new Date().toISOString();
      const photoData = {
        id: Date.now(),
        image: capturedImage,
        timestamp: timestamp,
        visitId: visitId,
        visitName: selectedLead.name,
        location: currentLocation,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      };
      
      setCapturedPhotos(prev => ({
        ...prev,
        [visitId]: [...(prev[visitId] || []), photoData]
      }));
      
      console.log('Photo saved for visit:', selectedLead?.name, 'with location:', currentLocation);
      alert('Photo captured successfully with location!');
      
      // Stop camera and close modal
      stopCamera();
      setShowCameraModal(false);
      setCapturedImage(null);
    }
  };

  const handleImportLead = (customer) => {
    // Update the customer's visiting status to 'scheduled' to make it appear in visits
    const updatedCustomer = {
      ...customer,
      visitingStatus: 'scheduled'
    };
    
    // Update the customer in the context
    updateCustomer(updatedCustomer);
    
    // Close the import modal
    setShowImportLeads(false);
    
    // Show success message
    alert(`Lead "${customer.name}" imported successfully to visits!`);
    console.log('Lead imported successfully:', customer.name);
  };

  // Start camera when modal opens
  useEffect(() => {
    if (showCameraModal) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [showCameraModal]);

  // Set video source when stream is available
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Filter customers for import leads modal
  const filteredImportLeads = customers.filter(customer => {
    const matchesSearch = importSearchTerm === '' || 
      customer.name.toLowerCase().includes(importSearchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(importSearchTerm.toLowerCase()) ||
      customer.address.toLowerCase().includes(importSearchTerm.toLowerCase()) ||
      customer.business.toLowerCase().includes(importSearchTerm.toLowerCase()) ||
      customer.gstNo?.toLowerCase().includes(importSearchTerm.toLowerCase()) ||
      customer.productType?.toLowerCase().includes(importSearchTerm.toLowerCase()) ||
      customer.state?.toLowerCase().includes(importSearchTerm.toLowerCase()) ||
      customer.leadSource?.toLowerCase().includes(importSearchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <>
      {/* Toolbox Action Buttons */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => setShowImportLeads(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Import Leads</span>
        </button>
        <button 
          onClick={() => setShowLocationTimeline(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          <span>Location Timeline</span>
        </button>
        <button 
          onClick={onAddVisit}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Visit</span>
        </button>
      </div>

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Live Photo - {selectedLead?.name}
              </h2>
              <button 
                onClick={closeCamera}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {!capturedImage ? (
                <div className="space-y-4">
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                    <video
                      id="camera-video"
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-96 object-cover"
                    />
                    {!stream && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <div className="text-center">
                          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Starting camera...</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Location Status Indicator */}
                    <div className="absolute top-4 right-4">
                      {currentLocation ? (
                        <div className="flex items-center space-x-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs">
                          <MapPin className="w-3 h-3" />
                          <span>Location Captured</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs">
                          <MapPin className="w-3 h-3" />
                          <span>Getting Location...</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={capturePhoto}
                      disabled={!stream}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <Camera className="w-5 h-5" />
                      <span>Capture Photo</span>
                    </button>
                    <button
                      onClick={closeCamera}
                      className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={capturedImage}
                      alt="Captured photo"
                      className="w-full h-96 object-cover"
                    />
                </div>
                
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={savePhoto}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-5 h-5" />
                      <span>Save Photo</span>
                    </button>
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                      <span>Retake</span>
                    </button>
                    <button
                      onClick={closeCamera}
                      className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Photo Gallery Modal */}
      {showPhotoGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[1000px] h-[650px] mx-4 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Captured Photos - {selectedLead?.name}
              </h2>
              <button 
                onClick={() => setShowPhotoGallery(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              {selectedLead && capturedPhotos[selectedLead.id] && capturedPhotos[selectedLead.id].length > 0 ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      <Camera className="w-4 h-4 mr-2" />
                      {capturedPhotos[selectedLead.id].length} Photo{capturedPhotos[selectedLead.id].length > 1 ? 's' : ''} Captured
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {capturedPhotos[selectedLead.id].map((photo, index) => (
                      <div key={photo.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start space-x-6">
                          {/* Photo Section */}
                          <div className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={photo.image}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          
                          {/* Info Section */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">Photo {index + 1}</h3>
                                <p className="text-sm text-gray-500">{photo.date} at {photo.time}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = photo.image;
                                    link.download = `visit-photo-${photo.id}.png`;
                                    link.click();
                                  }}
                                  className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                  <Download className="w-4 h-4" />
                                  <span>Download</span>
                                </button>
                                <button
                                  onClick={() => deletePhoto(photo.id, selectedLead.id)}
                                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                            
                            {/* Info Cards */}
                            <div className="grid grid-cols-2 gap-4">
                              {/* Date & Time Card */}
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-3">
                                  <Calendar className="w-5 h-5 text-blue-600" />
                                  <span className="font-medium text-gray-900">Date & Time</span>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">{photo.date}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">{photo.time}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Location Card */}
                              {photo.location && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <div className="flex items-center space-x-2 mb-3">
                                    <MapPin className="w-5 h-5 text-green-600" />
                                    <span className="font-medium text-gray-900">Location</span>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-600">Latitude:</span>
                                      <span className="text-sm text-gray-700 font-mono">{photo.location.latitude.toFixed(4)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-600">Longitude:</span>
                                      <span className="text-sm text-gray-700 font-mono">{photo.location.longitude.toFixed(4)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-600">Altitude:</span>
                                      <span className="text-sm text-gray-700">±{Math.round(photo.location.accuracy)}m</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No Photos Captured</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    No photos have been captured for this visit yet. Use the Live Photo button to capture photos during your visit.
                  </p>
                  <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Use Live Photo button to capture
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Location Timeline Modal */}
      {showLocationTimeline && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[900px] h-[500px] mx-4 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Map className="w-6 h-6 mr-3 text-green-600" />
                Salesperson Location Timeline
              </h2>
              <button
                onClick={() => setShowLocationTimeline(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 flex">
              {/* Map Section */}
              <div className="flex-1 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Interactive Map</h3>
                  <p className="text-gray-500 mb-4">Route visualization will be displayed here</p>
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <p className="text-sm text-gray-600">Map integration coming soon...</p>
                  </div>
                </div>
              </div>
              
              {/* Timeline Section */}
              <div className="w-64 border-l bg-gray-50 overflow-y-auto">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Visit Timeline</h3>
                  
                  {Object.keys(capturedPhotos).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(capturedPhotos).map(([leadId, photos]) => {
                        const lead = customers.find(c => c.id === parseInt(leadId));
                        if (!lead || photos.length === 0) return null;
                        
                        return (
                          <div key={leadId} className="bg-white rounded-lg p-4 shadow-sm border">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{lead.name}</h4>
                                <p className="text-sm text-gray-500">{lead.business}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              {photos.map((photo, index) => (
                                <div key={photo.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">Photo {index + 1}</p>
                                    <p className="text-xs text-gray-500">{photo.date} at {photo.time}</p>
                                    {photo.location && (
                                      <p className="text-xs text-gray-400 font-mono">
                                        {photo.location.latitude.toFixed(4)}, {photo.location.longitude.toFixed(4)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Location Data</h3>
                      <p className="text-gray-500 text-sm">
                        Capture photos with location to see your route timeline
                      </p>
            </div>
          )}
        </div>
      </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Leads Modal */}
      {showImportLeads && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Upload className="w-6 h-6 mr-3 text-blue-600" />
                Import Leads to Visits
              </h2>
              <button
                onClick={() => setShowImportLeads(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Select leads from your customer database to add to your visits list. 
                  You can filter and search through all available leads.
                </p>
                
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search leads by name, business, or phone..."
                      value={importSearchTerm}
                      onChange={(e) => setImportSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Leads Table */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Available Leads ({filteredImportLeads.length})</h3>
                
                {filteredImportLeads.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-white border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              <div className="flex items-center">
                                <Hash className="w-4 h-4 text-purple-600 mr-2" />
                                LEAD ID
                              </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              <div className="flex items-center">
                                <User className="w-4 h-4 text-blue-600 mr-2" />
                                NAME & PHONE
                              </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 text-green-600 mr-2" />
                                ADDRESS
                              </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 text-purple-600 mr-2" />
                                GST NO.
                              </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              <div className="flex items-center">
                                <Package className="w-4 h-4 text-purple-600 mr-2" />
                                PRODUCT TYPE
                            </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              <div className="flex items-center">
                                <Map className="w-4 h-4 text-blue-600 mr-2" />
                                STATE
                            </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              <div className="flex items-center">
                                <Building className="w-4 h-4 text-orange-600 mr-2" />
                                <div>
                                  <div>LEAD</div>
                                  <div>SOURCE</div>
                        </div>
                      </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                                STATUS
                            </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              <div className="flex items-center">
                                <Upload className="w-4 h-4 text-blue-600 mr-2" />
                                ACTIONS
                        </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredImportLeads.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{customer.id}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                  <div className="text-sm text-gray-500">{customer.phone}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 max-w-xs truncate">{customer.address}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{customer.gstNo || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{customer.productType || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{customer.state || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{customer.leadSource || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  customer.visitingStatus === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                  customer.visitingStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                  customer.visitingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {customer.visitingStatus || 'Not Scheduled'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => handleImportLead(customer)}
                                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-xs"
                                >
                                  Import
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Leads Available</h3>
                    <p className="text-gray-500">
                      No leads found in your database. Add some leads first to import them to visits.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end p-6 border-t">
              <button
                onClick={() => setShowImportLeads(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarketingSalespersonToolbox;
