/**
 * Utilidades para ofuscar datos sensibles en logs y respuestas
 */

/**
 * Ofusca una contraseña mostrando solo los primeros 2 caracteres
 * @param {string} password - La contraseña a ofuscar
 * @returns {string} - Contraseña ofuscada
 */
const obfuscatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return '***';
  }
  
  if (password.length <= 2) {
    return '***';
  }
  
  return password.substring(0, 2) + '*'.repeat(password.length - 2);
};

/**
 * Ofusca un email mostrando solo las primeras 2 letras del usuario
 * @param {string} email - El email a ofuscar
 * @returns {string} - Email ofuscado
 */
const obfuscateEmail = (email) => {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return 'us***@***.com';
  }
  
  const [user, domain] = email.split('@');
  const obfuscatedUser = user.length <= 2 ? '***' : user.substring(0, 2) + '*'.repeat(user.length - 2);
  const obfuscatedDomain = domain.substring(0, 1) + '*'.repeat(domain.length - 1);
  
  return `${obfuscatedUser}@${obfuscatedDomain}`;
};

/**
 * Ofusca datos sensibles en un objeto para logging
 * @param {object} data - Objeto con datos potencialmente sensibles
 * @returns {object} - Objeto con datos sensibles ofuscados
 */
const obfuscateForLogging = (data) => {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  const obfuscated = { ...data };
  
  // Ofuscar contraseñas
  if (obfuscated.password) {
    obfuscated.password = obfuscatePassword(obfuscated.password);
  }
  if (obfuscated.newPassword) {
    obfuscated.newPassword = obfuscatePassword(obfuscated.newPassword);
  }
  if (obfuscated.oldPassword) {
    obfuscated.oldPassword = obfuscatePassword(obfuscated.oldPassword);
  }
  
  // Ofuscar email parcialmente
  if (obfuscated.email) {
    obfuscated.email = obfuscateEmail(obfuscated.email);
  }
  
  return obfuscated;
};

/**
 * Logger seguro que ofusca automáticamente datos sensibles
 * @param {string} level - Nivel de log (info, warn, error)
 * @param {string} message - Mensaje del log
 * @param {object} data - Datos adicionales (serán ofuscados)
 */
const secureLog = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  
  if (data) {
    const obfuscatedData = obfuscateForLogging(data);
    console[level](logMessage, obfuscatedData);
  } else {
    console[level](logMessage);
  }
};

module.exports = {
  obfuscatePassword,
  obfuscateEmail,
  obfuscateForLogging,
  secureLog
};
