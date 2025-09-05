const express = require("express");
const router = express.Router();
const NewsController = require("../../controllers/news.controller");
const { authenticateToken } = require("../../middleware/auth");

/**
 * @route   GET /api/news
 * @desc    Obtener todas las noticias con paginación
 * @access  Private (requiere token)
 * @query   ?page=1&limit=20&sortBy=fecha_scrapeo&sortOrder=desc
 */
router.get("/",
  authenticateToken,
  NewsController.getAllNews
);

/**
 * @route   GET /api/news/search
 * @desc    Buscar noticias por texto en título, contenido o resumen
 * @access  Private (requiere token)
 * @query   ?q=término&page=1&limit=20
 */
router.get("/search",
  authenticateToken,
  NewsController.searchNews
);

/**
 * @route   GET /api/news/advanced-search
 * @desc    Búsqueda avanzada con múltiples filtros
 * @access  Private (requiere token)
 * @query   ?q=término&company=empresa&dateFrom=fecha&dateTo=fecha&page=1&limit=20&sortBy=campo&sortOrder=asc|desc
 */
router.get("/advanced-search",
  authenticateToken,
  NewsController.advancedSearch
);

/**
 * @route   GET /api/news/companies
 * @desc    Obtener lista de empresas MERVAL mencionadas en noticias
 * @access  Private (requiere token)
 */
router.get("/companies",
  authenticateToken,
  NewsController.getCompanies
);

/**
 * @route   GET /api/news/company/:company
 * @desc    Obtener noticias de una empresa específica
 * @access  Private (requiere token)
 * @params  company - Nombre de la empresa
 * @query   ?page=1&limit=20
 */
router.get("/company/:company",
  authenticateToken,
  NewsController.getNewsByCompany
);

/**
 * @route   GET /api/news/:id
 * @desc    Obtener una noticia específica por ID
 * @access  Private (requiere token)
 * @params  id - ID de la noticia
 */
router.get("/:id",
  authenticateToken,
  NewsController.getNewsById
);

module.exports = router;
