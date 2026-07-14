// js/features/profile.js
import { Storage } from '../core/storage.js';
import { showToast } from '../utils/helpers.js';

export const Profile = {
    renderProfileData() {
        const userStr = localStorage.getItem('alekUser');
        if (userStr) {
            const user = JSON.parse(userStr);
            
            const nameEl = document.getElementById('profileName');
            const phoneEl = document.getElementById('profilePhone');
            const initialsEl = document.getElementById('profileInitials');
            const roleBadgeEl = document.getElementById('profileRoleBadge');

            if (nameEl) nameEl.textContent = user.name;
            if (phoneEl) phoneEl.textContent = user.phone;
            if (initialsEl && user.name) initialsEl.textContent = user.name.charAt(0);
            if (roleBadgeEl) {
                if (user.role === 'driver') {
                    roleBadgeEl.innerHTML = '<i data-lucide="car" class="w-3 h-3"></i> كابتن';
                    roleBadgeEl.className = 'flex items-center justify-center gap-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full text-xs font-bold mx-auto w-max';
                } else if (user.role === 'store') {
                    roleBadgeEl.innerHTML = '<i data-lucide="store" class="w-3 h-3"></i> صاحب متجر';
                    roleBadgeEl.className = 'flex items-center justify-center gap-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold mx-auto w-max';
                } else if (user.role === 'user') {
                    roleBadgeEl.innerHTML = '<i data-lucide="user" class="w-3 h-3"></i> مستخدم';
                    roleBadgeEl.className = 'flex items-center justify-center gap-1 bg-gold-400/10 border border-gold-400/30 text-gold-400 px-3 py-1 rounded-full text-xs font-bold mx-auto w-max';
                } else {
                    roleBadgeEl.innerHTML = '<i data-lucide="help-circle" class="w-3 h-3 text-gold-400"></i> غير محدد (اضغط للتحديد)';
                    roleBadgeEl.className = 'flex items-center justify-center gap-1 bg-white/5 border border-gold-400/50 text-white/80 px-3 py-1 rounded-full text-xs font-bold mx-auto w-max cursor-pointer hover:bg-white/10';
                    roleBadgeEl.onclick = window.openRoleSelection;
                }
            }

            const adminPanel = document.getElementById('adminPanel');
            const adminBtnText = document.getElementById('adminBtnText');
            const setRoleBtn = document.getElementById('setRoleBtn');
            
            if(setRoleBtn) {
                if(!user.role || user.role === 'pending') {
                    setRoleBtn.classList.remove('hidden');
                } else {
                    setRoleBtn.classList.add('hidden');
                }
            }

            if (adminPanel) {
                adminPanel.classList.remove('hidden');
                if (user.role === 'store') {
                    if (adminBtnText) adminBtnText.textContent = 'إدارة المتجر';
                } else {
                    if (adminBtnText) adminBtnText.textContent = 'وضع الكابتن';
                }
            }
            
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    },

    openRoleDashboard() {
        const userStr = localStorage.getItem('alekUser');
        const user = userStr ? JSON.parse(userStr) : null;
        if (user) {
            if (user.role === 'store') {
                showToast('لوحة تحكم المتجر مغلقة حالياً استعداداً للإطلاق الكبير! 🚀');
            } else if (user.role === 'driver') {
                window.switchPage('driver-dashboard');
            }
        }
    }
};

