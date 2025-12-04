var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.send("Express esta escuchando");
});

// Health check endpoint para ALB
router.get("/health", function (req, res, next) {
  res.status(200).json({
    status: "healthy",
    service: "general"
  });
});

module.exports = router;
