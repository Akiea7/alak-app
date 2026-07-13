// js/events.js
// هذا الملف مخصص لربط تفاعلات المستخدم (النقرات) بالمنطق البرمجي

import { UI } from './ui.js';
import { AppState } from './core/appState.js';
import { Booking } from './features/booking.js';

// 1. تعريف الدوال التي يتم استدعاؤها مباشرة من أزرار الـ HTML (مثل onclick)
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

// 2. مراقبة الأزرار داخل الصفحات التي تم تحميلها ديناميكياً
document.addEventListener('DOMContentLoaded', () => {
    // إعطاء مهلة نصف ثانية لضمان اكتمال تحميل صفحات الـ HTML بواسطة دالة loadPages
    setTimeout(() => {
        const confirmBtn = document.getElementById('confirmRideBtn');
        
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                // استدعاء دالة تأكيد الطلب من المنطق دون تعديل الواجهة مباشرة هنا
                const result = Booking.confirmRide();
                
                if (result.success) {
                    UI.switchPage('searching');
                    
                    // تشغيل حركة شريط التحميل في شاشة البحث
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
