// ============================================================================
// DEMENTIA CLOCK - SETTINGS UI MODULE
// ============================================================================
// Handles settings panel display, form population, and user interactions

function loadSettingsIntoForm() {
    // Personal info
    document.getElementById('firstName').value = settings.firstName;
    document.getElementById('lastName').value = settings.lastName;
    document.getElementById('displayName').value = settings.displayName;
    document.getElementById('primaryCaregiverName').value = settings.primaryCaregiver.name;
    document.getElementById('primaryCaregiverDisplayName').value = settings.primaryCaregiver.displayName;
    document.getElementById('primaryCaregiverRelationship').value = settings.primaryCaregiver.relationship;
    document.getElementById('primaryCaregiverPhone').value = settings.primaryCaregiver.phone;
    
    // Display photos
    displayPhoto(
        document.getElementById('patientPhotoImg'),
        document.getElementById('patientPhotoPreview'),
        settings.photo,
        settings.displayName[0] || 'P'
    );
    
    displayPhoto(
        document.getElementById('primaryCaregiverPhotoImg'),
        document.getElementById('primaryCaregiverPhotoPreview'),
        settings.primaryCaregiver.photo,
        settings.primaryCaregiver.displayName[0] || 'C'
    );
    
    // Schedule
    const scheduleInputs = document.querySelectorAll('#schedule .schedule-item');
    settings.schedule.forEach((item, index) => {
        const row = scheduleInputs[index + 1];
        if (row) {
            const inputs = row.querySelectorAll('.form-input');
            inputs[0].value = item.start;
            inputs[1].value = item.end;
            inputs[2].value = item.label;
        }
    });
    
    // Caregivers
    renderCaregiverList();
    
    // Caregiver info
    document.getElementById('emergencyContact1Name').value = settings.caregiverInfo.emergencyContacts.contact1.name || '';
    document.getElementById('emergencyContact1Phone').value = settings.caregiverInfo.emergencyContacts.contact1.phone || '';
    document.getElementById('emergencyContact1Note').value = settings.caregiverInfo.emergencyContacts.contact1.note || '';
    document.getElementById('emergencyContact2Name').value = settings.caregiverInfo.emergencyContacts.contact2.name || '';
    document.getElementById('emergencyContact2Phone').value = settings.caregiverInfo.emergencyContacts.contact2.phone || '';
    document.getElementById('emergencyContact2Note').value = settings.caregiverInfo.emergencyContacts.contact2.note || '';
    document.getElementById('primaryPhysicianName').value = settings.caregiverInfo.medicalTeam.primaryPhysician.name || '';
    document.getElementById('primaryPhysicianPhone').value = settings.caregiverInfo.medicalTeam.primaryPhysician.phone || '';
    document.getElementById('primaryPhysicianNote').value = settings.caregiverInfo.medicalTeam.primaryPhysician.note || '';
    document.getElementById('preferredHospital').value = settings.caregiverInfo.medicalTeam.preferredHospital || '';
    document.getElementById('poaName').value = settings.caregiverInfo.legal.poa.name || '';
    document.getElementById('poaPhone').value = settings.caregiverInfo.legal.poa.phone || '';
    document.getElementById('poaNote').value = settings.caregiverInfo.legal.poa.note || '';
    document.getElementById('dnrStatus').value = settings.caregiverInfo.legal.dnrStatus || '';
    document.getElementById('allergies').value = settings.caregiverInfo.medical.allergies || '';
    document.getElementById('conditions').value = settings.caregiverInfo.medical.conditions || '';
    
    // Medications
    renderMedicationList();
    
    // Special Events - removed old call, now renders when tab clicked
}

function saveFormToSettings() {
    // Personal info
    settings.firstName = document.getElementById('firstName').value.trim();
    settings.lastName = document.getElementById('lastName').value.trim();
    settings.displayName = document.getElementById('displayName').value.trim() || settings.firstName;
    settings.primaryCaregiver.name = document.getElementById('primaryCaregiverName').value.trim();
    settings.primaryCaregiver.displayName = document.getElementById('primaryCaregiverDisplayName').value.trim() || settings.primaryCaregiver.name;
    settings.primaryCaregiver.relationship = document.getElementById('primaryCaregiverRelationship').value.trim();
    settings.primaryCaregiver.phone = document.getElementById('primaryCaregiverPhone').value.trim();
    
    // Schedule
    const scheduleInputs = document.querySelectorAll('#schedule .schedule-item');
    settings.schedule = [];
    scheduleInputs.forEach((row, index) => {
        if (index === 0) return; // Skip header row
        const inputs = row.querySelectorAll('.form-input');
        settings.schedule.push({
            start: inputs[0].value,
            end: inputs[1].value,
            label: inputs[2].value.trim()
        });
    });
    
    // Caregiver info
    settings.caregiverInfo.emergencyContacts.contact1.name = document.getElementById('emergencyContact1Name').value.trim();
    settings.caregiverInfo.emergencyContacts.contact1.phone = document.getElementById('emergencyContact1Phone').value.trim();
    settings.caregiverInfo.emergencyContacts.contact1.note = document.getElementById('emergencyContact1Note').value.trim();
    settings.caregiverInfo.emergencyContacts.contact2.name = document.getElementById('emergencyContact2Name').value.trim();
    settings.caregiverInfo.emergencyContacts.contact2.phone = document.getElementById('emergencyContact2Phone').value.trim();
    settings.caregiverInfo.emergencyContacts.contact2.note = document.getElementById('emergencyContact2Note').value.trim();
    settings.caregiverInfo.medicalTeam.primaryPhysician.name = document.getElementById('primaryPhysicianName').value.trim();
    settings.caregiverInfo.medicalTeam.primaryPhysician.phone = document.getElementById('primaryPhysicianPhone').value.trim();
    settings.caregiverInfo.medicalTeam.primaryPhysician.note = document.getElementById('primaryPhysicianNote').value.trim();
    settings.caregiverInfo.medicalTeam.preferredHospital = document.getElementById('preferredHospital').value.trim();
    settings.caregiverInfo.legal.poa.name = document.getElementById('poaName').value.trim();
    settings.caregiverInfo.legal.poa.phone = document.getElementById('poaPhone').value.trim();
    settings.caregiverInfo.legal.poa.note = document.getElementById('poaNote').value.trim();
    settings.caregiverInfo.legal.dnrStatus = document.getElementById('dnrStatus').value;
    settings.caregiverInfo.medical.allergies = document.getElementById('allergies').value.trim();
    settings.caregiverInfo.medical.conditions = document.getElementById('conditions').value.trim();
    
    return saveSettings();
}

function renderCaregiverList() {
    const container = document.querySelector('.caregiver-list');
    container.innerHTML = '';
    
    if (settings.additionalCaregivers.length === 0) {
        container.innerHTML = '<p style="color: #666; padding: 1rem;">No additional caregivers added yet.</p>';
        return;
    }
    
    settings.additionalCaregivers.forEach((caregiver, index) => {
        const item = document.createElement('div');
        item.className = 'caregiver-item';
        
        const photoPreview = caregiver.photo 
            ? `<img src="${caregiver.photo}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">` 
            : `<div class="photo-preview" style="width: 80px; height: 80px; font-size: 2rem;">${(caregiver.displayName || caregiver.name)[0]}</div>`;
        
        item.innerHTML = `
            ${photoPreview}
            <div style="flex: 1;">
                <input type="text" class="form-input caregiver-name-input" data-index="${index}" value="${caregiver.name}" placeholder="Full Name" style="margin-bottom: 0.5rem;">
                <input type="text" class="form-input caregiver-displayname-input" data-index="${index}" value="${caregiver.displayName || ''}" placeholder="Display Name" style="margin-bottom: 0.5rem;">
                <input type="text" class="form-input caregiver-relationship-input" data-index="${index}" value="${caregiver.relationship || ''}" placeholder="Relationship" style="margin-bottom: 0.5rem;">
                <input type="tel" class="form-input caregiver-phone-input" data-index="${index}" value="${caregiver.phone || ''}" placeholder="Phone">
            </div>
            <button class="btn btn-secondary caregiver-photo-btn" data-index="${index}">📷 Photo</button>
            <button class="btn btn-danger remove-caregiver-btn" data-index="${index}">✕</button>
        `;
        container.appendChild(item);
    });
    
    // Event listeners
    document.querySelectorAll('.remove-caregiver-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            settings.additionalCaregivers.splice(index, 1);
            if (settings.currentCaregiverIndex >= settings.additionalCaregivers.length) {
                settings.currentCaregiverIndex = -1;
            }
            renderCaregiverList();
            updateCaregiverDisplay();
        });
    });
    
    document.querySelectorAll('.caregiver-photo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (evt) => {
                const file = evt.target.files[0];
                if (file) {
                    if (file.size > 2 * 1024 * 1024) {
                        alert('Photo too large. Please use under 2MB.');
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        settings.additionalCaregivers[index].photo = event.target.result;
                        renderCaregiverList();
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    });
    
    document.querySelectorAll('.caregiver-name-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            const index = parseInt(e.target.dataset.index);
            const name = e.target.value.trim();
            if (name) {
                settings.additionalCaregivers[index].name = name;
            }
        });
    });
    
    document.querySelectorAll('.caregiver-displayname-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            const index = parseInt(e.target.dataset.index);
            settings.additionalCaregivers[index].displayName = e.target.value.trim() || settings.additionalCaregivers[index].name;
            renderCaregiverList();
        });
    });
    
    document.querySelectorAll('.caregiver-relationship-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            const index = parseInt(e.target.dataset.index);
            settings.additionalCaregivers[index].relationship = e.target.value.trim();
        });
    });
    
    document.querySelectorAll('.caregiver-phone-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            const index = parseInt(e.target.dataset.index);
            settings.additionalCaregivers[index].phone = e.target.value.trim();
        });
    });
}

function initializeSettingsHandlers() {
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
            
            // Render special events tab when activated
            if (tab.dataset.tab === 'events') {
                renderSpecialEventsTab();
            }
            
            // Render flashcards tab when activated
            if (tab.dataset.tab === 'flashcards') {
                renderFlashcardsTab();
            }
        });
    });
    
    // Settings button
    document.getElementById('settingsBtn').addEventListener('click', () => {
        loadSettingsIntoForm();
        document.getElementById('settingsPanel').classList.add('active');
        document.getElementById('homeBtn').classList.add('visible');
    });
    
    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', () => {
        if (confirm('Discard unsaved changes?')) {
            document.getElementById('settingsPanel').classList.remove('active');
            document.getElementById('homeBtn').classList.remove('visible');
        }
    });
    
    // Save button
    document.getElementById('saveBtn').addEventListener('click', () => {
        if (saveFormToSettings()) {
            alert('Settings saved!');
            updateClock();
            updateCaregiverDisplay();
            document.getElementById('settingsPanel').classList.remove('active');
            document.getElementById('homeBtn').classList.remove('visible');
        }
    });
    
    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Reset all settings to defaults? This cannot be undone.')) {
            resetSettings();
            alert('Settings reset to defaults.');
        }
    });
    
    // Export button
    document.getElementById('exportBtn').addEventListener('click', () => {
        exportSettings();
    });
    
    // Import button
    document.getElementById('importBtn').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                importSettings(file);
            }
        };
        input.click();
    });
    
    // Add caregiver button
    document.getElementById('addCaregiverBtn').addEventListener('click', () => {
        const newName = prompt('Enter full name:');
        if (newName && newName.trim()) {
            const displayName = prompt('Display name (or leave blank to use full name):');
            const relationship = prompt('Relationship (e.g., Daughter, Son, Neighbor):');
            const phone = prompt('Phone number:');
            settings.additionalCaregivers.push({
                name: newName.trim(),
                displayName: displayName ? displayName.trim() : newName.trim(),
                relationship: relationship ? relationship.trim() : '',
                phone: phone ? phone.trim() : '',
                photo: null
            });
            renderCaregiverList();
        }
    });
}
