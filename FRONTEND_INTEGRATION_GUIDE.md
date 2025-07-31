# 📋 GUÍA RÁPIDA PARA FRONTEND - MERVAL BACKEND

## 🔗 **URL BASE:** `http://localhost:8080/api`

## 📱 **ENDPOINTS PRINCIPALES:**

### 1️⃣ **REGISTRO CON AVATAR (FormData)**
```javascript
POST /auth/register
Content-Type: multipart/form-data

// FormData con:
email: string
password: string  
name: string
acceptTerms: "true" // ⚠️ String, no boolean
avatar: File (opcional)
```

### 2️⃣ **REGISTRO SIN AVATAR (JSON)**
```javascript
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "Juan Pérez", 
  "acceptTerms": true
}
```

### 3️⃣ **LOGIN**
```javascript
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 4️⃣ **OBTENER PERFIL** 🔒
```javascript
GET /auth/profile
Authorization: Bearer <token>
```

### 5️⃣ **ACTUALIZAR PERFIL** 🔒
```javascript
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nuevo Nombre",
  "preferences": {
    "favoriteStocks": ["AAPL"],
    "watchlist": ["TSLA"],
    "notifications": true,
    "theme": "dark"
  }
}
```

### 6️⃣ **SUBIR AVATAR** 🔒
```javascript
POST /auth/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data

avatar: File
```

### 7️⃣ **ELIMINAR AVATAR** 🔒
```javascript
DELETE /auth/avatar
Authorization: Bearer <token>
```

## 🎯 **ESTRUCTURA DE RESPUESTA ESTÁNDAR:**

### ✅ **ÉXITO:**
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {
    "user": {
      "id": "688a75b27138cd6b61937dcf",
      "email": "user@example.com",
      "name": "Juan Pérez",
      "avatar": {
        "url": "https://res.cloudinary.com/dxgbzpvaq/image/upload/...",
        "publicId": "merval/avatars/user_688a75b27138cd6b61937dcf_avatar",
        "uploadedAt": "2025-07-30T19:42:44.472Z"
      },
      "preferences": {
        "favoriteStocks": [],
        "watchlist": [],
        "notifications": true,
        "theme": "system"
      },
      "createdAt": "2025-07-30T19:42:42.503Z",
      "lastLogin": "2025-07-30T19:42:42.467Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Solo en login/register
  }
}
```

### ❌ **ERROR:**
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

## ⚠️ **PUNTOS CRÍTICOS:**

1. **Campo ID**: Backend devuelve `id`, NO `_id`
2. **FormData acceptTerms**: Enviar como string `"true"`, no boolean
3. **Avatar URLs**: Son públicas y están optimizadas (300x300, circular)
4. **Token**: Guardar después de login/register exitoso
5. **Avatar sin URL**: `avatar.url` será `null` si no hay imagen

## 🔒 **AUTENTICACIÓN:**

```javascript
// Header para endpoints protegidos
Authorization: Bearer <token>
```

## 📊 **CÓDIGOS DE ESTADO:**

- `200` ✅ Operación exitosa
- `201` ✅ Usuario creado  
- `400` ❌ Datos inválidos
- `401` ❌ No autorizado (token inválido)
- `404` ❌ Usuario no encontrado
- `500` ❌ Error del servidor

## 🚀 **EJEMPLO COMPLETO REACT NATIVE:**

```javascript
// Registro con avatar
const registerUser = async (userData, imageUri) => {
  const formData = new FormData();
  formData.append('email', userData.email);
  formData.append('password', userData.password);
  formData.append('name', userData.name);
  formData.append('acceptTerms', 'true'); // ⚠️ String!
  
  if (imageUri) {
    formData.append('avatar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    });
  }

  const response = await fetch('http://localhost:8080/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  const data = await response.json();
  
  if (data.success) {
    await AsyncStorage.setItem('authToken', data.data.token);
    return data.data.user;
  } else {
    throw new Error(data.message);
  }
};

// Login
const login = async (email, password) => {
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
};

// Obtener perfil
const getProfile = async () => {
  const token = await AsyncStorage.getItem('authToken');
  
  const response = await fetch('http://localhost:8080/api/auth/profile', {
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
};
```

## ✅ **BACKEND STATUS: 🟢 COMPLETAMENTE FUNCIONAL**

- ✅ Todos los endpoints operativos
- ✅ Cloudinary integrado
- ✅ Validaciones robustas  
- ✅ Manejo de errores
- ✅ Soporte React Native
- ✅ Documentación completa

**¡Listo para desarrollo frontend!** 🎉
