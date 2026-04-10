/**
 * Mock Data Storage System
 * Manages patients, appointments, and invoices in localStorage for high-fidelity demos.
 */

const STORAGE_KEY_PATIENTS = 'clinic_mock_patients';
const STORAGE_KEY_APPOINTMENTS = 'clinic_mock_appointments';
const STORAGE_KEY_INVOICES = 'clinic_mock_invoices';

// --- Initial Seed Data ---

const INITIAL_PATIENTS = [
  {
    id: 'p1',
    name: 'Julia Sánchez',
    phone: '+34 600 123 456',
    email: 'julia@example.com',
    dni: '12345678X',
    address: 'Calle Mayor 1, Madrid',
    bankTitle: 'Banco Santander',
    iban: 'ES00 0000 0000 0000 0000 0000',
    notes: 'Ansiedad recurrente, primera sesión excelente.',
    lastVisit: '2026-04-10',
    totalSessions: 5
  },
  {
    id: 'p2',
    name: 'Carlos Mendoza',
    phone: '+34 600 987 654',
    email: 'carlos@example.com',
    dni: '87654321Y',
    address: 'Avenida Libertad 5, Pozuelo',
    bankTitle: 'BBVA',
    iban: 'ES11 1111 1111 1111 1111 1111',
    notes: 'Revisión mensual.',
    lastVisit: '2026-04-05',
    totalSessions: 12
  }
];

const INITIAL_APPOINTMENTS = [
  {
    id: '1',
    patientId: 'p1',
    patient_name: 'Julia Sánchez',
    patient_phone: '+34 600 123 456',
    patient_email: 'julia@example.com',
    startTime: new Date().toISOString(), 
    endTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
    type: 'first_visit',
    notes: 'Ansiedad recurrente.'
  },
  {
    id: '2',
    patientId: 'p2',
    patient_name: 'Carlos Mendoza',
    patient_phone: '+34 600 987 654',
    patient_email: 'carlos@example.com',
    startTime: new Date().toISOString(),
    endTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
    type: 'followup',
    notes: 'Revisión mensual.'
  }
];

const INITIAL_INVOICES = [
  {
    id: 'INV-2026-001',
    patientId: 'p1',
    patientName: 'Julia Sánchez',
    date: '2026-04-10',
    amount: 60.00,
    status: 'paid',
    description: 'Sesión Psicoterapia Individual'
  }
];

// --- Store Management ---

function getStoredData<T>(key: string, initial: T): T {
  if (typeof window === 'undefined') return initial;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
}

function saveStoredData<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// --- exported API ---

export const mockStorage = {
  // Patients
  getPatients: () => getStoredData(STORAGE_KEY_PATIENTS, INITIAL_PATIENTS),
  savePatient: (patient: any) => {
    const patients = mockStorage.getPatients();
    const index = patients.findIndex((p: any) => p.id === patient.id);
    if (index >= 0) {
      patients[index] = { ...patients[index], ...patient };
    } else {
      patients.push({ ...patient, id: `p${Date.now()}`, totalSessions: 0 });
    }
    saveStoredData(STORAGE_KEY_PATIENTS, patients);
  },

  // Appointments
  getAppointments: () => {
    const apps = getStoredData(STORAGE_KEY_APPOINTMENTS, INITIAL_APPOINTMENTS);
    return apps.map((a: any) => ({ 
      ...a, 
      startTime: new Date(a.startTime),
      endTime: new Date(a.endTime)
    }));
  },
  saveAppointment: (app: any) => {
    const apps = getStoredData(STORAGE_KEY_APPOINTMENTS, INITIAL_APPOINTMENTS);
    const index = apps.findIndex((a: any) => a.id === app.id);
    const dataToSave = { 
      ...app, 
      startTime: app.startTime.toISOString(),
      endTime: app.endTime.toISOString()
    };
    if (index >= 0) {
      apps[index] = { ...apps[index], ...dataToSave };
    } else {
      apps.push({ ...dataToSave, id: `${Date.now()}` });
    }
    saveStoredData(STORAGE_KEY_APPOINTMENTS, apps);
  },

  // Invoices
  getInvoices: () => getStoredData(STORAGE_KEY_INVOICES, INITIAL_INVOICES),
  saveInvoice: (inv: any) => {
    const invoices = mockStorage.getInvoices();
    const index = invoices.findIndex((i: any) => i.id === inv.id);
    if (index >= 0) {
      invoices[index] = { ...invoices[index], ...inv };
    } else {
      invoices.push({ ...inv, id: `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}` });
    }
    saveStoredData(STORAGE_KEY_INVOICES, invoices);
  }
};
