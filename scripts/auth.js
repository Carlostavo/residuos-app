// Sistema de autenticación y gestión de roles
const AuthService = {
  currentUser: null,
  isAuthenticated: false,
  isEditMode: false,

  // Definición de usuarios y roles
  users: {
    admin: { password: "1234", role: "admin", name: "Administrador" },
    tecnico: { password: "1234", role: "tecnico", name: "Técnico" },
    viewer: { password: "1234", role: "viewer", name: "Visitante" }
  },

  // Iniciar sesión
  login: function(username, password) {
    const user = this.users[username];
    
    if (user && user.password === password) {
      this.currentUser = user;
      this.isAuthenticated = true;
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Actualizar UI según el rol
      this.updateUIForRole();
      
      Utils.showNotification(`Bienvenido ${user.name}`, 'success');
      return true;
    }
    
    Utils.showNotification('Credenciales incorrectas', 'error');
    return false;
  },

  // Cerrar sesión
  logout: function() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.isEditMode = false;
    localStorage.removeItem('currentUser');
    
    // Restaurar UI a estado de visitante
    this.updateUIForRole();
    
    Utils.showNotification('Sesión cerrada', 'info');
  },

  // Verificar autenticación al cargar la página
  checkAuth: function() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.isAuthenticated = true;
      this.updateUIForRole();
    }
  },

  // Actualizar UI según el rol del usuario
  updateUIForRole: function() {
    const role = this.currentUser ? this.currentUser.role : 'viewer';
    
    // Mostrar/ocultar elementos según el rol
    document.getElementById('open-auth').style.display = this.isAuthenticated ? 'none' : 'block';
    document.getElementById('logout-btn').style.display = this.isAuthenticated ? 'block' : 'none';
    document.getElementById('toggle-edit').style.display = (role === 'admin' || role === 'tecnico') ? 'block' : 'none';
    document.getElementById('whoami').style.display = this.isAuthenticated ? 'inline' : 'none';
    
    if (this.isAuthenticated) {
      document.getElementById('whoami').textContent = `Hola, ${this.currentUser.name}`;
    }
    
    // Activar/desactivar páginas según permisos
    this.updatePageAccess(role);
    
    // Actualizar estado del editor
    this.toggleEditMode(this.isEditMode);
  },

  // Actualizar acceso a páginas según el rol
  updatePageAccess: function(role) {
    const pages = {
      'metas': ['admin', 'tecnico', 'viewer'],
      'avances': ['admin', 'tecnico'],
      'reportes': ['admin'],
      'formularios': ['admin', 'tecnico', 'viewer']
    };
    
    // Habilitar/deshabilitar enlaces de navegación
    for (const [page, allowedRoles] of Object.entries(pages)) {
      const link = document.querySelector(`[data-page="${page}"]`);
      const card = document.querySelector(`.card.${page}`);
      
      if (link) {
        if (allowedRoles.includes(role)) {
          link.classList.remove('disabled');
          if (card) card.classList.remove('disabled');
        } else {
          link.classList.add('disabled');
          if (card) card.classList.add('disabled');
        }
      }
    }
  },

  // Alternar modo edición
  toggleEditMode: function(forceState = null) {
    if (forceState !== null) {
      this.isEditMode = forceState;
    } else {
      this.isEditMode = !this.isEditMode;
    }
    
    // Solo permitir edición a admin y tecnico
    if ((this.currentUser?.role === 'admin' || this.currentUser?.role === 'tecnico') && this.isEditMode) {
      document.getElementById('toggle-edit').classList.add('active');
      document.querySelector('.sidebar').classList.add('active');
      document.querySelector('.wrap').classList.add('edit-active');
      document.getElementById('canvas').classList.add('editing');
      document.getElementById('canvas-toolbar').classList.add('active');
      
      // Activar eventos de edición
      Editor.initEditingEvents();
      
      Utils.showNotification('Modo edición activado', 'success');
    } else {
      this.isEditMode = false;
      document.getElementById('toggle-edit').classList.remove('active');
      document.querySelector('.sidebar').classList.remove('active');
      document.querySelector('.wrap').classList.remove('edit-active');
      document.getElementById('canvas').classList.remove('editing');
      document.getElementById('canvas-toolbar').classList.remove('active');
      
      // Desactivar eventos de edición
      Editor.removeEditingEvents();
      
      Utils.showNotification('Modo edición desactivado', 'info');
    }
  }
};

// Inicializar autenticación cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  AuthService.checkAuth();
  
  // Event listeners para autenticación
  document.getElementById('open-auth').addEventListener('click', function() {
    document.getElementById('auth').style.display = 'flex';
  });
  
  document.getElementById('auth-close').addEventListener('click', function() {
    document.getElementById('auth').style.display = 'none';
  });
  
  document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('auth').style.display = 'none';
  });
  
  document.getElementById('btn-login').addEventListener('click', function() {
    const username = document.getElementById('login-user').value;
    const password = document.getElementById('login-pass').value;
    
    if (AuthService.login(username, password)) {
      document.getElementById('auth').style.display = 'none';
      document.getElementById('login-user').value = '';
      document.getElementById('login-pass').value = '';
    }
  });
  
  document.getElementById('logout-btn').addEventListener('click', function() {
    AuthService.logout();
  });
  
  document.getElementById('toggle-edit').addEventListener('click', function() {
    AuthService.toggleEditMode();
  });
  
  // Cerrar modal al hacer clic fuera
  document.getElementById('auth').addEventListener('click', function(e) {
    if (e.target === this) {
      this.style.display = 'none';
    }
  });
});