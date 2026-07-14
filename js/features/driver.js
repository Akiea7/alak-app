// js/features/driver.js
import { showToast } from '../utils/helpers.js';

export const Driver = {
    toggleDriverStatus(checkbox) {
        const statusText = document.getElementById('driver-status-text');
        const radar = document.getElementById('searching-radar');
        const radarTitle = document.getElementById('radar-title');
        const radarDesc = document.getElementById('radar-desc');
        const radarIcon = radar.querySelector('.animate-spin-slow');
        const pingCircles = radar.querySelectorAll('.animate-ping');
        
        if (checkbox.checked) {
            statusText.textContent = 'متاح للعمل';
            statusText.className = 'text-[9px] font-black text-blue-600';
            radarTitle.textContent = 'جاري البحث عن ركاب...';
            radarDesc.textContent = 'خليك قريب من المناطق المزدحمة للحصول على طلبات أسرع';
            if(radarIcon) radarIcon.style.animationPlayState = 'running';
            pingCircles.forEach(circle => circle.style.display = 'block');
            showToast('أنت الآن متاح لتلقي الطلبات 🚗', 'success');
        } else {
            statusText.textContent = 'غير متاح';
            statusText.className = 'text-[9px] font-black text-gray-400';
            radarTitle.textContent = 'أنت غير متاح حالياً';
            radarDesc.textContent = 'اضغط على الزر بالأعلى للبدء باستقبال الطلبات';
            if(radarIcon) radarIcon.style.animationPlayState = 'paused';
            pingCircles.forEach(circle => circle.style.display = 'none');
            showToast('تم إيقاف استقبال الطلبات', 'error');
        }
    }
};

