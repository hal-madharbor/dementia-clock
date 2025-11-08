// ============================================================================
// DEMENTIA CLOCK - INDEXEDDB PHOTO STORAGE
// ============================================================================
// Handles photo storage in IndexedDB instead of localStorage

const DB_NAME = 'DementiaClockPhotos';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

let db = null;

/**
 * Initialize IndexedDB
 */
function initPhotoDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
}

/**
 * Save photo to IndexedDB
 * @param {string} id - Unique ID for the photo
 * @param {string} base64 - Base64 encoded image
 * @param {string} caption - Photo caption
 * @returns {Promise}
 */
function savePhoto(id, base64, caption) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({ id, base64, caption });
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get photo from IndexedDB
 * @param {string} id - Photo ID
 * @returns {Promise<Object>} - Photo data
 */
function getPhoto(id) {
    if (!id) {
        console.error('getPhoto called without an id');
        return Promise.reject(new Error('No photo ID provided'));
    }
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Delete photo from IndexedDB
 * @param {string} id - Photo ID
 * @returns {Promise}
 */
function deletePhoto(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get all photos from IndexedDB
 * @returns {Promise<Array>} - All photos
 */
function getAllPhotos() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Clear all photos from IndexedDB
 * @returns {Promise}
 */
function clearAllPhotos() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Generate unique photo ID
 * @param {string} type - Photo type (patient/caregiver/category)
 * @param {number} index - Index in array
 * @returns {string} - Unique ID
 */
function generatePhotoId(type, index) {
    return `${type}_${index}_${Date.now()}`;
}

/**
 * Export all photos and settings
 * @returns {Promise<Blob>} - JSON blob with all data
 */
async function exportAllData() {
    const photos = await getAllPhotos();
    const settingsData = JSON.parse(localStorage.getItem('dementiaClockSettings') || '{}');
    
    const exportData = {
        version: '2.5',
        exported: new Date().toISOString(),
        settings: settingsData,
        photos: photos
    };
    
    return new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
}

/**
 * Import all photos and settings
 * @param {Object} data - Imported data
 * @returns {Promise}
 */
async function importAllData(data) {
    // Clear existing photos
    await clearAllPhotos();
    
    // Import photos
    if (data.photos && Array.isArray(data.photos)) {
        for (const photo of data.photos) {
            await savePhoto(photo.id, photo.base64, photo.caption);
        }
    }
    
    // Import settings (to localStorage)
    if (data.settings) {
        localStorage.setItem('dementiaClockSettings', JSON.stringify(data.settings));
    }
}
