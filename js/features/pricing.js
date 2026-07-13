// js/features/pricing.js
// هذا الملف مسؤول عن العمليات الحسابية الخاصة بالتسعير فقط (Business Logic)

import { CONFIG } from '../core/config.js';

export const Pricing = {
    // دالة حساب سعر الرحلة بناءً على المسافة
    calculateTripPrice(distanceInKm) {
        if (!distanceInKm || distanceInKm <= 0) return 0;

        // المعادلة: فتحة العداد + (المسافة بالكيلومتر × سعر الكيلومتر)
        const calculatedPrice = CONFIG.PRICING.BASE_FARE + (distanceInKm * CONFIG.PRICING.PER_KM_RATE);

        // التأكد من أن السعر لا يقل عن الحد الأدنى للرحلة
        const finalPrice = Math.max(calculatedPrice, CONFIG.PRICING.MIN_FARE);
        
        // تقريب الرقم لأقرب 250 دينار (لتسهيل الدفع النقدي بالعراق)
        return Math.round(finalPrice / 250) * 250;
    }
};
