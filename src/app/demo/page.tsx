'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Gift, Coffee, Check, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DemoCustomerPage() {
  const [points, setPoints] = useState(3);
  const [showReward, setShowReward] = useState(false);
  const [animatePoints, setAnimatePoints] = useState(false);
  const threshold = 6;

  const addPoint = () => {
    if (points < threshold) {
      setAnimatePoints(true);
      setTimeout(() => {
        setPoints(prev => {
          const newPoints = prev + 1;
          if (newPoints >= threshold) {
            setTimeout(() => setShowReward(true), 500);
          }
          return newPoints;
        });
        setAnimatePoints(false);
      }, 300);
    }
  };

  const resetDemo = () => {
    setPoints(3);
    setShowReward(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Geri</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold gradient-text">Loyal.az</span>
        </div>
        <div className="w-16"></div>
      </header>

      {/* Demo Banner */}
      <div className="mx-4 mb-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-3 text-center border border-amber-200">
        <p className="text-sm font-medium text-amber-800">
          🎮 Bu demo səhifədir - sınaq edin!
        </p>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-md mx-auto">
          {/* Restaurant Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 mb-6 border border-gray-100">
            {/* Restaurant Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Café Lala</h1>
                <p className="text-gray-500 text-sm">Bakı, Azərbaycan</p>
              </div>
            </div>

            {/* Points Display */}
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold gradient-text transition-all duration-300 ${animatePoints ? 'scale-125 opacity-50' : ''}`}>
                {points} / {threshold}
              </div>
              <p className="text-gray-500 mt-2">xal toplandı</p>
            </div>

            {/* Stamp Card */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 mb-6">
              <p className="text-sm text-gray-500 text-center mb-4">Sadiqlit Kartı</p>
              <div className="grid grid-cols-6 gap-2">
                {[...Array(threshold)].map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-xl flex items-center justify-center transition-all duration-500 ${
                      i < points
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/30'
                        : 'bg-white border-2 border-dashed border-gray-200'
                    }`}
                  >
                    {i < points ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <Star className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reward Info */}
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-primary-600">{threshold} xal</span> = 
                <span className="font-semibold text-accent-600"> 1 Pulsuz Nahar</span>
              </p>
            </div>
          </div>

          {/* Demo Button */}
          <button
            onClick={addPoint}
            disabled={points >= threshold}
            className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-primary-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Xal Əlavə Et (Demo)
          </button>

          {/* Info */}
          <p className="text-center text-gray-500 text-sm mt-4">
            Bu demo səhifəsidir. Real sistemdə ofisiant QR kodu oxudaraq xal əlavə edir.
          </p>
        </div>
      </main>

      {/* Reward Modal */}
      {showReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-scale-in">
            {/* Confetti Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full animate-fall"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
                  }}
                />
              ))}
            </div>

            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
              <Gift className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 Təbrik edirik!
            </h2>
            <p className="text-gray-600 mb-6">
              Siz <span className="font-semibold text-emerald-600">1 Pulsuz Nahar</span> qazandınız!
            </p>

            <button
              onClick={resetDemo}
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Demo-nu Yenidən Başlat
            </button>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-fall {
          animation: fall 3s ease-in-out infinite;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
        @keyframes scaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
