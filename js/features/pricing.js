// js/features/pricing.js
import { AppState } from '../core/appState.js';

export const Pricing = {
    calculateSimulatedPrice() {
        const basePrice = 1000;
        const distanceKM = Math.floor(Math.random() * 4) + 1;
        const price = basePrice + (distanceKM * 750); 
        
        document.getElementById('db-car-economy').dataset.price = price;
        document.getElementById('db-car-comfort').dataset.price = price + 1500;
        
        document.querySelectorAll('.vehicle-type').forEach(v => {
            v.querySelector('.price-val').textContent = parseInt(v.dataset.price).toLocaleString('ar-IQ') + ' د.ع';
        });
        
        const activeType = document.querySelector('.vehicle-type.active');
        AppState.estimatedTripPrice = activeType ? activeType.dataset.price : price;
        
        document.getElementById('estimatedPrice').innerHTML = parseInt(AppState.estimatedTripPrice).toLocaleString('ar-IQ') + ' <span class="text-sm font-bold text-white/80">د.ع</span>';
        document.getElementById('estimatedTime').innerHTML = (distanceKM * 3) + ' <span class="text-sm font-bold text-white/80">دقيقة</span>';
        document.getElementById('mainBookBtn').innerHTML = `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/></svg> اطلب تكسي بـ ${parseInt(AppState.estimatedTripPrice).toLocaleString('ar-IQ')} د.ع`;
    }
};
