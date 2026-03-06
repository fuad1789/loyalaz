'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Sparkles, 
  Gift, 
  CheckCircle,
  Star,
  Circle
} from 'lucide-react';

interface CardData {
  success: boolean;
  card?: {
    uuid: string;
    status: string;
    currentPoints: number;
    totalRedemptions: number;
  };
  tenant?: {
    name: string;
    pointThreshold: number;
  };
  message?: string;
}

export default function CustomerView() {
  const params = useParams();
  const uuid = params.uuid as string;
  const [data, setData] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animatePoints, setAnimatePoints] = useState(false);

  useEffect(() => {
    fetchCardData();
  }, [uuid]);

  useEffect(() => {
    if (data?.card) {
      setTimeout(() => setAnimatePoints(true), 300);
    }
  }, [data]);

  const fetchCardData = async () => {
    try {
      const response = await fetch(`/api/card/${uuid}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching card:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (!data?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Circle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Kart Tapılmadı</h2>
          <p className="text-gray-500">{data?.message || 'Bu link etibarsızdır'}</p>
        </div>
      </div>
    );
  }

  const { card, tenant } = data;
  const pointThreshold = tenant?.pointThreshold || 6;
  const points = card?.currentPoints || 0;
  const isRewardReady = points >= pointThreshold;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 p-4">
      {/* Header */}
      <div className="text-center mb-8 pt-6">
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">{tenant?.name || 'Loyal.az'}</h1>
        <p className="text-white/70 text-sm">Sadiqlilik Kartınız</p>
      </div>

      {/* Status Badge */}
      <div className="flex justify-center mb-6">
        {card?.status === 'inactive' ? (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm">
            <Circle className="w-3 h-3" />
            Aktivləşdirməli
          </span>
        ) : isRewardReady ? (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500 text-white text-sm animate-pulse">
            <Gift className="w-4 h-4" />
            Hədiyyə Hazırdır!
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/80 text-white text-sm">
            <CheckCircle className="w-4 h-4" />
            Aktiv
          </span>
        )}
      </div>

      {/* Stamp Card */}
      <div className="bg-white rounded-3xl p-6 shadow-2xl mb-6">
        <h2 className="text-lg font-semibold text-gray-900 text-center mb-6">
          Xal Kartı
        </h2>

        {/* Stamp Circles */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Array.from({ length: pointThreshold }).map((_, index) => (
            <div
              key={index}
              className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-500 ${
                index < points
                  ? 'bg-gradient-to-br from-primary-500 to-accent-500 scale-100 opacity-100 shadow-lg'
                  : 'bg-gray-100 scale-90 opacity-60'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                transform: animatePoints && index < points ? 'scale(1)' : 'scale(0.9)',
              }}
            >
              {index < points ? (
                <Star className="w-8 h-8 text-white fill-white" />
              ) : (
                <Circle className="w-8 h-8 text-gray-300" />
              )}
            </div>
          ))}
        </div>

        {/* Progress Text */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-1">Toplanmış xal</p>
          <div className="flex items-center justify-center gap-2">
            <span className={`text-4xl font-bold ${isRewardReady ? 'text-purple-600' : 'text-primary-600'}`}>
              {points}
            </span>
            <span className="text-gray-400 text-xl">/ {pointThreshold}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              isRewardReady 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                : 'bg-gradient-to-r from-primary-500 to-accent-500'
            }`}
            style={{ width: `${Math.min((points / pointThreshold) * 100, 100)}%` }}
          ></div>
        </div>

        {/* Reward Message */}
        {isRewardReady && (
          <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 text-center border border-purple-100">
            <Gift className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-purple-700 font-semibold">Hədiyyəniz hazırdır!</p>
            <p className="text-purple-600 text-sm mt-1">Restoran personalına müraciət edin</p>
          </div>
        )}
      </div>

      {/* Stats Card */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{card?.totalRedemptions || 0}</p>
            <p className="text-white/60 text-sm">Hədiyyə alınıb</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {card?.status === 'active' ? 'Aktiv' : 'Passiv'}
            </p>
            <p className="text-white/60 text-sm">Status</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="text-center text-white/50 text-xs pb-8">
        <p>Hər ziyarətdə 1 xal qazanın</p>
        <p className="mt-1">{pointThreshold} xal = 1 hədiyyə</p>
        <p className="mt-3 text-white/30">Loyal.az © 2024</p>
      </div>
    </div>
  );
}