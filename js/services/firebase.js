// js/services/firebase.js
// هذا الملف مسؤول عن تهيئة الفايربيس والمصادقة وقاعدة البيانات

import { CONFIG } from '../core/config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// ملاحظة: سنقوم لاحقاً بنقل هذه المفاتيح إلى ملف config.js بعد إنشاء المشروع في منصة Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

let app, auth, db;

// تهيئة الفايربيس فقط إذا كان مفعلاً في الإعدادات
try {
    if (CONFIG.FIREBASE_ENABLED) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        console.log('✅ تم تهيئة Firebase بنجاح');
    }
} catch (error) {
    console.error('❌ حدث خطأ أثناء تهيئة Firebase:', error);
}

// تصدير الخدمات حتى نستخدمها بملفات تسجيل الدخول والحجز
export { app, auth, db };
