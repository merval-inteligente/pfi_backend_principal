// Nuevo controlador para el registro de actividad del chat
// Archivo: BACKEND/controllers/activity.controller.js

class ActivityController {
  
  // POST /api/activity/log - Registrar actividad del chat
  async logActivity(req, res) {
    try {
      const { userId, activityType, data, timestamp, service } = req.body;
      const authenticatedUserId = req.user.id;

      // Verificar que el usuario autenticado corresponda
      if (userId && authenticatedUserId !== userId) {
        return res.status(403).json({
          success: false,
          message: "No autorizado para registrar actividad de otro usuario",
          error: "UNAUTHORIZED_ACTIVITY_LOG"
        });
      }

      // Crear el registro de actividad
      const activityLog = {
        userId: authenticatedUserId,
        activityType: activityType || 'chat_interaction',
        service: service || 'chat_microservice',
        data: data || {},
        timestamp: timestamp || new Date(),
        createdAt: new Date()
      };

      // Aquí puedes guardar en base de datos si lo necesitas
      // await ActivityModel.create(activityLog);
      
      // Por ahora solo logging para monitoreo
      console.log(`📊 Chat Activity - Usuario: ${authenticatedUserId}`, {
        activityType,
        service,
        timestamp: activityLog.timestamp
      });

      res.status(200).json({
        success: true,
        message: "Actividad registrada exitosamente",
        data: {
          activityId: `activity_${Date.now()}`,
          userId: authenticatedUserId,
          timestamp: activityLog.timestamp
        }
      });

    } catch (error) {
      console.error('❌ Error al registrar actividad:', error);
      
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === 'development' ? error.message : "INTERNAL_SERVER_ERROR"
      });
    }
  }

  // GET /api/activity/user - Obtener actividad del usuario (opcional)
  async getUserActivity(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 50, activityType } = req.query;

      // Aquí implementarías la consulta a base de datos
      // const activities = await ActivityModel.find({ userId }).limit(limit);
      
      // Por ahora respuesta mock
      res.status(200).json({
        success: true,
        message: "Actividad obtenida exitosamente",
        data: {
          activities: [],
          total: 0,
          userId
        }
      });

    } catch (error) {
      console.error('❌ Error al obtener actividad:', error);
      
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === 'development' ? error.message : "INTERNAL_SERVER_ERROR"
      });
    }
  }
}

module.exports = new ActivityController();
