// js/main.js
import './utils/helpers.js';
import { UI } from './ui.js';
import { Auth } from './features/auth.js';
import { Storage } from './core/storage.js';
import './events.js'; // استدعاء الأحداث لربطها بالواجهة

// تهيئة الثيم فور تحميل الصفحة
window.addEventListener('DOMContentLoaded', UI.initTheme);

// شاشة التحميل (Splash Screen) والتشغيل
window.addEventListener('load', () => {
    const progress = document.getElementById('splashProgress');
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 15;
        if (width >= 100) {
            width = 100;
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('splash').style.display = 'none';
                document.getElementById('app').style.opacity = '1';
                
                const user = Auth.checkLoginState();
                if (!user) {
                    window.switchPage('login'); 
                } else {
                    window.switchPage('home');
                }
                
                // جلب الوضع المحفوظ (زبون/كابتن)
                setTimeout(() => {
                    const savedMode = Storage.getAppMode();
                    window.applyAppMode(savedMode);
                }, 100);

            }, 500);
        }
        progress.style.width = width + '%';
    }, 100);
});

// مراقبة الاتصال بالإنترنت
window.addEventListener('offline', () => {
    window.showToast('انقطع الاتصال بالإنترنت. يرجى التحقق من الشبكة 📶', 'error');
    document.getElementById('app').style.filter = 'grayscale(0.5) opacity(0.8)';
    document.body.style.pointerEvents = 'none';
});

window.addEventListener('online', () => {
    window.showToast('عاد الاتصال بالإنترنت! 🌐', 'success');
    document.getElementById('app').style.filter = 'none';
    document.body.style.pointerEvents = 'auto';
});

// الرجوع بالمتصفح/الموبايل
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) { window.switchPage(event.state.page, false); } 
    else { window.switchPage('home', false); }
});
