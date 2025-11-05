// ============================================================================
// DEMENTIA CLOCK - SETTINGS UI MODULE (SPECIAL EVENTS SECTION)
// ============================================================================
// Table-based interface for managing special events with inline editing

function renderSpecialEventsTab() {
    const eventsPanel = document.getElementById('events');
    
    eventsPanel.innerHTML = `
        <h2>Special Events</h2>
        <p style="margin-bottom: 1.5rem; color: #666;">
            Manage birthdays, holidays, and special occasions. Events automatically display on the clock when their date matches today.
        </p>
        
        <div class="special-events-subtabs">
            <button class="subtab active" data-subtab="birthdays">Birthdays</button>
            <button class="subtab" data-subtab="annualHolidays">Annual Holidays</button>
            <button class="subtab" data-subtab="floatingHolidays">Floating Holidays</button>
            <button class="subtab" data-subtab="specialOccasions">Special Occasions</button>
        </div>
        
        <div class="subtab-content active" id="birthdays-content">
            <h3 style="margin: 1.5rem 0 1rem 0;">Birthdays</h3>
            <p style="color: #666; margin-bottom: 1rem; font-size: 0.9rem;">
                Birth year enables age display: "Sarah's Birthday (turns 42)"
            </p>
            <table class="events-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date (MM/DD)</th>
                        <th>Birth Year</th>
                        <th style="width: 50px;"></th>
                    </tr>
                </thead>
                <tbody id="birthdaysTableBody"></tbody>
            </table>
            <button class="btn btn-primary" id="addBirthdayBtn" style="margin-top: 1rem;">+ Add Birthday</button>
        </div>
        
        <div class="subtab-content" id="annualHolidays-content">
            <h3 style="margin: 1.5rem 0 1rem 0;">Annual Holidays</h3>
            <p style="color: #666; margin-bottom: 1rem; font-size: 0.9rem;">
                Fixed holidays that repeat every year (Christmas, New Year's, etc.)
            </p>
            <table class="events-table">
                <thead>
                    <tr>
                        <th>Holiday</th>
                        <th>Date (MM/DD)</th>
                        <th style="width: 50px;"></th>
                    </tr>
                </thead>
                <tbody id="annualHolidaysTableBody"></tbody>
            </table>
            <button class="btn btn-primary" id="addAnnualHolidayBtn" style="margin-top: 1rem;">+ Add Annual Holiday</button>
        </div>
        
        <div class="subtab-content" id="floatingHolidays-content">
            <h3 style="margin: 1.5rem 0 1rem 0;">Floating Holidays</h3>
            <p style="color: #666; margin-bottom: 1rem; font-size: 0.9rem;">
                Holidays that change dates each year (Thanksgiving, Easter, Memorial Day, etc.). You'll need to update these annually.
            </p>
            <table class="events-table">
                <thead>
                    <tr>
                        <th>Holiday</th>
                        <th>Date (MM/DD/YYYY)</th>
                        <th style="width: 50px;"></th>
                    </tr>
                </thead>
                <tbody id="floatingHolidaysTableBody"></tbody>
            </table>
            <button class="btn btn-primary" id="addFloatingHolidayBtn" style="margin-top: 1rem;">+ Add Floating Holiday</button>
        </div>
        
        <div class="subtab-content" id="specialOccasions-content">
            <h3 style="margin: 1.5rem 0 1rem 0;">Special Occasions</h3>
            <p style="color: #666; margin-bottom: 1rem; font-size: 0.9rem;">
                Anniversaries and other special dates. Year enables milestone display: "50th Anniversary"
            </p>
            <table class="events-table">
                <thead>
                    <tr>
                        <th>Occasion</th>
                        <th>Date (MM/DD)</th>
                        <th>Year</th>
                        <th style="width: 50px;"></th>
                    </tr>
                </thead>
                <tbody id="specialOccasionsTableBody"></tbody>
            </table>
            <button class="btn btn-primary" id="addSpecialOccasionBtn" style="margin-top: 1rem;">+ Add Special Occasion</button>
        </div>
    `;
    
    // Initialize tables
    renderBirthdaysTable();
    renderAnnualHolidaysTable();
    renderFloatingHolidaysTable();
    renderSpecialOccasionsTable();
    
    // Subtab switching
    document.querySelectorAll('.special-events-subtabs .subtab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update button states
            document.querySelectorAll('.special-events-subtabs .subtab').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update content visibility
            document.querySelectorAll('.subtab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(e.target.dataset.subtab + '-content').classList.add('active');
        });
    });
    
    // Add button handlers
    document.getElementById('addBirthdayBtn').addEventListener('click', () => addEvent('birthdays'));
    document.getElementById('addAnnualHolidayBtn').addEventListener('click', () => addEvent('annualHolidays'));
    document.getElementById('addFloatingHolidayBtn').addEventListener('click', () => addEvent('floatingHolidays'));
    document.getElementById('addSpecialOccasionBtn').addEventListener('click', () => addEvent('specialOccasions'));
}

function renderBirthdaysTable() {
    const tbody = document.getElementById('birthdaysTableBody');
    tbody.innerHTML = '';
    
    if (!settings.specialEvents.birthdays || settings.specialEvents.birthdays.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999; padding: 2rem;">No birthdays added yet</td></tr>';
        return;
    }
    
    // Sort by date
    const sorted = [...settings.specialEvents.birthdays].sort((a, b) => {
        if (a.month !== b.month) return a.month - b.month;
        return a.day - b.day;
    });
    
    sorted.forEach((birthday, index) => {
        const row = document.createElement('tr');
        row.dataset.index = index;
        row.dataset.type = 'birthdays';
        
        const dateStr = String(birthday.month).padStart(2, '0') + '/' + String(birthday.day).padStart(2, '0');
        
        row.innerHTML = `
            <td class="name-cell">${birthday.name}</td>
            <td class="date-cell">${dateStr}</td>
            <td class="year-cell">${birthday.year || ''}</td>
            <td class="actions-cell">
                <button class="btn-edit" title="Edit">✏️</button>
                <button class="btn-delete" title="Delete">×</button>
            </td>
        `;
        
        // Show note if exists
        if (birthday.note) {
            const noteRow = document.createElement('tr');
            noteRow.className = 'note-row';
            noteRow.innerHTML = `
                <td colspan="4" style="background: #f9fafb; padding: 0.5rem 1rem; font-size: 0.9rem; color: #666;">
                    Note: ${birthday.note}
                </td>
            `;
            tbody.appendChild(row);
            tbody.appendChild(noteRow);
        } else {
            tbody.appendChild(row);
        }
    });
    
    attachTableEventListeners('birthdaysTableBody');
}

function renderAnnualHolidaysTable() {
    const tbody = document.getElementById('annualHolidaysTableBody');
    tbody.innerHTML = '';
    
    if (!settings.specialEvents.annualHolidays || settings.specialEvents.annualHolidays.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #999; padding: 2rem;">No annual holidays added yet</td></tr>';
        return;
    }
    
    const sorted = [...settings.specialEvents.annualHolidays].sort((a, b) => {
        if (a.month !== b.month) return a.month - b.month;
        return a.day - b.day;
    });
    
    sorted.forEach((holiday, index) => {
        const row = document.createElement('tr');
        row.dataset.index = index;
        row.dataset.type = 'annualHolidays';
        
        const dateStr = String(holiday.month).padStart(2, '0') + '/' + String(holiday.day).padStart(2, '0');
        
        row.innerHTML = `
            <td class="name-cell">${holiday.name}</td>
            <td class="date-cell">${dateStr}</td>
            <td class="actions-cell">
                <button class="btn-edit" title="Edit">✏️</button>
                <button class="btn-delete" title="Delete">×</button>
            </td>
        `;
        
        if (holiday.note) {
            const noteRow = document.createElement('tr');
            noteRow.className = 'note-row';
            noteRow.innerHTML = `
                <td colspan="3" style="background: #f9fafb; padding: 0.5rem 1rem; font-size: 0.9rem; color: #666;">
                    Note: ${holiday.note}
                </td>
            `;
            tbody.appendChild(row);
            tbody.appendChild(noteRow);
        } else {
            tbody.appendChild(row);
        }
    });
    
    attachTableEventListeners('annualHolidaysTableBody');
}

function renderFloatingHolidaysTable() {
    const tbody = document.getElementById('floatingHolidaysTableBody');
    tbody.innerHTML = '';
    
    if (!settings.specialEvents.floatingHolidays || settings.specialEvents.floatingHolidays.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #999; padding: 2rem;">No floating holidays added yet</td></tr>';
        return;
    }
    
    const sorted = [...settings.specialEvents.floatingHolidays].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        if (a.month !== b.month) return a.month - b.month;
        return a.day - b.day;
    });
    
    sorted.forEach((holiday, index) => {
        const row = document.createElement('tr');
        row.dataset.index = index;
        row.dataset.type = 'floatingHolidays';
        
        const dateStr = String(holiday.month).padStart(2, '0') + '/' + 
                       String(holiday.day).padStart(2, '0') + '/' + 
                       holiday.year;
        
        row.innerHTML = `
            <td class="name-cell">${holiday.name}</td>
            <td class="date-cell">${dateStr}</td>
            <td class="actions-cell">
                <button class="btn-edit" title="Edit">✏️</button>
                <button class="btn-delete" title="Delete">×</button>
            </td>
        `;
        
        if (holiday.note) {
            const noteRow = document.createElement('tr');
            noteRow.className = 'note-row';
            noteRow.innerHTML = `
                <td colspan="3" style="background: #f9fafb; padding: 0.5rem 1rem; font-size: 0.9rem; color: #666;">
                    Note: ${holiday.note}
                </td>
            `;
            tbody.appendChild(row);
            tbody.appendChild(noteRow);
        } else {
            tbody.appendChild(row);
        }
    });
    
    attachTableEventListeners('floatingHolidaysTableBody');
}

function renderSpecialOccasionsTable() {
    const tbody = document.getElementById('specialOccasionsTableBody');
    tbody.innerHTML = '';
    
    if (!settings.specialEvents.specialOccasions || settings.specialEvents.specialOccasions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999; padding: 2rem;">No special occasions added yet</td></tr>';
        return;
    }
    
    const sorted = [...settings.specialEvents.specialOccasions].sort((a, b) => {
        if (a.month !== b.month) return a.month - b.month;
        return a.day - b.day;
    });
    
    sorted.forEach((occasion, index) => {
        const row = document.createElement('tr');
        row.dataset.index = index;
        row.dataset.type = 'specialOccasions';
        
        const dateStr = String(occasion.month).padStart(2, '0') + '/' + String(occasion.day).padStart(2, '0');
        
        row.innerHTML = `
            <td class="name-cell">${occasion.name}</td>
            <td class="date-cell">${dateStr}</td>
            <td class="year-cell">${occasion.year || ''}</td>
            <td class="actions-cell">
                <button class="btn-edit" title="Edit">✏️</button>
                <button class="btn-delete" title="Delete">×</button>
            </td>
        `;
        
        if (occasion.note) {
            const noteRow = document.createElement('tr');
            noteRow.className = 'note-row';
            noteRow.innerHTML = `
                <td colspan="4" style="background: #f9fafb; padding: 0.5rem 1rem; font-size: 0.9rem; color: #666;">
                    Note: ${occasion.note}
                </td>
            `;
            tbody.appendChild(row);
            tbody.appendChild(noteRow);
        } else {
            tbody.appendChild(row);
        }
    });
    
    attachTableEventListeners('specialOccasionsTableBody');
}

function attachTableEventListeners(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    
    tbody.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            enableRowEdit(row);
        });
    });
    
    tbody.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            deleteEvent(row);
        });
    });
}

function addEvent(type) {
    const tbody = document.getElementById(type + 'TableBody');
    
    // Remove empty message if exists
    const emptyMsg = tbody.querySelector('td[colspan]');
    if (emptyMsg) {
        tbody.innerHTML = '';
    }
    
    const row = document.createElement('tr');
    row.dataset.type = type;
    row.dataset.new = 'true';
    row.classList.add('editing');
    
    if (type === 'birthdays') {
        row.innerHTML = `
            <td><input type="text" class="form-input edit-name" placeholder="Name" style="margin: 0;"></td>
            <td><input type="text" class="form-input edit-date" placeholder="MM/DD" style="margin: 0;"></td>
            <td><input type="number" class="form-input edit-year" placeholder="YYYY" min="1900" max="2100" style="margin: 0;"></td>
            <td class="actions-cell">
                <button class="btn-save btn btn-primary">✓</button>
                <button class="btn-cancel btn btn-secondary">✕</button>
            </td>
        `;
    } else if (type === 'annualHolidays') {
        row.innerHTML = `
            <td><input type="text" class="form-input edit-name" placeholder="Holiday name" style="margin: 0;"></td>
            <td><input type="text" class="form-input edit-date" placeholder="MM/DD" style="margin: 0;"></td>
            <td class="actions-cell">
                <button class="btn-save btn btn-primary">✓</button>
                <button class="btn-cancel btn btn-secondary">✕</button>
            </td>
        `;
    } else if (type === 'floatingHolidays') {
        row.innerHTML = `
            <td><input type="text" class="form-input edit-name" placeholder="Holiday name" style="margin: 0;"></td>
            <td><input type="text" class="form-input edit-date" placeholder="MM/DD/YYYY" style="margin: 0;"></td>
            <td class="actions-cell">
                <button class="btn-save btn btn-primary">✓</button>
                <button class="btn-cancel btn btn-secondary">✕</button>
            </td>
        `;
    } else if (type === 'specialOccasions') {
        row.innerHTML = `
            <td><input type="text" class="form-input edit-name" placeholder="Occasion name" style="margin: 0;"></td>
            <td><input type="text" class="form-input edit-date" placeholder="MM/DD" style="margin: 0;"></td>
            <td><input type="number" class="form-input edit-year" placeholder="YYYY" min="1900" max="2100" style="margin: 0;"></td>
            <td class="actions-cell">
                <button class="btn-save btn btn-primary">✓</button>
                <button class="btn-cancel btn btn-secondary">✕</button>
            </td>
        `;
    }
    
    tbody.appendChild(row);
    
    // Focus first input
    row.querySelector('.edit-name').focus();
    
    // Attach save/cancel handlers
    row.querySelector('.btn-save').addEventListener('click', () => saveRowEdit(row));
    row.querySelector('.btn-cancel').addEventListener('click', () => {
        if (row.dataset.new) {
            row.remove();
            // Re-render to show empty message if needed
            if (type === 'birthdays') renderBirthdaysTable();
            else if (type === 'annualHolidays') renderAnnualHolidaysTable();
            else if (type === 'floatingHolidays') renderFloatingHolidaysTable();
            else if (type === 'specialOccasions') renderSpecialOccasionsTable();
        } else {
            // Re-render to restore original
            if (type === 'birthdays') renderBirthdaysTable();
            else if (type === 'annualHolidays') renderAnnualHolidaysTable();
            else if (type === 'floatingHolidays') renderFloatingHolidaysTable();
            else if (type === 'specialOccasions') renderSpecialOccasionsTable();
        }
    });
    
    // Enter key saves
    row.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveRowEdit(row);
            }
        });
    });
}

function enableRowEdit(row) {
    const type = row.dataset.type;
    const index = parseInt(row.dataset.index);
    const data = settings.specialEvents[type][index];
    
    row.classList.add('editing');
    const dateStr = String(data.month).padStart(2, '0') + '/' + String(data.day).padStart(2, '0');
    
    if (type === 'birthdays') {
        row.innerHTML = `
            <td><input type="text" class="form-input edit-name" value="${data.name}" style="margin: 0;"></td>
            <td><input type="text" class="form-input edit-date" value="${dateStr}" style="margin: 0;"></td>
            <td><input type="number" class="form-input edit-year" value="${data.year || ''}" placeholder="YYYY" min="1900" max="2100" style="margin: 0;"></td>
            <td class="actions-cell">
                <button class="btn-save btn btn-primary">✓</button>
                <button class="btn-cancel btn btn-secondary">✕</button>
            </td>
        `;
    } else if (type === 'annualHolidays') {
        row.innerHTML = `
            <td><input type="text" class="form-input edit-name" value="${data.name}" style="margin: 0;"></td>
            <td><input type="text" class="form-input edit-date" value="${dateStr}" style="margin: 0;"></td>
            <td class="actions-cell">
                <button class="btn-save btn btn-primary">✓</button>
                <button class="btn-cancel btn btn-secondary">✕</button>
            </td>
        `;
    } else if (type === 'floatingHolidays') {
        const fullDate = dateStr + '/' + data.year;
        row.innerHTML = `
            <td><input type="text" class="form-input edit-name" value="${data.name}" style="margin: 0;"></td>
            <td><input type="text" class="form-input edit-date" value="${fullDate}" style="margin: 0;"></td>
            <td class="actions-cell">
                <button class="btn-save btn btn-primary">✓</button>
                <button class="btn-cancel btn btn-secondary">✕</button>
            </td>
        `;
    } else if (type === 'specialOccasions') {
        row.innerHTML = `
            <td><input type="text" class="form-input edit-name" value="${data.name}" style="margin: 0;"></td>
            <td><input type="text" class="form-input edit-date" value="${dateStr}" style="margin: 0;"></td>
            <td><input type="number" class="form-input edit-year" value="${data.year || ''}" placeholder="YYYY" min="1900" max="2100" style="margin: 0;"></td>
            <td class="actions-cell">
                <button class="btn-save btn btn-primary">✓</button>
                <button class="btn-cancel btn btn-secondary">✕</button>
            </td>
        `;
    }
    
    row.querySelector('.edit-name').focus();
    
    row.querySelector('.btn-save').addEventListener('click', () => saveRowEdit(row));
    row.querySelector('.btn-cancel').addEventListener('click', () => {
        if (type === 'birthdays') renderBirthdaysTable();
        else if (type === 'annualHolidays') renderAnnualHolidaysTable();
        else if (type === 'floatingHolidays') renderFloatingHolidaysTable();
        else if (type === 'specialOccasions') renderSpecialOccasionsTable();
    });
    
    row.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveRowEdit(row);
            }
        });
    });
}

function saveRowEdit(row) {
    const type = row.dataset.type;
    const name = row.querySelector('.edit-name').value.trim();
    const dateStr = row.querySelector('.edit-date').value.trim();
    const yearInput = row.querySelector('.edit-year');
    const year = yearInput ? yearInput.value.trim() : null;
    
    // Validate name
    if (!name) {
        alert('Please enter a name');
        row.querySelector('.edit-name').focus();
        return;
    }
    
    // Validate and parse date
    let month, day, fullYear;
    
    if (type === 'floatingHolidays') {
        // Must have MM/DD/YYYY format
        const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (!match) {
            alert('Date must be MM/DD/YYYY format');
            row.querySelector('.edit-date').focus();
            return;
        }
        month = parseInt(match[1]);
        day = parseInt(match[2]);
        fullYear = parseInt(match[3]);
    } else {
        // MM/DD format
        const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})$/);
        if (!match) {
            alert('Date must be MM/DD format');
            row.querySelector('.edit-date').focus();
            return;
        }
        month = parseInt(match[1]);
        day = parseInt(match[2]);
        fullYear = year ? parseInt(year) : null;
    }
    
    // Validate month and day
    if (month < 1 || month > 12) {
        alert('Month must be between 1 and 12');
        row.querySelector('.edit-date').focus();
        return;
    }
    if (day < 1 || day > 31) {
        alert('Day must be between 1 and 31');
        row.querySelector('.edit-date').focus();
        return;
    }
    
    // Create event object
    const event = { name, month, day };
    if (fullYear) {
        event.year = fullYear;
    }
    event.note = '';  // Can add note field later
    
    // Save or update
    if (row.dataset.new) {
        // Add new event
        if (!settings.specialEvents[type]) {
            settings.specialEvents[type] = [];
        }
        settings.specialEvents[type].push(event);
    } else {
        // Update existing
        const index = parseInt(row.dataset.index);
        settings.specialEvents[type][index] = event;
    }
    
    // Re-render table
    if (type === 'birthdays') renderBirthdaysTable();
    else if (type === 'annualHolidays') renderAnnualHolidaysTable();
    else if (type === 'floatingHolidays') renderFloatingHolidaysTable();
    else if (type === 'specialOccasions') renderSpecialOccasionsTable();
}

function deleteEvent(row) {
    const type = row.dataset.type;
    const index = parseInt(row.dataset.index);
    const event = settings.specialEvents[type][index];
    
    if (confirm(`Delete "${event.name}"? This cannot be undone.`)) {
        settings.specialEvents[type].splice(index, 1);
        
        // Re-render
        if (type === 'birthdays') renderBirthdaysTable();
        else if (type === 'annualHolidays') renderAnnualHolidaysTable();
        else if (type === 'floatingHolidays') renderFloatingHolidaysTable();
        else if (type === 'specialOccasions') renderSpecialOccasionsTable();
    }
}

// Export functions for use in main settings-ui.js
if (typeof window !== 'undefined') {
    window.renderSpecialEventsTab = renderSpecialEventsTab;
}
