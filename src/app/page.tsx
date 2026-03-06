'use client';

import { useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Sparkles, 
  QrCode, 
  BarChart3, 
  Users, 
  Gift, 
  Smartphone,
  Check,
  ArrowRight,
  Star,
  ChevronDown,
  Coffee,
  Utensils,
  ShoppingBag,
  Store,
  Heart,
  Award
} from 'lucide-react';

// FAQ Accordion Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-primary-500 transition-colors"
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

// Trusted By Marquee
function TrustedMarquee() {
  const logos = [
    { icon: Coffee, name: 'Café Baku' },
    { icon: Utensils, name: 'Restoran Əyləncə' },
    { icon: ShoppingBag, name: 'Mağaza AZ' },
    { icon: Store, name: 'Boutique Style' },
    { icon: Heart, name: 'Spa Relax' },
    { icon: Award, name: 'Fitness Pro' },
    { icon: Coffee, name: 'Coffee House' },
    { icon: Utensils, name: 'Dining Club' },
  ];

  return (
    <div className="overflow-hidden py-12 bg-gradient-to-r from-slate-50 via-white to-slate-50">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10"></div>
        
        <div className="flex animate-marquee">
          {[...logos, ...logos].map((logo, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 mx-8 px-8 py-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <logo.icon className="w-8 h-8 text-primary-500" />
              <span className="font-semibold text-gray-700 whitespace-nowrap">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Loyal.az</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Xüsusiyyətlər
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Necə işləyir
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Qiymətlər
              </a>
              <a
                href="#faq"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                FAQ
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Daxil ol
              </Link>
              <Link
                href="/login"
                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all"
              >
                Başla
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-accent-500" />
              <span className="text-sm font-medium text-gray-600">
                Azərbaycanın ilk rəqəmsal sadiqlit platforması
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-slide-up">
              Müştərilərinizi
              <br />
              <span className="gradient-text">Mükafatlandırın</span>
            </h1>

            <p
              className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              Biznesiniz üçün smartfon əsaslı sadiqlit kartı həlli. Kağız
              kartlara son, rəqəmsal gələcəyə xoş gəldiniz.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Link
                href="/login"
                className="group bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-primary-500/25 transition-all flex items-center gap-2"
              >
                Pulsuz Başla
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-4 rounded-2xl font-semibold text-lg text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-all"
              >
                Necə işləyir?
              </a>
            </div>
          </div>

          {/* Live Demo QR Code Section */}
          <div
            className="flex flex-col items-center justify-center mb-16 animate-scale-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Link href="/demo" className="relative cursor-pointer group">
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl blur-xl opacity-30 animate-pulse group-hover:opacity-50 transition-opacity"></div>

              {/* QR Code Container */}
              <div className="relative bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <div className="w-48 h-48 bg-white rounded-2xl p-3 flex items-center justify-center">
                  {/* Real QR Code */}
                  <QRCodeSVG
                    value={
                      typeof window !== "undefined"
                        ? `${process.env.NEXT_PUBLIC_APP_URL}/demo`
                        : "/demo"
                    }
                    size={180}
                    level="H"
                    includeMargin={false}
                    fgColor="#1f2937"
                    bgColor="transparent"
                  />
                </div>

                {/* Logo overlay */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-2 shadow-lg border border-gray-100">
                  <Sparkles className="w-6 h-6 text-primary-500" />
                </div>

                {/* Click indicator */}
                <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/5 rounded-3xl transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                    <span className="text-primary-600 font-medium text-sm">
                      Demo-ya keçid →
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* CTA Text */}
            <div className="mt-8 text-center">
              <p className="text-lg font-medium text-gray-900 mb-2">
                📱 Kameranızı açın və sistemi canlı test edin!
              </p>
              <p className="text-sm text-gray-500 mb-4">
                QR kodu oxudun və ya klikləyin
              </p>
            </div>
          </div>

          {/* Hero Image / Mockup */}
          <div
            className="relative animate-scale-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-4 md:p-8 border border-gray-100">
                <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                    {/* Phone Mockup 1 */}
                    <div className="bg-white rounded-3xl shadow-xl p-4 border border-gray-100 transform hover:-translate-y-2 transition-transform">
                      <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                          <QrCode className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          QR Oxut
                        </h3>
                        <p className="text-sm text-gray-500">
                          Sadə bir toxunuşla xal əlavə edin
                        </p>
                      </div>
                    </div>

                    {/* Phone Mockup 2 */}
                    <div className="bg-white rounded-3xl shadow-xl p-4 border border-gray-100 transform hover:-translate-y-2 transition-transform">
                      <div className="bg-gradient-to-br from-accent-50 to-white rounded-2xl p-6 text-center">
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[...Array(6)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-8 h-8 rounded-full ${i < 4 ? "bg-gradient-to-br from-emerald-400 to-emerald-500" : "bg-gray-200"}`}
                            />
                          ))}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Xallar
                        </h3>
                        <p className="text-sm text-gray-500">
                          4/6 xal toplandı
                        </p>
                      </div>
                    </div>

                    {/* Phone Mockup 3 */}
                    <div className="bg-white rounded-3xl shadow-xl p-4 border border-gray-100 transform hover:-translate-y-2 transition-transform">
                      <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                          <Gift className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Hədiyyə!
                        </h3>
                        <p className="text-sm text-gray-500">
                          6 xal = 1 pulsuz nahar
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-8 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-500">
            Bizə güvənən məkanlar
          </h3>
        </div>
        <TrustedMarquee />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Niyə <span className="gradient-text">Loyal.az</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Biznesinizi böyütmək üçün lazım olan bütün alətlər
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: QrCode,
                title: "QR Kod Sistemi",
                description:
                  "Hər kart üçün unikal QR kod. Sadə və sürətli skan etmə.",
                color: "primary",
              },
              {
                icon: Smartphone,
                title: "Mobil Optimallaşdırılmış",
                description:
                  "Əməkdaşlar və müştərilər üçün mükəmməl mobil təcrübə.",
                color: "accent",
              },
              {
                icon: BarChart3,
                title: "Analitika",
                description:
                  "Müştəri davranışlarını izləyin və biznesinizi optimallaşdırın.",
                color: "emerald",
              },
              {
                icon: Users,
                title: "Əməkdaş İdarəetməsi",
                description:
                  "Waiter hesabları yaradın və performansını izləyin.",
                color: "amber",
              },
              {
                icon: Gift,
                title: "Mükafat Sistemi",
                description:
                  "Özəl mükafat hədləri müəyyən edin və avtomatik tətbiq edin.",
                color: "rose",
              },
              {
                icon: Sparkles,
                title: "Sadə İstifadə",
                description:
                  "Kömpleks quraşdırma yoxdur. Dərhal istifadəyə başlayın.",
                color: "violet",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon
                    className={`w-7 h-7 text-${feature.color}-500`}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 px-4 bg-gradient-to-br from-slate-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Necə işləyir?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              3 sadə addımla başlayın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Kartlar Yaradın",
                description:
                  "Paneldən istədiyiniz sayda QR kodlu kartlar yaradın və çap edin.",
                icon: QrCode,
              },
              {
                step: "02",
                title: "Müştərilərə Təqdim Edin",
                description:
                  "Kartları müştərilərinizə verin. Onlar QR kodu telefonları ilə oxuda bilərlər.",
                icon: Users,
              },
              {
                step: "03",
                title: "Xallar Toplayın",
                description:
                  "Hər gəlişdə xal əlavə edin və müştərilərinizi mükafatlandırın.",
                icon: Gift,
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg shadow-gray-100/50 h-full">
                  <div className="text-6xl font-bold text-gray-100 mb-4">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sadə qiymətlər
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gizli ödəniş yoxdur. Yalnız biznesinizə lazım olan funksiyalar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-primary-200 hover:shadow-xl transition-all">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Başlanğıc
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₼29</span>
                <span className="text-gray-500">/ay</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "100 aktiv kart",
                  "2 əməkdaş",
                  "Baza analitika",
                  "Email dəstək",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-600">
                    <Check className="w-5 h-5 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="block w-full text-center py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-primary-500 hover:text-primary-500 transition-colors"
              >
                Başla
              </Link>
            </div>

            {/* Pro Plan - Highlighted */}
            <div className="relative transform md:-translate-y-4">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur-xl opacity-30"></div>

              <div className="relative bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl p-8 text-white shadow-2xl shadow-primary-500/30">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Populyar
                </div>

                <h3 className="text-lg font-semibold mb-2 mt-2">Peşəkar</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">₼79</span>
                  <span className="text-white/70">/ay</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Limitsiz kart",
                    "10 əməkdaş",
                    "Tam analitika",
                    "Prioritet dəstək",
                    "API girişi",
                    "🎁 İlk 100 fiziki kart bizdən hədiyyə",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-3 ${item.startsWith("🎁") ? "bg-white/20 -mx-2 px-2 py-1 rounded-lg font-medium" : ""}`}
                    >
                      <Check className="w-5 h-5 flex-shrink-0" />
                      <span>
                        {item.startsWith("🎁") ? item.slice(2) : item}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="block w-full text-center py-3 rounded-xl bg-white text-primary-600 font-semibold hover:shadow-lg hover:bg-gray-50 transition-all"
                >
                  Başla
                </Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-primary-200 hover:shadow-xl transition-all">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Korporativ
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₼199</span>
                <span className="text-gray-500">/ay</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Hər şey Peşəkarda var",
                  "Limitsiz əməkdaş",
                  "Ayrılmış dəstək meneceri",
                  "Xüsusi inteqrasiyalar",
                  "SLA zəmanəti",
                  "🎁 Limitsiz fiziki kart generasiyası",
                ].map((item, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-3 text-gray-600 ${item.startsWith("🎁") ? "bg-primary-50 -mx-2 px-2 py-1 rounded-lg" : ""}`}
                  >
                    <Check
                      className={`w-5 h-5 flex-shrink-0 ${item.startsWith("🎁") ? "text-primary-500" : "text-emerald-500"}`}
                    />
                    <span>{item.startsWith("🎁") ? item.slice(2) : item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="block w-full text-center py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-primary-500 hover:text-primary-500 transition-colors"
              >
                Əlaqə
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="py-20 px-4 bg-gradient-to-br from-slate-50 to-white"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tez-tez verilən suallar
            </h2>
            <p className="text-xl text-gray-600">
              Suallarınızın cavabları burada
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg shadow-gray-100/50">
            <FAQItem
              question="Müştərilər qeydiyyatdan keçməlidirmi?"
              answer="Xeyr! Heç bir proqram yükləməyə və ya nömrə verməyə ehtiyac yoxdur. Sadəcə kameranı açıb QR kodu oxutmaq kifayətdir."
            />
            <FAQItem
              question="Fiziki kartları kim çap edir?"
              answer="Sistem sizə çap üçün hazır PDF faylı verir. Onu istənilən mətbəədə rahatlıqla çıxara bilərsiniz."
            />
            <FAQItem
              question="Müştəri kartı başqasına versə nə olacaq?"
              answer="Sistemimizdə xüsusi vaxt limiti (cooldown) var. Eyni karta qısa müddət ərzində təkrar xal vurula bilməz, bu da sui-istifadənin qarşısını alır."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Bu gün başlayın
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
                İlk 14 gün pulsuz. Kredit kartı tələb olunmur.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
              >
                Pulsuz Sınaq
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Loyal.az</span>
            </div>

            <div className="flex items-center gap-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Məxfilik
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Şərtlər
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Əlaqə
              </a>
            </div>

            <div className="text-gray-500 text-sm">
              © 2024 Loyal.az. Bütün hüquqlar qorunur.
            </div>
          </div>
        </div>
      </footer>

      {/* Marquee Animation Styles */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}