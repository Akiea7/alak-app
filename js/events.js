// js/events.js
import { UI } from './ui.js';
import { Auth } from './features/auth.js';
import { MapController } from './features/mapController.js';
import { SearchController } from './features/searchController.js';
import { Booking } from './features/booking.js';
import { showToast } from './utils/helpers.js';
import { Storage } from './core/storage.js';
import { Store } from './features/store.js';
import { KYC } from './features/kyc.js';
import { Profile } from './features/profile.js';
import { Driver } from './features/driver.js';

// ربط الدوال بالواجهة (Global Scope)
window.switchPage = UI.switchPage.bind(UI);
window.toggleMenu = UI.toggleMenu.bind(UI);
window.scrollToBooking = UI.scrollToBooking.bind(UI);
window.toggleTheme = UI.toggleTheme.bind(UI);
window.showToast = showToast;

window.sendOTP = Auth.sendOTP.bind(Auth);
window.editPhone = Auth.editPhone.bind(Auth);
window.verifyOTP = Auth.verifyOTP.bind(Auth);
window.requireLoginAndSwitch = Auth.requireLoginAndSwitch.bind(Auth);
window.logoutUser = Auth.logoutUser.bind(Auth);

window.getCurrentLocation = MapController.getCurrentLocation.bind(MapController);
window.openMapPicker = MapController.openMapPicker.bind(MapController);
window.closeMapPicker = MapController.closeMapPicker.bind(MapController);
window.confirmSelection = MapController.confirmSelection.bind(MapController);

window.handleSearch = SearchController.handleSearch.bind(SearchController);
window.selectSearchResult = SearchController.selectSearchResult.bind(SearchController);
window.clearSearch = SearchController.clearSearch.bind(SearchController);

window.openBookingModal = Booking.openBookingModal.bind(Booking);
window.closeModal = Booking.closeModal.bind(Booking);
window.confirmBooking = Booking.confirmBooking.bind(Booking);
window.showDriverFoundModal = Booking.showDriverFoundModal.bind(Booking);
window.closeDriverModal = Booking.closeDriverModal.bind(Booking);
window.addToCart = Booking.addToCart.bind(Booking);
window.changeQuantity = Booking.changeQuantity.bind(Booking);
window.openCart = Booking.openCart.bind(Booking);
window.closeCart = Booking.closeCart.bind(Booking);
window.checkoutWhatsApp = Booking.checkoutWhatsApp.bind(Booking);

// النوافذ وإدارة الأدوار (مأخوذة من app.js)
window.openRoleSelection = () => {
    const modal = document.getElementById('roleSelectionModal');
    const sheet = document.getElementById('roleSelectionSheet');
    if(!modal) return;
    document.body.classList.add('pause-animations');
    modal.classList.remove('hidden'); modal.classList.add('flex');
    if(typeof lucide !== 'undefined') lucide.createIcons();
    setTimeout(() => sheet.classList.remove('translate-y-full'), 10);
};

window.closeRoleSelection = () => {
    const sheet = document.getElementById('roleSelectionSheet');
    if(sheet) sheet.classList.add('translate-y-full');
    setTimeout(() => {
        const modal = document.getElementById('roleSelectionModal');
        if(modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
        document.body.classList.remove('pause-animations');
    }, 500);
};

// ... (تكملة دوال النافذة البسيطة الباقية مثل openKYCModal و applyAppMode)
window.closeSubscriptionModal = () => {
    const sheet = document.getElementById('subscriptionSheet');
    sheet.classList.add('translate-y-full');
    setTimeout(() => {
        document.getElementById('subscriptionModal').classList.add('hidden');
        document.getElementById('subscriptionModal').classList.remove('flex');
        document.body.classList.remove('pause-animations');
    }, 500);
};

window.applyAppMode = (mode) => {
    const userNav = document.getElementById('user-bottom-nav');
    const driverNav = document.getElementById('driver-bottom-nav');
    if (!userNav || !driverNav) return;
    if (mode === 'driver') {
        userNav.classList.add('hidden'); userNav.classList.remove('flex');
        driverNav.classList.remove('hidden'); driverNav.classList.add('flex');
        showToast('تم التبديل إلى وضع الكابتن 🚕', 'success');
        window.switchPage('driver-dashboard');
    } else {
        driverNav.classList.add('hidden'); driverNav.classList.remove('flex');
        userNav.classList.remove('hidden'); userNav.classList.add('flex');
        showToast('تم التبديل إلى وضع الزبون 👤', 'success');
        window.switchPage('home');
    }
};

window.toggleAppMode = () => {
    const user = Auth.checkLoginState();
    if (!user) { showToast('يرجى تسجيل الدخول أولاً', 'error'); return; }
    if (user.driverStatus !== 'approved') {
        if (user.driverStatus === 'pending') { showToast('حسابك ككابتن قيد المراجعة ⏳', 'error'); } 
        else { showToast('يجب تقديم طلب انضمام ككابتن أولاً', 'error'); }
        return;
    }
    let currentMode = Storage.getAppMode();
    let newMode = currentMode === 'user' ? 'driver' : 'user';
    Storage.saveAppMode(newMode);
    window.applyAppMode(newMode);
};
window.renderStoreData = Store.renderStoreData.bind(Store);
window.switchStoreSubView = Store.switchStoreSubView.bind(Store);
window.previewProductImage = Store.previewProductImage.bind(Store);
window.removeProductImage = Store.removeProductImage.bind(Store);
window.addNewStoreProduct = Store.addNewStoreProduct.bind(Store);
window.deleteStoreProduct = Store.deleteStoreProduct.bind(Store);
window.changeMockOrderStatus = Store.changeMockOrderStatus.bind(Store);

// دوال الأمان (KYC)
window.confirmRoleSelection = KYC.confirmRoleSelection.bind(KYC);
window.openKYCModal = KYC.openKYCModal.bind(KYC);
window.closeKYCModal = KYC.closeKYCModal.bind(KYC);
window.submitDriverApplication = KYC.submitDriverApplication.bind(KYC);
window.adminApproveDriver = KYC.adminApproveDriver.bind(KYC);

// دوال الملف الشخصي
window.renderProfileData = Profile.renderProfileData.bind(Profile);
window.openRoleDashboard = Profile.openRoleDashboard.bind(Profile);

// دوال الكابتن
window.toggleDriverStatus = Driver.toggleDriverStatus.bind(Driver);

// دوال واجهة صغيرة مأخوذة من الكود الأصلي
window.openRatingModal = () => { showToast('شكراً لدعمك! سيتم توجيهك للمتجر قريباً ⭐️', 'success'); };
window.openNotifications = () => { window.switchPage('notifications'); };
// تحديد الأسعار للمركبات
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.vehicle-type');
    if (btn) {
        document.querySelectorAll('.vehicle-type').forEach(b => {
            b.classList.remove('active', 'glass-gold'); b.classList.add('glass');
            b.querySelectorAll('svg, p').forEach(el => {
                if (!el.classList.contains('text-midnight-400')) {
                    el.classList.remove('text-gold-400'); el.classList.add('text-white/80');
                }
            });
        });
        btn.classList.remove('glass'); btn.classList.add('active', 'glass-gold');
        btn.querySelectorAll('svg, p').forEach(el => {
            el.classList.remove('text-white/80'); el.classList.add('text-gold-400');
        });
        import('./core/appState.js').then(({AppState}) => {
            AppState.estimatedTripPrice = btn.dataset.price;
            document.getElementById('estimatedPrice').innerHTML = parseInt(AppState.estimatedTripPrice).toLocaleString('ar-IQ') + ' <span class="text-sm font-bold text-white/80">د.ع</span>';
            document.getElementById('mainBookBtn').innerHTML = `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/></svg> اطلب تكسي بـ ${parseInt(AppState.estimatedTripPrice).toLocaleString('ar-IQ')} د.ع`;
        });
    }
});
