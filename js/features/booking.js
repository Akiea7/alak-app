// js/features/booking.js
// هذا الملف مسؤول عن منطق الحجز وتحديث حالة الرحلة (بدون تعديل الواجهة)

import { AppState } from '../core/appState.js';
import { Pricing } from './pricing.js';

export const Booking = {
    // 1. تعيين موقع الانطلاق
    setPickupLocation(lat, lng, name, address) {
        AppState.trip.pickup = { lat, lng, name, address };
    },

    // 2. تعيين الوجهة
    setDestinationLocation(lat, lng, name, address) {
        AppState.trip.destination = { lat, lng, name, address };
    },

    // 3. حساب المسافة والسعر وتحديث حالة التطبيق
    calculateTripDetails(distanceInKm, durationText) {
        // التأكد من اختيار الانطلاق والوجهة قبل الحساب
        if (!AppState.trip.pickup || !AppState.trip.destination) {
            return { success: false, error: 'يرجى تحديد موقع الانطلاق والوجهة أولاً' };
        }

        // تحديث بيانات الرحلة في AppState
        AppState.trip.distance = distanceInKm;
        AppState.trip.duration = durationText;
        AppState.trip.price = Pricing.calculateTripPrice(distanceInKm);

        return { success: true };
    },

    // 4. تأكيد الطلب النهائي
    confirmRide() {
        if (AppState.trip.price <= 0) {
            return { success: false, error: 'بيانات الرحلة غير مكتملة أو السعر غير صالح' };
        }

        // هنا مستقبلاً راح نكتب كود إرسال الطلب لقاعدة بيانات Firebase
        // حالياً نرجع حالة النجاح فقط للواجهة حتى تعرض شاشة "جاري البحث عن كابتن"
        return { success: true, message: 'تم تجهيز الطلب بنجاح' };
    }
};
