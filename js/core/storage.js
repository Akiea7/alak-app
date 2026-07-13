// js/core/storage.js
// هذا الملف مسؤول حصرياً عن التعامل مع الذاكرة المحلية للمتصفح (localStorage)

export const Storage = {
    // 1. حفظ بيانات المستخدم
    saveUser(userData) {
        try {
            localStorage.setItem('alekUser', JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('خطأ في حفظ بيانات المستخدم:', error);
            return false;
        }
    },

    // 2. جلب بيانات المستخدم
    getUser() {
        try {
            const userStr = localStorage.getItem('alekUser');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('خطأ في قراءة بيانات المستخدم:', error);
            return null;
        }
    },

    // 3. مسح بيانات المستخدم (عند تسجيل الخروج)
    clearUser() {
        localStorage.removeItem('alekUser');
    },

    // 4. حفظ وضع التطبيق الحالي (كابتن أو زبون)
    saveAppMode(mode) {
        localStorage.setItem('appMode', mode);
    },

    // 5. جلب وضع التطبيق الحالي (الافتراضي هو زبون)
    getAppMode() {
        return localStorage.getItem('appMode') || 'user';
    }
};
