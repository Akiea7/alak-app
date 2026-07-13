// js/ui.js
// هذا الملف مسؤول عن الواجهة (UI) وتحديث عناصر الشاشة (DOM) فقط

export const UI = {
    // تجميع عناصر DOM (لتسريع الأداء وتقليل البحث بالصفحة)
    elements: {
        appContainer: document.getElementById('app'),
        // مستقبلاً راح نضيف هنا عناصر الخريطة والأزرار الثابتة
    },

    // دالة التنقل بين الصفحات (SPA Navigation)
    switchPage(pageId) {
        // إخفاء كل الصفحات
        const allPages = document.querySelectorAll('.page');
        allPages.forEach(page => page.classList.remove('active'));
        
        // إظهار الصفحة المطلوبة
        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            console.error(`عذراً، الصفحة المطلوبة غير موجودة: ${pageId}`);
        }
    },

    // دالة مساعدة لإظهار أو إخفاء أي عنصر بسهولة
    toggleVisibility(element, show) {
        if (!element) return;
        if (show) {
            element.classList.remove('hidden');
            element.classList.add('flex'); // أو block حسب التصميم
        } else {
            element.classList.add('hidden');
            element.classList.remove('flex');
        }
    }
};
