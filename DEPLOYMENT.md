# Guía de Despliegue - EcoManager

Esta guía te ayudará a desplegar EcoManager en Vercel con Supabase como backend.

## 📋 Prerrequisitos

- Cuenta de GitHub
- Cuenta de Vercel
- Proyecto de Supabase configurado
- Node.js 18+ instalado localmente

## 🚀 Despliegue Paso a Paso

### 1. Preparar el Repositorio

1. **Subir código a GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit: EcoManager waste management system"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/ecomanager-waste-management.git
   git push -u origin main
   \`\`\`

### 2. Configurar Supabase

1. **Crear proyecto en Supabase**
   - Ve a [supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Anota la URL del proyecto y las API keys

2. **Ejecutar migraciones de base de datos**
   
   En el SQL Editor de Supabase, ejecuta los scripts en este orden:
   \`\`\`sql
   -- 1. scripts/001_create_profiles.sql
   -- 2. scripts/002_create_waste_categories.sql
   -- 3. scripts/003_create_waste_records.sql
   -- 4. scripts/004_create_collection_routes.sql
   -- 5. scripts/005_create_reports.sql
   -- 6. scripts/006_create_profile_trigger.sql
   -- 7. scripts/007_create_indexes.sql
   \`\`\`

3. **Configurar autenticación**
   - Ve a Authentication > Settings
   - Habilita "Enable email confirmations"
   - Configura el Site URL: `https://tu-dominio.vercel.app`
   - Añade redirect URLs:
     - `https://tu-dominio.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback` (para desarrollo)

### 3. Desplegar en Vercel

1. **Importar proyecto**
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en "New Project"
   - Importa tu repositorio de GitHub
   - Selecciona el framework: Next.js

2. **Configurar variables de entorno**
   
   En la configuración del proyecto en Vercel, añade estas variables:

   **Variables requeridas:**
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
   NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
   \`\`\`

   **Variables de base de datos (automáticas con integración Supabase):**
   \`\`\`
   POSTGRES_URL=postgresql://...
   POSTGRES_PRISMA_URL=postgresql://...
   POSTGRES_URL_NON_POOLING=postgresql://...
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=tu_password
   POSTGRES_DATABASE=postgres
   POSTGRES_HOST=db.tu-proyecto.supabase.co
   \`\`\`

3. **Configurar dominio personalizado (opcional)**
   - Ve a Settings > Domains
   - Añade tu dominio personalizado
   - Actualiza `NEXT_PUBLIC_SITE_URL` con tu nuevo dominio

### 4. Integración Supabase-Vercel (Recomendado)

1. **Conectar integración**
   - En el dashboard de Vercel, ve a Integrations
   - Busca e instala "Supabase"
   - Conecta tu proyecto de Supabase
   - Esto configurará automáticamente las variables de entorno

2. **Verificar configuración**
   - Las variables de entorno se configurarán automáticamente
   - Los deployments se activarán automáticamente con cambios en GitHub

### 5. Verificar Despliegue

1. **Probar funcionalidades**
   - Registro de usuarios
   - Inicio de sesión
   - Creación de registros de residuos
   - Dashboard y reportes

2. **Verificar base de datos**
   - Confirma que las tablas se crearon correctamente
   - Verifica que RLS está habilitado
   - Prueba las políticas de seguridad

## 🔧 Configuración Avanzada

### Variables de Entorno por Ambiente

**Desarrollo (.env.local):**
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
\`\`\`

**Producción (Vercel):**
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
\`\`\`

### Configuración de Seguridad

1. **Headers de seguridad** (ya configurados en vercel.json)
   - X-Content-Type-Options
   - X-Frame-Options
   - X-XSS-Protection
   - Referrer-Policy

2. **Políticas RLS**
   - Todas las tablas tienen RLS habilitado
   - Los usuarios solo pueden acceder a sus propios datos
   - Los roles admin/técnico tienen permisos extendidos

### Monitoreo y Analytics

1. **Vercel Analytics** (ya incluido)
   - Métricas de rendimiento automáticas
   - Análisis de usuarios y páginas

2. **Supabase Analytics**
   - Monitoreo de base de datos
   - Métricas de autenticación
   - Logs de API

## 🚨 Solución de Problemas

### Error: "Invalid JWT"
- Verifica que las variables de entorno estén correctas
- Confirma que el middleware está configurado correctamente

### Error: "Row Level Security"
- Verifica que las políticas RLS estén creadas
- Confirma que el usuario está autenticado

### Error de Build
- Verifica que todas las dependencias estén instaladas
- Confirma que TypeScript no tenga errores

### Error de Autenticación
- Verifica la configuración de redirect URLs en Supabase
- Confirma que el Site URL esté configurado correctamente

## 📞 Soporte

Si encuentras problemas durante el despliegue:

1. Revisa los logs en Vercel Dashboard
2. Verifica la configuración en Supabase Dashboard
3. Consulta la documentación oficial:
   - [Vercel Docs](https://vercel.com/docs)
   - [Supabase Docs](https://supabase.com/docs)
   - [Next.js Docs](https://nextjs.org/docs)

## ✅ Checklist de Despliegue

- [ ] Código subido a GitHub
- [ ] Proyecto creado en Supabase
- [ ] Scripts SQL ejecutados
- [ ] Autenticación configurada en Supabase
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Dominio configurado (opcional)
- [ ] Integración Supabase-Vercel activada
- [ ] Funcionalidades probadas
- [ ] Monitoreo configurado

¡Tu aplicación EcoManager está lista para gestionar residuos de manera profesional! 🌱
