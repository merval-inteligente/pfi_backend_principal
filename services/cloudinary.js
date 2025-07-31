const cloudinary = require("cloudinary").v2;

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dxgbzpvaq",
  api_key: process.env.CLOUDINARY_API_KEY || "678791492265236",
  api_secret: process.env.CLOUDINARY_API_SECRET || "YQln6MlQKuPEHDMiwtXIRdsyoUo",
});

class CloudinaryService {
  
  async uploadImage(imageBuffer, options = {}) {
    try {
      if (!imageBuffer) {
        throw new Error('Buffer de imagen requerido');
      }

      const defaultOptions = {
        folder: 'merval/users',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
          { width: 800, height: 600, crop: 'limit' }
        ],
        resource_type: 'image',
        ...options
      };

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          defaultOptions,
          (error, result) => {
            if (error) {
              console.error('Error uploading to Cloudinary:', error);
              reject(new Error(`Error al subir imagen: ${error.message}`));
            } else {
              resolve(result);
            }
          }
        ).end(imageBuffer);
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      };

    } catch (error) {
      console.error('Error en uploadImage:', error);
      throw error;
    }
  }

  async uploadProfileImage(imageBuffer, userId) {
    try {
      const options = {
        folder: 'eduwizard/profiles',
        public_id: `profile_${userId}`,
        overwrite: true,
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      };

      const result = await this.uploadImage(imageBuffer, options);
      return result.url;
    } catch (error) {
      throw new Error(`Error al subir imagen de perfil: ${error.message}`);
    }
  }

  async uploadCourseImage(imageBuffer, courseId) {
    try {
      const options = {
        folder: 'eduwizard/courses',
        public_id: `course_${courseId}`,
        overwrite: true,
        transformation: [
          { width: 800, height: 450, crop: 'fill' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      };

      const result = await this.uploadImage(imageBuffer, options);
      return result.url;
    } catch (error) {
      throw new Error(`Error al subir imagen de curso: ${error.message}`);
    }
  }

  async deleteImage(publicId) {
    try {
      if (!publicId) {
        throw new Error('Public ID requerido para eliminar imagen');
      }

      const result = await cloudinary.uploader.destroy(publicId);
      
      if (result.result !== 'ok') {
        throw new Error(`Error al eliminar imagen: ${result.result}`);
      }

      return result;
    } catch (error) {
      console.error('Error en deleteImage:', error);
      throw error;
    }
  }

  async getImageInfo(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId);
      return {
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        createdAt: result.created_at
      };
    } catch (error) {
      console.error('Error en getImageInfo:', error);
      throw new Error(`Error al obtener información de imagen: ${error.message}`);
    }
  }

  generateImageUrl(publicId, transformations = {}) {
    try {
      return cloudinary.url(publicId, {
        secure: true,
        ...transformations
      });
    } catch (error) {
      console.error('Error en generateImageUrl:', error);
      throw new Error(`Error al generar URL de imagen: ${error.message}`);
    }
  }

  // Método específico para subir avatares de usuarios
  async uploadAvatar(imageBuffer, userId) {
    try {
      const avatarOptions = {
        folder: 'merval/avatars',
        public_id: `user_${userId}_avatar`,
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
          { width: 300, height: 300, crop: 'fill', gravity: 'face' },
          { radius: 'max' } // Hace la imagen circular
        ],
        overwrite: true, // Permite sobrescribir el avatar anterior
        resource_type: 'image'
      };

      const result = await this.uploadImage(imageBuffer, avatarOptions);
      
      return {
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height
      };
    } catch (error) {
      console.error('❌ Error al subir avatar:', error);
      throw new Error(`Error al subir avatar: ${error.message}`);
    }
  }

  // Método para eliminar avatar anterior
  async deleteAvatar(publicId) {
    try {
      if (!publicId) return { success: true };
      
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error al eliminar avatar:', error);
      throw new Error(`Error al eliminar avatar: ${error.message}`);
    }
  }
}

module.exports = new CloudinaryService();
