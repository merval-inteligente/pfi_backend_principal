const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

// Middleware para verificar JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token de acceso requerido",
        error: "NO_TOKEN"
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.SECRET || 'supersecret_change_in_production');
    
    // Verificar que el usuario existe
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Usuario no válido",
        error: "INVALID_USER"
      });
    }

    // Agregar información del usuario al request
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.user = user;
    
    next();

  } catch (error) {
    console.error('❌ Error en autenticación:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Token inválido",
        error: "INVALID_TOKEN"
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expirado",
        error: "EXPIRED_TOKEN"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: "INTERNAL_SERVER_ERROR"
    });
  }
};

// Middleware opcional de autenticación (no falla si no hay token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET || 'supersecret_change_in_production');
      const user = await User.findById(decoded.id);
      
      if (user) {
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // En modo opcional, continuamos sin autenticación
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};
