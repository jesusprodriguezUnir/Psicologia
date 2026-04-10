"use client";

import React, { useState, useEffect } from 'react';
import { getInvoices, getSettings, getPatients, deleteInvoice } from '@/lib/api';
import { Receipt, Download, Filter, Plus, CheckCircle, Clock, Eye, Paperclip, Trash2 } from 'lucide-react';
import InvoiceModal from '@/components/InvoiceModal';
import InvoiceDetail from '@/components/InvoiceDetail';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Invoice Selection & Printing
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [allPatients, setAllPatients] = useState<any[]>([]);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    const [invData, settingsData, patientsData] = await Promise.all([
      getInvoices(),
      getSettings(),
      getPatients()
    ]);
    setInvoices(invData);
    setSettings(settingsData);
    setAllPatients(patientsData);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadInvoices = loadData; // Alias for compatibility with InvoiceModal callback

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
      await deleteInvoice(id);
      loadData();
    }
  };

  const handleExport = () => {
    const headers = ['Nº Factura', 'Paciente', 'Fecha', 'Concepto', 'Importe', 'Estado'];
    const rows = invoices.map(inv => [
      inv.id,
      inv.patientName,
      inv.date,
      inv.description,
      inv.amount.toFixed(2),
      inv.status === 'paid' ? 'Pagada' : 'Pendiente'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `facturas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesDate = !dateFilter || inv.date.includes(dateFilter);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = filteredInvoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 className="title-xl" style={{ margin: 0 }}>Facturación</h1>
          <p className="text-muted" style={{ margin: 0 }}>Gestiona tus ingresos y emite facturas a tus pacientes.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={handleExport}><Download size={18} /> Exportar</button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Nueva Factura
          </button>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px' }}>
          <Filter size={18} className="text-muted" />
          <input 
            type="text" 
            placeholder="Buscar por paciente..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }}
          />
        </div>
        <select 
          className="card"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '12px 20px', fontSize: '14px', border: '1px solid var(--border-color)', outline: 'none', cursor: 'pointer' }}
        >
          <option value="all">Todos los estados</option>
          <option value="paid">Pagadas</option>
          <option value="pending">Pendientes</option>
        </select>
        <input 
          type="month"
          className="card"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ padding: '12px 20px', fontSize: '14px', border: '1px solid var(--border-color)', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(214, 125, 97, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-dark)' }}>
            <Receipt size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Facturado</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>{totalAmount.toFixed(2)}€</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(168, 181, 162, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6954' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Cobrado</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>{paidAmount.toFixed(2)}€</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(233, 216, 166, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b08d2b' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Pendiente</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>{pendingAmount.toFixed(2)}€</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '14px' }}>Nº Factura</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '14px' }}>Paciente</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '14px' }}>Fecha</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '14px' }}>Concepto</th>
               <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '14px' }}>Importe</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '14px' }}>Estado</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: '14px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '18px 24px', fontWeight: 600, color: 'var(--color-primary-dark)' }}>{inv.id}</td>
                <td style={{ padding: '18px 24px' }}>{inv.patientName}</td>
                <td style={{ padding: '18px 24px', fontSize: '14px' }}>{inv.date}</td>
                <td style={{ padding: '18px 24px', fontSize: '14px' }}>
                  {inv.description}
                  {inv.attachment && <Paperclip size={14} style={{ marginLeft: '8px', color: 'var(--text-muted)' }} title="Tiene adjunto" />}
                </td>
                <td style={{ padding: '18px 24px', fontWeight: 700 }}>{inv.amount.toFixed(2)}€</td>
                <td style={{ padding: '18px 24px' }}>
                  <div style={{ 
                    display: 'inline-flex', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                    backgroundColor: inv.status === 'paid' ? 'rgba(168, 181, 162, 0.2)' : 'rgba(233, 216, 166, 0.3)',
                    color: inv.status === 'paid' ? '#5a6954' : '#b08d2b'
                  }}>
                    {inv.status === 'paid' ? 'Pagada' : 'Pendiente'}
                  </div>
                </td>
                <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => setSelectedInvoice(inv)} className="btn btn-ghost" style={{ padding: '8px' }} title="Ver Factura">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleDelete(inv.id)} className="btn btn-ghost" style={{ padding: '8px', color: '#dc2626' }} title="Eliminar Factura">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InvoiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaved={loadInvoices}
      />

      {selectedInvoice && (
        <InvoiceDetail 
          invoice={selectedInvoice}
          settings={settings}
          patient={allPatients.find(p => p.id === selectedInvoice.patientId)}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
