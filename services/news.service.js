const News = require("../models/News.model");

class NewsService {

  // Buscar todas las noticias con paginación
  async getAllNews(page = 1, limit = 20, sortBy = 'fecha_scrapeo', sortOrder = 'desc') {
    try {
      const skip = (page - 1) * limit;
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const news = await News.find({})
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await News.countDocuments({});
      const totalPages = Math.ceil(total / limit);

      return {
        news,
        pagination: {
          currentPage: page,
          totalPages,
          totalNews: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Buscar noticias por texto (título, contenido, resumen)
  async searchNews(searchTerm, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const searchQuery = {
        $or: [
          { titulo: { $regex: searchTerm, $options: 'i' } },
          { contenido: { $regex: searchTerm, $options: 'i' } },
          { resumen: { $regex: searchTerm, $options: 'i' } }
        ]
      };

      const news = await News.find(searchQuery)
        .sort({ fecha_scrapeo: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await News.countDocuments(searchQuery);
      const totalPages = Math.ceil(total / limit);

      return {
        news,
        pagination: {
          currentPage: page,
          totalPages,
          totalNews: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        searchTerm
      };
    } catch (error) {
      throw error;
    }
  }

  // Buscar noticias por empresa MERVAL
  async getNewsByCompany(company, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const news = await News.find({
        empresas_merval: { $in: [company] }
      })
        .sort({ fecha_scrapeo: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await News.countDocuments({
        empresas_merval: { $in: [company] }
      });
      const totalPages = Math.ceil(total / limit);

      return {
        news,
        pagination: {
          currentPage: page,
          totalPages,
          totalNews: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        company
      };
    } catch (error) {
      throw error;
    }
  }

  // Obtener noticia por ID
  async getNewsById(newsId) {
    try {
      const news = await News.findById(newsId).lean();
      if (!news) {
        throw new Error('Noticia no encontrada');
      }
      return news;
    } catch (error) {
      throw error;
    }
  }

  // Obtener empresas MERVAL mencionadas en las noticias
  async getCompaniesFromNews() {
    try {
      const companies = await News.distinct('empresas_merval');
      return companies.filter(company => company && company.trim() !== '');
    } catch (error) {
      throw error;
    }
  }

  // Búsqueda avanzada con múltiples filtros
  async advancedSearch(filters = {}, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const query = {};

      // Filtro por texto
      if (filters.searchTerm) {
        query.$or = [
          { titulo: { $regex: filters.searchTerm, $options: 'i' } },
          { contenido: { $regex: filters.searchTerm, $options: 'i' } },
          { resumen: { $regex: filters.searchTerm, $options: 'i' } }
        ];
      }

      // Filtro por empresa
      if (filters.company) {
        query.empresas_merval = { $in: [filters.company] };
      }

      // Filtro por fecha (desde)
      if (filters.dateFrom) {
        query.fecha_scrapeo = { $gte: filters.dateFrom };
      }

      // Filtro por fecha (hasta)
      if (filters.dateTo) {
        if (query.fecha_scrapeo) {
          query.fecha_scrapeo.$lte = filters.dateTo;
        } else {
          query.fecha_scrapeo = { $lte: filters.dateTo };
        }
      }

      // Configurar ordenamiento
      const sort = {};
      const sortBy = filters.sortBy || 'fecha_scrapeo';
      const sortOrder = filters.sortOrder || 'desc';
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const news = await News.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await News.countDocuments(query);
      const totalPages = Math.ceil(total / limit);

      return {
        news,
        pagination: {
          currentPage: page,
          totalPages,
          totalNews: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters
      };
    } catch (error) {
      throw error;
    }
  }

}

module.exports = new NewsService();
