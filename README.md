# Plataforma Residuos - Full Edit
Esta versión incluye:
- Editor WYSIWYG para admins con toolbar (bold/italic/underline/lists/links/image upload).
- Autosave y page history.
- Drag & drop básico y agregar bloques.

## Setup rapido
1. Ejecuta `sql/all_tables_with_history_pages.sql` en el SQL Editor de Supabase.
2. En Supabase Storage crea un bucket llamado `images` y hazlo public (o configura políticas de lectura pública).
3. Añade las variables en `.env.local`:
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
4. `npm install` y `npm run dev`

## Seguridad
- Solo usuarios con role='admin' en la tabla `profiles` verán/usar el editor.
- No compartas `SUPABASE_SERVICE_ROLE_KEY` en frontend.
