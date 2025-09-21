# residuos-editor (scaffold)

Proyecto scaffold con modo edición para Next.js + Supabase.

## Estructura importante
- /pages: páginas Next.js (index, metas, avances, reportes, _app)
- /components: Header, EditorContext, EditableCard, EditorPanel
- /lib: supabaseClient.js, useAuth.js
- package.json: incluye react-rnd y @supabase/supabase-js

## Cómo usar
1. Copia este repo a tu máquina.
2. Instala dependencias: `npm install` (o `yarn`)
3. Crea un proyecto en Supabase y añade las variables de entorno en `.env.local`:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Crea la tabla `elements` (ejemplo SQL en README_SQL.txt)
5. Corre en desarrollo: `npm run dev`

## Nota
- Este scaffold está pensado para integrarse en tu proyecto actual. Revisa `lib/supabaseClient.js` para configurar.
- Opciones avanzadas (editor rico TipTap, historial, bloqueo de edición simultánea) no se incluyeron por simplicidad.
