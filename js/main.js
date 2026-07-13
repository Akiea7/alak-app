// js/main.js
// هذا هو الملف الرئيسي (Entry Point) اللي يربط كل أجزاء التطبيق

// استدعاء الإعدادات وحالة التطبيق من مجلد core
import { CONFIG } from './core/config.js';
import { AppState } from './core/appState.js';

// دالة تهيئة التطبيق (تشتغل أول ما يفتح المستخدم الصفحة)
function initApp() {
    console.log(`🚀 تم تشغيل تطبيق: ${CONFIG.APP_NAME}`);
    console.log('📦 حالة التطبيق عند البدء:', AppState);
    
    // ملاحظة: هنا مستقبلاً راح نستدعي دوال الخرائط وتهيئة واجهة المستخدم
}

// تشغيل دالة التهيئة بمجرد اكتمال تحميل عناصر صفحة HTML
document.addEventListener('DOMContentLoaded', initApp);
