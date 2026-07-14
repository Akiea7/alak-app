// js/features/booking.js
import { AppState } from '../core/appState.js';
import { showToast } from '../utils/helpers.js';

export const Booking = {
    openBookingModal() {
        const from = document.getElementById('currentLocation').textContent;
        const to = document.getElementById('destinationText').textContent;
        
        if (from === 'اضغط لتحديد نقطة الانطلاق' || from === 'جاري تحديد الموقع...') { 
            showToast('يرجى تحديد موقعك للانطلاق', 'error'); 
            return; 
        }
        if (to === 'اضغط لاختيار الوجهة') { 
            showToast('يرجى تحديد وجهتك أولاً', 'error'); 
            return; 
        }
        
        document.getElementById('modalFrom').textContent = from;
        document.getElementById('modalTo').textContent = to;
        
        const activeVehicle = document.querySelector('.vehicle-type.active');
        const typeText = activeVehicle ? activeVehicle.querySelector('p').textContent : 'تكسي';
        
        document.getElementById('modalCarType').textContent = 'نوع السيارة: ' + typeText;
        document.getElementById('modalPrice').innerHTML = parseInt(AppState.estimatedTripPrice).toLocaleString('ar-IQ') + ' <span class="text-xs font-bold text-white/80">د.ع</span>';
        
        document.body.classList.add('pause-animations');
        const modal = document.getElementById('bookingModal');
        const sheet = document.getElementById('bookingSheet');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => sheet.classList.remove('translate-y-full'), 10);
    },

    closeModal() {
        const sheet = document.getElementById('bookingSheet');
        sheet.classList.add('translate-y-full');
        setTimeout(() => {
            document.getElementById('bookingModal').classList.add('hidden');
            document.getElementById('bookingModal').classList.remove('flex');
            document.body.classList.remove('pause-animations');
        }, 500);
    },

    confirmBooking() {
        const confirmBtns = document.querySelectorAll('button[onclick="confirmBooking()"]');
        const targetBtn = confirmBtns[confirmBtns.length - 1]; 
        
        const originalText = targetBtn.innerHTML;
        targetBtn.innerHTML = '<i data-lucide="loader-2" class="w-6 h-6 animate-spin mx-auto"></i>';
        targetBtn.disabled = true;
        if(typeof lucide !== 'undefined') lucide.createIcons();
        
        setTimeout(() => {
            targetBtn.innerHTML = originalText; 
            targetBtn.disabled = false;
            
            this.closeModal();
            
            setTimeout(() => {
                document.body.classList.add('pause-animations');
                const modal = document.getElementById('searchingModal');
                modal.classList.remove('hidden'); 
                modal.classList.add('flex');
                
                let progress = 0;
                const progressBar = document.getElementById('searchProgress');
                const interval = setInterval(() => {
                    progress += 3; 
                    progressBar.style.width = progress + '%';
                    if (progress >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            modal.classList.add('hidden'); 
                            modal.classList.remove('flex');
                            progressBar.style.width = '0%';
                            this.showDriverFoundModal();
                        }, 500);
                    }
                }, 80);
            }, 500);
        }, 800);
    },

    showDriverFoundModal() {
        const driverModal = document.getElementById('driverModal');
        const driverSheet = document.getElementById('driverSheet');
        driverModal.classList.remove('hidden'); 
        driverModal.classList.add('flex');
        setTimeout(() => driverSheet.classList.remove('translate-y-full'), 10);
    },

    closeDriverModal() {
        const sheet = document.getElementById('driverSheet');
        sheet.classList.add('translate-y-full');
        setTimeout(() => {
            document.getElementById('driverModal').classList.add('hidden');
            document.getElementById('driverModal').classList.remove('flex');
            document.body.classList.remove('pause-animations');
        }, 500);
    }
};
