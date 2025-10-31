// ============================================================================
// DEMENTIA CLOCK - CLOCK DISPLAY MODULE
// ============================================================================
// Handles time display, day of week, activity labels, and background colors

function timeToHour(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + minutes / 60;
}

function getActivity(hours) {
    const currentTime = hours;
    for (let i = 0; i < settings.schedule.length; i++) {
        const item = settings.schedule[i];
        const start = timeToHour(item.start);
        const end = timeToHour(item.end);
        if (start > end) {
            // Wraps around midnight
            if (currentTime >= start || currentTime < end) {
                return item.label;
            }
        } else {
            if (currentTime >= start && currentTime < end) {
                return item.label;
            }
        }
    }
    return settings.schedule[settings.schedule.length - 1].label;
}

function getBackgroundColor(hours) {
    if (hours >= 6 && hours < 12) return 'bg-morning';
    if (hours >= 12 && hours < 17) return 'bg-afternoon';
    if (hours >= 17 && hours < 22) return 'bg-evening';
    return 'bg-night';
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const isPM = hours >= 12;
    const displayHours = hours % 12 || 12;
    
    const dayAbbrev = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayAbbrev[now.getDay()];
    
    const timeStr = String(displayHours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
    const periodStr = isPM ? 'PM' : 'AM';
    
    const currentHourDecimal = hours + minutes / 60;
    const activity = getActivity(currentHourDecimal);
    const bgClass = getBackgroundColor(hours);
    
    // Update display elements
    document.getElementById('day').textContent = dayName;
    document.getElementById('time').textContent = timeStr;
    document.getElementById('period').textContent = periodStr;
    document.getElementById('activity').textContent = activity;
    document.body.className = bgClass;
    
    // Re-check medication reminders
    checkMedicationReminders();
    
    // Update patient display
    document.getElementById('patientName').textContent = settings.displayName;
    const patientPhotoEl = document.getElementById('patientPhoto');
    if (settings.photo) {
        patientPhotoEl.innerHTML = `<img src="${settings.photo}" alt="Patient">`;
    } else {
        patientPhotoEl.textContent = settings.displayName[0] || 'P';
    }
    
    // Update primary caregiver display
    document.getElementById('spouseName').textContent = settings.primaryCaregiver.displayName;
    const spousePhotoEl = document.getElementById('spousePhoto');
    if (settings.primaryCaregiver.photo) {
        spousePhotoEl.innerHTML = `<img src="${settings.primaryCaregiver.photo}" alt="Caregiver">`;
    } else {
        spousePhotoEl.textContent = settings.primaryCaregiver.displayName[0] || 'C';
    }
}

// Initialize clock and set update interval
function initializeClock() {
    updateClock();
    setInterval(updateClock, 1000);
}
