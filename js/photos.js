// ============================================================================
// DEMENTIA CLOCK - PHOTOS MODULE
// ============================================================================
// Handles photo upload, display, and removal

function handlePhotoUpload(inputElement, previewElement, imgElement, callback) {
    inputElement.click();
    inputElement.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Photo too large. Please use a photo under 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result;
                imgElement.src = base64;
                imgElement.style.display = 'block';
                previewElement.style.display = 'none';
                if (callback) callback(base64);
            };
            reader.readAsDataURL(file);
        }
    };
}

function removePhoto(previewElement, imgElement, initialText, callback) {
    imgElement.style.display = 'none';
    imgElement.src = '';
    previewElement.style.display = 'flex';
    previewElement.textContent = initialText;
    if (callback) callback(null);
}

function displayPhoto(imgElement, previewElement, base64Data, fallbackText) {
    if (base64Data) {
        imgElement.src = base64Data;
        imgElement.style.display = 'block';
        previewElement.style.display = 'none';
    } else {
        imgElement.style.display = 'none';
        previewElement.style.display = 'flex';
        previewElement.textContent = fallbackText;
    }
}

// Initialize photo upload handlers
function initializePhotoHandlers() {
    document.getElementById('patientPhotoChoose').addEventListener('click', () => {
        handlePhotoUpload(
            document.getElementById('patientPhotoInput'),
            document.getElementById('patientPhotoPreview'),
            document.getElementById('patientPhotoImg'),
            (base64) => { settings.photo = base64; }
        );
    });
    
    document.getElementById('patientPhotoRemove').addEventListener('click', () => {
        removePhoto(
            document.getElementById('patientPhotoPreview'),
            document.getElementById('patientPhotoImg'),
            settings.displayName[0] || 'P',
            (val) => { settings.photo = val; }
        );
    });
    
    document.getElementById('primaryCaregiverPhotoChoose').addEventListener('click', () => {
        handlePhotoUpload(
            document.getElementById('primaryCaregiverPhotoInput'),
            document.getElementById('primaryCaregiverPhotoPreview'),
            document.getElementById('primaryCaregiverPhotoImg'),
            (base64) => { settings.primaryCaregiver.photo = base64; }
        );
    });
    
    document.getElementById('primaryCaregiverPhotoRemove').addEventListener('click', () => {
        removePhoto(
            document.getElementById('primaryCaregiverPhotoPreview'),
            document.getElementById('primaryCaregiverPhotoImg'),
            settings.primaryCaregiver.displayName[0] || 'C',
            (val) => { settings.primaryCaregiver.photo = val; }
        );
    });
}
