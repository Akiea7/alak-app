// js/events.js
// هذا الملف مخصص لربط تفاعلات المستخدم (النقرات) بالمنطق البرمجي

import { UI } from './ui.js';
import { AppState } from './core/appState.js';
import { Booking } from './features/booking.js';
import { SearchController } from './features/searchController.js'; // استدعاء متحكم البحث

window.cancelSearch = () => {
    UI.switchPage('home');
    AppState.resetTrip();
    console.log('تم إلغاء الطلب والعودة للرئيسية');
};

window.openLoginModal = () => {
    console.log('سيتم فتح نافذة تسجيل الدخول قريباً...');
};

window.toggleAppMode = () => {
    console.log('سيتم التحويل لوضع الكابتن / تقديم طلب KYC...');
};

// مراقبة الأزرار داخل الصفحات التي تم تحميلها ديناميكياً
document.addEventListener('DOMContentLoaded', () => {
    // إعطاء مهلة لضمان اكتمال تحميل صفحات الـ HTML 
    setTimeout(() => {
        
        // تفعيل محرك البحث عن الوجهة
        SearchController.setupDestinationSearch();

        const confirmBtn = document.getElementById('confirmRideBtn');
        
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                const result = Booking.confirmRide();
                
                if (result.success) {
                    UI.switchPage('searching');
                    
                    const bar = document.getElementById('searchProgressBar');
                    if (bar) {
                        bar.style.width = '0%';
                        setTimeout(() => {
                            bar.style.transition = 'width 5s ease-in-out';
                            bar.style.width = '100%';
                        }, 100);
                    }
                }
            });
        }
    }, 500);
});
