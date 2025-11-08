// ============================================================================
// DEMENTIA CLOCK - STORAGE MODULE
// ============================================================================
// Handles all localStorage operations: save, load, export, import, reset
// Includes backward compatibility for special events migration

function saveSettings() {
    try {
        localStorage.setItem('dementiaClockSettings', JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Error saving:', error);
        if (error.name === 'QuotaExceededError') {
            const usage = getStorageUsage();
            alert(`Storage Limit Exceeded!\n\nYou've used ${usage.usedMB}MB of available storage.\n\nTo fix this:\n• Remove photos from galleries\n• Delete unused flashcard categories\n• Use fewer/smaller images\n\nThe app will continue working, but changes cannot be saved until you free up space.`);
        } else {
            alert('Error saving settings.');
        }
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
            if (!loaded.photoGallery) {
                loaded.photoGallery = [];
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
            if (!loaded.primaryCaregiver.photoGallery) {
                loaded.primaryCaregiver.photoGallery = [];
            }
            if (!loaded.additionalCaregivers) {
                loaded.additionalCaregivers = [];
                loaded.currentCaregiverIndex = -1;
            }
            loaded.additionalCaregivers.forEach(cg => {
                if (!cg.phone) cg.phone = "";
                if (!cg.displayName) cg.displayName = cg.name;
                if (!cg.photo) cg.photo = null;
                if (!cg.photoGallery) cg.photoGallery = [];
            });
            
            // Migrate old special events format to new format
            if (loaded.specialEvents) {
                // Check if it's the old format (arrays with date strings)
                if (loaded.specialEvents.birthdays && loaded.specialEvents.birthdays.length > 0) {
                    const firstBirthday = loaded.specialEvents.birthdays[0];
                    if (typeof firstBirthday.date === 'string') {
                        // Old format detected - migrate
                        console.log('Migrating special events to new format...');
                        
                        const newSpecialEvents = {
                            birthdays: [],
                            annualHolidays: [],
                            floatingHolidays: [],
                            specialOccasions: []
                        };
                        
                        // Migrate old birthdays
                        if (loaded.specialEvents.birthdays) {
                            loaded.specialEvents.birthdays.forEach(event => {
                                const [month, day, year] = event.date.split('/').map(Number);
                                newSpecialEvents.birthdays.push({
                                    name: event.name,
                                    month: month,
                                    day: day,
                                    year: year || null,
                                    note: event.note || ""
                                });
                            });
                        }
                        
                        // Migrate old holidays (assume annual unless has year)
                        if (loaded.specialEvents.holidays) {
                            loaded.specialEvents.holidays.forEach(event => {
                                const parts = event.date.split('/').map(Number);
                                const month = parts[0];
                                const day = parts[1];
                                const year = parts[2];
                                
                                if (year) {
                                    // Has year - floating holiday
                                    newSpecialEvents.floatingHolidays.push({
                                        name: event.name,
                                        month: month,
                                        day: day,
                                        year: year,
                                        note: event.note || ""
                                    });
                                } else {
                                    // No year - annual holiday
                                    newSpecialEvents.annualHolidays.push({
                                        name: event.name,
                                        month: month,
                                        day: day,
                                        note: event.note || ""
                                    });
                                }
                            });
                        }
                        
                        loaded.specialEvents = newSpecialEvents;
                        console.log('Migration complete');
                    }
                }
            }
            
            // Ensure new special events structure exists
            if (!loaded.specialEvents) {
                loaded.specialEvents = {
                    birthdays: [],
                    annualHolidays: [],
                    floatingHolidays: [],
                    specialOccasions: []
                };
            }
            if (!loaded.specialEvents.birthdays) loaded.specialEvents.birthdays = [];
            if (!loaded.specialEvents.annualHolidays) loaded.specialEvents.annualHolidays = [];
            if (!loaded.specialEvents.floatingHolidays) loaded.specialEvents.floatingHolidays = [];
            if (!loaded.specialEvents.specialOccasions) loaded.specialEvents.specialOccasions = [];
            
            // Ensure flashcards structure exists
            if (!loaded.flashcards) {
                loaded.flashcards = {
                    displayMode: 'single',
                    rotationInterval: 10,
                    autoRotate: true,
                    categories: []
                };
            }
            if (!loaded.flashcards.categories) loaded.flashcards.categories = [];
            if (loaded.flashcards.displayMode === undefined) loaded.flashcards.displayMode = 'single';
            if (loaded.flashcards.rotationInterval === undefined) loaded.flashcards.rotationInterval = 10;
            if (loaded.flashcards.autoRotate === undefined) loaded.flashcards.autoRotate = true;
            
            // Clear old photo gallery data (now using IndexedDB with IDs)
            if (loaded.photoGallery && loaded.photoGallery.some(item => item.image && !item.id)) {
                console.log('Clearing old photo format from patient gallery');
                loaded.photoGallery = [];
            }
            if (loaded.primaryCaregiver.photoGallery && loaded.primaryCaregiver.photoGallery.some(item => item.image && !item.id)) {
                console.log('Clearing old photo format from primary caregiver');
                loaded.primaryCaregiver.photoGallery = [];
            }
            loaded.additionalCaregivers.forEach((cg, idx) => {
                if (cg.photoGallery && cg.photoGallery.some(item => item.image && !item.id)) {
                    console.log('Clearing old photo format from caregiver', idx);
                    cg.photoGallery = [];
                }
            });
            if (loaded.flashcards.categories) {
                loaded.flashcards.categories.forEach((cat, idx) => {
                    if (cat.cards && cat.cards.some(item => item.image && !item.id)) {
                        console.log('Clearing old photo format from category', idx);
                        cat.cards = [];
                    }
                });
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

async function exportSettings() {
    try {
        const blob = await exportAllData();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'clock-settings.json';
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Export error:', error);
        alert('Error exporting.');
    }
}

function importSettings(file) {
    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            if (confirm('Import settings? This will replace your current settings.')) {
                // Import using IndexedDB
                await importAllData(imported);
                
                // Reload settings
                settings = loadSettings();
                
                // Update all UI elements
                loadSettingsIntoForm();
                updateClock();
                updateCaregiverDisplay();
                alert('Settings imported successfully!');
            }
        } catch (error) {
            console.error('Import error:', error);
            alert('Error importing. Make sure this is a valid settings file.');
        }
    };
    reader.readAsText(file);
}
