import { supabase } from '../config/supabase';

/**
 * Sube un archivo a Supabase Storage
 * @param {File} file - Archivo a subir
 * @param {string} category - Categoría del archivo (productos, usuarios, documentos)
 * @param {string} customName - Nombre personalizado para el archivo (opcional)
 * @returns {Promise<Object>} Información del archivo subido
 */
export const uploadFile = async (file, category = 'productos', customName = null) => {
  try {
    // Sanitizar el nombre del archivo
    const fileExt = file.name.split('.').pop();
    const fileName = customName 
      ? `${customName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase()}.${fileExt}`
      : `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${category}/${fileName}`;

    // Subir archivo a Supabase Storage en el bucket 'assets'
    const { data, error } = await supabase.storage
      .from('assets')
      .upload(`media/${filePath}`, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error al subir a Supabase:', error);
      throw new Error(error.message || 'Error al subir archivo');
    }

    // Obtener URL pública del archivo
    const { data: publicUrlData } = supabase.storage
      .from('assets')
      .getPublicUrl(`media/${filePath}`);

    return {
      fileName: fileName,
      fileUrl: publicUrlData.publicUrl,
      filePath: `media/${filePath}`,
      success: true
    };
  } catch (error) {
    console.error('Error en uploadFile:', error);
    throw error;
  }
};

/**
 * Descarga un archivo de Supabase Storage
 * @param {string} filePath - Ruta del archivo en el bucket (ej: 'media/productos/producto1.jpg')
 * @returns {Promise<Blob>} Archivo descargado
 */
export const downloadFile = async (filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from('assets')
      .download(filePath);

    if (error) {
      throw new Error(`Error al descargar archivo: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error en downloadFile:', error);
    throw error;
  }
};

/**
 * Obtiene la URL pública de un archivo
 * @param {string} filename - Nombre del archivo o ruta
 * @returns {string} URL del archivo
 */
export const getFileUrl = (filename) => {
  if (!filename) return '';
  
  // Si ya es una URL completa, devolverla tal cual
  if (filename.startsWith('http://') || filename.startsWith('https://') || filename.startsWith('data:')) {
    return filename;
  }
  
  // Si es una ruta local, devolverla tal cual
  if (filename.startsWith('/assets/') || filename.startsWith('./assets/')) {
    return filename;
  }
  
  // Obtener URL pública de Supabase Storage
  const { data } = supabase.storage
    .from('assets')
    .getPublicUrl(filename.startsWith('media/') ? filename : `media/${filename}`);
  
  return data.publicUrl;
};

/**
 * Elimina un archivo de Supabase Storage
 * @param {string} filePath - Ruta del archivo a eliminar (ej: 'media/productos/producto1.jpg')
 * @returns {Promise<Object>} Resultado de la eliminación
 */
export const deleteFile = async (filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from('assets')
      .remove([filePath]);

    if (error) {
      throw new Error(`Error al eliminar archivo: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error en deleteFile:', error);
    throw error;
  }
};

/**
 * Lista todos los archivos en una carpeta de Supabase Storage
 * @param {string} folder - Carpeta para listar (ej: 'media/productos')
 * @returns {Promise<Array>} Lista de archivos
 */
export const listFiles = async (folder = 'media') => {
  try {
    const { data, error } = await supabase.storage
      .from('assets')
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      throw new Error(`Error al listar archivos: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error en listFiles:', error);
    throw error;
  }
};

/**
 * Valida un archivo antes de subirlo
 * @param {File} file - Archivo a validar
 * @param {Object} options - Opciones de validación
 * @param {number} options.maxSize - Tamaño máximo en bytes (default: 5MB)
 * @param {Array<string>} options.allowedTypes - Tipos MIME permitidos
 * @returns {Object} {valid: boolean, error: string}
 */
export const validateFile = (file, options = {}) => {
  const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB por defecto
  const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (!file) {
    return { valid: false, error: 'No se seleccionó ningún archivo' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: `El archivo no puede pesar más de ${maxSize / (1024 * 1024)}MB` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Tipo de archivo no permitido' };
  }

  return { valid: true };
};

const fileService = {
  uploadFile,
  downloadFile,
  getFileUrl,
  deleteFile,
  listFiles,
  validateFile,
};

export default fileService;
