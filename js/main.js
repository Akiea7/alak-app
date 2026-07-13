// js/main.js
// المايسترو: نقطة الانطلاق اللي تربط كل أجزاء التطبيق ببعضها

// 1. استيراد كل الوحدات (Modules) اللي بنيناها
import { CONFIG } from './core/config.js';
import { AppState } from './core/appState.js';
import { Storage } from './core/storage.js';
import { UI } from './ui.js';
import { Helpers } from './utils/helpers.js';
import { MESSAGES } from './utils/messages.js';
import { Auth } from './features/auth.js';

// 2. دالة التهيئة الرئيسية
function initApp() {
    console.log(`🚀 تم تشغيل تطبيق: ${CONFIG.APP_NAME} بنجاح`);

    // استرجاع بيانات المستخدم من الذاكرة المحلية لتسريع الدخول
    const savedUser = Storage.getUser();
    if (savedUser) {
        AppState.user.data = savedUser;
        AppState.user.isLoggedIn = true;
    }

    // تفعيل مراقب الاتصال بالإنترنت
    setupNetworkListeners();

    // عرض الصفحة الرئيسية كبداية
    UI.switchPage('home');

    // مراقبة حالة الفايربيس وتحديث AppState تلقائياً
    Auth.monitorAuthState((userState) => {
        console.log('👤 حالة المستخدم الحالية:', userState);
        // مستقبلاً: تحديث صورة الحساب أو أزرار الواجهة بناءً على حالة الدخول هنا
    });
}

// 3. دالة مراقبة حالة الإنترنت (Offline/Online)
function setupNetworkListeners() {
    window.addEventListener('offline', () => {
        // استدعاء دالة الإشعارات والنصوص من الملفات المخصصة
        Helpers.showToast(MESSAGES.ERRORS.NETWORK_OFFLINE, 'error');
        document.body.style.pointerEvents = 'none';
        document.body.style.filter = 'grayscale(0.5) opacity(0.8)';
    });

    window.addEventListener('online', () => {
        Helpers.showToast(MESSAGES.UI.ONLINE_AGAIN, 'success');
        document.body.style.pointerEvents = 'auto';
        document.body.style.filter = 'none';
    });
}

// 4. تشغيل التطبيق بمجرد اكتمال تحميل عناصر الصفحة
document.addEventListener('DOMContentLoaded', initApp);

// 5. ربط دالة التنقل بنافذة الـ Window لتكون متاحة لأزرار HTML
window.switchPage = UI.switchPage;
