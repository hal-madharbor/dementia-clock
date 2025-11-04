// ============================================================================
// DEMENTIA CLOCK - STORAGE MODULE
// ============================================================================
// Handles all localStorage operations: save, load, export, import, reset

function saveSettings() {
    try {
        localStorage.setItem('dementiaClockSettings', JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Error saving:', error);
        alert('Error saving settings.');
        return false;
    }
}

function loadSettings() {
    try {
        const saved = localStorage.getItem('dementiaClockSettings');
        if (saved) {
            const loaded = JSON.parse(saved);
            
            // Backward compatibility checks
            if (!loaded.caregiverInfo) {
                loaded.caregiverInfo = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.caregiverInfo));
            }
            if (!loaded.displayName) {
                loaded.displayName = loaded.firstName || "Patient";
            }
            if (!loaded.photo) {
                loaded.photo = null;
            }
            if (!loaded.primaryCaregiver) {
                loaded.primaryCaregiver = {
                    name: loaded.spouseName || "Caregiver",
                    displayName: loaded.spouseName || "Caregiver",
                    relationship: "Primary Caregiver",
                    phone: "",
                    photo: null
                };
            }
            if (!loaded.primaryCaregiver.displayName) {
                loaded.primaryCaregiver.displayName = loaded.primaryCaregiver.name;
            }
            if (!loaded.primaryCaregiver.phone) {
                loaded.primaryCaregiver.phone = "";
            }
            if (!loaded.primaryCaregiver.photo) {
                loaded.primaryCaregiver.photo = null;
            }
            if (!loaded.additionalCaregivers) {
                loaded.additionalCaregivers = [];
                loaded.currentCaregiverIndex = -1;
            }
            loaded.additionalCaregivers.forEach(cg => {
                if (!cg.phone) cg.phone = "";
                if (!cg.displayName) cg.displayName = cg.name;
                if (!cg.photo) cg.photo = null;
            });
            if (!loaded.specialEvents) {
                loaded.specialEvents = [];
            }
            return loaded;
        }
    } catch (error) {
        console.error('Error loading:', error);
    }
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
}

function resetSettings() {
    settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    saveSettings();
    loadSettingsIntoForm();
    updateClock();
    updateCaregiverDisplay();
}

function exportSettings() {
    try {
        const dataStr = JSON.stringify(settings, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'clock-settings.json';
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        alert('Error exporting.');
    }
}

function importSettings(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            if (confirm('Import settings?')) {
                settings = imported;
                saveSettings();
                loadSettingsIntoForm();
                updateClock();
                updateCaregiverDisplay();
                alert('Imported!');
            }
        } catch (error) {
            alert('Error importing.');
        }
    };
    reader.readAsText(file);
}
