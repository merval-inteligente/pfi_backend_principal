const express = require("express");
const router = express.Router();
const preferencesController = require("../../controllers/preferences.controller");
const { authenticateToken } = require("../../middleware/auth");
const { 
  validatePreferencesUpdate, 
  validatePreferencesPatch,
  validateStockSymbol,
  validateSector,
  handleValidationErrors
} = require("../../middleware/validators");

// GET /api/user/preferences/stocks/symbols - Obtener símbolos válidos (sin autenticación)
router.get("/stocks/symbols", preferencesController.getValidSymbols);

// Middleware de autenticación para el resto de las rutas
router.use(authenticateToken);

// GET /api/user/preferences - Obtener preferencias del usuario
router.get("/", preferencesController.getPreferences);

// GET /api/user/preferences/stocks/complete - Obtener stocks con información completa (con autenticación)
router.get("/stocks/complete", preferencesController.getCompleteStocks);

// GET /api/user/preferences/stocks/sectors - Obtener sectores únicos (con autenticación)
router.get("/stocks/sectors", preferencesController.getSectors);

// PUT /api/user/preferences - Actualizar preferencias completas
router.put("/", 
  validatePreferencesUpdate, 
  handleValidationErrors,
  preferencesController.updatePreferences
);

// PATCH /api/user/preferences - Actualización parcial de preferencias
router.patch("/", 
  validatePreferencesPatch, 
  handleValidationErrors,
  preferencesController.patchPreferences
);

// POST /api/user/preferences/stocks/favorite - Agregar acción a favoritos
router.post("/stocks/favorite", 
  validateStockSymbol, 
  handleValidationErrors,
  preferencesController.addFavoriteStock
);

// POST /api/user/preferences/stocks/favorite/sector - Agregar todos los símbolos de un sector a favoritos
router.post("/stocks/favorite/sector", 
  validateSector,
  handleValidationErrors,
  preferencesController.addFavoriteBySector
);

// DELETE /api/user/preferences/stocks/favorite/:symbol - Quitar acción de favoritos
router.delete("/stocks/favorite/:symbol", 
  preferencesController.removeFavoriteStock
);

module.exports = router;
