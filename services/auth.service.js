const User = require("../models/User.model");
const CloudinaryService = require("../services/cloudinary");
const jwt = require("jsonwebtoken");

class AuthService {

  // Verificar si un email ya existe
  async checkEmailExists(email) {
    try {
      console.log('🔍 Verificando email:', email);
      console.log('📦 User model:', typeof User, User.findOne ? 'findOne disponible' : 'findOne NO disponible');
      
      const user = await User.findOne({ email: email.toLowerCase() });
      return !!user;
    } catch (error) {
      console.error('❌ Error en checkEmailExists:', error);
      throw new Error(`Error al verificar email: ${error.message}`);
    }
  }

  // Crear un nuevo usuario
  async createUser(userData) {
    try {
      const { email, password, name, acceptTerms } = userData;

      // Verificar que los términos sean aceptados
      if (!acceptTerms) {
        throw new Error('Debe aceptar los términos y condiciones');
      }

      // Verificar email único
      const emailExists = await this.checkEmailExists(email);
      if (emailExists) {
        const error = new Error('El email ya está registrado');
        error.code = 'DUPLICATE_EMAIL';
        throw error;
      }

      // Crear nuevo usuario
      const newUser = new User({
        email: email.toLowerCase(),
        password,
        name,
        preferences: {
          favoriteStocks: [],
          notifications: true,
          theme: 'system'
        },
        lastLogin: new Date()
      });

      // Guardar en la base de datos
      const savedUser = await newUser.save();
      
      // Generar JWT token
      const token = this.generateToken(savedUser._id, savedUser.email);

      return {
        user: savedUser.getPublicProfile(),
        token
      };

    } catch (error) {
      throw error;
    }
  }

  // Autenticar usuario (login)
  async loginUser(credentials) {
    try {
      const { email, password } = credentials;

      // Buscar usuario por email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        const error = new Error('Credenciales inválidas');
        error.code = 'INVALID_CREDENTIALS';
        throw error;
      }

      // Verificar contraseña
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        const error = new Error('Credenciales inválidas');
        error.code = 'INVALID_CREDENTIALS';
        throw error;
      }

      // Actualizar último login
      user.lastLogin = new Date();
      await user.save();

      // Generar JWT token
      const token = this.generateToken(user._id, user.email);

      return {
        user: user.getPublicProfile(),
        token
      };

    } catch (error) {
      throw error;
    }
  }

  // Generar JWT token
  generateToken(userId, email) {
    const payload = {
      id: userId,
      email: email
    };

    const token = jwt.sign(
      payload,
      process.env.SECRET || 'supersecret_change_in_production',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return token;
  }

  // Verificar JWT token
  verifyToken(token) {
    try {
      const decoded = jwt.verify(
        token, 
        process.env.SECRET || 'supersecret_change_in_production'
      );
      return decoded;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  // Obtener usuario por ID
  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      return user.getPublicProfile();
    } catch (error) {
      throw error;
    }
  }

  // Actualizar perfil del usuario
  async updateProfile(userId, updateData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Actualizar campos permitidos
      if (updateData.name) user.name = updateData.name;
      if (updateData.preferences) {
        user.preferences = { ...user.preferences, ...updateData.preferences };
      }

      await user.save();
      return user.getPublicProfile();
    } catch (error) {
      throw error;
    }
  }

  // Actualizar avatar del usuario
  async updateAvatar(userId, avatarData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Si ya tiene un avatar, eliminar el anterior de Cloudinary
      if (user.avatar && user.avatar.publicId) {
        try {
          await CloudinaryService.deleteAvatar(user.avatar.publicId);
        } catch (error) {
          console.warn('No se pudo eliminar avatar anterior:', error.message);
        }
      }

      // Actualizar con nuevo avatar
      user.avatar = avatarData;
      await user.save();
      
      return user.getPublicProfile();
    } catch (error) {
      throw error;
    }
  }

  // Eliminar avatar del usuario
  async deleteAvatar(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Eliminar de Cloudinary si existe
      if (user.avatar && user.avatar.publicId) {
        try {
          await CloudinaryService.deleteAvatar(user.avatar.publicId);
        } catch (error) {
          console.warn('No se pudo eliminar avatar de Cloudinary:', error.message);
        }
      }

      // Limpiar avatar del usuario
      user.avatar = {
        url: null,
        publicId: null,
        uploadedAt: null
      };
      
      await user.save();
      return user.getPublicProfile();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
