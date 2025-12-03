-- Agregar columna foto_perfil a la tabla usuarios
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'foto_perfil'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN foto_perfil TEXT;
    END IF;
END $$;

COMMENT ON COLUMN usuarios.foto_perfil IS 'URL de la imagen de perfil del usuario almacenada en Supabase Storage (bucket: assets/user_perfil)';
