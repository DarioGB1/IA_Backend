# Servicio de Autenticación (Auth Service)

## Descripción

El Servicio de Autenticación es un microservicio crucial que gestiona todo el ciclo de autenticación y autorización de usuarios en la plataforma IA-LEARN. Implementa un flujo seguro de autenticación con verificación de cuentas, gestión de tokens JWT, y comunicación con otros microservicios. Este servicio actúa como pieza central del sistema de seguridad, garantizando que solo usuarios autorizados puedan acceder a los recursos protegidos.

## Características Principales

- Autenticación de usuarios mediante credenciales (email/contraseña)
- Registro de nuevos usuarios con verificación por correo electrónico
- Generación y validación de tokens JWT para acceso seguro
- Gestión de refresh tokens para mantener sesiones activas
- Almacenamiento temporal de datos de registro en Redis
- Comunicación con otros microservicios a través de NATS
- Implementación de flujos seguros de verificación en dos pasos

## Tecnologías Utilizadas

- NestJS como framework principal
- TypeScript para tipado estático
- Redis para almacenamiento temporal de datos de verificación
- MongoDB para almacenamiento persistente de tokens de refresco
- JWT (JSON Web Tokens) para autenticación
- NATS para comunicación entre microservicios
- Inyección de dependencias para acoplamiento débil

## Arquitectura Detallada

### Estructura de Archivos Completa

```
auth/
├── src/
│   ├── config/               # Configuración del servicio
│   │   ├── envs.ts           # Variables de entorno
│   │   └── index.ts          # Exportación de configuraciones
│   ├── data/                 # Capa de acceso a datos
│   │   ├── data.module.ts    # Módulo de acceso a datos
│   │   ├── mongo/            # Implementaciones para MongoDB
│   │   │   └── refresh-token/# Repositorio de tokens de refresco
│   │   └── redis/           # Implementaciones para Redis
│   │       ├── interfaces/   # Interfaces de datos Redis
│   │       │   └── account-verification-data.interface.ts # Interfaz para datos de verificación
│   │       └── values/       # Objetos de valor Redis
│   ├── dtos/                 # Objetos de transferencia de datos
│   │   ├── refresh-token-create.dto.ts # DTO para crear refresh tokens
│   │   └── refresh-token-update.dto.ts # DTO para actualizar refresh tokens
│   ├── entities/             # Entidades de dominio
│   │   └── refresh-token.entity.ts     # Entidad de refresh token
│   ├── interfaces/           # Interfaces y contratos
│   │   └── refresh-token.repository.ts # Interfaz del repositorio de tokens
│   ├── services/             # Servicios de negocio
│   │   └── token/            # Servicio de tokens
│   │       ├── token.module.ts # Módulo del servicio de tokens
│   │       └── token.service.ts # Implementación del servicio de tokens
│   ├── utils/                # Utilidades
│   │   ├── code-generate.ts  # Generador de códigos de verificación
│   │   └── index.ts          # Exportación de utilidades
│   ├── auth.controller.ts    # Controlador de autenticación
│   ├── aut.service.ts        # Servicio principal de autenticación
│   ├── auth.module.ts        # Módulo principal
│   └── main.ts               # Punto de entrada de la aplicación
└── tsconfig.app.json         # Configuración de TypeScript específica
```

### Componentes Principales Detallados

#### AuthService (`aut.service.ts`)

Implementa la lógica de negocio central para todos los procesos de autenticación:

- **login**: Autentica al usuario verificando sus credenciales a través del servicio Identity-Access, genera tokens de acceso y refresco, y configura tiempos de expiración.
- **createAccount**: Implementa un flujo seguro de registro en dos pasos:
  1. Genera un código único de verificación
  2. Envía el código al correo del usuario a través del servicio Mail
  3. Almacena temporalmente los datos del usuario en Redis con tiempo de expiración
  4. Genera un token temporal que permite completar la verificación
- **verifyAccount**: Completa el proceso de registro verificando el código enviado:
  1. Valida el código contra los datos almacenados en Redis
  2. Comunica con Identity-Access para crear la cuenta permanente
  3. Genera tokens de acceso y refresco definitivos
  4. Limpia los datos temporales de Redis

#### TokenService (`services/token/token.service.ts`)

Servicio especializado en la generación y validación de tokens JWT:

- Genera tokens de acceso con payload personalizable
- Configura tiempos de expiración de tokens
- Utiliza el secreto JWT configurado en variables de entorno

#### AuthController (`auth.controller.ts`)

Expone los endpoints del microservicio a través de patrones de mensajes NATS:

- **login**: Procesa solicitudes de inicio de sesión
- **createAccount**: Inicia el proceso de registro de usuarios
- **verifyAccount**: Maneja la verificación de cuentas nuevas

#### RefreshTokenRepository (Interfaces e Implementación)

Proporciona una capa de abstracción para el almacenamiento y recuperación de tokens de refresco:

- **create**: Genera nuevos tokens de refresco
- **find**: Busca tokens existentes
- **update**: Actualiza tokens (por ejemplo, al renovarlos)
- **delete**: Elimina tokens (por ejemplo, al cerrar sesión)

#### CodeGenerate (`utils/code-generate.ts`)

Utilidad para la generación de códigos de verificación seguros:

- Genera códigos numéricos aleatorios para verificación de cuentas
- Implementa lógica para asegurar la unicidad y seguridad de los códigos


### Variables de Entorno

- **JWT_SECRET**: Clave secreta para firmar los tokens JWT
- **JWT_EXPIRATION_TIME_IN_MINUTES**: Tiempo de expiración de los tokens de acceso (15 minutos por defecto)
- **REFRESH_TOKEN_EXPIRATION_TIME_IN_DAYS**: Tiempo de expiración de los tokens de refresco (7 días por defecto)
- **DATABASE_NAME**: Nombre de la base de datos MongoDB para almacenar tokens de refresco
- **DATABASE_URL**: URL de conexión a la base de datos MongoDB
- **REDIS_URL**: URL de conexión al servidor Redis para almacenamiento temporal
- **NATS_SERVER**: URL del servidor NATS para comunicación entre microservicios

## Comunicación con Otros Servicios

El Servicio de Autenticación interactúa con los siguientes microservicios:

### 1. Servicio de Correo (Mail)

- **Propósito**: Enviar correos electrónicos con códigos de verificación
- **Método de comunicación**: Patrón emisión/suscripción a través de NATS
- **Patrones de mensajes**:
  - `MailPattern.SEND_MAIL`: Para enviar correos de verificación

### 2. Servicio de Acceso de Identidad (Identity-Access)

- **Propósito**: Validar credenciales y gestionar usuarios
- **Método de comunicación**: Patrón solicitud/respuesta a través de NATS
- **Patrones de mensajes**:
  - `AuthPattern.LOGIN`: Para validar credenciales de inicio de sesión
  - `AuthPattern.CREATE_ACCOUNT`: Para crear nuevas cuentas de usuario

## Gestión de Datos

### MongoDB

Almacena información persistente sobre los tokens de refresco:

- **Colección**: `refresh_tokens`
- **Documento típico**:
  ```json
  {
    "id": "uuid-v4",
    "userId": "user-uuid",
    "deviceId": "device-identifier",
    "ipAddress": "127.0.0.1",
    "expiresAt": "2023-05-20T00:00:00Z",
    "isRevoked": false,
    "createdAt": "2023-05-13T00:00:00Z"
  }
  ```

### Redis

Almacena temporalmente información durante el proceso de registro:

- **Claves principales**:
  - `account:tmp:{processId}:data`: Datos del usuario en registro
  - `account:tmp:{processId}:meta`: Metadatos de verificación (código, estado)
  - `account:{userId}:data`: Datos básicos del usuario autenticado

## Manejo de Errores

El servicio implementa un sistema robusto de manejo de errores:

- **Errores de verificación**: Códigos inválidos, expirados o ya utilizados
- **Errores de autenticación**: Credenciales incorrectas
- **Errores de comunicación**: Problemas con otros microservicios
- **Errores de almacenamiento**: Problemas con Redis o MongoDB

## Seguridad

Se implementan múltiples capas de seguridad:

- **Verificación en dos pasos**: Para nuevos registros
- **Tokens JWT firmados**: Con secreto configurable
- **Tokens con tiempo de expiración**: Para limitar ventanas de vulnerabilidad
- **Refresh tokens con ID único**: Para renovar sesiones sin requerir credenciales
- **Almacenamiento seguro**: Datos temporales con TTL en Redis

## Patrones de Diseño Aplicados

- **Patrón Repositorio**: Abstracción del acceso a datos
- **Inyección de Dependencias**: Acoplamiento débil entre componentes
- **Patrón Servicio**: Encapsulamiento de lógica de negocio
- **Patrón Módulo**: Organización en módulos cohesivos
- **Patrón Microservicio**: Separación en servicios independientes

## Ejecución

```bash
# Desarrollo
npm run start:dev auth

# Producción
npm run build
npm run start:prod auth
```