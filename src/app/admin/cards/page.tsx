'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Sparkles, 
  CreditCard, 
  Users, 
  Plus, 
  Printer,
  X,
  CheckCircle,
  Grid3X3
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Card {
  _id: string;
  uuid: string;
  status: 'inactive' | 'active';
  currentPoints: number;
  totalRedemptions: number;
  createdAt: string;
}

export default function CardsManagement() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGenerator, setShowGenerator] = useState(false);
  const [quantity, setQuantity] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [printCards, setPrintCards] = useState<Card[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/admin/cards');
      if (response.ok) {
        const data = await response.json();
        setCards(data);
      }
    } catch (error) {
      toast.error('Kartları yükləmək mümkün olmadı');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCards = async () => {
    if (quantity < 1 || quantity > 100) {
      toast.error('1-100 arasında rəqəm daxil edin');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/admin/cards', {
        method: 'POST',
        body: JSON.stringify({ quantity }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`${quantity} kart yaradıldı!`);
        setPrintCards(data.cards);
        setShowGenerator(false);
        fetchCards();
      } else {
        toast.error(data.error || 'Xəta baş verdi');
      }
    } catch (error) {
      toast.error('Xəta baş verdi');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    if (printCards.length === 0) {
      setPrintCards(cards.filter(c => c.status === 'inactive').slice(0, 20));
    }
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-6 hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Loyal.az</span>
        </div>

        <nav className="space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <CreditCard className="w-5 h-5" />
            İdarə Paneli
          </Link>
          <Link href="/admin/cards" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 text-primary-600 font-medium">
            <Grid3X3 className="w-5 h-5" />
            Kartlar
          </Link>
          <Link href="/admin/staff" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <Users className="w-5 h-5" />
            Əməkdaşlar
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-8 pb-24 lg:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kartlar</h1>
            <p className="text-gray-500">QR kodlu sadiqlit kartlarını idarə edin</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors no-print"
            >
              <Printer className="w-5 h-5" />
              Çap Et
            </button>
            <button 
              onClick={() => setShowGenerator(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all no-print"
            >
              <Plus className="w-5 h-5" />
              Kart Yarat
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 no-print">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{cards.length}</p>
            <p className="text-sm text-gray-500">Cəmi Kartlar</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-2xl font-bold text-emerald-600">{cards.filter(c => c.status === 'active').length}</p>
            <p className="text-sm text-gray-500">Aktiv</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-2xl font-bold text-gray-400">{cards.filter(c => c.status === 'inactive').length}</p>
            <p className="text-sm text-gray-500">Passiv</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-2xl font-bold text-purple-600">{cards.reduce((acc, c) => acc + c.totalRedemptions, 0)}</p>
            <p className="text-sm text-gray-500">Hədiyyələr</p>
          </div>
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : cards.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 no-print">
            <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-200" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hələ kart yoxdur</h3>
            <p className="text-gray-500 mb-6">İlk kartlarınızı yaradın</p>
            <button 
              onClick={() => setShowGenerator(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              Kart Yarat
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden no-print">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">UUID</th>
                    <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">Status</th>
                    <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">Xallar</th>
                    <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">Hədiyyələr</th>
                    <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">Tarix</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card) => (
                    <tr key={card._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {card.uuid.slice(0, 12)}...
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          card.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {card.status === 'active' && <CheckCircle className="w-3 h-3" />}
                          {card.status === 'active' ? 'Aktiv' : 'Passiv'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-amber-600">{card.currentPoints}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{card.totalRedemptions}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(card.createdAt).toLocaleDateString('az-AZ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Print Area */}
        <div ref={printRef} className="hidden print:block print-grid">
          {(printCards.length > 0 ? printCards : cards.filter(c => c.status === 'inactive').slice(0, 20)).map((card) => (
            <div key={card._id} className="print-card">
              <QRCodeSVG 
                value={`${getBaseUrl()}/c/${card.uuid}`} 
                size={150}
                level="H"
              />
              <p className="mt-2 text-xs text-gray-500 font-mono">{card.uuid.slice(0, 12)}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 no-print">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Kart Yarat</h2>
              <button onClick={() => setShowGenerator(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Say (1-100)
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                min={1}
                max={100}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowGenerator(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                İmtina
              </button>
              <button
                onClick={handleGenerateCards}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Yaradılır...
                  </>
                ) : (
                  'Yarat'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden no-print">
        <div className="flex items-center justify-around">
          <Link href="/admin" className="flex flex-col items-center text-gray-400">
            <CreditCard className="w-6 h-6" />
            <span className="text-xs mt-1">Panel</span>
          </Link>
          <Link href="/admin/cards" className="flex flex-col items-center text-primary-600">
            <Grid3X3 className="w-6 h-6" />
            <span className="text-xs mt-1">Kartlar</span>
          </Link>
          <Link href="/admin/staff" className="flex flex-col items-center text-gray-400">
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">Əməkdaşlar</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}