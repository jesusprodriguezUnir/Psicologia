"use client";

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Save, FileText } from 'lucide-react';
import { saveAppointment, getPatients, Appointment } from '@/lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  defaultDate?: Date;
  defaultTime?: string;
  appointment?: Appointment | null;
}

export default function AppointmentModal({ 
  isOpen, 
  onClose, 
  onSaved, 
  defaultDate, 
  defaultTime,
  appointment 
}: AppointmentModalProps) {
  const [patients, setPatients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    patientId: '',
    patient_name: '',
    date: '',
    startTime: '10:00',
    endTime: '11:00',
    type: 'followup' as 'first_visit' | 'followup' | 'urgent',
    notes: ''
  });

  useEffect(() => {
    async function load() {
      const data = await getPatients();
      setPatients(data);
    }
    if (isOpen) load();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (appointment) {
        setFormData({
          patientId: appointment.patientId || '',
          patient_name: appointment.patient_name,
          date: format(appointment.startTime, 'yyyy-MM-dd'),
          startTime: format(appointment.startTime, 'HH:mm'),
          endTime: format(appointment.endTime, 'HH:mm'),
          type: appointment.type,
          notes: appointment.notes
        });
      } else {
        setFormData({
          patientId: '',
          patient_name: '',
          date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
          startTime: defaultTime || '10:00',
          endTime: defaultTime ? format(new Date(new Date(`2000-01-01T${defaultTime}`).getTime() + 60 * 60 * 1000), 'HH:mm') : '11:00',
          type: 'followup',
          notes: ''
        });
      }
    }
  }, [isOpen, appointment, defaultDate, defaultTime]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPatient = patients.find(p => p.id === formData.patientId);
    
    const start = new Date(`${formData.date}T${formData.startTime}`);
    const end = new Date(`${formData.date}T${formData.endTime}`);

    await saveAppointment({
      ...appointment,
      patientId: formData.patientId,
      patient_name: selectedPatient ? selectedPatient.name : formData.patient_name,
      patient_phone: selectedPatient?.phone || '+34 600 000 000',
      patient_email: selectedPatient?.email || 'test@example.com',
      startTime: start,
      endTime: end,
      type: formData.type,
      notes: formData.notes
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
          {appointment ? 'Editar Cita' : 'Nueva Cita'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Paciente */}
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
                  <option value="custom">-- Otro (Escribir nombre) --</option>
                </select>
              </div>
              {formData.patientId === 'custom' && (
                <input 
                  type="text" 
                  name="patient_name" 
                  placeholder="Nombre del paciente" 
                  value={formData.patient_name} 
                  onChange={handleChange}
                  style={{ width: '100%', marginTop: '8px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                  required
                />
              )}
            </div>

            {/* Fecha y Horas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>FECHA</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                  <input required name="date" value={formData.date} onChange={handleChange} type="date" style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>INICIO</label>
                <div style={{ position: 'relative' }}>
                  <Clock size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                  <input required name="startTime" value={formData.startTime} onChange={handleChange} type="time" style={{ width: '100%', padding: '10px 10px 10px 32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '13px' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>FIN</label>
                <div style={{ position: 'relative' }}>
                  <Clock size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                  <input required name="endTime" value={formData.endTime} onChange={handleChange} type="time" style={{ width: '100%', padding: '10px 10px 10px 32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '13px' }} />
                </div>
              </div>
            </div>

            {/* Tipo de Cita */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>TIPO DE SESIÓN</label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
              >
                <option value="first_visit">Primera Visita</option>
                <option value="followup">Seguimiento</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            {/* Notas */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>NOTAS</label>
              <div style={{ position: 'relative' }}>
                <FileText size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                <textarea 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleChange} 
                  placeholder="Añadir observaciones..."
                  style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', minHeight: '80px', fontFamily: 'inherit' }}
                />
              </div>
            </div>

          </div>

          <div style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancelar</button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              {appointment ? 'Guardar Cambios' : 'Agendar Cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
