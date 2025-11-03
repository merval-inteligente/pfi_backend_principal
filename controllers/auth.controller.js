const AuthService = require("../services/auth.service");
const CloudinaryService = require("../services/cloudinary");

class AuthController {

  // Registro de usuarios
  async register(req, res) {
    try {
      const { email, password, name, acceptTerms, investmentKnowledge, riskAppetite } = req.body;

      // Convertir acceptTerms de string a boolean si viene de FormData
      const termsAccepted = acceptTerms === 'true' || acceptTerms === true;

      // Crear usuario
      const result = await AuthService.createUser({
        email,
        password,
        name,
        acceptTerms: termsAccepted,
        investmentKnowledge,
        riskAppetite
      });

      // Si hay avatar, subirlo después de crear el usuario
      let avatarResult = null;
      if (req.file) {
        try {
          avatarResult = await CloudinaryService.uploadAvatar(req.file.buffer, result.user.id);
          
          // Actualizar usuario con avatar
          const updatedUser = await AuthService.updateAvatar(result.user.id, {
            url: avatarResult.url,
            publicId: avatarResult.publicId,
            uploadedAt: new Date()
          });
          
          // Actualizar el objeto user en el resultado con el perfil actualizado
          result.user = updatedUser;
        } catch (avatarError) {
          console.warn('⚠️ Error subiendo avatar durante registro:', avatarError.message);
          // No fallar el registro por error de avatar
        }
      }

      // Respuesta exitosa
      return res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente" + (avatarResult ? " con avatar" : ""),
        data: {
          user: result.user,
          token: result.token,
          avatar: avatarResult ? {
            url: avatarResult.url,
            publicId: avatarResult.publicId,
            uploaded: true
          } : null
        }
      });

    } catch (error) {
      console.error('❌ Error en registro:', error);

      // Manejar errores específicos
      if (error.code === 'DUPLICATE_EMAIL') {
        return res.status(400).json({
          success: false,
          message: "Email ya está registrado",
          error: "DUPLICATE_EMAIL"
        });
      }

      if (error.message.includes('términos')) {
        return res.status(400).json({
          success: false,
          message: "Debe aceptar los términos y condiciones",
          error: "TERMS_NOT_ACCEPTED"
        });
      }

      // Error de validación de Mongoose
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));

        return res.status(400).json({
          success: false,
          message: "Datos de entrada inválidos",
          errors: validationErrors
        });
      }

      // Error genérico del servidor
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: "INTERNAL_SERVER_ERROR"
      });
    }
  }

  // Login de usuarios
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Autenticar usuario
      const result = await AuthService.loginUser({ email, password });

      // Respuesta exitosa
      return res.status(200).json({
        success: true,
        message: "Login exitoso",
        data: {
          user: result.user,
          token: result.token
        }
      });

    } catch (error) {
      console.error('❌ Error en login:', error);

      // Manejar errores específicos
      if (error.code === 'INVALID_CREDENTIALS') {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
          error: "INVALID_CREDENTIALS"
        });
      }

      // Error genérico del servidor
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: "INTERNAL_SERVER_ERROR"
      });
    }
  }

  // Obtener perfil del usuario actual
  async getProfile(req, res) {
    try {
      const userId = req.userId; // Viene del middleware de autenticación

      const user = await AuthService.getUserById(userId);

      return res.status(200).json({
        success: true,
        message: "Perfil obtenido exitosamente",
        data: {
          user: user
        }
      });

    } catch (error) {
      console.error('❌ Error al obtener perfil:', error);

      if (error.message.includes('Usuario no encontrado')) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
          error: "USER_NOT_FOUND"
        });
      }

      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: "INTERNAL_SERVER_ERROR"
      });
    }
  }

  // Verificar token
  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Token no proporcionado",
          error: "NO_TOKEN"
        });
      }

      const decoded = AuthService.verifyToken(token);
      const user = await AuthService.getUserById(decoded.id);

      return res.status(200).json({
        success: true,
        message: "Token válido",
        data: {
          user: user,
          valid: true
        }
      });

    } catch (error) {
      console.error('❌ Error al verificar token:', error);

      return res.status(401).json({
        success: false,
        message: "Token inválido",
        error: "INVALID_TOKEN"
      });
    }
  }

  // Actualizar perfil del usuario
  async updateProfile(req, res) {
    try {
      const userId = req.userId;
      const { name, preferences } = req.body;

      const updatedUser = await AuthService.updateProfile(userId, {
        name,
        preferences
      });

      return res.status(200).json({
        success: true,
        message: "Perfil actualizado exitosamente",
        data: {
          user: updatedUser
        }
      });

    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);

      if (error.message.includes('Usuario no encontrado')) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
          error: "USER_NOT_FOUND"
        });
      }

      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: "INTERNAL_SERVER_ERROR"
      });
    }
  }

  // Subir avatar del usuario
  async uploadAvatar(req, res) {
    try {
      const userId = req.userId;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No se proporcionó archivo de imagen",
          error: "NO_FILE"
        });
      }

      // Subir avatar a Cloudinary
      const avatarResult = await CloudinaryService.uploadAvatar(req.file.buffer, userId);

      // Actualizar usuario con nueva información del avatar
      const updatedUser = await AuthService.updateAvatar(userId, {
        url: avatarResult.url,
        publicId: avatarResult.publicId,
        uploadedAt: new Date()
      });

      return res.status(200).json({
        success: true,
        message: "Avatar subido exitosamente",
        data: {
          user: updatedUser,
          avatar: avatarResult
        }
      });

    } catch (error) {
      console.error('❌ Error al subir avatar:', error);

      if (error.message.includes('Solo se permiten archivos de imagen')) {
        return res.status(400).json({
          success: false,
          message: "Solo se permiten archivos de imagen",
          error: "INVALID_FILE_TYPE"
        });
      }

      return res.status(500).json({
        success: false,
        message: "Error al subir avatar",
        error: "UPLOAD_ERROR"
      });
    }
  }

  // Eliminar avatar del usuario
  async deleteAvatar(req, res) {
    try {
      const userId = req.userId;

      const updatedUser = await AuthService.deleteAvatar(userId);

      return res.status(200).json({
        success: true,
        message: "Avatar eliminado exitosamente",
        data: {
          user: updatedUser
        }
      });

    } catch (error) {
      console.error('❌ Error al eliminar avatar:', error);

      return res.status(500).json({
        success: false,
        message: "Error al eliminar avatar",
        error: "DELETE_ERROR"
      });
    }
  }

  // Solicitar reset de contraseña
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;

      const result = await AuthService.requestPasswordReset(email);

      return res.status(200).json({
        success: true,
        message: result.message
      });

    } catch (error) {
      console.error('❌ Error al solicitar reset de contraseña:', error);

      return res.status(500).json({
        success: false,
        message: "Error al procesar solicitud de reset",
        error: "RESET_REQUEST_ERROR"
      });
    }
  }

  // Verificar código de reset
  async verifyResetCode(req, res) {
    try {
      const { email, code } = req.body;

      const result = await AuthService.verifyResetCode(email, code);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          isValid: result.isValid
        }
      });

    } catch (error) {
      console.error('❌ Error al verificar código:', error);

      if (error.message.includes('inválido') || error.message.includes('expirado')) {
        return res.status(400).json({
          success: false,
          message: error.message,
          error: "INVALID_CODE"
        });
      }

      return res.status(500).json({
        success: false,
        message: "Error al verificar código",
        error: "VERIFY_CODE_ERROR"
      });
    }
  }

  // Reset de contraseña con código
  async resetPassword(req, res) {
    try {
      const { email, code, newPassword } = req.body;

      const result = await AuthService.resetPasswordWithCode(email, code, newPassword);

      return res.status(200).json({
        success: true,
        message: result.message
      });

    } catch (error) {
      console.error('❌ Error al resetear contraseña:', error);

      if (error.message.includes('inválido') || error.message.includes('expirado')) {
        return res.status(400).json({
          success: false,
          message: error.message,
          error: "INVALID_CODE"
        });
      }

      return res.status(500).json({
        success: false,
        message: "Error al resetear contraseña",
        error: "RESET_PASSWORD_ERROR"
      });
    }
  }
}

module.exports = new AuthController();
