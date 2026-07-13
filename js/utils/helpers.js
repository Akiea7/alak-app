// js/utils/helpers.js
// هذا الملف يحتوي على الدوال المساعدة اللي تتكرر هواي بالتطبيق (مثل الإشعارات)

export const Helpers = {
    
    // دالة عرض التنبيهات (Toast) باستخدام createElement (حسب طلب شريكك)
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        
        // تحديد لون التنبيه حسب نوعه
        const bgColor = type === 'success' ? 'bg-emerald-500' : 'bg-red-500';
        
        // تنسيق التنبيه (Tailwind)
        toast.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full text-white text-sm font-bold shadow-lg z-[100] transition-all duration-300 -translate-y-full opacity-0 ${bgColor}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // حركة الظهور والنزول
        setTimeout(() => {
            toast.classList.remove('-translate-y-full', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        }, 10);
        
        // الإخفاء التلقائي بعد 3 ثواني
        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('-translate-y-full', 'opacity-0');
            setTimeout(() => toast.remove(), 300); // حذفه من الـ DOM بالكامل
        }, 3000);
    },

    // دالة لتنسيق الأرقام كعملة (مثلاً تحول 1500 إلى 1,500)
    formatCurrency(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
};

