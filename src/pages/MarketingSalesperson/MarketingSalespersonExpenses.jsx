import React, { useEffect, useRef, useState } from 'react';
import { IndianRupee, Plus, Calendar, FileText, Trash2, Image as ImageIcon, MapPin, Loader2, Camera, X } from 'lucide-react';

const MarketingSalespersonExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ date: '', category: '', amount: '', notes: '', location: '' });
  const [billFile, setBillFile] = useState(null);
  const [billPreviewUrl, setBillPreviewUrl] = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const capturedBlobRef = useRef(null);
  const [cameraError, setCameraError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setBillFile(null);
      if (billPreviewUrl) { try { URL.revokeObjectURL(billPreviewUrl); } catch {} }
      setBillPreviewUrl('');
      return;
    }
    setBillFile(file);
    if (billPreviewUrl) { try { URL.revokeObjectURL(billPreviewUrl); } catch {} }
    const url = URL.createObjectURL(file);
    setBillPreviewUrl(url);
  };

  const isSecure = () => {
    try {
      const host = window.location.hostname;
      return window.isSecureContext || window.location.protocol === 'https:' || host === 'localhost' || host === '127.0.0.1';
    } catch {
      return false;
    }
  };

  const openCamera = async () => {
    setCameraError('');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API not supported on this device/browser.');
      return;
    }
    if (!isSecure()) {
      setCameraError('Camera requires HTTPS or localhost. Please access over HTTPS.');
      return;
    }
    try {
      const constraints = { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 }, aspectRatio: { ideal: 16/9 } }, audio: false };
      let stream = await navigator.mediaDevices.getUserMedia(constraints);
      // Fallback to user-facing camera if environment fails to deliver video
      if (!stream.getVideoTracks || stream.getVideoTracks().length === 0) {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      }
      streamRef.current = stream;
      setCameraOpen(true);
    } catch (e) {
      console.error('Camera open failed', e);
      setCameraError(e?.message || 'Unable to open camera.');
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      const video = videoRef.current;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('autoplay', 'true');
      video.muted = true; // allow autoplay on iOS
      video.srcObject = streamRef.current;
      const tryPlay = () => video.play().catch((err) => { console.warn('Video play blocked', err); });
      if (video.readyState >= 2) {
        tryPlay();
      } else {
        const onLoaded = () => { tryPlay(); video.removeEventListener('loadedmetadata', onLoaded); };
        video.addEventListener('loadedmetadata', onLoaded);
      }
      // Safety: retry attaching after a short delay if initial attach shows black
      const retry = setTimeout(() => {
        if (video.srcObject !== streamRef.current) {
          video.srcObject = streamRef.current;
          tryPlay();
        }
      }, 300);
      return () => { clearTimeout(retry); };
    }
    return () => {
      if (!cameraOpen) stopStream();
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [cameraOpen]);

  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      if (capturedBlobRef.current) URL.revokeObjectURL(capturedBlobRef.current.url);
      const url = URL.createObjectURL(blob);
      capturedBlobRef.current = { blob, url };
      setBillPreviewUrl(url);
    }, 'image/jpeg', 0.92);
  };

  const confirmCapture = () => {
    if (capturedBlobRef.current) {
      const file = new File([capturedBlobRef.current.blob], `bill-${Date.now()}.jpg`, { type: 'image/jpeg' });
      setBillFile(file);
    }
    setCameraOpen(false);
    stopStream();
  };

  const cancelCapture = () => {
    // Keep existing preview if any, just close camera
    setCameraOpen(false);
    stopStream();
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
        setForm((prev) => ({ ...prev, location: coords }));
        setLocLoading(false);
      },
      () => {
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const addExpense = (e) => {
    e.preventDefault();
    if (!form.date || !form.category || !form.amount) return;
    const newExpense = { 
      id: Date.now(), 
      ...form,
      billName: billFile ? billFile.name : '',
      billPreviewUrl: billPreviewUrl || ''
    };
    setExpenses((prev) => [newExpense, ...prev]);
    setForm({ date: '', category: '', amount: '', notes: '', location: '' });
    setBillFile(null);
    setBillPreviewUrl('');
  };

  const clearBillPhoto = () => {
    try {
      if (billPreviewUrl) URL.revokeObjectURL(billPreviewUrl);
      if (capturedBlobRef.current?.url) URL.revokeObjectURL(capturedBlobRef.current.url);
    } catch {}
    capturedBlobRef.current = null;
    setBillFile(null);
    setBillPreviewUrl('');
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => {
      const exp = prev.find((e) => e.id === id);
      if (exp && exp.billPreviewUrl) {
        try { URL.revokeObjectURL(exp.billPreviewUrl); } catch {}
      }
      return prev.filter((e) => e.id !== id);
    });
  };

  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const isValid = form.date && form.category && Number(form.amount) > 0;
  const allowFutureDates = true; // allow selecting future dates in the calendar
  const maxDate = allowFutureDates ? undefined : new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="bg-white border rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Expenses</h2>
              <p className="text-xs text-gray-500">Add receipts and track spend</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold text-gray-900">₹{total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <form onSubmit={addExpense} className="bg-white rounded-xl border shadow-sm p-4 md:p-5 mb-6 grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="col-span-1 md:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            <input name="date" type="date" value={form.date} onChange={handleChange} max={maxDate} className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="" />
          </div>
        </div>
        <div className="col-span-1 md:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
            <option value="">Select</option>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
            <option value="Lodging">Lodging</option>
            <option value="Promotions">Promotions</option>
            <option value="Misc">Misc</option>
          </select>
        </div>
        <div className="col-span-1 md:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">Amount (₹)</label>
          <input name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="0.00" />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
          <div className="relative">
            <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input name="notes" type="text" value={form.notes} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Optional" />
          </div>
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Bill Photo</label>
          <div className="flex items-center space-x-3">
            <label className="inline-flex items-center px-3 py-2 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 shadow-sm">
              <ImageIcon className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm">Upload</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleBillChange} />
            </label>
            <button type="button" onClick={openCamera} className="inline-flex items-center px-3 py-2 border rounded-lg bg-gray-50 hover:bg-gray-100 shadow-sm">
              <Camera className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm">Capture</span>
            </button>
            {billPreviewUrl && (
              <div className="relative group">
                <img onClick={() => { setPreviewUrl(billPreviewUrl); setPreviewOpen(true); }} src={billPreviewUrl} alt="Bill preview" className="w-12 h-12 rounded object-cover border cursor-zoom-in shadow-sm" />
                <button type="button" onClick={clearBillPhoto} className="absolute -top-2 -right-2 hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white shadow focus:outline-none" title="Remove photo">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input name="location" type="text" value={form.location} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g., 28.61, 77.21 or address" />
            </div>
            <button type="button" onClick={useMyLocation} className="inline-flex items-center px-3 py-2 border rounded-lg bg-gray-50 hover:bg-gray-100 shadow-sm">
              {locLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MapPin className="w-4 h-4 mr-2" />}
              <span className="text-sm">Use my location</span>
            </button>
          </div>
        </div>
        <div className="col-span-1 md:col-span-6 flex justify-end">
          <button type="submit" disabled={!isValid} className={`inline-flex items-center px-4 py-2 rounded-lg shadow-sm ${isValid ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
            <Plus className="w-4 h-4 mr-2" /> Add Expense
          </button>
        </div>
      </form>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-gray-500 bg-gray-50 border-b">
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Amount (₹)</div>
          <div className="col-span-2">Location</div>
          <div className="col-span-3">Notes</div>
          <div className="col-span-1 text-right">Action</div>
        </div>
        {expenses.length === 0 ? (
          <div className="p-8 text-sm text-gray-500 text-center">No expenses added yet.</div>
        ) : (
          expenses.map((e) => (
            <div key={e.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-b items-center text-sm hover:bg-gray-50">
              <div className="col-span-2 flex items-center space-x-2">
                {e.billPreviewUrl ? (
                  <img onClick={() => { setPreviewUrl(e.billPreviewUrl); setPreviewOpen(true); }} src={e.billPreviewUrl} alt={e.billName || 'Bill'} className="w-8 h-8 rounded object-cover border cursor-zoom-in shadow-sm" />
                ) : (
                  <div className="w-8 h-8 rounded bg-gray-100 border flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                <span>{e.date}</span>
              </div>
              <div className="col-span-2">{e.category}</div>
              <div className="col-span-2 font-medium">₹{Number(e.amount).toLocaleString()}</div>
              <div className="col-span-2 truncate" title={e.location}>
                {e.location ? (
                  <a className="text-blue-600 hover:underline" target="_blank" rel="noreferrer" href={e.location.match(/^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/) ? `https://maps.google.com/?q=${encodeURIComponent(e.location)}` : `https://maps.google.com/?q=${encodeURIComponent(e.location)}`}>
                    {e.location}
                  </a>
                ) : '-'}
              </div>
              <div className="col-span-3 truncate" title={e.notes}>{e.notes || '-'}</div>
              <div className="col-span-1 text-right">
                <button onClick={() => deleteExpense(e.id)} className="text-red-600 hover:text-red-800 inline-flex items-center p-2 rounded hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-[92vw] max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-gray-700" />
                <h3 className="text-sm font-medium text-gray-800">Capture Bill Photo</h3>
              </div>
              <button className="p-1 rounded hover:bg-gray-100" onClick={cancelCapture}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4">
          {cameraError && (
            <div className="mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {cameraError}
              {!isSecure() && (
                <div className="mt-1 text-[11px] text-red-700">Tip: Run on https or localhost:5173.</div>
              )}
              <div className="mt-2">
                <label className="inline-flex items-center px-3 py-2 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <ImageIcon className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="text-sm">Fallback: Capture/Input</span>
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleBillChange} />
                </label>
              </div>
            </div>
          )}
              <div className="rounded-lg overflow-hidden bg-black">
            <video ref={videoRef} playsInline autoPlay muted className="w-full h-64 object-contain bg-black" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button type="button" onClick={captureFrame} className="px-4 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100">Take Photo</button>
                <div className="space-x-2">
                  <button type="button" onClick={cancelCapture} className="px-4 py-2 rounded-lg border">Cancel</button>
                  <button type="button" onClick={confirmCapture} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Use Photo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={() => setPreviewOpen(false)}>
          <div className="relative max-w-[92vw] max-h-[92vh]" onClick={(e) => e.stopPropagation()}>
            <button className="absolute -top-10 right-0 text-white/90 hover:text-white" onClick={() => setPreviewOpen(false)}>
              <X className="w-6 h-6" />
            </button>
            <img src={previewUrl} alt="Bill" className="max-w-[92vw] max-h-[92vh] object-contain rounded" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingSalespersonExpenses;


