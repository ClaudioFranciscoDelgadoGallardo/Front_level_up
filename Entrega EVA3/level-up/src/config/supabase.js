import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xsgpfadjkjgbnnxgnqhp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzZ3BmYWRqa2pnYm5ueGducWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjkyMzYsImV4cCI6MjA3ODY0NTIzNn0.LP2OXUVq0KlO2-zLSnDSsYV1Khqm7FHotoEVCILvmc8';

// ÚNICA INSTANCIA de Supabase - exportada para ser reutilizada
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Función para subir imagen de perfil a Supabase Storage
export const subirImagenPerfil = async (userId, file) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `UserId_${userId}.${fileExt}`;
    const filePath = `user_perfil/${fileName}`;
    
    // Subir archivo al bucket assets
    const { error } = await supabase.storage
      .from('assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Error de Supabase:', error);
      throw error;
    }

    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error al subir imagen a Supabase:', error);
    throw new Error('Error al subir la imagen de perfil');
  }
};

// Función para eliminar imagen de perfil anterior
export const eliminarImagenPerfil = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Extraer la ruta del archivo de la URL
    const urlParts = imageUrl.split('/assets/');
    if (urlParts.length < 2) return;
    
    const filePath = urlParts[1]; // Obtiene "user_perfil/nombrearchivo.jpg"
    
    const { error } = await supabase.storage
      .from('assets')
      .remove([filePath]);

    if (error) {
      console.error('Error al eliminar imagen:', error);
    }
  } catch (error) {
    console.error('Error al eliminar imagen de perfil:', error);
  }
};
