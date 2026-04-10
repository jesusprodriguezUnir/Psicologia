import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import './globals.css';

const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Gabinete Psicológico | Gestión Profesional',
  description: 'Aplicación para la gestión de gabinete psicológico',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={outfit.className}>
        <div className="app-layout">
          <Sidebar />
          <main className="main-container">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
