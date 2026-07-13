// js/features/mapController.js
// هذا الملف يربط بين خدمة الخرائط (جوجل) وواجهة المستخدم، ويتحكم بتحديد موقع الزبون

import { MapsService } from '../services/mapsService.js';
import { Booking } from './booking.js';
import { Helpers } from '../utils/helpers.js';
import { MESSAGES } from '../utils/messages.js';

export const MapController = {
    // 1. تشغيل الخريطة
    initializeMap() {
        // نمرر id الخاص بـ div الخريطة الموجود في home.html
        const isMapReady = MapsService.initMap('map');
        
        if (isMapReady) {
            console.log('🗺️ تم تشغيل الخريطة بنجاح');
            this.getCurrentLocation();
        } else {
            Helpers.showToast(MESSAGES.ERRORS.MAP_LOAD_FAILED, 'error');
        }
    },

    // 2. جلب موقع المستخدم (GPS)
    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    // توجيه كاميرا الخريطة لموقع المستخدم وتقريبها
                    if (MapsService.map) {
                        MapsService.map.setCenter({ lat, lng });
                        MapsService.map.setZoom(15);
                    }

                    // تحويل الإحداثيات إلى اسم شارع
                    const address = await MapsService.getAddressFromCoordinates(lat, lng);
                    const pickupElement = document.getElementById('pickupText');
                    
                    if (address && pickupElement) {
                        // تحديث الواجهة باسم الشارع
                        pickupElement.textContent = address.name;
                        
                        // حفظ الموقع سرياً في حالة التطبيق (AppState) لتجهيز الحجز
                        Booking.setPickupLocation(lat, lng, address.name, address.fullName);
                    }
                },
                (error) => {
                    console.warn('لم يتمكن المتصفح من تحديد الموقع:', error);
                    const pickupElement = document.getElementById('pickupText');
                    if(pickupElement) {
                        pickupElement.textContent = 'يرجى تحديد الموقع يدوياً';
                    }
                },
                { enableHighAccuracy: true } // طلب دقة عالية للـ GPS
            );
        } else {
            console.error('ميزة تحديد الموقع غير مدعومة في هذا المتصفح.');
        }
    }
};
