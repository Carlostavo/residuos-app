// Utilidades generales para la aplicación
const Utils = {
  // Generar ID único
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  },

  // Formatear fecha
  formatDate: (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  },

  // Sanitizar HTML para prevenir XSS
  sanitizeHTML: (html) => {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
  },

  // Validar si es una URL válida
  isValidURL: (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  },

  // Extraer ID de YouTube
  extractYouTubeId: (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  },

  // Mostrar notificación
  showNotification: (message, type = 'info') => {
    // Eliminar notificación existente si hay una
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
    `;
    
    if (type === 'success') {
      notification.style.background = '#22c55e';
    } else if (type === 'error') {
      notification.style.background = '#ef4444';
    } else if (type === 'warning') {
      notification.style.background = '#f59e0b';
    } else {
      notification.style.background = '#3b82f6';
    }
    
    notification.querySelector('button').style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      margin: 0;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  },

  // Confirmación de acción
  confirmAction: (message) => {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      `;
      
      const modal = document.createElement('div');
      modal.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 12px;
        max-width: 400px;
        width: 90%;
        text-align: center;
      `;
      
      modal.innerHTML = `
        <h3 style="margin-top: 0;">Confirmar</h3>
        <p>${message}</p>
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
          <button id="confirm-cancel" style="padding: 8px 16px; border: 1px solid #ccc; background: white; border-radius: 6px; cursor: pointer;">Cancelar</button>
          <button id="confirm-ok" style="padding: 8px 16px; border: none; background: #ef4444; color: white; border-radius: 6px; cursor: pointer;">Aceptar</button>
        </div>
      `;
      
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      
      document.getElementById('confirm-cancel').addEventListener('click', () => {
        document.body.removeChild(overlay);
        resolve(false);
      });
      
      document.getElementById('confirm-ok').addEventListener('click', () => {
        document.body.removeChild(overlay);
        resolve(true);
      });
    });
  }
};

// Añadir estilos para la animación de notificación
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(style);