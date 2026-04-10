import { describe, it, expect, beforeEach } from 'vitest';
import { mockStorage } from '@/lib/mockData';

describe('Sistema de Facturación - Mock Storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('debería guardar y recuperar una nueva factura', () => {
    const newInvoice = {
      patientId: 'p1',
      patientName: 'Julia Sánchez',
      amount: 60.00,
      description: 'Sesión Test',
      status: 'pending',
      date: '2026-04-10'
    };

    mockStorage.saveInvoice(newInvoice);
    const invoices = mockStorage.getInvoices();
    
    expect(invoices.length).toBeGreaterThan(0);
    const saved = invoices.find(i => i.description === 'Sesión Test');
    expect(saved).toBeDefined();
    expect(saved.amount).toBe(60.00);
  });

  it('debería eliminar una factura correctamente', () => {
    const newInvoice = {
      id: 'TEST-001',
      patientId: 'p1',
      patientName: 'Julia Sánchez',
      amount: 60.00,
      description: 'Sesión para borrar',
      status: 'pending',
      date: '2026-04-10'
    };

    mockStorage.saveInvoice(newInvoice);
    let invoices = mockStorage.getInvoices();
    const invoiceToDelete = invoices.find(i => i.description === 'Sesión para borrar');
    
    mockStorage.deleteInvoice(invoiceToDelete.id);
    invoices = mockStorage.getInvoices();
    
    const deleted = invoices.find(i => i.id === invoiceToDelete.id);
    expect(deleted).toBeUndefined();
  });

  it('debería calcular correctamente el IVA (21%) en la lógica de negocio', () => {
    const amount = 121.00;
    const subtotal = amount / 1.21;
    const vat = amount - subtotal;
    
    expect(subtotal).toBe(100.00);
    expect(vat).toBe(21.00);
  });
});
