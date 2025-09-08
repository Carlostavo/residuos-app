# Plataforma Residuos - Advanced Editor

Incluye:
- Editor WYSIWYG para admins con drag & resize libre (react-rnd).
- Toolbar con formatos e imagen upload (Supabase Storage).
- Autosave, historial y restauración de versiones.
- Mejora de interfaz (header, cards, responsive).

## Setup
1. Ejecuta `sql/all_tables_with_history_pages.sql` en Supabase SQL Editor.
2. Crea bucket `images` en Supabase Storage y configúralo público o con políticas adecuadas.
3. Añade `.env.local` con:
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
4. `npm install` y `npm run dev`.

## Notas
- Solo users con role='admin' pueden editar y restaurar versiones.
- No compartas `SUPABASE_SERVICE_ROLE_KEY` en frontend.
