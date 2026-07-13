// js/ui.js
// هذا الملف مسؤول عن الواجهة (UI) وتحديث عناصر الشاشة (DOM)

export const UI = {
    elements: {
        appContainer: document.getElementById('app')
    },

    // دالة ديناميكية لتحميل محتوى الصفحات من مجلد pages
    async loadPages() {
        const pagesToLoad = ['home', 'profile', 'searching'];
        
        for (const page of pagesToLoad) {
            try {
                const response = await fetch(`pages/${page}.html`);
                if (response.ok) {
                    const html = await response.text();
                    document.getElementById(`page-${page}`).innerHTML = html;
                } else {
                    console.error(`فشل تحميل صفحة: ${page}`);
                }
            } catch (error) {
                console.error(`خطأ في جلب صفحة ${page}:`, error);
            }
        }
        
        // تفعيل مكتبة الأيقونات بعد تحميل محتوى الصفحات
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    },

    // دالة التنقل بين الصفحات (SPA Navigation)
    switchPage(pageId) {
        // 1. إخفاء كل الصفحات وإظهار المطلوبة
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // 2. تحديث ألوان أيقونات الشريط السفلي
        const navButtons = document.querySelectorAll('#bottomNav .nav-btn');
        if (navButtons.length > 0) {
            navButtons.forEach(btn => {
                btn.classList.remove('text-blue-600');
                btn.classList.add('text-gray-400');
                
                if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(pageId)) {
                    btn.classList.remove('text-gray-400');
                    btn.classList.add('text-blue-600');
                }
            });
        }

        // 3. إخفاء الشريط السفلي في شاشة "البحث عن كابتن" لإعطاء مساحة كاملة
        const bottomNav = document.getElementById('bottomNav');
        if (bottomNav) {
            if (pageId === 'searching') {
                bottomNav.classList.add('translate-y-full');
            } else {
                bottomNav.classList.remove('translate-y-full');
            }
        }
    },

    toggleVisibility(element, show) {
        if (!element) return;
        if (show) {
            element.classList.remove('hidden');
            element.classList.add('flex');
        } else {
            element.classList.add('hidden');
            element.classList.remove('flex');
        }
    }
};
