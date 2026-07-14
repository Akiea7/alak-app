// js/core/storage.js
// مخصص للتعامل مع الذاكرة المحلية (localStorage) بنفس منطق التطبيق الأصلي

export const Storage = {
    // إدارة بيانات المستخدم
    getUser() {
        const userStr = localStorage.getItem('alekUser');
        return userStr ? JSON.parse(userStr) : null;
    },
    saveUser(userData) {
        localStorage.setItem('alekUser', JSON.stringify(userData));
    },
    clearUser() {
        localStorage.removeItem('alekUser');
    },

    // إدارة وضع التطبيق (كابتن / زبون)
    getAppMode() {
        return localStorage.getItem('appMode') || 'user';
    },
    saveAppMode(mode) {
        localStorage.setItem('appMode', mode);
    },

    // إدارة المظهر (فاتح / داكن)
    getTheme() {
        return localStorage.getItem('alakTheme') || 'dark';
    },
    saveTheme(theme) {
        localStorage.setItem('alakTheme', theme);
    },

    // إدارة إشعارات السلة
    getCartHintShown() {
        return localStorage.getItem('cartDragHintShown') === 'true';
    },
    setCartHintShown() {
        localStorage.setItem('cartDragHintShown', 'true');
    }
};
