const { validationResult } = require('express-validator');
const PreferencesService = require('../services/preferences.service');

class PreferencesController {
  
  // GET /api/user/preferences - Obtener preferencias del usuario
  async getPreferences(req, res) {
    try {
      const userId = req.user.id;
      const preferences = await PreferencesService.getUserPreferences(userId);
      
      res.status(200).json({
        status: 200,
        message: 'Preferencias obtenidas exitosamente',
        data: {
          preferences
        }
      });
    } catch (error) {
      console.error('Error al obtener preferencias:', error);
      res.status(500).json({
        status: 500,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // PUT /api/user/preferences - Actualizar preferencias completas
  async updatePreferences(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const userId = req.user.id;
      const preferencesData = req.body;

      const updatedPreferences = await PreferencesService.updateUserPreferences(userId, preferencesData);

      res.status(200).json({
        status: 200,
        message: 'Preferencias actualizadas exitosamente',
        data: {
          preferences: updatedPreferences
        }
      });
    } catch (error) {
      console.error('Error al actualizar preferencias:', error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          status: 400,
          message: 'Error de validación',
          errors: Object.values(error.errors).map(e => e.message)
        });
      }

      res.status(500).json({
        status: 500,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // PATCH /api/user/preferences - Actualización parcial de preferencias
  async patchPreferences(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const userId = req.user.id;
      const partialData = req.body;

      const updatedPreferences = await PreferencesService.patchUserPreferences(userId, partialData);

      res.status(200).json({
        status: 200,
        message: 'Preferencias actualizadas parcialmente',
        data: {
          preferences: updatedPreferences
        }
      });
    } catch (error) {
      console.error('Error al actualizar preferencias parcialmente:', error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          status: 400,
          message: 'Error de validación',
          errors: Object.values(error.errors).map(e => e.message)
        });
      }

      res.status(500).json({
        status: 500,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // POST /api/user/preferences/stocks/favorite - Agregar acción a favoritos
  async addFavoriteStock(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const userId = req.user.id;
      const { symbol } = req.body;

      const result = await PreferencesService.addFavoriteStock(userId, symbol);

      if (result.alreadyExists) {
        return res.status(409).json({
          status: 409,
          message: 'La acción ya está en favoritos',
          data: {
            preferences: result.preferences
          }
        });
      }

      res.status(200).json({
        status: 200,
        message: 'Acción agregada a favoritos exitosamente',
        data: {
          preferences: result.preferences,
          addedSymbol: symbol
        }
      });
    } catch (error) {
      console.error('Error al agregar acción a favoritos:', error);
      res.status(500).json({
        status: 500,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // DELETE /api/user/preferences/stocks/favorite/:symbol - Quitar acción de favoritos
  async removeFavoriteStock(req, res) {
    try {
      const userId = req.user.id;
      const { symbol } = req.params;

      if (!symbol) {
        return res.status(400).json({
          status: 400,
          message: 'Symbol de acción es requerido'
        });
      }

      const result = await PreferencesService.removeFavoriteStock(userId, symbol);

      if (!result.wasRemoved) {
        return res.status(404).json({
          status: 404,
          message: 'La acción no estaba en favoritos',
          data: {
            preferences: result.preferences
          }
        });
      }

      res.status(200).json({
        status: 200,
        message: 'Acción removida de favoritos exitosamente',
        data: {
          preferences: result.preferences,
          removedSymbol: symbol
        }
      });
    } catch (error) {
      console.error('Error al remover acción de favoritos:', error);
      res.status(500).json({
        status: 500,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/user/preferences/stocks/symbols - Obtener símbolos válidos
  async getValidSymbols(req, res) {
    try {
      const symbols = await PreferencesService.getValidSymbolsList();
      
      res.status(200).json({
        status: 200,
        message: 'Símbolos válidos obtenidos exitosamente',
        data: {
          symbols,
          count: symbols.length
        }
      });
    } catch (error) {
      console.error('Error al obtener símbolos válidos:', error);
      res.status(500).json({
        status: 500,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/user/preferences/stocks/complete - Obtener símbolos con información completa
  async getCompleteStocks(req, res) {
    try {
      const stocks = await PreferencesService.getCompleteSymbolsInfo();
      
      res.status(200).json({
        status: 200,
        message: 'Acciones obtenidas exitosamente',
        data: {
          stocks,
          count: stocks.length
        }
      });
    } catch (error) {
      console.error('Error al obtener acciones completas:', error);
      res.status(500).json({
        status: 500,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/user/preferences/stocks/sectors - Obtener sectores únicos
  async getSectors(req, res) {
    try {
      const sectors = await PreferencesService.getUniqueSectors();
      
      const formattedSectors = sectors.map(sector => ({
        name: sector,
        value: sector.toLowerCase().replace(/\s+/g, '_')
      }));
      
      res.status(200).json({
        status: 200,
        message: 'Sectores obtenidos exitosamente',
        data: {
          sectors: formattedSectors,
          count: formattedSectors.length
        }
      });
    } catch (error) {
      console.error('Error al obtener sectores:', error);
      res.status(500).json({
        status: 500,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // POST /api/user/preferences/stocks/favorite/sector - Agregar todos los símbolos de un sector a favoritos
  async addFavoriteBySector(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const userId = req.user.id;
      const { sector } = req.body;

      const result = await PreferencesService.addFavoriteBySector(userId, sector);

      res.status(200).json({
        status: 200,
        message: `Símbolos del sector ${sector} agregados a favoritos exitosamente`,
        data: result
      });
    } catch (error) {
      console.error('Error al agregar favoritos por sector:', error);
      
      if (error.message.includes('Usuario no encontrado')) {
        return res.status(404).json({
          status: 404,
          message: error.message
        });
      }
      
      if (error.message.includes('No se encontraron símbolos') || 
          error.message.includes('Límite máximo')) {
        return res.status(400).json({
          status: 400,
          message: error.message
        });
      }
      
      res.status(500).json({
        status: 500,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new PreferencesController();
