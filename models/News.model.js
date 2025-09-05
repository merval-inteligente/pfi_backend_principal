const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  adaptacion_contenido: {
    type: String,
    default: null
  },
  adaptacion_nivel: {
    type: String,
    default: null
  },
  adaptacion_resumen: {
    type: String,
    default: null
  },
  contenido: {
    type: String,
    required: true
  },
  empresas_merval: {
    type: [String],
    default: []
  },
  fecha_publicacion_raw: {
    type: String,
    default: null
  },
  fecha_scrapeo: {
    type: String,
    default: null
  },
  resumen: {
    type: String,
    default: null
  },
  titulo: {
    type: String,
    required: true
  }
}, {
  timestamps: false,
  collection: 'news' // Especifica la colección existente
});

// Índices para mejorar las búsquedas
NewsSchema.index({ titulo: 'text', contenido: 'text', resumen: 'text' });
NewsSchema.index({ empresas_merval: 1 });
NewsSchema.index({ fecha_scrapeo: -1 });

module.exports = mongoose.model("News", NewsSchema);
