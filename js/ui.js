// js/ui.js
import { Storage } from './core/storage.js';
import { CONFIG } from './core/config.js';

export const UI = {
    async switchPage(pageId, addToHistory = true) {
        let folder = 'pages'; let fileName = pageId; let navId = pageId;

        if (pageId === 'services') { folder = 'services'; fileName = 'menu'; } 
        else if (pageId === 'market') { folder = 'services'; fileName = 'market'; navId = 'services'; } 
        else if (pageId === 'shop') { folder = 'services'; fileName = 'shop'; navId = 'services'; }

        if (addToHistory) { history.pushState({ page: pageId }, '', `#${pageId}`); }

        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-page="${navId}"]`);
        if (activeNav) activeNav.classList.add('active');
        
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const container = document.getElementById('page-' + pageId);
        if (container) container.classList.add('active');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (container && container.innerHTML.trim() === '') {
            container.innerHTML = '<div class="flex justify-center mt-32"><div class="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin"></div></div>';
            try {
                const url = `/${folder}/${fileName}.html?t=${new Date().getTime()}`;
                const response = await fetch(url);
                if (!response.ok) throw new Error('Not found');
                const html = await response.text();
                container.innerHTML = html;
                if (typeof lucide !== 'undefined') lucide.createIcons();
                
                if (pageId === 'profile') setTimeout(window.renderProfileData, 50); 
                if (pageId === 'store-dashboard') setTimeout(window.renderStoreData, 50);
            } catch (error) {
                container.innerHTML = '<div class="text-center text-red-400 mt-20 font-bold">عذراً، حدث خطأ في تحميل الصفحة. يرجى التحديث.</div>';
            }
        } else {
            if (pageId === 'profile') window.renderProfileData();
            if (pageId === 'store-dashboard') window.renderStoreData();
        }
    },

    toggleMenu() {
        const drawer = document.getElementById('menuDrawer');
        const overlay = document.getElementById('menuOverlay');
        if (drawer.classList.contains('translate-x-full')) {
            drawer.classList.remove('translate-x-full'); overlay.classList.remove('hidden'); document.body.classList.add('pause-animations');
        } else {
            drawer.classList.add('translate-x-full'); overlay.classList.add('hidden'); document.body.classList.remove('pause-animations');
        }
    },

    scrollToBooking() {
        const section = document.getElementById('bookingSection');
        if (section) { section.scrollIntoView({ behavior: 'smooth', block: 'center' }); } 
        else {
            setTimeout(() => {
                const retrySection = document.getElementById('bookingSection');
                if(retrySection) retrySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    },

    toggleTheme() {
        const body = document.body;
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        Storage.saveTheme(isLight ? 'light' : 'dark');
        
        if (typeof map !== 'undefined' && map) {
            map.setOptions({ styles: isLight ? [] : CONFIG.DARK_MAP_STYLE });
        }
        window.showToast(isLight ? 'تم تفعيل المظهر الفاتح ☀️' : 'تم تفعيل المظهر الداكن 🌙');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    initTheme() {
        if (Storage.getTheme() === 'light') { document.body.classList.add('light-mode'); }
    }
};
