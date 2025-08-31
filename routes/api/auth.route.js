const express = require("express");
const router = express.Router();
const multer = require("multer");
const AuthController = require("../../controllers/auth.controller");
const { authenticateToken } = require("../../middleware/auth");
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validatePasswordResetRequest,
  validateResetCode,
  validatePasswordReset,
  handleValidationErrors 
} = require("../../middleware/validators");

// Configuración de multer para manejo de archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Verificar que sea una imagen
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    Registrar un nuevo usuario (con avatar opcional)
 * @access  Public
 * @body    FormData: { email, password, name, acceptTerms, avatar (opcional) }
 */
router.post("/register", 
  upload.single('avatar'), // Permitir subida de avatar opcional
  validateUserRegistration,
  handleValidationErrors,
  AuthController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 * @body    { email, password }
 */
router.post("/login",
  validateUserLogin,
  handleValidationErrors,
  AuthController.login
);

/**
 * @route   GET /api/auth/profile
 * @desc    Obtener perfil del usuario actual
 * @access  Private (requiere token)
 * @headers Authorization: Bearer <token>
 */
router.get("/profile",
  authenticateToken,
  AuthController.getProfile
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Actualizar perfil del usuario
 * @access  Private (requiere token)
 * @headers Authorization: Bearer <token>
 */
router.put("/profile",
  authenticateToken,
  AuthController.updateProfile
);

/**
 * @route   POST /api/auth/avatar
 * @desc    Subir/actualizar avatar del usuario
 * @access  Private (requiere token)
 * @headers Authorization: Bearer <token>
 * @body    FormData con archivo de imagen
 */
router.post("/avatar",
  authenticateToken,
  upload.single('avatar'),
  AuthController.uploadAvatar
);

/**
 * @route   DELETE /api/auth/avatar
 * @desc    Eliminar avatar del usuario
 * @access  Private (requiere token)
 * @headers Authorization: Bearer <token>
 */
router.delete("/avatar",
  authenticateToken,
  AuthController.deleteAvatar
);

/**
 * @route   GET /api/auth/verify
 * @desc    Verificar si el token es válido
 * @access  Private (requiere token)
 * @headers Authorization: Bearer <token>
 */
router.get("/verify",
  authenticateToken,
  AuthController.verifyToken
);

/**
 * @route   GET /api/auth/profile
 * @desc    Obtener perfil del usuario autenticado
 * @access  Private (requiere token)
 * @headers Authorization: Bearer <token>
 */
router.get("/profile",
  authenticateToken,
  AuthController.verifyToken  // Reutilizamos el mismo método
);

/**
 * @route   POST /api/auth/request-password-reset
 * @desc    Solicitar reset de contraseña (envía código por email)
 * @access  Public
 * @body    { email }
 */
router.post("/request-password-reset",
  validatePasswordResetRequest,
  handleValidationErrors,
  AuthController.requestPasswordReset
);

/**
 * @route   POST /api/auth/verify-reset-code
 * @desc    Verificar código de reset de contraseña
 * @access  Public
 * @body    { email, code }
 */
router.post("/verify-reset-code",
  validateResetCode,
  handleValidationErrors,
  AuthController.verifyResetCode
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Resetear contraseña con código verificado
 * @access  Public
 * @body    { email, code, newPassword }
 */
router.post("/reset-password",
  validatePasswordReset,
  handleValidationErrors,
  AuthController.resetPassword
);

module.exports = router;
