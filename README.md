
# Residuos App Next.js + Supabase (Arreglado)

## Pasos
1. Copia `.env.local.example` -> `.env.local` con tus credenciales de Supabase.
2. Ejecuta en Supabase el archivo `supabase.sql` para crear tablas y políticas.
3. `npm install`
4. `npm run dev`
5. Abre http://localhost:3000

- Usa /login para iniciar sesión con un usuario de Supabase Auth.
- Asigna rol en `user_roles` (admin o tecnico) para poder editar.
- La página principal embebe el editor visual (pae_editor.html).
