import React, { useState, useEffect } from 'react';
import { 
  User, 
  Clock, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Building, 
  CalendarDays,
  LogIn,
  LogOut,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Activity,
  Target,
  Award,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Map,
  Save,
  X,
  IndianRupee,
  Camera
} from 'lucide-react';
import MarketingSalespersonExpenses from './MarketingSalespersonExpenses';
import LocationMap from '../../components/LocationMap';

const MarketingSalespersonProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month');
  const [locationTracking, setLocationTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [watchId, setWatchId] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const capturePhoto = async () => {
    setIsCapturingPhoto(true);
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      return await new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.autoplay = true;
        video.playsInline = true;
        video.srcObject = stream;
        video.onloadedmetadata = async () => {
          try {
            // Ensure dimensions
            const width = 320;
            const height = Math.floor((video.videoHeight / video.videoWidth) * width) || 240;
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            resolve(dataUrl);
          } catch (err) {
            reject(err);
          } finally {
            // Stop tracks
            stream.getTracks().forEach(t => t.stop());
            setIsCapturingPhoto(false);
          }
        };
        video.onerror = (e) => {
          stream.getTracks().forEach(t => t.stop());
          setIsCapturingPhoto(false);
          reject(new Error('Unable to access camera'));
        };
      });
    } catch (err) {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
      setIsCapturingPhoto(false);
      // Fallback: return null if camera not available/permission denied
      return null;
    }
  };

  // Sample salesperson data - in real app, this would come from API
  const [profileData, setProfileData] = useState({
    id: 1,
    name: "John Doe",
    email: "john.doe@anocab.com",
    phone: "+91 98765 43210",
    employeeId: "EMP001",
    department: "Marketing",
    designation: "Senior Sales Executive",
    joiningDate: "2023-01-15",
    address: "123 Main Street, Mumbai, Maharashtra 400001",
    emergencyContact: "+91 98765 43211",
    manager: "Sarah Wilson",
    target: {
      monthly: 50,
      quarterly: 150,
      yearly: 600
    },
    achievements: [
      "Top Performer - Q1 2024",
      "Best Customer Service - March 2024",
      "100% Attendance - Q2 2024"
    ]
  });

  // Geolocation functions
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          };
          resolve(location);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        };
        
        setCurrentLocation(location);
        setLocationHistory(prev => [...prev, location]);
      },
      (error) => {
        console.error('Location tracking error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000 // Update every 30 seconds
      }
    );
    
    setWatchId(id);
    setLocationTracking(true);
  };

  const stopLocationTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setLocationTracking(false);
  };

  // Initialize attendance data
  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Generate sample attendance data for multiple months (current + 2 previous months)
    const sampleData = [];
    
    for (let monthOffset = -2; monthOffset <= 0; monthOffset++) {
      const targetMonth = currentMonth + monthOffset;
      const targetYear = currentYear + Math.floor(targetMonth / 12);
      const actualMonth = ((targetMonth % 12) + 12) % 12;
      
      const daysInMonth = new Date(targetYear, actualMonth + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(targetYear, actualMonth, day);
        const dayOfWeek = date.getDay();
        const today = new Date();
        
        // Skip weekends and future dates for sample data
        if (dayOfWeek !== 0 && dayOfWeek !== 6 && date <= today) {
          const isPresent = Math.random() > 0.15; // 85% attendance rate
          const punchInTime = isPresent ? `09:${String(Math.floor(Math.random() * 30)).padStart(2, '0')}` : null;
          const punchOutTime = isPresent ? `18:${String(Math.floor(Math.random() * 30)).padStart(2, '0')}` : null;
          
          // Calculate actual working hours based on punch in/out times
          let workingHours = 0;
          if (isPresent && punchInTime && punchOutTime) {
            const punchInDateTime = new Date(`${targetYear}-${String(actualMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${punchInTime}:00`);
            const punchOutDateTime = new Date(`${targetYear}-${String(actualMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${punchOutTime}:00`);
            workingHours = Math.round((punchOutDateTime - punchInDateTime) / (1000 * 60 * 60) * 10) / 10;
          }
          
          // Generate random locations around Mumbai
          const baseLat = 19.0760;
          const baseLng = 72.8777;
          const punchInLocation = isPresent ? {
            latitude: baseLat + (Math.random() - 0.5) * 0.1,
            longitude: baseLng + (Math.random() - 0.5) * 0.1,
            accuracy: Math.random() * 50 + 10,
            timestamp: new Date(targetYear, actualMonth, day, 9, Math.floor(Math.random() * 30)).toISOString()
          } : null;
          
          const punchOutLocation = isPresent ? {
            latitude: baseLat + (Math.random() - 0.5) * 0.1,
            longitude: baseLng + (Math.random() - 0.5) * 0.1,
            accuracy: Math.random() * 50 + 10,
            timestamp: new Date(targetYear, actualMonth, day, 18, Math.floor(Math.random() * 30)).toISOString()
          } : null;
          
          // Generate location history for the day
          const locationHistory = [];
          if (isPresent && punchInLocation && punchOutLocation) {
            const startTime = new Date(punchInLocation.timestamp);
            const endTime = new Date(punchOutLocation.timestamp);
            const duration = endTime - startTime;
            const interval = duration / (Math.floor(Math.random() * 5) + 3); // 3-7 location points
            
            for (let i = 0; i < Math.floor(Math.random() * 5) + 3; i++) {
              const timeOffset = i * interval;
              const locationTime = new Date(startTime.getTime() + timeOffset);
              
              locationHistory.push({
                latitude: baseLat + (Math.random() - 0.5) * 0.05,
                longitude: baseLng + (Math.random() - 0.5) * 0.05,
                accuracy: Math.random() * 30 + 5,
                timestamp: locationTime.toISOString()
              });
            }
          }
          
          sampleData.push({
            date: date.toISOString().split('T')[0],
            punchIn: punchInTime,
            punchOut: punchOutTime,
            status: isPresent ? 'present' : 'absent',
            workingHours: workingHours,
            notes: isPresent ? '' : (Math.random() > 0.5 ? 'Sick Leave' : 'Personal Leave'),
            punchInLocation: punchInLocation,
            punchOutLocation: punchOutLocation,
            locationHistory: locationHistory
          });
        }
      }
    }
    
    setAttendanceData(sampleData);
    
    // Check if user has punched in today
    const todayStr = today.toISOString().split('T')[0];
    const todayAttendance = sampleData.find(att => att.date === todayStr);
    setCurrentAttendance(todayAttendance);

    // Cleanup location tracking on unmount
    return () => {
      stopLocationTracking();
    };
  }, []);

  const handlePunchIn = async () => {
    setIsGettingLocation(true);
    
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser.');
      }

      // Capture live photo (non-blocking if denied)
      const punchInPhoto = await capturePhoto();

      // Get current location
      const location = await getCurrentLocation();
      
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
      const dateStr = now.toISOString().split('T')[0];
      
      const newAttendance = {
        date: dateStr,
        punchIn: timeStr,
        punchOut: null,
        status: 'present',
        workingHours: 0,
        notes: '',
        punchInLocation: location,
        punchOutLocation: null,
        locationHistory: [location],
        punchInPhoto: punchInPhoto || null,
        punchOutPhoto: null
      };
      
      setCurrentAttendance(newAttendance);
      setCurrentLocation(location);
      setLocationHistory([location]);
      
      // Update attendance data
      const updatedData = attendanceData.filter(att => att.date !== dateStr);
      updatedData.push(newAttendance);
      setAttendanceData(updatedData);
      
      // Start location tracking
      startLocationTracking();
      
      // Show success message with location
      alert(`✅ Punch In Successful!\n\nTime: ${timeStr}\nLocation: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}\nAccuracy: ±${Math.round(location.accuracy)}m${(newAttendance.punchInPhoto ? '\nPhoto captured 📸' : '')}\n\nLocation tracking started!`);
      
    } catch (error) {
      console.error('Punch In Error:', error);
      
      let errorMessage = 'Unable to punch in. ';
      
      if (error.code === 1) {
        errorMessage += 'Location access denied. Please allow location access and try again.';
      } else if (error.code === 2) {
        errorMessage += 'Location unavailable. Please check your internet connection and try again.';
      } else if (error.code === 3) {
        errorMessage += 'Location request timed out. Please try again.';
      } else if (error.message.includes('not supported')) {
        errorMessage += 'Your browser does not support location services.';
      } else {
        errorMessage += `Error: ${error.message}`;
      }
      
      alert(`❌ Punch In Failed\n\n${errorMessage}\n\nPlease ensure:\n• You're using HTTPS or localhost\n• Location services are enabled\n• Browser location permission is granted`);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handlePunchOut = async () => {
    if (!currentAttendance || !currentAttendance.punchIn) {
      alert('❌ Please punch in first!');
      return;
    }
    
    setIsGettingLocation(true);
    
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser.');
      }

      // Capture live photo (non-blocking if denied)
      const punchOutPhoto = await capturePhoto();

      // Get current location
      const location = await getCurrentLocation();
      
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
      const dateStr = now.toISOString().split('T')[0];
      
      // Calculate working hours
      const punchInTime = new Date(`${dateStr}T${currentAttendance.punchIn}:00`);
      const punchOutTime = new Date(`${dateStr}T${timeStr}:00`);
      const workingHours = Math.round((punchOutTime - punchInTime) / (1000 * 60 * 60) * 10) / 10;
      
      const updatedAttendance = {
        ...currentAttendance,
        punchOut: timeStr,
        workingHours: workingHours,
        punchOutLocation: location,
        locationHistory: [...locationHistory, location],
        punchOutPhoto: punchOutPhoto || currentAttendance.punchOutPhoto || null
      };
      
      setCurrentAttendance(updatedAttendance);
      
      // Update attendance data
      const updatedData = attendanceData.map(att => 
        att.date === dateStr ? updatedAttendance : att
      );
      setAttendanceData(updatedData);
      
      // Stop location tracking
      stopLocationTracking();
      
      // Show success message with location
      alert(`✅ Punch Out Successful!\n\nTime: ${timeStr}\nLocation: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}\nAccuracy: ±${Math.round(location.accuracy)}m\nWorking Hours: ${workingHours} hours${(updatedAttendance.punchOutPhoto ? '\nPhoto captured 📸' : '')}\n\nLocation tracking stopped!`);
      
    } catch (error) {
      console.error('Punch Out Error:', error);
      
      let errorMessage = 'Unable to punch out. ';
      
      if (error.code === 1) {
        errorMessage += 'Location access denied. Please allow location access and try again.';
      } else if (error.code === 2) {
        errorMessage += 'Location unavailable. Please check your internet connection and try again.';
      } else if (error.code === 3) {
        errorMessage += 'Location request timed out. Please try again.';
      } else if (error.message.includes('not supported')) {
        errorMessage += 'Your browser does not support location services.';
      } else {
        errorMessage += `Error: ${error.message}`;
      }
      
      alert(`❌ Punch Out Failed\n\n${errorMessage}\n\nPlease ensure:\n• You're using HTTPS or localhost\n• Location services are enabled\n• Browser location permission is granted`);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const getAttendanceStats = () => {
    const totalDays = attendanceData.length;
    const presentDays = attendanceData.filter(att => att.status === 'present').length;
    const absentDays = attendanceData.filter(att => att.status === 'absent').length;
    const totalWorkingHours = attendanceData.reduce((sum, att) => sum + att.workingHours, 0);
    const averageWorkingHours = totalDays > 0 ? (totalWorkingHours / presentDays).toFixed(1) : 0;
    
    return {
      totalDays,
      presentDays,
      absentDays,
      totalWorkingHours,
      averageWorkingHours,
      attendancePercentage: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0
    };
  };

  const stats = getAttendanceStats();

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{profileData.name}</h2>
              <p className="text-gray-600">{profileData.designation}</p>
              <p className="text-sm text-gray-500">{profileData.department} • Employee ID: {profileData.employeeId}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {profileData.email}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {profileData.phone}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              {isEditing ? (
                <textarea
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                  {profileData.address}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.emergencyContact}
                  onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {profileData.emergencyContact}
                </p>
              )}
            </div>
          </div>
        </div>
        {isEditing && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Save profile data - in real app, make API call
                setIsEditing(false);
                alert('Profile updated successfully!');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Work Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Building className="w-5 h-5 mr-2" />
          Work Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <p className="text-gray-900">{profileData.department}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <p className="text-gray-900">{profileData.designation}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
              <p className="text-gray-900">{profileData.manager}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
              <p className="text-gray-900">{new Date(profileData.joiningDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <p className="text-gray-900 font-mono">{profileData.employeeId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Targets & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Targets */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Targets
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Monthly Target</span>
              <span className="text-lg font-bold text-blue-600">{profileData.target.monthly}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Quarterly Target</span>
              <span className="text-lg font-bold text-green-600">{profileData.target.quarterly}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Yearly Target</span>
              <span className="text-lg font-bold text-purple-600">{profileData.target.yearly}</span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Achievements
          </h3>
          <div className="space-y-3">
            {profileData.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <Award className="w-4 h-4 text-yellow-600 mr-3" />
                <span className="text-sm text-gray-700">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttendanceTab = () => (
    <div className="space-y-6">
      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Days</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDays}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present Days</p>
              <p className="text-2xl font-bold text-green-600">{stats.presentDays}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absent Days</p>
              <p className="text-2xl font-bold text-red-600">{stats.absentDays}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance %</p>
              <p className="text-2xl font-bold text-purple-600">{stats.attendancePercentage}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Punch In/Out */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Today's Attendance
          </h3>
          {(currentAttendance?.punchIn || locationHistory.length > 0 || currentAttendance?.locationHistory?.length > 0) && (
            <button
              onClick={() => setShowMap(!showMap)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                showMap 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Map className="w-4 h-4" />
              <span className="text-sm font-medium">
                {showMap ? 'Hide Map' : 'Show Map'}
              </span>
            </button>
          )}
        </div>
        
        {/* Location Status */}
        {locationTracking && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium text-green-700">Location tracking active</span>
            </div>
            {currentLocation && (
              <p className="text-xs text-green-600 mt-1">
                Current: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
              </p>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-center space-x-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Punch In</p>
            <p className="text-lg font-bold text-gray-900">
              {currentAttendance?.punchIn || '--:--'}
            </p>
            {currentAttendance?.punchInPhoto && (
              <div className="mt-2">
                <img src={currentAttendance.punchInPhoto} alt="Punch In" className="w-20 h-20 object-cover rounded-md border" />
              </div>
            )}
            {currentAttendance?.punchInLocation && (
              <p className="text-xs text-gray-500 mt-1">
                📍 {currentAttendance.punchInLocation.latitude.toFixed(4)}, {currentAttendance.punchInLocation.longitude.toFixed(4)}
              </p>
            )}
            <div className="space-y-2">
              <button
                onClick={handlePunchIn}
                disabled={currentAttendance?.punchIn || isGettingLocation}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isGettingLocation ? 'Getting Location...' : 'Punch In'}
              </button>
              <button
                onClick={() => {
                  // Fallback punch in without location
                  const now = new Date();
                  const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
                  const dateStr = now.toISOString().split('T')[0];
                  
                  const newAttendance = {
                    date: dateStr,
                    punchIn: timeStr,
                    punchOut: null,
                    status: 'present',
                    workingHours: 0,
                    notes: 'Punched in without location',
                    punchInLocation: null,
                    punchOutLocation: null,
                    locationHistory: []
                  };
                  
                  setCurrentAttendance(newAttendance);
                  
                  const updatedData = attendanceData.filter(att => att.date !== dateStr);
                  updatedData.push(newAttendance);
                  setAttendanceData(updatedData);
                  
                  alert(`✅ Punch In Successful!\n\nTime: ${timeStr}\nNote: Location not available`);
                }}
                disabled={currentAttendance?.punchIn || isGettingLocation}
                className="w-full px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Punch In (No Location)
              </button>
            </div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Punch Out</p>
            <p className="text-lg font-bold text-gray-900">
              {currentAttendance?.punchOut || '--:--'}
            </p>
            {currentAttendance?.punchOutPhoto && (
              <div className="mt-2">
                <img src={currentAttendance.punchOutPhoto} alt="Punch Out" className="w-20 h-20 object-cover rounded-md border" />
              </div>
            )}
            {currentAttendance?.punchOutLocation && (
              <p className="text-xs text-gray-500 mt-1">
                📍 {currentAttendance.punchOutLocation.latitude.toFixed(4)}, {currentAttendance.punchOutLocation.longitude.toFixed(4)}
              </p>
            )}
            <div className="space-y-2">
              <button
                onClick={handlePunchOut}
                disabled={!currentAttendance?.punchIn || currentAttendance?.punchOut || isGettingLocation}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isGettingLocation ? 'Getting Location...' : 'Punch Out'}
              </button>
              <button
                onClick={() => {
                  if (!currentAttendance || !currentAttendance.punchIn) {
                    alert('❌ Please punch in first!');
                    return;
                  }
                  
                  // Fallback punch out without location
                  const now = new Date();
                  const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
                  const dateStr = now.toISOString().split('T')[0];
                  
                  // Calculate working hours
                  const punchInTime = new Date(`${dateStr}T${currentAttendance.punchIn}:00`);
                  const punchOutTime = new Date(`${dateStr}T${timeStr}:00`);
                  const workingHours = Math.round((punchOutTime - punchInTime) / (1000 * 60 * 60) * 10) / 10;
                  
                  const updatedAttendance = {
                    ...currentAttendance,
                    punchOut: timeStr,
                    workingHours: workingHours,
                    punchOutLocation: null,
                    notes: currentAttendance.notes ? `${currentAttendance.notes}; Punched out without location` : 'Punched out without location'
                  };
                  
                  setCurrentAttendance(updatedAttendance);
                  
                  const updatedData = attendanceData.map(att => 
                    att.date === dateStr ? updatedAttendance : att
                  );
                  setAttendanceData(updatedData);
                  
                  alert(`✅ Punch Out Successful!\n\nTime: ${timeStr}\nWorking Hours: ${workingHours} hours\nNote: Location not available`);
                }}
                disabled={!currentAttendance?.punchIn || currentAttendance?.punchOut || isGettingLocation}
                className="w-full px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Punch Out (No Location)
              </button>
            </div>
          </div>
        </div>
        {currentAttendance?.workingHours > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Working Hours Today: <span className="font-bold text-green-600">{currentAttendance.workingHours} hours</span></p>
          </div>
        )}
      </div>

      {/* Working Hours Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Working Hours Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.totalWorkingHours.toFixed(1)}</p>
            <p className="text-sm text-gray-600">Total Working Hours</p>
            <p className="text-xs text-gray-500">{stats.presentDays} days worked</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{stats.averageWorkingHours}</p>
            <p className="text-sm text-gray-600">Average Hours/Day</p>
            <p className="text-xs text-gray-500">Per working day</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{stats.totalDays}</p>
            <p className="text-sm text-gray-600">Total Days</p>
            <p className="text-xs text-gray-500">In attendance data</p>
          </div>
        </div>
      </div>

      {/* Journey Map */}
      {currentAttendance && currentAttendance.locationHistory && currentAttendance.locationHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Today's Journey Map
          </h3>
          <div className="space-y-3">
            <div className="text-sm text-gray-600 mb-3">
              Total locations tracked: {currentAttendance.locationHistory.length}
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {currentAttendance.locationHistory.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(location.timestamp).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-gray-600">
                        📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Accuracy: ±{Math.round(location.accuracy)}m
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => {
                        const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
                        window.open(url, '_blank');
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      View on Map
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {currentAttendance.locationHistory.length > 1 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Journey Summary:</strong> Started at {new Date(currentAttendance.locationHistory[0].timestamp).toLocaleTimeString()} 
                  and tracked {currentAttendance.locationHistory.length} locations throughout the day.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Map */}
      {showMap && (
        <LocationMap
          locationHistory={currentAttendance?.locationHistory || locationHistory}
          punchInLocation={currentAttendance?.punchInLocation}
          punchOutLocation={currentAttendance?.punchOutLocation}
          isVisible={showMap}
        />
      )}
    </div>
  );

  const renderCalendarTab = () => {
    const navigateMonth = (direction) => {
      const newDate = new Date(selectedDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      setSelectedDate(newDate);
    };

    const getMonthYearString = () => {
      return selectedDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
    };

    const generateCalendarDays = () => {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());
      
      const days = [];
      const currentDate = new Date(startDate);
      
      // Generate 42 days (6 weeks)
      for (let i = 0; i < 42; i++) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return days;
    };

    const getAttendanceForDate = (date) => {
      const dateStr = date.toISOString().split('T')[0];
      return attendanceData.find(att => att.date === dateStr);
    };

    const calendarDays = generateCalendarDays();

    return (
      <div className="space-y-6">
        {/* Calendar Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <CalendarDays className="w-5 h-5 mr-2" />
              Attendance Calendar
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCalendarView('month')}
                className={`px-3 py-1 rounded-md text-sm ${
                  calendarView === 'month' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setCalendarView('week')}
                className={`px-3 py-1 rounded-md text-sm ${
                  calendarView === 'week' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Week
              </button>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Previous</span>
            </button>
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">{getMonthYearString()}</h2>
              <p className="text-sm text-gray-600">Click on any day to view details</p>
            </div>
            
            <button
              onClick={() => navigateMonth('next')}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium">Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, index) => {
              const attendance = getAttendanceForDate(date);
              const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
              
              // More precise date comparison for today - handle timezone issues
              const today = new Date();
              const todayStr = today.toISOString().split('T')[0];
              const dateStr = date.toISOString().split('T')[0];
              const isToday = dateStr === todayStr;
              
              // Additional check: compare year, month, and day separately
              const todayYear = today.getFullYear();
              const todayMonth = today.getMonth();
              const todayDay = today.getDate();
              const dateYear = date.getFullYear();
              const dateMonth = date.getMonth();
              const dateDay = date.getDate();
              const isTodayStrict = (dateYear === todayYear && dateMonth === todayMonth && dateDay === todayDay);
              
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              const isFuture = date > today;
              const isTodayAndNotPunchedOut = isTodayStrict && (!attendance || !attendance.punchOut);
              
              return (
                <div
                  key={index}
                  className={`h-20 border rounded-lg p-2 text-sm transition-colors ${
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${isTodayAndNotPunchedOut ? 'ring-2 ring-blue-500 bg-blue-50' : ''} ${
                    isWeekend ? 'bg-gray-100' : ''
                  } ${isFuture ? 'bg-gray-50 opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
                  onClick={() => {
                    if (isFuture) {
                      return; // Block access to future dates
                    }
                    
                    if (attendance) {
                      // Show detailed attendance info
                      const details = `
                        Date: ${date.toLocaleDateString()}
                        Status: ${attendance.status}
                        Punch In: ${attendance.punchIn || 'N/A'}
                        Punch Out: ${attendance.punchOut || 'N/A'}
                        Working Hours: ${attendance.workingHours || 0}h
                        ${attendance.punchInLocation ? `Punch In Location: ${attendance.punchInLocation.latitude.toFixed(4)}, ${attendance.punchInLocation.longitude.toFixed(4)}` : ''}
                        ${attendance.punchOutLocation ? `Punch Out Location: ${attendance.punchOutLocation.latitude.toFixed(4)}, ${attendance.punchOutLocation.longitude.toFixed(4)}` : ''}
                        ${attendance.notes ? `Notes: ${attendance.notes}` : ''}
                      `;
                      alert(details);
                    } else {
                      alert(`No attendance data for ${date.toLocaleDateString()}`);
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-medium ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${isFuture ? 'text-gray-400' : ''}`}>
                      {date.getDate()}
                    </span>
                    {attendance && (
                      <div className="flex flex-col items-end">
                        {attendance.status === 'present' ? (
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-red-600" />
                        )}
                        {attendance.punchIn && (
                          <span className="text-xs text-gray-600">{attendance.punchIn}</span>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Photo thumbnails */}
                  {attendance && (attendance.punchInPhoto || attendance.punchOutPhoto) && (
                    <div className="mt-1 flex space-x-1">
                      {attendance.punchInPhoto && (
                        <img src={attendance.punchInPhoto} alt="In" title="Punch In" className="w-6 h-6 object-cover rounded-sm border" />
                      )}
                      {attendance.punchOutPhoto && (
                        <img src={attendance.punchOutPhoto} alt="Out" title="Punch Out" className="w-6 h-6 object-cover rounded-sm border" />
                      )}
                    </div>
                  )}
                  {attendance && attendance.workingHours > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {attendance.workingHours}h
                    </div>
                  )}
                  {attendance && attendance.locationHistory && attendance.locationHistory.length > 0 && (
                    <div className="text-xs text-blue-600 mt-1">
                      📍 {attendance.locationHistory.length} locations
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-4 mt-4 flex-wrap">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-gray-600">Absent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Today (Active)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span className="text-sm text-gray-600">Weekend</span>
            </div>
          </div>
        </div>

        {/* Month Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            {getMonthYearString()} Summary
          </h3>
          {(() => {
            const monthData = attendanceData.filter(att => {
              const attDate = new Date(att.date);
              return attDate.getMonth() === selectedDate.getMonth() && 
                     attDate.getFullYear() === selectedDate.getFullYear();
            });
            
            const presentDays = monthData.filter(att => att.status === 'present').length;
            const absentDays = monthData.filter(att => att.status === 'absent').length;
            const totalWorkingHours = monthData.reduce((sum, att) => sum + (att.workingHours || 0), 0);
            const averageWorkingHours = presentDays > 0 ? (totalWorkingHours / presentDays).toFixed(1) : 0;
            const attendancePercentage = monthData.length > 0 ? Math.round((presentDays / monthData.length) * 100) : 0;
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{presentDays}</p>
                  <p className="text-sm text-gray-600">Present Days</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{absentDays}</p>
                  <p className="text-sm text-gray-600">Absent Days</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{totalWorkingHours.toFixed(1)}h</p>
                  <p className="text-sm text-gray-600">Total Hours</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{attendancePercentage}%</p>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                </div>
              </div>
            );
          })()}
        </div>

      {/* Recent Attendance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h3>
        <div className="space-y-3">
          {attendanceData.slice(-7).reverse().map((attendance, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {attendance.status === 'present' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(attendance.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {attendance.punchIn && attendance.punchOut 
                      ? `${attendance.punchIn} - ${attendance.punchOut}` 
                      : attendance.punchIn 
                        ? `Punched in at ${attendance.punchIn}` 
                        : 'Absent'
                    }
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {attendance.workingHours > 0 ? `${attendance.workingHours}h` : '0h'}
                </p>
                <p className="text-sm text-gray-600 capitalize">{attendance.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 pb-2 font-medium text-sm transition-colors ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex items-center space-x-2 pb-2 font-medium text-sm transition-colors ${
                activeTab === 'attendance'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Attendance</span>
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center space-x-2 pb-2 font-medium text-sm transition-colors ${
                activeTab === 'calendar'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex items-center space-x-2 pb-2 font-medium text-sm transition-colors ${
                activeTab === 'expenses'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IndianRupee className="w-4 h-4" />
              <span>Expenses</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'attendance' && renderAttendanceTab()}
        {activeTab === 'calendar' && renderCalendarTab()}
        {activeTab === 'expenses' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <MarketingSalespersonExpenses />
          </div>
        )}
      </div>
    </div>
  );
  };

export default MarketingSalespersonProfile;
