const express = require("express");
const router = express.Router();
const BaseController = require("../../controllers/base.controller");

// Ruta de health check para monitoreo
router.get("/health", BaseController.healthCheck);

module.exports = router;
