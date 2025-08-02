class BaseController {
  // Endpoint de health check para monitoreo
  async healthCheck(req, res) {
    try {
      return res.status(200).json({
        status: 200,
        message: "MERVAL Backend funcionando correctamente",
        timestamp: new Date(),
        services: {
          database: "Conectado",
          api: "Funcionando"
        }
      });
    } catch (error) {
      console.error('❌ Error en healthCheck:', error);
      return res.status(500).json({
        status: 500,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  }
}

module.exports = new BaseController();
