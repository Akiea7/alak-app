// js/features/searchController.js
import { AppState } from '../core/appState.js';
import { MapController } from './mapController.js';

export const SearchController = {
    handleSearch(query) {
        const clearBtn = document.getElementById('clearSearch');
        const resultsDiv = document.getElementById('searchResults');
        if (query.length > 0) { clearBtn.classList.remove('hidden'); } 
        else { clearBtn.classList.add('hidden'); resultsDiv.classList.add('hidden'); return; }

        clearTimeout(AppState.searchTimeout);
        AppState.searchTimeout = setTimeout(() => {
            if (!query) return;
            const request = {
                input: query, componentRestrictions: { country: 'iq' },
                locationBias: { radius: 10000, center: AppState.currentLocation }
            };
            AppState.autocompleteService.getPlacePredictions(request, (predictions, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                    resultsDiv.innerHTML = predictions.map(place => `
                        <div class="search-result glass rounded-xl p-3 mb-2 cursor-pointer border border-white/5" onclick="selectSearchResult('${place.place_id}', '${place.structured_formatting?.main_text || place.description.replace(/'/g, "\\'")}')">
                            <div class="flex items-start gap-3">
                                <div class="w-10 h-10 rounded-xl bg-gold-400/20 flex items-center justify-center flex-shrink-0">
                                    <svg class="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-bold text-sm truncate text-white">${place.structured_formatting?.main_text || place.description}</p>
                                    <p class="text-xs text-white/60 truncate font-semibold">${place.structured_formatting?.secondary_text || ''}</p>
                                </div>
                            </div>
                        </div>`).join('');
                    resultsDiv.classList.remove('hidden');
                } else {
                    resultsDiv.innerHTML = '<div class="text-center text-white/60 text-sm py-4 font-semibold">لا توجد نتائج مطابقة</div>';
                    resultsDiv.classList.remove('hidden');
                }
            });
        }, 600);
    },

    selectSearchResult(placeId, name) {
        document.getElementById('searchResults').classList.add('hidden');
        document.getElementById('searchInput').value = '';
        document.getElementById('clearSearch').classList.add('hidden');

        AppState.placesService.getDetails({ placeId: placeId, fields: ['geometry', 'name', 'formatted_address'] }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place.geometry && place.geometry.location) {
                AppState.map.panTo(place.geometry.location);
                AppState.map.setZoom(16);
                MapController.reverseGeocode(place.geometry.location.lat(), place.geometry.location.lng());
            }
        });
    },

    clearSearch() {
        document.getElementById('searchInput').value = '';
        document.getElementById('searchResults').classList.add('hidden');
        document.getElementById('clearSearch').classList.add('hidden');
    }
};
