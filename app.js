//Express
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");

// Configurar variables de entorno
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Nodemon test - servidor reiniciado automáticamente

//Importo router
const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");

//Instancio el servidor
const app = express();

// Configuración de seguridad
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

// Compresión de respuestas
app.use(compression());

// Configuración de middleware básico
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ 
  extended: false, 
  limit: '10mb' 
}));


const corsOptions = {
  origin: true, 
  credentials: true,
  optionsSuccessStatus: 204,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

app.use(cors(corsOptions));

// Handler explícito para preflight OPTIONS en todas las rutas
app.options('*', cors(corsOptions));

app.use(cookieParser());

//Indico las rutas de los endpoint
app.use("/api", apiRouter);
app.use("/", indexRouter);

//Conexion a la Base de Datos
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/TestUser';
    
    await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Conectado exitosamente a MongoDB');
    
    // Importar modelos para registrarlos
    require('./models/User.model');
    require('./models/Symbol.model');
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Conectar a la base de datos
connectDB();

// Manejo de errores de mongoose
mongoose.connection.on('error', (err) => {
  console.error('❌ Error de MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.error('⚠️ Desconectado de MongoDB');
});

// Graceful shutdown (solo en producción o cuando realmente se necesite)
// En Windows/desarrollo, PowerShell puede enviar SIGINT inesperadamente
if (process.platform !== 'win32' || process.env.NODE_ENV === 'production') {
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      process.exit(0);
    } catch (error) {
      console.error('❌ Error al cerrar la conexión:', error);
      process.exit(1);
    }
  });
}

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 400,
      message: 'Error de validación',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 400,
      message: 'ID inválido'
    });
  }
  
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Ruta no encontrada'
  });
});

// Server Port
const port = process.env.PORT || 8080;
const host = '0.0.0.0';

// Escuchar en el puerto
const server = app.listen(port, host, () => {
  console.log('🚀 Servidor MERVAL iniciado en el puerto ' + port);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Escuchando en ${host}:${port}`);
});

module.exports = app;
