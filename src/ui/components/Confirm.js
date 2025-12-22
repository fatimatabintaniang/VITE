import { Modal } from './Modal.js';
export function confirm(msg) {
  return new Promise(res => {
    const body = document.createElement('div');
    body.className = "p-1";
    body.innerHTML = `
      <div class="flex items-start gap-4">
        <div class="mt-0.5 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p class="text-gray-700 flex-1">${msg}</p>
      </div>
      
      <div class="flex gap-3 justify-end mt-6">
        <button data-no class="px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
          Annuler
        </button>
        <button data-yes class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-red-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Confirmer
        </button>
      </div>
    `;
    
    const dlg = new Modal('', body, {
      className: "max-w-md bg-white rounded-2xl shadow-xl overflow-hidden",
      header: `
        <div class="px-6 py-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
          <h2 class="text-xl font-bold text-red-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Confirmation requise
          </h2>
        </div>
      `
    });
    
    dlg.open();
    
    body.querySelector('[data-no]').onclick = () => {
      dlg.close();
      res(false);
    };
    
    body.querySelector('[data-yes]').onclick = () => {
      // Animation de confirmation
      const confirmBtn = body.querySelector('[data-yes]');
      confirmBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 mr-1.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Confirmation...
      `;
      confirmBtn.disabled = true;
      
      setTimeout(() => {
        dlg.close();
        res(true);
      }, 500);
    };
  });
}
