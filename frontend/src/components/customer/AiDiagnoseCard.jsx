import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWandMagicSparkles,
  faUpload,
  faCamera,
  faRotateRight,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { SERVICES_DATA } from '../../data/servicesData';
import { getWorkerById, WORKERS_DATA } from '../../data/workersData';
import AiWorkerRecommendationCard from './AiWorkerRecommendationCard';

// Structured Mock Vision & Smart Matching Dataset
const MOCK_MATCH_DIAGNOSES = [
  {
    id: 'diag-electrical-spark',
    detectedIssue: 'Electrical Switchboard Overheating & Circuit Fault',
    confidence: 94,
    severity: 'Medium',
    isEmergency: false,
    serviceId: 'electrical',
    serviceName: 'Electrical Repair',
    bestWorkerId: 'el-1',
    eta: '14 mins',
    matchReason: 'High electrical specialization (8+ Yrs), closest verified artisan (1.2 km), fastest response time.'
  },
  {
    id: 'diag-plumbing-leak',
    detectedIssue: 'High-Pressure Pipe Leak & Basin Drain Blockage',
    confidence: 91,
    severity: 'Medium',
    isEmergency: false,
    serviceId: 'plumbing',
    serviceName: 'Plumbing Service',
    bestWorkerId: 'pl-1',
    eta: '18 mins',
    matchReason: 'Ultrasonic leak detection certified, 96.2% trust score, nearest available hydro-jet plumber.'
  },
  {
    id: 'diag-critical-emergency',
    detectedIssue: 'Active Electrical Short Circuit & Sparking Wire',
    confidence: 98,
    severity: 'Critical',
    isEmergency: true,
    serviceId: 'electrical',
    serviceName: 'Electrical Repair',
    bestWorkerId: 'el-3',
    eta: '8 mins away',
    matchReason: 'Master industrial electrician grade 1, nearest priority express artisan for electrical hazard.'
  },
  {
    id: 'diag-appliance-fault',
    detectedIssue: 'Refrigerator Compressor Overload & Cooling Fault',
    confidence: 89,
    severity: 'Medium',
    isEmergency: false,
    serviceId: 'appliance-repair',
    serviceName: 'Appliance Repair',
    bestWorkerId: 'ap-1',
    eta: '22 mins',
    matchReason: 'Certified HVAC & refrigeration technician, genuine compressor coils available in dispatch kit.'
  }
];

export default function AiDiagnoseCard() {
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [smartMatchData, setSmartMatchData] = useState(null);

  // Live Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fallbackCameraInputRef = useRef(null);

  const runAnalysis = (mockItem, imageUrl = null) => {
    setAnalyzing(true);
    setSelectedImage(imageUrl || 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=600&auto=format&fit=crop&q=80');
    setSmartMatchData(null);

    setTimeout(() => {
      const matchedWorker = getWorkerById(mockItem.bestWorkerId) || WORKERS_DATA[0];
      setAnalyzing(false);
      setSmartMatchData({
        ...mockItem,
        worker: matchedWorker
      });
    }, 1800);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const randomDiag = MOCK_MATCH_DIAGNOSES[Math.floor(Math.random() * (MOCK_MATCH_DIAGNOSES.length - 1))];
      runAnalysis(randomDiag, url);
    }
    e.target.value = '';
  };

  const startCamera = async (mode = 'environment') => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (fallbackCameraInputRef.current) {
        fallbackCameraInputRef.current.click();
      }
      return;
    }

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      console.warn('Camera stream notice, using native picker fallback:', err);
      if (fallbackCameraInputRef.current) {
        fallbackCameraInputRef.current.click();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        stopCamera();
        const randomDiag = MOCK_MATCH_DIAGNOSES[Math.floor(Math.random() * (MOCK_MATCH_DIAGNOSES.length - 1))];
        runAnalysis(randomDiag, url);
      }
    }, 'image/jpeg', 0.92);
  };

  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive]);

  const resetDiagnose = () => {
    stopCamera();
    setSelectedImage(null);
    setSmartMatchData(null);
    setAnalyzing(false);
  };

  return (
    <div className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[20px] sm:rounded-[22px] p-3.5 sm:p-4 md:p-4.5 shadow-2xs space-y-3.5 relative overflow-hidden">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#E8E2D8] pb-2.5 sm:pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#A66666]/10 text-[#A66666] flex items-center justify-center border border-[#A66666]/20 shrink-0">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-base sm:text-lg font-extrabold font-display text-[#17233A] leading-tight">
            Diagnose Your Problem
          </h2>
        </div>

        {(smartMatchData || selectedImage) && (
          <button
            type="button"
            onClick={resetDiagnose}
            className="text-[11px] font-bold text-[#6B7280] hover:text-[#17233A] flex items-center gap-1 bg-[#F8F6F2] px-2.5 py-1 rounded-lg border border-[#E8E2D8] cursor-pointer"
          >
            <FontAwesomeIcon icon={faRotateRight} className="w-2.5 h-2.5" />
            <span>Scan Another Image</span>
          </button>
        )}
      </div>

      {/* BEFORE SCAN: ENTRY FLOW */}
      {!selectedImage && !analyzing && (
        <div className="space-y-3.5 pt-0.5">
          <p className="text-xs text-[#6B7280] leading-snug">
            Upload or capture a photo and let AI identify the issue.
          </p>

          {/* Action Buttons: Select Image & Take Photo */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {/* 1. Select Image Button (File Picker) */}
            <label className="relative border-2 border-dashed border-[#E8E2D8] bg-[#F8F6F2] hover:border-[#A66666] hover:bg-[#A66666]/10 rounded-xl py-3 px-2 sm:px-3 text-center cursor-pointer transition-all flex items-center justify-center gap-2 group active:scale-[0.99] select-none">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="w-7 h-7 rounded-lg bg-[#FCFBF8] border border-[#E8E2D8] text-[#A66666] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
                <FontAwesomeIcon icon={faUpload} className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#17233A] truncate">
                Select Image
              </span>
            </label>

            {/* 2. Take Photo Button (Direct Live Camera) */}
            <button
              type="button"
              onClick={() => startCamera(facingMode)}
              className="relative border-2 border-dashed border-[#E8E2D8] bg-[#F8F6F2] hover:border-[#A66666] hover:bg-[#A66666]/10 rounded-xl py-3 px-2 sm:px-3 text-center cursor-pointer transition-all flex items-center justify-center gap-2 group active:scale-[0.99] select-none"
            >
              <div className="w-7 h-7 rounded-lg bg-[#FCFBF8] border border-[#E8E2D8] text-[#A66666] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
                <FontAwesomeIcon icon={faCamera} className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#17233A] truncate">
                Take Photo
              </span>
            </button>
          </div>

          {/* Hidden fallback camera input */}
          <input
            ref={fallbackCameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Quick Demo Sample Badges */}
          <div className="pt-0.5 flex items-center gap-2 flex-wrap text-[11px]">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Try Samples:</span>
            <button
              type="button"
              onClick={() => runAnalysis(MOCK_MATCH_DIAGNOSES[0])}
              className="px-2.5 py-1 rounded-lg bg-[#F8F6F2] hover:bg-[#E8E2D8] border border-[#E8E2D8] text-[11px] font-medium text-[#17233A] cursor-pointer transition-colors"
            >
              Electrical Fault
            </button>
            <button
              type="button"
              onClick={() => runAnalysis(MOCK_MATCH_DIAGNOSES[1])}
              className="px-2.5 py-1 rounded-lg bg-[#F8F6F2] hover:bg-[#E8E2D8] border border-[#E8E2D8] text-[11px] font-medium text-[#17233A] cursor-pointer transition-colors"
            >
              Pipe Leak
            </button>
            <button
              type="button"
              onClick={() => runAnalysis(MOCK_MATCH_DIAGNOSES[2])}
              className="px-2.5 py-1 rounded-lg bg-[#F8F6F2] hover:bg-[#E8E2D8] border border-[#E8E2D8] text-[11px] font-medium text-[#17233A] cursor-pointer transition-colors"
            >
              Critical Sparking
            </button>
          </div>
        </div>
      )}

      {/* SCANNING STATE */}
      {analyzing && (
        <div className="py-6 text-center space-y-3">
          <div className="relative w-14 h-14 mx-auto">
            <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-[#A66666] relative shadow-md">
              <img src={selectedImage} alt="Scanning" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-[#A66666]/20 animate-pulse" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#A66666] shadow-[0_0_8px_#A66666] animate-bounce" />
            </div>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-display text-[#17233A]">AI Smart Matching in Progress...</h3>
            <p className="text-[11px] text-[#6B7280]">Calculating Trust, Distance, Ratings & Response Speed</p>
          </div>
        </div>
      )}

      {/* RESULT: PREVIEW & AI WORKER RECOMMENDATION CARD */}
      {smartMatchData && !analyzing && (
        <div className="space-y-3">
          {/* Captured / Selected Photo Preview Strip */}
          {selectedImage && (
            <div className="flex items-center gap-3 p-2.5 bg-[#F8F6F2] border border-[#E8E2D8] rounded-2xl">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#E8E2D8] shrink-0 relative shadow-2xs">
                <img src={selectedImage} alt="Diagnosed" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-[#A66666] uppercase tracking-wider block">
                  Analyzed Photo
                </span>
                <p className="text-xs font-bold text-[#17233A] truncate">
                  {smartMatchData.detectedIssue}
                </p>
                <span className="text-[10px] text-[#6B7280]">
                  Confidence: {smartMatchData.confidence}%
                </span>
              </div>
            </div>
          )}

          <AiWorkerRecommendationCard
            matchData={smartMatchData}
            onReset={resetDiagnose}
          />
        </div>
      )}

      {/* LIVE CAMERA VIEWFINDER MODAL */}
      {cameraActive && createPortal(
        <div className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Header */}
          <div className="w-full max-w-md flex items-center justify-between text-white py-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs sm:text-sm font-bold font-display tracking-wide">
                Live Camera Scanner
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleFacingMode}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Switch Camera"
                aria-label="Switch Camera"
              >
                <FontAwesomeIcon icon={faRotateRight} className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Close Camera"
                aria-label="Close Camera"
              >
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Viewfinder Video Container */}
          <div className="w-full max-w-md aspect-[4/3] sm:aspect-square relative rounded-3xl overflow-hidden bg-black border-2 border-[#A66666] shadow-2xl flex items-center justify-center my-auto">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Viewfinder Guideline Corners */}
            <div className="absolute inset-4 pointer-events-none border border-white/30 rounded-2xl flex flex-col justify-between p-2">
              <div className="flex justify-between">
                <div className="w-5 h-5 border-t-2 border-l-2 border-[#A66666] rounded-tl" />
                <div className="w-5 h-5 border-t-2 border-r-2 border-[#A66666] rounded-tr" />
              </div>
              <p className="text-center text-[11px] text-white/80 font-semibold bg-black/40 py-1 px-3 rounded-full backdrop-blur-xs mx-auto">
                Align the damage / issue inside the frame
              </p>
              <div className="flex justify-between">
                <div className="w-5 h-5 border-b-2 border-l-2 border-[#A66666] rounded-bl" />
                <div className="w-5 h-5 border-b-2 border-r-2 border-[#A66666] rounded-br" />
              </div>
            </div>
          </div>

          {/* Bottom Action Controls */}
          <div className="w-full max-w-md py-4 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={capturePhoto}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-4 border-white p-1.5 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-xl bg-white/20"
              aria-label="Capture Photo"
            >
              <div className="w-full h-full rounded-full bg-[#A66666] hover:bg-[#8F5555] flex items-center justify-center text-white shadow-inner">
                <FontAwesomeIcon icon={faCamera} className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
            </button>
            <span className="text-xs text-white/70 font-medium">Tap to Snap Photo & Diagnose</span>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
