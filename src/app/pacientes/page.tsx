"use client";

import React, { useState, useEffect } from 'react';
import { getPatients } from '@/lib/api';
import { User, Phone, Mail, Search, Plus, Filter, MoreVertical, ExternalLink, Pencil } from 'lucide-react';
import PatientModal from '@/components/PatientModal';

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const loadPatients = async () => {
    setIsLoading(true);
    const data = await getPatients();
    setPatients(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (p: any) => {
    setSelectedPatient(p);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedPatient(null);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 className="title-xl" style={{ margin: 0 }}>Fichero de Pacientes</h1>
          <p className="text-muted" style={{ margin: 0 }}>Gestiona la información, datos bancarios e historial de tus pacientes.</p>
        </div>
        <button className="btn btn-primary" onClick={handleNew}>
          <Plus size={18} /> Nuevo Paciente
        </button>
      </div>

      <div className="card" style={{ marginBottom: '32px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '12px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px 16px 12px 48px', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              fontSize: '15px'
            }}
          />
        </div>
        <button className="btn btn-secondary">
          <Filter size={18} /> Filtros
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '14px', color: 'var(--text-muted)' }}>Paciente</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '14px', color: 'var(--text-muted)' }}>Contacto y DNI</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '14px', color: 'var(--text-muted)' }}>Banco / IBAN</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '14px', color: 'var(--text-muted)' }}>Sesiones</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '14px', color: 'var(--text-muted)' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id} style={{ borderBottom: '1px solid var(--border-light)' }} className="table-row-hover">
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(214, 125, 97, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-dark)' }}>
                      <User size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '15px' }}>{patient.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{patient.address || 'Sin dirección'}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '13px' }}>{patient.phone}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{patient.email}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 700 }}>{patient.dni || 'SIN DNI'}</div>
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{patient.bankTitle || '—'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{patient.iban || 'Sin IBAN'}</div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '12px', backgroundColor: 'rgba(168, 181, 162, 0.1)', color: '#5a6954', fontSize: '13px', fontWeight: 600 }}>
                    {patient.totalSessions} ses.
                  </span>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(patient)} className="btn btn-ghost" style={{ padding: '8px' }} title="Editar">
                      <Pencil size={18} />
                    </button>
                    <button className="btn btn-ghost" style={{ padding: '8px' }}>
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PatientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaved={loadPatients}
        patient={selectedPatient}
      />

      <style jsx>{`
        .table-row-hover:hover { background-color: #fdfcfb; }
      `}</style>
    </div>
  );
}
