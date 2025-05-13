# Servicio de Correo (Mail Service)

## Descripción

El Servicio de Correo es un microservicio fundamental que gestiona todas las comunicaciones por correo electrónico de la plataforma IA-LEARN. Está diseñado como un servicio independiente y especializado que recibe solicitudes de otros microservicios a través de NATS y se encarga de componer, formatear y enviar correos electrónicos a los usuarios finales utilizando plantillas personalizadas y configuraciones seguras.

## Características Principales

- Envío de correos electrónicos con plantillas HTML responsivas
- Soporte para diferentes tipos de correos (verificación, notificaciones, etc.)
- Sistema de plantillas personalizable por tipo de correo
- Integración con servicios SMTP externos
- Manejo de errores robusto para garantizar la entrega
- Configuración externalizada mediante variables de entorno
- Procesamiento asíncrono de solicitudes de correo

## Tecnologías Utilizadas

- NestJS como framework principal
- TypeScript para tipado estático
- Nodemailer para envío de correos electrónicos
- NATS para comunicación entre microservicios
- HTML y CSS para plantillas de correo
- Sistema de inyección de dependencias de NestJS

## Arquitectura Detallada

### Estructura de Archivos Completa

```
mail/
├── src/
│   ├── config/               # Configuración del servicio
│   │   ├── envs.ts           # Variables de entorno para configuración SMTP
│   │   └── index.ts          # Exportación de configuraciones
│   ├── views/                # Plantillas de correo electrónico
│   │   └── mail-view.ts      # Clase para generar vistas HTML por tipo
│   ├── mail.controller.ts    # Controlador para recibir solicitudes
│   ├── mail.module.ts        # Módulo principal de configuración
│   ├── mail.service.ts       # Servicio para enviar correos
│   └── main.ts               # Punto de entrada de la aplicación
└── tsconfig.app.json         # Configuración de TypeScript específica
```

## Configuración

El servicio se configura a través de variables de entorno que deben incluirse en un archivo `.env`:

```properties
# Configuración SMTP
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=usuario@example.com
MAIL_PASSWORD=contraseña_segura

# Configuración NATS
NATS_SERVER=nats://localhost:4222
```

### Variables de Entorno Detalladas

- **MAIL_HOST**: Servidor SMTP para envío de correos (ej. smtp.gmail.com, smtp.sendgrid.net)
- **MAIL_PORT**: Puerto del servidor SMTP (comúnmente 587 para TLS o 465 para SSL)
- **MAIL_USERNAME**: Usuario para autenticación SMTP
- **MAIL_PASSWORD**: Contraseña para autenticación SMTP
- **NATS_SERVER**: URL del servidor NATS para comunicación entre microservicios

### Servicio de Autenticación (Auth)

- **Propósito**: Solicitar el envío de correos de verificación durante el registro de usuarios
- **Método de comunicación**: Patrón emisión/suscripción a través de NATS
- **Patrones de mensajes**:
  - `MailPattern.SEND_MAIL`: Para solicitar el envío de correos con códigos de verificación
- **Payload de ejemplo**:
  ```json
  {
    "code": "123456",
    "name": "Juan Pérez",
    "email": "usuario@ejemplo.com",
    "mailType": "VERIFICATION"
  }
  ```

## Tipos de Correo Soportados

El servicio actualmente soporta los siguientes tipos de correo, definidos en el enum `MailType` compartido:

1. **Verificación (`MailType.Verification`)**: 
   - Propósito: Enviar códigos de verificación para nuevos registros
   - Plantilla: Diseño limpio con código destacado para fácil lectura
   - Personalización: Incluye nombre del usuario y código único

## Plantillas de Correo

Las plantillas de correo electrónico están implementadas con HTML y CSS en línea para garantizar compatibilidad con diferentes clientes de correo:

- **Responsive**: Diseñadas para verse correctamente en dispositivos móviles y de escritorio
- **Branding consistente**: Utilizan colores y estilos corporativos
- **Accesibilidad**: Diseñadas teniendo en cuenta prácticas de accesibilidad

## Seguridad

El servicio implementa medidas de seguridad:

- **Credenciales seguras**: Almacenamiento seguro de credenciales SMTP en variables de entorno
- **Conexión cifrada**: Uso de TLS/SSL para comunicación con servidores SMTP
- **Validación de entradas**: Verificación de direcciones de correo y contenido
- **Manejo de errores**: Captura y registro de errores sin exponer información sensible

## Manejo de Errores

El servicio implementa un enfoque robusto de manejo de errores:

- **Errores de configuración**: Capturas durante la inicialización del transporte
- **Errores de envío**: Capturas durante el proceso de envío de correos
- **Registro de errores**: Logging estructurado para facilitar el diagnóstico

## Escalabilidad

El servicio está diseñado pensando en la escalabilidad:

- **Desacoplamiento**: Completamente independiente de otros servicios
- **Stateless**: No mantiene estado entre solicitudes
- **Horizontalmente escalable**: Múltiples instancias pueden ejecutarse simultáneamente

## Ejecución

```bash
# Desarrollo
npm run start:dev mail

# Producción
npm run build
npm run start:prod mail
```