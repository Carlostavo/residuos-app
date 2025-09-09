Plataforma Residuos - Final Complete

Instrucciones:
1. Ejecuta sql/all_tables_with_history_pages.sql en Supabase SQL Editor.
2. Crea un bucket público llamado 'images' en Supabase Storage.
3. Añade variables de entorno en .env.local o en Vercel:
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Instala dependencias: npm install
5. Ejecuta: npm run dev

Características:
- Canvas full-screen adaptado al viewport (modo visitante) y modo edición (admin) con panel izquierdo.
- Subida de imágenes a Supabase Storage (bucket público 'images').
- Fuentes adicionales disponibles en panel de propiedades.
