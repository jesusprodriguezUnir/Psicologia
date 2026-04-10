"use client";

import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Printer, Download, X } from 'lucide-react';

interface InvoiceDetailProps {
  invoice: any;
  settings: any;
  patient: any;
  onClose: () => void;
}

export default function InvoiceDetail({ invoice, settings, patient, onClose }: InvoiceDetailProps) {
  const handlePrint = () => {
    window.print();
  };

  const calculateVAT = (amount: number) => amount * 0.21;
  const subtotal = invoice.amount / 1.21;
  const vat = invoice.amount - subtotal;

  return (
    <div style={{ 
      position: 'fixed', inset: 0, backgroundColor: 'rgba(45, 42, 38, 0.4)', 
      backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', zIndex: 1100 
    }}>
      <div className="card animate-slide-up no-print" style={{ 
        width: '800px', maxWidth: '95vw', padding: '0', position: 'relative',
        backgroundColor: '#f8f9fa', maxHeight: '90vh', overflowY: 'auto'
      }}>
        {/* Toolbar */}
        <div style={{ 
          padding: '16px 32px', borderBottom: '1px solid var(--border-color)', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 10
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Vista Previa de Factura</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handlePrint} className="btn btn-primary">
              <Printer size={18} /> Imprimir / PDF
            </button>
            <button onClick={onClose} className="btn btn-ghost">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Area */}
        <div id="invoice-printable" style={{ 
          backgroundColor: 'white', margin: '40px auto', padding: '60px', 
          width: '700px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          minHeight: '800px', color: '#1a1a1a', position: 'relative'
        }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '60px' }}>
            <div>
              {settings.logo ? (
                <img src={settings.logo} alt="Logo" style={{ height: '60px', marginBottom: '20px' }} />
              ) : (
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '10px' }}>
                  {settings.clinicName}
                </div>
              )}
              <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#444' }}>
                <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{settings.userName}</p>
                <p>{settings.clinicAddress}</p>
                <p>NIF: {settings.clinicNif}</p>
                {settings.professionalId && <p>Nº Colegiado: {settings.professionalId}</p>}
                <p>{settings.userPhone} | {settings.userEmail}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#e0e0e0', margin: '0 0 10px 0' }}>FACTURA</h1>
              <div style={{ fontSize: '14px' }}>
                <p><span style={{ color: '#999', fontWeight: 600 }}>Nº FACTURA:</span> {invoice.id}</p>
                <p><span style={{ color: '#999', fontWeight: 600 }}>FECHA:</span> {format(new Date(invoice.date), 'dd/MM/yyyy')}</p>
              </div>
            </div>
          </div>

          {/* Patient Info */}
          <div style={{ 
            backgroundColor: '#fafafa', padding: '24px', borderRadius: '12px', 
            marginBottom: '40px', border: '1px solid #eee' 
          }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#999', marginBottom: '12px', letterSpacing: '1px' }}>DATOS DEL CLIENTE</p>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <p style={{ fontWeight: 700, fontSize: '16px' }}>{invoice.patientName}</p>
              {patient && (
                <>
                  <p>DNI/NIE: {patient.dni}</p>
                  <p>{patient.address}</p>
                  <p>{patient.email}</p>
                </>
              )}
            </div>
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #1a1a1a' }}>
                <th style={{ padding: '12px 0', textAlign: 'left', fontSize: '13px' }}>CONCEPTO</th>
                <th style={{ padding: '12px 0', textAlign: 'right', fontSize: '13px', width: '120px' }}>BASE IMP.</th>
                <th style={{ padding: '12px 0', textAlign: 'right', fontSize: '13px', width: '80px' }}>IVA (21%)</th>
                <th style={{ padding: '12px 0', textAlign: 'right', fontSize: '13px', width: '120px' }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '20px 0', fontSize: '14px' }}>
                  <strong>{invoice.description}</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>Servicios de psicología clínica y psicoterapia</p>
                </td>
                <td style={{ padding: '20px 0', textAlign: 'right', fontSize: '14px' }}>{subtotal.toFixed(2)}€</td>
                <td style={{ padding: '20px 0', textAlign: 'right', fontSize: '14px' }}>{vat.toFixed(2)}€</td>
                <td style={{ padding: '20px 0', textAlign: 'right', fontSize: '15px', fontWeight: 700 }}>{invoice.amount.toFixed(2)}€</td>
              </tr>
            </tbody>
          </table>

          {/* Totals Section */}
          <div style={{ marginLeft: 'auto', width: '250px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>Subtotal:</span>
              <span>{subtotal.toFixed(2)}€</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>IVA (21%):</span>
              <span>{vat.toFixed(2)}€</span>
            </div>
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', padding: '16px 0', 
              fontSize: '20px', fontWeight: 800, borderTop: '2px solid #1a1a1a', marginTop: '8px' 
            }}>
              <span>TOTAL:</span>
              <span>{invoice.amount.toFixed(2)}€</span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ position: 'absolute', bottom: '60px', left: '60px', right: '60px' }}>
            <div style={{ fontSize: '10px', color: '#999', textAlign: 'center', lineHeight: '1.5' }}>
              <p>{settings.legalNotes}</p>
              <p style={{ marginTop: '10px' }}>Factura generada electrónicamente por {settings.clinicName}</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            -webkit-print-color-adjust: exact;
          }
          body * {
            visibility: hidden;
          }
          #invoice-printable, #invoice-printable * {
            visibility: visible;
          }
          #invoice-printable {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 80px 60px;
            width: 100%;
            height: 100%;
            box-shadow: none;
            box-sizing: border-box;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
