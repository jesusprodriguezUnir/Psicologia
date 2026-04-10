-- Supabase / PostgreSQL Schema para la App de Psicología

-- 1. Tabla de Pacientes
CREATE TABLE public.patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT, -- Para WhatsApp
    notes TEXT, -- Ficha clínica breve (en el futuro se puede cifrar en backend)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de Citas (Appointments)
CREATE TABLE public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
    appointment_type TEXT DEFAULT 'followup', -- 'first_visit', 'followup', 'urgent'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (Políticas por defecto para App Router server-side API)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Como estamos haciendo un panel personal, permitimos lectura/escritura total si el usuario está autenticado 
-- (O provisionalmente acceso total si se consume puramente desde Node/Next.js con Service Role o Anon seguro)
-- Cambia 'anon' por 'authenticated' cuando agregues Autenticación (Supabase Auth).
CREATE POLICY "Enable all access for all users" ON public.patients FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON public.appointments FOR ALL USING (true);

-- Insertar datos de prueba
INSERT INTO public.patients (name, email, phone, notes) VALUES 
('Julia Sánchez', 'julia@example.com', '+34600123456', 'Ansiedad recurrente, primera sesión excelente.'),
('Carlos Mendoza', 'carlos@example.com', '+34600987654', 'Revisión mensual.');
