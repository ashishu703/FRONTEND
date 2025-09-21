import React, { useState } from 'react';
import { 
  MapPin,
  Plus,
  X,
  Camera,
  Map,
  Eye,
  Download,
  Users,
  Search,
  User,
  FileText,
  Package,
  Globe,
  Calendar,
  CheckCircle,
  Hash,
  Clock,
  Building,
  Filter,
  RefreshCw,
  Upload
} from 'lucide-react';

const Visits = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visits, setVisits] = useState([
    { 
      id: 1, 
      customer: 'Tech Solutions Inc', 
      time: '09:00 AM', 
      address: '123 Business St, City', 
      status: 'Scheduled',
      productType: 'Industrial Equipment',
      customerType: 'B2B',
      date: '2025-01-17',
      photos: [],
      locationTimeline: [
        {
          id: 1,
          latitude: 22.719569,
          longitude: 75.857726,
          accuracy: 5,
          timestamp: '2025-01-17 09:00:00',
          type: 'start'
        },
        {
          id: 2,
          latitude: 22.720000,
          longitude: 75.858000,
          accuracy: 8,
          timestamp: '2025-01-17 09:15:00',
          type: 'waypoint'
        },
        {
          id: 3,
          latitude: 22.720500,
          longitude: 75.858500,
          accuracy: 6,
          timestamp: '2025-01-17 09:30:00',
          type: 'destination'
        }
      ]
    },
    { 
      id: 2, 
      customer: 'Marketing Agency', 
      time: '11:30 AM', 
      address: '456 Corporate Ave, City', 
      status: 'In Progress',
      productType: 'Commercial Lighting',
      customerType: 'B2B',
      date: '2025-01-16',
      photos: [],
      locationTimeline: [
        {
          id: 4,
          latitude: 22.721000,
          longitude: 75.859000,
          accuracy: 4,
          timestamp: '2025-01-17 11:30:00',
          type: 'start'
        },
        {
          id: 5,
          latitude: 22.721500,
          longitude: 75.859500,
          accuracy: 7,
          timestamp: '2025-01-17 11:45:00',
          type: 'waypoint'
        },
        {
          id: 6,
          latitude: 22.722000,
          longitude: 75.860000,
          accuracy: 5,
          timestamp: '2025-01-17 12:00:00',
          type: 'waypoint'
        },
        {
          id: 7,
          latitude: 22.722500,
          longitude: 75.860500,
          accuracy: 6,
          timestamp: '2025-01-17 12:15:00',
          type: 'destination'
        }
      ]
    },
    { 
      id: 3, 
      customer: 'Startup Ventures', 
      time: '02:00 PM', 
      address: '789 Innovation Dr, City', 
      status: 'Completed',
      productType: 'Power Solutions',
      customerType: 'B2C',
      date: '2025-01-15',
      photos: [
        { id: 1, url: 'https://via.placeholder.com/150', timestamp: '2025-01-13 14:30', location: 'Customer Office' },
        { id: 2, url: 'https://via.placeholder.com/150', timestamp: '2025-01-13 14:45', location: 'Meeting Room' }
      ],
      locationTimeline: [
        { id: 1, location: 'Customer Office', timestamp: '2025-01-13 14:30', duration: '45 minutes' },
        { id: 2, location: 'Meeting Room', timestamp: '2025-01-13 15:15', duration: '30 minutes' }
      ]
    }
  ]);

  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showLeadsModal, setShowLeadsModal] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);
  const [newVisit, setNewVisit] = useState({
    customer: '',
    time: '',
    address: '',
    status: 'Scheduled'
  });
  const [leadsSearchTerm, setLeadsSearchTerm] = useState('');

  // Sample leads data (same as in AllLeads component)
  const [leads] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      address: '123 MG Road, Indore, MP',
      gstNo: '23ABCDE1234F1Z5',
      productType: 'Industrial Equipment',
      state: 'Madhya Pradesh',
      leadSource: 'Website',
      customerType: 'B2B',
      date: '2025-01-17',
      visitingStatus: 'Scheduled',
      finalStatus: 'Pending',
      transferredLeads: 0
    },
    {
      id: 2,
      name: 'Priya Sharma',
      phone: '+91 87654 32109',
      address: '456 Business Park, Bhopal, MP',
      gstNo: '23FGHIJ5678K2L6',
      productType: 'Commercial Lighting',
      state: 'Madhya Pradesh',
      leadSource: 'Referral',
      customerType: 'B2B',
      date: '2025-01-16',
      visitingStatus: 'Visited',
      finalStatus: 'Interested',
      transferredLeads: 1
    },
    {
      id: 3,
      name: 'Amit Patel',
      phone: '+91 76543 21098',
      address: '789 Industrial Area, Jabalpur, MP',
      gstNo: '23KLMNO9012P3M7',
      productType: 'Power Solutions',
      state: 'Madhya Pradesh',
      leadSource: 'Cold Call',
      customerType: 'B2B',
      date: '2025-01-15',
      visitingStatus: 'Not Visited',
      finalStatus: 'Pending',
      transferredLeads: 0
    },
    {
      id: 4,
      name: 'Sneha Gupta',
      phone: '+91 65432 10987',
      address: '321 Tech Hub, Gwalior, MP',
      gstNo: '23PQRST3456U4V8',
      productType: 'Industrial Equipment',
      state: 'Madhya Pradesh',
      leadSource: 'Social Media',
      customerType: 'B2C',
      date: '2025-01-14',
      visitingStatus: 'Scheduled',
      finalStatus: 'Interested',
      transferredLeads: 0
    },
    {
      id: 5,
      name: 'Vikram Singh',
      phone: '+91 54321 09876',
      address: '654 Corporate Plaza, Ujjain, MP',
      gstNo: '23WXYZ7890A5B9',
      productType: 'Commercial Lighting',
      state: 'Madhya Pradesh',
      leadSource: 'Website',
      customerType: 'B2B',
      date: '2025-01-13',
      visitingStatus: 'Visited',
      finalStatus: 'Not Interested',
      transferredLeads: 0
    }
  ]);

  const importLeadAsVisit = (lead) => {
    const newVisit = {
      id: Date.now(),
      customer: lead.name,
      time: '10:00 AM', // Default time
      address: lead.address,
      status: 'Scheduled',
      photos: [],
      locationTimeline: []
    };
    
    setVisits(prevVisits => [...prevVisits, newVisit]);
    setShowLeadsModal(false);
    alert(`Lead "${lead.name}" imported as visit successfully!`);
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(leadsSearchTerm.toLowerCase()) ||
    lead.phone.includes(leadsSearchTerm) ||
    lead.address.toLowerCase().includes(leadsSearchTerm.toLowerCase()) ||
    lead.productType.toLowerCase().includes(leadsSearchTerm.toLowerCase())
  );

  const filteredVisits = visits.filter(visit => 
    visit.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.customerType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePhotoUpload = (visitId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhotoData = {
          id: Date.now(),
          url: e.target.result,
          timestamp: new Date().toLocaleString(),
          location: 'Current Location'
        };
        
        setVisits(prevVisits => 
          prevVisits.map(visit => 
            visit.id === visitId 
              ? { ...visit, photos: [...visit.photos, newPhotoData] }
              : visit
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const captureLocation = (visitId) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocationData = {
            id: Date.now(),
            location: `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`,
            timestamp: new Date().toLocaleString(),
            duration: 'Current'
          };
          
          setVisits(prevVisits => 
            prevVisits.map(visit => 
              visit.id === visitId 
                ? { ...visit, locationTimeline: [...visit.locationTimeline, newLocationData] }
                : visit
            )
          );
        },
        (error) => {
          alert('Unable to capture location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const takePhoto = (visitId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => handlePhotoUpload(visitId, e);
    input.click();
  };

  const openCamera = (visitId) => {
    // Try to open camera directly
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use rear camera
        } 
      })
      .then((stream) => {
        // Create a video element to show camera preview
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        // Create a modal for camera preview
        const modal = document.createElement('div');
        modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: black;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        `;
        
        const videoContainer = document.createElement('div');
        videoContainer.style.cssText = `
          width: 90%;
          max-width: 500px;
          height: 70%;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        `;
        
        video.style.cssText = `
          width: 100%;
          height: 100%;
          object-fit: cover;
        `;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 20px;
        `;
        
        const captureButton = document.createElement('button');
        captureButton.innerHTML = '📷';
        captureButton.style.cssText = `
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 3px solid white;
          background: #3b82f6;
          color: white;
          font-size: 24px;
          cursor: pointer;
        `;
        
        const cancelButton = document.createElement('button');
        cancelButton.innerHTML = '❌';
        cancelButton.style.cssText = `
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 3px solid white;
          background: #ef4444;
          color: white;
          font-size: 20px;
          cursor: pointer;
        `;
        
        captureButton.onclick = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0);
          
          canvas.toBlob((blob) => {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
            const event = { target: { files: [file] } };
            handlePhotoUpload(visitId, event);
            
            // Automatically capture location when photo is taken
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const locationData = {
                    id: Date.now(),
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: new Date().toLocaleString(),
                    type: 'photo_capture'
                  };
                  
                  setVisits(prevVisits => 
                    prevVisits.map(visit => 
                      visit.id === visitId 
                        ? { 
                            ...visit, 
                            locationTimeline: [...visit.locationTimeline, locationData]
                          }
                        : visit
                    )
                  );
                },
                (error) => {
                  console.error('Error getting location:', error);
                },
                {
                  enableHighAccuracy: true,
                  timeout: 10000,
                  maximumAge: 0
                }
              );
            }
          }, 'image/jpeg', 0.8);
          
          stream.getTracks().forEach(track => track.stop());
          document.body.removeChild(modal);
        };
        
        cancelButton.onclick = () => {
          stream.getTracks().forEach(track => track.stop());
          document.body.removeChild(modal);
        };
        
        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(captureButton);
        videoContainer.appendChild(video);
        videoContainer.appendChild(buttonContainer);
        modal.appendChild(videoContainer);
        document.body.appendChild(modal);
      })
      .catch((error) => {
        console.error('Camera access denied:', error);
        // Fallback to file input if camera access is denied
        takePhoto(visitId);
      });
    } else {
      // Fallback for browsers that don't support getUserMedia
      takePhoto(visitId);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search Bar and Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search by customer, address, time, or status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowLeadsModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span>Import Leads</span>
          </button>
          <button 
            onClick={() => {
              // Show location timeline for all visits
              const allVisits = visits.filter(v => v.locationTimeline.length > 0);
              if (allVisits.length > 0) {
                setSelectedVisit({ customer: 'All Visits', locationTimeline: allVisits.flatMap(v => v.locationTimeline) });
                setShowLocationModal(true);
              } else {
                alert('No location data available for any visits yet.');
              }
            }}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
          >
            <Map className="w-4 h-4" />
            <span>Location Timeline</span>
          </button>
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Visit</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-purple-600" />
                    <span>#</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>CUSTOMER</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>TIME</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>DATE</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-80">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>ADDRESS</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-purple-600" />
                    <span>STATUS</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-orange-600" />
                    <span>PRODUCT TYPE</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>CUSTOMER TYPE</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-gray-600" />
                    <span>ACTIONS</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVisits.map((visit) => (
                <tr key={visit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {visit.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {visit.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {visit.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                      {visit.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      {visit.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      visit.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      visit.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {visit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 text-orange-500 mr-2" />
                      {visit.productType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-indigo-500 mr-2" />
                      {visit.customerType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      {/* Live Camera Button */}
                      <button
                        onClick={() => openCamera(visit.id)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Take Live Photo"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      
                      {/* Location Capture Button */}
                      <button
                        onClick={() => captureLocation(visit.id)}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                        title="Capture Location"
                      >
                        <Map className="w-4 h-4" />
                      </button>
                      
                      {/* View Photos Button */}
                      <button
                        onClick={() => {
                          setSelectedVisit(visit);
                          setShowPhotoModal(true);
                        }}
                        className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                        title="View Photos"
                      >
                        <Eye className="w-4 h-4" />
                        {visit.photos.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {visit.photos.length}
                          </span>
                        )}
                      </button>
                      
                      {/* View Location Timeline Button */}
                      <button
                        onClick={() => {
                          setSelectedVisit(visit);
                          setShowLocationModal(true);
                        }}
                        className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                        title="View Location Timeline"
                        disabled={visit.locationTimeline.length === 0}
                      >
                        <MapPin className="w-4 h-4" />
                        {visit.locationTimeline.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {visit.locationTimeline.length}
                          </span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Photo Modal */}
      {showPhotoModal && selectedVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Photos & Live Location - {selectedVisit.customer}
              </h3>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {selectedVisit.photos.length > 0 ? (
              <div className="space-y-6">
                {selectedVisit.photos.map((photo, index) => {
                  // Find corresponding location data for this photo
                  const photoTime = new Date(photo.timestamp);
                  const correspondingLocation = selectedVisit.locationTimeline.find(loc => {
                    const locTime = new Date(loc.timestamp);
                    const timeDiff = Math.abs(photoTime - locTime);
                    return timeDiff < 30000 && (loc.type === 'photo_capture' || loc.latitude); // Within 30 seconds
                  });
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-800">Photo {index + 1}</h4>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this photo?')) {
                              // Update the visits state
                              setVisits(prevVisits => 
                                prevVisits.map(visit => 
                                  visit.id === selectedVisit.id 
                                    ? { 
                                        ...visit, 
                                        photos: visit.photos.filter((_, i) => i !== index),
                                        locationTimeline: correspondingLocation ? 
                                          visit.locationTimeline.filter(loc => loc.id !== correspondingLocation.id) :
                                          visit.locationTimeline
                                      }
                                    : visit
                                )
                              );
                              
                              // Update the selectedVisit state to reflect changes immediately
                              setSelectedVisit(prevSelected => ({
                                ...prevSelected,
                                photos: prevSelected.photos.filter((_, i) => i !== index),
                                locationTimeline: correspondingLocation ? 
                                  prevSelected.locationTimeline.filter(loc => loc.id !== correspondingLocation.id) :
                                  prevSelected.locationTimeline
                              }));
                            }
                          }}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete Photo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Photo Section */}
                        <div className="relative">
                          <img
                            src={photo.url}
                            alt={`Visit photo ${index + 1}`}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                            {photo.timestamp}
                          </div>
                        </div>
                        
                        {/* Location Section */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <Map className="w-4 h-4 mr-2" />
                            Live Location Data
                          </h4>
                          {correspondingLocation ? (
                            <div className="space-y-2">
                              {correspondingLocation.latitude ? (
                                <>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Latitude:</span>
                                    <span className="text-sm font-mono">{correspondingLocation.latitude.toFixed(6)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Longitude:</span>
                                    <span className="text-sm font-mono">{correspondingLocation.longitude.toFixed(6)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Accuracy:</span>
                                    <span className="text-sm">{correspondingLocation.accuracy ? correspondingLocation.accuracy.toFixed(0) + 'm' : 'N/A'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Time:</span>
                                    <span className="text-sm">{correspondingLocation.timestamp}</span>
                                  </div>
                                  <div className="mt-3">
                                    <a
                                      href={`https://www.google.com/maps?q=${correspondingLocation.latitude},${correspondingLocation.longitude}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                    >
                                      <Map className="w-3 h-3 mr-1" />
                                      View on Google Maps
                                    </a>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Location:</span>
                                    <span className="text-sm">{correspondingLocation.location}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Time:</span>
                                    <span className="text-sm">{correspondingLocation.timestamp}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Duration:</span>
                                    <span className="text-sm">{correspondingLocation.duration}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <Map className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">No location data available for this photo</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Camera className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No photos uploaded for this visit yet.</p>
                <p className="text-sm">Use the camera button to upload photos.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location Timeline Modal */}
      {showLocationModal && selectedVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Location Timeline & Route Map - {selectedVisit.customer}
              </h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Map Section */}
            {selectedVisit.locationTimeline.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                  <Map className="w-4 h-4 mr-2" />
                  Route Map
                </h4>
                <div className="bg-gray-100 rounded-lg p-4 h-96 relative">
                  <div id="route-map" className="w-full h-full rounded-lg overflow-hidden">
                    {/* Google Maps Embed with Route */}
                    {selectedVisit.locationTimeline.filter(loc => loc.latitude).length > 0 ? (
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWWgUvx8dQ1Lc&origin=${selectedVisit.locationTimeline.filter(loc => loc.latitude)[0].latitude},${selectedVisit.locationTimeline.filter(loc => loc.latitude)[0].longitude}&destination=${selectedVisit.locationTimeline.filter(loc => loc.latitude)[selectedVisit.locationTimeline.filter(loc => loc.latitude).length - 1].latitude},${selectedVisit.locationTimeline.filter(loc => loc.latitude)[selectedVisit.locationTimeline.filter(loc => loc.latitude).length - 1].longitude}&waypoints=${selectedVisit.locationTimeline.filter(loc => loc.latitude).slice(1, -1).map(loc => `${loc.latitude},${loc.longitude}`).join('|')}&mode=driving`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Route Map"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <Map className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>No GPS coordinates available for route mapping</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Route Summary */}
                  {selectedVisit.locationTimeline.filter(loc => loc.latitude).length > 0 && (
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
                      <div className="text-sm">
                        <div className="font-semibold text-gray-800">Route Summary</div>
                        <div className="text-gray-600">
                          <div>📍 {selectedVisit.locationTimeline.filter(loc => loc.latitude).length} GPS Points</div>
                          <div>🕐 {selectedVisit.locationTimeline.filter(loc => loc.latitude).length > 0 ? 
                            `${Math.round((new Date(selectedVisit.locationTimeline.filter(loc => loc.latitude)[selectedVisit.locationTimeline.filter(loc => loc.latitude).length - 1].timestamp) - new Date(selectedVisit.locationTimeline.filter(loc => loc.latitude)[0].timestamp)) / (1000 * 60))} min journey` : 
                            'N/A'
                          }</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {selectedVisit.locationTimeline.length > 0 ? (
              <div className="space-y-4">
                {selectedVisit.locationTimeline.map((location, index) => (
                  <div key={location.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {location.latitude ? 
                            `Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}` : 
                            location.location
                          }
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Time:</strong> {location.timestamp}
                      </p>
                      {location.latitude ? (
                        <p className="text-sm text-gray-600">
                          <strong>Accuracy:</strong> {location.accuracy ? location.accuracy.toFixed(0) + 'm' : 'N/A'}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600">
                          <strong>Duration:</strong> {location.duration}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {location.latitude && (
                        <a
                          href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                          title="View on Google Maps"
                        >
                          <Map className="w-4 h-4" />
                        </a>
                      )}
                      <button 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this location entry?')) {
                            // Update the visits state
                            setVisits(prevVisits => 
                              prevVisits.map(visit => 
                                visit.id === selectedVisit.id 
                                  ? { 
                                      ...visit, 
                                      locationTimeline: visit.locationTimeline.filter(loc => loc.id !== location.id)
                                    }
                                  : visit
                              )
                            );
                            
                            // Update the selectedVisit state to reflect changes immediately
                            setSelectedVisit(prevSelected => ({
                              ...prevSelected,
                              locationTimeline: prevSelected.locationTimeline.filter(loc => loc.id !== location.id)
                            }));
                          }
                        }}
                        className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                        title="Delete Location Entry"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Map className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No location data captured for this visit yet.</p>
                <p className="text-sm">Use the location button to capture your current position.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schedule Visit Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Schedule New Visit</h3>
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setNewVisit({ customer: '', time: '', address: '', status: 'Scheduled' });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (newVisit.customer && newVisit.time && newVisit.address) {
                const newVisitData = {
                  id: Date.now(),
                  customer: newVisit.customer,
                  time: newVisit.time,
                  address: newVisit.address,
                  status: newVisit.status,
                  photos: [],
                  locationTimeline: []
                };
                
                setVisits(prevVisits => [...prevVisits, newVisitData]);
                setShowScheduleModal(false);
                setNewVisit({ customer: '', time: '', address: '', status: 'Scheduled' });
                alert('Visit scheduled successfully!');
              } else {
                alert('Please fill in all fields.');
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={newVisit.customer}
                    onChange={(e) => setNewVisit({...newVisit, customer: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visit Time
                  </label>
                  <input
                    type="time"
                    value={newVisit.time}
                    onChange={(e) => setNewVisit({...newVisit, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={newVisit.address}
                    onChange={(e) => setNewVisit({...newVisit, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter customer address"
                    rows="3"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newVisit.status}
                    onChange={(e) => setNewVisit({...newVisit, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleModal(false);
                    setNewVisit({ customer: '', time: '', address: '', status: 'Scheduled' });
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Schedule Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Leads Modal */}
      {showLeadsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Import Leads as Visits</h3>
              <button
                onClick={() => {
                  setShowLeadsModal(false);
                  setLeadsSearchTerm('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={leadsSearchTerm}
                  onChange={(e) => setLeadsSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Name & Phone</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>Address</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <Package className="w-4 h-4" />
                          <span>Product Type</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <Map className="w-4 h-4" />
                          <span>State</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <Globe className="w-4 h-4" />
                          <span>Lead Source</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Customer Type</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Date</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                          <span>Visiting Status</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.length > 0 ? (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                              <div className="text-sm text-gray-500">{lead.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                            <div className="truncate">{lead.address}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.productType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.state}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.leadSource}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.customerType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              lead.visitingStatus === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                              lead.visitingStatus === 'Visited' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {lead.visitingStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button 
                              onClick={() => importLeadAsVisit(lead)}
                              className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors flex items-center space-x-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>Import</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <Search className="w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg">No leads found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visits;
