"use client";

import React, { useState, useEffect } from 'react';
import { getInvoices } from '@/lib/api';
import { Receipt, Download, Filter, Plus, CheckCircle, Clock } from 'lucide-react';
import InvoiceModal from '@/components/InvoiceModal';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadInvoices = async () => {
    setIsLoading(true);
    const data = await getInvoices();
    setInvoices(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 className="title-xl" style={{ margin: 0 }}>Facturación</h1>
          <p className="text-muted" style={{ margin: 0 }}>Gestiona tus ingresos y emite facturas a tus pacientes.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary"><Download size={18} /> Exportar</button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Nueva Factura
          </button>
        </div>
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
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '18px 24px', fontWeight: 600, color: 'var(--color-primary-dark)' }}>{inv.id}</td>
                <td style={{ padding: '18px 24px' }}>{inv.patientName}</td>
                <td style={{ padding: '18px 24px', fontSize: '14px' }}>{inv.date}</td>
                <td style={{ padding: '18px 24px', fontSize: '14px' }}>{inv.description}</td>
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
    </div>
  );
}
