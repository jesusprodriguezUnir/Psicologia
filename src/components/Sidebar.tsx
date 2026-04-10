"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Users, Receipt, Settings, LogOut, Heart } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '48px', padding: '0 8px' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'var(--color-primary)', 
            color: 'white', 
            width: '36px', 
            height: '36px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderRadius: '10px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Heart size={20} fill="currentColor" />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)', margin: 0, lineHeight: 1 }}>Serenidad</h1>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Psicología</span>
          </div>
        </Link>
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <Link 
          href="/" 
          className={`btn btn-ghost ${isActive('/') ? 'active' : ''}`} 
          style={{ justifyContent: 'flex-start', border: 'none' }}
        >
          <Calendar size={20} />
          Agenda de Citas
        </Link>
        <Link 
          href="/pacientes" 
          className={`btn btn-ghost ${isActive('/pacientes') ? 'active' : ''}`} 
          style={{ justifyContent: 'flex-start', border: 'none' }}
        >
          <Users size={20} />
          Pacientes
        </Link>
        <Link 
          href="/facturacion" 
          className={`btn btn-ghost ${isActive('/facturacion') ? 'active' : ''}`} 
          style={{ justifyContent: 'flex-start', border: 'none' }}
        >
          <Receipt size={20} />
          Facturación
        </Link>
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ 
          padding: '16px', 
          backgroundColor: 'rgba(214, 125, 97, 0.05)', 
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
          border: '1px dashed var(--color-primary-light)'
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Modo Desarrollo</p>
          <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-primary-dark)', margin: 0 }}>Mock Data Activo</p>
        </div>
        
        <Link href="/settings" className={`btn btn-ghost ${isActive('/settings') ? 'active' : ''}`} style={{ justifyContent: 'flex-start' }}>
          <Settings size={20} />
          Configuración
        </Link>
        <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: '#b15e45' }}>
          <LogOut size={20} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
