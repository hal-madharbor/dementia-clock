// ============================================================================
// DEMENTIA CLOCK - IMAGE COMPRESSION UTILITY
// ============================================================================
// Compresses images before storing to avoid localStorage quota issues

/**
 * Compresses an image to reduce storage size
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width in pixels (default 800)
 * @param {number} maxHeight - Maximum height in pixels (default 800)
 * @param {number} quality - JPEG quality 0-1 (default 0.7)
 * @returns {Promise<string>} - Base64 encoded compressed image
 */
function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                // Calculate new dimensions maintaining aspect ratio
                let width = img.width;
                let height = img.height;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round(height * maxWidth / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round(width * maxHeight / height);
                        height = maxHeight;
                    }
                }
                
                // Create canvas and draw resized image
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to base64 with compression
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                
                // Log compression results
                const originalSize = (e.target.result.length * 0.75 / 1024).toFixed(0); // Approximate KB
                const compressedSize = (compressedBase64.length * 0.75 / 1024).toFixed(0);
                console.log(`Image compressed: ${originalSize}KB → ${compressedSize}KB (${Math.round((1 - compressedSize/originalSize) * 100)}% reduction)`);
                
                resolve(compressedBase64);
            };
            
            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };
            
            img.src = e.target.result;
        };
        
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsDataURL(file);
    });
}

/**
 * Estimates current localStorage usage
 * @returns {Object} - Usage statistics
 */
function getStorageUsage() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length + key.length;
        }
    }
    
    const usedKB = Math.round(total / 1024);
    const usedMB = (usedKB / 1024).toFixed(2);
    const estimatedLimit = 5120; // 5MB typical limit
    const percentUsed = Math.round((usedKB / estimatedLimit) * 100);
    
    return {
        usedKB,
        usedMB,
        percentUsed,
        estimatedLimitMB: (estimatedLimit / 1024).toFixed(0)
    };
}

/**
 * Checks if there's enough storage space
 * @param {number} additionalKB - KB to be added
 * @returns {boolean} - True if space available
 */
function hasStorageSpace(additionalKB = 500) {
    const usage = getStorageUsage();
    const estimatedLimit = 5120; // 5MB
    return (usage.usedKB + additionalKB) < estimatedLimit;
}

/**
 * Displays storage warning to user
 */
function showStorageWarning() {
    const usage = getStorageUsage();
    alert(`Storage Warning!\n\nYou're using ${usage.usedMB}MB of approximately ${usage.estimatedLimitMB}MB available.\n\nTo free up space:\n• Remove unused photos from galleries\n• Delete old flashcard categories\n• Export your settings as backup, then reset and re-import`);
}
