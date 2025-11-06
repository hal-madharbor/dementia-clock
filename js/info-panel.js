// ============================================================================
// DEMENTIA CLOCK - INFO PANEL MODULE
// ============================================================================
// Handles caregiver information panel display and interaction

let infoAutoCloseTimer = null;

function openCaregiverInfo() {
    renderCaregiverInfo();
    document.getElementById('caregiverInfoPanel').classList.add('active');
    document.getElementById('homeBtn').classList.add('visible');
    
    // Auto-close after 5 minutes
    infoAutoCloseTimer = setTimeout(() => {
        closeCaregiverInfo();
    }, 5 * 60 * 1000);
}

function closeCaregiverInfo() {
    document.getElementById('caregiverInfoPanel').classList.remove('active');
    document.getElementById('homeBtn').classList.remove('visible');
    if (infoAutoCloseTimer) {
        clearTimeout(infoAutoCloseTimer);
        infoAutoCloseTimer = null;
    }
}

function renderCaregiverInfo() {
    const content = document.getElementById('infoContent');
    let html = '';
    
    // Care Team Section (NEW - appears first)
    html += '<div class="info-section">';
    html += '<div class="info-section-title">👥 Care Team</div>';
    
    // Primary Caregiver
    html += '<div class="info-item">';
    html += '<div class="info-item-label">Primary Caregiver</div>';
    html += '<div class="info-item-value">' + settings.primaryCaregiver.name;
    if (settings.primaryCaregiver.relationship) {
        html += ' <span style="color: #6b7280;">(' + settings.primaryCaregiver.relationship + ')</span>';
    }
    html += '</div>';
    if (settings.primaryCaregiver.phone) {
        html += '<div class="info-item-value"><a href="tel:' + settings.primaryCaregiver.phone + '">' + settings.primaryCaregiver.phone + '</a></div>';
    }
    html += '</div>';
    
    // Additional Caregivers
    if (settings.additionalCaregivers && settings.additionalCaregivers.length > 0) {
        settings.additionalCaregivers.forEach(caregiver => {
            html += '<div class="info-item">';
            html += '<div class="info-item-label">Additional Caregiver</div>';
            html += '<div class="info-item-value">' + caregiver.name;
            if (caregiver.relationship) {
                html += ' <span style="color: #6b7280;">(' + caregiver.relationship + ')</span>';
            }
            html += '</div>';
            if (caregiver.phone) {
                html += '<div class="info-item-value"><a href="tel:' + caregiver.phone + '">' + caregiver.phone + '</a></div>';
            }
            html += '</div>';
        });
    }
    
    html += '</div>';
    
    // Emergency Contacts Section
    html += '<div class="info-section">';
    html += '<div class="info-section-title">🚨 Emergency Contacts</div>';
    
    if (settings.caregiverInfo.emergencyContacts.contact1.name || settings.caregiverInfo.emergencyContacts.contact1.phone) {
        html += '<div class="info-item">';
        html += '<div class="info-item-label">Primary Emergency Contact</div>';
        html += '<div class="info-item-value">' + (settings.caregiverInfo.emergencyContacts.contact1.name || 'Not set') + '</div>';
        if (settings.caregiverInfo.emergencyContacts.contact1.phone) {
            html += '<div class="info-item-value"><a href="tel:' + settings.caregiverInfo.emergencyContacts.contact1.phone + '">' + settings.caregiverInfo.emergencyContacts.contact1.phone + '</a></div>';
        }
        if (settings.caregiverInfo.emergencyContacts.contact1.note) {
            html += '<div class="info-item-value" style="font-size: 1rem; color: #6b7280; margin-top: 0.5rem;">' + settings.caregiverInfo.emergencyContacts.contact1.note.replace(/\n/g, '<br>') + '</div>';
        }
        html += '</div>';
    }
    
    if (settings.caregiverInfo.emergencyContacts.contact2.name || settings.caregiverInfo.emergencyContacts.contact2.phone) {
        html += '<div class="info-item">';
        html += '<div class="info-item-label">Secondary Emergency Contact</div>';
        html += '<div class="info-item-value">' + (settings.caregiverInfo.emergencyContacts.contact2.name || 'Not set') + '</div>';
        if (settings.caregiverInfo.emergencyContacts.contact2.phone) {
            html += '<div class="info-item-value"><a href="tel:' + settings.caregiverInfo.emergencyContacts.contact2.phone + '">' + settings.caregiverInfo.emergencyContacts.contact2.phone + '</a></div>';
        }
        if (settings.caregiverInfo.emergencyContacts.contact2.note) {
            html += '<div class="info-item-value" style="font-size: 1rem; color: #6b7280; margin-top: 0.5rem;">' + settings.caregiverInfo.emergencyContacts.contact2.note.replace(/\n/g, '<br>') + '</div>';
        }
        html += '</div>';
    }
    
    if (!settings.caregiverInfo.emergencyContacts.contact1.name && !settings.caregiverInfo.emergencyContacts.contact2.name) {
        html += '<div class="info-empty">No emergency contacts set. Add them in Settings.</div>';
    }
    
    html += '</div>';
    
    // Medical Team Section
    html += '<div class="info-section">';
    html += '<div class="info-section-title">👨‍⚕️ Medical Team</div>';
    
    if (settings.caregiverInfo.medicalTeam.primaryPhysician.name || settings.caregiverInfo.medicalTeam.primaryPhysician.phone) {
        html += '<div class="info-item">';
        html += '<div class="info-item-label">Primary Physician</div>';
        html += '<div class="info-item-value">' + (settings.caregiverInfo.medicalTeam.primaryPhysician.name || 'Not set') + '</div>';
        if (settings.caregiverInfo.medicalTeam.primaryPhysician.phone) {
            html += '<div class="info-item-value"><a href="tel:' + settings.caregiverInfo.medicalTeam.primaryPhysician.phone + '">' + settings.caregiverInfo.medicalTeam.primaryPhysician.phone + '</a></div>';
        }
        if (settings.caregiverInfo.medicalTeam.primaryPhysician.note) {
            html += '<div class="info-item-value" style="font-size: 1rem; color: #6b7280; margin-top: 0.5rem;">' + settings.caregiverInfo.medicalTeam.primaryPhysician.note.replace(/\n/g, '<br>') + '</div>';
        }
        html += '</div>';
    }
    
    if (settings.caregiverInfo.medicalTeam.preferredHospital) {
        html += '<div class="info-item">';
        html += '<div class="info-item-label">Preferred Hospital</div>';
        html += '<div class="info-item-value">' + settings.caregiverInfo.medicalTeam.preferredHospital.replace(/\n/g, '<br>') + '</div>';
        html += '</div>';
    }
    
    if (!settings.caregiverInfo.medicalTeam.primaryPhysician.name && !settings.caregiverInfo.medicalTeam.preferredHospital) {
        html += '<div class="info-empty">No medical team info set. Add in Settings.</div>';
    }
    
    html += '</div>';
    
    // Legal & Directives Section
    html += '<div class="info-section">';
    html += '<div class="info-section-title">⚖️ Legal & Directives</div>';
    
    if (settings.caregiverInfo.legal.poa.name || settings.caregiverInfo.legal.poa.phone) {
        html += '<div class="info-item">';
        html += '<div class="info-item-label">Power of Attorney</div>';
        html += '<div class="info-item-value">' + (settings.caregiverInfo.legal.poa.name || 'Not set') + '</div>';
        if (settings.caregiverInfo.legal.poa.phone) {
            html += '<div class="info-item-value"><a href="tel:' + settings.caregiverInfo.legal.poa.phone + '">' + settings.caregiverInfo.legal.poa.phone + '</a></div>';
        }
        if (settings.caregiverInfo.legal.poa.note) {
            html += '<div class="info-item-value" style="font-size: 1rem; color: #6b7280; margin-top: 0.5rem;">' + settings.caregiverInfo.legal.poa.note.replace(/\n/g, '<br>') + '</div>';
        }
        html += '</div>';
    }
    
    if (settings.caregiverInfo.legal.dnrStatus) {
        html += '<div class="info-item">';
        html += '<div class="info-item-label">DNR Status</div>';
        html += '<div class="info-item-value">' + settings.caregiverInfo.legal.dnrStatus + '</div>';
        html += '</div>';
    }
    
    if (!settings.caregiverInfo.legal.poa.name && !settings.caregiverInfo.legal.dnrStatus) {
        html += '<div class="info-empty">No legal information set. Add in Settings.</div>';
    }
    
    html += '</div>';
    
    // Medical Information Section
    html += '<div class="info-section">';
    html += '<div class="info-section-title">🏥 Medical Information</div>';
    
    if (settings.caregiverInfo.medical.allergies) {
        html += '<div class="info-item">';
        html += '<div class="info-item-label">Known Allergies</div>';
        html += '<div class="info-item-value">' + settings.caregiverInfo.medical.allergies.replace(/\n/g, '<br>') + '</div>';
        html += '</div>';
    }
    
    if (settings.caregiverInfo.medical.conditions) {
        html += '<div class="info-item">';
        html += '<div class="info-item-label">Medical Conditions</div>';
        html += '<div class="info-item-value">' + settings.caregiverInfo.medical.conditions.replace(/\n/g, '<br>') + '</div>';
        html += '</div>';
    }
    
    if (!settings.caregiverInfo.medical.allergies && !settings.caregiverInfo.medical.conditions) {
        html += '<div class="info-empty">No medical information set. Add in Settings.</div>';
    }
    
    html += '</div>';
    
    // Medication Schedule Section
    if (settings.medications && settings.medications.length > 0) {
        html += '<div class="info-section">';
        html += '<div class="info-section-title">💊 Medication Schedule</div>';
        
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTimeInMinutes = currentHours * 60 + currentMinutes;
        
        settings.medications.forEach((med, index) => {
            const [medHours, medMinutes] = med.time.split(':').map(Number);
            const medTimeInMinutes = medHours * 60 + medMinutes;
            const isPM = medHours >= 12;
            const displayHours = medHours % 12 || 12;
            const displayTime = `${displayHours}:${String(medMinutes).padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
            
            // Check if this is a current reminder window
            const startWindow = medTimeInMinutes - 30;
            const endWindow = medTimeInMinutes + 30;
            const isActive = currentTimeInMinutes >= startWindow && currentTimeInMinutes <= endWindow;
            
            html += '<div class="info-item med-expandable" data-med-index="' + index + '">';
            html += '<div class="med-main-info">';
            html += '<div class="info-item-label">' + displayTime;
            if (isActive) {
                html += ' <span style="color: #f59e0b; font-weight: bold;">⬅ DUE NOW</span>';
            }
            html += '</div>';
            html += '<div class="info-item-value">';
            if (med.name) {
                html += med.name;
                if (med.dosage) {
                    html += ' <span style="color: #6b7280;">(' + med.dosage + ')</span>';
                }
            } else {
                html += 'Medication';
            }
            html += '</div>';
            
            // Show expand button if there are extra details
            if (med.purpose || med.doctor || med.pharmacy || med.notes) {
                html += '<div style="margin-top: 0.5rem;">';
                html += '<button class="btn-expand" style="font-size: 0.875rem; color: #2563eb; background: none; border: none; padding: 0; cursor: pointer; text-decoration: underline;">▼ More details</button>';
                html += '</div>';
            }
            html += '</div>';
            
            // Expandable details section
            if (med.purpose || med.doctor || med.pharmacy || med.notes) {
                html += '<div class="med-details" style="display: none; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #e5e7eb;">';
                
                if (med.purpose) {
                    html += '<div style="margin-bottom: 0.5rem;">';
                    html += '<span style="font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase;">Purpose:</span> ';
                    html += '<span style="font-size: 1rem; color: #1a1a1a;">' + med.purpose + '</span>';
                    html += '</div>';
                }
                
                if (med.doctor) {
                    html += '<div style="margin-bottom: 0.5rem;">';
                    html += '<span style="font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase;">Doctor:</span> ';
                    html += '<span style="font-size: 1rem; color: #1a1a1a;">' + med.doctor + '</span>';
                    html += '</div>';
                }
                
                if (med.pharmacy) {
                    html += '<div style="margin-bottom: 0.5rem;">';
                    html += '<span style="font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase;">Pharmacy:</span> ';
                    html += '<span style="font-size: 1rem; color: #1a1a1a;">' + med.pharmacy + '</span>';
                    html += '</div>';
                }
                
                if (med.notes) {
                    html += '<div>';
                    html += '<span style="font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase;">Notes:</span> ';
                    html += '<span style="font-size: 1rem; color: #1a1a1a;">' + med.notes + '</span>';
                    html += '</div>';
                }
                
                html += '<div style="margin-top: 0.5rem;">';
                html += '<button class="btn-collapse" style="font-size: 0.875rem; color: #2563eb; background: none; border: none; padding: 0; cursor: pointer; text-decoration: underline;">▲ Less details</button>';
                html += '</div>';
                html += '</div>';
            }
            
            html += '</div>';
        });
        
        html += '</div>';
    }
    
    content.innerHTML = html;
    
    // Add expand/collapse functionality
    document.querySelectorAll('.btn-expand').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const medItem = e.target.closest('.med-expandable');
            const details = medItem.querySelector('.med-details');
            details.style.display = 'block';
            e.target.style.display = 'none';
        });
    });
    
    document.querySelectorAll('.btn-collapse').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const medItem = e.target.closest('.med-expandable');
            const details = medItem.querySelector('.med-details');
            const expandBtn = medItem.querySelector('.btn-expand');
            details.style.display = 'none';
            expandBtn.style.display = 'inline';
        });
    });
}

function initializeInfoPanelHandlers() {
    const INFO_BTN = document.getElementById('infoBtn');
    const HOME_BTN = document.getElementById('homeBtn');
    
    // Single click for info button (no delay)
    INFO_BTN.addEventListener('click', () => {
        openCaregiverInfo();
    });
    
    // Home button - closes all panels
    HOME_BTN.addEventListener('click', () => {
        document.getElementById('caregiverInfoPanel').classList.remove('active');
        document.getElementById('flashcardsPanel').classList.remove('active');
        document.getElementById('settingsPanel').classList.remove('active');
        HOME_BTN.classList.remove('visible');
        
        if (infoAutoCloseTimer) {
            clearTimeout(infoAutoCloseTimer);
            infoAutoCloseTimer = null;
        }
        
        // Stop flashcard rotation if active
        if (typeof stopFlashcardRotation === 'function') {
            stopFlashcardRotation();
        }
    });
}
