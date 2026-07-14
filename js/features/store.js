// js/features/store.js
import { AppState } from '../core/appState.js';
import { showToast } from '../utils/helpers.js';

export const Store = {
    renderStoreData() {
        this.updateStoreProductsUI();
        this.updateStoreOrdersUI();
        const prodCountEl = document.getElementById('dash-products-count');
        const orderCountEl = document.getElementById('dash-orders-count');
        if(prodCountEl) prodCountEl.textContent = AppState.mockStoreProducts.length;
        if(orderCountEl) orderCountEl.textContent = AppState.mockStoreOrders.filter(o => o.status !== 'ready').length;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    switchStoreSubView(viewId) {
        document.getElementById('store-home-view').classList.add('hidden');
        document.getElementById('store-products-view').classList.add('hidden');
        document.getElementById('store-orders-view').classList.add('hidden');
        document.getElementById('store-offers-view').classList.add('hidden');
        
        document.getElementById(`store-${viewId}-view`).classList.remove('hidden');
        if(viewId === 'home') this.renderStoreData();
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    previewProductImage(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('imagePreview').src = e.target.result;
                document.getElementById('imagePreviewContainer').classList.remove('hidden');
                document.getElementById('uploadImageLabel').classList.add('hidden');
                AppState.userUploadedImage = e.target.result;
            }
            reader.readAsDataURL(input.files[0]);
        }
    },

    removeProductImage() {
        document.getElementById('newProdImage').value = '';
        document.getElementById('imagePreviewContainer').classList.add('hidden');
        document.getElementById('uploadImageLabel').classList.remove('hidden');
        AppState.userUploadedImage = null;
    },

    addNewStoreProduct() {
        const nameInput = document.getElementById('newProdName');
        const priceInput = document.getElementById('newProdPrice');
        const descInput = document.getElementById('newProdDesc');
        
        if(!nameInput || !priceInput) return;
        
        const name = nameInput.value.trim();
        const price = parseInt(priceInput.value.trim());
        const desc = descInput ? descInput.value.trim() : '';
        
        if(name.length < 3) return showToast('يرجى إدخال اسم المنتج بشكل صحيح', 'error');
        if(!price || price <= 0) return showToast('يرجى إدخال السعر الصحيح', 'error');
        
        const finalImage = AppState.userUploadedImage || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=200&fit=crop';
        const newProd = {
            id: Date.now(), name: name, price: price, desc: desc, image: finalImage
        };
        
        AppState.mockStoreProducts.unshift(newProd);
        
        nameInput.value = '';
        priceInput.value = '';
        if(descInput) descInput.value = '';
        this.removeProductImage(); 
        
        this.updateStoreProductsUI();
        showToast(`تم نشر (${name}) بمتجرك بنجاح!`, 'success');
    },

    deleteStoreProduct(prodId) {
        AppState.mockStoreProducts = AppState.mockStoreProducts.filter(p => p.id !== prodId);
        this.updateStoreProductsUI();
        showToast('تم حذف المنتج', 'error');
    },

    updateStoreProductsUI() {
        const container = document.getElementById('store-products-list-container');
        if(!container) return;
        container.innerHTML = AppState.mockStoreProducts.map(prod => `
            <div class="bg-[#0A1628] border border-white/5 rounded-2xl p-3 flex gap-3 items-center transform-gpu">
                <img src="${prod.image || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=200&fit=crop'}" class="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0 shadow-lg">
                <div class="text-right flex-1 min-w-0">
                    <h4 class="font-bold text-white text-xs mb-1 truncate">${prod.name}</h4>
                    <p class="text-[9px] text-white/50 mb-1 truncate">${prod.desc || 'لا يوجد وصف'}</p>
                    <p class="text-xs font-black text-gold-400">${prod.price.toLocaleString('ar-IQ')} <span class="text-[9px] text-white/50">د.ع</span></p>
                </div>
                <button onclick="deleteStoreProduct(${prod.id})" class="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition shrink-0">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `).join('');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    updateStoreOrdersUI() {
        const container = document.getElementById('store-orders-list-container');
        if(!container) return;
        
        if(AppState.mockStoreOrders.length === 0 || AppState.mockStoreOrders.filter(o => o.status !== 'ready').length === 0) {
            container.innerHTML = `<div class="text-center text-white/40 py-8 text-xs font-bold">لا توجد طلبات واردة حالياً</div>`;
            return;
        }
        
        container.innerHTML = AppState.mockStoreOrders.map(order => {
            if(order.status === 'ready') return ''; 
            
            let statusBadge = `<span class="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded text-[9px] font-bold">طلب جديد</span>`;
            let actionBtn = `
                <button onclick="changeMockOrderStatus(${order.id}, 'preparing')" class="w-full bg-gold-400 text-[#060F1D] font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1">
                    <i data-lucide="check" class="w-4 h-4"></i> قبول وتجهيز الطلب
                </button>
            `;
            
            if(order.status === 'preparing') {
                statusBadge = `<span class="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded text-[9px] font-bold animate-pulse">جاري التجهيز...</span>`;
                actionBtn = `
                    <button onclick="changeMockOrderStatus(${order.id}, 'ready')" class="w-full bg-emerald-500 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1">
                        <i data-lucide="truck" class="w-4 h-4"></i> تسليم لـ مندوب ألك
                    </button>
                `;
            }

            return `
                <div class="bg-[#0A1628] border border-gold-400/20 rounded-2xl p-4 space-y-3 transform-gpu">
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-black text-white">طلب #${order.id}</span>
                        ${statusBadge}
                    </div>
                    <div class="text-right text-xs space-y-1">
                        <p class="text-white/50 font-semibold">الزبون: <span class="text-white font-bold">${order.customer}</span></p>
                        <p class="text-white/50 font-semibold">المشتريات: <span class="text-white font-bold">${order.items}</span></p>
                        <p class="text-white/50 font-semibold">المجموع: <span class="text-gold-400 font-black">${order.total.toLocaleString('ar-IQ')} د.ع</span></p>
                    </div>
                    <div class="pt-2 border-t border-white/5">
                        ${actionBtn}
                    </div>
                </div>
            `;
        }).join('');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    changeMockOrderStatus(orderId, nextStatus) {
        const order = AppState.mockStoreOrders.find(o => o.id === orderId);
        if(order) {
            order.status = nextStatus;
            this.updateStoreOrdersUI();
            if(nextStatus === 'preparing') {
                showToast('تم قبول الطلب وطباعة الفاتورة بالمطبخ!');
            } else if(nextStatus === 'ready') {
                showToast('تم تسليم الطلب للمندوب بنجاح 🛵', 'success');
            }
        }
    }
};
