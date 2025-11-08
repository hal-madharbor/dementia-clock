// ============================================================================
// DEMENTIA CLOCK - MAIN INITIALIZATION MODULE
// ============================================================================
// Coordinates initialization of all other modules and starts the application

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // CRITICAL: Initialize IndexedDB FIRST
    await initPhotoDatabase();
    
    // Then initialize settings
    settings = loadSettings();
    
    // Now initialize all handlers (they can safely access settings)
    initializePhotoHandlers();
    initializeClock();
    initializeCaregiverToggle();
    initializeMedicationHandlers();
    initializeFlashcardHandlers();
    initializeSettingsHandlers();
    initializeInfoPanelHandlers();
    
    // Initial display update
    updateClock();
    updateCaregiverDisplay();
    checkMedicationReminders();
    
    console.log('Dementia Clock initialized successfully');
});
