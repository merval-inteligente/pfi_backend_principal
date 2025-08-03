# MERVAL - Backend API

## 🚀 Descripción

Backend moderno y escalable para la plataforma MERVAL, desarrollado con Node.js, Express y MongoDB. Esta API RESTful proporciona servicios completos para la gestión de usuarios, autenticación JWT, sistema de preferencias de acciones y gestión de sectores financieros del mercado argentino.

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
- ✅ **Servicio de Email** con Nodemailer
- ✅ **Manejo de archivos** con Multer

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
- **CORS** para control de acceso

## 📦 Instalación

### Prerrequisitos

- Node.js ≥18.0.0
- MongoDB Atlas o local
- Cuenta de Cloudinary
- Servicio SMTP para emails (Gmail recomendado)

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
   Crear archivo `.env` en la raíz del proyecto:
   ```env
   # MongoDB
   MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/MervalDB?retryWrites=true&w=majority

   # JWT
   JWT_SECRET=tu_jwt_secret_muy_seguro_y_largo
   JWT_EXPIRES_IN=7d

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret

   # Email (Gmail)
   EMAIL_USER=tu_email@gmail.com
   EMAIL_PASS=tu_app_password_gmail

   # Servidor
   PORT=8080
   NODE_ENV=development

   # CORS (opcional)
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Poblar la base de datos con símbolos del MERVAL**
   ```bash
   node scripts/seed-symbols.js
   ```

5. **Iniciar el servidor**
   ```bash
   # Desarrollo
   npm start
   
   # Con recarga automática (si tienes nodemon)
   npm run dev
   ```

## 🔗 Endpoints de la API

### 🔐 Autenticación
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Registro de usuario (con/sin avatar) | ❌ |
| `POST` | `/api/auth/login` | Login de usuario | ❌ |
| `GET` | `/api/auth/profile` | Obtener perfil del usuario | ✅ |
| `PUT` | `/api/auth/profile` | Actualizar perfil del usuario | ✅ |
| `POST` | `/api/auth/avatar` | Subir/actualizar avatar | ✅ |
| `DELETE` | `/api/auth/avatar` | Eliminar avatar | ✅ |

### 📊 Preferencias de Acciones
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/user/preferences` | Obtener preferencias del usuario | ✅ |
| `GET` | `/api/user/preferences/stocks/symbols` | Símbolos válidos del MERVAL | ❌ |
| `GET` | `/api/user/preferences/stocks/complete` | Todas las acciones con info completa | ✅ |
| `GET` | `/api/user/preferences/stocks/sectors` | Sectores financieros disponibles | ✅ |
| `POST` | `/api/user/preferences/stocks/favorite` | Agregar acción individual a favoritos | ✅ |
| `POST` | `/api/user/preferences/stocks/favorite/sector` | Agregar todas las acciones de un sector | ✅ |
| `DELETE` | `/api/user/preferences/stocks/favorite/:symbol` | Quitar acción de favoritos | ✅ |
| `PUT` | `/api/user/preferences` | Actualizar preferencias completas | ✅ |
| `PATCH` | `/api/user/preferences` | Actualización parcial de preferencias | ✅ |

### 🏥 Monitoreo
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/base/health` | Health check del sistema | ❌ |

### 📧 Servicios de Email
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/mail/send` | Enviar email genérico | ✅ |
| `POST` | `/api/mail/reset-password` | Solicitar reset de contraseña | ❌ |

## 📈 Sectores Financieros del MERVAL

El sistema maneja **12 sectores** principales del mercado argentino:

| Sector | Símbolos Incluidos | Descripción |
|--------|-------------------|-------------|
| **Bancos** | BBAR, BMA, GGAL, SUPV, VALO | Entidades financieras y bancarias |
| **Petróleo y Gas** | YPF, TGNO4, BOLT | Empresas de energía y petróleo |
| **Telecomunicaciones** | CVH, TECO2 | Servicios de comunicaciones |
| **Energía** | EDN, TGLT, CRES | Generación y distribución eléctrica |
| **Siderurgia** | TX, SIDE | Industria del acero y metales |
| **Alimentos** | LEDE, GRIM | Industria alimentaria |
| **Construcción** | CECO2, BOLT | Construcción y materiales |
| **Metalurgia** | ALUA, CELU | Metales y minería |
| **Papel** | PAPX, CORD | Industria papelera |
| **Transporte** | DOME, GARO | Logística y transporte |
| **Holding** | GRIM, CRES | Empresas holding |
| **Otros** | BYMA, CVAR | Otras industrias |

## 🔧 Estructura del Proyecto

```
BACKEND/
├── 📄 app.js                    # Archivo principal de la aplicación
├── 📄 package.json             # Dependencias y scripts
├── 📄 .env                     # Variables de entorno (no versionado)
├── 📄 .gitignore              # Archivos ignorados por Git
├── 📄 README.md               # Documentación principal
├── 📄 API_DOCUMENTATION.md    # Documentación detallada de API
├── 📄 CHANGELOG.md            # Historial de cambios
│
├── 📁 config/
│   └── 📄 index.js            # Configuración general
│
├── 📁 controllers/            # Controladores de rutas
│   ├── 📄 auth.controller.js      # Autenticación y usuarios
│   ├── 📄 base.controller.js      # Health check y básicos
│   ├── 📄 mail.controller.js      # Servicios de email
│   └── 📄 preferences.controller.js # Gestión de preferencias
│
├── 📁 middleware/             # Middleware personalizado
│   ├── 📄 auth.js            # Autenticación JWT
│   └── 📄 validators.js      # Validadores de entrada
│
├── 📁 models/                # Modelos de base de datos
│   ├── 📄 User.model.js      # Modelo de usuario
│   └── 📄 Symbol.model.js    # Modelo de símbolos/acciones
│
├── 📁 routes/                # Definición de rutas
│   ├── 📄 api.js            # Enrutador principal de API
│   ├── 📄 index.js          # Rutas base
│   └── 📁 api/              # Rutas específicas de API
│       ├── 📄 auth.route.js        # Rutas de autenticación
│       ├── 📄 base.route.js        # Rutas básicas
│       ├── 📄 mail.route.js        # Rutas de email
│       └── 📄 preferences.route.js # Rutas de preferencias
│
├── 📁 scripts/               # Scripts de utilidad
│   └── 📄 seed-symbols.js    # Script para poblar símbolos del MERVAL
│
└── 📁 services/              # Lógica de negocio
    ├── 📄 auth.service.js         # Servicios de autenticación
    ├── 📄 cloudinary.js          # Integración con Cloudinary
    ├── 📄 nodemailer.js          # Configuración de email
    ├── 📄 preferences.service.js  # Lógica de preferencias
    └── 📄 user.service.js        # Servicios de usuario
```

## 🚀 Uso de la API

### Autenticación JWT
Todos los endpoints protegidos requieren el token JWT en el header:
```javascript
headers: {
  'Authorization': 'Bearer tu_jwt_token_aqui',
  'Content-Type': 'application/json'
}
```

### Ejemplo: Registro de usuario con avatar
```javascript
// Con FormData (para subir avatar)
const formData = new FormData();
formData.append('email', 'usuario@email.com');
formData.append('password', 'password123');
formData.append('name', 'Juan Pérez');
formData.append('acceptTerms', 'true');
formData.append('avatar', file); // File object

fetch('/api/auth/register', {
  method: 'POST',
  body: formData
});
```

### Ejemplo: Login y obtener token
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@email.com',
    password: 'password123'
  })
});

const data = await response.json();
const token = data.data.token; // Guardar para futuras peticiones
```

### Ejemplo: Agregar sector completo a favoritos
```javascript
const response = await fetch('/api/user/preferences/stocks/favorite/sector', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    sector: 'Bancos' // Agrega BBAR, BMA, GGAL, SUPV, VALO
  })
});
```

### Ejemplo: Obtener preferencias del usuario
```javascript
const response = await fetch('/api/user/preferences', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
});

const preferences = await response.json();
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

```bash
# Iniciar servidor de producción
npm start

# Iniciar servidor de desarrollo (con nodemon si está instalado)
npm run dev

# Poblar base de datos con símbolos del MERVAL
node scripts/seed-symbols.js

# Verificar estructura del proyecto
npm run check

# Limpiar logs (si existe)
npm run clean
```

## 🛡️ Seguridad Implementada

- **🔐 JWT Tokens** con expiración configurable (por defecto 7 días)
- **🔒 Bcrypt** para hash seguro de contraseñas (salt rounds: 12)
- **🛡️ Helmet** para headers de seguridad HTTP
- **✅ Validación robusta** de todos los inputs con express-validator
- **🔑 Middleware de autenticación** en endpoints protegidos
- **🌐 CORS** configurado para frontend específico
- **📝 Sanitización** de datos de entrada
- **🚫 Rate limiting** (configurable)
- **🔍 Logging** de actividades importantes

## 📊 Base de Datos

### Modelos Principales

#### Usuario (User)
```javascript
{
  name: String,           // Nombre completo
  email: String,          // Email único
  password: String,       // Hash de contraseña
  avatar: {              // Avatar en Cloudinary
    url: String,
    publicId: String,
    uploadedAt: Date
  },
  preferences: {         // Preferencias del usuario
    favoriteStocks: [String],  // Array de símbolos favoritos (max 50)
    notifications: Boolean,     // Notificaciones activadas
    theme: String              // Tema: 'light', 'dark', 'system'
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Símbolo (Symbol)
```javascript
{
  symbol: String,        // Código del símbolo (ej: "GGAL")
  name: String,          // Nombre completo (ej: "Grupo Financiero Galicia")
  sector: String,        // Sector financiero
  market: String,        // Mercado (MERVAL)
  currency: String,      // Moneda (ARS)
  description: String,   // Descripción opcional
  isActive: Boolean,     // Si está activo para trading
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing y Desarrollo

### Probar endpoints con cURL

```bash
# Health Check
curl -X GET http://localhost:8080/api/base/health

# Registro sin avatar
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@merval.com","password":"password123","name":"Usuario Test","acceptTerms":true}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@merval.com","password":"password123"}'

# Obtener símbolos (sin auth)
curl -X GET http://localhost:8080/api/user/preferences/stocks/symbols

# Agregar favorito (con auth)
curl -X POST http://localhost:8080/api/user/preferences/stocks/favorite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{"symbol":"GGAL"}'
```

### Variables de Entorno para Testing

```env
# .env.test
NODE_ENV=test
PORT=8081
MONGO_URI=mongodb://localhost:27017/merval_test
JWT_SECRET=test_secret_key
JWT_EXPIRES_IN=1h
```

## 🔧 Configuración Avanzada

### Configuración de Cloudinary
```javascript
// En cloudinary.js
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});
```

### Configuración de MongoDB
```javascript
// Opciones recomendadas para producción
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

## 📝 Logs y Monitoreo

El sistema utiliza Morgan para logging HTTP y console logs estructurados:

```bash
# Formato de logs de desarrollo
GET /api/auth/profile 200 15.234 ms - 486

# Logs de aplicación
🚀 Servidor MERVAL iniciado en el puerto 8080
✅ Conectado exitosamente a MongoDB
📦 Modelos registrados: [ 'User', 'Symbol' ]
```

## 🐛 Troubleshooting

### Problemas Comunes

#### Error de conexión a MongoDB
```bash
# Verificar la URI en .env
# Asegurar que la IP esté en whitelist (MongoDB Atlas)
# Verificar credenciales de usuario
```

#### Error de Cloudinary
```bash
# Verificar credenciales en .env
# Comprobar límites de almacenamiento
# Verificar formato de imagen (JPEG, PNG, GIF)
```

#### Token JWT inválido
```bash
# Verificar que JWT_SECRET sea consistente
# Comprobar expiración del token
# Asegurar formato correcto: "Bearer token"
```

#### CORS Error
```bash
# Verificar CORS_ORIGIN en .env
# Asegurar que el frontend esté en dominio permitido
# Comprobar headers de preflight
```

## 📈 Rendimiento y Optimización

- **Índices de MongoDB** en campos frecuentemente consultados
- **Paginación** en endpoints que retornan listas
- **Caché** de símbolos válidos (5 minutos)
- **Compresión gzip** habilitada
- **Connection pooling** de MongoDB optimizado
- **Lazy loading** de relaciones no críticas

## 🔄 Actualizaciones y Mantenimiento

### Cambios Recientes

#### v1.3.0 (Agosto 2025)
- ✅ **JWT extendido** a 7 días de expiración
- ✅ **Endpoint por sectores** - Agregar todas las acciones de un sector
- ✅ **Limpieza de código** - Eliminados archivos redundantes
- ✅ **Simplificación** del sistema de health check
- ✅ **Documentación actualizada** y completa

#### v1.2.0 (Julio 2025)
- ✅ **Sistema de preferencias** simplificado
- ✅ **Eliminación de watchlist** (solo favoritos)
- ✅ **Optimización de validators**
- ✅ **Mejoras en manejo de errores**

### Próximas Mejoras Planificadas

- 🔄 **Testing automatizado** con Jest
- 🔄 **Rate limiting** por usuario
- 🔄 **Logs estructurados** con Winston
- 🔄 **Métricas de performance** con Prometheus
- 🔄 **Documentación API** con Swagger
- 🔄 **CI/CD pipeline** con GitHub Actions

## 🤝 Contribución

### Cómo Contribuir

1. **Fork** el proyecto
2. **Crear rama** feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abrir Pull Request** con descripción detallada

### Convenciones de Código

- **ESLint** para linting
- **Prettier** para formateo
- **Conventional Commits** para mensajes
- **Documentación JSDoc** en funciones complejas

### Standards de Commits

```bash
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formateo de código
refactor: refactorización
test: agregar tests
chore: tareas de mantenimiento
```

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**.

```
MIT License

Copyright (c) 2025 Nicolas Petcoff

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Autor

**Nicolas Petcoff**
- 🐙 GitHub: [@nicopetcoff](https://github.com/nicopetcoff)
- 📧 Email: nicolas.petcoff@example.com
- 🌐 LinkedIn: [Nicolas Petcoff](https://linkedin.com/in/nicopetcoff)

## 🙏 Agradecimientos

- **MongoDB** por la excelente base de datos NoSQL
- **Express.js** por el framework web minimalista
- **Cloudinary** por el servicio de gestión de imágenes
- **JWT.io** por la implementación de tokens seguros
- **Comunidad Open Source** por las librerías utilizadas

## 📞 Soporte y Contacto

### Para Soporte Técnico:
- 📋 **Crear issue** en el repositorio de GitHub
- 📖 **Consultar documentación** en `API_DOCUMENTATION.md`
- 🔍 **Revisar troubleshooting** en esta sección

### Para Consultas Comerciales:
- 📧 **Email**: soporte@merval-backend.com
- 💬 **Discord**: [Servidor MERVAL](https://discord.gg/merval)
- 📱 **Telegram**: [@merval_support](https://t.me/merval_support)

### Horarios de Soporte:
- **Lunes a Viernes**: 9:00 - 18:00 (GMT-3)
- **Sábados**: 10:00 - 14:00 (GMT-3)
- **Emergencias**: 24/7 para clientes enterprise

---

<div align="center">

**🇦🇷 MERVAL Backend API** - Sistema robusto para gestión financiera

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Secure-orange.svg)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Desarrollado con ❤️ en Argentina**

</div>
