const mongoose = require("mongoose");
const Symbol = require("../models/Symbol.model");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

// Datos de símbolos MERVAL con información detallada
const MERVAL_SYMBOLS = [
  {
    symbol: "ALUA",
    name: "Aluar Aluminio Argentino S.A.I.C.",
    sector: "Metalurgia",
    description: "Empresa líder en la producción de aluminio primario en Argentina",
    website: "https://www.aluar.com.ar"
  },
  {
    symbol: "BBAR",
    name: "Banco Macro S.A.",
    sector: "Bancos",
    description: "Uno de los principales bancos privados de Argentina",
    website: "https://www.macro.com.ar"
  },
  {
    symbol: "BMA",
    name: "Banco Macro S.A.",
    sector: "Bancos",
    description: "Banco con amplia presencia en el mercado argentino",
    website: "https://www.macro.com.ar"
  },
  {
    symbol: "BYMA",
    name: "Bolsas y Mercados Argentinos S.A.",
    sector: "Otros",
    description: "Principal bolsa de valores de Argentina",
    website: "https://www.byma.com.ar"
  },
  {
    symbol: "CEPU",
    name: "Central Puerto S.A.",
    sector: "Energía",
    description: "Empresa de generación de energía eléctrica",
    website: "https://www.centralpuerto.com"
  },
  {
    symbol: "COME",
    name: "Sociedad Comercial del Plata S.A.",
    sector: "Holding",
    description: "Holding empresarial con diversas inversiones",
    website: "https://www.socoplata.com.ar"
  },
  {
    symbol: "CRES",
    name: "Cresud S.A.C.I.F. y A.",
    sector: "Alimentos",
    description: "Empresa agropecuaria y de desarrollo urbano",
    website: "https://www.cresud.com.ar"
  },
  {
    symbol: "CVH",
    name: "Cablevision Holding S.A.",
    sector: "Telecomunicaciones",
    description: "Empresa de servicios de telecomunicaciones y entretenimiento",
    website: "https://www.cablevisionholding.com"
  },
  {
    symbol: "EDN",
    name: "Edenor S.A.",
    sector: "Energía",
    description: "Empresa de distribución de energía eléctrica",
    website: "https://www.edenor.com.ar"
  },
  {
    symbol: "GGAL",
    name: "Grupo Financiero Galicia S.A.",
    sector: "Bancos",
    description: "Uno de los principales grupos financieros de Argentina",
    website: "https://www.galicia.com.ar"
  },
  {
    symbol: "HARG",
    name: "Holcim Argentina S.A.",
    sector: "Construcción",
    description: "Empresa líder en materiales de construcción",
    website: "https://www.holcim.com.ar"
  },
  {
    symbol: "HAVA",
    name: "Havanna Holding S.A.",
    sector: "Alimentos",
    description: "Empresa de productos alimenticios y confitería",
    website: "https://www.havanna.com.ar"
  },
  {
    symbol: "INTR",
    name: "Intruvias S.A.",
    sector: "Construcción",
    description: "Empresa de construcción e infraestructura",
    website: "https://www.intruvias.com"
  },
  {
    symbol: "LOMA",
    name: "Loma Negra Compañía Industrial Argentina S.A.",
    sector: "Construcción",
    description: "Principal productora de cemento en Argentina",
    website: "https://www.lomanegra.com.ar"
  },
  {
    symbol: "METR",
    name: "Metrogas S.A.",
    sector: "Energía",
    description: "Empresa distribuidora de gas natural",
    website: "https://www.metrogas.com.ar"
  },
  {
    symbol: "MIRG",
    name: "Mirgor S.A.C.I.F.I.A.",
    sector: "Otros",
    description: "Empresa de manufactura electrónica",
    website: "https://www.mirgor.com.ar"
  },
  {
    symbol: "PAMP",
    name: "Pampa Energía S.A.",
    sector: "Energía",
    description: "Empresa integrada de energía",
    website: "https://www.pampaenergia.com"
  },
  {
    symbol: "SUPV",
    name: "Grupo Supervielle S.A.",
    sector: "Bancos",
    description: "Grupo financiero con servicios bancarios",
    website: "https://www.supervielle.com.ar"
  },
  {
    symbol: "TECO2",
    name: "Telecom Argentina S.A.",
    sector: "Telecomunicaciones",
    description: "Empresa de servicios de telecomunicaciones",
    website: "https://www.telecom.com.ar"
  },
  {
    symbol: "TGNO4",
    name: "Transportadora de Gas del Norte S.A.",
    sector: "Energía",
    description: "Empresa de transporte de gas natural",
    website: "https://www.tgn.com.ar"
  },
  {
    symbol: "TGSU2",
    name: "Transportadora de Gas del Sur S.A.",
    sector: "Energía",
    description: "Empresa de transporte de gas natural",
    website: "https://www.tgs.com.ar"
  },
  {
    symbol: "TRAN",
    name: "Transener S.A.",
    sector: "Energía",
    description: "Empresa de transporte de energía eléctrica",
    website: "https://www.transener.com.ar"
  },
  {
    symbol: "TXAR",
    name: "Ternium Argentina S.A.",
    sector: "Siderurgia",
    description: "Empresa siderúrgica productora de acero",
    website: "https://www.ternium.com"
  },
  {
    symbol: "VALO",
    name: "Banco de Valores S.A.",
    sector: "Bancos",
    description: "Banco de inversión especializado",
    website: "https://www.bancovalores.com.ar"
  },
  {
    symbol: "YPFD",
    name: "YPF S.A.",
    sector: "Petróleo y Gas",
    description: "Principal empresa petrolera de Argentina",
    website: "https://www.ypf.com"
  }
];

async function connectToDatabase() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/TestUser';
    
    await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Conectado exitosamente a MongoDB');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    return false;
  }
}

async function seedSymbols() {
  console.log('🌱 Iniciando población de símbolos MERVAL...');
  
  try {
    // Verificar si ya existen símbolos
    const existingCount = await Symbol.countDocuments();
    
    if (existingCount > 0) {
      console.log(`⚠️ Ya existen ${existingCount} símbolos en la base de datos.`);
      console.log('¿Desea continuar? Esto eliminará todos los símbolos existentes y los reemplazará.');
      
      // En un entorno de producción, aquí podrías pedir confirmación
      console.log('🗑️ Eliminando símbolos existentes...');
      await Symbol.deleteMany({});
      console.log('✅ Símbolos existentes eliminados');
    }
    
    // Insertar nuevos símbolos
    console.log('📊 Insertando símbolos MERVAL...');
    const insertedSymbols = await Symbol.insertMany(MERVAL_SYMBOLS);
    
    console.log(`✅ ${insertedSymbols.length} símbolos insertados exitosamente:`);
    
    // Mostrar resumen por sector
    const symbolsBySector = await Symbol.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$sector', count: { $sum: 1 }, symbols: { $push: '$symbol' } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\n📈 Resumen por sector:');
    symbolsBySector.forEach(sector => {
      console.log(`  ${sector._id}: ${sector.count} símbolos (${sector.symbols.join(', ')})`);
    });
    
    console.log(`\n🎉 Total de símbolos activos: ${await Symbol.countDocuments({ isActive: true })}`);
    
  } catch (error) {
    console.error('❌ Error al poblar símbolos:', error);
    throw error;
  }
}

async function verifyData() {
  console.log('\n🔍 Verificando datos insertados...');
  
  try {
    const totalSymbols = await Symbol.countDocuments();
    const activeSymbols = await Symbol.countDocuments({ isActive: true });
    const symbolsList = await Symbol.find({ isActive: true }).select('symbol name sector').sort({ symbol: 1 });
    
    console.log(`📊 Símbolos totales: ${totalSymbols}`);
    console.log(`✅ Símbolos activos: ${activeSymbols}`);
    
    console.log('\n📋 Lista completa de símbolos:');
    symbolsList.forEach(symbol => {
      console.log(`  ${symbol.symbol.padEnd(6)} - ${symbol.name} (${symbol.sector})`);
    });
    
    // Verificar integridad de datos
    const symbolsArray = symbolsList.map(s => s.symbol);
    const originalSymbols = MERVAL_SYMBOLS.map(s => s.symbol);
    const missing = originalSymbols.filter(s => !symbolsArray.includes(s));
    const extra = symbolsArray.filter(s => !originalSymbols.includes(s));
    
    if (missing.length > 0) {
      console.log(`⚠️ Símbolos faltantes: ${missing.join(', ')}`);
    }
    if (extra.length > 0) {
      console.log(`⚠️ Símbolos extra: ${extra.join(', ')}`);
    }
    if (missing.length === 0 && extra.length === 0) {
      console.log('✅ Todos los símbolos están correctamente insertados');
    }
    
  } catch (error) {
    console.error('❌ Error al verificar datos:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Script de población de símbolos MERVAL iniciado');
  
  try {
    // Conectar a la base de datos
    const connected = await connectToDatabase();
    if (!connected) {
      process.exit(1);
    }
    
    // Poblar símbolos
    await seedSymbols();
    
    // Verificar datos
    await verifyData();
    
    console.log('\n🎉 Script completado exitosamente');
    
  } catch (error) {
    console.error('\n❌ Error en el script:', error);
    process.exit(1);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('🔒 Conexión a MongoDB cerrada');
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  main();
}

module.exports = {
  seedSymbols,
  verifyData,
  MERVAL_SYMBOLS
};
