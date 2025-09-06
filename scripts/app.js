// Archivo principal que inicializa la aplicación
document.addEventListener('DOMContentLoaded', function() {
  console.log('Aplicación de Gestión de Residuos Sólidos inicializada');
  
  // Inicializar servicios
  AuthService.checkAuth();
  Editor.init();
  
  // Configurar eventos globales
  setupGlobalEvents();
  
  // Configurar manejo de teclado
  setupKeyboardShortcuts();
});

// Configurar eventos globales
function setupGlobalEvents() {
  // Cerrar sesión con el botón
  document.getElementById('logout-btn').addEventListener('click', function() {
    AuthService.logout();
  });
  
  // Guardar con Ctrl+S
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (AuthService.isEditMode) {
        Editor.saveCurrentPage();
      }
    }
  });
  
  // Deseleccionar elemento al hacer clic fuera
  document.getElementById('canvas').addEventListener('click', function(e) {
    if (AuthService.isEditMode && e.target === this) {
      if (Editor.selectedElement) {
        Editor.selectedElement.classList.remove('selected');
        Editor.selectedElement = null;
      }
    }
  });
}

// Configurar atajos de teclado
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Solo en modo edición
    if (!AuthService.isEditMode) return;
    
    // Eliminar elemento seleccionado con Delete
    if (e.key === 'Delete' && Editor.selectedElement) {
      Editor.removeElement();
    }
    
    // Duplicar elemento con Ctrl+D
    if ((e.ctrlKey || e.metaKey) && e.key === 'd' && Editor.selectedElement) {
      e.preventDefault();
      Editor.duplicateElement();
    }
    
    // Deshacer con Ctrl+Z
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      Editor.undo();
    }
    
    // Rehacer con Ctrl+Shift+Z o Ctrl+Y
    if (((e.ctrlKey && e.shiftKey && e.key === 'Z') || 
         ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
      e.preventDefault();
      Editor.redo();
    }
  });
}

// Hacer funciones globales disponibles
window.AuthService = AuthService;
window.Editor = Editor;
window.Utils = Utils;