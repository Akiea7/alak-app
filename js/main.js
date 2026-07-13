// js/main.js
// المايسترو: نقطة الانطلاق اللي تربط كل أجزاء التطبيق ببعضها

import { CONFIG } from './core/config.js';
import { AppState } from './core/appState.js';
import { Storage } from './core/storage.js';
import { UI } from './ui.js';
import { Helpers } from './utils/helpers.js';
import { MESSAGES } from './utils/messages.js';
import { Auth } from './features/auth.js';
import { MapController } from './features/mapController.js'; // استيراد متحكم الخريطة
import './events.js'; // استيراد ملف الأحداث

async function initApp() {
    console.log(`🚀 تم تشغيل تطبيق: ${CONFIG.APP_NAME} بنجاح`);

    // 1. تحميل محتوى جميع الصفحات من مجلد pages قبل فعل أي شيء
    await UI.loadPages();

    // 2. تشغيل الخريطة وتحديد موقع المستخدم
    MapController.initializeMap();

    // 3. استرجاع بيانات المستخدم من الذاكرة المحلية
    const savedUser = Storage.getUser();
    if (savedUser) {
        AppState.user.data = savedUser;
        AppState.user.isLoggedIn = true;
    }

    // 4. تفعيل مراقب الاتصال بالإنترنت
    setupNetworkListeners();

    // 5. عرض الصفحة الرئيسية كبداية بعد اكتمال التحميل
    UI.switchPage('home');

    // 6. مراقبة حالة الفايربيس وتحديث AppState تلقائياً
    Auth.monitorAuthState((userState) => {
        console.log('👤 حالة المستخدم الحالية:', userState);
    });
}

function setupNetworkListeners() {
    window.addEventListener('offline', () => {
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

document.addEventListener('DOMContentLoaded', initApp);
window.switchPage = UI.switchPage;
