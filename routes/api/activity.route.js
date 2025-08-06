// Rutas para el registro de actividad del chat
// Archivo: BACKEND/routes/api/activity.route.js

const express = require("express");
const router = express.Router();
const activityController = require("../../controllers/activity.controller");
const { authenticateToken } = require("../../middleware/auth");

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

/**
 * @route   POST /api/activity/log
 * @desc    Registrar actividad del chat (desde microservicio)
 * @access  Private (requiere token)
 * @headers Authorization: Bearer <token>
 * @body    { userId, activityType, data, timestamp, service }
 */
router.post("/log", activityController.logActivity);

/**
 * @route   GET /api/activity/user
 * @desc    Obtener actividad del usuario actual
 * @access  Private (requiere token)
 * @headers Authorization: Bearer <token>
 * @query   ?limit=50&activityType=chat_interaction
 */
router.get("/user", activityController.getUserActivity);

module.exports = router;
