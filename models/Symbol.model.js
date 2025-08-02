const mongoose = require("mongoose");

const SymbolSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: [true, 'El símbolo es requerido'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: [3, 'El símbolo debe tener al menos 3 caracteres'],
    maxlength: [6, 'El símbolo no puede exceder 6 caracteres']
  },
  name: {
    type: String,
    required: [true, 'El nombre de la empresa es requerido'],
    trim: true,
    maxlength: [200, 'El nombre no puede exceder 200 caracteres']
  },
  sector: {
    type: String,
    required: [true, 'El sector es requerido'],
    enum: [
      'Bancos',
      'Petróleo y Gas', 
      'Telecomunicaciones',
      'Energía',
      'Siderurgia',
      'Alimentos',
      'Construcción',
      'Metalurgia',
      'Papel',
      'Transporte',
      'Holding',
      'Otros'
    ]
  },
  market: {
    type: String,
    default: 'MERVAL',
    enum: ['MERVAL', 'MAE', 'BYMA']
  },
  currency: {
    type: String,
    default: 'ARS',
    enum: ['ARS', 'USD']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  website: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Debe ser una URL válida'
    }
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Índices para optimizar consultas
SymbolSchema.index({ sector: 1 });
SymbolSchema.index({ isActive: 1 });
SymbolSchema.index({ market: 1 });

// Middleware para asegurar que el símbolo esté en mayúsculas
SymbolSchema.pre('save', function(next) {
  if (this.symbol) {
    this.symbol = this.symbol.toUpperCase();
  }
  next();
});

// Método estático para obtener símbolos activos
SymbolSchema.statics.getActiveSymbols = function() {
  return this.find({ isActive: true }).select('symbol name sector').sort({ symbol: 1 });
};

// Método estático para buscar por sector
SymbolSchema.statics.getBySector = function(sector) {
  return this.find({ sector, isActive: true }).sort({ symbol: 1 });
};

module.exports = mongoose.model("Symbol", SymbolSchema);
