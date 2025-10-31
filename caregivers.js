// ============================================================================
// DEMENTIA CLOCK - CAREGIVERS MODULE  
// ============================================================================
// Handles caregiver rotation button and third photo card display

function updateCaregiverDisplay() {
    const caregiverCard = document.getElementById('caregiverCard');
    const toggleBtn = document.getElementById('caregiverToggle');
    
    if (settings.additionalCaregivers.length === 0) {
        toggleBtn.style.opacity = '0.3';
        caregiverCard.style.display = 'none';
        return;
    } else {
        toggleBtn.style.opacity = '1';
    }
    
    if (settings.currentCaregiverIndex >= 0 && settings.currentCaregiverIndex < settings.additionalCaregivers.length) {
        const caregiver = settings.additionalCaregivers[settings.currentCaregiverIndex];
        caregiverCard.style.display = 'flex';
        document.getElementById('caregiverName').textContent = caregiver.displayName || caregiver.name;
        const caregiverPhotoEl = document.getElementById('caregiverPhoto');
        if (caregiver.photo) {
            caregiverPhotoEl.innerHTML = `<img src="${caregiver.photo}" alt="Caregiver">`;
        } else {
            caregiverPhotoEl.textContent = (caregiver.displayName || caregiver.name)[0];
        }
    } else {
        caregiverCard.style.display = 'none';
    }
}

function initializeCaregiverToggle() {
    document.getElementById('caregiverToggle').addEventListener('click', () => {
        if (settings.additionalCaregivers.length === 0) {
            return;
        }
        settings.currentCaregiverIndex++;
        if (settings.currentCaregiverIndex >= settings.additionalCaregivers.length) {
            settings.currentCaregiverIndex = -1;
        }
        saveSettings();
        updateCaregiverDisplay();
    });
}
