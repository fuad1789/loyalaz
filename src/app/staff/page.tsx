'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  Sparkles, 
  QrCode, 
  X,
  CheckCircle,
  Gift,
  Clock,
  AlertTriangle,
  LogOut,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ScanResult {
  success: boolean;
  action: 'activation' | 'point_added' | 'reward' | 'cooldown' | 'error';
  message: string;
  card?: {
    uuid: string;
    currentPoints: number;
    status: string;
  };
  tenant?: {
    pointThreshold: number;
  };
}

export default function StaffPanel() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [staffName, setStaffName] = useState('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    fetchStaffInfo();
  }, []);

  const fetchStaffInfo = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        if (data?.user) {
          setStaffName(data.user.name || '');
        }
      }
    } catch (error) {
      console.error('Error fetching staff info:', error);
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    setScanResult(null);
    
    // Initialize scanner after component renders
    setTimeout(() => {
      scannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        { 
          fps: 10, 
          qrbox: { width: 280, height: 280 },
          rememberLastUsedCamera: true,
        },
        false
      );

      scannerRef.current.render(onScanSuccess, onScanFailure);
    }, 100);
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
      } catch (error) {
        console.error('Error clearing scanner:', error);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const onScanSuccess = async (decodedText: string) => {
    setIsLoading(true);
    
    // Stop scanning while processing
    await stopScanning();

    try {
      // Extract UUID from URL if full URL is scanned
      let uuid = decodedText;
      if (decodedText.includes('/c/')) {
        uuid = decodedText.split('/c/')[1];
      }

      const response = await fetch('/api/scan', {
        method: 'POST',
        body: JSON.stringify({ uuid }),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      setScanResult(result);
      setShowResultModal(true);

      if (result.success) {
        if (result.action === 'activation') {
          toast.success('Kart aktivləşdirildi! +1 xal');
        } else if (result.action === 'point_added') {
          toast.success('Xal əlavə edildi!');
        } else if (result.action === 'reward') {
          toast.success('Hədiyyə təqdim edildi!');
        } else if (result.action === 'cooldown') {
          toast.error(result.message);
        }
      } else {
        toast.error(result.message || 'Xəta baş verdi');
      }
    } catch (error) {
      toast.error('Xəta baş verdi');
      setScanResult({
        success: false,
        action: 'error',
        message: 'Serverlə əlaqə saxlanılmadı'
      });
      setShowResultModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onScanFailure = (error: string) => {
    // Ignore scan failures - they happen frequently while scanning
    console.log('Scan failure:', error);
  };

  const handleRedeemReward = async () => {
    if (!scanResult?.card) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/scan/redeem', {
        method: 'POST',
        body: JSON.stringify({ uuid: scanResult.card.uuid }),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Hədiyyə təqdim edildi! 🎁');
        setScanResult({
          ...scanResult,
          action: 'reward',
          message: 'Hədiyyə uğurla təqdim edildi!',
          card: { ...scanResult.card, currentPoints: 0 }
        });
      } else {
        toast.error(result.message || 'Xəta baş verdi');
      }
    } catch (error) {
      toast.error('Xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white">Loyal.az</span>
            <p className="text-white/70 text-xs">Xal toplama sistemi</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Welcome Card */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-6">
        <p className="text-white/80 text-sm">Salam,</p>
        <h2 className="text-white text-xl font-semibold">{staffName || 'Əməkdaş'}</h2>
      </div>

      {/* Main Scanner Area */}
      {!isScanning ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div 
            onClick={startScanning}
            className="w-64 h-64 rounded-3xl bg-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-2xl"
          >
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <QrCode className="w-10 h-10 text-white" />
              </div>
              <p className="text-gray-900 font-semibold text-lg">QR Oxut</p>
              <p className="text-gray-500 text-sm mt-1">Kliklə və skan et</p>
            </div>
          </div>

          <p className="text-white/60 text-center mt-8 px-4">
            Kartın üzərindəki QR kodu skan edərək xal vurun
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-900 font-semibold">QR Kodu Skan Et</p>
            <button 
              onClick={stopScanning}
              className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div id="qr-reader" className="rounded-2xl overflow-hidden"></div>
          
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Emal edilir...</span>
            </div>
          )}
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && scanResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            {/* Result Header */}
            <div className="text-center mb-6">
              {scanResult.action === 'activation' && (
                <>
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Kart Aktivləşdi!</h3>
                  <p className="text-gray-500 mt-2">İstifadəçi +1 xal qazandı</p>
                </>
              )}
              
              {scanResult.action === 'point_added' && (
                <>
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Xal Əlavə Edildi!</h3>
                  <p className="text-gray-500 mt-2">Cəmi xal: {scanResult.card?.currentPoints}</p>
                </>
              )}
              
              {scanResult.action === 'reward' && (
                <>
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Hədiyyə Hazırdır!</h3>
                  <p className="text-gray-500 mt-2">{scanResult.message}</p>
                </>
              )}
              
              {scanResult.action === 'cooldown' && (
                <>
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Gözləyin</h3>
                  <p className="text-gray-500 mt-2">{scanResult.message}</p>
                </>
              )}
              
              {scanResult.action === 'error' && (
                <>
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Xəta</h3>
                  <p className="text-gray-500 mt-2">{scanResult.message}</p>
                </>
              )}
            </div>

            {/* Points Display */}
            {scanResult.card && scanResult.action !== 'cooldown' && scanResult.action !== 'error' && (
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Cari Xal</span>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-primary-600">{scanResult.card.currentPoints}</span>
                    <span className="text-gray-400">/ {scanResult.tenant?.pointThreshold || 6}</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                    style={{ width: `${(scanResult.card.currentPoints / (scanResult.tenant?.pointThreshold || 6)) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowResultModal(false);
                  setScanResult(null);
                }}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Bağla
              </button>
              
              {scanResult.action === 'reward' && scanResult.card && scanResult.card.currentPoints > 0 && (
                <button
                  onClick={handleRedeemReward}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Gift className="w-5 h-5" />
                      Hədiyyəni Təsdiqlə
                    </>
                  )}
                </button>
              )}
              
              {scanResult.success && scanResult.action !== 'reward' && (
                <button
                  onClick={() => {
                    setShowResultModal(false);
                    setScanResult(null);
                    startScanning();
                  }}
                  className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <QrCode className="w-5 h-5" />
                  Yeni Skan
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}