const MervalService = require("../services/merval.service");

class MervalController {

  /**
   * GET /api/merval/price
   * Obtener el precio actual del índice Merval
   */
  async getMervalPrice(req, res) {
    try {
      const mervalData = await MervalService.getMervalPrice();

      // Si no se pudo obtener el precio (error en API)
      if (mervalData.error) {
        return res.status(503).json({
          success: false,
          message: mervalData.message,
          data: mervalData
        });
      }

      return res.status(200).json({
        success: true,
        message: "Precio del Merval obtenido exitosamente",
        data: mervalData
      });

    } catch (error) {
      console.error('❌ Error al obtener precio del Merval:', error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener precio del Merval",
        error: "MERVAL_PRICE_ERROR"
      });
    }
  }

  /**
   * GET /api/merval/history
   * Obtener histórico del índice Merval
   * Query params: ?days=30
   */
  async getMervalHistory(req, res) {
    try {
      const days = parseInt(req.query.days) || 30;

      // Validar límite de días
      if (days > 365) {
        return res.status(400).json({
          success: false,
          message: "El límite máximo es 365 días"
        });
      }

      const historyData = await MervalService.getMervalHistory(days);

      return res.status(200).json({
        success: true,
        message: `Histórico del Merval obtenido (últimos ${days} días)`,
        data: historyData
      });

    } catch (error) {
      console.error('❌ Error al obtener histórico del Merval:', error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener histórico del Merval",
        error: "MERVAL_HISTORY_ERROR"
      });
    }
  }

  /**
   * GET /api/merval/summary
   * Obtener resumen del mercado (Merval + estado del mercado)
   */
  async getMarketSummary(req, res) {
    try {
      const summary = await MervalService.getMarketSummary();

      return res.status(200).json({
        success: true,
        message: "Resumen del mercado obtenido exitosamente",
        data: summary
      });

    } catch (error) {
      console.error('❌ Error al obtener resumen del mercado:', error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener resumen del mercado",
        error: "MARKET_SUMMARY_ERROR"
      });
    }
  }

  /**
   * GET /api/merval/status
   * Obtener estado del mercado (abierto/cerrado)
   */
  async getMarketStatus(req, res) {
    try {
      const status = MervalService.getMarketStatus();

      return res.status(200).json({
        success: true,
        message: "Estado del mercado obtenido",
        data: status
      });

    } catch (error) {
      console.error('❌ Error al obtener estado del mercado:', error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener estado del mercado",
        error: "MARKET_STATUS_ERROR"
      });
    }
  }

  /**
   * GET /api/merval/stock/:symbol
   * Obtener precio de un activo individual
   * Params: symbol (ej: YPF, GGAL, BBAR)
   */
  async getStockPrice(req, res) {
    try {
      const { symbol } = req.params;

      if (!symbol || symbol.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "Símbolo de activo requerido"
        });
      }

      const stockData = await MervalService.getStockPrice(symbol);

      // Si hay error en los datos
      if (stockData.error) {
        return res.status(404).json({
          success: false,
          message: stockData.error,
          data: stockData
        });
      }

      return res.status(200).json({
        success: true,
        message: `Precio de ${symbol.toUpperCase()} obtenido exitosamente`,
        data: stockData
      });

    } catch (error) {
      console.error('❌ Error al obtener precio del activo:', error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener precio del activo",
        error: "STOCK_PRICE_ERROR"
      });
    }
  }

  /**
   * POST /api/merval/stocks
   * Obtener precios de múltiples activos
   * Body: { symbols: ['YPF', 'GGAL', 'BBAR'] }
   */
  async getMultipleStockPrices(req, res) {
    try {
      const { symbols } = req.body;

      if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Se requiere un array de símbolos"
        });
      }

      // Validar límite
      if (symbols.length > 50) {
        return res.status(400).json({
          success: false,
          message: "Máximo 50 símbolos por solicitud"
        });
      }

      const result = await MervalService.getMultipleStockPrices(symbols);

      return res.status(200).json({
        success: true,
        message: `${result.successful} de ${result.total} precios obtenidos`,
        data: result
      });

    } catch (error) {
      console.error('❌ Error al obtener múltiples precios:', error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener precios de activos",
        error: "MULTIPLE_STOCKS_ERROR"
      });
    }
  }

  /**
   * GET /api/merval/stock/:symbol/history
   * Obtener histórico de un activo
   * Params: symbol
   * Query: ?days=30
   */
  async getStockHistory(req, res) {
    try {
      const { symbol } = req.params;
      const days = parseInt(req.query.days) || 30;

      if (!symbol || symbol.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "Símbolo de activo requerido"
        });
      }

      // Validar límite de días
      if (days > 365) {
        return res.status(400).json({
          success: false,
          message: "El límite máximo es 365 días"
        });
      }

      const historyData = await MervalService.getStockHistory(symbol, days);

      return res.status(200).json({
        success: true,
        message: `Histórico de ${symbol.toUpperCase()} obtenido (últimos ${days} días)`,
        data: historyData
      });

    } catch (error) {
      console.error('❌ Error al obtener histórico del activo:', error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener histórico del activo",
        error: "STOCK_HISTORY_ERROR"
      });
    }
  }
  /**
   * Obtener información completa de un activo
   */
  async getStockFullInfo(req, res) {
    try {
      const { symbol } = req.params;
      
      if (!symbol) {
        return res.status(400).json({
          success: false,
          message: 'El símbolo de la acción es requerido'
        });
      }

      const data = await MervalService.getStockFullInfo(symbol);
      
      return res.status(200).json({
        success: true,
        message: `Información completa de ${symbol} obtenida correctamente`,
        data
      });
    } catch (error) {
      console.error('Error en getStockFullInfo:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener información completa del activo',
        error: error.message
      });
    }
  }

  /**
   * Obtener resumen ejecutivo de un activo
   */
  async getStockSummary(req, res) {
    try {
      const { symbol } = req.params;
      
      if (!symbol) {
        return res.status(400).json({
          success: false,
          message: 'El símbolo de la acción es requerido'
        });
      }

      const data = await MervalService.getStockSummary(symbol);
      
      return res.status(200).json({
        success: true,
        message: `Resumen ejecutivo de ${symbol} obtenido correctamente`,
        data
      });
    } catch (error) {
      console.error('Error en getStockSummary:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener resumen ejecutivo del activo',
        error: error.message
      });
    }
  }

  /**
   * Obtener análisis técnico de un activo
   */
  async getStockTechnicalAnalysis(req, res) {
    try {
      const { symbol } = req.params;
      
      if (!symbol) {
        return res.status(400).json({
          success: false,
          message: 'El símbolo de la acción es requerido'
        });
      }

      const data = await MervalService.getStockTechnicalAnalysis(symbol);
      
      return res.status(200).json({
        success: true,
        message: `Análisis técnico de ${symbol} obtenido correctamente`,
        data
      });
    } catch (error) {
      console.error('Error en getStockTechnicalAnalysis:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener análisis técnico del activo',
        error: error.message
      });
    }
  }
}

module.exports = new MervalController();
