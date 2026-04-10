import { supabase } from './supabase';
import { mockStorage } from './mockData';

export type Appointment = {
  id: string;
  patientId?: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string;
  startTime: Date;
  endTime: Date;
  type: 'first_visit' | 'followup' | 'urgent';
  notes: string;
};

// Helper para saber si estamos en modo MOCK
export const isMockMode = () => {
  return process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
}

// --- APPOINTMENTS ---

export async function getAppointments(): Promise<Appointment[]> {
  if (isMockMode()) {
    return Promise.resolve(mockStorage.getAppointments());
  }

  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        title,
        start_time,
        appointment_type,
        patients (
          id,
          name,
          phone,
          email,
          notes
        )
      `);
      
    if (error) throw error;
    if (!data) return [];

    return data.map((item: any) => {
      const start = new Date(item.start_time);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // Default duration 1h
      return {
        id: item.id,
        patientId: item.patients?.id,
        patient_name: item.patients?.name || 'Desconocido',
        patient_phone: item.patients?.phone || '',
        patient_email: item.patients?.email || '',
        startTime: start,
        endTime: end,
        type: item.appointment_type,
        notes: item.patients?.notes || ''
      };
    });
  } catch (err) {
    console.error("❌ Supabase Error: ", err);
    return [];
  }
}

export async function saveAppointment(app: Partial<Appointment>) {
  if (isMockMode()) {
    mockStorage.saveAppointment(app);
    return Promise.resolve();
  }
  // Supabase implementation here...
}

// --- PATIENTS ---

export async function getPatients() {
  if (isMockMode()) return Promise.resolve(mockStorage.getPatients());
  return [];
}

export async function savePatient(patient: any) {
  if (isMockMode()) {
    mockStorage.savePatient(patient);
    return Promise.resolve();
  }
  // Supabase implementation here...
}

// --- INVOICES ---

export async function getInvoices() {
  if (isMockMode()) return Promise.resolve(mockStorage.getInvoices());
  return [];
}

export async function saveInvoice(invoice: any) {
  if (isMockMode()) {
    mockStorage.saveInvoice(invoice);
    return Promise.resolve();
  }
  // Supabase implementation here...
}

export async function deleteInvoice(id: string) {
  if (isMockMode()) {
    mockStorage.deleteInvoice(id);
    return Promise.resolve();
  }
  // Supabase implementation here...
}

// --- SETTINGS ---

export async function getSettings() {
  if (isMockMode()) return Promise.resolve(mockStorage.getSettings());
  return null;
}

export async function saveSettings(settings: any) {
  if (isMockMode()) {
    mockStorage.saveSettings(settings);
    return Promise.resolve();
  }
  // Supabase implementation here...
}

export function resetApplicationData() {
  if (isMockMode()) {
    mockStorage.resetData();
  }
}
