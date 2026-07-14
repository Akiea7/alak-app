// js/features/mapController.js
import { AppState } from '../core/appState.js';
import { CONFIG } from '../core/config.js';
import { showToast } from '../utils/helpers.js';
import { Pricing } from './pricing.js';

export const MapController = {
    initMap() {
        if (AppState.map) return;
        const mapOptions = {
            center: AppState.currentLocation,
            zoom: 15, disableDefaultUI: true, styles: CONFIG.DARK_MAP_STYLE
        };
        AppState.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        AppState.geocoder = new google.maps.Geocoder();
        AppState.autocompleteService = new google.maps.places.AutocompleteService();
        AppState.placesService = new google.maps.places.PlacesService(AppState.map);
        
        const pinContainer = document.getElementById('centerPinContainer');
        const addressText = document.getElementById('selectedLocationAddress');
        let moveTimeout;
        
        AppState.map.addListener('dragstart', () => {
            pinContainer.classList.add('is-dragging');
            addressText.textContent = 'جاري تحديد الموقع...';
        });
        AppState.map.addListener('dragend', () => {
            pinContainer.classList.remove('is-dragging');
            clearTimeout(moveTimeout);
            moveTimeout = setTimeout(() => {
                const center = AppState.map.getCenter();
                this.reverseGeocode(center.lat(), center.lng());
            }, 400);
        });
    },

    reverseGeocode(lat, lng) {
        AppState.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) {
                const place = results[0];
                const name = place.address_components[0].short_name || 'موقع محدد';
                const address = place.formatted_address.replace(', العراق', '');
                
                document.getElementById('selectedLocationName').textContent = name;
                document.getElementById('selectedLocationAddress').textContent = address;
                document.getElementById('selectedLocationInfo').classList.remove('hidden');

                const selectedLoc = { lat, lng, name: name, fullName: address };
                if (AppState.selectionType === 'pickup') { AppState.pickupLocation = selectedLoc; } 
                else { AppState.destinationLocation = selectedLoc; }
            } else {
                document.getElementById('selectedLocationAddress').textContent = 'تعذر جلب اسم الشارع';
            }
        });
    },

    getCurrentLocation() {
        if (navigator.geolocation) {
            showToast('جاري تحديد موقعك بدقة...');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    AppState.currentLocation = { lat, lng };
                    if (AppState.map) {
                        AppState.map.panTo(AppState.currentLocation);
                        AppState.map.setZoom(16);
                        this.reverseGeocode(lat, lng);
                    } else {
                        AppState.pickupLocation = { lat, lng, name: 'موقعي الحالي', fullName: 'موقع الـ GPS' };
                        const locText = document.getElementById('currentLocation');
                        if(locText) locText.textContent = 'موقعي الحالي';
                    }
                    showToast('تم تحديد الموقع بنجاح');
                },
                (error) => { showToast('تعذر تحديد الموقع، يرجى تفعيل الـ GPS', 'error'); },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            showToast('متصفحك لا يدعم تحديد الموقع', 'error');
        }
    },

    openMapPicker(type) {
        AppState.selectionType = type;
        document.getElementById('mapPickerModal').classList.remove('hidden');
        document.body.classList.add('pause-animations');
        const bottomNav = document.querySelector('nav');
        if (bottomNav) bottomNav.classList.add('hidden');
        document.getElementById('mapPickerTitle').textContent = type === 'pickup' ? 'تحديد موقع الانطلاق' : 'تحديد الوجهة';
        
        setTimeout(() => {
            if(typeof google === 'undefined' || !google.maps) {
                showToast('يتم تحميل محرك الخرائط، يرجى الانتظار...', 'error');
                return;
            }
            this.initMap();
            google.maps.event.trigger(AppState.map, 'resize');
            if (type === 'pickup' && AppState.pickupLocation) {
                AppState.map.panTo({ lat: AppState.pickupLocation.lat, lng: AppState.pickupLocation.lng });
                this.reverseGeocode(AppState.pickupLocation.lat, AppState.pickupLocation.lng);
            } else if (type === 'destination' && AppState.destinationLocation) {
                AppState.map.panTo({ lat: AppState.destinationLocation.lat, lng: AppState.destinationLocation.lng });
                this.reverseGeocode(AppState.destinationLocation.lat, AppState.destinationLocation.lng);
            } else {
                AppState.map.panTo(AppState.currentLocation);
                this.reverseGeocode(AppState.currentLocation.lat, AppState.currentLocation.lng);
            }
        }, 100);
    },

    closeMapPicker() {
        document.getElementById('mapPickerModal').classList.add('hidden');
        document.body.classList.remove('pause-animations');
        const bottomNav = document.querySelector('nav');
        if (bottomNav) bottomNav.classList.remove('hidden');
    },

    confirmSelection() {
        if (AppState.selectionType === 'pickup' && AppState.pickupLocation) {
            document.getElementById('currentLocation').textContent = AppState.pickupLocation.name;
            this.closeMapPicker();
            showToast('تم تحديد موقع الانطلاق');
        } else if (AppState.selectionType === 'destination' && AppState.destinationLocation) {
            document.getElementById('destinationText').textContent = AppState.destinationLocation.name;
            this.closeMapPicker();
            showToast('تم تحديد الوجهة');
        }
        if(document.getElementById('currentLocation').textContent !== 'اضغط لتحديد نقطة الانطلاق' &&
           document.getElementById('currentLocation').textContent !== 'جاري تحديد الموقع...' &&
           document.getElementById('destinationText').textContent !== 'اضغط لاختيار الوجهة') {
            document.getElementById('pricingSection').classList.remove('hidden');
            Pricing.calculateSimulatedPrice();
        }
    }
};
