# Gabinete Psicológico - Gestión Profesional

**Gabinete Psicológico** es una plataforma de gestión integral para psicólogos y gabinetes de terapia. Diseñada con un enfoque cálido y acogedor, permite gestionar pacientes, citas y facturación de forma sencilla y profesional.

## 🚀 Características

- **Agenda Inteligente**: Vistas Mensual, Semanal y Diaria (Agenda vertical por horas).
- **Gestión de Pacientes**: Ficha completa con datos personales, clínicos y **datos bancarios (IBAN/Cuenta)**.
- **Facturación**: Control de ingresos, estados de pago (Pagada/Pendiente) y generación de facturas.
- **Confirmaciones Express**: Envío predefinido de recordatorios de cita por **WhatsApp**.
- **Modo Mock / Producción**: Capacidad de funcionar en modo demostración con datos simulados o conectado a una base de datos real en la nube.

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js (App Router), React, TypeScript.
- **Estilos**: Vanilla CSS (Premium "Warm & Cozy" Design).
- **Iconografía**: Lucide React.
- **Lógica de Fechas**: date-fns.
- **Base de Datos**: Supabase (PostgreSQL).

## 💻 Desarrollo Local

1.  **Instalación**:
    ```bash
    npm install
    ```

2.  **Configuración de Entorno**:
    Crea un archivo `.env.local` en la raíz del proyecto basándote en `.env.example`.
    -   Para usar los datos de prueba (Demo): `NEXT_PUBLIC_USE_MOCKS=true`.
    -   Para usar base de datos real: Introduce tus claves de Supabase.

3.  **Ejecutar**:
    ```bash
    npm run dev
    ```
    Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🚢 Despliegue en Vercel

Esta aplicación está optimizada para ser desplegada en **Vercel**:

1.  Sube el código a un repositorio de GitHub.
2.  Conecta el repositorio en el panel de Vercel.
3.  Configura las **Environment Variables** en Vercel:
    -   `NEXT_PUBLIC_USE_MOCKS`: `true` (para demo) o `false`.
    -   `NEXT_PUBLIC_SUPABASE_URL`: Tu URL de Supabase.
    -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Tu Anon Key de Supabase.
4.  ¡Hecho! Vercel gestionará el proceso de build de Next.js automáticamente.

## 🗄️ Base de Datos (Supabase)

Si decides usar la base de datos real:
1.  Crea un nuevo proyecto en Supabase.
2.  Copia el contenido del archivo `schema.sql` (en la raíz).
3.  Pégalo y ejecútalo en el **SQL Editor** de Supabase para inicializar las tablas de Pacientes y Citas.
