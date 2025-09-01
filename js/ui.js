const modalContainer = document.getElementById('modal-container');
const modalContent = document.getElementById('modal-content');

export function openModal(content) {
    modalContainer.classList.remove('hidden');
    modalContainer.classList.add('flex');
    modalContent.innerHTML = content;
    setTimeout(() => modalContent.classList.remove('scale-95'), 10);
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

export function closeModal() {
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        modalContainer.classList.add('hidden');
        modalContainer.classList.remove('flex');
        modalContent.innerHTML = '';
    }, 300);
}

export function showConfirmationModal(title, message, onConfirm) {
    const content = `
        <div class="p-6 text-center">
            <div class="flex justify-center mb-4">
                <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <i data-lucide="alert-triangle" class="w-6 h-6 text-red-600"></i>
                </div>
            </div>
            <h3 class="text-lg font-semibold mb-2">${title}</h3>
            <p class="text-sm text-slate-600 mb-6">${message}</p>
            <div class="flex justify-center gap-3">
                <button type="button" class="cancel-btn px-4 py-2 w-24 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">Batal</button>
                <button type="button" id="confirm-action-btn" class="px-4 py-2 w-24 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Hapus</button>
            </div>
        </div>
    `;
    openModal(content);
    document.getElementById('confirm-action-btn').onclick = onConfirm;
}

export function showSuccessToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}