# Guía de Contribución - EcoManager

¡Gracias por tu interés en contribuir a EcoManager! Esta guía te ayudará a empezar.

## 🚀 Cómo Contribuir

### 1. Fork y Clone

\`\`\`bash
# Fork el repositorio en GitHub, luego:
git clone https://github.com/tu-usuario/ecomanager-waste-management.git
cd ecomanager-waste-management
\`\`\`

### 2. Configurar Entorno de Desarrollo

\`\`\`bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Configurar Supabase local (opcional)
npx supabase init
npx supabase start
\`\`\`

### 3. Crear Rama de Feature

\`\`\`bash
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/descripcion-del-bug
\`\`\`

### 4. Hacer Cambios

- Sigue las convenciones de código existentes
- Añade tests si es necesario
- Actualiza documentación si es relevante

### 5. Commit y Push

\`\`\`bash
git add .
git commit -m "feat: descripción clara del cambio"
git push origin feature/nombre-descriptivo
\`\`\`

### 6. Crear Pull Request

- Describe claramente los cambios
- Incluye screenshots si hay cambios visuales
- Referencia issues relacionados

## 📝 Convenciones de Código

### Commits
Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` cambios en documentación
- `style:` cambios de formato
- `refactor:` refactorización de código
- `test:` añadir o modificar tests
- `chore:` tareas de mantenimiento

### TypeScript
- Usa tipos explícitos cuando sea necesario
- Evita `any`, usa tipos específicos
- Documenta interfaces complejas

### React/Next.js
- Usa componentes funcionales con hooks
- Implementa Server Components cuando sea posible
- Sigue el patrón de composición

### Estilos
- Usa Tailwind CSS para estilos
- Sigue el sistema de design tokens
- Mantén consistencia visual

## 🧪 Testing

\`\`\`bash
# Ejecutar tests
npm run test

# Verificar tipos
npm run type-check

# Linting
npm run lint
\`\`\`

## 📋 Tipos de Contribuciones

### 🐛 Reportar Bugs
- Usa el template de issue para bugs
- Incluye pasos para reproducir
- Añade screenshots si es relevante

### 💡 Sugerir Features
- Usa el template de issue para features
- Explica el caso de uso
- Considera el impacto en usuarios existentes

### 📖 Mejorar Documentación
- Corrige errores tipográficos
- Añade ejemplos claros
- Mejora explicaciones existentes

### 🔧 Contribuciones de Código
- Nuevas funcionalidades
- Corrección de bugs
- Mejoras de rendimiento
- Refactorizaciones

## 🎯 Áreas de Contribución

### Frontend
- Componentes UI/UX
- Páginas y layouts
- Interacciones y animaciones
- Responsive design

### Backend
- API routes
- Integración con Supabase
- Autenticación y autorización
- Optimizaciones de base de datos

### DevOps
- Configuración de deployment
- Scripts de automatización
- Monitoreo y logging
- Optimizaciones de build

### Documentación
- Guías de usuario
- Documentación técnica
- Tutoriales
- Ejemplos de código

## 🔍 Proceso de Review

1. **Automated Checks**: CI/CD ejecuta tests automáticamente
2. **Code Review**: Maintainers revisan el código
3. **Testing**: Se prueba la funcionalidad
4. **Merge**: Se integra a la rama principal

## 📞 Comunicación

- **Issues**: Para bugs y feature requests
- **Discussions**: Para preguntas generales
- **Email**: Para temas sensibles

## 🏆 Reconocimiento

Los contribuidores son reconocidos en:
- README.md
- Release notes
- Contributors page

## 📄 Licencia

Al contribuir, aceptas que tus contribuciones se licencien bajo la misma licencia MIT del proyecto.

---

¡Gracias por hacer EcoManager mejor para todos! 🌱
