# Servicio de Acceso de Identidad (Identity-Access Service)

## Descripción

El Servicio de Acceso de Identidad (Identity-Access) es un microservicio crítico que actúa como guardián de la información de identidad de los usuarios en la plataforma IA-LEARN. Este servicio especializado se encarga del almacenamiento, recuperación y gestión segura de los datos de los usuarios, manteniendo una separación clara de responsabilidades dentro de la arquitectura de microservicios. Es el único servicio con acceso directo a la base de datos de usuarios, lo que refuerza la seguridad y encapsulamiento de datos sensibles.

## Características Principales

- Gestión completa del ciclo de vida de las cuentas de usuario (creación, actualización, desactivación)
- Persistencia segura de información personal y credenciales
- Validación de datos de usuarios según reglas de negocio
- Implementación de borrado lógico para mantener historial y prevenir pérdida de datos
- Exposición de operaciones a través de patrones de mensajes NATS
- Abstracción del almacenamiento mediante el patrón repositorio
- Mapeo eficiente entre entidades de dominio y DTOs de respuesta

## Tecnologías Utilizadas

- NestJS como framework principal
- TypeScript para tipado estático
- MongoDB como base de datos principal para almacenamiento de usuarios
- NATS para comunicación entre microservicios
- Mongoose como ODM (Object Document Mapper)
- Patrón Repositorio para abstracción de acceso a datos
- Inyección de dependencias para acoplamiento débil

## Configuración

El servicio se configura a través de variables de entorno que deben incluirse en un archivo `.env`:

```properties
# Configuración de MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
DATABASE_NAME=identity

# Configuración NATS
NATS_SERVER=nats://localhost:4222
```

### Variables de Entorno Detalladas

- **MONGODB_URI**: URI de conexión a la base de datos MongoDB
- **DATABASE_NAME**: Nombre de la base de datos para almacenamiento de usuarios
- **NATS_SERVER**: URL del servidor NATS para comunicación entre microservicios

## Comunicación con Otros Servicios

El Servicio de Acceso de Identidad interactúa principalmente con:

### 1. Servicio de Autenticación (Auth)

- **Propósito**: Recibir solicitudes de creación de usuarios y validación de credenciales
- **Método de comunicación**: Patrón solicitud/respuesta a través de NATS
- **Patrones de mensajes**:
  - `AuthPattern.CREATE_ACCOUNT`: Para crear nuevos usuarios durante el registro
  - `AuthPattern.LOGIN`: Para validar credenciales durante el inicio de sesión

### 2. Gateway API

- **Propósito**: Recibir solicitudes de actualización y eliminación de usuarios
- **Método de comunicación**: Patrón solicitud/respuesta a través de NATS
- **Patrones de mensajes**:
  - `UserPattern.UPDATE_ACCOUNT`: Para actualizar datos de usuario
  - `UserPattern.DELETE_ACCOUNT`: Para desactivar cuentas de usuario


## Seguridad

El servicio implementa varias medidas de seguridad:

- **Validación de Datos**: Verificación de formatos y contenidos antes de persistir
- **Borrado Lógico**: Nunca se eliminan registros físicamente, sólo se marcan como inactivos
- **Encapsulación de Información**: Los datos sensibles nunca se exponen directamente
- **Mapeo Controlado**: Transformación explícita entre entidades de dominio y DTOs

## Patrones de Diseño Aplicados

- **Patrón Repositorio**: Abstracción del acceso a datos que facilita testabilidad y cambios de implementación
- **Inyección de Dependencias**: Acoplamiento débil entre componentes
- **Patrón Controlador-Servicio**: Separación clara entre puntos de entrada y lógica de negocio
- **Mapeo Objeto-Documento**: Transformación controlada entre objetos y documentos MongoDB
- **DTOs (Data Transfer Objects)**: Objetos específicos para transferencia de datos entre capas

## Manejo de Errores

El servicio implementa un manejo de errores consistente:

- **Errores de Negocio**: Validaciones como "usuario no encontrado"
- **Errores de Base de Datos**: Manejo de excepciones durante operaciones de persistencia
- **Errores de Comunicación**: Problemas con la conexión a NATS o tiempos de espera

## Escalabilidad

El servicio está diseñado para escalar horizontalmente:

- **Stateless**: No mantiene estado entre solicitudes
- **Microservicios**: Puede desplegarse en múltiples instancias independientes
- **Desacoplamiento**: Dependencia mínima de otros servicios

## Ejecución

```bash
# Desarrollo
npm run start:dev identity-access

# Producción
npm run build
npm run start:prod identity-access
```

## Pruebas

```bash
# Tests unitarios
npm run test identity-access

# Tests e2e
npm run test:e2e identity-access

# Cobertura
npm run test:cov identity-access
```