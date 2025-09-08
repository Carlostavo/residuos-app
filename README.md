# Plataforma Residuos - Final Editor

Incluye:
- Editor WYSIWYG avanzado para admins con drag & resize libre (react-rnd).
- Panel lateral de propiedades para editar cada elemento (texto, imagen, video, botón).
- Toolbar superior con guardar, preview y acceso al historial.
- Autosave, historial y restauración de versiones.
- Login mejorado y UI refinada.

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
