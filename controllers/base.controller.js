const jwt = require("jsonwebtoken");

class BaseController {

  // Endpoint de prueba para verificar que todo funciona
  async healthCheck(req, res) {
    try {
      return res.status(200).json({
        status: 200,
        message: "MERVAL Backend funcionando correctamente",
        timestamp: new Date(),
        services: {
          database: "Conectado",
          cloudinary: "Configurado", 
          email: "Configurado"
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

  // Endpoint básico para testing
  async testEndpoint(req, res) {
    try {
      return res.status(200).json({
        status: 200,
        message: "Endpoint de prueba MERVAL",
        data: req.body || {},
        timestamp: new Date()
      });
    } catch (error) {
      console.error('❌ Error en testEndpoint:', error);
      return res.status(500).json({
        status: 500,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  }
}

module.exports = new BaseController();
