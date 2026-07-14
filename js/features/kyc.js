// js/features/kyc.js
import { Storage } from '../core/storage.js';
import { showToast } from '../utils/helpers.js';

export const KYC = {
    confirmRoleSelection(role) {
        let userStr = localStorage.getItem('alekUser');
        if (!userStr) return;
        let user = JSON.parse(userStr);

        if (role === 'driver') {
            if (user.driverStatus === 'approved') {
                user.role = 'driver';
                localStorage.setItem('alekUser', JSON.stringify(user));
                showToast('تم إعداد حسابك ككابتن بنجاح!', 'success');
                window.closeRoleSelection();
                if(document.getElementById('page-profile')?.classList.contains('active') && window.renderProfileData) window.renderProfileData();
            } else if (user.driverStatus === 'pending') {
                showToast('طلبك قيد المراجعة حالياً من قبل الإدارة ⏳', 'error');
                window.closeRoleSelection();
            } else {
                window.closeRoleSelection();
                setTimeout(() => this.openKYCModal(), 500);
            }
        } else if (role === 'user') {
            user.role = 'user';
            localStorage.setItem('alekUser', JSON.stringify(user));
            showToast('تم إعداد حسابك كمستخدم بنجاح!', 'success');
            window.closeRoleSelection();
            if(document.getElementById('page-profile')?.classList.contains('active') && window.renderProfileData) window.renderProfileData();
        } else {
            window.closeRoleSelection();
        }
    },

    openKYCModal() {
        const modal = document.getElementById('kycModal');
        const sheet = document.getElementById('kycSheet');
        document.body.classList.add('pause-animations');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        if(typeof lucide !== 'undefined') lucide.createIcons();
        setTimeout(() => sheet.classList.remove('translate-y-full'), 10);
    },

    closeKYCModal() {
        const sheet = document.getElementById('kycSheet');
        sheet.classList.add('translate-y-full');
        setTimeout(() => {
            const modal = document.getElementById('kycModal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.classList.remove('pause-animations');
        }, 500);
    },

    submitDriverApplication() {
        let userStr = localStorage.getItem('alekUser');
        if (userStr) {
            let user = JSON.parse(userStr);
            user.driverStatus = 'pending';
            localStorage.setItem('alekUser', JSON.stringify(user));
        }
        this.closeKYCModal();
        setTimeout(() => {
            showToast('تم إرسال طلبك للإدارة بنجاح! سيتم إشعارك عند الموافقة ✅', 'success');
        }, 500);
    },

    adminApproveDriver() {
        let userStr = localStorage.getItem('alekUser');
        if (userStr) {
            let user = JSON.parse(userStr);
            user.driverStatus = 'approved';
            localStorage.setItem('alekUser', JSON.stringify(user));
            showToast('تمت الموافقة على السائق من قبل الإدارة!', 'success');
        }
    }
};

