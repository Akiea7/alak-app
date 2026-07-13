// js/services/mapsService.js
// هذا الملف مسؤول حصرياً عن التعامل مع واجهة برمجة تطبيقات خرائط جوجل (Google Maps API)

import { CONFIG } from '../core/config.js';

export const MapsService = {
    map: null,
    geocoder: null,
    autocompleteService: null,
    placesService: null,

    // دالة تهيئة الخريطة (مع Error Handling)
    initMap(mapElementId) {
        try {
            if (typeof google === 'undefined' || !google.maps) {
                throw new Error('لم يتم تحميل مكتبة خرائط جوجل.');
            }

            const mapOptions = {
                center: CONFIG.MAP.DEFAULT_CENTER,
                zoom: CONFIG.MAP.DEFAULT_ZOOM,
                disableDefaultUI: true,
                styles: [
                    { elementType: "geometry", stylers: [{ color: "#212121" }] },
                    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
                    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
                    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
                    { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] }
                ]
            };

            this.map = new google.maps.Map(document.getElementById(mapElementId), mapOptions);
            this.geocoder = new google.maps.Geocoder();
            this.autocompleteService = new google.maps.places.AutocompleteService();
            this.placesService = new google.maps.places.PlacesService(this.map);
            
            return true; // نجاح التهيئة
        } catch (error) {
            console.error('خطأ في تهيئة الخريطة:', error);
            return false; // فشل التهيئة
        }
    },

    // دالة تحويل الإحداثيات إلى اسم شارع (Reverse Geocoding)
    async getAddressFromCoordinates(lat, lng) {
        try {
            if (!this.geocoder) throw new Error('Geocoder غير مهيأ');
            
            const response = await this.geocoder.geocode({ location: { lat, lng } });
            
            if (response.results && response.results[0]) {
                const place = response.results[0];
                return {
                    name: place.address_components[0]?.short_name || 'موقع محدد',
                    fullName: place.formatted_address.replace(', العراق', '')
                };
            }
            return null;
        } catch (error) {
            console.error('خطأ في جلب اسم الموقع:', error);
            return null;
        }
    }
};
