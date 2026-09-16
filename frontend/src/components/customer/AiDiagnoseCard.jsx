import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWandMagicSparkles,
  faUpload,
  faRotateRight
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
    matchReason: 'HVAC & electronics guild lead, genuine OEM spare parts warranty, 95.0% trust rating.'
  }
];

export default function AiDiagnoseCard() {
  const navigate = useNavigate();

  const [analyzing, setAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [smartMatchData, setSmartMatchData] = useState(null);

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
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const randomDiag = MOCK_MATCH_DIAGNOSES[Math.floor(Math.random() * (MOCK_MATCH_DIAGNOSES.length - 1))];
      runAnalysis(randomDiag, url);
    }
  };

  const resetDiagnose = () => {
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

        {smartMatchData && (
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
            Upload a photo and let AI identify the issue.
          </p>

          {/* Single Upload Area */}
          <label className="relative border-2 border-dashed border-[#E8E2D8] bg-[#F8F6F2] hover:border-[#A66666] hover:bg-[#A66666]/10 rounded-xl py-3.5 px-4 text-center cursor-pointer transition-all flex items-center justify-center gap-2.5 group active:scale-[0.99] w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="w-7 h-7 rounded-lg bg-[#FCFBF8] border border-[#E8E2D8] text-[#A66666] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
              <FontAwesomeIcon icon={faUpload} className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#17233A]">
              Select Image
            </span>
          </label>

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
            <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-[#A66666] relative">
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

      {/* RESULT: AI WORKER RECOMMENDATION CARD */}
      {smartMatchData && !analyzing && (
        <AiWorkerRecommendationCard
          matchData={smartMatchData}
          onReset={resetDiagnose}
        />
      )}

    </div>
  );
}
