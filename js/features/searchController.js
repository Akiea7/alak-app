// js/features/searchController.js
// هذا الملف مسؤول عن تفعيل بحث جوجل للأماكن (Autocomplete) وإدارة اختيار الوجهة

import { AppState } from '../core/appState.js';
import { Booking } from './booking.js';
import { UI } from '../ui.js';
import { Helpers } from '../utils/helpers.js';

export const SearchController = {
    setupDestinationSearch() {
        const destBtn = document.getElementById('destBtn');
        if (!destBtn) return;

        // عندما يضغط الزبون على زر "الوجهة"، ننشئ حقل بحث ديناميكي
        destBtn.addEventListener('click', () => {
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'اكتب وجهتك هنا (مثال: المنصور)...';
            // تنسيق الحقل ليتناسب مع تصميمك
            searchInput.className = 'w-full mt-2 p-3 bg-white border border-emerald-200 rounded-lg text-sm font-bold text-gray-800 outline-none focus:border-emerald-500 shadow-sm transition-colors';
            
            const textContainer = destBtn.querySelector('.flex-1');
            // حفظ المحتوى القديم للرجوع إليه
            const originalHTML = textContainer.innerHTML;
            
            // استبدال النص بالحقل الجديد
            textContainer.innerHTML = ''; 
            textContainer.appendChild(searchInput);
            
            // التركيز التلقائي على الحقل
            setTimeout(() => searchInput.focus(), 50);

            // تفعيل ميزة الإكمال التلقائي من خرائط جوجل
            if (typeof google !== 'undefined' && google.maps && google.maps.places) {
                const autocomplete = new google.maps.places.Autocomplete(searchInput, {
                    componentRestrictions: { country: 'iq' }, // حصر البحث بالعراق
                    fields: ['geometry', 'name', 'formatted_address']
                });

                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    if (!place.geometry) {
                        Helpers.showToast('عذراً، يرجى اختيار موقع من القائمة المقترحة', 'error');
                        return;
                    }

                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();

                    // حفظ الوجهة في حالة التطبيق (AppState)
                    Booking.setDestinationLocation(lat, lng, place.name, place.formatted_address);

                    // إعادة ترتيب الواجهة وعرض اسم الوجهة المحددة
                    textContainer.innerHTML = `
                        <p class="text-xs text-emerald-600 mb-1 font-bold">تم تحديد الوجهة</p>
                        <p id="destText" class="font-bold text-gray-800 text-sm truncate">${place.name}</p>
                    `;

                    // حساب المسافة بخط مستقيم (مؤقتاً لحين ربط خدمة مسارات جوجل Directions)
                    const estimatedDistanceInKm = 10; // قيمة افتراضية للاختبار
                    Booking.calculateTripDetails(estimatedDistanceInKm, '20 دقيقة');

                    // إظهار زر التأكيد مع السعر المستخلص من التسعيرة
                    const confirmBtn = document.getElementById('confirmRideBtn');
                    const priceEstimate = document.getElementById('priceEstimate');
                    
                    if (confirmBtn && priceEstimate) {
                        UI.toggleVisibility(confirmBtn, true);
                        priceEstimate.textContent = `${Helpers.formatCurrency(AppState.trip.price)} د.ع`;
                    }
                });
            } else {
                Helpers.showToast('خدمة الخرائط غير متوفرة حالياً', 'error');
                textContainer.innerHTML = originalHTML; // إرجاع النص إذا فشل التحميل
            }
        });
    }
};
