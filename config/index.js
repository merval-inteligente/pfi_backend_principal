const dotenv = require('dotenv');

// Cargar variables de entorno
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const config = {
  // Configuración del servidor
  server: {
    port: process.env.PORT || 8080,
    host: process.env.HOST || '127.0.0.1',
    nodeEnv: process.env.NODE_ENV || 'development'
  },

  // Configuración de la base de datos
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/TestUser',
    name: process.env.DATABASE_NAME || 'TestUser',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },

  // Configuración de JWT
  jwt: {
    secret: process.env.SECRET || 'supersecret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // Configuración de Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },

  // Configuración de email
  email: {
    host: process.env.EMAIL_HOST || 'smtp-mail.outlook.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM
  },

  // Configuración de CORS
  cors: {
    origins: process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:3000', 'http://localhost:3001']
  },

  // Configuración de archivos
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },

  // Configuración de rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },

  // Configuración de desarrollo
  development: {
    debug: process.env.DEBUG === 'true'
  }
};

// Validar configuraciones críticas
const requiredEnvVars = [
  'SECRET',
  'DATABASE1',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`❌ Variable de entorno requerida no encontrada: ${envVar}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
});

module.exports = config;
