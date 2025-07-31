const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

class UserService {
  
  async getUsers(query = {}, page = 1, limit = 100) {
    try {
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: {
          path: 'profesor',
          select: 'name lastName subject'
        }
      };

      const users = await User.paginate(query, options);
      return users;
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  async verificarEmailExistente(email) {
    try {
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        isActive: true 
      });
      return existingUser !== null;
    } catch (error) {
      throw new Error(`Error al verificar email existente: ${error.message}`);
    }
  }

  async createUser(userData) {
    try {
      const newUser = new User({
        image: userData.image,
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email.toLowerCase(),
        telefono: userData.telefono,
        password: userData.password, // Se hasheará automáticamente por el middleware del modelo
        resetToken: "",
        resetTokenExpires: null,
      });

      const savedUser = await newUser.save();

      const token = jwt.sign(
        {
          id: savedUser._id,
          email: savedUser.email,
          role: savedUser.role
        },
        process.env.SECRET,
        {
          expiresIn: '24h'
        }
      );

      return token;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('El email ya está registrado');
      }
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  async updateUser(userData) {
    try {
      const filter = { email: userData.email.toLowerCase() };
      const oldUser = await User.findOne(filter);

      if (!oldUser) {
        throw new Error('Usuario no encontrado');
      }

      const updateData = {};
      if (userData.nombre) updateData.nombre = userData.nombre;
      if (userData.apellido) updateData.apellido = userData.apellido;
      if (userData.telefono) updateData.telefono = userData.telefono;
      if (userData.password) updateData.password = userData.password; // Se hasheará automáticamente

      const updatedUser = await User.findByIdAndUpdate(
        oldUser._id,
        updateData,
        { new: true, runValidators: true }
      );

      return updatedUser;
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  async deleteUser(id) {
    try {
      // Soft delete - marcar como inactivo en lugar de eliminar
      const deletedUser = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!deletedUser) {
        throw new Error('Usuario no encontrado');
      }

      return deletedUser;
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  async loginUser(credentials) {
    try {
      const user = await User.findOne({
        email: credentials.email.toLowerCase(),
        isActive: true
      }).populate('profesor', 'name lastName subject');

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const isValidPassword = await user.comparePassword(credentials.password);
      
      if (!isValidPassword) {
        throw new Error('Contraseña incorrecta');
      }

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role
        },
        process.env.SECRET,
        {
          expiresIn: '24h'
        }
      );

      return { 
        token, 
        user: user.toJSON() // Esto removerá automáticamente la contraseña
      };
    } catch (error) {
      throw new Error(`Error en el login: ${error.message}`);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ 
        email: email.toLowerCase(),
        isActive: true 
      }).populate('profesor', 'name lastName subject');
      
      return user;
    } catch (error) {
      throw new Error(`Error al obtener usuario por email: ${error.message}`);
    }
  }

  async getUserById(id) {
    try {
      const user = await User.findById(id)
        .populate('profesor', 'name lastName subject');
      
      if (!user || !user.isActive) {
        throw new Error('Usuario no encontrado');
      }
      
      return user;
    } catch (error) {
      throw new Error(`Error al obtener usuario por ID: ${error.message}`);
    }
  }

  async actualizarResetToken(email, resetToken, resetTokenExpires) {
    try {
      const user = await User.findOne({ 
        email: email.toLowerCase(),
        isActive: true 
      });
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      user.resetToken = resetToken;
      user.resetTokenExpires = new Date(resetTokenExpires);

      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      throw new Error(`Error al actualizar token de reset: ${error.message}`);
    }
  }

  async actualizarContraseña(userId, newPassword) {
    try {
      const user = await User.findById(userId);
      
      if (!user || !user.isActive) {
        throw new Error('Usuario no encontrado');
      }

      user.password = newPassword; // Se hasheará automáticamente
      user.resetToken = "";
      user.resetTokenExpires = null;

      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      throw new Error(`Error al actualizar contraseña: ${error.message}`);
    }
  }

  async verifyResetToken(email, token) {
    try {
      const user = await User.findOne({
        email: email.toLowerCase(),
        resetToken: token,
        resetTokenExpires: { $gt: Date.now() },
        isActive: true
      });

      return user;
    } catch (error) {
      throw new Error(`Error al verificar token de reset: ${error.message}`);
    }
  }
}

module.exports = new UserService();
