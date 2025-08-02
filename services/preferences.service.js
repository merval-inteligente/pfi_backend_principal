const User = require("../models/User.model");
const Symbol = require("../models/Symbol.model");

class PreferencesService {

  // Cache para símbolos válidos (se actualiza cada hora)
  static symbolsCache = null;
  static lastCacheUpdate = null;
  static CACHE_DURATION = 60 * 60 * 1000; // 1 hora en milisegundos
  
  // Cache para símbolos completos con información de sector
  static completeSymbolsCache = null;
  static lastCompleteCacheUpdate = null;

  // Obtener símbolos válidos desde la base de datos
  async getValidSymbols() {
    try {
      const now = Date.now();
      
      // Verificar si el cache es válido
      if (PreferencesService.symbolsCache && 
          PreferencesService.lastCacheUpdate && 
          (now - PreferencesService.lastCacheUpdate) < PreferencesService.CACHE_DURATION) {
        return PreferencesService.symbolsCache;
      }
      
      // Obtener símbolos activos de la base de datos
      const symbols = await Symbol.getActiveSymbols();
      const symbolsArray = symbols.map(symbol => symbol.symbol);
      
      // Actualizar cache
      PreferencesService.symbolsCache = symbolsArray;
      PreferencesService.lastCacheUpdate = now;
      
      return symbolsArray;
    } catch (error) {
      console.error('Error obteniendo símbolos de BD, usando fallback:', error);
      
      // Fallback a lista hardcodeada si hay error en BD
      return [
        'ALUA', 'BBAR', 'BMA', 'BYMA', 'CEPU', 'COME', 'CRES', 'CVH', 'EDN', 
        'GGAL', 'HARG', 'HAVA', 'INTR', 'LOMA', 'METR', 'MIRG', 'PAMP', 
        'SUPV', 'TECO2', 'TGNO4', 'TGSU2', 'TRAN', 'TXAR', 'VALO', 'YPFD'
      ];
    }
  }

  // Obtener preferencias del usuario
  async getUserPreferences(userId) {
    try {
      const user = await User.findById(userId).select('preferences');
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return user.preferences;
    } catch (error) {
      console.error('Error en getUserPreferences:', error);
      throw error;
    }
  }

  // Actualizar preferencias completas del usuario
  async updateUserPreferences(userId, preferencesData) {
    try {
      // Validar símbolos si se incluyen
      if (preferencesData.favoriteStocks) {
        await this.validateStockSymbols(preferencesData.favoriteStocks);
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { 
          $set: { 
            preferences: preferencesData 
          }
        },
        { 
          new: true, 
          runValidators: true 
        }
      ).select('preferences');

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return user.preferences;
    } catch (error) {
      console.error('Error en updateUserPreferences:', error);
      throw error;
    }
  }

  // Actualizar preferencias parcialmente
  async patchUserPreferences(userId, partialData) {
    try {
      const updateQuery = {};

      // Construir query de actualización con dot notation
      for (const key of Object.keys(partialData)) {
        if (key === 'favoriteStocks') {
          await this.validateStockSymbols(partialData[key]);
        }
        updateQuery[`preferences.${key}`] = partialData[key];
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateQuery },
        { 
          new: true, 
          runValidators: true 
        }
      ).select('preferences');

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return user.preferences;
    } catch (error) {
      console.error('Error en patchUserPreferences:', error);
      throw error;
    }
  }

  // Agregar acción a favoritos
  async addFavoriteStock(userId, symbol) {
    try {
      // Validar símbolo
      await this.validateStockSymbol(symbol);

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar si ya existe
      if (user.preferences.favoriteStocks.includes(symbol.toUpperCase())) {
        return {
          alreadyExists: true,
          preferences: user.preferences
        };
      }

      // Agregar a favoritos
      user.preferences.favoriteStocks.push(symbol.toUpperCase());
      await user.save();

      return {
        alreadyExists: false,
        preferences: user.preferences
      };
    } catch (error) {
      console.error('Error en addFavoriteStock:', error);
      throw error;
    }
  }

  // Remover acción de favoritos
  async removeFavoriteStock(userId, symbol) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const symbolUpper = symbol.toUpperCase();
      const initialLength = user.preferences.favoriteStocks.length;
      
      user.preferences.favoriteStocks = user.preferences.favoriteStocks.filter(
        stock => stock !== symbolUpper
      );

      const wasRemoved = user.preferences.favoriteStocks.length < initialLength;
      
      if (wasRemoved) {
        await user.save();
      }

      return {
        wasRemoved,
        preferences: user.preferences
      };
    } catch (error) {
      console.error('Error en removeFavoriteStock:', error);
      throw error;
    }
  }

  // Validar un símbolo de acción
  async validateStockSymbol(symbol) {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('Symbol de acción inválido');
    }

    const validSymbols = await this.getValidSymbols();
    const symbolUpper = symbol.toUpperCase();
    
    if (!validSymbols.includes(symbolUpper)) {
      throw new Error(`Symbol '${symbol}' no es válido para MERVAL`);
    }

    return true;
  }

  // Validar array de símbolos
  async validateStockSymbols(symbols) {
    if (!Array.isArray(symbols)) {
      throw new Error('Los símbolos deben ser un array');
    }

    for (const symbol of symbols) {
      await this.validateStockSymbol(symbol);
    }

    return true;
  }

  // Obtener lista de símbolos válidos (método público)
  async getValidSymbolsList() {
    return await this.getValidSymbols();
  }

  // Obtener símbolos completos con información de sector
  async getCompleteSymbolsInfo() {
    try {
      const now = Date.now();
      const COMPLETE_CACHE_KEY = 'completeSymbolsCache';
      
      // Verificar si el cache completo es válido
      if (PreferencesService[COMPLETE_CACHE_KEY] && 
          PreferencesService.lastCompleteCacheUpdate && 
          (now - PreferencesService.lastCompleteCacheUpdate) < PreferencesService.CACHE_DURATION) {
        return PreferencesService[COMPLETE_CACHE_KEY];
      }
      
      // Obtener símbolos activos con información completa de la base de datos
      const symbols = await Symbol.find({ isActive: true })
        .select('symbol name sector market currency description')
        .sort({ symbol: 1 });
      
      const symbolsWithSectors = symbols.map(symbol => ({
        symbol: symbol.symbol,
        name: symbol.name,
        sector: symbol.sector,
        market: symbol.market || 'MERVAL',
        currency: symbol.currency || 'ARS',
        description: symbol.description || null
      }));
      
      // Actualizar cache
      PreferencesService[COMPLETE_CACHE_KEY] = symbolsWithSectors;
      PreferencesService.lastCompleteCacheUpdate = now;
      
      return symbolsWithSectors;
    } catch (error) {
      console.error('Error obteniendo símbolos completos de BD:', error);
      
      // Fallback simplificado si hay error
      const fallbackSymbols = [
        'ALUA', 'BBAR', 'BMA', 'BYMA', 'CEPU', 'COME', 'CRES', 'CVH', 'EDN', 
        'GGAL', 'HARG', 'HAVA', 'INTR', 'LOMA', 'METR', 'MIRG', 'PAMP', 
        'SUPV', 'TECO2', 'TGNO4', 'TGSU2', 'TRAN', 'TXAR', 'VALO', 'YPFD'
      ];
      
      return fallbackSymbols.map(symbol => ({
        symbol,
        name: symbol,
        sector: 'Otros',
        market: 'MERVAL',
        currency: 'ARS',
        description: null
      }));
    }
  }

  // Obtener sectores únicos
  async getUniqueSectors() {
    try {
      const sectors = await Symbol.distinct('sector', { isActive: true });
      return sectors.sort();
    } catch (error) {
      console.error('Error obteniendo sectores:', error);
      return ['Bancos', 'Energía', 'Telecomunicaciones', 'Construcción', 'Alimentos', 'Otros'];
    }
  }

  // Agregar todos los símbolos de un sector a favoritos
  async addFavoriteBySector(userId, sector) {
    try {
      // Obtener todos los símbolos del sector
      const sectorSymbols = await Symbol.find({ 
        sector: sector, 
        isActive: true 
      }).select('symbol');
      
      if (sectorSymbols.length === 0) {
        throw new Error(`No se encontraron símbolos activos para el sector: ${sector}`);
      }
      
      const symbolsToAdd = sectorSymbols.map(s => s.symbol);
      
      // Obtener usuario actual
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      
      // Combinar favoritos existentes con nuevos (sin duplicados)
      const currentFavorites = user.preferences?.favoriteStocks || [];
      const updatedFavorites = [...new Set([...currentFavorites, ...symbolsToAdd])];
      
      // Verificar límite de 50 favoritos
      if (updatedFavorites.length > 50) {
        throw new Error(`No se pueden agregar todos los símbolos. Límite máximo: 50 favoritos. Actualmente tienes ${currentFavorites.length} y intentas agregar ${symbolsToAdd.length} más.`);
      }
      
      // Actualizar preferencias
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { 
          $set: { 
            'preferences.favoriteStocks': updatedFavorites 
          }
        },
        { new: true, runValidators: true }
      ).select('preferences');
      
      if (!updatedUser) {
        throw new Error('Error actualizando preferencias del usuario');
      }
      
      const addedSymbols = symbolsToAdd.filter(symbol => !currentFavorites.includes(symbol));
      
      return {
        preferences: updatedUser.preferences,
        sector: sector,
        addedSymbols: addedSymbols,
        totalAdded: addedSymbols.length,
        skippedDuplicates: symbolsToAdd.length - addedSymbols.length
      };
    } catch (error) {
      console.error('Error agregando favoritos por sector:', error);
      throw error;
    }
  }
}

module.exports = new PreferencesService();
