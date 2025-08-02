# MERVAL Backend - Documentación de API Completa

## 🚀 Endpoints de Autenticación

### 1. Registro de Usuario (con Avatar Opcional)
```
POST http://localhost:8080/api/auth/register
```

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (FormData):**
```
email: usuario@ejemplo.com
password: miPassword123
name: Juan Pérez
acceptTerms: true
avatar: [archivo de imagen - OPCIONAL]
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario creado exitosamente con avatar",
  "data": {
    "user": {
      "id": "688a75b27138cd6b61937dcf",
      "email": "usuario@ejemplo.com",
      "name": "Juan Pérez",
      "avatar": {
        "url": "https://res.cloudinary.com/dxgbzpvaq/image/upload/v1753904564/merval/avatars/user_688a75b27138cd6b61937dcf_avatar.png",
        "publicId": "merval/avatars/user_688a75b27138cd6b61937dcf_avatar",
        "uploadedAt": "2025-07-30T19:42:44.472Z"
      },
      "preferences": {
        "favoriteStocks": [],
        "notifications": true,
        "theme": "system"
      },
      "createdAt": "2025-07-30T19:42:42.503Z",
      "lastLogin": "2025-07-30T19:42:42.467Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGE3NWIyNzEzOGNkNmI2MTkzN2RjZiIsImVtYWlsIjoiZGV0YWlsZWQtdGVzdDE3NTM5MDQ1NjIyMTNAbWVydmFsLmNvbSIsImlhdCI6MTc1MzkwNDU2MywiZXhwIjoxNzUzOTkwOTYzfQ.ZTDScdWXc_jZVuv_83RdExDCSgyYHB1Pz9XiCpsynCE",
    "avatar": {
      "url": "https://res.cloudinary.com/dxgbzpvaq/image/upload/v1753904564/merval/avatars/user_688a75b27138cd6b61937dcf_avatar.png",
      "publicId": "merval/avatars/user_688a75b27138cd6b61937dcf_avatar",
      "uploaded": true
    }
  }
}
```

**Registro sin Avatar:**
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "user": {
      "id": "647abc123def456789012345",
      "email": "usuario@ejemplo.com",
      "name": "Juan Pérez",
      "avatar": {
        "url": null,
        "publicId": null,
        "uploadedAt": null
      },
      "preferences": {
        "favoriteStocks": [],
        "notifications": true,
        "theme": "system"
      },
      "createdAt": "2025-07-30T10:30:00.000Z",
      "lastLogin": "2025-07-30T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "avatar": null
  }
}
```

### 2. Login de Usuario
```
POST http://localhost:8080/api/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "miPassword123"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": "688a75b27138cd6b61937dcf",
      "email": "usuario@ejemplo.com",
      "name": "Juan Pérez",
      "avatar": {
        "url": "https://res.cloudinary.com/dxgbzpvaq/image/upload/v1753904564/merval/avatars/user_688a75b27138cd6b61937dcf_avatar.png",
        "publicId": "merval/avatars/user_688a75b27138cd6b61937dcf_avatar",
        "uploadedAt": "2025-07-30T19:42:44.472Z"
      },
      "preferences": {
        "favoriteStocks": [],
        "notifications": true,
        "theme": "system"
      },
      "createdAt": "2025-07-30T19:42:42.503Z",
      "lastLogin": "2025-07-30T19:42:42.467Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Obtener Perfil
```
GET http://localhost:8080/api/auth/profile
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "user": {
      "id": "688a75b27138cd6b61937dcf",
      "email": "usuario@ejemplo.com",
      "name": "Juan Pérez",
      "avatar": {
        "url": "https://res.cloudinary.com/dxgbzpvaq/image/upload/v1753904564/merval/avatars/user_688a75b27138cd6b61937dcf_avatar.png",
        "publicId": "merval/avatars/user_688a75b27138cd6b61937dcf_avatar",
        "uploadedAt": "2025-07-30T19:42:44.472Z"
      },
      "preferences": {
        "favoriteStocks": ["AAPL", "GOOGL"],
        "notifications": true,
        "theme": "system"
      },
      "createdAt": "2025-07-30T19:42:42.503Z",
      "lastLogin": "2025-07-30T19:42:42.467Z"
    }
  }
}
```

### 4. Actualizar Perfil
```
PUT http://localhost:8080/api/auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Nuevo Nombre",
  "preferences": {
    "favoriteStocks": ["AAPL", "GOOGL"],
    "notifications": false,
    "theme": "dark"
  }
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "user": {
      "id": "688a75b27138cd6b61937dcf",
      "email": "usuario@ejemplo.com",
      "name": "Nuevo Nombre",
      "avatar": {
        "url": "https://res.cloudinary.com/dxgbzpvaq/image/upload/v1753904564/merval/avatars/user_688a75b27138cd6b61937dcf_avatar.png",
        "publicId": "merval/avatars/user_688a75b27138cd6b61937dcf_avatar",
        "uploadedAt": "2025-07-30T19:42:44.472Z"
      },
      "preferences": {
        "favoriteStocks": ["AAPL", "GOOGL"],
        "notifications": false,
        "theme": "dark"
      },
      "createdAt": "2025-07-30T19:42:42.503Z",
      "lastLogin": "2025-07-30T19:42:42.467Z"
    }
  }
}
```

## �️ Endpoints de Avatar (Cloudinary)

### 5. Subir Avatar
```
POST http://localhost:8080/api/auth/avatar
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (FormData):**
```
avatar: [archivo de imagen]
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Avatar subido exitosamente",
  "data": {
    "user": {
      "id": "688a75b27138cd6b61937dcf",
      "email": "usuario@ejemplo.com",
      "name": "Juan Pérez",
      "avatar": {
        "url": "https://res.cloudinary.com/dxgbzpvaq/image/upload/v1753904564/merval/avatars/user_688a75b27138cd6b61937dcf_avatar.png",
        "publicId": "merval/avatars/user_688a75b27138cd6b61937dcf_avatar",
        "uploadedAt": "2025-07-30T19:42:44.472Z"
      },
      "preferences": {
        "favoriteStocks": [],
        "notifications": true,
        "theme": "system"
      },
      "createdAt": "2025-07-30T19:42:42.503Z",
      "lastLogin": "2025-07-30T19:42:42.467Z"
    },
    "avatar": {
      "url": "https://res.cloudinary.com/dxgbzpvaq/image/upload/v1753904564/merval/avatars/user_688a75b27138cd6b61937dcf_avatar.png",
      "publicId": "merval/avatars/user_688a75b27138cd6b61937dcf_avatar",
      "width": 300,
      "height": 300
    }
  }
}
```

### 6. Eliminar Avatar
```
DELETE http://localhost:8080/api/auth/avatar
```

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Avatar eliminado exitosamente",
  "data": {
    "user": {
      "id": "688a75b27138cd6b61937dcf",
      "email": "usuario@ejemplo.com",
      "name": "Juan Pérez",
      "avatar": {
        "url": null,
        "publicId": null,
        "uploadedAt": null
      },
      "preferences": {
        "favoriteStocks": [],
        "notifications": true,
        "theme": "system"
      },
      "createdAt": "2025-07-30T19:42:42.503Z",
      "lastLogin": "2025-07-30T19:42:42.467Z"
    }
  }
}
```

## 🔧 Características del Sistema de Avatar

### Configuración de Cloudinary:
- **Carpeta**: `merval/avatars`
- **Tamaño**: 300x300 píxeles (circular)
- **Formato**: Auto-optimizado
- **Límite de archivo**: 5MB
- **Tipos permitidos**: Solo imágenes

### Transformaciones Aplicadas:
- Redimensionado a 300x300
- Recorte centrado en cara
- Formato circular (`radius: max`)
- Optimización automática de calidad
- Conversión automática de formato

## 📱 Integración con React Native

### ⚠️ NOTAS IMPORTANTES PARA EL FRONTEND:

1. **Campo ID del Usuario**: El backend devuelve `id` (no `_id`) en todas las respuestas
2. **Registro con Avatar**: Usar `multipart/form-data` en lugar de `application/json`
3. **Avatar Opcional**: El registro funciona con o sin avatar
4. **URLs de Cloudinary**: Las URLs son públicas y optimizadas automáticamente
5. **Token JWT**: Incluir en header `Authorization: Bearer <token>` para endpoints protegidos

### Ejemplo de Registro CON Avatar (React Native):
```typescript
const registerWithAvatar = async (userData: {
  email: string;
  password: string;
  name: string;
  acceptTerms: boolean;
}, imageUri?: string) => {
  const formData = new FormData();
  
  // Datos del usuario
  formData.append('email', userData.email);
  formData.append('password', userData.password);
  formData.append('name', userData.name);
  formData.append('acceptTerms', userData.acceptTerms.toString());
  
  // Avatar opcional
  if (imageUri) {
    formData.append('avatar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as any);
  }

  try {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const data = await response.json();
    
    if (data.success) {
      // Guardar token
      await AsyncStorage.setItem('authToken', data.data.token);
      return data.data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};
```

### Ejemplo de Registro SIN Avatar (React Native):
```typescript
const registerWithoutAvatar = async (userData: {
  email: string;
  password: string;
  name: string;
  acceptTerms: boolean;
}) => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (data.success) {
      await AsyncStorage.setItem('authToken', data.data.token);
      return data.data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};
```

### Ejemplo de Login (React Native):
```typescript
const login = async (email: string, password: string) => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (data.success) {
      await AsyncStorage.setItem('authToken', data.data.token);
      return data.data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};
```
### Ejemplo de Subida de Avatar (Independiente):
```typescript
const uploadAvatar = async (imageUri: string, token: string) => {
  const formData = new FormData();
  formData.append('avatar', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'avatar.jpg',
  } as any);

  try {
    const response = await fetch('http://localhost:8080/api/auth/avatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data.user.avatar.url;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error subiendo avatar:', error);
    throw error;
  }
};
```

### Ejemplo de Obtener Perfil:
```typescript
const getProfile = async (token: string) => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    throw error;
  }
};
```

### Ejemplo de Actualización de Perfil:
```typescript
const updateProfile = async (profileData: {
  name?: string;
  preferences?: {
    favoriteStocks?: string[];
    notifications?: boolean;
    theme?: 'light' | 'dark' | 'system';
  };
}, token: string) => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();
    return data.data.user;
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    throw error;
  }
};
```

## ✅ Validaciones y Seguridad

### Registro:
- **Email**: Válido y único
- **Password**: Mínimo 6 caracteres
- **Name**: 2-100 caracteres, solo letras y espacios
- **AcceptTerms**: Obligatorio `true`

### Avatar:
- **Tipos**: Solo imágenes (jpg, png, gif, webp)
- **Tamaño**: Máximo 5MB
- **Procesamiento**: Automático con Cloudinary
- **Seguridad**: Token JWT requerido

### Autenticación:
- **JWT Tokens**: HS256, expiración configurable
- **Middleware**: Protección de rutas privadas
- **Hash**: bcrypt con salt 12 rounds

## 🧪 Pruebas con curl

### Registro:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@merval.com",
    "password": "password123",
    "name": "Usuario Test",
    "acceptTerms": true
  }'
```

### Subir Avatar:
```bash
curl -X POST http://localhost:8080/api/auth/avatar \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -F "avatar=@/ruta/a/tu/imagen.jpg"
```

## 🔄 Estados de Respuesta y Manejo de Errores

### Códigos de Estado HTTP:
| Código | Descripción | Cuándo ocurre |
|--------|-------------|---------------|
| 200 | Operación exitosa | Login, obtener perfil, actualizar datos |
| 201 | Usuario creado | Registro exitoso |
| 400 | Datos inválidos | Email ya existe, contraseña débil, datos faltantes |
| 401 | No autorizado | Token inválido/expirado, credenciales incorrectas |
| 404 | Usuario no encontrado | Usuario eliminado |
| 500 | Error interno | Error del servidor |

### Estructura de Respuestas de Error:
```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "CODIGO_ERROR",
  "errors": [
    {
      "field": "email",
      "message": "Email ya está registrado"
    }
  ]
}
```

### Errores Comunes y Códigos:

#### Registro:
- `DUPLICATE_EMAIL`: Email ya registrado
- `TERMS_NOT_ACCEPTED`: Términos no aceptados
- `VALIDATION_ERROR`: Datos inválidos (email, password, name)

#### Login:
- `INVALID_CREDENTIALS`: Email o contraseña incorrectos

#### Avatar:
- `FILE_TOO_LARGE`: Archivo mayor a 5MB
- `INVALID_FILE_TYPE`: Tipo de archivo no permitido
- `UPLOAD_FAILED`: Error subiendo a Cloudinary

#### Autenticación:
- `TOKEN_MISSING`: Token no proporcionado
- `TOKEN_INVALID`: Token inválido o expirado
- `USER_NOT_FOUND`: Usuario no existe

### Ejemplo de Manejo de Errores (React Native):
```typescript
const handleApiCall = async (apiFunction: () => Promise<any>) => {
  try {
    const result = await apiFunction();
    return { success: true, data: result };
  } catch (error: any) {
    console.error('API Error:', error);
    
    // Error de red
    if (!error.response) {
      return {
        success: false,
        message: 'Error de conexión. Verifica tu internet.',
        code: 'NETWORK_ERROR'
      };
    }
    
    // Error del servidor
    const statusCode = error.response?.status;
    const errorData = error.response?.data;
    
    switch (statusCode) {
      case 400:
        return {
          success: false,
          message: errorData?.message || 'Datos inválidos',
          code: errorData?.error || 'VALIDATION_ERROR',
          errors: errorData?.errors || []
        };
      
      case 401:
        // Token expirado - redirigir a login
        await AsyncStorage.removeItem('authToken');
        return {
          success: false,
          message: 'Sesión expirada. Inicia sesión nuevamente.',
          code: 'SESSION_EXPIRED'
        };
      
      case 404:
        return {
          success: false,
          message: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        };
      
      case 500:
        return {
          success: false,
          message: 'Error del servidor. Intenta más tarde.',
          code: 'SERVER_ERROR'
        };
      
      default:
        return {
          success: false,
          message: errorData?.message || 'Error desconocido',
          code: 'UNKNOWN_ERROR'
        };
    }
  }
};

// Uso del manejador de errores
const handleLogin = async (email: string, password: string) => {
  const result = await handleApiCall(() => login(email, password));
  
  if (result.success) {
    // Login exitoso
    setUser(result.data);
    navigation.navigate('Home');
  } else {
    // Mostrar error
    Alert.alert('Error', result.message);
    
    if (result.code === 'VALIDATION_ERROR' && result.errors) {
      // Mostrar errores específicos de validación
      result.errors.forEach(error => {
        console.log(`Error en ${error.field}: ${error.message}`);
      });
    }
  }
};
```

## 🔧 Configuración y Testing

### URL Base del API:
```
http://localhost:8080/api
```

### Endpoints Disponibles:
- `POST /auth/register` - Registro (con o sin avatar)
- `POST /auth/login` - Login
- `GET /auth/profile` - Obtener perfil (requiere token)
- `PUT /auth/profile` - Actualizar perfil (requiere token)
- `POST /auth/avatar` - Subir avatar (requiere token)
- `DELETE /auth/avatar` - Eliminar avatar (requiere token)

### Pruebas con curl:

#### Registro con JSON:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@merval.com",
    "password": "password123",
    "name": "Usuario Test",
    "acceptTerms": true
  }'
```

#### Registro con Avatar:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -F "email=test@merval.com" \
  -F "password=password123" \
  -F "name=Usuario Test" \
  -F "acceptTerms=true" \
  -F "avatar=@/ruta/a/imagen.jpg"
```

#### Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@merval.com",
    "password": "password123"
  }'
```

#### Obtener Perfil:
```bash
curl -X GET http://localhost:8080/api/auth/profile \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

#### Subir Avatar:
```bash
curl -X POST http://localhost:8080/api/auth/avatar \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -F "avatar=@/ruta/a/imagen.jpg"
```

### ✅ Sistema Totalmente Funcional

**Estado del Backend:** 🟢 **COMPLETAMENTE OPERATIVO**

✅ Registro de usuarios con/sin avatar  
✅ Login con JWT tokens  
✅ Gestión completa de avatares  
✅ Integración con Cloudinary  
✅ Validaciones robustas  
✅ Manejo de errores  
✅ Optimización de imágenes  
✅ Soporte React Native  
✅ Documentación completa  

**¡Tu backend MERVAL está listo para el desarrollo del frontend!** 🚀

### 📞 Endpoints Resumidos para Quick Reference:

| Método | Endpoint | Headers | Body | Autenticación |
|--------|----------|---------|------|---------------|
| POST | `/auth/register` | `multipart/form-data` OR `application/json` | email, password, name, acceptTerms, [avatar] | No |
| POST | `/auth/login` | `application/json` | email, password | No |
| GET | `/auth/profile` | - | - | Sí |
| PUT | `/auth/profile` | `application/json` | name, preferences | Sí |
| POST | `/auth/avatar` | `multipart/form-data` | avatar | Sí |
| DELETE | `/auth/avatar` | - | - | Sí |

---

## 📊 Endpoints de Preferencias de Usuario

### 1. Obtener Preferencias Actuales
```
GET http://localhost:8080/api/user/preferences
```

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200):**
```json
{
  "status": 200,
  "message": "Preferencias obtenidas exitosamente",
  "data": {
    "preferences": {
      "favoriteStocks": ["GGAL", "YPFD", "ALUA"],
      "notifications": true,
      "theme": "dark"
    }
  }
}
```

### 2. Actualizar Preferencias Completas
```
PUT http://localhost:8080/api/user/preferences
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "favoriteStocks": ["GGAL", "YPFD", "ALUA"],
  "notifications": false,
  "theme": "light"
}
```

**Respuesta Exitosa (200):**
```json
{
  "status": 200,
  "message": "Preferencias actualizadas exitosamente",
  "data": {
    "preferences": {
      "favoriteStocks": ["GGAL", "YPFD", "ALUA"],
      "notifications": false,
      "theme": "light"
    }
  }
}
```

### 3. Actualización Parcial de Preferencias
```
PATCH http://localhost:8080/api/user/preferences
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (solo campos a actualizar):**
```json
{
  "theme": "dark",
  "notifications": true
}
```

**Respuesta Exitosa (200):**
```json
{
  "status": 200,
  "message": "Preferencias actualizadas parcialmente",
  "data": {
    "preferences": {
      "favoriteStocks": ["GGAL", "YPFD", "ALUA"],
      "notifications": true,
      "theme": "dark"
    }
  }
}
```

### 4. Agregar Acción a Favoritos
```
POST http://localhost:8080/api/user/preferences/stocks/favorite
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "symbol": "MIRG"
}
```

**Respuesta Exitosa (200):**
```json
{
  "status": 200,
  "message": "Acción agregada a favoritos exitosamente",
  "data": {
    "preferences": {
      "favoriteStocks": ["GGAL", "YPFD", "ALUA", "MIRG"],
      "notifications": true,
      "theme": "dark"
    },
    "addedSymbol": "MIRG"
  }
}
```

**Respuesta si ya existe (409):**
```json
{
  "status": 409,
  "message": "La acción ya está en favoritos",
  "data": {
    "preferences": {
      "favoriteStocks": ["GGAL", "YPFD", "ALUA", "MIRG"],
      "notifications": true,
      "theme": "dark"
    }
  }
}
```

### 5. Quitar Acción de Favoritos
```
DELETE http://localhost:8080/api/user/preferences/stocks/favorite/MIRG
```

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200):**
```json
{
  "status": 200,
  "message": "Acción removida de favoritos exitosamente",
  "data": {
    "preferences": {
      "favoriteStocks": ["GGAL", "YPFD", "ALUA"],
      "notifications": true,
      "theme": "dark"
    },
    "removedSymbol": "MIRG"
  }
}
```

### 8. Obtener Símbolos Válidos (Sin Autenticación)
```
GET http://localhost:8080/api/user/preferences/stocks/symbols
```

**Respuesta Exitosa (200):**
```json
{
  "status": 200,
  "message": "Símbolos válidos obtenidos exitosamente",
  "data": {
    "symbols": [
      "ALUA", "BBAR", "BMA", "BYMA", "CEPU", "COME", "CRES", "CVH", "EDN",
      "GGAL", "HARG", "HAVA", "INTR", "LOMA", "METR", "MIRG", "PAMP",
      "SUPV", "TECO2", "TGNO4", "TGSU2", "TRAN", "TXAR", "VALO", "YPFD"
    ],
    "count": 25
  }
}
```

## 🔒 Consideraciones de Seguridad para Preferencias

- **Autenticación**: Todos los endpoints (excepto `/symbols`) requieren JWT token válido
- **Autorización**: Usuario solo puede modificar sus propias preferencias
- **Validación**: Símbolos de acciones validados contra base de datos en tiempo real
- **Rate Limiting**: Aplicado globalmente (100 requests/15min por IP)
- **Sanitización**: Input limpiado para prevenir XSS/injection
- **Cache**: Símbolos válidos cacheados por 1 hora para mejor rendimiento

## �️ Sistema de Símbolos MERVAL

### Base de Datos de Símbolos
Los símbolos MERVAL se almacenan en la colección `symbols` con la siguiente estructura:

```javascript
{
  "_id": "ObjectId",
  "symbol": "GGAL",                    // Símbolo único (mayúsculas)
  "name": "Grupo Financiero Galicia S.A.",  // Nombre completo de la empresa
  "sector": "Bancos",                  // Sector económico
  "market": "MERVAL",                  // Mercado (MERVAL, MAE, BYMA)
  "currency": "ARS",                   // Moneda (ARS, USD)
  "isActive": true,                    // Estado activo/inactivo
  "description": "Uno de los principales grupos financieros...",
  "website": "https://www.galicia.com.ar",
  "createdAt": "2025-07-31T...",
  "updatedAt": "2025-07-31T..."
}
```

### Sectores Disponibles
```
- Bancos (5 símbolos)
- Energía (7 símbolos) 
- Construcción (3 símbolos)
- Telecomunicaciones (2 símbolos)
- Alimentos (2 símbolos)
- Metalurgia (1 símbolo)
- Petróleo y Gas (1 símbolo)
- Siderurgia (1 símbolo)
- Holding (1 símbolo)
- Otros (2 símbolos)
```

### 🛠️ Scripts de Administración

#### Poblar Base de Datos con Símbolos
```bash
npm run seed-symbols
```
Este script:
- ✅ Conecta a MongoDB
- 🗑️ Elimina símbolos existentes (si los hay)
- 📊 Inserta 25 símbolos MERVAL con información completa
- 🔍 Verifica la integridad de los datos
- 📈 Muestra resumen por sector

#### Setup Completo del Proyecto
```bash
npm run setup
```
Ejecuta:
1. `npm install` - Instala dependencias
2. `npm run migrate` - Ejecuta migraciones (si existen)
3. `npm run seed-symbols` - Puebla símbolos MERVAL

### ⚡ Cache y Rendimiento
- **Cache de símbolos**: 1 hora de duración
- **Fallback**: Lista hardcodeada si falla la BD
- **Índices optimizados**: Por símbolo, sector, estado activo
- **Consultas eficientes**: Solo símbolos activos

## 📊 Símbolos MERVAL Actuales (25 símbolos)

**Por Sector:**
- **Bancos**: BBAR, BMA, GGAL, SUPV, VALO
- **Energía**: CEPU, EDN, METR, PAMP, TGNO4, TGSU2, TRAN  
- **Construcción**: HARG, INTR, LOMA
- **Telecomunicaciones**: CVH, TECO2
- **Alimentos**: CRES, HAVA
- **Otros**: BYMA, MIRG
- **Metalurgia**: ALUA
- **Petróleo y Gas**: YPFD
- **Siderurgia**: TXAR
- **Holding**: COME

## 📋 Resumen de Endpoints Completo

| Método | Endpoint | Headers | Body | Autenticación |
|--------|----------|---------|------|---------------|
| **AUTENTICACIÓN** |
| POST | `/auth/register` | `multipart/form-data` OR `application/json` | email, password, name, acceptTerms, [avatar] | No |
| POST | `/auth/login` | `application/json` | email, password | No |
| GET | `/auth/profile` | - | - | Sí |
| PUT | `/auth/profile` | `application/json` | name, preferences | Sí |
| POST | `/auth/avatar` | `multipart/form-data` | avatar | Sí |
| DELETE | `/auth/avatar` | - | - | Sí |
| **PREFERENCIAS** |
| GET | `/user/preferences` | - | - | Sí |
| PUT | `/user/preferences` | `application/json` | preferences object | Sí |
| PATCH | `/user/preferences` | `application/json` | partial preferences | Sí |
| POST | `/user/preferences/stocks/favorite` | `application/json` | { symbol } | Sí |
| DELETE | `/user/preferences/stocks/favorite/:symbol` | - | - | Sí |
| GET | `/user/preferences/stocks/symbols` | - | - | No |

## 🚀 Guía de Uso para Desarrolladores

### 🔧 Configuración Inicial

1. **Variables de Entorno** (crear archivo `.env`):
```env
# Base de datos
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/MervalDB

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro

# Cloudinary (para avatares)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key  
CLOUDINARY_API_SECRET=tu_api_secret

# Entorno
NODE_ENV=development
PORT=8080
```

2. **Instalación y Setup**:
```bash
git clone https://github.com/nicopetcoff/pfi_backend_principal.git
cd pfi_backend_principal
npm install
npm run setup  # Instala dependencias y puebla símbolos
```

3. **Desarrollo**:
```bash
npm run dev     # Servidor con nodemon (reinicio automático)
npm start       # Servidor en modo producción
```

### 📱 Flujo de Autenticación Recomendado

1. **Registro/Login** → Obtener token JWT
2. **Usar token** en header `Authorization: Bearer <token>`
3. **Gestionar avatar** (opcional) con endpoints específicos
4. **Configurar preferencias** usando endpoints de preferencias

### 🎯 Casos de Uso Comunes

#### Registro con Avatar
```javascript
const formData = new FormData();
formData.append('email', 'user@example.com');
formData.append('password', 'password123');
formData.append('name', 'Juan Pérez');
formData.append('acceptTerms', 'true');
formData.append('avatar', avatarFile);

fetch('/api/auth/register', {
  method: 'POST',
  body: formData
});
```

#### Agregar Acción a Favoritos
```javascript
fetch('/api/user/preferences/stocks/favorite', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ symbol: 'GGAL' })
});
```

#### Obtener Símbolos Válidos
```javascript
const symbols = await fetch('/api/user/preferences/stocks/symbols')
  .then(res => res.json());
```

### ⚠️ Manejo de Errores

Todos los endpoints retornan errores en formato consistente:

```json
{
  "status": 400,
  "message": "Descripción del error",
  "errors": ["Error específico 1", "Error específico 2"]
}
```

**Códigos de Estado Comunes:**
- `200` - Éxito
- `201` - Creado exitosamente  
- `400` - Error de validación
- `401` - No autenticado
- `403` - Sin permisos
- `404` - No encontrado
- `409` - Conflicto (ej: ya existe)
- `500` - Error del servidor

### 🔄 Versionado y Mantenimiento

- **Versión actual**: 1.0.0
- **Base de datos**: Símbolos actualizables vía script
- **Cache**: Automático para símbolos (1 hora)
- **Logs**: Completos en desarrollo, básicos en producción

¡Tu backend MERVAL está completamente listo con autenticación, avatares, preferencias de usuario y gestión de símbolos desde base de datos! 🚀📊💼
