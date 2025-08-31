# MERVAL Backend API

Backend para aplicación de inversiones en el mercado argentino MERVAL. Permite gestionar usuarios, seguimiento de acciones por sectores y envío de notificaciones por email.

## Tecnologías

- **Node.js** + Express.js
- **MongoDB** con Mongoose
- **JWT** para autenticación
- **Nodemailer** para emails
- **Cloudinary** para imágenes

## Instalación

```bash
npm install
```

## Configuración

Crear archivo `.env` con:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/merval_backend
JWT_SECRET=tu_jwt_secret_key
JWT_EXPIRES_IN=7d

EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## Ejecutar

```bash
npm start
```

La API estará disponible en `http://localhost:3000`

## Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/request-reset` - Solicitar reset de contraseña
- `POST /api/auth/verify-reset` - Verificar código de reset
- `POST /api/auth/reset-password` - Cambiar contraseña

### Usuarios
- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil
- `POST /api/users/avatar` - Subir avatar

### Acciones y Sectores
- `GET /api/symbols` - Listar todas las acciones
- `GET /api/symbols/sectors` - Listar sectores disponibles
- `GET /api/symbols/sector/:sector` - Acciones por sector
- `POST /api/users/favorites` - Agregar a favoritos
- `DELETE /api/users/favorites/:symbol` - Quitar de favoritos

### Email
- `POST /api/mail/send` - Enviar email personalizado

## Sectores MERVAL

El sistema maneja 12 sectores principales:
- Bancos
- Energía
- Telecomunicaciones
- Alimentos
- Acero
- Petróleo y Gas
- Holding y Otros
- Construcción
- Papel y Celulosa
- Textil
- Medicina
- Transporte

## Estructura del Proyecto

```
├── controllers/     # Lógica de controladores
├── models/         # Modelos de MongoDB
├── routes/         # Definición de rutas
├── services/       # Lógica de negocio
├── auth/          # Middleware de autenticación
├── config.js      # Configuración general
└── app.js         # Aplicación principal
```

## Registro de Usuario

Los usuarios se registran con:
- Datos básicos (nombre, email, contraseña)
- Nivel de conocimiento en inversiones
- Perfil de riesgo de inversión

## Reset de Contraseña

Sistema de recuperación por email:
1. Usuario solicita reset con su email
2. Recibe código de 6 dígitos por email
3. Verifica código e ingresa nueva contraseña

## Base de Datos

### Colecciones principales:
- `users` - Información de usuarios y favoritos
- `symbols` - Acciones del MERVAL organizadas por sector
