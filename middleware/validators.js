const { body, validationResult } = require("express-validator");
const Symbol = require("../models/Symbol.model");

// Función para obtener símbolos válidos (con cache)
let symbolsCache = null;
let lastCacheUpdate = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora

async function getValidSymbols() {
  const now = Date.now();
  
  if (symbolsCache && lastCacheUpdate && (now - lastCacheUpdate) < CACHE_DURATION) {
    return symbolsCache;
  }
  
  try {
    const symbols = await Symbol.getActiveSymbols();
    const symbolsArray = symbols.map(symbol => symbol.symbol);
    
    symbolsCache = symbolsArray;
    lastCacheUpdate = now;
    
    return symbolsArray;
  } catch (error) {
    console.error('Error obteniendo símbolos para validación:', error);
    // Fallback a lista hardcodeada
    return [
      'ALUA', 'BBAR', 'BMA', 'BYMA', 'CEPU', 'COME', 'CRES', 'CVH', 'EDN', 
      'GGAL', 'HARG', 'HAVA', 'INTR', 'LOMA', 'METR', 'MIRG', 'PAMP', 
      'SUPV', 'TECO2', 'TGNO4', 'TGSU2', 'TRAN', 'TXAR', 'VALO', 'YPFD'
    ];
  }
}

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
    .withMessage("Debe aceptar los términos y condiciones"),

  body("investmentKnowledge")
    .optional()
    .isIn(['Principiante', 'Intermedio', 'Avanzado'])
    .withMessage("El conocimiento de inversión debe ser: Principiante, Intermedio o Avanzado"),
  
  body("riskAppetite")
    .optional()
    .isIn(['Conservador', 'Moderado', 'Agresivo'])
    .withMessage("El apetito de riesgo debe ser: Conservador, Moderado o Agresivo")
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

// Middleware para validar preferencias completas
const validatePreferencesUpdate = [
  body("favoriteStocks")
    .optional()
    .isArray()
    .withMessage("favoriteStocks debe ser un array")
    .custom(async (stocks) => {
      if (stocks && stocks.length > 0) {
        const validSymbols = await getValidSymbols();
        const invalidSymbols = stocks.filter(symbol => 
          !validSymbols.includes(symbol.toUpperCase())
        );
        if (invalidSymbols.length > 0) {
          throw new Error(`Símbolos inválidos: ${invalidSymbols.join(', ')}`);
        }
      }
      return true;
    }),

  body("notifications")
    .optional()
    .isBoolean()
    .withMessage("notifications debe ser un valor booleano"),

  body("theme")
    .optional()
    .isIn(['light', 'dark', 'system'])
    .withMessage("theme debe ser 'light', 'dark' o 'system'")
];

// Middleware para validar preferencias parciales
const validatePreferencesPatch = [
  body("favoriteStocks")
    .optional()
    .isArray()
    .withMessage("favoriteStocks debe ser un array")
    .custom(async (stocks) => {
      if (stocks && stocks.length > 0) {
        const validSymbols = await getValidSymbols();
        const invalidSymbols = stocks.filter(symbol => 
          !validSymbols.includes(symbol.toUpperCase())
        );
        if (invalidSymbols.length > 0) {
          throw new Error(`Símbolos inválidos: ${invalidSymbols.join(', ')}`);
        }
      }
      return true;
    }),

  body("notifications")
    .optional()
    .isBoolean()
    .withMessage("notifications debe ser un valor booleano"),

  body("theme")
    .optional()
    .isIn(['light', 'dark', 'system'])
    .withMessage("theme debe ser 'light', 'dark' o 'system'")
];

// Middleware para validar símbolo de acción
const validateStockSymbol = [
  body("symbol")
    .notEmpty()
    .withMessage("Symbol es requerido")
    .isString()
    .withMessage("Symbol debe ser un string")
    .isLength({ min: 3, max: 6 })
    .withMessage("Symbol debe tener entre 3 y 6 caracteres")
    .custom(async (symbol) => {
      const validSymbols = await getValidSymbols();
      if (!validSymbols.includes(symbol.toUpperCase())) {
        throw new Error(`Symbol '${symbol}' no es válido para MERVAL`);
      }
      return true;
    })
];

// Middleware para validar sector
const validateSector = [
  body("sector")
    .notEmpty()
    .withMessage("Sector es requerido")
    .isString()
    .withMessage("Sector debe ser un string")
    .isIn([
      'Bancos',
      'Petróleo y Gas', 
      'Telecomunicaciones',
      'Energía',
      'Siderurgia',
      'Alimentos',
      'Construcción',
      'Metalurgia',
      'Papel',
      'Transporte',
      'Holding',
      'Otros'
    ])
    .withMessage("Sector no es válido")
];

// Middleware para validar solicitud de reset de contraseña
const validatePasswordResetRequest = [
  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail()
    .toLowerCase()
];

// Middleware para validar verificación de código
const validateResetCode = [
  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail()
    .toLowerCase(),
  
  body("code")
    .notEmpty()
    .withMessage("El código es requerido")
    .isLength({ min: 6, max: 6 })
    .withMessage("El código debe tener 6 dígitos")
    .isNumeric()
    .withMessage("El código debe ser numérico")
];

// Middleware para validar cambio de contraseña
const validatePasswordReset = [
  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail()
    .toLowerCase(),
  
  body("code")
    .notEmpty()
    .withMessage("El código es requerido")
    .isLength({ min: 6, max: 6 })
    .withMessage("El código debe tener 6 dígitos")
    .isNumeric()
    .withMessage("El código debe ser numérico"),
  
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("La nueva contraseña debe tener al menos 6 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("La contraseña debe contener al menos: 1 minúscula, 1 mayúscula y 1 número")
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validatePreferencesUpdate,
  validatePreferencesPatch,
  validateStockSymbol,
  validateSector,
  validatePasswordResetRequest,
  validateResetCode,
  validatePasswordReset,
  handleValidationErrors,
  getValidSymbols
};