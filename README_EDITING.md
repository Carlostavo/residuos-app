INSTRUCCIONES DE EDICIÓN INLINE

- La pluma en el Header ahora emite un evento global "toggle-edit".
- Las páginas (inicio, avances, formularios, indicadores, metas, reportes) escuchan ese evento y alternan el modo edición.
- Para editar: inicia sesión (botón Iniciar sesión en el Header) -> luego presiona la pluma o el botón Editar en cada página.
- Los cambios se guardan en localStorage (clave ejemplo: contenido_inicio). Si quieres persistir en Supabase, indícamelo y lo implemento.
- Si quieres probar sin la pluma, cada página tiene su propio botón "✏️ Editar" cuando estás logueado.
