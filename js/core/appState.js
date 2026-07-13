// js/core/appState.js
// هذا الكائن (Object) يحفظ كل حالة التطبيق بمكان واحد بدل المتغيرات العشوائية

export const AppState = {
    // 1. بيانات الرحلة الحالية (Trip)
    trip: {
        pickup: null,      // موقع الانطلاق {lat, lng, address}
        destination: null, // الوجهة {lat, lng, address}
        distance: 0,       // المسافة بالكيلومتر
        duration: '',      // الوقت المتوقع
        price: 0           // السعر النهائي
    },
    
    // 2. بيانات المستخدم (User)
    user: {
        isLoggedIn: false,
        data: null,        // تفاصيل الحساب من فايربيس
        role: 'user',      // نوع الحساب (مستخدم عادي أو كابتن)
        driverStatus: null // حالة السائق (pending, approved)
    },

    // 3. حالة الواجهة (UI State)
    ui: {
        activePage: 'home',
        isMapOpen: false
    },

    // دالة لتنظيف بيانات الرحلة (نحتاجها من الزبون يلغي الطلب أو يوصل)
    resetTrip() {
        this.trip = {
            pickup: null,
            destination: null,
            distance: 0,
            duration: '',
            price: 0
        };
    }
};
