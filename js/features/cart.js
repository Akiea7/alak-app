// js/features/cart.js
import { AppState } from '../core/appState.js';
import { CONFIG } from '../core/config.js';
import { showToast } from '../utils/helpers.js';

export const Cart = {
    addToCart(itemName, itemPrice) {
        const existingItem = AppState.cart.find(i => i.name === itemName);
        if (existingItem) { 
            existingItem.quantity += 1; 
        } else { 
            AppState.cart.push({ name: itemName, price: itemPrice, quantity: 1 }); 
        }
        
        this.updateCartUI();
        showToast(`تمت إضافة ${itemName} للسلة`);
        
        const fab = document.getElementById('floatingCartBtn');
        if(fab) {
            fab.classList.remove('scale-0'); 
            fab.classList.add('scale-100');
            this.initCartDrag();
            
            if (!localStorage.getItem('cartDragHintShown')) {
                setTimeout(() => { 
                    showToast('يمكنك سحب السلة لأي مكان في الشاشة! 👆', 'success'); 
                    localStorage.setItem('cartDragHintShown', 'true'); 
                }, 1000);
            }
        }
    },

    removeFromCart(itemName) {
        AppState.cart = AppState.cart.filter(i => i.name !== itemName);
        this.updateCartUI();
    },

    changeQuantity(itemName, delta) {
        const item = AppState.cart.find(i => i.name === itemName);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) { 
                this.removeFromCart(itemName); 
            } else { 
                this.updateCartUI(); 
            }
        }
    },

    updateCartUI() {
        const container = document.getElementById('cartItemsContainer');
        const totalEl = document.getElementById('cartTotal');
        const badge = document.getElementById('cartBadge');
        
        if (AppState.cart.length === 0) {
            container.innerHTML = `
                <div class="text-center text-white/40 py-10 flex flex-col items-center gap-3">
                    <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                        <i data-lucide="shopping-cart" class="w-8 h-8 opacity-50"></i>
                    </div>
                    <p class="font-bold text-sm">سلتك فارغة حالياً</p>
                </div>`;
            totalEl.innerHTML = `0 <span class="text-xs text-white/60">د.ع</span>`;
            if(badge) badge.textContent = '0';
            
            const fab = document.getElementById('floatingCartBtn');
            if(fab) { 
                fab.classList.remove('scale-100'); 
                fab.classList.add('scale-0'); 
            }
            if(typeof lucide !== 'undefined') lucide.createIcons();
            return; 
        } 

        let total = 0; 
        let totalItems = 0;
        
        container.innerHTML = AppState.cart.map(item => {
            total += item.price * item.quantity; 
            totalItems += item.quantity;
            return `
                <div class="glass-strong rounded-2xl p-3 mb-3 flex justify-between items-center border border-white/5 transition hover:border-gold-400/30">
                    <div class="flex-1 pr-2">
                        <h4 class="text-sm font-bold text-white mb-1 truncate">${item.name}</h4>
                        <p class="text-xs font-bold text-gold-400">${(item.price * item.quantity).toLocaleString('ar-IQ')} <span class="text-[10px] text-white/50">د.ع</span></p>
                    </div>
                    <div class="flex items-center gap-3 bg-midnight-600 rounded-xl p-1 border border-white/10 shrink-0">
                        <button onclick="changeQuantity('${item.name}', -1)" class="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition"><i data-lucide="minus" class="w-3 h-3"></i></button>
                        <span class="text-sm font-bold text-white w-4 text-center">${item.quantity}</span>
                        <button onclick="changeQuantity('${item.name}', 1)" class="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition"><i data-lucide="plus" class="w-3 h-3"></i></button>
                    </div>
                </div>`;
        }).join('');

        totalEl.innerHTML = `${total.toLocaleString('ar-IQ')} <span class="text-xs text-white/60">د.ع</span>`;
        if(badge) badge.textContent = totalItems;
        if(typeof lucide !== 'undefined') lucide.createIcons();
    },

    openCart() {
        this.updateCartUI();
        document.body.classList.add('pause-animations');
        const modal = document.getElementById('cartModal');
        const sheet = document.getElementById('cartSheet');
        modal.classList.remove('hidden'); 
        modal.classList.add('flex');
        if(typeof lucide !== 'undefined') lucide.createIcons();
        setTimeout(() => sheet.classList.remove('translate-y-full'), 10);
    },

    closeCart() {
        const sheet = document.getElementById('cartSheet');
        sheet.classList.add('translate-y-full');
        setTimeout(() => {
            document.getElementById('cartModal').classList.add('hidden');
            document.getElementById('cartModal').classList.remove('flex');
            document.body.classList.remove('pause-animations');
        }, 500);
    },

    checkoutWhatsApp() {
        if (AppState.cart.length === 0) return showToast('السلة فارغة!', 'error');
        
        let message = "مرحباً، أود إرسال هذا الطلب من تطبيق (ألك):%0A%0A";
        let total = 0;
        
        AppState.cart.forEach(item => {
            message += `▪️ ${item.name} %0A   الكمية: ${item.quantity} | السعر: ${(item.price * item.quantity).toLocaleString('ar-IQ')} د.ع%0A`;
            total += item.price * item.quantity;
        });
        
        message += `%0A──────────────%0A*المجموع الكلي: ${total.toLocaleString('ar-IQ')} د.ع*%0A%0Aالرجاء تأكيد الطلب. شكراً لكم.`;
        window.open(`https://wa.me/${CONFIG.SHOP_PHONE}?text=${message}`, '_blank');
    },

    initCartDrag() {
        const fab = document.getElementById('floatingCartBtn');
        if (!fab || AppState.dragInitialized) return;
        
        let moved = false;
        const touchStart = (e) => { 
            moved = false; 
            fab.style.transition = 'none'; 
        };
        
        const touchMove = (e) => {
            moved = true; 
            AppState.isCartDragging = true; 
            e.preventDefault();
            
            const touch = e.touches[0];
            let newX = touch.clientX - (fab.offsetWidth / 2);
            let newY = touch.clientY - (fab.offsetHeight / 2);
            
            const maxX = window.innerWidth - fab.offsetWidth;
            const maxY = window.innerHeight - fab.offsetHeight;
            
            if (newX < 0) newX = 0; 
            if (newX > maxX) newX = maxX;
            if (newY < 0) newY = 0; 
            if (newY > maxY) newY = maxY;
            
            fab.style.left = newX + 'px'; 
            fab.style.top = newY + 'px';
            fab.style.bottom = 'auto'; 
            fab.style.right = 'auto';
        };
        
        const touchEnd = () => { 
            fab.style.transition = 'transform 0.3s ease'; 
            setTimeout(() => AppState.isCartDragging = false, 50); 
        };

        fab.addEventListener('touchstart', touchStart, { passive: false });
        fab.addEventListener('touchmove', touchMove, { passive: false });
        fab.addEventListener('touchend', touchEnd);
        
        fab.addEventListener('click', (e) => {
            if (AppState.isCartDragging || moved) { 
                e.preventDefault(); 
                return; 
            }
            this.openCart();
        });
        
        AppState.dragInitialized = true;
    }
};
