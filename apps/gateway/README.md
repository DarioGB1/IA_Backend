# Servicio de Gateway (API Gateway)

## Descripción

El Servicio de Gateway representa la puerta de entrada principal para todas las interacciones externas con la plataforma IA-LEARN. Implementado como una aplicación NestJS tradicional (a diferencia de los microservicios internos), este servicio expone una API REST bien definida que los clientes pueden consumir. El Gateway se encarga de recibir las solicitudes HTTP, validar los datos de entrada, autenticar a los usuarios, y coordinar la comunicación con los microservicios internos, actuando como un proxy inteligente que traduce las solicitudes REST en mensajes NATS para el sistema de microservicios subyacente.

## Características Principales

- API REST completa con endpoints bien definidos para autenticación y gestión de usuarios
- Documentación de API integrada con Swagger y Scalar API Reference
- Manejo seguro de cookies HTTP-only para tokens de autenticación
- Implementación de guards para protección de rutas que requieren autenticación
- Decoradores personalizados para extracción de información de tokens
- Validación de datos de entrada con class-validator y transformación con DTOs
- Traducción eficiente entre solicitudes HTTP y mensajes NATS para microservicios
- Gestión de respuestas y códigos de estado HTTP apropiados

## Tecnologías Utilizadas

- NestJS como framework principal
- TypeScript para tipado estático
- Express.js como framework HTTP subyacente
- Cookie-parser para manejo de cookies seguras
- Swagger/Scalar API Reference para documentación de API
- NATS para comunicación con microservicios internos
- JWT para validación de tokens de autenticación
- Class-validator y class-transformer para validación de entrada

## Arquitectura Detallada

### Estructura de Archivos Completa

```
gateway/
├── src/
│   ├── config/               # Configuración del servicio
│   │   ├── envs.ts           # Variables de entorno
│   │   └── index.ts          # Exportación de configuraciones
│   ├── decorators/           # Decoradores personalizados
│   │   └── token.decorator.ts # Decorador para extraer info del token JWT
│   ├── guards/               # Guards para protección de rutas
│   │   └── auth.guard.ts     # Guard de autenticación basado en JWT
│   ├── modules/              # Módulos funcionales por dominio
│   │   ├── auth/             # Módulo de autenticación
│   │   │   ├── auth.controller.ts # Controlador con endpoints de autenticación
│   │   │   ├── auth.module.ts     # Configuración del módulo
│   │   │   └── auth.service.ts    # Servicio para comunicación con microservicios
│   │   └── user/             # Módulo de gestión de usuarios
│   │       ├── user.controller.ts # Controlador con endpoints de usuario
│   │       ├── user.module.ts     # Configuración del módulo
│   │       └── user.service.ts    # Servicio para comunicación con microservicios
│   ├── app.module.ts         # Módulo principal de la aplicación
│   └── main.ts               # Punto de entrada de la aplicación
└── tsconfig.app.json         # Configuración de TypeScript específica
```

## Configuración

El servicio se configura a través de variables de entorno en un archivo `.env`:

```properties
# Configuración del servidor
PORT=3000

# Configuración NATS
NATS_SERVER=nats://localhost:4222
```

### Variables de Entorno Detalladas

- **PORT**: Puerto en el que se ejecutará el servidor HTTP (3000 por defecto)
- **NATS_SERVER**: URL del servidor NATS para comunicación con microservicios

## Manejo de Cookies y Seguridad

El servicio implementa un manejo seguro de cookies para almacenar tokens:

- **Cookie httpOnly**: Previene acceso desde JavaScript del lado del cliente
- **Secure**: Asegura que las cookies solo se envíen a través de HTTPS
- **SameSite=strict**: Previene ataques CSRF limitando el envío de cookies
- **Tiempo de expiración controlado**: Las cookies expiran junto con los tokens

```typescript
private setCookie(res: Response, name: string, value: string, expires: Date) {
  res.cookie(name, value, {
    expires,
    secure: true,
    sameSite: 'strict',
    httpOnly: true
  });
}
```

## Documentación de API

El Gateway proporciona documentación completa de API utilizando Swagger y Scalar API Reference:

- **Scalar API Reference**: Disponible en `/api/doc`
- **Documentación interactiva**: Permite probar endpoints directamente desde el navegador
- **Descripción detallada**: Incluye información sobre parámetros, cuerpos de solicitud y respuestas

## Validación de Datos

El servicio implementa validación robusta de todas las entradas utilizando ValidationPipe:

- **Whitelist**: Elimina propiedades no esperadas en los DTOs
- **Validación automática**: Basada en decoradores de class-validator en los DTOs
- **Custom decorators**: Soporte para validación personalizada con decoradores

Configuración global en `main.ts`:
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  validateCustomDecorators: true,
}));
```

## Comunicación con Microservicios

El Gateway se comunica con los siguientes microservicios:

### 1. Servicio de Autenticación (Auth)

- **Propósito**: Gestionar registro y verificación de cuentas
- **Patrones de mensajes**:
  - `AuthPattern.CREATE_ACCOUNT`: Iniciar proceso de registro
  - `AuthPattern.VERIFY_ACCOUNT`: Verificar código y completar registro

### 2. Servicio de Acceso de Identidad (Identity-Access)

- **Propósito**: Validar credenciales y gestionar información de usuarios
- **Patrones de mensajes**:
  - `AuthPattern.LOGIN`: Validar credenciales e iniciar sesión
  - `UserPattern.FIND_BY_ID`: Obtener información de usuario
  - `UserPattern.UPDATE_ACCOUNT`: Actualizar información de usuario
  - `UserPattern.DELETE_ACCOUNT`: Desactivar cuenta de usuario

## Seguridad

El Gateway implementa múltiples capas de seguridad:

- **Autenticación JWT**: Verificación de tokens en rutas protegidas
- **Guards**: Middleware para protección de rutas basado en roles y permisos
- **Cookies seguras**: Configuración óptima para prevenir ataques XSS y CSRF
- **Validación de entrada**: Prevención de inyecciones y ataques de datos maliciosos
- **CORS**: Configuración para limitar dominios que pueden acceder a la API
- **Rate Limiting**: (Versión futura) Protección contra ataques de fuerza bruta

## Manejo de Errores

El servicio implementa un sistema consistente de manejo de errores:

- **Errores HTTP estándar**: Uso de códigos de estado apropiados
- **Mensajes de error descriptivos**: Información clara sobre problemas
- **Filtros de excepción personalizados**: Transformación uniforme de errores

## Escalabilidad

El Gateway está diseñado para escalar horizontalmente:

- **Stateless**: No mantiene estado entre solicitudes
- **Load balancing**: Compatible con balanceadores de carga
- **Múltiples instancias**: Puede ejecutarse en paralelo tras un balanceador

## Ejecución

```bash
# Desarrollo
npm run start:dev gateway

# Producción
npm run build
npm run start:prod gateway
```