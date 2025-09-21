# EcoManager - Sistema de Gestión de Residuos

Una aplicación web profesional para la gestión inteligente de residuos, construida con Next.js 15, Supabase y TypeScript.

## 🌟 Características

- **Autenticación Segura**: Sistema completo de registro e inicio de sesión con Supabase Auth
- **Gestión de Roles**: Tres niveles de usuario (Admin, Técnico, Usuario)
- **Registro de Residuos**: Categorización y seguimiento detallado de residuos
- **Rutas de Recolección**: Planificación y optimización de rutas
- **Análisis y Reportes**: Dashboard con métricas y visualizaciones
- **Responsive Design**: Interfaz adaptable a todos los dispositivos
- **Seguridad RLS**: Row Level Security para protección de datos

## 🚀 Tecnologías

- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI**: Tailwind CSS, shadcn/ui
- **Deployment**: Vercel

## 📋 Prerrequisitos

- Node.js 18+ 
- Cuenta de Supabase
- Cuenta de Vercel (para deployment)

## 🛠️ Instalación

1. **Clonar el repositorio**
   \`\`\`bash
   git clone <repository-url>
   cd waste-management-app
   \`\`\`

2. **Instalar dependencias**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configurar variables de entorno**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Completar las variables en `.env.local` con los valores de tu proyecto Supabase.

4. **Ejecutar migraciones de base de datos**
   
   Ejecuta los scripts SQL en el siguiente orden en tu editor SQL de Supabase:
   - `scripts/001_create_profiles.sql`
   - `scripts/002_create_waste_categories.sql`
   - `scripts/003_create_waste_records.sql`
   - `scripts/004_create_collection_routes.sql`
   - `scripts/005_create_reports.sql`
   - `scripts/006_create_profile_trigger.sql`
   - `scripts/007_create_indexes.sql`

5. **Ejecutar en desarrollo**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🗄️ Esquema de Base de Datos

### Tablas Principales

#### `profiles`
- Información extendida de usuarios
- Roles: admin, tecnico, viewer
- Referencia a `auth.users`

#### `waste_categories`
- Categorías de residuos (Orgánico, Reciclable, Peligroso, etc.)
- Colores e iconos personalizables

#### `waste_records`
- Registros individuales de residuos
- Peso, ubicación, estado, imágenes
- Relación con categorías y usuarios

#### `collection_routes`
- Rutas de recolección programadas
- Asignación a técnicos
- Horarios y días de la semana

#### `reports`
- Reportes generados por usuarios
- Datos en formato JSON
- Diferentes tipos de análisis

### Políticas RLS

Todas las tablas implementan Row Level Security:
- Los usuarios solo pueden ver/editar sus propios datos
- Los técnicos pueden gestionar registros de residuos
- Los administradores tienen acceso completo

## 🔐 Roles de Usuario

### Viewer (Usuario)
- Crear y gestionar sus propios registros de residuos
- Ver reportes personales
- Acceso al dashboard básico

### Técnico
- Todas las funciones de Usuario
- Ver y actualizar todos los registros de residuos
- Gestionar rutas de recolección
- Acceso a reportes globales

### Admin (Administrador)
- Acceso completo al sistema
- Gestión de usuarios y roles
- Configuración de categorías
- Reportes y análisis avanzados

## 🚀 Deployment en Vercel

1. **Conectar repositorio**
   - Importa el proyecto desde GitHub en Vercel
   - Configura las variables de entorno en el dashboard de Vercel

2. **Variables de entorno requeridas**
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   POSTGRES_URL
   POSTGRES_PRISMA_URL
   POSTGRES_URL_NON_POOLING
   POSTGRES_USER
   POSTGRES_PASSWORD
   POSTGRES_DATABASE
   POSTGRES_HOST
   NEXT_PUBLIC_SITE_URL
   \`\`\`

3. **Deploy**
   - Vercel detectará automáticamente Next.js
   - El deployment se ejecutará automáticamente

## 📱 Uso de la Aplicación

### Registro de Usuario
1. Accede a `/auth/register`
2. Completa el formulario con email, contraseña y rol
3. Confirma tu email
4. Inicia sesión en `/auth/login`

### Gestión de Residuos
1. Desde el dashboard, haz clic en "Nuevo Registro"
2. Selecciona la categoría de residuo
3. Ingresa peso, ubicación y descripción
4. Opcionalmente, sube una imagen
5. El registro queda pendiente para recolección

### Reportes y Análisis
- Dashboard con estadísticas en tiempo real
- Gráficos de distribución por categoría
- Historial de registros recientes
- Métricas de impacto ambiental

## 🔧 Desarrollo

### Estructura del Proyecto
\`\`\`
├── app/                    # App Router de Next.js
│   ├── auth/              # Páginas de autenticación
│   ├── dashboard/         # Dashboard principal
│   └── layout.tsx         # Layout raíz
├── components/            # Componentes reutilizables
│   ├── auth/             # Componentes de autenticación
│   ├── dashboard/        # Componentes del dashboard
│   └── ui/               # Componentes UI (shadcn)
├── lib/                  # Utilidades y configuración
│   └── supabase/         # Clientes de Supabase
├── scripts/              # Scripts SQL de migración
└── middleware.ts         # Middleware de autenticación
\`\`\`

### Comandos Útiles
\`\`\`bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting
npm run type-check   # Verificación de tipos
\`\`\`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

---

Desarrollado con ❤️ para un futuro más sostenible
\`\`\`

```json file="" isHidden
