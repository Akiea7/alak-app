// js/features/auth.js
import { showToast } from '../utils/helpers.js';
import { Storage } from '../core/storage.js';

export const Auth = {
    sendOTP() {
        const phoneInput = document.getElementById('phoneNumber').value;
        if(phoneInput.length < 10) { showToast('يرجى إدخال رقم هاتف صحيح', 'error'); return; }
        
        document.getElementById('displayPhone').innerText = "+964 " + phoneInput;
        document.getElementById('phoneStep').classList.add('hidden');
        document.getElementById('otpStep').classList.remove('hidden');
        
        this.setupOTPInputs();
        showToast('تم إرسال رمز التحقق بنجاح', 'success');
    },

    editPhone() {
        document.getElementById('otpStep').classList.add('hidden');
        document.getElementById('phoneStep').classList.remove('hidden');
    },

    verifyOTP() {
        const inputs = document.querySelectorAll('.otp-input');
        let otpCode = '';
        inputs.forEach(input => otpCode += input.value);

        if(otpCode.length < 6) { showToast('يرجى إدخال الرمز المكون من 6 أرقام', 'error'); return; }

        const phoneInput = document.getElementById('phoneNumber').value;
        const user = { name: "مستخدم ألك", phone: phoneInput, role: 'pending' };
        Storage.saveUser(user);
        showToast('تم تسجيل الدخول بنجاح! مرحباً بك.', 'success');
        
        setTimeout(() => {
            window.switchPage('home');
            window.openRoleSelection(); 
        }, 1000);
    },

    setupOTPInputs() {
        const inputs = document.querySelectorAll('.otp-input');
        if(inputs.length === 0) return;
        inputs[0].focus();
        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < inputs.length - 1) { inputs[index + 1].focus(); }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '' && index > 0) { inputs[index - 1].focus(); }
            });
        });
    },

    checkLoginState() { return Storage.getUser(); },

    requireLoginAndSwitch(pageId) {
        if (!this.checkLoginState()) { window.switchPage('login'); } 
        else { window.switchPage(pageId); }
    },

    logoutUser() {
        Storage.clearUser();
        showToast('تم تسجيل الخروج بنجاح', 'success');
        window.switchPage('home');
    }
};
