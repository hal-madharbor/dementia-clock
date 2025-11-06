// ============================================================================
// DEMENTIA CLOCK - SPECIAL EVENTS MODULE
// ============================================================================
// Handles special events (birthdays, anniversaries) display and management

function getTodayEvent() {
    if (!settings.specialEvents || settings.specialEvents.length === 0) {
        return null;
    }
    
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${month}-${day}`;
    
    // Find first event matching today's date
    const todayEvent = settings.specialEvents.find(event => event.date === todayStr);
    
    return todayEvent || null;
}

function getEventDisplayText(event) {
    if (!event) return null;
    
    // Format: One emoji at start, then just the event name
    const emoji = event.type === 'birthday' ? '🎂' : 
                  event.type === 'anniversary' ? '💕' : '🎉';
    
    return `${emoji} ${event.name}`;
}

function renderSpecialEventsList() {
    const container = document.getElementById('specialEventsList');
    container.innerHTML = '';
    
    if (!settings.specialEvents || settings.specialEvents.length === 0) {
        container.innerHTML = '<p style="color: #666; padding: 1rem;">No special events added yet.</p>';
        return;
    }
    
    // Sort events by date (month-day)
    const sortedEvents = [...settings.specialEvents].sort((a, b) => {
        const [aMonth, aDay] = a.date.split('-').map(Number);
        const [bMonth, bDay] = b.date.split('-').map(Number);
        if (aMonth !== bMonth) return aMonth - bMonth;
        return aDay - bDay;
    });
    
    sortedEvents.forEach((event, index) => {
        const div = document.createElement('div');
        div.className = 'event-item';
        div.style.cssText = 'display: block; padding: 1.5rem; margin-bottom: 1rem; background: #f9fafb; border-radius: 0.5rem; border: 1px solid #e5e7eb;';
        
        const [month, day] = event.date.split('-');
        const dateObj = new Date(2000, parseInt(month) - 1, parseInt(day));
        const monthName = dateObj.toLocaleString('default', { month: 'long' });
        const displayDate = `${monthName} ${parseInt(day)}`;
        
        div.innerHTML = `
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 1rem; align-items: center;">
                <div>
                    <label class="form-label" style="margin-bottom: 0.25rem;">Event Name</label>
                    <input type="text" class="form-input event-name-input" data-index="${index}" value="${event.name}" placeholder="e.g., Ilona's Birthday">
                </div>
                <div>
                    <label class="form-label" style="margin-bottom: 0.25rem;">Date</label>
                    <div style="font-size: 1rem; color: #1a1a1a; padding: 0.75rem;">${displayDate}</div>
                </div>
                <div>
                    <label class="form-label" style="margin-bottom: 0.25rem;">Type</label>
                    <select class="form-input event-type-input" data-index="${index}">
                        <option value="birthday" ${event.type === 'birthday' ? 'selected' : ''}>Birthday</option>
                        <option value="anniversary" ${event.type === 'anniversary' ? 'selected' : ''}>Anniversary</option>
                        <option value="other" ${event.type === 'other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                <div style="padding-top: 1.5rem;">
                    <button class="btn btn-danger event-remove-btn" data-index="${index}">✕</button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
    
    // Add event listeners
    document.querySelectorAll('.event-name-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            const index = parseInt(e.target.dataset.index);
            settings.specialEvents[index].name = e.target.value.trim();
        });
    });
    
    document.querySelectorAll('.event-type-input').forEach(select => {
        select.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index);
            settings.specialEvents[index].type = e.target.value;
        });
    });
    
    document.querySelectorAll('.event-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (confirm('Remove this event?')) {
                settings.specialEvents.splice(index, 1);
                renderSpecialEventsList();
            }
        });
    });
}

function initializeSpecialEventsHandlers() {
    // Add event button
    document.getElementById('addEventBtn').addEventListener('click', () => {
        // Simple prompt-based add for now
        const name = prompt('Event name (e.g., "Ilona\'s Birthday"):');
        if (!name || !name.trim()) return;
        
        const dateStr = prompt('Date (MM-DD format, e.g., 01-15 for January 15):');
        if (!dateStr || !dateStr.match(/^\d{2}-\d{2}$/)) {
            alert('Please enter date in MM-DD format (e.g., 01-15)');
            return;
        }
        
        const type = prompt('Type: birthday, anniversary, or other:');
        if (!type || !['birthday', 'anniversary', 'other'].includes(type.toLowerCase())) {
            alert('Type must be: birthday, anniversary, or other');
            return;
        }
        
        if (!settings.specialEvents) {
            settings.specialEvents = [];
        }
        
        settings.specialEvents.push({
            name: name.trim(),
            date: dateStr,
            type: type.toLowerCase()
        });
        
        renderSpecialEventsList();
    });
}
