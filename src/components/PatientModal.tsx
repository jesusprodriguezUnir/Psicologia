"use client";

import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, MapPin, CreditCard, Save } from 'lucide-react';
import { savePatient } from '@/lib/api';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  patient?: any; // If provided, we are editing
}

export default function PatientModal({ isOpen, onClose, onSaved, patient }: PatientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dni: '',
    address: '',
    bankTitle: '',
    iban: '',
    notes: ''
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        phone: patient.phone || '',
        email: patient.email || '',
        dni: patient.dni || '',
        address: patient.address || '',
        bankTitle: patient.bankTitle || '',
        iban: patient.iban || '',
        notes: patient.notes || ''
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        dni: '',
        address: '',
        bankTitle: '',
        iban: '',
        notes: ''
      });
    }
  }, [patient, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await savePatient({
      ...patient, // include id if editing
      ...formData
    });
    onSaved();
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ 
      position: 'fixed', inset: 0, backgroundColor: 'rgba(45, 42, 38, 0.4)', 
      backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', zIndex: 1000 
    }}>
      <div className="card animate-slide-up" style={{ 
        width: '600px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', 
        padding: '32px', position: 'relative' 
      }}>
        <button onClick={onClose} style={{ position: 'absolute', right: '24px', top: '24px' }} className="btn-ghost">
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: 'var(--color-primary-dark)' }}>
          {patient ? 'Editar Paciente' : 'Nuevo Paciente'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            
            {/* Información Básica */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>NOMBRE COMPLETO</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                <input required name="name" value={formData.name} onChange={handleChange} type="text" className="form-input" style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>TELÉFONO</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                <input required name="phone" value={formData.phone} onChange={handleChange} type="text" className="form-input" style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>EMAIL</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                <input required name="email" value={formData.email} onChange={handleChange} type="email" className="form-input" style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>DNI / NIE</label>
              <input name="dni" value={formData.dni} onChange={handleChange} type="text" style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>DIRECCIÓN</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                <input name="address" value={formData.address} onChange={handleChange} type="text" style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
              </div>
            </div>

            {/* Datos Bancarios */}
            <div style={{ gridColumn: 'span 2', marginTop: '12px' }}>
              <h3 style={{ fontSize: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px', color: 'var(--color-primary)' }}>DATOS BANCARIOS</h3>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>BANCO</label>
              <input name="bankTitle" value={formData.bankTitle} onChange={handleChange} type="text" placeholder="Ej: Santander" style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>IBAN</label>
              <div style={{ position: 'relative' }}>
                <CreditCard size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                <input name="iban" value={formData.iban} onChange={handleChange} type="text" placeholder="ES00 0000..." style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
              </div>
            </div>

            <div style={{ gridColumn: 'span 2', marginTop: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>NOTAS CLÍNICAS / OBSERVACIONES</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', minHeight: '100px', fontFamily: 'inherit' }}></textarea>
            </div>

          </div>

          <div style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancelar</button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              {patient ? 'Guardar Cambios' : 'Crear Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
