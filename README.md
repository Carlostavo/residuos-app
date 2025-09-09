Plataforma Residuos — Proyecto completo (ZIP con todos los archivos)

Instrucciones rápidas:
1. Copia `.env.local.example` a `.env.local` y pon tus valores de Supabase.
2. Ejecuta en la raíz: `npm install`
3. Inicia en modo desarrollo: `npm run dev`
4. Crea el bucket público `images` en Supabase Storage.
5. Ejecuta `sql/all_tables_with_history_pages.sql` en el SQL editor de Supabase.

Notas:
- El editor está disponible para usuarios con role `admin` en la tabla `profiles`.
- Las imágenes subidas se guardan en `images/` dentro del bucket público y se muestran con la URL pública.
