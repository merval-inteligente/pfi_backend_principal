const express = require("express");
const router = express.Router();
const MervalController = require("../../controllers/merval.controller");
const { authenticateToken, optionalAuth } = require("../../middleware/auth");

/**
 * @route   GET /api/merval/price
 * @desc    Obtener precio actual del índice Merval
 * @access  Public (sin autenticación requerida)
 */
router.get("/price", MervalController.getMervalPrice);

/**
 * @route   GET /api/merval/history
 * @desc    Obtener histórico del índice Merval
 * @access  Private (requiere autenticación)
 * @query   ?days=30
 */
router.get("/history", 
  authenticateToken,
  MervalController.getMervalHistory
);

/**
 * @route   GET /api/merval/summary
 * @desc    Obtener resumen del mercado
 * @access  Public (sin autenticación requerida)
 */
router.get("/summary", MervalController.getMarketSummary);

/**
 * @route   GET /api/merval/status
 * @desc    Obtener estado del mercado (abierto/cerrado)
 * @access  Public
 */
router.get("/status", MervalController.getMarketStatus);

/**
 * @route   GET /api/merval/stock/:symbol
 * @desc    Obtener precio de un activo individual (ej: YPF, GGAL, BBAR)
 * @access  Public
 * @params  symbol - Símbolo de la acción
 */
router.get("/stock/:symbol", MervalController.getStockPrice);

/**
 * @route   POST /api/merval/stocks
 * @desc    Obtener precios de múltiples activos
 * @access  Public
 * @body    { symbols: ['YPF', 'GGAL', 'BBAR'] }
 */
router.post("/stocks", MervalController.getMultipleStockPrices);

/**
 * @route   GET /api/merval/stock/:symbol/history
 * @desc    Obtener histórico de precios de un activo
 * @access  Private (requiere autenticación)
 * @param   :symbol - Símbolo del activo (YPF, GGAL, etc.)
 * @query   ?days=30
 */
router.get("/stock/:symbol/history",
  authenticateToken,
  MervalController.getStockHistory
);

/**
 * @route   GET /api/merval/stock/:symbol/info
 * @desc    Obtener información completa de un activo (datos fundamentales + técnicos)
 * @access  Public
 * @param   :symbol - Símbolo del activo (YPF, GGAL, etc.)
 */
router.get("/stock/:symbol/info", MervalController.getStockFullInfo);

/**
 * @route   GET /api/merval/stock/:symbol/summary
 * @desc    Obtener resumen ejecutivo de un activo (indicadores clave)
 * @access  Public
 * @param   :symbol - Símbolo del activo (YPF, GGAL, etc.)
 */
router.get("/stock/:symbol/summary", MervalController.getStockSummary);

/**
 * @route   GET /api/merval/stock/:symbol/technical
 * @desc    Obtener análisis técnico de un activo (medias móviles, RSI, señales)
 * @access  Public
 * @param   :symbol - Símbolo del activo (YPF, GGAL, etc.)
 */
router.get("/stock/:symbol/technical", MervalController.getStockTechnicalAnalysis);

module.exports = router;
