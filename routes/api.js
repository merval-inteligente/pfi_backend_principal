var express = require("express");
var router = express.Router();

// Importar rutas
var baseRoutes = require("./api/base.route");
var authRoutes = require("./api/auth.route");
var mailRoutes = require("./api/mail.route");

// Rutas básicas
router.use("/base", baseRoutes);

// Rutas de autenticación (registro, login, perfil)
router.use("/auth", authRoutes);

// Rutas de mail (mantenemos para el servicio de email)
router.use("/mail", mailRoutes);

module.exports = router;
