const express = require("express");
const router = express.Router();
const BaseController = require("../../controllers/base.controller");

// Rutas básicas para testing
router.get("/health", BaseController.healthCheck);
router.post("/test", BaseController.testEndpoint);
router.get("/test", BaseController.testEndpoint);

module.exports = router;
