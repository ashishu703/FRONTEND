import React, { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, X, CheckCircle, AlertCircle, Loader, ArrowLeft, Upload, ExternalLink } from 'lucide-react';
import { API_ENDPOINTS } from '../../../api/admin_api/api';
import apiClient from '../../../utils/apiClient';

export default function MobileCheckIn({ meeting, onComplete, onCancel }) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const photoFileRef = useRef(null);

  useEffect(() => {
    if (cameraOpen) {
      startCamera();
      getCurrentLocation();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [cameraOpen]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: { ideal: 'user' }, // Front camera for selfie
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
      setCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `checkin-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        photoFileRef.current = file;
        setCapturedPhoto(url);
        setCameraOpen(false);
        stopCamera();
      }
    }, 'image/jpeg', 0.92);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        };
        setLocation(loc);
        setLocationLoading(false);
      },
      (error) => {
        console.error('Location error:', error);
        let errorMessage = 'Failed to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please allow location permissions in your device settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please enable GPS/location services.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = `Failed to get location: ${error.message}`;
            break;
        }
        
        setLocationError(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    photoFileRef.current = null;
    setCameraOpen(true);
  };

  const handleSubmit = async () => {
    if (!capturedPhoto || !photoFileRef.current) {
      setError('Please capture a photo first');
      return;
    }

    if (!location) {
      setError('Please wait for location to be captured');
      if (!locationLoading) {
        getCurrentLocation();
      }
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append('photo', photoFileRef.current);
      formData.append('meeting_id', meeting.id);
      formData.append('latitude', location.latitude.toString());
      formData.append('longitude', location.longitude.toString());
      
      // Optional fields
      if (meeting.address) {
        formData.append('address', meeting.address);
      }
      if (meeting.city) {
        formData.append('city', meeting.city);
      }
      if (meeting.state) {
        formData.append('state', meeting.state);
      }

      const response = await apiClient.post(
        API_ENDPOINTS.MARKETING_CHECK_INS_CREATE(),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setShowSuccess(true);
        // Show success message for 2 seconds before redirecting
        setTimeout(() => {
          if (capturedPhoto) {
            URL.revokeObjectURL(capturedPhoto);
          }
          onComplete();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to submit check-in');
      }
    } catch (err) {
      console.error('Error submitting check-in:', err);
      setError(err.response?.data?.message || 'Failed to submit check-in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!meeting) {
    return null;
  }

  // Camera view
  if (cameraOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Location Status */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <button
              onClick={() => {
                setCameraOpen(false);
                onCancel();
              }}
              className="p-2 bg-black/50 rounded-full text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-full text-white text-xs">
              <MapPin className="h-3 w-3" />
              {locationLoading ? (
                <span>Getting location...</span>
              ) : location ? (
                <span>Location captured</span>
              ) : (
                <span>Waiting for location</span>
              )}
            </div>
          </div>

          {/* Capture button */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <button
              onClick={capturePhoto}
              className="p-4 bg-white rounded-full border-4 border-gray-300 hover:border-gray-400 transition-colors"
            >
              <div className="w-16 h-16 bg-white rounded-full border-2 border-gray-400"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Preview and submit view
  if (capturedPhoto) {
    return (
      <div className="p-4 pb-24">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={retakePhoto}
            className="flex items-center gap-2 text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Retake</span>
          </button>
          <h2 className="text-lg font-bold text-gray-900">Preview Check-In</h2>
          <div className="w-16"></div>
        </div>

        {/* Photo Preview */}
        <div className="bg-white rounded-lg overflow-hidden mb-4 shadow-sm">
          <img
            src={capturedPhoto}
            alt="Check-in photo"
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Meeting Info */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Meeting Details</h3>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500">Customer Name</p>
              <p className="font-medium text-gray-900">{meeting.customer_name}</p>
            </div>
            {meeting.address && (
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm text-gray-900">{meeting.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Location on Map */}
        {location && (
          <div className="bg-white rounded-lg overflow-hidden mb-4 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-900">Location on Map</span>
                </div>
                <button
                  onClick={() => window.open(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`, '_blank')}
                  className="flex items-center gap-1 text-xs text-blue-600"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Open</span>
                </button>
              </div>
            </div>
            <div className="h-48 bg-gray-100 relative">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6d-s6U4iYWEzq8E&q=${location.latitude},${location.longitude}&zoom=15`}
              />
            </div>
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Lat:</span>
                  <span className="font-mono">{location.latitude.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lng:</span>
                  <span className="font-mono">{location.longitude.toFixed(6)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location Status */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-900">Location Status</span>
            </div>
            {!location && (
              <button
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="text-xs text-blue-600 font-medium"
              >
                Retry
              </button>
            )}
          </div>
          
          {locationLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader className="h-4 w-4 animate-spin" />
              <span>Getting your location...</span>
            </div>
          ) : locationError ? (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{locationError}</span>
            </div>
          ) : location ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Location captured successfully</span>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Location not captured</div>
          )}
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">Check-in submitted successfully!</p>
              <p className="text-xs text-green-700 mt-1">Meeting status updated to "Completed"</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !showSuccess && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !location || !capturedPhoto || showSuccess}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : showSuccess ? (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>Submitted!</span>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              <span>Submit Check-In</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // Initial view - Start check-in
  return (
    <div className="p-4 pb-24">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Check In</h1>
          <p className="text-sm text-gray-500">Capture your location and photo</p>
        </div>
      </div>

      {/* Meeting Info Card */}
      <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-2">{meeting.customer_name}</h3>
        <div className="text-sm text-gray-600 space-y-1">
          {meeting.address && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{meeting.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Take a selfie at the meeting location</li>
          <li>Your location will be automatically captured</li>
          <li>Review and submit your check-in</li>
        </ul>
      </div>

      {/* Mobile Camera Input with capture attribute */}
      <div className="space-y-3">
        <input
          type="file"
          accept="image/*"
          capture="user"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && file.type.startsWith('image/')) {
              const url = URL.createObjectURL(file);
              photoFileRef.current = file;
              setCapturedPhoto(url);
              getCurrentLocation();
            } else if (file) {
              setError('Please select a valid image file');
            }
            e.target.value = ''; // Reset input
          }}
          className="hidden"
          id="mobile-camera-input"
        />
        
        <button
          onClick={() => {
            // Try to use native mobile camera first
            document.getElementById('mobile-camera-input')?.click();
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          <Camera className="h-5 w-5" />
          <span>Take Photo</span>
        </button>
        
        <button
          onClick={() => setCameraOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
        >
          <Camera className="h-5 w-5" />
          <span>Use Camera View</span>
        </button>
      </div>
    </div>
  );
}

