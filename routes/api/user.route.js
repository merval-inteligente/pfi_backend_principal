const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/users.controller");
const { authorization, optionalAuth } = require("../../auth/authorization");
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validateMongoId,
  validatePagination 
} = require("../../middleware/validators");
const multer = require("multer");

// Configuración de multer para subida de archivos
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  },
  fileFilter: (req, file, cb) => {
    // Verificar tipo de archivo
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// Ruta de prueba
router.get("/", (req, res) => {
  res.json({
    message: "API de usuarios funcionando correctamente",
    version: "1.0.0"
  });
});

// Registro de usuario
router.post("/registration", 
  upload.single("image"), 
  validateUserRegistration,
  UserController.createUser
);

// Login de usuario
router.post("/login", 
  validateUserLogin,
  UserController.loginUser
);

// Obtener todos los usuarios (requiere autenticación)
router.get("/users", 
  authorization,
  validatePagination,
  UserController.getUsers
);

// Obtener usuario por email (requiere autenticación)
router.post("/userByMail", 
  authorization,
  UserController.getUsersByMail
);

// Obtener perfil del usuario autenticado
router.get("/profile",
  authorization,
  UserController.getUserProfile
);

// Actualizar usuario (requiere autenticación)
router.put("/update", 
  authorization,
  UserController.updateUser
);

// Eliminar usuario (requiere autenticación)
router.delete("/delete/:id", 
  authorization,
  validateMongoId,
  UserController.removeUser
);

// Obtener imagen de usuario por email (opcional autenticación)
router.get("/obtenerImagenUsuario/:email",
  optionalAuth,
  UserController.getImagenUsuario
);

// Middleware de manejo de errores para multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 400,
        message: 'El archivo es demasiado grande. Máximo 5MB permitido.'
      });
    }
  }
  
  if (error.message === 'Solo se permiten archivos de imagen') {
    return res.status(400).json({
      status: 400,
      message: error.message
    });
  }
  
  next(error);
});

module.exports = router;
