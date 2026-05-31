# PrestaSalones

Sistema de reservación de salones y laboratorios para la Facultad de Telemática, Universidad de Colima.

## Stack

- **Next.js 16** — App Router, Server Actions
- **React 19**
- **Prisma** + PostgreSQL (Neon)
- **NextAuth v4** — autenticación con credenciales
- **Tailwind CSS** + shadcn/ui
- **Geist Sans** — tipografía

## Funcionalidades

- Reserva de salones y laboratorios por hora
- Calendario de disponibilidad en tiempo real
- Gestión de usuarios (Estudiante, Profesor, Administrador)
- Cancelación de reservaciones propias
- Sesión persistente con JWT

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Generar cliente de Prisma y levantar servidor
npx prisma generate
npm run dev
```

Requiere una instancia de PostgreSQL. Puedes usar el `docker-compose.yml` incluido o una base de datos en [Neon](https://neon.tech).

## Variables de entorno

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```
