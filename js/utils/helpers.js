// js/utils/helpers.js
// يحتوي هذا الملف على دالة الإشعارات الأصلية الخاصة بك

export function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto animate-slide-up';
    
    const bgColor = type === 'error' ? 'from-red-500/90 to-red-600/90' : 'from-emerald-500/90 to-emerald-600/90';
    const icon = type === 'error' 
        ? '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>'
        : '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>';
    
    toast.innerHTML = `
        <div class="glass-strong rounded-2xl px-5 py-3 flex items-center gap-3 min-w-[280px] shadow-2xl border border-white/10">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br ${bgColor} flex items-center justify-center flex-shrink-0 shadow-inner">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">${icon}</svg>
            </div>
            <span class="font-bold text-sm text-white">${message}</span>
        </div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
