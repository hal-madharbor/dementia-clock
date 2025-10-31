// ============================================================================
// DEMENTIA CLOCK - MAIN INITIALIZATION MODULE
// ============================================================================
// Coordinates initialization of all other modules and starts the application

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all handlers
    initializePhotoHandlers();
    initializeClock();
    initializeCaregiverToggle();
    initializeMedicationHandlers();
    initializeSettingsHandlers();
    initializeInfoPanelHandlers();
    
    // Initial display update
    updateClock();
    updateCaregiverDisplay();
    checkMedicationReminders();
    
    console.log('Dementia Clock initialized successfully');
});
