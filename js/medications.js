// ============================================================================
// DEMENTIA CLOCK - MEDICATIONS MODULE
// ============================================================================
// Handles medication reminders, alerts, and medication list UI

function renderMedicationList() {
    const container = document.getElementById('medicationList');
    container.innerHTML = '';
    
    if (!settings.medications || settings.medications.length === 0) {
        container.innerHTML = '<p style="color: #666; padding: 1rem;">No medication times added yet.</p>';
        return;
    }
    
    settings.medications.forEach((med, index) => {
        const div = document.createElement('div');
        div.className = 'medication-item';
        div.style.display = 'block';
        div.style.padding = '1.5rem';
        div.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div>
                    <label class="form-label" style="margin-bottom: 0.25rem;">Time*</label>
                    <input type="time" class="form-input med-time-input" data-index="${index}" value="${med.time}">
                </div>
                <div>
                    <label class="form-label" style="margin-bottom: 0.25rem;">Medication Name</label>
                    <input type="text" class="form-input med-name-input" data-index="${index}" value="${med.name || ''}" placeholder="e.g., Lisinopril">
                </div>
                <div>
                    <label class="form-label" style="margin-bottom: 0.25rem;">Dosage</label>
                    <input type="text" class="form-input med-dosage-input" data-index="${index}" value="${med.dosage || ''}" placeholder="e.g., 10mg">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div>
                    <label class="form-label" style="margin-bottom: 0.25rem;">Purpose (optional)</label>
                    <input type="text" class="form-input med-purpose-input" data-index="${index}" value="${med.purpose || ''}" placeholder="e.g., Blood pressure control">
                </div>
                <div>
                    <label class="form-label" style="margin-bottom: 0.25rem;">Prescribing Doctor (optional)</label>
                    <input type="text" class="form-input med-doctor-input" data-index="${index}" value="${med.doctor || ''}" placeholder="e.g., Dr. Smith">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div>
                    <label class="form-label" style="margin-bottom: 0.25rem;">Pharmacy (optional)</label>
                    <textarea class="form-input med-pharmacy-input" data-index="${index}" rows="2" placeholder="e.g., Walgreens, 123 Main St, (555) 123-4567">${med.pharmacy || ''}</textarea>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div>
                    <label class="form-label" style="margin-bottom: 0.25rem;">Notes (optional)</label>
                    <textarea class="form-input med-notes-input" data-index="${index}" rows="3" placeholder="e.g., Take with food, may cause drowsiness">${med.notes || ''}</textarea>
                </div>
            </div>
            <div style="text-align: right;">
                <button class="btn btn-danger" data-index="${index}">Remove Medication</button>
            </div>
        `;
        container.appendChild(div);
    });
    
    // Add event listeners for inputs
    document.querySelectorAll('.med-time-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index);
            settings.medications[index].time = e.target.value;
        });
    });
    
    document.querySelectorAll('.med-name-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            const index = parseInt(e.target.dataset.index);
            settings.medications[index].name = e.target.value.trim();
        });
    });
    
    document.querySelectorAll('.med-dosage-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            const index = parseInt(e.target.dataset.index);
            settings.medications[index].dosage = e.target.value.trim();
        });
    });
    
    document.querySelectorAll('.med-purpose-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            const index = parseInt(e.target.dataset.index);
            settings.medications[index].purpose = e.target.value.trim();
        });
    });
    
    document.querySelectorAll('.med-doctor-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            const index = parseInt(e.target.dataset.index);
            settings.medications[index].doctor = e.target.value.trim();
        });
    });
    
    document.querySelectorAll('.med-pharmacy-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            const index = parseInt(e.target.dataset.index);
            settings.medications[index].pharmacy = e.target.value.trim();
        });
    });
    
    document.querySelectorAll('.med-notes-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            const index = parseInt(e.target.dataset.index);
            settings.medications[index].notes = e.target.value.trim();
        });
    });
    
    document.querySelectorAll('.medication-item .btn-danger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (confirm('Remove this medication?')) {
                settings.medications.splice(index, 1);
                renderMedicationList();
            }
        });
    });
}

function checkMedicationReminders() {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;
    
    let isWarningPhase = false;  // 30 min before → exact time
    let isActionPhase = false;   // Exact time → 30 min after
    
    if (settings.medications && settings.medications.length > 0) {
        settings.medications.forEach(med => {
            if (med.time) {
                const [medHours, medMinutes] = med.time.split(':').map(Number);
                const medTimeInMinutes = medHours * 60 + medMinutes;
                
                // Warning phase: 30 minutes before until exact time
                const warningStart = medTimeInMinutes - 30;
                const warningEnd = medTimeInMinutes;
                
                // Action phase: Exact time until 30 minutes after
                const actionStart = medTimeInMinutes;
                const actionEnd = medTimeInMinutes + 30;
                
                if (currentTimeInMinutes >= warningStart && currentTimeInMinutes < actionStart) {
                    isWarningPhase = true;
                }
                
                if (currentTimeInMinutes >= actionStart && currentTimeInMinutes <= actionEnd) {
                    isActionPhase = true;
                }
            }
        });
    }
    
    // Apply appropriate visual reminder
    if (isActionPhase) {
        // Action phase: RED + PULSING
        document.body.classList.remove('medication-warning');
        document.body.classList.add('medication-action');
    } else if (isWarningPhase) {
        // Warning phase: Yellow-orange solid
        document.body.classList.remove('medication-action');
        document.body.classList.add('medication-warning');
    } else {
        // No reminder
        document.body.classList.remove('medication-warning');
        document.body.classList.remove('medication-action');
    }
}

function initializeMedicationHandlers() {
    // Add medication button
    document.getElementById('addMedicationBtn').addEventListener('click', () => {
        if (!settings.medications) {
            settings.medications = [];
        }
        const time = prompt('Enter medication time (24-hour format, e.g., 08:00 or 14:30):');
        if (time && time.match(/^\d{1,2}:\d{2}$/)) {
            settings.medications.push({
                time: time.padStart(5, '0'),
                name: '',
                dosage: '',
                purpose: '',
                doctor: '',
                pharmacy: '',
                notes: ''
            });
            settings.medications.sort((a, b) => a.time.localeCompare(b.time));
            renderMedicationList();
        } else if (time) {
            alert('Please enter time in format HH:MM (e.g., 08:00)');
        }
    });
}
