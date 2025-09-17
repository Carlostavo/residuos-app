# Residuos Next.js (Scaffold)
Proyecto generado automáticamente que migra el HTML original a Next.js.
Rutas incluidas:
- / (Inicio)
- /indicadores
- /reportes
- /formularios
- /metas
- /avances
- /editor (Edición avanzada — sólo visible para roles 'admin' y 'tecnico')

Cómo usar:
1. Instala dependencias: `npm install`
2. Configura `.env.local` con tus credenciales de Supabase.
3. Levanta el proyecto: `npm run dev`

NOTAS:
- Los enlaces y el botón de edición sólo aparecen si el usuario autenticado tiene rol 'admin' o 'tecnico'.
- Asegúrate de crear las tablas `paginas` y `user_roles` en Supabase y asignar roles a los usuarios.
