
# MERVAL - Backend API

## 🚀 Descripción

Backend moderno y escalable para la plataforma MERVAL, desarrollado con Node.js, Express y MongoDB. Esta API RESTful proporciona servicios completos para la gestión de usuarios, autenticación JWT, sistema de preferencias de acciones y gestión de sectores financieros.

## 📋 Características Principales

- ✅ **API RESTful** moderna con Express.js
- ✅ **Autenticación JWT** segura con expiración extendida (7 días)
- ✅ **Sistema de Avatares** con Cloudinary
- ✅ **Gestión de Preferencias** para favoritos de acciones
- ✅ **Sectores Financieros** organizados del MERVAL
- ✅ **Agregación por Sectores** - Agregar todas las acciones de un sector a favoritos
- ✅ **Validación de datos** robusta con express-validator
- ✅ **Base de datos MongoDB** con Mongoose
- ✅ **Seguridad avanzada** con Helmet y middleware personalizado
- ✅ **Health Check** para monitoreo de servicios

## 🛠️ Tecnologías Utilizadas

- **Node.js** (≥18.0.0)
- **Express.js** 4.18.2
- **MongoDB Atlas** con Mongoose 8.0.3
- **JWT** para autenticación (expiración 7 días)
- **Cloudinary** para gestión de avatares
- **Bcrypt** para encriptación de contraseñas
- **Express Validator** para validación
- **Helmet** para seguridad
- **Morgan** para logging
- **Multer** para manejo de archivos
- **Nodemailer** para servicios de email

## 📦 Instalación

### Prerrequisitos

- Node.js ≥18.0.0
- MongoDB Atlas o local
- Cuenta de Cloudinary
- Servicio SMTP para emails

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/nicopetcoff/pfi_backend_principal.git
   cd BACKEND
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear archivo `.env` con:
   ```env
   # MongoDB
   MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/MervalDB

   # JWT
   JWT_SECRET=tu_jwt_secret_muy_seguro
   JWT_EXPIRES_IN=7d

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret

   # Email
   EMAIL_USER=tu_email@gmail.com
   EMAIL_PASS=tu_app_password

   # Servidor
   PORT=8080
   NODE_ENV=development
   ```

4. **Poblar la base de datos con símbolos**
   ```bash
   node scripts/seed-symbols.js
   ```

5. **Iniciar el servidor**
   ```bash
   npm start
   ```

## 🔗 Endpoints Principales

### 🔐 Autenticación
- `POST /api/auth/register` - Registro de usuario (con/sin avatar)
- `POST /api/auth/login` - Login de usuario
- `GET /api/auth/profile` - Obtener perfil del usuario
- `PUT /api/auth/profile` - Actualizar perfil del usuario

### 📊 Preferencias de Acciones
- `GET /api/user/preferences` - Obtener preferencias del usuario
- `GET /api/user/preferences/stocks/symbols` - Símbolos válidos (sin auth)
- `GET /api/user/preferences/stocks/complete` - Todas las acciones con info completa
- `GET /api/user/preferences/stocks/sectors` - Sectores disponibles
- `POST /api/user/preferences/stocks/favorite` - Agregar acción a favoritos
- `POST /api/user/preferences/stocks/favorite/sector` - Agregar todas las acciones de un sector
- `DELETE /api/user/preferences/stocks/favorite/:symbol` - Quitar acción de favoritos

### 🏥 Monitoreo
- `GET /api/base/health` - Health check del sistema

### 📧 Email
- `POST /api/mail/send` - Enviar email
- `POST /api/mail/reset-password` - Solicitar reset de contraseña

## 📈 Sectores Financieros Disponibles

El sistema maneja 12 sectores del MERVAL:
- **Bancos** (BBAR, BMA, GGAL, SUPV, VALO)
- **Petróleo y Gas** (YPF, TGNO4, BOLT)
- **Telecomunicaciones** (CVH, TECO2)
- **Energía** (EDN, TGLT, CRES)
- **Siderurgia** (TX, SIDE)
- **Alimentos** (LEDE, GRIM)
- **Construcción** (CECO2, BOLT)
- **Metalurgia** (ALUA, CELU)
- **Papel** (PAPX, CORD)
- **Transporte** (DOME, GARO)
- **Holding** (GRIM, CRES)
- **Otros** (BYMA, CVAR)

## 🔧 Configuración del Proyecto

### Estructura del Proyecto
```
BACKEND/
├── app.js                 # Archivo principal
├── config/
│   └── index.js          # Configuración de la aplicación
├── controllers/
│   ├── auth.controller.js
│   ├── base.controller.js
│   ├── mail.controller.js
│   └── preferences.controller.js
├── middleware/
│   ├── auth.js           # Middleware de autenticación JWT
│   └── validators.js     # Validadores de entrada
├── models/
│   ├── User.model.js     # Modelo de usuario
│   └── Symbol.model.js   # Modelo de símbolos/acciones
├── routes/
│   ├── api.js           # Enrutador principal
│   ├── index.js         # Rutas base
│   └── api/
│       ├── auth.route.js
│       ├── base.route.js
│       ├── mail.route.js
│       └── preferences.route.js
├── scripts/
│   └── seed-symbols.js   # Script para poblar símbolos
├── services/
│   ├── auth.service.js
│   ├── cloudinary.js
│   ├── nodemailer.js
│   ├── preferences.service.js
│   └── user.service.js
└── package.json
```

## 🚀 Uso de la API

### Autenticación
Todos los endpoints (excepto registro, login y símbolos) requieren JWT token:
```javascript
headers: {
  'Authorization': 'Bearer tu_jwt_token',
  'Content-Type': 'application/json'
}
```

### Ejemplo: Agregar sector completo a favoritos
```javascript
POST /api/user/preferences/stocks/favorite/sector
{
  "sector": "Bancos"
}
```

### Ejemplo: Obtener preferencias
```javascript
GET /api/user/preferences
// Respuesta:
{
  "status": 200,
  "data": {
    "preferences": {
      "favoriteStocks": ["GGAL", "YPF", "BBAR"],
      "notifications": true,
      "theme": "light"
    }
  }
}
```

## 🔄 Scripts Disponibles

- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor en desarrollo (si tienes nodemon)
- `node scripts/seed-symbols.js` - Poblar base de datos con símbolos

## 🛡️ Seguridad

- **JWT Tokens** con expiración de 7 días
- **Bcrypt** para encriptación de contraseñas
- **Helmet** para headers de seguridad
- **Validación robusta** de todos los inputs
- **Middleware de autenticación** en endpoints protegidos
- **CORS** configurado para frontend

## 📝 Cambios Recientes

### v1.3.0 (Agosto 2025)
- ✅ **JWT extendido** a 7 días de expiración
- ✅ **Endpoint por sectores** - Agregar todas las acciones de un sector
- ✅ **Limpieza de código** - Eliminados archivos redundantes
- ✅ **Simplificación** del sistema de health check
- ✅ **Documentación actualizada**

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

**Nicolas Petcoff**
- GitHub: [@nicopetcoff](https://github.com/nicopetcoff)

## 📞 Soporte

Para soporte técnico, crear un issue en el repositorio de GitHub.

---

**MERVAL Backend API** - Sistema robusto para gestión financiera 📈

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env con las siguientes variables:
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/MervalDB
   JWT_SECRET=tu_jwt_secret_muy_seguro
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```

4. **Iniciar el servidor**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm start
   ```

## 🚀 Scripts Disponibles

```bash
# Iniciar servidor de producción
npm start

# Desarrollo con recarga automática (si tienes nodemon)
npm run dev
```
npm setup
```

## ⚙️ Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```bash
# Servidor
PORT=8080
NODE_ENV=development

# Base de datos MongoDB Atlas
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/MervalDB?retryWrites=true&w=majority

# Seguridad JWT
JWT_SECRET=tu_jwt_secret_super_seguro

# Cloudinary para avatares
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## 📚 Documentación de API

### 🔗 URL Base: `http://localhost:8080/api`

### Endpoints Principales

#### 🔐 Autenticación
- `POST /auth/register` - Registro de usuario (con/sin avatar)
- `POST /auth/login` - Login de usuario
- `GET /auth/profile` - Obtener perfil del usuario (requiere auth)
- `PUT /auth/profile` - Actualizar perfil (requiere auth)

#### 🖼️ Gestión de Avatares
- `POST /auth/avatar` - Subir avatar (requiere auth)
- `DELETE /auth/avatar` - Eliminar avatar (requiere auth)

### Autenticación

La API utiliza JWT Bearer tokens:

```bash
Authorization: Bearer <tu_jwt_token>
```

### Códigos de Estado

- `200` - Operación exitosa
- `201` - Usuario creado
- `400` - Datos inválidos
- `401` - No autorizado (token inválido)
- `404` - Usuario no encontrado
- `500` - Error interno del servidor

### 📖 Documentación Completa

Para documentación detallada con ejemplos de código y respuestas:
- **API_DOCUMENTATION.md** - Documentación completa de todos los endpoints
- **FRONTEND_INTEGRATION_GUIDE.md** - Guía rápida para integración frontend

## 🔒 Seguridad

- **Helmet**: Protección de headers HTTP
- **JWT**: Tokens seguros con expiración
- **Bcrypt**: Encriptación segura de contraseñas
- **Validación**: Validación robusta con express-validator
- **Cloudinary**: Gestión segura de imágenes
- **CORS**: Control de acceso entre dominios

## 📊 Estructura del Proyecto

```
BACKEND/
├── app.js                          # Punto de entrada de la aplicación
├── package.json                    # Dependencias y scripts
├── .env                           # Variables de entorno
├── API_DOCUMENTATION.md           # Documentación completa de API
├── FRONTEND_INTEGRATION_GUIDE.md  # Guía para frontend
├── controllers/
│   └── auth.controller.js         # Controladores de autenticación
├── models/
│   └── User.model.js             # Modelo de usuario
├── services/
│   ├── auth.service.js           # Lógica de negocio auth
│   └── cloudinary.js            # Servicio de Cloudinary
├── routes/
│   └── api/
│       └── auth.route.js         # Rutas de autenticación
├── middleware/
│   ├── auth.middleware.js        # Middleware de autenticación
│   └── validators.js            # Validadores de datos
└── config/
    └── database.js              # Configuración de MongoDB
```
│   ├── profesor.model.js
│   ├── cursos.model.js
│   └── comentario.model.js
├── controllers/         # Controladores de rutas
│   ├── users.controller.js
│   ├── cursos.controller.js
│   ├── profesor.controller.js
│   ├── comentarios.controller.js
│   ├── solicitudes.controller.js
│   └── mail.controller.js
├── services/           # Lógica de negocio
│   ├── user.service.js
│   ├── cursos.service.js
│   ├── profesor.service.js
│   ├── comentarios.service.js
│   ├── solicitudes.service.js
│   ├── cloudinary.js
│   └── nodemailer.js
├── routes/             # Definición de rutas
│   ├── index.js
│   ├── api.js
│   └── api/
│       ├── user.route.js
│       ├── cursos.route.js
│       ├── profesor.route.js
│       ├── comentarios.route.js
│       ├── solicitudes.route.js
│       └── mail.route.js
├── middleware/         # Middleware personalizado
│   └── validators.js
├── auth/              # Autenticación y autorización
│   └── authorization.js
└── scripts/           # Scripts de utilidad
    └── database.js    # Migraciones y optimización
```

## 🐛 Resolución de Problemas

### Error de Conexión a MongoDB
```bash
# Verificar la cadena de conexión en .env
# Asegurar que MongoDB esté ejecutándose
# Verificar permisos de red (whitelist IP en Atlas)
```

### Error de Cloudinary
```bash
# Verificar credenciales en .env
# Comprobar límites de la cuenta
```

### Error de CORS
```bash
# Verificar CORS_ORIGIN en .env
# Asegurar que el frontend esté en la lista permitida
```

## 📈 Optimización y Rendimiento

- **Índices de MongoDB** optimizados
- **Paginación** eficiente
- **Compresión gzip** habilitada
- **Conexión pooling** de MongoDB
- **Caché de imágenes** con Cloudinary

## 🔄 Migraciones

Para actualizar la base de datos después de cambios en el esquema:

```bash
npm run migrate
```

## 🧪 Testing

Para probar los endpoints:

```bash
# Registro con JSON
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@merval.com","password":"password123","name":"Usuario Test","acceptTerms":true}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@merval.com","password":"password123"}'
```

## 📝 Estado del Proyecto

**🟢 COMPLETAMENTE FUNCIONAL**

- ✅ Sistema de autenticación completo
- ✅ Gestión de avatares con Cloudinary
- ✅ Validaciones robustas
- ✅ Documentación completa
- ✅ Soporte React Native
- ✅ Manejo de errores

## 🚀 Próximos Pasos

1. Desarrollar frontend React Native
2. Implementar funcionalidades específicas de MERVAL
3. Agregar testing automatizado
4. Configurar CI/CD

## 📞 Soporte

Para problemas o preguntas:
- Revisar **API_DOCUMENTATION.md**
- Consultar **FRONTEND_INTEGRATION_GUIDE.md**
- Contactar a los desarrolladores

## 📄 Licencia

Este proyecto es privado y pertenece a los integrantes mencionados.

Este proyecto es privado y está destinado únicamente para uso académico.

---

**Desarrollado con ❤️ por el equipo EDUWIZARD**

