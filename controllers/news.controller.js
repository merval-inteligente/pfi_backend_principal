const NewsService = require("../services/news.service");

class NewsController {

  // Obtener todas las noticias
  async getAllNews(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const sortBy = req.query.sortBy || 'fecha_scrapeo';
      const sortOrder = req.query.sortOrder || 'desc';

      // Validar límite máximo
      if (limit > 100) {
        return res.status(400).json({
          success: false,
          message: "El límite máximo es 100 noticias por página"
        });
      }

      const result = await NewsService.getAllNews(page, limit, sortBy, sortOrder);

      return res.status(200).json({
        success: true,
        message: "Noticias obtenidas exitosamente",
        data: result
      });

    } catch (error) {
      console.error('❌ Error al obtener noticias:', error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener noticias",
        error: "GET_NEWS_ERROR"
      });
    }
  }

  // Buscar noticias por texto
  async searchNews(req, res) {
    try {
      const { q: searchTerm } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "Término de búsqueda requerido",
          error: "SEARCH_TERM_REQUIRED"
        });
      }

      // Validar límite máximo
      if (limit > 100) {
        return res.status(400).json({
          success: false,
          message: "El límite máximo es 100 noticias por página"
        });
      }

      const result = await NewsService.searchNews(searchTerm, page, limit);

      return res.status(200).json({
        success: true,
        message: `Se encontraron ${result.pagination.totalNews} noticias`,
        data: result
      });

    } catch (error) {
      console.error('❌ Error al buscar noticias:', error);
      return res.status(500).json({
        success: false,
        message: "Error al buscar noticias",
        error: "SEARCH_ERROR"
      });
    }
  }

  // Obtener noticias por empresa MERVAL
  async getNewsByCompany(req, res) {
    try {
      const { company } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      if (!company || company.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "Empresa requerida",
          error: "COMPANY_REQUIRED"
        });
      }

      // Validar límite máximo
      if (limit > 100) {
        return res.status(400).json({
          success: false,
          message: "El límite máximo es 100 noticias por página"
        });
      }

      const result = await NewsService.getNewsByCompany(company, page, limit);

      return res.status(200).json({
        success: true,
        message: `Noticias de ${company} obtenidas exitosamente`,
        data: result
      });

    } catch (error) {
      console.error('❌ Error al obtener noticias por empresa:', error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener noticias por empresa",
        error: "GET_COMPANY_NEWS_ERROR"
      });
    }
  }

  // Obtener noticia específica por ID
  async getNewsById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "ID de noticia requerido",
          error: "NEWS_ID_REQUIRED"
        });
      }

      const news = await NewsService.getNewsById(id);

      return res.status(200).json({
        success: true,
        message: "Noticia obtenida exitosamente",
        data: {
          news
        }
      });

    } catch (error) {
      console.error('❌ Error al obtener noticia:', error);

      if (error.message.includes('Noticia no encontrada')) {
        return res.status(404).json({
          success: false,
          message: "Noticia no encontrada",
          error: "NEWS_NOT_FOUND"
        });
      }

      return res.status(500).json({
        success: false,
        message: "Error al obtener noticia",
        error: "GET_NEWS_ERROR"
      });
    }
  }

  // Obtener empresas MERVAL disponibles
  async getCompanies(req, res) {
    try {
      const companies = await NewsService.getCompaniesFromNews();

      return res.status(200).json({
        success: true,
        message: "Empresas obtenidas exitosamente",
        data: {
          companies: companies.sort(),
          total: companies.length
        }
      });

    } catch (error) {
      console.error('❌ Error al obtener empresas:', error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener empresas",
        error: "GET_COMPANIES_ERROR"
      });
    }
  }

  // Búsqueda avanzada
  async advancedSearch(req, res) {
    try {
      const {
        q: searchTerm,
        company,
        dateFrom,
        dateTo,
        sortBy,
        sortOrder
      } = req.query;

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      // Validar límite máximo
      if (limit > 100) {
        return res.status(400).json({
          success: false,
          message: "El límite máximo es 100 noticias por página"
        });
      }

      const filters = {
        searchTerm,
        company,
        dateFrom,
        dateTo,
        sortBy,
        sortOrder
      };

      // Limpiar filtros vacíos
      Object.keys(filters).forEach(key => {
        if (!filters[key] || filters[key].trim() === '') {
          delete filters[key];
        }
      });

      const result = await NewsService.advancedSearch(filters, page, limit);

      return res.status(200).json({
        success: true,
        message: `Búsqueda completada - ${result.pagination.totalNews} resultados`,
        data: result
      });

    } catch (error) {
      console.error('❌ Error en búsqueda avanzada:', error);
      return res.status(500).json({
        success: false,
        message: "Error en búsqueda avanzada",
        error: "ADVANCED_SEARCH_ERROR"
      });
    }
  }

}

module.exports = new NewsController();
