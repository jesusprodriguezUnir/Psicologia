"use client";

import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings, resetApplicationData } from '@/lib/api';
import { 
  User, Mail, Phone, Building, MapPin, 
  CreditCard, Save, RefreshCw, Trash2, 
  AlertTriangle, Check, Globe, Plus
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getSettings();
      setSettings(data);
    };
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings((prev: any) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await saveSettings(settings);
    setIsSaving(false);
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  const handleReset = () => {
    resetApplicationData();
  };

  if (!settings) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
      <RefreshCw className="animate-spin" size={32} color="var(--color-primary)" />
    </div>
  );

  return (
    <div className="animate-slide-up" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="title-xl" style={{ margin: 0 }}>Configuración</h1>
        <p className="text-muted" style={{ margin: 0 }}>Gestiona tu perfil profesional y los datos fiscales de tu gabinete.</p>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Perfil Profesional */}
          <section className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(214, 125, 97, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-dark)' }}>
                <User size={20} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Perfil del Profesional</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 150px) 1fr', gap: '32px', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <label className="label-sm">LOGO DE EMPRESA</label>
                <div 
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  style={{ 
                    width: '120px', height: '120px', borderRadius: '16px', border: '2px dashed var(--border-color)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden',
                    backgroundColor: '#fafafa', position: 'relative'
                  }}
                >
                  {settings.logo ? (
                    <img src={settings.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      <Plus size={24} style={{ marginBottom: '4px' }} />
                      <div style={{ fontSize: '10px' }}>Subir logo</div>
                    </div>
                  )}
                  <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label className="label-sm">NOMBRE COMPLETO</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input 
                      name="userName" 
                      value={settings.userName} 
                      onChange={handleChange} 
                      type="text" 
                      style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '15px' }} 
                    />
                  </div>
                </div>
                <div>
                  <label className="label-sm">Nº DE COLEGIADO</label>
                  <input 
                    name="professionalId" 
                    value={settings.professionalId || ''} 
                    onChange={handleChange} 
                    type="text" 
                    placeholder="Ej: M-12345"
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '15px' }} 
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <label className="label-sm">EMAIL PROFESIONAL</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input 
                    name="userEmail" 
                    value={settings.userEmail} 
                    onChange={handleChange} 
                    type="email" 
                    style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '15px' }} 
                  />
                </div>
              </div>
              <div>
                <label className="label-sm">TELÉFONO DE CONTACTO</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input 
                    name="userPhone" 
                    value={settings.userPhone} 
                    onChange={handleChange} 
                    type="text" 
                    style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '15px' }} 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Datos del Gabinete */}
          <section className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(168, 181, 162, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6954' }}>
                <Building size={20} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Datos del Gabinete y Facturación</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="label-sm">NOMBRE DEL GABINETE / RAZÓN SOCIAL</label>
                <div style={{ position: 'relative' }}>
                  <Globe size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input 
                    name="clinicName" 
                    value={settings.clinicName} 
                    onChange={handleChange} 
                    type="text" 
                    style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '15px' }} 
                  />
                </div>
              </div>
              <div>
                <label className="label-sm">NIF / CIF</label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input 
                    name="clinicNif" 
                    value={settings.clinicNif} 
                    onChange={handleChange} 
                    type="text" 
                    style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '15px' }} 
                  />
                </div>
              </div>
              <div>
                <label className="label-sm">MONEDA</label>
                <input 
                  name="currency" 
                  value={settings.currency} 
                  onChange={handleChange} 
                  type="text" 
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '15px' }} 
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="label-sm">DIRECCIÓN FISCAL</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input 
                    name="clinicAddress" 
                    value={settings.clinicAddress} 
                    onChange={handleChange} 
                    type="text" 
                    style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '15px' }} 
                  />
                </div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="label-sm">PIE DE FACTURA (TEXTO LEGAL / RGPD)</label>
                <textarea 
                  name="legalNotes" 
                  value={settings.legalNotes || ''} 
                  onChange={handleChange} 
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '13px', minHeight: '80px', fontFamily: 'inherit' }} 
                />
              </div>
            </div>
          </section>

          {/* Zona de Peligro */}
          <section className="card" style={{ padding: '32px', border: '1px solid #fee2e2', backgroundColor: '#fef2f2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <AlertTriangle size={20} color="#dc2626" />
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#991b1b' }}>Zona de Peligro</h2>
            </div>
            <p style={{ fontSize: '14px', color: '#991b1b', marginBottom: '24px' }}>
              Al resetear la aplicación se borrarán todos los pacientes, citas y facturas guardadas en este navegador. Esta acción es irreversible.
            </p>
            {!showResetConfirm ? (
              <button 
                type="button" 
                onClick={() => setShowResetConfirm(true)}
                className="btn btn-secondary" 
                style={{ backgroundColor: 'white', color: '#dc2626', borderColor: '#fecaca' }}
              >
                <Trash2 size={18} /> Resetear todos los datos
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button 
                  type="button" 
                  onClick={handleReset}
                  className="btn btn-primary" 
                  style={{ backgroundColor: '#dc2626' }}
                >
                  Confirmar Reseteo
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowResetConfirm(false)}
                  className="btn btn-ghost"
                >
                  Cancelar
                </button>
              </div>
            )}
          </section>

        </div>

        <div style={{ marginTop: '40px', position: 'sticky', bottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '12px 32px', height: '48px', fontSize: '16px', boxShadow: 'var(--shadow-md)' }}
            disabled={isSaving}
          >
            {isSaving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          
          {showSavedMsg && (
            <div className="animate-fade-in" style={{ 
              position: 'absolute', right: '0', top: '-48px', 
              backgroundColor: '#ecfdf5', color: '#065f46', 
              padding: '8px 16px', borderRadius: '8px', 
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '14px', fontWeight: 600, border: '1px solid #a7f3d0'
            }}>
              <Check size={16} /> Configuración guardada correctamente
            </div>
          )}
        </div>
      </form>

      <style jsx>{`
        .label-sm {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
}
