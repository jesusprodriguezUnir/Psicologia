

Ir al contenido
Uso de Gmail con lectores de pantalla

Conversaciones
Estás usando el 88 % de 15 GB
Términos · Privacidad · Política del programa
Última actividad de la cuenta: hace 55 minutos
Detalles

# Psychological Consultation Application
## Architecture & Design Documentation

## 1. Purpose

This document describes the technical architecture of a **personal psychological consultation management application**, used to manage:

- Clients / Patients
- Appointments
- Invoices and billing
- Integration with **Factura XXI**
- Basic email notifications

The system is designed for **personal use**, but follows **professional-grade architecture and security practices**, allowing future growth if needed.

---

## 2. Architectural Goals

- Clean separation of responsibilities
- High security for sensitive data
- Simple but extensible design
- Easy integration with external services
- Minimal overengineering

---

## 3. Technology Stack Overview

### Frontend
- **Vite**
- **React**
- **TypeScript**
- Communicates with backend via REST over HTTPS
- Authentication via http-only JWT cookies

### Backend
- **FastAPI (Python)**
- REST API
- JWT-based authentication
- Business logic and integrations
- Single entry point to the system

### Database
- **PostgreSQL**
- Relational data model
- Encrypted fields for sensitive clinical data
- Audit logging

### External Services
- Email service
- **Factura XXI API**

---

## 4. High-Level Architecture


The frontend NEVER communicates directly with the database or third-party services.

---

## 5. Security Design

### Authentication
- JWT tokens
- Stored as **http-only cookies**
- Access + refresh token model
- Backend is responsible for issuing and validating tokens

### Transport Security
- HTTPS everywhere
- No plaintext communication

### Data Protection
- Clinical notes stored encrypted in the database
- No sensitive data exposed to frontend beyond what is required
- Audit logs for sensitive access

---

## 6. C4 Model

### Level 1 – Context Diagram

**Actor**
- Therapist (primary user)

**System**
- Psychological Consultation Application

**External Systems**
- Email Service
- Factura XXI

Purpose:
> Who uses the system and which external systems it interacts with.

---

### Level 2 – Container Diagram

#### Frontend Container
- Vite + React application
- Runs in the browser
- Handles UI and UX only
- Calls backend API via HTTPS
- Stores JWT in http-only cookies

#### Backend Container
- FastAPI application
- Responsibilities:
  - Authentication
  - Authorization
  - Business rules
  - Data validation
  - Orchestration of integrations

#### Database Container
- PostgreSQL
- Stores:
  - Clients
  - Appointments
  - Invoices
  - Payments
  - Audit logs
  - Encrypted clinical notes

#### External Containers
- Email service
- Factura XXI API

Purpose:
> What executable units make up the system and how they communicate.

---

## 7. Backend Internal Structure (Conceptual)
app/
├─ auth/
│  ├─ routes.py
│  ├─ services.py
│
├─ patients/
│  ├─ routes.py
│  ├─ services.py
│  ├─ models.py
│
├─ appointments/
│  ├─ routes.py
│  ├─ services.py
│
├─ invoices/
│  ├─ routes.py
│  ├─ services.py
│
├─ integrations/
│  ├─ factura_xxi_client.py
│  ├─ email_service.py
│
├─ audit/
│  ├─ logger.py
│
├─ database/
│  ├─ session.py
│  ├─ base.py
│
└─ main.py

---

## 8. Factura XXI Integration

### Design Principles
- Integration handled ONLY by the backend
- Decoupled through an integration layer
- Backend controls retries and error handling

### Flow

Invoice Service
↓
Integration Layer
↓
Factura XXI API

### Advantages
- Vendor lock-in avoided
- Easy to switch provider
- Centralized error handling
- Auditability

---

## 9. Deployment (Future-ready)

- Docker-based deployment
- Environment variable configuration
- Cloud VPS or local server deployment
- Backup and restore strategies

---

## 10. Summary

This architecture ensures:

- Professional-level security
- Clear separation of responsibilities
- Maintainability
- Scalability without redesign
- Safe handling of sensitive medical data
- Correct integration with billing providers

prueba.md
Mostrando prueba.md.