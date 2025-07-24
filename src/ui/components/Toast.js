export class Toast {
  static show(message, type = 'info', duration = 3000) {
    const container = this.getOrCreateContainer();
    const toast = this.createToast(message, type);
    
    container.appendChild(toast);
    
    // Force le recalcul des styles pour déclencher l'animation
    void toast.offsetWidth;
    
    toast.style.transform = 'translateX(0)';
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) {
          container.remove();
        }
      }, 500);
    }, duration);
  }

  static getOrCreateContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  static createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="${this.getIconClass(type)}"></i>
      <span>${message}</span>
    `;
    return toast;
  }

  static getIconClass(type) {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      info: 'fas fa-info-circle',
      warning: 'fas fa-exclamation-triangle'
    };
    return icons[type] || icons.info;
  }
}