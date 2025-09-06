// Sistema de edición de contenido
const Editor = {
  selectedElement: null,
  history: [],
  historyIndex: -1,
  
  // Inicializar el editor
  init: function() {
    this.setupEventListeners();
    this.loadHomeContent();
  },
  
  // Configurar event listeners
  setupEventListeners: function() {
    // Navegación entre páginas
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (link.classList.contains('disabled')) return;
        
        const page = link.getAttribute('data-page');
        this.navigateToPage(page);
      });
    });
    
    // Navegación mediante tarjetas
    document.querySelectorAll('.card').forEach(card => {
      if (!card.classList.contains('disabled')) {
        card.addEventListener('click', () => {
          const page = card.classList[1]; // Obtiene la segunda clase (metas, indicadores, etc.)
          this.navigateToPage(page);
        });
      }
    });
    
    // Botones de inserción de elementos
    document.querySelectorAll('.action[data-insert]').forEach(btn => {
      btn.addEventListener('click', () => {
        const elementType = btn.getAttribute('data-insert');
        this.insertElement(elementType);
      });
    });
    
    // Tabs de propiedades
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        this.switchPropertiesTab(tabName);
      });
    });
    
    // Botones de historial
    document.getElementById('undo').addEventListener('click', () => this.undo());
    document.getElementById('redo').addEventListener('click', () => this.redo());
    
    // Botones de manipulación de elementos
    document.getElementById('bring-front').addEventListener('click', () => this.bringToFront());
    document.getElementById('send-back').addEventListener('click', () => this.sendToBack());
    document.getElementById('duplicate').addEventListener('click', () => this.duplicateElement());
    document.getElementById('remove').addEventListener('click', () => this.removeElement());
    
    // Botones flotantes
    document.getElementById('fb-dup').addEventListener('click', () => this.duplicateElement());
    document.getElementById('fb-front').addEventListener('click', () => this.bringToFront());
    document.getElementById('fb-back').addEventListener('click', () => this.sendToBack());
    document.getElementById('fb-del').addEventListener('click', () => this.removeElement());
    
    // Subida de imágenes
    document.getElementById('image-upload').addEventListener('change', (e) => {
      this.handleImageUpload(e.target.files[0]);
    });
    
    // Guardar cambios automáticamente cada 30 segundos
    setInterval(() => {
      if (AuthService.isEditMode && this.history.length > 0) {
        this.saveCurrentPage();
      }
    }, 30000);
  },
  
  // Inicializar eventos de edición (solo en modo edición)
  initEditingEvents: function() {
    console.log("Eventos de edición activados");
  },
  
  // Remover eventos de edición (al salir del modo edición)
  removeEditingEvents: function() {
    console.log("Eventos de edición desactivados");
    
    // Deseleccionar elemento actual
    if (this.selectedElement) {
      this.selectedElement.classList.remove('selected');
      this.selectedElement = null;
    }
  },
  
  // Navegar a una página específica
  navigateToPage: function(pageName) {
    // Actualizar navegación activa
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
    
    // Cargar contenido de la página
    this.loadPageContent(pageName);
  },
  
  // Cargar contenido de la página de inicio
  loadHomeContent: function() {
    const canvas = document.getElementById('canvas');
    canvas.innerHTML = `
      <div class="hero">
        <h1>Sistema de Gestión de Residuos Sólidos</h1>
        <p>Monitorea y gestiona los indicadores, metas y avances de tu programa de residuos sólidos de manera eficiente</p>
        <a href="#" class="hero-button">Comenzar ahora</a>
      </div>
      <div class="cards">
        <div class="card metas">
          <div class="card-icon"><i class="fa-solid fa-bullseye"></i></div>
          <div class="card-content">
            <h3 class="card-title">Metas</h3>
            <p class="card-desc">Establece y sigue el progreso de tus objetivos</p>
          </div>
        </div>
        <div class="card indicadores">
          <div class="card-icon"><i class="fa-solid fa-chart-line"></i></div>
          <div class="card-content">
            <h3 class="card-title">Indicadores</h3>
            <p class="card-desc">Mide el desempeño con KPIs relevantes</p>
          </div>
        </div>
        <div class="card avances">
          <div class="card-icon"><i class="fa-solid fa-tasks"></i></div>
          <div class="card-content">
            <h3 class="card-title">Avances</h3>
            <p class="card-desc">Revisa el progreso de las actividades</p>
          </div>
        </div>
        <div class="card reportes">
          <div class="card-icon"><i class="fa-solid fa-file-pdf"></i></div>
          <div class="card-content">
            <h3 class="card-title">Reportes</h3>
            <p class="card-desc">Genera informes ejecutivos y técnicos</p>
          </div>
        </div>
        <div class="card formularios">
          <div class="card-icon"><i class="fa-solid fa-clipboard-list"></i></div>
          <div class="card-content">
            <h3 class="card-title">Formularios</h3>
            <p class="card-desc">Captura datos en campo de manera eficiente</p>
          </div>
        </div>
      </div>
    `;
    
    // Añadir event listeners a las tarjetas
    document.querySelectorAll('.card').forEach(card => {
      if (!card.classList.contains('disabled')) {
        card.addEventListener('click', () => {
          const page = card.classList[1];
          this.navigateToPage(page);
        });
      }
    });
  },
  
  // Cargar contenido de una página específica
  async loadPageContent(pageName) {
    try {
      // Si estamos en la página de inicio, cargarla directamente
      if (pageName === 'home') {
        this.loadHomeContent();
        return;
      }
      
      // Intentar cargar desde Supabase
      const content = await SupabaseService.loadPageContent(pageName);
      
      if (content) {
        document.getElementById('canvas').innerHTML = content;
        Utils.showNotification(`Página "${pageName}" cargada`, 'success');
      } else {
        // Contenido por defecto para páginas vacías
        const defaultContent = `
          <div style="text-align: center; padding: 60px 20px;">
            <i class="fa-solid fa-inbox" style="font-size: 48px; color: #cbd5e1;"></i>
            <h2 style="color: #64748b;">Página ${pageName}</h2>
            <p>Esta página está vacía. Usa el modo edición para agregar contenido.</p>
          </div>
        `;
        document.getElementById('canvas').innerHTML = defaultContent;
      }
    } catch (error) {
      console.error('Error cargando contenido:', error);
      Utils.showNotification('Error cargando la página', 'error');
    }
  },
  
  // Guardar contenido de la página actual
  async saveCurrentPage() {
    if (!AuthService.isEditMode) return;
    
    const activePage = document.querySelector('.nav-link.active').getAttribute('data-page');
    const content = document.getElementById('canvas').innerHTML;
    
    try {
      await SupabaseService.savePageContent(activePage, content);
      Utils.showNotification('Cambios guardados', 'success');
    } catch (error) {
      console.error('Error guardando contenido:', error);
      Utils.showNotification('Error guardando cambios', 'error');
    }
  },
  
  // Insertar un nuevo elemento en el canvas
  insertElement: function(type) {
    if (!AuthService.isEditMode) return;
    
    const id = Utils.generateId();
    let element;
    
    switch(type) {
      case 'h2':
        element = document.createElement('h2');
        element.className = 'canvas-item canvas-h2';
        element.contentEditable = true;
        element.innerHTML = 'Título';
        break;
      case 'p':
        element = document.createElement('p');
        element.className = 'canvas-item canvas-p';
        element.contentEditable = true;
        element.innerHTML = 'Texto de párrafo...';
        break;
      case 'img':
        element = document.createElement('img');
        element.className = 'canvas-item canvas-img';
        element.src = 'https://via.placeholder.com/300x200?text=Imagen';
        break;
      case 'button':
        element = document.createElement('a');
        element.className = 'canvas-item canvas-button';
        element.href = '#';
        element.innerHTML = 'Botón';
        break;
      case 'iframe':
        element = document.createElement('div');
        element.className = 'canvas-item';
        element.innerHTML = `
          <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                  frameborder="0" allowfullscreen></iframe>
        `;
        break;
      case 'table':
        element = document.createElement('table');
        element.className = 'canvas-item canvas-table';
        element.innerHTML = `
          <tr><th>Encabezado 1</th><th>Encabezado 2</th></tr>
          <tr><td>Dato 1</td><td>Dato 2</td></tr>
          <tr><td>Dato 3</td><td>Dato 4</td></tr>
        `;
        break;
      default:
        return;
    }
    
    // Establecer posición y tamaño por defecto
    element.style.position = 'absolute';
    element.style.left = '50px';
    element.style.top = '50px';
    element.style.width = type === 'img' ? '300px' : '200px';
    element.style.height = type === 'img' ? '200px' : 'auto';
    element.id = id;
    
    // Añadir al canvas
    document.getElementById('canvas').appendChild(element);
    
    // Seleccionar el nuevo elemento
    this.selectElement(element);
    
    // Guardar en historial
    this.saveToHistory();
    
    Utils.showNotification(`Elemento ${type} insertado`, 'success');
  },
  
  // Seleccionar un elemento
  selectElement: function(element) {
    // Deseleccionar elemento actual
    if (this.selectedElement) {
      this.selectedElement.classList.remove('selected');
    }
    
    // Seleccionar nuevo elemento
    this.selectedElement = element;
    element.classList.add('selected');
    
    // Actualizar propiedades en el panel lateral
    this.updatePropertiesPanel();
  },
  
  // Actualizar panel de propiedades con los valores del elemento seleccionado
  updatePropertiesPanel: function() {
    if (!this.selectedElement) return;
    
    // Actualizar propiedades generales
    const rect = this.selectedElement.getBoundingClientRect();
    const canvasRect = document.getElementById('canvas').getBoundingClientRect();
    
    document.getElementById('gen-x').value = parseInt(this.selectedElement.style.left) || 0;
    document.getElementById('gen-y').value = parseInt(this.selectedElement.style.top) || 0;
    document.getElementById('gen-w').value = parseInt(this.selectedElement.style.width) || rect.width;
    document.getElementById('gen-h').value = parseInt(this.selectedElement.style.height) || rect.height;
    document.getElementById('gen-rot').value = 0;
    document.getElementById('gen-z').value = parseInt(this.selectedElement.style.zIndex) || 1;
    document.getElementById('gen-bg').value = '#ffffff';
    document.getElementById('gen-bc').value = '#e2e8f0';
    document.getElementById('gen-bw').value = 0;
    document.getElementById('gen-br').value = 8;
    document.getElementById('gen-pad').value = 8;
    
    // Dependiendo del tipo de elemento, mostrar las propiedades correspondientes
    if (this.selectedElement.tagName === 'H2' || this.selectedElement.tagName === 'P') {
      this.switchPropertiesTab('texto');
      document.getElementById('txt-content').value = this.selectedElement.innerHTML;
    } else if (this.selectedElement.tagName === 'IMG') {
      this.switchPropertiesTab('imagen');
      document.getElementById('img-src').value = this.selectedElement.src;
    }
    // ... más casos para otros tipos de elementos
  },
  
  // Cambiar pestaña de propiedades
  switchPropertiesTab: function(tabName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });
    
    // Desactivar todas las pestañas
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // Activar la pestaña y sección seleccionadas
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`sec-${tabName}`).classList.add('active');
  },
  
  // Guardar estado actual en el historial
  saveToHistory: function() {
    const canvasHTML = document.getElementById('canvas').innerHTML;
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(canvasHTML);
    this.historyIndex = this.history.length - 1;
  },
  
  // Deshacer acción
  undo: function() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      document.getElementById('canvas').innerHTML = this.history[this.historyIndex];
      Utils.showNotification('Deshacer', 'info');
    }
  },
  
  // Rehacer acción
  redo: function() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      document.getElementById('canvas').innerHTML = this.history[this.historyIndex];
      Utils.showNotification('Rehacer', 'info');
    }
  },
  
  // Traer elemento al frente
  bringToFront: function() {
    if (!this.selectedElement) return;
    
    const maxZ = Math.max(...Array.from(document.querySelectorAll('.canvas-item'))
      .map(el => parseInt(el.style.zIndex) || 1));
    
    this.selectedElement.style.zIndex = maxZ + 1;
    this.saveToHistory();
    Utils.showNotification('Elemento traído al frente', 'info');
  },
  
  // Enviar elemento al fondo
  sendToBack: function() {
    if (!this.selectedElement) return;
    
    this.selectedElement.style.zIndex = 0;
    this.saveToHistory();
    Utils.showNotification('Elemento enviado al fondo', 'info');
  },
  
  // Duplicar elemento
  duplicateElement: function() {
    if (!this.selectedElement) return;
    
    const clone = this.selectedElement.cloneNode(true);
    clone.id = Utils.generateId();
    clone.style.left = (parseInt(this.selectedElement.style.left) || 0) + 20 + 'px';
    clone.style.top = (parseInt(this.selectedElement.style.top) || 0) + 20 + 'px';
    
    document.getElementById('canvas').appendChild(clone);
    this.selectElement(clone);
    this.saveToHistory();
    
    Utils.showNotification('Elemento duplicado', 'success');
  },
  
  // Eliminar elemento
  async removeElement: function() {
    if (!this.selectedElement) return;
    
    const confirmed = await Utils.confirmAction('¿Estás seguro de que quieres eliminar este elemento?');
    if (!confirmed) return;
    
    this.selectedElement.remove();
    this.selectedElement = null;
    this.saveToHistory();
    
    Utils.showNotification('Elemento eliminado', 'success');
  },
  
  // Manejar subida de imagen
  handleImageUpload: function(file) {
    if (!file || !file.type.match('image.*')) {
      Utils.showNotification('Por favor selecciona una imagen válida', 'error');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (this.selectedElement && this.selectedElement.tagName === 'IMG') {
        this.selectedElement.src = e.target.result;
        document.getElementById('img-src').value = e.target.result;
        this.saveToHistory();
        Utils.showNotification('Imagen actualizada', 'success');
      }
    };
    reader.readAsDataURL(file);
  }
};

// Inicializar editor cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  Editor.init();
});