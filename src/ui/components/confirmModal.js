import { Modal } from './Modal.js';

export async function confirmModal(message, options = {}) {
  return new Promise((resolve) => {
    const body = document.createElement('div');
    body.className = "p-4";
    body.innerHTML = `
      <p class="mb-4">${message}</p>
      <div class="flex gap-4 justify-end">
        <button data-cancel class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
          ${options.cancelText || 'Annuler'}
        </button>
        <button data-confirm class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
          ${options.confirmText || 'Confirmer'}
        </button>
      </div>
    `;

    const modal = new Modal(options.title || 'Confirmation', body);
    modal.open();

    const cleanup = () => {
      body.querySelector('[data-cancel]').removeEventListener('click', onCancel);
      body.querySelector('[data-confirm]').removeEventListener('click', onConfirm);
      modal.close();
    };

    const onCancel = () => {
      cleanup();
      resolve(false);
    };

    const onConfirm = () => {
      cleanup();
      resolve(true);
    };

    body.querySelector('[data-cancel]').addEventListener('click', onCancel);
    body.querySelector('[data-confirm]').addEventListener('click', onConfirm);
  });
}