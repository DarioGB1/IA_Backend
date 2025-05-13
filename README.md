# IA-LEARN - Plataforma de Aprendizaje con Arquitectura de Microservicios

## Descripción

IA-LEARN es una plataforma educativa moderna implementada como un monorepo de microservicios utilizando NestJS y TypeScript. La arquitectura está diseñada siguiendo principios de Arquitectura Limpia y Domain-Driven Design (DDD), con un enfoque en la separación de responsabilidades, alta cohesión, bajo acoplamiento y escalabilidad. Esta plataforma permite gestionar todos los aspectos del proceso educativo, desde la autenticación segura de usuarios hasta la gestión de contenidos y seguimiento de progreso.

## Arquitectura del Sistema

El sistema está estructurado como un monorepo que contiene múltiples microservicios independientes, cada uno especializado en un dominio específico, siguiendo el patrón de "Bounded Context":

### Microservicios Principales

1. **Gateway**: Punto de entrada único que expone una API REST para clientes externos y coordina la comunicación con los microservicios internos.
   
2. **Auth**: Gestiona la autenticación, registro y verificación de usuarios, manejo de tokens JWT y refresh tokens.
   
3. **Identity-Access**: Administra la información de identidad de los usuarios, implementando un patrón de repositorio para abstraer el acceso a datos.
   
4. **Mail**: Proporciona servicios de comunicación por correo electrónico mediante plantillas HTML responsivas.

### Diagrama de Arquitectura Detallado

```
┌───────────────┐         ┌───────────────────────┐
│               │         │                       │
│    Cliente    │◄────────►  Gateway (API REST)   │
│  (Web/Mobile) │         │                       │
│               │         └───────────┬───────────┘
└───────────────┘                     │
                                      │
                           ┌──────────▼─────────┐
                           │                    │
                           │   NATS Message     │◄────┐
                           │      Broker        │     │
                           │                    │     │
                           └──┬─────────┬───────┘     │
                              │         │             │
            ┌─────────────────┘         │             │
            │                           │             │
┌───────────▼──────────┐   ┌────────────▼─────────┐   │
│                      │   │                      │   │
│  Auth Microservice   │   │   Identity-Access MS │   │
│  (JWT, Verification) │   │  (User Management)   │   │
│                      │   │                      │   │
└──────────────────────┘   └──────────────────────┘   │
                                                      │
                   ┌────────────────────────────┐     │
                   │                            │     │
                   │  Mail Microservice         ├─────┘
                   │  (Email Communication)     │
                   │                            │
                   └────────────────────────────┘
                   
┌──────────────────┐   ┌──────────────────┐   ┌───────────────────┐
│                  │   │                  │   │                   │
│  MongoDB         │   │  Redis           │   │  SMTP Server      │
│  (Persistencia)  │   │  (Cache/Temp)    │   │  (Email Delivery) │
│                  │   │                  │   │                   │
└──────────────────┘   └──────────────────┘   └───────────────────┘
```

### Comunicación entre Servicios

- **Gateway → Microservicios**: Comunicación RPC (Request/Response) a través de NATS
- **Auth → Mail**: Comunicación Event-Driven (Publish/Subscribe) a través de NATS
- **Auth → Identity-Access**: Comunicación RPC para validación de credenciales y creación de usuarios
- **Todos los Microservicios**: Utilizan patrones de mensajes predefinidos (compartidos en la biblioteca libs/shared)

## Estructura del Proyecto

```
ia-learn/
├── apps/                    # Microservicios (aplicaciones independientes)
│   ├── auth/                # Servicio de autenticación
│   │   ├── README.md        # Documentación específica del servicio
│   │   └── src/             # Código fuente del servicio
│   │       ├── main.ts      # Punto de entrada
│   │       ├── aut.service.ts # Servicio principal
│   │       ├── auth.controller.ts # Controlador
│   │       ├── auth.module.ts # Configuración del módulo
│   │       ├── config/      # Configuración (variables de entorno)
│   │       ├── data/        # Acceso a datos (MongoDB, Redis)
│   │       ├── services/    # Servicios auxiliares (tokens)
│   │       └── utils/       # Utilidades (generación de códigos)
│   │
│   ├── gateway/             # API Gateway
│   │   ├── README.md        # Documentación específica del gateway
│   │   └── src/             # Código fuente del gateway
│   │       ├── main.ts      # Punto de entrada (configura Swagger)
│   │       ├── app.module.ts # Módulo principal
│   │       ├── decorators/  # Decoradores personalizados
│   │       ├── guards/      # Guards para protección de rutas
│   │       └── modules/     # Módulos por dominio (auth, user)
│   │
│   ├── identity-access/     # Servicio de gestión de identidad
│   │   ├── README.md        # Documentación específica del servicio
│   │   └── src/             # Código fuente del servicio
│   │       ├── main.ts      # Punto de entrada
│   │       ├── identity-access.module.ts # Módulo principal
│   │       └── user/        # Gestión de usuarios
│   │           ├── interfaces/ # Contratos (repositorios)
│   │           ├── repository/ # Implementaciones (MongoDB)
│   │           └── ...      # Controladores, servicios, entidades
│   │
│   └── mail/                # Servicio de correo electrónico
│       ├── README.md        # Documentación específica del servicio
│       └── src/             # Código fuente del servicio
│           ├── main.ts      # Punto de entrada
│           ├── mail.module.ts # Módulo principal
│           ├── mail.service.ts # Servicio de envío de correos
│           ├── mail.controller.ts # Controlador
│           ├── config/      # Configuración (SMTP)
│           └── views/       # Plantillas de correo
│
├── libs/                    # Bibliotecas compartidas
│   └── shared/              # Código compartido entre microservicios
│       └── src/
│           ├── const/       # Constantes compartidas
│           ├── dtos/        # Objetos de transferencia de datos
│           │   ├── internal/ # DTOs para comunicación interna
│           │   ├── request/  # DTOs para solicitudes
│           │   └── response/ # DTOs para respuestas
│           ├── enums/       # Enumeraciones (tipos de correo, roles)
│           ├── interfaces/  # Interfaces compartidas
│           ├── patterns/    # Patrones de mensajes para NATS
│           ├── services/    # Servicios compartidos (MongoDB, Redis)
│           └── utils/       # Utilidades (GUID, mapeo)
│
├── docker-compose.yml       # Configuración de servicios en Docker
├── nest-cli.json            # Configuración de NestJS
├── package.json             # Dependencias y scripts
├── tsconfig.json            # Configuración de TypeScript
├── tsconfig.build.json      # Configuración de build de TypeScript
└── README.md                # Documentación general del proyecto
```

## Implementación de Bibliotecas Compartidas

El directorio `libs/shared` contiene código que se comparte entre todos los microservicios, siguiendo el principio DRY (Don't Repeat Yourself):

### DTOs (Data Transfer Objects)

Definen la estructura y validaciones para transferencia de datos:

- **request**: DTOs para solicitudes entrantes (ej. `UserCreateDto`, `LoginDto`)
- **response**: DTOs para respuestas (ej. `UserResponse`, `CredentialsResponse`)
- **internal**: DTOs para comunicación entre microservicios

### Patrones de Mensajes

Definen constantes para los patrones de comunicación NATS:

```typescript
// auth.pattern.ts
export enum AuthPattern {
  LOGIN = 'auth.login',
  CREATE_ACCOUNT = 'auth.create_account',
  VERIFY_ACCOUNT = 'auth.verify_account',
}

// mail.pattern.ts
export enum MailPattern {
  SEND_MAIL = 'mail.send_mail',
}

// user.pattern.ts
export enum UserPattern {
  FIND_BY_ID = 'user.find_by_id',
  UPDATE_ACCOUNT = 'user.update_account',
  DELETE_ACCOUNT = 'user.delete_account',
}
```

### Constantes y Enumeraciones

```typescript
// Definición de tipos de correo
export enum MailType {
  Verification = 'VERIFICATION',
  PasswordReset = 'PASSWORD_RESET',
}

// Definición de roles de usuario
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
}
```

## Tecnologías y Patrones Utilizados

### Framework y Lenguaje

- **NestJS**: Framework moderno de Node.js para aplicaciones escalables
- **TypeScript**: Lenguaje tipado que mejora la calidad y mantenibilidad del código

### Comunicación entre Servicios

- **NATS**: Message broker para comunicación entre microservicios
  - Patrones Request/Response para operaciones síncronas
  - Patrones Pub/Sub para comunicación asíncrona

### Almacenamiento de Datos

- **MongoDB**: Base de datos NoSQL para almacenamiento persistente
- **Redis**: Almacenamiento en memoria para datos temporales y estado de verificación

### Seguridad

- **JWT (JSON Web Tokens)**: Para autenticación y comunicación segura
- **Cookies seguras HTTP-Only**: Para almacenamiento seguro de tokens en cliente

### Patrones de Diseño Implementados

- **Microservicios**: Arquitectura descentralizada para escalabilidad horizontal
- **Gateway Pattern**: Punto de entrada unificado para clientes externos
- **Repository Pattern**: Abstracción del acceso a datos
- **Dependency Injection**: Acoplamiento débil y facilidad de pruebas
- **Factory Pattern**: Creación estandarizada de objetos complejos
- **DTO Pattern**: Objetos específicos para transferencia de datos
- **Mapper Pattern**: Conversión entre entidades y DTOs

## Requisitos del Sistema

- **Node.js**: v18.0.0 o superior
- **npm**: v9.0.0 o superior
- **Docker y Docker Compose**: Para entorno de desarrollo
- **NATS Server**: Broker de mensajes
- **MongoDB**: Base de datos de documentos
- **Redis**: Almacenamiento en memoria

## Configuración del Entorno

### Variables de Entorno

Cada microservicio requiere su propio archivo `.env` con configuraciones específicas:

#### Gateway (.env)
```properties
PORT=3000
JWT_SECRET=your_jwt_secret_key
NATS_SERVER=nats://localhost:4222
```

#### Auth Service (.env)
```properties
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION_TIME_IN_MINUTES=60
REFRESH_TOKEN_EXPIRATION_TIME_IN_DAYS=30
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=authdb
REDIS_URL=redis://localhost:6379
NATS_SERVER=nats://localhost:4222
```

#### Identity-Access Service (.env)
```properties
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=identitydb
NATS_SERVER=nats://localhost:4222
```

#### Mail Service (.env)
```properties
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=user@example.com
MAIL_PASSWORD=your_password
NATS_SERVER=nats://localhost:4222
```

### Docker Compose

Para iniciar todos los servicios necesarios en contenedores:

```bash
docker-compose up -d
```

## Ejecución del Proyecto

### Instalación de Dependencias

```bash
npm install
```

### Compilación del Proyecto

```bash
npm run build
```

### Ejecución en Modo Desarrollo

```bash
# Iniciar todos los microservicios
npm run start:dev

# Iniciar un microservicio específico
npm run start:dev gateway
npm run start:dev auth
npm run start:dev identity-access
npm run start:dev mail
```

### Ejecución en Producción

```bash
npm run start:prod
```

## Documentación de API

Al iniciar el Gateway, la documentación de API estará disponible en:

- **Scalar API Reference**: http://localhost:3000/api/doc

## Mejores Prácticas Implementadas

1. **Arquitectura Limpia**: Separación clara de capas (controladores, servicios, repositorios)
2. **DDD (Domain-Driven Design)**: Organización del código por dominios
3. **SOLID**: Principios de diseño orientado a objetos
   - Single Responsibility (Responsabilidad Única)
   - Open/Closed (Abierto/Cerrado)
   - Liskov Substitution (Sustitución de Liskov)
   - Interface Segregation (Segregación de Interfaces)
   - Dependency Inversion (Inversión de Dependencias)
4. **CI/CD**: Integración y despliegue continuos con pipelines automatizados
5. **Versionado Semántico**: Control de versiones siguiendo estándares
6. **Documentación Detallada**: READMEs específicos por servicio y documentación API
7. **Manejo de Errores Robusto**: Captura y tratamiento consistente de excepciones
8. **Logging Estructurado**: Registro de actividades y errores

