var express = require("express");
var router = express.Router();

// Importar rutas
var baseRoutes = require("./api/base.route");
var authRoutes = require("./api/auth.route");
var mailRoutes = require("./api/mail.route");
var preferencesRoutes = require("./api/preferences.route");
var activityRoutes = require("./api/activity.route");
var newsRoutes = require("./api/news.route");

// Rutas básicas
router.use("/base", baseRoutes);

// Rutas de autenticación (registro, login, perfil)
router.use("/auth", authRoutes);

// Rutas de mail (mantenemos para el servicio de email)
router.use("/mail", mailRoutes);

// Rutas de preferencias de usuario
router.use("/user/preferences", preferencesRoutes);

// Rutas de actividad (para integración con microservicios)
router.use("/activity", activityRoutes);

// Rutas de noticias MERVAL
router.use("/news", newsRoutes);

module.exports = router;
