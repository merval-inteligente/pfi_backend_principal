const { body, validationResult } = require("express-validator");

// Middleware para validar registro de usuario (con FormData)
const validateUserRegistration = [
  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail()
    .toLowerCase(),
  
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras y espacios"),
  
  body("acceptTerms")
    .custom((value) => {
      // Convertir string a boolean para FormData
      const boolValue = value === 'true' || value === true;
      if (!boolValue) {
        throw new Error("Debe aceptar los términos y condiciones");
      }
      return true;
    })
    .withMessage("Debe aceptar los términos y condiciones")
];

// Middleware para validar login de usuario
const validateUserLogin = [
  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail()
    .toLowerCase(),
  
  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
];

// Middleware para verificar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: "Datos de entrada inválidos",
      errors: errorMessages
    });
  }
  
  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  handleValidationErrors
};