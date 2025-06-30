# Ecuatickets API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[![Node.js](https://img.shields.io/badge/Node.js-v22-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-v11-blue.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.7-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v17-blue.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-v6.8-blue.svg)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Descripción

Ecuatickets API es una aplicación backend desarrollada con NestJS para la gestión de venta de boletos de buses en Ecuador. El sistema permite a las empresas de transporte gestionar rutas, frecuencias, buses, asientos y ventas de boletos tanto en mostrador como online.

## 🏗️ Arquitectura

### Tecnologías Principales

- **Framework**: [NestJS](https://nestjs.com/) v11 - Framework progresivo de Node.js
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) v5.7 - Superset tipado de JavaScript
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/) v17 - Base de datos relacional
- **ORM**: [Prisma](https://www.prisma.io/) v6.8 - ORM moderno para TypeScript y Node.js
- **Runtime**: [Node.js](https://nodejs.org/) v22 - Entorno de ejecución JavaScript
- **Package Manager**: [Bun](https://bun.sh/) - Runtime y package manager rápido

### Herramientas de Desarrollo

- **Linting**: [ESLint](https://eslint.org/) v9.18 - Linter para JavaScript/TypeScript
- **Formateo**: [Prettier](https://prettier.io/) v3.4 - Formateador de código
- **Git Hooks**: [Husky](https://typicode.github.io/husky/) v9.1 - Git hooks para automatización
- **Testing**: [Jest](https://jestjs.io/) v29.7 - Framework de testing
- **Documentación API**: [Swagger](https://swagger.io/) v11.2 - Documentación automática de APIs

### Estructura del Proyecto

```
src/
├── core/                    # Módulos principales de la aplicación
│   ├── auth/               # Autenticación y autorización
│   ├── users/              # Gestión de usuarios
│   ├── companies/          # Gestión de empresas
│   ├── cities/             # Gestión de ciudades
│   ├── buses/              # Gestión de buses
│   ├── bus-customization/  # Personalización de buses y asientos
│   ├── frequencies/        # Gestión de frecuencias
│   ├── route-sheets/       # Hojas de ruta
│   ├── ticket-sale/        # Venta de boletos (mostrador y online)
│   ├── paypal/             # Integración con PayPal
│   ├── email/              # Servicio de emails
│   └── people/             # Gestión de personas/pasajeros
├── common/                 # Utilidades y decoradores comunes
├── global/                 # Configuraciones globales
│   ├── config/            # Configuraciones de la aplicación
│   └── database/          # Configuración de base de datos
└── main.ts                # Punto de entrada de la aplicación
```

## 🚀 Instalación

### Prerrequisitos

- **Node.js**: v22 (usar [nvm](https://github.com/nvm-sh/nvm) para gestión de versiones)
- **PostgreSQL**: v17
- **Bun**: v1.x (recomendado) o npm/yarn

### Configuración Inicial

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd ecuatickets-api
   ```

2. **Instalar dependencias**
   ```bash
   # Con Bun (recomendado)
   bun install
   
   # Con npm
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con tus configuraciones:
   ```env
   # Database
   DB_URL="postgresql://user:password@localhost:5432/ecuatickets"
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=ecuatickets
   DB_PORT=5432
   
   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=24h
   
   # PayPal
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_SECRET=your_paypal_secret
   
   # Email
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your_email@gmail.com
   MAIL_PASS=your_email_password
   
   # App
   PORT=3002
   NODE_ENV=development
   ```

4. **Configurar base de datos**
   ```bash
   # Con Docker (recomendado)
   docker-compose up -d
   
   # O instalar PostgreSQL localmente
   ```

5. **Ejecutar migraciones y seed**
   ```bash
   # Reset completo de la base de datos
   bun run db:seed
   
   # O por separado
   bunx prisma db push --force-reset
   bunx prisma db seed
   ```

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
bun run dev              # Modo desarrollo con hot reload
bun run start            # Iniciar aplicación
bun run build            # Compilar TypeScript

# Base de datos
bun run db:reset         # Reset completo de la base de datos
bun run db:seed          # Reset y seed de la base de datos

# Testing
bun run test             # Ejecutar tests unitarios
bun run test:watch       # Tests en modo watch
bun run test:cov         # Tests con cobertura
bun run test:e2e         # Tests end-to-end

# Linting y formateo
bun run lint             # Ejecutar ESLint
bun run format           # Formatear código con Prettier
```

### Configuración de Herramientas

#### ESLint
- Configuración moderna con `eslint.config.mjs`
- Reglas estrictas para TypeScript
- Integración con Prettier

#### Prettier
- Formateo automático del código
- Configuración en `.prettierrc`
- Integración con ESLint

#### Husky
- Git hooks automáticos
- Pre-commit: ejecuta build antes de cada commit
- Configuración en `.husky/`

### Estructura de Módulos

Cada módulo sigue la arquitectura NestJS con:
- **Controller**: Endpoints de la API
- **Service**: Lógica de negocio
- **Repository**: Acceso a datos
- **DTOs**: Transferencia de datos
- **Types**: Tipos y enums

## 📊 Base de Datos

### Modelos Principales

- **User**: Usuarios del sistema (COMPANY, CLERK, CUSTOMER, DRIVER, ADMIN)
- **Company**: Empresas de transporte
- **Bus**: Buses con configuración de asientos
- **Frequency**: Frecuencias de viaje (origen, destino, hora)
- **RouteSheet**: Hojas de ruta (fecha, frecuencia, bus)
- **Ticket**: Boletos vendidos
- **Payment**: Pagos realizados
- **Person**: Información de pasajeros

### Enums del Sistema

- **UserRole**: Roles de usuario
- **PaymentMethod**: Métodos de pago (CASH, TRANSFER, PAYPAL)
- **PaymentStatus**: Estados de pago (PENDING, APPROVED, REJECTED, REFUNDED)
- **PassengerType**: Tipos de pasajero (NORMAL, DISABLED, SENIOR, MINOR)
- **RouteStatus**: Estados de ruta (GENERATED, IN_PROGRESS, COMPLETED)

## 🔐 Autenticación y Autorización

- **JWT**: Tokens para autenticación
- **Roles**: Sistema de roles granular
- **Guards**: Protección de endpoints por rol
- **Decorators**: `@Auth()`, `@GetUser()`, `@GetCompanyId()`

## 💳 Integración de Pagos

### PayPal
- Creación de órdenes
- Captura de pagos
- Verificación de transacciones

### Transferencias Bancarias
- Referencias bancarias
- URLs de comprobantes
- Validación manual

## 📧 Servicios de Email

- Confirmaciones de compra
- Notificaciones de estado de pago
- Templates personalizables

## 🚌 Gestión de Buses

### Tipos de Bus
- **Convencional**: 46 asientos, 1 piso
- **Ejecutivo**: 30 asientos, 1 piso
- **Semi Cama**: 20 asientos, 1 piso
- **Cama**: 18 asientos, 1 piso
- **Doble Piso**: 36 asientos, 2 pisos
- **Doble Piso Ejecutivo**: 30 asientos, 2 pisos
- **Microbus**: 15 asientos, 1 piso

### Personalización
- Configuración automática según tipo
- Asientos VIP personalizables
- Gestión de pisos múltiples

## 🛣️ Hojas de Ruta

### Características
- Rutas circulares automáticas
- Asignación inteligente de buses
- Gestión de frecuencias de ida y vuelta
- Validación de disponibilidad

## 📚 Documentación API

- **Swagger UI**: Disponible en `/api` cuando la aplicación está corriendo
- **Endpoints documentados**: Todos los endpoints incluyen ejemplos y descripciones
- **Schemas**: Modelos de datos documentados automáticamente

## 🧪 Testing

### Tipos de Tests
- **Unit Tests**: Tests de servicios y lógica de negocio
- **E2E Tests**: Tests de endpoints completos
- **Integration Tests**: Tests de integración con base de datos

### Ejecutar Tests
```bash
bun run test              # Tests unitarios
bun run test:watch        # Modo watch
bun run test:cov          # Con cobertura
bun run test:e2e          # Tests end-to-end
```

## 🐳 Docker

### Servicios Disponibles
- **PostgreSQL**: Base de datos principal
- **Redis**: Cache (opcional)

### Comandos Docker
```bash
docker-compose up -d      # Iniciar servicios
docker-compose down       # Detener servicios
docker-compose logs       # Ver logs
```

## 📦 Despliegue

### Producción
```bash
# Build de producción
bun run build

# Iniciar aplicación
bun run start:prod
```

### Variables de Entorno de Producción
- Configurar `NODE_ENV=production`
- Usar base de datos de producción
- Configurar JWT secrets seguros
- Configurar PayPal en modo producción

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

### Estándares de Código
- Seguir las reglas de ESLint
- Usar Prettier para formateo
- Escribir tests para nuevas funcionalidades
- Documentar APIs con Swagger

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- **Documentación**: [NestJS Docs](https://docs.nestjs.com/)
- **Issues**: Crear un issue en el repositorio
- **Discord**: [NestJS Community](https://discord.gg/G7Qnnhy)

## 👥 Autores

- **Desarrollo**: Equipo de desarrollo Ecuatickets
- **Framework**: [NestJS](https://nestjs.com/) por Kamil Myśliwiec

---

**Ecuatickets API** - Sistema de gestión de venta de boletos de buses en Ecuador 🚌🇪🇨
