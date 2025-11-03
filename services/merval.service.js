const axios = require("axios");

class MervalService {

  // Mapa de símbolos MERVAL a Yahoo Finance
  // Incluye todos los símbolos principales del panel líder del MERVAL
  constructor() {
    this.symbolMap = {
      // Panel Líder - Principales
      'YPF': 'YPFD',      // YPF S.A.
      'GGAL': 'GGAL',     // Grupo Financiero Galicia
      'BBAR': 'BBAR',     // Banco BBVA Argentina
      'ALUA': 'ALUA',     // Aluar Aluminio Argentino
      'BMA': 'BMA',       // Banco Macro
      'COME': 'COME',     // Sociedad Comercial del Plata
      'CEPU': 'CEPU',     // Central Puerto
      'CRES': 'CRES',     // Cresud
      'CVH': 'CVH',       // Cablevision Holding
      'EDN': 'EDN',       // Edenor
      'HARG': 'HARG',     // Holcim Argentina
      'LOMA': 'LOMA',     // Loma Negra
      'MIRG': 'MIRG',     // Mirgor
      'PAMP': 'PAMP',     // Pampa Energía
      'SUPV': 'SUPV',     // Grupo Supervielle
      'TECO2': 'TECO2',   // Telecom Argentina
      'TGNO4': 'TGNO4',   // Transportadora de Gas del Norte
      'TGSU2': 'TGSU2',   // Transportadora de Gas del Sur
      'TRAN': 'TRAN',     // Transener
      'TXAR': 'TXAR',     // Ternium Argentina
      'VALO': 'VALO',     // Banco de Valores
      'BYMA': 'BYMA',     // Bolsas y Mercados Argentinos
      
      // Otros activos importantes
      'AGRO': 'AGRO',     // Agrometal
      'AUSO': 'AUSO',     // Autopistas del Sol
      'BHIP': 'BHIP',     // Banco Hipotecario
      'BOLT': 'BOLT',     // Boldt
      'BPAT': 'BPAT',     // Banco Patagonia
      'CARC': 'CARC',     // Carboclor
      'CECO2': 'CECO2',   // Central Costanera
      'CGPA2': 'CGPA2',   // Camuzzi Gas Pampeana
      'CTIO': 'CTIO',     // Consultatio
      'DGCU2': 'DGCU2',   // Distribuidora de Gas Cuyana
      'DOME': 'DOME',     // Domec
      'DYCA': 'DYCA',     // Dycasa
      'ESME': 'ESME',     // Esmeralda Corp
      'FERR': 'FERR',     // Ferrum
      'FIPL': 'FIPL',     // Fiplasto
      'GAMI': 'GAMI',     // Garovaglio y Zorraquin
      'GBAN': 'GBAN',     // Grupo Banco Galicia
      'GCLA': 'GCLA',     // Grupo Clarín
      'GRIM': 'GRIM',     // Grimoldi
      'HAVA': 'HAVA',     // Havanna
      'INTR': 'INTR',     // Introducir
      'INVJ': 'INVJ',     // Inversora Juramento
      'IRSA': 'IRSA',     // IRSA
      'LEDE': 'LEDE',     // Ledesma
      'LONG': 'LONG',     // Longvie
      'METR': 'METR',     // Metrogas
      'MOLA': 'MOLA',     // Molinos Agro
      'MOLI': 'MOLI',     // Molinos Río de la Plata
      'MORI': 'MORI',     // Morixe Hermanos
      'OEST': 'OEST',     // Banco Provincia
      'PATA': 'PATA',     // Petrolera Pampa
      'POLL': 'POLL',     // Polledo
      'RICH': 'RICH',     // Laboratorios Richmond
      'RIGO': 'RIGO',     // Rigolleau
      'ROSE': 'ROSE',     // Rosental
      'SAMI': 'SAMI',     // San Miguel
      'SEMI': 'SEMI',     // Molinos Juan Semino
      'TGLT': 'TGLT',     // Tglt
      'VALU': 'VALU'      // Grupo Valores
    };
  }

  /**
   * Obtener el precio del índice Merval del día
   * Fuente: Yahoo Finance API (símbolo ^MERV)
   */
  async getMervalPrice() {
    try {
      // URL de Yahoo Finance para el índice Merval (^MERV)
      const url = "https://query1.finance.yahoo.com/v8/finance/chart/%5EMERV";

      
      
      const response = await axios.get(url, {
        params: {
          interval: '1d',
          range: '1d'
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000 // 10 segundos de timeout
      });

      // Extraer información relevante
      const data = response.data;
      
      if (!data || !data.chart || !data.chart.result || data.chart.result.length === 0) {
        throw new Error('No se recibieron datos del índice Merval');
      }

      const result = data.chart.result[0];
      const meta = result.meta;
      const quote = result.indicators?.quote?.[0];

      // Calcular variación
      const currentPrice = meta.regularMarketPrice || meta.previousClose;
      const previousClose = meta.chartPreviousClose || meta.previousClose;
      const change = currentPrice && previousClose ? currentPrice - previousClose : null;
      const changePercent = change && previousClose ? (change / previousClose) * 100 : null;

      // Formatear respuesta
      const mervalData = {
        index: '^MERV',
        name: 'Índice Merval',
        price: currentPrice,
        previousClose: previousClose,
        change: change ? parseFloat(change.toFixed(2)) : null,
        changePercent: changePercent ? parseFloat(changePercent.toFixed(2)) : null,
        volume: quote?.volume?.[0] || null,
        high: meta.regularMarketDayHigh || null,
        low: meta.regularMarketDayLow || null,
        currency: meta.currency || 'ARS',
        date: new Date(meta.regularMarketTime * 1000).toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        source: 'Yahoo Finance'
      };

      
      
      return mervalData;

    } catch (error) {
      console.error('❌ Error al obtener precio del Merval:', error.message);
      
      // Si la API principal falla, intentar con fuente alternativa
      return await this.getMervalPriceFallback();
    }
  }

  /**
   * Fuente alternativa para obtener el precio del Merval
   * Usando API de BYMA como fallback
   */
  async getMervalPriceFallback() {
    try {
      console.log('⚠️ Usando fuente alternativa para precio del Merval (BYMA)...');
      
      // Intentar con API de BYMA
      const url = "https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free/index/I.MERV";
      
      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        },
        timeout: 10000
      });

      if (response.data) {
        const data = response.data;
        return {
          index: 'I.MERV',
          name: 'Índice Merval',
          price: data.settlementPrice || data.lastPrice || null,
          change: data.change || null,
          changePercent: data.changePercent || null,
          volume: data.volume || null,
          date: data.date || new Date().toISOString().split('T')[0],
          timestamp: new Date().toISOString(),
          source: 'BYMA'
        };
      }

      throw new Error('No se pudo obtener datos de fuente alternativa');

    } catch (error) {
      console.error('❌ Error en fuente alternativa:', error.message);
      
      // Retornar mensaje de error con status 503
      return {
        index: '^MERV',
        name: 'Índice Merval',
        price: null,
        previousClose: null,
        change: null,
        changePercent: null,
        volume: null,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        source: 'Unavailable',
        error: 'No se pudo obtener el precio del Merval en este momento',
        message: 'El servicio de cotizaciones no está disponible. Por favor, intente nuevamente más tarde.'
      };
    }
  }

  /**
   * Obtener histórico del Merval (últimos N días)
   * @param {number} days - Cantidad de días de histórico
   */
  async getMervalHistory(days = 30) {
    try {
      // Calcular rango de fechas
      const endDate = Math.floor(Date.now() / 1000); // timestamp en segundos
      const startDate = endDate - (days * 24 * 60 * 60); // restar días en segundos

      // URL de Yahoo Finance para histórico
      const url = "https://query1.finance.yahoo.com/v8/finance/chart/%5EMERV";
      
      const response = await axios.get(url, {
        params: {
          interval: '1d',
          period1: startDate,
          period2: endDate
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 15000
      });

      const result = response.data?.chart?.result?.[0];
      
      if (!result) {
        throw new Error('No se recibieron datos históricos');
      }

      // Formatear datos históricos
      const timestamps = result.timestamp || [];
      const quotes = result.indicators?.quote?.[0] || {};
      
      const historicalData = timestamps.map((timestamp, index) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        open: quotes.open?.[index] || null,
        high: quotes.high?.[index] || null,
        low: quotes.low?.[index] || null,
        close: quotes.close?.[index] || null,
        volume: quotes.volume?.[index] || null
      })).filter(item => item.close !== null); // Filtrar días sin datos

      return {
        index: '^MERV',
        name: 'Índice Merval',
        period: {
          from: historicalData[0]?.date || new Date(startDate * 1000).toISOString().split('T')[0],
          to: historicalData[historicalData.length - 1]?.date || new Date(endDate * 1000).toISOString().split('T')[0],
          days: historicalData.length
        },
        data: historicalData,
        timestamp: new Date().toISOString(),
        source: 'Yahoo Finance'
      };

    } catch (error) {
      console.error('❌ Error al obtener histórico del Merval:', error.message);
      throw new Error('No se pudo obtener el histórico del Merval');
    }
  }

  /**
   * Obtener resumen del mercado (Merval + principales acciones)
   */
  async getMarketSummary() {
    try {
      // Obtener precio del Merval
      const mervalPrice = await this.getMervalPrice();

      // Aquí podrías agregar lógica para obtener precios de acciones principales
      // Por ahora retornamos solo el índice
      
      return {
        merval: mervalPrice,
        timestamp: new Date().toISOString(),
        marketStatus: this.getMarketStatus()
      };

    } catch (error) {
      console.error('❌ Error al obtener resumen del mercado:', error.message);
      throw error;
    }
  }

  /**
   * Determinar si el mercado está abierto o cerrado
   */
  getMarketStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 6 = Sábado
    const hour = now.getHours();
    
    // Mercado abierto de lunes a viernes, de 11:00 a 17:00 (hora Argentina)
    const isWeekday = day >= 1 && day <= 5;
    const isDuringMarketHours = hour >= 11 && hour < 17;
    
    if (isWeekday && isDuringMarketHours) {
      return {
        status: 'open',
        message: 'Mercado abierto'
      };
    } else {
      return {
        status: 'closed',
        message: 'Mercado cerrado'
      };
    }
  }

  /**
   * Obtener precio de un activo individual del Merval
   * @param {string} symbol - Símbolo de la acción (ej: YPFD, GGAL, BBAR)
   */
  async getStockPrice(symbol) {
    try {
      // Normalizar símbolo
      const normalizedSymbol = symbol.toUpperCase();
      const mervalSymbol = this.symbolMap[normalizedSymbol] || normalizedSymbol;
      
      // Convertir símbolo a formato Yahoo Finance (.BA para Buenos Aires)
      const yahooSymbol = `${mervalSymbol}.BA`;
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`;

      const response = await axios.get(url, {
        params: {
          interval: '1d',
          range: '1d'
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const data = response.data;
      
      if (!data || !data.chart || !data.chart.result || data.chart.result.length === 0) {
        throw new Error(`No se encontraron datos para ${symbol}`);
      }

      const result = data.chart.result[0];
      const meta = result.meta;
      const quote = result.indicators?.quote?.[0];

      // Calcular variación
      const currentPrice = meta.regularMarketPrice || meta.previousClose;
      const previousClose = meta.chartPreviousClose || meta.previousClose;
      const change = currentPrice && previousClose ? currentPrice - previousClose : null;
      const changePercent = change && previousClose ? (change / previousClose) * 100 : null;

      const stockData = {
        symbol: normalizedSymbol,
        yahooSymbol: yahooSymbol,
        name: meta.longName || meta.shortName || normalizedSymbol,
        price: currentPrice,
        previousClose: previousClose,
        change: change ? parseFloat(change.toFixed(2)) : null,
        changePercent: changePercent ? parseFloat(changePercent.toFixed(2)) : null,
        volume: quote?.volume?.[quote.volume.length - 1] || null,
        high: meta.regularMarketDayHigh || null,
        low: meta.regularMarketDayLow || null,
        open: quote?.open?.[0] || null,
        currency: meta.currency || 'ARS',
        exchangeTimezoneName: meta.exchangeTimezoneName || 'America/Argentina/Buenos_Aires',
        date: new Date(meta.regularMarketTime * 1000).toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        source: 'Yahoo Finance'
      };

      return stockData;

    } catch (error) {
      console.error(`❌ Error al obtener precio de ${symbol}:`, error.message);
      
      // Retornar error estructurado
      return {
        symbol: symbol.toUpperCase(),
        name: symbol.toUpperCase(),
        price: null,
        error: `No se pudo obtener el precio de ${symbol}`,
        message: 'El símbolo puede no existir o no estar disponible en este momento',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Obtener precios de múltiples activos
   * @param {Array<string>} symbols - Array de símbolos (ej: ['YPF', 'GGAL', 'BBAR'])
   */
  async getMultipleStockPrices(symbols) {
    try {
      // Obtener precios en paralelo
      const promises = symbols.map(symbol => this.getStockPrice(symbol));
      const results = await Promise.all(promises);

      const successCount = results.filter(r => r.price !== null).length;

      return {
        stocks: results,
        total: symbols.length,
        successful: successCount,
        failed: symbols.length - successCount,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Error al obtener múltiples precios:', error.message);
      throw error;
    }
  }

  /**
   * Obtener histórico de un activo individual
   * @param {string} symbol - Símbolo de la acción
   * @param {number} days - Cantidad de días de histórico
   */
  async getStockHistory(symbol, days = 30) {
    try {
      const normalizedSymbol = symbol.toUpperCase();
      const mervalSymbol = this.symbolMap[normalizedSymbol] || normalizedSymbol;
      const yahooSymbol = `${mervalSymbol}.BA`;
      
      const endDate = Math.floor(Date.now() / 1000);
      const startDate = endDate - (days * 24 * 60 * 60);

      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`;
      
      const response = await axios.get(url, {
        params: {
          interval: '1d',
          period1: startDate,
          period2: endDate
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 15000
      });

      const result = response.data?.chart?.result?.[0];
      
      if (!result) {
        throw new Error(`No se recibieron datos históricos de ${symbol}`);
      }

      const timestamps = result.timestamp || [];
      const quotes = result.indicators?.quote?.[0] || {};
      
      const historicalData = timestamps.map((timestamp, index) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        open: quotes.open?.[index] || null,
        high: quotes.high?.[index] || null,
        low: quotes.low?.[index] || null,
        close: quotes.close?.[index] || null,
        volume: quotes.volume?.[index] || null
      })).filter(item => item.close !== null);

      return {
        symbol: normalizedSymbol,
        yahooSymbol: yahooSymbol,
        name: result.meta?.longName || normalizedSymbol,
        period: {
          from: historicalData[0]?.date || new Date(startDate * 1000).toISOString().split('T')[0],
          to: historicalData[historicalData.length - 1]?.date || new Date(endDate * 1000).toISOString().split('T')[0],
          days: historicalData.length
        },
        data: historicalData,
        timestamp: new Date().toISOString(),
        source: 'Yahoo Finance'
      };

    } catch (error) {
      console.error(`❌ Error al obtener histórico de ${symbol}:`, error.message);
      throw new Error(`No se pudo obtener el histórico de ${symbol}`);
    }
  }
  /**
   * Obtener información completa de un activo (datos fundamentales + técnicos)
   * @param {string} symbol - Símbolo de la acción
   */
  async getStockFullInfo(symbol) {
    try {
      const normalizedSymbol = symbol.toUpperCase();
      const mervalSymbol = this.symbolMap[normalizedSymbol] || normalizedSymbol;
      const yahooSymbol = `${mervalSymbol}.BA`;

      // Obtener datos de cotización, estadísticas y perfil corporativo
      const [quoteData, statsData, profileData] = await Promise.all([
        axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`, {
          params: { interval: '1d', range: '1d' },
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 10000
        }),
        axios.get(`https://query2.finance.yahoo.com/v10/finance/quoteSummary/${yahooSymbol}`, {
          params: { modules: 'summaryDetail,financialData,defaultKeyStatistics,price' },
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 10000
        }).catch(() => null), // No fallar si no hay stats
        axios.get(`https://query2.finance.yahoo.com/v10/finance/quoteSummary/${yahooSymbol}`, {
          params: { modules: 'assetProfile,summaryProfile' },
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 10000
        }).catch(() => null) // No fallar si no hay perfil
      ]);

      const chartResult = quoteData.data?.chart?.result?.[0];
      const meta = chartResult?.meta;
      const quote = chartResult?.indicators?.quote?.[0];
      
      // Datos de estadísticas (pueden no estar disponibles para todas las acciones)
      const summaryDetail = statsData?.data?.quoteSummary?.result?.[0]?.summaryDetail;
      const financialData = statsData?.data?.quoteSummary?.result?.[0]?.financialData;
      const keyStats = statsData?.data?.quoteSummary?.result?.[0]?.defaultKeyStatistics;
      const priceData = statsData?.data?.quoteSummary?.result?.[0]?.price;

      // Datos del perfil corporativo
      const assetProfile = profileData?.data?.quoteSummary?.result?.[0]?.assetProfile;
      const summaryProfile = profileData?.data?.quoteSummary?.result?.[0]?.summaryProfile;

      const currentPrice = meta?.regularMarketPrice || meta?.previousClose;
      const previousClose = meta?.chartPreviousClose || meta?.previousClose;
      const change = currentPrice && previousClose ? currentPrice - previousClose : null;
      const changePercent = change && previousClose ? (change / previousClose) * 100 : null;

      const fullInfo = {
        symbol: normalizedSymbol,
        yahooSymbol: yahooSymbol,
        name: meta?.longName || meta?.shortName || normalizedSymbol,
        
        // Precio y cambio
        price: {
          current: currentPrice,
          previousClose: previousClose,
          change: change ? parseFloat(change.toFixed(2)) : null,
          changePercent: changePercent ? parseFloat(changePercent.toFixed(2)) : null,
          open: quote?.open?.[0] || null,
          dayHigh: meta?.regularMarketDayHigh || null,
          dayLow: meta?.regularMarketDayLow || null,
          fiftyTwoWeekHigh: meta?.fiftyTwoWeekHigh || summaryDetail?.fiftyTwoWeekHigh?.raw || null,
          fiftyTwoWeekLow: meta?.fiftyTwoWeekLow || summaryDetail?.fiftyTwoWeekLow?.raw || null
        },

        // Volumen
        volume: {
          current: quote?.volume?.[quote.volume.length - 1] || null,
          average: summaryDetail?.averageDailyVolume10Day?.raw || null,
          averageVolume10Day: summaryDetail?.averageDailyVolume10Day?.raw || null
        },

        // Datos del mercado
        marketData: {
          marketCap: priceData?.marketCap?.raw || null,
          sharesOutstanding: keyStats?.sharesOutstanding?.raw || null,
          floatShares: keyStats?.floatShares?.raw || null,
          beta: keyStats?.beta?.raw || null,
          currency: meta?.currency || 'ARS',
          exchange: meta?.exchangeName || 'Buenos Aires'
        },

        // Ratios financieros
        financialRatios: {
          peRatio: summaryDetail?.trailingPE?.raw || null,
          forwardPE: summaryDetail?.forwardPE?.raw || null,
          priceToBook: keyStats?.priceToBook?.raw || null,
          profitMargin: financialData?.profitMargins?.raw || null,
          operatingMargin: financialData?.operatingMargins?.raw || null,
          returnOnAssets: financialData?.returnOnAssets?.raw || null,
          returnOnEquity: financialData?.returnOnEquity?.raw || null
        },

        // Dividendos
        dividends: {
          dividendRate: summaryDetail?.dividendRate?.raw || null,
          dividendYield: summaryDetail?.dividendYield?.raw || null,
          exDividendDate: summaryDetail?.exDividendDate?.fmt || null,
          payoutRatio: summaryDetail?.payoutRatio?.raw || null
        },

        // Análisis técnico
        technicalAnalysis: {
          fiftyDayAverage: summaryDetail?.fiftyDayAverage?.raw || null,
          twoHundredDayAverage: summaryDetail?.twoHundredDayAverage?.raw || null
        },

        // Información adicional
        info: {
          sector: assetProfile?.sector || priceData?.quoteType || null,
          industry: assetProfile?.industry || priceData?.industry || null,
          description: assetProfile?.longBusinessSummary || summaryProfile?.longBusinessSummary || null,
          website: assetProfile?.website || null,
          employees: assetProfile?.fullTimeEmployees || null,
          country: assetProfile?.country || null,
          city: assetProfile?.city || null,
          address: assetProfile?.address1 || null
        },

        timestamp: new Date().toISOString(),
        source: 'Yahoo Finance'
      };

      return fullInfo;

    } catch (error) {
      console.error(`❌ Error al obtener información completa de ${symbol}:`, error.message);
      throw new Error(`No se pudo obtener información completa de ${symbol}`);
    }
  }

  /**
   * Obtener resumen ejecutivo de un activo (indicadores clave)
   * @param {string} symbol - Símbolo de la acción
   */
  async getStockSummary(symbol) {
    try {
      const fullInfo = await this.getStockFullInfo(symbol);

      // Extraer solo los indicadores más importantes
      const summary = {
        symbol: fullInfo.symbol,
        name: fullInfo.name,
        price: fullInfo.price.current,
        change: fullInfo.price.change,
        changePercent: fullInfo.price.changePercent,
        
        keyMetrics: {
          marketCap: fullInfo.marketData.marketCap,
          peRatio: fullInfo.financialRatios.peRatio,
          dividendYield: fullInfo.dividends.dividendYield,
          beta: fullInfo.marketData.beta,
          fiftyTwoWeekHigh: fullInfo.price.fiftyTwoWeekHigh,
          fiftyTwoWeekLow: fullInfo.price.fiftyTwoWeekLow,
          averageVolume: fullInfo.volume.average,
          profitMargin: fullInfo.financialRatios.profitMargin
        },

        performance: {
          day: fullInfo.price.changePercent,
          fiftyTwoWeek: fullInfo.price.fiftyTwoWeekHigh && fullInfo.price.current 
            ? ((fullInfo.price.current - fullInfo.price.fiftyTwoWeekLow) / 
               (fullInfo.price.fiftyTwoWeekHigh - fullInfo.price.fiftyTwoWeekLow) * 100).toFixed(2)
            : null
        },

        timestamp: fullInfo.timestamp,
        source: fullInfo.source
      };

      return summary;

    } catch (error) {
      console.error(`❌ Error al obtener resumen ejecutivo de ${symbol}:`, error.message);
      throw error;
    }
  }

  /**
   * Obtener análisis técnico de un activo
   * @param {string} symbol - Símbolo de la acción
   */
  async getStockTechnicalAnalysis(symbol) {
    try {
      const normalizedSymbol = symbol.toUpperCase();
      const mervalSymbol = this.symbolMap[normalizedSymbol] || normalizedSymbol;
      const yahooSymbol = `${mervalSymbol}.BA`;

      // Obtener datos históricos de 200 días para calcular medias móviles
      const endDate = Math.floor(Date.now() / 1000);
      const startDate = endDate - (200 * 24 * 60 * 60);

      const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`, {
        params: {
          interval: '1d',
          period1: startDate,
          period2: endDate
        },
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 15000
      });

      const result = response.data?.chart?.result?.[0];
      const quotes = result?.indicators?.quote?.[0];
      const closePrices = quotes?.close?.filter(p => p !== null) || [];

      // Calcular medias móviles
      const sma50 = closePrices.length >= 50 
        ? closePrices.slice(-50).reduce((a, b) => a + b, 0) / 50 
        : null;
      
      const sma200 = closePrices.length >= 200 
        ? closePrices.slice(-200).reduce((a, b) => a + b, 0) / 200 
        : null;

      // Calcular RSI (14 períodos)
      const rsi = this.calculateRSI(closePrices, 14);

      // Señales técnicas
      const currentPrice = closePrices[closePrices.length - 1];
      const signals = {
        sma50Signal: sma50 ? (currentPrice > sma50 ? 'BULLISH' : 'BEARISH') : null,
        sma200Signal: sma200 ? (currentPrice > sma200 ? 'BULLISH' : 'BEARISH') : null,
        rsiSignal: rsi ? (rsi > 70 ? 'OVERBOUGHT' : rsi < 30 ? 'OVERSOLD' : 'NEUTRAL') : null,
        goldenCross: sma50 && sma200 ? (sma50 > sma200 ? 'YES' : 'NO') : null
      };

      const technicalAnalysis = {
        symbol: normalizedSymbol,
        name: result?.meta?.longName || normalizedSymbol,
        currentPrice: currentPrice,
        
        movingAverages: {
          sma50: sma50 ? parseFloat(sma50.toFixed(2)) : null,
          sma200: sma200 ? parseFloat(sma200.toFixed(2)) : null,
          distanceToSMA50: sma50 ? parseFloat(((currentPrice - sma50) / sma50 * 100).toFixed(2)) : null,
          distanceToSMA200: sma200 ? parseFloat(((currentPrice - sma200) / sma200 * 100).toFixed(2)) : null
        },

        indicators: {
          rsi: rsi ? parseFloat(rsi.toFixed(2)) : null,
          rsiSignal: signals.rsiSignal
        },

        signals: signals,

        support: {
          level1: Math.min(...closePrices.slice(-20)),
          level2: Math.min(...closePrices.slice(-50))
        },

        resistance: {
          level1: Math.max(...closePrices.slice(-20)),
          level2: Math.max(...closePrices.slice(-50))
        },

        timestamp: new Date().toISOString(),
        source: 'Yahoo Finance'
      };

      return technicalAnalysis;

    } catch (error) {
      console.error(`❌ Error al obtener análisis técnico de ${symbol}:`, error.message);
      throw new Error(`No se pudo obtener análisis técnico de ${symbol}`);
    }
  }

  /**
   * Calcular RSI (Relative Strength Index)
   * @param {Array} prices - Array de precios de cierre
   * @param {number} period - Período (usualmente 14)
   */
  calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) return null;

    const changes = [];
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1]);
    }

    const gains = changes.map(c => c > 0 ? c : 0);
    const losses = changes.map(c => c < 0 ? Math.abs(c) : 0);

    const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;

    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return rsi;
  }
}

module.exports = new MervalService();
