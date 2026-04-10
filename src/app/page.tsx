"use client";

import React, { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays,
  subDays,
  startOfDay,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  ChevronLeft, ChevronRight, Plus, Mail, MessageCircle, 
  User, Clock, LayoutGrid, List, Columns 
} from 'lucide-react';
import AppointmentModal from '@/components/AppointmentModal';
import PatientModal from '@/components/PatientModal';
import { getAppointments, saveAppointment, getPatients, Appointment } from '@/lib/api';

type ViewMode = 'month' | 'week' | 'day';

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultTime, setModalDefaultTime] = useState('10:00');
  const [modalAppointment, setModalAppointment] = useState<Appointment | null>(null);

  // Patient Modal State
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [selectedPatientForModal, setSelectedPatientForModal] = useState<any>(null);

  // Load appointments
  const loadData = async () => {
    setIsLoading(true);
    const data = await getAppointments();
    setAppointments(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  // Navegación
  const next = () => {
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const prev = () => {
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  // Handlers
  const handleCellClick = (date: Date, time: string = '10:00') => {
    setSelectedDate(date);
    setModalDefaultTime(time);
    setModalAppointment(null);
    setIsModalOpen(true);
  };

  const handleEditAppointment = (app: Appointment) => {
    setModalAppointment(app);
    setIsModalOpen(true);
  };

  const handleViewPatient = async (patientId?: string) => {
    if (!patientId) return;
    const allPatients = await getPatients();
    const patient = allPatients.find((p: any) => p.id === patientId);
    if (patient) {
      setSelectedPatientForModal(patient);
      setIsPatientModalOpen(true);
    }
  };

  // --- RENDERS ---

  const renderHeader = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
      <div>
        <h1 className="title-xl" style={{ margin: 0, textTransform: 'capitalize' }}>
          {viewMode === 'month' 
            ? format(currentDate, 'MMMM yyyy', { locale: es })
            : viewMode === 'week'
              ? `Semana del ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMMM', { locale: es })}`
              : format(currentDate, "EEEE, d 'de' MMMM", { locale: es })
          }
        </h1>
        <p className="text-muted" style={{ margin: 0 }}>Gestiona tus sesiones y pacientes.</p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* View Switcher */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-sidebar)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <button 
            onClick={() => setViewMode('month')} 
            className={`btn-ghost ${viewMode === 'month' ? 'active' : ''}`} 
            style={{ padding: '8px 12px', fontSize: '13px' }}
          >
            <LayoutGrid size={16} /> Mes
          </button>
          <button 
            onClick={() => setViewMode('week')} 
            className={`btn-ghost ${viewMode === 'week' ? 'active' : ''}`} 
            style={{ padding: '8px 12px', fontSize: '13px' }}
          >
            <Columns size={16} /> Semana
          </button>
          <button 
            onClick={() => setViewMode('day')} 
            className={`btn-ghost ${viewMode === 'day' ? 'active' : ''}`} 
            style={{ padding: '8px 12px', fontSize: '13px' }}
          >
            <List size={16} /> Día
          </button>
        </div>

        <div style={{ display: 'flex', backgroundColor: 'var(--bg-sidebar)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <button onClick={prev} className="btn-ghost" style={{ padding: '8px' }}><ChevronLeft size={20} /></button>
          <button onClick={next} className="btn-ghost" style={{ padding: '8px' }}><ChevronRight size={20} /></button>
        </div>
        
        <button className="btn btn-primary" style={{ height: '44px' }} onClick={() => handleCellClick(new Date())}>
          <Plus size={18} /> Nueva Cita
        </button>
      </div>
    </div>
  );

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    
    return (
      <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: '#fcfaf8', borderBottom: '1px solid var(--border-color)' }}>
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
            <div key={d} style={{ padding: '16px 8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: 'var(--border-light)' }}>
          {calendarDays.map(day => {
            const dayApps = appointments.filter(a => isSameDay(a.startTime, day));
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div 
                key={day.toString()} 
                onClick={() => handleCellClick(day)}
                style={{
                  minHeight: '120px',
                  padding: '10px',
                  backgroundColor: !isCurrentMonth ? 'transparent' : isSelected ? 'rgba(214, 125, 97, 0.03)' : 'var(--bg-card)',
                  borderRight: '1px solid var(--border-light)',
                  borderBottom: '1px solid var(--border-light)',
                  opacity: isCurrentMonth ? 1 : 0.4,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ 
                    fontWeight: 600, fontSize: '13px', 
                    backgroundColor: isToday ? 'var(--color-primary)' : 'transparent',
                    color: isToday ? 'white' : 'inherit',
                    width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px'
                  }}>
                    {format(day, 'd')}
                  </span>
                  {dayApps.length > 0 && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', marginTop: '8px' }}></div>}
                </div>
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {dayApps.slice(0, 2).map(app => (
                    <div 
                      key={app.id} 
                      onClick={(e) => { e.stopPropagation(); setSelectedAppointment(app); }}
                      style={{ 
                        fontSize: '10px', padding: '3px 6px', borderRadius: '4px', backgroundColor: '#f8f5f2', borderLeft: '2px solid var(--color-primary)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                      }}
                    >
                      {format(app.startTime, 'HH:mm')} {app.patient_name.split(' ')[0]}
                    </div>
                  ))}
                  {dayApps.length > 2 && <div style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'center' }}>+{dayApps.length - 2} más</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAgendaView = (isWeek: boolean) => {
    const start = isWeek ? startOfWeek(currentDate, { weekStartsOn: 1 }) : startOfDay(currentDate);
    const end = isWeek ? endOfWeek(start, { weekStartsOn: 1 }) : startOfDay(currentDate); 
    const days = isWeek ? eachDayOfInterval({ start, end }) : [start];
    
    // Hours from 08:00 to 20:00
    const hours = Array.from({ length: 13 }, (_, i) => i + 8);

    return (
      <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '700px' }}>
        {/* Header Días */}
        <div style={{ display: 'flex', backgroundColor: '#fcfaf8', borderBottom: '1px solid var(--border-color)', paddingLeft: '80px' }}>
          {days.map(d => (
            <div key={d.toString()} style={{ flex: 1, padding: '16px 8px', textAlign: 'center', borderRight: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{format(d, 'EEE', { locale: es })}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: isSameDay(d, new Date()) ? 'var(--color-primary)' : 'inherit' }}>{format(d, 'd')}</div>
            </div>
          ))}
        </div>
        
        {/* Grid Horario */}
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative', display: 'flex' }}>
          {/* Time gutter */}
          <div style={{ width: '80px', flexShrink: 0, borderRight: '1px solid var(--border-color)', backgroundColor: '#fcfaf8' }}>
            {hours.map(h => (
              <div key={h} style={{ height: '80px', padding: '10px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right', borderBottom: '1px solid var(--border-light)' }}>
                {h.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>
          
          {/* Columns */}
          <div style={{ flex: 1, display: 'flex' }}>
            {days.map(d => (
              <div key={d.toString()} style={{ flex: 1, borderRight: '1px solid var(--border-light)', position: 'relative', minHeight: '1040px' }}>
                {hours.map(h => (
                  <div 
                    key={h} 
                    onClick={() => handleCellClick(d, `${h.toString().padStart(2, '0')}:00`)}
                    className="hour-slot-hover"
                    style={{ height: '80px', borderBottom: '1px solid var(--border-light)', cursor: 'pointer', transition: 'background-color 0.2s' }}
                  ></div>
                ))}
                {/* Events for this day */}
                {appointments.filter(a => isSameDay(a.startTime, d)).map(app => {
                  const h = app.startTime.getHours();
                  const m = app.startTime.getMinutes();
                  const durationInMinutes = (app.endTime.getTime() - app.startTime.getTime()) / (1000 * 60);
                  const top = (h - 8) * 80 + (m / 60) * 80;
                  const height = (durationInMinutes / 60) * 80 - 10; // -10 for gap
                  return (
                    <div 
                      key={app.id}
                      onClick={(e) => { e.stopPropagation(); setSelectedAppointment(app); }}
                      style={{
                        position: 'absolute',
                        top: `${top}px`,
                        left: '4px',
                        right: '4px',
                        height: `${height}px`,
                        backgroundColor: 'rgba(214, 125, 97, 0.15)',
                        borderLeft: '4px solid var(--color-primary)',
                        borderRadius: '6px',
                        padding: '8px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        zIndex: 1,
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>{format(app.startTime, 'HH:mm')} - {format(app.endTime, 'HH:mm')}</div>
                      <div style={{ fontWeight: 600 }}>{app.patient_name}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`
          .hour-slot-hover:hover { background-color: rgba(214, 125, 97, 0.03); }
        `}</style>
      </div>
    );
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', height: '100%', gap: '30px' }}>
      
      {/* Principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {renderHeader()}
        {viewMode === 'month' ? renderMonthView() : renderAgendaView(viewMode === 'week')}
      </div>

      {/* Sidebar Detalle */}
      <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="card" style={{ padding: '32px' }}>
          {!selectedAppointment ? (
            <div>
              <p className="text-muted" style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 600 }}>Día Seleccionado</p>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>{format(selectedDate, "d 'de' MMMM", { locale: es })}</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {appointments.filter(a => isSameDay(a.startTime, selectedDate)).map(app => (
                  <div key={app.id} onClick={() => setSelectedAppointment(app)} className="btn-ghost" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'block', textAlign: 'left' }}>
                    <div style={{ fontWeight: 700 }}>{format(app.startTime, 'HH:mm')} - {format(app.endTime, 'HH:mm')}</div>
                    <div>{app.patient_name}</div>
                  </div>
                ))}
                {appointments.filter(a => isSameDay(a.startTime, selectedDate)).length === 0 && (
                  <p className="text-muted">Sin citas agendadas.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="animate-slide-up">
              <button onClick={() => setSelectedAppointment(null)} className="btn-ghost" style={{ marginBottom: '24px' }}><ChevronLeft size={16} /> Volver</button>
              <h2 className="title-xl" style={{ fontSize: '24px', marginBottom: '8px' }}>{selectedAppointment.patient_name}</h2>
              <p className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} /> {format(selectedAppointment.startTime, 'HH:mm')} - {format(selectedAppointment.endTime, 'HH:mm')} • {format(selectedAppointment.startTime, "d 'de' MMM", { locale: es })}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '32px' }}>
                 <a href={`https://wa.me/${selectedAppointment.patient_phone.replace(/\s+/g, '')}?text=Hola%20${selectedAppointment.patient_name},%20te%20recuerdo%20tu%20cita%20con%20nuestro%20Gabinete%20el%20día%20${format(selectedAppointment.startTime, 'd/MM')}%20a%20las%20${format(selectedAppointment.startTime, 'HH:mm')}.`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ backgroundColor: '#25D366' }}>
                  <MessageCircle size={18} /> Confirmar WhatsApp
                </a>
                <button className="btn btn-secondary" onClick={() => handleEditAppointment(selectedAppointment)}>Editar Cita</button>
                <button className="btn btn-secondary" onClick={() => handleViewPatient(selectedAppointment.patientId)}><User size={18} /> Ver Ficha Paciente</button>
              </div>

              <div style={{ marginTop: '32px' }}>
                <p className="text-muted text-bold" style={{ fontSize: '13px' }}>NOTAS</p>
                <div style={{ padding: '16px', backgroundColor: '#fdfcfb', borderRadius: '12px', fontSize: '14px' }}>{selectedAppointment.notes}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaved={loadData}
        defaultDate={selectedDate}
        defaultTime={modalDefaultTime}
        appointment={modalAppointment}
      />

      <PatientModal 
        isOpen={isPatientModalOpen} 
        onClose={() => setIsPatientModalOpen(false)} 
        onSaved={loadData}
        patient={selectedPatientForModal}
      />

    </div>
  );
}
