const UserService = require("../services/user.service");
const ProfesorService = require("../services/profesor.service");
const jwt = require("jsonwebtoken");
const cloudinary = require("../services/cloudinary");

class UserController {

  async createUser(req, res) {
    try {
      const emailExists = await UserService.verificarEmailExistente(req.body.email);
      if (emailExists) {
        return res.status(400).json({
          status: 400,
          message: "El correo electrónico ya existe en la base de datos",
        });
      }

      // Subir la imagen a Cloudinary si existe
      let urlImg = null;
      if (req.file) {
        urlImg = await cloudinary.uploadImage(req.file.buffer);
      }

      const newUser = {
        image: urlImg,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        telefono: req.body.telefono,
        password: req.body.password,
      };

      const createdUser = await UserService.createUser(newUser);

      // Obtener el ID del usuario del token
      let userId;
      jwt.verify(createdUser, process.env.SECRET, (err, decoded) => {
        if (err) {
          throw new Error("Error al procesar el token de usuario");
        }
        userId = decoded.id;
      });

      // Crear un nuevo profesor asociado al usuario
      const newProfesor = {
        image: urlImg,
        name: req.body.nombre,
        lastName: req.body.apellido,
        email: req.body.email,
        phone: req.body.telefono,
        subject: req.body.materia || "Materia por definir",
        age: parseInt(req.body.edad) || 30,
        description: req.body.descripcion || "",
        background: req.body.experiencia || "",
        userId: userId,
      };

      await ProfesorService.crearProfesor(newProfesor);

      return res.status(201).json({
        status: 201,
        token: createdUser,
        message: "Usuario y Profesor creados exitosamente",
      });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return res.status(400).json({
        status: 400,
        message: error.message || "La creación de usuario y profesor no fue exitosa",
      });
    }
  }

  async getUsers(req, res) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 100;
      
      const users = await UserService.getUsers({}, page, limit);
      
      return res.status(200).json({
        status: 200,
        data: users,
        message: "Usuarios obtenidos exitosamente",
      });
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return res.status(400).json({ 
        status: 400, 
        message: error.message 
      });
    }
  }

  async getUsersByMail(req, res) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 100;
      const filtro = { email: req.body.email };

      const users = await UserService.getUsers(filtro, page, limit);
      
      return res.status(200).json({
        status: 200,
        data: users,
        message: "Usuario obtenido exitosamente",
      });
    } catch (error) {
      console.error("Error al obtener usuario por email:", error);
      return res.status(400).json({ 
        status: 400, 
        message: error.message 
      });
    }
  }

  async updateUser(req, res) {
    try {
      if (!req.body.email) {
        return res.status(400).json({ 
          status: 400, 
          message: "El email es requerido" 
        });
      }

      const userData = {
        email: req.body.email,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        telefono: req.body.telefono,
        password: req.body.password,
      };

      // Remover propiedades undefined
      Object.keys(userData).forEach(key => {
        if (userData[key] === undefined) {
          delete userData[key];
        }
      });

      const updatedUser = await UserService.updateUser(userData);
      
      return res.status(200).json({
        status: 200,
        data: updatedUser,
        message: "Usuario actualizado exitosamente",
      });
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      return res.status(400).json({ 
        status: 400, 
        message: error.message 
      });
    }
  }

  async removeUser(req, res) {
    try {
      const id = req.params.id;
      
      if (!id) {
        return res.status(400).json({
          status: 400,
          message: "ID de usuario requerido"
        });
      }

      await UserService.deleteUser(id);
      
      return res.status(200).json({ 
        status: 200, 
        message: "Usuario eliminado exitosamente" 
      });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      return res.status(400).json({ 
        status: 400, 
        message: error.message 
      });
    }
  }

  async loginUser(req, res) {
    try {
      const credentials = {
        email: req.body.email,
        password: req.body.password,
      };

      const loginResult = await UserService.loginUser(credentials);
      
      return res.status(200).json({ 
        status: 200,
        ...loginResult, 
        message: "Login exitoso" 
      });
    } catch (error) {
      console.error("Error en login:", error);
      
      if (error.message.includes("Usuario no encontrado") || 
          error.message.includes("Contraseña incorrecta")) {
        return res.status(401).json({ 
          status: 401, 
          message: "Credenciales inválidas" 
        });
      }
      
      return res.status(400).json({ 
        status: 400, 
        message: error.message 
      });
    }
  }

  async getImagenUsuario(req, res) {
    try {
      const email = req.params.email;
      
      if (!email) {
        return res.status(400).json({
          status: 400,
          message: "Email requerido"
        });
      }

      const user = await UserService.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ 
          status: 404, 
          message: "Usuario no encontrado" 
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Imagen de usuario obtenida exitosamente",
        image: user.image,
      });
    } catch (error) {
      console.error("Error al obtener imagen de usuario:", error);
      return res.status(400).json({ 
        status: 400, 
        message: error.message 
      });
    }
  }

  async getUserProfile(req, res) {
    try {
      const userId = req.userId; // Viene del middleware de autorización
      
      const user = await UserService.getUserById(userId);
      
      return res.status(200).json({
        status: 200,
        data: user,
        message: "Perfil de usuario obtenido exitosamente"
      });
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      return res.status(400).json({ 
        status: 400, 
        message: error.message 
      });
    }
  }
}

module.exports = new UserController();
