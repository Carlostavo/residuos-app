# PAE Next.js Scaffold

Proyecto convertido desde `pae_supabase_mejorado.html` a Next.js (pages router).

- Pages: /, /indicadores, /metas, /avances, /reportes, /formularios
- Componentes: Header, EditorCanvas (lienzo editable simplificado)
- Integración con Supabase: `lib/supabaseClient.js` (Rellena variables de entorno)

Para ejecutar:

1. `npm install`
2. Crear archivo `.env.local` con `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `npm run dev`
