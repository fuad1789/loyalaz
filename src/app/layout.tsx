import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Loyal.az - Rəqəmsal Sadiqlit Kartı',
  description: 'Biznesiniz üçün rəqəmsal sadiqlit kartı həlli. Müştərilərinizi mükafatlandırın, biznesinizi inkişaf etdirin.',
  keywords: 'sadiqlit kartı, bonus kartı, müştəri proqramı, azərbaycan',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}