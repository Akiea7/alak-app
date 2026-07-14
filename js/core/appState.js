// js/core/appState.js
import { CONFIG } from './config.js';

export const AppState = {
    currentLocation: { lat: 33.6702, lng: 44.3794 }, // مركز الطارمية
    map: null, geocoder: null, autocompleteService: null, placesService: null,
    selectionType: 'destination',
    pickupLocation: null, destinationLocation: null,
    searchTimeout: null, estimatedTripPrice: 0,
    cart: [],
    isCartDragging: false, dragInitialized: false,
    userUploadedImage: null,
    
    mockStoreProducts: [
        { id: 1, name: "حليب المدهش مجفف 400 غرام", price: 6500, desc: "حليب مجفف كامل الدسم مدعم بالفيتامينات", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop" },
        { id: 2, name: "أرز بسمتي هندي درجة أولى 5 كغم", price: 11000, desc: "أرز حبة طويلة ممتاز للطبخ والمناسبات", image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=200&h=200&fit=crop" }
    ],
    mockStoreOrders: [
        { id: 1084, customer: "ستار جبار", items: "2x زيت، 1x أرز", total: 17500, status: "new" }
    ]
};
