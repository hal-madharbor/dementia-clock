// ============================================================================
// DEMENTIA CLOCK - MAIN INITIALIZATION MODULE
// ============================================================================
// Coordinates initialization of all other modules and starts the application

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // CRITICAL: Initialize settings FIRST before any other modules use it
    settings = loadSettings();
    
    // Now initialize all handlers (they can safely access settings)
    initializePhotoHandlers();
    initializeClock();
    initializeCaregiverToggle();
    initializeMedicationHandlers();
    initializeSpecialEventsHandlers();
    initializeSettingsHandlers();
    initializeInfoPanelHandlers();
    
    // Initial display update
    updateClock();
    updateCaregiverDisplay();
    checkMedicationReminders();
    
    console.log('Dementia Clock initialized successfully');
});
