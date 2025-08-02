# Changelog - MERVAL Backend

## [1.2.0] - 2025-01-30

### 🔥 CAMBIOS PRINCIPALES - REDISEÑO DEL MODELO DE PREFERENCIAS

### Eliminado ❌
- **Funcionalidad de Watchlist**: Eliminada completamente del sistema
  - Modelo User: Removido array `watchlist` de preferences
  - Servicios: Eliminados métodos `addWatchlistStock`, `removeWatchlistStock`
  - Controladores: Removidos endpoints de watchlist
  - Rutas: Eliminadas rutas `/watchlist`
  - Validadores: Removida validación de watchlist
  - Documentación: Actualizada para reflejar cambios

### Simplificado ✨
- **Sistema de Preferencias**: Ahora solo incluye:
  - `favoriteStocks`: Array de símbolos favoritos (máximo 50)
  - `notifications`: Configuración booleana
  - `theme`: Tema de la aplicación ('light', 'dark', 'system')

### Mantenido ✅
- **Sistema de Autenticación**: Completamente funcional
- **Gestión de Avatares**: Sin cambios
- **Base de Datos de Símbolos**: 25 símbolos del MERVAL
- **Validaciones**: Mantenidas para favoriteStocks

---

## [1.1.0] - 2025-01-30

### Añadido ✨
- **Sistema de Preferencias de Usuario**
  - Gestión completa de preferencias con favoriteStocks y watchlist
  - Endpoints CRUD para gestión de stocks favoritos y watchlist
  - Validación automática de símbolos contra base de datos
  - Actualizaciones completas y parciales de preferencias

- **Base de Datos de Símbolos del MERVAL**
  - 25 símbolos principales del mercado argentino
  - Script automático de población de datos
  - Validación en tiempo real de símbolos válidos
  - Endpoint para obtener lista de símbolos disponibles

- **Nuevos Endpoints de Preferencias**
  - `GET /api/user/preferences` - Obtener preferencias
  - `PUT /api/user/preferences` - Actualizar preferencias completas
  - `PATCH /api/user/preferences` - Actualización parcial
  - `POST /api/user/preferences/stocks/favorite` - Agregar a favoritos
  - `DELETE /api/user/preferences/stocks/favorite/:symbol` - Quitar de favoritos
  - `POST /api/user/preferences/stocks/watchlist` - Agregar a watchlist
  - `DELETE /api/user/preferences/stocks/watchlist/:symbol` - Quitar de watchlist
  - `GET /api/user/preferences/stocks/symbols` - Listar símbolos disponibles

### Mejorado 🔧
- **Validaciones**: Middleware robusto para validación de preferencias
- **Servicios**: Lógica de negocio separada y reutilizable
- **Documentación**: API_DOCUMENTATION.md completamente actualizada

---

## [1.0.0] - 2025-01-29

### Añadido ✨
- **Sistema de Autenticación Completo**
  - Registro de usuarios con avatar opcional
  - Login con JWT tokens
  - Gestión de perfiles de usuario
  - Middleware de autenticación para rutas protegidas

- **Sistema de Avatares con Cloudinary**
  - Subida de avatares con optimización automática
  - Transformaciones: 300x300, circular, centrado en cara
  - Gestión completa: subir, actualizar, eliminar
  - Integración seamless con perfiles de usuario

- **Arquitectura del Backend**
  - Servidor Express.js configurado
  - Conexión a MongoDB Atlas
  - Estructura MVC bien definida
  - Middleware de seguridad (Helmet, CORS)
  - Logging con Morgan

### Configurado ⚙️
- **Base de Datos**: MongoDB Atlas (MervalDB)
- **Seguridad**: JWT, bcrypt, validaciones
- **Storage**: Cloudinary para imágenes
- **Desarrollo**: Nodemon, debugging

---

## Notas Técnicas

### Migración del Modelo de Preferencias (v1.2.0)
La decisión de eliminar watchlist y simplificar el modelo se basó en:
- **Reducir complejidad**: Un solo array de favoritos es más simple de manejar
- **Mejor UX**: Los usuarios tienden a usar una sola lista de seguimiento
- **Mantenibilidad**: Menos código = menos bugs y mejor mantenimiento
- **Performance**: Menos validaciones y operaciones de base de datos

### Compatibilidad
- **Frontend**: Requiere actualización para eliminar referencias a watchlist
- **Base de Datos**: Los documentos existentes mantendrán compatibilidad (watchlist será ignorado)
- **API**: Los endpoints de watchlist devuelven 404 (eliminados)

### Próximos Pasos
- [ ] Implementar notificaciones push
- [ ] Agregar sistema de alertas de precios
- [ ] Dashboard de estadísticas de usuario
- [ ] Sistema de portfolios
