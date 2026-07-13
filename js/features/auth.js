// js/features/auth.js
// هذا الملف مسؤول عن تسجيل الدخول، إنشاء الحساب، والتحقق من الصلاحيات

import { auth, db } from '../services/firebase.js';
import { AppState } from '../core/appState.js';

export const Auth = {
    // 1. مراقبة حالة المستخدم (هل هو مسجل دخول أم لا؟)
    monitorAuthState(onStateChangeCallback) {
        // نتأكد أن الفايربيس يعمل
        if (!auth) {
            console.warn('المصادقة غير مفعلة حالياً.');
            return;
        }

        auth.onAuthStateChanged((user) => {
            if (user) {
                // المستخدم مسجل دخول
                AppState.user.isLoggedIn = true;
                AppState.user.data = {
                    uid: user.uid,
                    phone: user.phoneNumber
                };
                // مستقبلاً: هنا يتم جلب دور المستخدم (role) من قاعدة البيانات Firestore
            } else {
                // المستخدم غير مسجل دخول
                AppState.user.isLoggedIn = false;
                AppState.user.data = null;
                AppState.user.role = 'user'; // افتراضي
                AppState.user.driverStatus = null;
            }
            
            // إبلاغ الواجهة بتحديث الحالة (بدون تعديل الواجهة مباشرة من هنا)
            if (typeof onStateChangeCallback === 'function') {
                onStateChangeCallback(AppState.user);
            }
        });
    },

    // 2. تسجيل الخروج
    async logout() {
        try {
            if (!auth) throw new Error('الخدمة غير متوفرة');
            
            await auth.signOut();
            return { success: true };
        } catch (error) {
            console.error('خطأ في تسجيل الخروج:', error);
            return { success: false, error: error.message };
        }
    }
};
