"use client";

import React, { useState, useEffect } from 'react';
import { X, Receipt, Calendar, User, Save, Euro, Image as ImageIcon, Plus } from 'lucide-react';
import { saveInvoice, getPatients } from '@/lib/api';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function InvoiceModal({ isOpen, onClose, onSaved }: InvoiceModalProps) {
  const [patients, setPatients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    amount: '',
    description: 'Sesión Psicoterapia Individual',
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    attachment: null as string | null
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, attachment: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    async function load() {
      const data = await getPatients();
      setPatients(data);
    }
    if (isOpen) load();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPatient = patients.find(p => p.id === formData.patientId);
    await saveInvoice({
      ...formData,
      amount: parseFloat(formData.amount),
      patientName: selectedPatient ? selectedPatient.name : formData.patientName
    });
    onSaved();
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        width: '500px', maxWidth: '95vw', padding: '32px', position: 'relative' 
      }}>
        <button onClick={onClose} style={{ position: 'absolute', right: '24px', top: '24px' }} className="btn-ghost">
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: 'var(--color-primary-dark)' }}>
          Nueva Factura
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>PACIENTE</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                <select 
                  required 
                  name="patientId" 
                  value={formData.patientId} 
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
                >
                  <option value="">Seleccionar paciente...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>IMPORTE (€)</label>
              <div style={{ position: 'relative' }}>
                <Euro size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                <input required name="amount" value={formData.amount} onChange={handleChange} type="number" step="0.01" style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>CONCEPTO</label>
              <div style={{ position: 'relative' }}>
                <Receipt size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                <input required name="description" value={formData.description} onChange={handleChange} type="text" style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>FECHA</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                <input required name="date" value={formData.date} onChange={handleChange} type="date" style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>ESTADO</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
              >
                <option value="pending">Pendiente</option>
                <option value="paid">Pagada</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>ADJUNTAR TICKET / IMAGEN</label>
              <div 
                onClick={() => document.getElementById('attachment-upload')?.click()}
                style={{ 
                  width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '10px',
                  backgroundColor: '#fafafa'
                }}
              >
                {formData.attachment ? (
                  <>
                    <ImageIcon size={18} color="var(--color-primary)" />
                    <span style={{ fontSize: '13px', color: 'var(--color-primary-dark)', fontWeight: 600 }}>Imagen adjuntada</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} color="var(--text-muted)" />
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Subir imagen del ticket</span>
                  </>
                )}
                <input id="attachment-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </div>
            </div>

          </div>

          <div style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancelar</button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              Crear Factura
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
